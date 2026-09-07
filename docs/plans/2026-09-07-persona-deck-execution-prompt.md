# Execution prompt — the Persona / Service Discovery decision deck

> **What this is.** The build specification for the PowerPoint deck that goes to the
> Secretary. It supersedes the 13-slide outline in `HANDOFF-persona-deck.md`, which was
> written before the design options were finalised in Figma. Everything a new session
> needs is here; read `HANDOFF-persona-deck.md` first for the political context, then
> build to this.

**Date:** 7 September 2026 · **Branch:** `design/persona-deck` · **Status:** approved to build

---

## 1. The one-paragraph brief

Turn the information-architecture review at
`docs/research/website-ia-persona-discoverability-2026-08.md` and the finalised design
options in Figma into a **PowerPoint deck that gets three decisions made**. The deck is
sent ahead of the meeting, so it must read without a presenter. It is a decision aid,
not a report: if a slide does not move the Secretary toward one of the three decisions,
it does not belong.

---

## 2. What changed since the handoff — read this before anything else

The handoff proposed slides 7–10 around **R2, R3 and R4** as "the three options." The
Figma frame `Service Discovery` (node `4632:158550`) finalised something different:

| Surface | Options finalised in Figma | Node |
|---|---|---|
| **Homepage** | **A** persona slider (what is live today) · **B** five-question finder · **C** one-tap persona strip | `4632:158557`, `4632:158637` + `4632:158708`, `4632:177409` |
| **Schemes page** | **A** illustrated persona cards over a card grid · **B** filter panel + comparison table | `4632:158842`, `4632:159038` |
| **Chatbot** | **A** Samajik Sahayak — the same five questions, in chat | `4632:159395` |

**This is three decisions on three surfaces, not one three-way choice.** Build the deck
to the Figma, because the Figma link is what is being shared alongside it. A deck whose
option set disagrees with the link it travels with will be read as unfinished.

The mapping back to the research is unchanged and should be stated on the slides:
Homepage B **is** R3 (the finder). Homepage C and Schemes A **are** R4 (audience
landings). Schemes B **is** R5 (the faceted catalogue). All four depend on **R1**, the
eligibility model — which is why Phase 1 is the constraint and must be named as such.

---

## 3. Decisions already taken (do not re-open)

| # | Decision | Taken |
|---|---|---|
| 1 | Deck spine is **three surfaces, three decisions** | 7 Sep 2026 |
| 2 | Production is **designed slides → native `.pptx` + PDF companion** | 7 Sep 2026 |
| 3 | Posture is **recommend, and show the alternatives honestly** | 7 Sep 2026 |

On (3): each surface gets a named recommendation with its reason, and the alternatives
stay on the slide with their real strengths and limitations. The Figma annotations
already contain both — use their wording. The neutral-menu posture is what produced no
decision the first time this went out.

---

## 4. Still unconfirmed — flag, do not block

Carry these to the owner before the deck is sent. None of them blocks the build.

1. **Who owns the deck** — Prakash Mehta raised the persona question on the 3 September
   call; ownership may be his, shared, or ours.
2. **Audience beyond the Secretary** — internal, or presented onward to the Ministry.
   Changes nothing structural; changes how blunt slide 5 can be.
3. **Whether "Scheduled Caste", "OBC" and the caste wording on the finder need Ministry
   sign-off** before this is shown outside the Department. The Figma's own annotation on
   Homepage Option B says *"Caste wording needs Ministry approval."*

---

## 5. Content rules — non-negotiable

- **No figure that is not in the source document.** Every number traces to
  `website-ia-persona-discoverability-2026-08.md`. Do not round for tidiness; `−27` is
  not "about 30".
- **Every number keeps its date.** The 141-record analysis is over a content export
  generated **13 June 2026**; live claims were re-verified **20 August 2026**. Both dates
  appear on the deck.
- **The limits slide is mandatory.** §0 states plainly that **no user research was
  conducted**, that the export is dated, and that keyword classification **over-counts**
  — so the gaps shown are, if anything, understated. Dropping this misrepresents the work
  to the Secretary. It goes near the end, not in small print.
- **Government register.** Plain, formal, factual. No product-marketing voice, no
  literary cadence, no "we". Say "the Department". See
  `.claude/rules/ui-restraint-and-copy.md`.
- **Title Case on every slide title and every column header.**
- **Nothing about the deck's own construction on any slide.** Build notes go here or in
  the summary, never on a slide.

---

## 6. Design specification

### 6.1 Canvas and grid

- **13.333in × 7.5in** (`LAYOUT_WIDE`), which is 1920×1080 at 144 dpi.
- Margin **0.72in** all sides. Content block **11.89in** wide.
- Vertical rhythm in **0.24in** steps. Gaps between blocks are **0.32in** or **0.48in**,
  never a third value.

