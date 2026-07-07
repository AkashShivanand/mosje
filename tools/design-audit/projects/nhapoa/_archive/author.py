#!/usr/bin/env python3
"""NHAPOA project author/curation pass (design-qc skill, Tier-B).

Runs AFTER `engine/run.py --phase analyze` (which writes out/conformance.json +
out/coverage-ledger.json + a raw machine audit-master.json) and BEFORE
`--phase report`. It REPLACES out/audit-master.json with a curated report that:

  1. Keeps the honest machine DS-conformance pass, but DE-NOISED and precisely named
     per references/audit-rules.md (drops malformed-hex extraction artifacts, the
     Digital-India brand wordmark, gov-bar masthead microcopy, and pill/full-round
     radii that ARE the radius-full token; merges related token drifts; names the
     exact elements).  Stamp: 🤖 machine (verify severity with a human).
  2. Adds Tier-B JUDGMENT findings from design-vs-build comparison of the fresh
     Figma frames against the fresh live captures (right component / hierarchy /
     icon metaphor / control state).  Stamp: 👤 needs human sign-off.
  3. Routes build-EXTRAS to the Design Suggestions doc (not findings) and parks
     undesigned / data-viz-only screens in deferred[] with a reason.

Design issues ONLY — no dummy copy/content or build-extra "not in design" flags.
Geometry (crops+pins) is derived + asserted by engine/qc_geometry.finalize."""
import json, os, sys, re
ENG = os.path.dirname(os.path.abspath(__file__))
TOOL = os.path.dirname(os.path.dirname(ENG))
sys.path.insert(0, os.path.join(TOOL, "engine"))
import qc_geometry as G  # noqa

PROJ = ENG
OUT = os.path.join(PROJ, "out")
CAP = os.path.join(PROJ, "captures")
FRAME_URL = "https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id={n}"

def furl(node): return FRAME_URL.format(n=node.replace(":", "-"))

conf = json.load(open(os.path.join(OUT, "conformance.json")))
ledger = json.load(open(os.path.join(OUT, "coverage-ledger.json")))
DEV = {(d["prop"], str(d["value"])): d for d in conf["deviations"]}

def loc_of(prop, value):
    d = DEV.get((prop, str(value)))
    return d["loc"] if d and d.get("loc") else None       # (slug,x,y,w,h,pageH)

def lpct_from_loc(loc):
    if not loc: return None
    slug, x, y, w, h, H = loc
    xp = round(100 * (x + w / 2) / 1440) if x is not None else 50
    yp = round(100 * (y + h / 2) / max(1, (H or 1000)), 1) if y is not None else 50
    return slug, xp, yp

# ---------------------------------------------------------------- curated DS-conformance (🤖)
# Each: (element, axis, severity, figma_intent, build_desc, fix, anchor_prop, anchor_value)
CONF = [
 ("Secondary / muted text off the neutral token", "Color & Token", "Major",
  "Secondary text should use the SAMAVESH neutral text tokens — Text/Hint #374151 or Text/Dark #1f2937.",
  "≈844 muted labels across all 43 screens render #6b7280 (Tailwind gray-500), plus ≈25 more at #9ca3af (gray-400) for empty-state text — neither is a design token.",
  "Map muted/secondary text to the neutral text tokens (Text/Hint #374151 for supporting copy; a defined muted token if a lighter step is needed) instead of the raw Tailwind gray ramp.",
  "color", "#6b7280"),
 ("Headings / primary text off the neutral token", "Color & Token", "Major",
  "Dark text should use Text/Dark #1f2937 or Text/Primary #003366 from the token set.",
  "≈163 elements render #0f172a (slate-900) and ≈54 render #111827 (gray-900) for headings/values — near-black shades that are not design tokens.",
  "Replace #0f172a / #111827 with Text/Dark #1f2937 (or Text/Primary #003366 for emphasis) so headings track the token scale.",
  "color", "#0f172a"),
 ("Control corner-radius off the 4/8px scale", "Components & States", "Minor",
  "Radii should snap to the token scale — radius-xs 4, radius-md/button-corner 8, radius-lg 12.",
  "≈105 controls use 6px (row-action & pagination buttons, e.g. \"Use my current location\"), ≈40 inputs use 5px (e.g. the address / \"Street, landmark, locality\" fields) and a few use 20px — none are token steps.",
  "Snap inputs and buttons to radius-md 8 (or radius-xs 4 where a tighter corner is intended); remove the ad-hoc 5/6/20px radii.",
  "radius", "6"),
 ("Dashboard chart palette not on the status tokens", "Color & Token", "Minor",
  "Data-viz series should draw from the DS status/brand tokens — Info #1558b0, Warning #bb772b, Success #2e7d32, Danger #ec5042, Primary #003366.",
  "Dashboard charts use ad-hoc hues — #a66a26 (amber, ≈55), #3730a3 (indigo), #b7131a / #a52319 (reds) — instead of the token status ramp.",
  "Re-map the chart series to the status/brand tokens so KPI colours read consistently with badges and the rest of the UI.",
  "color", "#a66a26"),
 ("Oversized KPI figures above the type scale", "Typography", "Minor",
  "The display scale tops out at Display-5 28 / Headline-1 32.",
  "Dashboard KPI numerals render at 48px and 56px (and a stray 26px) — above the largest type token.",
  "Bring hero KPI figures onto the display scale (28/32) or add an explicit display-XL token if a larger step is genuinely required.",
  "fontSize", "48"),
 ("Pure #000000 text in the government chrome", "Color & Token", "Nit",
  "Neutral text tokens bottom out at #1f2937 / #001933 — pure black is not in the palette.",
  "≈119 elements render #000000 — concentrated in the persistent gov-bar / masthead chrome that repeats on every screen.",
  "Swap pure black for Text/Dark #1f2937 in the shared header/masthead chrome so no view carries an off-token black.",
  "color", "#000000"),
]

