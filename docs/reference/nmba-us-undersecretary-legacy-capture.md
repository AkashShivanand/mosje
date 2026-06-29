# NMBA Treatment-Centre — US / Under Secretary (DOSJE) role — LIVE legacy capture

> Captured **2026-06-29** from the live legacy portal
> `https://nmba.dosje.gov.in/treatment-centre/*` (IDAMS backend), logged in as
> **Project Id `USDP1`** → role banner: **"Under Secretary MoSJE (Under Secretary…) (DOSJE)"**.
> Purpose: verify & complete the existing `apps/portals/nmba` US-role clone.
> **Hard rule reminder:** synthetic data only in the clone — patient-level rosters are
> reproduced as STRUCTURE + synthetic rows, never real PII. Aggregate stats and master
> lists below are non-PII and can be mirrored to make the demo realistic.

Login flow (same as other roles): `/treatment-centre/login-otp` → enter Project Id
`USDP1` → **Send OTP** (real OTP sent to registered mobile `97******37`) → enter OTP
`123456` (universal demo OTP) → **Verify & Login** → `/treatment-centre/dashboard`.

Left sidebar for this role: **Dashboard · Reports (▾) · Masters Management (▾) · Nasha Mukt Bharat Saptah 2026**.

---

## 1. Dashboard (`/treatment-centre/dashboard`)

### KPI cards (8 — paired Total / Today)
| Card | Value |
|------|-------|
| Total Registration | 17156 |
| Today's Registration | 54 |
| Total In-Patient Registration | 17156 |
| Today's In-Patient Registration | 54 |
| Total Re-Admission | 11 |
| Today's Re-Admission | 0 |
| Total Follow Up Cases | 100 |
| Today's Follow Up Cases | 2 |

> ⚠️ Discrepancy vs our build: live shows **In-Patient Registration** pair; our build used
> a generic "Registration" pairing. Reconcile card labels & ordering.

### Analytical Report (pie) — filter: Gender / Place of Residence / Treatment Taken
- **Gender:** Male 96.45% · Female 3.54% · Transgender 0.01%
- **Place of Residence:** Rural 63.81% · Urban 36.19%
- **Treatment Taken:** No Previous Treatment Taken 82.36% · Central Govt De-addiction Facility 3.35% · DoSJE supported GIA 7.47% · Private De-addiction Facility 5.33% · State Govt De-addiction Facility 1.48%

### Drug Distribution (bar, 16 bars) — Number of Patients
| Drug | Count |
|------|-------|
| (unlabeled / 0) | 17 |
| Alcohol | 10,941 |
| Cannabis | 2,181 |
| Synthetic Cannabinoids | 210 |
| Opioids | 3,024 |
| Sedatives | 147 |
| Cocaine | 87 |
| Stimulants (incl. amphetamines) | 11 |
| Synthetic cathinone | 2 |
| Caffeine | 31 |
| Hallucinogens | 28 |
| Nicotine | 1,164 |
| Volatile Inhalants | 79 |
| MDMA and related | 30 |
| Dissociative Drugs | 14 |
| Other Specified | 113 |

### State Wise Report (bar, 32 states/UTs) — Number of Patients
| State/UT | Count |
|----------|-------|
| Jammu and Kashmir | 596 |
| Himachal Pradesh | 108 |
| Punjab | 588 |
| Chandigarh | 7 |
| Uttarakhand | 240 |
| Haryana | 31 |
| Delhi | 948 |
| Rajasthan | 366 |
| Uttar Pradesh | 184 |
| Bihar | 532 |
| Arunachal Pradesh | 75 |
| Nagaland | 55 |
| Manipur | 2,101 |
| Mizoram | 240 |
| Tripura | 16 |
| Meghalaya | 5 |
| Assam | 1,908 |
| West Bengal | 365 |
| Jharkhand | 409 |
| Odisha | 983 |
| Chattisgarh | 235 |
| Madhya Pradesh | 957 |
| Gujarat | 83 |
| Maharashtra | 286 |
| Andhra Pradesh | 2,754 |
| Karnataka | 212 |
| Goa | 1 |
| Kerala | 411 |
| Tamil Nadu | 426 |
| Puducherry | 19 |
| Andaman and Nicobar | 4 |
| Telangana | 2,011 |

