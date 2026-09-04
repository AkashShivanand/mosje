# Plan of Action — dosje.gov.in governance, CMS assessment, deck and design fixes

**Source:** review call `umt-qefg-fzj`, 3 September 2026, 13 min 20 s
(screen recording `2026-09-03_12-07-36.mp4` + auto-transcript `gemini-code-1788418667691.md`).
**Site under review:** `www.dosje.gov.in` — SAMAVESH, marked BETA, WordPress + Elementor +
Rank Math, custom post type `organisation`, admin bar shown as *NEGO Master Admin*.
**On the call:** akash negi (presenting — WordPress lead), Pravin Kumar, Avinash Gupta,
Prakash Mehta, Akash Kumar.
**Hard date given:** both written documents go out **Monday 7 September 2026**.

---

## 0. The five things that were asked for

| # | Ask | In whose words | Owner | Due |
|---|---|---|---|---|
| **A** | A **page-wise role creation and responsibility mapping** for the whole website — who in the Ministry logs in, and what does each login own. Goes to the client. | *"वेबसाइट को जब पेजेज में ब्रेक करोगे … उस एंगल से देखो कि मिनिस्ट्री में मेंटेन कौन करेगा … रोल क्रिएशन और ये सब कैसे होगा, रेस्पॉन्सिबिलिटी मैपिंग"* | akash negi (lead), Avinash, Pravin · design team reviews | Mon 7 Sep |
| **B** | An **assessment of whether the current WordPress configuration is the right one** for this use case — specifically the "same information entered in many places" problem. Internal. | *"क्या वर्डप्रेस बेस्ट कॉन्फ़िगरेशन है — this is my question … 10 best that we can do in WordPress for this specific use case"* | akash negi, Avinash, Pravin | Mon 7 Sep |
| **C** | Turn the **user-persona / options document into a PPT deck**, send it, then walk Sir through it in person. | *"सर ने बोला है कि एक PPT बनाओ, then present to me … डॉक्यूमेंट है, ऑप्शंस हैं, उसको स्लाइड्स में प्लेस करो"* | Design team (Akash, Prakash) | Deck by Mon 7 Sep; walkthrough on a date Sir gives |
| **D** | **Design pass on the live site** — the organisation logo strip in particular (mismatched sizes and backgrounds), plus anything else the design team judges wrong. | *"बड़े-बड़े लोगो आ रहे हैं, छोटा करो … लोगो का ही बैकग्राउंड उठाना पड़ेगा, तो ऊपर से नीचे तक uniform लगेगा"* | Design team (Akash, Prakash) | First list Fri 4 Sep |
| **E** | Close out the **NIC validation sheet** (new site vs old site) — four rows are still open. | *"NIC का एक डॉक्यूमेंटेशन आया था जिसमें उन्होंने वेबसाइट को वैलिडेट किया old website के साथ"* | akash negi + design | Fri 4 Sep for status; fixes with A/B |

---

## 1. What was actually on screen — the evidence base

Recorded so that neither document has to be written from memory.

**Pages walked through**

- Homepage — SAMAVESH orange banner, hero photograph, **Latest Updates** ticker, a
  three-tab block (**Schemes · Vacancies · Tenders**), a **Documents** rail, an
  **organisation logo carousel** above the footer, *Need Support?* strip, four-column footer.
- Primary navigation — `Home · Department · Associated Organisations · Offerings ·
  Documents · Events & Gallery · Connect`.
  `Department >` About Us · Who's Who · **Directory**.
  `Offerings >` Schemes & Services · Vacancies · Tenders.
  `Connect >` **Mosje Directory** · Contact Us · CPIO.
- `Connect > Contact Us` — one page with a left rail of organisations (MoSJE, BJRNF,
  DWBDNC, DAF, DAIC, …), each opening a contact block: name, designation, address, map.
- Organisation detail pages (BJRNF, DAF) — each with its own left rail:
  *About · Leadership & Organisation · Governing Body · National Initiatives & Schemes ·
  Media & Print · Reports · RTI · CPIO · Tenders Quotations · Works of Babuji*, then
  **CONNECT & ENGAGE → Contact · Literature · Achievements · Speeches**.
- Footer — a **third** taxonomy over the same pages: *Department* (About Ministry, Vision &
  Mission, Organisational Chart, Ministers & Officials, Citizen Charter) · *Services*
  (Schemes & Benefits, Acts & Rules, Tenders, Vacancies) · *Support* (Contact Us, RTI,
  Sitemap) · *Resources* (Notices, Reports, Publications, Statistics) · NeGD block.
  Carries *Last Updated: 03 Sep 2026* and *Total Visits: 301,469*.

**Two Google Sheets tabs were opened** — `All Website Links · New Website Issues ·
DBIM compliance · Detailed Comparison`.