def conf_screen():
    findings = []
    for i, (el, ax, sev, fig, live, fix, prop, val) in enumerate(CONF, 1):
        lp = lpct_from_loc(loc_of(prop, val))
        if not lp:                       # fallback: first screen, mid
            lp = (conf["deviations"][0]["loc"][0], 50, 50)
        slug, xp, yp = lp
        findings.append({
            "num": i, "id": f"NHA-DSCONF-{i:03d}", "element": el, "section": "ds-conformance",
            "axis": ax, "severity": sev, "figma": fig, "live": live, "fix": fix,
            "check": "🤖 machine", "liveImgO": f"captures/live/{slug}.png",
            "_lpct": (xp, yp)})
    return {"slug": "GLOBAL-DSCONF",
            "name": "Global — Design-System Conformance (machine-verified, curated)",
            "figmaImg": None, "liveImg": f"captures/live/{findings[0]['liveImgO'].split('/')[-1]}",
            "figmaUrl": None, "liveUrl": None,
            "note": (f"DS-adoption: {conf['ds_adoption_pct']}% of {conf['elements_checked']} elements match the "
                     f"Figma-derived token contract (baseline={conf['mode']}). Full deviation table in out/conformance.json. "
                     "Curated: extraction artifacts (malformed hex), the Digital-India brand wordmark (Noto Serif), gov-bar "
                     "masthead microcopy (8/10px) and pill/full-round radii (= radius-full 999) are excluded as non-defects. "
                     "🤖 machine severities — confirm with a human before certifying."),
            "findings": findings}

