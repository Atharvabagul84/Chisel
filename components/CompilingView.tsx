"use client";

import { useState, useEffect } from "react";

interface CompilingViewProps {
  onCancel: () => void;
  onPreview?: () => void;
  tone?: string;
  audience?: string;
}

const STAGES = [
  {
    num: 1,
    title: "Analyzing product idea & extracting entity relationships",
    desc: "Identified domain entities, relations, and bounded context invariants.",
    duration: "180ms",
  },
  {
    num: 2,
    title: "Structuring executive requirements & problem statement",
    desc: "Scored TAM alignment, technical assumptions, critical path velocity.",
    duration: "340ms",
  },
  {
    num: 3,
    title: "Generating Gherkin Given/When/Then user stories",
    desc: "Synthesized acceptance criteria across happy/edge verification paths.",
    duration: "610ms",
  },
  {
    num: 4,
    title: "Designing REST API contracts & PostgreSQL schemas",
    desc: "Deriving DDL schemas, index configurations, and OpenAPI 3.1 endpoints...",
    duration: "active",
  },
  {
    num: 5,
    title: "Mapping frontend component hierarchy & state flow",
    desc: "Pending AST entity stabilization from Step 4.",
    duration: "queued",
  },
  {
    num: 6,
    title: "Evaluating security edge cases, rate limits & NFRs",
    desc: "Security audit rule packs: OWASP Top 10 + JWT strict rotation.",
    duration: "queued",
  },
  {
    num: 7,
    title: "Compiling final Markdown specification",
    desc: "Single source of truth markdown bundle export for team repository.",
    duration: "queued",
  },
];

