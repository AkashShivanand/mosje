#!/usr/bin/env python3
"""Assemble audit-master.json for the full eUtthan re-audit (Login + Admin + Ministry),
merging systemic findings (from _systemic.json) with curated visual/spec findings."""
import json, os

SYS = json.load(open("_systemic.json"))
GEN = "2026-06-11"
FK = "gH2vQ62cfg4677YKWuOpLc"; BASE_LIVE = "https://eutthan-admin-uat.mosje.in"
def fig(node): return f"https://www.figma.com/design/{FK}/MoSJE-Portal--Handoff-?node-id={node}"

def F(n, id, element, section, axis, sev, figma, live, fix, box, pin):
    return {"num": n, "id": id, "element": element, "section": section, "sectionBox": box,
            "axis": axis, "severity": sev, "figma": figma, "live": live, "fix": fix,
            "figmaPin": {"x": pin[0], "y": pin[1]}, "livePin": {"x": pin[0], "y": pin[1]}}

screens = []

# ---------- GLOBAL (systemic) ----------
pop = SYS["poppins_screens"]; unl = SYS["unlabeled"]
g = [
 F(1,"UTH-GLOBAL-001","Form input typeface","global","Typography","Blocker",
   "All text in Noto Sans (token font-family/body).",
   f"Inputs render in Poppins on {len(pop)} screens (Login, Admin & Ministry).",
   "Set input/select/textarea font-family to Noto Sans (token font-family/body).",[0,0,1440,200],[50,30]),
 F(2,"UTH-GLOBAL-002","Form field labels","global","Accessibility","Major",
   "Every field has a visible <label> (Label/label-1) tied to its input.",
   f"Inputs lack programmatic labels on {len(unl)} screens (no <label>/aria-label) — WCAG 1.3.1 & 4.1.2.",
   "Associate a <label for> (or aria-label) with every input.",[0,0,1440,200],[50,45]),
 F(3,"UTH-GLOBAL-003","Masthead / header band","global","Content & Iconography","Major",
   "Header: emblem + BETA + 'Department of Social Justice & Empowerment' line + Digital India & SAMAVESH logos.",
   "Live header drops the 'Department of SJ&E' line and the Digital India + SAMAVESH logos.",
   "Restore the Department line and both logos in the header.",[0,0,1440,140],[50,60]),
 F(4,"UTH-GLOBAL-004","Base line-height","global","Typography","Minor",
   "Line-heights from the type scale (16/20/24/28/36).",
   "Base body line-height is 25px (off the token scale).",
   "Use token line-heights; avoid 25px.",[0,0,1440,200],[50,72]),
 F(5,"UTH-GLOBAL-005","Filter input radius","global","Components & States","Minor",
   "Inputs use radius-md (8px).",
   "Dashboard search/filter inputs use 6px radius.",
   "Set input radius to 8px (radius-md).",[0,0,1440,200],[50,85]),
]
screens.append({"slug":"GLOBAL","name":"Global — Common Elements","figmaUrl":None,"liveUrl":None,
  "note":"Systemic issues present across Login, Admin and Ministry. One fix resolves all instances.",
  "figmaImg":None,"liveImg":None,"findings":g})

