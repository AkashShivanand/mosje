#!/usr/bin/env python3
"""audit-master.json — corrected & consolidated per user review (sync from Figma applied).
Repetitive table typography / cell padding / card-wrapper / Add-button findings are now GLOBAL."""
import json
FK="gH2vQ62cfg4677YKWuOpLc"; LIVE="https://eutthan-admin-uat.mosje.in"
def fig(n): return f"https://www.figma.com/design/{FK}/MoSJE-Portal--Handoff-?node-id={n}"
def F(el,sec,box,axis,sev,figma,live,fix,fp,lp,fio=None,lio=None):
    d={"element":el,"section":sec,"sectionBox":box,"axis":axis,"severity":sev,"figma":figma,"live":live,
       "fix":fix,"figmaPin":{"x":fp[0],"y":fp[1]},"livePin":{"x":lp[0],"y":lp[1]}}
    if fio:d["figmaImgO"]=fio
    if lio:d["liveImgO"]=lio
    return d
# capture paths for per-finding image overrides
FYf="captures/figma/FINANCIAL-YEAR-4226-40009.png"; FYl="captures/board/FINANCIAL-YEAR.png"
MMf="captures/figma/MANAGE-MINISTRY-4226-40288.png"; MMl="captures/board/MANAGE-MINISTRY.png"
SCf="captures/figma/MANAGE-SCHEME-4226-40449.png"; SCl="captures/board/MANAGE-SCHEME.png"
HB=[0,0,1440,165]; SB=[0,80,820,700]; PB=[600,0,1440,175]
TB=[295,215,1440,890]; TLB=[295,120,1440,285]; SRB=[295,196,1440,290]
S=[]

