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

- **13.333in × 7.5in** (1920×1080 at 144 dpi). Margin **0.72in**; content block **11.89in**.

### 6.2 Palette — resolved SAMAVESH tokens, not approximations

Every colour is a value read out of `packages/tokens/dist/tokens.css`. The design system
already carried an accessible answer for the one case where the brand value fails; using
it is the point.

| Token | Hex | Used for | Measured |
|---|---|---|---|
| `--sa-color-primaryScale-800` | `003975` | the dark ground | white on it, 11.40:1 |
| `--sa-color-primaryScale-700` | `004B96` | panels on the dark ground | — |
| `--sa-color-primaryScale-600` | `005EB9` | blue **text**, the RECOMMENDED chip | 6.36:1 on white |
| `--sa-color-primaryScale-500` | `0373DF` | the brand — borders, chart series 1 | 4.64:1 |
| `--sa-color-primaryScale-200` | `92C2FF` | numerals and labels on dark | 6.18:1 |
| `--sa-color-primaryScale-100` | `C0DBFF` | body on dark | 8.04:1 |
| `--sa-color-primaryScale-50` | `ECF4FF` | the recommended card's ground | — |
| `--sa-color-brand-saffronDark` | `A43A00` | the failure colour — limitations, the deficit figure | 6.60:1 on white |
| `--sa-chart-cat-1` / `-2` | `0373DF` / `E7173A` | the two chart series | 4.64:1 / 4.58:1 |
| `--sa-color-text-default` | `1E2124` | body | 16.18:1 |
| `--sa-color-text-muted` | `3A3D41` | standfirsts | 10.92:1 |
| `--sa-ref-color-neutral-600` | `54585E` | eyebrows, captions, source lines | 7.16:1 white · 6.27:1 on surface |
| `--sa-ref-color-neutral-50` / `-100` | `EEF0F3` / `DCDEE1` | card grounds / hairlines | — |

**Two colours the deck does NOT use, deliberately.** The brand saffron `FF671F` is
2.91:1 on white — below the floor for text *and* for graphics — so it appears nowhere;
`saffronDark` carries every saffron job. `neutral-500` (`6F757D`) clears AA on white at
4.65:1 but drops to **4.07:1** on the tinted card grounds, so `neutral-600` is used
throughout instead.

**Meaning is one-to-one.** Blue means *this is the recommendation*; saffronDark means
*this is the problem*. No colour carries both jobs.

**No tricolour band or stripe motif** (standing instruction, 13 June 2026). No accent
stripes, no rules under titles, no edge bars on cards.

### 6.3 Typography

**Noto Sans throughout** — the estate typeface, per `CLAUDE.md`. One family; hierarchy
comes from weight and size, not from a second face.

| Element | Size | Weight |
|---|---|---|
| Title-slide statement | 42pt | bold |
| Dark-slide statement | 32pt | bold |
| Slide title | 28pt | bold |
| Deck numeral | 30–58pt | bold |
| Standfirst | 12.5pt | regular |
| Body / trade-offs | 10.5–11.5pt | regular, labels bold |
| Eyebrow, caption, source | 9–10pt | bold / regular |

*Risk, stated once:* Noto Sans is the estate typeface but may not be installed on
Ministry machines, which would substitute at open. The fix is a PDF alongside the
`.pptx` (PowerPoint: File → Export → PDF), or installing Noto Sans on the machine that
presents.

### 6.4 Restraint

Eight slides for three decisions. Each option gets its screen, its one-line strengths and
its one-line limitations, and nothing else. There is no journey slide, no diagnosis slide
and no separate evidence slide — the evidence sits beside the finding it proves.

## 7. Slide plan — 12 slides, one page per option

