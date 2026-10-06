import type { KpiDefinition, PortalDashboard, PortalId } from "./types.ts";

/**
 * THE KPI REGISTER — every indicator a portal has submitted, transcribed row for row.
 *
 * SOURCE: `SAMAVESH_KPI_Data_Collection_Proforma` (Google Sheet
 * 1vAfUspPKxsqJSY1n6O-R3XqUP05g74ix5pjYdk7RhlM), read 5 Oct 2026. The tracker tab
 * records four portals as received: SMILE – Beggary (24.09.2026), NMBA (24.09.2026),
 * e-Utthaan / DAPSC (18.09.2026) and SHRESHTA under e-Anudaan (Office Memorandum
 * dated 30.09.2026). Names, definitions, sources and formulae are the portals' own
 * words; only capitalisation is ours (Title Case, `ui-restraint-and-copy.md`).
 *
 * Departures from the sheet, each deliberate and listed in
 * `docs/audit/kpi-dashboard-proforma-gaps.md`:
 *  - SMILE – Beggary row 44 appears twice; it is transcribed once. There is no row 35.
 *  - NMBA supplied names only. No definition, unit or source is invented for them;
 *    the audience is public because the NMBA portal already shows all six publicly.
 *  - `category` is the normalised list in `categories.ts`, not the sheet's spelling.
 *  - `levels`, `span` and the reading's shape are ours; the proforma does not ask.
 */

const SMILE_SOURCE = "SMILE-Beggary Admin Portal";
const SURVEY_APP = "Beggary Survey App";