export default function CompilingView({
  onCancel,
  onPreview,
  tone = "Technical & Lean",
  audience = "Solo Dev / AI Coder",
}: CompilingViewProps) {
  const [seconds, setSeconds] = useState(0.8);
  const [activeStage, setActiveStage] = useState(4);
  const [progress, setProgress] = useState(58);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => +(prev + 0.1).toFixed(1));
    }, 100);

    const stageTimer = setInterval(() => {
      setActiveStage((prev) => (prev < 7 ? prev + 1 : prev));
      setProgress((prev) => (prev < 95 ? prev + 8 : 98));
    }, 450);

    return () => {
      clearInterval(timer);
      clearInterval(stageTimer);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden p-6 md:p-8 lg:p-10 flex flex-col gap-6">
      <div className="absolute -top-32 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-tertiary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Context & Pipeline Metadata Bar */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container p-4 rounded-xl shadow-md border border-outline-variant">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-secondary font-medium">workspace</span>
            <span className="text-outline">/</span>
            <span className="text-secondary font-medium">specs</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-semibold flex items-center gap-2">
              prd-7921
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] uppercase font-mono tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                Compiling...
              </span>
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-on-surface-variant font-mono">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-primary">target</span>
              <span>
                Audience: <strong className="text-on-surface">{audience}</strong>
              </span>
            </span>
            <span className="text-outline">•</span>
            <span>
              Depth: <strong className="text-on-surface">{tone}</strong>
            </span>
            <span className="text-outline">•</span>
            <span className="text-secondary">
              Spec ID: <span className="font-mono text-on-surface-variant">0x8F9C_PRD</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
          <div className="flex flex-col items-start md:items-end">
            <span className="text-[10px] uppercase tracking-widest text-secondary">Elapsed</span>
            <span className="text-sm font-semibold text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">timer</span>
              <span>{seconds.toFixed(1)}s</span>
            </span>
          </div>
          <div className="w-px h-8 bg-surface-container-highest" />
          <div className="flex flex-col items-start md:items-end">
            <span className="text-[10px] uppercase tracking-widest text-secondary">
              Est. Remaining
            </span>
            <span className="text-sm font-semibold text-on-surface">~1.2s</span>
          </div>
        </div>
      </div>

      {/* Overall Progression Metric Card */}
      <div className="w-full bg-surface-container-low p-5 rounded-xl flex flex-col gap-3 shadow-sm border border-outline-variant">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-secondary uppercase tracking-wider text-[11px]">
              Pipeline Synthesis
            </span>
            <span className="text-primary font-bold">Stage {activeStage} of 7</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-on-surface-variant">
              Generation Velocity: <strong className="text-tertiary">84 tok/s</strong>
            </span>
            <span className="text-outline">•</span>
            <span className="text-primary font-semibold">{progress}% Completed</span>
          </div>
        </div>
        <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-primary via-primary-fixed-dim to-tertiary rounded-full transition-all duration-300 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>
      </div>

      {/* Central Orchestrator & Live Stream Bento Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        {/* Stage-by-Stage Pipeline Orchestrator (7 Stages) */}
        <div className="lg:col-span-6 flex flex-col gap-3 bg-surface-container-low p-5 rounded-xl shadow-md border border-outline-variant">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">hub</span>
              <h2 className="text-xs uppercase tracking-widest font-mono text-on-surface font-semibold">
                Execution Graph
              </h2>
            </div>
            <span className="text-[11px] font-mono text-secondary">Deterministic DAG v2.4</span>
          </div>

          <div className="flex flex-col gap-2">
            {STAGES.map((stage) => {
              const isCompleted = stage.num < activeStage;
              const isActive = stage.num === activeStage;

              if (isCompleted) {
                return (
                  <div
                    key={stage.num}
                    className="flex items-start gap-3.5 p-3 rounded-lg bg-surface-container transition-all hover:bg-surface-container-high border border-outline-variant/30"
                  >
                    <div className="w-6 h-6 rounded-full bg-tertiary-container flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-tertiary text-sm">check</span>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-medium text-on-surface">
                          {stage.num}. {stage.title}
                        </span>
                        <span className="text-[10px] font-mono text-tertiary shrink-0">
                          {stage.duration}
                        </span>
                      </div>
                      <span className="text-[11px] text-secondary mt-0.5">{stage.desc}</span>
                    </div>
                  </div>
                );
              }

              if (isActive) {
                return (
                  <div
                    key={stage.num}
                    className="flex flex-col gap-2 p-3.5 rounded-lg bg-surface-container-highest shadow-inner border border-primary/40"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-semibold text-primary">
                            {stage.num}. {stage.title}
                          </span>
                          <span className="text-[10px] font-mono text-primary px-1.5 py-0.5 rounded bg-primary/10 animate-pulse">
                            STREAMING
                          </span>
                        </div>
                        <span className="text-[11px] text-on-surface-variant mt-0.5">
                          {stage.desc}
                        </span>
                      </div>
                    </div>

                    {/* Active streaming snippet box */}
                    <div className="mt-1 ml-9.5 p-2.5 rounded bg-surface-container-lowest font-mono text-[11px] text-on-surface-variant overflow-x-auto flex flex-col gap-1 shadow-inner border border-outline-variant">
                      <div className="flex items-center justify-between text-[10px] text-secondary">
                        <span className="flex items-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-xs">terminal</span>
                          <span>Active Token Emitter</span>
                        </span>
                        <span className="text-[10px] text-tertiary font-bold animate-pulse">
                          ● writing
                        </span>
                      </div>
                      <code className="text-on-surface text-[10px] leading-relaxed">
                        <span className="text-primary font-bold">POST</span> /api/v1/reviews/triage
                        <br />
                        <span className="text-secondary"># schema:</span>{" "}
                        <span className="text-tertiary">table pr_analyses</span> &#123; id: uuid, repo_id:
                        text, ast_hash: varchar, risk_score: float4 &#125;
                        <br />
                        <span className="text-secondary"># index:</span> idx_repo_ast{" "}
                        <span className="text-on-surface-variant">
                          ON pr_analyses (repo_id, ast_hash);
                        </span>
                      </code>
                    </div>
                  </div>
                );
              }

              // Pending stage
              return (
                <div
                  key={stage.num}
                  className="flex items-start gap-3.5 p-3 rounded-lg bg-surface-container/60 opacity-60 border border-outline-variant/20"
                >
                  <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-secondary text-sm">
                      schedule
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-medium text-secondary">
                        {stage.num}. {stage.title}
                      </span>
                      <span className="text-[10px] font-mono text-secondary">queued</span>
                    </div>
                    <span className="text-[11px] text-secondary mt-0.5">{stage.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Stream Output Telemetry Window */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Live Monospace Terminal Screen */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xl flex flex-col gap-3 border border-outline-variant">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-surface-container-highest" />
                  <span className="w-2.5 h-2.5 rounded-full bg-surface-container-highest" />
                  <span className="w-2.5 h-2.5 rounded-full bg-surface-container-highest" />
                </div>
                <span className="text-xs font-mono text-on-surface-variant font-medium ml-2">
                  live-stream.stdout
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <span className="text-secondary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                  Socket Connected
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                  UTF-8
                </span>
              </div>
            </div>

            {/* Monospace Code Output Terminal */}
            <div className="font-mono text-[11px] leading-relaxed text-on-surface-variant bg-surface-dim p-4 rounded-lg h-80 overflow-y-auto flex flex-col gap-1 select-all shadow-inner border border-outline-variant/40">
              <p className="text-secondary">[0.00s] &gt; Initializing SpecEngine runtime container...</p>
              <p className="text-secondary">[0.18s] &gt; Context ingestion verified (Tokens: 1,420 / 32k)</p>
              <p className="text-secondary">
                [0.52s] &gt; Requirement topology linked: [PRD-Auth, PRD-Triage, PRD-Billing]
              </p>
              <p className="text-tertiary">[1.13s] &gt; Gherkin acceptance criteria formulated cleanly.</p>
              <p className="text-secondary">
                [1.74s] &gt; Switching context to Schema Synthesis Protocol v1...
              </p>
              <p className="text-primary">[2.10s] &gt; Emitting DDL statements:</p>
              <p className="text-on-surface pl-3">CREATE TABLE IF NOT EXISTS pr_analyses (</p>
              <p className="text-on-surface pl-6">id UUID PRIMARY KEY DEFAULT gen_random_uuid(),</p>
              <p className="text-on-surface pl-6">repo_id VARCHAR(128) NOT NULL,</p>
              <p className="text-on-surface pl-6">ast_hash VARCHAR(64) NOT NULL,</p>
              <p className="text-on-surface pl-6">
                risk_score REAL DEFAULT 0.0 CHECK (risk_score &gt;= 0.0 AND risk_score &lt;= 1.0),
              </p>
              <p className="text-on-surface pl-6">metadata JSONB DEFAULT &apos;&#123;&#125;&apos;::jsonb,</p>
              <p className="text-on-surface pl-6">
                created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
              </p>
              <p className="text-on-surface pl-3">);</p>
              <p className="text-primary pl-3">
                &gt; CREATE INDEX idx_pr_analyses_lookup ON pr_analyses (repo_id, ast_hash);
              </p>
              <p className="text-secondary pl-3">
                &gt; Schema definition verified against PostgreSQL 16 standard.
              </p>
              <p className="text-on-surface-variant flex items-center gap-1">
                <span className="text-primary">&gt;</span> Generating schema endpoints for OpenAPI
                definition:
                <span className="inline-block w-2 h-3.5 bg-primary animate-pulse" />
              </p>
            </div>

            {/* Real-Time Hardware & Model Telemetry Strip */}
            <div className="grid grid-cols-4 gap-2 pt-2 text-center font-mono">
              <div className="bg-surface-container p-2 rounded-lg border border-outline-variant/30">
                <span className="text-[9px] uppercase tracking-wider text-secondary block">Tokens</span>
                <span className="text-xs font-semibold text-on-surface">3,248</span>
              </div>
              <div className="bg-surface-container p-2 rounded-lg border border-outline-variant/30">
                <span className="text-[9px] uppercase tracking-wider text-secondary block">
                  Latency/Tok
                </span>
                <span className="text-xs font-semibold text-tertiary">11.9ms</span>
              </div>
              <div className="bg-surface-container p-2 rounded-lg border border-outline-variant/30">
                <span className="text-[9px] uppercase tracking-wider text-secondary block">Memory</span>
                <span className="text-xs font-semibold text-on-surface">412 MB</span>
              </div>
              <div className="bg-surface-container p-2 rounded-lg border border-outline-variant/30">
                <span className="text-[9px] uppercase tracking-wider text-secondary block">
                  Confidence
                </span>
                <span className="text-xs font-semibold text-primary">99.4%</span>
              </div>
            </div>
          </div>

          {/* Latency Trend Sparkline Card */}
          <div className="bg-surface-container p-4 rounded-xl flex items-center justify-between gap-4 shadow-sm border border-outline-variant">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-secondary">
                Token Throughput Performance
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-mono font-bold text-on-surface">84.2</span>
                <span className="text-xs font-mono text-secondary">tok/sec stable</span>
              </div>
            </div>
            {/* Sparkline SVG */}
            <div className="w-36 h-10 shrink-0">
              <svg
                className="w-full h-full text-tertiary"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 144 40"
              >
                <path
                  d="M0 32 L16 30 L32 24 L48 28 L64 16 L80 18 L96 12 L112 14 L128 8 L144 10"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M0 32 L16 30 L32 24 L48 28 L64 16 L80 18 L96 12 L112 14 L128 8 L144 10 L144 40 L0 40 Z"
                  fill="currentColor"
                  fillOpacity="0.08"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Action Strip */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-mono text-secondary hover:text-on-surface transition-colors flex items-center gap-2 shadow-sm border border-outline-variant cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">terminal</span>
            <span>View Raw Log Stream</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            type="button"
            className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-error/20 hover:text-error text-xs font-mono text-on-surface-variant transition-colors flex items-center gap-2 border border-outline-variant cursor-pointer"
          >
            <span>Cancel Compilation</span>
            <kbd className="text-[10px] bg-surface-container-highest px-1.5 py-0.5 rounded text-secondary">
              Esc
            </kbd>
          </button>
          {onPreview && (
            <button
              onClick={onPreview}
              type="button"
              className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-medium text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              <span>Preview Output</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
