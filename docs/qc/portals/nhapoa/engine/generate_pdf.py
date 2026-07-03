#!/usr/bin/env python3
"""Generate the Design QC PDF from audit-master.json (portal name + output filename come from the
JSON, so this is project-agnostic). HTML -> one dynamically-sized page per screen via render.js.
Source of truth: audit-master.json (kept in sync with the Figma report).
"""
import json, os, html, subprocess, sys

BASE = os.path.dirname(os.path.abspath(__file__))
am = json.load(open(os.path.join(BASE, "audit-master.json")))

SEV = {"Blocker":"#dc2626","Major":"#ea580c","Minor":"#ca8a04","Nit":"#6b7280"}
TINT = {"design":"#fef3e2","build":"#eaf2fb","fix":"#ecfdf5"}
PANEL_W = 506  # px per panel in the comparison board

def esc(s): return html.escape(str(s or ""))
def furl(rel): return "file://" + os.path.join(BASE, rel)
def exists(rel): return bool(rel) and os.path.exists(os.path.join(BASE, rel))

# ---- counts ----
counts = {"Blocker":0,"Major":0,"Minor":0,"Nit":0}; total=0
for s in am["screens"]:
    for f in s["findings"]:
        counts[f["severity"]] = counts.get(f["severity"],0)+1; total+=1
screens_n = len(am["screens"])

def panel(img_rel, box, pins, side):
    """A cropped screenshot panel with pins. side: 'figma'|'live'. pins: list of (num,sev,xPct,yPct).
    When the image file is missing, renders a styled placeholder (canonical style is preserved even
    before a capture lands) instead of a broken <img> — never hand-roll a different layout for this."""
    if not exists(img_rel):
        if side == "live":
            lbl, sub = "Live build capture pending", "save the capture and re-run"
        else:
            lbl, sub = "No Figma design — frame collapsed", "live-only, no side-by-side comparison"
        return (f'<div class="crop empty">{esc(lbl)}'
                f'<div class="empty-sub">{esc(sub)}</div></div>')
    x1,y1,x2,y2 = box
    cw, ch = (x2-x1), (y2-y1)
    scale = PANEL_W / cw
    dispH = round(ch*scale)
    imgw = round(1440*scale)
    pin_html = ""
    for num,sev,px,py in pins:
        left = px/100*PANEL_W; top = py/100*dispH
        pin_html += (f'<span class="pin" style="left:{left:.1f}px;top:{top:.1f}px;'
                     f'background:{SEV.get(sev,"#6b7280")}">{esc(num)}</span>')
    return (f'<div class="crop" style="height:{dispH}px">'
            f'<img src="{furl(img_rel)}" style="left:{-x1*scale:.1f}px;top:{-y1*scale:.1f}px;width:{imgw}px"/>'
            f'{pin_html}</div>')

def board(screen, section, sec_findings):
    box = sec_findings[0].get("sectionBox", [0,0,1440,900])
    fig_box = sec_findings[0].get("figmaBox", box)   # per-section crop override (design)
    live_box = sec_findings[0].get("liveBox", box)   # per-section crop override (build) — use when
                                                     # design & build captures differ in proportion
    fig_pins=[(f["num"],f["severity"],f["figmaPin"]["x"],f["figmaPin"]["y"]) for f in sec_findings if f.get("figmaPin")]
    live_pins=[(f["num"],f["severity"],f["livePin"]["x"],f["livePin"]["y"]) for f in sec_findings if f.get("livePin")]
    ids=[f["id"] for f in sec_findings]
    idrange = ids[0] if len(ids)==1 else f"{ids[0]} – {ids[-1]}"
    figma_img = sec_findings[0].get("figmaImgO") or screen.get("figmaImg")
    live_img = sec_findings[0].get("liveImgO") or screen.get("liveImg")
    title = screen["name"]
    links=""
    if screen.get("figmaUrl"): links+=f'<a href="{esc(screen["figmaUrl"])}">Figma frame ↗</a>'
    if screen.get("liveUrl"): links+=f'<a href="{esc(screen["liveUrl"])}">Live page ↗</a>'
    single = not figma_img
    panels = ""
    if not single:
        panels += (f'<div class="pwrap"><div class="plabel design"><b>DESIGN</b> Figma intent</div>'
                   f'{panel(figma_img, fig_box, fig_pins, "figma")}</div>')
    panels += (f'<div class="pwrap"><div class="plabel build"><b>BUILD</b> '
               f'{"Live build · no Figma comparison" if single else "Live build"}</div>'
               f'{panel(live_img, live_box, live_pins, "live")}</div>')
    return (f'<div class="board">'
            f'<div class="bhead"><div class="btitle"><b>{esc(title)}</b> · <span>{esc(section)}</span></div>'
            f'<div class="bbadge">{esc(idrange)}</div></div>'
            f'<div class="panels">{panels}</div>'
            f'<div class="bfoot"><span>{esc(am["portal"])} — Design QC · {esc(am.get("generated",""))}</span>'
            f'<span class="links">{links}</span></div></div>')

