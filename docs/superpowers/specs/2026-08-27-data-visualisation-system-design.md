# Data Visualisation System — Design Specification

> **Status:** design, pre-implementation. Supersedes nothing; this is the first
> specification for the visualisation layer that already exists in
> `packages/design-system/components/data-display/charts/`.
>
> **Scope study and rationale:** the scope map this spec was derived from is
> published as an artifact; the three architecture decisions it left open were
> answered on 2026-08-27 and are recorded in §01.

---

## 00 · Principles and non-goals

### What this system is

A visualisation layer for Government of India citizen portals, domain-agnostic
across budget and financial reporting, census and demographics, service delivery
and operations, public health and welfare, and compliance reporting. Internal to
the SAMAVESH estate first; open-sourced as a Figma library plus code packages
afterwards.

### Principles, in priority order

The order is the specification. When two principles conflict, the higher number
wins, and the deviation is documented rather than argued.

1. **Accessible and correct by default.** Legally required for a GoI property,
   and the only property on this list that cannot be retrofitted — a chart's
   accessibility lives in its architecture, not its styling.
2. **Opinionated enough that a non-expert cannot build a misleading dashboard.**
   The adopters are other agencies' vendors on short deadlines, not
   visualisation specialists. Making a bad chart hard to express is the product.
3. **Documented for both audiences.** A designer composing in Figma and a
   developer implementing in code must be able to work without asking a question
   that only the other one can answer.
4. **Extensible at exactly one defined seam.** One documented escape hatch, in
   one place. Extensibility everywhere is indistinguishable from having no
   system.
5. **Capable of complex scenarios.** Last, deliberately — this is the property
   that turns a design system into a charting library.

Principles 2 and 4 pull against each other. The ordering resolves it:
**when consistency and extensibility conflict, consistency wins.**

### Non-goals

These are refusals, not backlog items. Each one exists because the alternative
changes what product this is.

| Non-goal | Why |
|---|---|
| **A general encoding grammar** — no `<Chart encoding={…} />` | That is Vega-Lite. It is a different product with a different maintenance model, and it makes principle 2 unenforceable. Named components with fixed encodings are the mechanism by which the system prevents misleading output. |
| **A data grid** | Virtualisation, server pagination, column pinning and reordering, grouping, aggregation, editable cells, XLSX export. Every adopting ministry's backend differs; owning the data layer means owning all of them. |
| **A data-fetching or state-management layer** | Charts take resolved data. Loading, error and staleness arrive as declared props, not as an internal fetch. |
| **Chart types that are layouts of existing marks** | Waterfall, sankey, treemap, radar, box plot, bullet, chord, network. These ship as documented recipes composed from the core, not as supported components with Figma variant sets. See §02 for the test that separates them. |
| **Animation as a differentiator** | Entry transitions and value interpolation only. No chart is a motion piece; `prefers-reduced-motion` disables all of it. |

---

## 01 · Architecture

### The three decisions

| Decision | Answer | Recorded |
|---|---|---|
| Framework reach | **Framework-agnostic core** with thin renderers | 2026-08-27 |
| Chart internals | **Borrow D3 submodules** behind the existing component API | 2026-08-27 |
| Dark mode | **At open-source release**, not before | 2026-08-27 |

### What the codebase actually looks like today

Measured on `ds/viz-system-spec` at `origin/main` (4d9b0c1):

| | |
|---|---|
| Total chart layer | **2,110 lines** across 13 components + 9 internal modules |
| Largest component | `bar-chart.tsx`, 296 lines |
| React-free internal modules | `scales.ts` (65), `geometry.ts` (55), `palette.ts` (52), `format.ts` (13) — **185 lines, zero React imports** |
| React-bound internal modules | `chart-frame.tsx`, `axis.tsx`, `legend.tsx`, `tooltip.tsx`, `use-chart-size.ts` |
| Charts using `ChartFrame` | 9 of 13, all 9 passing an SR `table` |
| Charts not using it | `area-chart` (delegates to `line-chart`), `sparkline` and `progress` (correctly decorative / `role="progressbar"`), `funnel-chart` (hand-rolls the same figure + `role="img"` + SR-table pattern) |

