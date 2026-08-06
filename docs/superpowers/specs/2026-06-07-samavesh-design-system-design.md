# SAMAVESH Design System — Program Design Spec

> **Status:** Approved design (2026-06-07). Source of truth for the MoSJE design-system program.
> **Owner:** Design System team (MoSJE digital estate).
> **Scope of this spec:** the full program architecture + the concrete deliverables of Phase 2.0 ("architect + scaffold").
> **Supersedes:** the "intentionally empty until phase 2" note in `.claude/rules/design-system.md` — Phase 2 is now formally underway.

---

## 1. Thesis & North Star

**SAMAVESH** (समावेश — *"inclusion / bringing together"*) is the shared visual + interaction language for the entire MoSJE digital estate: **13 unified-website domains + 20 portals across 33+ organisations/schemes**, all rendering from **one versioned system**.

**Positioning claim (the moat):** the world's best systems are accessible **or** multi-brand **or** multi-framework. None are **natively multi-script Indic + WCAG 2.2 AA + sovereign-grade performance** from line one. SAMAVESH targets that intersection.

> Release gate, stated as a principle: *"It must work, accessibly, in Hindi and English, on a ₹6,000 Android phone on 3G."*

### What we take from the best (benchmarked against Material 3, USWDS, GOV.UK, Polaris, Carbon, Atlassian, Spectrum, Salesforce, Apple HIG, Fluent 2, Ant Design, Porsche, Uber Base, GitLab Pajamas, Goldman Sachs)

| From | Mechanic adopted |
|---|---|
| **Material 3** | Rigid 3-tier token model (reference → system → component) + algorithmic theming |
| **USWDS** | Unitless spacing scale + color grading; Section-508 rigor |
| **GOV.UK** | Components **vs.** Patterns split; evidence-led, plain language, progressive enhancement |
| **Shopify Polaris** | Content/voice as a first-class pillar (bilingual EN + HI) |
| **IBM Carbon** | Open governance, surface **layer** model (`layer-01/02/03`), best-in-class **data-viz** |
| **Atlassian** | CI **token-lint** — a hardcoded hex cannot be merged |
| **Adobe Spectrum** | Headless **behavior layer** — a11y/keyboard logic decoupled from styling |
| **Salesforce (origin of "design tokens")** | DTCG as platform-neutral source compiled everywhere |
| **Ant Design** | Built-in **i18n as a core primitive**; ruthlessly consistent component APIs; strong TS |
| **Uber Base** | **Overrides + theme-set swap** for multi-brand — never per-app forks |
| **GitLab Pajamas** | Fully open governance + explicit **component lifecycle** |
| **Goldman Sachs / Carbon** | **Density tokens** (comfortable/compact) + data-dense, compliance-sensitive patterns |
| **Apple HIG / Fluent 2** | Behavior adapts across **input methods** (touch/keyboard), not just layout |

---

## 2. Architecture — npm workspace topology

Graduate `packages/*` to a real **npm workspace** (non-breaking for the independent apps). Each package is independently versioned.

```
packages/
├── tokens/          @mosje/tokens         — DTCG JSON (source) → Style Dictionary → outputs
├── design-system/   @mosje/design-system  — React components (consumes @mosje/tokens)
├── icons/           @mosje/icons          — inline-SVG icon set (lucide gaps + gov emblems)
├── config/          @mosje/config         — eslint / tsconfig / tailwind presets (exists, extend)
└── docs/            @mosje/docs           — Storybook 8 (the living system)
```

**Non-breaking migration constraint:** the current `packages/design-system/tokens.css` becomes a **generated output** of `@mosje/tokens`, and the build MUST keep emitting the existing `--ds-*` variable names so `dosje/globals.css` (which imports `@mosje/design-system/tokens.css`) keeps building unchanged. New tiered names land **alongside** the legacy names. Each app must still build after every migration step.

---

## 3. Token architecture — DTCG-native, 3 tiers, theme-swappable

**Source of truth:** W3C **DTCG** JSON (`$value` / `$type` / `{alias}` references), authored to round-trip with **Tokens Studio** in Figma.
**Build:** **Style Dictionary v4** →
1. CSS custom properties (incl. backward-compatible `--ds-*` layer),
2. a TS token module,
3. a **Tailwind v3 preset** (portals) and a **Tailwind v4 `@theme`** (dosje),
4. a **Figma-import JSON** (for the push-to-Figma direction).

### Three tiers

```
Tier 1 — PRIMITIVE (private; never referenced in app code)
  color.blue.500 = #0373DF    space.4 = 16px    font.size.300 = 16px    radius.md = 8px

Tier 2 — SEMANTIC (the public contract; the ONLY tier apps consume)
  color.action.primary.{default|hover|pressed|disabled}
  color.text.{default|muted|onPrimary}      color.bg.{surface|muted|alt}
  color.border.{subtle|strong}              color.focus.ring
  color.status.{success|warning|danger|info}

Tier 3 — COMPONENT (per-component; resolves to semantic)
  button.primary.bg = {color.action.primary.default}
```

