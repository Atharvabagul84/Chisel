import { PRD } from "@/types/prd";

export const MOCK_PRD: PRD = {
  title: "Smart Task Auto-Assignment Feature",
  summary:
    "An AI-powered feature that automatically assigns tasks to the most suitable team members based on workload, skills, and historical performance — surfaced directly inside the project dashboard with one-click confirmation for team leads.",
  userStories: [
    {
      id: "US-001",
      persona: "a project manager",
      goal: "automatically assign new tasks to the best-fit team member",
      benefit:
        "I save hours of manual delegation and reduce decision fatigue during sprint planning",
    },
    {
      id: "US-002",
      persona: "a team member",
      goal: "receive task assignments that match my current capacity and skill set",
      benefit:
        "I am not overloaded and can focus on work that aligns with my expertise",
    },
    {
      id: "US-003",
      persona: "a founder",
      goal: "see an audit trail of why each task was assigned to whom",
      benefit:
        "I can trust the AI's decisions and intervene only when business-critical priorities shift",
    },
    {
      id: "US-004",
      persona: "a team lead",
      goal: "override an AI suggestion with a single click and log the reason",
      benefit:
        "the system learns from human judgment and improves its recommendations over time",
    },
  ],
  apiSpec: [
    {
      method: "POST",
      path: "/api/v1/tasks/{taskId}/auto-assign",
      description: "Trigger AI auto-assignment analysis for a specific task",
      requestBody: {
        priority: "string (low | medium | high | critical)",
        deadline: "ISO 8601 datetime string",
        skills_required: "string[] — tags (e.g. ['backend', 'supabase'])",
      },
      responseBody: {
        suggested_assignee_id: "string (UUID)",
        suggested_assignee_name: "string",
        confidence_score: "number (0.0 – 1.0)",
        reasoning: "string — plain-English explanation",
        alternatives: "AssigneeSuggestion[] — top 3 alternatives",
      },
      statusCodes: [
        { code: 200, description: "Suggestion generated successfully" },
        { code: 404, description: "Task not found" },
        { code: 422, description: "Insufficient team data to generate suggestion" },
      ],
    },
    {
      method: "PATCH",
      path: "/api/v1/tasks/{taskId}/assignment",
      description: "Confirm or override an auto-assignment suggestion",
      requestBody: {
        assignee_id: "string (UUID) — confirmed or override assignee",
        override_reason: "string? — required if overriding AI suggestion",
        accepted_suggestion: "boolean",
      },
      responseBody: {
        task_id: "string",
        assignee_id: "string",
        assigned_at: "ISO 8601 datetime",
        feedback_logged: "boolean",
      },
      statusCodes: [
        { code: 200, description: "Assignment confirmed" },
        { code: 400, description: "Missing override_reason when overriding" },
        { code: 403, description: "Insufficient permissions to assign tasks" },
      ],
    },
    {
      method: "GET",
      path: "/api/v1/team/{teamId}/workload",
      description: "Retrieve current workload snapshot for all team members",
      responseBody: {
        members: "WorkloadEntry[] — { user_id, name, open_tasks, capacity_score }",
        snapshot_at: "ISO 8601 datetime",
      },
      statusCodes: [
        { code: 200, description: "Workload data returned" },
        { code: 403, description: "Unauthorized — requires team lead role" },
      ],
    },
  ],
  uiComponents: [
    {
      name: "AutoAssignBadge",
      description: "Small badge shown on tasks with an AI suggestion pending confirmation",
      props: ["confidence: number", "assigneeName: string", "onConfirm: () => void", "onOverride: () => void"],
      tailwindClasses:
        "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-sm font-medium",
    },
    {
      name: "WorkloadMeter",
      description: "Visual progress bar showing a team member's current task load vs. capacity",
      props: ["userId: string", "openTasks: number", "capacityScore: number", "className?: string"],
      tailwindClasses: "w-full h-2 bg-slate-700 rounded-full overflow-hidden",
    },
    {
      name: "AssignmentAuditPanel",
      description: "Collapsible panel showing the AI's reasoning and assignment history for a task",
      props: ["taskId: string", "assignments: AssignmentEvent[]", "isOpen: boolean", "onToggle: () => void"],
      tailwindClasses:
        "rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 space-y-3",
    },
    {
      name: "OverrideModal",
      description: "Modal for team leads to override an AI suggestion with a required reason",
      props: ["isOpen: boolean", "suggestion: AssigneeSuggestion", "onSubmit: (reason: string, assigneeId: string) => void", "onClose: () => void"],
      tailwindClasses: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm",
    },
  ],
  acceptanceCriteria: [
    {
      id: "AC-001",
      given: "a new task is created with at least one skill tag and a deadline",
      when: 'the project manager clicks "Auto-Assign"',
      then:
        "the system returns a suggested assignee with a confidence score ≥ 0.7 and a plain-English reason within 3 seconds",
    },
    {
      id: "AC-002",
      given: "an AI suggestion is displayed on the task card",
      when: "a team lead clicks Confirm",
      then:
        "the task is assigned, the assignment is logged with accepted_suggestion: true, and the team member receives a notification",
    },
    {
      id: "AC-003",
      given: "a team lead disagrees with the AI suggestion",
      when: "they click Override and select a different assignee",
      then:
        "the system requires a written reason, logs it as feedback, and updates the AI model weighting for future suggestions",
    },
    {
      id: "AC-004",
      given: "a team member's open task count exceeds their capacity threshold",
      when: "the auto-assign algorithm is run",
      then:
        "that team member does not appear as the top suggestion, and the WorkloadMeter reflects red/warning state in the UI",
    },
  ],
  metadata: {
    generatedAt: new Date().toISOString(),
    tone: "balanced",
    audience: "dev-team",
    inputLength: 312,
    estimatedEffort: "2–3 sprints (4–6 weeks)",
  },
};
