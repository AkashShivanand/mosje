# SAMAVESH Design System — Figma File Audit

> Reviewer lens: Design System Manager (20 yrs). Question: *is this file structured correctly for a team to consume, by industry standards?*
> File: `qyzTEy8dlb3ssYctlkMX5o` ("SAMAVESH Design System"). Method: live Figma Plugin-API inspection of page architecture, variable collections, and component engineering (Buttons, Card, Inputs sampled in depth). Date 2026-06-14.

---

## Verdict

**Build quality: A. Documentation & governance: C.** This is a **technically excellent, genuinely well-engineered** system — the token architecture and component APIs are better than most production design systems I've reviewed. But it is **under-documented and its adoption scaffolding is unverified**, which is exactly what blocks *team* usage. A team of engineers and designers could build *from* it today, but would repeatedly ask "which variant? what are the rules? is this the published one?" — friction that documentation and governance exist to remove.

**Overall maturity: 3.5 / 5 (Established, not yet Scaled).** Ship-ready as a kit; not yet ship-ready as a *self-serve product* for a multi-team estate.

### Scorecard
| Dimension | Grade | One-line |
|---|---|---|
| File architecture & navigation | **A−** | Benchmark page structure (Cover → Get Started → Foundation → Components-by-category → Templates → Coming Soon) |
| Token / foundation system | **A** | Primitive→semantic layering, Light/Dark colour modes, responsive type, t-shirt spacing/radius |
| Component engineering | **A−** | Real sets, exhaustive variants, advanced component properties, token-bound fills |
| Documentation & guidelines | **D** | **Zero component descriptions** found; usage rules live only as loose canvas text |
| Naming & consistency | **B−** | Mostly clean; duplicate component names exist |
| Accessibility | **C+** | Focus-state styles + AA-ish tokens, but no documented per-component a11y guidance |
| Governance (publish / version / Code Connect) | **C** | Versioning hinted ("New in 2.0"); publish status & dev handoff unverified |

---

## What's genuinely strong (keep doing this)

1. **Token architecture is top-tier.** One `Color Styles` collection with **`Blue - Light` / `Blue - Dark` modes**, primitive ramps (50–900) aliased to semantic roles (`Text/*`, `Stroke/*`, `Primary/Source`…), full status families incl. Info & Warning + transparent ladders. `Typography` is **responsive across `Desktop / Tablet / Mobile`** with a complete role scale; `Spacing` and `Border Radius` use a clean t-shirt scale. This is a proper 3-tier token system, not flat styles.
2. **Components are real and richly built.** Sampled sets:
   - `Button` — **540 variants** (Size × Type × Sub-type × State × Icon) + component properties `Text` (text), `Change Icon` (instance-swap).
   - `Cards` — 4 variants + **9 slot properties** (Header, Image, Title, Subtitle, Body, Footer, Header icon, 2× Footer buttons) as boolean/instance-swap toggles.
   - `Input Fields` — Size × State (21) with Label, Caption, icons, Required slots.
   These are advanced, composable component APIs — instance-swap + text + boolean props, the modern best practice.
3. **Fills are bound to variables, not hardcoded.** Every sampled component's fills resolve to token variables → re-theming via modes actually works.
4. **Page architecture matches the benchmark** (Material/Polaris/Carbon): cover, getting-started, foundations, components grouped by function, templates, coming-soon backlog.

---

## Gaps & risks (by severity)

### 🔴 Blockers to smooth team adoption
1. **No component descriptions (systemic).** Sampled **8 component sets** across Buttons/Card/Inputs — **all had `description` length 0**. Consumers get no usage guidance, prop explanation, or do/don't in the Assets panel or Dev Mode. Industry standard (Polaris, Material, Carbon) = every component carries a description + usage + a11y notes. *This is the single biggest adoption blocker.*
2. **Publishing & versioning unverified.** Could not confirm via API that the library is **published** (teams can only consume a *published* library) or that versions are tagged. "New in 2.0" suggests versioning intent, but there's no visible changelog/release discipline.

### 🟠 Major
3. **Duplicate component names.** The Inputs page has **two different `Input Fields` component sets** (one Size×State/21, one State/3). Duplicate names are ambiguous in the Assets panel — consumers can't tell which to insert. Every published component name must be unique and intention-revealing.
4. **Variant explosion risk.** `Button` at **540 variants** is exhaustive but heavy to maintain and slow to navigate. Modern practice trims the matrix by pushing orthogonal axes (e.g. Icon position) onto component *properties* rather than variants.
5. **No dev handoff layer (Code Connect).** For a code-backed estate, Code Connect mapping is the standard for design↔code parity; per project notes it's not wired (needs a Dev seat). Without it, engineers re-interpret components by eye.
6. **Usage guidance is unstructured.** The Inputs page has ~3,000 chars of canvas text (specs/annotations) — good intent — but it's free-floating, not attached to components and not consistently present. It won't surface where consumers actually work.

