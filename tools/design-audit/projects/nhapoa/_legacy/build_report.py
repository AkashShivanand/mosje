#!/usr/bin/env python3
"""NHAPOA Design-QC author script — Citizen portal milestone.

Structure (the fix for SCW noise): cross-cutting issues that recur on every screen are
written ONCE under a GLOBAL pseudo-screen; each real screen carries only its UNIQUE findings.
Screens that conform (only global issues apply) get a note, not padded repeats.

Decisions locked with the user:
  - Figma is the source of truth (renames read as build defects to fix).
  - Hybrid scope: structural + visual + high-impact content are findings; low-impact copy
    drift is routed to the Design Suggestions note (separate doc).

Identity-driven geometry: every finding carries a real live box (_lbox) or a %-anchor
(_lpct/_fpct); qc_geometry derives crops + pins and ASSERTS each pin inside element/crop/capture.
"""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "engine"))
import qc_geometry as G

BASE = os.path.dirname(os.path.abspath(__file__))
ENG = os.path.join(BASE, "engine")
PREFIX = "NHAPOA"
FK = "gH2vQ62cfg4677YKWuOpLc"
def furl(node): return f"https://www.figma.com/design/{FK}/MoSJE-Portal--Handoff-?node-id={node}"

HOME_F = "captures/figma/CITIZEN-HOME-5986-51876.png"
HOME_L = "captures/live/CITIZEN-HOME.png"

