# UX4G 3.0 — code readiness audit

| | |
|---|---|
| **Programme** | MoSJE / DoSJE websites and portals |
| **Date** | 06 August 2026 |
| **Status** | For review |
| **Subject** | `@mosje/design-system` (SAMAVESH) measured against UX4G Design System 3.0 |
| **Companion documents** | `UX4G-Adoption-Plan`, `UX4G-Clarification-Questionnaire`, `UX4G-Adoption-Tracker` |

The adoption plan covers the design side — the Figma library, Theme Craft, the thirteen-week
programme. This document covers the build side: what UX4G 3.0 actually ships as code, how ready
SAMAVESH is to sit on top of it, and what we do first.

It also does one thing the adoption plan asked for and could not yet supply: it proposes a
**measurable definition of conformance**, so the weekly figure is calculated rather than judged.

---

## 1. What UX4G 3.0 ships as code

Everything below was measured directly from `ux4g-web-components@1.0.3` and from ux4g.gov.in on
06 August 2026. It is recorded here because the adoption plan raises this as its one obstacle, and
an obstacle is easier to accept when it comes with figures.

### The package

| Fact | Value |
|---|---|
| Package | `ux4g-web-components` |
| Version | 1.0.3, published 04 August 2026 |
| Versions ever published | 4 |
| Licence | Proprietary |
| Unpacked size | 10.4 MB |
| Stylesheet | `styles/ux4g.css` — **7.6 MB**, one minified line |
| Runtime | `dist/runtime/design-system.mjs` — 286 KB |
| React components | **None.** The package is CSS classes plus one DOM runtime |

### How it is meant to be used

UX4G's own developer guide is explicit:

> "UX4G ships one core web package — there are no separate per-framework component imports. The
> runtime detects `ux4g-*` classes in the DOM and wires up interactive behaviour automatically."

So the "React" path is not React. It is `<button className="ux4g-btn ux4g-btn-primary">` with a
runtime that finds the element afterwards and attaches behaviour to it.

### Why that does not fit our portals

Three measured reasons.

**The runtime writes to the DOM that React owns.** Counted inside `design-system.mjs`:

| API | Occurrences |
|---|---|
| `MutationObserver` | 11 |
| `innerHTML` | 42 |
| `setAttribute` | 126 |
| `classList.add` / `.remove` / `.toggle` | 209 |
| `createElement` / `appendChild` | 52 |
| `document.querySelectorAll` | 46 |

React 19 assumes it is the only writer of the nodes it renders. A library that watches the tree and
injects children into those same nodes produces hydration mismatches and `removeChild` crashes on
re-render. This is not a preference about style — the two models cannot both be right about who owns
a node.

**The stylesheet is 7.6 MB and cannot be split.** It is a single minified file with seven
`@font-face` rules embedding Noto Sans, Noto Sans Display and five UX4G Material Icons variants as
base64. There is no tree-shaking path. For a ministry whose users are on rural bandwidth, shipping
7.6 MB of CSS to render a button is the opposite of what GIGW asks of us.

**The bundle is young and self-documents its own defects.** The package ships a file called
`cascade-fixes.css` in which UX4G describe their own CSS as "vendor CSS" and patch its specificity
bugs by doubling selectors:

```css
/* Result: size classes lose — all buttons render at 40px regardless of size. */
.ux4g-btn-md.ux4g-btn-md { min-height: 40px; }
```

That is a reasonable thing for a young library to do. It is not a reasonable thing to make thirty-three
government properties depend on at version 1.0.3, four versions old, under a proprietary licence.

**Conclusion.** We conform to UX4G 3.0 at the specification level — its tokens, its type scale, its
component contracts, its accessibility rules — and we do not install its runtime. This is the position
the adoption plan already takes; the figures above are the evidence for it.

---

## 2. SAMAVESH readiness

Measured against UX4G 3.0's published foundations.

### Scorecard

