# MoSJE Portal — Design QC Rubric

> The shared standard for every portal audit. Severity, categories, and judgment rules
> are defined **once** here so findings are consistent across screens, across portals, and
> across reviewers (human or agent). If it isn't measured against this rubric, it isn't a finding.

---

## 1. Diff axes (the 6 things we check on every screen)

Every screen is compared against its Figma frame across these six axes. Each finding is tagged
with exactly one **primary** category.

| # | Category | What we check | How we measure |
|---|----------|---------------|----------------|
| 1 | **Layout & Spacing** | Position, alignment, padding, margins, gaps, grid, container width, element order | Computed CSS (`px`) vs Figma auto-layout / measured gaps. Tolerance below. |
| 2 | **Color & Token** | Fills, text color, borders, backgrounds, states, shadows | Computed hex/rgba vs Figma variable. **A hardcoded value that visually matches but isn't the token is still a finding** (token drift). |
| 3 | **Typography** | Font family, size, weight, line-height, letter-spacing, case, truncation | Computed values vs Figma text styles. |
| 4 | **Components & States** | Correct component used; default / hover / focus / active / disabled / error / loading / empty states; variant fidelity | Visual + interaction capture vs Figma component set. |
| 5 | **Content & Iconography** | Labels, microcopy, icon choice, image/asset correctness, data formatting (dates, numbers, ₹) | Compared to design intent — **distinguished from live mock-data differences** (see §4). |
| 6 | **Responsive & A11y** | Breakpoint behavior, reflow, touch targets, focus visibility, contrast, alt text, semantic structure, keyboard nav | Multi-viewport capture + contrast math + DOM checks. GIGW/WCAG 2.1 AA. |

---

## 2. Severity scale

Severity describes **user/brand impact**, not how hard it is to fix.

| Severity | Badge | Definition | Examples |
|----------|:-----:|------------|----------|
| **Blocker** | 🔴 | Breaks the experience, the brand contract, or compliance. Cannot ship. | Broken layout, unreadable contrast (fails AA), wrong brand color on primary CTA, missing critical state, keyboard trap, action that doesn't work. |
| **Major** | 🟠 | Clearly wrong vs design; noticeable to users or stakeholders; erodes polish/trust. | Wrong type scale on headings, spacing off by ≥8px in primary layout, wrong component variant, missing hover/focus state, inconsistent card styling. |
| **Minor** | 🟡 | Visible to a trained eye; small fidelity gap. | Spacing off 2–7px, slightly wrong shade (token drift, visually close), icon weight mismatch, border-radius off. |
| **Nit** | ⚪ | Polish-level; sub-pixel or cosmetic; batch-fixable. | 1px alignment, hairline shadow difference, letter-spacing rounding. |

**Rule of thumb:** if a user would notice → at least Major. If only a designer with the Figma open would notice → Minor/Nit. If it fails a hard standard (AA contrast, broken function) → Blocker regardless of size.

---

## 3. Measurement tolerances

Quantify everything. Use these thresholds to assign Layout/Spacing severity objectively.

| Delta (computed vs design) | Severity |
|----------------------------|----------|
| 0–1 px | Pass (within rounding) |
| 2–7 px | Minor 🟡 |
| 8–15 px | Major 🟠 |
| > 15 px, or breaks alignment/grid | Blocker/Major 🔴🟠 |

- **Color:** any deviation from the design token = a finding. If ΔE is tiny (visually identical) but the wrong/hardcoded value is used → Minor (token drift). If visibly different → Major. If it breaks contrast AA → Blocker.
- **Type:** wrong family = Major+. Size off ≤1px = Nit; ≥2px or wrong weight = Minor/Major by prominence.
- **Contrast:** < 4.5:1 body / < 3:1 large text or UI = **Blocker** (hard AA fail).

---

## 4. Defect vs. not-a-defect (no crying wolf)

A top-tier review never wastes the dev's time. Every flagged item is classified:

- **DEFECT** — build diverges from design and it's the build's fault. → goes in tracker as a finding.
- **DATA** — difference is live/mock content (real records vs Figma placeholder). → **not** a defect; noted only if formatting is wrong.
- **COVERAGE GAP — no design** — screen exists live but has no Figma frame. → not a defect; routed to **Design-Improvement Proposal** (see §6).
- **COVERAGE GAP — not built** — Figma frame exists but screen isn't implemented. → tracked as "Not Built", not a fidelity defect.
- **DESIGN BUG** — the Figma design itself has an issue (a11y, inconsistency, usability). → routed to Design-Improvement Proposal, flagged to design team.

---

## 5. What every finding row must contain

Non-negotiable. A finding is incomplete without all of these:

1. **ID** — `<PORTAL>-<SCREEN>-<nnn>` (e.g. `UTH-LOGIN-001`)
2. **Severity** + **Category**
3. **Design value → Built value → Recommended fix** (all quantified)
4. **Figma frame ref** (node id) + **Live URL/state**
5. **Annotated screenshot** filename
6. **Status** (Open / In Progress / Fixed / Won't Fix / Verified) + **Assignee** + **Date**

> If a finding has no visual and no quantified delta, it is not ready to ship to the dev.

---

## 6. Design-improvement proposals (beyond fidelity)

Because only key screens were designed, the audit also produces **forward-looking design proposals**:

- **Screen exists, no design** → propose a design that fits the DS (layout, components, tokens, states).
- **Design exists but is improvable** → propose enhancement (a11y, hierarchy, consistency, usability), flagged as `DESIGN BUG`/`ENHANCEMENT`.

These live in a separate tab/section from fidelity defects so the dev tracker stays clean, but share the same IDs and tracker.
