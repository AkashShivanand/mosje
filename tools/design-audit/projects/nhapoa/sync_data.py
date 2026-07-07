# -*- coding: utf-8 -*-
"""Synced review data (read back from the Figma 3-column QC sheet, root 445:1279).
Each entry: slug, role, name, node (Figma frame id or None=undesigned), live route,
design image (rel to project, None=undesigned), build image (rel), and the reviewer's
issues text verbatim. build_final_report.py turns each issues bullet into a finding.
Design/undesigned handling: undesigned screens render BUILD-only (no 'undesigned' note)."""

CIT = "https://nhapoa-user-dev.mosje.in"
ADM = "https://nhapoa-admin-dev.mosje.in"
FROLE = "captures/figma/roles"          # design frame PNGs
LV = "captures/live"                    # build PNGs
DT = "captures/details"                 # detail/modal build PNGs
JN = "captures/citizen/journey"         # citizen journey build PNGs

# slug: (role, name, node, liveUrl, designImg, buildImg)
META = {
 # --- Citizen rescue/track build sub-states (undesigned — audited vs the visual language) ---
 "res2": ("Citizen","Register Rescue · Filled",None,CIT+"/register-rescue",None,f"{JN}/CIT-RES-02-filled.png"),
 "res3": ("Citizen","Register Rescue · OTP verification",None,CIT+"/register-rescue",None,f"{JN}/CIT-RES-03-otp.png"),
 "res4": ("Citizen","Register Rescue · Mobile verified",None,CIT+"/register-rescue",None,f"{JN}/CIT-RES-04-verified.png"),
 "res5": ("Citizen","Register Rescue · Success",None,CIT+"/register-rescue",None,f"{JN}/CIT-RES-05-success.png"),
 "trk2": ("Citizen","Track Status · Reference entered (pre-OTP)",None,CIT+"/track-status",None,f"{JN}/CIT-TRK-02-ref-filled.png"),
 # --- Login & Authentication (sits after Citizen) ---
 "auth-login":  ("Login", "Login & Authentication — Sign In", "10434:159436", ADM+"/login", f"{FROLE}/AUTH/login.png", f"{LV}/ADMIN-LOGIN.png"),
 "auth-choose": ("Login", "Login & Authentication — Choose Portal", "10434:159687", ADM+"/login", f"{FROLE}/AUTH/chooseportal.png", f"{LV}/ADMIN-CHOOSE-PORTAL.png"),
 # --- District Officer ---
 "do-dash": ("District Officer","District Officer — Dashboard","5986:53726",ADM+"/district-officer/dashboard",f"{FROLE}/DO/dash.png",f"{LV}/DISTRICT-OFFICER-DISTRICT-OFFICER-DASHBOARD.png"),
 "do-cases":("District Officer","District Officer — My Cases","5986:53857",ADM+"/district-officer/cases",f"{FROLE}/DO/cases.png",f"{LV}/DISTRICT-OFFICER-DISTRICT-OFFICER-CASES.png"),
 "do-clar": ("District Officer","District Officer — Clarifications","5986:55757",ADM+"/district-officer/clarifications",f"{FROLE}/DO/clar.png",f"{LV}/DISTRICT-OFFICER-DISTRICT-OFFICER-CLARIFICATIONS.png"),
 "do-inv":  ("District Officer","District Officer — Investigation Queue","5986:55831",ADM+"/district-officer/investigation",f"{FROLE}/DO/inv.png",f"{LV}/DISTRICT-OFFICER-DISTRICT-OFFICER-INVESTIGATION.png"),
 "do-rep":  ("District Officer","District Officer — My Reports","5986:55911",ADM+"/district-officer/reports",f"{FROLE}/DO/rep.png",f"{LV}/DISTRICT-OFFICER-DISTRICT-OFFICER-REPORTS.png"),
 "do-sla":  ("District Officer","District Officer — SLA Monitor","5986:56034",ADM+"/district-officer/sla",f"{FROLE}/DO/sla.png",f"{LV}/DISTRICT-OFFICER-DISTRICT-OFFICER-SLA.png"),
 "do-ntf":  ("District Officer","District Officer — Notifications","5986:56171",ADM+"/district-officer/notifications",f"{FROLE}/DO/ntf.png",f"{LV}/DISTRICT-OFFICER-DISTRICT-OFFICER-NOTIFICATIONS.png"),
 # --- State Authority ---
 "sa-dash": ("State Authority","State Authority — Dashboard","5986:56262",ADM+"/state-authority/dashboard",f"{FROLE}/SA/dash.png",f"{LV}/STATE-AUTHORITY-STATE-AUTHORITY-DASHBOARD.png"),
 "sa-pending":("State Authority","State Authority — Pending Approvals","5986:56392",ADM+"/state-authority/pending-approvals",f"{FROLE}/SA/pending.png",f"{LV}/STATE-AUTHORITY-STATE-AUTHORITY-PENDING-APPROVALS.png"),
 "sa-approved":("State Authority","State Authority — Approved Cases","5986:57102",ADM+"/state-authority/approved-cases",f"{FROLE}/SA/approved.png",f"{LV}/STATE-AUTHORITY-STATE-AUTHORITY-APPROVED-CASES.png"),
 "sa-sentback":("State Authority","State Authority — Sent Back Cases","5986:57396",ADM+"/state-authority/sent-back",f"{FROLE}/SA/sentback.png",f"{LV}/STATE-AUTHORITY-STATE-AUTHORITY-SENT-BACK.png"),
 "sa-allcases":("State Authority","State Authority — All Cases",None,ADM+"/state-authority/all-cases",None,f"{LV}/STATE-AUTHORITY-STATE-AUTHORITY-ALL-CASES.png"),
 "sa-reports":("State Authority","State Authority — State Reports","5986:57731",ADM+"/state-authority/reports",f"{FROLE}/SA/reports.png",f"{LV}/STATE-AUTHORITY-STATE-AUTHORITY-REPORTS.png"),
 "sa-sla":  ("State Authority","State Authority — SLA Monitor","5986:57848",ADM+"/state-authority/sla",f"{FROLE}/SA/sla.png",f"{LV}/STATE-AUTHORITY-STATE-AUTHORITY-SLA.png"),
 "sa-ntf":  ("State Authority","State Authority — Notifications","5986:57979",ADM+"/state-authority/notifications",f"{FROLE}/SA/ntf.png",f"{LV}/STATE-AUTHORITY-STATE-AUTHORITY-NOTIFICATIONS.png"),
 # --- Finance Officer ---
 "fo-dash": ("Finance Officer","Finance Officer — Dashboard","5986:58064",ADM+"/finance-officer/dashboard",f"{FROLE}/FO/dash.png",f"{LV}/FINANCE-OFFICER-FINANCE-OFFICER-DASHBOARD.png"),
 "fo-queue":("Finance Officer","Finance Officer — Approved Cases Queue","5986:58179",ADM+"/finance-officer/queue",f"{FROLE}/FO/queue.png",f"{LV}/FINANCE-OFFICER-FINANCE-OFFICER-QUEUE.png"),
 "fo-transactions":("Finance Officer","Finance Officer — Transaction Log","5986:58801",ADM+"/finance-officer/transactions",f"{FROLE}/FO/transactions.png",f"{LV}/FINANCE-OFFICER-FINANCE-OFFICER-TRANSACTIONS.png"),
 "fo-utilisation":("Finance Officer","Finance Officer — Fund Utilisation","5986:58996",ADM+"/finance-officer/utilisation",f"{FROLE}/FO/utilisation.png",f"{LV}/FINANCE-OFFICER-FINANCE-OFFICER-UTILISATION.png"),
 "fo-ntf":  ("Finance Officer","Finance Officer — Notifications","5986:59151",ADM+"/finance-officer/notifications",f"{FROLE}/FO/ntf.png",f"{LV}/FINANCE-OFFICER-FINANCE-OFFICER-NOTIFICATIONS.png"),
 # --- Central Authority ---
 "ca-dash": ("Central Authority","Central Authority — Dashboard","5986:62103",ADM+"/central-authority/dashboard",f"{FROLE}/CA/dash.png",f"{LV}/CENTRAL-AUTHORITY-CENTRAL-AUTHORITY-DASHBOARD.png"),
 "ca-fund": ("Central Authority","Central Authority — Fund Allocation","5986:62832",ADM+"/central-authority/fund-allocation",f"{FROLE}/CA/fund.png",f"{LV}/CENTRAL-AUTHORITY-CENTRAL-AUTHORITY-FUND-ALLOCATION.png"),
 "ca-statecomp":("Central Authority","Central Authority — State Comparison","5986:62275",ADM+"/central-authority/state-comparison",f"{FROLE}/CA/statecomp.png",f"{LV}/CENTRAL-AUTHORITY-CENTRAL-AUTHORITY-STATE-COMPARISON.png"),
 "ca-scheme":("Central Authority","Central Authority — Scheme Performance","5986:62639",ADM+"/central-authority/scheme-performance",f"{FROLE}/CA/scheme.png",f"{LV}/CENTRAL-AUTHORITY-CENTRAL-AUTHORITY-SCHEME-PERFORMANCE.png"),
 "ca-grievances":("Central Authority","Central Authority — Grievances","5986:53857",ADM+"/central-authority/grievances","captures/figma/roles/DO/cases.png",f"{LV}/CENTRAL-AUTHORITY-CENTRAL-AUTHORITY-GRIEVANCES.png"),
 "ca-reports":("Central Authority","Central Authority — Reports & Export","5986:63083",ADM+"/central-authority/reports",f"{FROLE}/CA/reports.png",f"{LV}/CENTRAL-AUTHORITY-CENTRAL-AUTHORITY-REPORTS.png"),
 "ca-ntf":  ("Central Authority","Central Authority — Notifications","5986:63178",ADM+"/central-authority/notifications",f"{FROLE}/CA/ntf.png",f"{LV}/CENTRAL-AUTHORITY-CENTRAL-AUTHORITY-NOTIFICATIONS.png"),
 # --- SHO (shares the District Officer shell + design frames) ---
 "sho-dash":("SHO","SHO — Dashboard","5986:53726",ADM+"/district-officer/dashboard",f"{FROLE}/DO/dash.png",f"{LV}/SHO-DISTRICT-OFFICER-DASHBOARD.png"),
 "sho-cases":("SHO","SHO — My Cases","5986:53857",ADM+"/district-officer/cases",f"{FROLE}/DO/cases.png",f"{LV}/SHO-DISTRICT-OFFICER-CASES.png"),
 "sho-clar":("SHO","SHO — Clarifications","5986:55757",ADM+"/district-officer/clarifications",f"{FROLE}/DO/clar.png",f"{LV}/SHO-DISTRICT-OFFICER-CLARIFICATIONS.png"),
 "sho-inv": ("SHO","SHO — Investigation Queue","5986:55831",ADM+"/district-officer/investigation",f"{FROLE}/DO/inv.png",f"{LV}/SHO-DISTRICT-OFFICER-INVESTIGATION.png"),
 "sho-rep": ("SHO","SHO — My Reports","5986:55911",ADM+"/district-officer/reports",f"{FROLE}/DO/rep.png",f"{LV}/SHO-DISTRICT-OFFICER-REPORTS.png"),
 "sho-sla": ("SHO","SHO — SLA Monitor","5986:56034",ADM+"/district-officer/sla",f"{FROLE}/DO/sla.png",f"{LV}/SHO-DISTRICT-OFFICER-SLA.png"),
 "sho-ntf": ("SHO","SHO — Notifications","5986:56171",ADM+"/district-officer/notifications",f"{FROLE}/DO/ntf.png",f"{LV}/SHO-DISTRICT-OFFICER-NOTIFICATIONS.png"),
 # --- Call Centre Agent (undesigned — no Figma frames) ---
 # Call-Centre screens: reviewer assigned REFERENCE design frames (citizen/DO frames reused as the
 # visual-language reference — marked _refFrame in the report so the mapping gate treats them as style refs).
 "cc-dash": ("Call Centre","Call Centre — Dashboard","5986:51876",ADM+"/call-center/dashboard","captures/figma/CIT-HOME-fresh.png",f"{LV}/CALL-CENTER-CALL-CENTER-DASHBOARD.png"),
 "cc-caller":("Call Centre","Call Centre — Caller","5986:53203",ADM+"/call-center/caller","captures/figma/CIT-TRK-DEFAULT-design.png",f"{LV}/CALL-CENTER-CALL-CENTER-CALLER.png"),
 "cc-rg":   ("Call Centre","Call Centre — Register Grievance","5986:51959",ADM+"/call-center/register-grievance","captures/figma/CIT-RG1-fresh.png",f"{LV}/CALL-CENTER-CALL-CENTER-REGISTER-GRIEVANCE.png"),
 "cc-query":("Call Centre","Call Centre — Query",None,ADM+"/call-center/query",None,f"{LV}/CALL-CENTER-CALL-CENTER-QUERY.png"),
 "cc-queries":("Call Centre","Call Centre — Queries",None,ADM+"/call-center/queries",None,f"{LV}/CALL-CENTER-CALL-CENTER-QUERIES.png"),
 "cc-directory":("Call Centre","Call Centre — Directory",None,ADM+"/call-center/directory",None,f"{LV}/CALL-CENTER-CALL-CENTER-DIRECTORY.png"),
 "cc-track":("Call Centre","Call Centre — Track",None,ADM+"/call-center/track",None,f"{LV}/CALL-CENTER-CALL-CENTER-TRACK.png"),
 "cc-faq":  ("Call Centre","Call Centre — FAQ","5986:53669",ADM+"/call-center/faq","captures/figma/CIT-FAQS-fresh.png",f"{LV}/CALL-CENTER-CALL-CENTER-FAQ.png"),
 # --- Detail Views & Modals (full-depth) ---
 "do-overview":("Detail Views & Modals","District Officer — Case Detail · Overview","5986:54121",ADM+"/district-officer/cases",f"{FROLE}/DETAIL/do-overview.png",f"{DT}/DO-DETAIL-OVERVIEW.png"),
 "do-documents":("Detail Views & Modals","District Officer — Case Detail · Documents","5986:54232",ADM+"/district-officer/cases",f"{FROLE}/DETAIL/do-documents.png",f"{DT}/DO-DETAIL-DOCUMENTS.png"),
 "do-investigation":("Detail Views & Modals","District Officer — Case Detail · Investigation","5986:54340",ADM+"/district-officer/cases",f"{FROLE}/DETAIL/do-investigation.png",f"{DT}/DO-DETAIL-INVESTIGATION.png"),
 "do-auditlog":("Detail Views & Modals","District Officer — Case Detail · Audit Log","5986:54704",ADM+"/district-officer/cases",f"{FROLE}/DETAIL/do-auditlog.png",f"{DT}/DO-DETAIL-AUDIT-LOG.png"),
 "do-clarmodal":("Detail Views & Modals","District Officer — Request Clarification (modal)","5986:54812",ADM+"/district-officer/cases",f"{FROLE}/DETAIL/do-clarmodal.png",f"{DT}/DO-MODAL-CLARIFICATION.png"),
 "fo-sanction":("Detail Views & Modals","Finance Officer — Sanction Order Review","5986:58351",ADM+"/finance-officer/queue",f"{FROLE}/DETAIL/fo-sanction.png",f"{DT}/FO-DETAIL-SANCTION-REVIEW.png"),
 "sys-createuser":("Detail Views & Modals","System Admin — Create New User (modal)","5986:61792",ADM+"/admin/users",f"{FROLE}/DETAIL/sys-createuser.png",f"{DT}/SYS-MODAL-CREATE-USER.png"),
 # --- System Admin designed screens (moved out of the hand-authored list — sheet-driven findings) ---
 "sys-rol":("System Admin","System Admin — Role Management","5986:60823",ADM+"/admin/roles","captures/figma/SYSTEM-ADMIN-ADMIN-ROLES.png",f"{LV}/SYSTEM-ADMIN-ADMIN-ROLES.png"),
 "sys-rep":("System Admin","System Admin — Reports & Export","5986:60711",ADM+"/admin/reports","captures/figma/SYSTEM-ADMIN-ADMIN-REPORTS.png",f"{LV}/SYSTEM-ADMIN-ADMIN-REPORTS.png"),
 "sys-ntf":("System Admin","System Admin — Notifications","5986:61146",ADM+"/admin/notifications","captures/figma/SYSTEM-ADMIN-ADMIN-NOTIFICATIONS.png",f"{LV}/SYSTEM-ADMIN-ADMIN-NOTIFICATIONS.png"),
 "sysu-dash":("System Admin","System Admin — Dashboard","5986:59234",ADM+"/admin/dashboard",f"{FROLE}/SYS/dash.png",f"{LV}/SYSTEM-ADMIN-ADMIN-DASHBOARD.png"),
 "sysu-sla": ("System Admin","System Admin — SLA Monitor","5986:59826",ADM+"/admin/sla-monitor",f"{FROLE}/SYS/sla.png",f"{LV}/SYSTEM-ADMIN-ADMIN-SLA-MONITOR.png"),
 "sysu-perf":("System Admin","System Admin — Officer Performance","5986:60012",ADM+"/admin/officer-performance",f"{FROLE}/SYS/perf.png",f"{LV}/SYSTEM-ADMIN-ADMIN-OFFICER-PERFORMANCE.png"),
 "sysu-anl": ("System Admin","System Admin — Grievance Analytics","5986:60319",ADM+"/admin/analytics",f"{FROLE}/SYS/anl.png",f"{LV}/SYSTEM-ADMIN-ADMIN-ANALYTICS.png"),
 "sysu-geo": ("System Admin","System Admin — Geographic View","5986:60490",ADM+"/admin/geographic",f"{FROLE}/SYS/geo.png",f"{LV}/SYSTEM-ADMIN-ADMIN-GEOGRAPHIC.png"),
 "sysu-cat": ("System Admin","System Admin — Grievance Categories",None,ADM+"/admin/categories",None,f"{LV}/SYSTEM-ADMIN-ADMIN-CATEGORIES.png"),
 "sysu-fb":  ("System Admin","System Admin — Portal Feedback",None,ADM+"/admin/feedbacks",None,f"{LV}/SYSTEM-ADMIN-ADMIN-PORTAL-FEEDBACK.png"),
}

