#!/usr/bin/env python3
"""Design Suggestions PDF — the DESIGN-side deliverable (token decisions, Figma frame fixes,
undesigned screens), separate from the dev fidelity report (generate_pdf.py). Same visual language.

Reads suggestions.json next to this script. Two accepted shapes:
  1. A flat array of items (back-compat):            [ {item}, {item}, ... ]
  2. An object with meta + items (preferred):         { "portal": "...", "generated": "YYYY-MM-DD",
                                                        "items": [ {item}, ... ] }
Item: {id, group:"A"|"B"|"C"|"D", type:"Decide"|"Design"|"Propose", title, observed, recommendation,
       board?: {figmaImg?, liveImg?, box:[x1,y1,x2,y2], figmaBox?, liveBox?, figmaBasis?, liveBasis?,
                figmaMarks?:[[n,[x1,y1,x2,y2],label]], liveMarks?:[...],
                figmaPins?:[[n,x,y]], livePins?:[[n,x,y]]}}
Marks (2026-09-18) are the preferred annotation: an outline on the element's real box plus a
callout with the measured value — see qc_marks.py and MoSJE docs/qc/annotation-system.md. Pins
still render for older files. `*Basis` is the width the boxes are expressed in (a 1320-wide design
frame, a 375-wide phone capture); it defaults to 1440.
Groups: A — program-level decisions · B — updates to existing Figma frames ·
        C — views built live with no design · D — UI/UX changes to make in the design.
Run: cd <outdir> && python3 generate_suggestions.py   (needs render.js + node_modules alongside)
"""
import json, os, html, subprocess, struct, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qc_marks import marks_html, MARK_CSS  # noqa: E402

BASE = os.path.dirname(os.path.abspath(__file__))
def esc(t): return html.escape(str(t))
def furl(p): return "file://" + os.path.join(BASE, p)
PANEL = 506
SEV = {"Decide": "#7c3aed", "Design": "#b45309", "Propose": "#1d4ed8"}

raw = json.load(open(os.path.join(BASE, "suggestions.json")))
if isinstance(raw, dict):
    PORTAL = raw.get("portal", "Portal"); GEN = raw.get("generated", "")
    ITEMS = raw.get("items", [])
else:
    PORTAL = "Portal"; GEN = ""; ITEMS = raw

def _dims(p):
    with open(p, "rb") as fh:
        head = fh.read(2)
        if head == b"\xff\xd8":
            while True:
                b = fh.read(1)
                if not b:
                    raise ValueError("truncated jpeg")
                if b != b"\xff":
                    continue
                m = fh.read(1)
                while m == b"\xff":
                    m = fh.read(1)
                mk = m[0]
                if mk in (0xD8, 0x01) or 0xD0 <= mk <= 0xD7:
                    continue
                ln = struct.unpack(">H", fh.read(2))[0]
                if 0xC0 <= mk <= 0xCF and mk not in (0xC4, 0xC8, 0xCC):
                    fh.read(1)
                    h, w = struct.unpack(">HH", fh.read(4))
                    return w, h
                fh.seek(ln - 2, 1)
        fh.seek(16)
        return struct.unpack(">II", fh.read(8))


def panel(img, box, pins, label, color, marks=None, basis=1440, pw=PANEL):
    x1, y1, x2, y2 = box; cw, ch = x2 - x1, y2 - y1; sc = pw / cw; H = round(ch * sc); W = round(basis * sc)
    ph = "".join(f'<span class="pin" style="left:{px/100*pw:.0f}px;top:{py/100*H:.0f}px">{n}</span>' for n, px, py in pins)
    mk, gut = "", 0
    if marks:
        single = len(marks) == 1          # a lone mark carries no number
        disp = [(None if single else n, color, ((b[0]-x1)*sc-3, (b[1]-y1)*sc-3, (b[2]-x1)*sc+3, (b[3]-y1)*sc+3), lab)
                for n, b, lab in marks]
        mk, gut = marks_html(disp, pw, H, 250 if pw < 700 else 380)
    try:
        iw, ih = _dims(os.path.join(BASE, img))
        bottom = max(0.0, ih * basis / iw * sc - y2 * sc)
    except Exception:
        bottom = 0.0
    g = f'<div class="gut" style="top:{H}px;height:{gut}px"></div>' if gut else ""
    return (f'<div class="pwrap"><div class="plabel" style="color:{color}"><b>{esc(label)}</b></div>'
            f'<div class="crop" style="height:{H+gut}px"><img src="{furl(img)}" style="left:{-x1*sc:.0f}px;'
            f'top:{-y1*sc:.0f}px;width:{W}px;clip-path:inset({y1*sc:.1f}px 0 {bottom:.1f}px 0)"/>{g}{ph}{mk}</div></div>')


def board(item):
    b = item.get("board")
    if not b: return ""
    panels = ""
    both = bool(b.get("figmaImg")) and bool(b.get("liveImg"))
    pw = PANEL if both else 1030
    if b.get("figmaImg"):
        panels += panel(b["figmaImg"], b.get("figmaBox") or b["box"], b.get("figmaPins", []),
                        "DESIGN — current Figma", "#b45309", b.get("figmaMarks"), b.get("figmaBasis", 1440), pw)
    if b.get("liveImg"):
        panels += panel(b["liveImg"], b.get("liveBox") or b["box"], b.get("livePins", []),
                        "LIVE — current build", "#1d4ed8", b.get("liveMarks"), b.get("liveBasis", 1440), pw)
    return f'<div class="board"><div class="panels">{panels}</div></div>'

