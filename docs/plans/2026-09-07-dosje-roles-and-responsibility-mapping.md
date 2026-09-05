# Who Maintains This Website

**A roles and responsibility mapping for `www.dosje.gov.in` — SAMAVESH**

Prepared for the Department of Social Justice & Empowerment · Traversal date **3 September 2026**
· Status **Draft for departmental review** · Workstream A of the plan agreed on the review call of
3 September 2026.

---

## 0. Summary — the answer, in one page

The Department's website is a single WordPress installation carrying **146 distinct things that
somebody has to keep true**: 90 pages, 21 organisation page-trees, 10 division link groups, 14
telephone directories, 12 record collections and 19 homepage components. Between them they hold
**5,960 documents, 448 officer records, 615 events, 589 gallery items, 312 tenders, 165 vacancies
and 140 schemes.**

Maintaining that needs **14 kinds of login across 39 assignments.** The model described on the
review call — *"twelve organisations and one admin"* — covers **two of the fourteen kinds** and at
most **13 of the 39 assignments.**

| | Kinds of role | Assignments |
|---|---|---|
| Needed to maintain the site as it stands | **14** | **39** |
| Identified today ("12 organisations + 1 admin") | 2 | 13 |
| **Gap** | **12** | **26** |

**The three things this document asks the Department to decide** are in §7. **The single most
urgent** is §6.1: when an editor renames or deletes a page, this installation currently redirects
the old address to a page belonging to **a different organisation**. It is reproducible today, and
it is the strongest argument for settling ownership before more editors are given logins.

**One finding changes the shape of the problem.** The concern raised on the call — that the same
contact has to be typed in several places — is real, but it is not a limitation of WordPress. The
site already holds **448 officer records as a proper content type, and every one of them names the
organisation it belongs to.** The central model exists. It is simply not filled in: in a sample of
40 records, the office telephone number is missing on 35%, the address on 48%, and *Tenure* and
*Contact (Residence)* are empty on all forty. The hand-typed copies exist because the central
record was left blank, not because the system cannot hold it.

---

## 1. Method

1. **Live traversal.** The Department's own sitemap index was read on 3 September 2026 — 52
   sitemaps, **8,702 published URLs** across **14 content types**. The primary navigation, the
   footer, the Important Links rail and the homepage were parsed from the live HTML, not from
   memory of the screen-share.
2. **Record-level sampling.** Forty of the 448 officer records were fetched and their published
   fields counted, to establish whether the contact model is populated.
3. **Redirect testing.** Every page found in our August mirror but absent from the live sitemap was
   requested, and its HTTP status and redirect target recorded.
4. **Comparison against our mirror** — the content export held in the SAMAVESH repository,
   generated **24 August 2026** — to establish what has changed in ten days and what our copy never
   captured. Reported in §8.

The full row-by-row inventory is the companion file
`2026-09-07-dosje-page-ownership-inventory.csv` — 146 rows, one per page, component or collection.

---

## 2. What the site is made of

### 2.1 Content types published

| Content type | Records | Owner is recorded on the record? |
|---|---:|---|
| Documents | 5,960 | **No** — `category` is a document type, not an owner |
| Events | 615 | Not established |
| Gallery | 589 | Not established |
| **Officials** | **448** | **Yes — every record names its organisation** |
| Tenders | 312 | **No** — and 121 of 312 carry no category at all |
| Organisation pages | 239 | Yes, by URL position |
| Vacancies | 165 | **No** |
| Schemes & Services | 140 | **No** — 22 of 140 have effectively empty bodies |
| Scheme documents | 100 | Not established |
| Suo Moto Disclosure | 15 | Not established |
| CPIO | 14 | Not established |
| Bookings | 12 | Appears to belong to DAIC alone |
| Home-page sub-pages | 10 | n/a |
| Updates | 9 | n/a |
| **Pages** | **90** | n/a |

### 2.2 The Department's own grouping of its organisations

Taken verbatim from the Associated Organisations mega-menu. This document uses the Department's
words rather than inventing new ones.

| Group | Count | Bodies |
|---|---:|---|
| Commissions | 3 | NCSC · NCSK · NCBC |
| Corporations | 3 | NSFDC · NSKFDC · NBCFDC |
| Foundation / Autonomous Bodies | 5 | DAF · DAIC · BJRNF · DWBDNC · NISD |
| Scheme-specific Thematic Portals | 7 | SCW · PM-AJAY · SMILE-Transgender · SMILE Beggary · NOS · NMBA · NHAA |
| **In the menu** | **18** | |
| **Under `/organisation/` but not in the menu** | **3** | e-Utthaan (12 pages) · e-Anudaan (4) · List of Channelizing Agencies (1) |
| **Total organisation trees** | **21** | |

