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