### Age Wise Report (bar, 6 buckets) — Number of Patients
| Age band | Count |
|----------|-------|
| 18-25 | 2,842 |
| 26-35 | 5,985 |
| 36-55 | 7,418 |
| 56-70 | 782 |
| 71-100 | 52 |
| Other | 77 |

---

## 2. Reports (submenu)

Sidebar labels → live URLs:
1. **Activity Report Date Wise** → `/treatment-centre/treatmentCentreWiseActivties`
2. **Treatment Centre Report Date Wise** → `/treatment-centre/treatmentCentreWisepatient`
3. **State Report Date Wise** → `/treatment-centre/stateWisepatient`
4. **Analytical Report** → `/treatment-centre/categorywisereport`

### 2.1 Activity Report Date Wise (`/treatmentCentreWiseActivties`)
Heading: **"Treatment Centre wise activities Report"** · badge **Total Activities : 163**.
Filters: **Treatment Centre** (searchable dropdown of ALL ~450 centres, each tagged
`(IRCA|ODIC|CPLI|DDAC|SLCA|ADMIN)`), **From Date**, **To Date**, **Search**, **Reset**.
Ranking column shows 🥇🥈🥉 medals for top 3.

Columns: `Ranking · Project ID · Name of the Treatment Centre · Type of Treatment Centre ·
No. of Tentative Programs · No. of Completed Programs · Total Outreach · Total No. of
Male/Boys Participants · Total No. of Female/Girls Participants · Total No. of Educational Institutions`

Top 10 (of 114 results, 12 pages):
| Rank | Project ID | Centre | Type | Tentative | Completed | Outreach | Male | Female | Edu Inst |
|------|-----------|--------|------|-----------|-----------|----------|------|--------|----------|
| 1 | DR/AP/CHI/00699 | RASHTRIYA SEVA SAMITHI RASS | IRCA | 25 | 25 | 2858 | 1441 | 1417 | 33 |
| 2 | DR/RJ/UDP/06313 | AAROGYA SEWA SANSTHAN CHADERIYA | DDAC | 22 | 22 | 3980 | 2309 | 1671 | 38 |
| 3 | DR/MP/GWL/01006 | AHINSHA MAHILA BAL KALYAN … SAMITI | ODIC | 21 | 21 | 2050 | 1112 | 868 | 21 |
| 4 | DR/MH/AMV/01130 | DHARAMSAMANWAY … KARLA AMRAVATI MH | IRCA | 17 | 17 | 1089 | 411 | 678 | 7 |
| 5 | DR/OR/KHD/00036 | BHAIRABI CLUB | IRCA | 15 | 15 | 2017 | 1097 | 920 | 17 |
| 6 | DR/RJ/PPG/14984 | ADARSH GRAMIN SHIKSHAN SAMITI | DDAC | 14 | 13 | 1814 | 915 | 834 | 13 |
| 7 | DR/BR/PTN/00289 | JAGRAN | IRCA | 13 | 13 | 560 | 405 | 188 | 12 |
| 7 | DR/CT/RPR/00202 | SANKALP SANSKRITIK SAMITI | IRCA | 13 | 13 | 604 | 325 | 279 | 6 |
| 9 | DR/BR/BGO/13410 | JAGRAN | DDAC | 12 | 12 | 552 | 266 | 285 | 12 |
| 10 | DR/OR/GNJ/01615 | NILACHAL SEVA PRATISTHAN | IRCA | 11 | 11 | 2245 | 1316 | 929 | 14 |
| — | **Grand Total** | | | **163** | **162** | **17769** | **9597** | **8069** | **173** |

> Centre filter list = the project/NGO master (~450 orgs, each with a centre-type tag).
> For the synthetic clone, use ~12 representative centres rather than the full 450.

### 2.2 Treatment Centre Report Date Wise (`/treatmentCentreWisepatient`)
Heading: **"Treatment Centre wise registered patients"** · badge **Total Beneficieries : 17160**.
Filters: **State** · **District** (--All Districts--, depends on State) · **Treatment Centre** ·
**From Date** · **To Date** · **Search**. DataTables toolbar: **Copy / Excel / CSV**, **Show
10/25/50/100 entries**, **Search:** box, sortable headers, **First/Previous/Page X of N/Next/Last** pager.

