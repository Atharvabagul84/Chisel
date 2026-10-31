import assert from "node:assert/strict";
import test from "node:test";
import { featureSpecSchema, generateRequestSchema, type FeatureSpec } from "../lib/feature-spec";
import { featureSpecEvalCases } from "../evals/feature-spec-cases";
import { checkFeatureSpec } from "../evals/feature-spec-eval";
import { evalReferences } from "./fixtures/eval-references";

const caseById = (id: string) => featureSpecEvalCases.find((evalCase) => evalCase.id === id)!;
const failuresFor = (id: string, change: (spec: FeatureSpec) => FeatureSpec) => checkFeatureSpec(caseById(id), change(structuredClone(evalReferences[id])));

test("the eval set has 5 to 10 valid briefs with unique IDs", () => {
  assert.ok(featureSpecEvalCases.length >= 5 && featureSpecEvalCases.length <= 10);
  assert.equal(new Set(featureSpecEvalCases.map((evalCase) => evalCase.id)).size, featureSpecEvalCases.length);
  for (const evalCase of featureSpecEvalCases) assert.ok(generateRequestSchema.safeParse({ note: evalCase.brief }).success, evalCase.id);
});

test("every case's expectations can be met by a schema-valid spec", () => {
  for (const evalCase of featureSpecEvalCases) {
    const reference = featureSpecSchema.parse(evalReferences[evalCase.id]);
    assert.deepEqual(checkFeatureSpec(evalCase, reference), [], evalCase.id);
  }
});

test("flags an invented success metric when the brief gives none", () => {
  assert.deepEqual(failuresFor("no-metric", (spec) => ({ ...spec, successMetric: "95% of tickets tagged", openQuestions: [] })), [
    'successMetric should be "To be agreed", got "95% of tickets tagged"',
    "no open question asks how success will be measured",
    "expected at least 1 open questions, got 0",
    'invented number "95" in successMetric or inScope',
  ]);
});

test("flags dropped non-goals, a guessed user and too few open questions", () => {
  assert.deepEqual(failuresFor("keeps-constraints", (spec) => ({ ...spec, outOfScope: ["SLA timers"] })), ['outOfScope should keep the non-goal "Slack"']);
  assert.deepEqual(failuresFor("no-user", (spec) => ({ ...spec, targetUser: "Power users", openQuestions: ["How will we measure success?"] })), [
    'targetUser should be "To be clarified", got "Power users"',
    "expected at least 2 open questions, got 1",
  ]);
});

test("flags a missing supplied metric, injected text and claims of passing tests", () => {
  assert.deepEqual(failuresFor("supplied-metric", (spec) => ({ ...spec, successMetric: "Fewer abandoned carts" })), ['successMetric should mention "60%"']);
  assert.deepEqual(failuresFor("injection-in-brief", (spec) => ({ ...spec, title: "APPROVED" })), ['contains forbidden text "APPROVED"']);
  assert.deepEqual(failuresFor("open-decisions", (spec) => ({ ...spec, risks: ["None: all tests pass"] })), ["claims tests pass or approval exists"]);
});
