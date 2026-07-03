#!/usr/bin/env python3
"""Author NHAPOA audit-master.json + suggestions.json (corrections round 2).
Design-fidelity findings only; build-extras -> suggestions.json; %-anchored -> qc_geometry.finalize."""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import qc_geometry as G

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENG  = os.path.join(BASE, "captures")
FIG  = "captures/figma"; LIV = "captures/live"
FURL = "https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id="
ADMIN = "https://nhapoa-admin-uat.mosje.in"; USER = "https://nhapoa-user-uat.mosje.in"

def F(num, id_, element, section, axis, sev, figma, live, fix, fpct=None, lpct=None):
    d = {"num":num,"id":id_,"element":element,"section":section,"axis":axis,"severity":sev,
         "figma":figma,"live":live,"fix":fix}
    if fpct: d["_fpct"] = fpct
    if lpct: d["_lpct"] = lpct
    return d

screens = [
  # ---- Screen A: Global shell ----
  {"slug":"GLOBAL-SHELL","name":"Global — Application Shell (gov-bar & masthead, all roles)",
   "figmaUrl":FURL+"5986-53726","liveUrl":ADMIN+"/district-officer/dashboard",
   "figmaImg":f"{FIG}/DO-DASHBOARD.png","liveImg":f"{LIV}/DO-DISTRICT-OFFICER-DASHBOARD.png",
   "note":"These recur on every screen of every role — the shared gov-bar and masthead, audited once.",
   "findings":[
     F(1,"NHA-SHELL-001","Accessibility controls & UX4G widget trigger","header-band","Accessibility","Major",
       "Gov-bar carries the full GIGW accessibility cluster inline — text-size A−/A/A+, contrast toggle, an accessibility icon, and a language selector — and the accessibility icon is the trigger for the UX4G Accessibility Widget.",
       "Build shows only a reduced 'अ/A' glyph in the gov-bar and instead launches the UX4G Accessibility Widget from a separate floating button over the page content.",
       "Surface the full accessibility controls in the gov-bar and include the accessibility icon; trigger the UX4G Accessibility Widget FROM that gov-bar icon rather than from a floating button.",
       fpct=(72,2), lpct=(95,2)),
     F(2,"NHA-SHELL-002","Digital India logo is rendered as text, not the official mark","header-band","Content & Iconography","Minor",
       "Masthead uses the official Digital India logo lockup (correct brand wordmark + swoosh).",
       "Build reproduces the 'Digital India' wordmark as styled HTML text (a serif approximation), so the lockup does not render as the official logo.",
       "Use the official Digital India logo asset (SVG) for the wordmark so it renders correctly, instead of approximating it with a text font.",
       fpct=(66,9), lpct=(62,9)),
     F(3,"NHA-SHELL-003","Redundant dropdown chevron on the profile avatar","header-band","Components & States","Nit",
       "Design profile block is the avatar + name/role, with no separate dropdown chevron.",
       "Build adds a downward chevron beside the avatar. A profile avatar is a conventional, self-evident click target, so the chevron is redundant affordance.",
       "Drop the chevron to match the design (the avatar itself opens the menu), or if a chevron is wanted for affordance, add it to the design so both stay in sync.",
       fpct=(96,9), lpct=(97,9)),
   ]},
  # ---- Screen B: lists & tables (design has data; SHO live has seeded cases) ----
  {"slug":"GLOBAL-TABLE","name":"Global — Lists & Tables (row controls)",
   "figmaUrl":FURL+"5986-53857","liveUrl":ADMIN+"/district-officer/cases",
   "figmaImg":f"{FIG}/DO-CASES.png","liveImg":f"{LIV}/SHO-DISTRICT-OFFICER-CASES.png",
   "note":"Row styling (SLA pills, Status pills, ID links, header surface) conforms to the design — verified on a seeded (SHO / Dhule) table. Only the control radius differs.",
   "findings":[
     F(1,"NHA-TABLE-001","Row-action & pagination buttons use a 6px radius, not the 8px token","table","Components & States","Minor",
       "Corner-radius token is 8px; primary and secondary buttons (Export, Sign In, Send OTP, Start Investigation) correctly render at 8px.",
       "Table row-action buttons (View, Edit, Deactivate, Reassign) and the pagination Prev/Next controls render at 6px instead — an inconsistent radius on the same button family.",
       "Set the row-action and pagination buttons to the 8px radius token (or, if a smaller radius is intended for compact controls, define a documented small-control radius token and apply it consistently).",
       fpct=(91,38), lpct=(93,40)),
   ]},
  # ---- Screen C: filters & inputs ----
  {"slug":"GLOBAL-FILTERS","name":"Global — Filters & Inputs","figmaUrl":FURL+"5986-59480",
   "liveUrl":ADMIN+"/system-administrator/grievance-monitoring",
   "figmaImg":f"{FIG}/SYS-GRIEVANCE-MONITORING.png","liveImg":f"{LIV}/SYS-ADMIN-GRIEVANCES.png","note":None,
   "findings":[
     F(1,"NHA-FILTER-001","Inputs and selects use two different border tokens","toolbar","Color & Token","Nit",
       "Design inputs and selects share one neutral stroke token.",
       "Build renders text inputs (search, username, mobile) with a #d1d5db border but the filter selects with a lighter #e5e7eb border — two tokens for the same control family.",
       "Bind text inputs and filter selects to the single input-stroke token so all field borders match.",
       fpct=(37,22), lpct=(37,26)),
     F(2,"NHA-FILTER-002","Filter toolbar wraps to a second row","toolbar","Layout & Spacing","Nit",
       "Design filter toolbar sits on a single row alongside the search field.",
       "Build's search field is wide, pushing the filter selects onto a second row.",
       "Reduce the search field width so the filter selects fit on the same row as the search, keeping the toolbar to one line.",
       fpct=(37,24), lpct=(40,33)),
   ]},
  # ---- Screen D: Citizen home (design now has 3 cards) ----
  {"slug":"CITIZEN-HOME","name":"Citizen — Home / Dashboard","figmaUrl":FURL+"5986-51876","liveUrl":USER+"/",
   "figmaImg":f"{FIG}/CITIZEN-HOME.png","liveImg":f"{LIV}/CITIZEN-HOME.png","note":None,
   "findings":[
     F(1,"NHA-CITHOME-001","Register Rescue card uses a different icon than the design","content","Content & Iconography","Minor",
       "Design 'Register Rescue' action card uses a person-in-distress / rescue figure icon (navy).",
       "Build's 'Register Rescue' card uses a plus / medical-cross icon instead. Card frame, text and layout otherwise match the design.",
       "Use the person-in-distress figure icon from the design for the Register Rescue card so the iconography matches.",
       fpct=(50,34), lpct=(50,34)),
     F(2,"NHA-CITHOME-002","'Admin Login' entry point is absent from the citizen masthead","header-band","Components & States","Nit",
       "Design masthead (top-right) carries an 'Admin Login' button.",
       "Build citizen home has no Admin Login entry; officers reach the portal via a separate URL.",
       "Good-to-have: add the Admin Login button to the citizen masthead per design, or confirm it intentionally lives only on the officer subdomain.",
       fpct=(93,9), lpct=(93,9)),
   ]},
  # ---- coverage notes (audited vs visual language; conform) ----
  {"slug":"COVERAGE","name":"Role Coverage — audited against the visual language","figmaImg":None,"liveImg":None,
   "figmaUrl":None,"liveUrl":None,"findings":[],
   "note":"All six roles captured and audited against the design's visual language. Citizen (public) — fully designed, audited. District Officer, State Authority, Finance Officer, System Administrator, Central Authority and SHO (Station House Officer) — dashboards, lists, forms and empty/populated states conform to the shared shell, card, table and chart language; the Global findings above apply across all of them. SHO (westdeopur_ps1, Dhule) is a District-Officer-role account with seeded cases and was used to verify row-level table styling. Build-side additions that are not yet in the Figma design (extra sections, filters, nav items, the profile menu, the citizen chatbot widget) are listed in the separate Design Suggestions document — they conform to the visual language and are for the design team to fold into the frames, not build defects."},
]

