#!/usr/bin/env python3
"""TG — build the FINAL clean Design-QC PDF (NHAPOA format) from authored findings.

Single source of truth = the SCREENS / LOGIN / PARITY / GLOBAL tables below (synced from
FINDINGS.md + the login boards). Assembles audit-master.json and renders the fixed-style
report via the docs-side generate_pdf.py into docs/qc/portals/tg/. Pinned screens use
qc_geometry.finalize (percent anchors); the GLOBAL page and parity screens set boxes explicitly.

Run: python3 build_final_report.py
"""
import json, os, sys, subprocess
ENG = os.path.dirname(os.path.abspath(__file__)); TOOL = os.path.dirname(os.path.dirname(ENG))
sys.path.insert(0, os.path.join(TOOL, "engine"))
import qc_geometry as G
PROJ = ENG; OUT = os.path.join(PROJ, "out"); CAP = os.path.join(PROJ, "captures")
DEST = "/Users/akashk/Documents/Projects/MoSJE/docs/qc/portals/tg"
FURL = "https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id={n}"
ADM = "https://tg-admin-dev.mosje.in"; CIT = "https://tg-user-dev.mosje.in"
def furl(n): return FURL.format(n=n.replace(":", "-")) if n else None
def ap(rel): return os.path.join(PROJ, rel) if rel else None

# ---- per-screen findings: [sev, axis, title, design-intent, live-build, fix, xpct, ypct] ----
SCREENS = [
 {"slug": "CAD", "role": "Central Admin", "name": "Dashboard", "node": "2494:38830",
  "figma": "captures/figma/design-ADMIN-DASH.png", "live": "captures/live/CENTRAL-ADMIN-DASHBOARD.png",
  "route": ADM + "/dashboard", "f": [
   ["Nit", "Layout & Spacing", "Global filter bar sits above the KPI cards",
    "The design keeps the State / District / Date-range filters inside the Application Queue card.",
    "The build floats a global filter bar ABOVE the KPI cards; it is a richer analytics dashboard (6 KPIs + State/District charts) vs the design's 4-KPI exception queue.",
    "Confirm the analytics layout is intended — the extra KPIs/charts are build-only (audit vs the visual language, don't remove).", 50, 15],
   ["Minor", "Color & Token", "Confirm analytics chart palette uses TG tokens",
    "Charts should use TG tokens — Primary/Source #003366 for bars, Success/Source #2e7d32 for the approval-rate series.",
    "Chart series may use raw greens/blues rather than the TG token palette.",
    "Verify the chart palette against the TG tokens; the charts are a build-only section audited vs the visual language.", 40, 62]]},
 {"slug": "DMD", "role": "District Magistrate", "name": "Dashboard", "node": "2494:42053",
  "figma": "captures/figma/design-DM-DASH.png", "live": "captures/live/DISTRICT-MAGISTRATE-DASHBOARD.png",
  "route": ADM + "/dashboard", "f": [
   ["Nit", "Components & States", "Extra 'Current Stage' column + View action",
    "The design DM queue columns are Applicant ID, Name, District, Due in, Status.",
    "The build queue adds a 'Current Stage' column and a View action not in the design table.",
    "Confirm if intended — the build has an extra column; do not remove without design sign-off.", 82, 55]]},
 {"slug": "EOD", "role": "Examining Officer (Maker)", "name": "Dashboard", "node": "2494:41744",
  "figma": "captures/figma/design-MAKER-DASH.png", "live": "captures/live/EXAMINING-OFFICER-DASHBOARD.png",
  "route": ADM + "/dashboard", "f": [
   ["Minor", "Components & States", "'Classification' column dropped",
    "The design Maker queue has a Classification column (Clean / Exception badges) flagging exception applications.",
    "The build omits the Classification column, so triage exceptions aren't visible in the list.",
    "Show the Classification column per the design (low priority — the build shows fewer columns than the design).", 62, 55],
   ["Minor", "Components & States", "Queue filters missing",
    "The design queue header carries All Classifications / All Types / All Status filter dropdowns.",
    "The build has only a search box + a State/District toggle.",
    "Surface the relevant queue filters per the design.", 40, 30]]},
 {"slug": "AD", "role": "Admin", "name": "Application Detail", "node": "2494:38975",
  "figma": "captures/figma/design-APP-DETAIL.png", "live": "captures/live/CENTRAL-ADMIN-APPLICATION-DETAIL.png",
  "route": ADM + "/applications", "f": [
   ["Minor", "Layout & Spacing", "Persistent expanded admin sidebar narrows the content",
    "The design detail page is full-width (sidebar collapsed to a hamburger); the examining-officer / DM detail pages have no sidebar (match the design).",
    "The central-admin detail page keeps the admin sidebar expanded, narrowing the content column.",
    "Confirm the central-admin sidebar on detail views is intended; otherwise collapse it to match the design.", 10, 42],
   ["Nit", "Components & States", "Detail tab set differs (2 design / 4 build)",
    "The design detail has 2 tabs: Applicant Details, Documents.",
    "The build has 4 tabs — it adds Revised Certificate and ID Card.",
    "Build-extra — confirm if intended.", 45, 22]]},
]