# ---------------- GLOBAL (chrome + consolidated table/button patterns) ----------------
S.append(dict(slug="GLOBAL",name="Global — Common Elements",figmaUrl=fig("4226-39685"),liveUrl=None,
 note="Patterns that repeat on every page (shared chrome, every data table, every Add button). One fix applies everywhere.",
 figmaImg="captures/figma/DASHBOARD-4226-39685.png",liveImg="captures/board/DASHBOARD.png",findings=[
 F("Accessibility bar","header-band",HB,"Layout & Spacing","Minor",
   "Height 40px, navy #003366 background.","Height 38px (colour is correct).",
   "Increase the accessibility bar height from 38px to 40px.",[50,11.5],[50,11.5]),
 F("Masthead — Ministry/Department text","header-band",HB,"Content & Iconography","Major",
   "Two lines: 'Ministry of SJE' (14px/500/#1f2937) above the bold 'Department of SJE' headline (20px/700/#374151).",
   "Single line 'Ministry of SJE' at 20px/700/#374151 — the Department headline is absent.",
   "Add 'Department of Social Justice & Empowerment' (20px/700/#374151) as the main masthead headline; show the Ministry line above it at 14px/500/#1f2937.",[20.8,43.6],[20.8,43.6]),
 F("Masthead — Digital India + SAMAVESH logos","header-band",HB,"Content & Iconography","Major",
   "Centre-right of the masthead: Digital India logo + SAMAVESH lockup, with a 24px gap between them.",
   "No co-branding — the centre of the header is empty.",
   "Add the Digital India logo and the SAMAVESH lockup to the header centre, before the user profile.",[70.1,43.6],[70.1,43.6]),
 F("Sidebar collapse toggle","header-band",HB,"Components & States","Minor",
   "A hamburger/collapse control sits at the top-left of the header.","No collapse control is shown in the header.",
   "Add the sidebar collapse (hamburger) control at the header's left edge.",[4.5,43.6],[4.5,43.6]),
 F("Sidebar — active nav item","sidebar",SB,"Color & Token","Major",
   "Active item: text #003366 · weight 400 · corner radius 16px · background #e5eff9.",
   "Active item: text #374151 · weight 700 · radius 8px (background correct; three properties deviate).",
   "Active sidebar item: text colour → #003366 · weight → 400 · corner radius → 16px.",[17.6,13.1],[17.6,13.1]),
 F("Profile — name, role & avatar","profile",PB,"Content & Iconography","Minor",
   "Name with the role below it as plain text ('Admin', no punctuation); the avatar sits AFTER the text, at the far right.",
   "Avatar comes first, then the name; the role is wrapped in parentheses — '(Super Admin)'.",
   "Put the name and role first with the avatar to their right, and show the role as plain text without parentheses.",[79.8,41.1],[79.8,41.1]),
 F("Search & form input typeface","search-fields",SRB,"Typography","Major",
   "All inputs and search fields use Noto Sans, like the rest of the portal.",
   "Search and text inputs render in Poppins on Login and across the Admin and Ministry screens.",
   "Set every input, select and search field to Noto Sans.",[8,55],[8,55],FYf,FYl),
 F("'Add' buttons — icon, weight & padding","add-button",[1080,120,1440,215],"Components & States","Minor",
   "Plus icon to the LEFT of the label; label 14px / 500 / line-height 20; padding 24-left / 16-right / 8 top & bottom; the plus is a separate 16×16 icon.",
   "Plus icon to the RIGHT; label 14px / 600 with a tight line-height; padding 18 / 12 / 0; the '+' is baked into the label text.",
   "On every Add button: plus icon on the left, label weight 500 / line-height 20, padding 24/16/8, and a real plus-icon element.",[70,50],[78,50],SCf,SCl),
 F("Data-table column header","table-header",[295,205,1440,360],"Typography","Major",
   "14px / 600 / colour #6b7280; cell padding 24px on the sides · 16px top & bottom; header sits on a #f9fafb band.",
   "Header text renders in #4b5563 with only 14px top/bottom padding (colour and vertical padding deviate; font-size 14px is correct).",
   "On every table header: text colour → #6b7280; cell padding 24px sides · 16px top/bottom.",[38,45],[38,45],FYf,FYl),
 F("Data-table body cell","table-cell",[295,300,1440,640],"Color & Token","Major",
   "14px / 400 / colour #374151; cell padding 24px on the sides · 16px top & bottom.",
   "Body cells render with a different colour (#4b5563, or pure #000 on some screens) and less top/bottom padding (16–20px).",
   "On every table body cell: text colour → #374151; cell padding 24px sides · 16px top/bottom.",[38,40],[38,40],FYf,FYl),
 F("Card wrapper around search & table","card-wrapper",[295,150,1440,640],"Color & Token","Minor",
   "The search bar and table sit directly on the page with a soft shadow — there is NO bordered card around them.",
   "The search and table are wrapped in a 1px hairline-bordered card.",
   "Remove the hairline card border around the search + table; use the soft shadow from the design.",[50,20],[50,20],MMf,MMl),
]))