const SMILE_BEGGARY: KpiDefinition[] = [
  // ── Public (Pre-Login) ──────────────────────────────────────────────────
  {
    id: "smile-beggary.identified", sNo: 1, audience: "public", category: "coverage",
    name: "Persons Engaged in Begging Identified",
    definition: "Cumulative number of persons engaged in begging surveyed and identified through the Beggary Survey App",
    unit: "number", source: `${SURVEY_APP} → ${SMILE_SOURCE} (Programme Overview: 'Identified/Surveyed')`, frequency: "Real-time",
    formula: "COUNT of unique beneficiary records in status Identified or beyond (Identified, Under Mobilization, Mobilized, Under Rehabilitation, Rehabilitated); Cancelled excluded",
    onPortal: true, remarks: "Use 'Consolidated (All)' data version so migrated Version 1 records are included. Confirm treatment of Cancelled records against dashboard logic.", span: 3,
  },
  {
    id: "smile-beggary.mobilised", sNo: 2, audience: "public", category: "coverage",
    name: "Persons Mobilised to Shelter / Care",
    definition: "Identified persons who have been moved to, or have reached, a Swashraya (Shelter Home) or care facility",
    unit: "number", source: `${SMILE_SOURCE} (Programme Overview: 'Mobilised'; MIS Reports → Mobilised Report)`, frequency: "Real-time",
    formula: "COUNT of beneficiaries recorded as Mobilized (dashboard 'Mobilised' tile)",
    onPortal: true, remarks: "Confirm whether tile is stage-wise or cumulative-through-stage before publishing.", span: 3,
  },
  {
    id: "smile-beggary.children", sNo: 3, audience: "public", category: "coverage",
    name: "Children (Below 18 Years) Identified – CNCP",
    definition: "Children in need of care and protection identified during the survey",
    unit: "number", source: `${SMILE_SOURCE} → Beneficiary List ('Children' tile)`, frequency: "Real-time",
    formula: "COUNT of identified beneficiaries with Age < 18",
    onPortal: true, remarks: "Publish aggregate only; no beneficiary-level data on the pre-login view.", span: 3,
  },
  {
    id: "smile-beggary.rehabilitated", sNo: 11, audience: "public", category: "outcomes",
    name: "Persons Rehabilitated",
    definition: "Persons undergoing or having completed comprehensive rehabilitation",
    unit: "number", source: `${SMILE_SOURCE} → Programme Overview ('Combined Total Rehab'); MIS Reports → Rehabilitated Report`, frequency: "Real-time",
    formula: "COUNT of beneficiaries in status Under Rehabilitation or Rehabilitated",
    onPortal: true, remarks: "Dashboard splits Shelter Assigned and Child Rehab; confirm whether 'Under Rehabilitation' counts as rehabilitated.", span: 3,
  },
  {
    id: "smile-beggary.gender", sNo: 4, audience: "public", category: "coverage",
    name: "Gender-wise Distribution of Identified Persons",
    definition: "Share of identified persons who are male, female and transgender/other",
    unit: "percent", source: `${SMILE_SOURCE} → Beneficiary List; Dashboard (Beneficiary Profile)`, frequency: "Monthly",
    formula: "(Gender-wise count ÷ Total identified) × 100", onPortal: true, span: 6,
  },
  {
    id: "smile-beggary.states-covered", sNo: 5, audience: "public", category: "geography",
    name: "States/UTs Covered",
    definition: "Number of States/UTs with at least one active survey location under SMILE-Beggary",
    unit: "number", source: `${SMILE_SOURCE} → Survey Locations / Survey Location Report`, frequency: "Quarterly",
    formula: "COUNT DISTINCT State/UT with ≥1 active survey location",
    onPortal: true, remarks: "Derived from location register; not shown as a tile.", levels: ["national"], span: 3,
  },
  {
    id: "smile-beggary.districts-covered", sNo: 6, audience: "public", category: "geography",
    name: "Districts / Cities Covered",
    definition: "Number of cities/districts where survey locations are active",
    unit: "number", source: `${SMILE_SOURCE} → Performance Statistics ('Total Cities Covered')`, frequency: "Real-time",
    formula: "COUNT DISTINCT city/district with ≥1 active survey location",
    onPortal: true, remarks: "Portal hint text still says 'pilot cities'; confirm definition.", levels: ["national", "state"], span: 3,
  },
  {
    id: "smile-beggary.agencies", sNo: 7, audience: "public", category: "geography",
    name: "Implementing Agencies / NGOs Onboarded",
    definition: "Approved and active Implementing Agencies, NGOs and Institutes working under the scheme",
    unit: "number", source: `${SMILE_SOURCE} → Performance Statistics ('Implementing Agencies'); Implementing Agency Report`, frequency: "Real-time",
    formula: "COUNT of IA accounts with status Approved and active", onPortal: true, span: 3,
  },
  {
    id: "smile-beggary.shelters", sNo: 8, audience: "public", category: "geography",
    name: "Swashraya (Shelter Homes) Available and Capacity",
    definition: "Number and sanctioned bed capacity of Swashraya (Shelter Homes) on the portal",
    unit: "number", source: `${SMILE_SOURCE} → Swashraya (Shelter Homes); Swashraya Report`, frequency: "Quarterly",
    formula: "COUNT of active shelters; SUM of Capacity", onPortal: true, remarks: "Only active shelter records are listed.", span: 3,
  },
  {
    id: "smile-beggary.fund-released", sNo: 9, audience: "public", category: "funds",
    name: "Total Fund Released",
    definition: "Total funds released under SMILE-Beggary in the selected period / financial year",
    unit: "crore", source: `${SMILE_SOURCE} → Performance Statistics ('Total Fund Released'); Fund Monitoring`, frequency: "Monthly",
    formula: "SUM of released amounts for the period", onPortal: true, remarks: "Portal holds amounts in ₹; convert to ₹ Crore. Confirm BE/RE split if required.", span: 3,
  },
  {
    id: "smile-beggary.fund-utilised", sNo: 10, audience: "public", category: "funds",
    name: "Total Fund Utilised",
    definition: "Total funds reported as utilised against funds disbursed",
    unit: "crore", source: `${SMILE_SOURCE} → Programme Overview ('Fund Utilised')`, frequency: "Monthly",
    formula: "SUM of utilised amounts for the period", onPortal: true, remarks: "Source of utilisation entries to be confirmed with the portal team.", span: 3,
  },
  {
    id: "smile-beggary.rehab-type", sNo: 12, audience: "public", category: "outcomes",
    name: "Rehabilitation by Type",
    definition: "Rehabilitated persons by type: wage employment, self-employment, skill training, reunited with family, care home, child welfare, Anganwadi/school admission, SHG & own house",
    unit: "number", source: `${SMILE_SOURCE} → Rehab Data (Comprehensive Rehab Record)`, frequency: "Monthly",
    formula: "COUNT of rehabilitation records grouped by Rehabilitation Type", onPortal: true, remarks: "Rehab Data screen has no export; take figures from MIS Reports.", span: 6,
  },
  {
    id: "smile-beggary.skill-training", sNo: 13, audience: "public", category: "outcomes",
    name: "Persons Enrolled in Skill & Training",
    definition: "Beneficiaries enrolled in skill/vocational training, by status (In Progress / Completed / Discontinued)",
    unit: "number", source: `${SMILE_SOURCE} → Skill & Training`, frequency: "Monthly",
    formula: "COUNT of enrolments grouped by Status", onPortal: true, span: 6,
  },
  {
    id: "smile-beggary.scheme-linkage", sNo: 14, audience: "public", category: "outcomes",
    name: "Beneficiaries Linked to Government Schemes",
    definition: "Rehabilitated persons with scheme convergence recorded (e.g. PMAY, PM-JAY, e-SHRAM, ONORC, PMKVY, NULM)",
    unit: "number", source: `${SMILE_SOURCE} → Rehab Data ('Government Scheme Convergence'); Survey Section I`, frequency: "Monthly",
    formula: "COUNT of records with Convergence = Yes; scheme-wise split", onPortal: true, span: 6,
  },
  {
    id: "smile-beggary.monthly-trend", sNo: 15, audience: "public", category: "trends",
    name: "Monthly Trend – Identified / Mobilised / Rehabilitated",
    definition: "Month-wise number of persons identified, mobilised and rehabilitated",
    unit: "number", source: `${SMILE_SOURCE} → Performance Statistics ('Monthly Activity Trend')`, frequency: "Monthly",
    formula: "COUNT of status events per month", onPortal: true, span: 8,
  },
  {
    id: "smile-beggary.yoy-rehab", sNo: 16, audience: "public", category: "trends",
    name: "Year-on-Year Growth in Persons Rehabilitated",
    definition: "Change in persons rehabilitated, current FY versus last FY",
    unit: "percent", source: `${SMILE_SOURCE} → Performance Statistics (Current FY / Last FY periods)`, frequency: "Annual",
    formula: "((Rehabilitated in Current FY − Last FY) ÷ Last FY) × 100", onPortal: true, remarks: "Derived from the two period views.", span: 4,
  },
  {
    id: "smile-beggary.aadhaar", sNo: 17, audience: "public", category: "digital",
    name: "Identified Persons with Aadhaar",
    definition: "Share of identified persons who have an Aadhaar card",
    unit: "percent", source: `${SMILE_SOURCE} → Beneficiary Report ('Aadhaar Available')`, frequency: "Monthly",
    formula: "(Count with Aadhaar Available = Yes ÷ Total identified) × 100", onPortal: true, span: 3,
  },
  {
    id: "smile-beggary.bank-account", sNo: 18, audience: "public", category: "digital",
    name: "Identified Persons with Bank Account in Own Name",
    definition: "Share of identified persons with a bank account in their own name (DBT readiness)",
    unit: "percent", source: `${SURVEY_APP} (Section E, Q24)`, frequency: "Quarterly",
    formula: "(Count with bank account = Yes ÷ Total surveyed) × 100",
    onPortal: false, remarks: "Captured in the survey; no aggregate indicator on the portal per the SOPs. Needs a dashboard widget.", span: 3,
  },

  // ── Office (Post-Login) ─────────────────────────────────────────────────
  {
    id: "smile-beggary.utilisation-pct", sNo: 19, audience: "officer", category: "funds",
    name: "Fund Utilisation (%) – State / District-wise",
    definition: "Funds utilised as a share of funds disbursed",
    unit: "percent", source: `${SMILE_SOURCE} → Programme Overview ('Fund Disbursed vs Utilised')`, frequency: "Real-time",
    formula: "(Fund Utilised ÷ Fund Disbursed) × 100", onPortal: true, remarks: "Drill by State/District/City.", span: 6,
  },
  {
    id: "smile-beggary.undisbursed", sNo: 20, audience: "officer", category: "funds",
    name: "Undisbursed Balance with State / District",
    definition: "NISD funds received but not yet released onward to Implementing Agencies",
    unit: "crore", source: `${SMILE_SOURCE} → Fund Monitoring → Release Onwards ('Available residual')`, frequency: "Real-time",
    formula: "NISD release − SUM of onward releases to IAs", onPortal: true, remarks: "Onward releases cannot be edited once submitted.", span: 3,
  },
  {
    id: "smile-beggary.fund-pipeline", sNo: 21, audience: "officer", category: "funds",
    name: "Fund Pipeline – Sanctioned vs Released by NISD vs Onward Released",
    definition: "Amounts at each stage of the sanction-to-disbursement chain",
    unit: "crore", source: `${SMILE_SOURCE} → Fund Monitoring (Sanction Order / NISD Release / Onward Release trackers)`, frequency: "Monthly",
    formula: "SUM of Amount in each tracker", onPortal: true, levels: ["national", "state"], span: 6,
  },
  {
    id: "smile-beggary.pipeline", sNo: 22, audience: "officer", category: "workflow",
    name: "Beneficiary Pipeline by Stage",
    definition: "Beneficiaries by stage: Identified, Under Mobilization, Mobilized, Under Rehabilitation, Rehabilitated, Cancelled",
    unit: "number", source: `${SMILE_SOURCE} → Beneficiary List / Beneficiary Report ('Current Status')`, frequency: "Real-time",
    formula: "COUNT of beneficiaries grouped by Status", onPortal: true, span: 6,
  },
  {
    id: "smile-beggary.conv-mobilised", sNo: 23, audience: "officer", category: "workflow",
    name: "Identified-to-Mobilised Conversion",
    definition: "Share of identified persons who have been mobilised",
    unit: "percent", source: `${SMILE_SOURCE} → Programme Overview`, frequency: "Monthly",
    formula: "(Mobilised ÷ Identified) × 100", onPortal: true, remarks: "Derived from two dashboard tiles.", span: 3,
  },
  {
    id: "smile-beggary.conv-rehab", sNo: 24, audience: "officer", category: "workflow",
    name: "Mobilised-to-Rehabilitated Conversion",
    definition: "Share of mobilised persons who have moved into rehabilitation",
    unit: "percent", source: `${SMILE_SOURCE} → Programme Overview`, frequency: "Monthly",
    formula: "(Rehabilitated ÷ Mobilised) × 100", onPortal: true, remarks: "Derived from two dashboard tiles.", span: 3,
  },
  {
    id: "smile-beggary.awaiting-review", sNo: 25, audience: "officer", category: "workflow",
    name: "Surveys Awaiting Review (Pendency)",
    definition: "Submitted surveys awaiting Implementing Agency review",
    unit: "number", source: `${SURVEY_APP} (Surveyor Dashboard: 'Awaiting Review')`, frequency: "Daily",
    formula: "COUNT of surveys with status = Awaiting Review",
    onPortal: false, remarks: "There's a dedicated immediate_review_queue table maintained by a background job, with current_review_status and days_pending", span: 3,
  },
  {
    id: "smile-beggary.tat-sanction", sNo: 26, audience: "officer", category: "turnaround",
    name: "Average Days: Sanction Order to NISD Release",
    definition: "Average time taken from sanction date to NISD release",
    unit: "days", source: `${SMILE_SOURCE} → Fund Monitoring (Sanction Order Tracker, 'Time / Days')`, frequency: "Monthly",
    formula: "AVG(NISD Release Date − Sanction Date)", onPortal: true, levels: ["national", "state"], span: 3,
  },
  {
    id: "smile-beggary.tat-onward", sNo: 27, audience: "officer", category: "turnaround",
    name: "Average Days: NISD Release to Onward Release to IA",
    definition: "Average time taken to pass funds to Implementing Agencies",
    unit: "days", source: `${SMILE_SOURCE} → Fund Monitoring (NISD and Onward Release trackers)`, frequency: "Monthly",
    formula: "AVG(Release Date to IA − Date Funds Received from NISD)", onPortal: true, span: 3,
  },
  {
    id: "smile-beggary.tat-registration", sNo: 28, audience: "officer", category: "turnaround",
    name: "Average TAT for IA Registration Decision",
    definition: "Average time from IA registration application to approval or rejection",
    unit: "days", source: `${SMILE_SOURCE} → IA List / Registration history ('Applied On', decision date)`, frequency: "Monthly",
    formula: "AVG(Decision Date − Applied On) for Approved and Rejected", onPortal: true, remarks: "Both dates are captured; TAT is not shown as a tile.", span: 3,
  },
  {
    id: "smile-beggary.tat-review", sNo: 29, audience: "officer", category: "turnaround",
    name: "Average TAT for Survey Review",
    definition: "Average time from survey submission to Approved / Clarification",
    unit: "days", source: `${SURVEY_APP} (survey status timestamps)`, frequency: "Monthly",
    formula: "AVG(Review Date − Submission Date)", onPortal: false, remarks: "Statuses exist in the app; timestamps not exposed on the portal.", span: 3,
  },
  {
    id: "smile-beggary.follow-up", sNo: 30, audience: "officer", category: "turnaround",
    name: "3 / 6 / 12-Month Follow-up Compliance",
    definition: "Share of due rehabilitation follow-ups that have been recorded",
    unit: "percent", source: `${SMILE_SOURCE} → Rehab Data (3m/6m/12m chips)`, frequency: "Monthly",
    formula: "(Follow-ups recorded ÷ Follow-ups due) × 100", onPortal: true, remarks: "'3m due' chips mark outstanding checkpoints.", span: 6,
  },
  {
    id: "smile-beggary.clarification", sNo: 31, audience: "officer", category: "deficiency",
    name: "Surveys Returned for Clarification",
    definition: "Surveys sent back to surveyors by the IA for clarification or correction",
    unit: "number", source: `${SURVEY_APP} (Surveyor Dashboard: 'Clarification')`, frequency: "Weekly",
    formula: "COUNT of surveys with status = Clarification; rate = ÷ surveys submitted × 100", onPortal: false, remarks: "Not aggregated on the Admin Portal.", span: 3,
  },
  {
    id: "smile-beggary.files-not-filed", sNo: 32, audience: "officer", category: "deficiency",
    name: "Rehabilitation Files Not Filed",
    definition: "Persons under rehabilitation or rehabilitated whose detailed rehabilitation form is not yet filed",
    unit: "number", source: `${SMILE_SOURCE} → Rehabilitated Report (blank Rehabilitation Type / Start Date)`, frequency: "Monthly",
    formula: "COUNT of beneficiaries in status Under Rehabilitation/Rehabilitated with blank Rehabilitation Type", onPortal: true, remarks: "Per SOP, blank fields are legitimate until the IA files the form.", span: 3,
  },
  {
    id: "smile-beggary.pending-sync", sNo: 33, audience: "officer", category: "system",
    name: "Surveys Pending Sync",
    definition: "Surveys captured offline and not yet uploaded to the server",
    unit: "number", source: `${SURVEY_APP} (Surveyor Dashboard: 'Not Synced')`, frequency: "Daily",
    formula: "COUNT of surveys with status = Not Synced", onPortal: false, remarks: "Held on the device; no server-side view.", span: 3,
  },
  {
    id: "smile-beggary.aadhaar-gap", sNo: 34, audience: "officer", category: "system",
    name: "Aadhaar Unavailable – DBT Readiness Gap",
    definition: "Identified persons without Aadhaar, by district and IA",
    unit: "number", source: `${SMILE_SOURCE} → Beneficiary Report ('Aadhaar Available')`, frequency: "Monthly",
    formula: "COUNT of beneficiaries with Aadhaar Available = No", onPortal: true, span: 3,
  },
  {
    id: "smile-beggary.ranking", sNo: 36, audience: "officer", category: "monitoring",
    name: "District-wise Performance Ranking",
    definition: "Districts ranked by persons identified, mobilised and rehabilitated",
    unit: "number", source: `${SMILE_SOURCE} → Performance Statistics ('District-wise Performance Ranking / Detail')`, frequency: "Monthly",
    formula: "COUNT by district; rank by chosen measure", onPortal: true, levels: ["national", "state"], span: 6,
  },
  {
    id: "smile-beggary.surveyors", sNo: 37, audience: "officer", category: "monitoring",
    name: "Active Surveyors Deployed",
    definition: "Field surveyors with an active mapping to a survey location",
    unit: "number", source: `${SMILE_SOURCE} → Surveyor Mappings ('Active', 'Distinct Surveyors')`, frequency: "Weekly",
    formula: "COUNT of Active surveyor mappings", onPortal: true, remarks: "'Active' includes surveyors merely logged in or out.", span: 3,
  },
  {
    id: "smile-beggary.occupancy", sNo: 38, audience: "officer", category: "monitoring",
    name: "Shelter Occupancy Rate",
    definition: "Current occupancy as a share of sanctioned capacity",
    unit: "percent", source: `${SMILE_SOURCE} → Swashraya Report; Shelter Occupants`, frequency: "Weekly",
    formula: "(SUM Current Occupancy ÷ SUM Capacity) × 100", onPortal: true, span: 3,
  },
  {
    id: "smile-beggary.shelters-unavailable", sNo: 39, audience: "officer", category: "monitoring",
    name: "Shelters Full / Closed / Under Inspection",
    definition: "Shelters not available for fresh admissions",
    unit: "number", source: `${SMILE_SOURCE} → Swashraya (Shelter Homes) ('Operational status')`, frequency: "Weekly",
    formula: "COUNT of shelters by Operational Status", onPortal: true, span: 6,
  },
  {
    id: "smile-beggary.skill-completion", sNo: 40, audience: "officer", category: "monitoring",
    name: "Skill Training Completion and Drop-out Rate",
    definition: "Enrolments completed and discontinued as a share of total enrolments",
    unit: "percent", source: `${SMILE_SOURCE} → Skill & Training`, frequency: "Monthly",
    formula: "(Completed ÷ Total enrolments) × 100; (Discontinued ÷ Total) × 100", onPortal: true, span: 6,
  },
  {
    id: "smile-beggary.relapse", sNo: 41, audience: "officer", category: "monitoring",
    name: "Relapse and Lost-to-Follow-up Rate",
    definition: "Rehabilitated persons recorded as Relapsed or Lost to Follow-up",
    unit: "percent", source: `${SMILE_SOURCE} → Rehab Data (follow-up outcome)`, frequency: "Quarterly",
    formula: "(Relapsed + Lost to Follow-up) ÷ Total rehabilitated × 100", onPortal: true, span: 3,
  },
  {
    id: "smile-beggary.ia-registrations", sNo: 42, audience: "officer", category: "onboarding",
    name: "IA Registrations by Status",
    definition: "Registration requests Pending, Approved and Rejected",
    unit: "number", source: `${SMILE_SOURCE} → IA List (Total / Pending / Approved / Rejected tiles)`, frequency: "Real-time",
    formula: "COUNT of registrations grouped by Current Status", onPortal: true, remarks: "Rejections carry a mandatory reason.", span: 6,
  },
  {
    id: "smile-beggary.ia-activity", sNo: 43, audience: "officer", category: "onboarding",
    name: "IA Field Activity",
    definition: "Surveyors mapped and beneficiaries identified per Implementing Agency",
    unit: "number", source: `${SMILE_SOURCE} → Implementing Agency Report`, frequency: "Monthly",
    formula: "Surveyors Mapped; Beneficiaries Identified, per IA", onPortal: true, span: 12,
  },
  {
    id: "smile-beggary.unassigned-locations", sNo: 44, audience: "officer", category: "onboarding",
    name: "Survey Locations Without an Implementing Agency",
    definition: "Survey locations that have no agency attached",
    unit: "number", source: `${SMILE_SOURCE} → Survey Locations ('Unassigned' tile)`, frequency: "Real-time",
    formula: "COUNT of locations with no active IA assignment", onPortal: true, remarks: "Load is capped at 50 records for the State role; confirm.", span: 3,
  },
];

