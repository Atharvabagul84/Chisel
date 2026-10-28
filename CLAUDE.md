@AGENTS.md
@docs/HANDOFF.md
@docs/PRD.md
@docs/ARCHITECTURE.md
@docs/DESIGN_SYSTEM.md
@docs/README.md

# Chisel development notes

Read README.md for current behavior and AGENTS.md for this Next.js version's local documentation requirement.

The active product is a feature-definition workflow for product managers and engineering teams. `app/page.tsx` mounts the local `FeatureWorkspace`; `/team` adds Supabase verified email sessions, owner-managed invitations, and persistent shared briefs. See docs/guides/supabase-setup.md for deployment prerequisites and docs/reference/status.md for current verification and remaining work.

The shared generation contract lives in `lib/feature-spec.ts`. Request parsing, generation, and Anthropic access are separate modules in `lib/server/`. Keep runtime validation at both external boundaries. `lib/local-drafts.ts` intentionally permits incomplete edits; Markdown handoff uses the stricter completeness schema. Keep personal review state distinct from implemented/tested/approved state.

## Verification

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

## Important boundaries

- Model/API errors must remain visible errors, never implicit sample documents.
- Keep example content explicitly labeled and out of live generation.
- No fabricated performance metrics, telemetry, approvals, or requirement evidence.
- Preserve unsaved work, guard stale requests and stale saved revisions, and keep exports faithful to the current content and review checks.
- Keep provider keys server-only. Production generation stays at HTTP 503 except the hosted demo, which requires `CHISEL_GENERATION_PROVIDER=groq` (free tier, no billing), `CHISEL_HOSTED_DEMO=true`, a Groq key and Upstash limits (3 per visitor per day, 100 per day total, same-origin only, fail closed when limits can't be checked). Never enable anonymous production generation on a paid provider.
- Browser storage is local-only and overwritten per revision; it is not team collaboration or immutable history.
- Shared workspace authorization lives in PostgreSQL RLS and restricted RPCs. Never trust client role fields or user-editable JWT metadata. Keep all table writes behind validated RPCs, and retain canonical server timestamps/revisions.
- Use a publishable Supabase key, never a service-role key in the app. Cookie mutations must enforce the configured origin. `getUser()` verifies every protected request.
- Shared saves reject stale expected revisions and preserve immutable snapshots. Formal team approvals and a revision-history UI are not yet implemented.

The connected pilot has verified email delivery, owner sign-in, workspace creation, and shared-brief persistence after reload. Engineer invitation creation, wrong-email rejection, and delivery of the second account's sign-in code have been exercised. Completed engineer sign-in, invitation acceptance, shared edits, and live conflict handling remain unverified. Do not infer completed collaboration from email delivery.

Next milestone: complete the two-account smoke test, using separate browser profiles at the configured local origin or an HTTPS deployment for other-device testing. No deployment of this updated MVP has been verified. Preserve secure production cookies, exact-origin mutation checks, and the production AI gate. Then build source-linked requirements and version-specific PM/engineering review. Prefer the existing Next.js monolith over an orchestration or microservice rewrite.