# ---------------- LOGIN (unchanged) ----------------
LH=[0,0,1440,150]; LP=[0,130,920,960]; LF=[880,300,1440,770]
S.append(dict(slug="LOGIN",name="Login",figmaUrl=fig("9018-36746"),liveUrl=f"{LIVE}/login",note=None,
 figmaImg="captures/figma/LOGIN-9018-36746.png",liveImg="captures/board/LOGIN.png",findings=[
 F("Government accessibility bar","header",LH,"Components & States","Blocker",
   "Navy government bar at the very top — flag + 'Government of India', 'Skip to Main Content', A−/A/A+ text resize, contrast toggle and language selector.",
   "The login page has no government bar at all (the signed-in pages do have it).",
   "Add the same government accessibility bar to the top of the login page.",[50,15],[50,10]),
 F("Masthead branding","header",LH,"Content & Iconography","Major",
   "Emblem + BETA tag + the full three-line lockup ending in the bold 'Department of Social Justice & Empowerment', plus the Digital India and SAMAVESH logos.",
   "Only the emblem with two lines; the BETA tag, Department line and both partner logos are missing.",
   "Show the complete masthead: BETA tag, full department lockup, and the Digital India + SAMAVESH logos.",[25,65],[18,65]),
 F("Left brand panel","brand-panel",LP,"Color & Token","Blocker",
   "A solid navy #003366 brand panel (~60% of the page): SAMAVESH logo + समावेश wordmark, orange divider, 'Justice. Equality. Dignity.' headline, a short description, and a bottom 'SIGNING INTO E-Utthaan' strip with a Change button.",
   "A pale-blue illustration fills the left side (~44%) — no navy panel, no SAMAVESH branding, no tagline and no 'SIGNING INTO' strip.",
   "Replace the illustration with the navy SAMAVESH brand panel, restore the ~60/40 split and the 'SIGNING INTO E-Utthaan' strip.",[40,42],[40,55]),
 F("Form heading","form",LF,"Content & Iconography","Major",
   "'Log in to your account' — left-aligned at the top of the form.",
   "'Log In' — centred, with the national emblem repeated above it.",
   "Use the heading 'Log in to your account', left-aligned, and remove the duplicate emblem above the form.",[19,25],[46,23]),
 F("Field labels & input style","form",LF,"Components & States","Major",
   "'User ID or Email' and 'Password' labels sit above their fields; inputs are 48px tall with a navy #003366 focus outline.",
   "No labels — only placeholder text inside the fields; inputs are 46px tall with no visible focus style.",
   "Add the two field labels above the inputs; input height 48px with a 2px navy #003366 focus outline.",[19,36],[46,38]),
 F("Password visibility toggle","form",LF,"Components & States","Minor",
   "Eye icon inside the password field — 24×24, grey #6b7280.","The eye icon is smaller (~16px) and tight against the field edge with a small tap area.",
   "Use the 24px eye icon in grey #6b7280 with a comfortable tap area.",[85,62],[79,55]),
 F("Primary button","form",LF,"Color & Token","Minor",
   "Label 'Log In' · 48px tall · 8px corner radius · full form width.","Label 'Sign In' · ~41px tall · ~6px radius.",
   "Change the label to 'Log In'; set height 48px and corner radius 8px.",[54,78],[46,75]),
 F("Forgot Password link","form",LF,"Content & Iconography","Nit",
   "'Forgot Password?' — with the question mark — right-aligned on the Password label row, in navy.",
   "'Forgot Password' without the question mark.","Add the question mark: 'Forgot Password?'.",[79,54],[77,66]),
]))

# ---------------- DASHBOARD (002 synced) ----------------
DSC=[295,195,1440,580]
S.append(dict(slug="DASHBOARD",name="Admin · Dashboard",figmaUrl=fig("4226-39685"),liveUrl=f"{LIVE}/dashboard",note=None,
 figmaImg="captures/figma/DASHBOARD-4226-39685.png",liveImg="captures/board/DASHBOARD.png",findings=[
 F("Page heading 'Dashboard'","heading",[295,120,1440,210],"Typography","Minor",
   "Noto Sans 28px / 500 / line-height 36 / letter-spacing −0.28 / colour #374151.",
   "30px / 600 / colour #1E3A5F (larger, bolder and a different colour).",
   "Set the page heading to 28px / 500 / #374151 / letter-spacing −0.28.",[13.5,50],[13.5,50]),
 F("Financial-Year filter — placement","filters",[295,120,1440,470],"Layout & Spacing","Major",
   "The State and Financial-Year filters sit at the top of the page, next to the 'Dashboard' heading — they control everything below.",
   "The Financial-Year filter sits inside the 'Progress Report' panel header, although changing it also updates the four KPI cards above it.",
   "Move the Financial-Year filter to the top of the page next to the heading, as it affects the whole page. Applies to the Ministry dashboard as well.",[88,16],[90,77]),
 F("State filter","filters",[295,120,1440,470],"Components & States","Minor",
   "Two filters at the top: a State dropdown ('All States') and the Financial-Year dropdown.",
   "Only the Financial-Year filter exists; there is no State filter.","Show all the relevant filters.",[80,16],[85,16]),
 F("KPI & progress card text","stat-cards",DSC,"Typography","Major",
   "Card label in regular weight (400) dark slate #374151; the value below in semibold dark slate #374151.",
   "Card labels render in bold, and all values render in bold navy (#003366 family) — heavier and bluer than the design.",
   "Card labels → regular 400 #374151; values → semibold #374151 (not navy, not extra bold). Applies to both dashboards.",[12,22],[12,18]),
 F("Progress section container","stat-cards",DSC,"Layout & Spacing","Minor",
   "'Progress Report of Financial Year …' is a plain section title on the page, with the white stat cards directly below it.",
   "The whole progress section is wrapped in a grey panel with a header strip, so the cards sit inside a box that isn't in the design.",
   "Remove the grey wrapper panel; show the section title directly on the page with the cards below.",[50,52],[50,50]),
]))