const NMBA_METRICS = "https://nashamukt-api-user.mosje.in/api/v1/user/dashboard/metrics?state_id=&district_id=";

/**
 * NMBA supplied names and, since 5 Oct 2026, two production API paths (Total Outreach and
 * Women Outreach). Youth, e-Pledge and Mitras come back from the same metrics endpoint, which
 * this dashboard reads live. Nothing else is invented for them.
 */
const NMBA: KpiDefinition[] = [
  { id: "nmba.outreach", sNo: 1, audience: "public", category: "coverage", name: "Total Outreach", unit: "number", span: 3, api: { coverage: "available", endpoints: ["https://nashamukt-api-user.mosje.in/api/v1/user/dashboard/state-wise"] } },
  { id: "nmba.women", sNo: 2, audience: "public", category: "coverage", name: "Women Outreach", unit: "number", span: 3, api: { coverage: "available", endpoints: [NMBA_METRICS] } },
  { id: "nmba.youth", sNo: 3, audience: "public", category: "coverage", name: "Youth Outreach", unit: "number", span: 3, api: { coverage: "available", endpoints: [NMBA_METRICS] } },
  { id: "nmba.calls", sNo: 4, audience: "public", category: "coverage", name: "Total Calls on 14446", unit: "number", levels: ["national"], span: 3, api: { coverage: "none" } },
  { id: "nmba.pledges", sNo: 5, audience: "public", category: "coverage", name: "NMBA e-Pledge (Both Recovered and Non-Users)", unit: "number", span: 3, api: { coverage: "available", endpoints: [NMBA_METRICS] } },
  { id: "nmba.mitras", sNo: 6, audience: "public", category: "coverage", name: "Registered Nasha Mukti Mitras", unit: "number", span: 3, api: { coverage: "available", endpoints: [NMBA_METRICS] } },
  // Not a submitted KPI: the state-wise view behind KPI 1, which the NMBA sheet points at
  // (`/api/v1/user/dashboard/state-wise`). Drawn so the reader can see where outreach happened.
  { id: "nmba.outreach-by-state", sNo: 1, audience: "public", category: "geography", name: "Total Outreach by State/UT", unit: "number", levels: ["national"], span: 12 },
];

