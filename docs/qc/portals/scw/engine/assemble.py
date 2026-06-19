#!/usr/bin/env python3
"""Assembly (LLM-review) step: engine text findings (computed values + bbox pins) MERGED
with structural/visual findings the text-diff can't see + hand-validated admin/user findings
-> audit-master.json."""
import json, re, os, struct
BASE="/Users/akashk/Documents/Projects/MoSJE/docs/qc/portals/scw"; ENG=BASE+"/engine"
FU="https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id="
UU="https://scw-user-uat.mosje.in"; AU="https://scw-admin-uat.mosje.in"
# --- geometry: crops + pins are derived from REAL element boxes against REAL capture dimensions,
# then asserted to fall inside the crop. No hardcoded heights, no fixed bands (those caused drift).
# Everything is normalised to the renderer's 1440-px-wide image space (W always 1440).
PAD_FRAC=0.045; PAD_MIN=44          # vertical breathing room around the element union
FAILURES=[]                          # in-box assertion log -> failures.md learning ledger
def _png(p):
    try:
        with open(p,'rb') as f: f.read(16); w,h=struct.unpack('>II',f.read(8)); return w,h
    except Exception: return (1440,1000)
_dim={}
def imgdims(rel):                    # -> (1440, height-in-1440-space) from the actual PNG
    if rel not in _dim:
        w,h=_png(os.path.join(BASE,rel)) if rel else (1440,1000)
        _dim[rel]=(1440, round(h*1440/w))
    return _dim[rel]
def _ctr(b): return (b['x']+b['w']/2, b['y']+b['h']/2)
def _boxpct(px,py,W,H,bw=380,bh=90): # synthesise an approximate box from a hand-authored % point
    return {'x':px/100*W-bw/2,'y':py/100*H-bh/2,'w':bw,'h':bh}
def _norm(t): return re.sub(r'[^a-z0-9]','',(t or '').lower())[:48]
_rows={}
def rowsmap(path):  # {normtext: box} from an extraction file (live/<slug>.json or a figma sub-dict)
    if path not in _rows:
        m={}
        try:
            fp,_,slug=path.partition('#')
            d=json.load(open(os.path.join(ENG,fp)))
            if slug: d=d.get(slug,{})
            for r in d.get('rows',[]):
                k=_norm(r.get('text'))
                if not k: continue
                fsz=r.get('fontSize') or 0; cur=m.get(k)
                # keep the largest-font occurrence -> page title beats a same-text sidebar/nav link
                if cur is None or fsz>cur[1]: m[k]=({x:r.get(x) for x in ('x','y','w','h')},fsz)
        except Exception: pass
        _rows[path]=m
    return _rows[path]
def figpath(slug):  # which figma extraction file holds this slug
    for fp in ('figma/public.json','figma/authed.json'):
        try:
            if slug in json.load(open(os.path.join(ENG,fp))): return f"{fp}#{slug}"
        except Exception: pass
    return None
def anchorbox(path,text,dy,W,H):  # resolve a structural finding's anchor to a real extracted element
    hit=rowsmap(path).get(_norm(text))
    if not hit or hit[0].get('w') is None: return None
    bb=dict(hit[0])
    if dy: bb['y']=bb['y']+dy*H   # nudge (e.g. icon sits above its label)
    return bb
def tohex(c):
    c=(c or '').strip()
    if c.startswith('#'): return c.lower()
    m=re.findall(r'\d+',c)
    return '#%02x%02x%02x'%(int(m[0]),int(m[1]),int(m[2])) if len(m)>=3 else c
DROP={("our-services","Facilities (3)"),("login","Log in to your account"),
 # hidden Figma layers — present in the file but not visible in the design, so not real gaps
 ("home","WELFARE BENEFITS"),("login","Continue with Digilocker"),("login","or sign in with credentials"),
 # present in build with a different text-case -> handled as a styling finding, not a MISSING
 ("admin-dashboard","Organization Name"),
 # admin/user MISSINGs that a richer structural finding already covers (avoid double-reporting)
 ("admin-volunteers","Organization Name"),("admin-ipsrc-homes","Facility Types"),
 ("admin-sage-detail","Company Name"),("admin-sage-detail","Date of Incorporation"),
 ("admin-sage-detail","Type of Company"),("admin-sage-detail","CORPORATE INFORMATION"),
 ("admin-sage-detail","DIPP ID"),("admin-sage-detail","Startup registered with DIPP"),
 ("admin-sage-detail","UPLOADED DOCUMENTS"),
 ("user-sage-dashboard","SAGE Registration"),("user-sage-dashboard","SAGE Application"),
 ("user-sage-dashboard","Evaluation Pending"),
 # near-identical greys (#374151 vs #1f2937, Δ42.8) — below the eye's threshold
 ("user-volunteer-dashboard","UPCOMING OPPORTUNITIES NEAR YOU")}
