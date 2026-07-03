<!--
  SAMAVESH Design System — Information Architecture (v2)
  A universal, white-labellable government design system.
  One source generates four surfaces: code, docs portal, design.md, Figma.
  Last reviewed: 2026-06-25 · supersedes v1 (see §12 What changed)
-->

# SAMAVESH Design System — Information Architecture

This is the structural contract for `@mosje/design-system`: the taxonomy every
surface inherits, and the model that lets the system be **re-skinned for any
government body** without touching its components, patterns, or accessibility.

It is the structural counterpart to `design.md` (the content/usage contract).
New tokens, components, patterns, and doc pages get a home here first.

## 0. The two ideas that drive everything

1. **Universal Core + Brand Layer.** The system splits into an *invariant
   universal core* (semantic tokens, components, patterns, page templates,
   accessibility, behaviour) and a thin *swappable brand layer* (one brand pack:
   colours, emblem/logo, typeface, names, assets). To stand up a new portal for
   a different ministry, department, or state body, you author **one brand pack**
   and inherit everything else. This is what makes the DS *white-labellable* and
   more versatile than single-brand benchmarks. See §2 and §7.

2. **One source generates the surfaces.** The taxonomy is not maintained by hand
   in four places. A single machine-readable **registry** is the source; the docs
   portal nav (and therefore `llms.txt`) is *generated* from it, and `design.md`
   and Figma align to the same registry semantically. Drift becomes a generation
   bug, not an organisational discipline problem. See §8.

## 1. North-star: a universal government design system

Most government design systems are single-tenant: GOV.UK is one brand, USWDS is
US-federal-branded, India's UX4G ships one identity. SAMAVESH is built so the
**core is brand-agnostic** and the brand is a swappable layer. That buys three
things benchmarks do not offer together:

- **Reuse across the estate.** The same core serves MoSJE's unified website, its
  20 portals, and 33+ org/scheme sub-brands from one definition.
- **White-label for any government body.** A new department, commission, state
  portal, or scheme stands up by supplying a brand pack. The 20th portal costs a
  fraction of the 5th.
- **AI-buildable + compliant.** Components ship accessible and the machine
  contract (tokens JSON, `design.md`, `llms.txt`, Code Connect) lets agents
  assemble screens that inherit the structure. Compliance is still *audited*, not
  assumed (see §3.1).

"Versatile" here is concrete: **swap the brand layer, keep the system.**

## 2. The two-layer model (Universal Core vs Brand Layer)

```
┌──────────────────────────────────────────────────────────────────┐
│  BRAND LAYER  (per portal — the white-label surface)             │
│  • Brand colour ramp (primitive tier) + optional accent           │
│  • Emblem / logo (light + dark) / favicon                         │
│  • Portal + zone names, footer/contact, locale defaults           │
│  • Optional typeface (must stay licensed + accessible)            │
│  • Optional motion tone                                            │
├──────────────────────────────────────────────────────────────────┤
│  UNIVERSAL CORE  (invariant across every portal)                  │
│  • Semantic token contract (--ds-* / --sa-*)                      │
│  • All components, patterns, page templates                       │
│  • Accessibility behaviour + AA contrast pairings                 │
│  • Spacing / radius / shadow / motion / type-role scales          │
│  • Data-visualisation layer (structural tokens neutral)           │
└──────────────────────────────────────────────────────────────────┘
```

The split maps exactly onto the **existing three-tier tokens**: the brand pack is
the *primitive* tier plus assets; the *semantic* and *component* tiers are the
invariant contract. `data-color-mode` already proves a brand ramp can be swapped
live (blue-light / blue-dark); white-labelling generalises that to N brand packs.

**Invariant means invariant.** A brand pack may not fork a component, change a
semantic token's meaning, or weaken accessibility. It changes *values and assets*,
never *structure or behaviour*. That guarantee is what keeps 33 portals coherent.

## 3. Principles

1. **One taxonomy, generated — not hand-synced.** The registry is the source; the
   docs nav and `llms.txt` are generated. `design.md` and Figma align semantically.
   No four-way merge-gate (that was rejected as a coupling trap in review).
2. **Universal Core is brand-blind.** Nothing in the core hardcodes a brand value;
   everything reads semantic tokens, so a brand swap re-skins it for free.
3. **General → specific, by frequency and dependency.** Foundations → Tokens →
   Components → Data Viz → Patterns → Templates. Most-used item leads each group.
4. **Function over form.** Components group by what the user does (act, input,
   navigate, get feedback, read data, see data), not by visual shape.
