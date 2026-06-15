# SCW Admin Portal — Recon Inventory

**Domain:** https://scw-admin-uat.mosje.in
**Role:** Officer / Admin (logged in as "Rajesh Pilli (Admin)")
**App title:** "SCW | Admin" — Senior Citizens Welfare, under SAMAVESH unified login.
**Stack signals:** SPA (client-side routing; deep links to detail routes redirect to /dashboard on hard refresh → auth guard). Right-side drawers for create forms.

## Global Chrome (every page)

### Top utility bar (dark navy #0b2a5b-ish)
- Left: India flag + "Government of India" (external link icon)
- Right: "Skip to Main Content" | A⁻ A A⁺ (font size) | ◐ (contrast/theme toggle) | ♿ (accessibility) | 🌐 English (language)

### Masthead (white)
- Left: National Emblem + "BETA" pill + "Government of India" / **Ministry of Social Justice & Empowerment** (bold)
- Right: Digital India logo · SAMAVESH logo ("SAMAVESH / Single Access Mechanism for All Verticals of Empowerment & Social Harmony") · user avatar "Rajesh Pilli (Admin)" with dropdown caret

### Left sidebar (collapsible — « button at bottom)
Nav items (icon + label), active = light-blue pill bg + bold navy text:
1. Dashboard (grid icon)
2. User Management (person icon)
3. SAGE Applications (document icon)
4. Events (calendar icon)
5. Volunteer (people icon)
6. IPSrC Homes (building icon)
7. RVY Assisted Devices (wheelchair icon)

---

## 1. Dashboard — `/dashboard`
- H1 "Dashboard" + period filter dropdown top-right: **All / Last 7 Days / Last 30 Days / Last 90 Days**
- **3 stat cards** (white, rounded, border): 
  - Total Pledges — **5,22,113**
  - Volunteer Registrations — **356**
  - SAGE Applications — **407**
- **Recent SAGE Applications** card (left, ~2/3 width) — "View all" link. Table cols: ORGANISATION NAME · DATE · STATUS · ACTION
  - iuutrt · 8 Jun 2026 · Approved(green) · View Details
  - Swabhimaan Eldertech Private Limited · 15 May 2026 · Awaiting Evaluation(amber) · Review
  - Vectorise Global Private Limited · 15 May 2026 · Awaiting Evaluation · Review
  - HattaKatta Tech Private Limited · 15 May 2026 · Awaiting Evaluation · Review
  - Izuv Solutions · 15 May 2026 · Awaiting Evaluation · Review
- **Recent Platform Activity** card (right, ~1/3) — timeline w/ bullet dots:
  - SAGE application of **HSAGE976152** has been approved. — 6 days ago
  - New SAGE application **(HSAGE976152)** submitted awaiting evaluation. — 6 days ago
  - Volunteer application of **Mallu Vikram Sai Reddy** has been approved. — 16 days ago
  - **Mallu Vikram Sai Reddy** successfully registered as an active Volunteer. — 16 days ago
  - **Akshay** has taken the pledge. — 17 days ago
- **Volunteer Applications** card (below, left) — "View all". Cols: NAME · DATE · STATUS · ACTION
  - Mallu Vikram Sai Reddy · 29 May 2026 · Approved · View Details
  - Keerthivasa · 19 Apr 2026 · Awaiting Evaluation · Review
  - Nikhil Kumar · 18 Apr 2026 · Awaiting Evaluation · Review
  - Padmakar · 18 Apr 2026 · Awaiting Evaluation · Review
  - KoushikBarman · 18 Apr 2026 · Awaiting Evaluation · Review

## 2. User Management — `/user-management`
- H1 "User Management" + **Add User** button (navy, top-right)
- Search input full-width: "Search for users by name, mobile number or email"
- Table cols: Name · Mobile Number · Email Address · Role · Actions(edit pencil[amber] / delete trash[red])
- Pagination: pages 1 2 3 4, "Showing [10▾] of 35 items" (page sizes 10/50/100)
- Sample rows (Role all "Nodal Officer"):
  - Rohit Jain · 7300133251 · ssraj.sje@rajasthan.gov.in
  - Charanjeet Singh Mann · 9417677900 · jd.ss@punjab.gov.in
  - Mr Lalramchuanzela · 9862558637 · missionfoundation2013@gmail.com
  - Dishank · 9971350240 · ba2.dosje-dl@govcontractor.in
  - Ashish · 9451227223 · prog.dosje-dl@supportgov.in
  - Ipsito Chakravarty · 9051772156 · ipsito1234@gmail.com
  - Priya pilli · 9888888888 · priya@gmail.com
  - PRASANA KUMAR LIMMA · 7319532823 · prasanakumarlimma@gmail.com
  - Gurudayal Shah · 7835945603 · gurdayal.shah@nic.in
  - Mrs Nilima Mahesh Yetkar · 9820874622 · cssc.nsp50@gmail.com