Two things follow. First, the total surface is small enough that the extraction
below is a matter of weeks, not quarters. Second, **the accessibility posture is
already sound** — the work is consolidation, not rescue.

### The decision the three answers force: the core returns a scene

A "framework-agnostic core" can mean two very different things, and only one of
them delivers what the decision was made for.

- **Core as shared utilities** — scales, formatters, palette resolution. Every
  renderer then re-implements all thirteen charts. That is not
  framework-agnosticism; it is a shared `lodash`, and a Web Component renderer
  would be a second full implementation with a second set of bugs.
- **Core as a scene builder** — a pure function per chart type that takes data
  plus layout options and returns a plain serialisable object describing marks,
  axes, ticks, legend items and the screen-reader table. Renderers become dumb
  mappers from that object to DOM.

**This specification adopts the scene builder.** The decisive argument is
accessibility: the SR table and the `<title>`/`<desc>` text are computed from
data, and if they are computed inside a React component then every non-React
renderer forks the accessibility contract on day one. Putting the scene in the
core makes principle 1 structural rather than aspirational.

```
@samavesh/viz-core          pure TypeScript, no DOM, no framework
  scales/                   d3-scale wrappers, tick policy
  shape/                    d3-shape + d3-geo path generation
  layout/                   one buildXScene(data, opts) per chart type
  palette/                  token resolution + the alias contract (§04)
  format/                   Indian numbering, fiscal year, suppression
  a11y/                     SR table + summary-sentence generation
  types/                    the data contract (§03)

@samavesh/viz-react         thin renderer — scene → JSX
@samavesh/viz-wc            thin renderer — scene → custom elements
@samavesh/viz-figma         token + variant export for the Figma library
```

A scene object is serialisable, which buys three things nothing else does: the
core is testable without a DOM, a scene can be rendered server-side for the
Django and Jinja portals that will never run React, and a scene snapshot is a
far better regression test than a screenshot.

### D3 module map

D3 submodules are pure functions returning numbers and path strings. They are
the ideal dependency for a scene builder, and they compose with the decision
above rather than competing with it.

| Replaced | With | Note |
|---|---|---|
| `internal/scales.ts` — `linearScale`, `bandScale` | `d3-scale` | `scaleLinear`, `scaleBand`, plus `scaleTime` and `scaleOrdinal` which we do not currently have |
| `internal/scales.ts` — `niceTicks`, `niceMax` | `d3-scale` `.ticks()` / `.nice()` | Removes a hand-rolled `niceNum` implementation |
| `internal/geometry.ts` — `arcPath`, `ringPath` | `d3-shape` `arc()` | Also brings `line()`, `area()`, `stack()`, `curve*` |
| India map projection | `d3-geo` | Already a dependency of `apps/hub` |
| Date axis formatting | `d3-time-format` | We have no time scale today; this is new capability, not a swap |

All five are ISC-licensed, render nothing, and own no DOM. This is five small
dependencies in exchange for deleting the most defect-prone maths in the layer.

### Migration order

Each step leaves the estate working. No step requires the next one to have
landed.

1. **Resolve the Recharts drift.** `apps/hub/src/components/smile-admin/dashboard/charts.tsx`
   imports Recharts directly — no `--sa-*` tokens, no `ChartFrame`, no
   governance. Migrate it to the design-system charts, or promote it to the
   documented escape hatch of §08 with a written rule. It must not stay an
   accident. *Independent of every other step; do this first.*
2. **Land the contrast gate on light-only.** §04. Building it now, while it has
   to verify 6 brand modes rather than 12, means it is proven before dark mode
   doubles its cross-product.
3. **Extract `viz-core` scene builders**, one chart at a time, `d3-scale` and
   `d3-shape` going in as each chart is moved. `bar-chart.tsx` first — it is the
   largest, has the most layout maths, and is the only chart with two distinct
   orientations.
4. **Reduce the React components to renderers.** `funnel-chart` adopts
   `ChartFrame` in this pass rather than hand-rolling the same pattern.
