# NMBA Portal Clone — Spec
> Nasha Mukt Bharat Abhiyaan (Drug De-addiction Portal)
> Status: DRAFT — ready for /build

---

## Objective

Clone the live NMBA portal (public + admin) into the MoSJE hub monorepo as `apps/portals/nmba`. The clone must reproduce every screen with real seeded data (20–30 rows per table), wire up all frontend-only interactions (filters, tabs, search, pagination), and show a toast acknowledgement for any action that would require a backend (form submissions, file uploads, OTP/SMS). The result serves as the structural and data foundation for a subsequent pixel-perfect Figma pass.

---

## Context and Reference

- **Pattern:** Same as `apps/portals/scw` — Next.js 15, React 19, Tailwind v3, `@mosje/design-system`, `@mosje/tokens`
- **BasePath:** `/portals/nmba`
- **Dev port:** `4126`
- **Package name:** `@mosje/portal-nmba`
- **Hub zone variable:** `ZONE_NMBA`
- **Hub rewrite pair:**
  ```
  /portals/nmba        → http://localhost:4126/portals/nmba
  /portals/nmba/:path* → http://localhost:4126/portals/nmba/:path*
  ```
- **Reference implementation:** `apps/portals/scw/` — copy its scaffold (`next.config.ts`, `package.json`, `tailwind.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.js` pattern) and adapt for NMBA.

---

## Scrape + Seed Documentation Process

This documents how seed data was obtained for this portal and establishes the reusable process for all future portals.

### Process (to be applied to all future portals)

1. **Identify entities** — read the live portal's screens and list every unique data type shown in tables, stat cards, or detail views.
2. **Scrape visually** — use Claude in Chrome to navigate each screen and `get_page_text` to capture table rows as-rendered (not via API). This avoids auth/CORS issues and captures exactly what users see.
3. **Cap at 20–30 rows** — for any entity with >20 real rows, take the first 20–30 rows shown on the first page. Do not truncate to fewer; we want realistic variety.
4. **Capture totals separately** — store the real total count (e.g. `197,553 activities`) as a constant so stat cards are accurate.
5. **Store in `src/lib/data/`** — one `types.ts` (all entity types), one `mock-data.ts` (all seed data). Comment the file with `// Data seeded from live portal on <date> via visual scrape.`
6. **Never commit credentials** — the admin credentials used for scraping exist only in this session and the user's memory; they do not appear in any committed file.

### Data seeded for NMBA (scraped 2026-06-19)

Entities and row counts captured:

| Entity | Seeded rows | Real total |
|--------|-------------|------------|
| Activities (State/UT Dashboard) | 20 | 197,553 |
| Users | 20 | 758 |
| Pledge Reports | 20 | 71 |
| Important Documents | 5 | 5 (all) |
| State Nodal Officers (SNO) | 20 | 35 |
| District Nodal Officers (DNO) | 20 | 723 |
| Feedback/Grievances | 4 | 4 (all) |
| Facilities (map markers) | 10 | ~380+ |
| Recent Activities (public) | 3 | 3 shown |

---

## Route Map

### Public portal — `apps/portals/nmba` (user-facing, no auth)

| Route | Page title | Key UI |
|-------|-----------|--------|
| `/portals/nmba` | Dashboard | Stats hero (6 cards), state/district filter, recent activities list (3 items), facility mini-map |
| `/portals/nmba/activities` | Activity Snapshots | State/district/activity-type filter row, paginated table (9/18/27 per page), facility mini-map at bottom |
| `/portals/nmba/epledge` | E-Pledge | Pledge counter (today), pledge text with EN/Hindi toggle, CTA form, certificate download link |
| `/portals/nmba/facilities` | Facilities Locator | Full-screen Leaflet map, text search, "Near Me" button, 5-type legend, facility markers |

### Admin portal — `/portals/nmba/admin` (auth-gated)

