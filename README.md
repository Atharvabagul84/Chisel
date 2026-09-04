# ⌁ Chisel — Sculpt Rough Ideas into Production-Ready Specs

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://founder-brief-omega.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Anthropic Claude](https://img.shields.io/badge/Claude_3.5-Sonnet-D97706?style=for-the-badge&logo=anthropic)](https://www.anthropic.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

> **Chisel** is an AI-powered developer tool that takes messy founder voice notes, audio transcripts, and rapid brain dumps and sculpts them into complete, production-ready Product Requirement Documents (PRDs) — including user stories, REST API specifications, UI component trees, and acceptance criteria.

🔗 **Live Deployment:** [https://founder-brief-omega.vercel.app](https://founder-brief-omega.vercel.app)

---

## ⚡ The Problem: The Founder–Engineer Bottleneck

Early-stage founders, product managers, and builders often have crystal-clear mental models of features, but their thoughts live in unstructured formats:
- 🎙️ 2:00 AM voice note transcriptions
- 📝 Bulleted braindumps filled with jargon and shorthand
- 💬 Scrambled WhatsApp/Slack threads

Engineers and AI agents (Cursor, Claude Code, GitHub Copilot) need **deterministic, structured technical constraints** — user stories, database schemas, API contracts, and edge cases. 

Translating rough vision into engineering specs typically takes **hours or days of meetings**. **Chisel does it in under 3 seconds.**

---

## ✨ Features

- **🎙️ Raw Transcription Ingestion:** Paste audio transcripts from Otter.ai, Whisper, Apple Voice Memos, or rough bullet points.
- **⚡ 1-Click Voice Note Sample:** Includes a pre-built realistic marketplace voice note demo for immediate testing.
- **🎛️ Context & Audience Tuning:**
  - **Audience:** *Solo Dev / AI Coder* (lean & code-focused), *Agency / Freelancers* (milestones & contracts), or *Seed Pitch* (product-led).
  - **Tone & Depth:** *Technical & Lean* vs. *Comprehensive & Enterprise-Ready*.
- **🏛️ 5-Pillar Spec Architecture:**
  1. **Executive Scope & Problem:** Core problem statement, proposed solution, and explicit out-of-scope boundaries.
  2. **User Stories & Acceptance Criteria:** Formatted in industry-standard Gherkin syntax (`Given / When / Then`).
  3. **REST API & Schema Specifications:** Concrete HTTP methods (`GET`, `POST`, `PATCH`), endpoints, JSON payload structures, and response codes.
  4. **Frontend Component Hierarchy:** React/Next.js component trees, parent-child mappings, and local/global state management requirements.
  5. **Edge Cases & Non-Functional Requirements:** Rate limiting, auth failure handling, latency budgets, and security considerations.
- **🔄 Dual-Engine Architecture (Zero-Key Demo + Claude Live):**
  - **Demo Mode (Zero-Config):** Works out of the box with zero environment variables or API keys. Uses realistic deterministic generation with simulated streaming delay.
  - **Live Mode:** Seamlessly connects to `claude-3-5-sonnet-20241022` whenever an `ANTHROPIC_API_KEY` is provided.
- **📋 Developer-First Export:**
  - **Copy Markdown:** Copy individual sections or the entire PRD to clipboard.
  - **Download `.md`:** Instant export of a structured `.md` file ready to drop into **Cursor**, **Claude Code**, **Linear**, or **Notion**.
  - **Web Share:** Share specs with collaborators via native device share or direct links.
- **🎨 Glassmorphic Dark-Mode UI:** Dual violet/sky atmospheric glow, custom typography via Inter, micro-animations, and responsive layout constraints.

---

## 🏗️ Architecture & Flow

```mermaid
flowchart TD
    A[Founder Voice Note / Brain Dump] --> B[Chisel Frontend Interface\nNext.js 16 + Tailwind v4]
    B --> C{Context Controls\nAudience + Tone}
    C --> D[POST /api/generate-prd]
    
    D --> E{API Key Configured?}
    
    E -- Yes --> F[Claude 3.5 Sonnet Engine\nPrompt Architecture + JSON Schema Enforcement]
    E -- No --> G[Deterministic Demo Engine\nRealistic Spec Fallback + Simulation Delay]
    
    F --> H[Schema Validation & Sanitization]
    G --> H
    
    H --> I[PRD State Machine\n5-Pillar Reactive View]
    
    I --> J[1-Click Markdown Export]
    I --> K[AI IDEs: Cursor / Claude Code]
    I --> L[Engineering Sprint & Task Tracker]
```

---

## 🛠️ Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16.3.4 (App Router)](https://nextjs.org/) | Serverless API routes, React Server Components, fast edge execution |
| **UI Library** | [React 19](https://react.dev/) | Client-side reactive state machine and interactive accordions |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern `@theme` tokens, glassmorphism, CSS variables, dark palette |
| **LLM Provider** | [Anthropic Claude 3.5 Sonnet](https://www.anthropic.com/) | High-precision prompt following, systems architecture, and JSON generation |
| **SDK** | `@anthropic-ai/sdk` | Official TypeScript SDK for Anthropic APIs |
| **Typography** | Inter | Clean, readable engineering font |
| **Deployment** | [Vercel](https://vercel.com/) | Instant edge hosting, zero-maintenance CI/CD |

---

## 📁 Repository Structure

```
chisel/
├── app/
│   ├── api/
│   │   └── generate-prd/
│   │       └── route.ts          # Serverless route handler (Claude 3.5 Sonnet + Demo mode)
│   ├── globals.css               # Tailwind v4 theme, gradients, glassmorphism tokens
│   ├── layout.tsx                # App root layout, SEO metadata, Inter font
│   └── page.tsx                  # Main application state machine & centered container
├── components/
│   ├── HeroSection.tsx           # Logo mark, headline, 3-step value proposition
│   ├── InputPanel.tsx            # Transcript textarea, audience/tone toggles, CTA
│   └── PRDOutput.tsx             # 5-section color-coded PRD viewer, copy & export tools
├── lib/
│   ├── mock-prd.ts               # Standalone fallback PRD for demo mode
│   └── prompts.ts                # System prompt engineering & JSON schema guidelines
├── types/
│   └── prd.ts                    # Strict TypeScript interfaces for PRD structures
├── public/                       # Static public assets & icons
├── package.json                  # Dependencies & scripts
└── tsconfig.json                 # Strict TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or later
- npm, yarn, or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/atharva-bagul/chisel.git
cd chisel
```

### 2. Install Dependencies
```bash
npm install
```

### 3. (Optional) Configure Claude API Key
> **Note:** Chisel includes an automated **Demo Mode**. If no API key is supplied, the app runs perfectly using realistic simulated generation.

To use live Claude 3.5 Sonnet generation, create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
Add your Anthropic API key:
```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🧠 Prompt Engineering Philosophy

The core intelligence behind Chisel is encapsulated in [`lib/prompts.ts`](lib/prompts.ts):
- **Principal Architect Persona:** Claude is instructed to act as a Principal Software Architect who refuses generic fluff and demands technical precision.
- **Strict JSON Contract:** Uses negative prompting to eliminate preamble, markdown wrapping (` ```json `), or commentary, ensuring 100% reliable programmatic parsing.
- **Gherkin User Story Formatting:** Every user story must adhere to `Given/When/Then` acceptance criteria so engineering teams can immediately write automated tests.
- **Actionable API Design:** Endpoints require explicit HTTP verbs, path variables, query parameters, request bodies, and expected status codes.

---

## 💡 How to Use the Output with AI IDEs (Cursor, Claude Code, Windsurf)

1. Paste your voice note or idea into **Chisel**.
2. Click **"Download .md"** or **"Copy Markdown"**.
3. Save the file into your repo as `specs/feature-prd.md`.
4. In **Cursor** or **Claude Code**, prompt:
   ```markdown
   @specs/feature-prd.md Implement the REST API endpoints described in Section 3, 
   following the user stories in Section 2.
   ```
5. Build features in hours instead of days.

---

## 👨‍💻 Author
 
 **Atharva Bagul**
 - Co-Founder, ANTIMATRIX
 - [GitHub](https://github.com/atharva-bagul) • [LinkedIn](https://www.linkedin.com/in/atharva-bagul) • [Email](mailto:Bagul.atharva.manoj@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
