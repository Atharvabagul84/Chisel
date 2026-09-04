"use client";

import { useState } from "react";
import { Tone, Audience } from "@/types/prd";

interface IdeaEditorProps {
  onGenerate: (note: string, tone: Tone, audience: Audience) => void;
  isLoading: boolean;
}

const SAMPLE_TRANSCRIPTS = [
  {
    label: "#1 GitHub PR Triage",
    text: "Build an AI-powered code review and PR triage bot for GitHub teams. Founders and tech leads connect their repos via GitHub App. When a PR is opened, the bot parses the AST diff, flags security vulnerabilities, detects breaking DB migrations, checks API backward compatibility, and scores test coverage. It writes an executive PR summary directly on GitHub and posts interactive Slack alerts with one-click approve/block buttons for critical findings.",
  },
  {
    label: "#2 B2B Stripe Billing",
    text: "Architect a multi-tenant B2B subscription billing microservice using Stripe Customer Portal and webhooks. Provide automatic seat reconciliation against Google Workspace SSO, tiered usage meters, grace-period downgrade logic, and idempotent invoice event processing.",
  },
  {
    label: "#3 Rust Vector Engine",
    text: "Build an ultra-low-latency semantic vector search microservice in Rust. It should expose gRPC endpoints for document indexing, chunk markdown via tree-sitter, compute embeddings asynchronously via dedicated worker pool, and query Qdrant with hybrid lexical+dense reranking under 40ms.",
  },
];

