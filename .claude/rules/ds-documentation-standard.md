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

The documentation frame's last section is the **arrangements** section
(`figma-documentation-style.md` § "The arrangements section"): every non-variant
property switched on, every group arrangement, every code-only state, drawn from
live instances and captioned. The variant grid shows the axes; this shows the
rest, because a property only visible in the properties panel is invisible to
anyone browsing the library. The web page's playground renders the same set.
`npm run check:figma-arrangements` gates it: a baseline of the component pages
still without the section, which may only shrink.

**A set with no code counterpart is recorded as Figma-only on the Component record in
the same session it is built.** The login page grew `Auth / CredentialRecovery` and
`Auth / RecoveryFormCard` on 2026-09-04 while the plan for that page said Figma must not
get ahead of the code; with `OrganisationCard`, `PortalList` and `AuthFormCard` that
made five organisms a designer can compose and no developer can build from the barrel.
Build the code, or write the gap down where the next maintainer will find it — the
record — but do not leave it to an audit to discover.

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

## 2a. The page is RENDERED from a template, and the API is GENERATED

Superseded 2026-09-02. §2 above describes six elements a page must carry, and it
was right about the elements and wrong about how they arrive. Requiring each page
to assemble them by hand produced exactly what hand-assembly always produces:
**three of a hundred pages carried the shape**, ninety-nine declared their own
`const h2Style`, and with those came 161 unbound `lineHeight` numbers and 107
`maxWidth` px literals across NINE different prose measures — on the surface
`documentation-ds-linkage.md` calls the strictest in the estate.

**A page is now `<ComponentDocPage />`** (`docs-kit/component-doc-page.tsx`). It
renders the whole shape from data, so the six elements arrive by construction
rather than by memory, and the measure is one token-bound value in one stylesheet
instead of nine numbers in a hundred files. `check:ds-pages` recognises the
template — but only when the page supplies every prop that carries one of the six,
so an empty shell still fails.

**The props table is GENERATED, never written.** `tools/props-extract/extract.mjs`
reads the TypeScript type checker and emits `props.generated.ts`; a page passes
`propsFrom="ButtonProps"`. Hand-written tables are what put a prop called `action`
on the ChartCard page when the prop is `actions`, marked two optional `AppShell`
props required, documented two of `BarChart`'s eleven, and published `Modal` sizes
of 400/600/800px against a CSS of 24rem/28rem/40rem. Of twelve tables audited
against their implementations, **one** was correct. `npm run check:props` fails
when the generated output is stale, so an interface can no longer move without the
documentation following.

Use the hand-written `props` array only for what the extractor cannot see — a
hook's arguments, a callback's shape, a sub-object like `DataTableColumn` — and
pass both.

**The accessibility checklist defaults to UNVERIFIED.** `A11yChecklist` rows carry
`status: "verified" | "partial" | "untested"`, defaulting to `untested`, plus an
`evidence` field. The previous version rendered a fixed green tick against named
WCAG criteria on 74 pages with no way to say a criterion had not been checked —
a compliance assertion with nothing behind it, on a Government of India property.
**A tick is earned by naming the evidence.** Do not mark a row `verified` because
the component looks right.

**A component with no page now fails a gate.** `check:docs-coverage` asserts the
direction `check:docs-routes` never did — it verified every PAGE had a route and
printed "one per component", which is a statement about the pages, not about the
components. Thirty-eight exports had no page, including `Breadcrumb` (the newest
release's headline), `Pagination`, and `SectionTitle`, which
`ui-restraint-and-copy.md` §3 mandates for every section heading in the estate.
Ninety-nine pages hand-rolled a heading instead, which is what an undiscoverable
component produces.

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

## 5. Two things that bite when a component comes from ANOTHER file

**A remote component cannot be repaired here, and it cannot be safely scaled.**
The SAMAVESH seal is `remote: true` — it lives in a different library file — so
`set_fills` on it fails with *"Cannot write to internal and read-only node"*. Its
inner groups carry mixed constraints, and the damage that causes is measurable:

| instance size | inner groups that distort |
|---|---|
| 48 | 2 — `SAMAVESH LOGO` 0.989→1.004, `Group` 2.364→**2.539** |
| 44 | 2 — `Group` 2.364→2.453 |
| **40 (natural)** | **0** |

So a remote component is used at its NATURAL size or not at all, until its owning
file is fixed. Anything the band needs around it — the white circular ground the
code draws as `.ds-samavesh-banner__badge` — is built HERE, as a wrapper, not by
editing the component.

**A failed `use_figma` call rolls the whole script back.** A variant reorder and a
padding change were both written before a later `set_fills` threw, and both were
silently undone — the screenshot afterwards looked wrong for a reason that had
nothing to do with the edits themselves. After any error, re-read the state before
assuming the earlier half of the script survived. It did not.

## 6. The default variant is the one that PASSES

A component set's FIRST variant is what a fresh instance gets. The SAMAVESH Banner
led with `Tone=Light` — white on `#ff671f`, **2.9:1**, below AA — while `Tone=Dark`
measures about 6.5:1 on the same ground. Dark leads now.

Where a set carries a conformant option and a non-conformant one, the conformant
one is the default and the other is the deliberate exception. Shipping it the other
way round means every instance starts out failing and someone has to know to change it.