| Route | Page title | Key UI |
|-------|-----------|--------|
| `/portals/nmba/admin/login` | Login | SAMAVESH-branded split layout, mobile + password, "Signing Into — Nasha Mukt Bharat Abhiyaan" |
| `/portals/nmba/admin/dashboard` | State/UT/District Dashboard | Activities table (11 cols), "Add Event +" → modal toast, search bar, pagination |
| `/portals/nmba/admin/ministries-dashboard` | Ministries Dashboard | Pledge stats — Total Pledges (71), Total Pledges Today (0) |
| `/portals/nmba/admin/user-management` | User Management | Users table (5 cols), "Add User" → modal toast, pagination |
| `/portals/nmba/admin/pledge-reports` | All Pledge Reports | Stats row, state/district/date-range filters, table (8 cols), pagination |
| `/portals/nmba/admin/important-documents` | Important Documents | Documents table (4 cols), "Add Document +" → upload toast |
| `/portals/nmba/admin/state-nodal-officers` | List of SNOs | SNO table (6 cols), state filter, Export → toast |
| `/portals/nmba/admin/district-nodal-officers` | List of DNOs | DNO table (6 cols), Export → toast |
| `/portals/nmba/admin/feedback` | Feedback & Grievances | Feedback table (7 cols + action), action → toast |

---

## Data Schemas (`src/lib/types.ts`)

```typescript
export type ActivityRow = {
  state: string;
  district: string;
  activity: string;
  activityDate: string;           // "DD-MM-YYYY"
  maleParticipants: number;
  femaleParticipants: number;
  totalParticipants: number;
  coordinatingDepartment: string;
  educationalInstitutions: number;
  location: string;
  createdBy: string;
  createdAt: string;              // "DD-MM-YYYY"
};

export type AdminUser = {
  name: string;
  mobile: string;
  email: string;
  role: "Admin" | "State Nodal Officer" | "District Nodal Officer";
};

export type PledgeReport = {
  pledgeType: "e-pledge" | "physical";
  name: string;
  age: number;
  mobile: string;
  email: string;
  state: string;
  district: string;
  pledgeDate: string;             // "DD-MM-YYYY"
};

export type ImportantDocument = {
  name: string;
  uploadedOn: string;             // "DD-MM-YYYY"
  uploadedBy: string;
  published: boolean;
};

export type NodalOfficer = {
  name: string;
  designation: string;
  email: string;
  mobile: string;
  stateName: string;
  districtName?: string;          // undefined for SNOs
};

export type FeedbackRow = {
  sno: number;
  name: string;
  role: string;
  mobile: string;
  email: string;
  feedback: string;
  postedOn: string;               // "DD-MM-YYYY"
};

export type Facility = {
  type: FacilityType;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export type FacilityType =
  | "IRCA"
  | "CPLI"
  | "ODIC"
  | "DDAC"
  | "ATF";

export type PublicActivity = {
  title: string;
  description: string;
  department: string;
  location: string;
  date: string;                   // "DD-MM-YYYY"
};

export type DashboardStats = {
  totalPledges: string;
  peopleReached: string;
  youthReached: string;
  womenReached: string;
  totalActivities: string;
  educationalInstitutions: string;
};
```

---

## Seed Data (`src/lib/mock-data.ts`)

The file must begin with:
```typescript
// Data seeded from live NMBA portal (nashamukt.dosje.gov.in + nashamukt-admin.dosje.gov.in)
// Visual scrape performed on 2026-06-19. No credentials stored here.
```

### DASHBOARD_STATS
```typescript
export const DASHBOARD_STATS: DashboardStats = {
  totalPledges: "71",
  peopleReached: "469",
  youthReached: "43",
  womenReached: "13",
  totalActivities: "1,97,553",
  educationalInstitutions: "10,57,730",
};
```

### ACTIVITIES (20 rows from admin dashboard page 1)
Real columns: State, District, Activity, Activity Date, Male, Female, Total, Dept, Edu Institutions, Location, Created By, Created At.

