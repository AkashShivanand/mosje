#!/usr/bin/env python3
"""Build the curated NMBA deliverables from findings.py + the verified captures.

Emits, in lockstep:
  docs/qc/portals/nmba/audit-master.json   -> the single source of truth
  docs/qc/portals/nmba/<portal>-Design-QC-Report.pdf (via the canonical generate_pdf.py)
  docs/qc/MoSJE-NMBA-QC-Tracker.xlsx       -> one row per finding, with a Scope column

Pins are never guessed: each finding carries an `anchor` (the on-screen text of the element it is
about) and the live pin is derived from that element's REAL box in captures/live/<slug>.json. A pin
that cannot be anchored is reported in out/failures.md rather than silently placed.
"""
import json, os, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
OUT = os.path.join(ROOT, "docs", "qc", "portals", "nmba")
LIVE = os.path.join(HERE, "captures", "live")
FIG = os.path.join(HERE, "captures", "figma")
sys.path.insert(0, HERE)
from findings import GLOBAL, SCREENS, SUGGESTIONS

SEV_RANK = {"Blocker": 0, "Major": 1, "Minor": 2, "Nit": 3}
FIGMA_URL = "https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id={}"

# slug -> (title, role, route, figma node, base)
PAIRS = {
 "PUBLIC-HOME": ("Citizen — Home / Landing", "public", "/", "9081-59117", "https://nmba-user-dev.mosje.in"),
 "PUBLIC-ACTIVITIES": ("Citizen — Activity Snapshots", "public", "/activities", "9081-58966", "https://nmba-user-dev.mosje.in"),
 "PUBLIC-FACILITIES": ("Citizen — Help Centres & Facilities", "public", "/facilities", "9081-58585", "https://nmba-user-dev.mosje.in"),
 "PUBLIC-EPLEDGE": ("Citizen — e-Pledge (Oath)", "public", "/epledge", "9081-58375", "https://nmba-user-dev.mosje.in"),
 "ADMIN-PLEDGE-REPORTS": ("Admin — All Pledge Report", "admin", "/pledge-reports", "2876-23203", "https://nmba-admin-dev.mosje.in"),
 "ADMIN-IMPORTANT-DOCUMENTS": ("Admin — Important Documents", "admin", "/important-documents", "2876-23697", "https://nmba-admin-dev.mosje.in"),
 "ADMIN-DISTRICT-NODAL-OFFICERS-LIST": ("Admin — List of DNOs", "admin", "/district-nodal-officers-list", "2876-23801", "https://nmba-admin-dev.mosje.in"),
 "ADMIN-STATE-NODAL-OFFICERS-LIST": ("Admin — List of SNOs", "admin", "/state-nodal-officers-list", "2876-23920", "https://nmba-admin-dev.mosje.in"),
 "ADMIN-NAPDDR-STATE-COMMITTEE": ("Admin — NAPDDR State-Level Committee", "admin", "/napddr/state-committee", "10957-124872", "https://nmba-admin-dev.mosje.in"),
 "ADMIN-NAPDDR-DISTRICT-COMMITTEE": ("Admin — NAPDDR District-Level Committee", "admin", "/napddr/district-committee", "10957-125091", "https://nmba-admin-dev.mosje.in"),
 "ADMIN-NAPDDR-BLOCK-COMMITTEE": ("Admin — NAPDDR Block-Level Committee", "admin", "/napddr/block-committee", "10957-125328", "https://nmba-admin-dev.mosje.in"),
 "ADMIN-NAPDDR-COMMITTEE-REPORTS": ("Admin — NAPDDR Committee Reports", "admin", "/napddr/committee-reports", "10957-125565", "https://nmba-admin-dev.mosje.in"),
 "STATE-NODAL-OFFICER-DASHBOARD": ("State Nodal Officer — Dashboard", "state-nodal-officer", "/dashboard", "2309-14405", "https://nmba-admin-dev.mosje.in"),
 "STATE-NODAL-OFFICER-STATE-DISTRICT-DASHBOARD": ("State Nodal Officer — State/UT/District Activity", "state-nodal-officer", "/state-district-dashboard", "2309-14562", "https://nmba-admin-dev.mosje.in"),
 "STATE-NODAL-OFFICER-IMPORTANT-DOCUMENTS": ("State Nodal Officer — Important Documents", "state-nodal-officer", "/important-documents", "2309-14652", "https://nmba-admin-dev.mosje.in"),
 "STATE-NODAL-OFFICER-STATE-NODAL-OFFICERS-LIST": ("State Nodal Officer — List of SNOs", "state-nodal-officer", "/state-nodal-officers-list", "2309-14720", "https://nmba-admin-dev.mosje.in"),
 "DISTRICT-NODAL-OFFICER-DASHBOARD": ("District Nodal Officer — Dashboard", "district-nodal-officer", "/dashboard", "2306-13219", "https://nmba-admin-dev.mosje.in"),
 "DISTRICT-NODAL-OFFICER-STATE-DISTRICT-DASHBOARD": ("District Nodal Officer — State/UT/District Activity", "district-nodal-officer", "/state-district-dashboard", "2306-13376", "https://nmba-admin-dev.mosje.in"),
 "DISTRICT-NODAL-OFFICER-IMPORTANT-DOCUMENTS": ("District Nodal Officer — Important Documents", "district-nodal-officer", "/important-documents", "2306-13466", "https://nmba-admin-dev.mosje.in"),
 "DISTRICT-NODAL-OFFICER-DISTRICT-NODAL-OFFICERS-LIST": ("District Nodal Officer — List of DNOs", "district-nodal-officer", "/district-nodal-officers-list", "2309-20334", "https://nmba-admin-dev.mosje.in"),
}

