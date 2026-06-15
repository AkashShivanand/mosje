# SCW User Portal — Recon Inventory

**Domain:** https://scw-user-uat.mosje.in
**App title:** "SCW | User" — Senior Citizens Welfare citizen/beneficiary portal under SAMAVESH.
**Footer branding:** "© 2026 Copyright UX4G. Powered by NeGD | MeitY Government of India ® 2026 UX4G" + Terms & Conditions · Privacy Policy. (Note: UX4G branded footer, unlike admin.)
**Roles:** Citizen/Beneficiary → **Volunteer** and **SAGE Organisation** (sub-toggle on login). Same test mobile 7780454557 for both.

## Global Chrome
### Top utility bar (dark navy)
- Left: India flag + "Government of India" (ext link)
- Right (logged out): "Skip to Main Content" | अ/A (language/translate) | **Login**
- Right (logged in): same + user avatar (initial "V" / name "Vikram" + email) with dropdown
### Masthead (white): National Emblem + BETA + "Government of India / Ministry of Social Justice & Empowerment"; right: Digital India logo · SAMAVESH logo
### Left sidebar (collapsible «): **Dashboard · E-Pledge · Our Services** (active = light-blue pill). Same nav logged in/out.
### Floating accessibility FAB (bottom-right, purple/lavender circle, person icon) — opens Accessibility Settings (Ctrl+F2)

---

## PUBLIC (logged-out) pages

### Home / Dashboard — `/`
- **Hero card** (green gradient, rounded-2xl): "Senior Citizens Welfare" / "Commit to creating a safe, inclusive environment that allows our senior citizens to age with dignity. Get your official Ministry certificate upon completion." + **Take the Pledge →** button (white) + decorative circle motif on right
- **Service cards grid** (2-col then 3-col):
  - 🌱 **Join as a Volunteer** — "Offer your time to assist senior citizens in your community. Help with daily errands, technology literacy, or provide emotional support." → *Register Profile →*
  - 📋 **SAGE Registration** — "Are you an organization or innovator? Register for the Seniorcare Ageing Growth Engine (SAGE) to submit your products, apply for funding." → *Apply as Organisation →*
  - 🔍 **Browse Service Directory** — "Find Old Age Homes, Healthcare Facilities and Centers, Caregiver's available in your specific state. View Centre details." → *Search Facilities →*
  - 📡 **Free Assisted Living Devices** — "Apply for assisted living devices for eligible senior citizens offering from age-related disabilities." → *View Scheme Details →*
  - **Need Immediate Help?** (amber/cream card) — "The National Helpline provides guidance and fast intervention! 1492 is your helpline for senior citizens needing immediate assistance." + orange **Call toll-free 14567** button

### E-Pledge — `/epledge`
- Hero banner image: "Government of India / Department of Social Justice & Empowerment" + "Ageing with DIGNITY / Call Toll-Free - 14567" + Azadi Ka Amrit Mahotsav logo (senior citizen photo bg)
- Card overlapping banner: green badge "● 0 Pledges Taken Today" + **English / हिंदी** toggle (pill)
- H2 "Pledge"; pledge text (cream box, italic bullets):
  1. I pledge to respect love and care for the senior citizens in my family and community throughout my life.
  2. I promise to treat senior citizens with kindness and empathy.
  3. I will respect their knowledge and experience, and is fully committed to being their voice and in supporting them in their efforts.
  4. I am committed to creating awareness about their rights, interests and fighting against mistreatment of our elders.
  5. Let us together resolve to create a supportive and inclusive society for our senior citizens, where they can live with respect love and dignity.
- **I Take this Pledge →** button
- "Taken the pledge before? Download your certificate directly."

### Our Services (Service Directory) — `/our-services`
- Subtitle: "Browse public welfare programs, residential facilities, and caregiving services available in your region."
- Search bar "Search by NGO name, project type, city, district, state, PIN or address" + **Near Me** button (navy, location icon)
- **Two-column layout:** Left = **Leaflet/OpenStreetMap** interactive map with clustered colored pins + Legend box (Senior Citizen Homes (699) blue, Continuous Care Homes (13) green, Mobile Medicare Units (17) orange, Physiotherapy Clinics (3) purple); Right = **Facilities (732)** scrollable list of cards
- Facility card: category pill (e.g. "Senior Citizen Homes" green) · **Name** (bold) · 📍 address · distance "1642.1 KM" (right) · **Get Directions** button (navy, full-width)
- Samples: Rupa Educational Society; Sree Venkateswara Convent Educational Society
- NOTE: large dataset (732 facilities); content payload is huge.

