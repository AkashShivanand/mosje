# Finding What You're Entitled To

**An information-architecture and discoverability review of `dosje.gov.in` and `socialjustice.gov.in`**

Analysis date: 20 August 2026 · Author: MoSJE design research · Status: draft for review

---

## 0. Scope, method and limits

**Sites analysed**

| Site | What it is | State on 20 Aug 2026 |
|---|---|---|
| `www.dosje.gov.in` | "SAMAVESH" — the unified ministry site. WordPress. Tagline: *"Single Access Mechanism for All Verticals of Empowerment & Social Harmony"* | Live, marked **BETA** in the masthead. Last modified 2026-08-20 |
| `socialjustice.gov.in` | The legacy DoSJE site, built and hosted by NIC | Live, in parallel, with a different navigation skeleton and partly different content |

**A structural fact that shapes everything below.** MoSJE is a ministry with **two** departments: DoSJE (this site) and the **Department of Empowerment of Persons with Disabilities (DEPwD)** at `depwd.gov.in`. Persons with disabilities are served by the sibling department. Neither site tells them so.

**Method**

1. Live fetch and parse of both homepages, the schemes catalogue, a persona page, and two site searches (`?s=SURAJ`, `?s=disability`).
2. Quantitative analysis of the ministry's own content export held in this repository — `apps/hub/src/content/website/` — covering **141 scheme records, 175 organisation pages, 1,624 documents, 305 tenders, 137 vacancies** (manifest generated 2026-06-13).
3. Benchmark analysis of three comparable Government of India properties, plus one international reference.
4. Cross-reference against GIGW 3.0 (`docs/guidelines/GIGW-3.0/`), DBIM 3.0 and WCAG 2.2 AA.

**Limits, stated honestly**

- The content export is dated 2026-06-13; the live site has changed since. Every claim about navigation, facets, persona pages and search behaviour was re-verified live on 2026-08-20. Claims about the 141 scheme records come from the export.
- Persona coverage figures in §1 come from keyword classification over each record's title and body. This is an order-of-magnitude measure, not a hand-audited census. It will slightly over-count (a scheme that merely *mentions* SC/ST is counted) — which means the gaps it reveals are, if anything, understated.
- **No user research was conducted.** Findings are grounded in site analysis and benchmarks. The personas below are derived from the constituencies the department actually serves, not from interviews. Recommendations in §4 should be validated with those constituencies before Phase 3 ships.

---

## 1. Personas and offerings inventory

### 1.1 The personas

Derived from the constituencies named in the department's own statutes, schemes and organisations.

| # | Persona | Who they are | What they come for |
|---|---|---|---|
| P1 | **Scheduled Caste households and students** | The department's largest constituency | Scholarships, hostels, loans, land/livelihood under PM-AJAY, protection under the PoA Act |
| P2 | **OBC / EBC households and students** | Served via NBCFDC, NCBC | PM-YASASVI, hostels, NF-OBC fellowship, credit |
| P3 | **DNT / VJNT / NT-SNT communities** | De-notified, nomadic, semi-nomadic | SEED (education, health, housing, livelihood), DWBDNC |
| P4 | **Safai karamcharis, sanitation and waste workers** | Including manual scavengers and their dependants | NAMASTE, SRMS, NSKFDC credit, Swachhta Udyami Yojana, pre-matric scholarship for dependants |
| P5 | **Senior citizens and their family carers** | Often reached *by* the carer, not the citizen | AVYAY, Rashtriya Vayoshri Yojana, IPSrC, Elderline 14567 |
| P6 | **Transgender persons** | Served through SMILE | Identity certificate, shelter, skilling, National Portal for Transgender Persons |
| P7 | **Persons in destitution or begging** | SMILE — Beggary component | Shelter, rehabilitation, skilling |
| P8 | **Persons affected by substance use, and their families** | NMBA, de-addiction network | De-addiction centres, NMBA, helpline 14446 |
| P9 | **Victims of caste atrocities** | PoA Act / PCR Act | Relief, legal aid, NHAA helpline |
| P10 | **Women and girls within all the above** | A cross-cutting axis, not a separate group | Mahila Samridhi Yojana, Mahila Adhikarita Yojana, girls' scholarships |
| P11 | **Persons with disabilities** | **Served by DEPwD, not this department** — but they arrive here | Signposting they currently do not get |
| P12 | **NGOs and voluntary organisations** | Delivery partners | Grant-in-aid, e-Anudaan, blacklist/screening rules |
| P13 | **State officials, implementing and channelising agencies** | The operational audience | Circulars, guidelines, portals, fund releases |
| P14 | **Researchers, journalists, Parliament** | Accountability audience | Annual reports, studies, statistics, RTI |
| P15 | **Job seekers and vendors** | Transactional visitors | Vacancies, tenders |