Seed with these 10 + 10 more:
```
Uttar Pradesh / Ayodhya / Social Justice / 25-04-2026 / 20 / 60 / 80 / MOSJE / 50 / Ayodhya / Rajesh Pilli / 24-04-2026
Madhya Pradesh / Datia / Yoga and Meditation Activities / 10-12-2025 / 14 / 13 / 27 / social justice / 1 / Datia / Rajesh Pilli / 10-04-2026
Madhya Pradesh / Datia / Nukkad Natak, Skits and Play / 10-12-2025 / 22 / 22 / 44 / social justice / 1 / Datia / Rajesh Pilli / 10-04-2026
Madhya Pradesh / Datia / Nukkad Natak, Skits and Play / 10-12-2025 / 16 / 16 / 32 / social justice / 1 / Datia / Rajesh Pilli / 10-04-2026
Madhya Pradesh / Datia / Drawing competition / 10-12-2025 / 20 / 19 / 39 / social justice / 1 / Datia / Rajesh Pilli / 10-04-2026
Madhya Pradesh / Datia / Drawing competition / 10-12-2025 / 17 / 17 / 34 / social justice / 1 / Datia / Rajesh Pilli / 10-04-2026
Madhya Pradesh / Datia / Yoga and Meditation Activities / 10-12-2025 / 15 / 14 / 29 / social justice / 1 / Datia / Rajesh Pilli / 10-04-2026
Madhya Pradesh / Datia / Drawing competition / 10-12-2025 / 10 / 10 / 20 / social justice / 1 / Datia / Rajesh Pilli / 10-04-2026
Chhattisgarh / Korea / Health Related Activities/Camps / 10-04-2026 / 15 / 1 / 16 / social welfare department / 1 / Korea / Rajesh Pilli / 10-04-2026
Madhya Pradesh / Datia / Rangoli Making Competition / 10-12-2025 / 11 / 11 / 22 / social justice / 1 / Datia / Rajesh Pilli / 10-04-2026
```
Add 10 more realistic rows following the same pattern (vary state, district, activity).

### USERS (20 rows from /user-management page 1)
```
Mallu vijay kiran reddy / 9491455036 / malluvikram333@gmail.com / District Nodal Officer
Mallu vikram sai reddy / 7780454557 / vikrammallu123@gmail.com / State Nodal Officer
Nikhil Anand / 9470451575 / dirssdd-bih@nic.in / State Nodal Officer
Patel Mahesh D. / 9879573299 / scpsdnh@gmail.com / State Nodal Officer
Yogesh Pal Singh / 9868875758 / socialdefence.dsw@gmail.com / State Nodal Officer
Pradnya N. Desai / 9403269966 / dir-soci.goa@nic.in / State Nodal Officer
Vishal Saini (DSWO) / 9468437792 / sje@hry.nic.in / State Nodal Officer
Hansaben N Vala / 9265623493 / dd2-dsd@gujarat.gov.in / State Nodal Officer
Sumit Khimta / 9816711011 / social-hp@nic.in / State Nodal Officer
Bhupendra Kumar Pandey / 9993211205 / dpsw.cg@gov.in / State Nodal Officer
```
Add 10 more realistic rows.

### PLEDGE_REPORTS (20 rows from /pledge-reports page 1)
```
e-pledge / PANDIT SANTOSH TEHANGURIYA / 50 / 9977083171 / s8317478@gmail.com / Madhya Pradesh / Gwalior / 13-06-2026
e-pledge / Santosh Kumar Sharma / 50 / 9977083171 / s8317478@gmail.com / Madhya Pradesh / Gwalior / 13-06-2026
e-pledge / Mallu Vikram Sai Reddy / 23 / 7780454557 / vikrammallu123@gmail.com / Andhra Pradesh / Prakasam / 11-06-2026
e-pledge / Sumit Ghosh / 26 / 8471894735 / sumitghosh723@gmail.com / Assam / Karbi Anglong / 10-06-2026
e-pledge / Deepshikha Goel / 26 / 8384052282 / goeldeepu5@gmail.com / Delhi / East Delhi / 04-06-2026
e-pledge / MALLU VIJAY KIRAN REDDY / 23 / 7780454557 / malluvikram333@gmail.com / Andhra Pradesh / Nellore / 03-06-2026
```
Add 14 more realistic rows (vary names, states, ages, types).

### IMPORTANT_DOCUMENTS (5 rows — all)
```
music / 03-06-2026 / Nithishkumar reddy / published: true
testing a piece / 03-06-2026 / Arjun Reddy / published: true
DONEEEEE / 24-04-2026 / Rajesh Pilli / published: true
CBSC SN / 24-04-2026 / Rajesh Pilli / published: true
OKAYYYY / 23-04-2026 / Rajesh Pilli / published: true
```

