#!/usr/bin/env python3
"""Generate the Design QC PDF from audit-master.json (portal name + output filename come from the
JSON, so this is project-agnostic). HTML -> one dynamically-sized page per screen via render.js.
Source of truth: audit-master.json (kept in sync with the Figma report).
"""
import json, os, html, subprocess, sys, struct

BASE = os.path.dirname(os.path.abspath(__file__))
am = json.load(open(os.path.join(BASE, "audit-master.json")))

SEV = {"Blocker":"#dc2626","Major":"#ea580c","Minor":"#ca8a04","Nit":"#6b7280"}
TINT = {"design":"#fef3e2","build":"#eaf2fb","fix":"#ecfdf5"}
PANEL_W = 506  # px per panel in the comparison board
SINGLE_W = 1030  # a build-only board (no design frame) uses the full row
PHONE_W = 460    # a phone capture is shown near its real proportion, not blown up to the full row

def esc(s): return html.escape(str(s or ""))
def furl(rel): return "file://" + os.path.join(BASE, rel)
def exists(rel): return bool(rel) and os.path.exists(os.path.join(BASE, rel))

# ---- counts ----
counts = {"Blocker":0,"Major":0,"Minor":0,"Nit":0}; total=0
for s in am["screens"]:
    for f in s["findings"]:
        counts[f["severity"]] = counts.get(f["severity"],0)+1; total+=1
# The cover's SCREENS tile must say how many screens were AUDITED, not how many boards the report
# happens to draw. Once findings-free screens moved from a board each to a coverage ledger, and once
# global findings each took a board of their own, len(screens) stopped being the screen count in
# either direction. `coverageSummary.screensCaptured` is the audited total when the builder emits
# one; len(screens) remains the fallback for portals that do not.
screens_n = (am.get("coverageSummary") or {}).get("screensCaptured") or len(am["screens"])

TAG_CHAR_W = 5.95   # px per character, Noto Sans 10.5px/600 — measured, used only to wrap and place
TAG_LINE_H = 15

