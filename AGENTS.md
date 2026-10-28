<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Chisel agent rules

## Before you start
- Read docs/HANDOFF.md first (local only, never commit it), then docs/README.md (index), docs/PRD.md, docs/ARCHITECTURE.md and docs/DESIGN_SYSTEM.md. Record design changes as an ADR in docs/decisions/
- Read CLAUDE.md for product boundaries; they override convenience
- Check existing components and `lib/server/` modules before creating new ones

## General rules
- TypeScript strict; functional React components
- Follow docs/DESIGN_SYSTEM.md tokens exactly; no new colours or fonts
- Only build what docs/PRD.md lists; ask before adding features
- Keep the Next.js monolith; new AI providers are adapters behind `CompleteFeatureSpec`
- Update the matching doc in the same change when the stack, features or design change

## Security
- Provider keys and Upstash tokens are server-only env vars; never `NEXT_PUBLIC_`
- Validate every external input and model output with Zod
- Never weaken the production generation gate without an approved plan

## Commands
```
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3100
npm test && npm run lint && npm run typecheck && npm run build
```
