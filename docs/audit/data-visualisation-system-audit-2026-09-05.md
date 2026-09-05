# Data-visualisation system — audit against the portal handoffs, 2026-09-05

> Role of this document: what the portal designs need from a visualisation system,
> what the SAMAVESH system had on the morning of 5 September 2026, what this pass
> added in code and in the Figma library, and what remains open. It is the written
> counterpart of `Charts & Graphs — Component record` in the Figma library and the
> status section at the head of
> `docs/superpowers/specs/2026-08-27-data-visualisation-system-design.md`.

## 1. What was read

Sixteen dashboard, report and monitoring screens across ten pages of the
`MoSJE Portal — Handoff` file (`evmNmlK8g4VYwJVu2FwSGV`):

| Portal page | Screens read |
|---|---|
| NMBA | Admin › Dashboard Statistics · USDP › Analytical Report · USDP › Dashboard · Admin › Dashboard |
| Smile Beggary | Super Admin › Dashboard (Programme Overview) · Performance Statistics (KPI Framework) · Level 1 State/UT Overview |
| Grievance Portal | Grievance Analytics · State Comparison · SLA Monitor · Geographic View · Central Authority Dashboard · Fund Utilisation Report · System Administrator Dashboard |
| PM-AJAY | Programme Dashboard · Executive Summary · Public Dashboard |
| E-Anudaan | NGO Dashboard |
| SCW | Admin Dashboard |
| Transgender Portal | Admin Dashboard |
| E-Utthan | Admin Dashboard |
| NOS, NHAPOA, Garima Greh | applicant dashboards — tables and status, no charts |

Layer names were counted inside each frame (`Chart`, `card/kpi`, `Progress bar`,
`map/default`, `Tooltip`, `Filters`, `Table`) and every screen was viewed at
1440 wide.

## 2. What the designs actually draw

Ranked by how often the pattern appears, not by how interesting it is:

| Rank | Pattern | Where | System status before | After |
|---|---|---|---|---|
| 1 | **KPI / metric tile** — value, delta pill with baseline, icon; variants with a target bar, a status chip, a numerator/denominator, a sparkline, a tone (Due Soon amber, Overdue red), a categorical value (a state name) | every dashboard | `MetricCard`: value, change, icon only | `progress`, `status`, `tone`, `detail`, `aside`, `provenance` added |
| 2 | **Ranked bar list** — label, figure, thin bar, optional rank badge, tone by threshold, paged | Grievance ×6, Smile, PM-AJAY, NHAPOA, NMBA | none — portals hand-rolled it or misused `BarChart` | `RankedBarList` + `InlineBar` |
| 3 | Donut with legend and values; pie with tooltip | NMBA, Smile, E-Anudaan, E-Utthan, Grievance | `DonutChart`, `PieChart` | unchanged |
| 4 | Monthly trend — line, area with gradient, vertical bars with the **current month emphasised** | NMBA, PM-AJAY, NHAPOA, Grievance | `LineChart`, `AreaChart`, `BarChart` — no emphasis | `BarChart.highlightIndex` |
| 5 | Horizontal top-N bars with printed values | NMBA, Smile | `BarChart` horizontal | unchanged |
| 6 | Progress bar **against a target** with a scale row ("0% … Target 90%") | NHAPOA, PM-AJAY, Grievance | `Progress` — no target | `target`, `targetLabel`, `tone`, `compact` |
| 7 | Choropleth with binned legend, tooltip and a linked state table | Smile, PM-AJAY | `IndiaMap` + `Legend` | unchanged (Figma gap recorded) |
| 8 | Fund-flow pipeline — allocation → sanction → release → utilisation with stage ratios | PM-AJAY | recipe of `BarChart` + `FactStrip` | documented as a recipe, not a master |
| 9 | Lifecycle funnel | Grievance | `FunnelChart` | unchanged |
| 10 | Gauge / ring for a rate against a target | PM-AJAY | `Gauge` | unchanged |
| 11 | Table with inline bar cell, status chip, coloured numbers, pagination | Grievance, PM-AJAY, Smile | `DataTable` with `render` | `InlineBar` for the cell |
| 12 | Filters — date-range presets, FY select, state/scheme selects, "Showing …" summary | every dashboard | `FilterBar`, `SegmentedControl`, `FilterSelect`, `DatePicker` | unchanged; presets are a `SegmentedControl` arrangement |
| 13 | Export (CSV · Print/PDF), per-card export, "last updated" | most dashboards | `ChartExport`; no provenance | `DataProvenance` + `ProvenanceLine` on `ChartCard` and `MetricCard` |
| 14 | Insight caption under a chart | Smile | `ChartFrame.caption` | unchanged |
| 15 | Stacked / segmented labelled bars | Smile | `BarChart` stacked | unchanged |

Not needed by any design and deliberately not built: radar, polar area, bubble,
gradient charts (all present in the legacy UX4G kit), and a data grid.

## 3. What the system had

- **Code.** Twenty chart components through one `ChartFrame`; `ChartCard`,
  `CardState`, `CardSkeleton`, `KpiRow`, `DashboardGrid`, `FilterBar`,
  `SegmentedControl`, `MetricCard`, `FactStrip`, `DataTable`, `ChartExport`;
  a palette gate (`check:chart-palette`) and a slot-order gate; docs pages for
  every component; eleven Storybook story files; a specification dated
  2026-08-27 with a data contract (§03), a state matrix (§05) and an
  accessibility contract (§07) that were written but not built.