### Add User drawer (right slide-in, ~600px)
- Title "Add User" + × close
- Fields (stacked, label above input): First Name, Last Name, Email ID, Mobile Number, Select State (dropdown), Select District (dropdown), Select Role (dropdown)
- Footer: full-width navy **Add User** button
- (Edit pencil → same drawer prefilled "Edit User"; delete → confirm dialog — TODO capture)

## 3. SAGE Applications — `/sage-applications`
- H1 "SAGE Applications" + period filter dropdown (All / Last 7/30/90 Days)
- Search: "Search by organisation..."
- Table cols: Organisation Name · Date · Status · Action
  - Status pills: Approved (green) → "View Details"; Awaiting Evaluation (amber) → "Review"
- Pagination: 1 2 3 4 5 ... 41, "Showing [10▾] of 407 items"
- Sample rows: iuutrt(Approved), Swabhimaan Eldertech Pvt Ltd, Vectorise Global Pvt Ltd, HattaKatta Tech Pvt Ltd, Izuv Solutions, Cettlx Services Pvt Ltd, VASUDHAIVA KUTUMBAKAM SOFTWARE SOLUTIONS PRIVATE LIMITED, NANO PHYTO CARE PRIVATE LIMITED, Chaperone Services, NEERA TECHNOLOGIES PRIVATE LIMITED

### SAGE Application detail — `/sage-applications/{id}` (e.g. sage00763)
- Back arrow + H1 org name + status pill (Awaiting Evaluation amber)
- Top-right: **Reject** (outline red) · **Approve** (outline) buttons
- Tab bar: **Company Information · Product / Service · Team & Founders · Financial & Investors · Achievements** (active = navy underline)
- Footer line: "Submitted on 07 Apr 2026 · Last updated 15 May 2026"

**Company Information tab** — section "COMPANY DETAILS", 3-column grid of label/value pairs:
Email, Dipp Id, Incubated, Any Funded, Court Case, Investment, Website Url, Blacklisted, Company Name, Founder Name, Service Cast, Founder Mobile, Loan From Banks, Paid Up Capital, Type Of Company, Application Id, Investor Pitch (pdf filename), Origin Country, Remark Company, Turnover Scale, Co Founder Mobile, Projection Next, Incubator Details, Why Funds Required, Number Of Employees, Objective Strategy, Operation Since Year, Registered With D I P P, Date Of Incorporation, Average Annual Turnover, Registered Office Address, Authorised Representative, Authorised Representative India. ("-" shown for empty)

**Product / Service tab** — section "PRODUCT / SERVICE", 3-col grid:
Remark, Proposed, Ease Of Use, Launch Year, Popularity, Description, Market Price, Product Name, Achievements, Elderly Impact, Major Features, Target Audience, Technology Used, Total Customers, Traction Update, Customer Support, Demo You Tube Link, Purchase Category, Is Copyright Patent, Product Technology, Runs Independently, Support Description, Uses Proprietary Tech, Countries Implemented, Government Partnership, Infrastructure Details, Minimum Infrastructure, Quality Certifications, Disability Accessibility, Unique Selling Proposition, Infrastructure Requirements, Founders Geriatric Experience, Requires Trained Facilitators

**Team & Founders tab** — empty state "No team data." (normally a founders/team table)

**Financial & Investors tab** — section "FINANCIAL INFORMATION" (empty: "No financial information.") + "INVESTORS" table cols: Investor Name · Investment Amount · Share % · Nature of Investment

**Achievements tab** — section "AWARDS & RECOGNITIONS" table cols: Award Name · Year · Country (e.g. "NA / / India")

---

## 4. Events — `/events`
- H1 "Events" + **Add New** button (navy, top-right, + icon)
- Search: "Search by event title, organizer, state..."
- Table cols: S.No · Event Name · Start Date & Time · End Date & Time · Total Hours · Address · Actions
- Pagination: 1 2 3 4 5 ... 24, "Showing [10▾] of 234 items"
- Sample: Bengali New year · 15 Apr 2026, 09:16 pm · — · — · Kolkata howrah West Bengal; Sensitisation and awareness activities · 24 Mar 2026, 03:30 pm; One Day Programme for staff of NGOs...; 02 Day Training of Functionaries of Senior Citizen Home; Intergenerational and Bonding activities; Kinetic and Mental Skill Improvement programme; Job60+ Mini Job Fair for senior citizen · 18 Mar 2026, 05:53 pm · Silver Jubilee hall, Malleshwaram

### Add New Event — `/events/add` (full-page form, multi-step "Save and Continue →")
- Back arrow + H1 "Add New Event"
- Fields (all required *): Event Title; Start Date and Time (datetime-local); End Date and Time (datetime-local); Pincode; State (select — full India states list); District (select); Full Address (textarea); Organizer Name (prefilled "Rajesh Pilli", locked 🔒); Mobile Number (+91 prefix, prefilled, locked); Email Address (locked); Details (textarea)
- Declaration checkbox: "I hereby declare that the information given above is correct and true to the best of my knowledge."
- Buttons: Cancel · **Save and Continue →** (implies step 2 wizard)
- **States dropdown options (reused across portal):** Andaman and Nicobar Islands, Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chandigarh, Chhattisgarh, Dadra and Nagar Haveli and Daman and Diu, Delhi, Goa, Gujarat, Haryana, Himachal Pradesh, Jammu and Kashmir, Jharkhand, Karnataka, Kerala, Ladakh, Lakshadweep, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Puducherry, Punjab, Rajasthan, Sikkim, Tamil Nadu, Telangana, Tripura, Uttarakhand, Uttar Pradesh, West Bengal