### 6.2 Palette

Estate brand tokens, not a generic deck palette. This is a Government of India property
and the brand is the blue; the usual "don't default to blue" advice is deliberately
overridden here, and the deviation is recorded.

| Role | Hex | Where |
|---|---|---|
| Navy — dominant on dark slides | `003366` | title, dividers, decision slide |
| Gov-blue — the brand, primary accent | `0373DF` | headings, recommended marks, chart series "addressed" |
| Saffron — the single sharp accent | `F97316` | **only** the gap encoding and the "Recommended" tag. Nowhere else. |
| Ink | `1A1A1A` | body |
| Muted | `5A6472` | captions, sources, secondary |
| Hairline | `D8DEE7` | table rules, card borders |
| Surface | `F5F7FA` | light slide ground, card fills |
| White | `FFFFFF` | light slide ground |

Saffron earning exactly one job is the point. When it appears, it means *this is the
number that is wrong* or *this is the one we recommend* — nothing else.

**No tricolour band or stripe motif anywhere** (standing instruction, 13 June 2026).
**No accent stripes, no rules under titles, no edge bars on cards.**

### 6.3 Typography

**Cambria** headings, **Calibri** body. Both ship with Microsoft Office on every Ministry
machine and both render true-to-width in conversion, so the layout that is checked is the
layout that is delivered.

*Deviation recorded:* the handoff suggested Georgia headings. The two Word documents
already delivered to the Ministry are **Calibri throughout** — Georgia was never actually
shipped — and Georgia has no metric-compatible substitute in the render pipeline, so
overflow checks against it cannot be trusted. Cambria gives the same serif contrast with
neither problem. Noto Sans is the estate typeface on screen but is not installed on
Ministry machines, so it is not used here.

| Element | Face | Size | Weight |
|---|---|---|---|
| Statement line (title, section, decision slides) | Cambria | 40–54pt | bold |
| Slide title | Cambria | 30pt | bold |
| Deck-motif numeral | Cambria | 66–96pt | bold |
| Section header within a slide | Calibri | 15pt | bold |
| Body | Calibri | 13pt | regular |
| Table body | Calibri | 12pt | regular |
| Caption, source line | Calibri | 10pt | regular, muted |
| Eyebrow label | Calibri | 10pt | bold, +1.2 char spacing, uppercase |

### 6.4 The motif

**The numeral.** Every slide that carries a finding sets its key figure large in Cambria
— `141`, `5`, `0`, `−27`, `8 → 4`, `Phase 1`. Repeated on the title, the finding slides,
the journey slides and the roadmap. This replaces the usual decorative furniture, and it
is the right motif because the whole argument of the deck is arithmetic the Department
can check.

No stripes, no underlines, no gradient panels, no icon-in-circle rows used as filler.

### 6.5 The dark/light sandwich

Dark (`003366`): slides 1, 2, 7, 16. Light: everything else. The two dark slides in the
middle are the section break before the options and the decision slide — so the deck's
structure is legible from the thumbnails alone.

### 6.6 Screenshots

The seven option frames are exported from Figma at native width and placed at
**consistent width per slide family**, never stretched, never cropped mid-component.
Each sits on a `D8DEE7` hairline border on `FFFFFF`, with a 10pt muted caption naming the
surface and the option letter. Where a frame is taller than the slide allows, show the
part that carries the argument and say in the caption what has been cropped.

### 6.7 The evidence chart — the most important object in the deck

§1.3 is 13 rows × 4 columns. **Do not paste it as a table.** It becomes a horizontal bar
chart, native to PowerPoint so the Department can interrogate it:

- One row per persona, ordered by the size of the gap, largest first.
- Two series: **Schemes addressing them** (gov-blue) and **Tagged so the filter finds
  them** (saffron).
- Value labels on, gridlines quiet, legend at the top, no chart title (the slide title
  does that job).
- Scheduled Castes and Women and girls are the two the argument rests on; the slide's
  standfirst names them so the reader knows where to look.

---

## 7. Slide plan — 19 slides