### SNO_LIST (20 rows from /state-nodal-officers-list page 1)
```
Mallu vikram sai reddy / State Nodal Officer / vikrammallu123@gmail.com / 7780454557 / Andhra Pradesh / Nellore
Nikhil Anand / State Nodal Officer / dirssdd-bih@nic.in / 9470451575 / Bihar / —
Hansaben N Vala / State Nodal Officer / dd2-dsd@gujarat.gov.in / 9265623493 / Gujarat / —
Patel Mahesh D. / State Nodal Officer / scpsdnh@gmail.com / 9879573299 / Dadra and Nagar Haveli and Daman and Diu / —
Yogesh Pal Singh / State Nodal Officer / socialdefence.dsw@gmail.com / 9868875758 / Delhi / —
Pradnya N. Desai / State Nodal Officer / dir-soci.goa@nic.in / 9403269966 / Goa / —
Bhupendra Kumar Pandey / State Nodal Officer / dpsw.cg@gov.in / 9993211205 / Chhattisgarh / —
Vishal Saini (DSWO) / State Nodal Officer / sje@hry.nic.in / 9468437792 / Haryana / —
Sumit Khimta / State Nodal Officer / social-hp@nic.in / 9816711011 / Himachal Pradesh / —
Suswapna Kakoty / State Nodal Officer / suswapna.kakoty@assam.gov.in / 9864181463 / Assam / —
```
Add 10 more realistic SNO rows.

### DNO_LIST (20 rows from /district-nodal-officers-list page 1)
```
Mallu vijay kiran reddy / District Nodal Officer / malluvikram333@gmail.com / 9491455036 / Andhra Pradesh / Nellore
Muzaffar Ahmad / District Nodal Officer / dswoanantnag@rediffmail.com / 9697789759 / Jammu and Kashmir / Anantnag
Tariq Parvez Qazi / District Nodal Officer / dswododa@gmail.com / 9858448314 / Jammu and Kashmir / Doda
D. Sunanda / District Nodal Officer / dwogad@gmail.com / 9010117175 / Telangana / Jogulamba Gadwal
Sajad Ahmad Bhat / District Nodal Officer / dswobaramulla@gmail.com / 8899054218 / Jammu and Kashmir / Baramulla
Ubaid ul Khazir / District Nodal Officer / dswobud@gmail.com / 7780986044 / Jammu and Kashmir / Budgam
Bashir Ahmad Malik / District Nodal Officer / dswobandipora@gmail.com / 9797064950 / Jammu and Kashmir / Bandipora
Vacant (Addl. Charge - DSWO Samba) / District Nodal Officer / dswojmu1@gmail.com / 8492895562 / Jammu and Kashmir / Jammu
Jyothi K. V. / District Nodal Officer / ddworam@gmail.com / 7259850258 / Karnataka / Ramanagara
```
Add 11 more realistic DNO rows.

### FEEDBACK_LIST (4 rows — all)
```
1 / Nithishkumar reddy / State Nodal Officer / 7780454557 / deleted_803@deleted.invalid / lkjhgfvbnZxcvbnm... / 03-06-2026
2 / Arjun Reddy / District Nodal Officer / 9491455036 / deleted_801@deleted.invalid / qwertyuiopzsxdcfvgbhnjkl / 03-06-2026
3 / Dn enn n cdc ndv / District Nodal Officer / 7857485738 / rimobaj457@pertok.com / CNSHJCBSHCBHC / 24-04-2026
4 / Shrikant singh / State Nodal Officer / 8786758764 / gapov64759@mugstock.com / GOOD / 23-04-2026
```

### PUBLIC_ACTIVITIES (3 rows — recent activities shown on home dashboard)
```
Social Justice / "NMBA pledge in educational institutions, hotspots and public places" / Ministry of social justice and empowerment / Ayodhya, Uttar Pradesh / 24-04-2026
Yoga and Meditation Activities / "Yoga and Meditation Activities" / N/A / Datia, Madhya Pradesh / 10-04-2026
Nukkad Natak, Skits and Play / "Nukkad Natak, Skits and Play" / N/A / Datia, Madhya Pradesh / 10-04-2026
```

### FACILITIES (10 representative markers with approximate lat/lng)
Include 2 of each type: IRCA, CPLI, ODIC, DDAC, ATF — spread across different states. Use approximate lat/lng (e.g. IRCA in Delhi: 28.6139/77.2090). These seed the static markers on the public facilities map.

---

## File Structure