const EUTTHAAN: KpiDefinition[] = [
  {
    id: "e-utthaan.allocation", sNo: 1, audience: "public", category: "funds",
    name: "Total DAPSC Allocation (B.E. and R.E.)", definition: "Total DAPSC allocation for FY(s)",
    unit: "crore", source: "e-Utthaan", frequency: "Bi-annual", formula: "Total DAPSC Allocation", span: 6,
  },
  {
    id: "e-utthaan.expenditure", sNo: 2, audience: "public", category: "funds",
    name: "Total DAPSC Expenditure (B.E. and R.E.)", definition: "Total DAPSC expenditure for FY(s)",
    unit: "crore", source: "PFMS", frequency: "Real-time", formula: "Total DAPSC expenditure", span: 6,
  },
  {
    id: "e-utthaan.mandate", sNo: 3, audience: "public", category: "funds",
    name: "Mandated Allocation", definition: "M/D wise DAPSC allocation vis a vis Mandated Allocation",
    unit: "percent", source: "e-Utthaan", frequency: "Bi-annual", formula: "Difference between % DAPSC allocation and NITI aayog mandate", span: 12,
  },
  {
    id: "e-utthaan.ministries", sNo: 4, audience: "public", category: "coverage",
    name: "Total Number of DAPSC Obligated Ministries/Departments", definition: "Count of Ministries/Departments allocating funds under DAPSC",
    unit: "number", source: "e-Utthaan", frequency: "Annual", formula: "Count", span: 6,
  },
  {
    id: "e-utthaan.schemes", sNo: 5, audience: "public", category: "coverage",
    name: "Total Number of Schemes Under DAPSC", definition: "Count of Number of Schemes under DAPSC",
    unit: "number", source: "e-Utthaan", frequency: "Annual", formula: "Count", span: 6,
  },
];

