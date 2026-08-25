# Build brief — website search

**Hand this whole file to whoever builds it (person or agent). It is written to be
executable, not to be summarised.**

---

## The one-paragraph version

The masthead search field on `/website` posts to `/website/search?q=…`. That route
does not exist, so every search on the public site lands on a 404. Build the
route, an index over the site's real content, and the autocomplete the field
already looks like it has. Search is one of the two mechanisms GIGW accepts for
Multiple Ways, so this is a compliance gap, not only a usability one.

---

## What already exists — read these before writing anything

| Thing | Where | Why it matters |
|---|---|---|
| The masthead field | `packages/design-system/components/navigation/header/site-header.tsx` | Already a real `<Search>` with `onSearch(query)`. **Do not rebuild it.** |
| Its caller | `apps/hub/src/components/website/Header.tsx` | Pushes `/website/search?q=…`. Keep the contract; build the destination. |
| The `Search` atom | `packages/design-system/components/forms/search.tsx` | Has value/clear/submit. Autocomplete must extend THIS, not a new field. |
| **A working search, already shipped** | `apps/hub/src/lib/design-system/search-data.ts` + `apps/hub/src/components/design-system/search/cmd-search.*` | The design-system docs have a command-palette search with a typed `SearchEntry` and keyboard handling. **Follow this pattern.** It is the house precedent. |
| The content layer | `apps/hub/src/data/website/` | `organisations`, `divisions`, `officials`, `ngo-grants`, `columns`. Facts live here once. Index from here — never re-type content into the index. |
| The pages | `apps/hub/src/app/website/**/page.tsx` | 86 routes. |

---

## Scope

**In:** a results route, an index, ranked matching, filters, autocomplete, empty
and no-result states, analytics hooks.

**Out:** searching *inside* the 20 portals (they are authenticated and have their
own data), and PDF full-text extraction (index the document's title and metadata;
full text is a later phase and needs a real extraction pipeline).

---

## Build it in four parts

### Part 1 — the index

Create `apps/hub/src/lib/website/search-index.ts`.

Model it on `SearchEntry` in the design-system search, extended for this content:

```ts
export interface WebsiteSearchEntry {
  title: string;
  description: string;
  href: string;
  /** Free-text synonyms. This is where citizen words go — see below. */
  keywords: string;
  type: "page" | "scheme" | "organisation" | "document" | "official" | "division";
  /** Facet label shown on the result, e.g. "Schemes", "Organisations". */
  section: string;
  /** ISO date, for sorting and for the "recently updated" facet. */
  updated?: string;
  iconName: string;
}
```

Build the index by **deriving from `data/website/`**, not by hand:

- `organisations.ts` → one entry per organisation (abbreviation AND full name both
  searchable — a reader may know only one).
- `divisions.ts`, `officials.ts`, `ngo-grants.ts` → one entry each.
- The 86 `page.tsx` routes → a generated entry per route. Add a small
  `export const searchMeta = { title, description, keywords }` to each page and
  collect them in a build step, or maintain one registry file. **Pick one and
  make a gate enforce it**, or the index will silently fall behind the site — the
  same drift `data/website/index.ts` was created to end.

**Citizen words, not administrative ones.** This is the single highest-value part
of the whole feature and the easiest to skip. Nobody searches "Pre-Matric
Scholarship for OBC"; they search "scholarship for my son", "school money",
"छात्रवृत्ति". Every scheme entry needs a `keywords` string containing what people
actually type — including Hindi transliterations and common misspellings. Get
this from real queries once analytics is running (Part 4); seed it from the
chatbot's existing question list in the meantime.

### Part 2 — the results route

Create `apps/hub/src/app/website/search/page.tsx`.

- Read `?q=`, `?type=`, `?page=` from the URL. **The URL is the state** — a
  results page must be shareable and back-button-safe.
- Server component. Render results server-side so they are crawlable and so the
  page works before hydration.
- Ranking, in order: exact title match → title starts-with → title contains →
  keyword match → description match. Weight `type` so a scheme outranks a
  gallery page for the same score. Do not reach for a search library until this
  is measurably not enough — the corpus is a few hundred entries and fits in
  memory.
- Show the result count and the query, echoed back: "12 results for **scholarship**".
- Facets down the side (or in a `<Select>` on mobile): All · Schemes ·
  Organisations · Documents · People · Pages. Facet counts next to each.