LOGIN = [
 {"slug": "CIT-SIGNIN", "role": "Citizen", "name": "Sign In", "node": "9379:115794",
  "figma": "captures/figma/design-CITIZEN-LOGIN.png", "live": "captures/live/CITIZEN-LOGIN.png",
  "route": CIT + "/auth/sign-in", "f": [
   ["Major", "Components & States", "Role-tab switcher removed",
    "The login card leads with a three-way role switcher — Citizen · Admin · Garima Greh — with Citizen active.",
    "The citizen build renders no role tabs; the card opens straight into the 'Log In to your account' heading.",
    "Restore the Citizen / Admin / Garima Greh role-tab switcher at the top of the login card, per the design frame.", 80, 24],
   ["Major", "Components & States", "Extra Mobile Number field",
    "The design offers a single Email field under 'or sign in with credentials', then a Send OTP button.",
    "The build inserts a second 'Mobile Number' field (with its own 'or' divider) below the Email Id field — absent from the design.",
    "Align to the design's single-field pattern, or update the design frame if the Mobile Number entry is a deliberate addition.", 80, 58],
   ["Minor", "Typography", "Heading casing ('Log In' vs 'Log in')",
    "The heading reads 'Log in to your account' (sentence case).",
    "The build renders 'Log In to your account' — 'In' is capitalised.",
    "Match the design's sentence-case heading: 'Log in to your account'.", 72, 24]]},
 {"slug": "ADM-SIGNIN", "role": "Admin", "name": "Log In", "node": "9387:138143",
  "figma": "captures/figma/design-ADMIN-LOGIN.png", "live": "captures/live/ADMIN-LOGIN.png",
  "route": ADM + "/login", "f": [
   ["Major", "Components & States", "Extra Mobile Number field",
    "The design offers a single Email field, then a Send OTP button.",
    "The build adds a second 'Mobile Number' field (with an 'or' divider) below Email — absent from the design.",
    "Align to the design's single Email-field pattern, or update the design frame if Mobile Number entry is a deliberate addition.", 80, 52],
   ["Minor", "Typography", "Heading casing",
    "The heading reads 'Log in to your account' (sentence case).",
    "The build renders 'Log In to your account' — 'In' is capitalised.",
    "Match the design's sentence-case heading: 'Log in to your account'.", 72, 29]]},
]

# parity/reference screens — verified faithful (no fidelity defects); rendered as a ✓ faithful board
PARITY = [
 {"slug": "PORTAL-PICKER", "role": "All roles", "name": "Portal Picker (Change)", "node": "8103:39372",
  "figma": "captures/figma/design-LOGIN-PORTAL-PICKER.png", "live": "captures/live/CITIZEN-LOGIN-CHANGE.png",
  "route": CIT + "/auth/sign-in",
  "note": "The '⇄ Change' button in the login footer opens this portal chooser. Verified faithful to the design (same 'Choose a portal to login' list + layout)."}]