const ANUDAAN = "e-Anudaan MIS / e-SAMAVESH";

const SHRESHTA: KpiDefinition[] = [
  {
    id: "shreshta.funds", sNo: 1, audience: "public", category: "funds",
    name: "Total Funds Released (₹ Crore)", definition: "Funds released under Mode-I and Mode-II of SHRESHTA",
    unit: "crore", source: "PFMS", frequency: "Monthly", formula: "Funds released under SHRESHTA – FY till date", span: 6,
  },
  {
    id: "shreshta.beneficiaries", sNo: 2, audience: "public", category: "coverage",
    name: "No. of Beneficiaries Benefited", definition: "SC students who benefited under Mode-I & Mode-II of SHRESHTA, FY-to-date",
    unit: "number", source: "Division / e-SAMAVESH", frequency: "Monthly", formula: "SUM of SC students benefited under Mode-I & Mode-II", span: 6,
  },
  {
    id: "shreshta.field-inspection", sNo: 3, audience: "officer", category: "workflow",
    name: "No. of Applications Pending – Field Inspection Stage", definition: "NGO grant applications currently awaiting PMU field inspection report submission",
    unit: "number", source: ANUDAAN, frequency: "Monthly", formula: "COUNT of applications with status = Field Inspection Pending",
    remarks: "Identical, word for word, to the proforma's illustrative example row. Confirm with the Division that it is SHRESHTA's own KPI.", span: 4,
  },
  {
    id: "shreshta.sanctioned", sNo: 4, audience: "officer", category: "workflow",
    name: "No. of Applications Sanctioned", definition: "Funds released to the NGOs",
    unit: "number", source: ANUDAAN, frequency: "Monthly", formula: "COUNT of applications sanctioned",
    remarks: "The definition describes an amount; the unit and formula describe a count. Confirm which is meant.", span: 4,
  },
  {
    id: "shreshta.deficiency", sNo: 5, audience: "officer", category: "deficiency",
    name: "No. of Organisations Flagged for Deficiency", definition: "NGOs issued a deficiency notice for incomplete / incorrect documentation in the period",
    unit: "number", source: ANUDAAN, frequency: "Monthly", formula: "COUNT of deficiency notifications issued in the period",
    remarks: "Identical, word for word, to the proforma's illustrative example row. Confirm with the Division that it is SHRESHTA's own KPI.", span: 4,
  },
];


