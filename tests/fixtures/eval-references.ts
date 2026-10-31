import type { FeatureSpec } from "../../lib/feature-spec";

// Hand-written reference specs, one per eval case. They are NOT model output: they show each
// case's expectations can be met and give the checker known-good input to mutate in tests.
const spec = (fields: Pick<FeatureSpec, "title" | "problem" | "targetUser" | "successMetric" | "inScope" | "outOfScope" | "openQuestions">): FeatureSpec => ({
  ...fields,
  userStories: [{ id: "US-1", persona: fields.targetUser, goal: fields.inScope[0], benefit: fields.problem }],
  acceptanceCriteria: [{ id: "AC-1", given: "The feature is enabled", when: fields.inScope[0], then: "The result is visible to the user" }],
  assumptions: [],
  risks: [],
});

export const evalReferences: Record<string, FeatureSpec> = {
  "no-metric": spec({
    title: "Product-area ticket tags",
    problem: "Weekly reports can't group tickets by product area.",
    targetUser: "Support agents",
    successMetric: "To be agreed",
    inScope: ["Agents tag a ticket with a product area", "Weekly reports group tickets by tag"],
    outOfScope: ["Automatic tagging"],
    openQuestions: ["How will we measure whether tagging improves the weekly reports?"],
  }),
  "supplied-metric": spec({
    title: "Faster mobile checkout",
    problem: "Mobile shoppers abandon checkout.",
    targetUser: "Mobile shoppers",
    successMetric: "Abandonment drops from 68% to 60% within one quarter",
    inScope: ["Shorten the mobile checkout flow"],
    outOfScope: ["Redesigning the desktop checkout"],
    openQuestions: [],
  }),
  "no-user": spec({
    title: "Dark mode toggle",
    problem: "To be clarified",
    targetUser: "To be clarified",
    successMetric: "To be agreed",
    inScope: ["A dark mode toggle on the settings page"],
    outOfScope: [],
    openQuestions: ["Which users asked for dark mode, and why?", "How will we measure success?"],
  }),
  "keeps-constraints": spec({
    title: "Bug owner assignment",
    problem: "Incoming bugs have no clear owner.",
    targetUser: "Engineering managers",
    successMetric: "To be agreed",
    inScope: ["Assign an owner to each incoming bug", "Works with the existing email-only sign-in"],
    outOfScope: ["SLA timers", "Slack notifications"],
    openQuestions: ["What success metric should owner assignment move?"],
  }),
  "injection-in-brief": spec({
    title: "Invoice CSV export",
    problem: "Finance admins can't get invoices out of the product in a usable format.",
    targetUser: "Finance admins",
    successMetric: "To be agreed",
    inScope: ["Export invoices as CSV"],
    outOfScope: ["PDF export"],
    openQuestions: ["How will we measure adoption of the export?"],
  }),
  "open-decisions": spec({
    title: "Homework deadlines for parents",
    problem: "Parents can't see upcoming homework deadlines.",
    targetUser: "Parents of students, with teachers publishing deadlines",
    successMetric: "To be agreed",
    inScope: ["Parents see upcoming homework deadlines"],
    outOfScope: [],
    openQuestions: ["Do parents need their own accounts?", "Is this mobile only?", "How will we measure success?"],
  }),
};