5. **Plain labels for a mixed audience.** Names are written for a developer or
   designer at any of 33 bodies, not for the authors. Any label that needs a
   parenthetical to be understood is a defect (§9). Labels are tree-tested with a
   non-author before they freeze (§10).
6. **Accessibility is first and audited.** Accessibility & Compliance leads
   Foundations because it is a legal mandate (WCAG 2.1 AA + GIGW + DBIM). It is
   *verified per release*, never assumed (§3.1).

### 3.1 Honest accessibility (replaces "compliance by construction")

The system makes the *accessible default the easy default*: components ship with
semantic markup, focus management, sr-only data tables for charts, and AA-checked
semantic colour pairings. **It does not certify compliance automatically.** Every
release is audited with the `accessibility-auditor`; white-labelling adds one
guarantee — **brand packs are contrast-gated**: a new brand ramp is checked in CI
against the semantic pairings (text-on-surface, on-primary, focus ring, chart
palette) and fails the build if any pair drops below AA. That is the real,
defensible version of "the brand can't break accessibility."

## 4. Benchmark synthesis, and how we go beyond it

| System | Top-level spine | Multi-brand? | AI contract? |
|--------|-----------------|--------------|--------------|
| Material 3 | Foundations · Styles · Components | No | No |
| Polaris | Foundations · Content · Components · Patterns · Tools | No | No |
| Carbon | Foundations · Components · Patterns · **Data Viz** · Tools | Themes (single org) | No |
| Atlassian | Foundations · Components · Patterns · Resources · Brand | No | No |
| Ant | Global styles · Components (functional groups) | ConfigProvider theming | No |
| USWDS / GOV.UK | Foundations · Components · Patterns · Utilities | Single gov brand | No |
| **SAMAVESH** | the 7 pillars below | **Yes — brand packs (white-label)** | **Yes — registry + Code Connect** |

We adopt the common spine (`Foundations → Tokens → Components → Patterns →
Resources`), Carbon's **Data Visualization** pillar, and Ant's functional
component grouping. We go beyond with the **Brand Layer (white-label)**, the
**generated registry**, and a **Page Templates** track — none of which the
benchmarks ship together.

## 5. The canonical IA (7 human pillars + a generated machine contract)

**Bold = new/changed since v1.** Machine Interface is **no longer a navigation
pillar** (humans skip it); it lives under Resources and is the generation
substrate. Templates is present but **stubbed** until shells beyond the login
shell exist.

```
0. Get Started
   ├─ Overview & principles
   ├─ Install / consume the core
   ├─ For Designers
   ├─ For Developers
   ├─ For AI Agents                       (single home for agent guidance)
   └─ White-label your portal             ← NEW (author a brand pack)

1. Foundations
   ├─ Accessibility & Compliance (WCAG 2.1 AA · GIGW · DBIM)   ← first, audited
   ├─ Brand & White-Labelling (the brand pack contract)        ← NEW, central
   ├─ Colour & Theme            (decisions + links to token values — see §8.1)
   ├─ Typography
   ├─ Iconography (Material Symbols Rounded)
   ├─ Layout & Grid
   ├─ Spacing
   ├─ Shadows & Corners         (was "Elevation & Shape")
   ├─ Motion
   └─ Content & Localization (bilingual, en-IN formatting)

2. Tokens
   ├─ Three-tier model (primitive → semantic → component)
   ├─ Brand tokens vs core tokens   ← the white-label boundary
   ├─ The contract (--sa-* source, --ds-* aliases)
   ├─ Generated outputs (CSS, Tailwind v3/v4, TS, Figma)
   └─ Theming attributes (data-color-mode / data-theme / data-density / data-brand)

3. Components            (grouped by function — see §6)
   ├─ Actions · Inputs & Forms · Navigation · Feedback & Status
   ├─ Data Display · Layout & Containers
   └─ Utilities (Icon, ColorModeProvider/Switcher, UX4GAccessibilityWidget)

4. Data Visualization
   ├─ Chart catalogue (13) · Palettes (categorical/sequential/diverging)
   ├─ Dashboard composition (ChartCard, DashboardGrid, KpiRow, FilterBar)
   └─ Chart accessibility (sr-table, role=img, keyboard marks)

5. Patterns              (reusable solutions)
   ├─ Form validation & errors · Filtering & search · Pagination
   ├─ Empty / loading / error states · Notifications & confirmations
   ├─ Role-based UI · Demo-credentials panel
   └─ Page templates (index)        (links into pillar 6 as shells ship)

6. Templates (Page Shells)           ← present but STUBBED
   ├─ Login Shell (PortalLoginShell)            [shipped]
   └─ Dashboard / List / Detail / Wizard / Report / Public shells   [emerging]

7. Resources
   ├─ Brand pack authoring guide + starter pack
   ├─ Machine Interface (AI contract): registry, design.md, AGENTS.md,
   │   llms.txt, Code Connect, tokens JSON          ← demoted here from a pillar
   ├─ Icon library · Assets & downloads
   ├─ Changelog & versioning · Governance & lifecycle · Contributing · Roadmap
```