def card(f):
    sev=f["severity"]; col=SEV.get(sev,"#6b7280")
    return (f'<div class="card" style="border-left-color:{col}">'
            f'<div class="chead"><span class="num" style="background:{col}">{esc(f["num"])}</span>'
            f'<span class="ctitle">{esc(f["element"])}</span>'
            f'<span class="chip" style="background:{col}">{esc(sev)}</span>'
            f'<span class="idb">{esc(f["id"])}</span></div>'
            f'<div class="meta">{esc(f.get("axis",""))}</div>'
            f'<div class="specs"><div class="blk"><div class="lbl design">DESIGN — FIGMA INTENT</div>'
            f'<div class="val">{esc(f["figma"])}</div></div>'
            f'<div class="blk"><div class="lbl build">BUILD — LIVE</div>'
            f'<div class="val">{esc(f["live"])}</div></div></div>'
            f'<div class="fix"><div class="lbl fixl">FIX</div><div class="fval">{esc(f["fix"])}</div></div>'
            f'</div>')

def severity_chip_legend():
    # consistent tiles (number + label), accessible bright colours on navy
    bright={"Blocker":"#ff6b6b","Major":"#ffa94d","Minor":"#ffd43b","Nit":"#ced4da"}
    out=""
    for sev in ["Blocker","Major","Minor","Nit"]:
        out+=f'<div class="tile"><div class="tnum" style="color:{bright[sev]}">{counts[sev]}</div><div class="tlabel">{sev.upper()}</div></div>'
    return out

# ---- build screens ----
screen_sections=[]
for s in am["screens"]:
    # group findings by section preserving first-appearance order
    order=[]; bysec={}
    for f in s["findings"]:
        sec=f["section"]
        if sec not in bysec: bysec[sec]=[]; order.append(sec)
        bysec[sec].append(f)
    sc={"Blocker":0,"Major":0,"Minor":0,"Nit":0}
    for f in s["findings"]: sc[f["severity"]]+=1
    chips="".join(f'<span class="hchip" style="background:{SEV[k]}">{v} {k}</span>' for k,v in sc.items() if v)
    note = f'<div class="note">⚠ {esc(s["note"])}</div>' if s.get("note") else ""
    groups=""
    for sec in order:
        sf=bysec[sec]
        cards="".join(card(f) for f in sf)
        groups+=f'<div class="group">{board(s, sec, sf)}<div class="cards">{cards}</div></div>'
    screen_sections.append(f'<section class="screen"><div class="shead"><h2>{esc(s["name"])}</h2>'
                   f'<div class="hchips">{chips}</div></div>{note}{groups}</section>')
screens_html="".join(screen_sections)

# ---- deferred (optional): items parked by decision (e.g. approved divergence), not dropped ----
defer = am.get("deferred", [])
defer_html = ""
if defer:
    rows = "".join(f'<div class="drow"><span class="did">{esc(d["id"])}</span>'
                   f'<span class="dtitle">{esc(d.get("title",""))}</span>'
                   f'<div class="dreason">{esc(d.get("reason",""))}</div></div>' for d in defer)
    defer_html = (f'<section class="screen"><div class="shead alt"><h2>Deferred — by decision</h2>'
                  f'<div class="hchips"><span class="hchip" style="background:#6b7280">{len(defer)} Parked</span></div></div>'
                  f'<div class="defer">{rows}</div></section>')

