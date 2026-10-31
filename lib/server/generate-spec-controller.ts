import { generateRequestSchema } from "../feature-spec";
import { generateFeatureSpec, GenerationError, type CompleteFeatureSpec } from "./feature-spec-generation";
import { assertSameOrigin, RequestInputError, type OriginConfig } from "./auth-request";
import { providerKeyName, type GenerationConfig } from "./generation-config";
import { LimiterUnavailableError, VISITOR_DAILY_LIMIT, visitorId, type GenerationLimiter } from "./generation-rate-limit";
import { estimateCostUsd, type TokenUsage } from "./generation-cost";
import type { LogFields, RequestLog } from "./request-log";
import { featureSpecPromptVersion } from "./feature-spec-prompt";

const MAX_REQUEST_BYTES = 64 * 1024;
const json = (body: unknown, status = 200, headers: Record<string, string> = {}) => Response.json(body, {
  status,
  headers: { "Cache-Control": "no-store", ...headers },
});

const readRequestBody = async (request: Request): Promise<unknown> => {
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    throw new GenerationError("unsupported_media_type", "Send the feature brief as JSON.", 415);
  }
  const contentLength = Number(request.headers.get("content-length"));
  if (contentLength > MAX_REQUEST_BYTES) throw new GenerationError("request_too_large", "The request body exceeds the 64 KB limit.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new GenerationError("invalid_request", "Provide a feature brief.", 400);
  let bytes = 0;
  let text = "";
  const decoder = new TextDecoder();
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > MAX_REQUEST_BYTES) {
        await reader.cancel();
        throw new GenerationError("request_too_large", "The request body exceeds the 64 KB limit.", 413);
      }
      text += decoder.decode(chunk.value, { stream: true });
    }
    text += decoder.decode();
    try { return JSON.parse(text); } catch {
      throw new GenerationError("invalid_request", "The request contains invalid JSON.", 400);
    }
  } finally { reader.releaseLock(); }
};

const resetTime = (reset: number) => new Date(reset).toISOString().slice(11, 16);

const usageFields = (model: string, usage: TokenUsage | undefined): LogFields => usage
  ? { inputTokens: usage.inputTokens, outputTokens: usage.outputTokens, estimatedCostUsd: estimateCostUsd(model, usage) }
  : {};

export const createGenerateSpecHandler = (dependencies: {
  config: GenerationConfig;
  complete: CompleteFeatureSpec;
  /** Required for production generation; null keeps the hosted demo closed. */
  limiter?: { limit: GenerationLimiter; salt: string } | null;
  origin?: OriginConfig;
}) => async (request: Request, log?: RequestLog): Promise<Response> => {
  const { config, limiter } = dependencies;
  const fail = (code: string, error: string, status: number, headers: Record<string, string> = {}) => {
    log?.set({ code });
    return json({ code, error }, status, headers);
  };
  try {
    const parsed = generateRequestSchema.safeParse(await readRequestBody(request));
    if (!parsed.success) {
      return fail("invalid_request", "Provide only a feature brief of 30 to 12,000 characters.", 400);
    }
    if (config.production && !config.hostedDemo) {
      return fail("generation_unavailable", "Live generation is disabled in production until authentication and usage limits are configured. Use the local development workspace.", 503);
    }
    if (!config.apiKey) {
      return fail("generation_unavailable", `Live generation needs a ${providerKeyName(config.provider)} in the server environment. You can still open the labeled example.`, 503);
    }
    const headers: Record<string, string> = {};
    if (config.production) {
      if (!limiter) {
        return fail("generation_unavailable", "Demo generation is unavailable until usage limits are configured. You can still write manually or open the labeled example.", 503);
      }
      assertSameOrigin(request, dependencies.origin);
      let result;
      try { result = await limiter.limit(visitorId(request, limiter.salt)); } catch (error) {
        if (error instanceof LimiterUnavailableError) {
          return fail("generation_unavailable", "Demo usage limits can't be checked right now, so generation is paused. Please try again later.", 503);
        }
        throw error;
      }
      if (!result.allowed) {
        const retryAfter = String(Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)));
        const error = result.scope === "visitor"
          ? `You've used today's ${VISITOR_DAILY_LIMIT} demo drafts. Try again after ${resetTime(result.reset)} UTC, or write the spec manually.`
          : `The demo has reached today's shared limit. Try again after ${resetTime(result.reset)} UTC, or write the spec manually.`;
        log?.set({ rateLimitScope: result.scope });
        return fail("rate_limited", error, 429, { "Retry-After": retryAfter });
      }
      headers["RateLimit-Remaining"] = String(result.remaining);
    }
    log?.set({ provider: config.provider ?? "anthropic", model: config.model, promptVersion: featureSpecPromptVersion });
    const { usage, ...generated } = await generateFeatureSpec(parsed.data.note, {
      model: config.model,
      complete: dependencies.complete,
      signal: request.signal,
    });
    log?.set(usageFields(config.model, usage));
    return json(generated, 200, headers);
  } catch (error) {
    if (error instanceof RequestInputError) return fail("invalid_origin", error.message, error.status);
    if (error instanceof GenerationError) {
      log?.set(usageFields(config.model, error.usage));
      return fail(error.code, error.message, error.status);
    }
    return fail("generation_failed", "The request could not be completed. Your brief is preserved; please retry.", 500);
  }
};