def parse(diffs):
    fp=[];lp=[]
    for d in diffs:
        m=re.search(r'font-size (\d+)px -> (\d+)px',d)
        if m: fp.append(f"font-size {m.group(1)}px");lp.append(f"font-size {m.group(2)}px");continue
        m=re.search(r'weight (\S+) -> (\S+)',d)
        if m: fp.append(f"weight {m.group(1)}");lp.append(f"weight {m.group(2)}");continue
        m=re.search(r'font (\S+) -> (\S+)',d)
        if m: fp.append(f"font {m.group(1)}");lp.append(f"font {m.group(2)}");continue
        m=re.search(r'colour (\S+) -> (rgb\([^)]*\)|#\w+)',d)
        if m: fp.append(f"colour {tohex(m.group(1))}");lp.append(f"colour {tohex(m.group(2))}");continue
    return ("Design: "+", ".join(fp)+".","Build: "+", ".join(lp)+".",", ".join(fp),", ".join(lp))
def sevax(diffs):
    s=" ".join(diffs); big=False
    for d in diffs:
        m=re.search(r'font-size (\d+)px -> (\d+)px',d)
        if m and abs(int(m.group(1))-int(m.group(2)))>=6: big=True
    sv="Major" if ("width" in s or big) else "Minor"
    ax="Color & Token" if ("colour" in s and "font-size" not in s and "weight" not in s) else ("Layout & Spacing" if "width" in s else "Typography")
    return sv,ax
def eng(slug,pref,start=1):
    p=f"{ENG}/candidates_{slug}.json"; out=[]; n=start-1
    if not os.path.exists(p): return out,start
    for c in json.load(open(p)):
        if (slug,c["element"]) in DROP: continue
        n+=1
        if c["kind"]=="MISSING":
            out.append(dict(num=n,id=f"{pref}-{n:03d}",element=c["element"][:48],section="content",axis="Content & Iconography",severity="Major",figma=f"Design includes '{c['element'][:46]}'.",live="Not present in the build.",fix=f"Add '{c['element'][:46]}' per the design.",_fbox=c.get("figmaBoxRaw"),_lbox=None)); continue
        fg,lv,dp,bp=parse(c["diffs"]); sv,ax=sevax(c["diffs"])
        out.append(dict(num=n,id=f"{pref}-{n:03d}",element=c["element"][:48],section="text",axis=ax,severity=sv,figma=fg,live=lv,fix=f"Set the “{c['element'][:38]}” style to {dp} — the build currently uses {bp}.",_fbox=c.get("figmaBoxRaw"),_lbox=c.get("liveBoxRaw")))
    return out,n+1
# structural / visual findings (text-diff can't see these) — {slug:[(el,sec,ax,sv,fg,lv,fx,fpx,fpy,lpx,lpy)]}
# fpx/fpy/lpx/lpy are %-of-frame anchor points; finalize() turns them into real crops + pins.
def F(slug,pref,n,t):
    d=dict(num=n,id=f"{pref}-{n:03d}",element=t[0],section=t[1],axis=t[2],severity=t[3],figma=t[4],live=t[5],fix=t[6],_fpct=(t[7],t[8]),_lpct=(t[9],t[10]))
    if len(t)>11 and t[11]: d["_anchor"]=t[11]   # (anchorText, figmaDy, liveDy) -> bind to real element
    return d