cover=(f'<section class="cover"><div class="kicker">MINISTRY OF SOCIAL JUSTICE &amp; EMPOWERMENT &nbsp;·&nbsp; DESIGN QC</div>'
       f'<h1>{esc(am["portal"])}</h1><div class="sub">Design Quality Audit — Figma design intent vs. live build</div>'
       f'<div class="meta">{screens_n} screens &nbsp;·&nbsp; {total} findings &nbsp;·&nbsp; Generated {esc(am.get("generated",""))}</div>'
       f'<div class="tiles"><div class="tile"><div class="tnum">{total}</div><div class="tlabel">TOTAL FINDINGS</div></div>'
       f'{severity_chip_legend()}'
       f'<div class="tile"><div class="tnum">{screens_n}</div><div class="tlabel">SCREENS</div></div></div>'
       f'<div class="chowto">Each finding is pinned on the side-by-side screenshots and detailed below with its exact fix and severity.</div></section>')

CSS = """
* { box-sizing:border-box; margin:0; padding:0; }
body { font-family:'Noto Sans',system-ui,sans-serif; color:#0f2540; font-size:11px; background:#fff; padding:16px; }
.cover { background:#003366; color:#fff; border-radius:16px; padding:46px 52px; }
.cover .chowto { margin-top:22px; padding-top:22px; font-size:11.5px; color:#a9c6e4; line-height:1.5; border-top:1px solid rgba(255,255,255,.14); }
.cover .kicker { font-size:10px; font-weight:700; letter-spacing:1.6px; color:#7fb0dc; }
.cover h1 { font-size:38px; font-weight:700; letter-spacing:-.5px; margin-top:6px; }
.cover .sub { font-size:15px; color:#bfd7f0; margin-top:6px; }
.cover .meta { font-size:12px; color:#8fb3d6; margin-top:6px; }
.cover .tiles { display:flex; gap:14px; margin-top:22px; }
.cover .tile { flex:1; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.16); border-radius:12px; padding:14px; }
.cover .tnum { font-size:30px; font-weight:700; }
.cover .tlabel { font-size:10px; font-weight:600; letter-spacing:.4px; color:#9fc0e0; margin-top:6px; }
.cover .tile .chip { margin-top:6px; }
.chip { display:inline-block; color:#fff; font-weight:600; font-size:11px; border-radius:11px; padding:3px 9px; }
.screen { }
.shead { display:flex; align-items:center; justify-content:space-between; background:#1c2030; border-radius:10px; padding:12px 18px; margin-bottom:14px; page-break-after:avoid; }
.shead h2 { color:#fff; font-size:19px; font-weight:700; }
.hchips { display:flex; gap:8px; } .hchip { color:#fff; font-weight:600; font-size:11px; border-radius:12px; padding:4px 10px; }
.note { background:#fff7ed; border:1px solid #fed7aa; color:#b45309; border-radius:10px; padding:10px 14px; font-size:12px; margin-bottom:12px; page-break-after:avoid; }
.group { margin-bottom:18px; }
.board { border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; background:#fff; margin-bottom:12px; }
.bhead { display:flex; align-items:center; justify-content:space-between; background:#f8fafc; padding:10px 18px; }
.btitle b { color:#003366; font-size:13px; } .btitle span { color:#64748b; }
.bbadge { background:#eef2f7; color:#475569; font-size:10px; font-weight:600; border-radius:14px; padding:5px 11px; }
.panels { display:flex; gap:18px; padding:18px; }
.pwrap { flex:1; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; }
.plabel { font-size:10px; padding:9px 14px; } .plabel b { font-weight:700; }
.plabel.design { background:#fef3e2; color:#d9913f; } .plabel.design b { color:#b45309; }
.plabel.build { background:#eaf2fb; color:#5b86c9; } .plabel.build b { color:#1d4ed8; }
.crop { position:relative; overflow:hidden; line-height:0; background:#fff; }
.crop img { position:absolute; max-width:none; }
.crop.empty { height:120px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#94a3b8; font-size:12px; line-height:1.4; }
.crop.empty .empty-sub { font-size:10px; color:#cbd5e1; }
.pin { position:absolute; width:20px; height:20px; margin:-10px 0 0 -10px; border-radius:50%; color:#fff;
  font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; border:2px solid #fff; box-sizing:border-box; }
.bfoot { display:flex; align-items:center; justify-content:space-between; border-top:1px solid #e6eaf0; padding:9px 18px; font-size:10px; color:#94a3b8; }
.bfoot .links a { color:#003366; text-decoration:none; margin-left:14px; }
.board { break-inside:avoid; page-break-inside:avoid; }
.cards { display:block; }
.card { border:1px solid #e6eaf0; border-left:4px solid; border-radius:12px; padding:14px 18px; margin-bottom:10px; break-inside:avoid; page-break-inside:avoid; background:#fff; }
.chead { display:flex; align-items:center; gap:10px; }
.num { width:22px; height:22px; border-radius:50%; color:#fff; font-weight:700; font-size:11px; display:flex; align-items:center; justify-content:center; flex:none; }
.ctitle { font-weight:600; font-size:14px; color:#0f2540; flex:1; }
.idb { background:#eef2f7; color:#64748b; font-weight:500; font-size:11px; border-radius:12px; padding:3px 11px; }
.meta { font-size:11px; font-weight:500; color:#94a3b8; margin:5px 0 9px; } .meta b { font-weight:700; }
.specs { display:flex; gap:24px; border-top:1px solid #e6eaf0; padding-top:9px; }
.blk { flex:1; } .lbl { font-size:9.5px; font-weight:700; letter-spacing:.6px; margin-bottom:3px; }
.lbl.design { color:#b45309; } .lbl.build { color:#1d4ed8; } .lbl.fixl { color:#047857; }
.val { font-size:12px; color:#334155; line-height:1.45; }
.fix { background:#ecfdf5; border-radius:8px; padding:9px 12px; margin-top:10px; }
.fval { font-size:12px; color:#065f46; font-weight:500; line-height:1.45; }
.shead.alt { background:#334155; }
.crop.empty { background:#f8fafc; }
.drow { border:1px solid #e6eaf0; border-left:4px solid #6b7280; border-radius:12px; padding:12px 16px; margin-bottom:10px; background:#fff; }
.drow .did { background:#eef2f7; color:#475569; font-weight:600; font-size:11px; border-radius:12px; padding:3px 10px; margin-right:8px; }
.drow .dtitle { font-weight:600; font-size:13px; color:#0f2540; }
.drow .dreason { font-size:11.5px; color:#64748b; margin-top:6px; line-height:1.5; }
"""

