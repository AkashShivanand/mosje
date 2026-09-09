# Service Discovery — validation, feedback coverage and design audit

**Date:** 9 September 2026 · **Branch:** `feat/sd-two-axis-redesign` · **Audience:** the team preparing the AS review.

This document answers three questions in order: is what the screens say true, does the work cover
everything the 8 September review asked for, and what a design director and a UX researcher would
still change. Everything in section 3 that could be fixed in this session was fixed; what could not is
marked.

> **Addendum, 9 September 2026 (later the same day).** The decision recorded in §1.1 and §3 — to ask
> for persons with disabilities and show DEPwD's four schemes — is **withdrawn on instruction**: the
> Department does not serve them, so no DoSJE surface names them. The disability choice, the DEPwD
> result, the assistant branch, the finder branch, the Figma row and the deck's safeguard line are all
> removed. The finding in §1.1 stands as the validation answer; the design consequence is reversed.
> The persona list itself is re-validated below in §1.1a. The deck was also rebuilt as a live
> presentation (one idea a slide, the explanation in the speaker notes, Option A on a still because
> its recording did not play), and the concept slide was redrawn without the × mark, which read as an
> error. Before-and-after: `service-discovery-2026-09-09b-before-after.html`.

---

## 1. Validation — is what the screens say true?

### 1.1 Does the Department cover persons with disabilities? **No.**

The mandate of the Department of Social Justice and Empowerment (Annual Report 2025-26, §1.2)
names twelve groups: Scheduled Castes, Other Backward Classes, Senior Citizens, victims of alcoholism
and substance abuse, transgender persons, persons engaged in beggary, DNTs, manual scavengers, sewer
and septic tank workers, waste pickers, EBCs and EWS. **Persons with disabilities are not among them.**

They are served by the **Department of Empowerment of Persons with Disabilities (DEPwD)**, a separate
Department of the same Ministry since 12 May 2012 (DEPwD Annual Report 2025-26, §1.2). Its schemes are
DDRS, ADIP, SIPDA (which issues the UDID card) and the scholarships for students with disabilities
(DEPwD AR, Chapter 7). None appears in DoSJE's Annual Report, Demand for Grants or budget.

Two things make this confusing on the site itself, and both were checked today:

- The beta site's Schemes list carries DDRS as if it were the Department's. It is not.
- The live persona panel on dosje.gov.in read "Divyangjan / Student / Government Official" in the
  Figma capture and reads "Government Official / Beneficiary" today. The site's own persona
  vocabulary is in flux.

**Decision taken (morning):** persons with disabilities were asked for on every option and shown DEPwD's
four schemes, labelled as DEPwD's. **Reversed (afternoon, on instruction):** the Department does not
serve them, so they are not named on any DoSJE surface. See the addendum above.

### 1.1a The eleven personas, re-validated against their sources

| Persona on the screen | Where the Department names the group | Source |
|---|---|---|
| Scheduled Castes | Mandate group | AR 2025-26 §1.2 |
| Other Backward Classes | Mandate group; EBCs folded in, because the OBC schemes name them together | AR 2025-26 §1.2; PM-YASASVI records §3.19–3.21 |
| Senior Citizens | Mandate group | AR 2025-26 §1.2; AVYAY §3.29–3.31 |
| Persons Affected by Substance Use | Mandate: "victims of alcoholism and substance abuse"; NAPDDR names the person and the family | AR 2025-26 §1.2, §3.33 |
| Transgender Persons | Mandate group | AR 2025-26 §1.2; SMILE §3.35 |
| Persons Engaged in Begging | Mandate: "persons engaged in beggary"; SMILE's second component | AR 2025-26 §1.2, §3.36 |
| De-notified, Nomadic and Semi-Nomadic Tribes | Mandate group | AR 2025-26 §1.2; SEED §3.24 |
| Safai Karamcharis | Mandate names manual scavengers, sewer and septic tank workers, waste pickers; NAMASTE and NSKFDC name them together as Safai Karamcharis | AR 2025-26 §1.2, §3.11 (NAMASTE), NSKFDC page |
| Students | Not a mandate group; every scholarship record names students of the groups the Department serves | AR 2025-26 ch.3 §3.2–3.5 (SC), §3.19–3.22 (OBC/EBC/DNT), §3.27 (NOS); SBE Demand 93 |
| Victims of Atrocities | Not a mandate group; named by the PCR/PoA scheme and the National Helpline Against Atrocities | AR 2025-26 §3.9; helpline 14566 |
| Voluntary Organisations | Not a mandate group; the grantee every grant-in-aid record names | AR 2025-26 §3.39; e-Anudaan |