5. **Publish the alias token layer and dark values together.** §04. One pass,
   not two.
6. **Add the Web Component renderer.** Only after the scene contract has been
   stable across a release.

### Deferred, with the reason

**Dark mode values are deferred to release. The dark-mode *structure* is not.**
This is the ordering constraint in the third decision and the one place it can
go wrong. `palette.ts` returns `var(--sa-chart-cat-N)` strings, so colour
resolution already defers to CSS and survives a theme axis untouched — that part
is safe. What is not safe is deciding any colour in JavaScript, or baking layout
constants that assume a light ground, between now and release. The rule for the
interim: **no chart colour is ever a literal in TypeScript, and no chart
measurement is ever derived from a colour.**

---

## 02 · Chart selection guidance

The most valuable section in the document and the one most systems omit. Shared
between both audiences; it belongs in the Figma library as a page and in the
docs site as a route.

### The path from question to chart

| The reader's question | Chart | Not |
|---|---|---|
| How does this compare across categories? | Bar (grouped when ≤ 4 series) | Pie — angle comparison is worse than length at every series count |
| How has this changed over time? | Line; area only when the quantity accumulates | Bar with a date axis, which implies discrete unrelated periods |
| What is this made of? | Donut or pie, ≤ 6 slices, sorted, with values labelled | Any part-to-whole with a remainder bucket over 25% |
| How are two quantities related? | Scatter | Dual-axis line, which manufactures correlations |
| Where is this happening? | Choropleth for rates and proportions | Choropleth for raw counts — it renders population, not the phenomenon |
| How dense is this across two dimensions? | Heatmap | A grid of small charts |
| How far through a process? | Funnel, only when stages are genuinely sequential and monotonically decreasing | Funnel for unordered categories |
| What is one number doing? | Metric component (§05) | A single-bar chart |

### Where the component list stops

Foundational — earns a component, a Figma variant set and a docs route: bar
(grouped, stacked, horizontal), line, area, scatter, pie, donut, heatmap,
choropleth, sparkline, gauge, progress, funnel, combo. **Thirteen, all built.**

Not foundational: waterfall, sankey, treemap, radar, box plot, bullet, chord,
network, sunburst.

**The test:** does it need a new encoding grammar, or is it a layout of marks the
core already produces? A waterfall is a bar chart with a running baseline — a
recipe. A sankey needs flow-layout maths that exists nowhere in the core — but it
is also not something a citizen portal needs, so it stays out until a real
requirement arrives with a real dataset.

Recipes live in the docs site with runnable source, not in the barrel. A recipe
that gets requested three times by three different portals becomes a candidate
component; the request record is the promotion criterion.

---

## 03 · Data and encoding contract

### Shapes

The existing `types.ts` is the right foundation and moves to
`viz-core/types` unchanged in intent:

```ts
type ChartDatum       = { label: string; value: number; color?: string }
type ChartSeries      = { name: string; data: number[]; color?: string; fill?: boolean }
type ChartMultiSeries = { labels: string[]; series: ChartSeries[] }
type ChartTable       = { columns: string[]; rows: (string | number)[][] }
```

Three additions the government domains require and the current contract cannot
express:

```ts
/** A value that exists but may not be shown, or does not exist at all. */
type ChartValue = number | null | Suppressed | NotReported

type Suppressed  = { kind: "suppressed"; reason: string }   // e.g. "cell count < 5"
type NotReported = { kind: "notReported"; reason?: string }

/** Provenance travels with the data, because a government figure without it is unusable. */
interface DataProvenance {
  source: string          // "NFHS-5, Ministry of Health and Family Welfare"
  asOf: string            // ISO date
  status: "final" | "provisional" | "revised"
  note?: string
}
```

**Suppression is not an edge case in this domain.** Health and census data
routinely arrives as `<5 suppressed`, `provisional`, `revised` or `not reported`.
A component that cannot render an em dash with an explanatory footnote gets
hardcoded around on the first real dataset, and the workaround is always a
literal `"—"` string in the data, which then breaks every scale.

