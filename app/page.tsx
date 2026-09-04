"use client";

import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import InputPanel from "@/components/InputPanel";
import PRDOutput from "@/components/PRDOutput";
import { PRD, Tone, Audience } from "@/types/prd";

type AppState = "idle" | "loading" | "done" | "error";

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [prd, setPRD] = useState<PRD | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleGenerate(note: string, tone: Tone, audience: Audience) {
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/generate-prd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note, tone, audience }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setPRD(data.prd);
      setIsDemo(data.demo);
      setState("done");

      // Smooth scroll to output
      setTimeout(() => {
        document.getElementById("prd-output")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error occurred.");
      setState("error");
    }
  }

  return (
    <main className="relative min-h-screen w-full">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Content */}
      <div
        className="relative z-10"
        style={{
          width: "100%",
          maxWidth: "820px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <HeroSection />

        {/* Input */}
        <InputPanel onGenerate={handleGenerate} isLoading={state === "loading"} />

        {/* Loading skeleton */}
        {state === "loading" && (
          <div className="mt-8 space-y-4 fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(124, 58, 237, 0.12)", border: "1px solid rgba(124, 58, 237, 0.25)" }}>
                <div className="w-4 h-4 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
                <span className="text-sm" style={{ color: "#a78bfa" }}>Chiseling your spec…</span>
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-5">
                <div className="skeleton h-4 w-32 mb-4" />
                <div className="skeleton h-3 w-full mb-2" />
                <div className="skeleton h-3 w-4/5 mb-2" />
                <div className="skeleton h-3 w-3/5" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="mt-6 rounded-xl p-4 fade-in" style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            <div className="flex items-center gap-2 mb-1">
              <span>⚠️</span>
              <span className="text-sm font-semibold" style={{ color: "#f87171" }}>Error</span>
            </div>
            <p className="text-sm" style={{ color: "#fca5a5" }}>{errorMsg}</p>
          </div>
        )}

        {/* PRD Output */}
        {state === "done" && prd && (
          <div id="prd-output" className="mt-8">
            <PRDOutput prd={prd} isDemo={isDemo} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-10" style={{ color: "#334155", fontSize: "0.72rem" }}>
        <hr className="glow-divider mb-6" />
        <span>⌁ </span>
        <strong style={{ color: "#475569" }}>Chisel</strong>
        {" — built by "}
        <a href="https://antimatrix.in" target="_blank" rel="noopener" style={{ color: "#8b5cf6" }}>
          Atharva Bagul
        </a>
        {" · Vibe-coded with Claude + Next.js"}
      </footer>
    </main>
  );
}
