# e-Anudaan (UAT) — Design & Experience Audit

**Audited:** 2026-09-03 · **Environment:** UAT — `eanudaan-user-uat.mosje.in`, `eanudaan-admin-uat.mosje.in`
**Evidence:** 225 captured screen states across 25 roles (24 officer + 1 applicant) — 176 officer
screens and 49 applicant screens — with computed CSS for every element, plus three grant wizards
walked step by step to their review pages. Capture bundle:
`tools/design-audit/projects/e-anudaan/out/capture-bundle.json`.
**Lenses:** design director · UX lead · senior visual designer.
**Standard applied:** this estate's own — `.claude/rules/ui-restraint-and-copy.md`,
`data-state-completeness.md`, `design-system-architecture.md`, WCAG 2.2 AA, GIGW 3.0, DBIM.

> **Scope note.** There is no Figma handoff for e-Anudaan, so this is a judgment-led review against
> published standards, not a design-versus-build fidelity check. Nothing here is a machine verdict.

---

## What has changed since the last capture

The previous record (`docs/research/eanudaan-*-dev.mosje.in/`) is superseded. Three material changes:

| | Then (dev, Aug 2026) | Now (UAT, Sep 2026) |
|---|---|---|
| Environment | `*-dev.mosje.in` | `*-uat.mosje.in` |
| Schemes live | SHRESHTA_M2 only | NAPDDR, AVYAY, SHRESHTA_M2 selectable |
| Admin roles | 14 (one scheme) | 25 across **two** credential sets (Avyay + Shreshta M2) |
| NAPDDR wizard | 3 steps | **10 steps** |
| AVYAY wizard | 7 steps | 7 steps |
| SHRESHTA_M2 wizard | 6 steps | 6 steps |

---

## What is genuinely good

Said plainly, because a review that only lists faults is not a review.

- **Typography is nearly single-source.** 19,143 of 19,280 elements render in Noto Sans — the
  estate standard — and the type scale is a disciplined 10 steps.
- **The applicant dashboard answers the right first question.** Total / In Review / Needs Action /
  Sanctioned reconcile exactly (18 + 0 + 9 = 27). That arithmetic integrity is not a given.
- **Every screen has an `<h1>`.** Zero screens are unlabelled.
- **The accessibility bar is present estate-wide** — skip link, text sizing, contrast toggle.
- **Financial provenance is stated** — "Auto-populated from DARPAN" tells the applicant where a
  figure came from, which is exactly the provenance habit this estate asks for.
- **The wizard stepper is exemplary.** All ten NAPDDR steps are shown at once, numbered and named
  ("Application Type", "Location, Infrastructure & Preparedness", "Review & Submit"), with the
  current step marked. An applicant knows how long the form is before starting it — which is the
  single most useful thing a ten-step form can tell them.
- **The saved-draft banner is the best-designed element in the applicant portal.** *"You are
  continuing a saved draft for FY 2026-27, last saved 03 Sept 2026. Its answers are already filled
  in below."* It says what happened, when, and what the applicant is looking at — and puts *Start
  a fresh application* beside it as the escape. It is the pattern the rest of the portal should be
  measured against.
- **Field helper text is written for the applicant, not the officer.** *"Pick the centre type. For
  a general IRCA, the reviewing officer sets the bed capacity (15/30/50) later — you do not enter
  beds here."* That sentence prevents a specific, predictable mistake and says who does the thing
  the applicant is not doing. Contrast with M3, where the same portal shows raw officer codes.

---

## Findings

Severity: 🔴 Blocker · 🟠 Major · 🟡 Minor · ⚪ Nit

### 🔴 B1 — The captcha protects nothing, and blocks the people it shouldn't
`eanudaan-user-uat.mosje.in/login`

The challenge is **plain text in the DOM**: `<span class="loginv2-captcha-text">ahfzM8</span>`.
Any script reads it in one line — our own capture does. It stops no automation whatsoever.

Simultaneously its wrapper is `<div class="loginv2-captcha-image" role="img" aria-label="Captcha
code">`. Because `role="img"` replaces the element's inner text for assistive technology, a screen
reader announces **"Captcha code"** and never the code. So the control is a hard barrier to a blind
applicant and no barrier at all to a bot — precisely inverted.

