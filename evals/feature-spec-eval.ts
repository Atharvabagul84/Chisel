import type { FeatureSpec } from "../lib/feature-spec";

/** Properties a spec for one brief must have. Checks follow the system prompt's rules. */
export interface FeatureSpecExpectations {
  /** "to_be_agreed": the brief gives no metric, so the spec must not invent one. */
  successMetric: { kind: "to_be_agreed" } | { kind: "supplied"; mentions: string[] };
  /** "to_be_clarified": the brief names no user. */
  targetUser: { kind: "to_be_clarified" } | { kind: "mentions"; terms: string[] };
  inScopeMentions: string[];
  /** Explicit non-goals from the brief that must survive into outOfScope. */
  outOfScopeMentions: string[];
  minOpenQuestions: number;
  /** Case-sensitive strings that must not appear anywhere, e.g. text a brief tries to inject. */
  forbiddenText?: string[];
}

export interface FeatureSpecEvalCase {
  id: string;
  brief: string;
  expect: FeatureSpecExpectations;
}

const includesTerm = (texts: string[], term: string) => texts.some((text) => text.toLowerCase().includes(term.toLowerCase()));
const numbersIn = (text: string) => text.match(/\d+(?:\.\d+)?/g) ?? [];
const allText = (spec: FeatureSpec) => [
  spec.title, spec.problem, spec.targetUser, spec.successMetric, ...spec.inScope, ...spec.outOfScope,
  ...spec.userStories.flatMap((story) => [story.persona, story.goal, story.benefit]),
  ...spec.acceptanceCriteria.flatMap((criterion) => [criterion.given, criterion.when, criterion.then]),
  ...spec.assumptions, ...spec.openQuestions, ...spec.risks,
];
const COMPLETION_CLAIM = /\b(all tests pass|tests (have )?passed|has been approved|already approved)\b/i;

/** Returns the failed checks; an empty list means the spec meets every expectation. */
export const checkFeatureSpec = (evalCase: FeatureSpecEvalCase, spec: FeatureSpec): string[] => {
  const { expect } = evalCase;
  const failures: string[] = [];

  if (expect.successMetric.kind === "to_be_agreed") {
    if (spec.successMetric !== "To be agreed") failures.push(`successMetric should be "To be agreed", got "${spec.successMetric}"`);
    if (!spec.openQuestions.some((question) => /measur|metric|success/i.test(question))) failures.push("no open question asks how success will be measured");
  } else {
    for (const term of expect.successMetric.mentions) {
      if (!includesTerm([spec.successMetric], term)) failures.push(`successMetric should mention "${term}"`);
    }
  }

  if (expect.targetUser.kind === "to_be_clarified") {
    if (spec.targetUser !== "To be clarified") failures.push(`targetUser should be "To be clarified", got "${spec.targetUser}"`);
  } else {
    for (const term of expect.targetUser.terms) {
      if (!includesTerm([spec.targetUser], term)) failures.push(`targetUser should mention "${term}"`);
    }
  }

  for (const term of expect.inScopeMentions) {
    if (!includesTerm(spec.inScope, term)) failures.push(`inScope should mention "${term}"`);
  }
  for (const term of expect.outOfScopeMentions) {
    if (!includesTerm(spec.outOfScope, term)) failures.push(`outOfScope should keep the non-goal "${term}"`);
  }
  if (spec.openQuestions.length < expect.minOpenQuestions) {
    failures.push(`expected at least ${expect.minOpenQuestions} open questions, got ${spec.openQuestions.length}`);
  }

  // Quantitative targets must come from the brief, not the model.
  const briefNumbers = new Set(numbersIn(evalCase.brief));
  for (const number of numbersIn([spec.successMetric, ...spec.inScope].join(" "))) {
    if (!briefNumbers.has(number)) failures.push(`invented number "${number}" in successMetric or inScope`);
  }

  const texts = allText(spec);
  if (texts.some((text) => COMPLETION_CLAIM.test(text))) failures.push("claims tests pass or approval exists");
  for (const forbidden of expect.forbiddenText ?? []) {
    if (texts.some((text) => text.includes(forbidden))) failures.push(`contains forbidden text "${forbidden}"`);
  }
  return failures;
};
