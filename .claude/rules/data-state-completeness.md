# Every state a data-driven surface can be in must be designed (MANDATORY)

**Scope: anything on this estate whose content comes from somewhere other than
the source file it is rendered in.** Charts, maps, tables, lists, counters,
dashboards, search results, document catalogues, anything fetched, anything
paginated, anything filtered. If the component would render differently on a day
the feed is empty, this rule binds it.

It exists because a section shipped that showed **`Adarsh Gram villages 0 ·
Hostels 0` in its key, above a map drawing 19,768 villages and a list of 28
states.** Both halves were reading the same request. One had a defined answer for
"the feed said nothing" and the other quietly reached for the mirror instead. A
citizen had two contradictory figures on a government page and no way to tell
which was true.

---

## 1. The seven states, and the four that get skipped

| State | What it means | What gets shipped without this rule |
|---|---|---|
| **Loading** | asked, no answer yet | a blank panel that reads as "none" |
| **Empty** | answered, nothing to show | a blank panel that reads as "broken" |
| **Error** | the request failed | a blank panel, or a thrown boundary |
| **Partial** | some fields answered | ✅ usually handled |
| **Filtered to nothing** | data exists, the reader's own filter excluded it | a blank panel that reads as "no data" |
| **Too much** | more rows than the surface can hold | a page that grows to 4,000px |
| **Populated** | the happy path | ✅ always handled |

**Empty, error, filtered-to-nothing and loading are the four that get skipped**,
and the first three of them render identically if nobody designs them — which is
the whole problem. A reader cannot act on a blank panel, and each of those four
calls for a different action.

**"Filtered to nothing" is not "empty".** *"No village named 'Bankura' is in the
register"* and *"the feed published nothing"* are different sentences with
different remedies, and a component that renders one for both is lying about one
of them.

---

## 2. One request, one answer — the rule the defect broke

**Every part of a surface that depends on a reading must resolve that reading the
same way.** Not "similarly". The same expression, computed once.

```tsx
// WRONG — and this is the exact defect. The totals honour live-only; the
// geography silently falls back, so the two disagree on screen.
const merged   = mergeData(descriptor, reading, mock, mode);   // live-only → 0
const snapshot = reading ?? mock;                              // → the mirror

// RIGHT — one decision, and everything downstream reads it.
const snapshot: Reach | null =
  prov === "mock" ? mock : (reading ?? (mode === "live" ? null : mock));
const hasReading = snapshot != null;
```

If a heading, a key, a chart and a table are four views of one request, a reader
must never be able to see two of them saying different things. **Derive them all
from one resolved value, and branch the render once.**

---

## 3. Hooks cannot be conditional, so branch the RENDER, not the derivation

The usual reason this rule gets broken is that an early return would sit above a
`useMemo`. It does not have to.

```tsx
const hasReading = reading != null;
const data = reading ?? EMPTY;      // a real, all-zero value — never rendered as data
// …every useMemo below runs unconditionally against EMPTY and resolves to nothing…
return hasReading ? <TheThing … /> : <ItsEmptyState />;
```

`EMPTY` is declared beside the component with a comment saying it is a shape, not
a fallback. Do not reach for `?? mockData` here — that is the defect.

---

## 4. What each state owes the reader

- **Loading.** A skeleton in the shape of the result, not a spinner in a void,
  and never a layout that jumps when the data lands. Carry `role="status"` so a
  screen reader is told the wait is deliberate. If the wait can exceed a second
  on a rural connection, say what is being fetched: *"Looking through the village
  register…"*.
- **Empty.** The citizen's answer to the question they asked, in the department's
  register. Then, where one exists, **the reason** — but only when the reason
  changes what the reader should do. *"Village names are not published for West
  Bengal, Bihar and Delhi, so a village in those states cannot be found by name
  here"* stops a reader from Bankura concluding their village is outside a scheme
  that in fact holds more of its villages than any other state's. That sentence
  earns its place. *"423 records carry no usable coordinates"* does not — see
  `ui-restraint-and-copy.md`.
- **Error.** Say it failed, in one sentence, and **offer the retry**. Never print
  a status code, an endpoint or a stack trace on a citizen's page; those belong in
  `docs/audit/*.md`. Never let a fetch failure reach an error boundary — a feed
  being down is an expected state with a defined rendering, not an exception.
- **Filtered to nothing.** Name the filter and how to clear it. The reader caused
  this state and can undo it.
- **Too much.** Page it. **Never scroll a region inside a card** — on a phone a
  reader flicking the page down lands in the list and moves the list instead. A
  fixed page size keeps the surface the same height whatever is in it, which also
  removes the "show all" button whose only job was to double the page length.

---

## 5. Fetching on the client — the four that are always wrong

Client fetches are rare here (prefer the server, per `live-data-fallback.md`), but
when a payload is too heavy to bundle they are correct. Then:

1. **Never fetch on mount for something most readers will not use.** Gate it on
   the intent — PM-AJAY's 83 KB village index loads on the *second character*
   typed, so a reader who clicks the field and changes their mind downloads
   nothing.
2. **Always `AbortController`, always cleaned up.** An unmounted component that
   sets state is a warning today and a leak in a list.
3. **Cache the success, never the failure.** A failed fetch is usually a dropped
   connection; a reader who presses "Try again" deserves a real second attempt,
   not the memory of the first one.
4. **Distinguish `idle` from `empty`.** "Not asked yet" and "asked, nothing
   there" are different states, and rendering them the same way is what makes a
   search field look broken before it has been used.

---

## 6. Weight is a state too

A payload that has to reach the browser is a design decision, not an
implementation detail. **Measure it before you bundle it.**

PM-AJAY's village index took the page's mirrored data from **21 KB gzipped to
106 KB** — a fivefold rise, on every visit, for a lookup most readers never run.
Moved to a fetched public asset, the page pays nothing until the feature is used.

If a dataset is large, the choice is: leave it out, page it from the server, or
fetch it on intent. Bundling it and hoping is not one of the three.

---

## 7. Checklist before calling a data-driven surface done

- [ ] Every part of the surface resolves the reading from **one** expression
- [ ] Loading state designed, in the shape of the result, `role="status"`
- [ ] Empty state written as the citizen's answer, with a reason only where the
      reason changes what they should do
- [ ] Error state says it failed and offers a retry; no codes, no endpoints
- [ ] Filtered-to-nothing is worded differently from empty, and names the filter
- [ ] Long results are paged, not scrolled inside a card
- [ ] A client fetch is gated on intent, aborted on unmount, caches only success
- [ ] `idle` renders differently from `empty`
- [ ] The payload's gzipped weight was measured, and stated in a comment if it
      drove the design
- [ ] Each state was **seen in a browser**, not just written — force the feed to
      fail, force the filter to match nothing, throttle the connection
