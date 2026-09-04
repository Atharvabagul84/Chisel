"use client";

import { useState } from "react";
import { PRD, APIEndpoint, UserStory, UIComponent, AcceptanceCriterion } from "@/types/prd";

interface SpecDocumentViewProps {
  prd: PRD;
  onRefine: () => void;
}

export default function SpecDocumentView({ prd, onRefine }: SpecDocumentViewProps) {
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedCursor, setCopiedCursor] = useState(false);
  const [activeChecklist, setActiveChecklist] = useState<Record<string, boolean>>({
    "check-1": true,
    "check-2": true,
    "check-3": false,
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Generate clean Markdown output
  const fullMarkdown = [
    `# PRD: ${prd.title}`,
    `\n## PILLAR 01: Executive Scope & Problem Statement`,
    `${prd.summary}`,
    `\n### Quantitative Targets`,
    `- Diff Parse Throughput: < 250ms`,
    `- Review Cycle Reduction: -48% Time`,
    `- Deterministic Accuracy: 99.4%`,
    `\n## PILLAR 02: User Stories & Acceptance Criteria (Gherkin)`,
    prd.userStories
      .map(
        (s, i) =>
          `### Scenario ${i + 1}: ${s.goal}\n- **GIVEN** as ${s.persona}\n- **WHEN** ${s.goal}\n- **THEN** ${s.benefit}`
      )
      .join("\n\n"),
    `\n### Verification Checklist`,
    prd.acceptanceCriteria
      .map((ac) => `- [x] Given ${ac.given} When ${ac.when} Then ${ac.then}`)
      .join("\n"),
    `\n## PILLAR 03: REST API Contracts & Data Schemas`,
    prd.apiSpec
      .map(
        (e) =>
          `### ${e.method} ${e.path}\n${e.description}\n\n**Payload:**\n\`\`\`json\n${JSON.stringify(e.requestBody || {}, null, 2)}\n\`\`\`\n\n**Response:**\n\`\`\`json\n${JSON.stringify(e.responseBody || {}, null, 2)}\n\`\`\``
      )
      .join("\n\n"),
    `\n## PILLAR 04: Frontend Component Hierarchy`,
    prd.uiComponents
      .map(
        (c) =>
          `### <${c.name} />\n${c.description}\n- Props: ${c.props.join(", ")}\n- Classes: \`${c.tailwindClasses}\``
      )
      .join("\n\n"),
    `\n## PILLAR 05: Edge Cases & Non-Functional Requirements`,
    `- Latency SLA: < 3.5s execution\n- Rate Limiting: 5,000 req/hr boundary\n- Crash Recovery: DLQ retry queue`,
    `\n---\n*Chiseled by Chisel v2.4 (Atharva Bagul) · ${new Date(prd.metadata.generatedAt).toLocaleString()}*`,
  ].join("\n");

  function handleCopyMarkdown() {
    navigator.clipboard.writeText(fullMarkdown);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  }

  function handleDownloadMd() {
    const blob = new Blob([fullMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${prd.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-spec.md`;
    a.click();
  }

  function handleExportCursor() {
    const cursorPrompt = `# Specification: ${prd.title}\n\n${fullMarkdown}`;
    navigator.clipboard.writeText(cursorPrompt);
    setCopiedCursor(true);
    setTimeout(() => setCopiedCursor(false), 2000);
  }

  // Word count calculation
  const wordCount = fullMarkdown.split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col w-full">
      {/* Top Document Utility & Meta Bar */}
      <section className="w-full bg-surface-container-low px-6 py-4 border-b border-outline-variant">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-tertiary-container text-on-tertiary-container font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                v1.0 Ready
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                {prd.metadata.audience || "Solo Dev / AI Coder"}
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                {prd.metadata.tone || "Technical & Lean"}
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-tertiary">bolt</span>
                Compiled in 4.2s
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">
                PRD: {prd.title}
              </h1>
              <span
                className="material-symbols-outlined text-outline hover:text-primary cursor-pointer transition-colors text-lg"
                title="Pin Specification"
              >
                bookmark_border
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono text-xs">
            <button
              onClick={handleCopyMarkdown}
              id="btnCopyMarkdown"
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors shadow-sm cursor-pointer border border-outline-variant/60"
            >
              <span className="material-symbols-outlined text-[15px] text-primary">
                {copiedMarkdown ? "check" : "content_copy"}
              </span>
              <span>{copiedMarkdown ? "Copied!" : "Copy Markdown"}</span>
            </button>

            <button
              onClick={handleDownloadMd}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors shadow-sm cursor-pointer border border-outline-variant/60"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              <span>.md</span>
            </button>

            <button
              onClick={handleExportCursor}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary-container text-on-primary-container font-medium hover:bg-primary-container/80 transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">terminal</span>
              <span>{copiedCursor ? "Copied for IDE!" : "Export for Cursor"}</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Spec link copied to clipboard!");
              }}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer border border-outline-variant/60"
            >
              <span className="material-symbols-outlined text-[15px]">share</span>
              <span>Share</span>
            </button>

            <button
              onClick={onRefine}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-highest text-primary hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">edit_note</span>
              <span>Refine</span>
            </button>
          </div>
        </div>
      </section>

      {/* Workspace Container: Two Column Layout */}
      <div className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row items-start gap-8 relative">
        {/* Sticky Navigation Rail (Pillars index) */}
        <aside className="w-full lg:w-60 shrink-0 lg:sticky lg:top-20 flex flex-col gap-6">
          <div className="bg-surface-container-low rounded-lg p-3 shadow-sm flex flex-col gap-2 border border-outline-variant">
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-secondary">
              <span>Contents</span>
              <span className="text-tertiary">5 Pillars</span>
            </div>
            <nav className="flex flex-col gap-1 text-xs font-mono">
              <a
                href="#pillar-01"
                className="group flex items-center justify-between px-2.5 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="text-primary font-bold">01</span>
                  <span className="truncate">Executive Scope</span>
                </span>
                <span className="material-symbols-outlined text-[14px] text-secondary group-hover:text-primary">
                  arrow_forward
                </span>
              </a>
              <a
                href="#pillar-02"
                className="group flex items-center justify-between px-2.5 py-1.5 rounded text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="text-secondary font-bold">02</span>
                  <span className="truncate">Gherkin Criteria</span>
                </span>
                <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 text-secondary">
                  arrow_forward
                </span>
              </a>
              <a
                href="#pillar-03"
                className="group flex items-center justify-between px-2.5 py-1.5 rounded text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="text-secondary font-bold">03</span>
                  <span className="truncate">API &amp; Schemas</span>
                </span>
                <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 text-secondary">
                  arrow_forward
                </span>
              </a>
              <a
                href="#pillar-04"
                className="group flex items-center justify-between px-2.5 py-1.5 rounded text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="text-secondary font-bold">04</span>
                  <span className="truncate">Component Tree</span>
                </span>
                <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 text-secondary">
                  arrow_forward
                </span>
              </a>
              <a
                href="#pillar-05"
                className="group flex items-center justify-between px-2.5 py-1.5 rounded text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="text-secondary font-bold">05</span>
                  <span className="truncate">Edge Cases &amp; SLA</span>
                </span>
                <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 text-secondary">
                  arrow_forward
                </span>
              </a>
            </nav>
          </div>

          {/* Spec Metrics Card */}
          <div className="bg-surface-container-low rounded-lg p-3 shadow-sm flex flex-col gap-3 font-mono text-xs border border-outline-variant">
            <div className="text-[10px] text-secondary uppercase tracking-wider">Spec Vitality</div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Word Count:</span>
              <span className="text-on-surface font-semibold">{wordCount} words</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Complexity:</span>
              <span className="text-tertiary font-semibold">Lean / AST</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Target Stack:</span>
              <span className="text-primary font-semibold">Bun + Next15</span>
            </div>
            <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-tertiary w-4/5 rounded-full" />
            </div>
            <button
              onClick={handleDownloadMd}
              type="button"
              className="w-full py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-outline-variant/50"
            >
              <span className="material-symbols-outlined text-[14px]">archive</span>
              Export All Bundles
            </button>
          </div>

          {/* Live Sync Status */}
          <div className="px-2 flex items-center gap-2 text-[11px] font-mono text-secondary">
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            <span>AST Parser Engine: active</span>
          </div>
        </aside>

        {/* Center Technical Document Canvas */}
        <main className="w-full lg:max-w-4xl flex flex-col gap-12 text-on-surface">
          {/* Spec Header Banner */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-surface-container via-surface-container-low to-surface-dim shadow-md flex flex-col gap-4 border border-outline-variant">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-primary/20 text-primary uppercase tracking-wider font-semibold">
                  CHISEL-RFC-049
                </span>
                <span className="text-secondary text-xs font-mono">• Internal Architecture</span>
              </div>
              <span className="text-xs font-mono text-secondary">
                Last synchronized: just now by @arch-lead
              </span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">{prd.summary}</p>
          </div>

          {/* PILLAR 01: Executive Scope & Problem */}
          <section className="flex flex-col gap-5 scroll-mt-20" id="pillar-01">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-surface-container-high text-primary font-mono text-xs font-bold tracking-wider">
                PILLAR 01
              </span>
              <h2 className="text-lg font-bold tracking-tight uppercase font-mono text-on-surface">
                Executive Scope &amp; Problem Statement
              </h2>
            </div>
            <div className="bg-surface-container rounded-lg p-5 shadow-sm flex flex-col gap-4 border border-outline-variant">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-error text-xl shrink-0 mt-0.5">
                  report_problem
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-on-surface font-mono">The Problem</h3>
                  <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                    Engineering and product review workflows are critical bottlenecks in high-velocity teams.
                    Manual triage requires engineering leads to parse raw requirements and unstructured voice
                    notes for schema drift, database locking migrations, and circular dependencies. Automated
                    static analysis lacks context-aware AST impact trees, resulting in missed architectural
                    flaws and prolonged development cycles.
                  </p>
                </div>
              </div>

              {/* Quantitative Targets Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                <div className="p-3.5 rounded bg-surface-container-low flex flex-col gap-1 border border-outline-variant/40">
                  <span className="text-xs font-mono text-secondary uppercase">
                    Diff Parse Throughput
                  </span>
                  <span className="text-xl font-bold font-mono text-tertiary">&lt; 250ms</span>
                  <span className="text-[11px] text-on-surface-variant">
                    AST compilation for 10k LoC changesets
                  </span>
                </div>
                <div className="p-3.5 rounded bg-surface-container-low flex flex-col gap-1 border border-outline-variant/40">
                  <span className="text-xs font-mono text-secondary uppercase">
                    Review Cycle Reduction
                  </span>
                  <span className="text-xl font-bold font-mono text-primary">-48% Time</span>
                  <span className="text-[11px] text-on-surface-variant">
                    Mean time from PR open to review sign-off
                  </span>
                </div>
                <div className="p-3.5 rounded bg-surface-container-low flex flex-col gap-1 border border-outline-variant/40">
                  <span className="text-xs font-mono text-secondary uppercase">
                    Deterministic Accuracy
                  </span>
                  <span className="text-xl font-bold font-mono text-on-surface">99.4%</span>
                  <span className="text-[11px] text-on-surface-variant">
                    Zero false-positive schema migration alarms
                  </span>
                </div>
              </div>

              {/* Scope Separation */}
              <div className="mt-3 flex flex-col gap-3">
                <div className="text-xs font-mono uppercase tracking-wider text-secondary font-semibold">
                  Scope Boundaries
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* In Scope */}
                  <div className="p-3 rounded bg-surface-container-low flex flex-col gap-2 border border-outline-variant/40">
                    <div className="flex items-center gap-1.5 text-tertiary font-mono font-medium">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span>In-Scope Deliverables</span>
                    </div>
                    <ul className="space-y-1.5 text-on-surface-variant">
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-tertiary" />
                        <span>Webhook processor for GitHub Pull Request payloads</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-tertiary" />
                        <span>AST parser for TypeScript, Python, and Prisma migrations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-tertiary" />
                        <span>Blocking GitHub Check Runs with high-fidelity summaries</span>
                      </li>
                    </ul>
                  </div>

                  {/* Out of Scope */}
                  <div className="p-3 rounded bg-surface-container-low flex flex-col gap-2 border border-outline-variant/40">
                    <div className="flex items-center gap-1.5 text-secondary font-mono font-medium">
                      <span className="material-symbols-outlined text-sm">block</span>
                      <span>Explicitly Out of Scope</span>
                    </div>
                    <ul className="space-y-1.5 text-secondary line-through">
                      <li>Direct Git auto-merging or branch force pushing</li>
                      <li>Multi-repository monorepo cross-diff analysis (Phase 2)</li>
                      <li>IDE in-editor live preview extension</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PILLAR 02: User Stories & Acceptance Criteria (Gherkin) */}
          <section className="flex flex-col gap-5 scroll-mt-20" id="pillar-02">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-surface-container-high text-primary font-mono text-xs font-bold tracking-wider">
                PILLAR 02
              </span>
              <h2 className="text-lg font-bold tracking-tight uppercase font-mono text-on-surface">
                User Stories &amp; Acceptance Criteria (Gherkin)
              </h2>
            </div>

            {/* Generated Scenarios */}
            {prd.userStories.map((story: UserStory, sIdx: number) => (
              <div
                key={story.id || sIdx}
                className="bg-surface-container rounded-lg p-5 shadow-sm flex flex-col gap-4 border border-outline-variant"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-primary uppercase">
                    Scenario {sIdx + 1}: {story.goal}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container-highest text-secondary">
                    {story.id || `US-TRG-0${sIdx + 1}`}
                  </span>
                </div>

                {/* Gherkin Block */}
                <div className="p-4 rounded bg-surface-container-lowest font-mono text-xs leading-relaxed flex flex-col gap-2 text-on-surface-variant border border-outline-variant/30">
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container text-[10px] font-bold">
                      GIVEN
                    </span>
                    <span className="text-on-surface">
                      As <strong className="text-primary">{story.persona}</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface text-[10px] font-bold">
                      WHEN
                    </span>
                    <span className="text-on-surface">{story.goal}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-tertiary-container text-on-tertiary-container text-[10px] font-bold">
                      THEN
                    </span>
                    <span className="text-on-surface">{story.benefit}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Interactive Verification Checklist */}
            <div className="bg-surface-container rounded-lg p-5 shadow-sm flex flex-col gap-3 border border-outline-variant">
              <span className="text-xs font-mono uppercase text-secondary font-semibold">
                Verification Checklist
              </span>
              <div className="space-y-2">
                {prd.acceptanceCriteria.map((ac: AcceptanceCriterion, acIdx: number) => {
                  const checkKey = ac.id || `check-${acIdx}`;
                  const isChecked = activeChecklist[checkKey] ?? true;

                  return (
                    <label
                      key={checkKey}
                      className="flex items-start gap-3 text-xs text-on-surface hover:bg-surface-container-low p-2 rounded cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setActiveChecklist((prev) => ({ ...prev, [checkKey]: !prev[checkKey] }))
                        }
                        className="w-4 h-4 rounded bg-surface-container-highest text-primary accent-primary focus:ring-0 cursor-pointer mt-0.5"
                      />
                      <div className="flex flex-col">
                        <span className="font-mono text-[11px] text-tertiary font-bold">
                          [{ac.id || `AC-00${acIdx + 1}`}]
                        </span>
                        <span>
                          Given {ac.given}, when {ac.when}, then {ac.then}.
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </section>

          {/* PILLAR 03: REST API Contracts & Data Schemas */}
          <section className="flex flex-col gap-5 scroll-mt-20" id="pillar-03">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-surface-container-high text-primary font-mono text-xs font-bold tracking-wider">
                PILLAR 03
              </span>
              <h2 className="text-lg font-bold tracking-tight uppercase font-mono text-on-surface">
                REST API Contracts &amp; Data Schemas
              </h2>
            </div>

            <div className="bg-surface-container rounded-lg p-5 shadow-sm flex flex-col gap-4 border border-outline-variant">
              <div className="text-xs font-mono uppercase text-secondary font-semibold">
                Core Engine Endpoints
              </div>
              <div className="flex flex-col gap-2 font-mono text-xs">
                {prd.apiSpec.map((ep: APIEndpoint, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded bg-surface-container-low hover:bg-surface-container-high transition-colors border border-outline-variant/30"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          ep.method === "POST"
                            ? "bg-primary-container text-on-primary-container"
                            : ep.method === "GET"
                            ? "bg-tertiary-container text-on-tertiary-container"
                            : "bg-surface-container-highest text-secondary"
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="text-on-surface font-semibold">{ep.path}</span>
                    </div>
                    <span className="text-secondary text-[11px]">{ep.description}</span>
                  </div>
                ))}
              </div>

              {/* Code / Schema Spec Block */}
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-secondary font-semibold">
                    TypeScript Contract &amp; DB Representation
                  </span>
                  <span className="text-[11px] font-mono text-primary">schema.ts</span>
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-lg font-mono text-xs overflow-x-auto text-on-surface leading-relaxed border border-outline-variant/40">
                  <div className="text-secondary">// Core Analysis Ingestion Contract</div>
                  <div>
                    <span className="text-primary">export interface</span>{" "}
                    <span className="text-tertiary font-bold">TriageReport</span> &#123;
                  </div>
                  <div className="pl-4">
                    id: <span className="text-primary">string</span>;
                  </div>
                  <div className="pl-4">
                    repositoryId: <span className="text-primary">number</span>;
                  </div>
                  <div className="pl-4">
                    pullRequestId: <span className="text-primary">number</span>;
                  </div>
                  <div className="pl-4">
                    commitSha: <span className="text-primary">string</span>;
                  </div>
                  <div className="pl-4">
                    riskLevel: <span className="text-tertiary">&apos;LOW&apos;</span> |{" "}
                    <span className="text-primary">&apos;MEDIUM&apos;</span> |{" "}
                    <span className="text-error font-bold">&apos;MIGRATION_RISK_HIGH&apos;</span>;
                  </div>
                  <div className="pl-4">
                    status: <span className="text-tertiary">&apos;APPROVED&apos;</span> |{" "}
                    <span className="text-error">&apos;BLOCKED&apos;</span> |{" "}
                    <span className="text-secondary">&apos;PENDING&apos;</span>;
                  </div>
                  <div className="pl-4">astMetrics: &#123;</div>
                  <div className="pl-8">
                    affectedFunctions: <span className="text-primary">string</span>[];
                  </div>
                  <div className="pl-8">
                    breakingTypeChanges: <span className="text-primary">boolean</span>;
                  </div>
                  <div className="pl-8">
                    databaseLockedTables: <span className="text-primary">string</span>[];
                  </div>
                  <div className="pl-8">
                    executionDurationMs: <span className="text-primary">number</span>;
                  </div>
                  <div className="pl-4">&#125;;</div>
                  <div className="pl-4">
                    createdAt: <span className="text-primary">Date</span>;
                  </div>
                  <div>&#125;</div>
                </div>
              </div>

              {/* PostgreSQL DDL Representation */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono uppercase text-secondary font-semibold">
                  PostgreSQL Migration DDL
                </span>
                <div className="bg-surface-container-lowest p-4 rounded-lg font-mono text-xs text-on-surface-variant overflow-x-auto border border-outline-variant/40">
                  <span className="text-primary">CREATE TABLE</span> triage_evaluations (
                  <br />
                  &nbsp;&nbsp;id{" "}
                  <span className="text-tertiary">UUID PRIMARY KEY DEFAULT gen_random_uuid()</span>,
                  <br />
                  &nbsp;&nbsp;repo_id <span className="text-tertiary">BIGINT NOT NULL</span>,
                  <br />
                  &nbsp;&nbsp;pr_number <span className="text-tertiary">INT NOT NULL</span>,
                  <br />
                  &nbsp;&nbsp;risk_level{" "}
                  <span className="text-tertiary">
                    VARCHAR(32) NOT NULL CHECK (risk_level IN (&apos;LOW&apos;, &apos;MEDIUM&apos;,
                    &apos;HIGH_RISK&apos;))
                  </span>
                  ,
                  <br />
                  &nbsp;&nbsp;ast_analysis_meta{" "}
                  <span className="text-tertiary">JSONB NOT NULL DEFAULT &apos;&#123;&#125;&apos;::jsonb</span>,
                  <br />
                  &nbsp;&nbsp;created_at{" "}
                  <span className="text-tertiary">TIMESTAMPTZ NOT NULL DEFAULT NOW()</span>
                  <br />
                  );
                  <br />
                  <span className="text-primary">CREATE INDEX</span> idx_triage_repo_pr{" "}
                  <span className="text-primary">ON</span> triage_evaluations(repo_id, pr_number);
                </div>
              </div>
            </div>
          </section>

          {/* PILLAR 04: Frontend Component Hierarchy */}
          <section className="flex flex-col gap-5 scroll-mt-20" id="pillar-04">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-surface-container-high text-primary font-mono text-xs font-bold tracking-wider">
                PILLAR 04
              </span>
              <h2 className="text-lg font-bold tracking-tight uppercase font-mono text-on-surface">
                Frontend Component Hierarchy
              </h2>
            </div>

            <div className="bg-surface-container rounded-lg p-5 shadow-sm flex flex-col gap-4 border border-outline-variant">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Component structure designed for atomic re-renders with zero-layout-shift diff
                rendering and virtualized AST token inspection.
              </p>

              {/* ASCII Tree Architecture Display */}
              <div className="p-4 rounded-lg bg-surface-container-lowest font-mono text-xs leading-6 text-on-surface border border-outline-variant/40">
                <div className="text-primary font-semibold">App</div>
                <div>
                  ├── <span className="text-tertiary font-medium">PRReviewDashboard</span>{" "}
                  <span className="text-secondary">(Provider: ReviewCtx, WebSocket)</span>
                </div>
                <div>
                  │&nbsp;&nbsp;├── <span className="text-on-surface font-medium">DiffTreeViewer</span>{" "}
                  <span className="text-secondary">[Virtual Scroll, 100k LoC support]</span>
                </div>
                <div>│&nbsp;&nbsp;│&nbsp;&nbsp;├── ASTDiffChunk</div>
                <div>│&nbsp;&nbsp;│&nbsp;&nbsp;└── TokenHighlighter</div>
                <div>
                  │&nbsp;&nbsp;├── <span className="text-on-surface font-medium">TriageScoreBadge</span>{" "}
                  <span className="text-secondary">[Interactive Risk Breakdown Tooltip]</span>
                </div>
                <div>
                  │&nbsp;&nbsp;└── <span className="text-on-surface font-medium">InteractiveApproveBar</span>{" "}
                  <span className="text-secondary">[Instant check resolution &amp; bypass override]</span>
                </div>
                <div>
                  └── <span className="text-tertiary font-medium">BotSettingsDrawer</span>
                </div>
                <div>
                  &nbsp;&nbsp;&nbsp;&nbsp;├──{" "}
                  <span className="text-on-surface font-medium">RuleConfigEditor</span>{" "}
                  <span className="text-secondary">[Monaco YAML/JSON AST expressions]</span>
                </div>
                <div>
                  &nbsp;&nbsp;&nbsp;&nbsp;└──{" "}
                  <span className="text-on-surface font-medium">WebhookAuditLog</span>{" "}
                  <span className="text-secondary">[Live streaming execution ledger]</span>
                </div>
              </div>

              {/* Component Mock Preview Bento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className="p-3.5 rounded bg-surface-container-low flex flex-col gap-2 border border-outline-variant/40">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-on-surface font-medium">Mock: InteractiveApproveBar</span>
                    <span className="text-[10px] text-tertiary">Live Render</span>
                  </div>
                  <div className="p-2.5 rounded bg-surface-container-lowest flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-tertiary" />
                      <span className="text-xs font-mono text-on-surface">All AST gates passed</span>
                    </div>
                    <button
                      onClick={() => setIsAuthorized(!isAuthorized)}
                      type="button"
                      className="px-2.5 py-1 rounded bg-tertiary text-on-tertiary text-xs font-mono font-medium hover:bg-tertiary/90 transition-colors cursor-pointer"
                    >
                      {isAuthorized ? "✓ Authorized" : "Authorize Check"}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded bg-surface-container-low flex flex-col gap-2 border border-outline-variant/40">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-on-surface font-medium">Mock: TriageScoreBadge</span>
                    <span className="text-[10px] text-primary">Evaluated</span>
                  </div>
                  <div className="p-2.5 rounded bg-surface-container-lowest flex items-center justify-between">
                    <span className="text-xs font-mono text-on-surface-variant">
                      Complexity Index:
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span className="text-primary font-bold">12.4</span>
                      <span className="text-secondary">/ 100</span>
                      <span className="px-1.5 py-0.2 rounded bg-tertiary/20 text-tertiary text-[10px]">
                        Optimal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PILLAR 05: Edge Cases & Non-Functional Requirements */}
          <section className="flex flex-col gap-5 scroll-mt-20" id="pillar-05">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-surface-container-high text-primary font-mono text-xs font-bold tracking-wider">
                PILLAR 05
              </span>
              <h2 className="text-lg font-bold tracking-tight uppercase font-mono text-on-surface">
                Edge Cases &amp; Non-Functional Requirements
              </h2>
            </div>

            <div className="bg-surface-container rounded-lg p-5 shadow-sm flex flex-col gap-4 border border-outline-variant">
              {/* Structured Requirements Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-secondary text-[11px] uppercase tracking-wider">
                      <th className="py-2.5 px-3 rounded-l">Requirement Class</th>
                      <th className="py-2.5 px-3">Target Specification</th>
                      <th className="py-2.5 px-3">Mitigation / Strategy</th>
                      <th className="py-2.5 px-3 rounded-r text-right">Gate Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-0 text-on-surface">
                    <tr className="hover:bg-surface-container-high transition-colors">
                      <td className="py-3 px-3 font-semibold text-primary">Latency SLA</td>
                      <td className="py-3 px-3">&lt; 3.5s execution for 10k LoC</td>
                      <td className="py-3 px-3 text-on-surface-variant font-sans">
                        Distributed AST workers on Redis cluster with warm memory cache
                      </td>
                      <td className="py-3 px-3 text-right text-tertiary font-bold">PASS</td>
                    </tr>
                    <tr className="hover:bg-surface-container-high transition-colors bg-surface-container-low/40">
                      <td className="py-3 px-3 font-semibold text-primary">GitHub Rate Limiting</td>
                      <td className="py-3 px-3">5,000 req/hr token boundary</td>
                      <td className="py-3 px-3 text-on-surface-variant font-sans">
                        Exponential backoff with jitter + Redis token bucket deduplication
                      </td>
                      <td className="py-3 px-3 text-right text-tertiary font-bold">PASS</td>
                    </tr>
                    <tr className="hover:bg-surface-container-high transition-colors">
                      <td className="py-3 px-3 font-semibold text-primary">Large Binary Diffs</td>
                      <td className="py-3 px-3">Diffs &gt; 50MB or compiled assets</td>
                      <td className="py-3 px-3 text-on-surface-variant font-sans">
                        Immediate binary file bypass; triage skips analysis without stalling queue
                      </td>
                      <td className="py-3 px-3 text-right text-tertiary font-bold">PASS</td>
                    </tr>
                    <tr className="hover:bg-surface-container-high transition-colors bg-surface-container-low/40">
                      <td className="py-3 px-3 font-semibold text-primary">
                        Dead Letter &amp; Crash Recovery
                      </td>
                      <td className="py-3 px-3">0 unhandled process terminations</td>
                      <td className="py-3 px-3 text-on-surface-variant font-sans">
                        Dead Letter Queue (DLQ) with automated GitHub error check-run annotations
                      </td>
                      <td className="py-3 px-3 text-right text-tertiary font-bold">PASS</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Final Sign-Off Ledger */}
              <div className="mt-4 pt-4 bg-surface-container-lowest p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 border border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-mono font-bold text-xs">
                    AB
                  </div>
                  <div className="flex flex-col text-xs font-mono">
                    <span className="text-on-surface font-semibold">
                      Specification Approved by Core Engineering (Atharva Bagul)
                    </span>
                    <span className="text-secondary">Sign-off SHA: 9bf84c7e2a9010</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert("Audit trail: Ingested -> Parsed -> AST Verified -> Schema Generated")}
                    type="button"
                    className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-mono transition-colors cursor-pointer border border-outline-variant/50"
                  >
                    View Audit Trail
                  </button>
                  <button
                    onClick={() => setIsLocked(!isLocked)}
                    type="button"
                    className="px-3 py-1.5 rounded bg-primary text-on-primary text-xs font-mono font-medium hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
                  >
                    {isLocked ? "🔒 Locked" : "Lock PRD"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Canvas Spacer */}
          <div className="h-12" />
        </main>
      </div>
    </div>
  );
}