# tuple: (el, sec, axis, sev, design, build, fix, fpx,fpy, lpx,lpy [, anchor]) — anchor=(text,figDy,liveDy)
# binds the pin to a REAL extracted element (preferred); fpx..lpy are the %-fallback if text not found.
STRUCT={
 "home":[("Service-card icon style","cards","Color & Token","Minor","Service-card icons are outline, single-tone marks.","Cards use filled, multi-coloured glyph icons (green leaf, blue document).","Restyle the service-card icons to the design's outline, single-tone set.",13,22,13,22,("Join as a Volunteer",-0.045,-0.045))],
 "login":[("Role selector — dropdown vs segmented buttons","form","Components & States","Minor","A single 'role' dropdown.","Two segmented buttons ('Volunteer' / 'SAGE Organisation').","Use the design's single role dropdown rather than two segmented buttons.",78,33,76,33,("Log in to your account",0.13,0.13)),
          ("Brand logo container shape","branding","Components & States","Major","The logo sits in a rounded-square container with generous breathing space around it.","The logo container is a tight circle, cropping the breathing space.","Use a rounded-square logo container with the design's internal padding — not a circle.",12,38,12,38,("SAMAVESH",-0.085,-0.085)),
          ("Input field & control styling","form","Components & States","Major","Inputs use the design's field height, border colour, radius and focus state.","The build's input fields and the primary button differ in height, border and radius from the design.","Match the input field height, border colour, radius and focus/disabled states to the design.",78,46,75,46,("Log in to your account",0.16,0.16))],
 "our-services":[("Facility-type filter missing from toolbar","toolbar","Components & States","Minor","The toolbar carries a facility-type filter beside search and Near Me.","The toolbar shows search + Near Me only — the facility-type filter is absent.","Add the facility-type filter control to the toolbar.",55,21,72,18,("Our Services",0.07,0.07))],
 "sage-landing":[("Redundant inner card around eligibility","cards","Layout & Spacing","Major","Eligibility content sits directly in the page panel and spans its width.","Content is wrapped in an extra bordered inner card that narrows the column.","Remove the inner card so the content flows to the panel width — no fixed inner width.",50,40,42,40,("Eligibility Criteria",0.06,0.06))],
 "volunteer-reg":[("Address row order + PIN-code auto-fill","form","Components & States","Major","Address row order is Pincode → State → District, and entering the PIN code auto-fills State and District.","Order is State → District → Pincode, and the fields are independent (no PIN-driven auto-fill).","Reorder to Pincode → State → District, and auto-populate State & District from the entered PIN code.",50,41,50,41,("Areas of Interest / Skills (Select all that apply)",-0.18,-0.18)),
                  ("Areas-of-Interest checkbox grid flow","form","Layout & Spacing","Minor","Checkboxes flow column-wise across the grid as designed.","The checkbox order/flow differs from the design grid.","Match the checkbox grid flow (column order) to the design.",40,70,40,40,("Areas of Interest / Skills (Select all that apply)",0.05,0.05)),
                  ("Radio-button control styling","form","Components & States","Minor","The Individual/Organisation radios use the design's control size, fill colour and selected-state ring.","The radio buttons differ in size, fill colour and selected-state styling from the design.","Match the radio control size, selected fill colour and ring to the design's radio component.",24,30,24,30,("Individual",-0.01,-0.01))],
 "ald-scheme":[("Header-area background treatment","masthead","Color & Token","Major","The scheme header band uses the design's background colour/treatment.","The header-area background differs from the design (wrong fill/tone behind the title block).","Match the scheme header band background colour/treatment to the design.",50,18,42,18,("Free Assisted Living Devices",-0.03,-0.03)),
               ("Divider placement","cards","Layout & Spacing","Major","A single full-width hairline sits directly above the 'I confirm' checkbox.","The divider sits in an unnecessary position, breaking the card rhythm.","Keep one full-width hairline above the 'I confirm' checkbox; remove the misplaced divider.",50,57,42,60,("Eligibility Criteria",0.16,0.16)),
               ("Redundant back-arrow control","toolbar","Components & States","Minor","No back arrow — Cancel in the action pane serves that purpose.","A back-arrow (←) is added above the card, duplicating Cancel.","Remove the back arrow; Cancel already covers the back action.",50,15,24,20,("Free Assisted Living Devices",-0.02,-0.02))],
}
GLOBAL=[("Masthead cobranding logos (Digital India + SAMAVESH)","masthead","Content & Iconography","Major","The masthead right zone carries the Digital India + SAMAVESH cobranding logos (DBIM).","The masthead right zone is empty — both cobranding logos are absent across the public site.","Add the Digital India + SAMAVESH cobranding logos to the masthead right zone.",88,9,88,9),
 ("Top utility-bar accessibility trigger","header-band","Accessibility","Minor","The top utility bar carries an accessibility control (text-size + contrast) beside the language selector.","The top bar shows only Skip-to-Main, a translate glyph and Login.","Add the accessibility (text-size / contrast) control to the top utility bar.",86,2,86,2),
 ("Sidebar expand/collapse trigger placement","sidebar","Components & States","Blocker","The expand/collapse trigger sits in the header, above the sidebar column.","The collapse arrow (←) sits inside the sidebar column, above the nav items.","Move the expand/collapse trigger into the header, above the sidebar.",2,16,2,16),
 ("Masthead 'Department…' lockup line","masthead","Content & Iconography","Major","The masthead lockup includes the bold 'Department of Social Justice & Empowerment' line beneath the Ministry line.","The masthead stops at 'Ministry of Social Justice & Empowerment' — the Department line is absent.","Add the bold 'Department…' line beneath the Ministry line in the masthead lockup.",20,10,18,8,("Ministry of Social Justice & Empowerment",0.022,0.022)),
 ("Primary CTA default (gating) state","form","Components & States","Major","On gated forms the primary action stays disabled until the confirm checkbox / required fields are valid.","The primary action renders enabled by default — recurs across SAGE / Volunteer / ALD.","Default the primary action to disabled until the required input is valid.",50,72,50,72,("I confirm that my organization meets the SAGE eligibility criteria men",0.06,0.06)),
 ("Font family not rendering as Noto Sans","masthead","Typography","Major","All text is set in Noto Sans (the DBIM standard typeface).","Many build text elements render in a fallback face — Noto Sans is requested in CSS but isn't actually loading, so headings/body fall back to a system font.","Ensure the Noto Sans webfont actually loads on the build (font files + @font-face) so text doesn't fall back to a system face. Recurs site-wide.",30,12,30,12,("Senior Citizens Welfare",0.0,0.0))]