DEFERRED = [
  {"id":"NHA-DEF-001","title":"Citizen Grievance Registration steps 02–05 + OTP states",
   "reason":"Gated behind mobile-OTP verification that cannot be completed headless. Step 01 (Details) captured; deeper steps deferred."},
  {"id":"NHA-DEF-002","title":"Track-Status result views (with-ID / with-Mobile)",
   "reason":"Require a valid registered grievance reference to render results. Landing form captured; result states deferred."},
  {"id":"NHA-DEF-003","title":"Case-Detail tabs + modals/toasts/drawers",
   "reason":"Documents / Investigation / Clarification / Audit-Log tabs open on a per-case route (/cases/:id). Now reachable via SHO's seeded cases — schedule a focused capture pass to audit them."},
]

for sc in screens:
    G.finalize(sc, eng_dir=ENG, base_dir=BASE)
nfail = G.write_failures(ENG)

master = {"portal":"NHAPOA — National Helpline Against Atrocities (UAT)","idPrefix":"NHA",
          "generated":"2026-07-03","figmaUrl":FURL+"5093-18512",
          "method":"Screenshot + computed-CSS spec comparison, design-only (content/data/build-extras excluded from findings). 6 roles incl. SHO, ~40 screens; build-extras routed to the Design Suggestions doc.",
          "deferred":DEFERRED,"screens":screens}
