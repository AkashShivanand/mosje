# UX4G 3.0 conformance — SAMAVESH

Measured against `ux4g-web-components@1.0.3` (reference extracted 2026-08-06).
Calculated by `tools/ux4g-conformance/measure.mjs` — no figure here is a judgement.

| Measure | Result | What it means |
|---|---|---|
| **Token coverage** | **100%** (755/755) | UX4G tokens SAMAVESH expresses at all |
| **Token binding** | **44.1%** (333/755) | …of those, how many resolve to a SAMAVESH token rather than a copied literal (bound tokens cannot drift) |
| **Structural conformance** | **100%** (452/452) | non-colour tokens resolving to UX4G's exact published value |
| **Colour role-mapped** | **302** tokens | resolve to the MoSJE palette by role (excluded from the value check by design) |
| **Component coverage** | **88.1%** (48 exact + 4 partial of 59) | UX4G's published component set |

Colour is deliberately excluded from structural conformance: it maps by ROLE onto the
ministry's key colour (DBIM) via UX4G's own Theme Craft, so a value comparison there
would measure the wrong thing. Set `data-color-mode="ux4g-light"` to render UX4G's
literal palette instead.

## Components still missing (7)

- Form Elements: Time Picker
- Feedback: Draft Status Banner
- Feedback: Feedback
- Data Display: Carousel
- Data Display: Image
- Data Display: Time Slot
- Others: Biometric Capture

## Beyond UX4G

23 SAMAVESH components have no UX4G 3.0 equivalent — the officer-facing
half of the estate (dashboards, approval chains, field reporting, charts, the India map).
These are the clause-4 contribution candidates.
