# UX4G 3.0 conformance — SAMAVESH

Measured against `ux4g-web-components@1.0.3` (reference extracted 2026-08-06).
Calculated by `tools/ux4g-conformance/measure.mjs` — no figure here is a judgement.

| Measure | Result | What it means |
|---|---|---|
| **Token coverage** | **100%** (755/755) | UX4G tokens SAMAVESH expresses at all |
| **Token binding** | **41.2%** (311/755) | …of those, how many resolve to a SAMAVESH token rather than a copied literal (bound tokens cannot drift) |
| **Structural conformance** | **100%** (452/452) | non-colour tokens resolving to UX4G's exact published value |
| **Colour role-mapped** | **302** tokens | resolve to the MoSJE palette by role (excluded from the value check by design) |
| **Component coverage** | **64.4%** (31 exact + 7 partial of 59) | UX4G's published component set |

Colour is deliberately excluded from structural conformance: it maps by ROLE onto the
ministry's key colour (DBIM) via UX4G's own Theme Craft, so a value comparison there
would measure the wrong thing. Set `data-color-mode="ux4g-light"` to render UX4G's
literal palette instead.

## Components still missing (21)

**Build first:** SLA Progress Indicator.

- Form Elements: Combobox
- Form Elements: Date Picker
- Form Elements: Time Picker
- Form Elements: Range Slider
- Form Elements: Slider
- Feedback: Draft Status Banner
- Feedback: Feedback
- Feedback: Popover
- Feedback: SLA Progress Indicator
- Feedback: Tooltip
- Data Display: Accordion
- Data Display: Carousel
- Data Display: Divider
- Data Display: Image
- Data Display: List
- Data Display: Result List Row
- Data Display: Time Slot
- Navigation: Breadcrumb
- Navigation: Link
- Navigation: Mega Menu
- Others: Biometric Capture

## Beyond UX4G

23 SAMAVESH components have no UX4G 3.0 equivalent — the officer-facing
half of the estate (dashboards, approval chains, field reporting, charts, the India map).
These are the clause-4 contribution candidates.