# ---------- LOGIN (calibration, signed off) ----------
LB=[0,0,1440,960]
login=[
 F(1,"UTH-LOGIN-001","GIGW accessibility bar","gov-bar","Components & States","Blocker",
   "Top GIGW bar: flag, Skip to Main Content, A-/A/A+ text resize, contrast toggle, language.",
   "Login page has no GIGW accessibility bar at all (Admin pages do).",
   "Add the GIGW compliance bar to the login layout.",LB,[50,6]),
 F(2,"UTH-LOGIN-002","Left brand panel","brand-panel","Layout & Spacing","Major",
   "Navy #003366 SAMAVESH panel: logo, समावेश, 'Justice. Equality. Dignity.', tagline, Change/SIGNING INTO E-Utthaan.",
   "Left side is a light-blue inclusion illustration — no navy panel, no SAMAVESH brand, no tagline.",
   "Restore the navy SAMAVESH brand panel per design.",LB,[25,50]),
 F(3,"UTH-LOGIN-003","Masthead band","header","Content & Iconography","Major",
   "Emblem + BETA + 'Department of Social Justice & Empowerment' + Digital India & SAMAVESH logos.",
   "Only 'Government of India / Ministry of SJ&E' shown.",
   "Complete the header band.",LB,[50,12]),
 F(4,"UTH-LOGIN-004","Input typeface","form","Typography","Blocker",
   "Inputs in Noto Sans.","Username & password inputs render in Poppins.",
   "Set input font to Noto Sans.",LB,[72,52]),
 F(5,"UTH-LOGIN-005","Form heading","form","Typography","Major",
   "Heading 'Log in to your account' at headline token size.",
   "Heading 'Log In' as h1 36px/40px weight 600.",
   "Match heading token and copy; not 36px.",LB,[72,40]),
 F(6,"UTH-LOGIN-006","Heading & button copy","form","Content & Iconography","Major",
   "Heading 'Log in to your account'; button label 'Log In'.",
   "Heading 'Log In'; primary button 'Sign In'.",
   "Align copy to design.",LB,[72,46]),
 F(7,"UTH-LOGIN-007","Forgot Password control","form","Accessibility","Major",
   "'Forgot Password?' is a focusable link.",
   "Rendered as a non-interactive <p> — not keyboard-reachable, not announced as a link.",
   "Use <a>/<button>; make it keyboard-focusable.",LB,[78,58]),
 F(8,"UTH-LOGIN-008","Empty submit validation","form","Functional","Major",
   "Submitting empty fields shows validation feedback.",
   "Empty submit is a silent no-op: no required fields, no error message.",
   "Add required + inline validation.",LB,[72,66]),
 F(9,"UTH-LOGIN-009","Input text colour","form","Color & Token","Minor",
   "Input text Text/Dark #374151.","Input text pure #000.",
   "Use Text/Dark token.",LB,[72,54]),
 F(10,"UTH-LOGIN-010","Password autocomplete","form","Functional","Minor",
   "Password field autocomplete=current-password.","Missing autocomplete on password input.",
   "Add autocomplete=current-password.",LB,[72,60]),
]
screens.append({"slug":"LOGIN","name":"Login / Authentication","figmaUrl":fig("9018-36746"),
  "liveUrl":f"{BASE_LIVE}/login","note":None,
  "figmaImg":"captures/figma/LOGIN-9018-36746.png","liveImg":"captures/board/LOGIN.png","findings":login})

# ---------- helper: per-screen a11y unlabeled finding ----------
def unlabeled_finding(n, slug, box):
    if slug not in unl: return None
    u,t = unl[slug]
    return F(n,f"UTH-{slug}-A11Y","Form field labels","form","Accessibility","Major",
      "Each input has an associated <label>.",
      f"{u} of {t} inputs have no programmatic label (WCAG 1.3.1 / 4.1.2).",
      "Associate <label for>/aria-label with each field.",box,[55,55])

# ---------- ADMIN screens ----------
ADMIN = [
 ("DASHBOARD","Admin / Dashboard","4226-39685","/dashboard?fy=2026-2027","DASHBOARD-4226-39685.png","DASHBOARD.png",1046,[
   ("Progress cards","cards","Components & States","Major",
    "Cards: white bg, Stroke/200 1px border, radius-md.",
    "Progress-report cards are flat grey (#f9fafb) panels with no border.",
    "White bg + Stroke/200 border + 8px radius.",[50,55]),
   ("State filter","toolbar","Components & States","Minor",
    "Two filters: State dropdown + Financial Year.",
    "Only the Financial Year filter present; State filter missing.",
    "Add the State filter dropdown.",[80,18]),
 ]),
 ("FINANCIAL-YEAR","Admin / Financial Year","4226-40009","/admin/financial-year-management","FINANCIAL-YEAR-4226-40009.png","FINANCIAL-YEAR.png",960,[]),
 ("MANAGE-MINISTRY","Admin / Manage Ministry","4226-40288","/ministry-management","MANAGE-MINISTRY-4226-40288.png","MANAGE-MINISTRY.png",960,[]),
 ("MANAGE-SCHEME","Admin / Manage Scheme","4226-40449","/scheme-management","MANAGE-SCHEME-4226-40449.png","MANAGE-SCHEME.png",960,[]),
 ("MANAGE-OUTCOME","Admin / Manage Outcome","4226-40657","/manage-outcome","MANAGE-OUTCOME-4226-40657.png","MANAGE-OUTCOME.png",960,[]),
 ("DOCUMENTS","Admin / Documents","4226-42902","/document-management","DOCUMENTS-4226-42902.png","DOCUMENTS.png",960,[]),
 ("MAP-MINISTRY","Admin / Map Ministry","4226-41073","/map-ministry","MAP-MINISTRY-4226-41073.png","MAP-MINISTRY.png",960,[]),
 ("MANAGE-USER","Admin / Manage User","4226-40870","/user-management",None,"MANAGE-USER.png",960,[]),
]
for slug,name,node,path,figimg,liveimg,h,extra in ADMIN:
    box=[0,0,1440,h]; fnd=[]; n=1
    for el,sec,ax,sev,fg,lv,fx,pin in extra:
        fnd.append(F(n,f"UTH-{slug}-{n:03d}",el,sec,ax,sev,fg,lv,fx,box,pin)); n+=1
    a=unlabeled_finding(n,slug,box)
    if a: fnd.append(a); n+=1
    note=None
    if slug=="MANAGE-USER":
        note="Figma frame 4226-40870 is collapsed in the design file; audited against the visual language of the other Admin screens."
    screens.append({"slug":slug,"name":name,"figmaUrl":fig(node) if path else fig(node),
      "liveUrl":BASE_LIVE+path,"note":note,
      "figmaImg":("captures/figma/"+figimg) if figimg else None,
      "liveImg":"captures/board/"+liveimg,"findings":fnd})

