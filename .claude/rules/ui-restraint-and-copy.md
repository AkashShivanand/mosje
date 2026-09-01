# What goes on the screen, and how it is worded (MANDATORY)

Two rules, both estate-wide, both learned the same way: by shipping a section
that explained itself instead of working.

---

## 1. Nothing on the screen that the screen does not need

**The interface shows the citizen's information. It does not narrate its own
construction.** If a sentence exists to explain a limitation, justify a
decision, or report on the quality of a feed, it does not go in the UI.

### What this bans

| Class | Example that shipped | Where it belongs |
|---|---|---|
| **Feed diagnostics** | "19,478 of 19,971 records are drawn. 423 carry no usable coordinates and 70 are published at a point outside India; both are counted here but not placed on the map. 152 had latitude and longitude reversed and are drawn corrected." | the audit doc, the PR, this chat |
| **Absence notes** | a greyed-out card for a component that has no data, then a footnote sentence saying the same | nowhere — scope the heading to what IS shown |
| **Instructions for reading a chart** | "Each cell shades by how many villages stand within a few kilometres of it. Each dot is one hostel. Select a state on the map or in the list to open its districts." | fix the legend; a chart that needs instructions has a legend problem |
| **Restatement** | the same total printed in a card, in the standfirst, and again in a footnote | say it once, in the one place it is the answer |

**The test:** would the department print this sentence on a poster about the
scheme? If it is about the *data pipeline* rather than about the *scheme*, it
goes to the audit doc — `docs/audit/*.md` — where the people who can act on it
will look. A citizen cannot act on a coordinate-repair count.

### What this does NOT ban

- **Provenance.** A `ProvenanceChip` and, where a whole section is mirrored, one
  `dm-banner` sentence. `.claude/rules/prototype-data-modes.md` requires these,
  and a mark that only appears when something is wrong teaches people not to
  look for it. One chip is not a paragraph.
- **A real empty state.** "No documents published yet" is the citizen's answer,
  not the pipeline's excuse.
- **Statutory text.** Accessibility statements, disclaimers, the last-updated
  date.

### The standing habit

**Every element is guilty until proven necessary.** When adding something to a
screen, name the citizen's question it answers. If the honest answer is "so the
reader knows why we couldn't do X", it is a chat message or a commit body, not
a paragraph under a map.

---

## 2. Copy is written in the register of a Government of India page

This binds **every string we author** across the estate — headings, standfirsts,
labels, empty states, button text, error messages, card descriptions.

### The register

- **Plain, formal, factual.** State what the thing is and, where it matters,
  where the figure came from. "Villages declared as Adarsh Gram and hostels
  sanctioned under the scheme, at the locations recorded in the PM-AJAY
  Management Information System."
- **No product-marketing voice.** No claims, no headlines, no second person
  selling. "Where PM-AJAY works" is a campaign line; "Scheme Coverage" is a
  section.
- **No literary cadence.** "…drawn where the department records it standing" is
  a writer enjoying themselves on a departmental page.
- **No casual verbs.** "the programme folded into its Adarsh Gram component" →
  "which was merged into the Adarsh Gram component".
- **Concise and impactful.** A card gets what it does, then the one stated rule a
  reader most often needs. Everything beyond that is the component's own page,
  one click away. Two sentences is usually the ceiling.
- **Say the department, not "we".** The estate speaks about the Department, not
  as a brand.

### Sourcing

- **Prefer the department's own words.** Where the live site states it, quote it.
- **Anything we author is ours to defend.** If a sentence is not on the source
  site, it must be traceable to a published document, and the comment beside it
  says which. A figure with no source does not go on the page at all.
- **Never rewrite what the department published** to suit our layout — except
  where a standing instruction says otherwise (see Title Case below), and then
  the divergence is recorded.

### Title Case

**All titles are Title Case unless a standing instruction says otherwise.**
Section headings, card titles, navigation labels, page titles, column headers.

- "Scheme Coverage", not "Scheme coverage"
- "Documents & Downloads", not "Documents & downloads"
- "Grants-in-Aid to State/Districts", not "Grants-in-aid to State/Districts"

Small words inside a title stay lowercase — *a, an, the, and, or, but, to, of,
in, into, for, on, with* — unless first or last.

**Decided 2026-09-01:** this applies to titles taken from the department's own
pages as well as to ours. Four PM-AJAY titles now differ in capitalisation from
what `dosje.gov.in` publishes; that was an explicit instruction, and the
divergence is recorded in `docs/audit/pm-ajay-content-audit.md` §34.

---

## 3. Use the design system's heading, not your own

A section heading is `SectionTitle` — `title`, `description`, and `children` for
right-aligned actions. Its own docstring says to use it "instead of hand-rolling
a `<div className='flex justify-between'>` with its own heading classes, so
section headers stay identical estate-wide", and the reach section did exactly
that: an h2 at 26.3px/700 over a 16px lead, beside six siblings at 18.6px/600
over 12px descriptions.

**Before styling any heading, check what the neighbouring sections render.** If
they use a DS component and yours does not, that is the defect — not their size.

---

## Checklist before calling a screen done

- [ ] Every sentence answers a question the citizen actually has
- [ ] No feed diagnostics, no absence notes, no chart instructions
- [ ] Nothing said twice
- [ ] Headings and titles in Title Case
- [ ] Copy reads as a government page, not a product page
- [ ] Anything we authored is traceable to a published source
- [ ] Section heading is `SectionTitle`, not a hand-rolled one
- [ ] What was removed from the UI is written down where it can be acted on —
      the audit doc, the PR body, or the chat
