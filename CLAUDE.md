# ⌁ Chisel — Developer & AI Agent Guidelines

Chisel is an AI Product Architecture Studio built on Next.js 16 (App Router), React 19, Tailwind CSS v4, and Claude 3.7 Sonnet. It transforms raw, unstructured founder voice transcripts and notes into structured 5-pillar engineering specifications.

## 🛠️ Commands

```bash
# Run local dev server (Turbopack)
npm run dev

# Build production bundle
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## 🏗️ Architectural Topology

- **Client Orchestrator (`app/page.tsx`):** State machine managing three main view states (`editor` → `compiling` → `document`).
- **Studio Shell (`components/Header.tsx`, `components/Sidebar.tsx`):** Fixed navigation shell modeled after Linear and Datadog workbench tools.
- **Canvas (`components/IdeaEditor.tsx`):** Monospace input canvas with character/token budget estimator, realistic architecture presets (#1 GitHub Triage, #2 Stripe Billing, #3 Rust Vector Engine), and context tuning selectors (Audience × Depth).
- **Compilation Telemetry (`components/CompilingView.tsx`):** 7-stage DAG execution graph with live token emitter, hardware telemetry (tok/s, latency, memory), and throughput sparkline SVG.
- **Production Spec (`components/SpecDocumentView.tsx`):** 5-pillar specification:
  1. Executive Scope & Quantitative Target Bento
  2. Gherkin BDD Scenarios with Interactive Verification Matrix
  3. REST API Contracts, TypeScript `schema.ts`, and PostgreSQL DDL
  4. ASCII Component Tree with Live Interactive Sandbox Widget
  5. Non-Functional SLAs, Mitigation Matrix, and Cryptographic Sign-Off Ledger
- **API Handler (`app/api/generate-prd/route.ts`):** Edge-ready serverless route handler supporting Claude 3.7 Sonnet (`claude-3-7-sonnet-20250219`) with automatic zero-key demo fallback.
- **Documentation (`docs/INTERVIEW_PITCH_AND_ARCHITECTURE.md`):** Complete interview pitches, feature intentionality, 60-second screen-share playbook, and 10 answered Q&As.

## 🎨 Design System & Conventions

- **Theme:** Obsidian dark mode (`#09090b` canvas, `#121215` card surfaces, `#1e1e24` borders, `#a78bfa` primary accent, `#34d399` tertiary accent).
- **Typography:** Geist & Geist Mono via Google Fonts.
- **Icons:** Material Symbols Outlined with optical sizing.
- **Zero-Crash Resilience:** All LLM outputs must be defensively sanitized and validated.
