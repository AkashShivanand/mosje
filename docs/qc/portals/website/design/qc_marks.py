"""Shared mark layout for Design QC boards: an outline on the element's real box plus a numbered
callout carrying the measured value, placed so it never covers a flagged element or another
callout. generate_pdf.py carries the same functions inline (it predates this module); the design
suggestions report imports them from here. Keep the two in step."""
import html

SEV = {"Blocker": "#dc2626", "Major": "#ea580c", "Minor": "#ca8a04", "Nit": "#6b7280",
       "Decide": "#7c3aed", "Design": "#b45309", "Propose": "#1d4ed8"}


def esc(s):
    return html.escape(str(s or ""))


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



def marks_html(marks, pw, disp_h, maxw):
    """marks: [(num, colour_key, (x1,y1,x2,y2) display px, label)] -> (html, gutter_h)."""
    laid, gutter_h = _layout_marks(marks, pw, disp_h, maxw)
    out, svg = "", ""
    for num, sev, (bx1, by1, bx2, by2), label in marks:
        col = SEV.get(sev, sev if str(sev).startswith("#") else "#6b7280")
        out += (f'<span class="mbox" style="left:{bx1:.1f}px;top:{by1:.1f}px;width:{bx2-bx1:.1f}px;'
                f'height:{by2-by1:.1f}px;border-color:{col}"></span>')
    for num, sev, (tx1, ty1, tx2, ty2), label, b, in_gutter in laid:
        col = SEV.get(sev, sev if str(sev).startswith("#") else "#6b7280")
        if in_gutter:
            sx, sy = (b[0] + b[2]) / 2, b[3]
            svg += (f'<line x1="{sx:.1f}" y1="{sy:.1f}" x2="{(tx1+tx2)/2:.1f}" y2="{ty1:.1f}" '
                    f'stroke="{col}" stroke-width="1.5" stroke-dasharray="4 3"/>')
        lbl = f'<span class="mtxt">{esc(label)}</span>' if label else ""
        nm = f'<span class="mnum">{esc(num)}</span>' if num not in (None, "") else ""
        out += (f'<span class="mtag" style="left:{tx1:.1f}px;top:{ty1:.1f}px;max-width:{maxw}px;'
                f'background:{col}">{nm}{lbl}</span>')
    if svg:
        out = (f'<svg class="mlines" width="{pw}" height="{disp_h+gutter_h}" '
               f'viewBox="0 0 {pw} {disp_h+gutter_h}">{svg}</svg>') + out
    return out, gutter_h


MARK_CSS = """
.mbox{position:absolute;border:2px solid;border-radius:4px;box-sizing:border-box;pointer-events:none}
.mtag{position:absolute;display:flex;align-items:flex-start;gap:6px;color:#fff;border-radius:6px;padding:4px 9px 4px 4px;
  font-size:10.5px;font-weight:600;line-height:15px;box-shadow:0 2px 6px rgba(15,23,42,.28);box-sizing:border-box;white-space:normal}
.mnum{flex:none;min-width:17px;height:17px;border-radius:9px;background:#fff;color:#0f172a;font-size:10px;font-weight:700;
  display:flex;align-items:center;justify-content:center;line-height:1;margin-top:-1px}
.mtxt{overflow-wrap:anywhere}.mlines{position:absolute;left:0;top:0;pointer-events:none}
.gut{position:absolute;left:0;right:0;background:#f1f5f9;border-top:1px dashed #cbd5e1}
"""
