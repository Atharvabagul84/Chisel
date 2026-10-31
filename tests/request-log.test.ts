import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { createGenerateSpecHandler } from "../lib/server/generate-spec-controller";
import { generateFeatureSpec } from "../lib/server/feature-spec-generation";
import { featureSpecPrompt, featureSpecPromptVersion } from "../lib/server/feature-spec-prompt";
import { estimateCostUsd } from "../lib/server/generation-cost";
import { createGroqCompletion } from "../lib/server/groq-feature-spec";
import { withRequestLog, type RequestLog } from "../lib/server/request-log";
import { sampleFeatureSpec } from "./fixtures/feature-spec";

const note = "Let engineering managers assign owners to incoming tasks.";
const makeRequest = (body = JSON.stringify({ note })) => new Request("http://localhost/api/generate-prd", {
  method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.7" }, body,
});
const captured = () => {
  const lines: string[] = [];
  return { lines, sink: (line: string) => { lines.push(line); }, last: () => JSON.parse(lines.at(-1) ?? "null") };
};
const generateRoute = (complete: Parameters<typeof createGenerateSpecHandler>[0]["complete"], sink: (line: string) => void, model = "claude-sonnet-4-6") =>
  withRequestLog("generate-prd", (request, log: RequestLog) =>
    createGenerateSpecHandler({ config: { apiKey: "test-key", model, production: false }, complete })(request, log), sink);

test("the prompt text is pinned to its version: bump featureSpecPromptVersion when the prompt changes", () => {
  const sha256 = createHash("sha256").update(featureSpecPrompt).digest("hex");
  assert.deepEqual({ featureSpecPromptVersion, sha256 }, {
    featureSpecPromptVersion: "feature-spec-v1",
    sha256: "0c9a61bb8d9bab0ff14d7603152eda0fd139cbae2b4785aa014e3e47ed0a1e57",
  });
});

test("writes one JSON line per request with a request ID that matches the response header", async () => {
  const log = captured();
  const route = withRequestLog("example", async (_request, requestLog) => {
    requestLog.set({ code: "ok", requestId: "spoofed", status: 999 });
    return Response.json({ ok: true }, { status: 201 });
  }, log.sink);
  const response = await route(new Request("http://localhost/api/example", { method: "POST" }));
  assert.equal(log.lines.length, 1);
  const line = log.last();
  assert.match(line.requestId, /^[0-9a-f-]{36}$/);
  assert.equal(response.headers.get("x-request-id"), line.requestId);
  assert.equal(line.status, 201, "handler fields cannot overwrite fixed keys");
  assert.deepEqual([line.event, line.level, line.route, line.method, line.code], ["http_request", "info", "example", "POST", "ok"]);
  assert.ok(Number.isInteger(line.durationMs) && line.durationMs >= 0);
  assert.ok(Number.isFinite(Date.parse(line.time)));
});

test("logs a 500 error line and rethrows when a handler crashes", async () => {
  const log = captured();
  const route = withRequestLog("crash", async () => { throw new Error("boom"); }, log.sink);
  await assert.rejects(route(new Request("http://localhost/api/crash")), /boom/);
  assert.deepEqual([log.last().status, log.last().level], [500, "error"]);
});

test("generation logs provider, model, prompt version, tokens and cost, never the brief or IP", async () => {
  const log = captured();
  const response = await generateRoute(async () => ({
    text: JSON.stringify(sampleFeatureSpec), stopReason: "end_turn", usage: { inputTokens: 1200, outputTokens: 900 },
  }), log.sink)(makeRequest());
  assert.equal(response.status, 200);
  assert.equal((await response.json()).promptVersion, featureSpecPromptVersion);
  const line = log.last();
  assert.deepEqual(
    [line.provider, line.model, line.promptVersion, line.inputTokens, line.outputTokens, line.estimatedCostUsd],
    ["anthropic", "claude-sonnet-4-6", featureSpecPromptVersion, 1200, 900, 0.0171],
  );
  assert.ok(!log.lines[0].includes(note) && !log.lines[0].includes("203.0.113.7"));
});

test("rejected model output still records the tokens it used", async () => {
  const log = captured();
  const response = await generateRoute(async () => ({ text: "not json", stopReason: "end_turn", usage: { inputTokens: 50, outputTokens: 10 } }), log.sink)(makeRequest());
  assert.equal(response.status, 502);
  assert.deepEqual([log.last().code, log.last().level, log.last().inputTokens, log.last().outputTokens], ["invalid_output", "error", 50, 10]);
});

test("request errors log their code without calling the provider", async () => {
  const log = captured();
  const response = await generateRoute(async () => { throw new Error("unexpected"); }, log.sink)(makeRequest(JSON.stringify({ note: "short" })));
  assert.equal(response.status, 400);
  assert.deepEqual([log.last().code, log.last().level, log.last().provider], ["invalid_request", "warn", undefined]);
});

test("cost estimates use list prices and stay null for unpriced models", () => {
  assert.equal(estimateCostUsd("claude-sonnet-4-6", { inputTokens: 1_000_000, outputTokens: 1_000_000 }), 18);
  assert.equal(estimateCostUsd("openai/gpt-oss-120b", { inputTokens: 1000, outputTokens: 1000 }), null);
});

test("Groq adapter maps OpenAI-style usage onto token counts", async () => {
  const complete = createGroqCompletion("secret", async () => Response.json({
    choices: [{ message: { content: JSON.stringify(sampleFeatureSpec) }, finish_reason: "stop" }],
    usage: { prompt_tokens: 700, completion_tokens: 400, total_tokens: 1100 },
  }));
  const result = await generateFeatureSpec(note, { model: "openai/gpt-oss-120b", complete });
  assert.deepEqual(result.usage, { inputTokens: 700, outputTokens: 400 });
});