# ---------------- FINANCIAL-YEAR (unique only; pins synced) ----------------
S.append(dict(slug="FINANCIAL-YEAR",name="Admin · Manage Financial Year",figmaUrl=fig("4226-40009"),
 liveUrl=f"{LIVE}/admin/financial-year-management",note=None,figmaImg=FYf,liveImg=FYl,findings=[
 F("Body cell colour","table",TB,"Color & Token","Major",
   "Financial-year body cells use navy #003366 (this screen highlights the value in primary).",
   "Body cells render in #374151 — the navy treatment is missing.",
   "Set the body cell text to navy #003366 on this screen.",[13.6,30.5],[14.2,39.3]),
 F("'Action' column header","table",TB,"Components & States","Major",
   "The right-most column has an 'Action' header above the row controls.","No 'Action' header above the edit/delete controls.",
   "Add the 'Action' column header to the table header row.",[89.7,12],[90.9,14.7]),
 F("Row action controls","table",TB,"Components & States","Major",
   "Two icon-only buttons per row: a pencil (edit) in a light box and a red trash (delete) in a light-red box.",
   "An 'Edit' text link with a pencil, plus a bare trash icon — not the boxed icon-only buttons.",
   "Use the boxed icon-only pencil and red trash buttons from the design.",[93.8,30.2],[90.9,35.9]),
 F("Highlighted row background","table",TB,"Color & Token","Minor",
   "Highlighted/selected row background #e5eff9.","Highlighted row background #eaf2fb — visually close but not the token.",
   "Use #e5eff9 for the highlighted row background.",[38.1,17],[36.3,27]),
 F("Search field background","search-row",SRB,"Color & Token","Minor",
   "Search field has a white background (border #e5e7eb).","Search field background is grey #f9fafb (border #e5e7eb is the same in both).",
   "Set the search field background to white.",[50.1,54.4],[50.1,54.4]),
]))

# ---------------- MANAGE-MINISTRY (unique only; pins synced) ----------------
S.append(dict(slug="MANAGE-MINISTRY",name="Admin · Manage Ministry",figmaUrl=fig("4226-40288"),
 liveUrl=f"{LIVE}/ministry-management",note=None,figmaImg=MMf,liveImg=MMl,findings=[
 F("Row text colour & hover behaviour","table",TB,"Color & Token","Major",
   "Default rows in neutral dark #374151; a row turns primary navy #003366 (on the #e5eff9 highlight) only on hover/selection.",
   "Ministry names always render in a lighter blue link style, regardless of state.",
   "Default rows → #374151; apply the navy #003366 treatment only to the hovered/selected row.",[26.6,22.4],[29.5,64.1]),
 F("Row action buttons","table",TB,"Components & States","Major",
   "On the hovered row: 'Edit' (navy on a light fill, 8px radius) and 'Delete' (red text + icon), comfortably sized with a 12px gap.",
   "Edit and Delete appear but are compressed by the tight row padding and can't render at their designed size.",
   "Match the Edit/Delete buttons' size, fill and spacing to the design.",[95.7,32.2],[93.3,65.1]),
]))