# ---------- MINISTRY screens ----------
MIN = [
 ("MIN-DASHBOARD","Ministry / Dashboard","4226-37114","/dashboard","MIN-DASHBOARD-4226-37114.png","MIN-DASHBOARD.png",1046,[
   ("Progress cards","cards","Components & States","Major",
    "Cards: white bg, Stroke/200 border, radius-md.",
    "Progress-report cards are flat grey panels, no border (same as Admin).",
    "White bg + Stroke/200 border + 8px radius.",[50,55]),
   ("State filter","toolbar","Components & States","Minor",
    "State + Financial Year filters.","Only Financial Year filter; State filter missing.",
    "Add the State filter.",[80,18]),
 ]),
 ("MIN-SCHEME-MANAGEMENT","Ministry / Manage Scheme","4226-37360","/scheme-management","MIN-MANAGE-SCHEME-4226-37360.png","MIN-SCHEME-MANAGEMENT.png",960,[]),
 ("MIN-MANAGE-OUTCOME","Ministry / Manage Outcome","4226-38577","/manage-outcome","MIN-MANAGE-OUTCOME-4226-38577.png","MIN-MANAGE-OUTCOME.png",960,[]),
 ("MIN-MINISTRY-PHYSICAL-PROGRESS-DATA","Ministry / Physical Progress Data","4226-38368","/ministry/physical-progress-data","MIN-PPD-4226-38368.png","MIN-MINISTRY-PHYSICAL-PROGRESS-DATA.png",960,[]),
]
for slug,name,node,path,figimg,liveimg,h,extra in MIN:
    box=[0,0,1440,h]; fnd=[]; n=1
    for el,sec,ax,sev,fg,lv,fx,pin in extra:
        fnd.append(F(n,f"UTH-{slug}-{n:03d}",el,sec,ax,sev,fg,lv,fx,box,pin)); n+=1
    a=unlabeled_finding(n,slug,box)
    if a: fnd.append(a); n+=1
    screens.append({"slug":slug,"name":name,"figmaUrl":fig(node),"liveUrl":BASE_LIVE+path,"note":None,
      "figmaImg":"captures/figma/"+figimg,"liveImg":"captures/board/"+liveimg,"findings":fnd})

am={"portal":"eUtthan — Full Re-Audit (Login · Admin · Ministry)","generated":GEN,"screens":screens}
json.dump(am, open("audit-master.json","w"), indent=2)
tot=sum(len(s["findings"]) for s in screens)
from collections import Counter
sev=Counter(f["severity"] for s in screens for f in s["findings"])
print(f"screens: {len(screens)} | findings: {tot} | severities: {dict(sev)}")
print("live-only screens not yet audited (recommend follow-up):", "PFMS-LOGS, REPORT-10A, REPORT-FIN-SUMMARY, ROLE-MGMT")