```
apps/portals/nmba/
├── next.config.ts           # basePath: "/portals/nmba", output: "standalone", port 4126
├── package.json             # name: "@mosje/portal-nmba", dev: "next dev -p 4126"
├── tailwind.config.ts       # v3 config, same as scw
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.js
├── public/
│   └── (static assets if any)
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx          # public layout: sidebar + header (lang switcher, helpline btn)
    │   ├── page.tsx            # Dashboard
    │   ├── activities/
    │   │   └── page.tsx        # Activity Snapshots
    │   ├── epledge/
    │   │   └── page.tsx        # E-Pledge
    │   ├── facilities/
    │   │   └── page.tsx        # Facilities Map
    │   └── admin/
    │       ├── layout.tsx      # admin shell: sidebar nav + header bar (auth guard)
    │       ├── login/
    │       │   └── page.tsx    # SAMAVESH login
    │       ├── dashboard/
    │       │   └── page.tsx    # State/UT Dashboard
    │       ├── ministries-dashboard/
    │       │   └── page.tsx    # Ministries Dashboard
    │       ├── user-management/
    │       │   └── page.tsx    # User Management
    │       ├── pledge-reports/
    │       │   └── page.tsx    # All Pledge Reports
    │       ├── important-documents/
    │       │   └── page.tsx    # Important Documents
    │       ├── state-nodal-officers/
    │       │   └── page.tsx    # SNO List
    │       ├── district-nodal-officers/
    │       │   └── page.tsx    # DNO List
    │       └── feedback/
    │           └── page.tsx    # Feedback & Grievances
    ├── components/
    │   ├── public-shell.tsx    # sidebar + header for public pages
    │   ├── admin-shell.tsx     # sidebar + topbar for admin pages
    │   ├── stats-card.tsx      # reusable stat metric card
    │   ├── data-table.tsx      # reusable sortable/paginated table
    │   ├── facility-map.tsx    # Leaflet map wrapper (dynamic import, SSR disabled)
    │   ├── pledge-form.tsx     # e-pledge form with toast on submit
    │   └── add-event-modal.tsx # modal form with toast on submit
    └── lib/
        ├── types.ts
        └── mock-data.ts
```

---

## Implementation Requirements