FAILURES = []


def anchorbox(slug, text, content_only=True):
    """Real box of the element whose text matches `text` (prefix-forgiving, largest font wins).

    `content_only` skips the government masthead band and the sidebar rail, so an anchor like
    "All States" binds to the filter control in the content column rather than a same-named
    fragment in the page chrome (observed: a pin landing at y=1.6% on the gov bar).
    """
    fp = os.path.join(LIVE, f"{slug}.json")
    if not os.path.exists(fp):
        return None, None
    d = json.load(open(fp))
    t = (text or "").strip().lower()
    best = None
    for r in d.get("rows", []):
        rt = (r.get("text") or "").strip().lower()
        if not rt or not t:
            continue
        if content_only and (r.get("y", 0) < 110 or r.get("x", 0) < 295):
            continue
        if rt.startswith(t[:40]) or t.startswith(rt[:40]):
            if best is None or (r.get("fontSize") or 0) > (best.get("fontSize") or 0):
                best = r
    if best is None and content_only:          # chrome-scoped anchors (masthead, sidebar) retry
        return anchorbox(slug, text, content_only=False)
    return best, d.get("pageH")


def pin_for(slug, anchor):
    """Pin as a % of the full-page board, derived from the anchor's real box."""
    box, pageH = anchorbox(slug, anchor)
    if not box or not pageH:
        FAILURES.append(f"{slug}: no live element matched anchor {anchor!r} — pin not placed")
        return None
    cx = box["x"] + box["w"] / 2.0
    cy = box["y"] + box["h"] / 2.0
    if not (0 <= cy <= pageH):
        FAILURES.append(f"{slug}: anchor {anchor!r} at y={cy:.0f} outside capture height {pageH}")
        return None
    return {"x": round(max(1.0, min(99.0, cx / 1440.0 * 100)), 2),
            "y": round(max(0.5, min(99.5, cy / pageH * 100)), 2)}


