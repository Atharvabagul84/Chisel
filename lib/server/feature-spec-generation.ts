import { featureSpecSchema } from "../feature-spec";
import { featureSpecPrompt, featureSpecPromptVersion } from "./feature-spec-prompt";
import type { TokenUsage } from "./generation-cost";

export interface CompletionRequest {
  note: string;
  model: string;
  system: string;
  signal: AbortSignal;
}

export type CompleteFeatureSpec = (request: CompletionRequest) => Promise<{
  text: string;
  stopReason: string | null;
  /** Provider-reported token counts, when the provider returns them. */
  usage?: TokenUsage;
}>;

export class GenerationError extends Error {
  constructor(public readonly code: string, message: string, public readonly status: number, public readonly usage?: TokenUsage) {
    super(message);
    this.name = "GenerationError";
  }
}

interface GenerationOptions {
  model: string;
  complete: CompleteFeatureSpec;
  signal?: AbortSignal;
  timeoutMs?: number;
}

// Rejected output still used tokens; keep the count for the request log.
const outputError = (usage?: TokenUsage) => new GenerationError("invalid_output", "The model returned an incomplete specification. Your brief is preserved; please retry.", 502, usage);

const safeProviderError = (error: unknown): GenerationError => {
  if (error instanceof GenerationError) return error;
  const status = typeof error === "object" && error !== null && "status" in error ? error.status : undefined;
  if (status === 429) return new GenerationError("provider_busy", "The generation provider is busy. Please try again shortly.", 503);
  if (status === 401 || status === 403 || status === 404) {
    return new GenerationError("generation_unavailable", "Live generation is unavailable. Check the server's provider configuration.", 503);
  }
  return new GenerationError("generation_failed", "Generation failed. Your brief is preserved; please retry.", 502);
};

export const generateFeatureSpec = async (note: string, options: GenerationOptions) => {
  if (options.signal?.aborted) {
    throw new GenerationError("generation_cancelled", "Generation was cancelled.", 499);
  }
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let onAbort: (() => void) | undefined;
  const interrupted = new Promise<never>((_, reject) => {
    onAbort = () => {
      reject(new GenerationError("generation_cancelled", "Generation was cancelled.", 499));
      controller.abort();
    };
    if (options.signal?.aborted) return onAbort();
    options.signal?.addEventListener("abort", onAbort, { once: true });
    timer = setTimeout(() => {
      reject(new GenerationError("generation_timeout", "Generation timed out. Your brief is preserved; please retry.", 504));
      controller.abort();
    }, options.timeoutMs ?? 45000);
  });

  try {
    const completion = await Promise.race([
      interrupted,
      options.complete({ note, model: options.model, system: featureSpecPrompt, signal: controller.signal }),
    ]);
    const { usage } = completion;
    if (completion.stopReason !== "end_turn") throw outputError(usage);
    let raw: unknown;
    try { raw = JSON.parse(completion.text); } catch { throw outputError(usage); }
    const parsed = featureSpecSchema.safeParse(raw);
    if (!parsed.success) throw outputError(usage);
    return {
      spec: parsed.data,
      model: options.model,
      promptVersion: featureSpecPromptVersion,
      generatedAt: new Date().toISOString(),
      usage,
    };
  } catch (error) {
    throw safeProviderError(error);
  } finally {
    clearTimeout(timer);
    if (onAbort) options.signal?.removeEventListener("abort", onAbort);
  }
};