# reviewer's issues text, verbatim from the Figma sheet (one screen per key)
ISSUES = {
 "res2": "Use the already established visual pattern.",
 "res3": "The layout and colours in the OTP modal must match the design. Use the correct primary colour from the design instead of anything random. Refer to Figma.",
 "res4": "The mobile-verified state should match the already established visual language.",
 "res5": "Feedback already given above — the same applies to all similar screens.",
 "trk2": "Page title must follow the already established visual language.\nUse the appropriate primary colour from the design.\nRounded corner of the card must match the design visually.",
 "auth-login": "The left hero panel is a flat navy fill — the design shows a background photograph (justice / court imagery) behind the SAMAVESH lockup.\nThe logo of SAMAVESH is blurred, use a Hi-Res image / SVG.\nThe margin & padding of the header and content area must be uniform all across.\nPrimary button state differs — the design uses a disabled button until the form is valid; the build shows an active button.\nPlacement of 'Forgot password' must be in line with the label.\nThe tone of copy should be kept uniform — make it 'Log in' instead of 'Sign in'.",
 "auth-choose": "The UI of the portal-picker must match the Figma design.\nThe current portal (NHAA) isn't marked as selected — the design shows a green check on the active portal.",
 "do-dash": "Text styles of the KPI cards must match the design.\nSection-card header text style must match the design.\nPriority-action status chips don't match the design's chip styles.\nThe extra dot on the priority-action item isn't required.",
 "do-cases": "Page header must match the visual language already built.\nSLA and Status pills don't fully match the design's status-token colours.\n'URGENT' / 'ESCALATED' badges should sit in the Status column with the ID, per the design.\nTable header + row typography/spacing should match the design's list style.\nPagination style must match the design (and isn't needed for a single page).",
 "do-clar": "Page header must match the design.\nList-item style couldn't be verified as there's no data on dev — review once data exists.",
 "do-inv": "Recurring admin patterns apply.\nInvestigation-queue list, status chips, table header and action-button styling should match the design.",
 "do-rep": "Recurring admin patterns apply.\nReport cards, filter/generate controls and the export button should match the design's spacing and tokens.",
 "do-sla": "Recurring admin patterns apply.\nSLA charts/gauges should use the design's status-token palette (not ad-hoc hues); KPI figures should sit on the type scale.",
 "do-ntf": "Recurring admin patterns apply.\nNotification list-item padding, read/unread styling and icons should match the design.",
 "sa-dash": "The accessibility toolbar is reduced to a glyph + floating widget — the design keeps the full toolset inline in the gov-bar.\nKPI cards ('SLA Compliance Rate', 'Sent Back') lose their accent/status styling.\nDecision-Trend and Case-Status charts use ad-hoc/muted colours instead of the design's status tokens.\nPriority-Pending status chips (SLA Breached / days-left) don't match the design.\nSidebar count badges shown in the design are missing/partial.",
 "sa-pending": "Pagination is Prev / Next — the design uses numbered pages + a rows-per-page selector.\nFilter tabs (All / Urgent / New) + SLA pills should match the design's chip/token styles.\nTable header + row typography/spacing should match the design's list style.\n'Review' action-button style should match the design.\nEmpty on dev — no seeded pending cases; audit structure + empty state.",
 "sa-approved": "Recurring admin patterns apply (muted tokens, missing sidebar count badges, Prev/Next pagination, accessibility bar reduced to a floating widget).\nApproved-case list + status/badge styling and the case-detail link should match the design.",
 "sa-sentback": "Recurring admin patterns apply.\nSent-back list + reason/return styling and status chips should match the design.",
 "sa-allcases": "Ensure the list, filters, status chips, pagination and table styling match the other SA list views + design tokens.",
 "sa-reports": "Recurring admin patterns apply.\nReport cards, filters and the export button should match the design's spacing + tokens.",
 "sa-sla": "Recurring admin patterns apply.\nSLA charts should use the design's status-token palette; KPI figures should sit on the type scale.",
 "sa-ntf": "Recurring admin patterns apply.\nNotification list-item padding, read/unread styling and icons should match the design.",
 "fo-dash": "The accessibility toolbar is reduced to a glyph + floating widget — the design keeps the full toolset inline in the gov-bar.\nKPI / summary cards and their status accents should match the design's tokens.\nCharts should use the design's status-token palette; KPI figures on the type scale.\nSidebar count badges shown in the design are missing/partial.",
 "fo-queue": "Status pills (Ready / On Hold) should match the design's status-token colours; the 'Why On Hold?' action styling should match.\nFilter tabs (All / Ready / On Hold) with counts + numbered pagination + rows-per-page selector per the design.\nSanction-Amount column formatting + table header/row typography should match the design.\n'Process' action-button style should match the design.",
 "fo-transactions": "Recurring admin patterns apply (muted tokens, missing sidebar count badges, Prev/Next pagination, accessibility bar reduced to a floating widget).\nTransaction-log list, status/amount styling and table header should match the design.",
 "fo-utilisation": "Recurring admin patterns apply.\nFund-utilisation charts should use the design's status-token palette (not ad-hoc hues); KPI figures on the type scale; card spacing per the design.",
 "fo-ntf": "Recurring admin patterns apply.\nNotification list-item padding, read/unread styling and icons should match the design.",
 "ca-dash": "The accessibility toolbar is reduced to a glyph + floating widget — the design keeps it inline in the gov-bar.\nDashboard charts (Monthly Submission Trend, Top-5 States) should use the design's chart palette (the design highlights the peak bar in the primary navy).\nKPI figures + progress meters should sit on the design's type scale and status tokens.\nSidebar count badges shown in the design are missing/partial.",
 "ca-fund": "Recurring admin patterns apply (a11y bar as a floating widget, muted tokens, missing count badges).\nFund-allocation KPI cards, the disbursement donut and the state-wise table/status chips should match the design's status-token palette and spacing.",
 "ca-statecomp": "Recurring admin patterns apply.\nState-comparison charts/tables should use the design's status-token palette (not ad-hoc hues); axis + legend typography per the design.",
 "ca-scheme": "Recurring admin patterns apply.\nScheme-performance charts + KPI cards should use the design's status-token palette; KPI figures on the type scale.",
 "ca-grievances": "Match the Central-Authority grievances list to the referenced My-Cases design frame — list rows, filters, status chips, pagination and table should follow the DS tokens.",
 "ca-reports": "Recurring admin patterns apply.\nGenerate-Report form, Recent-Reports list and Quick-Export cards should match the design's card spacing, tokens and control styling.",
 "ca-ntf": "Recurring admin patterns apply.\nNotification list-item padding, read/unread styling and icons should match the design.",
 "sho-dash": "SHO uses the District Officer admin shell + design frames — the same recurring patterns apply: accessibility toolbar reduced to a glyph + floating widget; the Case-Status chart uses a muted palette instead of the design's status tokens; sidebar count badges partial.\nSHO here shows live data incl. SLA-breach counts — audit style/tokens, not the data.",
 "sho-cases": "Shares the DO shell + design (see District Officer › My Cases). Status/SLA pills, table header and pagination should match the design.\nVerify any SHO-specific case actions/permissions vs the DO frame.",
 "sho-clar": "Shares the DO shell + design — recurring admin patterns apply (see District Officer › Clarifications).",
 "sho-inv": "Shares the DO shell + design — recurring admin patterns apply (see District Officer › Investigation).",
 "sho-rep": "Shares the DO shell + design — recurring admin patterns apply (see District Officer › My Reports).",
 "sho-sla": "Shares the DO shell + design — recurring admin patterns apply; SLA charts should use the design's status-token palette.",
 "sho-ntf": "Shares the DO shell + design — notification list-item padding, read/unread styling and icons should match the design.",
 "cc-dash": "Match the Call-Centre dashboard to the referenced design frame — card and chart styling should follow the DS tokens (portal-wide token/masthead items are covered in the Global Findings).",
 "cc-caller": "Call-intake screen: form fields, layout and controls should follow the admin design tokens + spacing.",
 "cc-rg": "Mirrors the citizen Register-Grievance flow — reuse the citizen grievance design's step layout, field and OTP styling within the admin shell.",
 "cc-query": "Query detail: layout, labels and controls should follow the admin design tokens.",
 "cc-queries": "Queries list: table header, status chips, pagination and row styling should match the other admin list views + tokens.",
 "cc-directory": "Directory/contacts list: table, search and pagination styling should follow the admin design language.",
 "cc-track": "Mirrors the citizen Track-Status flow — reuse the citizen track design's result/timeline styling within the admin shell.",
 "cc-faq": "Mirrors the citizen Help & FAQs — reuse the citizen FAQ accordion styling; ensure the whole question row is the toggle target.",
 "do-overview": "Case-detail Overview: recurring admin patterns apply (a11y bar as a floating widget, muted tokens).\nVerify the detail header, tab bar, Case-Timeline sidebar and SLA-tracker styling match the design's tokens + spacing.",
 "do-documents": "Documents tab (empty on this case): verify the empty-state, upload control and document-row styling match the design.",
 "do-investigation": "Investigation tab: verify section layout, evidence/notes styling and status chips match the design's tokens.",
 "do-auditlog": "Audit Log tab: verify the timeline/log-row styling, icons and timestamps match the design.",
 "do-clarmodal": "'Request Clarification from Citizen' modal: verify field styling, the deadline/notification-method controls and the primary-button style match the design.",
 "fo-sanction": "Sanction Order Review (step 1 of the disbursement flow): verify the stepper, sanction-details form, beneficiary-bank block and the primary-button style match the design's tokens + spacing.",
 "sys-createuser": "'Create New User' modal: verify the field grid, role/state/district selects and the primary-button style match the design. The User-Management list uses numbered pagination here — matches the design.",
 "sys-rol": "Page header style must match the design.\nThe least-privilege-principle message is information, not a warning — use the info colour palette from the DS.\nThe permissions table, Summary and Changes cards must all follow the visual language from Figma.\nThe icons must match the Figma design.\nWhy can the System Admin not update the permissions — who will have this access?",
 "sys-rep": "Card header must follow the design in terms of text colour and spacing.\nA full-width block button is not required for Generate and Export — keep it hug-content.\nThe icons for the Quick-Export options must match the design.\nRecent reports is a good-to-have section for easy access to the last reports.",
 "sys-ntf": "The page header style must match the design.\nIn the empty state the disabled 'Mark all read' button isn't needed — it can appear (disabled) only when there are items and all are read.\nCouldn't review the notification list-item design as there's no data — review once we have it.",
 "sysu-dash": "Page header style should match the design (text style, colour, spacing). The default state of the States filter looks off due to extra space between the label and the arrow icon.\nThe KPI-card text styles must match the design.\nThe card headers must match the design.\nThere must be a divider between the chart and its legend.\nFor cards like the activity feed with a long scroll, add a 'View all' link to the next-level page.\nCard heights in a row should be uniform; width can flex to the content.\nThe Monthly-Submission-Trend bar graph overflows outside its container — adjust the card width to fit the chart (horizontal scroll if very wide) and let the chart use the card height properly.",
 "sysu-sla": "Export button style should match the design.\nKPI-card text styles must match the design.\nSection-card header text must match the design.\nThe width of the Breached-Cases card must be adjusted to fit the table properly.\nText styles and badge styles in the table must match the design.\nTables with more than 10–15 rows must paginate for easy access instead of a long scroll.",
 "sysu-perf": "Page header, text style, spacing, filters and buttons must follow the design.\nSection headers must follow the design language set in Figma.\nElements in the table must follow the visual language set in Figma.",
 "sysu-anl": "Page header, text style, spacing, filters and buttons must follow the design.\nChart spacing should match the design.\nDonut-chart segments need a gap between them so that even with close colour tones the data stays readable.",
 "sysu-geo": "Page header, section-card headers and table elements should follow the established visual language.\nThe map / chart colours must match the design tokens.",
 "sysu-cat": "Page header should follow the established design language (applies to all such screens).\nSearch and table design should follow the established design language (applies to all such screens).",
 "sysu-fb": "Page header should follow the established design language.\nThe icon in the page header isn't required.\nSearch and table design should follow the established design language.",
}