**Fix:** either remove it (it provides no protection) or replace it with a server-issued challenge
that is not readable in the DOM and carries a genuine accessible alternative. Do not keep the
current arrangement; it fails WCAG 1.1.1 and delivers nothing in exchange.

### 🔴 B2 — No field in any wizard is programmatically marked required
All three wizards, every step.

Labels say `*` and every step header repeats "Fields marked * are mandatory." But across 100+ fields
in three wizards, **not one** carries `required` or `aria-required="true"`. The convention exists
visually and has no programmatic equivalent, so a screen-reader user is never told which of 29
fields on "Location, Infrastructure & Preparedness" they must complete. Fails WCAG 3.3.2.

### 🟠 M1 — The forward button behaves differently in each scheme
NAPDDR enables "Next →" and explains on click. AVYAY and SHRESHTA_M2 **disable** it until valid.

Disabled-until-valid gives the applicant a dead control and, on the form steps, no reason for it.
**Fix:** one behaviour across all schemes — keep the control enabled, and on click name what is
outstanding.

> **Correction.** An earlier draft of this finding said the Document Uploads step disables the
> button with nothing on screen to explain it. That is wrong, and the opposite is true. All three
> schemes show *"Checking 12 documents… this takes a few seconds. Next opens as soon as the check
> completes."* — a disabled control, a stated reason, and a stated end condition, which is exactly
> the pattern the rest of the wizard should copy. The first draft was written from a capture taken
> before the message rendered. **The upload step is the model, not the offender.**

### 🟠 M1a — SHRESHTA_M2 renders ten upload slots for a seven-document checklist
Its counter reads **`10 / 7 uploaded`**. The checklist advertises seven mandatory documents, the
page renders ten file inputs, and the counter's numerator counts slots while its denominator counts
requirements — so it can exceed its own total and still not mean "done".

An applicant cannot tell how many documents this scheme actually wants. NAPDDR (12/12) and AVYAY
(9/9) agree with themselves; only SHRESHTA_M2 does not.

### 🟠 M1b — Automatic document checking fails often enough to be the normal case
*"We could not check this document automatically. Your upload is saved and a reviewer will check
it."* appears against documents that are uploaded and marked **Uploaded**, on both NAPDDR and AVYAY.

The message itself is good — it degrades gracefully and tells the applicant their upload is safe.
The problem is what it sits behind. The forward control waits on a check that, on this evidence,
routinely cannot complete, so an applicant is asked to wait for something that will not happen and
is then let through anyway. **If the check is advisory, do not gate the forward control on it.**

### ⚪ n5 — One scheme accepts fewer file types than the others
NAPDDR and SHRESHTA_M2: *"PDF / JPG / PNG · Max 5 MB per file · All mandatory."* AVYAY: *"PDF ·
Max 5 MB per file · All mandatory."* A photograph of a registration certificate is acceptable
evidence for two schemes and not the third. If deliberate, say why; if not, it is a one-line
config difference.

### 🟠 M2 — NAPDDR lets you walk past its own mandatory document step
NAPDDR step 9 has 12 document slots. We reached **step 10, Review & Submit, with nothing uploaded.**
The other two schemes block this. Either NAPDDR's documents are genuinely optional — in which case
the asterisks are wrong — or its validation is missing. Both are defects.

### 🟠 M3 — Officer vocabulary is shown to applicants
Applicant dashboard, Application Status.

Status names include **"With Sanction US (PD)"**, **"Under Review — IFD"**, **"Under PD Review"**,
**"NAPDDR SANCTIONED"**. These are internal file-noting terms — Under Secretary, Programme Division,
Integrated Finance Division. An NGO cannot act on them. Directly against
`ui-restraint-and-copy.md` §2: copy speaks in the department's register **to the citizen**, not in
its internal shorthand.

### 🟠 M4 — The status taxonomy overlaps itself
The same donut carries **Sanctioned (6)**, **NAPDDR SANCTIONED (2)**, **Approved (1)**,
**Grant Released (1)** and **1st Instalment Released (1)** as five separate categories. A scheme
name has leaked into a status value. An applicant cannot tell whether "Approved" and "Sanctioned"
differ, or why their scheme has its own sanctioned state.