### Login — `/login` (SAMAVESH split-screen)
- Left navy panel: banner image (event photos), SAMAVESH logo + "समावेश", orange divider, "Justice. Equality. Dignity.", tagline. Bottom: "SIGNING INTO / Senior Citizens Welfare" + Change button
- Right panel: tab toggle **Citizen / Beneficiary** | Officer / Admin
  - Citizen sub-toggle: **Volunteer** | **SAGE Organisation** (pill buttons)
  - Fields: Mobile Number* (tel), Password* (with eye toggle), "Forgot Password?" (→/forgot-password)
  - **Login →** button (navy)
  - "Don't have an account? Register as:" → **Volunteer** (→/volunteer) · **SAGE Organisation** (→/sage-registration) outline buttons
  - Footer: "Ministry of Social Justice & Empowerment, Government of India"

---

## SAGE ROLE (logged in as SAGE Organisation — "Vikram" / vikrammallu123@gmail.com)

### SAGE Dashboard — `/`
- H2 "My SAGE Applications"
- Application card (cream/highlighted when approved): **org name** (e.g. "iuutrt") + "ID: SCW/2026/HSAGE976152 · 08 Jun 2026" + status pill (green ● Approved, top-right)
- **Progress stepper** inside card: ✓ Submitted (08 Jun 2026) ———— ✓ Approved (green line/check)
- **View Details** button (outline, bottom-right) → opens SAGE Registration form (read-only if approved)

### SAGE Registration form — `/sage-registration/form` (6-step wizard)
- Card header "SAGE Registration" + subtitle. When approved: green banner "Read-only view — application approved. No changes can be made." + "Your application has been approved. Fields are read-only."
- **Stepper (top):** circles 1-6 with connecting line; done=green✓, active=navy filled, todo=grey. Labels:
  1. **Company Information** 2. **Product / Service** 3. **Team & Founders** 4. **Financial & Investors** 5. **Achievements** 6. **Review & Submit**
- Footer nav: **← Back** (outline) / **Next →** (navy). (Stepper not clickable; nav via Back/Next.)

**Step 1 — Company Information** (grouped sections, 3-col grids):
- *Company Details:* Company Name*, Date of Incorporation* (date), Company's Operation in India since Year* (select 1990–2026), Type of Company* (Private Limited / Public Limited / LLP / OPC (One Person Company) / Partnership Firm / Sole Proprietorship), Startup company's authorised representative* (Director / Managing Director / CEO / Founder / Co-Founder / Authorised Signatory), Registered Office Address* (textarea), Startup company's authorised representative in India (If Any)
- *Corporate Information:* Founder Name*, Mobile Number*, Email*, Number of Employees, DIPP ID, Startup registered with DIPP* (Yes/No), Incubated* (Yes/No), Website URL, Incubator Details
- *Business Information:* Objective & Strategy* (textarea), Why funds required under SAGE* (textarea)
- *Financial Snapshot:* Present Paid-up Capital (₹)*, Amount of loans from banks (₹)*
- *Document Uploads:* Paid-up Capital Proof* (PDF upload, shows filename + Download), Investor Pitch Presentation* (PDF)
- Sample values: iuutrt / 28/10/2008 / 2015 / OPC / Founder / "kmlhjk"

**Step 2 — Product / Service:** "Product / Service List" table (Product/Service Name · Launch Year · Actions[👁 eye-view]). Row: zxcvbnm / 2022. Eye → product detail (fields per admin Product/Service tab). + Add button to add product (in editable mode).

**Step 3 — Team & Founders:** "Member List" table (Name · Designation · Contact · Email · Experience · Actions[👁]). Row: sai / ceo / 7780454557 / malluvikram333@gmail.com / 4. + Add member.

**Step 4 — Financial & Investors:**
- "Investors List" (empty state "No Investor Added yet"; + add) — investor fields: Investor Name, Investment Amount, Share %, Nature of Investment
- "Financial Details" form: Financial Year* (select 1990–2026), Audited Annual Turnover (₹)*, Annual Revenue from Product/Service (₹)*, Designation, Experience* (Less than 1 year / 1-2 years / 3-5 years / 6-10 years / More than 10 years), Blacklisted by Government?* (Yes/No), Legal Cases Against Company?* (Yes/No), Funding Received from Agencies?* (Yes/No)
- "Documents": Upload Financial Statement (Balance Sheet / P&L)* (PDF max 5MB + Download), Upload Financial Projections Document* (PDF)
- Sample: 2015 / 98,76,78,987 / 8,78,98,76,789 / "kjbhjjhbv" / 3-5 years / No / No / No

**Step 5 — Achievements:** "Award List" — empty state "No Award Added yet / No awards were added." + circular **+** add button. Award fields (per admin): Award Name, Year, Country.

**Step 6 — Review & Submit:** (read-only summary of all steps + declaration + Submit) — TODO capture exact layout.

---

## VOLUNTEER ROLE (logged in as Volunteer — "Mallu Vikram Sai Reddy", same account)