# ---------------- MANAGE-OUTCOME (filters only) ----------------
S.append(dict(slug="MANAGE-OUTCOME",name="Admin · Manage Outcome",figmaUrl=fig("4226-40657"),
 liveUrl=f"{LIVE}/manage-outcome",note=None,figmaImg="captures/figma/MANAGE-OUTCOME-4226-40657.png",
 liveImg="captures/board/MANAGE-OUTCOME.png",findings=[
 F("Filter dropdowns","toolbar",TLB,"Components & States","Minor",
   "Three filter chips beside the search: Financial Year, 'All Schemes' and 'All Department'.","Only the Financial-Year dropdown is present.",
   "Show all the relevant filters.",[20.5,45.5],[20.5,45.5]),
]))

# ---------------- DOCUMENTS (year filter only) ----------------
S.append(dict(slug="DOCUMENTS",name="Admin · Manage Documents",figmaUrl=fig("4226-42902"),
 liveUrl=f"{LIVE}/document-management",note=None,figmaImg="captures/figma/DOCUMENTS-4226-42902.png",
 liveImg="captures/board/DOCUMENTS.png",findings=[
 F("Year filter — control style","toolbar",TLB,"Components & States","Major",
   "A compact filter chip (about 99×36, 6px radius, 1px #e5e7eb border, leading arrow-down icon).",
   "A wide clearable select with a trailing × button and chevron — a different control style.",
   "Use the compact filter-chip style from the design; keep the × clear only for an applied-filter state.",[9.2,45.5],[9.2,45.5]),
]))

# ---------------- MAP-MINISTRY (tabs corrected; navy body; unmap) ----------------
S.append(dict(slug="MAP-MINISTRY",name="Admin · Map Ministry / Schemes",figmaUrl=fig("4226-41073"),
 liveUrl=f"{LIVE}/map-ministry",note=None,figmaImg="captures/figma/MAP-MINISTRY-4226-41073.png",
 liveImg="captures/board/MAP-MINISTRY.png",findings=[
 F("Ministry / Schemes segmented tabs","toolbar",TLB,"Components & States","Blocker",
   "A two-option segmented control sits beside the heading — active 'Ministry' in white on navy #003366, inactive 'Schemes' in grey.",
   "No tabs at all — the 'Mapped Ministry List' heading sits alone above the table.",
   "Add the Ministry/Schemes segmented tabs beside the heading, as shown in the design.",[55,45.5],[55,45.5]),
 F("Body cell colour","table",TB,"Color & Token","Major",
   "Body cells use neutral dark #374151.","Ministry-name cells render in navy #003366 with a link treatment that isn't in the design.",
   "Set the body cells to #374151; remove the navy link treatment.",[26.6,10.1],[26.6,11.1]),
 F("'Unmap' row action colour","table",TB,"Color & Token","Major",
   "'Unmap' is a quiet text button in navy #003366 (text + icon).","'Unmap' renders in red (~#ef4444) — a danger treatment the design doesn't use.",
   "Recolour the Unmap text and icon to navy #003366.",[95.6,10.1],[95.6,11.1]),
]))

# ---------------- MANAGE-USER (filters only) ----------------
S.append(dict(slug="MANAGE-USER",name="Admin · User Management",figmaUrl=fig("4226-40865"),
 liveUrl=f"{LIVE}/user-management",note=None,figmaImg="captures/figma/MANAGE-USER-4226-40865.png",
 liveImg="captures/board/MANAGE-USER.png",findings=[
 F("Filter dropdowns","toolbar",TLB,"Components & States","Minor",
   "Three filter dropdowns beside the search field.","A single 'All Years' select only.","Show all the relevant filters.",[20.5,45.5],[20.5,45.5]),
]))