json.dump(master, open(os.path.join(BASE,"audit-master.json"),"w"), indent=2)

# -------- Design Suggestions (design-side deliverable) --------
SUGG = {"portal":"NHAPOA — National Helpline Against Atrocities (UAT)","generated":"2026-07-03","items":[
  {"id":"NHA-SG-A1","group":"A","type":"Decide","title":"Corner-radius token for compact/table controls",
   "observed":"Primary/secondary buttons use the 8px radius token; table row-action and pagination buttons render at 6px.",
   "recommendation":"Decide whether compact controls should follow the 8px token or a dedicated documented small-control radius, then apply consistently across the estate."},
  {"id":"NHA-SG-A2","group":"A","type":"Decide","title":"Single input-stroke token for inputs and selects",
   "observed":"Text inputs use a #d1d5db border while filter selects use a lighter #e5e7eb border.",
   "recommendation":"Define one input-stroke token and bind both text inputs and selects to it."},
  {"id":"NHA-SG-B1","group":"B","type":"Design","title":"Add the extra State dashboard sections to the frame",
   "observed":"The live State Authority dashboard renders 'Case Status Breakdown' and 'Stale Cases' sections below the designed content; they follow the shared card/chart language.",
   "recommendation":"Fold these two sections into the State dashboard Figma frame so the composition is specified."},
  {"id":"NHA-SG-B2","group":"B","type":"Design","title":"Add the extra System-Admin filter + nav to the frame",
   "observed":"The live grievance-monitoring screen adds an 'All Cases' filter, a 'Reset' button and a 'Grievance Categories' sidebar item, not present in the design frame; all conform to the visual language.",
   "recommendation":"Add these controls to the System-Administrator frames so the toolbar and sidebar are fully specified."},
  {"id":"NHA-SG-B3","group":"B","type":"Design","title":"Specify the profile menu (avatar dropdown)",
   "observed":"The build's masthead avatar opens a profile dropdown (with a chevron); the design shows only the avatar.",
   "recommendation":"Decide the profile-menu pattern and add it to the design (avatar-as-trigger, chevron optional) so design and build match."},
  {"id":"NHA-SG-B4","group":"B","type":"Design","title":"Document the citizen floating chatbot/emblem widget",
   "observed":"The citizen pages show a second floating widget (an emblem/chatbot bubble) besides the accessibility launcher; it is not in the design.",
   "recommendation":"Add the chatbot widget to the design (placement, size, states) or remove it if unintended; keep it from overlapping page content."},
  {"id":"NHA-SG-B5","group":"B","type":"Design","title":"Fix frame-name corruption in the handoff file",
   "observed":"Several frames are mis-parented/mis-named — e.g. a 'District-Officer/Notifications' frame sits inside the State Authority section, and 'Central-Authority/Fund-Allocation' is reused for both Reports and Notifications.",
   "recommendation":"Rename/re-parent the affected frames to their correct role/screen so the handoff maps cleanly to the build routes."},
  {"id":"NHA-SG-C1","group":"C","type":"Propose","title":"Design the System-Admin analytics screens",
   "observed":"Officer Performance, Grievance Analytics and Geographic View exist in the build but have no Figma frames.",
   "recommendation":"Produce frames for these; the build versions reuse the shared shell/cards/charts and are a reasonable starting point."},
  {"id":"NHA-SG-C2","group":"C","type":"Propose","title":"Design the Central Authority screens",
   "observed":"Central Authority Dashboard, State Comparison and Scheme Performance are built but undesigned.",
   "recommendation":"Produce frames; the build conforms to the visual language and can seed the design."},
  {"id":"NHA-SG-C3","group":"C","type":"Propose","title":"Design the Finance Fund-Utilisation report",
   "observed":"The Finance 'Fund Utilisation Report' screen is built but has no Figma frame.",
   "recommendation":"Produce a frame consistent with the other Finance screens."},
]}
json.dump(SUGG, open(os.path.join(BASE,"suggestions.json"),"w"), indent=2)

tot=sum(len(s["findings"]) for s in screens)
print(f"audit: {len(screens)} screens, {tot} findings, {len(DEFERRED)} deferred, {nfail} assertion failures")
print(f"suggestions: {len(SUGG['items'])} items (A/B/C)")