Columns: `S.No · State · District · Project ID · Name of the Treatment Centre · Type of
Treatment Centre · Number of Beneficiaries` (the count is a **link → drill-down to that
centre's beneficiary roster**; PII — clone as synthetic).

Top 10 (of **303 entries, 31 pages**):
| # | State | District | Project ID | Centre | Type | Beneficiaries |
|---|-------|----------|-----------|--------|------|---------------|
| 1 | UTTAR PRADESH | ALIGARH | - | - | - | 0 |
| 2 | ANDHRA PRADESH | ANNAMAYYA | DR/AP/AYA/16132 | SARVODAYA WOMEN WELFARE SOCIETY | DDAC | 114 |
| 3 | ANDHRA PRADESH | GUNTUR | DR/AP/CHI/00699 | RASHTRIYA SEVA SAMITHI RASS | IRCA | 44 |
| 4 | ANDHRA PRADESH | CHITTOOR | DR/AP/CHI/14348 | PEOPLES ACTION FOR SOCIAL SERVICE | DDAC | 33 |
| 5 | ANDHRA PRADESH | Y.S.R. | DR/AP/CHI/01464 | PEOPLES ACTION FOR SOCIAL SERVICE | IRCA | 19 |
| 6 | ANDHRA PRADESH | EAST GODAVARI | DR/AP/EGI/01835 | PUSHAKARA MATHA CONVENT COMMITTEE | ODIC | 554 |
| 7 | ANDHRA PRADESH | EAST GODAVARI | DR/AP/EGI/01099 | PUSHAKARA MATHA CONVENT COMMITTEE | IRCA | 45 |
| 8 | ANDHRA PRADESH | ELURU | DR/AP/ERU/14670 | DEVI EDUCATIONAL SOCIETY | DDAC | 161 |
| 9 | ANDHRA PRADESH | WEST GODAVARI | DR/AP/KAK/14726 | PUSHAKARA MATHA CONVENT COMMITTEE | DDAC | 564 |
| 10 | ANDHRA PRADESH | KRISHNA | DR/AP/KRS/17156 | AAKARSHA FOUNDATION | DDAC | 18 |

> **State filter master (37 entries)**: Andaman and Nicobar · Andhra Pradesh · Arunachal
> Pradesh · Assam · Bihar · Chandigarh · Chattisgarh · Dadra & Nagar Haveli · Daman & Diu
> (only Daman) · Delhi · Goa · Gujarat · Haryana · Himachal Pradesh · Jammu and Kashmir ·
> Jharkhand · Karnataka · Kerala · Ladakh · Lakshadweep · Madhya Pradesh · Maharashtra ·
> Manipur · Meghalaya · Mizoram · Nagaland · Odisha · Puducherry · Punjab · Rajasthan ·
> Sikkim · Tamil Nadu · Telangana · Tripura · Uttar Pradesh · Uttarakhand · West Bengal.
> (Dashboard chart shows only the 32 with data.)

### 2.3 State Report Date Wise (`/stateWisepatient`)
Heading: **"State Wise Report"** · badge **Total Beneficieries : 17162**.
Filters: **State** · **From Date** · **To Date** · **Search**. DataTables toolbar (Copy/Excel/CSV,
Show entries, Search, sortable, pager).
Columns: `S.No · State Name · Number of Persons` (count is a **link → drill-down to that
state's roster**).
Row counts match the dashboard State-Wise chart (e.g. Andhra 2755, Assam 1908, Delhi 948,
Bihar 532, Chattisgarh 235, Chandigarh 7, Goa 1, Andaman 4 …). Use those values.

### 2.4 Analytical Report (`/categorywisereport`)
⚠️ On the live site this menu item **redirects to `/stateWisepatient` (State Wise Report)** —
the standalone `categorywisereport` page appears deprecated. The actual "Analytical Report"
content (Gender / Place of Residence / Treatment Taken pie) lives on the **Dashboard** (§1).
In our clone, keep the Analytical Report as the dashboard pie; the menu item can point to the
analytics section rather than a dead page.

### 2.5 Drill-downs (state/centre roster)
"Number of Persons" / "Number of Beneficiaries" counts are links to encoded roster pages
(e.g. `/treatment-centre/statewise/<base64-id>`). These show patient-level rosters → **PII**.
Clone as synthetic rosters only.

## 3. Masters Management (submenu) — **13 items** (our clone has only 3)

Every master page is the same CRUD pattern: heading **"List X"** · **"Add X"** button ·
**Copy / Excel / CSV** export · **Search:** box · **Show 10/25/50/100 entries** · columns
`S.No · <X> Name · Action` (Edit; some have Delete) · DataTables pager. Sidebar order + URLs:

| # | Sidebar label | URL | Rows | Notes |
|---|---------------|-----|------|-------|
| 1 | Content management | `/content` | 3 | columns incl. Type + Description + Is Active |
| 2 | Whats New | `/whatsnew` | 8 | PDF upload master (Title/Link/Pdf/Size/Created/Is Active) |
| 3 | Category | `/listcategory` | 4 | |
| 4 | Drugs | `/listdrugdetail` | 15 | |
| 5 | Education | `/listeducation` | 7 | |
| 6 | Employment | `/listemployement` | 8 | |
| 7 | Income | `/listincome` | 6 | "List Income Slab" |
| 8 | Marital Status | `/listmarital` | 7 | |
| 9 | Occupation | `/occupation` | 11 | |
| 10 | Referral | `/referral` | 10 | |
| 11 | Cause of Substance Use | `/listCauseofSubstanceUse` | 9 | |
| 12 | Gender | `/genderlist` | 3 | has Active/Inactive status |
| 13 | Place of Residence | `/placeofresidence` | 4 | has Active/Inactive status |

### Full master lists (safe to mirror — reference data, no PII)

**Category (4):** Unreserved · OBC · SC · ST

**Drugs (15):** Alcohol · Cannabis · Synthetic Cannabinoids · Opioids · Sedatives, hypnotics
and anxiolytics · Cocaine · Stimulants including amphetamines, methamphetamines or
methcathinone · Synthetic cathinone · Caffeine · Hallucinogens · Nicotine · Volatile Inhalants
· MDMA and related drugs including MDA · Dissociative Drugs including ketamine and phencyclidine
· Other Specified Psychoactive Substances

**Education (7):** Professional Degree · Graduate · Intermediate/Diploma · High School ·
Middle School · Primary School · Illiterate

**Employment (8):** Currently Unemployed · Never Employed · Employed · Self-Employed ·
House person · Any Other · Not Known · never employed *(row 8 is a lowercase dup of row 2 —
data-entry artefact; drop in clone)*

**Income Slab (6):** &lt;7500 · 7501-20,000 · 20,001-35,000 · 35,001-45,000 · 45001-60,000 · &gt;60,000

**Marital Status (7):** Never Married · Married · Divorced · Separated · Separated due to
Drug Use · Widow/Widower · Cohabiting

**Occupation (11):** Legislators/Senior Officials/Managers · Professionals · Technical/Associate
Professionals · Clerk · Skilled Worker, shop and market sales workers · Skilled agricultural and
fishery workers · Craft and related trade workers · Plant and machine operators and assemblers ·
Elementary Occupation · Unemployed · Teacher

**Referral (10):** Self · Family · Friends · Private Practitioner · Hospital/ Health Centre ·
Referral · National Drug De-addiction Helpline · Awareness Programme · Recovered User · other

**Cause of Substance Use (9):** Anxiety and Depression · Loneliness · Curiosity · Peer Pressure
· Individual Problem · Family Problem · Occupation-Related · Adverse Childhood Experiences ·
Any other Social Problem

**Gender (3):** Male (Active) · Female (Active) · Transgender (Active)

**Place of Residence (4):** Rural (Active) · Urban (Active) · Semi Urban (Inactive) · Urban slum (Inactive)

**Content Management (3):** Copyright Policy (Policy) · Terms & Conditions (Policy) · About Us (Content)

**Whats New (8):** PDF/news upload entries (mostly test data on live) — clone as a small
upload-master with Title/Link/Pdf/Size/Created/Is Active columns + "Add Whats New".

## 4. Activity List & "Nasha Mukt Bharat Saptah 2026"

⚠️ The sidebar item **"Nasha Mukt Bharat Saptah 2026"** routes to the **same Activity List
page** (`/activity-list`) for this role — they are one screen.

Heading **"Activity List"** · **"Add New Activity"** (`/add-activity`).
Filters: **Treatment Centre** (the ~450 centre dropdown) · **Activity Category** (34-item master) ·
Search · Reset.
Columns: `S.No · Project ID · Treatment Center · Type of Activity · Date of Activity ·
Coordinating Department's Name · Total No. of People Participating · No. of Males/Boys ·
No. of Women/Girls · No. of Educational Institutions · Images/Videos · Created At · Action`.
**648 records, 65 pages.** Sample rows: NARAYAN SEWA SAMITI (IRCA) — "Training and awareness…"
— 17-06-2026 — 125 participants; ADARSH GRAMIN SHIKSHAN SAMITI (DDAC) — "NMBA pledge…" — 25.

**Activity Category master (34):** Slogan Writing Competition · Rangoli Making Competition ·
Drawing competition · Marathon/Walkathon/Cyclothon · Training and awareness generation
activities with children, adolescents, youth and Nasha Mukti Mitr · Sports and physical
activities · Seminars, Webinars or Workshops · Nukkad Natak, Skits and Play · Flash mobs,
drives and Rallies · NMBA pledge (including e-pledge) … · Community mapping … · Wall
Paintings/Graffiti … · Video-making or short film making · Activities with NSS/NCC/NYK
volunteers … · Yoga and Meditation Activities · Documentaries/Film Screenings … · Awareness
generation through NMBA vehicles · Sensitizing the general public about schemes … · Distribution
of IEC Material … · Organising Inter/Intra University Debate/Essay/Painting/Drawing Competitions
· Formation of Clubs … · Identifying influential alumnis … · Focus Group Discussions … · Social
Media Campaigns · Identification of local brand ambassadors/influencers · Surveys and preparatory
studies · Celebration of international/national days … · Using regional channels/newspapers/radio
… · Formation of support groups/counselling networks · A sub-campaign re: ban of substances near
colleges · Involvement and convergence with govt departments · Networking with SHGs/local
leaders/NGOs · Activities in vulnerable/border/tribal regions · Health Related Activities/Camps

## 5. Real centre value-IDs (from the centre dropdown) — fixes our `roles.ts` guess

The live centre dropdown carries the true backend IDs. The "Ministry of social justice and
empowerment" / "Under Secretary MoSJE" rows give the canonical role centerIds:

| Centre (type) | value/centerId |
|---------------|----------------|
| Ministry of social justice and empowerment (ADMIN) | 650 |
| Ministry of social justice and empowerment (DDAC) | 651 |
| Ministry of social justice and empowerment (DDAC) | 652 |
| Ministry of social justice and empowerment (ODIC) | 653 |
| Ministry of social justice and empowerment (IRCA) | 654 |
| Under Secretary MoSJE (ADMIN) | **655** |
| Ministry of social justice and empowerment (CPLI) | 656 |

> Our `roles.ts` has IRCA 654 / ODIC 653 / CPLI 656 / DDAC 651 ✅ correct, but **US = 100**
> is wrong — the real US/Under-Secretary centre is **655** (ADMIN). Fix to 655.

## 6. Reconciliation — live vs our existing clone (gap list)

| Area | Live (USDP1) | Our build | Action |
|------|--------------|-----------|--------|
| Login id | `USDP1` (real) | `US001` (demo) | Keep `US001` as demo alias; optionally add `USDP1`. |
| Dashboard KPIs | 8 cards: Total/Today × Registration, In-Patient Reg, Re-Admission, Follow-Up | 6 cards, generic labels | Re-label to 8-card live set. |
| Dashboard charts | Analytical pie (3 filters) + Drug Distribution + **State Wise** + **Age Wise** | partial | Add State-Wise + Age-Wise charts; wire 3 analytical filters. |
| Reports menu | 4 (Activity, Treatment-Centre, State, Analytical→redirect) | 4 built | Verify columns match captured specs; Analytical = dashboard pie. |
| Masters | **13** masters | **3** (Category, Drugs, Education) | **Add 10 missing masters** (+ Content Mgmt, Whats New). |
| Activity List | full screen, 34-cat filter, 13 cols | shared screen exists | Verify columns + add Activity-Category master. |
| US centerId | 655 | 100 | Fix to 655. |

**Hard rule:** all patient-level rosters (drill-downs) remain **synthetic** in the clone; only
aggregates, master lists, and structures above are mirrored from live.