# admin / user (hand-validated)
def AROW(slug,pref,items):
    out=[]
    for i,t in enumerate(items,1):
        d=dict(num=i,id=f"{pref}-{i:03d}",element=t[0],section=t[1],axis=t[2],severity=t[3],figma=t[4],live=t[5],fix=t[6],_fpct=(t[7],t[8]),_lpct=(t[9],t[10]))
        if len(t)>11 and t[11]: d["_anchor"]=t[11]
        out.append(d)
    return out
def S(slug,name,node,liveurl,img,findings,note=None):
    return {"slug":slug,"name":name,"note":note,"figmaUrl":(FU+node) if node else None,"liveUrl":liveurl,
            "figmaImg":f"captures/figma/{img}.png" if img else None,"liveImg":f"captures/live/{img}.png","findings":findings}

def finalize(screen):
    """Derive per-section crops (full-width band around the real element union) + pins relative to
    that crop, from real boxes & real capture dimensions. Assert each pin lands inside its element
    box inside the crop inside the image; log any miss to FAILURES (the learning ledger)."""
    order=[]; bysec={}; secy={}
    for f in screen["findings"]:
        bysec.setdefault(f["section"],[]).append(f)
        if f["section"] not in order: order.append(f["section"])
    for sec in order:
        fs=bysec[sec]
        figImg=fs[0].get("figmaImgO") or screen.get("figmaImg")
        livImg=fs[0].get("liveImgO") or screen.get("liveImg")
        Wf,Hf=imgdims(figImg) if figImg else (1440,1000)
        Wl,Hl=imgdims(livImg)
        base=os.path.splitext(os.path.basename(livImg))[0] if livImg else None
        lpath=f"live/{base}.json" if base else None
        fpath=figpath(base) if base else None
        for f in fs:
            fb,lb=f.get("_fbox"),f.get("_lbox")
            if f.get("_anchor"):                       # anchor to a real extracted element (preferred)
                at,dyL,dyF=f["_anchor"]
                if lb is None and lpath: lb=anchorbox(lpath,at,dyL,Wl,Hl)
                if fb is None and fpath: fb=anchorbox(fpath,at,dyF,Wf,Hf)
            if fb is None and f.get("_fpct"): fb=_boxpct(*f["_fpct"],Wf,Hf)   # else fall back to % anchor
            if lb is None and f.get("_lpct"): lb=_boxpct(*f["_lpct"],Wl,Hl)
            if lb is None and fb is not None:          # MISSING: show where it SHOULD be (design loc)
                lb={"x":fb["x"],"y":min(fb["y"],max(0,Hl-fb["h"])),"w":fb["w"],"h":fb["h"]}
            f["__fb"],f["__lb"]=fb,lb
        def crop(boxes,H):
            if not boxes: return [0,0,1440,min(H,420)]
            y0=min(b["y"] for b in boxes); y1=max(b["y"]+b["h"] for b in boxes)
            pad=max(PAD_MIN,H*PAD_FRAC)
            return [0,max(0,round(y0-pad)),1440,min(H,round(y1+pad))]
        fc=crop([f["__fb"] for f in fs if f.get("__fb")],Hf)
        lc=crop([f["__lb"] for f in fs if f.get("__lb")],Hl)
        secy[sec]=lc[1]   # section vertical position -> render sections top-to-bottom
        for f in fs:
            f["figmaBox"]=fc; f["liveBox"]=lc; f["sectionBox"]=lc
            fb,lb=f.pop("__fb",None),f.pop("__lb",None)
            # pin x: box centre, but for very wide boxes (container-spanning, left-aligned text)
            # bias toward where the text starts so the pin sits ON the element, not mid-page.
            def pinx(b): return (b['x']+110) if b['w']>700 else b['x']+b['w']/2
            if fb:
                cx,cy=pinx(fb),_ctr(fb)[1]; f["figmaPin"]={"x":round(cx/1440*100),"y":round((cy-fc[1])/max(1,fc[3]-fc[1])*100,1)}
                if not (0<=cx<=1440 and 0<=cy<=Hf+1): FAILURES.append(f"{f['id']}: figma element outside capture (cx={round(cx)},cy={round(cy)} vs 1440x{Hf}) — recapture")
            else: f["figmaPin"]=None
            if lb:
                cx,cy=pinx(lb),_ctr(lb)[1]; f["livePin"]={"x":round(cx/1440*100),"y":round((cy-lc[1])/max(1,lc[3]-lc[1])*100,1)}
                f["liveFullPin"]={"x":round(cx/1440*100,1),"y":round(cy/Hl*100,1)}   # pin over FULL image (Figma board)
                if not (0<=cx<=1440 and 0<=cy<=Hl+1): FAILURES.append(f"{f['id']}: live element outside capture (cx={round(cx)},cy={round(cy)} vs 1440x{Hl}) — recapture taller")
            else: f["livePin"]=None
            if fb: f["figmaFullPin"]={"x":round(pinx(fb)/1440*100,1),"y":round(_ctr(fb)[1]/Hf*100,1)}
            for k in ("_fbox","_lbox","_fpct","_lpct","_anchor"): f.pop(k,None)
    # renumber in render order (sections sorted top-to-bottom) so pins read 1,2,3…, not 1,4,2,3
    order=sorted(order,key=lambda s:secy.get(s,1e9))
    ordered=[f for sec in order for f in bysec[sec]]
    for i,f in enumerate(ordered,1):
        f["num"]=i; f["id"]=f"{f['id'].rsplit('-',1)[0]}-{i:03d}"
    screen["findings"]=ordered