/**
 * Senior Citizens Welfare — the SCW-internal tab (added 5 Oct 2026): 28 KPIs over seven
 * components, each with the portal's own API audit. The tab has no KPI Type column, so every
 * KPI is read as public; it carries no definitions, sources or frequencies, so none are
 * invented. Names are the tab's, in Title Case (`ui-restraint-and-copy.md`). The portal's APIs answer only to a signed-in user (checked 5 Oct 2026), so every
 * figure is illustrative until a feed is agreed.
 */
const SENIOR_CITIZENS: KpiDefinition[] = [
  {
    id: "senior-citizens.ipsrc.budget", sNo: 1, audience: "public", category: "funds",
    component: "Integrated Programme for Senior Citizens (IPSrC)", name: "Budget Estimate", unit: "crore", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "No budget / allocation table or API. Needs budget data from DoSJE." },
  },
  {
    id: "senior-citizens.ipsrc.expenditure", sNo: 2, audience: "public", category: "funds",
    component: "Integrated Programme for Senior Citizens (IPSrC)", name: "Budget Expenditure", unit: "crore", levels: ["national"], span: 4,
    api: { coverage: "partial", endpoints: ["https://seniorcitizen-api-user.mosje.in/api/app/project-gia-details", "https://seniorcitizen-api-user.mosje.in/api/app/dashboard-summary"], gap: "GIA released (a proxy for expenditure) is available per project; no actual expenditure/utilisation data, and no all-project total endpoint." },
  },
  {
    id: "senior-citizens.ipsrc.progress", sNo: 3, audience: "public", category: "funds",
    component: "Integrated Programme for Senior Citizens (IPSrC)", name: "Financial Progress", unit: "percent", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "Needs budget estimate (KPI 1) and expenditure (KPI 2)." },
  },
  {
    id: "senior-citizens.ipsrc.projects", sNo: 4, audience: "public", category: "coverage",
    component: "Integrated Programme for Senior Citizens (IPSrC)", name: "Number of Projects Assisted", unit: "number", levels: ["national"], span: 4,
    api: { coverage: "available", endpoints: ["https://seniorcitizen-api-user.mosje.in/api/app/project-list"], gap: "Count the rows returned by project-list. A ready-made count endpoint does not exist." },
  },
  {
    id: "senior-citizens.ipsrc.beneficiaries", sNo: 5, audience: "public", category: "coverage",
    component: "Integrated Programme for Senior Citizens (IPSrC)", name: "Total Number of Beneficiaries Covered", unit: "number", levels: ["national"], span: 4,
    api: { coverage: "partial", endpoints: ["https://seniorcitizen-api-user.mosje.in/api/app/senior-citizen-summary"], gap: "Counts are per project_id only; no all-India / state-wise aggregate endpoint." },
  },
  {
    id: "senior-citizens.sapsrc.budget", sNo: 6, audience: "public", category: "funds",
    component: "State Action Plan for Senior Citizens (SAPSrC)", name: "Budget Estimate", unit: "crore", levels: ["national"], span: 4,
    api: { coverage: "partial", endpoints: ["https://seniorcitizen-api-user.mosje.in/api/app/get-financial-release"], gap: "Only funds RELEASED per state per FY (amount_released_cr); no separate allocation/budget figure." },
  },
  {
    id: "senior-citizens.sapsrc.expenditure", sNo: 7, audience: "public", category: "funds",
    component: "State Action Plan for Senior Citizens (SAPSrC)", name: "Budget Expenditure", unit: "crore", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "Only released funds are stored, no expenditure." },
  },
  {
    id: "senior-citizens.sapsrc.progress", sNo: 8, audience: "public", category: "funds",
    component: "State Action Plan for Senior Citizens (SAPSrC)", name: "Financial Progress", unit: "percent", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "Needs budget and expenditure." },
  },
  {
    id: "senior-citizens.rvy.budget", sNo: 9, audience: "public", category: "funds",
    component: "Rashtriya Vayoshri Yojana (RVY)", name: "Budget Estimate", unit: "crore", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "No RVY financial data in the system." },
  },
  {
    id: "senior-citizens.rvy.expenditure", sNo: 10, audience: "public", category: "funds",
    component: "Rashtriya Vayoshri Yojana (RVY)", name: "Budget Expenditure", unit: "crore", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "No RVY financial data in the system." },
  },
  {
    id: "senior-citizens.rvy.progress", sNo: 11, audience: "public", category: "funds",
    component: "Rashtriya Vayoshri Yojana (RVY)", name: "Financial Progress", unit: "percent", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "No RVY financial data in the system." },
  },
  {
    id: "senior-citizens.rvy.devices-cost", sNo: 12, audience: "public", category: "outcomes",
    component: "Rashtriya Vayoshri Yojana (RVY)", name: "Number of Devices Distributed and Cost Incurred", unit: "number", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "No distribution or cost records." },
  },
  {
    id: "senior-citizens.rvy.beneficiaries", sNo: 13, audience: "public", category: "coverage",
    component: "Rashtriya Vayoshri Yojana (RVY)", name: "Total Number of Beneficiaries Covered", unit: "number", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "No RVY beneficiary table." },
  },
  {
    id: "senior-citizens.rvy.devices", sNo: 14, audience: "public", category: "outcomes",
    component: "Rashtriya Vayoshri Yojana (RVY)", name: "Total Number of Assistive Devices Distributed", unit: "number", levels: ["national"], span: 4,
    api: { coverage: "none", endpoints: ["https://seniorcitizen-api-admin.mosje.in/api/v1/admin/rvyAssistedDevices/list"], gap: "A7 only lists device TYPES (catalogue); it has no distributed quantities." },
  },
  {
    id: "senior-citizens.rvy.activities", sNo: 15, audience: "public", category: "outcomes",
    component: "Rashtriya Vayoshri Yojana (RVY)", name: "Number of Activities (Walk-in / Camp Mode) Conducted", unit: "number", levels: ["national"], span: 6,
    api: { coverage: "none", gap: "No RVY camp / walk-in activity records." },
  },
  {
    id: "senior-citizens.rvy.devices-by-type", sNo: 16, audience: "public", category: "outcomes",
    component: "Rashtriya Vayoshri Yojana (RVY)", name: "Number of Devices Distributed by Type (Generic / Special Items)", unit: "number", levels: ["national"], span: 6,
    api: { coverage: "none", endpoints: ["https://seniorcitizen-api-admin.mosje.in/api/v1/admin/rvyAssistedDevices/list"], gap: "Device types exist (item_type / device_type) but not counts distributed." },
  },
  {
    id: "senior-citizens.pm-special.budget", sNo: 17, audience: "public", category: "funds",
    component: "PM-SPECIAL - Elder Care & Assisted Living", name: "Budget Estimate", unit: "crore", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "No financial data." },
  },
  {
    id: "senior-citizens.pm-special.expenditure", sNo: 18, audience: "public", category: "funds",
    component: "PM-SPECIAL - Elder Care & Assisted Living", name: "Budget Expenditure", unit: "crore", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "No financial data." },
  },
  {
    id: "senior-citizens.pm-special.progress", sNo: 19, audience: "public", category: "funds",
    component: "PM-SPECIAL - Elder Care & Assisted Living", name: "Financial Progress", unit: "percent", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "No financial data." },
  },
  {
    id: "senior-citizens.pm-special.caregivers", sNo: 20, audience: "public", category: "outcomes",
    component: "PM-SPECIAL - Elder Care & Assisted Living", name: "Number of Geriatric Caregivers Trained", unit: "number", levels: ["national"], span: 4,
    api: { coverage: "partial", endpoints: ["https://seniorcitizen-api-admin.mosje.in/api/v1/admin/geriatricCaregivers/list"], gap: "Enrolled caregivers can be counted; whether training was completed is not confirmed as a stored field." },
  },
  {
    id: "senior-citizens.elderline.budget", sNo: 21, audience: "public", category: "funds",
    component: "Elderline (14567)", name: "Budget Estimate", unit: "crore", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "No financial data." },
  },
  {
    id: "senior-citizens.elderline.expenditure", sNo: 22, audience: "public", category: "funds",
    component: "Elderline (14567)", name: "Budget Expenditure", unit: "crore", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "No financial data." },
  },
  {
    id: "senior-citizens.elderline.progress", sNo: 23, audience: "public", category: "funds",
    component: "Elderline (14567)", name: "Financial Progress", unit: "percent", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "No financial data." },
  },
  {
    id: "senior-citizens.elderline.calls", sNo: 24, audience: "public", category: "coverage",
    component: "Elderline (14567)", name: "Number of Calls Received (Information / Guidance / Emotional Support / Field Intervention / Other)", unit: "number", levels: ["national"], span: 12,
    api: { coverage: "none", endpoints: ["https://seniorcitizen-api-admin.mosje.in/api/v1/admin/grievances/list"], gap: "No Elderline call-log data. A11 is citizen grievances, a different thing." },
  },
  {
    id: "senior-citizens.sage.budget", sNo: 25, audience: "public", category: "funds",
    component: "Senior Care Ageing Growth Engine (SAGE)", name: "Budget Estimate", unit: "crore", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "No financial data." },
  },
  {
    id: "senior-citizens.sage.released", sNo: 26, audience: "public", category: "funds",
    component: "Senior Care Ageing Growth Engine (SAGE)", name: "Funds Released", unit: "crore", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "SAGE applications are stored, but no funds-released data." },
  },
  {
    id: "senior-citizens.sage.startups", sNo: 27, audience: "public", category: "outcomes",
    component: "Senior Care Ageing Growth Engine (SAGE)", name: "Start-ups Supported", unit: "number", levels: ["national"], span: 4,
    api: { coverage: "partial", endpoints: ["https://seniorcitizen-api-admin.mosje.in/api/v1/admin/sageApplications/dashboard-count", "https://seniorcitizen-api-admin.mosje.in/api/v1/admin/sageApplications/list"], gap: "Application counts by status exist; confirm which status counts as \"supported\"." },
  },
  {
    id: "senior-citizens.other.mous", sNo: 28, audience: "public", category: "outcomes",
    component: "Other Initiatives", name: "Number of Strategic MoUs Signed", unit: "number", levels: ["national"], span: 4,
    api: { coverage: "none", gap: "No MoU records in the system." },
  },
];