# ---- coverage boards: every remaining captured screen, shown DESIGN │ BUILD. Portal-wide Global
#      findings apply; screen-specific pins are added as the per-screen review deepens. ----
# (slug, role, name, node, figrel, liverel, route)
COVERAGE = [
 ("CIT-PREAPP", "Citizen", "Apply · Pre-application", "3531:36958", "captures/figma/dframe-citizen-apply-preapp.png", "captures/live/CITIZEN-MH-DASHBOARD-PREAPP.png", CIT + "/dashboard"),
 ("CIT-APPLY-IDENTITY", "Citizen", "Apply · Step 1 · Identity", "3531:35553", "captures/figma/dframe-citizen-apply-identity.png", "captures/live/CITIZEN-CH-APPLY-IDENTITY-FILLED.png", CIT + "/apply"),
 ("CIT-APPLY-DOCS", "Citizen", "Apply · Step 2 · Documents", "3531:35457", "captures/figma/dframe-citizen-apply-documents-filled.png", "captures/live/CITIZEN-CH-APPLY-DOCUMENTS-FILLED.png", CIT + "/apply"),
 ("CIT-APPLY-REVIEW", "Citizen", "Apply · Step 3 · Review", "3531:35334", "captures/figma/dframe-citizen-apply-review.png", "captures/live/CITIZEN-CH-APPLY-REVIEW.png", CIT + "/apply"),
 ("CIT-APPLY-CONFIRM", "Citizen", "Apply · Confirmation", "3531:35271", "captures/figma/dframe-citizen-apply-confirmation.png", "captures/live/CITIZEN-CH-APPLY-CONFIRMATION.png", CIT + "/apply"),
 ("CIT-DASH", "Citizen", "Dashboard · Certificate Active", "3531:36919", "captures/figma/dframe-citizen-dashboard-approved.png", "captures/live/CITIZEN-DASHBOARD.png", CIT + "/dashboard"),
 ("CIT-CERT-DETAIL", "Citizen", "Certificate · Detail", "3531:36666", "captures/figma/dframe-citizen-certificate-detail.png", "captures/live/CITIZEN-CERTIFICATE-DETAIL.png", CIT + "/certificate"),
 ("CIT-CERT-ID", "Citizen", "Certificate · ID Card", "3531:36841", "captures/figma/dframe-citizen-certificate-id.png", "captures/live/CITIZEN-CERTIFICATE-ID.png", CIT + "/certificate"),
 ("CIT-TRACK", "Citizen", "Track Status", "3531:36747", "captures/figma/dframe-citizen-approved-track.png", "captures/live/CITIZEN-CH-TRACK-APPROVED.png", CIT + "/track-status"),
 ("EO-DETAIL", "Examining Officer (Maker)", "Application Detail", "2494:38975", "captures/figma/design-APP-DETAIL.png", "captures/live/EXAMINING-OFFICER-APPLICATION-DETAIL.png", ADM + "/applications"),
 ("EO-DOCS", "Examining Officer (Maker)", "Application Documents", "2494:39123", "captures/figma/design-APP-DETAIL-DOCS.png", "captures/live/EXAMINING-OFFICER-APPLICATION-DOCUMENTS.png", ADM + "/applications"),
 ("DM-DETAIL", "District Magistrate", "Application Detail · Actionable", "2494:38975", "captures/figma/design-APP-DETAIL.png", "captures/live/DISTRICT-MAGISTRATE-APPLICATION-DETAIL-ACTIONABLE.png", ADM + "/applications"),
 ("DM-DOCS", "District Magistrate", "Application Documents", "2494:39123", "captures/figma/design-APP-DETAIL-DOCS.png", "captures/live/DISTRICT-MAGISTRATE-APPLICATION-DOCUMENTS.png", ADM + "/applications"),
 ("DM-MODAL-APPROVE", "District Magistrate", "Approve modal", "2494:39988", "captures/figma/design-APPROVE-MODAL.png", "captures/live/DISTRICT-MAGISTRATE-MODAL-APPROVE.png", ADM + "/applications"),
 ("DM-MODAL-CORRECTION", "District Magistrate", "Request-Correction modal", "2494:39801", "captures/figma/design-CORRECTION-MODAL.png", "captures/live/DISTRICT-MAGISTRATE-MODAL-CORRECTION.png", ADM + "/applications"),
 ("CA-DOCS", "Central Admin", "Application Documents", "2494:39123", "captures/figma/design-APP-DETAIL-DOCS.png", "captures/live/CENTRAL-ADMIN-APPLICATION-DOCUMENTS.png", ADM + "/applications"),
]
# build-only screens — no design frame in the audited section
# (slug, role, name, liverel, route)
BUILDONLY = [
 ("DM-MODAL-REJECT", "District Magistrate", "Reject modal (build-extra)", "captures/live/DISTRICT-MAGISTRATE-MODAL-REJECT.png", ADM + "/applications"),
 ("CA-USERS", "Central Admin", "User Management", "captures/live/CENTRAL-ADMIN-USER-MANAGEMENT.png", ADM + "/users"),
 ("CA-ROLES", "Central Admin", "Role Management", "captures/live/CENTRAL-ADMIN-ROLE-MANAGEMENT.png", ADM + "/roles"),
 ("CA-TENANTS", "Central Admin", "Tenants", "captures/live/CENTRAL-ADMIN-TENANTS.png", ADM + "/tenants"),
 ("CA-PWPOLICY", "Central Admin", "Password Policy", "captures/live/CENTRAL-ADMIN-PASSWORD-POLICY.png", ADM + "/password-policy"),
 ("CIT-GRIEVANCES", "Citizen", "Grievances", "captures/live/CITIZEN-GRIEVANCES.png", CIT + "/grievances"),
]
COVNOTE = ("Portal-wide Global findings apply to this screen (masthead co-branding, KPI cards, tables, pagination "
           "— see the Global section). Design │ build shown for review; open the Figma frame ↗ for the intended design.")