- **All Website Links** — old `socialjustice.gov.in` menu tree beside the new
  `dosje.gov.in` menu tree. **`Mosje Directory` is highlighted in orange on the new side
  because it appears twice** — once under `Department >` and once under `Connect >`. That
  highlight is the same defect the lead raised verbally.
- **New Website Issues** — the NIC validation list. Transcribed in §6 below.

---

## 2. Workstream A — Roles and Responsibility Mapping

### 2.1 The one question the document must answer

> If the Ministry maintains this website itself, **who gets a login, and exactly what does
> each login own?** And where two people would both need to edit the same thing, who wins?

The lead's stated reason: *"कई बार ये डिस्कशन होता है कि भाई इसको मैनेज कौन करेगा — उसका
आंसर हमें इस डॉक्यूमेंट में देना है।"* This is a governance answer, not a technical one, so
the document is written for a Ministry reader.

### 2.2 Method — three passes over the site

1. **Inventory.** Every page and every homepage component, taken from the live navigation,
   the footer, and the `All Website Links` sheet. Each row gets: page/component, URL,
   content type (WP post type), update frequency, and where the same content also appears.
2. **Classify the owner.** Three classes emerged on the call and they should be the
   document's spine:
   - **Organisation-owned** — an Associated Organisation's whole page tree. Settled and
     uncontroversial: *"असोसिएटेड ऑर्गेनाइजेशन का जो पेज है, वो पूरे का पूरा एक रोल बनाऊंगा
     और उसको दे दूंगा।"*
   - **Division-owned** — a page belonging to one Ministry division (schemes, one scheme
     to one owner: *"11 स्कीम्स किसी को पकड़ा देंगे"*).
   - **Common / unassigned** — Directory, Contact Us, hero banner, header navigation,
     footer, homepage layout. **These are the gap.** The lead said plainly that nobody is
     assigned to the hero banner or the Directory today.
3. **Delta.** For every row: role required · role that exists today · gap. The document is
   only useful because of this third column.

### 2.3 Deliverable shape

One table, one row per page or component:

| Page / component | Content type | Owner class | Proposed role | Role exists today? | Also appears at | Conflict rule |
|---|---|---|---|---|---|---|

Followed by a short role catalogue (one page per role: what it can create, edit, publish;
what it cannot touch) and a one-page RACI summary for the Ministry reader.

### 2.4 Starting role model — to be confirmed, not assumed

The call settled on **"12 organisations + 1 admin"**. The content export in this repo
(`apps/hub/src/content/website/organisation.json`, generated 2026-06-13) holds **24
top-level `/organisation/` entries**, of which only some are institutions with a standing
editor; the rest are portals, listings or content pages that need a different owner:

**Institutional — a named organisation editor is the obvious owner (16):**
BJRNF · DWBDNC · DAF · DAIC · NMBA · NBCFDC · NCBC · NCSK · NCSC · NHAA · NISD · NOS ·
NSKFDC · NSFDC · PM-AJAY · SMILE (Beggary) · National Portal for Transgender Persons ·
Senior Citizens Welfare (SCW).

**Filed under `/organisation/` but not an organisation — needs an explicit decision (6):**
E-Anudaan · E-Utthaan · List of Channelizing Agencies · Ministry and Scheme wise Financial
Summary · NCSK Grievances & Redressal · Success Stories.

> **Action:** the definitive list is the live `Associated Organisations` menu, not this
> export. Reconcile the two before the document goes out, and confirm whether "12" was a
> count of organisations with an identified nodal officer rather than of pages.

**Roles beyond the organisation set, all currently unowned:**
Homepage editor (hero banner, ticker, the three-tab block, logo carousel) · Navigation &
footer owner · Directory owner · Contact Us owner · Documents/media librarian · Scheme
owner (per scheme or per division) · Vacancies & Tenders publisher · Events & Gallery
owner · **Super-admin** for everything above and for role creation itself.

### 2.5 Two decisions the Ministry has to make, and the document must ask for

1. **Directory and Contact Us** — one central owner, or does each organisation maintain its
   own row? The call leaned to *"जिसका पेज होगा, वो मेंटेन करेगा"*, which only works if the
   central page is assembled from the organisation records rather than typed again (§3).
2. **Vacancies, Tenders, Documents** — confirmed on the call as individually published by
   each organisation's own login, appearing automatically in the aggregate views. The
   document should state this as the rule and name what enforces it.

---

## 3. Workstream B — Is this the right WordPress configuration?

### 3.1 The problem statement, as given

> *"Same type of information — whether it is a person, the directory, or a document upload —
> is having to be uploaded in multiple places. Mainly, the inefficiency is that the two are
> disconnected."*

And the precedent that makes it urgent: on the previous CMS build, the Minister's name had
to be written in the Directory and again elsewhere, one copy was updated and the other was
not, and **an inconsistency reached the live site**.

