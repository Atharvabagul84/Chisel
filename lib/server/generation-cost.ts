export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

// USD per million tokens. Anthropic first-party list prices, checked 2026-10-31.
// Models missing here (including the Groq free-tier demo model, billed at $0 on the free plan)
// log a null cost rather than a guessed one.
const PRICES_PER_MTOK: Record<string, { input: number; output: number }> = {
  "claude-sonnet-4-6": { input: 3, output: 15 },
};

export const estimateCostUsd = (model: string, usage: TokenUsage): number | null => {
  const price = PRICES_PER_MTOK[model];
  if (!price) return null;
  const cost = (usage.inputTokens * price.input + usage.outputTokens * price.output) / 1_000_000;
  return Math.round(cost * 1_000_000) / 1_000_000;
};
