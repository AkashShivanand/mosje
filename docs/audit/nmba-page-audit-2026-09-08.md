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

**c. The second pre-event route was not confirmed in the review.** The occasion
ribbon offers two doors — the administrative login for line Ministries and
Departments, the open activities register for autonomous bodies and corporate
participants. The second was described in the review as still needing
confirmation, and as needing an email-verified open form that does not yet
exist. It currently points at `/portals/nmba/activities`, which is open and
carries the event form, and is the closest real destination. **Confirm the route
before the observance opens.**

**d. "Admin Login" was left alone, deliberately.** The review opened with a
proposal to rename it to "Login" and closed by keeping "Admin Login" — a plain
"Login" invites citizens into a door only officials can pass, and the login page
does not yet carry the citizen/official split that would make the rename safe.
Recorded here so the next session does not re-open it as an oversight.

**e. The three-fact strip leaves an orphan below 640px.** Three cells in a
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

---

## 5. Two gate findings, spun off

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