BONOTE = ("No design frame in the audited section — audited against the design-system visual language; the "
          "portal-wide Global findings apply.")
def cov_screen(t):
    slug, role, name, node, figrel, liverel, route = t
    return {"slug": slug, "name": role + " — " + name, "env": "dev", "figmaImg": ap(figrel), "liveImg": ap(liverel),
            "figmaUrl": furl(node), "liveUrl": route, "findings": [], "_role": role, "_node": node,
            "_refbadge": "coverage", "_refsub": "design │ build", "_refchip": "#1558B0", "note": COVNOTE}
def bo_screen(t):
    slug, role, name, liverel, route = t
    return {"slug": slug, "name": role + " — " + name, "env": "dev", "figmaImg": None, "liveImg": ap(liverel),
            "figmaUrl": None, "liveUrl": route, "findings": [], "_role": role,
            "_refbadge": "build-only", "_refsub": "live build", "_refchip": "#6b7280", "note": BONOTE}

# ---- GLOBAL findings (Scope: Global) — representative frame = Central Admin dashboard ----
GREF = ("2494:38830", "captures/figma/design-ADMIN-DASH.png", "captures/live/CENTRAL-ADMIN-DASHBOARD.png",
        ADM + "/dashboard", "Central Admin — Dashboard")
# (gid, sev, axis, title, design-intent, live-build, fix, pinx%, piny%)
GLOBAL = [
 (1, "Major", "Content & Iconography", "Masthead co-branding lockup removed",
  "The masthead right zone carries the SAMAVESH co-branding lockup — the Digital India logo + the SAMAVESH logo — before the user/avatar block.",
  "Both logos are omitted portal-wide; only the user name/role/avatar remain on the right. (Present on the login hero, missing on every authenticated inner page.)",
  "Restore the Digital India + SAMAVESH co-branding lockup in the masthead right zone per the design, on every screen.", 80, 5),
 (2, "Minor", "Content & Iconography", "Masthead identity lockup reduced from 3 lines to 2",
  "'Government of India / Ministry of Social Justice & Empowerment / Department of Social Justice & Empowerment' (Department line in bold navy).",
  "Only 'Government of India / Ministry of Social Justice & Empowerment' — the Department line is dropped and the bold weight moves up a line.",
  "Render the full 3-line identity lockup with the Department line bold, per the design masthead.", 17, 6),
 (3, "Major", "Components & States", "KPI cards lost their metric icon + trend line",
  "Each dashboard KPI card shows a leading metric icon and a delta/trend line ('▲ +14.5% vs last month' or a contextual subtitle).",
  "KPI cards render only a label + number — the icon and trend/subtext are dropped, losing the at-a-glance comparison hierarchy.",
  "Restore the KPI card icon and trend/delta subtitle per the design KPI component. Applies to all role dashboards.", 25, 24),
 (4, "Minor", "Components & States", "Pagination active-page state differs",
  "Active page = outlined (white fill, navy border, navy numeral).",
  "Active page = a navy-filled chip with a white numeral.",
  "Match the pagination active-page control to the design's outlined style. Applies to every paginated table.", 50, 92),
 (5, "Minor", "Color & Token", "Data-table header fill inconsistent across the build",
  "Table headers use a light neutral-gray fill (≈#f9fafb, Stroke/50).",
  "Dashboard queue tables use a near-neutral header, but the User/Role/Tenant management tables use a light blue header tint (≈#dbeafe).",
  "Standardise all data-table headers to the neutral-gray header token; drop the blue tint on the management tables.", 52, 55),
]

