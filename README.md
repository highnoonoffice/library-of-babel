---
title: "Library of Babel — Standalone Next.js Handoff"
created: 2026-04-14
modified: 2026-04-14
tags: [readme, babel, nextjs, vercel, handoff]
status: active
---

# Library of Babel

Standalone Next.js app for `highnoonoffice/library-of-babel`, designed for Vercel deployment.

## What Was Built

- App Router UI with three modes: `Find Its Address`, `Explore a Location`, `Wander`.
- API route at `app/api/babel/route.ts` for deterministic address lookup + page generation.
- Static catalog import from `lib/catalog.ts` (no runtime filesystem writes).
- Placeholder leather textures in `public/textures/` (100x200 PNGs) for visual parity until production assets are swapped in.

## Repository Layout

- `app/layout.tsx`
- `app/page.tsx`
- `app/api/babel/route.ts`
- `components/Babel.tsx`
- `lib/catalog.ts`
- `public/textures/*`

Legacy files are intentionally preserved and untouched:

- `SKILL.md`
- `babel_core.py`
- `references/`

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build / Deploy

```bash
npm run build
npm run start
```

Deploy target: Vercel.

## Verification Performed

- `npm run build` passes with zero TypeScript errors.
- `/` renders the full Babel UI (dark layout + three tabs).
- Find flow works: POST `/api/babel` with `"call me ishmael"` returns coordinates.
- Find flow works: GET `/api/babel` with those coordinates + text returns page content and highlight range.
- Explore/Wander flows work: GET `/api/babel` with arbitrary coordinates returns page content.
- No console/runtime errors related to `fs`, `path`, or filesystem writes.

## Important Notes

- `tsconfig.json` uses `"target": "ES2020"` because the API route intentionally uses BigInt literals (`29n`, etc.). Lowering this to `ES2017` causes compile failures.
- Catalog persistence is static-by-design for Vercel compatibility; previous write-to-disk behavior was removed.
- Address text source order is query text first, then `CATALOG` fallback.
- Texture assets are placeholders and can be replaced later with photorealistic versions at the same filenames/paths.

## PR Handoff Notes

- Branch in use: `codex/standalone-nextjs-vercel`
- Suggested PR title: `feat: standalone Next.js app for Vercel deployment`
- Suggested PR description summary: built standalone Next.js app with UI + API route.
- Suggested PR description summary: removed catalog filesystem writes and replaced with static `CATALOG` import for Vercel compatibility.