screens = [
  # ---------------------------------------------------------------- GLOBAL
  {
    "slug": "GLOBAL", "name": "Global — applies to every Citizen screen",
    "figmaUrl": furl("5986-51876"), "liveUrl": "https://nhapoa-user-uat.mosje.in/",
    "figmaImg": HOME_F, "liveImg": HOME_L,
    "findings": [
      {"id": f"{PREFIX}-GLOBAL-0", "element": "Govbar accessibility controls",
       "section": "govbar", "axis": "Accessibility", "severity": "Blocker",
       "figma": "Govbar carries the full UX4G control cluster: A− / A / A+ font-resize, a contrast toggle, an accessibility panel icon, and an 'English ▾' language dropdown.",
       "live": "Govbar shows only 'Skip to Main Content' and a single अ/A toggle. Font-resize, contrast, and the accessibility widget are absent on every page.",
       "fix": "Render the full UX4G accessibility bar in the govbar site-wide. GIGW 3.0 §3.1 mandates font-size and contrast controls on every page.",
       "_fpct": (82, 2), "_lpct": (90, 2)},
      {"id": f"{PREFIX}-GLOBAL-0", "element": "Login action (masthead)",
       "section": "masthead", "axis": "Components & States", "severity": "Major",
       "figma": "Navy 'Login' button at the top-right of the masthead on every screen.",
       "live": "No Login control present in the masthead on any screen.",
       "fix": "Restore the 'Login' button per design site-wide, or confirm the public citizen portal intentionally omits sign-in.",
       "_fpct": (95, 9)},
      {"id": f"{PREFIX}-GLOBAL-0", "element": "Product name / branding",
       "section": "heading", "axis": "Content & Iconography", "severity": "Major",
       "figma": "Design names the product 'National Helpdesk for Prevention of Atrocities (NHAPOA)'.",
       "live": "Build renders 'National Helpline Against Atrocities (NHAA)' — in the H1, the chatbot label, and body copy across screens.",
       "fix": "Align the build to the design's 'NHAPOA / National Helpdesk for Prevention of Atrocities' (Figma is source of truth), or confirm an approved rebrand and update the design file.",
       "_lbox": {"x": 324, "y": 165, "w": 1092, "h": 32}, "_fpct": (25, 19)},
      {"id": f"{PREFIX}-GLOBAL-0", "element": "Process terminology",
       "section": "content", "axis": "Content & Iconography", "severity": "Minor",
       "figma": "Design wording: 'Grievance Resolution Process', 'Resolution & Relief', 'District Officer reviews…'.",
       "live": "Build wording: 'Grievance Closure Process', 'Closure & Relief', 'DM/DC Office reviews…'.",
       "fix": "Restore the design's 'Resolution' / 'District Officer' terminology wherever it appears.",
       "_lbox": {"x": 748, "y": 552, "w": 244, "h": 28}, "_fpct": (50, 61)},
      {"id": f"{PREFIX}-GLOBAL-0", "element": "Extra 'Register Rescue' nav item",
       "section": "sidebar", "axis": "Components & States", "severity": "Minor",
       "figma": "Sidebar has 4 items: Dashboard, Register Grievance, Track Status, Help & FAQs.",
       "live": "Sidebar has 5 items — an extra 'Register Rescue' entry (and a /register-rescue route) not in the design.",
       "fix": "Add 'Register Rescue' to the design if approved, else hide the nav item so it matches the 4-item spec.",
       "_lbox": {"x": 64, "y": 299, "w": 204, "h": 20}, "_fpct": (10, 31)},
      {"id": f"{PREFIX}-GLOBAL-0", "element": "Extra build chrome",
       "section": "chrome", "axis": "Components & States", "severity": "Nit",
       "figma": "No floating chatbot, scroll-to-top, or footer 'Feedback' control in the design.",
       "live": "Build adds a 'Samajik Sahayak' chatbot FAB, a scroll-to-top button, and a footer 'Feedback' link on every screen.",
       "fix": "Confirm these are approved additions and reflect them in the design, or hide them.",
       "_lpct": (95, 88)},
    ],
  },
  # ---------------------------------------------------------------- HOME
  {
    "slug": "CITIZEN-HOME", "name": "Citizen / Dashboard / Home",
    "figmaUrl": furl("5986-51876"), "liveUrl": "https://nhapoa-user-uat.mosje.in/",
    "figmaImg": HOME_F, "liveImg": HOME_L,
    "findings": [
      {"id": f"{PREFIX}-CITIZEN-HOME-0", "element": "Extra 'Register Rescue' action card",
       "section": "cards", "axis": "Components & States", "severity": "Minor",
       "figma": "Dashboard shows 2 action cards: Register Grievance and Track Status.",
       "live": "Dashboard shows 3 cards — an extra 'Register Rescue' (medical-cross) card between them.",
       "fix": "Add the Register Rescue card to the design if approved, else hide it so the dashboard matches the 2-card layout.",
       "_lbox": {"x": 721, "y": 338, "w": 298, "h": 28}, "_fpct": (59, 42)},
    ],
  },
  # ---------------------------------------------------------------- GRIEVANCE 01
  {
    "slug": "CITIZEN-GRIEVANCE-01", "name": "Citizen / Register Grievance / 01 · Details",
    "figmaUrl": furl("5986-51959"), "liveUrl": "https://nhapoa-user-uat.mosje.in/register-grievance",
    "figmaImg": "captures/figma/CITIZEN-GRIEVANCE-01-5986-51959.png",
    "liveImg": "captures/live/CITIZEN-GRIEVANCE-01.png",
    "findings": [
      {"id": f"{PREFIX}-CITIZEN-GRIEVANCE-01-0", "element": "Identity field — Email vs Mobile only",
       "section": "form", "axis": "Content & Iconography", "severity": "Major",
       "figma": "Identity field labelled 'Email ID / Mobile No.' — accepts an email or a mobile number for OTP.",
       "live": "Field labelled 'Mobile No.' with placeholder 'Enter 10-digit Mobile Number' — mobile only; email is not accepted.",
       "fix": "Support the design's 'Email ID / Mobile No.' identity method (label + validation), or confirm mobile-only is intended and update the design.",
       "_lpct": (24, 71), "_fpct": (16, 63)},
      {"id": f"{PREFIX}-CITIZEN-GRIEVANCE-01-0", "element": "Extra 'Corruption' grievance type",
       "section": "form", "axis": "Components & States", "severity": "Minor",
       "figma": "'Grievance Related To' offers 3 options: FIR, Relief, Charge Sheet.",
       "live": "Build offers 4 options — adds 'Corruption'.",
       "fix": "Add 'Corruption' to the design if approved, else hide it so the option set matches.",
       "_lpct": (41, 39), "_fpct": (35, 31)},
    ],
  },
  # ---------------------------------------------------------------- TRACK 01
  {
    "slug": "CITIZEN-TRACK-01", "name": "Citizen / Track Status / 01 · Details",
    "figmaUrl": furl("5986-53203"), "liveUrl": "https://nhapoa-user-uat.mosje.in/track-status",
    "figmaImg": "captures/figma/CITIZEN-TRACK-01-5986-53203.png",
    "liveImg": "captures/live/CITIZEN-TRACK-01.png",
    "findings": [
      {"id": f"{PREFIX}-CITIZEN-TRACK-01-0", "element": "Primary button renders muted/disabled",
       "section": "form", "axis": "Components & States", "severity": "Minor",
       "figma": "'Get OTP & Track Status' is a solid navy Primary/Source #003366 button (enabled).",
       "live": "Button renders a muted grey-lavender fill at rest, reading as disabled rather than the primary action.",
       "fix": "Render the button in Primary/Source #003366 at rest; reserve the muted fill for the genuine disabled state only.",
       "_lpct": (43, 27), "_fpct": (46, 30)},
      {"id": f"{PREFIX}-CITIZEN-TRACK-01-0", "element": "Extra security helper line",
       "section": "form", "axis": "Content & Iconography", "severity": "Nit",
       "figma": "No helper text below the reference-ID input.",
       "live": "Build adds a security helper line ('For your security, we'll send a one-time password…') below the input.",
       "fix": "Confirm the helper copy is an approved addition and reflect it in the design, or remove it.",
       "_lpct": (51, 31)},
    ],
  },
  # ---------------------------------------------------------------- HELP (conforms)
  {
    "slug": "CITIZEN-HELP", "name": "Citizen / Help & FAQs",
    "figmaUrl": furl("5986-53669"), "liveUrl": "https://nhapoa-user-uat.mosje.in/help-faqs",
    "figmaImg": "captures/figma/CITIZEN-HELP-5986-53669.png",
    "liveImg": "captures/live/CITIZEN-HELP.png",
    "note": "Conforms to design — layout, cards, accordion, filter chips, and helpdesk panel all match. Only the global findings (accessibility bar, Login, NHAPOA→NHAA naming) apply here.",
    "findings": [],
  },
]

