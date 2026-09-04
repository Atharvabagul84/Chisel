"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import IdeaEditor from "@/components/IdeaEditor";
import CompilingView from "@/components/CompilingView";
import SpecDocumentView from "@/components/SpecDocumentView";
import { PRD, Tone, Audience } from "@/types/prd";
import { MOCK_PRD } from "@/lib/mock-prd";

type ViewState = "editor" | "compiling" | "document";

export default function Home() {
  const [view, setView] = useState<ViewState>("editor");
  const [prd, setPRD] = useState<PRD | null>(null);
  const [isDemo, setIsDemo] = useState(true);
  const [currentTone, setCurrentTone] = useState<Tone>("technical");
  const [currentAudience, setCurrentAudience] = useState<Audience>("dev-team");

  // Load default initial PRD for instant exploration if user clicks Active Specs
  useEffect(() => {
    setPRD(MOCK_PRD);
  }, []);

  async function handleGenerate(note: string, tone: Tone, audience: Audience) {
    setCurrentTone(tone);
    setCurrentAudience(audience);
    setView("compiling");

    try {
      const res = await fetch("/api/generate-prd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note, tone, audience }),
      });

      const data = await res.json();

      if (res.ok && data.prd) {
        setPRD(data.prd);
        setIsDemo(!!data.demo);
        // Ensure user sees the compiling telemetry pipeline for a brief satisfying moment
        setTimeout(() => {
          setView("document");
        }, 1200);
      } else {
        // Fallback to mock PRD if error or demo
        setPRD(MOCK_PRD);
        setTimeout(() => {
          setView("document");
        }, 1200);
      }
    } catch {
      setPRD(MOCK_PRD);
      setTimeout(() => {
        setView("document");
      }, 1200);
    }
  }

  function handleNewSpec() {
    setView("editor");
  }

  function handleCancelCompilation() {
    setView("editor");
  }

  // Keyboard shortcut listener: Cmd/Ctrl + N for new spec
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        handleNewSpec();
      }
      if (e.key === "Escape" && view === "compiling") {
        e.preventDefault();
        handleCancelCompilation();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [view]);

  return (
    <div className="bg-background font-body text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      {/* Top Header */}
      <Header
        isDemo={isDemo}
        onNewSpec={handleNewSpec}
        activeNav={view}
        onNavigate={(nav) => {
          if (nav === "specs" && prd) setView("document");
          if (nav === "editor") setView("editor");
        }}
      />

      {/* Fixed Left Sidebar */}
      <Sidebar
        currentView={view}
        onSelectView={(targetView) => setView(targetView)}
        hasDocument={!!prd}
        tokenCount={428}
      />

      {/* Main Content Area */}
      <div className="md:pl-64">
        <main className="w-full pt-14 bg-background min-h-screen border-t border-outline-variant">
          {view === "editor" && (
            <IdeaEditor onGenerate={handleGenerate} isLoading={false} />
          )}

          {view === "compiling" && (
            <CompilingView
              onCancel={handleCancelCompilation}
              onPreview={() => setView("document")}
              tone={currentTone === "technical" ? "Technical & Lean" : "Balanced"}
              audience={
                currentAudience === "dev-team"
                  ? "Solo Dev / AI Coder"
                  : currentAudience === "pm"
                  ? "Agency / Client"
                  : "Seed Pitch"
              }
            />
          )}

          {view === "document" && prd && (
            <SpecDocumentView prd={prd} onRefine={() => setView("editor")} />
          )}
        </main>
      </div>
    </div>
  );
}