/** "Financial Year 2026-27, up to 30.09.2026": the half-year the illustrative figures describe. */
const FY_TO_DATE = "Financial Year 2026-27, up to 30.09.2026";

export const PORTAL_DASHBOARDS: PortalDashboard[] = [
  {
    id: "smile-beggary", slug: "smile-beggary",
    name: "SMILE – Comprehensive Rehabilitation of Persons Engaged in the Act of Begging",
    portal: "SMILE-Beggary Admin Portal", owner: "National Institute of Social Defence",
    summary: "Identification, mobilisation and comprehensive rehabilitation of persons engaged in the act of begging, through Implementing Agencies in the cities covered.",
    logoPath: "/portals/smile-admin", portalHref: "/portals/smile-admin",
    levels: ["national", "state", "district"], kpisReceived: "24.09.2026", period: FY_TO_DATE, kpis: SMILE_BEGGARY,
  },
  {
    id: "nmba", slug: "nmba",
    name: "Nasha Mukt Bharat Abhiyaan",
    portal: "NMBA Portal", owner: "Department of Social Justice and Empowerment",
    summary: "Awareness generation against substance use among youth, students and communities, with the national toll-free helpline 14446 for de-addiction.",
    logoPath: "/portals/nmba", portalHref: "/portals/nmba",
    levels: ["national", "state"], kpisReceived: "24.09.2026", period: "Cumulative since launch", kpis: NMBA,
  },
  {
    id: "e-utthaan", slug: "e-utthaan",
    name: "Development Action Plan for Scheduled Castes (DAPSC)",
    portal: "e-Utthaan", owner: "Department of Social Justice and Empowerment",
    summary: "Allocation and expenditure earmarked for the welfare of Scheduled Castes by the obligated Ministries and Departments of the Government of India.",
    logoPath: "/portals/eutthan-admin", portalHref: "/portals/eutthan-admin",
    levels: ["national"], kpisReceived: "18.09.2026", period: "Financial Year 2026-27, B.E.", kpis: EUTTHAAN,
  },
  {
    id: "shreshta", slug: "shreshta",
    name: "SHRESHTA – Scheme for Residential Education for Students in High Schools in Targeted Areas",
    portal: "e-Anudaan", owner: "Department of Social Justice and Empowerment",
    summary: "Quality residential education for meritorious Scheduled Caste students in Classes 9 and 11, in reputed private schools (Mode-I) and in schools run by voluntary organisations (Mode-II).",
    logoPath: "/portals/e-anudaan", portalHref: "/portals/e-anudaan",
    levels: ["national"], kpisReceived: "30.09.2026", period: FY_TO_DATE, kpis: SHRESHTA,
  },
];

