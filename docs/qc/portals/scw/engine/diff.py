#!/usr/bin/env python3
"""Match Figma spec rows <-> live DOM rows by text, diff properties numerically with
tolerances, and emit candidate findings with design value, live value, delta, and a
computed pin (centre of the live bbox in capture space). The LLM consumes these — it
never measures."""
import json, sys, re, argparse
def norm(t): return re.sub(r'[^a-z0-9]','',(t or '').lower())[:48]
def hx(c):
    if not c: return None
    c=c.strip()
    if c.startswith('#'): c=c[1:]; return tuple(int(c[i:i+2],16) for i in (0,2,4))
    if not c.startswith('rgb'): return None  # skip oklab/oklch/named
    m=re.findall(r'\d+',c); return (int(m[0]),int(m[1]),int(m[2])) if len(m)>=3 else None
def dist(a,b):
    A,B=hx(a),hx(b)
    return None if not A or not B else round(sum((x-y)**2 for x,y in zip(A,B))**0.5,1)
def main(slug,figp,livep):
    F=json.load(open(figp)); L=json.load(open(livep))
    if slug in F and isinstance(F[slug],dict): F=F[slug]
    lrows=L['rows']; lidx={}
    for r in lrows: lidx.setdefault(norm(r['text']),[]).append(r)
    cands=[]
    for fr in F['rows']:
        key=norm(fr['text'])
        if not key: continue
        cand=lidx.get(key)
        if not cand:
            sub=[r for k,rs in lidx.items() if k and (k.startswith(key[:18]) or key.startswith(k[:18])) for r in rs]
            cand=sub or None
        if not cand:
            fbox={k:fr.get(k) for k in ('x','y','w','h')}
            cands.append({"element":fr['text'][:50],"kind":"MISSING","figma":fr,"live":None,"figmaBoxRaw":fbox}); continue
        fsz=fr.get('fontSize') or 0
        lr=min(cand,key=lambda r:abs((r.get('fontSize') or 0)-fsz))  # disambiguate duplicates by size
        # match-quality reject: dark design text matched to near-white live element = wrong node
        fc,lc=hx(fr.get('color')),hx(lr.get('color'))
        if fc and lc and max(fc)<160 and min(lc)>230: continue
        diffs=[]
        if fr.get('fontSize') and lr.get('fontSize') and abs(fr['fontSize']-lr['fontSize'])>=2:
            diffs.append(f"font-size {fr['fontSize']}px -> {lr['fontSize']}px")
        if fr.get('fontWeight') and lr.get('fontWeight') and str(fr['fontWeight'])!=str(lr['fontWeight']):
            diffs.append(f"weight {fr['fontWeight']} -> {lr['fontWeight']}")
        if fr.get('fontFamily') and lr.get('fontFamily') and fr['fontFamily'].lower()!=lr['fontFamily'].lower():
            diffs.append(f"font {fr['fontFamily']} -> {lr['fontFamily']}")
        d=dist(fr.get('color'),lr.get('color'))
        if d and d>12: diffs.append(f"colour {fr.get('color')} -> {lr.get('color')} (Δ{d})")
        # NOTE: element width/height are intentionally NOT diffed. Layout is responsive — a width
        # delta is a consequence of font-size/container/breakpoint, not a fixable fixed-px defect.
        # Fixes must stay relative (padding/margin/ratio), so we only diff token-level properties.
        if diffs:
            pin={"x":round((lr['x']+lr['w']/2)/L['pageW']*100),"y":round((lr['y']+lr['h']/2)/L['pageH']*100)}
            fpin={"x":round((fr['x']+fr['w']/2)/F['frameW']*100),"y":round((fr['y']+fr['h']/2)/F['frameH']*100)}
            # raw element boxes (frame coords / dom coords) — assemble.py derives crops+pins from these
            fbox={k:fr.get(k) for k in ('x','y','w','h')}
            lbox={k:lr.get(k) for k in ('x','y','w','h')}
            cands.append({"element":fr['text'][:50],"kind":"DIFF","diffs":diffs,
                          "figmaPin":fpin,"livePin":pin,"figmaBoxRaw":fbox,"liveBoxRaw":lbox})
    json.dump(cands,open(f"candidates_{slug}.json","w"),indent=2)
    print(f"=== {slug}: {len(cands)} candidate findings ===")
    for c in cands:
        if c['kind']=='DIFF': print(f"  DIFF  {c['element'][:40]:42} | "+" ; ".join(c['diffs'])+f"  pin@{c['livePin']['x']},{c['livePin']['y']}%")
        else: print(f"  MISSING in build: {c['element'][:50]}")
if __name__=="__main__":
    a=argparse.ArgumentParser(); a.add_argument("slug"); a.add_argument("figp"); a.add_argument("livep")
    x=a.parse_args(); main(x.slug,x.figp,x.livep)