# ---- OTP / ID-gated screens we could not capture (recorded, not silently dropped) ----
deferred = [
  {"id": f"{PREFIX}-GATED-01", "title": "Register Grievance steps 02–05 + Success (Informer/NGO/Victim/Grievance/Review)",
   "reason": "Wizard advances only after mobile-OTP verification; deeper steps are unreachable without a live OTP. Capture once a test OTP / bypass is available."},
  {"id": f"{PREFIX}-GATED-02", "title": "Track Status — 02 View Details (by ID / by Mobile)",
   "reason": "Result view opens only after OTP verification against a registered grievance. Needs a seeded reference ID + OTP."},
  {"id": f"{PREFIX}-GATED-03", "title": "Register Rescue flow (/register-rescue)",
   "reason": "Build-only surface with no corresponding Figma frame — audit against the design system separately, or add a design."},
]

for sc in screens:
    if sc["findings"]:
        sc["findings"] = [dict(f, num=0) for f in sc["findings"]]
        G.finalize(sc, eng_dir=ENG, base_dir=BASE)

am = {
    "portal": "NHAPOA Citizen (UAT) · Design QC",
    "idPrefix": PREFIX, "generated": "2026-07-02",
    "figmaUrl": furl("5093-18512"),
    "method": "Spec-level comparison — Figma design tokens/specs vs live computed CSS + element geometry. Cross-cutting issues consolidated to a Global section.",
    "deferred": deferred,
    "screens": screens,
}
json.dump(am, open(os.path.join(BASE, "audit-master.json"), "w"), indent=2)
nfail = G.write_failures(ENG)
tot = sum(len(s["findings"]) for s in screens)
print(f"audit-master.json — {tot} findings across {len(screens)} screens, {len(deferred)} deferred, {nfail} assertion failures")
for sc in screens:
    for f in sc["findings"]:
        print(f"  [{f['severity'][:3]}] {sc['slug']:22} {f['num']} {f['id']} figPin={f.get('figmaPin')} livePin={f.get('livePin')}")