## 5. Volunteers — `/volunteers`
- H1 "Volunteers"; filters: period dropdown (All / Last 7/30/90 Days) + State dropdown (All States + full list)
- Search "Search volunteers..."
- Table cols: Name · Volunteer Type · Date · Status · Action
  - Volunteer Type = INDIVIDUAL (also likely ORGANISATION); Status Approved(green)→View Details / Awaiting Evaluation(amber)→Review
- Pagination: 1 2 3 4 5 ... 36, "Showing [10▾] of 356 items"
- Sample: Mallu Vikram Sai Reddy(Approved), Keerthivasa, Nikhil Kumar, Padmakar, KoushikBarman, Shrutika Rassay, Zahid Ayoub, DIPESH, SAYYED YASIN, Abhay Ram

### Volunteer detail — `/volunteers/{id}` (e.g. LGVOL000355)
- Back arrow + H1 name; top-right **Reject**(outline red) · **Approve**(outline)
- Section **VOLUNTEER DETAILS** (3-col grid): Full Name, Volunteer Type, Gender, Date of Birth, Status
- Section **ADDRESS & CONTACT**: Full Address (full width), then 3-col: State, District, Pincode, Mobile Number, Email
- Section **AREAS OF INTEREST**: Interests (pill chips, e.g. "Meal Delivery"), Submitted On (date)

## 6. IPSrC Homes — `/sage-homes`
- H1 "IPSrC Homes" + **Add New** button
- Filters: Search "Search by ngo name, state, district or address" + **All Facility Types** (Continuous Care Homes, Mobile Medicare Units, Physiotherapy Clinics, Senior Citizen Homes) + All States + All Districts
- Table cols: NGO Name · Project Types · State · District · Address · Actions (⋮ 3-dot menu)
- Pagination: 1 2 3 4 5 ... 74, "Showing [10▾] of 732 items"
- Sample: Grassroot Outreach · Physiotherapy Clinics · Tamil Nadu · Tiruvannamalai · 8, Ground Floor, Boopalan Advocate Building; Centre For Rehabilitation · Odisha · Bhadrak; Eco Club · Haryana · Bhiwani; Seulipur Udayan Club · Mobile Medicare Units · West Bengal · Purba Medinipur; Madhar Nala Thondu; Calcutta Metropolitan; Indiramma Mahila Mandali (Andhra Pradesh, Nellore); People's Action For Social Service; Bhartiya Aushadhi Anusandhan Sanstha (Maharashtra, Bhandara); Kalaiselvi Karunalaya Social Service Society (Chennai)

## 7. RVY Assisted Devices — `/assisted-devices`
- H1 "RVY Assisted Devices" + **Add New** button
- Table cols: Title · Description · Is Active (toggle switch, on=navy) · Actions (⋮ 3-dot)
- Pagination: 1 2 3 4 5 ... 23, "Showing [10▾] of 223 items"
- Content is multilingual (English, Hindi, Kannada, Marathi, Gujarati, Bengali, Assamese) — descriptions are long product specs. Sample: ghhhgh, Hearing Kit (Hearing kit), Hand stick (Quality walking device), जेल फोम कुशन, कमोड के साथ मोड़ने वाली कुर्सी, फूट केअर किट, व्हीलचेर फोल्डिंग.

## Global: avatar dropdown (top-right "Rajesh Pilli / (Admin)")
- Menu items: **Profile Settings** (person icon), **Logout** (red, logout icon)

## Notes / still-open details (lower priority, infer for clone)
- Edit/Delete user dialogs, Approve/Reject confirmation dialogs, IPSrC ⋮ menu (View/Edit/Delete), RVY ⋮ menu, Add New for IPSrC/RVY, Events wizard step 2, Profile Settings page, accessibility/theme/font-size/language toggles. These are standard patterns — build with sensible mock variants.
- **Routing quirk:** SPA; hard navigation to deep routes (e.g. /sage-applications) can bounce to /dashboard via auth guard. Use in-app nav.

## Route summary (admin)
| Route | Screen |
|---|---|
| /login | SAMAVESH login (Officer/Admin ↔ Citizen/Beneficiary tabs) |
| /dashboard | Dashboard (stats + 3 tables + activity feed) |
| /user-management | Users table + Add/Edit User drawer |
| /sage-applications | SAGE apps list |
| /sage-applications/{id} | SAGE app detail (5 tabs, Approve/Reject) |
| /events | Events list |
| /events/add | Add Event wizard |
| /volunteers | Volunteers list |
| /volunteers/{id} | Volunteer detail (Approve/Reject) |
| /sage-homes | IPSrC Homes list |
| /assisted-devices | RVY Assisted Devices list |
| /profile (?) | Profile Settings |
