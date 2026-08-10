# Figma: Dark and HC modes removed from the Theme collection (2026-08-10)

## Why

The UX4G accessibility widget is the single canonical accessibility / high-contrast
mechanism for the estate. It applies its own `.dark-mode` class to `<html>` and is
explicitly **distinct** from the design system's `data-theme` token axis — see the doc
comment in `packages/design-system/components/a11y/ux4g-accessibility-widget.tsx`.

So the `data-theme` dark/HC axis was a second, parallel mechanism that nothing in the
estate consumed. Removing it removes confusion, not capability.

## What changed

`Theme` collection: modes `Light | Dark | HC` → **`Light`** only.
All 374 variables and every binding survive; only the per-mode Dark/HC values were dropped.

## Rollback record — the 45 values that differed from Light

Recorded in the same atomic script that removed the modes. To restore, re-add the modes
and re-apply these. `light` shows what the variable resolves to now.

Dark overrides (34) and HC overrides (11), by variable:

| Variable | Mode | Value that was removed |
|---|---|---|
| Text/Neutral/Primary | Dark | #f3f4f6 |
| Text/Neutral/Primary | HC | #000000 |
| Text/Neutral/Secondary | Dark | #c2c7d0 |
| Text/Neutral/Disabled | Dark | #f3f4f6 @ 40% |
| Text/Neutral/Strong | Dark | #ffffff |
| Text/Link/Brand/Default | Dark | #5fa0ef |
| Text/Link/Brand/Hover | Dark | #025fb8 |
| Text/Link/Brand/Disabled | Dark | #f3f4f6 @ 40% |
| Text/Link/Neutral/Default | Dark | #c2c7d0 |
| Text/Brand/Primary/Base | Dark | #0373df |
| Text/Status/Success/Base | Dark | #66bb6a |
| Text/Status/Error/Base | Dark | #ff6b5e |
| Text/Status/Info/Base | Dark | #4285f4 |
| Background/Neutral/Base | Dark | #1b1f27 · HC #ffffff |
| Background/Neutral/Soft | Dark | #0f1115 · HC #ffffff |
| Border/Neutral/Subtle | Dark | #262b33 · HC #000000 |
| Border/Neutral/Base | Dark | #343b48 · HC #000000 |
| Border/Neutral/Strong/Default | Dark | #4a5263 · HC #000000 |
| Border/Neutral/Strong/Hover | Dark | #5b6577 · HC #000000 |
| Border/Brand/Primary/Base | Dark | #0373df |
| Border/Status/Success/Base | Dark | #66bb6a |
| Border/Status/Error/Base | Dark | #ff6b5e |
| Border/Status/Info/Base | Dark | #4285f4 |
| Icon/Neutral/Primary | Dark | #f3f4f6 · HC #000000 |
| Icon/Neutral/Secondary | Dark | #c2c7d0 |
| Icon/Neutral/Disabled | Dark | #f3f4f6 @ 40% |
| Icon/Brand/Primary/Base | Dark | #0373df |
| Icon/Status/Success/Base | Dark | #66bb6a |
| Icon/Status/Error/Base | Dark | #ff6b5e |
| Icon/Status/Info/Base | Dark | #4285f4 |
| Focus/Ring | Dark | #7db4f5 @ 55% |
| Overlay/Neutral/Stronger | Dark | #000000 @ 60% |
| Button/Primary/Background | Dark | #0373df |
| Button/Primary/BgHover | Dark | #025fb8 |
| Card/Background | Dark | #1b1f27 · HC #ffffff |
| Card/Border | Dark | #262b33 · HC #000000 |

## Note

The code side still emits `[data-theme="dark"]` (142 overrides) and `[data-theme="hc"]`
(23). Removing those is the matching change in `@mosje/tokens`; this record covers the
Figma half only.