export default function IdeaEditor({ onGenerate, isLoading }: IdeaEditorProps) {
  const [note, setNote] = useState(SAMPLE_TRANSCRIPTS[0].text);
  const [audience, setAudience] = useState<"solo" | "agency" | "pitch">("solo");
  const [depth, setDepth] = useState<"lean" | "enterprise">("lean");
  const [copied, setCopied] = useState(false);

  const charCount = note.length;
  const tokenCount = Math.max(0, Math.round(charCount / 4.4));

  function handleCopy() {
    if (!note) return;
    navigator.clipboard.writeText(note);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleSubmit() {
    if (!note.trim() || isLoading) return;

    // Map to API Tone & Audience
    const mappedTone: Tone = depth === "lean" ? "technical" : "balanced";
    const mappedAudience: Audience =
      audience === "solo" ? "dev-team" : audience === "agency" ? "pm" : "founder";

    onGenerate(note, mappedTone, mappedAudience);
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto px-6 py-12 flex flex-col gap-10">
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-52 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Workspace Header */}
      <header className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant text-[11px] font-mono text-on-surface-variant">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
          <span className="tracking-wide">SpecEngine v2.4</span>
          <span className="text-outline select-none">/</span>
          <span className="text-tertiary">Ready</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-headline font-semibold tracking-tight text-on-surface">
          Turn rough ideas into build-ready specs.
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed font-body">
          Transform messy founder voice notes, product briefs, and unstructured brain dumps into
          production-grade engineering blueprints in seconds.
        </p>
      </header>

      {/* The Professional Idea Editor Canvas */}
      <section className="flex flex-col rounded-xl bg-surface-container border border-outline-variant shadow-xl shadow-surface-container-lowest/60 transition-all duration-200 focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/40">
        {/* Top Action Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-surface-container-low rounded-t-xl border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[17px] text-primary">mic_none</span>
            <span className="text-xs font-mono text-on-surface font-medium">
              Input: Voice Transcript / Brain Dump
            </span>
            <span className="text-outline text-xs select-none">|</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-secondary bg-surface-container px-2 py-0.5 rounded border border-outline-variant/60">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
              Auto-detect architecture
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[15px]">attach_file</span>
              <span>Attach Audio / MD</span>
              <input
                type="file"
                accept=".mp3,.wav,.m4a,.md,.txt"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const text = event.target?.result as string;
                      if (text) setNote(text);
                    };
                    reader.readAsText(file);
                  }
                }}
              />
            </label>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              title="Copy raw input"
              type="button"
            >
              <span className={`material-symbols-outlined text-[15px] ${copied ? "text-tertiary" : ""}`}>
                {copied ? "check" : "content_copy"}
              </span>
            </button>
          </div>
        </div>

        {/* Main Textarea Surface */}
        <div className="relative p-5">
          <textarea
            id="spec-input"
            rows={7}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Paste transcribed rambling, notes, PRD drafts, or architecture voice memo..."
            spellCheck={false}
            className="w-full bg-transparent resize-none font-mono text-sm leading-relaxed text-on-surface placeholder:text-secondary focus:outline-none selection:bg-primary-container selection:text-on-primary-container"
          />
        </div>

        {/* Editor Status & Token Metrics Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-surface-container-low rounded-b-xl border-t border-outline-variant text-[11px] font-mono">
          <div className="flex items-center gap-3 text-secondary">
            <span className="text-on-surface-variant font-medium">{charCount} chars</span>
            <span className="text-outline">·</span>
            <span className="text-on-surface-variant">~{tokenCount} tokens</span>
            <span className="text-outline">·</span>
            <span className="text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">terminal</span>
              AST + Webhook parsed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-secondary text-[10px] uppercase tracking-wider">Engine:</span>
            <span className="text-on-surface-variant font-semibold">Chisel SpecEngine v2.4</span>
          </div>
        </div>
      </section>

      {/* Sample Voice Notes Pill Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs font-mono">
        <span className="text-secondary uppercase text-[10px] tracking-widest shrink-0 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[13px] text-secondary">graphic_eq</span>
          Sample transcripts:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_TRANSCRIPTS.map((sample, idx) => {
            const isSelected = note === sample.text;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setNote(sample.text)}
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant hover:border-primary/40 text-on-surface-variant hover:text-on-surface transition-all text-xs text-left cursor-pointer"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? "bg-primary" : "bg-secondary group-hover:bg-primary"
                  } transition-colors`}
                />
                <span>{sample.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Precision Context Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-surface-container-low border border-outline-variant">
        {/* Target Audience Selector */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-medium uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-primary">group</span>
              Target Audience
            </label>
            <span className="text-[10px] font-mono text-on-surface-variant">Output format preset</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setAudience("solo")}
              className={`text-left p-2.5 rounded-lg border transition-all flex flex-col justify-between gap-1.5 group cursor-pointer ${
                audience === "solo"
                  ? "bg-surface-container border-primary/70 text-on-surface shadow-sm"
                  : "bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-outline"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium font-headline">Solo / AI Coder</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    audience === "solo"
                      ? "bg-primary ring-2 ring-primary/30"
                      : "bg-transparent ring-1 ring-outline"
                  }`}
                />
              </div>
              <p className="text-[10px] text-on-surface-variant leading-tight font-mono">
                Lean, implementation-ready schema &amp; direct code steps.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setAudience("agency")}
              className={`text-left p-2.5 rounded-lg border transition-all flex flex-col justify-between gap-1.5 group cursor-pointer ${
                audience === "agency"
                  ? "bg-surface-container border-primary/70 text-on-surface shadow-sm"
                  : "bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-outline"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium font-headline">Agency / Client</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    audience === "agency"
                      ? "bg-primary ring-2 ring-primary/30"
                      : "bg-transparent ring-1 ring-outline"
                  }`}
                />
              </div>
              <p className="text-[10px] text-secondary leading-tight font-mono">
                Milestones, acceptance contracts &amp; phase deliverables.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setAudience("pitch")}
              className={`text-left p-2.5 rounded-lg border transition-all flex flex-col justify-between gap-1.5 group cursor-pointer ${
                audience === "pitch"
                  ? "bg-surface-container border-primary/70 text-on-surface shadow-sm"
                  : "bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-outline"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium font-headline">Seed Pitch</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    audience === "pitch"
                      ? "bg-primary ring-2 ring-primary/30"
                      : "bg-transparent ring-1 ring-outline"
                  }`}
                />
              </div>
              <p className="text-[10px] text-secondary leading-tight font-mono">
                Product clarity, moat strategy &amp; core MVP metrics.
              </p>
            </button>
          </div>
        </div>

        {/* Output Depth & Tone Selector */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-medium uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-primary">tune</span>
              Output Depth / Tone
            </label>
            <span className="text-[10px] font-mono text-on-surface-variant">Specification fidelity</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDepth("lean")}
              className={`text-left p-2.5 rounded-lg border transition-all flex flex-col justify-between gap-1.5 group cursor-pointer ${
                depth === "lean"
                  ? "bg-surface-container border-primary/70 text-on-surface shadow-sm"
                  : "bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-outline"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium font-headline">Technical &amp; Lean</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    depth === "lean"
                      ? "bg-primary ring-2 ring-primary/30"
                      : "bg-transparent ring-1 ring-outline"
                  }`}
                />
              </div>
              <p className="text-[10px] text-on-surface-variant leading-tight font-mono">
                Crisp endpoints, zero fluff, direct DB schemas.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDepth("enterprise")}
              className={`text-left p-2.5 rounded-lg border transition-all flex flex-col justify-between gap-1.5 group cursor-pointer ${
                depth === "enterprise"
                  ? "bg-surface-container border-primary/70 text-on-surface shadow-sm"
                  : "bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-outline"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium font-headline">Comprehensive Spec</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    depth === "enterprise"
                      ? "bg-primary ring-2 ring-primary/30"
                      : "bg-transparent ring-1 ring-outline"
                  }`}
                />
              </div>
              <p className="text-[10px] text-secondary leading-tight font-mono">
                Complete NFRs, SLA tiers, edge cases &amp; observability.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Action & Execution Area */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={!note.trim() || isLoading}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg bg-primary hover:bg-primary-fixed-dim text-on-primary font-medium text-sm transition-all shadow-md shadow-primary/20 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <span className="material-symbols-outlined text-base group-hover:rotate-12 transition-transform">
              bolt
            </span>
            <span>{isLoading ? "Compiling..." : "Generate Specification"}</span>
            <kbd className="ml-1 inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded bg-primary-container text-on-primary-container border border-primary/30">
              ⌘↵
            </kbd>
          </button>

          <button
            onClick={() => {
              setNote(
                "Build an edge-deployed real-time collaborative whiteboarding API with WebSocket broadcast, CRDT state sync (Yjs), Redis state persistence, and fine-grained room-based RBAC."
              );
              handleSubmit();
            }}
            type="button"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg bg-surface-container border border-outline-variant hover:bg-surface-container-high hover:border-outline text-xs font-mono text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-tertiary">play_circle</span>
            <span>Run Demo Sandbox</span>
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono text-secondary">
          <button
            onClick={() => setNote("")}
            type="button"
            className="hover:text-error transition-colors px-2 py-1 rounded hover:bg-error-container/20 text-xs flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">backspace</span>
            <span>Clear</span>
          </button>
          <span className="text-outline select-none">·</span>
          <span className="text-[11px] text-on-surface-variant">
            Press <kbd className="px-1 rounded bg-surface-container border border-outline-variant text-[10px]">⌘</kbd> +{" "}
            <kbd className="px-1 rounded bg-surface-container border border-outline-variant text-[10px]">↵</kbd> to compile
          </span>
        </div>
      </div>
    </div>
  );
}