doc=(f'<!doctype html><html><head><meta charset="utf-8">'
     f'<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'
     f'<style>{CSS}</style></head><body>{cover}{screens_html}{defer_html}</body></html>')

html_path=os.path.join(BASE,"report-generated.html")
pdf_path=os.path.join(BASE, am["portal"].replace(" ","-").replace("/","-")+"-Design-QC-Report.pdf")
open(html_path,"w").write(doc)
print("HTML written:", html_path, len(doc), "bytes")

# Dynamic page sizing: each section (cover + each screen) becomes ONE page sized to its content.
css_full="@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap');\n"+CSS
sections=[cover]+screen_sections+([defer_html] if defer_html else [])
json.dump({"css":css_full,"sections":sections,"width":1100,"out":pdf_path},
          open(os.path.join(BASE,"report-sections.json"),"w"))
print("Sections:", len(sections), "— rendering one dynamically-sized page per screen via Node/puppeteer")
r=subprocess.run(["node", os.path.join(BASE,"render.js")], cwd=BASE, capture_output=True, text=True, timeout=300)
if r.stdout.strip(): print(r.stdout.strip())
if r.returncode!=0: print("RENDER ERR:", r.stderr[-900:])
print("PDF:", pdf_path, (str(os.path.getsize(pdf_path))+" bytes") if os.path.exists(pdf_path) else "MISSING")