**Order (instruction of 9 September 2026, afternoon):** the eight mandate groups first, in the order §1.2
names them, then the three the schemes name. Every surface, the deck and the Figma frames follow it.
Consequence: the persona panel on the home page (Option A) now opens on Scheduled Castes, a male
figure, not on Students; the review's request that the sequence open on a female figure is not met
unless the panel alone keeps a different order.

**Artwork (same instruction):** every figure is from the DBIM Visual Components Library
(dbimtoolkit.digifootprint.gov.in). Students now uses the file DBIM tags to Social Justice and
Empowerment (`2024/09/e9a238d8ab6944add204874fdf132403.png`). The full assignment is §4a.

Two mandate groups are **not** personas because no scheme record serves them as such: *Economically
Weaker Sections* (named in §1.2, no scheme in ch.3 or the Demand for Grants) and *Economically
Backward Classes* on their own (always named alongside OBCs). Persons with disabilities are not in the
mandate and are not shown.

**One claim withdrawn from the concept slide and the Figma frame:** "none of the Department's schemes
divides on stage of life, State or gender." It is not true as written — Top Class and PM-YASASVI
reserve 30% of slots for girl students, the OBC hostel scheme is for boys and girls separately, and
PM-AJAY and PCR/PoA run through State Governments. What is true, and what the slide now says, is that
every scheme is tagged on the two lists and nothing else is asked.

### 1.2 The personas — checked against the mandate

| Persona on the screens | Mandate group (AR §1.2) | Check |
|---|---|---|
| Students | cross-cutting | ✅ Every scholarship names a community and a stage; the review asked for Students on the persona screen |
| Scheduled Castes | Scheduled Castes | ✅ |
| Other Backward Classes | OBCs; EBCs | ✅ EBC folded in, as PM-YASASVI and SHREYAS-OBC fold it |
| DNT, Nomadic and Semi-Nomadic Tribes | DNTs | ✅ |
| Safai Karamcharis | Manual scavengers; sewer and septic tank workers; waste pickers | ✅ NAMASTE's own three target groups |
| Senior Citizens | Senior Citizens | ✅ |
| Transgender Persons | Transgender Persons | ✅ |
| Persons Affected by Substance Use | Victims of alcoholism and substance abuse | ✅ AR's definition "generally includes the immediate family" |
| Persons Engaged in Begging | Persons engaged in beggary | ✅ |
| Victims of Atrocities | not a mandate group | ✅ served through the PCR-PoA scheme (AR §3.9) and NHAA 14566; the review named it |
| Voluntary Organisations | not a mandate group | ✅ delivery partners under AVYAY, NAPDDR, SHRESHTA, SMILE (AR §3.39, e-Anudaan) |
| Persons with Disabilities | **not a mandate group** | ✅ not shown on any surface (morning: signposted; afternoon: removed on instruction) |
| *EWS* | Economically Weaker Sections | ⛔ left off — no scheme in Chapter 3 or the Demand for Grants serves EWS as such |

### 1.3 The offerings — checked against what the schemes provide

| Offering | Schemes that provide it (all from AR Chapter 3) |
|---|---|
| Scholarships and Fellowships | PMS-SC, Pre-Matric SC and Others, NFSC, NOS, Top Class SC, PM-YASASVI ×4, NF-OBC, overseas interest subsidy, PM CARES scholarship, DAF merit awards |
| Residential Schools, Hostels and Coaching | SHRESHTA, Free Coaching, Top Class Schools, OBC hostels, SEED coaching |
| Loans and Credit | NSFDC, NSKFDC and NBCFDC loans, VISVAS, VCF-SC/BC and ASIIM, NAMASTE capital subsidy, overseas interest subsidy |
| Skill Training and Livelihood | PM-DAKSH, NAMASTE, PM-AJAY, SEED livelihood, SMILE skilling, geriatric caregiver training |
| Care, Shelter and Health | IPSrC, RVY, Elderline, Garima Greh and PM-JAY under SMILE-TG, SMILE shelter homes, NAMASTE PPE and PM-JAY, SEED health insurance, DAF medical aid |
| De-addiction and Counselling | NAPDDR — IRCAs, ODICs, ATFs, DDACs, helpline 14446 |
| Protection, Relief and Grievance | PCR-PoA relief, NHAA 14566, NCSC e-GMP, NCSK, Elderline, Transgender Protection Cells |
| Grants to Voluntary Organisations | e-Anudaan; IPSrC, NAPDDR, SHRESHTA Mode II, SMILE Garima Greh |