screens=[]
# GLOBAL pseudo-screen (chrome + recurring) — uses home img, gating uses sage-landing
gf=AROW("home","SCW-GLOBAL",GLOBAL)
gf[-1]["figmaImgO"]="captures/figma/sage-landing.png"; gf[-1]["liveImgO"]="captures/live/sage-landing.png"
screens.append(S("GLOBAL","Cross-cutting — Shared chrome & patterns recurring across SCW screens","4855-63968",UU+"/","home",gf))
# public screens: engine text findings + structural
PUB=[("HOME","Citizen / Public Home","4855-63968",UU+"/","home"),
 ("LOGIN","Login — User (SAMAVESH)","9453-255070",UU+"/login","login"),
 ("OUR-SERVICES","Our Services (Service Directory)","4819-23664",UU+"/our-services","our-services"),
 ("SAGE-LANDING","SAGE Registration — Eligibility Landing","4819-23118",UU+"/sage-registration","sage-landing"),
 ("VOLUNTEER-REG","Volunteer Registration","5779-32036",UU+"/volunteer","volunteer-reg"),
 ("ALD-SCHEME","Free Assisted Living Devices — Scheme","4819-23725",UU+"/our-services/scheme","ald-scheme"),
 ("EPLEDGE","E-Pledge (Take the Pledge)","4819-23436",UU+"/epledge","epledge")]