def _tag_size(label, maxw):
    """Estimated (w, h) of a callout tag: number badge + wrapped label."""
    text_w = len(label) * TAG_CHAR_W
    inner = maxw - 34
    lines = max(1, -(-int(text_w) // int(inner))) if label else 1
    w = min(maxw, text_w + 34) if label else 28
    return w, lines * TAG_LINE_H + 10

def _hit(a, b, pad=3):
    return not (a[2] + pad <= b[0] or b[2] + pad <= a[0] or a[3] + pad <= b[1] or b[3] + pad <= a[1])

def _layout_marks(marks, pw, ph, maxw):
    """Place each callout so it never covers ANY flagged element or another callout.
    marks: [(num, sev, (x1,y1,x2,y2) display px, label)]. Tries below / above / right / left of its own
    box inside the panel; anything that cannot fit clean goes to a gutter under the screenshot with a
    leader line — a tag is never allowed to sit on an issue."""
    boxes = [m[2] for m in marks]
    placed, gutter = [], []
    for num, sev, b, label in marks:
        w, h = _tag_size(label, maxw)
        x1, y1, x2, y2 = b
        cands = [(x1, y2 + 6), (x1, y1 - h - 6), (x2 - w, y2 + 6), (x2 - w, y1 - h - 6),
                 (x2 + 6, y1), (x1 - w - 6, y1), (x2 + 6, y2 - h), (x1 - w - 6, y2 - h)]
        spot = None
        for cx, cy in cands:
            cx = max(4, min(cx, pw - w - 4))
            r = (cx, cy, cx + w, cy + h)
            if cy < 4 or cy + h > ph - 4: continue
            if any(_hit(r, bb) for bb in boxes): continue
            if any(_hit(r, t[2]) for t in placed): continue
            spot = r; break
        if spot: placed.append((num, sev, spot, label, b, False))
        else: gutter.append((num, sev, (w, h), label, b))
    # gutter rows under the image, flowing left→right
    gx, gy, row_h, g_placed = 8, ph + 10, 0, []
    for num, sev, (w, h), label, b in gutter:
        if gx + w > pw - 8: gx, gy, row_h = 8, gy + row_h + 8, 0
        g_placed.append((num, sev, (gx, gy, gx + w, gy + h), label, b, True))
        gx += w + 8; row_h = max(row_h, h)
    gutter_h = (gy + row_h + 10 - ph) if g_placed else 0
    return placed + g_placed, gutter_h

def panel(img_rel, box, pins, side, marks=None, pw=None, basis=1440):
    """A cropped screenshot panel. Findings are drawn as MARKS — a tight outline around the exact span
    of the element plus a numbered callout tag carrying the measured values (e.g. "#E2E6EA on #0373DF
    = 3.70:1 at 14px · needs 4.5:1"). Legacy `pins` (num,sev,xPct,yPct) still render for old masters.
    marks: list of (num, sev, [x1,y1,x2,y2] in 1440-basis image px, label).
    When the image file is missing, renders a styled placeholder (canonical style is preserved even
    before a capture lands) instead of a broken <img> — never hand-roll a different layout for this."""
    pw = pw or PANEL_W
    basis = basis or 1440
    if not exists(img_rel):
        if side == "live":
            lbl, sub = "Live build capture pending", "save the capture and re-run"
        else:
            lbl, sub = "No Figma design — frame collapsed", "live-only, no side-by-side comparison"
        return (f'<div class="crop empty">{esc(lbl)}'
                f'<div class="empty-sub">{esc(sub)}</div></div>')
    x1,y1,x2,y2 = box
    cw, ch = (x2-x1), (y2-y1)
    scale = pw / cw
    dispH = round(ch*scale)
    imgw = round(basis*scale)
    pin_html = ""
    for num,sev,px,py in pins:
        left = px/100*pw; top = py/100*dispH
        pin_html += (f'<span class="pin" style="left:{left:.1f}px;top:{top:.1f}px;'
                     f'background:{SEV.get(sev,"#6b7280")}">{esc(num)}</span>')
    mark_html, svg, gutter_h = "", "", 0
    if marks:
        maxw = 250 if pw < 700 else 380
        disp = []
        for num, sev, mb, label in marks:
            bx1 = (mb[0]-x1)*scale - 3; by1 = (mb[1]-y1)*scale - 3
            bx2 = (mb[2]-x1)*scale + 3; by2 = (mb[3]-y1)*scale + 3
            disp.append((num, sev, (bx1, by1, bx2, by2), label or ""))
        laid, gutter_h = _layout_marks(disp, pw, dispH, maxw)
        for num, sev, (bx1, by1, bx2, by2), label in disp:
            col = SEV.get(sev, "#6b7280")
            mark_html += (f'<span class="mbox" style="left:{bx1:.1f}px;top:{by1:.1f}px;width:{bx2-bx1:.1f}px;'
                          f'height:{by2-by1:.1f}px;border-color:{col}"></span>')
        for num, sev, (tx1, ty1, tx2, ty2), label, b, in_gutter in laid:
            col = SEV.get(sev, "#6b7280")
            if in_gutter:
                sx, sy = (b[0]+b[2])/2, b[3]; ex, ey = (tx1+tx2)/2, ty1
                svg += (f'<line x1="{sx:.1f}" y1="{sy:.1f}" x2="{ex:.1f}" y2="{ey:.1f}" stroke="{col}" '
                        f'stroke-width="1.5" stroke-dasharray="4 3"/>')
            lbl = f'<span class="mtxt">{esc(label)}</span>' if label else ""
            nm = f'<span class="mnum">{esc(num)}</span>' if num not in (None, "") else ""
            mark_html += (f'<span class="mtag" style="left:{tx1:.1f}px;top:{ty1:.1f}px;max-width:{maxw}px;'
                          f'background:{col}">{nm}{lbl}</span>')
        if svg:
            svg = (f'<svg class="mlines" width="{pw}" height="{dispH+gutter_h}" '
                   f'viewBox="0 0 {pw} {dispH+gutter_h}">{svg}</svg>')
    return (f'<div class="crop" style="height:{dispH+gutter_h}px">'
            f'<img src="{furl(img_rel)}" style="left:{-x1*scale:.1f}px;top:{-y1*scale:.1f}px;width:{imgw}px;'
            f'clip-path:inset({y1*scale:.1f}px 0 {max(0.0, _imgh_px(img_rel, basis)*scale - y2*scale):.1f}px 0)"/>'
            f'{"<div class=gut style=top:%dpx;height:%dpx></div>" % (dispH, gutter_h) if gutter_h else ""}'
            f'{svg}{pin_html}{mark_html}</div>')

def _img_dims(path_abs):
    """(width, height) for PNG or JPEG. Boards ship as JPEG since the PNG report reached 277 MB, and
    a PNG-only reader returns nonsense for a JPEG — which clipped every board out of the page."""
    with open(path_abs, "rb") as fh:
        head = fh.read(2)
        if head == b"\xff\xd8":                      # JPEG: walk the segments to an SOF marker
            while True:
                b = fh.read(1)
                if not b:
                    raise ValueError("truncated jpeg")
                if b != b"\xff":
                    continue
                marker = fh.read(1)
                while marker == b"\xff":
                    marker = fh.read(1)
                m = marker[0]
                if m in (0xD8, 0x01) or 0xD0 <= m <= 0xD7:
                    continue
                ln = struct.unpack(">H", fh.read(2))[0]
                if 0xC0 <= m <= 0xCF and m not in (0xC4, 0xC8, 0xCC):
                    fh.read(1)
                    h, w = struct.unpack(">HH", fh.read(4))
                    return w, h
                fh.seek(ln - 2, 1)
        fh.seek(16)                                  # PNG: IHDR width/height
        return struct.unpack(">II", fh.read(8))


def _imgh_px(rel, basis=1440):
    """Height of the capture in BASIS px (so crop maths is independent of capture dpr and of a
    design frame whose natural width is not 1440)."""
    try:
        w, h = _img_dims(os.path.join(BASE, rel))
        return h * basis / w
    except Exception:
        return 100000

def _auto_box(sec_findings, key, basis=1440):
    """Crop derived from the marks when a finding gives none: their union, padded, at least 300 tall."""
    bs = [f[key]["box"] for f in sec_findings if f.get(key)]
    if not bs: return None
    x1 = min(b[0] for b in bs); y1 = min(b[1] for b in bs); x2 = max(b[2] for b in bs); y2 = max(b[3] for b in bs)
    y1 = max(0, y1 - 140); y2 = y2 + 140
    if y2 - y1 < 300: y2 = y1 + 300
    if x2 - x1 < basis * 0.55:
        cx = (x1 + x2) / 2; half = basis * 0.3
        x1 = max(0, min(cx - half, basis - 2 * half)); x2 = x1 + 2 * half
    else:
        x1, x2 = 0, basis
    return [round(x1), round(y1), round(x2), round(y2)]

def board(screen, section, sec_findings):
    basis_live = sec_findings[0].get("liveBasis") or screen.get("_basisLive") or 1440
    basis_fig = sec_findings[0].get("figmaBasis") or screen.get("_basisFigma") or 1440
    box = (sec_findings[0].get("sectionBox") or _auto_box(sec_findings, "liveMark", basis_live)
           or [0, 0, basis_live, 900])
    fig_box = (sec_findings[0].get("figmaBox") or _auto_box(sec_findings, "figmaMark", basis_fig) or
               [0, 0, basis_fig, box[3] - box[1]])   # design crop
    live_box = sec_findings[0].get("liveBox") or box   # per-section crop override (build) — use when
                                                     # design & build captures differ in proportion
    # A number only earns its place when a board carries more than one mark: with one, the outline
    # and its callout already say which card they belong to, and a lone "1" reads as noise.
    numbered = len(sec_findings) > 1
    def _marks(side):
        # A finding may carry one mark ("liveMark") or several ("liveMarks", e.g. every piece of design
        # copy missing from one page). Several marks of ONE finding share its number, or none.
        out = []
        for f in sec_findings:
            n = f["num"] if numbered else None
            for m in ([f[side + "Mark"]] if f.get(side + "Mark") else []) + list(f.get(side + "Marks") or []):
                out.append((n, f["severity"], m["box"], m.get("label", "")))
        return out
    fig_marks = _marks("figma")
    live_marks = _marks("live")
    fig_pins=[(f["num"],f["severity"],f["figmaPin"]["x"],f["figmaPin"]["y"]) for f in sec_findings if f.get("figmaPin")]
    live_pins=[(f["num"],f["severity"],f["livePin"]["x"],f["livePin"]["y"]) for f in sec_findings if f.get("livePin")]
    ids=[f["id"] for f in sec_findings]
    idrange = ids[0] if len(ids)==1 else f"{ids[0]} – {ids[-1]}"
    figma_img = sec_findings[0].get("figmaImgO") or screen.get("figmaImg")
    live_img = sec_findings[0].get("liveImgO") or screen.get("liveImg")
    title = sec_findings[0].get("titleO") or screen["name"]
    subtitle = sec_findings[0].get("subO") or section
    figu = sec_findings[0].get("figmaUrlO") or screen.get("figmaUrl")
    livu = sec_findings[0].get("liveUrlO") or screen.get("liveUrl")
    links=""
    if figu: links+=f'<a href="{esc(figu)}">Figma frame ↗</a>'
    if livu: links+=f'<a href="{esc(livu)}">Live page ↗</a>'
    env = screen.get("env","dev")
    # The design panel appears only where this board has something marked on the design: a standards
    # finding on a page that ALSO has design findings must not borrow an unrelated design frame.
    single = not figma_img or not (fig_marks or fig_pins)
    panels = ""
    design_only = (not single) and not (live_marks or live_pins) and bool(fig_marks or fig_pins)
    if design_only:
        # e.g. copy the design carries and the build lacks: there is nothing on the build to outline,
        # so the design panel carries the board alone rather than sit beside an unmarked crop.
        panels = (f'<div class="pwrap"><div class="plabel design"><b>DESIGN</b> Figma intent — '
                  f'outlined: what the build is missing</div>'
                  f'{panel(figma_img, fig_box, fig_pins, "figma", fig_marks, SINGLE_W if basis_fig >= 700 else PHONE_W, basis_fig)}</div>')
        return (f'<div class="board">'
                f'<div class="bhead"><div class="btitle"><b>{esc(title)}</b> · <span>{esc(subtitle)}</span></div>'
                f'<div class="bbadge">{esc(idrange)}</div></div>'
                f'<div class="panels">{panels}</div>'
                f'<div class="bfoot"><span>{esc(am["portal"])} — Design QC · {esc(am.get("generated",""))}</span>'
                f'<span class="links">{links}</span></div></div>')
    if not single:
        panels += (f'<div class="pwrap"><div class="plabel design"><b>DESIGN</b> Figma intent</div>'
                   f'{panel(figma_img, fig_box, fig_pins, "figma", fig_marks, None, basis_fig)}</div>')
    panels += (f'<div class="pwrap"><div class="plabel build"><b>BUILD</b> '
               f'{"Live build · "+env}</div>'
               f'{panel(live_img, live_box, live_pins, "live", live_marks, None if not single else (SINGLE_W if basis_live >= 700 else PHONE_W), basis_live)}</div>')
    return (f'<div class="board">'
            f'<div class="bhead"><div class="btitle"><b>{esc(title)}</b> · <span>{esc(subtitle)}</span></div>'
            f'<div class="bbadge">{esc(idrange)}</div></div>'
            f'<div class="panels">{panels}</div>'
            f'<div class="bfoot"><span>{esc(am["portal"])} — Design QC · {esc(am.get("generated",""))}</span>'
            f'<span class="links">{links}</span></div></div>')

def _imgh(rel):
    try:
        w, h = _img_dims(os.path.join(BASE, rel))
        return round(h * 1440 / w)
    except Exception:
        return 960

def ref_board(screen):
    """Parity/reference board — DESIGN │ BUILD side by side, no findings/pins. For screens verified
    faithful to the design (nothing to pin) that are still worth showing in the report."""
    fig_img = screen.get("figmaImg"); live_img = screen.get("liveImg")
    basis_live = screen.get("_basisLive") or 1440; basis_fig = screen.get("_basisFigma") or 1440
    Hl = _imgh_px(live_img, basis_live)
    figu = screen.get("figmaUrl"); livu = screen.get("liveUrl")
    links = ""
    if figu: links += f'<a href="{esc(figu)}">Figma frame ↗</a>'
    if livu: links += f'<a href="{esc(livu)}">Live page ↗</a>'
    panels = ""
    if fig_img:
        panels += f'<div class="pwrap"><div class="plabel design"><b>DESIGN</b> Figma intent</div>{panel(fig_img, [0,0,basis_fig,_imgh_px(fig_img, basis_fig)], [], "figma", None, None, basis_fig)}</div>'
    panels += f'<div class="pwrap"><div class="plabel build"><b>BUILD</b> Live build · {esc(screen.get("env","dev"))}</div>{panel(live_img, [0,0,basis_live,Hl], [], "live", None, None, basis_live)}</div>'
    badge = screen.get("_refbadge", "✓ faithful"); sub = screen.get("_refsub", "parity reference")
    return (f'<div class="board"><div class="bhead"><div class="btitle"><b>{esc(screen["name"])}</b> · <span>{esc(sub)}</span></div>'
            f'<div class="bbadge">{esc(badge)}</div></div><div class="panels">{panels}</div>'
            f'<div class="bfoot"><span>{esc(am["portal"])} — Design QC · {esc(am.get("generated",""))}</span>'
            f'<span class="links">{links}</span></div></div>')

def card(f, numbered=True):
    sev=f["severity"]; col=SEV.get(sev,"#6b7280")
    scope = f.get("scope")
    scope_chip = (f'<span class="scopechip">SCOPE: GLOBAL</span>' if scope=="Global" else "")
    scope_meta = (' &nbsp;·&nbsp; <b style="color:#6d28d9">Global</b> — applies to every screen with this element'
                  if scope=="Global" else "")
    numspan = f'<span class="num" style="background:{col}">{esc(f["num"])}</span>' if numbered else ""
    return (f'<div class="card" style="border-left-color:{col}">'
            f'<div class="chead">{numspan}'
            f'<span class="ctitle">{esc(f["element"])}</span>'
            f'{scope_chip}'
            f'<span class="chip" style="background:{col}">{esc(sev)}</span>'
            f'<span class="idb">{esc(f["id"])}</span></div>'
            f'<div class="meta">{esc(f.get("axis",""))}{scope_meta}</div>'
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
        cards="".join(card(f, len(sf) > 1) for f in sf)
        marked = any(f.get(k) for f in sf for k in ("liveMark", "figmaMark", "liveMarks", "figmaMarks", "livePin", "figmaPin"))
        # A page-level finding (the page's language, its console errors) has no element to point at:
        # a crop of the page with nothing marked on it only sends the reader looking for something.
        brd = board(s, sec, sf) if marked else ""
        groups+=f'<div class="group">{brd}<div class="cards">{cards}</div></div>'
    if not groups and (s.get("figmaImg") or s.get("liveImg")):   # findings-free parity/coverage/reference screen
        groups=f'<div class="group">{ref_board(s)}</div>'
        if not chips: chips=f'<span class="hchip" style="background:{s.get("_refchip","#047857")}">{esc(s.get("_refbadge","✓ faithful"))}</span>'
    screen_sections.append(f'<section class="screen"><div class="shead"><h2>{esc(s["name"])}</h2>'
                   f'<div class="hchips">{chips}</div></div>{note}{groups}</section>')
screens_html="".join(screen_sections)

# ---- deferred (optional): items parked by decision (e.g. approved divergence), not dropped ----
defer = am.get("deferred", [])
defer_html = ""
if defer and len(defer) > 20:
    # A long withdrawn/merged list is grouped by reason in the PDF — one row per reason listing its
    # ids — so the report stays readable; the tracker still carries one row per id.
    import re as _re
    grouped, merges = {}, []
    for d in defer:
        m = _re.match(r"Merged into ([A-Z0-9/ -]+?), which", d.get("reason", ""))
        if m:
            merges.append((str(d["id"]), m.group(1).strip()))
        else:
            grouped.setdefault(d.get("reason", ""), []).append(d)
    def _n(k): return f"{k} finding" + ("" if k == 1 else "s")
    rows = ""
    if merges:
        rows += (f'<div class="drow"><span class="did">{_n(len(merges))}</span>'
                 f'<span class="dtitle">Merged into a wider finding of the same kind — one fix, one row. '
                 f'Old id → the id that now carries it:</span>'
                 f'<div class="dreason">{esc("; ".join(f"{a} → {b}" for a, b in merges))}</div></div>')
    rows += "".join(f'<div class="drow"><span class="did">{_n(len(ds))}</span>'
                    f'<span class="dtitle">{esc(reason)}</span>'
                    f'<div class="dreason">{esc(", ".join(str(d["id"]) for d in ds))}</div></div>'
                    for reason, ds in sorted(grouped.items(), key=lambda kv: -len(kv[1])))
    defer_html = (f'<section class="screen"><div class="shead alt"><h2>Withdrawn, merged or exempted</h2>'
                  f'<div class="hchips"><span class="hchip" style="background:#6b7280">{len(defer)} items</span></div></div>'
                  f'<div class="defer">{rows}</div></section>')
elif defer:
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
       f'<div class="chowto">Each finding is outlined on the screenshots with a numbered callout carrying its measured values, and detailed below with its exact fix and severity.</div></section>')

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
.mbox { position:absolute; border:2px solid; border-radius:4px; box-sizing:border-box; pointer-events:none; }
.mtag { position:absolute; display:flex; align-items:flex-start; gap:6px; color:#fff; border-radius:6px; padding:4px 9px 4px 4px;
  font-size:10.5px; font-weight:600; line-height:15px; box-shadow:0 2px 6px rgba(15,23,42,.28); box-sizing:border-box; white-space:normal; }
.mnum { flex:none; min-width:17px; height:17px; border-radius:9px; background:#fff; color:#0f172a; font-size:10px; font-weight:700;
  display:flex; align-items:center; justify-content:center; line-height:1; margin-top:-1px; }
.mtxt { overflow-wrap:anywhere; }
.mlines { position:absolute; left:0; top:0; pointer-events:none; }
.gut { position:absolute; left:0; right:0; background:#f1f5f9; border-top:1px dashed #cbd5e1; }
.bfoot { display:flex; align-items:center; justify-content:space-between; border-top:1px solid #e6eaf0; padding:9px 18px; font-size:10px; color:#94a3b8; }
.bfoot .links a { color:#003366; text-decoration:none; margin-left:14px; }
.board { break-inside:avoid; page-break-inside:avoid; }
.cards { display:block; }
.card { border:1px solid #e6eaf0; border-left:4px solid; border-radius:12px; padding:14px 18px; margin-bottom:10px; break-inside:avoid; page-break-inside:avoid; background:#fff; }
.chead { display:flex; align-items:center; gap:10px; }
.num { width:22px; height:22px; border-radius:50%; color:#fff; font-weight:700; font-size:11px; display:flex; align-items:center; justify-content:center; flex:none; }
.ctitle { font-weight:600; font-size:14px; color:#0f2540; flex:1; }
.idb { background:#eef2f7; color:#64748b; font-weight:500; font-size:11px; border-radius:12px; padding:3px 11px; }
.scopechip { background:#ede9fe; color:#6d28d9; font-weight:700; font-size:9.5px; letter-spacing:.5px; border:1px solid #ddd6fe; border-radius:11px; padding:3px 9px; }
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
# The render budget has to scale with the report. A flat 300s was fine at 25 boards and silently
# expired at 45 on NMBA (2026-09-11), leaving a STALE pdf on disk while the surrounding shell
# pipeline reported success - `python3 generate_pdf.py | tail -1` takes tail's exit code, so the
# TimeoutExpired traceback scrolled past and `pdfinfo` then read the OLD file. Budget per section,
# with a floor, and never pipe this script's output in a way that eats its exit code.
_budget = max(300, 20 * len(am.get("screens", [])) + 120)
print(f"render budget: {_budget}s for {len(am.get('screens', []))} sections", flush=True)
r=subprocess.run(["node", os.path.join(BASE,"render.js")], cwd=BASE, capture_output=True, text=True, timeout=_budget)
if r.stdout.strip(): print(r.stdout.strip())
if r.returncode!=0: print("RENDER ERR:", r.stderr[-900:])
print("PDF:", pdf_path, (str(os.path.getsize(pdf_path))+" bytes") if os.path.exists(pdf_path) else "MISSING")