| Axis | UX4G 3.0 | SAMAVESH today | Readiness |
|---|---|---|---|
| Token tiering | primitive → semantic | primitive (`--sa-*`) → semantic (`--ds-*`) | **Aligned** — same shape, different names |
| Base typeface | Noto Sans | Noto Sans | **Aligned exactly** |
| Display typeface | Noto Sans Display (36px+) | not present | Gap — one font to add |
| Type categories | Display · Heading · Title · Body · Label | same five | **Aligned** |
| Type roles | 21 roles, **fixed px at all breakpoints** | 21 roles, **fluid `clamp()`**, two surfaces | **Ahead of UX4G** |
| Spacing | 4px base, 2px fine steps, 16 values | same rhythm, 15 values | ~90% — missing 6px and 120px, we carry an extra 72px |
| Semantic spacing roles | inline / stack / padding / section | none | Gap |
| Radius | 5 values (0/4/8/12/full) | 12 values | **Superset** |
| Theming | light / dark | 4 axes: colour-mode, theme (light/dark/**hc**), density, surface | **Ahead of UX4G** |
| Icons | UX4G Material Icons, base64 | Material Symbols Rounded, hosted woff2 | Same family, better delivery |
| Accessibility target | WCAG 2.1 AA + GIGW 3.0 | WCAG 2.1 AA + GIGW 3.0 | **Aligned** |
| **Primary colour** | **violet `#6a4eff` / `#4a2bc2`** | **gov-blue `#0373DF`** | **Conflict — see §3** |

Read plainly: **the architecture is compatible and in several places we are further along than UX4G
is.** Our type scale is responsive and theirs is not — their own documentation calls token-level
responsive scaling "on the UX4G roadmap". We have a high-contrast theme and a density axis; they have
neither. The gap is not structural. It is naming, four missing scale values, and colour.

### Component coverage

UX4G 3.0 publishes 59 components. SAMAVESH exports 45, plus 13 chart types.

| UX4G category | Total | We have or partly have | Missing |
|---|---|---|---|
| Form elements | 18 | 11 | 7 |
| Feedback | 13 | 8 | 5 |
| Data display | 17 | 10 | 7 |
| Navigation | 9 | 5 | 4 |
| Others | 2 | 1 | 1 |
| **Total** | **59** | **35** | **24** |

**Coverage: 59%.**

The 24 missing, grouped by why they matter:

- **India-specific inputs — build first.** Aadhaar input, OTP input, PAN input. These are the reason
  UX4G exists and we have none of them, despite every portal needing them.
- **Ordinary gaps we should have closed already.** Accordion, Breadcrumb, Tooltip, Popover, Divider,
  Link, Pagination as an export. Pagination and tooltip exist today only buried inside `DataTable`
  and `SidebarNav` — not as shared components.
- **Pickers.** Date Picker, Time Picker, Combobox, Slider, Range Slider.
- **Government workflow.** SLA Progress Indicator, Draft Status Banner, Time Slot, Result List Row —
  these encode Right to Service Act timing and are worth taking as specified.
- **Lower priority.** Carousel, Image, List, Mega Menu, Mobile App Header, Feedback rating,
  Biometric Capture.

Against that, roughly **20 SAMAVESH components have no UX4G equivalent at all**: the AppSwitcher,
PortalLoginShell, DashboardGrid, KpiRow, MetricCard, ChartCard, FilterBar, DataTable, Wizard,
ApprovalTimeline, DeclarationCheckbox, GeoPhotoInput, MediaGalleryInput, ReviewSection, Lightbox,
SegmentedControl, plus the whole charts library including the India map.

This confirms the adoption plan's reading. UX4G 3.0 covers the citizen applying for a service. It
covers almost nothing of the officer reviewing, approving, monitoring and reporting on that service —
which is most of what we build. Those are the components to offer back under clause 4.

---

## 3. The one real conflict: colour

UX4G 3.0's primary is violet — `#6a4eff` at 500, `#4a2bc2` at 600. MoSJE's is gov-blue `#0373DF`.
Every other divergence in the scorecard is naming or a missing value. This one is a genuine choice.

It is also already answered by UX4G itself: Theme Craft 2.0 exists precisely so a department can
apply its own colours, and DBIM *requires* us to build a primary colour group from the ministry's
key colour. The adoption plan records this correctly.

What we should add on the build side is cheap and makes the position demonstrable rather than
asserted. SAMAVESH already has a `data-color-mode` axis carrying `blue-light` and `blue-dark` as peer
modes. **We add `ux4g-light` and `ux4g-dark` as two more peer modes** carrying UX4G's palette
unmodified.

That gives us, for the cost of a token file:

- the ministry's blue as the default, as DBIM requires;
- UX4G's exact published palette reachable by flipping one attribute, so "does it work in UX4G
  colours" stops being a discussion and becomes a switch someone can click;
- a real contrast test of our components against UX4G's ramps, which is the check week 2 of the
  adoption plan calls for.

No existing screen changes. Nothing is branched.

---

## 4. A measurable definition of conformance

The adoption plan notes that nobody has yet defined what "using UX4G" means, and that we will report
the most objective measure we can produce until they do. Here is that measure.

**UX4G conformance = the share of resolved UX4G 3.0 token values that a SAMAVESH component renders
correctly, plus the share of UX4G's 59 components we cover.**

It is computed, not estimated, in four parts:

| Part | What is counted | Today |
|---|---|---|
| **Token coverage** | UX4G tokens SAMAVESH expresses at all | **100%** (755/755) |
| **Token binding** | …of those, how many resolve to a SAMAVESH token rather than a copied literal | **41.2%** (311/755) |
| **Structural conformance** | non-colour tokens resolving to UX4G's exact published value | **100%** (452/452) |
| **Component coverage** | UX4G's 59 published components | **59.3%** (28 exact + 7 partial) |

Run it with `npm run ux4g:measure`. It exits non-zero on structural drift, so it can gate CI, and
`npm run ux4g:report` writes `docs/ux4g/conformance-report.md` for the weekly submission. The method
ships with the number: `tools/ux4g-conformance/README.md`.

Two notes on reading these figures honestly:

- **Colour is excluded from the value check by design.** It maps by *role* onto the ministry's key
  colour, as DBIM requires and UX4G's Theme Craft exists to allow; comparing hex values there would
  measure the wrong thing. 302 colour tokens are role-mapped.
- **Token binding is the number to push up.** A *bound* token shares one value with SAMAVESH and
  cannot drift; a literal is a copy that can. 41.2% today, and it rises as more of UX4G's structural
  values find a SAMAVESH counterpart.

This matters beyond reporting: whatever definition of compliance arrives later, we will have a dated
series of measurements to answer it with.

*(The earlier draft of this document cited 869 tokens. That counted every custom property declared
anywhere in UX4G's stylesheet, including component-scoped ones. The `:root` contract — the thing a
consumer actually programs against — is 755. Measured, not estimated.)*

---

## 5. What we do, in order

Ten working steps. Each ends in something committed and checkable. Steps 1–4 are the foundation and
should not be reordered.

**1 · Record the baseline.** ✅ **Done.** `tools/ux4g-conformance/` — extractor, component map and
measurement. Baseline in §4 and in `docs/ux4g/conformance-report.md`.

**2 · Add the UX4G token layer.** ✅ **Done.** All 755 UX4G tokens are generated into
`@mosje/design-system/ux4g.css` from the extracted reference, resolved onto our own tokens.
Deliberately an **opt-in** stylesheet, so the default bundle does not grow. Structure carries UX4G's
exact values; colour maps by role onto the MoSJE palette.

**3 · Close the scale gaps.** ✅ **Done.** UX4G's four semantic spacing role families
(`--ds-inline/stack/padding/section-*`) adopted verbatim; `--ds-spacing-10xl/11xl` added for UX4G's
`padding-3xl/4xl`; `--ds-font-display` (Noto Sans Display) added; the shadow ramp completed to six
levels. The scale turned out to need less work than the draft assumed — 14 of our 15 spacing values
were already steps on UX4G's base ramp.

**4 · Add the `ux4g-light` / `ux4g-dark` colour modes.** ✅ **Done.** Exported as `UX4G_COLOR_MODES`,
deliberately not merged into `COLOR_MODES` (they need the opt-in stylesheet loaded). The MoSJE
default is untouched. *Still to do: the full contrast sweep across all four modes — the week-2 check
the adoption plan calls for.*

**5 · Build the three India inputs.** Aadhaar, OTP, PAN — to UX4G's specification, in React, on our
tokens. Highest value in the whole list: every portal needs them, we have none, and they are the
clearest thing to contribute back under clause 4. *(Three days.)*

**6 · Close the ordinary gaps.** Accordion, Breadcrumb, Tooltip, Popover, Divider, Link. Promote the
pagination inside `DataTable` and the tooltip inside `SidebarNav` into real exports instead of leaving
them buried. *(Four days.)*

**7 · Build the workflow components.** SLA Progress Indicator, Draft Status Banner, Time Slot,
Result List Row — taken as UX4G specifies, since they encode statutory timing we should not invent.
*(Three days.)*

**8 · Pickers.** Date Picker, Time Picker, Combobox, Slider. Larger and more accessibility-sensitive
than they look; keep them together and keep them last of the build steps. *(Five days.)*

**9 · Wire conformance into CI.** Point `tools/design-audit` at the UX4G baseline and fail the build
on regression. After this the weekly figure produces itself. *(Two days.)*

**10 · Package the contribution.** The ~20 components UX4G has no equivalent for — dashboards,
approval chains, field reporting, charts, the India map — documented against UX4G's foundations and
submitted under clause 4. *(Ongoing, closes in weeks 12–13 with the adoption plan.)*

Steps 1–4 are complete. Steps 5–8 are about three weeks of component work and can run in parallel
with the Figma library upgrade in weeks 4–6 of the adoption plan.

### Found while doing steps 1–4

Three things surfaced that the paper audit could not have seen.

**A live type bug across all six portals — fixed.** `data-surface="portal"` sits on a wrapper
`<div>`, not on `<html>`. A CSS custom property substitutes `var()` at the element where it is
*declared*, so the `--ds-text-*` / `--ds-leading-*` aliases — declared once at `:root` — kept the
**website** type scale inside every natively-mounted portal. Display headings were scaling to 80px
where the portal scale says 56px. Confirmed in-browser before and after. This is the same defect
class the codebase had already found and fixed for `data-color-mode`; the `[data-surface]` block
never got the same treatment. Alias re-assertion is now targeted per block and guarded by a test
that fails on regression.

**tokens.css got 35% smaller.** Re-assertion used to emit the whole ~290-entry alias table into all
four theme blocks, most of it spacing/radius/shadow aliases that no theme can vary. Targeting it
took the file from **92 KB to 60 KB raw (8,173 → 7,764 bytes gzipped)** — while *adding* 40 tokens
and fixing the bug above. Every property in the estate loads this file.

**UX4G sizes type in `rem`; SAMAVESH sizes it in `px`.** Their typography guidance is explicit about
why: rem respects a user who raises their browser's default font size without zooming. Our fluid
`clamp()` scale is px-based, so it does not. Browser *zoom* still works, so WCAG 1.4.4 is met — but
on this one axis **UX4G is better than us**, and the user asked for the opposite. The `--ux4g-size-*`
tokens deliberately keep UX4G's rem rather than being aliased to our px, so the parity layer does not
inherit our limitation. **Converting the SAMAVESH fluid scale to rem is now the top open follow-up.**
It is a real change — every clamp() bound, the Figma type modes, and a visual regression pass across
30-odd properties — so it needs design sign-off rather than being folded into this pass.

---

## 6. What this changes in the adoption plan

Nothing structural. Three things get firmer.

| Adoption plan says | This audit adds |
|---|---|
| "UX4G ships its web version in a form intended for a different way of building sites" | The specific figures: a 7.6 MB stylesheet, a 286 KB DOM-mutating runtime, no React components, v1.0.3 under a proprietary licence |
| "We will report how closely our components match UX4G's specifications, measured rather than judged" | The four-part measure in §4, and the existing tooling that computes it |
| "Apply ministry branding through Theme Craft" | The code-side counterpart: UX4G's palette as two switchable colour modes, so conformance can be demonstrated without changing the default |

---

## 7. Risks specific to the build side

| Risk | Likelihood | Impact | What we do |
|---|---|---|---|
| UX4G publishes a real React package mid-programme and our position looks like avoidance | Medium | Medium | Keep the `--ux4g-*` alias layer from step 2 exact, so adopting their components later is a swap and not a rewrite |
| We are told to install `ux4g-web-components` regardless | Low | Very high | The figures in §1 are the response; if the instruction stands, it needs a written decision because it breaks working portals |
| The 869 tokens change between 1.0.3 and the next release | High | Low | Tokens are generated, not hand-written; regeneration is a build step |
| Building 24 components pulls people off portal delivery | Medium | High | Steps 5–8 are ordered by value, so stopping after step 5 or 7 still leaves a coherent system |
| Our fluid type scale is read as non-conformance because UX4G's is fixed | Medium | Medium | Record it in the decision register now: our values match theirs at 1280px and only improve below it |

---

## In short

The architecture is compatible, and on responsive type, theming axes and high-contrast we are ahead
of UX4G rather than behind it. Component coverage is 59%, and the missing quarter is concrete and
buildable — the three India-specific inputs first, since every portal needs them and we have none.

The only genuine conflict is colour, and UX4G's own Theme Craft plus DBIM's requirement together
settle it. We make it demonstrable by carrying UX4G's palette as a switchable mode.

We do not install `ux4g-web-components`. A 7.6 MB stylesheet and a runtime that rewrites React's DOM
would break portals that work today, and version 1.0.3 under a proprietary licence is not a
foundation for thirty-three government properties. We match the specification, we measure how well we
match it, and we offer back the twenty components UX4G does not yet have.