### Volunteer Dashboard — `/`
- Same green **hero** card (Senior Citizens Welfare + Take the Pledge)
- **UPCOMING OPPORTUNITIES NEAR YOU** (left ~2/3): Search "Search event name, city, district..." + **All States** select + **All Districts** select; below = paginated list of opportunity/event cards (loads from events dataset — 234 items, page sizes 10/50/100, pages 1–24). (Cards lazy-load; UAT slow.)
- **Right rail widgets:**
  - **THIS MONTH / 0 / Hours Volunteered** — blue gradient stat card w/ clock icon
  - **Browse Service Directory** card — search icon + "Find Old Age Homes, Healthcare Facilities, and Geriatric Caregivers available in your specific state and district." + *Search Facilities →*
  - **Need Immediate Help?** (cream) — "The National Helpline provides guidance and field intervention 7 days a week." + orange **Call Toll-Free 14567**

### Volunteer Registration — `/volunteer`  ("Join as a Volunteer")
- Subtitle "Tell us about yourself and how you would like to contribute."
- Radio toggle: **Individual** / **Organisation**
- Fields (3-col): Full Name*, Gender* (Male/Female/Transgender), Date of Birth* (date); State* / District* / Pincode*; Full Address* (textarea, full width); Mobile Number* (+91) / Email Address*
- **Areas of Interest / Skills (Select all that apply)*** — checkbox grid (3-col): Digital Literacy Training, Companionship & Reading, Meal Delivery, Healthcare & Mobility Support, Administrative Support, Event Assistance, Transportation Assistance, Others
- Consent checkbox: "I consent to share my profile details with registered Old Age Homes and MoSJE coordinators for volunteer matching purposes."
- Buttons: Cancel · **Save and Continue**
- Volunteer avatar dropdown: **Logout** only (same as SAGE).

---

## Additional captured pages

### SAGE Registration landing — `/sage-registration`  ("SAGE Initiative")
- Subtitle: "The Seniorcare Ageing Growth Engine (SAGE) identifies, evaluates, and supports innovative products and services for senior citizens."
- Card **Eligibility Criteria**:
  - *CATEGORY REQUIREMENT (MUST MEET EITHER A OR B):* a) Innovative ideas awarded… **OR** (navy pill divider) b) Start-ups already functioning in the elderly segment… (DPIIT norms)
  - *ESSENTIAL CRITERIA (BOTH A & B MUST MEET ALL):* bullet list — incorporated/registered in India <10 years; annual turnover ≤ Rs 25 crores; incorporated as a Company (Private/Public); not formed by splitting/reconstructing existing business
- Checkbox: "I confirm that my organization meets the SAGE eligibility criteria mentioned above." → Cancel · **Save and Continue** (→ /sage-registration/form)

### Pledge form — `/epledge/form`
- Banner image (Ageing with DIGNITY / Call Toll-Free - 14567)
- Card form (2-col): Full Name*, Age*, Gender* (Male/Female/Transgender), State*, District*, Pincode*, Mobile Number*, Email Address
- Buttons: Back · **Send OTP** (OTP-verified pledge → certificate)

### Language translator (Bhashini)
- अ/A button in top bar → dropdown "Translate this page!" with combobox of 22 languages: English, Assamese (অসমীয়া), Bengali (বাংলা), Bodo (बड़ो), Dogri (डोगरी), Goan Konkani (गोवा कोंकणी), Gujarati (ગુજરાતી), Hindi (हिन्दी), Kannada (ಕನ್ನಡ), Kashmiri (कश्मीरी), Maithili (मैथिली), Malayalam (മലയാളം), Manipuri (মণিপুরী), Marathi (मराठी), Nepali (नेपाली), Odia (ଓଡ଼ିଆ), Punjabi (ਪੰਜਾਬੀ), Sanskrit (संस्कृत), Santali (संताली), Sindhi (سنڌي), Tamil (தமிழ்), Telugu (తెలుగు), Urdu (اردو). "Powered by Bhashini" (bhashini.gov.in).

### Inferred (not directly captured — build sensible mock)
- **Free Assisted Living Devices** scheme page (home card "View Scheme Details") — scheme info + apply form mirroring RVY assisted devices catalogue. Only visible on logged-out public home.

---

## TODO (user portal)
- [ ] SAGE avatar dropdown (Vikram) — profile/logout
- [ ] SAGE registration form step 6 (Review & Submit) layout
- [ ] Product/Member detail dialogs (eye view)
- [ ] Editable (non-approved) form states + "Add" dialogs
- [ ] Volunteer role: dashboard + Volunteer registration form (`/volunteer`)
- [ ] Take the Pledge flow (form after clicking), certificate download flow
- [ ] Free Assisted Living Devices scheme page (View Scheme Details)
- [ ] Forgot Password page
- [ ] sage-registration public landing (`/sage-registration`) before form

## Route summary (user)
| Route | Screen |
|---|---|
| / | Home (public cards) / SAGE dashboard (logged in) |
| /epledge | E-Pledge |
| /our-services | Service directory (map + list) |
| /login | SAMAVESH login (Citizen ↔ Officer; Volunteer/SAGE sub-toggle) |
| /sage-registration | SAGE registration landing |
| /sage-registration/form | 6-step SAGE application wizard |
| /volunteer | Volunteer registration |
| /forgot-password | Forgot password |