### 1.2 The offerings

**141 scheme records** in the catalogue. **18 organisations and thematic portals** in the primary navigation: NCSC, NCSK, NCBC (commissions); DAF, DAIC, BJRNF (foundations); NSFDC, NSKFDC, NBCFDC (corporations); NISD (training); DWBDNC, SCW, PM-AJAY, SMILE-Transgender, SMILE Beggary, NOS, NMBA, NHAA (scheme-specific thematic portals). External transactional portals: `grants-msje.gov.in` (e-Anudaan), `scholarships.gov.in` (NSP), `pgportal.gov.in` (grievances), ALIMCO (Rashtriya Vayoshri Yojana), plus E-UTTHAAN.

### 1.3 The coverage matrix — the central finding

For each persona: how many of the 141 scheme records actually address them, versus how many are **tagged** so the site's own "Target Group" filter can find them.

| Persona | Schemes addressing them | Tagged so the filter finds them | Gap |
|---|---:|---:|---:|
| Students / learners | 64 | 51 | −13 |
| DNT / VJNT / NT-SNT | 43 | 14 | −29 |
| **Scheduled Castes** | **32** | **5** | **−27** |
| OBC / EBC | 24 | 6 | −18 |
| **Women and girls** | **23** | **0** | **−23** |
| Entrepreneurs / self-employed | 23 | 5 | −18 |
| Safai karamcharis / sanitation workers | 19 | 18 | −1 |
| **NGOs / voluntary organisations** | **12** | **0** | **−12** |
| Senior citizens | 11 | 9 | −2 |
| **Persons with disabilities** | **10** | **0** | **−10** |
| **Victims of atrocities** | **3** | **0** | **−3** |
| **Persons affected by substance use** | **3** | **0** | **−3** |
| **Transgender persons** | **2** | **0** | **−2** |

Three further facts about the same data:

- **27 of 141** scheme records carry no target group at all. **13** carry neither a target group nor a category — they are invisible to both filters and reachable only by knowing the URL.
- **Only 2 of 141** records carry more than one target group. The taxonomy is single-valued where the world is multi-dimensional.
- The full target-group vocabulary is: Students (51), Sanitation Workers (18), DNT (14), Senior Citizens (9), OBC (6), Business (5), Small business (5), Scheduled Castes (5), Medium business (1), BPL (1), **Homeowners (1)**. "Homeowners" and "Medium business" are not constituencies of this department.

**What this means in practice.** An SC student — the single largest group this department exists to serve — must choose between filtering *Scheduled Castes* (5 results, not one of them a scholarship) and *Students* (51 results, no caste narrowing). The two cannot be combined into a truthful answer, because the underlying data is single-valued. The filter works perfectly. The data behind it does not.

---

## 2. Benchmark findings

### B1 — myScheme (`myscheme.gov.in`) · the national scheme-discovery platform

- **Eligibility is a first-class data model.** Personalised search collects gender, age, marital status, state, urban/rural residence, social category, disability status, minority status and employment status, then returns matched schemes.
- **Categories are named by the benefit, not the administering division** — 15 of them, including Education & Learning, Health & Wellness, Housing & Shelter, Skills & Employment, Social Welfare & Empowerment, Women & Child, Utility & Sanitation, Business & Entrepreneurship, Public Safety Law & Justice.
- **Every scheme page uses one fixed spine**: Details · Benefits · Eligibility · Application Process · Documents Required · FAQ. A citizen learns the shape once and reuses it everywhere.
- **This is not optional for DoSJE.** GIGW 3.0 mandatory checkpoint 21 requires *"API integration with key government platforms (India Portal, DigiLocker, Aadhaar, Single-Sign-On, MyGov, Data Platform, MyScheme) … for seamless exchange of Information and data."*

### B2 — DEPwD (`depwd.gov.in`) · the sibling department