### R1 — Scaffold
- Copy scaffold files from `apps/portals/scw/` and adapt: `package.json` (name, port 4126), `next.config.ts` (basePath `/portals/nmba`), tailwind/ts/eslint configs.
- No new npm dependencies beyond what SCW already uses, except `leaflet` + `react-leaflet` for the map (SCW doesn't have a map; add these). Pin to stable versions.

### R2 — Hub wiring
- Add `ZONE_NMBA = process.env.ZONE_NMBA_URL ?? "http://localhost:4126"` to `apps/hub/next.config.ts`.
- Add two rewrite rules (root + `:path*`) for `/portals/nmba`.
- Add `dev:nmba` script to root `package.json`: `"npm --prefix apps/portals/nmba run dev"`.
- Add NMBA to the `dev` concurrently command and `check`/`lint` aggregates.
- Add `check:nmba` and `lint:nmba` scripts.

### R3 — Public layout (`public-shell.tsx`)
- Sidebar with 4 nav links: Dashboard (`/portals/nmba`), Activity Snapshot (`/portals/nmba/activities`), E-Pledge (`/portals/nmba/epledge`), Facilities (`/portals/nmba/facilities`).
- Header: language combobox (EN/HI, no backend needed — UI toggle only), helpline button "Call National De-addiction Helpline 14446" (links to `tel:14446`).
- Accessibility bar toggle button (no backend — show/hide font-size controls or skip-link).
- Sidebar collapse toggle (saves state in `useState`).
- Active link highlighted.

### R4 — Admin layout (`admin-shell.tsx`)
- Sidebar with 8 nav links matching the live portal's exact labels and routes.
- Topbar: Government of India bar (tricolour, "Government of India" text), MoSJE logo + name, Digital India badge, SAMAVESH badge, logged-in user name + "(Admin)".
- Auth guard: if no session cookie `nmba_admin_session`, redirect to `/portals/nmba/admin/login`. Use a simple `useState`-based mock session (set on login, cleared on logout). No real JWT needed.

### R5 — Login page
- SAMAVESH split layout (left: brand panel with logo, tagline, "SIGNING INTO — Nasha Mukt Bharat Abhiyaan"; right: form).
- Fields: Mobile Number, Password, Forgot Password link.
- On submit with any non-empty values: set mock session → navigate to `/portals/nmba/admin/dashboard` → show toast "Login Successful".
- Footer: Privacy Policy, Contact Us, About Us — each shows a "Coming soon" toast on click.

### R6 — Dashboard (public)
- 6 stat cards from `DASHBOARD_STATS`.
- State/district cascading dropdowns (seed all 36 states; district dropdown populates from a static state→districts map).
- "Recent Activities" section: render 3 `PUBLIC_ACTIVITIES` rows.
- "View all Activities" link → `/portals/nmba/activities`.
- Facility mini-map strip with link "View Facility Map" → `/portals/nmba/facilities`.
- Map is a `<FacilityMap>` component (dynamic import, `ssr: false`). Mini-map variant shows a fixed-height preview with 5-type legend.

### R7 — Activity Snapshots
- 3 filter dropdowns: All States, All Districts (cascading), All Activity Types.
  - Activity types: `["Social Justice", "Yoga and Meditation Activities", "Nukkad Natak, Skits and Play", "Drawing competition", "Rangoli Making Competition", "Health Related Activities/Camps"]`
- Table with columns: State, District, Activity, Activity Date, Male Participants, Female Participants, Total Participants, Coordinating Department, No. of Educational Institutions, Location, Created By, Created At.
- Pagination: page-size selector (9/18/27 items), page nav with `…` for large sets.
- Show total count: "of 1,97,553 items" (real total from seed constant `ACTIVITIES_TOTAL`).
- Facility mini-map at bottom (same component as dashboard).

### R8 — E-Pledge
- Counter: "X Pledges Taken Today" (hardcoded 0 from seed).
- Pledge heading: "Nasha Mukt Bharat Abhiyaan Pledge".
- Language toggle: EN / हिंदी. English pledge text is scraped verbatim. Hindi text: display a translated version (can be the English text for now with a TODO comment noting it needs real Hindi copy).
- "I Take this Pledge →" CTA → opens inline form with fields: Name, Age, Mobile, Email, State, District.
- On form submit: show toast "Pledge recorded. Download your certificate below." (no real certificate generation needed).
- "Download your certificate directly" link → shows toast "Certificate download coming soon."

### R9 — Facilities Map
- Full-page Leaflet map (`react-leaflet`, dynamic import, SSR disabled).
- Text search input: filter seeded facilities by name/district/state/PIN.
- "Near Me" button: show toast "Location access would be requested here."
- Static markers for 10 seeded facilities (2 per type). Use different marker colours per type.
- Legend panel (collapsible) with 5 facility type labels:
  - Integrated Rehabilitation Centre for Addicts (IRCAs)
  - Community Peer Led Intervention (CPLI)
  - Outreach and Drop-in Centres (ODIC)
  - District De-addiction Centre (DDAC)
  - Addiction Treatment Facility (ATF)
- Clicking a marker shows a popup: facility name + address.

### R10 — Admin Dashboard (State/UT/District)
- Search bar: "Search by State, District, Activity..."  — client-side filter on table.
- "Add Event +" button: opens a modal with form fields (State, District, Activity type, Activity Date, Male Participants, Female Participants, Coordinating Department, No. of Educational Institutions, Location). Submit → show toast "Event added successfully." → close modal (do not mutate the seed data).
- Table: 11 columns as per schema. Horizontally scrollable.
- Pagination: page size (10/50/100), page nav with `…`. Show "of 1,97,553 items".
- Each row has an Action column (kebab/edit icon) → toast "Action coming soon."

### R11 — Ministries Dashboard
- Page title: "Ministries / Departments and Spiritual Organisations (Who have signed MoU with the Ministry of Social Justice)"
- Two stat cards: Total Pledges (71), Total Pledges Taken Today (0).

### R12 — User Management
- "Add User" button → modal with fields (Name, Mobile, Email, Role dropdown). Submit → toast "User added successfully."
- Table: Name, Mobile Number, Email Address, Role, Actions.
- Actions column (edit/delete icons) → toast "Action coming soon."
- Pagination. Show "of 758 items".

### R13 — All Pledge Reports
- Two stat cards: Total Pledges (71), Total Pledge Taken Today (0).
- State/district cascading filters + date range picker (no backend — filter client-side on seed data).
- Table: Pledge Type, Name, Age, Mobile, Email, State, District, Pledge Date.
- Pagination. Show "of 71 items".

### R14 — Important Documents
- "Add Document +" → modal with fields (Document Name, file upload). Submit → toast "Document uploaded for review."
- Table: Document Name, Uploaded On, Uploaded By, Published (badge), Action.
- Action: publish/unpublish → toast "Action coming soon."
- Pagination. Show "of 5 items".

### R15 — SNO List
- State filter dropdown.
- "Export" button → toast "Export starting…"
- Table: Nodal Officer Name, Designation, Email, Mobile No., State Name, District Name.
- Pagination. Show "of 35 items".

### R16 — DNO List
- Same as SNO but with District Nodal Officers.
- "Export" button → toast.
- Pagination. Show "of 723 items".

### R17 — Feedback / Grievances
- Table: S.No., Name, Role, Mobile Number, Email, Feedback (truncated with expand), Posted On, Action.
- Action column → toast "Action coming soon."
- Show "of 4 items".

### R18 — Toast system
- Use a single `useToast` hook (can use shadcn's `Toaster` or a lightweight custom one).
- All toasts are non-blocking, auto-dismiss after 3 seconds.
- Toast variants: success (green), info (blue), warning (amber).

### R19 — Type safety
- TypeScript strict mode throughout. No `any`.
- All mock data exports are typed against the schemas in `types.ts`.
- Table columns are defined as typed column config arrays (not inline JSX).

### R20 — WCAG AA
- All interactive elements have accessible labels.
- Stat cards use `aria-label` with full number (e.g. "71 pledges").
- Table has `<caption>` or `aria-label`.
- Map: keyboard zoom in/out works; markers have `aria-label`.
- Color contrast meets AA for all text.

---

## Acceptance Criteria

- [ ] `npm run dev:nmba` starts the portal at `http://localhost:4126/portals/nmba`
- [ ] `npm run dev` starts ALL portals including NMBA behind the hub at `:3000`
- [ ] `http://localhost:3000/portals/nmba` loads the public dashboard
- [ ] All 4 public routes render without JS errors
- [ ] All 9 admin routes render without JS errors
- [ ] Admin login with any non-empty credentials redirects to dashboard + shows "Login Successful" toast
- [ ] `/portals/nmba/admin/*` redirects to login when no session is set
- [ ] Stat cards show real scraped totals (71 pledges, 1,97,553 activities, etc.)
- [ ] Tables show seeded data (20 rows default), paginator works client-side
- [ ] All filters work client-side on seed data
- [ ] "Add Event +", "Add User", "Add Document +" modals open, submit shows toast
- [ ] "Export" buttons show toast
- [ ] Facilities map renders with 10 markers; clicking shows popup
- [ ] E-pledge form shows toast on submit
- [ ] `npm run check:nmba` passes (TypeScript strict, no errors)
- [ ] `npm run lint:nmba` passes
- [ ] No hardcoded colours — uses Tailwind tokens or `@mosje/tokens` CSS vars

---

## Out of Scope

- Real OTP/SMS login (show toast instead)
- Real certificate PDF generation (show toast instead)
- Real file upload to server (show toast instead)
- Persistent data mutations (form submits toast but don't modify mock data)
- Geolocation (Near Me shows toast)
- Excel/CSV export (Export shows toast)
- Forgot Password flow (link shows toast)
- Real Leaflet tile server customisation (use default OpenStreetMap tiles)
- Pixel-perfect Figma design corrections (separate pass after this build)
- Authentication with real JWT/session (mock useState session only)

---

## Notes for Builder

1. **Leaflet SSR** — Leaflet requires `window` and will throw in SSR. Always `dynamic(() => import('../components/facility-map'), { ssr: false })`. Same pattern for any other client-only lib.
2. **Tailwind v3** — This portal uses Tailwind v3 (`tailwind.config.ts`, NOT `@theme` CSS-first). Do not introduce v4 patterns.
3. **No Co-Authored-By** — Commit messages must not include `Co-Authored-By: Claude` or any AI co-author.
4. **basePath in links** — All `<Link>` hrefs must be relative to the basePath root (`/portals/nmba/...`). Never use bare `/dashboard` inside this portal.
5. **SCW as reference** — When in doubt about component structure, look at `apps/portals/scw/src/` for the established pattern.
6. **State→District map** — Use a static lookup object covering all 36 states. A minimal one covering the seeded states (Uttar Pradesh, Madhya Pradesh, etc.) is enough; it can be expanded later.

---

*Spec authored 2026-06-19. Based on visual scrape of live NMBA portal (public + admin). Admin credentials used for scraping are not stored here.*