- **Figma.** The `Charts & Graphs` page was the UX4G Chart.js kit: one component
  set of 96 static pictures at five sizes, an unnamed `Property 1`, no variable
  bindings, no documentation frame, no component record, seventeen loose text
  labels; `Map of India` carried `Property 1 = Default | Variant2`. Zero Code
  Connect templates for any chart or dashboard component. Twenty-one docs pages
  said "Not yet published in the Figma library."

## 4. What this pass added

### Code (`@mosje/design-system` v0.101.0)

| Area | Change |
|---|---|
| Data contract | `ChartWithheld` (`suppressed` \| `not-reported`, with reason) on `ChartDatum` and `ChartSeries`; `withheldLabel()`; `DataProvenance`; `StatusTone` |
| `RankedBarList` | new — label, figure, thin bar; `max`, `sort`, `showRank`, `pageSize` (pages with `Pagination`, never scrolls), `toneFor`, `href`, withheld rows sort last and hatch; `InlineBar` for a table cell |
| `MetricCard` | `progress` (value, max, target, targetLabel), `status` (label + tone), `tone`, `detail`, `aside`, `provenance`; all dropped when there is no figure; status chip uppercase to match the Figma label style |
| `Progress` | `target`, `targetLabel`, `tone`, `compact`; target spoken in `aria-valuetext` |
| `BarChart` | `highlightIndex` (others drop to `chart/seq/300`, "current" spoken), `target` + `targetLabel` (dashed reference line joined to the domain), withheld stubs |
| `ChartCard` | `provenance` |
| `ProvenanceLine` | new — source · as of · status, one muted line |
| `ChartFrame` | one roving Tab stop per chart; arrows, Home, End; Escape → `onDismiss` (wired in all nine tooltip charts) |
| Print | `@media print` in charts.css, dashboard.css, metric-card.css, ranked-bar-list.css — tooltips/toggles gone, SR table promoted with repeating header, cards do not split |
| Docs | Ranked Bar List page; Metric Card, Progress, Chart Card and the Data Visualisation overview updated; 21 pages now link to Figma; design.md v0.49.0; changelog v0.101.0 |
| Stories | RankedBarList, ProvenanceLine; BarChart (highlight, target, withheld), MetricCard (target, status, toned, provenance, trend), Progress (target), ChartCard (provenance) |
| Code Connect | `metric-card.figma.ts`, `chart-card.figma.ts`, `ranked-bar-list.figma.ts`, `bar-chart.figma.ts` (the whole `Chart` set), with fixtures |

### Figma (`SAMAVESH Design System`, page `Charts & Graphs` 2840:10801)

| Node | What |
|---|---|
| `Charts & Graphs — Documentation` 57411:15871 | house-style frame: hero with six counted stats, sections 01–07 (question → chart, five readings, seven states, ranking, colour, access, arrangements) |
| `Charts & Graphs — Component record` 57423:16358 | six open items, parity, sources |
| `1 · Metric Card` → set 57414:15871 | Reading 5 × Tone 3 |
| `2 · Chart Card` → set 57418:15985 | State 6, Populated holds a `Chart` instance and a provenance line |
| `3 · Ranked Bar Row` → set 57420:15960 + `Ranked Bar List` 57420:15961 | Tone 4 × Rank 2; the list composition |
| `4 · Chart` → set 57417:15992 | Type 15 at 480×280 |
| `5 · Legend and Tooltip` → 57420:16040, 57420:16041 | Swatch 3; the tooltip |
| `6 · Legacy (UX4G Chart.js import — retire)` | the old set, renamed and described as legacy |
| `Map of India` | axis renamed `Kind`; description written against the three code components |
| `Index` | Charts & Graphs card → Ready, linked to the documentation frame, new preview, one-line purpose; stat line 197 → 204 components |

Every fill, stroke, radius, padding and text on the new masters and the
documentation frame is bound to a Color, Space or Radius variable or a published
text style. Axis and value labels use `Body/body-3`; chips use `Label/label-3`,
which is the uppercase overline role — the code's status chip was changed to
match it.

## 5. What remains open

Recorded on the Component record and repeated here so it is findable from the
repository:

1. **Legacy set still has instances.** Swap each for a `Chart` variant, then
   delete the set and its seventeen loose labels.
2. **Map of India** — draw the bubble and point variants, give the page a
   documentation frame, and the boundary set needs legal review before the
   repository is public (spec §08).
3. **Restricted and Offline** card states are not drawn.
4. **Metric Card** has no Size axis and no icon slot in Figma.
5. **Charts are drawn at one size**; the size ladder (chart → sparkline → metric
   → table row) is stated, not drawn.
6. **Dark values** are deferred to release (spec §04).
7. **Legend and Tooltip** have no Code Connect template.
8. **Suppression is built in `BarChart` only.** Line, donut, heatmap and the maps
   still take plain numbers; the migration order in spec §01 says bar first.
9. **Storybook static build** (`apps/hub/public/storybook`) was not rebuilt in
   this pass; the source gates pass.

## 6. Gates run

`typecheck` (design-system, hub, storybook), `check:props`, `check:docs-coverage`,
`check:storybook`, `check:storybook:parity`, `check:ds-pages`, `check:docs-routes`,
`check:components-css`, `check:chart-slots`, `check:design-context`,
`check:a11y-evidence`, `check:changelog`, `check:figma-docs`, `check:docs-data`,
`check:type-linkage`, `check:code-connect`, `check:figma-index`,
`check:figma-index:live` (re-synced).