Rendering rules: a suppressed value renders as a gap with a distinct hatch, never
as zero; it appears in the SR table with its reason as text; it is excluded from
totals, and any total computed over suppressed values is labelled as partial.

### Scale policy

- Bar charts start at zero. Always. This is not configurable, and it is one of
  the clearest expressions of principle 2.
- Line charts may use a non-zero baseline; when they do, the axis is annotated.
- Sequential ramps are for ordered magnitude, diverging for signed deviation from
  a meaningful midpoint, categorical for unordered classes. Using the wrong
  family is the most common serious defect in government dashboards and the core
  should make it awkward: `buildChoroplethScene` takes `scale: "sequential" |
  "diverging"` and requires a `midpoint` when diverging.

### Formatting and locale

| Concern | Rule |
|---|---|
| Numbering | Indian grouping (2-2-3): `formatIndian` already implements this and moves to the core |
| Large values | Lakh and crore, not million and billion. `formatCompact` |
| Currency | `₹` prefix, never `Rs.` or `INR` in a chart |
| Fiscal year | April–March. Labelled `FY 2025–26`, never `2025` alone |
| Dates | Never `MM/DD`; either `DD MMM` or ISO |
| Language | Labels are consumer-supplied strings — the core never generates user-visible text except the SR summary sentence, which takes a formatter |
| Digits | `font-variant-numeric: tabular-nums` wherever values align |

### Axis padding is computed, not constant

Today `bar-chart.tsx` hardcodes `padL = 116`, `padR = 44`, and four other charts
hardcode their own. With `formatIndian` producing `₹4,67,89,012`, or Devanagari
axis labels, those clip. Padding moves into the scene builder and is derived from
the longest formatted label at the rendered type size. This is a correctness fix
that the extraction makes natural, and it is the clearest single example of why
the core has to own layout rather than just supply utilities.

---

## 04 · Colour system

### The three families

Already correct in structure: **12 categorical slots**, a **10-step sequential
ramp** (`50`–`900`), a **7-step diverging ramp**, plus grid, axis, tooltip,
trend and region inks. 38 `--sa-chart-*` tokens in total. Four rules govern
their use.

**1 · Twelve slots is not twelve distinguishable series — it is NINE.**

This has now been wrong twice, and the sequence is worth keeping because it is
how the number was actually earned. It was first written as "six to eight" from
general design lore. The gate then measured the shipping ramp and found **five** —
collision started at slot 6, where two oranges sat 8 degrees apart. The ramp was
then regenerated against that measurement and reaches **nine**.

The diagnosis that made nine possible: the old ramp held lightness nearly
constant (L 44-63) across all twelve slots, so the only channel separating them
was hue — and hue is the channel a dichromat loses. Treating lightness as a
first-class variable rather than holding it flat for tidiness is the whole
difference between a ramp that fails colour-vision deficiency at three slots and
one that survives nine.

So the scene builder caps rendered series at **9** and buckets the remainder as
`Other`, with the full breakdown preserved in the SR table. Slots 10-12 remain
as extension colours: mutually distinct in full colour, deliberately **not**
CVD-guaranteed, and reached only by a consumer that has already ignored the cap.
Raising the cap again requires regenerating the ramp again — and
`chart-palette.test.mjs` fails if the published count is raised without it.

**2 · Semantic hue is reserved.** In government reporting green and red mean
approved and rejected, above and below target. A categorical slot that is green
makes an arbitrary series read as "good" — which, on a caste-category or
religion breakdown, is not a cosmetic problem. Categorical slots must not collide
in hue with the trend and status inks, and the gate below enforces it.

> **This was violated exactly, and is now fixed.** `--sa-chart-cat-3` used to
> resolve to `#046a38` — byte-identical to `--sa-chart-trend-up`, so categorical
> slot 3 *was* the semantic success green and any three-series chart rendered its
> third series in "good". `cat-9` (`#4d7c0f`) sat close to the same hue.
>
> The regenerated ramp holds every slot at least dE 12 **or** 25 degrees from
> every semantic ink, which is a real clearance rather than the minimal
> not-confusable bar. Slot 3 is now teal (`#007668`). The gate enforces the
> clearance, so the collision cannot come back.

