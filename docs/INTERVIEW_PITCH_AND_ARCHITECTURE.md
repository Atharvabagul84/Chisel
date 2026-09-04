# ⌁ CHISEL — THE HIGH-VELOCITY ARCHITECTURAL SHOWCASE
### Complete Interview Pitch, Strategic Rationale, Feature Intentionality & Screen-Share Playbook
**Author:** Atharva Bagul  
**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Anthropic Claude 3.7 Sonnet, Geist & Material Symbols  
**Live Application:** [https://chisel-chi.vercel.app](https://chisel-chi.vercel.app)  
**GitHub Repository:** [https://github.com/Atharvabagul84/Chisel](https://github.com/Atharvabagul84/Chisel)  

---

## EXECUTIVE SUMMARY & INTERVIEW POSITIONING

### The Dual-Engine Portfolio Narrative
In technical interviews (specifically for AI Engineer, AI Agent Developer, and Founding Full-Stack roles), candidates typically fall into two traps:
1. **The "All-Talk Architect"**: Talks about high-level theory, distributed systems, and prompt engineering, but has zero live production code to share.
2. **The "Weekend Toy Builder"**: Shows a generic chatbot or weather app with no architectural depth, no state machines, and no domain relevance.

Your portfolio is structured around two complementary flagship projects that systematically crush both risks:
- **OpsTriage (Production & Reliability Mode):** Proves deep systems engineering, incident response, PagerDuty/Datadog triage, distributed tracing, and 2:00 AM production resilience.
- **Chisel (Speed & Prototyping Mode):** Proves high-velocity product synthesis, domain deconstruction, Next.js 16/React 19 mastery, modern aesthetic design systems, and converting messy founder intuition into deterministic engineering constraints in under 3 seconds.

---

## 1. THE THREE ELEVATOR PITCHES

### Pitch A: The 30-Second Punchy Hook (Best for Introductions)
> *"I built **Chisel** to eliminate the single biggest bottleneck between non-technical founders and engineering teams: the translation gap. Early-stage founders think in rapid, unstructured vision—2:00 AM voice notes, bullet dumps, and Slack fragments. Engineers and AI coding agents need rigid technical structure—REST contracts, schemas, and Gherkin acceptance criteria.*  
> *Chisel is an AI product architecture studio built on Next.js 16, React 19, and Claude 3.7 Sonnet. You feed in an ambiguous founder transcript, select your target audience and architecture depth, and Chisel sculpts it into a 5-pillar production blueprint with OpenAPI endpoints, PostgreSQL DDL, and Gherkin stories in under 3 seconds. It cuts the spec-to-prototype cycle from days of meetings to a single afternoon."*

---

### Pitch B: The 60-Second "Dogfooding & AI Engineering" Pitch (Best for Andy / AI Specialist Questions)
> *"For me, AI tools like Cursor and Claude Code aren't just autocomplete—they're high-velocity development engines that demand structured context. If you feed an AI agent vague prompts, you get hallucinations and refactor loops. You need deterministic specifications.*  
> *While preparing for this role and exploring modern AI developer workflows, I built and deployed **Chisel** (`chisel-chi.vercel.app`). It acts as an upstream compiler for AI workflows: it takes raw transcripts from Otter, Apple Memos, or Slack, extracts domain entities, and compiles a comprehensive 5-pillar PRD.*  
> *It features an interactive 7-stage DAG compilation graph with streaming telemetry, OpenAPI 3.1 contracts with PostgreSQL migration DDL, interactive component sandboxes, and a 1-click 'Export for Cursor' button that creates clean `.cursorrules` and `specs/feature.md` files. I built it to demonstrate both high-velocity vibe-coding and strict production engineering."*

---

### Pitch C: The 90-Second Scenario Response (When Asked About Dealing with Ambiguous Requirements)
> *"When a founder or stakeholder sends an ambiguous 2-minute voice note saying: 'Hey, we need a GitHub PR review bot that flags breaking migrations and alerts Slack,' the instinct of average engineers is to book a 45-minute sync meeting or start writing ad-hoc code.*  
> *My approach is deterministic deconstruction: I feed that transcript into **Chisel**, which I engineered specifically for this scenario. Within 3 seconds, Chisel identifies the bounded context, defines quantitative performance targets (e.g., diff throughput < 250ms), generates BDD user stories (`Given/When/Then`), writes typed REST contracts with error codes, outputs PostgreSQL schemas, and enumerates non-functional requirements like rate limits and crash recovery.*  
> *I immediately export this as a Markdown spec, drop it in Slack for founder sign-off, and load it into Cursor as the architectural source of truth. That turns a 3-day back-and-forth debate into a 30-minute sprint start."*

---

## 2. THE CORE USE CASES

| Persona / User | Pain Point Before Chisel | Workflow With Chisel |
| :--- | :--- | :--- |
| **Technical Founders & CTOs** | Have product ideas on walks or late at night; lack time to write formal 6-page PRDs before engineers wake up. | Speak into phone memo app, paste transcript into Chisel, click *Solo / AI Coder*, and instantly get an actionable engineering contract. |
| **AI Engineers & Solo Builders** | AI IDEs (Cursor, Claude Code, Windsurf) produce hallucinated schemas and circular imports when given vague prompts. | Feed rough idea into Chisel, hit **Export for Cursor**, and feed the deterministic 5-pillar Markdown directly into the agent. |
| **Product Managers (PMs)** | Spend 8–12 hours per sprint manually formatting Jira tickets, Gherkin acceptance criteria, and edge-case tables. | Select *Agency / Client* preset, click *Comprehensive Spec*, and generate complete BDD test matrices with interactive verification checkboxes. |
| **Engineering Leads** | Junior devs build features that lack error handling, DB indexing, idempotency keys, or rate limits. | Chisel automatically injects Pillar 03 (PostgreSQL DDL with indexes) and Pillar 05 (SLA matrices, DLQ recovery, and rate limit boundaries). |

---

## 3. ARCHITECTURAL INTENTIONALITY BEHIND EVERY FEATURE

Every visual element, button, and telemetry metric in Chisel was engineered with a specific technical intention. When demoing Chisel, use these talking points to explain **why** it was designed this way.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CHISEL ARCHITECTURAL FLOW                             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
     [Screen 1: Idea Editor]           ▼
     ┌───────────────────────────────────────────────────────────────────────┐
     │ • Voice transcript / Audio / MD Attach                                │
     │ • Presets: #1 GitHub Triage, #2 Stripe Billing, #3 Rust Vector        │
     │ • Context Controls: Audience (Solo/Agency/Pitch) x Depth (Lean/Full)  │
     └───────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼ [Trigger: ⌘↵]
     [Screen 2: Pipeline Orchestrator]
     ┌───────────────────────────────────────────────────────────────────────┐
     │ • Elapsed Timer + Remaining ETA                                       │
     │ • 7-Stage DAG Graph (Token Emitter, Invariant Parsing)                │
     │ • stdout Live Stream + Hardware Telemetry (Tok/sec, Latency, Memory)  │
     │ • Throughput Sparkline SVG (84 tok/s stable)                          │
     └───────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼ [Compiled in 4.2s]
     [Screen 3: 5-Pillar Spec Document]
     ┌───────────────────────────────────────────────────────────────────────┐
     │ • Pillar 01: Executive Scope & Quantitative Target Bento              │
     │ • Pillar 02: Gherkin BDD Scenarios + Interactive Verification Matrix  │
     │ • Pillar 03: REST API Contracts + TS schema.ts + PostgreSQL DDL       │
     │ • Pillar 04: ASCII Component Tree + Interactive AuthorizeBar Sandbox  │
     │ • Pillar 05: SLA Requirements Table + Cryptographic Sign-Off Ledger   │
     │ • Action Toolbar: Copy Markdown, .md Download, Export for Cursor      │
     └───────────────────────────────────────────────────────────────────────┘
```

---

### FEATURE 1: Fixed Navigation Shell with Live Engine Telemetry & Token Usage
- **The Element:** Top header displaying `CHISEL v2.4`, `Claude 3.7 Sonnet / SpecEngine v2` with pulsing green dot, `+ New Spec (⌘N)`, `API (99.98%)`, and the left sidebar displaying `Active Specs`, `Schema Models`, and `Token Usage (428k / 1.0M)`.
- **The Design Intention:**  
  Most developer tools look like generic landing pages. Chisel was architected with a **Linear/Datadog IDE shell** to immediately signal that this is an enterprise internal workbench, not a promotional landing page.
- **The Interview Talk-Track:**  
  > *"I intentionally avoided the typical marketing landing page design. I structured Chisel as an authenticated developer studio with a fixed navigation shell, active workspace breadcrumbs, live engine telemetry, and token usage meters. It demonstrates my familiarity with building high-density SaaS workflows for technical users."*

---

### FEATURE 2: Ingestion Textarea with Live Token Counter & Audio Attachment
- **The Element:** Monospace input area with auto-detect architecture badge, `.mp3/.wav/.md/.txt` file attachment, live character counter (`428 chars`), and token estimation (`~96 tokens`).
- **The Design Intention:**  
  Founders don't write prose in nice paragraphs; they paste raw Otter.ai transcripts, bullet braindumps, or export voice memos. Estimating tokens upfront communicates engineering discipline regarding context window budget.
- **The Interview Talk-Track:**  
  > *"Real-world inputs are noisy. Notice the input area welcomes raw voice transcripts and audio files. The live token estimator immediately calculates context utilization before the request is dispatched, preventing token bloat."*

---

### FEATURE 3: Curated Sample Transcripts (#1 GitHub Triage, #2 Stripe Billing, #3 Rust Vector)
- **The Element:** Quick-load buttons providing three distinct, highly realistic technical braindumps.
- **The Design Intention:**  
  During live interview screen-shares, typing out a 500-word prompt on the spot is slow and clumsy. Sample pills allow instant, 1-click loading of complex scenarios (AST triage, B2B billing, Rust vector search) to test different architectural engines on demand.
- **The Interview Talk-Track:**  
  > *"I built in three production presets reflecting real engineering challenges—AST-based PR triage, Stripe metered billing, and a low-latency Rust vector engine. With one click, an interviewer can test how the model handles different languages and scaling requirements."*

---

### FEATURE 4: Multi-Dimensional Context Tuning (Audience & Depth)
- **The Element:** Segmented button selectors for **Audience** (*Solo/AI Coder*, *Agency/Client*, *Seed Pitch*) and **Depth** (*Technical & Lean*, *Comprehensive Spec*).
- **The Design Intention:**  
  The same idea requires radically different outputs depending on the consumer:
  - *Solo Dev / AI Coder*: Needs direct DDL schemas, endpoints, and code contracts; zero corporate fluff.
  - *Agency / Client*: Needs milestones, deliverables, and acceptance boundaries for invoicing.
  - *Seed Pitch*: Needs moat clarity, technical differentiation, and executive metrics.
- **The Interview Talk-Track:**  
  > *"A junior developer prompts an LLM with 'write a PRD'. A senior engineer parameterizes the output persona. By decoupling Target Audience from Architectural Depth, Chisel adjusts its prompt chain to produce either lean code-ready schemas or formal client-facing deliverables."*

---

### FEATURE 5: The 7-Stage DAG Execution Graph & Streaming stdout Telemetry
- **The Element:** The intermediate compiling state featuring an elapsed timer, a 7-stage DAG progress graph with active token emitter, hardware telemetry (tok/sec, latency, memory, confidence), and a latency throughput sparkline SVG.
- **The Design Intention:**  
  In modern UX psychology, static loading spinners feel slow and leave users wondering if the app froze. Showing a **multi-stage DAG execution graph** transforms a 3-second wait into an engaging demonstration of transparent system operations, showing the exact cognitive steps (entity parsing → requirement topology → DDL synthesis).
- **The Interview Talk-Track:**  
  > *"Instead of hiding behind a generic spinner, I designed a 7-stage pipeline orchestrator. It visualizes the compiler's DAG in real-time, showing entity extraction, Gherkin formulation, and DDL compilation alongside live telemetry. It builds trust by revealing how the system reasons through constraints."*

---

### FEATURE 6: Pillar 01 — Executive Scope & Quantitative Target Bento
- **The Element:** Problem summary, 3 quantitative metric cards (`< 250ms`, `-48% Time`, `99.4% Accuracy`), and two-column **Scope Boundaries** (In-Scope Deliverables vs Explicitly Out of Scope).
- **The Design Intention:**  
  Every project fails because of scope creep. The best PRDs explicitly define what the team is **not** building. The quantitative bento grid establishes verifiable engineering SLAs before a single line of code is written.
- **The Interview Talk-Track:**  
  > *"In Pillar 01, notice the 'Scope Boundaries' section. Great software engineering is defined by what you explicitly choose NOT to build in Phase 1. Chisel forces the inclusion of out-of-scope boundaries to protect sprint velocity."*

---

### FEATURE 7: Pillar 02 — Gherkin Acceptance Criteria with Interactive QA Checklist
- **The Element:** Scenarios structured with bold `GIVEN / WHEN / THEN / AND` badges, accompanied by interactive verification checkboxes with reactive state.
- **The Design Intention:**  
  Gherkin is the universal bridge between product managers, QA automation suites (Cucumber/Playwright), and AI coding agents. The interactive checklist allows developers and QA leads to physically check off criteria during verification.
- **The Interview Talk-Track:**  
  > *"Pillar 02 produces industry-standard BDD Gherkin syntax. An engineer can copy these directly into Playwright or Cypress test suites, or use the interactive checkboxes during staging QA."*

---

### FEATURE 8: Pillar 03 — REST Contracts, TypeScript Schema & PostgreSQL DDL
- **The Element:** REST endpoints with colored method badges (`POST`, `GET`, `PATCH`), a syntax-highlighted TypeScript contract (`schema.ts`), and ready-to-run PostgreSQL DDL migration statements with indexes.
- **The Design Intention:**  
  Vague API descriptions like "an endpoint to get data" waste hours of dev time. Chisel provides strict HTTP verbs, paths, typed payloads, and the exact PostgreSQL `CREATE TABLE` and `CREATE INDEX` statements.
- **The Interview Talk-Track:**  
  > *"Look at Pillar 03: it doesn't give high-level hand-waving. It generates the exact TypeScript interfaces and the raw PostgreSQL migration DDL, complete with UUID primary keys and composite indexes."*

---

### FEATURE 9: Pillar 04 — ASCII Component Tree & Interactive Sandbox
- **The Element:** ASCII representation of the React component tree (`App ├── PRReviewDashboard ...`) paired with live, interactive mock widgets (`InteractiveApproveBar` with an active `Authorize Check` button).
- **The Design Intention:**  
  Proves that Chisel doesn't just describe UI—it demonstrates the UI hierarchy and dogfoods interactive React state management inside the document itself.
- **The Interview Talk-Track:**  
  > *"In Pillar 04, Chisel maps the component hierarchy as an ASCII tree and embeds a live interactive mockup. You can click 'Authorize Check' right inside the document to verify state transitions before building."*

---

### FEATURE 10: Pillar 05 — Non-Functional Requirements Matrix & Sign-Off Ledger
- **The Element:** Matrix table covering Latency SLA, GitHub Rate Limiting, Large Binary Diffs, and Dead Letter Queue recovery, culminating in an engineering sign-off ledger with commit SHA.
- **The Design Intention:**  
  Junior engineers only design for the happy path. Senior engineers design for network timeouts, 50MB binary files, rate limits, and crash recovery.
- **The Interview Talk-Track:**  
  > *"Pillar 05 represents production reality. It specifies rate-limit mitigations, exponential backoff with jitter, binary diff bypass, and dead-letter queues. The cryptographic sign-off SHA provides a tamper-evident audit trail for enterprise SOC2 compliance."*

---

### FEATURE 11: Export for Cursor / Claude Code (.cursorrules & specs/feature.md)
- **The Element:** Top toolbar buttons for `Copy Markdown`, `.md` download, and `Export for Cursor`.
- **The Design Intention:**  
  The ultimate goal of a spec isn't to sit in Google Docs—it's to be executed. The `Export for Cursor` button formats the entire spec into an optimized system prompt that can be dropped into `.cursorrules` or `specs/feature.md`.
- **The Interview Talk-Track:**  
  > *"The end goal of Chisel is zero-friction execution. With one click on 'Export for Cursor', the spec is formatted as an executable context prompt. I drop this into Cursor or Claude Code, and the AI agent implements the feature with zero hallucinated endpoints."*

---

## 4. THE 60-SECOND LIVE SCREEN-SHARE PLAYBOOK

When the interviewer says: *"Can you show me what you built?"* follow this exact script:

```
[0:00 - 0:10] STEP 1: OPEN APPLICATION
• Share screen showing https://chisel-chi.vercel.app (or localhost:3000)
• SAY: "Here is Chisel. The premise is simple: founders have rapid ideas, but engineers need 
        deterministic constraints. The interface is built with Next.js 16, React 19, and Tailwind v4, 
        styled with Geist and Material Symbols."

[0:10 - 0:20] STEP 2: LOAD A SCENARIO
• Click "#1 GitHub PR Triage" (or "#2 B2B Stripe Billing")
• SAY: "Instead of typing, I'll load a realistic founder braindump—in this case, an AST-aware PR triage bot. 
        Notice the live token counter updating and the context controls: I've set this for Solo Dev / AI Coder 
        with Technical & Lean depth."

[0:20 - 0:35] STEP 3: TRIGGER COMPILATION
• Click "Generate Specification (⌘↵)"
• SAY: "When I hit compile, notice the 7-stage DAG execution graph. Rather than showing a blank spinner, 
        Chisel streams its entity extraction, requirement topology, and DDL synthesis with live tok/sec telemetry. 
        It compiles the full specification in under 4 seconds."

[0:35 - 0:50] STEP 4: TOUR THE 5 PILLARS
• Scroll smoothly down to the generated spec.
• Click "02 Gherkin Criteria" -> toggle a checkbox.
• Click "03 API & Schemas" -> highlight the PostgreSQL DDL.
• Click "04 Component Tree" -> click "Authorize Check" inside the live mock.
• SAY: "The output is divided into 5 architectural pillars: Executive scope with quantitative SLAs, 
        Gherkin BDD criteria with interactive test verification, typed REST contracts with PostgreSQL DDL, 
        an ASCII component tree with live mockups, and an edge-case matrix with rate limit mitigations."

[0:50 - 1:00] STEP 5: THE HAND-OFF CLOSE
• Click "Export for Cursor" -> show toast confirmation.
• SAY: "Finally, I click 'Export for Cursor'. The entire architecture is formatted and copied, ready to be dropped 
        into an AI coding agent to begin implementation immediately. That is how I use modern AI tools to accelerate 
        the product cycle."
```

---

## 5. 10 TOUGH INTERVIEW QUESTIONS ON CHISEL — ANSWERED

### Q1: "Why build this as a standalone Next.js app instead of just using a custom GPT or Claude Project?"
> *"Custom GPTs and Claude Projects are black-box wrappers. They have three major limitations:*  
> *1. **No Structured Frontend or Interactivity:** They output raw text in a chat stream. You can't interact with checkboxes, view latency sparklines, click component mockups, or toggle audience personas with one click.*  
> *2. **No Deterministic Downstream Pipeline:** Chisel enforces strict JSON schemas, calculates token budgets, formats DDL, and exports standardized `.md` and `.cursorrules` files that plug into automated CI/CD or IDE workflows.*  
> *3. **Engineering Demonstration:** Building Chisel proved my mastery of Next.js 16 App Router, React 19 server/client components, TypeScript typing, and responsive CSS architecture—things a prompt inside ChatGPT will never prove."*

---

### Q2: "How do you guarantee that Claude returns valid, structured JSON without markdown formatting errors?"
> *"I implement a three-layer defense:*  
> *1. **Strict Prompt Engineering:** The system prompt explicitly defines the TypeScript interface and uses negative constraints ('Do NOT wrap in markdown, return raw JSON only').*  
> *2. **Defensive Parsing:** In `/api/generate-prd`, the response handler uses regex sanitization (`rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '')`) before attempting `JSON.parse`.*  
> *3. **Graceful Fallback:** If the API fails or the user runs in demo mode without an Anthropic key, the app seamlessly serves a high-fidelity mock spec matching the exact schema, ensuring the user experience never crashes."*

---

### Q3: "Why did you choose Claude 3.7 Sonnet over OpenAI's GPT-4o for Chisel?"
> *"Two key technical reasons:*  
> *First, in coding and complex schema generation benchmarks, Sonnet consistently exhibits superior instruction-following for nested JSON contracts and TypeScript prop types compared to GPT-4o.*  
> *Second, Sonnet has significantly less 'conversational fluff'. When tasked with technical architecture, it adheres strictly to terse, deterministic constraints, which is essential when compiling specs for downstream AI coding agents."*

---

### Q4: "How does Chisel prevent hallucinated or generic API endpoints?"
> *"By grounding the extraction in the founder's raw transcript. The prompt requires identifying explicit entities (e.g., Pull Requests, Workspaces, Invoices) and mapping standard REST CRUD conventions (`/api/v1/{entity}`) with specific HTTP status codes (200, 400, 403, 404, 422). It forbids generic route names like `/api/get-data`."*

---

### Q5: "How does Chisel fit into a modern engineering workflow with tools like Cursor or Linear?"
> *"Chisel acts as the upstream bridge. Right now, founders write messy briefs, PMs spend days creating tickets, and engineers interpret them. With Chisel:*  
> *1. The voice memo is compiled into the 5-pillar spec.*  
> *2. Gherkin scenarios from Pillar 02 map 1:1 to Jira/Linear tickets.*  
> *3. Pillar 03 contracts become backend route templates.*  
> *4. Clicking 'Export for Cursor' copies the spec directly into `.cursorrules`, allowing the developer to prompt: 'Implement endpoints from Section 3 with Prisma'."*

---

### Q6: "How did you handle responsiveness and performance on Next.js 16 and Tailwind v4?"
> *"I used Tailwind v4's CSS-first theme configuration (`@theme`) to establish a zero-runtime CSS footprint with design tokens for surfaces, borders, and typography. For layout, I built a responsive two-column grid (`pl-64` on desktop, fluid on mobile) and used CSS `backdrop-blur` for glassmorphic depth. The production build compiles in 6.6 seconds with zero bundle bloat."*

---

### Q7: "If this were deployed to 10,000 active founders tomorrow, what would break first and how would you scale it?"
> *"Three bottlenecks would emerge:*  
> *1. **Anthropic API Rate Limits:** Claude has concurrency limits (RPM/TPM). Mitigation: Introduce an asynchronous Redis queue (BullMQ or Celery) to decouple user submissions from LLM generation.*  
> *2. **Latency Perception:** A 10,000-token spec takes 5–8 seconds to generate. Mitigation: Implement Server-Sent Events (SSE) to stream the 5 pillars progressively so the user reads Pillar 01 while Pillar 03 is still compiling.*  
> *3. **Caching & Deduplication:** Founders frequently regenerate similar ideas. Mitigation: Compute a semantic embedding vector of the input transcript and cache identical architecture patterns in Qdrant or Redis."*

---

### Q8: "Why did you choose Geist and Material Symbols over generic browser fonts and Lucide icons?"
> *"Aesthetics communicate engineering standard. Geist was specifically engineered by Vercel for high-density developer tools and monospace tabular numbers. Material Symbols provide standardized Google iconography for terminals, schemas, and verification indicators. Combined with the `#09090b` obsidian palette, it elevates Chisel into a Raycast-grade interface."*

---

### Q9: "How does building Chisel demonstrate your fit for the AI Engineer role?"
> *"It demonstrates the full spectrum of modern AI software development:*  
> *1. **AI Orchestration:** Prompt chaining, negative constraints, schema enforcement, and zero-key demo resilience.*  
> *2. **Full-Stack Competence:** Modern Next.js 16 App Router, React 19, TypeScript, and Tailwind v4.*  
> *3. **Product Vision:** Identifying a real operational bottleneck (founder-to-engineer communication) and designing an intuitive, high-velocity solution.*  
> *4. **Dogfooding Culture:** Using AI coding agents to build tools that empower other AI coding agents."*

---

### Q10: "Between Chisel and OpsTriage, what do these two projects together prove about you?"
> *"They prove that I have both modes required of a top-tier AI engineer:*  
> *- **Chisel** proves my **Speed & Prototyping Mode**: Taking ambiguous founder vision, structuring constraints, and shipping a full-stack, production-grade app in a single session.*  
> *- **OpsTriage** proves my **Production & Reliability Mode**: Deep systems thinking, distributed tracing, incident response, error budgets, and 2:00 AM production stability.*  
> *Many developers can only prototype toy frontends; very few understand production reliability. I operate seamlessly across both."*