### 🟡 Minor
7. **Status signal lost with the emoji cleanup.** Stripping `🟢/🟡` removed the at-a-glance built/coming-soon marker. The "Coming Soon" section still groups WIP, so it's acceptable — but consider a lightweight status field (component description tag or a "Status" page legend).
8. **Section grouping uses labeled pages, not native dividers.** A Figma API limitation (naming a divider reverts it to a page), so this is the correct available choice — note it so no one "fixes" it incorrectly.
9. **Accessibility is present but undocumented.** Focus-state effect styles and AA-leaning tokens exist, but there's no per-component contrast/keyboard/touch-target guidance.

---

## Prioritised recommendations

| # | Action | Effort | Impact |
|---|---|---|---|
| 1 | **Add a description to every published component** (1–2 lines: what it is, when to use, key props, a11y note). Start with the top 10 most-used. | M | 🔴 highest |
| 2 | **Confirm the library is published + adopt semantic versioning** with a visible Changelog page (extend "New in 2.0"). | S | 🔴 |
| 3 | **De-duplicate the `Input Fields` names** (e.g. `Input Field` vs `Input Field / Compact`). Sweep all pages for name collisions. | S | 🟠 |
| 4 | **Wire Code Connect** for the core components once a Dev seat is available (per `docs/research/figma-code-connect-readiness.md`). | L | 🟠 |
| 5 | **Standardise a component-page template** (anatomy · variants · states · props · do/don't · a11y) so every page documents the same way. | M | 🟠 |
| 6 | **Trim `Button` variants** by moving Icon position to a property; target < ~100 variants. | M | 🟡 |
| 7 | Add a **contribution + governance page** (how to request/propose components, review process, ownership). | S | 🟡 |

---

## Bottom line
The **engineering is ready; the product wrapper is not.** Tokens and components are built to a high standard and are genuinely token-driven and composable. To be "structured correctly for a team," close the **documentation** gap (component descriptions + consistent page docs) and the **governance** gap (verified publishing, versioning, Code Connect). Do those and this moves from a strong *kit* to a self-serve *design system* a multi-team government estate can scale on.

---

## Remediation log — 2026-06-14 (applied to `qyzTEy8dlb3ssYctlkMX5o` only)

**Fixed in-file:**
- ✅ **Component descriptions added across all 35 component pages** — each set/component now carries *what it is · when to use · variants/props · accessibility note*. Pre-existing descriptions (e.g. Tooltip, Loader, List) were preserved.
- ✅ **Naming defects fixed:** `Input Fields` (duplicate) → `Input Field` + `Input Field — Label & Description`; `Dropdownn Menu` → `Dropdown Menu`; `Accessibiliity Icons` → `Accessibility Icons`.
- ✅ **Changelog & Governance page created** (how-to-use · contribution & requests · semver policy · release log), placed after "New in 2.0".
- ✅ **Naming convention adopted + swept across all component pages.** Standard: **top-level = `PascalCase` singular matching the code component name** (`Button`, `IconButton`, `DatePicker`, `EmptyState`, `ProgressBar`); **sub-parts = `Parent / Subpart`** (`Card / Header`, `Dropdown / MenuItem`, `Tabs / Tab`); **private helpers = `.`-prefixed** (`.ToastStatus`, `.AccessibilityIcons`). All duplicates resolved (`Tabs`/`Tab`, `ProgressBar`/`Progress bar`, `Input Fields`, Stepper's 9 sets) and typos fixed (`Dropdownn Menu`, `Accessibiliity Icons`). Rationale: 1:1 Figma↔code name parity is the biggest design→dev handoff win.
- ✅ (Earlier this session) pages regrouped into functional categories + emoji prefixes stripped.

**Still open — needs a human decision or manual action (not auto-applied):**
- ⏳ **Publish the library + tag v2.0** — manual Figma action (Assets panel → Publish). Required before teams can consume it.
- ⏳ **Trim Button's 540 variants** (move Icon position to a property) — deliberate change, do with the component owner.
- ⏳ **Code Connect** — not available on the current Figma plan.
