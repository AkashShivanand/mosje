# Website Redesign 2026 — Build Spec (read before touching a template)

The binding reference for everyone building a page of the redesign. The plan and tracker
are in `PLAN.md`, and every issue it closes is in `issue-register-consolidated.md`.

## Where things live

| What | Path |
|---|---|
| New pages (the live `/website/*` routes) | `apps/hub/src/app/website/**` |
| Archived classic pages (do NOT edit) | `apps/hub/src/app/website-classic/**` |
| New components | `apps/hub/src/components/website-next/**` |
| Classic components (do NOT edit; the archive still uses them) | `apps/hub/src/components/website/**` |
| Shared stylesheet (owned by the lead, do not edit) | `components/website-next/website-next.css` |
| Your template's stylesheet | `components/website-next/templates/<name>.css`, imported by the template |
| Scheme model (Annual Report-sourced) | `lib/website-next/schemes.ts` |
| Content accessors (the ingested live site) | `lib/website/content` · `data/website/*` |
| Date formatting (DD MMM YYYY, IST) | `components/website-next/ui/format.ts` |

A page file stays thin: `metadata`, and a template fed by the content accessors. **Change the
template, not 30 page files.** Where a page must change (a wrong title, a missing h1), change
that page.

## The shell (already built, reuse it)

- `PageLayout` (`components/website-next/layout/PageLayout.tsx`): masthead, `<main id="content"
  tabIndex={-1}>`, `PageHeader`, children, footer. Every page renders inside it exactly once.