### 3.2 The duplication register observed on the call

| # | Same content, entered more than once | Where it appears | Evidence |
|---|---|---|---|
| B1 | **Directory** | `Department > Directory` **and** `Connect > Mosje Directory` | Highlighted orange in the team's own `All Website Links` sheet |
| B2 | **Organisation contacts** | `Connect > Contact Us` accordion **and** each organisation page's `Connect & Engage > Contact` | Walked through on screen; akash negi confirmed the fields are the same, with *"कहीं-कहीं किसी ने extra detail डलवा दी"* |
| B3 | **Documents** | Uploaded page-wise; no central repository. Annual Reports sit on organisation pages **and** under `Documents > Annual Reports` | *"CMS पेज-वाइज था … कुछ सेंट्रल होना चाहिए, जैसे media gallery — एक जगह अपलोड करो, फिर कहीं भी यूज़ कर लो"* |
| B4 | **Vacancies / Tenders** | Homepage tabs · `Offerings > Vacancies|Tenders` · organisation-page `Tenders Quotations` | Seen on screen |
| B5 | **Schemes** | Homepage Schemes tab · `Offerings > Schemes & Services` · organisation-page `Schemes & Projects` | Seen on screen |
| B6 | **Navigation taxonomy** | Primary menu, footer four-column menu and organisation left rails name the same pages three different ways | Seen on screen |
| B7 | **Organisation short description** | Repeated on the organisation card and the organisation page | Raised on the call: *"शॉर्ट डिस्क्रिप्शन उठा लें"* |

> Note the honest exception the lead already conceded: for at least one case
> (*"इसको तो हम कुछ कर नहीं सकते, यहाँ से तो उठाएगा ही … दो जगह इनको करना ही पड़ेगा"*)
> two entries may be unavoidable. Where that is true, **say so in the document and say why**
> — an assessment that claims everything is fixable will not survive contact with the build.

### 3.3 What the assessment document must contain

1. **The register above**, completed — every duplicated field, not only the seven found in
   thirteen minutes.
2. For each row: **is the duplication structural (the CMS forces it) or incidental (someone
   built the second copy by hand)?** The lead's own hypothesis is that the build started on
   best practice and drifted as late changes came in — *"बाद में बहुत सारे चेंज आये थे, तो
   उसकी वजह से हो सकता है"*. That hypothesis needs testing, not repeating.
3. **The remedy per row**, named as a concrete WordPress mechanism — a shared taxonomy, a
   relationship field, a query loop reading one source, a central media/document library
   with a document CPT and reusable blocks — not as an intention.
4. **The ten recommendations**, ranked, each with effort, risk and whether it can be done
   without re-authoring existing content.
5. **A one-line verdict** on the question actually asked: *is this the right configuration,
   yes or no*. The document fails if a reader has to infer it.

### 3.4 Design team's contribution to B

The lead asked for a user-perspective read alongside the backend one:
*"डिज़ाइन टीम भी एक बार इसको देखे, from that perspective"*. Our input is where the
duplication is **visible to a citizen** — the same contact rendered two different ways, the
Directory reachable by two names, three taxonomies for one page set — because those are the
rows that cost credibility rather than only editor time.

---

## 4. Workstream C — The persona / options deck

**Source:** `docs/research/website-ia-persona-discoverability-2026-08.md` — *"Finding What
You're Entitled To"*, 20 August 2026. It already carries 15 personas, a coverage matrix,
four benchmarks, nine diagnoses (D1–D9), nine recommendations (R1–R9), three redesigned
journeys and a phased roadmap. Nothing new needs writing; it needs **placing into slides**,
exactly as instructed: *"डॉक्यूमेंट है, ऑप्शंस हैं, उसको बस स्लाइड्स में प्लेस करो।"*

**Proposed deck, 12–14 slides:**

1. Title — what was reviewed and when
2. The question: can a citizen find what they are entitled to?
3. What exists today — two live ministry sites, divergent taxonomies (D1)
4. The five findings that matter (D2, D3, D4, D6, D7), one line each
5. Evidence — the coverage matrix
6. Three citizen journeys as they run today
7. **The options** — R2, R3, R4 as the decision the deck is asking for
8–10. One slide per option: what it changes, what it costs, what it needs from the Ministry
11. The same three journeys after
12. Roadmap — Phase 0 / 1 / 2, with the critical path named
13. What we need decided, and by whom

**Standing constraint:** the deck states no figure that is not in the source document, and
every number keeps its date. The source's own limits section (no user research was
conducted; the export is dated 2026-06-13) is carried onto a slide, not dropped.

---

## 5. Workstream D — Design fixes on the live site

### D1 · The organisation logo carousel (raised explicitly)