for SLUG,name,node,url,img in PUB:
    pref=f"SCW-{SLUG}"; ef,nxt=eng(img,pref,1)
    sf=[F(img,pref,nxt+i,t) for i,t in enumerate(STRUCT.get(img,[]))]
    screens.append(S(SLUG,name,node,url,img,ef+sf))
# admin / user: engine value-findings (computed pins) + curated structural findings the text-diff
# can't see. base == candidates/img slug. admin-login has no engine candidates -> structural only.
def ENGS(SLUG,name,node,url,base,structural):
    pref=f"SCW-{SLUG}"; ef,nxt=eng(base,pref,1)
    sf=[F(base,pref,nxt+i,t) for i,t in enumerate(structural)]
    screens.append(S(SLUG,name,node,url,base,ef+sf))
ENGS("ADMIN-LOGIN","Login — Admin (SAMAVESH, Officer/Admin)","9508-52655",AU+"/login","admin-login",[
 ("National Emblem in 'Signing into' lockup","footer","Content & Iconography","Blocker","The bottom-left lockup shows the National Emblem.","The emblem is a blank white circle — the image is missing/broken.","Restore the National Emblem asset in the bottom-left lockup.",12,92,4,95),
 ("'Forgot Password' placement & lock icon","form","Components & States","Major","'Forgot Password' is a plain link, right-aligned ABOVE the password field.","It carries a lock icon and is not right-aligned above the password field as designed.","Right-align 'Forgot Password' above the password field and remove the lock icon.",80,40,80,40),
 ("'Change' button styling","footer","Components & States","Minor","'Change' follows the design's button token.","The 'Change' control's styling/placement differs from the design.","Align the 'Change' control to the design's button token.",52,92,52,95)])
ENGS("ADMIN-DASHBOARD","Admin / Dashboard","5779-23259",AU+"/dashboard","admin-dashboard",[
 ("Stat-card caption hierarchy","stat-cards","Typography","Minor","Each stat card shows a small, light, muted-grey caption above a large bold number.","The caption renders darker and heavier, so it competes with the number and flattens the hierarchy.","Make the stat-card caption smaller, lighter and muted-grey so the number stays the dominant value.",28,30,28,32),
 ("Table-header text-case","table","Typography","Minor","Column headers (e.g. 'Organization Name') use the design's title-case label style.","The same headers are force-uppercased in the build (text-transform), unlike the design's title case.","Match the column-header text-case to the design — drop the uppercase text-transform.",30,46,30,46,("Organization Name",0.0,0.0))])
ENGS("ADMIN-SAGE-APPLICATIONS","Admin / SAGE Applications — List","5779-23407",AU+"/sage-applications","admin-sage-applications",[
 ("Tables & filters wrapped in a card (recurs across all list views)","table","Layout & Spacing","Major","Tables and their toolbars sit directly on the page background.","The table + toolbar are wrapped in a bordered card the design doesn't use — this recurs across SAGE, Events, Volunteers and IPSrC Homes lists.","Drop the card wrapper around tables and toolbars across all admin list views — they sit on the page background.",50,50,50,50),
 ("Status pill styling","table","Color & Token","Minor","Status pills use the design's bordered/tonal pill style.","Both status pills render as flat filled pills.","Match the status pills to the design's bordered/tonal pill style.",55,45,55,45)])
ENGS("ADMIN-SAGE-DETAIL","Admin / SAGE Application — Detail","5779-23521",AU+"/sage-applications/sage00763","admin-sage-detail",[
 ("Field grouping & empty-value handling","form","Layout & Spacing","Major","Fields are grouped into logical, labelled sections, showing only the relevant populated fields.","Most fields are dumped flat under one heading, with many empty values shown as '-'.","Group fields into logical sections and hide empty fields rather than rendering them as '-'.",30,55,30,55)])
