# MoSJE Portal — Visual Annotation System

> One fixed visual language for every annotated finding. Because all artifacts use the same
> system, the output reads like it came from a single senior designer — consistent, legible,
> and self-explanatory. **Do not freestyle annotations.** Use this spec and the HTML template.

---

## 1. Layout of an annotated finding

Each annotated PNG is a **single comparison board** for one screen (or one zoomed region),
with numbered callouts keyed to tracker rows.

```
┌───────────────────────────────────────────────────────────────────────┐
│  HEADER BAR                                                             │
│  [Portal · Screen · Viewport]              [QC ref range  e.g. 001–006] │
├──────────────────────────────────┬────────────────────────────────────┤
│  FIGMA (design intent)           │  LIVE (as built)                    │
│  ┌────────────────────────────┐  │  ┌───────────────────────────────┐ │
│  │                            │  │  │              ②                │ │
│  │            ①              │  │  │      ③                        │ │
│  │                            │  │  │                               │ │
│  └────────────────────────────┘  │  └───────────────────────────────┘ │
├───────────────────────────────────────────────────────────────────────┤
│  LEGEND / FINDINGS STRIP                                                │
│  ① 🟠 Spacing  ② 🔴 Color  ③ 🟡 Type  — short labels, keyed to tracker  │
└───────────────────────────────────────────────────────────────────────┘
```

A **third "overlay" panel** is added when useful: the Figma frame laid over the live capture at
50% opacity, so positional drift is undeniable.

---

## 2. Callout markers

- **Numbered pill** — a filled circle with the finding number, placed on the *live* panel at the
  point of the problem (and optionally mirrored on the Figma panel to show the intended state).
- **Color = severity** (see palette). The number is always white, bold, centered.
- **Connector** — a 2px leader line from the pill to the exact element when the pill can't sit on it.
- **Measurement marks** — for spacing: red dimension lines with the px delta ("design 24 / built 16 → +8").
  For color: a swatch chip pair (design vs built) with hex. For type: a one-line specimen ("16px/600 → built 14px/500").

Markers never cover the thing they describe — offset and lead with a line instead.

---

## 3. Color palette (severity)

| Token | Hex | Use |
|-------|-----|-----|
| Blocker | `#DC2626` | severity pill, measurement lines for blockers |
| Major | `#EA580C` | severity pill |
| Minor | `#CA8A04` | severity pill |
| Nit | `#6B7280` | severity pill |
| Marker text | `#FFFFFF` | numbers inside pills |
| Board bg | `#0B1220` | dark board background (screenshots pop) |
| Panel label | `#E5E7EB` | FIGMA / LIVE labels |
| Grid/guide | `#22D3EE` | overlay alignment guides (cyan, 1px) |

> These are **annotation-UI** colors, deliberately outside the MoSJE brand palette so callouts are
> never confused with the product UI being reviewed.

---

## 4. Typography (annotation chrome)

- Family: **Noto Sans** (matches the gov standard; falls back to system sans).
- Header bar: 16px / 700. Panel labels: 13px / 600 / letter-spacing 0.04em / uppercase.
- Legend: 13px / 500. Pill numbers: 14px / 700.
- Never smaller than 12px on the board.

---

## 5. Capture standards (so comparisons are fair)

- **Same viewport** both sides: desktop **1440×** and mobile **390×** (default). Note the viewport in the header.
- Figma frame exported at native size, then both panels scaled to equal display width.
- Live captures: real authenticated state, default data, **no devtools/overlays** in frame.
- One screen = one board. If a screen is long, produce stacked region boards (`-a`, `-b`) sharing the header.

---

## 6. File naming

```
docs/qc/portals/<portal>/annotated/<SCREEN>-<viewport>[-region].png
  e.g.  LOGIN-1440.png,  DASHBOARD-1440-a.png,  DASHBOARD-390.png
captures/figma/<SCREEN>-<nodeid>.png     (raw design frame export)
captures/live/<SCREEN>-<viewport>.png    (raw live screenshot)
```

Every callout number on a board maps to a tracker ID `<PORTAL>-<SCREEN>-<nnn>`; the board header
states the ID range so a dev can jump from sheet → image instantly.

---

## 7. Production method

Annotated boards are produced as **HTML (`templates/annotation-board.html`) → rendered to PNG**
via the headless browser. This guarantees pixel-consistent chrome, crisp text, and identical
styling on every board. Inputs are the two raw captures + a small JSON of callouts
(`{n, severity, category, x%, y%, label}`). No hand-drawing.
