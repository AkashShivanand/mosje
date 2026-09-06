# Execution prompt — SAMAVESH to v1.0 "complete"

*Written 2026-09-06 from `docs/audit/design-system-completeness-2026-09-06.md`. This is the
instruction the work is executed against; it is deliberately narrow, because the failure
mode of a task this size is breadth without finish.*

---

## Role

You are the maintainer of a Government of India design system that is already green on
forty gates and 100% conformant on its own documentation shape. You are not rescuing a
broken system. You are closing a coverage gap and an adoption gap, and you are doing it
without loosening a single existing gate.

## Target (the definition of done, stated once)

**SAMAVESH v1.0 is reached when all five hold:**

1. `npm run ux4g:measure` reports **≥ 90%** UX4G 3.0 component coverage from an **honestly
   re-reviewed** map — every row re-checked against the barrel, not renamed to pass.
2. Every pattern named in audit §4 either **ships from the barrel** or is **recorded on a
   component record with the reason it does not**.
3. `npm run check:shadow-ui` baseline is **strictly smaller** than 38 collisions.
4. `npm run check` exits 0, and `npm run ci` exits 0, with **no baseline loosened** — a
   baseline may shrink, never grow.
5. Every component added carries the full nine-part contract below. A component that
   carries eight of nine is not done and is not counted.

## The nine-part contract — every new component, no exceptions

A component is delivered when all nine exist. Build them in this order; the order is what
stops the last three from being skipped.

1. **Component** in `packages/design-system/components/<group>/<name>.tsx` — named export,
   TypeScript strict, no `any`, slot-based composition over prop explosion
   (`.claude/rules/design-system-architecture.md` §1).
2. **Stylesheet** beside it, opening with `@layer theme, base, components, utilities;` then
   `@layer components { … }` — both lines, per §2a of that rule. **Zero raw values**: every
   colour, space, radius, type size, weight and z-index binds a `--sa-*` Tier-2 token.
   Never a `--sa-ref-*`.
3. **Barrel export** from `packages/design-system/index.ts`, component and props type.
4. **Storybook story** in `apps/storybook`, covering every state the component claims.
5. **Documentation page** at `apps/hub/src/app/design-system/components/<group>/<name>/`
   rendered by `<ComponentDocPage />`, with `propsFrom` pointing at the generated table —
   never a hand-written props array except for what the extractor cannot see.
6. **Accessibility evidence** — `A11yChecklist` rows default to `untested`; a row becomes
   `verified` only when the `evidence` field names how it was checked. Do not tick a row
   because the component looks right.
7. **Figma master** — a component set on its own numbered section, variants for structure
   and properties for options, every fill/space/radius/text bound to a published variable
   or style, a rules-bearing description.
8. **Figma documentation frame + component record** — 1680 wide, hero with six counted
   stats, numbered sections, the arrangements section last
   (`.claude/rules/ds-documentation-standard.md` §1).
9. **Code Connect template** `*.figma.ts` beside the component, and a changelog entry.

## Invariants — violate none of these to make progress

- **Quality first, then DBIM, then GIGW 3.0, then UX4G.** Where a standard specifies a set,
  ADD what is missing; never DELETE what quality needs. Accessibility is never traded.
- **WCAG 2.2 AA is a floor.** Keyboard model, visible focus, contrast, and a live-region
  announcement wherever state changes without a page load.
- **Every data-driven surface designs all seven states** — loading, empty, error, partial,
  filtered-to-nothing, too much, populated — and resolves its reading from ONE expression
  (`.claude/rules/data-state-completeness.md`).
- **Copy is a Government of India page.** Title Case titles, plain formal register, no
  product-marketing voice, `SectionTitle` for every section heading.
- **The interface never narrates its own construction.** Diagnostics go to
  `docs/audit/*.md`, not under a chart.
- **A floating element goes on one of exactly two rails** and declares
  `data-sa-corner-occupant` / `data-sa-wall-occupant`
  (`.claude/rules/floating-element-placement.md`).
- **Never `git add -A`.** Stage explicit paths; this tree is shared with other sessions.
- **No AI co-author trailer** on any commit or PR.

## Order of work — waves, each landing green

**Wave 1 — Truth.** Re-review `tools/ux4g-conformance/component-map.json` row by row
against the barrel. Fix the nine stale rows. Re-run `npm run ux4g:report`. Nothing is built
in this wave; the point is that the next wave aims at real gaps.

**Wave 2 — The primitives with the widest reuse.** In this order, because each later one
composes the earlier: `Popover` → `Menu` (+ `MenuItem`, and `SplitButton` once both exist)
→ `NumberInput` → `Slider` → `RangeSlider` → `TimePicker` → `DateRangePicker` →
`DescriptionList` → `ListGroup` → `BackToTop`.

`Popover` first is not arbitrary: `Menu`, `TimePicker`, `DateRangePicker` and every row-action
surface are anchored overlays, and building them on one focus-managed, dismissal-correct
primitive is the difference between one keyboard model and six.

**Wave 3 — The officer-workflow patterns.** `BulkActionsBar`, `FileList`, `ResultListRow`,
`ActivityLog`, `CommentThread`, `NotificationCentre`, `InlineEdit`, `Tree`, `TransferList`,
`ScheduleGrid` / `TimeSlot`.

**Wave 4 — Statutory and citizen-facing.** `CookieConsent`, `LanguageSwitcher`,
`FeedbackWidget`, `Carousel`, `Figure`, `DraftStatusBanner`, `SignaturePad`,
`BiometricCapture`, `VideoTile`.

**Wave 5 — Adoption.** Delete the 38 shadow-UI collisions, file by file, shrinking the
baseline each time. Portal-specific `ui.tsx` files disappear; portal pages import the barrel.

**Wave 6 — Distribution.** Decide and record the `private: true` question. Publish the
Figma library index refresh, re-baseline every gate deliberately, and write the release.

## Stop conditions — when to stop and say so rather than press on

- A component would need a raw value no token expresses → **add the token first**, with a
  consumer, or stop and record it.
- A Figma master cannot be bound because it is `remote: true` → do not fight it; wrap it,
  and record the constraint on the component record.
- A gate would have to be loosened to pass → **stop**. A loosened gate is a regression
  wearing a green tick.
- A wave cannot land green within its own commit → land the part that is green, and record
  the remainder as an open item on the component record, not as a silent omission.

## Verification, every wave, before the commit

```
npm run check          # forty gates
npm run lint:css       # no raw colours
npm run build:props    # regenerate, then check:props must be clean
npm run check:shadow-ui
```

Then **see it in a browser** at three widths (390, 768, 1440) and in both brand modes
(`blue`, `navy`) before calling any visual change done. A screenshot of the whole page hides
a clipped label; zoom to the component.

## What "done" is not

Not "the gates pass" — they passed before this work started. Not "the component exists" —
a component with no Figma master is half a component, and a Figma master with no
documentation frame is half a master. Done is the nine-part contract, nine times out of
nine, on every component this work adds.