| # | Slide | Ground | Carries |
|---|---|---|---|
| 1 | Title | dark | Subject, both dates, author, the file this accompanies |
| 2 | The question | dark | *Can a citizen find what they are entitled to?* |
| 3 | The headline finding | light | `141` · `32 → 5` · `23 → 0` · "The filter is not broken. The data behind it was never populated." |
| 4 | **The ask, up front** | light | The three decisions and the Phase 1 instruction, in one view |
| 5 | The evidence | light | The coverage-matrix chart (§1.3) |
| 6 | Why it happens | light | D1, D3, D4, D6, D7 — one line each, with the D-number |
| 7 | Three journeys, today | light | Meena 17 · Ramesh 42 · Lata 34, one sourced figure each |
| 8 | What is being decided | dark | The three surfaces, named. Section break. |
| 9 | Homepage — the three options | light | Comparison at a glance, recommendation marked |
| 10 | Homepage Option A | light | Persona slider screen + strengths / limitations |
| 11 | Homepage Option B — recommended | light | Finder question + results screens + strengths / limitations |
| 12 | Homepage Option C | light | One-tap strip screen + strengths / limitations |
| 13 | Schemes page — A and B | light | Both screens side by side, B recommended |
| 14 | The chatbot | light | Samajik Sahayak + strengths / limitations |
| 15 | The same three journeys, after | light | The same three people, against slide 7 |
| 16 | What this depends on | light | Phases 0–4, Phase 1 named as the constraint |
| 17 | The decisions, and who takes them | dark | Three decisions, the decider, the date |
| 18 | Limits of this review | light | §0, in full and in plain words |
| 19 | Sources | light | The five sources and the two dates |

Slide 7 and slide 15 use **the same layout and the same three names in the same order**,
so the before/after comparison is made by the reader's eye and not by a caption.

**Slide 4 is a late addition and it earns its place.** The deck is read without a
presenter and had already sat unactioned once as a document. With the ask only at slide
17, a Secretary who read four slides and stopped would never have learned what he was
being asked for. Slide 4 states it; slide 17 records it with the decider. Their titles
differ deliberately — "Three Decisions, and One Instruction" against "The Decisions, and
Who Takes Them" — because two slides with the same title in a read-alone deck is a
defect.

**Only figures the review states appear as figures.** §4.1 records step counts for
Meena alone. Rather than invent them for Ramesh and Lata, each of the three carries the
one figure the review does record for them — Meena's 8 steps, the 0 facets that describe
Ramesh, the 0 mentions of *senior* in the navigation that fail Lata.

---

## 8. Build and verification

```bash
# from the worktree
node scripts/build-persona-deck.cjs                       # writes the .pptx
python <pptx-skill>/scripts/office/validate.py <deck>     # schema, rels, charts
python <pptx-skill>/scripts/office/soffice.py --headless --convert-to pdf <deck>
pdftoppm -jpeg -r 150 <deck>.pdf slide                    # one image per slide
markitdown <deck>                                         # content check
```

**Every slide is inspected as an image before this is called done** — all 18, not slide
one. The defects that matter: text overflowing a box, elements overlapping, a screenshot
squashed, a chart label colliding with its bar, a gap that is neither 0.32in nor 0.48in.

**State plainly in the summary which slides were visually checked and which were not.**

---

## 9. Definition of done

- [ ] 19 slides, built to §7, at 13.333 × 7.5in
- [ ] Every figure traceable to the source document, with its date
- [ ] The limits slide present and unhedged
- [ ] Three decisions named on slide 16, each with a decider and a date
- [ ] Recommendation marked on each of the three surfaces, alternatives kept honest
- [ ] Coverage matrix is a native chart, not a pasted table
- [ ] Cambria / Calibri only; no Noto Sans, no Georgia, no Aptos
- [ ] Saffron used only for the gap encoding and the recommended mark
- [ ] No tricolour motif, no accent stripes, no rules under titles
- [ ] `validate.py` clean
- [ ] Every text run passes WCAG 2.2 AA against the ground it actually sits on
- [ ] All 19 slides inspected as images
- [ ] PDF companion produced from the final `.pptx`
- [ ] Unconfirmed items from §4 carried into the summary, not silently dropped

---

## NOT in scope

Design decisions considered and deliberately left out.

| Considered | Why it is out |
|---|---|
| Drawing the finder's no-match / empty state | Not in the Figma. R3 requires the finder always return something and route to DEPwD when nothing matches; inventing that screen would break the rule that every screen in the deck comes from the design file unaltered. Recorded as an open risk instead. |
| A mobile rendering of any option | The Figma frames are desktop at 1440. Showing a phone mock we do not have would misrepresent readiness. |
| The five remaining recommendations (R6–R9) | The deck asks for three surface decisions plus Phase 1. R6–R9 are consequences of those, and belong in the roadmap slide, not as separate asks. |
| A cost or resourcing slide | No costing exists in the source. A number invented for a Secretary is worse than no number. |
| The content-maintenance and page-ownership work | Answers a different question (who maintains the site). The handoff is explicit that it stays apart from this deck. |

## What already exists

| Asset | Where | Used how |
|---|---|---|
| The research | `docs/research/website-ia-persona-discoverability-2026-08.md` | Every figure and every claim |
| The finalised designs | Figma `SVMfm1KApR7KYHSbwNBnOM`, node `4632:158550` | All seven screens, cropped only where captioned |
| National Emblem | `apps/hub/public/images/National_Emblem_logo_white.svg` | Title slide, rasterised at 480px |
| Brand tokens | `packages/tokens` — gov-blue, navy, saffron, ink | The deck palette, with accessible rungs added |
| Copy register | `.claude/rules/ui-restraint-and-copy.md` | Title Case, government register, no self-narration |
| Ministry file-format precedent | the two delivered `.docx` (Calibri throughout) | Typeface decision |

