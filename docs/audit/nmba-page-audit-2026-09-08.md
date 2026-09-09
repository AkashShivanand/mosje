# Nasha Mukt Bharat Abhiyaan — page audit, 8 September 2026

Scope: `/website/organisation/nasha-mukt-bharat-abhiyaan`, audited against
[dosje.gov.in/organisation/nasha-mukt-bharat-abhiyaan](https://www.dosje.gov.in/organisation/nasha-mukt-bharat-abhiyaan/)
as published on 7 September 2026, the Figma handoff
(`Ds5qx61QsI0ZkYSrLKxo0A`, canvas `69:589`), and the 7 September design review.

This file exists because `ui-restraint-and-copy.md` §1 keeps feed diagnostics,
absence notes and unreconciled arithmetic **off the page**. Everything below was
found while working on the page and is either fixed, or is recorded here because
it needs a decision the build cannot make.

---

## 1. Content parity — one gap, and it is an arithmetic problem

Every section the source publishes is on the page: the campaign band, the hero
and its four photographs, the eight counters, the six institution definitions,
the geo-tagged map, all six document shelves and their fifteen files, the three
gallery photographs, the five ministerial statements, the four social channels,
the two contact officers and the ten subject tags.

**The one thing the source shows and this page does not is the per-institution
breakdown of the published total**, printed beside its map as a colour key:

| Institution type | Source's key | Plotted here | Difference |
|---|---:|---:|---:|
| IRCA | 344 | 282 | 62 |
| ATF | 155 | 56 | 99 |
| DDAC | 145 | 91 | 54 |
| ODIC | 76 | 33 | 43 |
| CPLI | 45 | 10 | 35 |
| SLCA | 21 | 15 | 6 |
| **Total** | **786** | **487** | **299** |

**It was not added, and the reason is the last row.** The source's own key sums
to **786** while the same page states the total as **768** — an eighteen-centre
discrepancy in the Department's published figures, not in our reading of them.
Putting both sets of six numbers on one screen would give a citizen two answers
to "how many ODICs are there" with nothing to say which is true, which is the
defect `data-state-completeness.md` §2 exists to prevent, and it would publish a
total that does not add up on a Government of India page.

**This needs the Department, not a build decision.** Ask which of 768 and 786 is
current; the breakdown goes on the page the day the two reconcile.

---

## 2. What was taken OFF the page, and where it went

| Removed | Why | Where it still is |
|---|---|---|
| The `14446` fact in the hero strip | The green band 200px above prints the same number in 24px inside a white pill. `ui-restraint-and-copy.md` §1 — say it once. It was also the only element of an over-full first fold that could go without losing anything | The campaign band; the map's own "24×7 Helpline" footer |
| "Videos" and "Events" tabs on the Gallery | Three `<button>`s with no handler, no `role="tab"`, no panel and no `aria-selected`, on **every** organisation page with a gallery. The record holds photographs only, so two of the three pointed at nothing | Nothing lost — no video or event content exists to reach |
| Six "Showing N of N documents" lines | The line is `aria-live` and exists to announce a filter change. With one shelf per panel there is no filter, so it restated the number of cards directly beneath it, six times on one page | The line still renders wherever a chip row exists to change the count |
| The counts in the "Geo-Tagged De-addiction Facilities" standfirst | It said "the 487 with recorded coordinates are plotted here" six hundred pixels above the map's own footer saying "482 centres plotted". Only the footer can derive what was actually drawn | The map footer, which is now the single answer |

---

## 3. Open items — decisions, not defects

**a. The centre list scrolls inside its card.** `data-state-completeness.md` §4
says never to scroll a region inside a card, and the de-addiction explorer does:
the list pairs with the map viewport and clips its last row mid-word. It is
arguably the exception the rule did not consider — a list bound to a map is not
a list of content — but it ships on three surfaces (`/website`,
`/website/de-addiction-centres`, and this page) and re-engineering it is its own
change. **Not fixed here. Worth a decision.**

**b. The notice strip's headlines are the Department's own truncated titles.**
The first NAPDDR notice in the ingest begins mid-sentence — *"applying of
ongoing proposals under NAPDDR (IRCA/ODIC/CPLI/SLCAs) by the organisations who
has not applied so far…"* — because that is the title `documents.json` carries,
and `ui-restraint-and-copy.md` forbids rewriting what the Department published.
The strip clamps to two lines and links to the document. **The fix is upstream,
in how those titles are captured or published; nothing on this page can honestly
correct it.**

**c. The observance has no published closing date, and the ribbon no longer claims one.**
A date stood in the ribbon — "until 30 September 2026" — and it was **invented**. The
review that asked for the ribbon never named a window. `organisation-details.ts`
forbids exactly that ("an invented statistic on a government page is a defect of a
different order from a layout bug"), and a closing date is worse than most, because a
citizen can plan around it. It is removed and the sentence reads whole without it.
**Get the Department's own window and put it back** — the field is still on the type and
the ribbon prints it in bold inside the sentence.

**d. The second pre-event route was not confirmed in the review.** The occasion
ribbon offers two doors — the administrative login for line Ministries and
Departments, the open activities register for autonomous bodies and corporate
participants. The second was described in the review as still needing
confirmation, and as needing an email-verified open form that does not yet
exist. It currently points at `/portals/nmba/activities`, which is open and
carries the event form, and is the closest real destination. **Confirm the route
before the observance opens.**

**e. "Admin Login" was left alone, deliberately.** The review opened with a
proposal to rename it to "Login" and closed by keeping "Admin Login" — a plain
"Login" invites citizens into a door only officials can pass, and the login page
does not yet carry the citizen/official split that would make the rename safe.
Recorded here so the next session does not re-open it as an oversight.

**f. The three-fact strip leaves an orphan below 640px.** Three cells in a
two-column grid puts the third alone on its own row. Accepted: the alternative
is a third column at 130px, where every label wraps to four lines.

---

## 4. Design defects found and fixed

| # | Defect | Fix |
|---|---|---|
| 1 | Six document shelves rendered as six full-width bands — 2,400px for fifteen files, three of them holding a single card in a three-column grid | One band, the Department's six headings as tabs |
| 2 | The page index's "Documents & Downloads" link pointed at an element that did not exist — `layout: "sections"` gave each shelf its own id and none carried `documents-downloads` | The tabbed band carries the anchor |
| 3 | Six institution cards on a saffron wash carrying **blue** icon chips, while the fact strip a thousand pixels above carried **saffron** chips on white — two answers to "what does an icon chip look like" on one page | The cards join the estate's white card language; saffron is left to the fact strip |
| 4 | Two institution cards drew visually identical glyphs (`local_hospital` and `medical_services` are both a cross in a box), and a third (`meeting_room`) drew a door that read as nothing | ODIC takes `support_agent`, ATF takes `monitor_heart` |
| 5 | The institution definitions — the page's longest reading passage — were set in `body-3`, the caption size | `body-2` |
| 6 | Five ministerial statements in a two-column grid: three rows, a lone card on the last, and a 200px well of empty card beside the shortest statement | A carousel, which is also the source's own arrangement |
| 7 | "Social Justice & Empowerment" ran flush to the fact card's inner edge at 1440 and sat under the chatbot launcher | Three facts, so each takes a third of the card |
| 8 | The occasion ribbon's `border-inline-start: 3px` pushed its own container 3px (5px at 1920) right of every other section's | An inset shadow — paints the same, occupies nothing |
| 9 | The ribbon's secondary route was a 16px-tall link, below WCAG 2.2 §2.5.8's 24×24 minimum for a standalone control | `padding-block` takes it to 24px |
| 10 | The notice bar drew a 223-character title over four lines, turning a 72px strip into a block of body copy | Clamped to two lines in the bar; the panel is untouched |
| 11 | Three near-identical NAPDDR notices, same date, would have cycled past as one notice repeating | Deduplicated on the first eighty characters of the title |
| 12 | "View all iec materials" — the shelf name lower-cased to fit a sentence, against the Title Case rule | "View All", with the shelf named for screen readers |
| 13 | Each tab's four files still wrapped to a second row in a three-column grid, leaving two thirds of that row empty under every shelf | `DocumentLibrary` gains `layout="rail"` — one row that scrolls sideways, the fourth card cut by the container edge |

---

## 5. Accessibility audit, 8 September — and the one finding that was not a defect

A full pass: axe across 33 routes, manual keyboard traversal, computed-contrast
sampling on every text leaf, 320px reflow, 200% zoom, and `prefers-reduced-motion`.
**Zero critical.** Five major and three minor, all now closed.

| # | Finding | Criterion | Fix |
|---|---|---|---|
| 1 | The join banner's `<h2>` rendered **above** the page's `<h1>` — the outline opened at level 2, on every organisation page with a campaign band | 1.3.1 | The band is a promotional aside, not a section. It is a `<p>`, and `aria-labelledby` still names the region from it |
| 2 | A four-slide hero carousel cost **7 tab stops** before a keyboard user reached a word of the page | 2.4.3 | Roving tabindex on the dot row: 7 → 4, with Left/Right/Home/End between dots. Nothing removed — a mouse user can click dot 3, so a keyboard user must reach dot 3 |
| 3 | `.ds-carousel__track` drew the browser's `1px auto` ring against the estate's `2px solid` everywhere else | 2.4.7 / consistency | Bound to `--sa-focus-width` / `--sa-focus-ring`, inset because the track is full-bleed |
| 4 | Four links opened a new tab silently — two hero quick actions and the masthead's "Government of India" | G201 | All three of ours now carry the warning; the fourth is the third-party widget's own link |
| 5 | Leaflet's attribution measured **3.64:1** — and it carries the OpenStreetMap credit the licence obliges us to display | 1.4.3 | Opaque plate, estate link ink: **6.36:1** |
| 6–8 | UX4G widget: a 10×10 close button, 36×20 toggles, a panel overflowing at 640px | 2.5.8, 1.4.10 | Third-party, MeitY-mandated, already a declared deviation |

**What passes, measured rather than assumed:** `lang`, one `h1`, 31 images all
with `alt`; no horizontal page scroll at 320px or at 200% zoom; the ticker
autoplays with a real pause control **and does not advance at all under
`prefers-reduced-motion`**; and the footer's 20px links clear 2.5.8 through the
spacing exception on a 32px pitch.

**A correction worth recording.** The brief this audit ran from listed "2.5.5
Touch target ≥ 44×44" as WCAG 2.1 AA. It is not — 2.5.5 is Level **AAA**, and
the AA criterion is 2.2's **2.5.8 at 24×24**. Under the wrong figure this report
would have opened with 26 footer-link failures that are not failures.
`standards-precedence.md` names this exact error: getting it wrong sits invented
findings beside real ones and devalues both.

### The finding that was not a defect

**Every primary brand surface on the dev server was rendering `#095e34` India
Green** — the Admin Login button, the ticker plinth, the selected document tab,
the focus rings. The committed tokens, `packages/tokens/dist`, and the production
build all say `#005eb9`; the value came from `brands/_starter/brand.json`, the
template pack. The dev server was serving a chunk compiled while another branch
was checked out, and it had been doing so for hours.

Restarting it restored blue. **Nothing was wrong with the design and nothing
needed fixing** — but any visual sign-off taken from that preview was taken
against a colour the estate does not ship, and screenshots from either side of
the restart disagree for that reason. Restart before a visual review.

---

## 6. Every document link is now local

Requested 8 September: replace the documents with local dummy files, keeping the
embedded images as they are.

**What it replaced.** Every "Download PDF" on the website left the estate for
`durwo6bhtjtqt.cloudfront.net` or `dosje.gov.in` — so a reviewer on a laptop with
no network got nothing, and a demonstration that the shelves work depended on a
third party staying up. The images were mirrored months ago; the documents never
were, deliberately, because a mirrored PDF is a stale snapshot presented as the
Department's current file.

**What it is instead.** Not a mirror — eight obvious **samples**, watermarked
SAMPLE on every page, with a banner and a footer saying what they are, invented
particulars throughout and zeros where a real file would carry figures. 432 KB
for the set, against roughly a gigabyte if all 1,962 ingested documents got their
own file. `apps/hub/src/lib/website/sample-documents.ts` picks the kind from the
document's own category and title, so a newsletter card opens something
newsletter-shaped and a circular opens a memorandum.

**What is deliberately not rewritten.** A link is replaced only when it points at
a FILE — a document extension, or the Department's document CDN. Pages keep their
own addresses: the tag index, the e-pledge form, the Instagram profile, the "View
all" routes into dosje.gov.in's listings. Sending a reader to a sample PDF instead
of a page would be a worse lie than the broken download this fixes. Locally-served
images — the campaign mark, the mascot, the two QR codes — are untouched.

**The rule this needed a test for.** "Committee formation — letter to all States"
first resolved to a **form**, because `format` is a substring of `formation`.
`sample-documents.test.ts` pins twelve real departmental titles against their
kinds, and the correspondence rules now run before the form rules with every form
word bounded.

---

## 7. First-fold audit, and the five things it changed

Audited as a design director on 8 September, after the work above had shipped.
**The finding that mattered most was self-inflicted**, and it was only visible by
measuring rather than looking at a full-page capture.

### The fold did not contain the fold

The notice strip and the occasion ribbon were both added this week with commit
messages claiming they sat "high on the page". Measured at four real viewports:

| Viewport | Band | Hero | Fact strip | What's New | Ribbon |
|---|---|---|---|---|---|
| 1440×760 · 13" laptop | full | cut | **below** | **below** | **below** |
| 1512×820 · MacBook Air | full | cut | **below** | **below** | **below** |
| 1920×955 · 24" desktop | full | full | cut | **below** | **below** |
| 390×664 · phone | full | cut | **below** | **below** | **below** |

Neither strip was above the fold on any device. The composed fold ran 236→1201px
— 965px of band — and no laptop shows more than 760 of it. The review had asked
for the first fold to carry LESS; it carried more, and the additions landed where
nobody sees them without scrolling.

### The five fixes

| # | Finding | Fix |
|---|---|---|
| 1 | The ribbon was below the fold on every device | Moved above the hero, after the campaign band. `full` at 1440×760, 1512×820 and 1920×955 |
| 2 | Three fact cells at 405px around 150px of content — 63% air, and three unrelated statements rather than a strip | Four cells at 301px |
| 3 | The helpline was removed as a duplicate of the campaign band's pill — **but that band is dismissible**, so pressing its X removed the only remaining instance of the number from a page about drug de-addiction | Restored as the fourth fact |
| 4 | `#a43a00` filled was the only saturated fill below the masthead, so a six-week campaign strip out-shouted the page's permanent primary action | Outlined, through `--sa-btn-edge` |
| 5 | The ribbon's 40px calendar tile pushed its copy to x=140 while everything else in the fold began at 84 | Mark removed; every element in the fold now starts at **84** |

### What was NOT changed, and why

**The What's New strip is still below the fold**, on every viewport. Moving it
above the hero would put three bands before the page title, which is the stacking
the same audit criticised. It is a permanent notice board rather than a
time-limited campaign, so it can afford to sit where a reader arrives at it; the
ribbon could not. Recorded rather than fixed.

**Three apparent misalignments were left alone** because they are two-column
rows, not stray indents: the notice strip's headline at x=290 sits beside its
plinth, the campaign band's heading at x=470 sits beside the helpline pill, and
the fact strip centres its cells because that is the `FactStrip` component's own
design. Calling those failures would have padded the count.

**The Ministry fact is the weakest of the four** — a reader on the Department's
own site is told the Department twice by the masthead already. It stays only
because removing it returns the strip to three, which measured worse. Replace it
the day the source publishes a fourth figure worth the space.

### The follow-up, and the estimate that was wrong

Moving the ribbon above the hero pushed the hero down by 66px, so the hero's own
buttons went from CUT by the 13-inch fold to 39px below it — one visibility
problem traded for another. Three options were costed; option 1 was chosen:
put the ribbon's occasion and sentence on one line and tighten its padding,
estimated at **30px recovered**.

**It recovered 16, and the estimate was wrong for a reason worth recording.** The
ribbon's height was never set by its stacked copy. Measured: the band is 66px, of
which 40 is the DISMISS BUTTON — taller than the call to action beside it (32) and
than the copy (20 per line). The copy stacking cost nothing, because it was
shorter than the control next to it either way. An estimate made by reading a
stylesheet instead of measuring the rendered box.

What the pass did achieve, all of it worth keeping on its own merits:

| | Before | After |
|---|---|---|
| Ribbon height | 66px | **50px** |
| Occasion + sentence | two lines | **one**, at 1440 and above |
| Eyebrow | "SIX YEARS OF NASHA MUKT BHARAT ABHIYAAN" — restating the H1 directly below it | "SIX YEARS OF THE ABHIYAAN" |
| Dismiss control | 40px, the tallest thing in a campaign strip | 32px, the DS `sm` height, still clear of §2.5.8's 24 |
| Hero buttons at 1512×820 | cut | **cut by 3px** — effectively visible |
| Hero buttons at 1440×760 | 39px below the fold | **23px below** |

**The hero's buttons are still below the fold on a 13-inch laptop, and no
remaining change inside the ribbon can fix that.** The budget: 236 of masthead
and breadcrumb, 116 of campaign band, 50 of ribbon, and 364 from the hero band's
top to its buttons — 766 before a 40px button that has to fit inside 760. The
next 54px has to come from the campaign band or the hero's own internal spacing,
and the hero is a template shared by 178 pages. That is a decision, not a tweak,
and it is recorded here rather than taken.

---

## 8. Two gate findings, spun off

**`check:link-as` can be fooled by a `>` in a comment.** Its tag scanner stops at
the first `>` at brace depth zero without skipping comments or strings, so a
comment written between props ends the tag early. Here it produced a false
failure. The serious direction is the other one: the same scan would stop before
a **missing** `linkAs` and pass it, which is the silent full-page-reload defect
the gate exists to catch.

**`Pagination` declares `onClick` twice on its disabled step.** `tsc` reports
TS2783 on `main`. The spread lands last so the guard wins at runtime, but moving
it above the explicit props would silently re-enable navigation on a disabled
arrow.

Both are recorded as separate tasks; neither is fixed here.

---

## 9. The QR plate, the logo, and the explorations register — 08 Sep 2026

### 9.1 The QR's "thick white outline" was a DOUBLED quiet zone

Reported as a border on the code. It is not a border and never was one. The
asset — `nmba-nasha-mukti-mitr-qr.png`, 686x686 — carries the quiet zone the QR
specification requires **inside the image**: 56 white pixels on every side, 8.2%
of the file. `.orgjb__qr` then drew a 6px white plate and a radius around it, so
the reader saw the asset's own margin plus ours, and read the sum as a stroke.

Removed: `padding: var(--sa-padding-6)` and `background-color:
var(--sa-bg-neutral-base)`. Kept: the radius, now with `overflow: hidden` so it
clips the asset rather than describing a plate that is no longer painted.

### 9.2 The logo's "white cast" is not on `main`

Measured on the running build at 3x device scale, scanning the row through the
mark's vertical centre: brand blue `rgb(3, 114, 221)` runs from x=0 to x=41 and
becomes the seal's green `rgb(60, 128, 109)` at x=42, with no lighter pixel
between. The wrapper computes `background-color: rgba(0, 0, 0, 0)`, `border:
0px`, `border-radius: 0px`. The PNG itself is opaque green to x=383 with
transparent corners — no baked-in ring.

The disc was removed in PR #388 (`07fe7e7b`). A white ring seen now is a cached
page or the older deployment, not the current build.

### 9.3 Explorations — a place for options to be kept

`/explorations` is a new hub zone, outside `/website` and `/portals` and marked
`noindex`. It holds design options as **running prototypes at their own
address**, organised page-wise then module-wise, with the question each module
answers and what became of every option. Nothing under it is imported by a
citizen-facing page, and choosing an option is an act of moving code — never of
flipping a flag production is reading.

Registered so far: four NMBA decisions, nine options — the campaign band (two,
both live and both open), Documents & Downloads (three), the first fold's ribbon
placement (two), and the hero mark's ground (two).

**The stage is the real fold.** The first version of the campaign-band prototype
stubbed the hero — a flat blue bar with the mark and one line of title — and it
was rejected on sight, correctly: the question is where a badge LANDS in the
fold, and it cannot be answered against a hero that is not the hero. The
prototype now composes `PageTrail`, `SitePageHeader` and `FactStrip`, the same
three components the live organisation route uses, fed the Abhiyaan's own record
and its own mark through `orgLogoSrc`.

### 9.4 The flight, and two measurements that changed it

The helpline travels from the band into a badge beside the mark, built with the
Web Animations API and a FLIP ghost. **Motion was considered and not installed**
— 35 KB gzipped and a main-thread animation loop, for one transition that fires
once per session, on the part of the page where hydration and image decode are
still competing.

Two things were wrong on the first build and both were caught by measuring
rather than looking:

| What | Measured | Fixed by |
|---|---|---|
| The band left a 24px green strip and the badge landed 24px low | `grid-template-rows: 0fr` floored at exactly the collapsing child's 12px block padding — `min-block-size: 0` releases the CONTENT box, and padding sits outside it | A bare `.xband__clip` between the band and its padded inner |
| The badge "teleported then settled" | `--sa-motion-reveal-easing` covered **93% of the distance in the first 45% of the time**; it is an arrival curve, not a travel curve | `--sa-motion-emphasis-*` — same 400ms, `cubic-bezier(0.4, 0, 0.2, 1)` |
| The flight was a 66px twitch | Centring a 297px pill on a 109px badge started the ghost at x=208 when the pill's own edge was at x=109 | Align the LEADING edges, where both carry the same icon well: 132px on a real diagonal |

Landing is computed, not measured: the badge sits below the band in normal flow,
so a band collapsing to zero raises it by exactly the band's height. Predicted
and actual landing agree to the pixel — `{1205, 670}` at 1440x900.

Verified: `prefers-reduced-motion` mounts no ghost at all and swaps instantly;
the badge is `aria-hidden` and out of the tab order until it arrives; the live
region is mounted empty from the first render and names what MOVED rather than
what went.

**One consequence a stakeholder has to decide, not us.** The fact strip carries
"14446 / National de-addiction helpline" only because the band is dismissible
(§4). If the badge carries the number instead, the fold shows it twice, and that
fact should go back to being the Abhiyaan's fourth figure. Recorded on the
option rather than resolved in it.

Stills: `docs/audit/img/flight-{1-before,2-midair,3-after}.png`, captured at
1440x900 / DPR 2 with the animation clock frozen at 200ms for the mid-air frame.

---

## 10. The two bands, rebalanced — and the white cast finally located

### 10.1 What the audit measured, before

Green band, 1440×104, content `x=84…1356`:

| | x | w | h |
|---|---|---|---|
| helpline pill | 84 | **362** | 48 |
| copy | 470 | 387 | 70 |
| QR | 881 | 72 | 72 |
| CTA | 961 | **331** | 32 |
| dismiss | 1316 | 40 | 40 |

**The gaps were 24 · 24 · 8 · 24.** That single 8 was the defect: it welded a
scannable code to the left edge of a button, in the middle of the band, between
a sentence and that sentence's own action — so a reader met the code before they
met the thing it was a shortcut TO.

**Five heights, one shared centre, no shared edge.** 48 / 70 / 72 / 32 / 40, all
optically centred on y=305. A centre line is invisible; a flush top and bottom is
not. That is what "unbalanced" was describing.

The brightest, widest object was the helpline — 362px of pure white — and it was
not the band's message. The CTA label was two clauses with a comma splice, 331px,
opening the same URL as the 72px code beside it. The dismiss carried a permanent
12% white wash in a 40px box, more painted surface than any control on the ribbon
below it.

### 10.2 What it is now

```
[QR] ─24─ Join Nasha Mukt Bharat Abhiyaan ─24─ [Register Now] ──40── [Helpline 14446] ─24─ ×
 └──────────────── the campaign, one sentence ───────────────┘        └ a standing service
```

Measured: QR 72 · copy 580 · Register 180 · Helpline 296 · × 32, gaps 24 / 24 /
**40** / 24. Two numbers, and the 40 is the helpline's own leading margin —
because the separation belongs to the thing being set apart, not to the campaign.

The QR leads and takes the row's full 72px height, so the band has a left edge
the eye can measure everything else against. The helpline is the only filled
control in the band and it is no longer paired with the campaign's button: they
had read as two halves of one offer, and it is not part of the offer.

Two labels were shortened, both with the department's full wording kept as the
accessible name so the visible text is contained in it (WCAG 2.2 §2.5.3):
`Register Now, Be a volunteer for change` → **Register Now** (the dropped clause
restates the band's own sentence 200px to its left), and `National De-Addiction
Helpline` → **De-Addiction Helpline** (364px → 296px; the key-facts strip below
prints it in full). Both are recorded on the record type as explicit fields, not
derived by string surgery.

### 10.3 The ribbon

Four inks on a 48px line — saffron eyebrow, near-black sentence, saffron button,
**brand-blue link** — and the blue was the only blue on a cream ground between a
green band and a blue hero. It now takes `secondaryScale-700`, the same saffron
as the button's edge and the leading rule: one accent.

The second route was one 290px underlined string carrying a question AND an
instruction, so the second-choice route measured wider than the primary button
beside it. It is now plain text plus a link — *No departmental account?* +
**File on the open register** — 175 + 160, against the button's 202. A control's
label is a label; the condition under which to use it is context, and context is
not clickable. Its size went from `label-2` (12px) to the sentence's own 14px.

Both dismisses are now 32×32 with the wash on hover only, where they were 40 and
32 at two different treatments 50px apart.

### 10.4 The white cast around the logo — three passes to find

Reported repeatedly and twice reported as not present, because it is not in the
CSS and not in the visible artwork.

A PNG stores a colour for every pixel **including the fully transparent ones**,
and most exporters write white there. Nothing sees them — until the browser
resizes the image, at which point it interpolates neighbours and the invisible
white bleeds into the visible edge.

Measured on `nmba.png`: **30,907 transparent pixels, every one `rgb(255,255,255)`,
of which 874 sit directly against the seal.**

It shows on the DIAGONALS and not at the horizontal centre, and that is the whole
reason it was missed: the seal fills the square edge to edge left and right, so
there are no transparent neighbours there to bleed. The first investigation
scanned a row through the middle of the mark, found blue running straight into
green, and concluded there was no ring. There was — 45° away from where it looked.

`tools/logo-alpha-bleed/bleed.mjs` dilates each mark's own colour outward into
its transparent region and leaves every alpha byte untouched: no visible pixel
changes value, and the interpolator now blends green into green. These are
indexed PNGs whose transparent entries were all the same white duplicated across
dozens of palette slots, so the repair reuses those redundant slots — `nmba.png`
went 26,291 → 28,498 bytes. Four marks carried the defect: `nmba`, `daic`, `nos`,
`sambal`.

**Two wrong tests were written before the right one**, and both are recorded in
the tool because each looks correct on its own:

| Test | What it reported | Why it was wrong |
|---|---|---|
| "is the transparent pixel pale?" | 308 pixels on an already-repaired `nmba.png` | The seal's own edge around the National Emblem is `rgb(248,252,252)`; a correct bleed looks white |
| "does it differ from its neighbour?" | all seventeen marks | A transparent pixel beside a *partially* transparent one differs by definition — that is anti-aliasing, not a halo |

The test is both conditions together, against **fully opaque** neighbours only.
It does not reach zero and is not a gate: a transparent pixel wedged between two
differently coloured opaque ones can only carry one of them. On `nmba.png` that
irreducible residue is 155 pixels, down from 874 holding pure white.

Before and after at 4× device scale: `docs/audit/img/logo-zoom-before.png` and
`logo-zoom-after.png`.

### 10.5 Not touched

`check` fails on this branch, and none of it is this work: `showNumbers` on
`Pagination` in `smile-admin/(app)/persons/page.tsx`, `website/ui/data-table.tsx`
and the design system's `data-table.tsx` are another session's uncommitted edits
in this shared working tree. They are deliberately not staged and not reverted.

---

## 11. The orange band, cleaner — and the two-bands question as an exploration

### 11.1 What came off the ribbon

**The 3px saffron edge stripe.** It was an inset shadow at `x=0` — the viewport's
own edge, **84px from the content it was meant to mark**, and from the H1, the
lead, the hero buttons and the ribbon's own eyebrow, all of which begin at 84. At
1920 that distance is 260px. A mark that far from everything it relates to is a
stray line down the side of the page, and it is the same argument that removed
this ribbon's calendar tile in an earlier pass. The accent it carried is already
in the band four times over: a saffron eyebrow, a saffron button edge, a saffron
link, on a saffron wash.

**One of its two hairlines.** `border-block` drew a rule above *and* below. The
rule above sat directly under the campaign band, which already ends in a hard
colour boundary — a second line drawn on an edge that existed.

**8px between the eyebrow and the sentence → 12.** The eyebrow is tracked
capitals and the sentence is not; the change of register needs room to register.

The dismiss now carries the same hover-only wash as the campaign band's, so two
dismisses 50px apart behave identically rather than merely measuring the same.

### 11.2 Two options, both live

`/explorations/nmba/top-bands` — *"The fold opens with two announcement bands
stacked. Should they stay separate, or share one?"*

| | Two bands | One band, two panels |
|---|---|---|
| Fold height | 104 + 50 = **154px** of a 760px fold | **104px** |
| Messages visible | both, without the reader doing anything | one at a time |
| Grounds | green and saffron, stacked above a blue hero | green only — the notice gives up its hue |
| Dismisses | two | one |

**What is actually being traded is height against readership, and the exchange
rate is not symmetrical.** Two bands cost a fifth of the fold before the page has
said what it is. One band costs 104px and shows one message at a time, which on
every carousel ever measured means the second is, in practice, unread — the
design system's own `Carousel` says so in its docstring. So the question is not
which looks tidier: it is whether the anniversary notice is worth 50px of every
reader's fold, or worth being seen by almost none of them. Neither prototype
answers that; the Department does.

**Nothing rotates on a timer, and that is not a convenience.** `Carousel`'s
contract on this estate forbids autoplay for anything a citizen reads — a strip
that advances on its own takes the sentence away mid-sentence, and does it most
to the slowest readers. A band carrying a de-addiction helpline and a filing
deadline is exactly that content. WCAG 2.2 §2.2.2 would also require a pause
control for anything moving more than five seconds, which means a **fourth**
control on a row that already has three.

**The switch is dots, not chevrons.** With two panels a reader wants *the other
one*, and a pair of arrows makes them work out which arrow that is. Each dot is a
24×24 target (§2.5.8) with an 8px mark inside it, and the pair is a `tablist`
with arrow-key support.

Stills: `docs/audit/img/bands-opt-two.png`, `bands-opt-one-a.png`,
`bands-opt-one-b.png`, composed as `bands-options.png`.

---

## 12. The helpline card, and the handoff's own banner

### 12.1 The card — one component, two sizes

The glyph moved to the **trailing** edge. Leading, the card read *symbol → label →
number*: the decoration arrived first and the five digits a person is actually
looking for arrived last, at the end of a 296px control. Reversed it reads *label
→ number → act*, which is the order the reader needs them in, and it puts the
moving element on the edge the eye leaves the card by.

`HelplineCard` now renders at `band` and `hero` size from one component, so the
flight in `campaign-band` is **one card changing size** rather than one object
being replaced by another.

**It rings twice on arrival, then stops.** 1.2s × 2 = 2.4s — deliberately under
the five seconds past which WCAG 2.2 §2.2.2 requires a pause mechanism for
content moving beside other content. A fourth control on that row to switch off a
decoration would be a worse band than a still one. After the arrival ring it
answers **hover and focus**, which is where the movement earns its place: it
responds to the reader rather than interrupting them. Under
`prefers-reduced-motion` it never moves.

### 12.2 Two flight bugs the reorder exposed

| | Before | After |
|---|---|---|
| Band order in the flight option | helpline, then QR, then copy — the pre-reorder arrangement | QR, copy, Register, Helpline, as production |
| The arc | `bow = dx / 12`, added to **x** unconditionally — which arcs a vertical path and does nothing at all to a horizontal one | Perpendicular to travel, and **negated**, so the card arcs over rather than sagging under |

The second only became visible when the helpline moved to the band's trailing
edge: the flight went from a 128px diagonal to an **860px** crossing, and a bow
that had been invisible on a short vertical hop became a card diving through the
hero and back up.

### 12.3 `Nudge` — the handoff's composition, built as drawn

`3FF5l0SMNIwdpZrKkeyPTm` node **57774:19709**. Every value read off the node, not
eyeballed from a screenshot:

| | Handoff | Built |
|---|---|---|
| Band height | 168 | **168** |
| Code | 120×120 at 24,24, radius `--sa-shape-6` | same |
| Content | x=168, 1064 wide, two rows, CTAs at y=80 | same |
| Heading | `headline-3` 28/36 semibold | same |
| Ground | `--sa-bg-brand-accent-bolder` → `-boldest` | same |
| Register edge | `--sa-cmp-action-brand-secondary-inverse-default-border` | same |
| Dismiss | 40×40 icon button, trailing | same |

**The pulsing call glyph is the master's own idea** — instance `57895:11261`, a
32px ring drawn around the 16px glyph at −8,−8. Figma can only draw it at rest;
here it expands and fades, twice, under the same 2.2.2 reasoning as the card.

**Two things the handoff and the build disagree about, recorded rather than
harmonised:**

1. Its sentence is *"Take the NMBA e-pledge today and commit to a Nasha Mukt
   Bharat!"* — which points at the **e-pledge**, while the button beneath it goes
   to the **volunteer register**. Kept verbatim in the prototype so the mismatch
   is visible and can be settled by the Department.
2. Its heading is `headline-3` at 28px, sitting directly above the page's own
   `<h1>`. Worth checking against the title it precedes.

Reference and build: `docs/audit/img/figma-banner-ref.png` and
`nudge-handoff.png`.

### 12.4 The call icon: a halo, not a ringing handset

The first version rocked the handset ±14° six times. Replaced, and only the
third reason below is about taste:

| | Before | After | Why |
|---|---|---|---|
| Metaphor | Handset rocking ±14° | Glyph still; a halo expands and fades | A shaking handset is the universal sign of an **incoming** call. The reader is about to **place** one — it was saying the opposite of what it meant |
| Frequency | Fired on every page load | Same, but at a fraction of the amplitude | A band on every organisation page is not a rare animation. At that frequency the right amount of movement is far less than it looks on first viewing |
| Cadence | Two fast rings (2.4s), then a dead stop | Three slow breaths (4.8s), then still | Peripheral vision detects **change**, not amplitude. A slow low-contrast repeat is noticed by someone not looking at it; a single bright burst is missed by anyone who blinked |
| Amplitude | ±14° rotation at 20px | Halo `scale(0.85 → 1.9)`, opacity `0.42 → 0`, plus a 3.5% breath on the well | ±14° is a wobble. On a Government of India page about drug de-addiction, jaunty is the wrong register |
| Easing | `--sa-motion-emphasis-easing` (in-out) | `--sa-motion-reveal-easing`, `cubic-bezier(0.22, 1, 0.36, 1)` | The halo is emitted, not travelling — a strong ease-out reads as something leaving the source |
| Entry scale | `scale(1)` | `scale(0.85)` | Never from nothing; it starts already the size of a thing |
| Reduced motion | `animation: none` — signal gone | Halo rests at `opacity 0.28, scale 1.2` | Fewer and gentler, not zero. The glyph keeps its soft ring; nothing travels |

4.8s is under §2.2.2's five-second threshold **on purpose**, and the margin is
stated in the stylesheet so nobody lengthens a breath to 1.7s and pushes the
total past it without noticing. Hover and focus run it on indefinitely, which
§2.2.2 does not bind because the reader started it.

The handoff's `Nudge` pulse takes the same cadence, so the two layout options
differ in how they are composed and not in how the signal behaves.

Frames across one breath: `docs/audit/img/halo-frames.png`.

---

## 13. The flight refined, the glyph back on the left, and the banner as two options

### 13.1 The flight

| | Before | After | Why |
|---|---|---|---|
| Duration | Fixed 400ms | `clamp(base×0.8, base + distance×0.25, base×1.6)` — **615ms** at 860px, ~430ms at 130px | A fixed duration is two different animations depending on where the card starts. At 860px it moved at **2,150 px/s** — fast enough that the eye tracks a blur and never reads one object arriving |
| Blur | 2px at the **start**, clear by the midpoint | 1.5px at the start, **3px at the midpoint**, 0 at the end | Backwards. With an in-out curve the card is slowest on frame one and fastest halfway across, so it was blurring the slow part and sharpening the fast part — the opposite of motion blur |
| Easing | One curve for everything | Per-keyframe: in-out for the departure, a strong ease-out into the landing | Opacity resolves well before position does, so the card is solid for the second half and the eye has something definite to follow in |
| Opening opacity | 0.55 | 0.7 | At 0.55 the object was half-there while the pill was still visible; the two read as a crossfade rather than one thing moving |

Landing is unchanged and still exact — predicted and actual agree to the pixel.

### 13.2 The glyph went right and came back

The argument for the trailing edge was that the card then read *label → number →
act* instead of putting decoration before the digits. That reasoning was sound
and it lost to two better facts: **the handoff draws it on the leading edge**
(`Nudge`, 57895:11260), and a glyph that identifies *what a control is* belongs
before its label — which is where the icon sits on every other button in the
estate.

### 13.3 The pulse, smoothed

Three things made it steppy, and none was the duration:

| | Before | After |
|---|---|---|
| Opacity onset | `0 → 0.42` on frame one — a pop every cycle | Ramps in over the first 14% |
| Peak scale | 1.9 — nearly doubling, so the disc had a legible **edge**, and the edge is what looked like a step | 1.62 |
| Easing | `reveal` (fast-out, slow-in) — right for something emitted, wrong for something breathing: it spends most of the cycle stationary, then jumps | `emphasis` (in-out) — accelerates and decelerates, which is what a swell does |

Two breaths of 2000ms rather than three of 1600 — the same 4s total, still under
§2.2.2's five seconds, margin stated in the stylesheet.

### 13.4 The banner, as two options

`/explorations/nmba/banner-layout` — *"Where do the band's two calls to action
sit?"*

| | Both CTAs on the right | CTAs below the copy |
|---|---|---|
| Height | **104px** | **168px** |
| Code | 72px | 120px, spanning the full height |
| Heading | label-sized | `headline-3`, 28/36 |
| The two routes | one group on the trailing edge, **12 apart** | a column under the sentence, 16 apart |

**12 is the gap, not 8 and not 16.** At 8 the two pills touch optically and read
as a segmented control; at 16 they stop being a group at this size.

**And it costs something.** The two were 40 apart on purpose: pairing the
helpline with the campaign's own button makes it read as the second half of one
offer, when it is a standing public service that happens to be printed here. The
trade is a tighter, calmer trailing edge against a muddier distinction between a
campaign action and a permanent one. Recorded on the option rather than resolved
in it.

Stills: `opt-ctas-right.png`, `opt-ctas-below.png`, `flight-frames.png`.

---

## 14. The blank space, and the tablet overflow it uncovered

### 14.1 The gap was a measure cap, not a layout problem

Measured at 1440 on the CTAs-right option:

| | |
|---|---|
| Copy cell | **663px** |
| Sentence ink | **288px**, over 2 lines |
| Gap between the sentence and the buttons | **399px** |

`.xband__text` carried `max-inline-size: 44ch` — about 288px at 14px — inherited
from when the copy sat in a narrow column. On a 663px cell it wrapped the
sentence to two lines while **375px of its own cell stayed empty**, and the band
looked unbalanced because a third of the row was a hole held open by a rule meant
to prevent long lines.

A measure cap protects *reading*. This is one strapline, met once, above the page
it introduces — and the grid already caps it: the cell is `1fr` between a 72px
code and the controls, so it can never run the full container width. That is the
right constraint, and it is a real one.

| | Before | After |
|---|---|---|
| Sentence | 2 lines, 288px | **1 line, 573px** |
| Dead space | 399px | **114px** |
| Copy block height | 59px | 41px |

At 1280 it returns to two lines and at 390 to three, which is the grid doing the
capping.

### 14.2 Two regressions the measurement then exposed

**The pair grid never stacked.** `.xband__inner--pair` declared its four columns
at *every* width, so below the one-row breakpoint the copy kept a `1fr` cell
while the controls kept their intrinsic widths: at 768 the sentence got **111px,
six lines and a 205px band**. Every cell now names its own row and column below
1024, and the code is dropped below 768 as production does.

**The hub's inline nav had been overflowing at tablet since before this work.**
`ds-hdr-nav.is-inline` turned on at `min-width: 768px`, and the hub's list needs
577px beside a ~300px lockup. Binary-searched at a 768 viewport:

| Items | Document width |
|---|---|
| 4 | 768 — fits |
| **5** | **781 — overflows** |
| 6 | 893 |

So the compact bar had been scrolling sideways at tablet since the *fifth* entry
landed. Adding "Explorations" as a sixth made it 112px worse and is how it was
found, not what caused it. The breakpoint moves to **1024** — together with the
drawer trigger's, which has always been hidden at exactly the same width, so
there is never a band where both or neither appears.

Verified at 390, 768, 900, 1024 and 1440 on `/reports` and `/explorations`: no
horizontal scroll at any of them, and exactly one of the two navigation forms
present at each.

---

## 15. The flight is out, and the behaviour is on the live page

### 15.1 Why the flight went

It was legible and it was smooth. It was also **615ms of theatre attached to the
act of refusing an advertisement**, on a Government of India page about drug
de-addiction. The reader has just pressed × — they have said *less of this* — and
answering that with a card arcing 860px across the fold is the wrong register
however well it is executed.

What survives is the part that mattered: **the number is carried, not kept.**
Only the journey went.

### 15.2 What ships

The band folds away; the helpline appears beside the organisation's mark, 6px up
and a fade, 120ms after the fold begins. Two compositor-only properties and one
delay. `@starting-style` rather than a `data-mounted` effect — the element is
inserted already holding its opening frame, so there is no first paint at full
opacity to guard against and no state to keep in React.

Under `prefers-reduced-motion` the 6px goes and **the fade stays**: a fade is not
motion, and it is what tells the reader the badge is new.

### 15.3 The wiring, and why it is a store

| Piece | Where |
|---|---|
| `dismissCampaign()` / `useCampaignDismissed()` | `src/lib/website/campaign-dismissed.ts` |
| The badge | `OrganisationHelplineBadge` + `organisation-helpline-badge.css` |
| The slot | `PageHero`'s new `logoAside`, rendered inside `SitePageHeader`'s logo row |
| The wiring | the organisation route, only where the record publishes a helpline |

The two components are siblings rendered by a **server** component: the band sits
in `afterBreadcrumb`, the badge inside the logo slot, and the route between them
cannot hold client state. A context would mean wrapping the whole fold in a
client boundary to pass one boolean — turning the hero, the fact strip and the
page title into client components for no other reason.
`useSyncExternalStore` is the estate's own answer to exactly this, and the same
shape `DataModeProvider` uses.

**In memory, deliberately.** Not `localStorage`, not `sessionStorage`. The band's
own contract is that a campaign the Department is running is not something a
reader switches off permanently by clicking one ×. The state dies with the page,
and so does the badge. It is also reset on unmount, so a route change cannot
carry one organisation's dismissal onto the next.

### 15.4 What this fixes that was never a design

Until now, dismissing the band removed the national de-addiction helpline from
the top of a page about drug de-addiction, and that was *safe* only because the
key-facts strip happens to carry the number as its third figure — a coincidence
of content standing in for a design. It is now a design.

The live region says so too: it names the number and where it went, rather than
only announcing that something was dismissed.

Verified at 1440, 768 and 390: the badge is 107×40 at all three and no viewport
scrolls sideways. Register: `campaign-band` now holds three options, with
"anchor and guest" and "the helpline flies" both kept and marked with what beat
them.

Stills: `prod-before-dismiss.png`, `prod-after-dismiss.png`.

---

## 16. The hero badge, sized for where it is — and whether the helpline belongs beside Register

### 16.1 Sized for the hero, not for the band it came from

It arrived as a 107×40 copy of the band's control — the right size on a crowded
104px row, the wrong one beside a 100px mark under a 40px title, where it read as
a leftover chip rather than the page's second standing fact. The hero has the
room: mark, badge and title all sit left of a 340px portrait with ~700px of blue
between them.

| | Before | After |
|---|---|---|
| Size | 107×40 | **198×54** |
| Icon well | 32px | 40px |
| Number | `label-1`, 14px | **`headline-5`, 20px** — the same step the band gives its own heading |
| Label | "Helpline" | **"De-Addiction Helpline"** |
| Elevation | `card` | `raised` |

The label now says what the number is FOR. Nothing else in the hero does, and the
fact strip only says it once the reader has scrolled past the title. The full
departmental title stays as the accessible name, so the visible text is contained
in it (WCAG 2.2 §2.5.3).

### 16.2 Are the helpline and Register related? No — and the pairing is the problem

They share a rectangle because the source page put them there. They are two
messages for two people:

| | Register Now | 14446 |
|---|---|---|
| Who | someone browsing a campaign, unhurried | someone in trouble, possibly at 4am |
| What | volunteering — discretionary | a national de-addiction helpline |
| Medium | a web form | a telephone |
| Urgency | none | the whole point |

**And the band's own arithmetic makes it worse: it has three controls and two
destinations.** The QR and Register open the *same URL*. So a reader scanning
left to right meets scan-to-join, read-the-invitation, press-to-join — one
sentence — and then a telephone number, which is a different sentence entirely.
Setting the helpline 12px from Register as a matched pair asserts a parity that
does not exist.

**The recommendation is to take the helpline out of the band altogether** and let
the hero badge be the only place it lives. That resolves every part of it:

- the band becomes one message with one offer — scan it or press it, same URL;
- the number becomes **permanent** rather than conditional, present whether or not
  anyone has dismissed anything;
- it sits beside the page's identity, which is where a standing fact belongs;
- and the dismissal wiring disappears — no store, no `useSyncExternalStore`, no
  cross-component state, because nothing has to survive anything.

The current build is the second-best answer: the helpline is in the band, paired,
and survives dismissal by machinery. Recorded here rather than changed unasked.

---

## 17. Two zones — the band carries both and stops pretending they are alike

Asked for after §16.2 concluded that the helpline and Register are not related.
This keeps both in the band and separates them by design rather than by distance.

### What makes two controls read as siblings

Same ground, same height, same silhouette, 12px apart. All four said *"these are
two ways to do one thing"* about a volunteer form and a national helpline — not
related, not for the same person, not even the same medium. And the band's
arithmetic sharpens it: **three controls, two destinations**, because the code
and the button open the same URL. The row read as one sentence with a telephone
number stuck on the end.

### What separates them here

| | What it does |
|---|---|
| **Its own ground** — `successScale-800` (`#003d1e`) against the band's 600→700 | The seam is read before any of the words are. This does most of the work; the other two would not be enough alone |
| **Its own shape** — a caption over a figure, not a label inside a pill | A button invites; a fact simply is. It is also how the key strip below states the same number |
| **Its own position** — flush trailing edge, full row height | It reads as part of the band's furniture rather than as the last item in a list of actions |

It is also **the hero badge's structure** — glyph leading, caption over figure —
so what moves on dismissal is recognisably the same object arriving in a lighter
skin, rather than one control being replaced by another.

**A hairline, because the gradient is darkest exactly here.** The band runs
600 → 700 left to right, so the panel's 800 lands against the deepest part of the
ramp and the step is smallest precisely where the seam must be read. Going darker
still would fix that and leave hover nowhere to go; a 12% white inset edge
defines the panel without touching either.

White on `#003d1e` measures about **13:1** — the most legible text in the band,
which is right for the one line somebody may be reading in a hurry.

Measured: band 1270×96, panel 206×72, 24px from the button. At 390 the panel
takes its own row; no viewport scrolls sideways.

`/explorations/nmba/banner-layout` now holds three: **both CTAs right**, **CTAs
below the copy**, and **two zones**.

---

## 18. The fold audit, and what came of each finding

Seven findings. **Six fixed, one withdrawn**, and the withdrawal is the one worth
reading.

| # | Finding | Outcome |
|---|---|---|
| 1 | The lead's column stopped **24px** from the 340px photograph | Fixed — the landing grid sets its own `column-gap: 40`, and the gutter measures 40 |
| 2 | Green band met blue hero with a hard seam | Fixed — a hairline and a soft shadow, so the band rests ON the page |
| 3 | The helpline number **tied** the campaign's own heading, both 20px | Fixed — the heading is `headline-4` (24px at 1440) against the number's 16 |
| 4 | `14446` appeared **twice in the fold**, 950px apart | Fixed — the fact-strip row is gone |
| 5 | The fact strip's fourth cell was a **name among three figures**, and the only one that wrapped | Fixed by 4 — three cells now, none wrapping |
| 6 | The mark "floats": 64px above, 20px below | **Withdrawn** — see below |
| 7 | The code's effective pattern was **~60px** inside a 72px box | Fixed — 88px box, ~74px of pattern |

### Why 6 was withdrawn

The 64 above the mark is the band's own `padding-block`, and it is symmetric with
the 64 below the actions. The 20 below the mark is the content column's internal
`gap`. **They are different quantities and were never meant to match** — one is
the band's edge, the other is the rhythm inside it. Reading them as an asymmetry
was reading a grid as a stack. Changing either would have made the band's top and
bottom padding disagree, to fix something that was not wrong.

### What each fix cost

**The band grew 104 → 120px.** All of it the code: 88 + 32 of padding. That is a
real charge against a 760px fold and it is the trade the finding named — a QR is
the only thing in the band that fails *completely* if it is slightly too small,
where everything else merely reads tighter. A code nobody can scan is not a
smaller feature, it is an absent one.

**The gutter fix is in the design system**, not this page: `.sa-siteheader__container`
shares one `gap` between the stacked layout, where it is a row gap between copy
and picture, and the landing layout, where it is the gutter beside a 340px
photograph. 24 is right for the first and wrong for the second, so the landing
variant now sets its own column gap. Every landing header on the estate gets it.

**The helpline fact went for a reason that only just became true.** It was
removed on 7 Sep as a duplicate, restored on 8 Sep because the band was
dismissible and pressing × took the last copy of the number with it, and is
removed again now because that is no longer so: the band carries it while it is
there, and `OrganisationHelplineBadge` carries it beside the mark the moment the
band goes. The number is in the fold in every state by design, rather than
because this row happened to exist.

Three facts, not four. The Ministry row survives on the same weak argument as
before — it is the only cell that is a name among figures, and a reader on the
Department's own site has been told the Department twice by the masthead already.
It stays because two is not a strip.

---

## 19. Two zones ships, and three questions answered

### 19.1 The animation was genuinely missing

The halo was built for the white card (`.xhc`) and **never carried across when
the panel was drawn**. So the one element in the band that is a live telephone
line was the only version of it that did not say so.

Fixed, with one change: the halo is tinted **white**, not `successScale-600`. The
well sits on `successScale-800`, and a green halo on a green ground is invisible.
Same cadence as everywhere else — two breaths of 2000ms, 4s total, under
§2.2.2's five seconds on purpose, then hover and focus.

### 19.2 Placement: the trailing edge is right, and not for aesthetic reasons

**Reading order follows the band's own purpose**, which is the campaign. The
helpline is found by TREATMENT rather than by position: it is the darkest object
in the band and carries its largest text (20px bold white at ~13:1, against the
campaign's 24px heading and 14px sentence on a lighter ground).

Leading, it would do two things wrong at once. It would open a campaign band with
something that is not the campaign — the "two messages in one rectangle" problem
in a new arrangement. And it would put two full-height blocks side by side at the
same edge, because the 88px code is already the band's leading anchor.

The one argument for leading is that somebody in crisis scans left first. It does
not survive contact with the treatment: a reader scanning for a telephone number
finds the only dark panel on a light green band before they finish reading the
first word of the heading. Position is the weakest of the signals available here,
and it is the only one the campaign also needs.

### 19.3 Separation: 24 → 48

The panel's ground already says *different thing*; the gap says *how* different.
At the row's plain 24 it read as the next item in a list of actions — which is
the reading the whole zone exists to prevent.

24 from the grid plus 24 of leading margin **on the service**, because the
separation belongs to the thing being set apart, not to the campaign. Measured:
Register ends at 1046, the panel starts at 1094.

### 19.4 What shipped

`.orgjb__helpline` — a filled white DS button — is gone from the live band and
replaced by `.orgjb__service`: an 88px-tall panel on `successScale-800` with a
12% white hairline, a caption over a figure, and the halo. The band is 120px
(the 88px code sets it, per §18).

Register updated: **two zones is `chosen`**; "both CTAs on the right" and "CTAs
below the copy" are `superseded` and keep their addresses with what beat them.
The first lost because the pairing it depends on is the defect; the second
because it answers a different question — how tall the band is — and stacking
the routes in a column makes them *more* alike, not less.

Housekeeping found on the way: a stray `.orgjb__copy { padding-inline-end }`
fragment with an extra closing brace, left by an earlier edit, had been closing
`@layer components` about 300 lines early. Everything below it had been sitting
outside the layer — which, per `design-system-architecture.md` §2a, means it was
beating every layered rule in the estate rather than losing to utilities as
intended.

---

## 20. One band, the notice first, advancing on its own

Asked for: use the one section for both, lead with the temporary event, and let it
autoplay.

### The pause control is what makes it lawful

WCAG 2.2 §2.2.2 requires a mechanism to pause, stop or hide any content that
moves, blinks or auto-updates for **more than five seconds** beside other
content. A 6s dwell is over that line the moment the band mounts. So the pause
button is not a nice extra on this option — without it the band does not conform,
and the estate does not trade accessibility.

Built with it, autoplay is fine, and this is the version that answers the real
objection to the manual carousel: that the second panel is in practice unread.
Rotation is what makes both messages actually seen.

### Four holds, not one

| Hold | Why |
|---|---|
| The pause button | §2.2.2. `aria-pressed` states which way it is set |
| Hover | Nothing takes a sentence away while somebody is reading it |
| Focus | Tracked **separately** from hover — a reader who tabs in and then moves the mouse away must not have it start moving again |
| Pressing a dot | Stops it for good. A reader who chose a panel has said which one they want; taking it away four seconds later is what autoplay is most often blamed for |

Under `prefers-reduced-motion` it does not rotate at all, and the pause control is
not rendered — there is nothing to pause. §2.2.2 is satisfied by the button; the
preference is a separate promise, and a slower rotation is not what it asks for.
It is read once on mount, so the band never changes behaviour under a reader
mid-visit.

### `aria-live` flips with the rotation

`off` while it advances on its own, `polite` once it does not. A region that
announces itself every six seconds is not accessible, it is relentless; one that
stays silent after the reader presses a dot has told them nothing at all.

### Verified

Notice leads ("Six Years of the Abhiyaan"), rotates to the campaign after 6s,
the pause button holds it, and it is still on the same panel 7s later.
`role="region"`, `aria-roledescription="carousel"`, per-slide
`aria-roledescription="slide"` with an "n of 2" label.

Stills: `auto-1-notice.png`, `auto-2-campaign.png`.

The `top-bands` module now holds three: **two bands**, **one band the reader
advances**, and **one band that advances itself**.

---

## 21. A composed band — two halves, one standing service and one rotating offer

The previous attempt was **assembled, not designed**, and the criticism was fair:
a flat strip on one optical line, small type at the left, and the dots, the
pause and the cross loose at the right grouped with nothing. The eye had nothing
to land on, so a band whose only job is to be noticed went unnoticed. Worse, its
two rotating panels were identical — which defeats the one reason to rotate them.

### The height is the taller panel's, by construction

Both panels occupy the same grid cell and the inactive one keeps its space with
`visibility: hidden`. So the band is `max-content` of the two without measuring
anything in JavaScript, and it never resizes as it turns. **Verified: 156px on
both panels.**

### The halves are different materials

The helpline is the **only white surface** on the page's green. The lightest
material draws the eye to the most important interactive thing — and on a page
about drug de-addiction that is not the campaign, it is the number somebody may
be looking for at four in the morning. `headline-3` numerals, tabular, with a
touch of negative tracking because large figures read too far apart as they grow.

### The two offers are told apart four ways

One difference is not enough at a glance, and the reader is not studying the band:

| | Observance | Volunteer |
|---|---|---|
| Accent | saffron `rgb(255,145,103)` | leaf `rgb(189,227,199)` |
| Glyph | `celebration` | `volunteer_activism` |
| Eyebrow | SIXTH ANNIVERSARY | VOLUNTEER |
| Shape | no code | carries the code |

**The chip mixes the light accent, not the saturated one.** `secondaryScale-400`
at 22% over the band's green resolved to a muddy olive — two saturated hues
averaging into a third belonging to neither. The pale rung mixes *toward* the
accent, so the chip reads as tinted glass rather than dirt.

### Controls sit with what they control

Pagination is **inside** the rotating half, aligned to the copy column, because it
pages that and not the band. The dismiss is at the band's own corner, because it
dismisses the band. A control's position is the only explanation of its scope a
reader ever gets.

The current dot **lengthens into a bar** rather than merely brightening — a shape
change reads at a glance where a brightness change alone does not. The pause has
a filled well at rest: at 78% ink on a dark ground it was a hairline.

### Two defects the first build had, both caught by measuring

| | Before | After |
|---|---|---|
| The action button | Left-aligned in an `auto` column, so "File Pre-Event Details" and "Register Now" started **58px apart** and the button slid sideways every six seconds | Flush right — both panels' actions share an edge at x=1267. Padding both to one fixed width would have left "Register Now" adrift in 90px of empty button |
| The code's column | Absent on the observance panel, so every column after it shifted | Reserved at its own width whether or not a code is in it. An empty track is the price of a button that stays put |

Anchoring verified: glyph at x=400 and CTA right edge at 1267 on **both** panels.

Stills: `cband-1.png`, `cband-2.png`, `cband-both.png`.

---

## 22. The composed band, audited by its author before it was shown

The first composition was four loose objects on a green field. Only the helpline
read as a THING; the rest was text and a button sitting on colour. So the band
said "one card and some writing" when it needed to say *"a number you can always
call, and a notice that changes."*

### The story is told by material, not by labels

Both halves are cards now, sharing a top and a bottom edge — verified at y=845
and bottom=969 on both panels. **Solid white is permanent; translucent glass is
the half that turns.** A reader gets that before reading a word, which is the
only way a band this size explains itself. No "NEED HELP" or "WHAT'S ON" headers:
a label that says what a shape already says is chrome.

### Both panels take the same copy shape

Panel one was an eyebrow over a two-line sentence; panel two was an eyebrow,
heading, body and a code. Same box, different density, so the band felt unsettled
as it turned. The observance now uses **the record's own eyebrow as its heading
and its sentence as the body** — the department's words in both slots, no
invention, and the two panels are the same object with different content.

### Three defects found by testing rather than looking

| | What happened | Why looking missed it |
|---|---|---|
| **The pager was unclickable** | The offer and the pager share `grid-area: offer` — which is what makes the stage the height of its tallest panel — so the offer painted over the pager and swallowed every click | The dots were perfectly visible the whole time. Only driving a real click found it |
| The pager collided with the second route | Button, link and pager stacked in one corner | It looked merely tight |
| The empty code track cost 104px of measure | Reserved at 88px to hold the action still — which flushing the actions right already does | Nothing was visibly broken; the copy just wrapped early |

The second route moved into the prose, where it belongs: *"file on the open
register"* is a condition attached to the offer, not a peer of the button.

### Anchored, and verified

| | Panel 1 | Panel 2 |
|---|---|---|
| Band height | 164 | 164 |
| CTA right edge | 1259 | 1259 |
| Cards' top / bottom | 845 / 969 | 845 / 969 |
| Pager clearance under the CTA | 28px | 28px |

Nothing that persists across the turn moves during it.

**Known and accepted:** on the observance panel the inline route wraps as "File
on the / open register". The alternative is a third element stacked in the action
corner, which is the collision this pass removed.

---

## 23. Contrast audit of the composed band — two failures I shipped unchecked

Sampled from **rendered pixels**, not from tokens. That distinction is the whole
finding: the band's ground is a `linear-gradient` with a translucent card over
it, so nothing in the CSS states the colour the text actually sits on. A first
attempt walked the DOM for a `background-color`, found none, and returned white —
producing contrast figures that were confident and meaningless.

The glass card renders `rgb(22,108,66)` at its light end and `rgb(20,84,51)` at
its dark end.

| Element | Before | Needs | Verdict |
|---|---|---|---|
| Heading — white on glass | 7.60:1 | 4.5 | pass |
| Body — 82% white on glass | 5.70:1 | 4.5 | pass |
| Eyebrow — leaf `successScale-100` | 4.60:1 | 4.5 | pass, narrowly |
| **Eyebrow — saffron `secondaryScale-300`** | **3.44:1** | 4.5 | **FAIL §1.4.3** |
| **Inactive dot — 40% white** | **2.57:1** | 3.0 | **FAIL §1.4.11** |
| Dismiss glyph — 72% white on band | 4.25:1 | 3.0 | pass |
| Pause glyph — white on a 14% well | 5.42:1 | 3.0 | pass |

### The saffron rung, measured across the ramp

```
-400  2.61:1     -300  3.44:1  ← shipped
-200  4.43:1  ← the one that tempts you, and fails by 0.07
-100  5.60:1  ← chosen
```

`-300` looked perfectly legible, which is exactly the trap: a saturated warm hue
on a saturated dark ground reads as *bright* long after it has stopped being
*contrasty*. The eyebrow is 12px, so it is normal text and gets no large-text
allowance.

### The dot

An inactive carousel dot is a UI component, so §1.4.11 asks 3:1. At 40% white it
was 2.57. Raised to 55% → 3.47:1 — headroom, rather than a number sitting on the
line where a future gradient tweak would push it under.

### After

Every measured pair passes, and the saffron eyebrow is checked at **both** ends
of the card's gradient — 4.75:1 at the light end, 6.59:1 at the dark end — because
a gradient means one sample is not a result.

---

## 24. The three critique findings, fixed — and one of them corrected first

### The "asymmetric margins" finding was wrong, and I checked before acting on it

I reported the band's internal margins as **24 left, 76 right**. They are not
asymmetric: 24 is the container's own padding on *both* sides, and the 76 is the
gap plus the dismiss plus that same 24. I had measured two different things and
called the difference a defect.

What was actually wrong is smaller and real: the dismiss was **vertically centred
against nothing** — floating at the middle height of a gap, related to no other
element, which is what made the band's right end read as unfinished. It now
shares the cards' top edge. It stays *outside* both cards, because it dismisses
the band and a control inside the glass card would claim the wrong scope.

### The phone: 380px → 296px

45% of an 844px viewport, for an announcement, above the page it announces. Not a
small band — a page.

| Cut | Saved |
|---|---|
| The body sentence and the second route | 40px |
| The helpline card to one line — glyph 48→40, label beside the number, not above | 24px |
| Band padding 20→16, stage padding 16→12 | 20px |

**296px, 35%.** That is the floor: below it the only thing left to cut is the
rotating half itself, and whether a phone gets the announcements at all is a
content decision rather than a layout one.

What survives on a phone is what the announcement *is* — the eyebrow saying which
kind of thing it is, the heading, and the way in. The sentence is elaboration,
and elaboration belongs on the page the button opens, where there is room for it
and where a reader who pressed the button has asked for it.

### The leaf eyebrow

`successScale-100` measured **4.60:1** against the 4.5 §1.4.3 asks. It passes, and
it is the first thing that fails if the card's translucency is ever touched.
`-50` is **6.81:1** — margin rather than luck.

### Verified

| | 1440 | 768 | 390 |
|---|---|---|---|
| Band height | 164 (22% of the fold) | 263 (26%) | **296 (35%)** |
| Helpline card | 124 | 82 | 56 |
| Dismiss shares the cards' top edge | yes | yes | yes |
| Pager overlaps the button | no | no | no |
| Horizontal scroll | none | none | none |