- Paginate at 20. Reuse the DS `Pagination` component.

**States to build — all of them, not just the happy one:**

| State | What it shows |
|---|---|
| No query (`/website/search` with no `q`) | The field, focused, plus the most-searched links. Never an empty page. |
| Results | Count, facets, ranked list. |
| **No results** | The query echoed, spelling suggestion if any, the three nearest entries, and links to the sitemap and the chatbot. `[DBIM 9.vii]` |
| Query too short (< 2 chars) | Prompt, not an error. |
| Error | The field still usable, plus sitemap and contact links. |

### Part 3 — autocomplete

Extend the DS `Search` atom with an optional `suggestions` prop. **Do not fork it.**

- Debounce 150ms. Show at most 8. Group by `type`.
- Highlight the matched substring — `<mark>`, not a colour span.
- **ARIA combobox pattern**, and get this right because it is the part most often
  wrong: the input carries `role="combobox"`, `aria-expanded`, `aria-controls`,
  and `aria-activedescendant` pointing at the highlighted option. The list is
  `role="listbox"`, options are `role="option"` with `aria-selected`. Arrow keys
  move the highlight **without moving focus out of the input**. Escape closes the
  list and leaves the text. Enter opens the highlighted option, or submits the raw
  query when nothing is highlighted.
- Announce the count to screen readers via a polite live region: "8 suggestions
  available."
- Suggestions must never be the only route — Enter on the raw text always works.
  `[DBIM 9.viii]`

### Part 4 — measurement

- Log every query, its result count, and whether a result was clicked.
- **Zero-result queries are the product backlog.** They are literally a list of
  things citizens want that the site does not offer or does not name their way.
  Review them; most fixes are a `keywords` edit, not new content. `[DBIM 9.x]`

---

## Standards this must satisfy

Cite the clause in the PR description for each.

- `[GIGW 5.2]` — a search box or a link to a search page on **every** page, titled
  "Search", in a consistent position in the upper third. Already true of the
  masthead; keep it true.
- `[GIGW 5.2 / WCAG 2.4.5]` Multiple Ways — search **and** a sitemap. Check the
  sitemap exists and links to it from the no-results state.
- `[DBIM 9.iv]` — filter and sort by category.
- `[DBIM 9.v]` — consistent placement, sufficient length.
- `[DBIM 9.vii]` — handle empty queries; suggest on no results.
- `[DBIM 9.viii]` — autocomplete, spelling correction, synonyms.
- `[DBIM 9.iii]` — multi-language search. See the note below.
- `[WCAG 2.4.11]` — `scroll-padding-top` is already set for sticky headers; make
  sure a focused suggestion is not covered.
- `[WCAG 1.4.13]` — the suggestion list must be dismissible with Escape and stay
  visible on hover.

---

## Multi-language, honestly

`[DBIM 9.iii]` wants search in the user's language. The estate now has a Bhashini
translation runtime (`docs/integrations/bhashini.md`), and the temptation is to
translate the query and search the English index. **Do not ship that as the
answer** — round-tripping a query through machine translation loses exactly the
proper nouns that make a search work.

Phase it:

1. **Now:** index Hindi synonyms and transliterations in `keywords`, so
   "छात्रवृत्ति" and "chhatravritti" both find the scholarship page while the index
   stays English. This gets most of the value for almost no cost.
2. **Later:** when page content is translated at build time, build a per-language
   index and search the index matching `<html lang>`.

---

## Definition of done

- [ ] `/website/search?q=scholarship` returns ranked, relevant results
- [ ] `/website/search` with no query renders a useful page, not an empty one
- [ ] A no-result query offers suggestions, the sitemap and the chatbot
- [ ] Facets filter, and the URL carries the filter
- [ ] Autocomplete is operable by keyboard alone and announces its count
- [ ] Every scheme entry has citizen-language keywords, not only its official title
- [ ] Index entries derive from `data/website/`; a gate fails if a route has no entry
- [ ] `npm run verify` passes
- [ ] Screenshots of all five states in the PR

---

## The trap

The index going stale. A search that confidently returns nothing for a page that
exists is worse than no search, because the reader concludes the Department does
not do that thing. **Whatever generation strategy you pick, gate it** — a check
that fails the build when a `page.tsx` under `/website` has no index entry is
worth more than any amount of ranking cleverness.