Observed above the footer on the homepage: a row of organisation marks at **inconsistent
sizes, on inconsistent backgrounds** — some on white plates, some transparent, some
noticeably larger than their neighbours — and **e-ANUDAAN rendered as plain text** rather
than a mark. Two instructions were given:

- *"बड़े-बड़े लोगो आ रहे हैं, छोटा करो"* — normalise the optical size.
- *"लोगो का ही बैकग्राउंड उठाना पड़ेगा, तो ऊपर से नीचे तक uniform लगेगा"* — either give
  every mark the same plate, or strip every plate; do not mix.

**Our fix, to propose Friday:** one fixed-height carousel cell with a single background
token, each mark optically centred and normalised to a common cap-height rather than a
common box; a real mark for e-Anudaan; and a stated minimum source resolution so nothing is
upscaled. This estate already governs mark resolution in
`.claude/rules/ds-documentation-standard.md` §3 — the same rule should be quoted to the
WordPress team rather than re-argued.

### D2 · General design review pass

akash negi asked us to look for anything else wrong. Deliver a short list — screenshot,
what is wrong, what it should be — not a critique document. Restrict to what can be changed
inside the existing WordPress build; anything needing a rebuild goes into Workstream C's
roadmap instead.

---

## 6. Workstream E — NIC validation sheet closure

The `New Website Issues` tab, transcribed from the recording:

| Section | Issue / observation | Their comment | Status |
|---|---|---|---|
| Header Logo Data | When the website language is changed, the header logo-related data does not change accordingly | *"As discussed previously, the logo sho… across all language versions"* | **Open** |
| Offering Section | Tabs cannot be accessed using keyboard navigation | *"We are using Elementor Tabs, which can be navigated using the keyboard…"* | **Open — disputed** |
| Our Organisations Section | Tabs cannot be accessed using keyboard navigation | same | **Open — disputed** |
| Activity Corner Section | Tabs cannot be navigated using keyboard navigation | same | **Open — disputed** |
| Logo Section | All the logos have not been updated in the carousel | Done | Closed |
| Recent Documents Section | Latest updated documents are not appearing at the top; most recent should be first | *"functionality … already present … content to be displayed in the Latest Updates section"* | **Open** |
| Navigation / Search | Citizen Charter page is not in the navigation menu or other visible pages, and is hard to find through search | Done | Closed |
| Publish Date | Start Publish Date and End Publish Date do not match the displayed information | Done | Closed |

**What has to happen, and it is not "reply again".** Three rows are answered with
*"we are using Elementor Tabs, which can be navigated using the keyboard"*. That is a claim
about a plugin, not evidence about the page. **Test the live tabs with a keyboard and a
screen reader and attach the result** — pass or fail. If they fail, they are a WCAG 2.1 AA
failure on a Government of India property and they are also a GIGW item, so a disputed row
left standing is a compliance exposure, not a disagreement about taste. The accessibility
audit is ours to run; the fix is the WordPress team's.

The Header Logo row is the same class of problem in the language switcher and should be
verified the same way.

---

## 7. Schedule

| When | What | Who |
|---|---|---|
| **Thu 3 Sep (today)** | This plan circulated; page inventory started from the `All Website Links` sheet | All |
| **Fri 4 Sep** | Duplication register completed (B) · design fix list incl. logo carousel (D) · keyboard/screen-reader test evidence for the three NIC rows (E) | akash negi / design |
| **Fri 4 Sep** | Reconcile the "12 organisations" count against the live Associated Organisations menu | akash negi |
| **Sat 5 – Sun 6 Sep** | Draft A and B; draft the deck (C) | Respective owners |
| **Mon 7 Sep** | **A** sent to the client · **B** circulated internally · **C** deck sent, walkthrough date requested | akash negi |
| After | Walk Sir through the deck; return to the lead for discussion on B — *"give it a thought, then come back for discussion with me"* | All |

---

## 8. Open questions to put to the lead before Monday

1. Does document A go to the Ministry as a recommendation, or as a proposal for them to
   approve role by role? The wording of the delta column changes with the answer.
2. Was **"12 organisations + 1"** a count of organisations, of nodal officers, or of logins
   that already exist? The export shows 24 top-level entries.
3. For B, is re-authoring existing content acceptable to remove a duplication, or must every
   remedy be non-destructive to what is already published?
4. Who is the named audience for the deck besides Sir — is it presented to the Ministry, or
   internal only?
5. Confirm the Monday date is Monday **7 September 2026**.

---

## 9. What this plan deliberately does not cover

- The MoSJE/SAMAVESH Next.js estate in this repository. Everything above concerns the live
  WordPress build at `dosje.gov.in`. Where the two overlap — organisation marks, the
  persona research, the Directory model — the repo is the reference, not the delivery target.
- Any change to the live site made directly. Nothing here authorises editing production;
  the design outputs are lists and specifications handed to the WordPress team.