# ---------------------------------------------------------------- Tier-B judgment (👤)
# screen: slug, name, figmaNode, liveSlug, liveUrl, findings[]
# finding: id,element,axis,severity,figma,live,fix,section,anchorText,figDy,liveDy,fpct(x,y)
J = [
 {"slug": "CITIZEN-HOME", "name": "Citizen — Home / Dashboard", "node": "5986:51876",
  "live": "https://nhapoa-user-uat.mosje.in/", "liveslug": "CITIZEN-HOME",
  "findings": [
    ("Accessibility toolbar reduced to a floating widget", "Accessibility", "Major",
     "The design's government top-bar carries the full inline accessibility toolset — Skip to Main Content, A− / A / A+ text-resize, a light/dark contrast toggle, the accessibility (person) icon and an English language selector.",
     "The build collapses the bar to just Skip-to-Main-Content plus a single अ/A glyph, and moves the accessibility controls into a floating purple circular widget on the right edge; the A−/A/A+, contrast toggle and language selector are gone from the bar.",
     "Restore the full accessibility toolset inline in the gov-bar per the design, and trigger the UX4G accessibility widget from the bar's accessibility icon rather than a detached floating FAB (one connected control, not two).",
     "govbar", "Skip to Main Content", 0.0, 0.0, (80, 2)),
    ("Register Rescue icon metaphor", "Content & Iconography", "Minor",
     "The Register Rescue card uses a raised-arm rescue-figure glyph that reads as a person in distress being helped.",
     "The build renders a medical plus / cross glyph for the same card, which reads as 'add' or 'health' rather than rescue.",
     "Restore the rescue-figure icon (or an equivalent distress/rescue metaphor from Material Symbols) so the glyph matches the action.",
     "rescue", "Register Rescue", 0.0, 0.0, (53, 27)),
    ("Masthead 'Admin Login' entry point absent", "Components & States", "Nit",
     "The design places a navy 'Admin Login' button at the top-right of the masthead, beside the SAMAVESH lockup.",
     "The citizen build has no Admin Login button in the masthead — the officer entry point is not surfaced from the public home.",
     "Add the 'Admin Login' button back to the masthead per the design (good-to-have convenience, low priority).",
     "adminlogin", "SAMAVESH", 0.0, 0.0, (93, 7)),
  ]},
 {"slug": "CITIZEN-REGISTER-GRIEVANCE", "name": "Citizen — Register Grievance (Step 1)", "node": "5986:51959",
  "live": "https://nhapoa-user-uat.mosje.in/register-grievance", "liveslug": "CITIZEN-REGISTER-GRIEVANCE",
  "findings": [
    ("Active step marker rendered as an outline, not a filled disc", "Components & States", "Minor",
     "The active wizard step (1) is a solid navy disc with a white numeral; upcoming steps are light outlined circles — a clear filled-vs-outline hierarchy.",
     "The build renders the active step as an outlined ring (white fill, navy border, navy numeral), so the current step reads almost the same as the inactive steps.",
     "Give the active step the solid navy fill + white numeral from the design so the current position in the wizard is unmistakable.",
     "stepper", "Grievance Registration", 0.0, 0.0, (21, 16)),
  ]},
 {"slug": "DISTRICT-OFFICER-DISTRICT-OFFICER-DASHBOARD", "name": "District Officer — Dashboard", "node": "5986:53726",
  "live": "https://nhapoa-admin-uat.mosje.in/district-officer/dashboard",
  "liveslug": "DISTRICT-OFFICER-DISTRICT-OFFICER-DASHBOARD",
  "findings": [
    ("Redundant dropdown chevron on the profile chip", "Components & States", "Nit",
     "The design's profile chip is name + role + avatar only — the avatar itself is the menu trigger (a conventional click target).",
     "The build adds a separate dropdown chevron next to the avatar, duplicating the affordance the avatar already provides.",
     "Drop the extra chevron and let the avatar act as the menu trigger, matching the design (or keep a chevron but remove the redundant second affordance).",
     "profile", "ba User", 0.0, 0.0, (92, 7)),
  ]},
 {"slug": "SYSTEM-ADMIN-ADMIN-GRIEVANCES", "name": "Lists — Table pagination & sidebar counts (recurs across roles)",
  "node": "5986:59480", "live": "https://nhapoa-admin-uat.mosje.in/admin/grievances",
  "liveslug": "SYSTEM-ADMIN-ADMIN-GRIEVANCES",
  "findings": [
    ("Table pagination pattern differs from the design", "Components & States", "Minor",
     "The design paginates list tables with numbered page controls (1 2 3 … 125), a current-page marker and a page-size selector ('Showing 10 of N').",
     "Every build list view uses only ← Prev / Next → buttons with a 'Page X of N' counter — no numbered pages and no page-size selector. Recurs on all role list tables.",
     "Adopt the design's numbered pagination component with a page-size selector across all list tables for consistent navigation.",
     "pager", "Page 1 of 961", 0.0, 0.0, (30, 95)),
    ("Sidebar nav count badges absent", "Components & States", "Minor",
     "The design's side navigation carries trailing count badges on active items (e.g. Grievance Monitoring, SLA Monitor, Notifications) using the status-token pills.",
     "The build's sidebar shows the same nav items with no count badges on any role, so at-a-glance workload counts are lost. Recurs across roles.",
     "Add the trailing count-badge component to sidebar nav items per the design, coloured from the status tokens.",
     "navbadge", "Grievance Monitoring", 0.0, 0.0, (15, 16)),
  ]},
]

