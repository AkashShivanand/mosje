# Design-system follow-ups

Hand-maintained. Things the estate knows are wrong or missing, deliberately deferred
rather than forgotten, each parked against the change that will pick it up.

This is **not** a backlog of ideas. An entry earns its place by being a *recorded
divergence* — something already shipped is working around it, and a later reader who
does not know why will "fix" the workaround instead of the cause. Every entry names
the workaround so that reader finds this file first.

Sibling documents: `parity-ledger.md` (generated — what is designed vs built),
`packages/design-system/design.md` (the component contracts themselves).

---

## Open

### Pagination ships without its Figma half

**Deferred to:** whoever next has write access to the SAMAVESH library. Recorded
2026-08-25, on review of PR #186.

**What is missing.** `Pagination` is exported from `packages/design-system/index.ts`
and has a component, a stylesheet and a Storybook story — but no
`pagination.figma.ts` Code Connect template and no docs page under
`apps/hub/src/app/design-system/components/navigation/pagination/`.
`.claude/rules/component-authoring.md` §12 requires the first;
`.claude/rules/design-system-architecture.md` §4 requires the second. The Ticker
that landed the same week (PR #187) has both, so this is an inconsistency inside
one release rather than a standard nobody meets.

**Why it shipped anyway.** It supports the website search results page, which is
finished and verified; holding a working citizen-facing feature for a helper
component's Figma mapping would have been the wrong trade. The template also needs
a Figma node id that does not exist yet — the component was built from the search
design, not promoted from an existing master.

**THE GATES CANNOT SEE THIS, which is the part worth knowing.**
`check:code-connect` walks the templates that exist and checks each one lines up;
a component with *no* template is not a template it walks. `check:docs-routes`
fails when two pages document one component, not when zero do. Both were green on
PR #186. Do not read their passing as evidence that a new export is complete —
until that changes, it is a checklist a human runs.

**The workaround.** Nothing renders a Figma snippet for Pagination in Dev Mode, so
anyone building with it from Figma will hand-roll one. Point them at
`Pagination.stories.tsx` until the template exists.

### Button has no `inverse` axis in Figma — CLOSED 2026-09-07

**Closed.** The rework this was deferred to has landed. The SAMAVESH `Button` set
(key `13803f448c95c59a9163cf3ccb9394f8f1944ca1`, **Button** page — not the
`609:283111` set on the older *Buttons* page this entry was written against) now
carries a fifth axis:

`Size · Type · Sub-type · State · **Tone = Default | Inverse**` — 360 variants.

`Tone=Inverse` crosses the Sub-type axis, so both missing appearances exist:
`Sub-type=Filled, Tone=Inverse` is `inverse`, and `Sub-type=Outlined, Tone=Inverse`
is `inverseOutlined`. The tokens below were already there; the component now uses
them.

**How the stale note survived a month.** It was re-asserted as recently as
2026-09-07, by reading the Button set imported from the **MoSJE Handoff** file —
whose Button has `Type = Primary | Success | Danger` and no `Tone` — instead of
SAMAVESH's own. A component key copied out of a handoff instance is a key into
*that* library. Check the file before recording a gap in this one.

**Closed downstream (2026-09-14):** `Ticker / Action` and `Ticker / Control` are
deleted from the library. Every Ticker variant instances the library `Button`
(Primary · Inverse · Default — Outlined on the desktop bar, Text in the headers) and
`IconButton` (Primary · Text · Inverse · Default), and the code renders `IconButton`
for pause, previous and next.

The original entry follows, for the record.

**Deferred to:** the next Button component rework. Agreed 2026-08-25.

**Corroborated independently.** The Button audit that landed in PR #188 reached the
same finding from the other direction — see `components/button.md`, gap **7**
("`inverse` / `inverseOutlined` absent from Figma entirely") and its note that the
Tier-3 `inverse` branch has to be bound first. That document is now the authority on
what Button needs; this entry exists to record what is *working around* the gap
today, so whoever closes it there knows to come back here.

**What is wrong.** `packages/design-system/components/actions/button.css` ships six
appearances — `filled · outlined · text · tonal · inverse · inverseOutlined`. The Figma
`Button` component set (`609:283111`, Buttons page) carries only four:
`Sub-type = Filled | Outlined | Text | Tonal`. The two inverse appearances exist in
code and are used, but cannot be drawn.

**The tokens are already there.** This is a component gap, not a token gap:

| appearance | Figma tokens that already resolve it |
|---|---|
| `inverse` | `cmp/action/brand/primary/inverse/{default,hover,active,disabled}/{bg,text,border}` |
| `inverseOutlined` | `cmp/action/brand/secondary/inverse/{default,hover,active,disabled}/{bg,text,border}` |

`cmp/action/brand/secondary/inverse/default/*` resolves to transparent fill · white
text · `#ffffff` at 40% border — exactly what `.ds-btn--inverseOutlined` paints.

**What is working around it right now.** `Ticker / Action` in the SAMAVESH library is a
**local part** bound to the `secondary/inverse` tokens, not a `Button` instance. That
breaks the estate's usual rule that nested parts are library instances, and it is
deliberate: a `Sub-type=Outlined` Button on the Ticker's brand-blue bar draws its border
in a blue nobody can see. The divergence is recorded in the Ticker component's Figma
description and in `design.md`.

**What closing it looks like.**
1. Add an `inverse` axis to the Figma `Button` set. Prefer a **separate boolean or
   Tone property over multiplying `Sub-type`** — Button is already
   Size × Type × Sub-type × State × Icon, and a fifth full axis is a variant explosion.
2. Bind it to the `cmp/action/*/inverse/*` tokens above; do not mint new ones.
3. Replace `Ticker / Action` with a real Button instance, and delete the local part.
4. Drop the "Known gap" paragraph from the Ticker description and from `design.md`.
5. Check the other surfaces that sit on solid brand fills for the same workaround
   before assuming Ticker is the only one — portal mastheads and `SiteHeader` are the
   likely places.

**Where it is referenced:** `packages/design-system/design.md` (Ticker § Known gap),
the SAMAVESH `Ticker` component description, `components/button.md` gap 7, PR #187.


---

## Figma component descriptions: escaped-entity noise (2026-08-25) — CLOSED

**Status:** closed. All six genuinely damaged descriptions are repaired; the
library scans clean at 119 components.

**What it was.** Reading Figma's `description` returns HTML-escaped text. Writing
that text back escapes it again, so a read-modify-write cycle compounds: `'` →
`&#39;` → `&amp;#39;` → `&amp;amp;#39;`. The `Ticker` set had reached six levels.

**The correction to the first write-up.** The entry originally filed here claimed
**53 components and 216 entities**, listing Tabs (63), Chatbot (19), Buttons (15),
Inputs (13), Accordion (9) and Card (1). That was wrong, and wrong in a way worth
recording: it counted **single-level** entities, which are Figma's normal
projection of an apostrophe and render correctly. Only *chained* entities — two
or more `amp;` — are damage.

The real figure was **six components and 65 chained entities**, and it was a
different six. Chatbot, Buttons, Inputs, Accordion and Card were never damaged;
`Navbar` and `AccessibilityBar`, which the first survey did not even look at,
were.

| component | chained entities | depth |
|---|---|---|
| Tabs / More | 19 | 2 |
| Tabs / Tab | 17 | 1 |
| Tabs | 16 | 3 |
| AccessibilityBar | 7 | 3 |
| Navbar/NavItem | 4 | 1 |
| Navbar/NavDropdown | 2 | 1 |

All six were decoded to real characters and written back once, so each now carries
the normal single-level projection. Content was compared word-for-word before and
after; nothing was lost. Ticker and Ticker / Mark were repaired earlier via
`descriptionMarkdown`.

**Two traps this left behind**, both now in `.claude/rules/component-authoring.md`
§12b: audit for `/&(amp;)+/` and not `/&\w+;/`, or every healthy description looks
broken; and never read `descriptionMarkdown` as your source without checking it is
non-empty — it is empty on any component authored through `description`, and a
sweep that missed that reported 53 damaged components as "already clean".

---

## Button family — the inverse focus ring is drawn two ways (open, 2026-09-14)

**Figma** draws inverse `Button` and `IconButton` focus with the `focus/ring` effect
style: a 2px white ring inside a 4px `#0373DF` one. **Code** draws
`.ds-btn--inverse*:focus-visible` as a 2px outline of `bg-neutral-base` at 55%, which
measures about **3.0:1** on `primaryScale/600` — at the 1.4.11 floor, not above it.
The Ticker overrides its own controls to a solid inverse outline for that reason.

**Closing it:** pick one ring for inverse buttons (a solid inverse outline is the one
that clears 3:1 with room), apply it to `button.css` and the Figma focused variants,
then delete `.sa-ticker .sa-ticker__control:focus-visible` from `ticker.css`.

Fixed in Figma on the same day, while documenting the Ticker: the `focus/ring` style's
shadows no longer paint behind the node (a translucent focused button rendered as a pale
box), the inverse Text and Outlined Hover / Pressed / Focused fills were rebound from
`color/transparent/<type>/8|16` to the `cmp/action/*/secondary/inverse/*` tokens code
uses, and `IconButton` Text · Inverse gained the Hover / Pressed / Focused fills it had
never had. **Still open in Figma:** the three `Size=Small, Type=Danger, State=Focused,
Tone=Inverse` Button variants carry one unbound effect instead of the `focus/ring`
style; `IconButton` Outlined · Inverse has no Hover / Pressed fill; Neutral inverse Text
binds `cmp/action/neutral/tertiary/*` rather than an inverse token.

---

## Code still hand-rolls parts the Figma masters now instance (open, 2026-09-14)

Every hand-drawn copy of a library component was replaced in the SAMAVESH Figma library
(`check:figma-hand-rolled` reads zero). Where the React component already rendered the
design-system part — Cookie Consent, Transfer List, Inline Edit's Save and Split Button use
`Button` — Figma now matches it. These components still draw their own element in code, so
Figma shows the library part and the page does not:

| Component | Part | Figma now | Code today |
|---|---|---|---|
| `FeedbackWidget` | Yes / No verdicts, Send | `Button` Neutral Outlined · Neutral Filled (selected) · Primary Filled | `<button>` in `feedback-widget.tsx` |
| `BulkActionsBar` | Select all, Clear selection | `Button` Small, Neutral Text | `.ds-bulk__link`, `.ds-bulk__clear` |
| `ChartCard` state | Try again / Clear filters | `Button` Small Neutral Outlined | `.ds-card-state__retry` |
| `TimePicker` | open-list trigger | `IconButton` Neutral Outlined, `schedule` | `.ds-timepicker__trigger` with a ◯ character |
| `DateRangePicker` | quick periods | `Chip` (32px) | `<button>` pills (28px) |
| `Chatbot` | quick replies | `Chip` | `<button>` in `chatbot.tsx` |
| `MetricCard` | delta and status pills | `Badge` Text, Subtle | `.ds-metric-card__pill` |
| `VideoTile` | state badge | `Badge` Text, Subtle | `.ds-video__badge` (bordered) |
| `AccessibilityControls` | accessibility action | `IconButton` Text Inverse (docs specimen) | `.sa-a11yc__action` |

**Closing it:** render the design-system component in each, as the Ticker's controls were
moved to `IconButton`, and re-measure the page against the master. Bulk Actions Bar's
"Return for correction" had a warning tone Figma's `Button` has no type for; it is Neutral
Outlined in the master.

**Not refreshed:** the Index card previews for Split Button, Bulk Actions Bar, Cookie
Consent, Transfer List, Inline Edit, Date Range Picker, Feedback Widget, Video Tile,
Date-Time Picker, Chatbot, Charts & Graphs and Badges are composed crops whose source
framing could not be matched; they may show the pre-swap detail (4px shorter buttons,
uppercase badges) until re-cut by hand.