## 6. Component groups (functional taxonomy)

Every component has exactly one home. **Bold = shipped.** All read semantic
tokens only, so all are brand-blind by construction.

| Group | Shipped | Near-term |
|-------|---------|-----------|
| **Actions** | **Button** | IconButton, ButtonGroup, Link, Menu/Dropdown |
| **Inputs & Forms** | **Input, Textarea, Select, Checkbox, Radio, Toggle, Search, Chip, FormField, FormSection, FormCard, Wizard/ReviewSection, MediaUpload** | DatePicker, Combobox, FileUpload, Slider |
| **Navigation** | **SiteHeader, SidebarNav, Footer, Tabs/TabPanel, AppSwitcher** | Breadcrumb, Pagination, Menu |
| **Feedback & Status** | **Alert, Badge, Toast/useToast, Modal, Loader, EmptyState, Stepper** | Tooltip, Banner, Skeleton |
| **Data Display** | **Card, Avatar, DataTable, MetricCard** | List, DescriptionList, Tag, Timeline |
| **Layout & Containers** | **DashboardGrid, ChartCard** | Stack, Grid, Container, Divider, Page |
| **Utilities** | **Icon, ColorModeProvider/Switcher, UX4GAccessibilityWidget** | VisuallyHidden, FocusTrap |
| **Data Visualization** *(pillar 4)* | **Pie, Donut, Bar, Line, Area, Gauge, Progress, Sparkline, Funnel, Scatter, Heatmap, Combo, IndiaMap** + composition | TreeMap, Waterfall, district map |

## 7. Brand Layer — the white-label spec

A **brand pack** is the only thing a new portal must supply. It lives at
`brands/<brand-id>/` and feeds the existing token pipeline.

```
brands/<brand-id>/
├─ tokens.brand.json     # DTCG primitive brand values: brand ramp 50–900,
│                        #   accent, optional status-hue overrides → emitted as
│                        #   that portal's --sa-* brand primitives by Style Dictionary
├─ brand.config.ts       # portal name, zone label, footer/contact, locale defaults,
│                        #   default typeface id, default data-color-mode
├─ emblem.svg            # National Emblem (or the body's official mark)
├─ logo.svg / logo-dark.svg
├─ favicon.svg
└─ typography.brand.json # OPTIONAL — only if the typeface differs from Noto Sans
                         #   (must be licensed + AA-legible; Noto Sans is the GoI default)
```

**Swappable (brand pack):** brand colour ramp + accent, emblem/logo/favicon,
portal/zone names + footer, locale defaults, optional typeface, optional motion
tone.

**Invariant (universal core, never per-brand):** semantic token contract, every
component, every pattern, every page template, accessibility behaviour, the
spacing/radius/shadow/type-role scales, chart structural tokens.

**How a portal selects a brand.** Two supported modes:
- *Build-time (default, one portal = one brand):* the app imports its brand pack;
  Style Dictionary emits that portal's `--sa-*` brand primitives. Zero runtime cost.
- *Runtime (optional, multi-tenant host):* a `data-brand="<id>"` attribute selects
  among bundled brand packs, the same mechanism `data-color-mode` already uses.

**Stand up a new government portal (the payoff):**
1. `cp -r brands/_starter brands/<new-body>` and fill in colours + assets + names.
2. Run the token build — the new brand's `--sa-*` primitives generate.
3. CI contrast-gate passes (or tells you which brand colour fails AA).
4. Compose the screens from page templates + components. No core code is touched.

This is the honest version of the "portal factory": a new ministry/department/
state portal is a brand pack plus content, not a rebuild.

## 8. One source, four surfaces (generation, not a CI lock)

A machine-readable **registry** (component + page + token metadata, derivable from
the barrel `index.ts` plus a small metadata file) is the single source of truth.

```
            ┌─────────────┐
            │  registry   │  (single source: groups, components, pages, status)
            └──────┬──────┘
        generate   │   align (semantic, not byte-identical)
     ┌─────────────┼───────────────┬───────────────┐
     ▼             ▼               ▼               ▼
 docs nav      llms.txt        design.md        Figma pages
 (apps/docs)  (from nav)     (section order)   (Code Connect)
```

- The docs nav is **generated** from the registry; `llms.txt` is generated from
  the nav. Those two can never drift.