### 1.4 The schemes — every record re-read against its source today

All 38 records in `docs/research/dosje-scheme-master-2026-09.json` were re-read against the cited
section. Every figure on a screen traces to one of these: the Annual Report 2025-26 Chapter 3, the
Demand for Grants 2026-27 (Demand 93), the PIB Year-End Review 2025, or the Department's legacy scheme
pages. Three corrections were made today:

| What | Was | Now | Why |
|---|---|---|---|
| Apply route for PM-DAKSH | linked to `pmdaksh.dosje.gov.in` | named, not linked | the address could not be confirmed (no response on 9 September); a link nobody checked is a claim |
| Apply route for the Transgender portal | linked to `transgender.dosje.gov.in` | named, not linked | same reason |
| Every apply label | "Apply through NSFDC, through its channelising agencies" and the like | "Apply through NSFDC"; "Apply on the State's scholarship portal"; "Call Helpline 14566" | the long forms were unreadable as button text; the detail lives on the scheme page |

Routes confirmed to resolve today: scholarships.gov.in, nsfdc.nic.in, nbcfdc.gov.in, ncsc.nic.in,
pmajay.dosje.gov.in, grants-msje.gov.in, visvas.dosje.gov.in, scw.dosje.gov.in, depwd.gov.in, ugc.gov.in.
Named by the Department's own pages and kept although they did not answer from this network:
nosmsje.gov.in (legacy scheme page 28), seed.dosje.gov.in (page 109), nskfdc.nic.in (page 37),
nmba.dosje.gov.in (AR §3.15).

Where two sources disagree the screen shows nothing — the NSFDC income ceiling (₹3 lakh in the AR,
₹5 lakh on the legacy page), Elderline call volumes, SMILE's State count, and the number of transgender
identity certificates (over one crore in the AR, 30,441 in the PIB release). All four are recorded in
the master's `conflicts`.

---

## 2. Feedback coverage — the 8 September review, item by item

| # | What was said (time in recording) | Where it is answered |
|---|---|---|
| 1 | "134" on slide 1 is unvalidated; the beta list counts a list of offences as a scheme (01:32–05:46) | Title and every slide carry no count; the master excludes the offences list, guideline pages, status tables and State schemes (research doc §7) |
| 2 | Remove every number, everywhere, including "12 active schemes" and "19 schemes" on the internal page (17:18, 19:28, 22:10) | No count on any screen, frame or slide; per-filter counts replaced by greying; only helpline numbers and AR-stated amounts remain |
| 3 | One thought behind every option; the persona panel and the new options must use the same vocabulary (06:42–07:39) | One master of 11 personas across the panel, both finders, both Schemes pages and the assistant; concept slide 2 and Figma section 1 |
| 4 | Drop question 1 "who is this for" (09:49) | Dropped |
| 5 | Keep the community question; it absorbs stage of life — Students covers school and college, senior citizens are their own tag (12:27–13:12) | Question 1 is the persona list with Students and Senior Citizens on it; no stage question |
| 6 | Kind of help stays but becomes "what the Department offers", fine-tuned with real examples: federation loans for business, GIA to NGOs under Nasha Mukt (13:12–14:11) | The eight offerings, each with the Department's own examples in its subtitle |
| 7 | Drop State — none of the schemes is State-specific (15:33) | Dropped |
| 8 | Two screens: persona, then offering; build the two masters, LHS and RHS, and the mapping (15:46–16:28) | Option B; the masters are section 3 and 4 of the research doc, drawn on slide 2 and Figma section 1; the mapping is research doc §5 |
| 9 | Option C stays, described as persona-based, numbers and value propositions removed, same thought applied (16:28–17:59) | Option C rebuilt: persona row, schemes grouped by offering, no counts |
| 10 | Apply links: revisit; either go to the portal or to the scheme page which carries the portal (17:59–19:28) | Every row names where to apply and links to the scheme page; the Figma annotation and the option page say so |
| 11 | Schemes page Option A: only the two axes — persona (target group, name to be decided) and category (type of service) (20:06–21:16) | Two filters: Who It Is For, What It Provides |
| 12 | SC/OBC/DNT cannot be told apart in the current data — "use variation" (21:20) | Shown as separate personas; the tagging work is item 2 of "What Has to Be Done First" |
| 13 | The sequence should open on a female figure, since AS is a woman (21:36) | The panel, the finder and every persona list open on Students, drawn as a young woman |
| 14 | Schemes page Option B: top filters fine; remove the "19 schemes" header (21:49–22:31) | Removed; layout balanced without it |
| 15 | The Bolt variant had the same questions; fold it into Option B (22:45) | Only Option B remains; no third finder |
| 16 | Deck order: LHS/RHS concept first; then home page with three options and placement; then the internal page's two options; then the chatbot (23:22–24:34) | Slides 2, 3–6, 7–9, 10 in that order; slide 3 and Figma section 5 show placement |
| 17 | Negi's effort estimate on re-tagging is needed; an intern for the mapping (08:09, 03:00) | Slide 11 item 3 asks development for the estimate; the tagged master is the input the intern would otherwise produce |
| 18 | Don't mail the PPT; confirm it is ready; Rohit books AS's time; Akash presents (24:34–25:00) | The deck's notes say "presented live"; nothing says "sent ahead" |