**3 · The diverging default is blue–orange.** Red–green remains available and is
flagged in the docs as CVD-hostile. This inverts the convention most enterprise
systems ship, and it is intentional.

**4 · Colour is never the only encoding.** Pattern fills, distinct markers, line
dashing — and above all **direct labelling**, which removes the legend entirely.
For a low-literacy citizen audience direct labelling is the highest-value default
in the system, and it is on by default for ≤ 6 series.

### The contrast gate

An earlier draft of this section put the cross-product at **144 palettes** —
twelve slots × six brand modes × two themes. That was an overestimate, and the
gate is what corrected it: the categorical ramp is **brand-invariant**. Only
`:root` declares `cat-1..12`; neither Navy nor any DBIM preview overrides one.
DBIM does override the sixteen semantic and structural chart tokens (trend,
diverging, grid, axis, tooltip, region), so only the categorical-vs-semantic
sweep is per-brand. With no dark theme yet, the real surface today is twelve
slots once, plus three brands' semantic inks.

That makes the gate cheaper than feared and the rules no weaker. Each must hold:

- ≥ 3:1 contrast between adjacent categorical swatches
- ≥ 3:1 against both the base and elevated surface of its theme
- distinguishable under deuteranopia, protanopia and tritanopia simulation
- sequential ramps monotonic in perceived lightness
- no categorical slot within a hue threshold of a semantic ink

Nobody can review that by eye, and a design review that claims to have is not
telling the truth. It ships as `packages/tokens/test/chart-palette.test.mjs`,
alongside the existing Tier-1 leakage test, and it fails the build.

**What it found on its first run**, beyond the `cat-3`/`trend-up` identity above:

- The ramp held for five slots, not the eight this document had claimed.
- **It failed colour-vision deficiency at every slot count, including three.**
  There was no cap at which the shipping ramp was CVD-safe. The worst case was
  protanopia collapsing `cat-2` and `cat-9` to dE 1.0 — effectively one colour.
  Within even the first five, deuteranopia merged `cat-1` (blue) and `cat-4`
  (purple) to dE 5.7, the most consequential single pair because blue and purple
  are the commonest defaults for a two-series chart.

**Both are now fixed, by regenerating the ramp rather than by moving a
threshold.** The search was constrained to what the estate actually needs — gov
blue anchored at slot 1, every slot ≥ 3:1 on both the base and elevated surface,
every slot clear of the semantic inks, chroma and lightness bounded so the result
reads as a government palette rather than a test pattern — and then solved for
the largest CVD-safe set. That set is nine.

| | before | after |
|---|---|---|
| Mutually distinguishable slots | 5 | **9** |
| Colliding pairs across all 12 | 4 | **0** |
| Worst CVD separation, safe range | dE 5.7 (over 5 slots) | **dE 8.0 (over 9)** |
| Slots clear of every semantic ink | 11 of 12 | **12 of 12** |

The measured state is held as **ratchets**: the numbers are recorded, may only
improve, and the gate fails if anything gets worse *or* if a number improves
without the baseline being tightened.

**Rule 4 remains load-bearing even now.** Nine CVD-safe slots is a real result,
but it is nine — a chart with more series, or slots 10-12, is outside the
guarantee. Direct labelling, distinct markers, pattern fills and the
screen-reader table are what actually carry the data; the ramp is a convenience
on top of them.

### Dark mode — deferred values, fixed structure

See §01. Categorical hues need different lightness at the same hue on a dark
ground; sequential ramps must reverse perceptual direction, because "more ink
means more value" inverts when the ground is dark. This is design work, not a
token pass, and it lands with the release alongside the alias layer below.

### The alias layer

`palette.ts` currently returns `var(--sa-chart-cat-N)` as literal strings. That
is fine internally and fatal externally: an adopting agency has its own token
contract, and a hard-coded `--sa-` prefix means their only option is to fork.

The core resolves colours through a documented, remappable contract — a default
map from role to CSS custom property that an adopter overrides once at
configuration. `--sa-*` becomes the SAMAVESH default, not the interface.