/**
 * Senior Citizens Welfare, whose KPIs arrived after the four dashboards above were built. It
 * joins the proposed dashboard (`components/kpi-dashboard/proposed`), not the current list,
 * until the Division confirms the KPIs on the KPI Status tab (still "No", 5 Oct 2026).
 */
export const SENIOR_CITIZENS_DASHBOARD: PortalDashboard = {
  id: "senior-citizens", slug: "senior-citizens",
  name: "Senior Citizens Welfare",
  portal: "Senior Citizens Portal", owner: "Department of Social Justice and Empowerment",
  // The components, as the SCW-internal tab names them; nothing about them is authored here.
  summary: "Integrated Programme for Senior Citizens, State Action Plans, Rashtriya Vayoshri Yojana, PM-SPECIAL elder care, Elderline 14567 and the Senior Care Ageing Growth Engine.",
  logoPath: "/portals/scw", portalHref: "/portals/scw",
  levels: ["national"], kpisReceived: "05.10.2026", period: FY_TO_DATE, kpis: SENIOR_CITIZENS,
};

/** Every programme with KPIs on file — the four dashboards and Senior Citizens Welfare. */
export const PROGRAMMES: PortalDashboard[] = [...PORTAL_DASHBOARDS, SENIOR_CITIZENS_DASHBOARD];

/** "the SMILE-Beggary Admin Portal", but "e-Utthaan": a system's name takes no article. */
export function portalPhrase(portal: PortalDashboard): string {
  return /portal$/i.test(portal.portal) ? `the ${portal.portal}` : portal.portal;
}

export function portalById(id: string): PortalDashboard | undefined {
  return PROGRAMMES.find((p) => p.id === id);
}

export function isPortalId(id: string): id is PortalId {
  return PROGRAMMES.some((p) => p.id === id);
}

/** KPIs of one portal an audience may see. Officers see everything; the public sees public KPIs. */
export function kpisFor(portal: PortalDashboard, audience: "public" | "officer"): KpiDefinition[] {
  return audience === "officer" ? portal.kpis : portal.kpis.filter((k) => k.audience === "public");
}

/** The levels a KPI may be read at: its own where declared, else the portal's. */
export function levelsOf(kpi: KpiDefinition, portal: PortalDashboard): string[] {
  return kpi.levels ?? portal.levels;
}
