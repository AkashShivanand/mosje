---
paths:
  - "apps/hub/src/lib/**"
  - "apps/hub/src/components/**"
  - "apps/hub/src/app/**"
---

# Live, illustrative, or both — and never a figure that cannot be told apart (MANDATORY)

**This estate is a prototype whose job is to show stakeholders the finished
service, against departmental feeds that are only partly populated.** Hiding
every card the feed cannot fill defeats that purpose. Filling them with
plausible noise is worse than defeating it. This rule is the middle path, and
the whole of it exists so two failure modes are *impossible* rather than merely
unlikely:

1. **Figures that do not add up** — a total of 100 with two live parts summing
   to 70 and an illustrative third part of 50.
2. **An illustrative figure mistaken for a departmental one** — the real risk,
   which is a stakeholder screenshotting a card into a deck.

Companion to `.claude/rules/live-data-fallback.md`, which governs a single feed.
This one governs what a dashboard shows when several feeds disagree about how
populated they are.

## The three modes

Chosen by the viewer in the demo rail's **Data** tab, which appears only on
routes listed in `apps/hub/src/lib/data-mode/routes.ts`.

| Mode | Shows | For |
|---|---|---|
| **Live** | API only. Unpopulated groups render a real empty state, and cards with nothing to say are absent | Showing the department what their feed actually contains |
| **Illustrative** | The mirrored snapshot throughout | A walkthrough that must not depend on a feed being up |
| **Live + illustrative** (default) | Live where the API answers, illustrative for the gaps | Everyday demos |

**Resolve the mode on the CLIENT.** Reading the cookie during a server render
opts the whole route out of static generation — 178 organisation pages made
dynamic so three of them can carry a demo toggle. The server sends both the
reading and the snapshot; `mergeData` decides in the browser. Follow
`DataModeProvider`, which uses `useSyncExternalStore` rather than an effect.

## Coherence: the merge unit is a GROUP, never a field

Field-by-field fallback is what published `138%` — a snapshot numerator over a
live denominator, where neither number was wrong and the pairing was. So the
descriptor declares what must hold true, fields are partitioned into groups by
those invariants, and a group resolves as a whole.

```ts
invariants: [
  { kind: "sum",      total: "total_approved", parts: ["ig", "skilling", "infra", "tutoring"] },
  { kind: "subset",   part: "occupied",        of: "covered" },
  { kind: "monotone", series: ["selected", "planned", "approved", "declared"] },
]
```

Four rules, in this order — they are `merge.ts`, and they are tested:

1. **A constrained hole is SOLVED, never mocked.** A missing part of a known sum
   is `total − Σ(known)`. That is arithmetic; mocking it invents a number the
   data already determines. This is why the 100/70/50 case cannot occur.
2. **An unconstrained hole takes its whole group from the snapshot.** All-live or
   all-illustrative per group, so incoherence is structurally impossible rather
   than something checked for afterwards.
3. **Anchor and scale.** Where a group must be filled but a live figure anchors
   it, the snapshot's *shape* is scaled to that anchor and the last row absorbs
   the rounding, so the invariant still holds exactly. The shape is what the
   reader is looking at.
4. **Never mix inside one comparison.** Different provenance between cards is
   fine. Inside a single bar series it is a lie the reader cannot see.

> **"Sometimes 50 is logical"** is really *"sometimes there is no sum
> invariant"*. The descriptor is where you say which it is. Fields with no
> declared relationship are separate groups and cannot contradict each other.

## Zero: ask the GROUP, not the field

A zero is ambiguous only because these payloads carry no `null`. Resolve in this
order:

1. **Structural signal first.** `breakdowns: []` is unambiguous where `0` is not.
   Transport must preserve `null` vs `0` — never coerce both to a falsy check.
2. **Corroboration.** *If every field in a group is zero, the group is
   unpopulated. If the group's total is non-zero, a zero inside it is real.*
   That is `zero: "corroborated"`, and it does most of the work.
3. **Declare the exceptions.** `zero: "real"` where none is a genuine reading;
   `zero: "missing"` where a running scheme cannot honestly be zero.
4. **Still ambiguous → show the live zero and mark it.** Never substitute an
   illustrative figure over a possibly-real zero; that fabricates a number.

**Group by INVARIANT, not by payload object.** This is the clause that makes it
work, and the hostel feed proves it: `completed_hostels` counts buildings while
its two neighbours count people, so nothing links them, it forms a group of one,
and its zero is correctly read as unpopulated. Grouped by the object it arrived
in, it would borrow their corroboration and wrongly read as real.

All four live cases are pinned in `merge.test.ts`. Add a test there before
adding a descriptor.

## Provenance is not optional

- **Every dashboard card carries a `ProvenanceChip`, in every mode — including
  Live.** A mark that only appears when something is wrong teaches people not to
  look for it.
- **A card is judged as one thing**, so `provenanceOf` is pessimistic: one
  illustrative figure among six makes the card *Part illustrative*, never *Live*.
- **A wholly illustrative section also carries the `dm-banner`**, said once
  before the reader starts.
- **Never colour alone** (WCAG 1.4.1) — each state carries its own word.

## Illustrative data is derived, sourced and dated

- Prefer a **mirrored snapshot** of what the department actually published, with
  an `*_AS_ON` date, keyed identically to the API.
- Where no figure has ever been published, it may be **modelled — never typed at
  random** — and the derivation is stated in a comment beside it. Two live
  examples: hostels completed is `places covered ÷ 100 seats a hostel`, and the
  GIA gender split sits just above the scheme's own 15% floor for
  income-generating schemes for Scheduled Caste women.
- A modelled figure is deleted the day the feed publishes a real one.

## Checklist when adding a dashboard

- [ ] A `Descriptor` declaring every field's `zero` meaning and every invariant
- [ ] Its real feed cases added to `merge.test.ts` — including any zero
- [ ] Transport returns a raw `Reading` and the snapshot; it decides nothing
- [ ] The component merges with `mergeData(descriptor, reading, mock, mode)`
- [ ] Every card carries a `ProvenanceChip`; a wholly illustrative section carries the banner
- [ ] The route is added to `DATA_MODE_ROUTES`, or the Data tab will not appear
- [ ] Grid spans close in every mode — a card that appears in two modes and not
      the third must not leave half a row of white in the third