# ---------------- MINISTRY ----------------
S.append(dict(slug="MIN-DASHBOARD",name="Ministry · Dashboard",figmaUrl=fig("4226-37114"),liveUrl=f"{LIVE}/dashboard",note=None,
 figmaImg="captures/figma/MIN-DASHBOARD-4226-37114.png",liveImg="captures/board/MIN-DASHBOARD.png",findings=[
 F("Financial-Year filter control","filters",[295,120,1440,440],"Components & States","Minor",
   "The filter control uses an 8px corner radius and sits at the top of the page.",
   "The Financial-Year selector uses a 6px radius and sits inside the progress panel header (placement covered under Admin · Dashboard).",
   "Set the filter control radius to 8px.",[90,15],[92,72]),
 F("KPI & progress card text","stat-cards",DSC,"Typography","Major",
   "Card label regular 400 #374151; value semibold #374151.","Labels bold, values bold navy — same deviation as the Admin dashboard.",
   "Card labels → regular 400 #374151; values → semibold #374151.",[12,22],[12,18]),
]))
S.append(dict(slug="MIN-SCHEME-MANAGEMENT",name="Ministry · Manage Scheme",figmaUrl=fig("4226-37360"),
 liveUrl=f"{LIVE}/scheme-management",note=None,figmaImg="captures/figma/MIN-MANAGE-SCHEME-4226-37360.png",
 liveImg="captures/board/MIN-SCHEME-MANAGEMENT.png",findings=[
 F("Filter dropdowns","toolbar",[295,150,1440,290],"Components & States","Minor",
   "An 'All Department' dropdown sits beside the Financial-Year filter.","Only the Financial-Year filter is present.","Show all the relevant filters.",[85,60],[85,60]),
]))
S.append(dict(slug="MIN-MANAGE-OUTCOME",name="Ministry · Manage Outcome",figmaUrl=fig("4226-38577"),
 liveUrl=f"{LIVE}/manage-outcome",note=None,figmaImg="captures/figma/MIN-MANAGE-OUTCOME-4226-38577.png",
 liveImg="captures/board/MIN-MANAGE-OUTCOME.png",findings=[
 F("Filter dropdowns","toolbar",[295,150,1440,290],"Components & States","Minor",
   "'All Schemes' and 'All Department' dropdowns sit beside the Financial-Year filter.","Only the Financial-Year dropdown is present.","Show all the relevant filters.",[85,60],[85,60]),
]))
S.append(dict(slug="MIN-MINISTRY-PHYSICAL-PROGRESS-DATA",name="Ministry · Physical Progress Data",
 figmaUrl=fig("4226-38368"),liveUrl=f"{LIVE}/ministry/physical-progress-data",note=None,
 figmaImg="captures/figma/MIN-PPD-4226-38368.png",liveImg="captures/board/MIN-MINISTRY-PHYSICAL-PROGRESS-DATA.png",findings=[
 F("Header action buttons","header",[810,140,1440,210],"Components & States","Minor",
   "Two actions: 'Import Achievements Data' (outline) and 'Add Progress' (filled navy).","A third button — 'Download Sample Template' — appears to the left of Import.",
   "Confirm whether the extra 'Download Sample Template' action is intended; the design shows two actions.",[30,50],[20,50]),
]))

for s in S:
    for i,f in enumerate(s["findings"],1): f["num"]=i; f["id"]=f"UTH-{s['slug']}-{i:03d}"
am={"portal":"eUtthan — Design QC (Login · Admin · Ministry)","generated":"2026-06-12","screens":S}
json.dump(am,open("audit-master.json","w"),indent=2,ensure_ascii=False)
from collections import Counter
sev=Counter(f["severity"] for s in S for f in s["findings"])
print("screens:",len(S),"findings:",sum(len(s['findings']) for s in S),dict(sev))
for s in S: print(f"  {s['slug']:36}{len(s['findings'])}")