ENGS("ADMIN-EVENTS","Admin / Events — List","5779-25198",AU+"/events","admin-events",[
 ("Event status tab bar","tabs","Components & States","Blocker","A tab bar — My / Pending / Approved / Rejected Events — sits above the table.","No tab bar is present; only a search box + the table.","Add the events status tab bar above the table, per the design.",35,20,35,18),
 ("Table element styling","table","Color & Token","Major","The table header row, row dividers, cell padding and status pills follow the design's table style.","The table header style, row dividers, spacing and pills don't match the design.","Align the table header, row dividers, cell padding and status pills to the design's table style.",50,34,50,34)])
ENGS("ADMIN-EVENTS-ADD","Admin / Events — Add New Event","5779-24326",AU+"/events/add","admin-events-add",[
 ("Input field & icon styling","form","Components & States","Major","Form inputs follow the design's field height, border, radius and leading-icon treatment.","The input fields and their icons don't match the design's field styling.","Match the input field height, border, radius and leading-icon treatment to the design.",35,42,35,42)])
ENGS("ADMIN-VOLUNTEERS","Admin / Volunteers — List","5779-23691",AU+"/volunteers","admin-volunteers",[
 ("Toolbar control styling","toolbar","Components & States","Minor","Search and filter controls use the design's input/dropdown height, border and spacing.","The toolbar controls' height, border and spacing differ from the design.","Match the toolbar search/filter controls to the design's control styling.",55,16,55,16),
 ("Table element styling","table","Color & Token","Minor","The table header, row dividers and cell padding follow the design.","The table header style, dividers and spacing differ from the design.","Align the table elements to the design's table style.",50,32,50,32)])
ENGS("ADMIN-IPSRC-HOMES","Admin / IPSrC Homes — List","5779-23806",AU+"/sage-homes","admin-ipsrc-homes",[
 ("Table element styling","table","Color & Token","Minor","The table header, row dividers and cell padding follow the design.","The table header style, dividers and spacing differ from the design.","Align the table elements to the design's table style.",50,32,50,32)])
ENGS("USER-VOLUNTEER-DASHBOARD","Volunteer / Dashboard","5779-32475",UU+"/","user-volunteer-dashboard",[])
ENGS("USER-SAGE-DASHBOARD","SAGE / Dashboard — My Applications","5687-18689",UU+"/","user-sage-dashboard",[
 ("Approved application card styling","card","Color & Token","Minor","The approved application card uses the design's surface colour, border and status-badge styling.","The approved card's colour, border and badge styling differ from the design.","Match the approved application card's surface colour, border and status badge to the Figma design (the card is read-only — no Withdraw action expected here).",30,55,30,55,("My SAGE Applications",0.12,0.12))])

doc={"portal":"SCW — Senior Citizens Welfare (UAT) · Full Design QC","idPrefix":"SCW","generated":"2026-06-18",
 "figmaUrl":FU+"4619-49381",
 "method":"Engine-computed: structured Figma specs vs live-DOM computed CSS, numerically diffed (font-size/weight/colour/width/presence) with pins computed from element bounding boxes; the LLM only ranked, phrased and added the structural/visual findings the text-diff can't see (chrome, icons, dividers, tab-bars, filters, field-casing). Build-only screens (Admin User Management, Volunteer Detail, RVY) are DS-consistent and not listed.",
 "screens":screens,
 "deferred":[{"id":"SCW-DEF-001","title":"SAGE registration wizard (Steps 1–6) — needs a pending-application test account","reason":"The test account's application is Approved (read-only); 'View Details' routes to the eligibility landing, not the editable wizard. Provide a pending-application SAGE account to audit the wizard."}]}
for sc in screens: finalize(sc)
json.dump(doc,open(f"{BASE}/audit-master.json","w"),indent=2,ensure_ascii=False)
# learning ledger: every assertion miss is recorded so the same geometry error can't ship silently
with open(f"{ENG}/failures.md","w") as fh:
    fh.write("# design-qc assertion failures (last run)\n\n")
    fh.write("Every pin must fall inside its element box inside the crop inside the capture.\n"
             "Misses below mean a wrong match or a too-short capture — fix before shipping.\n\n")
    fh.write("\n".join(f"- {x}" for x in FAILURES) if FAILURES else "_No failures — all pins asserted inside their element + crop._")
from collections import Counter
c=Counter(f["severity"] for s in screens for f in s["findings"])
print("screens",len(screens),"findings",sum(len(s["findings"]) for s in screens),dict(c))
print("ASSERTION FAILURES:",len(FAILURES))
for x in FAILURES: print("  !",x)
