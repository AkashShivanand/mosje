---
paths:
  - "packages/design-system/**"
  - "tools/figma-doc-parity/**"
  - "docs/design-system/**"
---

# Figma library documentation — the house style

**Every documentation page in the SAMAVESH Figma library is built to the grammar
established by the `Colour` page (`2140:295913`, frame `Colour — Documentation`
`54987:720`).** That page is the reference implementation. When you author or
revise a documentation page — Layout, Motion, Density, Iconography, a component
page — you match it. A page that invents its own frame width, its own header
shape or its own voice is a defect, however good it looks on its own.

This rule governs *shape and voice*. Binding is governed by
`.claude/rules/documentation-ds-linkage.md`, and both apply at once: the house
style tells you what to build, the linkage rule tells you that every value in it
must resolve through a variable or a published style.

## 1. One page, one frame

A documentation page holds **exactly one top-level frame**, named
`<Topic> — Documentation`.

| Property | Value |
|---|---|
| Width | **1680** (fixed) |
| Layout | `VERTICAL`, `itemSpacing: 0`, padding `0` |
| Fill | `bg/neutral/base` |

Do **not** scatter a page across several sibling frames. Sections are children of
the one frame, and the vertical rhythm comes from each section's own padding, not
from gaps between frames.

## 2. The measurements that never change

| Thing | Value | Bind to |
|---|---|---|
| Frame width | 1680 | — |
| Content column | **1440** | — |
| Section side padding | **120** | `ref/space/10xl` is 120 |
| Section top / bottom padding | **80** | `ref/space/9xl` is 80 |
| Section internal gap | **40** | `ref/space/4xl` |
| Prose measure (lede + section description) | **880** | — |
| Panel padding | **28** | — |
| Panel radius | **12** | `ref/radius/lg` |
| Hero "at a glance" radius | **16** | `ref/radius/xl` |
| Pill radius | **999** | `ref/radius/full` |

The 880 measure is the important one and the one most often lost. A lede that
runs the full 1440 is unreadable; the Colour page holds every explanatory
paragraph to 880 and lets only tables, diagrams and footnotes run full width.

## 3. The hero

First child of the documentation frame.

- Fill `color/primaryScale/50`, padding `[88, 120, 80, 120]`, gap `24`.
- **eyebrow row** — `HORIZONTAL`, gap `12`, `counterAxisAlignItems: CENTER`:
  - category in `Label/label-3`, uppercase, `text/brand/primary/base` — e.g. `FOUNDATIONS`
  - a **pill**: radius `999`, padding `[4, 10, 4, 10]`, fill `color/primaryScale/600`,
    label `Label/label-3` in `text/neutral/inverse` — e.g. `SAMAVESH`
- **title** — `Display/display-3`, `text/neutral/base`. One word or a short phrase.
- **lede** — `Body/body-1`, `text/neutral/subtle`, width **880**.
- **"at a glance" card** — width 1440, fill `bg/neutral/base`, radius `16`,
  padding `40`, gap `28`, holding a `stats` row (`HORIZONTAL`, gap `24`).
  Each stat cell is: a row of **big number** (`Headline/headline-1`,
  `text/brand/primary/base`) + **unit label** (`Body/body-2`), then a
  `Body/body-3` note in `text/neutral/subtle`.

Six stats is the established count. Every number must be one you actually
measured or counted — never a round-sounding estimate.

## 4. Sections

Each section is a child frame named `NN <Title>` — `01 How to read a colour token`.

| Property | Value |
|---|---|
| Width | 1680 |
| Padding | `[80, 120, 80, 120]` |
| Gap | `40` |
| Fill | `bg/neutral/base` |

Every section opens with a `header` frame (`VERTICAL`, gap `16`, width 1440):

1. **Eyebrow** — `Label/label-3`, `text/brand/primary/base`, formatted
   `NN / KEYWORD` where KEYWORD is one uppercase word naming the section's
   subject: `01 / ANATOMY`, `02 / TIERS`, `03 / RAMPS`, `05 / INK PAIRINGS`.
