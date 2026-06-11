#!/usr/bin/env python3
"""Design Suggestions PDF — design-side items (token decisions, Figma frame fixes, undesigned
screens), separate from the dev fidelity report. Annotated boards reuse the same visual language."""
import json, os, html, subprocess

BASE=os.path.dirname(os.path.abspath(__file__))
def esc(t): return html.escape(str(t))
def furl(p): return "file://"+os.path.join(BASE,p)
PANEL=506
SEV={"Decide":"#7c3aed","Design":"#b45309","Propose":"#1d4ed8"}

def panel(img,box,pins,label,color):
    x1,y1,x2,y2=box; cw,ch=x2-x1,y2-y1; sc=PANEL/cw; H=round(ch*sc); W=round(1440*sc)
    ph="".join(f'<span class="pin" style="left:{px/100*PANEL:.0f}px;top:{py/100*H:.0f}px">{n}</span>' for n,px,py in pins)
    return (f'<div class="pwrap"><div class="plabel" style="color:{color}"><b>{esc(label)}</b></div>'
            f'<div class="crop" style="height:{H}px"><img src="{furl(img)}" style="left:{-x1*sc:.0f}px;top:{-y1*sc:.0f}px;width:{W}px"/>{ph}</div></div>')

def board(item):
    b=item.get("board")
    if not b: return ""
    panels=""
    if b.get("figmaImg"): panels+=panel(b["figmaImg"],b["box"],b.get("figmaPins",[]),"DESIGN — current Figma","#b45309")
    if b.get("liveImg"):  panels+=panel(b["liveImg"], b["box"],b.get("livePins",[]),"LIVE — current build","#1d4ed8")
    return f'<div class="board"><div class="panels">{panels}</div></div>'

def card(i,item):
    tag=item["type"]
    return (f'<div class="item"><div class="ihead"><span class="num">{i}</span>'
            f'<span class="ttl">{esc(item["title"])}</span>'
            f'<span class="chip" style="background:{SEV[tag]}">{tag}</span>'
            f'<span class="iid">{esc(item["id"])}</span></div>'
            f'{board(item)}'
            f'<div class="ibody"><div class="lbl">OBSERVED</div><p>{esc(item["observed"])}</p>'
            f'<div class="lbl rec">RECOMMENDATION</div><p class="recp">{esc(item["recommendation"])}</p></div></div>')

ITEMS=json.load(open(os.path.join(BASE,"suggestions.json")))
CSS="""
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
"""
secs=[]
cover=('<div class="cover"><div class="k">DESIGN SUGGESTIONS — FOR THE DESIGN TEAM</div>'
 '<h1>eUtthan · Design-side Recommendations</h1>'
 '<p>Separate from the dev fidelity report: token decisions, Figma frame updates, and screens that exist live but have no design yet. 2026-06-11</p></div>')
groups={"A":"A — Program-level token decisions","B":"B — Updates to existing Figma frames","C":"C — Screens built live with no design (proposals needed)"}
bodyparts=[cover]; n=0
for g,label in groups.items():
    items=[x for x in ITEMS if x["group"]==g]
    if not items: continue
    bodyparts.append(f'<div class="sec">{esc(label)}</div>')
    for it in items:
        n+=1; bodyparts.append(card(n,it))
html_doc="".join(bodyparts)
secs=[html_doc]
json.dump({"css":CSS,"sections":secs,"width":1100,"out":os.path.join(BASE,"eUtthan-Design-Suggestions.pdf")},
          open(os.path.join(BASE,"report-sections.json"),"w"))
r=subprocess.run(["node",os.path.join(BASE,"render.js")],capture_output=True,text=True)
print(r.stdout[-300:] if r.returncode==0 else r.stderr[-600:])
