// Runs the eval briefs against the configured live provider and prints one JSON line per case.
// Sends every brief to the provider and may cost money on a paid key. Never run in CI.
import { createAnthropicCompletion } from "../lib/server/anthropic-feature-spec";
import { generateFeatureSpec, GenerationError } from "../lib/server/feature-spec-generation";
import { estimateCostUsd } from "../lib/server/generation-cost";
import { getGenerationConfig, providerKeyName } from "../lib/server/generation-config";
import { createGroqCompletion } from "../lib/server/groq-feature-spec";
import { featureSpecEvalCases } from "./feature-spec-cases";
import { checkFeatureSpec } from "./feature-spec-eval";

const config = getGenerationConfig();
if (!config.apiKey) {
  console.error(`Set ${providerKeyName(config.provider)} in .env.local to run the live eval.`);
  process.exit(2);
}
const complete = config.provider === "groq" ? createGroqCompletion(config.apiKey) : createAnthropicCompletion(config.apiKey);

const main = async () => {
  let passed = 0;
  for (const evalCase of featureSpecEvalCases) {
    try {
      const result = await generateFeatureSpec(evalCase.brief, { model: config.model, complete });
      const failures = checkFeatureSpec(evalCase, result.spec);
      if (failures.length === 0) passed++;
      console.log(JSON.stringify({
        case: evalCase.id, passed: failures.length === 0, failures, promptVersion: result.promptVersion, model: result.model,
        inputTokens: result.usage?.inputTokens ?? null, outputTokens: result.usage?.outputTokens ?? null,
        estimatedCostUsd: result.usage ? estimateCostUsd(config.model, result.usage) : null,
      }));
    } catch (error) {
      console.log(JSON.stringify({ case: evalCase.id, passed: false, error: error instanceof GenerationError ? error.code : "unexpected_error" }));
    }
  }
  console.log(JSON.stringify({ summary: true, passed, total: featureSpecEvalCases.length, model: config.model }));
  process.exit(passed === featureSpecEvalCases.length ? 0 : 1);
};

void main();