### Themes = token sets (not CSS overrides), shipped day one
- `light` (default), `dark`, **`high-contrast`** (essential for a Social Justice ministry; rare even among leaders).

### Density = token set (Goldman/Carbon influence)
- `comfortable` (default, public website), `compact` (data-dense portals / MIS dashboards like PM-AJAY).

### Multi-brand = theme-set swap + Uber-Base-style overrides (the 33-org mechanism)
- Each org/scheme gets a **brand theme set** (its accent on top of the shared semantic contract) — **not** a component fork.
- Component-level **overrides/slots** allow controlled per-org deviation where genuinely required.

### Multi-script typography (the differentiator)
```
font.family.latin          = "Noto Sans"
font.family.devanagari     = "Noto Sans Devanagari"
font.lineHeight.devanagari = 1.7   (Indic scripts need more leading than Latin)
```
Plus per-script size/line-height tokens so Hindi/Tamil/Bengali/Telugu render correctly — not "Latin shrunk." **i18n is a core primitive (Ant Design influence), not an add-on.**

### Enforcement
A **Stylelint/ESLint rule fails CI** on raw hex or Tier-1 primitive use in app/component code — operationalizing the existing `CLAUDE.md` "design tokens, never hardcoded" rule.

---

## 4. Component & pattern taxonomy

Atomic structure with the GOV.UK **Components vs. Patterns** split (the 20 portals are journey-heavy → patterns return the most leverage). Full matrix delivered this pass; build proceeds in tranches.

- **Atoms (13 exist — harden onto semantic tokens; then extend):** Button, Card, Badge, Chip, Checkbox, Radio, Toggle, Search, Alert, Loader, EmptyState, Avatar, AccessibilityWidget → add Input, Textarea, Select, Link, Tag, Tooltip, Spinner, Icon.
- **Molecules:** FormField (label + control + hint + error), Breadcrumb, Pagination, Tabs, Accordion, Table, Dropdown/Menu, Modal/Dialog, Drawer, Toast, Stepper, FileUpload, DatePicker.
- **Organisms:** GovHeader (emblem + ministry identity + language switcher), GovFooter (statutory links), MegaNav, DataTable (with density variants), Hero, NotificationBanner, CookieBanner.
- **Data-viz foundation (Carbon/Goldman influence):** accessible chart primitives (bar, line, donut, funnel) reusing the PM-AJAY dashboard patterns; tokenized chart palette with AA contrast.
- **Patterns (gov journeys):** Task list, Check-your-answers, Eligibility checker, Document/Aadhaar upload, Step-by-step, Grievance submission, Beneficiary lookup.

---

## 5. Accessibility & sovereignty — the floor is the law

- **WCAG 2.2 AA + GIGW.** Raised above minimum where it matters for India: touch targets **≥44px**, `high-contrast` theme, RTL/Indic-ready.
- **Progressive enhancement:** every component renders and functions **server-side without JS**; JS only enhances (GOV.UK doctrine; matters on low-end Android).
- **Behavior parity across input methods** (Apple HIG/Fluent): full keyboard maps + touch.
- **Performance budget as a release gate:** per-script font subsetting, CSS-variable theming (zero-runtime-JS theming), hard page-weight budget, throttled low-end-Android profile in CI.
- Each component ships a published **accessibility statement**. `axe` runs in CI; `accessibility-auditor` + `/a11y` + `/gov-compliance` gate every component.

---

## 6. Documentation — Storybook as the living system

Storybook 8 with: a11y addon, theme switcher (light/dark/high-contrast), density toggle, viewport + RTL/Indic toggles. Every component page follows a **mandatory 13-section template**:

1. Purpose · 2. Anatomy · 3. When to use / not (+ alternative) · 4. Variants · 5. States · 6. Behavior/keyboard · 7. **Accessibility** · 8. **Content/voice (EN + HI)** · 9. Code + props/API + token refs · 10. Responsive · 11. Evidence · 12. Related · 13. Changelog/deprecation.

Foundations docs: color, typography (multi-script), spacing, elevation, motion, iconography, grid, density, data-viz.

---

## 7. Governance — a versioned contract for 33 consumers

- **Semver** per package · categorized **CHANGELOG** (Added/Changed/Deprecated/Fixed/Accessibility).
- **Component lifecycle (GitLab Pajamas):** Proposed → Alpha → Beta → **Stable** → Deprecated, with an explicit deprecation window + **codemods** for renames.
- **Contribution/RFC flow**; component proposals require evidence + accessibility sign-off.
- **CI quality gates:** token-lint (no hardcoded) + visual regression + `axe` a11y + the `design-system-guardian` + `code-reviewer` agents.
- Consumers (13 sites + 20 portals) treated as a community consuming a versioned API.

---

## 8. Figma ⇄ code bidirectional sync