# report order for the new-role screens (Login folds in right after Citizen; the rest after System Admin)
CITIZEN_EXTRA_ORDER = ["res2","res3","res4","res5","trk2"]   # undesigned rescue/track build sub-states
LOGIN_ORDER = ["auth-login","auth-choose"]
NEWROLE_ORDER = [
 "do-dash","do-cases","do-clar","do-inv","do-rep","do-sla","do-ntf",
 "sa-dash","sa-pending","sa-approved","sa-sentback","sa-allcases","sa-reports","sa-sla","sa-ntf",
 "fo-dash","fo-queue","fo-transactions","fo-utilisation","fo-ntf",
 "ca-dash","ca-fund","ca-statecomp","ca-scheme","ca-grievances","ca-reports","ca-ntf",
 "sho-dash","sho-cases","sho-clar","sho-inv","sho-rep","sho-sla","sho-ntf",
 "cc-dash","cc-caller","cc-rg","cc-query","cc-queries","cc-directory","cc-track","cc-faq",
 "do-overview","do-documents","do-investigation","do-auditlog","do-clarmodal","fo-sanction","sys-createuser",
]
# System-Admin designed screens (sheet-driven), folded in after the pinned grv/usr
SYSADMIN_DESIGNED_ORDER = ["sys-rol","sys-rep","sys-ntf","sysu-dash","sysu-sla","sysu-perf","sysu-anl","sysu-geo"]
# System-Admin screens still without a Figma frame
SYSU_ORDER = ["sysu-cat","sysu-fb"]