# ---- assemble ----
def mk_findings(prefix, flist):
    o = []
    for i, f in enumerate(flist, 1):
        sev, axis, title, dz, lz, fix, xp, yp = f
        o.append({"num": i, "id": f"TG-{prefix}-{i:03d}", "element": title, "section": prefix.lower(),
                  "scope": "Screen", "axis": axis, "severity": sev, "figma": dz, "live": lz, "fix": fix,
                  "_lpct": (xp, yp), "_fpct": (xp, yp)})
    return o

def screen(s):
    return {"slug": s["slug"], "name": s["role"] + " — " + s["name"], "env": "dev",
            "figmaImg": ap(s["figma"]), "liveImg": ap(s["live"]),
            "figmaUrl": furl(s["node"]), "liveUrl": s["route"], "findings": mk_findings(s["slug"], s["f"]),
            "_role": s["role"], "_node": s["node"]}

def parity_screen(s):
    sc = {"slug": s["slug"], "name": s["role"] + " — " + s["name"], "env": "dev",
          "figmaImg": ap(s["figma"]), "liveImg": ap(s["live"]),
          "figmaUrl": furl(s["node"]), "liveUrl": s["route"], "findings": [],
          "_role": s["role"], "_node": s["node"]}
    if s.get("note"): sc["note"] = s["note"]
    return sc