def judgment_screens():
    screens = []
    for sc in J:
        png_l = f"captures/live/{sc['liveslug']}.png"
        png_f = f"captures/figma/{sc['slug']}.png"
        has_fig = os.path.exists(os.path.join(PROJ, png_f))
        findings = []
        for j, (el, ax, sev, fig, live, fix, section, atext, fdy, ldy, fpct) in enumerate(sc["findings"], 1):
            f = {"num": j, "id": f"NHA-{sc['slug']}-{j:03d}", "element": el, "section": section,
                 "axis": ax, "severity": sev, "figma": fig, "live": live, "fix": fix,
                 "check": "👤 needs human sign-off", "liveImgO": png_l,
                 "_anchor": (atext, ldy, fdy), "_lpct": (fpct[0], fpct[1])}
            if has_fig:
                f["figmaImgO"] = png_f
                f["_fpct"] = (fpct[0], fpct[1])
            findings.append(f)
        screens.append({"slug": sc["slug"], "name": sc["name"],
                        "figmaImg": png_f if has_fig else None, "liveImg": png_l,
                        "figmaUrl": furl(sc["node"]), "liveUrl": sc["live"],
                        "note": None, "findings": findings})
    return screens

# ---------------------------------------------------------------- deferred (by decision)
DEFERRED = [
 {"id": "NHA-DEF-001", "title": "Central Authority — Dashboard, State-Comparison, Scheme-Performance",
  "reason": "No dedicated Figma frame (only Fund-Allocation is designed). Audited against the SAMAVESH visual language; data-viz-heavy analytics deferred to a design pass before pixel comparison."},
 {"id": "NHA-DEF-002", "title": "System-Admin — Analytics, Officer-Performance, Geographic, SLA-Monitor, Categories, Roles",
  "reason": "Undesigned analytics / config screens (no matching frame). Structure + empty-states audited vs the visual language; detailed comparison deferred until frames exist."},
 {"id": "NHA-DEF-003", "title": "Finance Officer — Transactions, Utilisation & role detail/wizard states",
  "reason": "Data-gated screens on an empty UAT (no seeded disbursements). Row-level chip/badge and drill-down states deferred until representative data is seeded."},
 {"id": "NHA-DEF-004", "title": "SHO (Station House Officer) role capture",
  "reason": "Shared-IP login rate-limiter (15-min lockout after the officer login burst) blocked the SHO session this run. SHO uses the District-Officer admin shell, which IS audited; re-capture SHO alone after a full cooldown to close coverage."},
 {"id": "NHA-DEF-005", "title": "Build-only screens (15 captured routes with no Figma frame)",
  "reason": "Extra build routes beyond the designed set (e.g. Register-Rescue flow, admin sub-tabs). Per skill rule #10 + #6 these are routed to the Design Suggestions doc, not flagged as audit findings; each checked only for visual-language conformance."},
]

def main():
    conf_sc = conf_screen()
    jscreens = judgment_screens()
    screens = [conf_sc] + jscreens
    for s in screens:
        G.finalize(s, eng_dir=CAP, base_dir=PROJ)
    G.write_failures(OUT)
    master = {
        "portal": "NHAPOA — National Helpline Against Atrocities (UAT)",
        "idPrefix": "NHA", "generated": os.environ.get("AUDIT_DATE", "2026-07-03"),
        "status": "MACHINE-DRAFT",
        "figmaUrl": "https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5093-18512",
        "method": (f"Fresh live capture of 6 roles ({conf['elements_checked']} elements) + fresh Figma dump. "
                   f"Baseline=derived (token set exported from live Figma variables). DS-adoption {conf['ds_adoption_pct']}%. "
                   f"Coverage gate={ledger['gate']}. 🤖 machine token checks + 👤 Tier-B design-vs-build judgment findings; "
                   "human sign-off required before CERTIFIED."),
        "coverage": ledger["stats"], "coverage_gate": ledger["gate"],
        "ds_adoption_pct": conf["ds_adoption_pct"],
        "deferred": DEFERRED, "screens": screens}
    json.dump(master, open(os.path.join(OUT, "audit-master.json"), "w"), indent=2, ensure_ascii=False)
    nfind = sum(len(s["findings"]) for s in screens)
    print(f"authored: {len(screens)} screens, {nfind} findings, {len(DEFERRED)} deferred; "
          f"failures={len(G.FAILURES)}")

if __name__ == "__main__":
    main()
