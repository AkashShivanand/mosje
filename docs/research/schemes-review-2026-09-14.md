# Scheme Portals and the Schemes Page — Internal Review, 14 September 2026

> Source: meeting recording and transcript, 14 September 2026, about 13:00 (34 minutes, two
> parts). Screen share showed the MoSJE [WIP] Figma file, dosje.gov.in *Schemes & Services*
> and socialjustice.gov.in. The transcript is machine-generated Hindi; speaker labels
> are unreliable, so this record names only people the recording itself names. Follows the
> 11 September review and `docs/plans/schemes-section-ia-2026-09-09.md`.
>
> The designs these decisions changed are on the *Scheme Discovery* page of the
> [AI R&D] MoSJE [WIP] file (`gtaMBE2NeIeXn6cbYhld7L`), bound to SAMAVESH.

## 1. What was decided

| # | Decision | Where it lands |
|---|---|---|
| 1 | Take **three options** to the 18:30 review with Ma'am, not two. The new one is **rename only**: "Associated Organisations" becomes **"Organisations & Scheme Portals"**, and the menu keeps everything it lists today. | Figma M1b (new) |
| 2 | The two options already drawn stay: portals **under Offerings** (M2), and **Schemes as its own menu** (M2b). A new top-level entry is taken only if Ma'am does not want schemes near the organisations; it crowds the row on small screens. | M2, M2b |
| 3 | In the Offerings option, **"View All Schemes" moves from a small link in the heading to a full-width outlined button under the portals**. As a small link it undersold the Department's schemes. Placed under the portals, it no longer reads as another portal. | M2 (changed) |
| 4 | Whatever the menu label becomes, the **same words are used everywhere**, including the organisation filter on the schemes page: "All Organisations" becomes **"All Organisations & Scheme Portals"**. | M1b, M4b |
| 5 | On the schemes page, **Target Group moves to a left sidebar**, with **Category under it, collapsible**. | M4b (new) |
| 6 | **Type (Schemes / Services)** goes at the top of that sidebar. SCW publishes services as well as schemes. | M4b |
| 7 | **Every scheme card shows its category and the organisation or portal that runs it.** | Listing Card gains *Category* / *Show Category* |
| 8 | Results are **grouped with headings**, answering "how many of each" as socialjustice.gov.in does. One grouping can head the page at a time, so **two versions** are drawn: by organisation and by category. | M4b Version A, Version B |
| 9 | **The first visit still opens on the Department (MoSJE)**. Applying any filter switches the organisation filter to All automatically; the grouping then applies to everything. | M4 unchanged; M4b notes |
| 10 | DWBDNC is the one body with a **Central / State split**, so only its group shows that filter. | M4b Version A |
| 11 | The target-group list (eleven, from the new-journey slide) includes **Students, Victims of Atrocities and Voluntary Organisations**, because the Department's scheme pages use those words. **To be confirmed with the Ministry.** | M4b note 8 |

## 2. What the organisation grouping would show today

Live counts, active schemes, `dosje.gov.in/wp-json/wp/v2/schemes-and-services`, 14 September.
Three records carry two organisations, so the groups sum to 137 against 134 records.

| Group | Count | Note |
|---|---:|---|
| Department of Social Justice & Empowerment | 27 | |
| NCSK | 8 | |
| NSFDC · NSKFDC · NBCFDC | 5 · 11 · 6 | |
| DAF · BJRNF | 10 · 3 | |
| DWBDNC | 55 | Central 11 · State Governments 44 |
| SCW · NOS · NHAA (portals) | 7 · 2 · 3 | group carries *Go to Portal* |

By category (the thirteen live terms): Education 60 · Loan 11 · Livelihood 9 · Economic
Development 8 · Housing 7 · Social Empowerment 7 · Healthcare 5 · Aid 4 · NGOs Scheme 4 ·
Micro Finance 2 · Non Loan 2 · Social Remedies 2 · Term Loan 1. **Ten records carry no
category** and would sit in no group.

## 3. Open for the 18:30 review

- ~~**Counts on a design.**~~ **Decided later on 14 September: counts stay** on the grouped
  Schemes page, one on each heading. This supersedes the 8 September ruling for that option
  only; every other option still shows none. Counts are computed from the feed at render and
  never typed.
- **What the counts count.** The live list still holds documents, flyers and lists of offences
  (§6 of the IA plan: 140 entries today, 20 top-level schemes after). Group counts shown now
  would fall sharply once the list is cleaned.
- **Which categories.** The live thirteen overlap (Loan, Non Loan, Term Loan, Micro Finance).
  The eight on the new-journey slide are cleaner, but every record needs re-tagging before a
  count can be shown under them.
- **Which menu option** — rename only (M1b), under Offerings (M2), or its own menu (M2b).
- **Nav width** under rename only: the label measures 216 px against 170 px today. It fits at
  1440; at 1280 it spends the 43 px the row had spare.

## 4. Not changed by this review

- The mobile menu sheet and mobile schemes page (M10) still show the earlier proposal;
  redraw them once the option is chosen.
- The SAMAVESH MegaMenu and NavSheet masters (updated today) keep "Associated
  Organisations". The rename waits for the decision.
- The Service-type tag does not exist in the CMS. The Type filter needs one on every record.