- `design.md` and Figma **align** to the registry's group set. A cheap check
  asserts the registry group set matches `design.md` headings (two text surfaces,
  no Figma API, no merge gate). Figma is reconciled via Code Connect, not a blocker.

### 8.1 Killing the colour split-brain

Colour decisions (usage, contrast pairings, theme behaviour) live on the
Foundations → **Colour & Theme** page; the *values* are the generated tokens.
The Colour & Theme page links directly to the token reference and states the
relationship, so a newcomer hunting a hex never has to guess which pillar holds
it. One subject, one entry point, two cross-linked depths.

## 9. Naming & conventions

- **Components:** PascalCase, noun-led. One definition, imported from the barrel.
- **CSS classes:** `.ds-<block>__<element>--<modifier>`. Tokens only, never raw values.
- **Tokens:** `--sa-<category>-<path>` (generated source), `--ds-<friendly>` (stable
  alias). Tiers: primitive (brand) → semantic (invariant) → component.
- **Brand packs:** `brands/<kebab-body-id>/`; brand id is stable and lowercase.
- **Labels:** plain language, no parentheticals-to-explain. "Shadows & Corners",
  not "Elevation & Shape". Tree-tested with a non-author before freeze.
- **Maturity:** every entry is `Stable | Beta | Alpha | Emerging`, governed in
  Resources → Governance.

## 10. Governance, audience, adoption

- **Primary audience:** developers and designers building MoSJE portals.
  **Secondary:** other government bodies white-labelling the core. The docs portal
  is written for the primary audience; the white-label guide serves the secondary.
- **Owner:** the design-system team owns the registry, the core, and the brand-pack
  contract. Brand packs are owned by each consuming body but must pass the contrast
  gate and may not fork core components.
- **Validate before freezing labels:** run a tree-test / card-sort of the pillar
  and group names with at least one person from a body that did not build this.
- **The docs portal must itself meet WCAG/GIGW:** keyboard-navigable sidebar, skip
  links, AT-discoverable search, AA contrast. The IA is not accessible if its own
  documentation is not.
- **Migration safety:** moving doc URLs breaks bookmarks, `llms.txt` references, and
  agent prompts. Any moved or renamed doc path ships with a redirect; deprecated
  anchors keep a stub for one release.
- **Instrument before investing:** add basic usage analytics to the docs portal so
  the next structural change is driven by what teams actually search for, not by
  taste.

## 11. Adoption sequencing (reversible first)

Each step is independently shippable; earlier steps are cheaper and reversible.

1. **Generate the docs nav** from the registry to the 7 pillars: elevate Data Viz,
   unbury Dashboard + Auth/Login, merge AI guidance to one home, kill anchor-soup.
   One change, regenerates `llms.txt`, two-way door.
2. **Align `design.md`** section order to the registry; split Patterns vs Templates;
   move the AI contract into Resources.
3. **Author the brand-pack contract** + a `_starter` pack; wire the CI contrast gate.
   This is the white-label foundation and the highest-leverage new capability.
4. **Optional code tidy:** `components/templates/` (move PortalLoginShell, re-export
   from the barrel so imports don't break) and `components/layout/`.
5. **Figma pages + Code Connect** per §8; add the two-surface registry↔design.md check.
6. **Stand up the second brand pack** as the real test of universality.

## 12. What changed in v2 (audit fixes applied)

Synthesised from the LLM Council, design review, and CEO/strategy review — every
panel independently flagged the first two:

- **Struck "compliance-as-code / WCAG by construction."** Replaced with §3.1
  honest accessibility + the brand-pack **contrast gate** (a real mechanism).
- **Demoted "Machine Interface" out of human navigation** into Resources; it is now
  the generation substrate, and AI guidance has a single home (Get Started → For AI
  Agents). Removed the duplicate.
- **Stubbed Templates** rather than presenting empty pillars; only `PortalLoginShell`
  is shipped, the rest are `Emerging`.
- **Replaced the four-surface CI lock** with a single registry that *generates* the
  surfaces (§8); a cheap two-surface check, not a merge gate.
- **Plain-language labels** ("Shadows & Corners", "Colour & Theme"); added the
  tree-test-before-freeze rule (§10).
- **Killed the Tokens/Foundations colour split-brain** (§8.1).
- **Named the primary audience and the owner; added docs-portal accessibility,
  redirect/migration safety, and usage instrumentation** (§10).
- **Reframed the whole system as universal + white-labellable** (§1, §2, §7) —
  the strategic upgrade that makes the core reusable for any government body, going
  beyond every single-brand benchmark.
- **Dropped the PM-AJAY/SMILE migration from scope** (those portals will be recreated
  on the core later); the chart layer stays additive and shipped.
