---
paths:
  - "apps/hub/src/app/design-system/foundations/**"
  - "apps/hub/src/components/design-system/docs-kit/foundation-*"
  - "packages/tokens/build/generate-foundation-docs-data.mjs"
  - "tools/foundation-page-standard/**"
---

# One shape for every foundation page (MANDATORY)

**A foundation page is `<FoundationDocPage />`, its tables are generated, and its
section titles are claims.** This is the foundations half of
`ds-documentation-standard.md`, and it exists because the census on 2026-09-04
found what an ungated house style is worth after three months:

| Surface | Found |
|---|---|
| Page shells in use across 11 foundation pages | **5** |
| Pages with a maturity badge, tabs or a feedback bar | **0 of 11** |
| Pages hand-typing the values they documented | 2 — Elevation printed three of six roles with an ink retired a month earlier and called `card` a pressed state; Motion hard-coded its own durations under a table of the tokens for them |
| Heading grammar | "Tokens" landed 3rd, 4th or 6th; half the titles were folder nouns |
| Foundations with no page at all | 8 — breakpoints, layering, opacity, stroke, sizing, states, brand, content & localisation |
| Gates looking at any of this | none — every documentation gate was scoped to `components/` |

Colour and typography were the exceptions, and they were exceptions for one reason:
their data was **generated**.

## 1. The template, and what it guarantees

`apps/hub/src/components/design-system/docs-kit/foundation-doc-page.tsx`. What a
reader meets, in order, by construction:

1. **eyebrow · name · maturity badge** — what am I looking at, can I rely on it
2. **summary** — one paragraph, government register
3. **Figma link, or a declared absence** — `figma={{ node }}` or
   `figma={{ absent: "…" }}` with a sentence a reader can act on. Layering is
   code-only because a canvas has no z-axis; say so, do not omit the row
4. **at a glance** — three to six **counted** numbers from the generated data,
   never a round-sounding estimate
5. **Overview / Tokens / Accessibility** tabs — numbered `NN / KEYWORD` sections
   with claim titles; the generated token table; the criteria and the standards
   register
6. **related foundations** — the way out
7. **feedback bar**

The eyebrow grammar (`01 / INTENTS`) is the Figma documentation grammar
(`figma-documentation-style.md` §4), so the two surfaces read as one document.

## 2. Every number comes from the build

`packages/tokens/build/generate-foundation-docs-data.mjs` writes
`apps/hub/src/lib/design-system/foundations-data.generated.ts` on every token
build: for each family (spacing · sizing · shape · stroke · elevation · layering ·
opacity · motion · breakpoints · density · states · layout) every token's path,
tier, CSS name, **resolved value from `tokens.css`**, raw source value, Figma
collection and name (or the recorded reason it is code-only), and the description
— the source `$description` or the sentence `usage-guidance.mjs` derives, which is
the same one Figma shows.

A page renders `FOUNDATIONS.<family>.tokens`. It never types a value. A specimen
that needs a number reads it from a row (`style={{ width: r.value }}` is the one
inline style allowed, because it is data). `npm run check:docs-data` regenerates
the file and fails when it is stale.

## 3. Titles are claims, keywords are one word

"Twelve Intents, and You Never Pick a Duration" — not "Tokens". "Reduced Motion Is
Handled Once, at the Token Layer" — not "Reduced motion". A reader scanning the
table of contents should be able to disagree with a title; nobody can disagree with
"Guidance". Title Case, per `ui-restraint-and-copy.md`. The keyword is the
section's subject in one uppercase word: `LADDER`, `INTENTS`, `PREFERENCE`.

## 4. Nothing on the page takes an inline style

Every visual rule lives in a page-scoped `.css` beside `page.tsx`, opening
`@layer theme, base, components, utilities;` then `@layer components { … }`, bound
to `--sa-*` only — borders `var(--sa-stroke-1) solid …`, transitions the
`--sa-motion-<intent>-*` pair, never `--sa-ref-*`. The page that documents a
foundation is the last place a literal may appear. A "don't" specimen that must
show the literal it warns against marks its line `ds-exempt(specimen)`.

## 5. Accessibility rows are earned, and the standards register is a table

`a11y` rows default to `untested`; `verified` needs `evidence` naming a test, an
audit date or a measurement. `standards` rows cite the clause (DBIM 3.0 §4 iii,
UX4G 3.0 "Grid and layout"), what it says, what SAMAVESH does, and why quality
wins — the same rows `docs/audit/*-deviation-register.md` carries, because a
deviation recorded in one place and not the other is a deviation nobody will find.
An empty register renders the sentence that says so.

## 6. The gate has no baseline

`npm run check:foundations` (`tools/foundation-page-standard/check.mjs`) fails any
page under `foundations/` that does not render `<FoundationDocPage` with `name`,
`status`, `summary`, `figma`, `glance`, `sections`, `tokens` and `a11y` — matched
on the JSX attribute, never the import — or that carries a millisecond, hex or
hand-typed inline-style literal. Every page was converted in one change, so the
only permitted state is 19/19. It runs inside `npm run check`.

## 7. The nav is in dependency order, not alphabetical

`apps/hub/src/lib/design-system/nav.ts` lists Foundations in the order a reader
must learn them: Accessibility · Brand · Color · Typography · Iconography ·
Illustration · Layout Grid · Breakpoints · Spacing · Sizing · Shape · Stroke ·
Elevation · Layering · Opacity · Motion · Interaction States · Density · Content
& Localisation. `llms.txt` and the search index derive from it. Add a foundation
where it belongs in that order, with a badge, and give it a page on the template
in the same change.