**Fix:** one status vocabulary, scheme-independent, with the scheme as a separate dimension.

### 🟠 M5 — Eleven categories in one donut
The Application Status chart plots 11 slices, six of them at 4% — visually indistinguishable, and
the ring is decorative rather than informative. The legend does all the work.

**Fix:** top 4–5 states plus "Other", or drop the ring and lead with the ranked list, which is what
the reader is already using.

### 🟠 M6 — A scheme you can be in but cannot apply to
"Applications by Scheme" lists **SMILE — 4 apps**. The Select Scheme picker offers only NAPDDR,
AVYAY and SHRESHTA_M2. The applicant holds four SMILE applications and has no route to a fifth.
Either the picker is missing a scheme or the dashboard is showing a retired one; either way the two
surfaces disagree about what the product offers.

### 🟠 M7 — Money is formatted three ways on one screen
`₹3.67 Cr` · `₹26.34 L` · `₹18,70,000` · `₹6,38,283.55` — abbreviated crore, abbreviated lakh, full
Indian grouping, and paise on a grant figure. The per-scheme bars invite comparison between values
in different units, which cannot be done by eye.

**Fix:** one convention for money in tables and one for summary tiles; never mix Cr and L in a list
meant to be compared; drop paise from grant amounts.

### 🟠 M8 — Dates are formatted two ways on one screen
"Last updated 3 September 2026 at 6:49 am" against "02 Sept 2026" in the table beneath it.

### 🟠 M9 — Every row in Recent Applications is labelled identically
Six consecutive rows read **"Demo NGO (Anudaan)"** — the applicant's own name, which they already
know. The distinguishing content (scheme, place, number) sits below in small grey type. The primary
label carries no information and the informative element is secondary. Inverted hierarchy.

**Fix:** lead each row with what distinguishes it — scheme and project — and drop the organisation
name entirely; the whole screen belongs to one organisation.

### 🟠 M10 — 176 of 186 screens carry more than one `<h1>`
The masthead heading and the page heading are both level 1. Screen-reader users navigating by
heading get two competing document titles on almost every screen. 33 screens additionally skip
from `h1` straight to `h3`.

### 🟠 m1 — The accessibility bar is the estate's largest target-size failure
Counting only pointer targets (`button`, `a`, `role=button`), **614 of 1,449 on the applicant
portal and 1,469 of 4,985 on the officer portal** fall below the WCAG 2.2 **2.5.8 Target Size
(Minimum)** threshold of 24×24 CSS px.

This is not a scatter of a thousand separate defects. It is a handful of components repeated on
every screen, which is why it is worth more than the minor severity first assigned to it:

| Control | Size | Occurrences |
|---|---|---|
| Font-size controls, all three labelled `A` | 45×20, 43×20, 48×20 | 528 officer + 147 applicant |
| The bar's unlabelled icon buttons | 49×16, 48×16 | 528 officer + 189 applicant |
| `Skip to Main Content` | 169×20 | 176 officer + 49 applicant |
| Language switch `English` | 121×20 | 176 officer |

**The bar that exists to serve accessibility is itself the worst offender against it**, and every
one of those rows is one CSS fix applied once.

The remainder are real product controls, and they are the ones a citizen uses most: `View` (60),
`Replace` (36), `Re-verify` (36), `Edit` (31), `Start a fresh application` (31), `Request change`
(20) and — least defensibly — `Delete` (3). A destructive action below the minimum target size is
the combination the criterion was written for.

> Corrects the figure of 1,575 in the first draft of this document, which counted every element
> rather than only pointer targets. 2.5.8 applies to targets, so the narrower count is the right
> one. The finding stands; its size and shape were wrong.

### 🟡 m2 — Reference IDs embed an address, and test data is visible
`GIA/2026-27/SMILE/NICOBAR_ANDAMAN_AND_NICOBAR_IS/83947` and
`GIA/2026-27/SHRESHTA_M2/123_QA_TEST_ROAD_NEW_DELHI_NEA/83878`.

The identifier encodes a truncated address, so it is fragile (a corrected address changes the ID)
and leaks location into every list, export and email. `123_QA_TEST_ROAD` is QA data surfacing in a
demo environment stakeholders will see.