- The homepage carries a **"Most Used Services"** block written entirely in verbs, and lifecycle-aware: *"Apply for Disability Certificate & UDID Card"*, *"Track Your UDID Card Application"*, *"Disability Certificate & UDID Card Renewal"*, *"Apply for Lost UDID Card"*, *"Register for Skill development of PwDs"*, *"Register for Employment of PwDs"*.
- Assistive access is built in: Divya Voicebot, Divya Chatbot, Video Relay Service.
- **Borrow the task pattern, not the IA.** DEPwD's own navigation is still division-shaped and it has no finder or audience pathways. Its lesson is narrow and valuable: name the highest-traffic citizen intents on the homepage, as things a person does.

### B3 — National Scholarship Portal (`scholarships.gov.in`)

- Two of the four primary navigation items are **stateful**: *"Scholarship Eligibility"* and *"Application Status"*, alongside *"Apply For Scholarship"* and *"Schemes on NSP"*.
- For a department where 64 of 141 offerings are education-related, "Am I eligible?" and "Where is my application?" are not secondary questions.

### B4 — International reference: GOV.UK

Task-based information architecture with a single guided *"Check what benefits you can get"* flow standing in front of the benefits catalogue. Cited as a design standard, not as a peer institution.

### Best practices extracted

1. Model eligibility as structured, multi-valued data — everything else is a view over it.
2. Name categories by the benefit received, never by the division that administers it.
3. One fixed page template per offering, so the shape is learned once.
4. Put the top citizen tasks on the homepage as verbs.
5. Make eligibility and application status top-level, not buried.
6. Never dead-end: an empty result must route somewhere.

---

## 3. Diagnosis — why people cannot find what they are entitled to

### D1 · Two live ministry websites, with divergent taxonomies and non-overlapping content

`socialjustice.gov.in` lists **PM-SURAJ, TAPAS, DAMS, PM-AGY, Development Action Plan for Scheduled Castes, Ageing with Dignity** and **e-ANUDAAN** among its "Major Schemes". A site search on `dosje.gov.in` for *SURAJ* returns 10 results, **none of which is PM-SURAJ** — the top hits are an NSFDC FAQ and a tender for the "Suraj Kund International Crafts Mela". A citizen who heard of PM-SURAJ on the radio and went to the ministry's flagship site cannot find it there.

The two sites do not even share a navigation skeleton. dosje: *Department / Associated Organisations / Offerings / Documents / Events & Gallery / Connect*. socialjustice: *About Us / Schemes / Associated Organisations / Publication / Media / Offerings / Events / Connect / Social Audit*.

### D2 · The persona layer exists, but it is decorative

The dosje homepage carries a section headed **"Explore User Personas"** — containing exactly two: *Government Official* and *Beneficiary*. "Beneficiary" is not a persona; it is the government's word for everyone.

The page at `/home-page/for-beneficiary/` offers six cards — Schemes and Services, Acts and Policies, Reports, Publications, Citizen Engagement, Get in Touch. **Every one links to a destination already reachable from the main navigation, and not one of them narrows by who the reader is.** One card, "Publications", carries the call-to-action label **"Explore Schemes"** — a copy-paste error live in production.

The URL itself leaks the CMS: personas are parented under an internal page called `home-page`.

The Next.js rebuild in this repository extends this to four personas but reproduces the defect — [`for-student/page.tsx`](apps/hub/src/app/website/for-student/page.tsx) sends both *"Scholarships"* and *"How to Apply"* to the unfiltered `/website/schemes-services`.

### D3 · The filters are real; the data behind them is not

The schemes catalogue has three working facets — *All Category*, *All Target Group*, *All Organisations* — plus Active/Archived and Reset Filters. The quantitative failure is set out in §1.3.

The category vocabulary is equally unmaintained: 13 values including **"MICRO FINANCE"** and **"TERM LOAN"** in capitals (leaked verbatim out of two scheme titles), *Loan* and *Non Loan* as siblings, *Healthcare* and *Medical* as separate values, and *Social Remedies* with a single member. 61 of 141 records fall into one bucket, "Education".

In the Next.js rebuild, the *Target Group* column renders `—` for every row: [`schemes-services/page.tsx`](apps/hub/src/app/website/schemes-services/page.tsx) reads `s.targetGroup` from records where 27 have none, with no fallback.

### D4 · Everything is named the way the file is named inside the ministry

