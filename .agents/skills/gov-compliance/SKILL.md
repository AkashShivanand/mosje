---
name: gov-compliance
description: Apply or audit Government of India web standards (DBIM + GIGW 3.0 + UX4G) for any MoSJE page, component, or portal. Use when building or reviewing UI that must meet brand, accessibility, and government-website compliance — i.e. all MoSJE public properties.
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash
---

# Government compliance (DBIM · GIGW 3.0 · UX4G)

Authoritative gate: **`docs/compliance/COMPLIANCE-CHECKLIST.md`** (read it first — it has the full, sourced checklist with exact specs). This skill operates that checklist in two modes.

Authoritative **sources** behind that checklist live in **`docs/guidelines/`** — read the
relevant section there whenever the checklist is ambiguous, a clause needs quoting exactly, or
you are working an area the checklist compresses:

| Folder | Standard | Binding? | Reach for it when |
| --- | --- | --- | --- |
| `docs/guidelines/GIGW-3.0/` | GIGW 3.0 | **Mandatory** | Accessibility, quality, cybersecurity, lifecycle, mandatory pages, STQC certification |
| `docs/guidelines/DBIM-3.0/` | DBIM v3 | **Mandatory (brand)** | Colour groups, icon colour, footer treatment, type scale, logo, imagery |
| `docs/guidelines/UX4G-3.0/` | UX4G Design System 3.0 | Recommended | Type scale, spacing, elevation, iconography, focus-ring spec, error/consent copy, journey patterns P-01…P-09 |
| `docs/guidelines/GuDApps/` | GuDApps v1.1 | Best practice | Portal data quality, authentication, forms, reports |

`docs/guidelines/README.md` carries the precedence ladder and the register of **deliberate
divergences** — check it before reporting a "failure". Five divergences are recorded and
intentional (UX4G's violet primary, Material Symbols Rounded 300 over Outlined 400, the
un-installed `ux4g-web-components` package, the `--sa-*` namespace, the code-only `dbim` brand
mode). Flagging one of those as a defect is a false positive. See `.claude/rules/guidelines.md`.

## Mode A — Building (compliance by construction)
When creating/editing a MoSJE page or component, satisfy these as you build (don't bolt on later):
- **Brand:** Noto Sans; brand tokens only (no raw hex); footer = darkest key colour; icons key-colour-or-white in 24/32/48/64px PNG/SVG/WEBP.
- **Imagery budgets:** logos <100KB; bg/banner <500KB; thumbnails <100KB; hi-res <5MB; JPEG/PNG/WEBP; every meaningful image has alt.
- **Typography:** left-aligned body; no ALL-CAPS paragraphs; DBIM type scale; AA contrast; buttons with enabled/hover/focus/disabled states + visible hover.
- **Content:** date format DD MMM YYYY; uniform Dr./Shri/Smt. titles; objectives as lists; offering titles ≤150 chars, doc titles ≤250 chars; officials ordered by seniority; documents as accessible PDFs.
- **Accessibility (WCAG 2.1 AA):** `lang`, one `<h1>`, landmarks, skip-link, full keyboard + visible focus, correct ARIA on widgets, `prefers-reduced-motion`, AA contrast.
- **Personas:** persona-based homepage nav (Beneficiary/Student/Researcher/Govt Official).
- **Privacy:** cookie-consent banner at bottom.
- **Mandatory pages exist:** Contact, Feedback, Help, Sitemap, Search, Terms, Privacy, Copyright, Hyperlinking Policy, Accessibility Statement, RTI, "Last Updated" stamp.

## Mode B — Auditing
Given a target page/component:
1. Read `docs/compliance/COMPLIANCE-CHECKLIST.md`, then the target file(s) and the shared UI they use.
2. Walk every checklist section (§1–15). For each item: **PASS / FAIL / N/A**, with `file:line` evidence and the exact fix.
3. Cross-check the ⚠️ items — these are the original site's known DBIM gaps; our build must **fix** them.
4. For deep accessibility, delegate to the `accessibility-auditor` agent; for token/brand drift, the `design-system-guardian` agent.
5. Output: a section-by-section scorecard, an overall **compliance %** (mirror the DBIM audit's format), and a prioritized fix list (⚠️/FAIL first). Note items that need human/process action (STQC CQW cert, VAPT, WIM designation) separately — those are governance, not code.

Keep findings concrete and sourced (tag each with `[DBIM n.n]`, `[GIGW]`, or `[UX4G]`). Never weaken a requirement to make something pass.
