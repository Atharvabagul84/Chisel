"use client";

import { useEffect, useState } from "react";

interface PromptChainsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PromptChainsModal({ isOpen, onClose }: PromptChainsModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"system" | "dag" | "schema">("system");

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const systemPromptContent = `You are Chisel, an elite AI product architecture studio. Your role is to sculpt rough founder notes and voice transcripts into structured, 5-pillar production-ready engineering specifications.

AUDIENCE: a senior software engineering team familiar with REST APIs, TypeScript, and React
TONE: precise and technical — use exact HTTP methods, TypeScript types, and Tailwind class names

You MUST respond with a valid JSON object matching this exact TypeScript interface:

interface PRD {
  title: string;                    // Feature name, max 8 words
  summary: string;                  // 2-sentence plain English summary
  userStories: Array<{
    id: string;                     // "US-001", "US-002", etc.
    persona: string;                // e.g. "a project manager"
    goal: string;                   // what they want to do
    benefit: string;                // why they want it (business value)
  }>;
  apiSpec: Array<{
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;                   // e.g. "/api/v1/tasks/{taskId}"
    description: string;
    requestBody?: Record<string, string>;
    responseBody: Record<string, string>;
    statusCodes: Array<{ code: number; description: string }>;
  }>;
  uiComponents: Array<{
    name: string;                   // PascalCase component name
    description: string;
    props: string[];                // TypeScript prop signatures
    tailwindClasses: string;        // Key Tailwind classes for styling
  }>;
  acceptanceCriteria: Array<{
    id: string;                     // "AC-001", "AC-002", etc.
    given: string;                  // precondition (lowercase, no "Given")
    when: string;                   // action (lowercase, no "When")
    then: string;                   // expected outcome (lowercase, no "Then")
  }>;
  metadata: {
    generatedAt: string;            // ISO 8601
    tone: string;
    audience: string;
    inputLength: number;            // character count of input
    estimatedEffort: string;        // e.g. "1–2 sprints (2–4 weeks)"
  };
}

RULES:
- Generate 3–5 user stories
- Generate 2–4 API endpoints
- Generate 3–5 UI components
- Generate 3–5 acceptance criteria
- API paths must follow RESTful conventions with /api/v1/ prefix
- Component names must be PascalCase and specific (not generic like "Button")
- Acceptance criteria must be measurable and testable
- Do NOT wrap the JSON in markdown code blocks — return raw JSON only
- The entire response must be valid parseable JSON`;

  function handleCopy() {
    navigator.clipboard.writeText(systemPromptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-3xl bg-surface-container rounded-xl border border-outline-variant shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container-high/50">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-on-surface font-mono">Prompt Chains (SpecEngine v2)</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container">
                  Active Chain
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-mono">
                Anthropic Claude 3.7 Sonnet System Prompt &amp; DAG Topology
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-outline-variant font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("system")}
            className={`pb-2 px-1 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === "system"
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            System Prompt Template
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("dag")}
            className={`pb-2 px-1 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === "dag"
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            7-Stage Synthesis DAG
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("schema")}
            className={`pb-2 px-1 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === "schema"
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Negative Constraints
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto font-mono text-xs space-y-4">
          {activeTab === "system" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-secondary">
                <span>// Loaded from lib/prompts.ts</span>
                <button
                  onClick={handleCopy}
                  type="button"
                  className="flex items-center gap-1 text-primary hover:underline cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">
                    {copied ? "check" : "content_copy"}
                  </span>
                  <span>{copied ? "Copied" : "Copy Template"}</span>
                </button>
              </div>
              <pre className="p-4 rounded-lg bg-surface-container-lowest text-on-surface-variant overflow-x-auto leading-relaxed border border-outline-variant/40 whitespace-pre-wrap">
                {systemPromptContent}
              </pre>
            </div>
          )}

          {activeTab === "dag" && (
            <div className="space-y-3">
              <p className="text-on-surface-variant leading-relaxed">
                The Prompt Chain executes in 7 sequential cognitive phases to minimize hallucination and enforce rigid schema boundaries:
              </p>
              <div className="space-y-2">
                {[
                  {
                    stage: "Stage 01",
                    name: "Transcript & Voice Normalization",
                    desc: "Strips filler words (um, uh, like), resolves ambiguous pronouns, and extracts core verbs.",
                  },
                  {
                    stage: "Stage 02",
                    name: "Domain Entity Extraction",
                    desc: "Extracts bounded context entities (e.g. PullRequest, ASTScan, Subscription, Invoice).",
                  },
                  {
                    stage: "Stage 03",
                    name: "Scope Invariant Parsing",
                    desc: "Forces explicit separation of In-Scope vs. Out-of-Scope boundaries to kill scope creep.",
                  },
                  {
                    stage: "Stage 04",
                    name: "API Contract Formulation",
                    desc: "Synthesizes RESTful routes with /api/v1/ prefixes, JSON payloads, and HTTP error codes.",
                  },
                  {
                    stage: "Stage 05",
                    name: "PostgreSQL DDL & Index Synthesis",
                    desc: "Generates DDL table definitions with UUID primary keys and composite lookup indexes.",
                  },
                  {
                    stage: "Stage 06",
                    name: "Gherkin Acceptance Matrix",
                    desc: "Formulates Given/When/Then scenarios mapping 1:1 to automated Playwright/Cypress suites.",
                  },
                  {
                    stage: "Stage 07",
                    name: "NFR & SLA Compilation",
                    desc: "Compiles latency budgets, rate limit thresholds, DLQ retries, and cryptographic sign-off.",
                  },
                ].map((s) => (
                  <div
                    key={s.stage}
                    className="p-3 rounded bg-surface-container-low border border-outline-variant/40 flex items-start gap-3"
                  >
                    <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-bold text-[10px] shrink-0">
                      {s.stage}
                    </span>
                    <div>
                      <div className="text-on-surface font-semibold">{s.name}</div>
                      <div className="text-secondary text-[11px] mt-0.5">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "schema" && (
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/40 space-y-3">
                <div className="flex items-center gap-2 text-tertiary font-semibold">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <span>Defensive JSON Guardrails</span>
                </div>
                <ul className="space-y-2 text-on-surface-variant">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span><strong>Negative Constraint:</strong> Explicitly forbids Markdown wrapping (<code>```json</code>), introductory conversation, or conclusion notes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span><strong>Server Sanitization:</strong> Route handler executes regex backtick strip prior to parsing as a secondary fail-safe.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span><strong>Zero-Key Fallback:</strong> If rate limits or timeouts occur, automatically falls back to deterministic mock datasets without throwing client errors.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-outline-variant bg-surface-container-high/30 font-mono text-xs">
          <span className="text-secondary">Engine: Claude 3.7 Sonnet (20250219)</span>
          <button
            onClick={onClose}
            type="button"
            className="px-3 py-1.5 rounded bg-surface-container-highest hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