The **Associated Organisations** menu presents 18 items whose visible labels are acronyms — NCSC, NCSK, NCBC, DAF, DAIC, BJRNF, NSFDC, NSKFDC, NBCFDC, NISD, DWBDNC, SCW, PM-AJAY, NOS, NMBA, NHAA — grouped under headings that are themselves administrative: *COMMISSIONS*, *FOUNDATION / AUTONOMOUS BODIES*, *CORPORATIONS*, *TRAINING & CAPACITY BUILDING*, *SCHEME SPECIFIC THEMATIC PORTALS*.

The footer's **Important Links** is organised by internal division: *Scheduled Caste Welfare · Welfare Of The Other Backward Classes · Social Defence · Official Language · Grants-In-Aid To NGOs · Public Grievance · Parliamentary Matters · Plan Division · Statistics Division · Budget And Account*. A senior citizen looking for a pension does not know she is a "Social Defence" matter.

Scheme titles are the administrative titles verbatim. The longest is 168 characters: *"Centrally Sponsored Scheme for implementation of the Protection of Civil Rights Act, 1955 and the Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989"*. That is what a victim of an atrocity is expected to recognise.

### D5 · The same programme is filed under two content types, so it is invisible under one of them

NMBA, SMILE (Beggary), the National Portal for Transgender Persons, PM-AJAY, NOS, SCW and DWBDNC all appear in the navigation under *Associated Organisations → **Scheme Specific Thematic Portals*** — the menu heading itself admits they are schemes. But the schemes catalogue's Organisation facet lists them as **organisations**, and **NMBA, SMILE-Beggary and the transgender portal do not appear among the 141 scheme records at all.**

A person searching the Schemes page for help with drug dependence, for destitution, or as a transgender person finds nothing there.

### D6 · There is an entry point for every artefact, and none for any need

Six of the seven top-level menu items name things the ministry *has*. None names a thing a citizen wants to *do*. Nothing on the site answers *am I eligible*, *how do I apply*, *where is my application*, or *how do I complain* — grievance redress is a footer link out to `pgportal.gov.in`, and there is no application tracking anywhere. Compare DEPwD (B2) and NSP (B3).

### D7 · Search retrieves by tag substring, and the tags are noise

A search for **"disability"** returns 19 results. Exactly one is a scheme — *Rashtriya Vayoshri Yojana*, which is an elderly-persons scheme, tagged "Disability Aid". The remainder are documents matched on tags such as **"disability arising from untouchability"**, **"learning disability week"**, **"district disability welfare office"** and **"disability inclusion act"** — among them an Annual Report from 2015 and two NMBA newsletters.

Nothing on that results page tells the searcher that persons with disabilities are served by a different department of the same ministry, at `depwd.gov.in`.

*Credit where it is due:* the search results page is the best-organised surface on the site. It groups results by content type with counts — *Scheme and Service (1) · Document (5) · Associated Organisation (12) · Tender (1)* — and shows Category · Organisation for each hit. That grouping should be promoted into the browse experience, not confined to search.

### D8 · The catalogue is not maintained, and the defects are visible to citizens

All of the following are live:

- The schemes table renders client-side and ships the literal string **"Loading…"** in the HTML source — invisible to search engines and to slow connections.
- Every page's footer carries a leftover Bootstrap demo control with the options **"Open this select menu / One / Two / Three"**.
- Two scheme records have numeric slugs — `/schemes-and-services/10663/` and `/2998/`. Record 10663 renders as an empty table.
- **24 of 141** scheme pages have no content at all.
- Record `self-employment-scheme-for-rehabilitation-of-manual-scavengers-srms…` carries the title *"Schemes Implemented By National Safai Karamcharis Finance & Development Corporation"* — a title/URL mismatch.
- **State schemes sit in the same list as central schemes with no jurisdiction label** — Maharashtra's Savitribai Phule Scholarship and Rajarshi Chhatrapati Shahu Maharaj Merit Scholarship, Haryana's Mukhyamantri Vimukt Ghumantu Swarozgar Yojana, Rajasthan's Gadia Lohar Scheme. A citizen cannot tell whether they are eligible to apply.
- Several records are not schemes but status pages frozen in time: *"Status of Self Employment Scheme for Rehabilitation of Manual Scavengers as on 30 April, 2018"*, *"Financial & Physical Achievements of last five years upto 31.03.2018"*.
- The events feed links to an item slugged **`test-2-state-rajasthan`**.
- The footer misspells *"Misutilization of **Grands**"* and *"Online Portal **tor** Grant in Aid Schemes"*.
- Both sites return **HTTP 200 for pages that do not exist** (soft 404s). `dosje.gov.in/accessibility/` returns a genuine 404.
- `socialjustice.gov.in`'s footer still advertises support for *"Internet Explorer 8.0+"* and *"minimum 1024x768px resolution"*.