### 🟡 m3 — Validation messages read as a label with "is required" appended
"Select the existing project to renew is required." · "Installment is required." The first is not a
sentence. Messages should name the field and the action: *"Select the project you are renewing."*

### 🟡 m4 — The footer credits the toolkit vendor, not the Ministry
"© 2026 - Copyright UX4G. All rights reserved. Powered by NeGD | MeitY Government of India ® 2026
UX4G" — on a Ministry of Social Justice & Empowerment portal, the copyright line names UX4G twice
and the Ministry not at all. The ® symbol is also misapplied.

### 🟡 m5 — Ten distinct corner radii, including an impossible one
Captured values include `5px`, `6px`, `9px`, `12px`, `20px`, `9999px` **and `33554400px`** — the
last is a runaway value, not a design decision. A system should carry three or four.

### 🟡 m6 — Poppins appears alongside Noto Sans
99 elements render in Poppins against 19,143 in Noto Sans. A residue of the vendor's own styling,
inconsistent with the estate's single-typeface rule.

### 🟡 m7 — The form card occupies the top third of the screen and nothing occupies the rest
On a 1440×950 viewport, NAPDDR step 1 asks three questions in a card ending at roughly 940px, with
the remaining half of the viewport empty below it. The card is a fixed-width panel pinned to the
top of a full-height page.

Short steps are correct — three questions is the right size for step 1 of 10. The problem is that
the page does not adapt to them: the same layout that looks balanced on a long step looks abandoned
on a short one. Centring the card vertically when it is shorter than the viewport, or letting the
stepper and the card share the height, costs one rule and removes the impression that content
failed to load.

### ⚪ n4 — A "Back" button on step 1 of 10
It sits beside "Next →" on the first step, where there is nothing to go back to. Either it leaves
the wizard — in which case it should say so, because an applicant on a saved draft has to guess
whether it discards their answers — or it does nothing, in which case it should not be there.

### ⚪ n1 — "Good morning, Demo" is the page's main heading
A greeting is not the subject of the page. The `<h1>` of an applicant's grant portfolio should name
it. The greeting can stay as secondary text if it is wanted at all.

### ⚪ n2 — "Select Scheme" names the mechanism, not the task
The navigation item that begins an application is labelled after the first form control the
applicant will meet. "Apply for a Grant" is what they came to do.

### ⚪ n3 — The floating accessibility widget overlaps table content
The UX4G launcher sits over the last row of Recent Applications at 1440×1936. Per
`floating-element-placement.md`, a corner occupant must not obscure content.

---

## Findings — officer portal (24 roles, 176 screens)

The first draft of this document drew its screen-level findings from the applicant portal. This
section covers the officer side: five ranks (ASO, SO, US, DS, JS) across two directorates
(Programme Division and Integrated Finance Division), for each of two schemes, plus four PMU and
Programme Director accounts.

### 🟠 O1 — A scheme's name is baked into a URL twenty roles share
`/dashboard/sm2/reports` is served to **all twenty** section-officer accounts — including the ten
AVYAY officers, who have no SHRESHTA Mode 2 work. `/dashboard/sm2/audit` does the same for six.
An AVYAY Joint Secretary reads their audit trail at a SHRESHTA address.

This is the same defect as `NAPDDR SANCTIONED` appearing in the applicant status list (M4): a
scheme identifier has escaped into a shared, cross-scheme surface. It is worth fixing at the level
where it keeps recurring — a scheme is data, and no shared route, status or label should carry one.

### 🟠 O2 — A rank is baked into a URL four other ranks use
`/dashboard/pd/us/sanctioned` — `us` being Under Secretary — is the sanctioned register for **all
five** Programme Division ranks. An Assistant Section Officer reads it at the Under Secretary's
address; so does the Joint Secretary. `/dashboard/pd/us/all-applications` behaves the same way.

The portal has ten near-identical route trees (`/dashboard/pd/{aso,so,us,ds,js}` mirrored under
`/dashboard/finance/…`), each with its own `queries` and `rejected` pages. **The rank is not what
varies — the worklist filter is.** One route per surface with the rank supplied by the session
would collapse ten trees into one and remove the class of bug where a shared page keeps someone
else's name.