---

## 05 · Component reference

The only section where the two audiences genuinely diverge. Each component gets
one page carrying both.

**For the designer:** anatomy diagram with named parts; the variant set; every
data state rendered, not described; minimum legible size; the Figma component
name and its properties.

**For the developer:** the props table with types; the scene-builder signature;
the accessibility contract it satisfies; the escape hatch, if any; the Code
Connect mapping.

### Metric and KPI components

Five genuine variants of "showing one number", separated by what else the reader
needs:

1. **Bare value** — count, currency, percent. Formatting *is* the component.
2. **Value with comparison** — against previous period, target, or a peer state.
   Requires an explicit named baseline; this is where most KPI cards quietly lie.
3. **Value with trend** — takes a series, so it is a different component rather
   than a variant.
4. **Value against target** — bounded, requires a denominator.
5. **Value with distribution** — median and range. The honest one for
   demographic data.

**The publishable rule for where it stops:** a KPI card becomes a chart the
moment the reader has to compare more than two numbers.

All five must render suppression and provenance (§03). A metric that cannot show
`—` with a footnote and an as-of date is not usable on health or census data.

### Indicators and signals

Status, trend and comparison are three independent layers, and they keep getting
collapsed into one coloured arrow. They stay separate:

- **status** — categorical and semantic: on track, at risk, breached
- **trend** — directional, and invalid without a stated comparison window
- **comparison** — invalid without a named baseline

An arrow with neither a window nor a baseline is decoration and the components
should make it impossible to render one. `SlaProgressIndicator` and `Badge`
already exist; this is a consistency rule across them, not new components.

### States

Data-shaped, not prop-shaped. Default / hover / disabled is the wrong axis
entirely. Every chart declares:

| State | Requirement |
|---|---|
| Loading | Skeleton preserving the final footprint — no layout shift on resolve |
| No data | Distinct from the next row, with a distinct message |
| Filtered to no data | Names the filter and offers a way back |
| Single datum | Renders without axes implying a trend |
| Fetch error | Explains what failed and offers retry; never an empty chart |
| Partial or stale | Renders what exists, labelled, with the as-of date |
| Suppressed | Hatched gap, reason in the SR table, excluded from totals |
| Too many series | Top 8 plus `Other`; full data in the SR table |
| Print | See §07 |

### Size and density

Charts do not have S/M/L the way a Button does. They have a **minimum legible
size**, below which they must degrade to a different representation. The ladder,
published as guidance for both audiences:

```
full chart  →  sparkline  →  bare metric  →  table row
```

Each component declares its own minimum width and height, and the responsive
guidance names which rung it falls to. This is more useful than three size
tokens and it is what a designer actually needs when a tile shrinks.

---

## 06 · Composition and dashboard archetypes

`ChartCard`, `DashboardGrid`, `KpiRow`, `FilterBar`, `MetricCard` and `DataTable`
all exist. What does not exist is the contract that connects them — and that
contract is what turns components into a dashboard.

### The coordination contract

Specified as data, not as a component, because it is the part a designer cannot
draw and a developer cannot infer:

- how filter state reaches every tile, and in what shape
- whether loading is per-board or per-tile, and what a mixed state looks like
- what a cross-filter click does, and how a tile declares it is filterable
- how a tile declares which filters it responds to and which it ignores
- what happens to a tile whose data fails while its neighbours succeed

### Dashboard archetypes

The bridge between the two audiences. Five named boards, each existing as a Figma
template **and** a code template, bound by Code Connect:

| Archetype | Shape |
|---|---|
| Scheme performance | KPI row → trend line → breakdown bar → detail table |
| Geographic distribution | Choropleth → ranked bar → comparison table |
| Application pipeline | Funnel → stage-duration bar → SLA breach table |
| Compliance status | Status matrix heatmap → breach list → trend sparklines |
| Beneficiary demographics | Distribution bars → cross-tab heatmap → suppression-aware table |

Composition rules live in the archetype rather than in prose, so the
specification does not describe the same layout twice in two vocabularies. This
extends `section-templates`, which already exists in the docs routes, and the
Code Connect infrastructure, which is already wired.

