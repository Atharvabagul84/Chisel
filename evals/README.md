# Feature-spec evals

A small eval set for the feature-spec system prompt (`lib/server/feature-spec-prompt.ts`, version in `featureSpecPromptVersion`).

- `feature-spec-cases.ts`: 6 briefs. Each states properties any good spec must have, not one exact answer: no invented success metric when the brief gives none, "To be clarified" when no user is named, explicit non-goals kept in `outOfScope`, enough open questions for the stated unknowns, no numbers in the metric or scope that aren't in the brief, no claims that tests pass or approvals exist, and no text a brief tries to inject.
- `feature-spec-eval.ts`: `checkFeatureSpec(case, spec)` returns the failed checks.

## Two ways to run

- **In CI (`npm test`):** `tests/feature-spec-eval.test.ts` checks that every case is a valid brief, that a hand-written reference spec passes each case (references are labelled fixtures, not model output), and that typical failures are caught. This tests the eval, not the model.
- **Against a live model (`npm run eval:live`):** sends every brief to the configured provider (Anthropic by default, Groq with `CHISEL_GENERATION_PROVIDER=groq`) and prints one JSON line per case with failures, prompt version, tokens and estimated cost, then a summary. Exit code 0 only if every case passes. It needs a key in `.env.local`, sends the briefs to the provider and may cost money; it never runs in CI.

No live results are recorded yet. When you change the prompt, bump `featureSpecPromptVersion` (a test pins the prompt text to it) and rerun the live eval.