Two domains of ownership, one truth:
- **Figma owns** visual/token *values* (via **Tokens Studio** ⇄ DTCG JSON) and component *visuals*.
- **Code owns** component *behavior/API* (via **Code Connect**, mapping each Figma component to its coded counterpart).
- **Flow:** pull value changes **from** Figma (`get_variable_defs` / Tokens Studio export) → DTCG → Style Dictionary → code; push code-side structure & new tokens **back to** Figma (`figma-generate-library` / `use_figma`) + maintain Code Connect so neither drifts.
- `/sync-figma` is the reconciliation ritual against the **canonical SAMAVESH file** (see §8.1).

### 8.1 Figma library source of truth (decided 2026-06-07)
- **Canonical file:** **`3FF5l0SMNIwdpZrKkeyPTm`** — "SAMAVESH Design System" (https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System). This is the owner's **duplicate** of the original UX4G DS, designated as the single source of truth for the **code** design system. *(File key updated 2026-07-21 — the former key `qyzTEy8dlb3ssYctlkMX5o` resolves to this same document and is retained only in dated audit/handoff records.)*
- **Original left untouched:** `T3bkN5gNKfaNeY6dpT6FwF` (MoSJE – UX4G DS) is **frozen as-is** — not edited, not synced. It remains the legacy reference for any files still linked to it.
- **Bidirectional sync** runs between code ⇄ `3FF5l0SMNIwdpZrKkeyPTm`: pull token/value + visual changes **from** Figma (Tokens Studio ⇄ DTCG, `get_variable_defs`), push code-side structure & new tokens **back to** Figma (`figma-generate-library` / `use_figma`), Code Connect mapping each component both ways.
- **Eventual scope:** this file will also hold the **portal DS components** (the functional/transactional component set), making it the one library behind both the website and the 20 portals.
- **Working discipline:** modify in place (keys stable), additive-first, deprecate-not-delete (lifecycle §7), publish in reviewed batches; Figma publishing is non-destructive so consumers accept updates on their own schedule.

---

## 9. Skills & tooling orchestration

All required skills are **already installed** (registry audited — nothing to add). Mapped to job:

- **Tokens/Figma:** `figma:figma-generate-library`, `figma:figma-use` (mandatory pre-`use_figma`), `figma:figma-code-connect`, `figma:figma-generate-design`, `/sync-figma`, `anthropic-skills:theme-factory`.
- **Components/UI quality:** `frontend-design:frontend-design`, `anthropic-skills:impeccable`, `refactoring-ui`, `shadcn-ui`.
- **DS process:** `design:design-system`, `design:design-handoff`, `design:design-critique`.
- **A11y/compliance:** `anthropic-skills:web-accessibility`, `design:accessibility-review`, `/a11y`, `/gov-compliance`, `accessibility-auditor` agent.
- **Engineering rigor:** `superpowers:writing-plans`, `test-driven-development`, `verification-before-completion`, `engineering:documentation`, `code-reviewer` + `design-system-guardian` agents.

---

## 10. Phased roadmap

### Phase 2.0 — "architect + scaffold" (THIS engagement)
1. npm workspace wiring (non-breaking; each app still builds).
2. `@mosje/tokens`: DTCG JSON (3 tiers; light/dark/high-contrast; comfortable/compact; multi-script) + Style Dictionary build → CSS / TS / Tailwind-v3 / Tailwind-v4 / Figma outputs, **backward-compatible with `--ds-*`**.
3. Migrate the existing 13 atoms onto semantic tokens (verify `dosje` builds at each step).
4. Storybook scaffold + the 13-section doc template + foundations docs.
5. Governance docs: CONTRIBUTING, GOVERNANCE (incl. lifecycle), CHANGELOG, deprecation policy, token-lint config + CI gate sketch.
6. Component/pattern taxonomy matrix (the build backlog).
7. Figma reconciliation refresh + Code Connect bootstrap.
8. `packages/design-system/README.md` + top-level `SAMAVESH-DESIGN-SYSTEM.md` brain doc.

### Later phases
Component expansion in tranches → patterns → per-org brand theme sets for the 33 orgs → full Code Connect coverage → data-viz library → performance-budget CI.

---

## 11. Non-goals (YAGNI for now)
- No native (iOS/Android) token outputs yet — web only this phase (DTCG keeps the door open).
- No automated per-org theme generation yet — mechanism designed now, themes authored later.
- No multi-framework (Vue/Angular) ports — React only; architecture doesn't preclude it.

---

## 12. Risks & mitigations
- **Breaking `dosje` during token migration** → keep `--ds-*` output layer; build-verify each app per step.
- **macOS case-insensitivity** (per `CLAUDE.md`) → no case-variant dirs; use guarded moves, never `rm -rf`.
- **Figma drift** → Code Connect + token-lint as enforced gates, not conventions.
- **Scope creep** → Phase 2.0 deliverables (§10) are the contract; expansion is later phases.
- **No git repo yet** → spec lives in-tree; recommend `git init` for the workspace before implementation lands (user-driven).