---

## 07 · Accessibility specification

WCAG 2.2 AA is the floor, and GIGW 3.0 applies on top. The existing architecture
is sound; this section fixes it as a contract rather than a convention.

### The frame contract

Every chart renders as:

```
<figure>
  <svg role="img" aria-labelledby="title desc">
    <title>…</title>
    <desc>…</desc>
  </svg>
  <table class="sr-only">…</table>   ← the accessible source of truth
</figure>
```

`ChartFrame` implements this and 9 of 13 charts use it. `funnel-chart` hand-rolls
the identical pattern and adopts the frame in migration step 4. `sparkline`
correctly defaults to `aria-hidden` when unlabelled — a sparkline inside a metric
card is decorative, because the number beside it carries the meaning. `progress`
correctly uses `role="progressbar"`. `area-chart` delegates to `line-chart`.

**The table and the visual are two renderings of one data contract, not a
component and its fallback.** Both are generated by the core (§01), which is what
makes the contract survive a non-React renderer.

### The summary sentence

The `<desc>` is generated by the core from the scene, not hand-written per
instance. It states the shape of the data — the range, the direction, the
extremes — because a screen-reader user needs the gist before the table, exactly
as a sighted user gets it before reading values.

### Keyboard

Data points are focusable and surface the tooltip on focus; this is already
implemented across bar, line, scatter, donut, heatmap, combo and the India map.
The contract adds: arrow keys move within a series, Tab moves between series, and
Escape dismisses the tooltip without losing focus.

### Non-colour encoding

Required, per §04. No chart may be readable only by hue.

### Print

Government charts get printed and PDF'd. Every chart needs a print stylesheet:
backgrounds removed, the SR table promoted to visible, tooltips suppressed, and
tables repeating their headers across pages. A table without repeating print
headers gets worked around on day one.

---

## 08 · Extension, contribution and governance

The section that only matters once the system is public, and the one most likely
to be written too late.

### The one escape hatch

Per principle 4, exactly one, in one place: **a chart may accept a custom
renderer for its marks, receiving the computed scene.** Scales, axes, frame,
legend, accessibility and tokens stay owned by the system. This means an extension
cannot break the accessibility contract or leave the token contract, which is the
whole point of putting the seam there rather than at the component boundary.

`smile-admin`'s Recharts usage is the current de-facto escape hatch and was never
chosen. Migration step 1 resolves it either way.

### Adding a chart type

1. It must fail the §02 test — a new encoding grammar, not a layout of existing
   marks.
2. A scene builder in `viz-core`, with scene snapshot tests.
3. Renderers in each published renderer package.
4. The full state matrix of §05.
5. The accessibility contract of §07, including a generated summary sentence.
6. Figma component with a matching variant set, plus a Code Connect mapping.
7. Docs route, Storybook story, and a real dataset from a real portal — never
   synthetic sample data.

### For adopters

- Token aliasing (§04) is the supported theming path. Forking is not.
- The core carries no `--sa-` assumption in its public contract.
- Renderer packages version independently of the core; the scene contract is the
  compatibility surface and follows semver strictly.

### Before publication — requires a human

**The India boundary paths in `charts/geo/india-states.paths.ts` need a legal
review before the repository is made public.** A national boundary rendering on a
Government of India property is a regulated artefact, and open-sourcing the file
passes that exposure to every adopter. This is not a design decision, cannot be
resolved in code, and blocks release rather than any earlier step.

---

## Open questions

1. **Do the citizen portals have data APIs, or is this CSV-and-CMS?** This
   decides whether `DataTable` needs the headless server-side contract of §00 or
   stays purely presentational. Nothing in this spec is blocked on the answer;
   §05's table page is.
2. **Which portal supplies the first real dataset for each archetype?** The
   archetypes in §06 need real data to be designed against — synthetic data
   hides exactly the suppression and provenance problems §03 exists to solve.
3. **Package naming and npm scope** for the open-source release. `@samavesh/*` is
   assumed throughout; it is not yet claimed.