### D9 · Compliance exposure

GIGW 3.0's stated key thrust is *"the implementation of user-centric information architecture (IA) to ease the user journey and provide content as per the user profile."* A division-shaped IA sitting on an unpopulated eligibility model does not meet it. Mandatory checkpoint 21 requires MyScheme API integration; there is no evidence of it. `/accessibility/` — a GIGW-required page — returns 404.

---

## 4. Recommended enhancements

Ordered as: the model, then the surfaces, then content operations. Each is tagged with the diagnosis it closes.

### R1 · Make eligibility a data model, not prose — *closes D3, D5*

Every scheme record gets a structured, **multi-valued** eligibility object:

| Axis | Values |
|---|---|
| `community` | SC · OBC · EBC · DNT/VJNT/NT-SNT · general |
| `occupationGroup` | safai karamchari / sanitation worker · waste picker · manual scavenger and dependants · artisan · none |
| `lifeStage` | child · school student · higher-education student · working age · senior citizen |
| `gender` | woman · man · transgender person · any |
| `situation` | victim of atrocity · affected by substance use · in destitution or begging · person with disability · PM CARES child · BPL |
| `jurisdiction` | Central · State *(named)* · Corporation / channelising agency |
| `benefitType` | scholarship · fellowship · loan or credit · subsidy · grant-in-aid · hostel or residential · training and skilling · assistive aid · award · legal aid · infrastructure |
| `deliveredBy` | MoSJE division or organisation |
| `applyVia` | portal URL **and** offline route |
| `status` | open · closed · rolling, with dates |

Multi-valued is the point. An SC girl in class 11 must appear under *Scheduled Castes*, *women and girls*, *school students* and *scholarships* — simultaneously. **This is the change every other recommendation depends on.**

### R2 · Replace seven administrative menus with a task-and-audience split — *closes D4, D6*

| New primary navigation | Contains |
|---|---|
| **Find support** | The finder, plus browse by community, life stage, situation, benefit |
| **Apply & track** | Application routes, application status, documents you will need, grievances |
| **Our organisations** | The 18, each with its plain-language name as the primary label |
| **Rules & reports** | Acts, policies, circulars, annual reports, RTI, publications |
| **Tenders & careers** | — |
| **About the Department** | Who's who, divisions, directory, contact |

The 18 acronyms already carry their expansions in the site's own markup ("NCSK — National Commission for Safai Karamcharis"). Promote the expansion to the primary label and demote the acronym.

### R3 · Build "Find support for you" — a five-question finder, as the homepage's primary action — *closes D2, D6, D7*

All questions skippable, no login, no Aadhaar.

1. **Who is this for?** — myself · someone in my family · an organisation I run
2. **Which community do you belong to?** — SC · OBC · EBC · DNT/VJNT · not sure *(with a "why we ask" link to the list of Scheduled Castes)*
3. **What stage of life?** — in school · in college or beyond · working · a senior citizen
4. **What kind of help do you need?** — education and fees · money to start or run work · a home · health and care · safety and legal help · skills and a job
5. **Which state do you live in?** — separates central from state schemes and routes to the right channelising agency

Each result card states, in plain language: **what you get · who can apply · what you'll need**, and one primary button that is either *"Apply on <portal>"* or *"Where to apply near you"*.

Skipping a question **widens** the result set rather than blocking. The finder must always return something — and when nothing matches, it routes explicitly: *"Support for persons with disabilities is handled by the Department of Empowerment of Persons with Disabilities — depwd.gov.in."*

Modelled on myScheme's personalised search (B1), but deliberately shorter: myScheme's profile form asks more than a first-time visitor will complete.

### R4 · Replace "Explore User Personas" with real, filtered audience landings — *closes D2, D7*

Nine landings, each a **pre-filtered view of the same scheme data**, not a card deck of links:

Scheduled Caste families · OBC & EBC families · DNT, nomadic & semi-nomadic communities · Safai karamcharis & sanitation workers · Senior citizens & carers · Transgender persons · Persons affected by substance use · Victims of caste atrocities · NGOs & voluntary organisations

Each opens with the three most-used schemes for that group, the one thing most people come to do (apply / track / complain), that group's helpline (Elderline 14567, NMBA 14446, NHAA), and then the full filtered list.

Retire **"Beneficiary"** as a label — it names the government's relationship to the reader, not the reader. Add a tenth item that is a signpost rather than a landing: **"Looking for disability support?"** → DEPwD.

### R5 · Rebuild the catalogue as a faceted, server-rendered index — *closes D3, D8*

- **Server-render the list.** Removes the "Loading…" defect and makes schemes indexable.
- **Facets as URL parameters**, so a filtered view is linkable and shareable: `/schemes?community=sc&lifeStage=student`.
- **Facets:** Community · Life stage · Situation · What you get · Who runs it · Central or State · Open now. They combine (AND across axes, OR within), with a live result count on every value so empty combinations are visible before they are chosen.
- **One fixed scheme template**, on myScheme's spine: **What you get · Who can apply · What you'll need · How to apply · Where to apply · Deadlines · Questions.** A plain-language `h1`, with the administrative title retained beneath as *"Official name"*.
- **Label every record with jurisdiction** and move state schemes behind a state filter.

### R6 · Put the four citizen tasks on the homepage, in verbs — *closes D6*

**Check what you can get** · **Apply for a scholarship** · **Track an application** · **Raise a grievance**. Taken directly from DEPwD's "Most Used Services" and NSP's top-level "Scholarship Eligibility / Application Status".

### R7 · Fix search: index the model, not the tags — *closes D7, D9*

- Search the structured eligibility fields, titles, aliases and body — not the free-text tag list that produced *"disability arising from untouchability"*.
- Add a **synonym layer** so colloquial and vernacular terms resolve: *pension* → senior-citizen schemes; *scholarship for SC* → Post-Matric; *safai*, *sewer* → NAMASTE, SRMS, NSKFDC; *nasha*, *de-addiction* → NMBA; *PM-SURAJ*, *TAPAS*, *e-Anudaan* → their pages.
- Keep the existing result grouping by content type with counts — it already works — and promote it into browse.
- **Zero-result routing:** never return an empty page without naming where else to look.
- **Publish the scheme data as an open API and register it with myScheme**, satisfying GIGW 3.0 checkpoint 21.

### R8 · Consolidate the two websites and retire the legacy one — *closes D1*

Publish a canonical inventory reconciling dosje's 141 records against socialjustice's "Major Schemes". The seven currently missing from dosje — **PM-SURAJ, TAPAS, DAMS, PM-AGY, Development Action Plan for Scheduled Castes, Ageing with Dignity, e-ANUDAAN** — are the immediate backlog. Then redirect `socialjustice.gov.in` URL-for-URL to `dosje.gov.in` with 301s and keep one site. Two live ministry sites is the root cause of D1 and a permanent tax on every content update.

### R9 · Content operations — make the model stay true — *closes D8, D9*

- A **publishing template that will not save** a scheme record without community, life stage, benefit type, jurisdiction, apply route and a review date. This is what stops D3 recurring.
- A **quarterly stale-content sweep**: flag any record whose review date has passed or whose title contains a frozen date. Immediate targets — the 24 empty scheme pages, the 2018 status pages, the two numeric slugs, the SRMS title/URL mismatch, `test-2-state-rajasthan`.
- Remove the Bootstrap placeholder select from the global footer; fix *"Grands"* and *"tor"*; return real 404 status codes.
- Restore `/accessibility/`, and run a WCAG 2.2 AA audit of the finder before launch.

---

## 4.1 Redesigned journeys

### Journey A — Meena, 17, Scheduled Caste, class 12, small town

**Now.** Home → Offerings → Schemes & Services → waits for *"Loading…"* → filters Target Group = *Scheduled Castes* → 5 results, none a scholarship → back → filters *Students* → 51 results, unsorted, central and state mixed → opens *Post Matric Scholarship* → administrative prose, no apply button. Abandons; asks the cyber-café operator.
**Steps: 8. Dead ends: 2. Outcome: intermediary.**