2. **Title** — `Headline/headline-2`, `text/neutral/base`.
3. **Description** — `Body/body-1`, `text/neutral/subtle`, width **880**.

Then content blocks, each width 1440. Then, usually, a closing footnote.

### Panels

The workhorse block. Fill `bg/neutral/subtler`, radius `12`, padding `28`,
gap `12`–`20`.

- Panel title — `Title/title-1`
- Panel body — `Body/body-2`
- Optional panel eyebrow — `Label/label-3` in a **status or brand colour**, used
  as a label on the neutral card. Never fill the whole panel with a status tint;
  the coloured label carries the signal. (Same restraint the linkage rule states.)

### Closing footnote

Most sections end with an unpanelled `Body/body-2` or `Body/body-3` in
`text/neutral/subtle`, running the full 1440. This is where the claim gets
grounded — the test that enforces it, the date it changed, the count it came from.

## 5. Voice

This is not decoration; it is the reason the Colour page reads as authoritative.

- **Section titles are claims, not nouns.** `Three tiers, and the one you are
  allowed to type` — not `Tiers`. `Never choose an ink — the system already
  measured one` — not `Ink pairings`. `A rung name is a prominence claim, not a
  contrast guarantee` — not `Caveats`. If a title could be a folder name, rewrite it.
- **Lead with the number.** "Eight ramps, two brands, and forty-six ink pairings."
  "Sixteen tokens currently measure below the class their rung implies."
- **Cite the enforcement, not the history.** Name the rule that holds a claim up —
  *"on-pair-contrast.test.mjs fails the build if any pair drops below, and its
  exemption list may only ever shrink."* Name the test, not the commit date and
  not who changed it.
- **The page describes what the component IS, not what it has been.**
  **No defect notes, no remediation history, no dated attribution, no comparison
  to the source system it was derived from.** A reader is deciding how to use the
  component today; "this was wrong until 17 August 2026" and "better than UX4G's
  version" tell them nothing about that and date the page the moment they land.
  **Do not delete that material — relocate it.** It goes in a sibling
  **`<Topic> — Component record`** frame on the same page, *outside* the
  documentation frame, in its own `N · Record — maintainers` section: **open
  gaps**, Figma↔code parity, change history, and sources. Keep it forward-looking —
  a catalogue of defects already fixed adds no value to anyone and just grows;
  what a maintainer needs is the work still to do. A component description or a
  changelog line is where this kind of
  detail goes to be lost; a named frame beside the masters is where a maintainer
  will actually find it.

  Superseded 2026-08-17: this bullet previously required the opposite, and every
  page built under it carried a defect panel that had to be stripped by hand.
  The split — clean page for consumers, record frame for maintainers — is the
  resolution; losing the data is not.
- **Say what is banned and why.** "Banned in app code — referenced only inside
  tokens.css."
- Prose is plain and declarative. No marketing adjectives, no "simply", no
  "powerful", no exclamation.

## 6. Checklist

- [ ] One top-level frame, `<Topic> — Documentation`, width 1680, fill `bg/neutral/base`
- [ ] Hero with eyebrow + pill, `Display/display-3` title, 880-wide lede,
      "at a glance" card with six counted stats
- [ ] Sections named `NN <Title>`, padding `[80,120,80,120]`, gap 40
- [ ] Each section header: `NN / KEYWORD` eyebrow → `Headline/headline-2` →
      880-wide `Body/body-1`
- [ ] Content blocks at 1440; panels `bg/neutral/subtler`, radius 12, padding 28
- [ ] Section titles are claims, not nouns
- [ ] Every number is counted or measured, and its enforcement is named
- [ ] No defect notes, remediation history, dates or attribution on the page
- [ ] A sibling `<Topic> — Component record` frame exists outside the
      documentation frame — open gaps, Figma↔code parity, change history, sources.
      Forward-looking only; no catalogue of defects already fixed
- [ ] `.claude/rules/documentation-ds-linkage.md` audit passes: 0 unstyled text,
      0 raw fills, 0 raw strokes, nothing below 11px