### 🟠 O3 — The widest column on an officer's worklist is a machine key
On the Under Secretary worklist, `GIA ID` is **517px** of roughly 1,200 available; `NGO` — the
thing an officer actually scans for — gets 121px. Across all captured tables the GIA column runs to
a median 330px.

It is wide because of what is inside it. The identifier's fourth segment should be a State or UT.
Across 85 identifiers it actually holds:

| What appears there | Examples |
|---|---|
| A truncated street address | `45_ELDER_CARE_LANE_TEST_NAGAR_`, `12_RETEST_LANE_PITAMPURA_NEW_D`, `123_QA_TEST_ROAD_NEW_DELHI_NEA` |
| A scheme name | `AVYAY`, `SHRESHTA_M2` |
| A workflow word | `PIPELINE`, `PROVISIONAL`, `DEMO` |
| Keyboard input | `QSDASDASD`, `HGHGHFG`, `HH` |
| A duplicated or truncated state | `LAKSHADWEEP_LAKSHADWEEP`, `NICOBAR_ANDAMAN_AND_NICOBAR_IS` |
| A misspelt state | `LADHAK` |
| Three different granularities | `KA` (code), `NEW_DELHI` (state), `SOUTH_EAST_DELHI` (district) |

Every value stops at exactly 30 characters, which is what tells you the segment is being derived
from free text rather than chosen from a list.

Three consequences, in order of seriousness. **An applicant's street address is inside an
identifier that appears on officer worklists, in exports and in correspondence** — a privacy
exposure, not a formatting problem. **The identifier is not stable**: correcting an address would
change the ID of a live case. And **it makes the table unreadable**, because the column has to be
sized for the worst value in it.

Fix the generator — a State/UT code from a fixed list — and the column, the privacy exposure and
the stability problem all resolve together. Existing IDs will need a migration, which is why this
is worth raising before the scheme opens rather than after.

### 🟠 O4 — The rank ladder is written four different ways
The labels an officer sees for the same set of five ranks are not built to one pattern:

`IFD-ASO Review` · `IFD-SO Review` · `IFD-US Review` · `IFD-DS Review` · but `JS-IFD Review`

Four put the directorate first; the fifth inverts it. Alongside these sit `Submitted / ASO` (a
slash), `JS-PD approved · with US-PD` (a middot), `SO Review` and `DS Review` (no directorate at
all), `Sm2 Rejected` (a scheme, sentence-cased by a generic string helper) and `Finance Rejected`
(a directorate) as members of the same status family.

An officer learning this system has to learn that six shapes mean one thing. Pick one — 
`<Directorate>-<Rank>` — and let the renderer build every label from the same two fields.

### 🟠 O5 — Every page's first heading is the Ministry's name
All 176 officer screens carry two `<h1>`s: `Ministry of Social Justice & Empowerment` at 20px in
the masthead, and the real page title at 24px. A screen-reader user navigating by heading arrives
at the same masthead heading on every page before reaching the one that says where they are — and
the page has two competing document titles.

The masthead is an organisation mark, not the document's title. One change, applied once, fixes
this on all 176 officer screens and the applicant screens under M10.

### 🟡 o6 — The `A` controls are three buttons with one name
The font-size controls are 45×20, 43×20 and 48×20, and all three carry the visible text `A`. Their
distinct meanings — decrease, reset, increase — are carried entirely by size and position.

Whether they have accessible names is **not established**: the capture records visible text, not
`aria-label`. If they do, the finding is target size only (see m1). If they do not, three
identically-named adjacent controls is a 4.1.2 failure and should be re-graded. **This needs a
screen-reader check before it is reported as fixed or dismissed.**

### ⚪ o7 — The 24 roles are more alike than the account list suggests
Only two surfaces are common to all 24 officer accounts: Notifications and NGO Directory. Beyond
those, the ten PD accounts see one set, the ten IFD accounts another, and the four PMU/Director
accounts a third. **Five ranks within a directorate see the same screens** — the rank changes the
queue's contents, not its design.

Not a defect. Worth stating because it sizes the redesign honestly: this is roughly **three officer
experiences with a filter**, not twenty-four portals.

## What the officer capture could not reach

The route crawl follows the sidebar, and **no sidebar links the screen where a grant is actually
decided.** It sits behind a `Review` button on a worklist row. So the corpus holds every officer
list, register, report and directory — and not the one screen where forwarding, returning,
querying, sanctioning and rejecting happen.