Not in the transcript but implied by item 2 and confirmed today: the design-system finder's own
1,000-line scheme list, which repeated the beta site's data, is deleted; it reads the master.

---

## 3. Design audit — what a director and a researcher would still change

### 3.1 Fixed in this session

| Finding | Severity | Action |
|---|---|---|
| Persons with disabilities got a note and no schemes — a dead end for the one group most likely to arrive at the wrong department | High | DEPwD's four schemes are shown, labelled *Run by DEPwD*, in the finder, the design-system finder and the assistant  **Withdrawn later the same day — see the addendum: nothing about disability is shown now.** |
| The disability choice sat in the persona grid as a twelfth card, so it read as one of the Department's groups | High | Moved to a distinct dashed row beneath the grid: "Their schemes are run by DEPwD. Choose this to see them."  **Withdrawn later the same day — see the addendum: nothing about disability is shown now.** |
| Apply buttons carried a whole sentence ("Apply through NSFDC, through its channelising agencies") | Medium | Route labels shortened; the detail belongs on the scheme page |
| "Whom it names" as a card label — the Department's register, not a citizen's | Medium | Cards use *For* and *Provides*; the eligibility rule is unchanged in the wording of the values |
| "Schemes That Name You" as a results heading | Medium | "Schemes for Your Group" — still no eligibility claim |
| Secondary text at 11–12.5px on a 1440 canvas, below the estate's 16px body floor when scaled | Medium | Persona cards 14.5/12.5, marks' labels 12.5, rows 13; the canvas is reviewed scaled, so the floor is met at 1:1 |
| Three personas drawn as a dashed empty circle, which reads as a broken image | Medium | Material Symbols marks on the same ground until artwork exists (section 4) |
| Two apply routes linked to addresses nobody had checked | High | Unlinked until confirmed |
| Option B's answer had no way to the scheme's own page | Medium | "Scheme page →" beside every apply button |

### 3.2 Recorded, not fixed — needs a decision or work beyond this session

| Finding | Severity | What it needs |
|---|---|---|
| **No phone view.** Most citizens will meet the finder on a phone; every option is drawn at 1440 | High | A 390px variant of Option B and of the one-tap row, in Figma, before the finder is built. The design-system finder reflows already; the static prototypes do not |
| **English only.** The live site is bilingual; the finder's persona names in Hindi are the words citizens actually use (anusuchit jaati, safai karamchari, varishth nagrik) | High | Hindi strings for the 11 personas and 8 offerings from the Department's Hindi pages, not translated by us |
| **Persona artwork is mixed** — eight illustrated figures, three icons | Medium | Four portraits commissioned to the briefs in section 4 |
| **"Victims of Atrocities" and "Persons Engaged in Begging" on a public home page** — the mandate names both, but a person in either situation may not choose that card in public | Medium | The Department decides the public wording; alternatives are "Relief after an atrocity" and "Shelter and rehabilitation" |
| **The Students persona overlaps every community** — a Scheduled Caste student can start from either card and should reach the same scholarships | Low | They do (the master tags both); the research doc should say so plainly for the reviewer |
| **The assistant's quick-reply row of twelve personas is long on a phone** | Low | Group the quick replies in two rows of six, or ask "Are you a student?" first — a product decision |
| **No usage evidence.** Every claim about what a visitor does is design judgement; no citizen has used any of these | High | Five moderated sessions with citizens from three of the personas before build; the research doc's open questions list what to test |

