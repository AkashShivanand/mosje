# One shape for every component — Figma, web, and the assets between them

**A design system whose components are each documented differently is not one
design system.** This rule sets the single shape, and names the gate that holds
each half of it up.

Census, 2026-08-31 — what "documented differently" actually meant:

| Surface | Conformant | Total |
|---|---|---|
| Web component pages carrying the full shape | **3** | 100 |
| Figma component pages with a `— Documentation` frame | **10** | 46 |
| Figma component pages with a `— Component record` frame | **5** | 46 |
| Web pages linking to the component in Figma | **10** | 100 |

The house style has existed since 2026-08-11 in
`.claude/rules/figma-documentation-style.md`. It was never gated, and the numbers
above are what a rule with no gate is worth after three weeks.

## 1. The Figma page

Every component page holds, in this order and nothing else at the top level:

1. **`<Topic> — Documentation`** — the frame consumers read. Grammar, measurements
   and voice: `figma-documentation-style.md`. Non-negotiable: 1680 wide, hero with
   six COUNTED stats, numbered sections `NN <claim>`, 880px prose measure.
2. **`<Topic> — Component record`** — the frame maintainers read. Open items only,
   forward-looking, with a SOURCES panel saying where each number came from.
   A catalogue of defects already fixed is not a record; it is archaeology.
3. **Numbered sections `N · <name>`** holding the published sets, starting at **1**.

**Masters live inside a numbered section, never loose at the page root.** Loose
component sets are how the Brand page ended up numbering its sections 2 and 3 with
no 1 — the section that would have held them was never made, and a later pass
invented a third section rather than looking for the two that already existed.

## 2. The web page

`apps/hub/src/app/design-system/components/**/page.tsx` carries all six:

| Element | Why it is not optional |
|---|---|
| `StatusBadge` | The reader must know whether they are looking at something stable |
| `figmaUrl(FIGMA_NODES.…)` | The single most-missing element — 10 of 100 at the census |
| `DocsTabs` | Design / Code / Accessibility, in that order |
| `PropsTable` | The API, matching the props the component really has |
| `A11yChecklist` | The criteria the component is CLAIMED to meet |
| `FeedbackBar` | A way to report that the page is wrong |

**`npm run check:ds-pages` is the gate**, a ratchet in the estate's usual shape: a
new page below 6/6 fails, a baselined page that drops fails, and one that
**improves** also fails until it is re-baselined — so one page's cleanup cannot be
spent silently on another's regression. The backlog is 97 pages and may only shrink.

**Matched on USAGE, never on the identifier.** The first version of this gate
tested `src.includes("FeedbackBar")`, which the import line satisfies — so a page
that imported the component and never rendered it scored as conformant. Caught by
deleting a rendered `<FeedbackBar />` and watching the gate stay green.

## 3. Organisation marks — the resolution rule

**A mark ships at 3× the largest surface that renders it, capped by its own source,
and is NEVER upscaled.**

| Surface | CSS px | 3× demands |
|---|---|---|
| masthead mega-menu icon | 24 | 72 |
| portal card | 40 | 120 |
| documentation tile `lg` | 56 | 168 |
| **organisation hero** | **84** | **252** |

The hero governs. Marks are exported to a **384px** ceiling where the source
allows, which clears 252 with margin and covers a 3× display at every other size.

**Two things this rule exists to stop.**

*Sizing for the smallest surface.* The set was once optimised for the 56px tile at
256px and looked correct there while the 84px hero drew a **48px** file — 3.5×
upscaled, and the reason the marks read as cheap wherever they sit in white space.
Size for the LARGEST surface, then let every smaller one inherit the headroom.

*A second copy.* `/design-system/org-logos/` is canonical. `/website/images/org-logos/`
is a duplicate that survived the OrgLogo migration because `organisation-details.ts`,
`Header.tsx` and `NmbaHomeCompact.tsx` still write paths into it directly. Until
those move to the registry the two directories are kept byte-identical, and
`check:org-logos` reports every literal that keeps the duplication alive.

**Six marks cannot meet 3× and it is not an export problem.** NCBC (100px source),
NSKFDC (200), NOS (200), NBCFDC (209), PM-AJAY (217) and NISD (250) are shipped at
their full source resolution and still fall short at the hero. That needs artwork
from the organisation, not a better export, and it is recorded on the Brand page's
component record rather than left to be rediscovered.

## 4. Scaling a mark — constraints, not hope

A mark's artwork binds `constraints: { horizontal: "SCALE", vertical: "SCALE" }`.

`SCALE / CENTER` was the default on the org-logo set and it is a distortion waiting
for a resize: width tracks the frame, height does not. When the set gained an
eighteenth variant its GRID layout resized every variant 56 → 100, the artwork
stretched on one axis only, and **24 marks across the SAMAVESH Banner rendered as
diagonal smears** — an instance box of 40 showing a clipped fragment of a 93px
child. Verifying the instance BOX was unchanged missed it entirely; the damage was
one level down.

**Check the child, not the frame.** After any change to a component set's size,
assert that no descendant of an instance exceeds its instance's bounds.
