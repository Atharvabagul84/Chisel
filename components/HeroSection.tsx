"use client";

const STEPS = [
  {
    number: "01",
    icon: "✍️",
    label: "Paste your note",
    desc: "Raw bullet points, voice-note transcript, or half-baked idea — anything works.",
    accent: "#8b5cf6",
  },
  {
    number: "02",
    icon: "⚡",
    label: "Claude structures it",
    desc: "AI transforms your thoughts into a complete, structured product spec instantly.",
    accent: "#38bdf8",
  },
  {
    number: "03",
    icon: "🚀",
    label: "Ship to your team",
    desc: "Copy, export as Markdown, or share — ready for your engineering sprint.",
    accent: "#e879f9",
  },
];

export default function HeroSection() {
  return (
    <div className="text-center mb-14 relative z-10">

      {/* Logo mark */}
      <div className="inline-flex items-center justify-center mb-8 fade-in">
        <div className="relative">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #38bdf8)",
              boxShadow: "0 0 40px rgba(124,58,237,0.4), 0 0 80px rgba(14,165,233,0.15)",
            }}
          >
            ⌁
          </div>
          <div
            className="absolute inset-0 rounded-2xl opacity-50 blur-xl"
            style={{ background: "linear-gradient(135deg, #7c3aed, #38bdf8)" }}
          />
        </div>
      </div>

      {/* Eyebrow */}
      <div className="flex items-center justify-center gap-3 mb-5 fade-in fade-in-d1">
        <div className="chip chip-violet">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block" />
          Powered by Claude AI
        </div>
        <div className="chip chip-sky">Beta</div>
      </div>

      {/* Wordmark */}
      <h1 className="mb-2 fade-in fade-in-d1" style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05 }}>
        <span className="gradient-text">Chisel</span>
      </h1>

      {/* Tagline */}
      <p className="text-xl md:text-2xl font-medium mb-4 fade-in fade-in-d2" style={{ color: "#cbd5e1", letterSpacing: "-0.01em" }}>
        Sculpt rough ideas into{" "}
        <span className="gradient-text-subtle font-semibold">production-ready specs.</span>
      </p>

      {/* Sub-tagline */}
      <p className="text-base max-w-xl mx-auto leading-relaxed mb-10 fade-in fade-in-d2" style={{ color: "#64748b" }}>
        Paste a voice note, bullet dump, or half-baked idea. Claude structures it into
        User Stories, API specs, UI components, and Acceptance Criteria — in seconds.
      </p>

      {/* How it works — 3 steps */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto fade-in fade-in-d3">
        {STEPS.map((step, i) => (
          <div key={step.number} className="relative">
            {/* Connector line between steps */}
            {i < STEPS.length - 1 && (
              <div
                className="absolute hidden md:block"
                style={{
                  top: "22px",
                  left: "calc(50% + 22px)",
                  right: "calc(-50% + 22px)",
                  height: "1px",
                  background: `linear-gradient(90deg, ${step.accent}80, ${STEPS[i + 1].accent}50)`,
                }}
              />
            )}
            <div
              className="glass-section p-4 text-center relative"
              style={{ borderTopColor: step.accent, borderTopWidth: "2px" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mx-auto mb-2"
                style={{ background: `${step.accent}18`, border: `1px solid ${step.accent}35` }}
              >
                {step.icon}
              </div>
              <div className="text-xs font-mono mb-1" style={{ color: step.accent }}>{step.number}</div>
              <div className="text-sm font-semibold mb-1" style={{ color: "#e2e8f0" }}>{step.label}</div>
              <div className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