| # | Slide | Ground | Carries |
|---|---|---|---|
| 1 | Title | dark | Subject, both dates, `141`, the design file it accompanies |
| 2 | Why a citizen cannot find a scheme today | light | The coverage chart, the two readings, the plain verdict |
| 3 | Three decisions, six options | dark | The map: which options belong to which part of the site |
| 4 | Home page · Option A — Explore User Personas | light | Full option record |
| 5 | Home page · Option B — Find Schemes for You | light | Full option record |
| 6 | Home page · Option C — Find Offerings for You | light | Full option record |
| 7 | Schemes page · Option A — pictures with cards | light | Full option record |
| 8 | Schemes page · Option B — filter panel and table | light | Full option record |
| 9 | Chatbot · Option A — Samajik Sahayak | light | Full option record |
| 10 | What has to be done first | light | Stages 0–4, Stage 1 named as the one that gates the rest |
| 11 | Decisions required | dark | Three decisions, what is suggested, who decides |
| 12 | What this review does not establish | light | The stated limits, then what was examined |

### The option record — the same seven parts on every option page

A decision can be taken from one page without holding a second page in mind. Every option
slide carries, in the same place every time:

1. **A heading that locates it** — "Decision 1 of 3 · The Home Page · Option A of 3"
2. **Status** — *On the site today* or *To be built*, and *Recommended* where it applies
3. **The screen**, 6.6in wide, with a caption saying what is shown and what was cropped
4. **What it is** — one plain sentence
5. **What a citizen does** — the person's own actions, not the system's
6. **Advantages** and **Limitations** — taken from the Figma annotations, in plain words
7. **What the Department must do first** — the dependency, stated honestly
8. **Our view** — a fixed box on the same line on every page, so the six can be scanned

The verdict box sits at a **fixed y of 6.22in** and the generator **throws** if an option's
record would push past it. A silent overflow is how an option loses its recommendation on
the page that decides it.

### Register

Plain government English, written for a reader who is not a designer. "What a citizen
does", not "user journey". "What the Department must do first", not "implementation
dependencies". "Filling in the information", not "populating the data model". Stage, not
Phase. No product-marketing voice and no clever headlines: the slide about the filter is
called *Why a Citizen Cannot Find a Scheme Today*, not something more artful.

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

- [ ] 12 slides, built to §7, at 13.333 × 7.5in
- [ ] Every figure traceable to the source document, with its date
- [ ] The limits slide present and unhedged
- [ ] Three decisions named on slide 16, each with a decider and a date
- [ ] Recommendation marked on each of the three surfaces, alternatives kept honest
- [ ] Coverage matrix is a native chart, not a pasted table
- [ ] Noto Sans only — no second family
- [ ] Every colour traced to a resolved `--sa-*` token; saffron means only "problem", blue only "recommended"
- [ ] No tricolour motif, no accent stripes, no rules under titles
- [ ] `validate.py` clean
- [ ] Every text run passes WCAG 2.2 AA against the ground it actually sits on
- [ ] All 12 slides inspected as images, rendered in real Noto Sans
- [ ] Every option page carries all seven parts of the record, in the same places
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

---

## Revision — 7 September 2026, second pass

Cut from 19 slides to 8, moved to Noto Sans, and rebound every colour to a resolved
`--sa-*` token.

| What changed | Why |
|---|---|
| 19 slides → **8** | Nineteen slides to present three options is a report, not a decision aid. Everything that did not move the Secretary toward one of the three decisions came out: the journeys, the diagnosis slide, the separate up-front ask, the standalone evidence slide. |
| Cambria + Calibri → **Noto Sans** | It is the estate typeface. The earlier pairing was chosen for render-fidelity reasons that do not outrank the design system. |
| Invented palette → **resolved DS tokens** | The first pass approximated the brand and then hand-built accessible rungs. The design system already shipped them — `saffronDark` and the `primaryScale` ramp — so the deck now reads the real values. |
| Saffron meaning both "problem" and "recommended" | Split. Blue is the recommendation, saffronDark is the problem. A recommendation should not wear the failure colour. |
| `neutral-500` for captions | Raised to `neutral-600`. `neutral-500` clears AA on white but fails at 4.07:1 on the tinted card grounds the deck actually uses. |

**What was dropped and where it went.** The three journeys (Meena, Ramesh, Lata), the
five diagnoses, and the full 13-row limits treatment are all in the source review; the
deck now cites §4.1, §3 and §0 rather than reproducing them. If the Secretary asks "why",
the review is the answer, and the deck says where to find it.