That screen is the officer portal's centre of gravity and it is **not in this audit**. Reaching it
needs a flow that opens a worklist row, which the driver can now do.

It should stop there. Capturing the decision screen and its dialogs is safe and additive; pressing
*Forward*, *Approve*, *Return* or *Reject* is not — those mutate cases the other 23 demo accounts
are staged against, and a UAT environment that stakeholders are about to be shown is not a place to
spend that state. The wizard submissions this run performed are additive: they create new records
and take nothing away. Officer decisions are the opposite, so those flows should carry
`allowSubmit: false` and let the gate refuse the click.

## Systemic reading

Three patterns sit underneath most of the findings above.

1. **The product speaks in departmental voice.** Statuses, validation messages and identifiers are
   written for the officers who process the file, not the organisation that submitted it. This is a
   Layer 2 vocabulary problem, and it will keep resurfacing screen by screen until the status
   vocabulary is defined once, in applicant language, with the internal stage as a separate field.

2. **Each scheme has been built as its own product.** Different step counts are legitimate — the
   schemes genuinely differ. Different *forward-button behaviour*, different document enforcement,
   and a scheme name leaking into a status list are not. The shared shell is real; the shared
   interaction contract is not yet.

3. **Formatting is decided per component.** Money, dates and identifiers each have two or three
   conventions on a single screen, which is what happens when formatting lives in the component that
   renders it rather than in one place.

---

## Recommended order of work

1. **B1 captcha** and **B2 required fields** — both are accessibility blockers on a government
   service, and both are small changes.
2. **M3 + M4 status vocabulary** — one applicant-facing status set, scheme as a separate dimension.
   This unlocks M5 (the donut becomes readable once the taxonomy is fixed).
3. **M1 + M2 forward-button contract** — one behaviour, always explained, documents genuinely
   enforced.
4. **M7 + M8 formatting** — a single money formatter and a single date formatter, applied estate-wide.
5. **M10 + O5 hierarchy** — one `h1` per page. A single change clears both portals.
6. **O3 identifier generator** — a State/UT code from a fixed list. It is ahead of the cosmetic
   work because an applicant's address is currently inside an identifier that reaches officer
   worklists and exports, and because existing IDs will need migrating — cheaper now than after
   the scheme opens.
7. **m1 accessibility bar** — four repeated controls below the 24px target minimum, one CSS fix
   each, applied on every screen in the estate. Do the `Delete` control in the same pass.
8. **O1 + O2 routes** — a scheme name and a rank sitting in URLs that twenty and five roles share.
   Structural, so it wants its own change; O4's label pattern travels with it.
9. **M9 row labels**, then the remainder in a housekeeping pass.

---

## What this audit does NOT cover

Stated so nobody reads more into it than it earns.

- **Colour contrast is largely unverified.** Only 1,385 of 19,280 text elements had a resolvable
  background; the rest sit on transparent backgrounds and the capture does not record the inherited
  one. One genuine failure was found (`4.39:1` on "Auto-populated from DARPAN", needs 4.5). The rest
  needs a browser-based pass. *Engine improvement recorded: resolve effective background by walking
  ancestors.*
- **Keyboard and screen-reader behaviour** was not exercised. Structural markup was analysed; actual
  focus order, focus visibility and announcement were not.
- **Hindi / bilingual rendering** was not reviewed; the language toggle was not exercised.
- **Accessible names were not captured.** The extractor records visible text, not `aria-label`,
  `title` or `alt`. So 2,792 officer-side buttons that carry no text node cannot be judged either
  way, and o6 is deliberately left open rather than reported as a failure. *Engine improvement
  recorded: capture the computed accessible name alongside the visible text.*
- **The officer decision screen is absent**, and it is the most important screen in the system. It
  sits behind a `Review` button rather than a sidebar link, so the route crawl never reached it.
  See "What the officer capture could not reach" above.
- **No officer decision was exercised.** Forward, Return, Query, Approve and Reject were never
  clicked. Their screens are unaudited, and the workflow is judged from lists and statuses only.
- **Mobile and tablet layouts** were not captured. Every screen in this corpus is 1440px wide.