**This is the reconciliation of "twelve".** Eleven of these are institutional bodies — the three
Commissions, three Corporations and five Foundations / Autonomous Bodies. Adding the Ministry
itself gives twelve owners of a telephone directory, which is almost certainly what the figure
meant. It leaves **the seven thematic portals and the three unlisted trees without an owner.**

### 2.3 The ten divisions

The Important Links rail publishes 36 links across ten divisions: Scheduled Caste Welfare ·
Welfare of the Other Backward Classes · Grants-in-Aid to NGOs (11 links, the largest) · Budget and
Account · Social Defence · Public Grievance · Statistics Division · Official Language ·
Parliamentary Matters · Plan Division.

Five have an "About the Division" landing page; one has a directory. **The other five exist only as
a group of links in a rail** — which means they have content to maintain but no page to hold it.

---

## 3. The three classes of owner

Every one of the 146 rows falls into exactly one of these. The classes come from the site's own
structure, not from an org chart we have invented.

| Class | What it covers | Who should hold it |
|---|---|---|
| **Organisation-owned** | An attached body's whole page tree, its directory, its documents, tenders, RTI and contact pages | A nodal officer named by that organisation. Settled on the call and uncontroversial. |
| **Division-owned** | A Ministry division's pages and its group of links in the Important Links rail | The division's own dealing hand |
| **Common** | Home page, navigation, footer, Directory, Contact Us, the aggregate document/tender/vacancy listings, statutory pages | **This is the gap.** Nobody holds any of it today. |

The call already settled the first class. It also settled the working rule for the third:
*"whoever's page it is will maintain it"* — which is right, and only works if the common pages are
**assembled from** the organisations' own records rather than typed a second time. §6.2 shows why
that condition is not met today.

---

## 4. The role catalogue

Fourteen roles. The **Scope** column is what the login may create, edit and publish; anything not
listed is outside it.

| # | Role | Holders | Scope | Exists today |
|---|---|---:|---|---|
| **R1** | **Super-administrator** | 1 | Role creation, plugins, theme, redirects, everything below | **Yes** |
| **R2** | Home page & campaign editor | 1 | Hero carousel, SAMAVESH banner, Latest Updates, statistics counters, Offerings / Organisations / Activity Corner blocks, logo carousel, persona pages, `/dashboard`, `/newsletter` | No |
| **R3** | Navigation & site-structure owner | 1 | Primary menu, footer, Important Links rail, both sitemaps, URL structure and redirects | No |
| **R4** | Directory & officials custodian | 1 | The 448 officer records, `/mosje-directory`, `/whos-who`, `/contact-us`, `/mosje-contact`, `/chairpersons-office` | No |
| **R5** | Organisation editor | **11** | One institutional body's entire tree, its directory, its documents, tenders, RTI and contact pages | Partly — stated as 12 |
| **R6** | Scheme portal editor | **7** | One thematic portal's tree (SCW, PM-AJAY, SMILE ×2, NOS, NMBA, NHAA) | No |
| **R7** | Division editor | **10** | One division's pages and its group in the Important Links rail | No |
| **R8** | Documents librarian | 1 | The 5,960 documents and 100 scheme documents, their ten categories, and the aggregate listings | No |
| **R9** | Recruitment publisher | 1 | The 165 vacancies and `/vacancies` | No |
| **R10** | Procurement publisher | 1 | The 312 tenders and `/tenders` | No |
| **R11** | Events & Gallery editor | 1 | 615 events and 589 gallery items | No |
| **R12** | RTI, CPIO & grievance officer | 1 | `/rti`, `/cpio` (14 records), `/suo-moto-disclosure` (15 records) | No |
| **R13** | Statutory & policy pages owner | 1 | Copyright, Hyperlinking, Privacy, Terms, Help, Visitor Analytics — **and the Accessibility Statement, which does not exist** | No |
| **R14** | Schemes catalogue owner | 1 | The 140 scheme records and `/schemes-services` | No |
| | **Total** | **39** | | **13** |

### 4.1 Two rules that must be written into the roles, not left to habit

**Nobody but R3 may change a URL.** §6.1 shows what happens when a page moves.

**R5 and R6 publish; R8, R9 and R10 curate.** A document, tender or vacancy is published by the
organisation that owns it and appears in the aggregate listing automatically. This was agreed on
the call. It cannot be enforced today, because the records carry no owner — see §6.3.

---

## 5. Where the same content is maintained twice

Each row was confirmed on the live site on 3 September 2026.

