# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server on port 8080 (`vite.config.ts`)
- `npm run build` — runs `node generate-sitemap.js` (writes the sitemap from a hardcoded `staticRoutes` list) then `vite build`. When adding a public route, add it to `staticRoutes` in `generate-sitemap.js` too.
- `npm run lint` — ESLint for the frontend
- `npm run preview` — serve the production build
- Cloud Functions (`functions/`, separate package, Node 24): `npm --prefix functions run build | lint | serve | deploy`

There is no test runner configured. Both `package-lock.json` and `bun.lock` exist; npm is what the docs use.

## Architecture

Vite + React 18 + TypeScript SPA (path alias `@` → `src/`), styled with Tailwind + shadcn/ui and a custom neumorphic system. Deployed on Vercel (`vercel.json` rewrites `/api/*` to serverless functions and everything else to `index.html`).

Backend is split across three places:
- **Firebase Firestore + Auth** is the sole data store, accessed directly from the client via `src/lib/firebase.ts`. No Firebase Storage — uploads go to **Cloudinary** (`uploadToCloudinary()` in `src/lib/utils.ts`, cloud name from `VITE_CLOUDINARY_CLOUD_NAME`) and the resulting URL is stored in Firestore.
- **Vercel API routes** in `api/` (`contact`, `lbfp-enquiry`, `webinar-registration`) send email through Resend using the server-only `RESEND_API_KEY`. Non-`VITE_` env vars must never be referenced from `src/`.
- **Firebase Cloud Functions** in `functions/src/index.ts` for Firestore-triggered logic (e.g. `sendBlogForApproval`, using nodemailer).

Routing is in `src/App.tsx` (`AnimatedRoutes`, framer-motion page transitions). Admin pages are wrapped in `AdminRoute`. `/club` (the CC Club portal) is standalone: no main navbar, self-managed auth gate, and a separate dark "warm clay" theme scoped under `.cc-club-scope`; the rest of the site uses the light cool-clay theme.

### CC Club module
Role-based (`club_role` in `cc_members`: Student, President, Vice President, Team Leader, Event Team, Trainer) gamification and review system. All Firestore logic lives in `src/lib/ccClub.ts`; UI in `src/components/club/` with one dashboard per role. Speeches and meeting videos move through a `workflowState` pipeline: student submits → President validates/rejects → Trainer evaluates (points awarded) or sends back for redo. Trainer accounts require admin approval (`approvalStatus`) via `AdminDashboard`. Collections: `cc_members`, `cc_speeches`, `cc_meeting_reports`, `cc_meeting_video_submissions`; other collections are `blogs` (TipTap rich text, admin-authored) and `test_results` (`src/lib/saveTestResult.ts`).

## Reference docs in repo

- `ARCHITECTURE.md` — full Firestore schemas, env var table, and the complete CC Club workflow diagrams. Read before changing `ccClub.ts` or schemas.
- `DESIGN.md` — authoritative design-system reference (neumorphic tokens, fonts, light vs. club dark mode). Consult before styling; shared neumorphic components are in `src/components/ui/` (`neumorphic-*`, `CCButton`, `EnrollNowButton`).

## Notes

- `.env` and `serviceAccountKey.json` are present locally and hold secrets; never commit or print them.
- README mentions `VITE_RESEND_API_KEY`, but the actual code uses server-side `RESEND_API_KEY` in `api/`.
