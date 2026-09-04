"use client";

import { useState } from "react";
import { Tone, Audience } from "@/types/prd";

interface InputPanelProps {
  onGenerate: (note: string, tone: Tone, audience: Audience) => void;
  isLoading: boolean;
}

const TONE_OPTIONS: { value: Tone; label: string; icon: string; desc: string }[] = [
  { value: "technical",     label: "Technical",     icon: "⚙️", desc: "Full API specs & TS types" },
  { value: "balanced",      label: "Balanced",      icon: "⚖️", desc: "Professional + plain-English" },
  { value: "non-technical", label: "Non-Technical", icon: "💬", desc: "Plain English, no jargon" },
];

const AUDIENCE_OPTIONS: { value: Audience; label: string; icon: string }[] = [
  { value: "dev-team", label: "Dev Team",   icon: "👩‍💻" },
  { value: "founder",  label: "Founder",    icon: "🚀" },
  { value: "pm",       label: "Product Manager", icon: "📋" },
];

const EXAMPLE_NOTE = `We need a feature where our AI automatically assigns tasks to the right people on the team. The idea: when a new task gets created, the system looks at everyone's current workload, their skills (tags on their profile), and past performance to suggest who should take it. A team lead can confirm or override the suggestion with one click. Every override should be logged so the AI can learn and improve. Important: if someone is already overloaded, they shouldn't be suggested. This should plug into our existing project management task creation flow.`;

export default function InputPanel({ onGenerate, isLoading }: InputPanelProps) {
  const [note, setNote]         = useState("");
  const [tone, setTone]         = useState<Tone>("balanced");
  const [audience, setAudience] = useState<Audience>("dev-team");
  const [showSettings, setShowSettings] = useState(false);

  const charCount  = note.length;
  const canGenerate = charCount >= 20 && !isLoading;

  return (
    <div className="glass-violet p-6 md:p-8 relative z-10 fade-in fade-in-d3">

      {/* Panel header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "#8b5cf6" }}>
            Step 1 — Your Note
          </p>
          <h2 className="text-lg font-bold" style={{ color: "#e2e8f0" }}>
            What do you want to build?
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
            Rough is fine. Brain dumps, voice-note transcripts, bullet points — all welcome.
          </p>
        </div>
        <button
          onClick={() => setNote(EXAMPLE_NOTE)}
          className="btn-ghost text-xs px-3 py-2 shrink-0 ml-4 flex items-center gap-1.5"
        >
          <span>✦</span> Load Example
        </button>
      </div>

      {/* Textarea */}
      <textarea
        id="founder-note-input"
        className="note-textarea p-4 mb-2"
        rows={9}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={isLoading}
        placeholder={`Start typing or paste a note...\n\n"We need a way for users to invite teammates via email with role-based access..."\n\n"The onboarding is too long — users drop off at step 3, we need a progress bar and a skip option..."\n\n"Build a Slack-style notification system with @mentions and read receipts..."`}
      />

      {/* Char count + settings toggle */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs tabular-nums" style={{ color: charCount < 20 ? "#f87171" : "#475569" }}>
          {charCount < 20
            ? `${20 - charCount} more characters needed`
            : `${charCount} characters ✓`}
        </span>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: showSettings ? "#8b5cf6" : "#475569" }}
        >
          <span style={{ fontSize: "0.6rem" }}>{showSettings ? "▲" : "▼"}</span>
          Customise output
        </button>
      </div>

      {/* Collapsible settings */}
      {showSettings && (
        <div
          className="mb-6 pt-5 space-y-5 fade-in"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Tone */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest mb-2.5 block" style={{ color: "#64748b" }}>
              Output Tone
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className="p-3 rounded-xl text-left transition-all"
                  style={{
                    background: tone === t.value ? "rgba(124,58,237,0.16)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${tone === t.value ? "rgba(124,58,237,0.45)" : "rgba(255,255,255,0.07)"}`,
                    boxShadow: tone === t.value ? "0 0 20px rgba(124,58,237,0.12)" : "none",
                  }}
                >
                  <div className="text-base mb-1">{t.icon}</div>
                  <div className="text-sm font-semibold" style={{ color: tone === t.value ? "#a78bfa" : "#e2e8f0" }}>
                    {t.label}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#475569" }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest mb-2.5 block" style={{ color: "#64748b" }}>
              Primary Audience
            </label>
            <div className="flex gap-2.5">
              {AUDIENCE_OPTIONS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => setAudience(a.value)}
                  className="flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: audience === a.value ? "rgba(14,165,233,0.14)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${audience === a.value ? "rgba(14,165,233,0.4)" : "rgba(255,255,255,0.07)"}`,
                    color: audience === a.value ? "#38bdf8" : "#64748b",
                  }}
                >
                  <span className="mr-1.5">{a.icon}</span>{a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      <hr className="glow-divider mb-5" />

      {/* CTA */}
      <button
        id="generate-prd-btn"
        className="btn-primary w-full py-4 text-[15px] flex items-center justify-center gap-3"
        onClick={() => onGenerate(note, tone, audience)}
        disabled={!canGenerate}
        style={{ opacity: canGenerate ? 1 : 0.4, cursor: canGenerate ? "pointer" : "not-allowed" }}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/25 border-t-white rounded-full animate-spin" />
            <span>Chiseling your spec…</span>
          </>
        ) : (
          <>
            <span>⌁ Chisel This Note</span>
          </>
        )}
      </button>
    </div>
  );
}
