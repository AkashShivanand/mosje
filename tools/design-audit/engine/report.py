#!/usr/bin/env python3
"""Render the audit report (project-agnostic) from out/audit-master.json.
Encodes the honesty model: a STATUS badge (MACHINE-DRAFT vs CERTIFIED), coverage +
DS-adoption tiles, and a per-finding 🤖 machine / 👤 human stamp. A portal literally
cannot render CERTIFIED while any finding is still 🤖-only / AWAITING-HUMAN."""
import json, os, html, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config as C

SEV = {"Blocker": "#dc2626", "Major": "#ea580c", "Minor": "#ca8a04", "Nit": "#6b7280"}
PANEL_W = 506

def esc(s): return html.escape(str(s or ""))

def build(project):
    cfg, paths = C.load(project)
    PROJ = paths["project"]
    am = json.load(open(os.path.join(paths["out"], "audit-master.json")))
    def furl(rel): return "file://" + os.path.join(PROJ, rel)
    def exists(rel): return bool(rel) and os.path.exists(os.path.join(PROJ, rel))

    counts = {"Blocker": 0, "Major": 0, "Minor": 0, "Nit": 0}; total = 0
    awaiting = 0
    for s in am["screens"]:
        for f in s["findings"]:
            counts[f["severity"]] = counts.get(f["severity"], 0) + 1; total += 1
            if "👤" in str(f.get("check", "")) or "HUMAN" in str(f.get("check", "")).upper():
                awaiting += 1
    status = am.get("status", "MACHINE-DRAFT")
    # a portal cannot be CERTIFIED while any human cell is unsigned
    if status == "CERTIFIED" and awaiting > 0:
        status = "MACHINE-DRAFT"

    def panel(img_rel, box, pins, side):
        if not exists(img_rel):
            lbl = "Live capture pending" if side == "live" else "No design frame — build-only"
            return f'<div class="crop empty">{esc(lbl)}</div>'
        x1, y1, x2, y2 = box; cw = x2 - x1; scale = PANEL_W / cw
        dispH = round((y2 - y1) * scale); imgw = round(1440 * scale)
        pins_html = "".join(
            f'<span class="pin" style="left:{p[2]/100*PANEL_W:.1f}px;top:{p[3]/100*dispH:.1f}px;background:{SEV.get(p[1],"#6b7280")}">{esc(p[0])}</span>'
            for p in pins)
        return (f'<div class="crop" style="height:{dispH}px">'
                f'<img src="{furl(img_rel)}" style="left:{-x1*scale:.1f}px;top:{-y1*scale:.1f}px;width:{imgw}px"/>{pins_html}</div>')

    def board(screen, section, sf):
        box = sf[0].get("sectionBox", [0, 0, 1440, 900])
        fig_box = sf[0].get("figmaBox", box); live_box = sf[0].get("liveBox", box)
        fig_pins = [(f["num"], f["severity"], f["figmaPin"]["x"], f["figmaPin"]["y"]) for f in sf if f.get("figmaPin")]
        live_pins = [(f["num"], f["severity"], f["livePin"]["x"], f["livePin"]["y"]) for f in sf if f.get("livePin")]
        ids = [f["id"] for f in sf]; idr = ids[0] if len(ids) == 1 else f"{ids[0]} – {ids[-1]}"
        fig_img = sf[0].get("figmaImgO") or screen.get("figmaImg")
        live_img = sf[0].get("liveImgO") or screen.get("liveImg")
        links = ""
        if screen.get("figmaUrl"): links += f'<a href="{esc(screen["figmaUrl"])}">Figma frame ↗</a>'
        if screen.get("liveUrl"): links += f'<a href="{esc(screen["liveUrl"])}">Live page ↗</a>'
        single = not fig_img
        panels = ""
        if not single:
            panels += f'<div class="pwrap"><div class="plabel design"><b>DESIGN</b> Figma intent</div>{panel(fig_img, fig_box, fig_pins, "figma")}</div>'
        panels += f'<div class="pwrap"><div class="plabel build"><b>BUILD</b> {"Live build" if not single else "Live build · machine-checked"}</div>{panel(live_img, live_box, live_pins, "live")}</div>'
        return (f'<div class="board"><div class="bhead"><div class="btitle"><b>{esc(screen["name"])}</b> · <span>{esc(section)}</span></div>'
                f'<div class="bbadge">{esc(idr)}</div></div><div class="panels">{panels}</div>'
                f'<div class="bfoot"><span>{esc(am["portal"])} — {esc(status)} · {esc(am.get("generated",""))}</span><span class="links">{links}</span></div></div>')

    def card(f):
        col = SEV.get(f["severity"], "#6b7280"); stamp = f.get("check", "🤖 machine")
        return (f'<div class="card" style="border-left-color:{col}">'
                f'<div class="chead"><span class="num" style="background:{col}">{esc(f["num"])}</span>'
                f'<span class="ctitle">{esc(f["element"])}</span>'
                f'<span class="stamp">{esc(stamp)}</span>'
                f'<span class="chip" style="background:{col}">{esc(f["severity"])}</span>'
                f'<span class="idb">{esc(f["id"])}</span></div>'
                f'<div class="meta">{esc(f.get("axis",""))}</div>'
                f'<div class="specs"><div class="blk"><div class="lbl design">DESIGN / TOKEN INTENT</div><div class="val">{esc(f["figma"])}</div></div>'
                f'<div class="blk"><div class="lbl build">BUILD — LIVE</div><div class="val">{esc(f["live"])}</div></div></div>'
                f'<div class="fix"><div class="lbl fixl">FIX</div><div class="fval">{esc(f["fix"])}</div></div></div>')

    screen_sections = []
    for s in am["screens"]:
        order = []; bysec = {}
        for f in s["findings"]:
            bysec.setdefault(f["section"], []).append(f)
            if f["section"] not in [o for o in order]: order.append(f["section"])
        sc = {"Blocker": 0, "Major": 0, "Minor": 0, "Nit": 0}
        for f in s["findings"]: sc[f["severity"]] += 1
        chips = "".join(f'<span class="hchip" style="background:{SEV[k]}">{v} {k}</span>' for k, v in sc.items() if v)
        note = f'<div class="note">⚠ {esc(s["note"])}</div>' if s.get("note") else ""
        groups = ""
        for sec in order:
            sf = bysec[sec]
            groups += f'<div class="group">{board(s, sec, sf)}<div class="cards">{"".join(card(f) for f in sf)}</div></div>'
        screen_sections.append(f'<section class="screen"><div class="shead"><h2>{esc(s["name"])}</h2><div class="hchips">{chips}</div></div>{note}{groups}</section>')

    cov = am.get("coverage", {})
    statuscol = {"MACHINE-DRAFT": "#b45309", "CERTIFIED": "#047857"}.get(status, "#b45309")
    gate = am.get("coverage_gate", "n/a")
    cover = (f'<section class="cover"><div class="kicker">DESIGN AUDIT · PROJECT-AGNOSTIC ENGINE</div>'
             f'<h1>{esc(am["portal"])}</h1>'
             f'<div class="statusbar"><span class="statusbadge" style="background:{statuscol}">{esc(status)}</span>'
             f'<span class="sublabel">{"🤖 Machine-scanned — NOT a WCAG/GIGW certification. "+str(awaiting)+" finding(s) await human review." if status=="MACHINE-DRAFT" else "👤 Human-certified"}</span></div>'
             f'<div class="sub">Design-system fidelity + coverage — every element machine-checked against the baseline.</div>'
             f'<div class="tiles">'
             f'<div class="tile"><div class="tnum">{am.get("ds_adoption_pct","–")}%</div><div class="tlabel">DS-ADOPTION</div></div>'
             f'<div class="tile"><div class="tnum">{cov.get("mapped",0)}/{cov.get("figma_frames",0)}</div><div class="tlabel">FRAMES COVERED</div></div>'
             f'<div class="tile"><div class="tnum" style="color:{"#ffa94d" if cov.get("unmapped",0) else "#fff"}">{cov.get("unmapped",0)}</div><div class="tlabel">UNMAPPED (DEBT)</div></div>'
             f'<div class="tile"><div class="tnum">{cov.get("extra_build_only",0)}</div><div class="tlabel">BUILD-ONLY</div></div>'
             f'<div class="tile"><div class="tnum">{total}</div><div class="tlabel">FINDINGS</div></div>'
             f'<div class="tile"><div class="tnum">{esc(gate)}</div><div class="tlabel">COVERAGE GATE</div></div></div>'
             f'<div class="chowto">🤖 = machine-verified · 👤 = requires human sign-off. Coverage gate FAILs while any design frame is UNMAPPED. Baseline + full deviation table in out/.</div></section>')

    CSS = """
* { box-sizing:border-box; margin:0; padding:0; }
body { font-family:'Noto Sans',system-ui,sans-serif; color:#0f2540; font-size:11px; background:#fff; padding:16px; }
.cover { background:#003366; color:#fff; border-radius:16px; padding:44px 50px; }
.cover .kicker { font-size:10px; font-weight:700; letter-spacing:1.6px; color:#7fb0dc; }
.cover h1 { font-size:34px; font-weight:700; letter-spacing:-.5px; margin-top:6px; }
.statusbar { display:flex; align-items:center; gap:12px; margin-top:12px; }
.statusbadge { color:#fff; font-weight:700; font-size:12px; letter-spacing:.5px; border-radius:8px; padding:6px 12px; }
.sublabel { font-size:12px; color:#ffd9a8; }
.cover .sub { font-size:14px; color:#bfd7f0; margin-top:12px; }
.cover .tiles { display:flex; gap:12px; margin-top:20px; flex-wrap:wrap; }
.cover .tile { flex:1; min-width:120px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.16); border-radius:12px; padding:14px; }
.cover .tnum { font-size:26px; font-weight:700; }
.cover .tlabel { font-size:9.5px; font-weight:600; letter-spacing:.4px; color:#9fc0e0; margin-top:6px; }
.cover .chowto { margin-top:20px; padding-top:18px; font-size:11px; color:#a9c6e4; line-height:1.5; border-top:1px solid rgba(255,255,255,.14); }
.screen { margin-top:6px; }
.shead { display:flex; align-items:center; justify-content:space-between; background:#1c2030; border-radius:10px; padding:12px 18px; margin:14px 0; page-break-after:avoid; }
.shead h2 { color:#fff; font-size:18px; font-weight:700; }
.hchips { display:flex; gap:8px; } .hchip { color:#fff; font-weight:600; font-size:11px; border-radius:12px; padding:4px 10px; }
.note { background:#fff7ed; border:1px solid #fed7aa; color:#b45309; border-radius:10px; padding:10px 14px; font-size:12px; margin-bottom:12px; }
.group { margin-bottom:18px; }
.board { border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; background:#fff; margin-bottom:12px; break-inside:avoid; }
.bhead { display:flex; align-items:center; justify-content:space-between; background:#f8fafc; padding:10px 18px; }
.btitle b { color:#003366; font-size:13px; } .btitle span { color:#64748b; }
.bbadge { background:#eef2f7; color:#475569; font-size:10px; font-weight:600; border-radius:14px; padding:5px 11px; }
.panels { display:flex; gap:18px; padding:18px; }
.pwrap { flex:1; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; }
.plabel { font-size:10px; padding:9px 14px; } .plabel b { font-weight:700; }
.plabel.design { background:#fef3e2; color:#b45309; } .plabel.build { background:#eaf2fb; color:#1d4ed8; }
.crop { position:relative; overflow:hidden; line-height:0; background:#fff; }
.crop img { position:absolute; max-width:none; }
.crop.empty { height:110px; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:12px; background:#f8fafc; }
.pin { position:absolute; width:20px; height:20px; margin:-10px 0 0 -10px; border-radius:50%; color:#fff; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; border:2px solid #fff; }
.bfoot { display:flex; align-items:center; justify-content:space-between; border-top:1px solid #e6eaf0; padding:9px 18px; font-size:10px; color:#94a3b8; }
.bfoot .links a { color:#003366; text-decoration:none; margin-left:14px; }
.cards { display:block; }
.card { border:1px solid #e6eaf0; border-left:4px solid; border-radius:12px; padding:14px 18px; margin-bottom:10px; break-inside:avoid; background:#fff; }
.chead { display:flex; align-items:center; gap:10px; }
.num { width:22px; height:22px; border-radius:50%; color:#fff; font-weight:700; font-size:11px; display:flex; align-items:center; justify-content:center; flex:none; }
.ctitle { font-weight:600; font-size:14px; color:#0f2540; flex:1; }
.stamp { font-size:11px; color:#475569; background:#eef2f7; border-radius:10px; padding:3px 9px; font-weight:600; }
.chip { color:#fff; font-weight:600; font-size:11px; border-radius:11px; padding:3px 9px; }
.idb { background:#eef2f7; color:#64748b; font-weight:500; font-size:11px; border-radius:12px; padding:3px 11px; }
.meta { font-size:11px; font-weight:500; color:#94a3b8; margin:5px 0 9px; }
.specs { display:flex; gap:24px; border-top:1px solid #e6eaf0; padding-top:9px; }
.blk { flex:1; } .lbl { font-size:9.5px; font-weight:700; letter-spacing:.6px; margin-bottom:3px; }
.lbl.design { color:#b45309; } .lbl.build { color:#1d4ed8; } .lbl.fixl { color:#047857; }
.val { font-size:12px; color:#334155; line-height:1.45; }
.fix { background:#ecfdf5; border-radius:8px; padding:9px 12px; margin-top:10px; }
.fval { font-size:12px; color:#065f46; font-weight:500; line-height:1.45; }
"""
    sections = [cover] + screen_sections
    doc = f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{"".join(sections)}</body></html>'
    open(os.path.join(paths["out"], "report.html"), "w").write(doc)
    pdf = os.path.join(paths["out"], am["portal"].replace(" ", "-").replace("/", "-") + f"-{status}.pdf")
    css_full = "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap');\n" + CSS
    json.dump({"css": css_full, "sections": sections, "width": 1100, "out": pdf},
              open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "report-sections.json"), "w"))
    r = subprocess.run(["node", os.path.join(os.path.dirname(os.path.abspath(__file__)), "render.js")],
                       cwd=os.path.dirname(os.path.abspath(__file__)), capture_output=True, text=True, timeout=300)
    if r.returncode != 0: print("RENDER ERR:", r.stderr[-600:])
    print("PDF:", pdf, "OK" if os.path.exists(pdf) else "MISSING")
    return pdf

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(); ap.add_argument("--project", required=True)
    a = ap.parse_args(); build(a.project)