**After.** Homepage → *Check what you can get* → five questions (myself · SC · in school · education and fees · Bihar) → four matched schemes, Post-Matric first → *What you get / Who can apply / What you'll need* → **Apply on National Scholarship Portal**.
**Steps: 4. Dead ends: 0. Outcome: application started.**

### Journey B — Ramesh, 42, sewer worker seeking rehabilitation finance

**Now.** No facet describes him. *Sanitation Workers* is closest: 18 results, including *"Status of Self Employment Scheme … as on 30 April, 2018"* and three duplicate NAMASTE guideline records. The NSKFDC loan route is described inside an *Associated Organisation → How to Apply* page reachable only from the organisations menu.

**After.** *Safai karamcharis & sanitation workers* landing → top three: NAMASTE, SRMS via NSKFDC, Swachhta Udyami Yojana → **Where to apply near you** → his State Channelising Agency, with a telephone number.

### Journey C — Lata, 34, caring for her mother, aged 71

**Now.** The word *senior* appears nowhere in the primary navigation. Her mother's schemes sit under *Social Defence* in the footer and under the acronym *SCW* in the organisations menu. Elderline is a scheme record, not a phone number on any page she will reach.

**After.** *Senior citizens & carers* landing → **Elderline 14567** in the page header → AVYAY, Rashtriya Vayoshri Yojana, IPSrC, geriatric caregiver training → the finder's *"someone in my family"* path preserved throughout.

---

## 5. Implementation roadmap

### Phase 0 — Stop the bleeding · 2–3 weeks · effort **low** · impact **medium**

Remove the Bootstrap placeholder select from the footer; fix the two typos; return real 404 status codes; restore `/accessibility/`. De-list the 24 empty scheme pages and the frozen 2018 status pages; fix the SRMS title/URL mismatch and the two numeric slugs; remove the test event. Fix the *Publications → "Explore Schemes"* CTA and move persona URLs off `/home-page/`. In the Next.js rebuild, give the Target Group column a real value or remove the column.

*Owner: content + web team. Nothing here is blocked by anything.*

### Phase 1 — Populate the model · 4–8 weeks · effort **high** · impact **very high** · **critical path**

Define the eligibility schema (R1) and backfill all 141 records. Reconcile the seven flagship schemes missing from dosje (R8, first half). Resolve the scheme/organisation collision — NMBA, SMILE, the transgender portal, PM-AJAY, NOS, SCW and DWBDNC become schemes carrying an organisation attribute (D5). Rewrite the category vocabulary (13 values → 8 benefit types) and the target-group vocabulary (11 values → the axes in R1).

### Phase 2 — Surfaces · 6–10 weeks · effort **medium-high** · impact **very high**

Server-rendered faceted catalogue with URL-addressable filters and the fixed scheme template (R5). Nine audience landings plus the DEPwD signpost (R4). Four verb CTAs on the homepage (R6). Navigation restructure (R2). Parallelisable once Phase 1 lands.

### Phase 3 — The finder and search · 6–8 weeks · effort **medium** · impact **very high**

"Find support for you" (R3), WCAG 2.2 AA audited, and tested unmoderated with at least eight people drawn from the actual constituencies, in Hindi and one other language. Search rebuilt on the structured model with the synonym layer and zero-result routing (R7).

### Phase 4 — Consolidation and compliance · ongoing · effort **medium** · impact **high**

Publish the scheme API and register with myScheme (GIGW 3.0 checkpoint 21). 301 `socialjustice.gov.in` → `dosje.gov.in` and retire the legacy site (R8). Publishing template with mandatory fields, plus the quarterly sweep (R9). **Drop the BETA flag only after Phases 0–3 are complete.**

### Sequencing note

**Phase 1 is the constraint.** The finder, the landings, the facets and the search are all views over one eligibility model. Building any surface before that model is populated reproduces precisely the current failure — a filter that works perfectly, over data that does not.

---

## Sources

- [Ministry of Social Justice and Empowerment (SAMAVESH)](https://www.dosje.gov.in/)
- [Department of Social Justice and Empowerment (legacy)](https://socialjustice.gov.in/)
- [myScheme — national scheme discovery platform](https://www.myscheme.gov.in/)
- [Department of Empowerment of Persons with Disabilities](https://depwd.gov.in/en/)
- [National Scholarship Portal](https://scholarships.gov.in/)
- GIGW 3.0 — `docs/guidelines/GIGW-3.0/GIGW_3.0.md`
