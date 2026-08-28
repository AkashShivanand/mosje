---
paths:
  - "apps/hub/src/lib/**"
  - "apps/hub/src/app/**"
  - "apps/hub/src/components/**"
---

# Live first, mirrored snapshot second — never an empty state (MANDATORY)

**Every figure this estate publishes comes from the live API where the live API
answers, and from a committed snapshot of the same figure where it does not.
A number the reader could have been shown is never replaced by "Not yet
reported", a dash, a zero, or an empty card.**

This is a rule about what a citizen sees on a government page. A page that says
*"Not yet reported"* about a figure that is published on the department's own MIS
is not being careful — it is being wrong in a way that looks careful.

## The three states, and what each renders

| State | What happened | What renders |
|---|---|---|
| **Live** | The feed answered with a usable value | The live value |
| **Mirrored** | The feed was unreachable, timed out, errored, or returned a placeholder | The snapshot value, and the page says which date it is as on |
| **Genuinely absent** | Neither source has ever carried this figure | The figure is **not on the page at all** |

The third row is the one people get wrong. **An unpublished metric is a
DESIGN decision, not a runtime state.** If a number does not exist, do not build
a card for it and then apologise inside the card — leave it out, and put it back
when the source starts publishing it.

## What counts as "the feed answered"

A 200 is not an answer. Check the value, not the status code.

- `null`, `undefined`, `NaN`, `""` — not an answer.
- **`0` is not an answer either, unless zero is a real reading.** A development
  or staging feed returns `0` for a column it has not populated, which is
  indistinguishable from "nothing has been done" — and a 0% bar on a government
  dashboard says the second one. Where a metric cannot legitimately be zero,
  treat `0` as absent and keep the snapshot. Where it can, say so in a comment
  at the check, because the next reader will assume it is a bug.

## Merge per FIELD, but never split a PAIR

Fields are merged one at a time, so a feed that answers eight of eighteen
counters still contributes its eight.

**A ratio's numerator and denominator must come from the same source.** This is
not a nicety — it produced a published `138%` on the Adarsh Gram dashboard, from
a snapshot numerator over a live denominator. Neither number was wrong; the
pairing was. Where two fields only mean something together, take both live or
neither:

```ts
for (const [num, den] of PAIRS) {
  const bothLive = fromFeed.includes(num) && fromFeed.includes(den);
  if (!bothLive) { merged[num] = FALLBACK[num]; merged[den] = FALLBACK[den]; }
}
```

The same reasoning covers any figure derived from more than one field — a share,
a rate, a per-capita, a "x of y" caption.

## Say which one the reader is looking at

The merge function returns `{ data, live }`, and the page **states the answer**:
live figures name the system they came from, mirrored figures name the date they
are as on. Never print a "last updated" that means neither.

Where a page mixes both — some counters live, some mirrored — say that in one
line beside the figures it applies to, not in a footnote at the bottom of the
page where it will go stale unread.

## The snapshot is real data, committed, and keyed identically

- It is a **mirror of what the source published**, taken on a stated date. It is
  never invented, rounded for tidiness, or extrapolated.
- Its keys **match the API's keys exactly**, so merging is a field-by-field
  overlay with no translation layer to get wrong.
- It lives in `src/lib/**` beside the client that uses it, is committed, and
  carries the as-on date in a `*_AS_ON` export.

## Fetching

- Fetch on the **server**, in the page or a route handler — never from the
  browser. A citizen's connection is not the department's.
- Give it a **short timeout** and cache the result (`next: { revalidate }`). A
  slow feed must degrade to the snapshot, not to a slow page.
- **Never throw.** A fetch failure is a normal, expected state with a defined
  rendering. It is not an error boundary.
- Put the endpoint behind an env var (`NEXT_PUBLIC_*_API`) so dev, staging and
  production point at their own hosts without a code change.

## Checklist

- [ ] Server-side fetch, short timeout, revalidate set, never throws
- [ ] Per-field merge — a partial answer still contributes what it has
- [ ] Falsy AND placeholder values rejected; the `0` decision is stated in a comment
- [ ] Ratio and derived pairs taken from one source or the other, never mixed
- [ ] `{ data, live }` returned, and the page tells the reader which it is showing
- [ ] Snapshot committed, keyed like the API, with an as-on date
- [ ] No "Not yet reported" anywhere a snapshot value exists
- [ ] A metric neither source publishes is absent from the design, not present and empty