def card(i, item):
    tag = item["type"]
    return (f'<div class="item"><div class="ihead"><span class="num">{i}</span>'
            f'<span class="ttl">{esc(item["title"])}</span>'
            f'<span class="chip" style="background:{SEV.get(tag, "#64748b")}">{esc(tag)}</span>'
            f'<span class="iid">{esc(item["id"])}</span></div>'
            f'{board(item)}'
            f'<div class="ibody"><div class="lbl">OBSERVED</div><p>{esc(item["observed"])}</p>'
            + (('<ul>' + "".join(f"<li>{esc(x)}</li>" for x in item["list"]) + '</ul>') if item.get("list") else "")
            + f'<div class="lbl rec">RECOMMENDATION</div><p class="recp">{esc(item["recommendation"])}</p>'
            + (f'<p style="font-size:11px;margin-top:8px"><a href="{esc(item["link"])}" style="color:#003366">'
               f'{esc(item.get("linkLabel", "Open in Figma ↗"))}</a></p>' if item.get("link") else "")
            + '</div></div>')

CSS = """
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact}
body{font-family:'Noto Sans',-apple-system,sans-serif;background:#fff;color:#334155;padding:16px;width:1100px}
.cover{background:#003366;border-radius:16px;padding:46px 52px;color:#fff;margin-bottom:18px}
.cover .k{font-size:11px;letter-spacing:2.5px;color:#7fb0dc;font-weight:700}
.cover h1{font-size:30px;margin:6px 0 4px}.cover p{color:#bfd7f0;font-size:13px}
.sec{margin:20px 0 10px;font-size:15px;font-weight:700;color:#0f2540;border-bottom:2px solid #e6eaf0;padding-bottom:6px}
.item{border:1px solid #e6eaf0;border-radius:12px;margin:12px 0;overflow:hidden}
.ihead{display:flex;align-items:center;gap:10px;padding:12px 16px;background:#f8fafc}
.num{width:22px;height:22px;border-radius:50%;background:#0f2540;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center}
.ttl{flex:1;font-size:14px;font-weight:700;color:#0f2540}
.chip{color:#fff;font-size:10px;font-weight:700;padding:3px 10px;border-radius:999px}
.iid{font-size:10px;color:#64748b;background:#eef2f7;padding:3px 8px;border-radius:999px}
.board{padding:12px 16px 0}.panels{display:flex;gap:14px}
.pwrap{flex:1}.plabel{font-size:10px;font-weight:600;padding:6px 2px}
.crop{position:relative;overflow:hidden;border:1px solid #e6eaf0;border-radius:8px;line-height:0;background:#fff}
.crop img{position:absolute;max-width:none}
.pin{position:absolute;width:18px;height:18px;margin:-9px;border-radius:50%;background:#ea580c;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #fff}
.ibody{padding:10px 16px 14px}.lbl{font-size:9px;font-weight:800;letter-spacing:1px;color:#b45309;margin-top:6px}
.lbl.rec{color:#047857}.ibody p{font-size:12.5px;line-height:1.55;margin-top:2px}
.recp{background:#ecfdf5;border-radius:8px;padding:8px 10px;color:#065f46;font-weight:500}
.item{break-inside:avoid;page-break-inside:avoid}
.ibody ul{margin:4px 0 0 18px;font-size:12px;line-height:1.5}
""" + MARK_CSS
cover = (f'<div class="cover"><div class="k">DESIGN SUGGESTIONS — FOR THE DESIGN TEAM</div>'
         f'<h1>{esc(PORTAL)} · Design-side Recommendations</h1>'
         f'<p>Separate from the dev fidelity report: token decisions, Figma frame updates, and screens '
         f'that exist live but have no design yet. {esc(GEN)}</p></div>')
groups = {"A": "A — Program-level decisions",
          "B": "B — Updates to existing Figma frames",
          "C": "C — Views built live with no design (proposals needed)",
          "D": "D — UI/UX changes to make in the design"}
if isinstance(raw, dict) and raw.get("groups"):
    groups.update(raw["groups"])
# One page per item (plus the cover and a section opener), each sized to its content. A single
# section for the whole report produced one page tens of thousands of pixels tall.
sections = [cover + (raw.get("intro", "") if isinstance(raw, dict) else "")]
n = 0
for g, label in groups.items():
    items = [x for x in ITEMS if x.get("group") == g]
    if not items: continue
    first = True
    for it in items:
        n += 1
        head = f'<div class="sec">{esc(label)} · {len(items)}</div>' if first else ""
        first = False
        sections.append(head + card(n, it))

out = os.path.join(BASE, PORTAL.replace(" ", "-").replace("/", "-") + "-Design-Suggestions.pdf")
json.dump({"css": CSS, "sections": sections, "width": 1100, "out": out},
          open(os.path.join(BASE, "report-sections.json"), "w"))
r = subprocess.run(["node", os.path.join(BASE, "render.js")], cwd=BASE, capture_output=True, text=True)
print(r.stdout[-300:] if r.returncode == 0 else r.stderr[-600:])
print("PDF:", out, (str(os.path.getsize(out)) + " bytes") if os.path.exists(out) else "MISSING")
