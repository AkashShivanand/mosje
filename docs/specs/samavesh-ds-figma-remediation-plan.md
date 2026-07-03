# SAMAVESH Design System — Figma File Remediation Plan

> **Goal:** Take the SAMAVESH Design System Figma file from a **B‑ ("capable but ungoverned")** state to a **benchmark, top‑10‑grade** government design system — *without splitting the file* and *without Code Connect* (both explicitly out of scope, decided 2026‑07‑01).
>
> **Source of truth for this plan:** the finalised structure audit + LLM Council verdict (single‑file governance track, style→variable consolidation as the true precondition).
>
> **File:** `SAMAVESH Design System` · `qyzTEy8dlb3ssYctlkMX5o` · published team library · 75 pages · 195 variables / 7 collections + 26 paint / 21 text / 12 effect / 11 grid local styles.

> **Execution status (2026‑07‑01):**
> - ✅ **WS‑0.1** governance sections added (Deprecation, Release Cadence, Ownership/RACI, Component Status Labels, UX4G Lineage).
> - ✅ **WS‑0.4** empty "Coming Soon" pages collapsed into one **Roadmap** page (75 → 68 pages).
> - ✅ **WS‑1.3** collections renamed: `Color Styles`→`Color`, `Text Styles`→`Typography`, `Misc`→`Component Options` (the lone `Slide Controls` boolean stays put; a full rehome would need recreate+rebind, deferred to the style pass).
> - ✅ **WS‑2** pages regrouped: Motion/Density + Icons—Material Symbols/Org Logos pulled up into Foundations (iconography now contiguous); Sidebar moved into Section Templates.
> - ✅ **WS‑3.1 / 3.3** naming: `Close button`→`Close Button`, `Charts & Graphs (Chart.js)`→`Charts & Graphs`, all 4 dividers standardised to the 31‑dash house style.
> - ⚠️ **WS‑0.2 (corrected):** Figma has **no dedicated library-description field** on this plan — File details has none, and the publish dialog only takes a per-version changelog. The library description therefore lives **in-file on the Cover/Thumbnail + Get Started pages** (both already exist in this file). That is the canonical home for a DS library description; add/refine the blurb there.
> - 🔁 **WS‑3.2 revised** — the team deliberately *removed* emoji page-prefixes in v2.0, so the convention is **plain-text section headers, no emoji.**
> - ✅ **WS‑3.4** section headers renamed to plain `Foundation` / `Components` (per user decision; lineage documented on governance page).
> - ✅ **WS‑1.6** Figma↔`@mosje/tokens` **drift report produced** → [`samavesh-token-drift-report.md`](./samavesh-token-drift-report.md). Finding: two divergent token systems; spacing/radius/motion perfectly aligned, but semantic colour/typography naming, theming axes (Figma missing HC mode + Devanagari font), and several values (Warning colour, dark neutrals) have drifted. Full reconciliation scoped there as a deliberate branch-based project.
> - ✅ **WS‑1.1/1.2 (style-retirement) — RESOLVED as a NON-ISSUE (2026‑07‑02 audit).** The feared "26 duplicate colour paint styles" do not exist: the local paint styles are **20 avatar IMAGE fills**, the **21 text styles are all variable-bound** to the Typography variables, and the effect/grid styles are legitimate composites (shadows, focus rings, layout grids) with no variable equivalent. **Colours are 100% variable-driven — there is no dual colour system to consolidate.** The token layer is clean/benchmark-grade. This raises the token-architecture grade to **A**.
> - ✅ **badge.beta** component token added + BETA badge rewired; `--ds-gov-yellow` kept as deprecated alias (non-breaking). `Badge/Beta` Figma variable created.
> - ✅ **Foundation page names** aligned to collections: `Color Styles`→`Color`, `Text Styles`→`Typography`.
> - 🔄 **WS‑4 component documentation — STARTED.** Gold-standard doc template established (Overview · Variants & Sizes · States · Do & Don't · Usage · **Accessibility (WCAG 2.1 AA / GIGW)** · Variant Properties), and applied to the 4 priority components: **Button, Input, Modal, Table** — each with component-specific a11y (button roles/keyboard, input labels/aria-invalid, modal focus-trap/aria-modal, table scope/aria-sort). Each panel sits below the component art on its page. **Remaining ~48 pages follow this exact template as a batch program** (next suggested batch: Checkbox, Radio, Toggle, Dropdown, Tabs, Accordion).
> - ⏭️ **Optional enhancements (lower priority):** WS‑1.4 density tokens (only 1 today); a fuller Figma semantic/component token tier to mirror code (deprioritised with Code Connect out of scope). WS‑5 onboarding largely covered by the enriched Get Started page.
> - All edits are **unpublished** — publish per‑phase.

---

## 0. Decisions & guardrails (locked)

| Decision | Ruling |
|---|---|
| **Split the file into multiple libraries?** | ❌ No. Stay a single, well‑governed file. |
| **Code Connect sync?** | ❌ Out of scope for this plan. |
| **Consequence for token work** | Style→variable consolidation is **still P0**, re‑justified by (a) `@mosje/tokens` DTCG parity, (b) designer clarity (one source of truth), (c) drift prevention — not by Code Connect. |
| **Mode naming (`Blue - Light`/`Blue - Dark`)** | Keep **aligned to code** (`data-color-mode: blue-light` default). Parity beats purity. Document a future brand axis; do **not** rename in a way that breaks code parity. |
| **Non‑negotiables** | Noto Sans, Material Symbols Rounded, National Emblem, WCAG 2.1 AA + GIGW, no tricolour stripe motif, brand tokens only. |

---

## 1. What "benchmark" means (acceptance rubric)

The file is done when it scores **A / "reference‑grade"** on every row. This rubric is the definition of done and the review checklist.

| Dimension | Benchmark bar |
|---|---|
| **Governance** | Live changelog, semver‑style versioning policy, contribution model, deprecation policy, RACI/ownership, component **status labels** (Ready / Beta / Deprecated), documented SAMAVESH↔UX4G lineage. |
| **Token architecture** | One source of truth per value. No hard‑coded duplicate styles. Collections cleanly named & scoped. Density & theme modes actually wired. Figma ↔ `@mosje/tokens` names/values reconciled. |
| **Information architecture** | Logical top‑to‑bottom narrative; foundations together; iconography in one place; scannable page list with consistent section prefixes. |
| **Naming conventions** | One divider style, one casing rule, no implementation detail in design names, one branding namespace. |
| **Component quality** | Every component page carries anatomy, variants matrix, all interaction states, do/don't, usage guidance, **a11y spec**, consistent variant‑property names, variables + auto‑layout throughout. |
| **Onboarding/adoption** | Get Started explains subscribe → use variables → theming (light/dark, density) → contribute; New‑in page maintained. |

---

## 2. Workstreams & tasks

Five workstreams, sequenced P0 → P2. Each task has an **acceptance criterion**. Effort is rough designer‑days for a small team.

### WS‑0 · Governance scaffolding — **P0** (~1.5 days, near‑zero design skill, highest leverage)

| # | Task | Acceptance criterion |
|---|---|---|
| 0.1 | **Fill the empty `Changelog & Governance` page.** Sections: Versioning policy (design‑semver: MAJOR = breaking component API/token rename, MINOR = additive, PATCH = fix), Release cadence, Contribution model (who can edit, branch → review → publish flow), Deprecation policy, Ownership/RACI, **SAMAVESH↔UX4G lineage statement**. | Page has all 7 sections filled with real content; no placeholders. |
| 0.2 | **Write the library description** — note there is **no dedicated description field** on this Figma plan. Put the blurb **in-file on the Cover/Thumbnail and Get Started pages** (the canonical home for a library description). One paragraph: what it is, who it's for, how to enable it. Draft copy provided by the assistant. | Cover/Get Started carries the description blurb. |
| 0.3 | **Component status system.** Define labels **Ready / Beta / Deprecated** (+ colour tokens) and a status badge convention applied to each component page header. | Convention documented on governance page; badge component exists. |
| 0.4 | **Collapse the 8 empty "Coming Soon" pages** (Button Groups, DigiLocker MeriPehchan Flow, File a Grievance Flow, Forms, Page Templates, Signup/Login, Upload) into **one `🗺 Roadmap` page** with a status table. | 8 empty pages removed; single Roadmap page lists them with target status. |

### WS‑1 · Token & variable hygiene — **P0** (the council's "one thing") (~2–3 days)

| # | Task | Acceptance criterion |
|---|---|---|
| 1.1 | **Style‑vs‑variable audit.** Classify each of the 26 paint / 21 text / 12 effect / 11 grid local styles: (a) legitimately composite & variable‑backed → keep, (b) hard‑coded duplicate of a variable → retire/rebind. | A written classification table (style → verdict → target variable) exists. |
| 1.2 | **Consolidate colours.** Retire hard‑coded duplicate paint styles; rebind their consumers to the 139 colour variables. Keep only composite styles that reference variables. | Zero paint styles hold a raw hex that duplicates a variable value. |
| 1.3 | **Rename collections** for clarity: `Color Styles` → `Color` (or `Color / Semantic`), `Text Styles` → `Typography`. **Eliminate `Misc`** (rehome its 1 variable into a properly named collection). | No collection named "…Styles" or "Misc"; renames don't break existing bindings. |
| 1.4 | **Wire the Density axis.** The `Density` collection has 2 modes (Comfortable/Compact) but only 1 variable. Add spacing / sizing / min‑target‑size tokens bound to both modes so the axis actually changes layout. | Density modes drive ≥ a defined set of spacing/sizing tokens; a demo frame visibly responds to mode switch. |
| 1.5 | **Verify variable scopes** are explicit (not `ALL_SCOPES`) so property pickers stay clean. | Each variable has a purposeful scope; spot‑check passes. |
| 1.6 | **Figma ↔ `@mosje/tokens` reconciliation.** Diff Figma variable names/values against the DTCG source (`packages/tokens`). Flag drift; align names where safe. (Use the `/sync-figma` command.) | A drift report exists; agreed mismatches resolved or logged as intentional. |

### WS‑2 · Information architecture & page order — **P1** (~1 day)

| # | Task | Acceptance criterion |
|---|---|---|
| 2.1 | **Move Motion & Density up** into the Foundations cluster (they currently sit at the bottom below the WIP graveyard). | Motion & Density appear within Foundations, not after components/templates. |
| 2.2 | **Consolidate iconography.** Merge `Logos and Misc Icons`, `Icons`, `Icons — Material Symbols`, `Org Logos` into one contiguous **`🎨 Foundations / Iconography`** area with clear sub‑pages (Material Symbols, Logos, Org Logos). | Icons/logos live in one contiguous section; no icon page stranded elsewhere. |
| 2.3 | **Reorder the whole page list** to a benchmark narrative: `Cover → Get Started → What's New → Changelog & Governance → Roadmap → Foundations → Components (by category) → Patterns/Templates → Playground`. | Page order matches the narrative; section numbers == position. |
| 2.4 | **Audit the `Cursor` page** (43 children) for junk/dead artifacts. | Cursor page contains only intentional, named assets. |

### WS‑3 · Naming & convention standardisation — **P1** (~0.5 day)

| # | Task | Acceptance criterion |
|---|---|---|
| 3.1 | **One divider style.** Replace the mixed `------` / `-------------------------------` with a single agreed divider glyph. | All divider pages identical. |
| 3.2 | **Section convention (REVISED — no emoji).** The team deliberately removed emoji page-prefixes in v2.0, so do **not** re-add them. Instead standardise a **plain-text** convention: consistent `Category / Component` naming, one divider glyph for section breaks, and header pages in a consistent case. Document on governance page. | Convention documented and applied to every page; no emoji prefixes. |
| 3.3 | **Fix casing & impl leakage.** `Close button` → `Close Button`; `Charts & Graphs (Chart.js)` → `Charts` (move "Chart.js" to page description). Consistent Title Case across pages. | No casing outliers; no library/impl names in page titles. |
| 3.4 | **Resolve SAMAVESH vs UX4G namespace.** Pick one for section headers (`UX4G Foundation`/`UX4G Components` vs SAMAVESH); document the lineage rather than mixing silently. | Single namespace in headers; lineage explained on governance page. |

### WS‑4 · Component content quality (the benchmark differentiator) — **P1 template, P2 rollout** (~4–6 days)

| # | Task | Acceptance criterion |
|---|---|---|
| 4.1 | **Define the component‑page template.** Standard sections: **Anatomy · Variants matrix · States (default/hover/focus/active/disabled/error) · Do & Don't · Usage guidance · Variant‑property naming · A11y spec (contrast, focus order, keyboard, ARIA/role, target size) · Density/responsive behaviour.** | Template frame exists and is documented. |
| 4.2 | **Coverage matrix.** Score all ~52 component pages against the template; produce a gap list. | A matrix (component × section) with RAG status exists. |
| 4.3 | **Backfill gaps**, prioritising high‑traffic components (Buttons, Inputs, Modal, Tables, Alerts, Accordion, Dropdown, Pagination, Tabs). | Each prioritised component meets the template; a11y spec present. |
| 4.4 | **Hygiene pass:** components use variables (no hard‑coded values), auto‑layout, sensible constraints, meaningful layer names, and a **component description**. | Spot‑check of 10 components passes all five checks. |
| 4.5 | **A11y annotations** on every component (GIGW/WCAG AA): documented focus state, contrast pass, keyboard model. Run the `accessibility-auditor` mindset. | Every prioritised component has an a11y note; contrast values recorded. |

### WS‑5 · Onboarding & adoption — **P2** (~1 day)

| # | Task | Acceptance criterion |
|---|---|---|
| 5.1 | **Rebuild Get Started** (currently 1 frame): how to subscribe to the library, how to use variables & modes, **theming guide** (Blue‑Light/Blue‑Dark, Comfortable/Compact), how to contribute (link to governance). | Get Started covers subscribe → use → theme → contribute. |
| 5.2 | **Maintain `New in 2.0`** and link it to the changelog going forward. | New‑in page current; links to changelog. |

---

## 3. Execution sequence (single dependency line)

```
WS‑0 Governance  ─┐
WS‑1 Token hygiene ┤─► WS‑2 IA/order ─► WS‑3 Naming ─► WS‑4 Component template ─► WS‑4 rollout ─► WS‑5 Onboarding ─► Verify & re‑publish
   (P0, parallel)         (P1)            (P1)             (P1)                       (P2)              (P2)
```

- **Do WS‑0 and WS‑1 first and in parallel** — cheapest, highest leverage, and WS‑1 (one source of truth) is the precondition the council unanimously flagged.
- **All edits happen in a Figma branch**, verified on one consumer, then merged and re‑published — no risky edits on `main`.
- **Re‑publish once per phase**, not per task, to keep consumer‑update noise low.

## 4. Milestones

| Milestone | Contains | Rough effort |
|---|---|---|
| **M1 — Governed & clean** | WS‑0 + WS‑1 | ~4 days |
| **M2 — Navigable & consistent** | WS‑2 + WS‑3 | ~1.5 days |
| **M3 — Benchmark components** | WS‑4 | ~4–6 days |
| **M4 — Adoption‑ready** | WS‑5 + final verification, a11y audit, re‑publish, announce | ~1.5 days |

## 5. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Renaming collections/pages breaks existing bindings/instances | Do it in a **branch**; verify one consumer relinks cleanly before merge; renames (not deletes) preserve IDs. |
| Retiring paint styles orphans consumers | Rebind before retire; never delete a style with live consumers. |
| Density token changes shift existing layouts | Introduce density tokens additively; QA a demo frame per mode. |
| Figma↔`@mosje/tokens` drift is larger than expected | WS‑1.6 produces a drift report first; align only where safe, log the rest. |
| Scope creep on WS‑4 (52 pages) | Template + coverage matrix first; backfill by priority; "Ready" status gates completeness. |

## 6. Out of scope (this plan)

- Splitting the file into multiple libraries.
- Code Connect setup.
- New components not already present or roadmapped.