- `PageHeader` props: `title` (the one h1, `id="page-title"`), `breadcrumb` (trail BELOW Home),
  `description` (one sentence), `lastUpdated` (the page's stored date), `badge`, `logoSrc`,
  `featuredImage` + `level="landing"` (organisation pages), `actions` (at most one primary).
- Body rhythm: `<div className="wn-section">` (optionally `wn-section--muted`) → `<div
  className="sa-container">` → content. Side column: `wn-split` + `<aside className="wn-aside
  wn-aside--sticky">`. Running text: `wn-prose`. Side boxes: `wn-panel` + `wn-panel__title`.

## Visual rules

- **Tokens only.** `--sa-*` semantic tokens, never hex, never `--sa-ref-*`, never a px value a
  token names (spacing `--sa-{stack,inline,padding,section}-N`, radius `--sa-shape-N`, type
  `--sa-type-<role>-{size,lh}`, weight `--sa-font-weight-*`, target `--sa-target-{min,comfortable}`).
  Layout geometry that no token models (a 300px column, an 88px mark box) may be literal.
- **Type ramp.** Page h1 is the header's. Section h2: `SectionTitle` from `@mosje/design-system`
  (never hand-rolled). h3 inside sections: title-1/title-2 at semibold. Body: body-1 in prose,
  body-2 in lists and tables. Meta and dates: label-2 or body-3 in `--sa-text-neutral-subtle`.
  Nothing below 12px. No uppercase except label-3. No italics for whole statements.
- **Colour.** Text `--sa-text-neutral-{bolder,base,subtle}`. Links `--sa-text-link-brand-default`
  / `-hover`, **underlined inside running text**. Fills: brand subtler tints for emphasis, the
  navy `--sa-bg-brand-primary-boldest` is reserved for the home hero and the footer. Saffron is
  a fill, never text. Status colours only for status.
- **Shape.** Cards and panels radius 12, large media 16–24, pills full. Borders
  `--sa-stroke-1 solid --sa-border-neutral-subtle`. Shadow only on hover or on a raised layer
  (`--sa-elevation-card`). No gradients, no left accent stripes, no nested cards.
- **Icons.** `<Icon name size>` from the DS (Material Symbols Rounded 300). `Icon` sets `display`
  inline, so put layout classes on a wrapping `<span>`, not on the Icon. Decorative icons
  `aria-hidden`. Icon-only controls carry `aria-label`.
- **Buttons.** DS `Button`, or `buttonClasses(variant, appearance, size)` on a `next/link`. At most
  one primary per section. Pills (the DS default).
- **Motion.** Hover transitions on colour/border only, using `--sa-motion-hover-*`. No entrance
  animations, no autoplay, nothing that moves by itself.

## Behaviour rules (each closes register issues)

- One h1 per page; headings in order h1 → h2 → h3 (ACC-03). Every section has an id.
- Every card is ONE link: the title is the `<a>`, and a `::after` stretches its hit area over the
  card (LAY-07). One Tab stop, one accessible name.
- Link text says where it goes. Never "Click here", "View", "Read More" alone (ACC-27). For
  documents: "View Document", with the file type and size in the accessible name where known:
  `Download Annual Report 2025-26 (PDF, 4 MB)`. Unknown size: omit it. Never print "NA" (CON-07):
  hide a field that is empty for every row, show "–" where one row lacks it.
- Action words, one list (CON-21): View Details (content page) · View Document (PDF) · View All
  (listing) · Apply Now · Track Application.
- External links: `target="_blank" rel="noopener noreferrer"`, an `open_in_new` icon and
  sr-only "(opens in a new window)" (ACC-17).
- Dates: `formatDate()` → `14 Sep 2026`, wrapped in `<time dateTime={isoDate()}>`. Newest first.
- Record titles: tidy trailing punctuation and runs of spaces; never rewrite the words.
- Tables: real `<table>`, `<caption>`, `scope="col"`, numeric columns right-aligned with tabular
  numerals, wrapped in a labelled scroll region (`role="region" aria-label tabIndex={0}`) so a
  wide table scrolls on a phone instead of the page (MOB-03, ACC-16). Rows stack on phones where
  a table has 3 or fewer columns.
- Long lists are **paged** (DS `Pagination`, page in the URL `?page=2`), never scrolled inside a
  box, never "show all" (NAV-13).
- Filters: only filters that apply to that list; a filter with one option is hidden (NAV-15).
  Filter state lives in the URL. Result count in a `role="status"` element. "Filtered to
  nothing" says which filter and offers "Clear filters", worded differently from "nothing
  published yet" (ACC-21, LAY-03).
- Every state designed: loading (skeleton in the result's shape, `role="status"`), empty, error
  with retry, filtered-to-nothing, too-much (paged). See `.claude/rules/data-state-completeness.md`.
- Images: `next/image` with width/height; meaningful alt (a person: name and designation); a
  missing image is a designed fallback (neutral tile with the organisation mark or an icon), never
  a "No Image" box (BRD-19). Logos whole, `object-fit: contain`, in a fixed box on one ground.
- Touch targets ≥ 24px everywhere, 44px (`--sa-target-comfortable`) on primary controls and list rows.
- Reflow at 320px with no horizontal page scroll. Check 375 and 1440.
- `linkAs={Link}` on every DS component that takes it (`check:link-as`).

## Copy rules

Government register: plain, formal, factual, Title Case for every title/heading/label/column
header/button. The Department's own words wherever they exist. **Never invent a fact, a
figure, a name, a phone number, an address or a date.** If content is missing, leave the
element out and record the gap in your report. No em-dash flourishes in UI copy, no marketing
voice, no "we". Do not narrate the page ("Use the filters below to…").

## Accessibility floor (WCAG 2.2 AA)

Landmarks; skip link lands on `#content` (the layout does this); visible focus on everything
(the DS focus ring); `aria-expanded` on disclosure buttons; tabs as a real tablist (DS `Tabs`);
form fields with `<label>`, errors inline and summarised; `lang="hi"` on Hindi text; contrast AA
(text 4.5:1, large and UI 3:1); nothing covered by the sticky masthead on focus (2.4.11).

## Definition of done for a template

1. Typecheck clean: `cd apps/hub && npx tsc --noEmit -p .`
2. Screenshot each page type at 1440 and 375 with
   `node tools/website-redesign/shoot.mjs <outDir> /website/<path> …` (the dev server runs on
   :3007) and LOOK at them: zoom into every element, check clipping, alignment, empty boxes,
   leftover classic styling.
3. Keyboard pass in the browser: Tab through, check focus order and visibility.
4. No classic component imported from `components/website/**` unless it is a pure data or
   utility module (search hooks, content accessors). A classic VISUAL component in a new page
   is a defect.
5. Report: what you built, what each page now looks like, what content gaps you found (with the
   page), and anything you could not do.