### 3.3 What was checked and left alone

- The Schemes page table (Option B) is dense, but it is the page officers and voluntary organisations
  work on, and the row height is set by "For", which is the one column a card cannot carry.
- Option C's list for Students is long. It is grouped and capped at three rows per offering with a
  "More" link; a longer list is the honest answer for the largest persona.
- The concept slide lists eleven and eight items in full. A reviewer who has never seen the masters
  needs to see them once, whole.

---

## 4. Persona artwork — four briefs, and why they were not generated here

Image generation was attempted through the Gemini image models available to this session; the API
key reports a quota of zero for both, and neither Figma's nor Adobe's connector exposes text-to-image.
The four briefs below are written for Figma's own image generation or for the illustrator who drew
the existing set, and match that set: **bust from the chest up, black ink line with light grey
hatching, white ground, no props, no text, square.**

| Persona | Brief |
|---|---|
| Persons Affected by Substance Use | A young man in his twenties in recovery: healthy, alert, hopeful; short neat hair, plain collared shirt. Nothing that suggests intoxication, distress or stigma — the earlier drawing was withdrawn for exactly that |
| Persons Engaged in Begging | A middle-aged man now in a shelter and rehabilitation programme: weathered but dignified face, greying hair, simple cotton kurta, a light shawl over one shoulder. Nothing that suggests begging or pity |
| Victims of Atrocities | A woman in her thirties in a plain cotton sari, resolute and composed, holding a thin folder of papers to her chest — a person seeking relief with dignity. No sign of injury, distress or violence |

Until they exist, the three personas use Material Symbols on the same ground the illustrated marks
sit on: `health_and_safety`, `night_shelter`, `balance`. (A fourth brief, for the DEPwD row, was
withdrawn with the row.)

## 4a. Artwork assignment — one DBIM file per persona

| Persona | DBIM asset | File under `static/uploads/` |
|---|---|---|
| Scheduled Castes | Livelihood Seeker (Service Seeker, Minority Affairs) | `2024/09/280a755bc02a0451f99cf5ced70d9686.png` — already in use |
| Other Backward Classes | Rural Livelihood Seeker (Agriculture and Rural) | `2024/09/5a17da7b7805131ba2104a245d87268f.png` — already in use |
| Senior Citizens | Pensioner (Lifecycle Based, Expenditure) | `2024/09/4cfb6b14d6febde9855a874947df9885.png` — already in use |
| Persons Affected by Substance Use | Health Seeker (Service Seeker, Health and Family Welfare) | `2024/09/ab8f73c5030b70aff82d93e9458385bd.png` — proposed; not yet placed |
| Transgender Persons | none in the library | keep the Department's own figure from the live persona panel |
| Persons Engaged in Begging | none in the library | the DBIM icon *Night Shelter*, the same mark used today |
| De-notified, Nomadic and Semi-Nomadic Tribes | Livelihood Seeker (Service Seeker, Minority Affairs), second figure | `2024/09/9e5c20f6e1afa6a1b4527be5667127a0.png` — already in use |
| Safai Karamcharis | none in the library | keep the Department's own figure from the live persona panel |
| Students | Student (Service Seeker, **Social Justice and Empowerment**) | `2024/09/e9a238d8ab6944add204874fdf132403.png` — placed this pass |
| Victims of Atrocities | none in the library | the DBIM icon *Justice*, in place of the Material `balance` mark |
| Voluntary Organisations | Social Worker (Government and Social Services) | `2024/09/0a4ab241a8924af6bc07bb1663bb7fda.png` — already in use |

The library's only assets tagged to this Ministry are the Student above and two *Differently Abled
Person* figures, which are not used because persons with disabilities are not served by this
Department. For the four personas with no figure, the way through is a request to the DBIM ToolKit
team (MeitY) for four persona illustrations in the library's line style, using the briefs in §4;
until then the Department's own two figures and the two DBIM icons stand.

## 4b. Prompts to draw the missing figures

Use these with any image model, or hand them to an illustrator. Each is written to match the
DBIM Visual Components Library's persona style, so the new figures sit beside the existing ones
without looking borrowed from somewhere else.