def global_screen():
    node, dpng, bpng, route, rlabel = GREF
    Hd = G.imgdims(dpng, PROJ)[1]; Hb = G.imgdims(bpng, PROJ)[1]
    fnds = []
    for (gid, sev, cat, title, dz, lz, fix, px, py) in GLOBAL:
        fnds.append({"num": gid, "id": f"TG-GLOBAL-{gid:03d}", "element": title, "section": "global",
                     "scope": "Global", "axis": cat, "severity": sev, "figma": dz, "live": lz, "fix": fix,
                     "subO": "Scope: Global — repeats across the portal",
                     "figmaBox": [0, 0, 1440, Hd], "liveBox": [0, 0, 1440, Hb], "sectionBox": [0, 0, 1440, Hb],
                     "figmaPin": {"x": px, "y": py}, "livePin": {"x": px, "y": py}})
    return {"slug": "GLOBAL", "name": "Global · Shared elements (masthead · KPI cards · tables)", "env": "dev",
            "figmaImg": ap(dpng), "liveImg": ap(bpng), "figmaUrl": furl(node), "liveUrl": route,
            "findings": fnds, "_role": "Global", "_node": node, "_refFrame": True,
            "note": f"Scope: Global — these elements repeat across every admin screen; fix once. The board shows a "
                    f"representative frame ({rlabel}) — open it via 'Figma frame ↗'; each marker's number matches its TG-GLOBAL id."}

# pinned screens (admin roles + login) — geometry via qc_geometry.finalize (percent anchors)
admin_scr = [screen(s) for s in SCREENS]
login_scr = [screen(s) for s in LOGIN]
for sc in admin_scr + login_scr:
    G.finalize(sc, eng_dir=CAP, base_dir=PROJ)
G.write_failures(OUT)

# report order: GLOBAL · Login · Citizen journey · Admin roles (each: pinned dash/detail + coverage) · build-only · parity
glob = [global_screen()]
parity_scr = [parity_screen(s) for s in PARITY]
cov = [cov_screen(t) for t in COVERAGE]
bo = [bo_screen(t) for t in BUILDONLY]
def by_role(lst, *names): return [s for s in lst if s["_role"] in names]
def by_slug(lst, *slugs): return [s for s in lst if s["slug"] in slugs]

citizen_journey = by_role(cov, "Citizen")                                   # apply → dashboard → certificate → track
eo = by_role(admin_scr, "Examining Officer (Maker)") + by_role(cov, "Examining Officer (Maker)")
dm = by_role(admin_scr, "District Magistrate") + by_role(cov, "District Magistrate")
ca = by_role(admin_scr, "Central Admin", "Admin") + by_role(cov, "Central Admin")
buildonly_admin = by_slug(bo, "DM-MODAL-REJECT", "CA-USERS", "CA-ROLES", "CA-TENANTS", "CA-PWPOLICY")
buildonly_cit = by_slug(bo, "CIT-GRIEVANCES")

screens = (glob + login_scr + citizen_journey + buildonly_cit
           + eo + dm + ca + buildonly_admin + parity_scr)

master = {"portal": "National Portal for Transgender Persons", "idPrefix": "TG",
          "generated": "2026-07-10",
          "figmaUrl": FURL.format(n="8056-5668"),
          "method": "Design-QC of the TG admin + login screens against the MoSJE Portal Handoff design.",
          "deferred": [
            {"id": "TG-DEBT-01", "title": "Garima Greh login (build) — not captured",
             "reason": "Admin login carries a Garima Greh role tab (design 9379:116062) but no live GG account was provided."},
            {"id": "TG-DEBT-02", "title": "Login states designed-but-not-built",
             "reason": "Registration, credential-recovery, OTP-flow and mobile login states exist in Figma only (no build to compare)."}],
          "screens": screens}
os.makedirs(DEST, exist_ok=True)
json.dump(master, open(os.path.join(OUT, "audit-master-final.json"), "w"), indent=2, ensure_ascii=False)
json.dump(master, open(os.path.join(DEST, "audit-master.json"), "w"), indent=2, ensure_ascii=False)

n = sum(len(s["findings"]) for s in screens)
print(f"screens={len(screens)} findings={n} pin-failures={len(G.FAILURES)}")
r = subprocess.run(["python3", os.path.join(DEST, "generate_pdf.py")], capture_output=True, text=True, timeout=900)
print(r.stdout[-400:])
if r.returncode != 0: print("GEN ERR:", r.stderr[-900:])