| # | Content | Where it is entered | Consequence |
|---|---|---|---|
| **1** | **Directory** | The **same URL** `/mosje-directory` is listed **twice in the primary navigation** — under *Department* and again under *Connect*. The footer calls it *Ministers & Officials*. `/directory/` redirects to a **document**. | One page, four names. A citizen cannot tell whether they are different things. |
| **2** | **Officer contact details** | 448 officer records · 14 directory pages · `/whos-who` · `/contact-us` · `/mosje-contact` · a Contact page inside each of 17 organisation trees | The case raised on the call. See §6.2 — the central record exists but is empty. |
| **3** | **Documents** | Uploaded per page. Annual reports appear on organisation pages and again under `/annual-reports`. | 5,960 records with no owner and no single upload point. |
| **4** | **Vacancies and tenders** | Homepage tabs · `/vacancies` and `/tenders` · a Tenders page inside organisation trees | Three surfaces, no owner field to join them. |
| **5** | **Schemes** | Homepage tab · `/schemes-services` · a Schemes page inside organisation trees | Same. |
| **6** | **Navigation** | Primary menu · footer four-column menu · organisation left rails · Important Links rail | Four namings of one page set. *About Ministry* and *Vision & Mission* both point at `/about-us/`; *Who's Who* is *Organisational Chart* in the footer. |
| **7** | **Success Stories** | Published under **both** NSFDC and NBCFDC; a third URL redirects to the NSFDC copy | Two copies, and no rule saying which is current. |

**One honest exception.** Where an organisation's short description appears on both its card and its
page, a second entry may be unavoidable in this build. That should be stated in the assessment
rather than promised away.

---

## 6. Four findings that must be settled before more logins are issued

### 6.1 A renamed page sends the citizen to a different organisation

When a page is removed or renamed, this installation resolves the old address by matching the
**last part of the URL only**, and lands on whichever page shares that word.

| Old address, requested 3 September 2026 | Result |
|---|---|
| `/organisation/babu-jagjivan-ram-national-foundation-jrf/contact-us/` | **301 → DWBDNC's contact page** |
| `/organisation/national-backward-classes-…nbcfdc/about-us/` | **301 → DAIC's About Us** |
| `/organisation/success-stories/` | 301 → NSFDC's Success Stories |
| `/organisation/babu-jagjivan-ram-national-foundation-jrf/` | **404** |
| `/organisation/national-institute-of-social-defence/dams/` | **404** |
| **Control:** `/organisation/zzz-not-a-real-org/contact-us/` | **301 → DWBDNC's contact page** |

The control line proves the mechanism: **any** address ending in `/contact-us/` under
`/organisation/` is sent to DWBDNC, whether or not the organisation exists. A citizen following an
older link, a search result or a printed circular to BJRNF's contact page is given **DWBDNC's
telephone number and address**, under a *permanent* redirect that browsers and search engines
cache.

This is a governance finding, not only a technical one: the trigger is renaming or deleting a page —
precisely the action about to be delegated to a dozen editors. **R3 must own URL changes, and the
redirect rule must be corrected before the roles are issued.**

### 6.2 The single source of truth already exists — it was never filled in

Each of the 448 officer records carries: Name · Designation · **Organisation** · Tenure · Intercom ·
Contact (Office) · Contact (Residence) · Email · Address.

In a sample of 40 records:

| Field | Filled |
|---|---|
| Designation | **40 / 40 — 100%** |
| **Organisation** | **40 / 40 — 100%** |
| Email | 28 / 40 — 70% |
| Contact (Office) | 26 / 40 — 65% |
| Address | 21 / 40 — 52% |
| Intercom | 10 / 40 — 25% |
| Tenure | **0 / 40** |
| Contact (Residence) | **0 / 40** |

Ownership is recorded on every record. **The remedy is to populate the record and read every
surface from it, not to build a new system.** That work belongs to R4, with each R5 and R6 supplying
their own body's data.

### 6.3 Documents, tenders and vacancies have no owner

A document record carries `slug · title · sourceUrl · date · category`, where `category` is one of
ten *document types* — Advices (981), Resources (257), Annual Reports (211), Circulars &
Notifications (164), Notice (127), Publications (72), Acts & Rules (71), Forms & Templates (37),
MOU (33), POLICY (9). **None of them says who owns the record.**

Without an owner field, a role cannot be scoped to "this organisation's documents". Every editor
either sees all 5,960 or none. **Adding an owner field to Documents, Tenders and Vacancies is a
precondition for role-based editing**, not an improvement to be scheduled later.

### 6.4 Three defects that already have no owner, and show it