## Implementation Tasks

Synthesized from this review's findings.

- [ ] **T1 (P1, human: ~10min / CC: ~2min)** — deck — Open the built `.pptx` in PowerPoint and confirm the "→" glyph on slide 3 renders in Calibri
  - Surfaced by: Pass 4 — the arrow rendered as a missing-glyph box in the local preview, whose fonts are substitutes
  - Files: `docs/plans/MoSJE-Persona-Scheme-Discovery.pptx`
  - Verify: slide 3 reads `32 → 5` and `23 → 0`, not `32 □ 5`
- [ ] **T2 (P1, human: ~15min / CC: ~3min)** — deck — Eyeball slide 5's coverage chart in PowerPoint
  - Surfaced by: Visual QA — the chart is a native PowerPoint object, so the local preview cannot draw it; 13 categories × 2 series with value labels is dense
  - Files: `docs/plans/persona-deck/build.cjs`
  - Verify: no label collides with a bar; every category name renders in full
- [ ] **T3 (P2, human: ~2h / CC: ~20min)** — figma — Draw the finder's no-match state and add it to the Service Discovery frame
  - Surfaced by: Pass 2 — R3 requires the finder always return something and route to DEPwD; the deck asserts this and cannot show it
  - Files: Figma `SVMfm1KApR7KYHSbwNBnOM`
  - Verify: the frame carries a no-match screen naming the DEPwD route
- [ ] **T4 (P2, human: ~30min / CC: ~5min)** — deck — Confirm the three open questions with the owner before sending
  - Surfaced by: §4 — ownership, onward audience, and Ministry sign-off on the caste wording are all unresolved
  - Files: `docs/plans/2026-09-07-persona-deck-execution-prompt.md`
  - Verify: each of the three has a named answer

## GSTACK REVIEW REPORT

| Run | Status | Findings |
|---|---|---|
| Scope gate + pre-review audit | complete | Handoff outline superseded by the finalised Figma option set |
| Step 0 — design completeness | complete | Initial 5/10; three decisions taken by the user |
| Pass 1 — Information Architecture | complete | 1 finding, fixed — the ask sat at slide 17 of 19 in a deck read without a presenter |
| Pass 2 — Interaction State Coverage | complete | 1 finding, open — the finder's no-match state is asserted but not drawn |
| Pass 3 — User Journey & Emotional Arc | complete | 1 finding, fixed — invented step counts for two of the three journeys |
| Pass 4 — AI Slop Risk | complete | 2 findings, fixed — missing-glyph arrow; saffron carrying two contradictory meanings |
| Pass 5 — Design System Alignment | complete | 0 findings; two deviations documented (Cambria/Calibri over Noto Sans; brand blue) |
| Pass 6 — Responsive & Accessibility | complete | 7 findings, all fixed — WCAG AA contrast failures across both grounds |
| Pass 7 — Unresolved Design Decisions | complete | 4 resolved, 4 deferred |
| Layout verification (geometry, from the built file) | complete | 6 findings, fixed — negative-width column, two off-canvas blocks, three collisions |
| Visual QA — 18 of 19 slides | complete | All clean after fixes |
| Visual QA — slide 5 (native chart) | **not done** | Local renderer unavailable; carried as T2 |

**Ratings, before → after:** Information Architecture 5→9 · Interaction States 4→6 ·
User Journey 6→9 · AI Slop 7→9 · Design System 6→9 · Accessibility 3→9 ·
**Overall 5→9.**

**VERDICT: SHIP WITH TWO CHECKS.** The deck is built, validated, and every text run is
verified against WCAG 2.2 AA on the ground it actually sits on. Eighteen of nineteen
slides were inspected as images and are clean. Two things must be eyeballed in
PowerPoint before it is sent (T1, T2), because no renderer on this machine could draw
them faithfully. Accessibility is at 9 rather than 10 only because it has not been read
with a screen reader in PowerPoint. Interaction States is at 6 and stays there: the
finder's no-match state is a real gap in the design file, and drawing it here would have
meant inventing a screen the Department has not approved.

**UNRESOLVED DECISIONS:**

- Who owns the deck — the lead, Prakash Mehta, or shared. Raised on the 3 September call and never settled.
- Whether the deck goes beyond the Secretary to the Ministry, which changes how bluntly slide 6 can be worded.
- Whether the caste wording on the finder needs Ministry sign-off before this is shown outside the Department — the Figma's own annotation says it does.
- Whether the finder's no-match state is drawn before or after the surface decision is taken.
