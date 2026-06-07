# MoSJE Digital Estate — SAMAVESH Design System

Workspace for the **Ministry / Department of Social Justice & Empowerment (DoSJE), Government of India** digital estate, and home of the **SAMAVESH Design System** (समावेश — *"inclusion"*) — the shared, accessible, multi-script design language for the ministry's 13 unified-website domains and 20+ functional portals.

## What's in this repo

This repo versions the **shared design-system program + workspace config**. The individual apps (`dosje/`, `portals/*`) are **independent git repos** and are intentionally git-ignored here.

```
packages/
├── tokens/          @mosje/tokens         — DTCG token source → Style Dictionary → CSS/TS/Tailwind/Figma
├── design-system/   @mosje/design-system  — shared React components
├── config/          @mosje/config         — Tailwind / eslint / tsconfig presets
└── docs/            @mosje/docs           — Storybook (the living system)  [planned]
docs/
├── superpowers/specs/   — design specs (start here: SAMAVESH program design)
├── superpowers/plans/   — implementation plans
└── research/            — Figma↔code reconciliation, DS benchmarking
.claude/                 — workspace agents, commands, rules, hooks, skills
```

## Key documents

- **Program design (the constitution):** [`docs/superpowers/specs/2026-06-07-samavesh-design-system-design.md`](docs/superpowers/specs/2026-06-07-samavesh-design-system-design.md)
- **Architecture & build registry:** [`MOSJE-ARCHITECTURE.md`](MOSJE-ARCHITECTURE.md)
- **Working conventions:** [`CLAUDE.md`](CLAUDE.md)

## Design tokens

`@mosje/tokens` is the single source of truth. Edit DTCG JSON in `packages/tokens/src/*.json` and run:

```bash
npm install
npm run build -w @mosje/tokens   # regenerate CSS / TS / Tailwind / Figma outputs
npm test  -w @mosje/tokens       # assert the backward-compatible token contract
```

Never hand-edit generated `dist/` artifacts.

## Principles

Accessibility-first (WCAG 2.2 AA + GIGW), multi-script (Indic + Latin) from line one, progressive enhancement, design tokens never hardcoded, and one shared system across every property.