- **There is no Accessibility Statement.** `/accessibility/` returns **404** and the footer does not
  link one. GIGW 3.0 requires one on every Government of India website. It belongs to R13.
- **Two live addresses are misspelt** — `…misutilization-of-grands` (for *Grants*) and
  `…by-vuluntary-organisations` (for *voluntary*). Both are the canonical URLs; the correct
  spellings return 404. They belong to the Grants-in-Aid to NGOs division under R7, and correcting
  them needs R3, because of §6.1.
- **Four different links in the Statistics Division rail all read "SECC 2011"** — pointing to
  secc.dord.gov.in, About the Division, List of Research Evaluation Studies and the Handbook on
  Social Welfare Statistics. Three of the four labels are wrong. That rail belongs to R7 and R3.

---

## 7. What the Department is asked to decide

1. **Who holds the eleven common roles (R2, R3, R4, R8–R14)?** One officer may hold several. What
   cannot happen is that they stay unassigned, because every finding in §6 sits in that class.
2. **Directory and Contact Us — central or federated?** Our recommendation: **federated data,
   central presentation.** Each organisation maintains its own officers in the officials records
   (R5/R6); `/mosje-directory` and `/contact-us` are generated from them by R4 and are not typed.
   This is what the call already leaned to, and §6.2 shows it is achievable.
3. **Who owns the seven thematic portals and the three unlisted trees** — e-Utthaan, e-Anudaan and
   List of Channelizing Agencies? They are filed as organisations, they are not in the menu, and no
   nodal officer has been named.

---

## 8. What has changed on the live site since our copy of 24 August

Our mirror was taken on **24 August 2026**; the live site was traversed on **3 September 2026**.

| Collection | Live | Our copy | Reading |
|---|---:|---:|---|
| Documents | **5,960** | 1,962 | **Our copy is incomplete, not out of date.** 28 of the 30 document sitemaps have not changed since 19 June 2026, so those 4,000 records were already published when we pulled. Our crawler stopped early. |
| Organisation pages | 239 | 228 | 28 live pages we do not hold; 17 of ours no longer published |
| Vacancies | 165 | 163 | One genuinely new vacancy (DAIC internship, September 2026) |
| Tenders | 312 | 312 | Identical |
| Schemes | 140 | 140 | Identical |
| Events · Gallery · Officials · Scheme documents · Suo Moto · CPIO · Bookings · Updates | 615 · 589 · 448 · 100 · 15 · 14 · 12 · 9 | **not captured** | Eight content types our mirror never collected |

**Real changes on the live site in those ten days**

- **BJRNF's entire tree was renamed** — `…-jrf` became `…-bjrnf` across all ten pages. The old
  landing page now returns 404 and its contact page redirects to DWBDNC (§6.1).
- **PM-AJAY grew from 7 pages to 22**, adding Adarsh Gram reporting, village lists, a map,
  guidelines, PACC meeting lists and a contact page.
- **A fourteenth directory appeared** — `/nhaa-directory`.
- **Three pages moved into an organisation** — Success Stories into NBCFDC (a second copy; NSFDC
  also has one), Ministry and Scheme wise Financial Summary into e-Utthaan, and SCW gained a Scope
  page.
- **Two pages were removed** — NISD's `/dams/` and NCBC's `/gazette-notifications/`, the latter now
  redirecting to a `-2` duplicate of itself.
- **Pages our clone carries that the live site does not:** `/accessibility/`, `/search/`,
  `/de-addiction-centres/`, and the persona and policy pages at the root rather than under
  `/home-page/`. Our clone also uses the **corrected** spellings of the two misspelt URLs, so those
  two addresses do not match the live site.

**Two consequences for our own work.** The mirror must be re-pulled with all 30 document sitemaps
and the eight uncaptured content types; and our clone's corrected URLs should be recorded as a
deliberate divergence, so nobody copies them back into the live site and creates a 404.

---

## Annexe A — The inventory

`2026-09-07-dosje-page-ownership-inventory.csv` · 146 rows · columns: Section · Page or component ·
URL · Content type · Owner class · Proposed role · Assigned today · Same content also appears at ·
Note.

## Annexe B — Sources

- Live traversal of `www.dosje.gov.in`, 3 September 2026: sitemap index (52 sitemaps, 8,702 URLs),
  home page, `/contact-us/`, `/daf-directory/`, one organisation contact page, and a 40-record
  sample of `/official/`.
- Redirect and status testing of 13 addresses, including one control.
- SAMAVESH content export, manifest generated 24 August 2026.
- Review call of 3 September 2026 (recording and transcript).
- GIGW 3.0, `docs/guidelines/GIGW-3.0/`.
