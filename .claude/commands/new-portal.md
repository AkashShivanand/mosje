---
description: Scaffold a new functional portal under portals/ on the shared MoSJE stack and design language.
argument-hint: "<portal-slug> [\"Display Name\"]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Scaffold a new portal: **$1** (one of the ~20 MoSJE functional portals).

Before scaffolding, confirm intent and the org/scheme it serves, then:
1. Pick a free port (portals start at 4123; increment per portal — check `.claude/launch.json` for taken ports).
2. Create `portals/$1/` as a Next.js (App Router, React 19, TypeScript strict) app consistent with the existing portal stack: Radix/shadcn primitives, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`. Match the website's brand tokens (gov-blue, saffron, etc.) and Noto Sans so it shares the design language.
3. Wire `dev`/`build`/`lint`/`typecheck` scripts; set the dev port via `-p <port>`.
4. Add a config entry to `.claude/launch.json` (name `$1`, `npm --prefix portals/$1 run dev`, the chosen port). **Show the diff and let the user apply the launch.json change** (settings files need explicit approval).
5. Seed a minimal landing route + a portal `CLAUDE.md` noting its org/scheme, stack, and port. Verify `npm run build` passes.
6. Once `packages/design-system` exists, consume it instead of re-declaring tokens.

Do NOT delete or overwrite any existing portal. Never `rm -rf`.