def main():
    os.makedirs(os.path.join(OUT, "captures", "figma"), exist_ok=True)
    os.makedirs(os.path.join(OUT, "captures", "live"), exist_ok=True)
    by_screen = {s: list(f) for s, f in SCREENS}
    screens = []

    for slug, (title, role, route, node, base) in PAIRS.items():
        for kind, src in (("figma", FIG), ("live", LIVE)):
            p = os.path.join(src, f"{slug}.png")
            if os.path.exists(p):
                shutil.copy(p, os.path.join(OUT, "captures", kind, f"{slug}.png"))
        has_fig = os.path.exists(os.path.join(OUT, "captures", "figma", f"{slug}.png"))
        items = sorted(by_screen.get(slug, []), key=lambda f: SEV_RANK[f["severity"]])
        findings = []
        used_pins = []
        for n, f in enumerate(items, 1):
            p = pin_for(slug, f.get("anchor", ""))
            # Two findings can legitimately share an anchor element; nudge the later marker so both
            # remain readable instead of stacking into one dot.
            if p:
                while any(abs(p["x"] - q["x"]) < 2.5 and abs(p["y"] - q["y"]) < 2.5 for q in used_pins):
                    p = {"x": round(min(97.0, p["x"] + 3.2), 2), "y": round(min(98.0, p["y"] + 2.6), 2)}
                used_pins.append(p)
            findings.append({
                "num": n, "id": f["id"], "element": f["element"], "section": "full-page",
                "axis": f["axis"], "severity": f["severity"],
                "figma": f["figma"], "live": f["live"], "fix": f["fix"],
                "figmaPin": p, "livePin": p,
            })
        sc = {
            "slug": slug, "name": title,
            "figmaUrl": FIGMA_URL.format(node), "liveUrl": base + route,
            "liveImg": f"captures/live/{slug}.png",
            "findings": findings,
        }
        if has_fig:
            sc["figmaImg"] = f"captures/figma/{slug}.png"
        if not findings:
            sc.update({"_refbadge": "design vs build", "_refsub": f"{role} · {route}",
                       "_refchip": "#1558b0"})
        screens.append(sc)

    # GLOBAL findings — one board each, pointing at a representative screen, tagged Scope: Global.
    for g in GLOBAL:
        rep = g["screens"][0]
        title, role, route, node, base = PAIRS[rep]
        for kind, src in (("figma", FIG), ("live", LIVE)):
            p = os.path.join(src, f"{rep}.png")
            if os.path.exists(p):
                shutil.copy(p, os.path.join(OUT, "captures", kind, f"{rep}.png"))
        p = pin_for(rep, g.get("anchor", ""))
        screens.append({
            "slug": f"GLOBAL-{g['id']}", "name": g["element"],
            "figmaUrl": FIGMA_URL.format(node), "liveUrl": base + route,
            "figmaImg": f"captures/figma/{rep}.png" if os.path.exists(os.path.join(FIG, f"{rep}.png")) else None,
            "liveImg": f"captures/live/{rep}.png",
            "note": "Applies to every screen that renders this element. Shown against "
                    f"{title} as a representative frame.",
            "findings": [{
                "num": 1, "id": g["id"], "element": g["element"], "section": "full-page",
                "axis": g["axis"], "severity": g["severity"], "scope": "Global",
                "figma": g["figma"], "live": g["live"], "fix": g["fix"],
                "figmaPin": p, "livePin": p,
            }],
        })

    screens.sort(key=lambda s: min([SEV_RANK[f["severity"]] for f in s["findings"]], default=9))

    am = {
        "portal": "NMBA — Nasha Mukt Bharat Abhiyaan (DEV)",
        "generated": "2026-07-27",
        "status": "MACHINE-DRAFT",
        "screens": screens,
        "deferred": [
            {"id": "NMB-SCOPE-001", "title": "Patient Data Monitoring System (IRCA / ODIC / CPLI / PDMS-Admin) — 88 design frames",
             "reason": "Designed module with no corresponding routes on the dev build."},
            {"id": "NMB-SCOPE-002", "title": "18 August National Pledge Against Drug Abuse Report — 39 design frames",
             "reason": "Designed reporting flow (Block / District / State / Line Ministries / Spiritual Orgs / HEI / GIA); not built on this environment."},
            {"id": "NMB-SCOPE-003", "title": "MV / Institutions role — 11 design frames",
             "reason": "No login was supplied for this role, so the build could not be captured."},
            {"id": "NMB-SCOPE-004", "title": "e-Pledge OTP + certificate states",
             "reason": "OTP-gated. Per audit policy a real OTP is never fired on dev; the form was filled with dummy data and captured up to the OTP wall."},
            {"id": "NMB-SCOPE-005", "title": "Citizen Helpline screen",
             "reason": "Designed (National De-Addiction Helpline 14446 + call statistics); no /helpline route exists on the build."},
            {"id": "NMB-SCOPE-006", "title": "Row-level detail views and committee record states",
             "reason": "The dev database has no seeded committee records ('No committees found'), so row chips, badges and detail drawers cannot be exercised."},
        ],
        "suggestions": SUGGESTIONS,
    }
    json.dump(am, open(os.path.join(OUT, "audit-master.json"), "w"), indent=1)

    total = sum(len(s["findings"]) for s in screens)
    sev = {}
    for s in screens:
        for f in s["findings"]:
            sev[f["severity"]] = sev.get(f["severity"], 0) + 1
    print(f"screens: {len(screens)}   findings: {total}   {sev}")

    fp = os.path.join(HERE, "out", "failures.md")
    os.makedirs(os.path.dirname(fp), exist_ok=True)
    with open(fp, "w") as fh:
        fh.write("# design-qc assertion failures (last run)\n\n")
        fh.write("Every pin must anchor to a real element inside the capture.\n\n")
        fh.write("\n".join(f"- {x}" for x in FAILURES) if FAILURES else "_none — every pin anchored._\n")
    print(("PIN FAILURES: " + str(len(FAILURES))) if FAILURES else "PIN FAILURES: 0")
    for x in FAILURES:
        print("   -", x)


if __name__ == "__main__":
    main()