**Style, the same for every prompt.** Black ink line drawing of one Indian adult, waist-up, facing
the viewer, on a plain white background with no shadow, no colour and no scenery. Clean, even
lines of one weight, like a coloured-in outline from a textbook. Calm, direct expression, a slight
smile. Everyday clothes drawn simply. Square image, the person centred, head near the top with a
little space above it. No text, no logo, no border. The drawing must look kind and ordinary,
never sad, never dramatic.

| Persona | Prompt (add the style paragraph above to each) |
|---|---|
| Transgender Persons | A transgender woman in her thirties, hair tied back, wearing a plain sari with a small bindi and stud earrings, standing straight with her hands loosely clasped in front of her. Confident and at ease. Nothing that suggests performance or costume. |
| Safai Karamcharis | A sanitation worker in his forties in a plain collared work shirt and a soft cloth cap, one hand resting on the handle of a long-handled broom that is only partly in frame. Weathered but healthy face, looking straight ahead with quiet dignity. No dirt, no mask, no gloves, no vehicle. |
| Persons Engaged in Begging | A man in his fifties now living in a shelter, greying hair combed, a simple cotton kurta and a light shawl over one shoulder, standing upright with a small cloth bag on his shoulder as if arriving somewhere. Dignified and rested. Nothing that suggests begging, a bowl, a street, or pity. |
| Victims of Atrocities | A woman in her thirties in a plain cotton sari, hair neatly tied, holding a thin paper folder against her chest with both hands, looking straight ahead, composed and resolute. A person seeking her rights with dignity. No injury, no distress, no police, no courtroom. |
| Persons Affected by Substance Use (if the DBIM Health Seeker is not wanted) | A young man in his twenties in recovery, short neat hair, a plain collared shirt, standing straight with his hands at his sides and a small, hopeful smile. Healthy and alert. Nothing that suggests intoxication, medicine, a hospital or a bottle. |

**Which to draw and which to keep.** Transgender Persons and Safai Karamcharis already have the
Department's own figures from the live persona panel; draw new ones only if the set is to be
uniform. Persons Engaged in Begging and Victims of Atrocities have no figure anywhere and use
icons today (*Night Shelter*, *Justice*); an icon is acceptable for both if drawing a person feels
wrong for the subject — that is a judgement for the division, and the audit records both choices
as defensible.

## 5. Third pass, 9 September 2026 (evening) — what changed and why

| Instruction | Done |
|---|---|
| Remove "Against it"; document differently; plain language | Every option page now says what it is, how it works and why it helps. No verdicts. The deck's words were rewritten for a school-leaver. |
| Two Questions: View details only, no apply link; both answers under "You chose"; two or three schemes then a link to the filtered Schemes page; drop the design-system sentence; drop the scheme type from cards | Done: three schemes, View details, both chips, "View all schemes for …" opens the Schemes page filtered to the same answers. Type removed from every card and row. |
| Say where the data came from; a separate report | `docs/research/service-discovery-data-sources.md`, generated from the master: documents, groups, kinds of support, portals and links with the 9 September link checks, every scheme with its sources, exclusions, conflicts, what is unverified, and a cross-check against myScheme. |
| One Tap: a band for the group's portal, then the categorised list | Done. The band shows the one portal or helpline the Department runs for the group; a button only where the site answered on 9 September (NSFDC, NBCFDC, NSP, e-Anudaan, the helplines); the rest named in words. |
| Schemes page: the earlier layouts with the feedback; correct data; aligned personas | Option A follows the WIP frame 4759:155021 with the persona rail as one horizontally scrolling, aligned row of the eleven groups; search, a Kind of Support dropdown and Reset; cards paged at nine; no counts. Option B keeps the panel-and-table with faces beside the target groups and a Reset per panel. |
| Before/after page images did not load | Both pages now carry their images inside the file. |
| Google Drive | The 8 September deck, PDF and zip moved into `_superseded`; the new deck and PDF uploaded; the walkthrough videos replaced. |
| Remove "Before Anything Is Built" and "Three Rules"; summary without a recommendation | Both slides removed. The closing slide lists the six options by part of the site and says what comes before a build; it recommends nothing. The "Recommended" pills are gone from every page as well. |
| Realistic UI behind the chatbot; no demo rail | The assistant now sits on the website's own home page (its real header, banner, About, Offerings and Recent Documents), and the recording hides the demo rail and the accessibility widget. |
| myScheme data | Captured the Ministry's 85 entries and reconciled them to the master in the report's §9: DEPwD's and disability schemes, corporation loan products, umbrella components, and four entries for the divisions to confirm. Nothing on a screen comes from myScheme. |
