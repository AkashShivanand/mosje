#!/usr/bin/env python3
"""Reusable geometry + prose core for design-qc reports.

THE LESSON (learned the hard way, do not regress): pins kept landing on the wrong element
(sidebar, blank areas) and crops kept missing their element because crops were built from a
GUESSED image height + a fixed band. The fix: derive every crop and pin from the REAL element
box against the REAL capture dimensions, then ASSERT each pin sits inside its element box inside
the crop inside the image. A misplaced pin must be impossible by construction, not merely unlikely.

How a per-project author script uses this module:

    import qc_geometry as G
    # 1. build `screens` — each finding carries identity, not coordinates:
    #    engine finding:  _fbox / _lbox  = raw element boxes from diff.py candidates
    #    structural:      _fpct / _lpct  = %-anchor fallback, and optionally
    #                     _anchor = (anchorText, figmaDy, liveDy) to bind to a real element
    # 2. for sc in screens: G.finalize(sc, eng_dir=ENG, base_dir=BASE)
    # 3. G.write_failures(ENG)   # the learning ledger — never ship with failures

All boxes are in the renderer's 1440-px-wide image space (width always 1440); the real PNG
height is read per-capture and used for clamping + the assertion.
"""
import json, os, re, struct

PAD_FRAC = 0.045          # vertical breathing room around the element union, as a fraction of H
PAD_MIN  = 44             # …but at least this many px
WIDE_BOX = 700            # boxes wider than this are container-spanning (left-aligned) -> bias pin left
WIDE_BIAS = 110           # how far from the left edge to place the pin on a wide box
FAILURES = []             # assertion misses -> write_failures()

# ---- colour ----
def tohex(c):
    c = (c or '').strip()
    if c.startswith('#'): return c.lower()
    m = re.findall(r'\d+', c)
    return '#%02x%02x%02x' % (int(m[0]), int(m[1]), int(m[2])) if len(m) >= 3 else c

# ---- real capture dimensions (normalised to 1440-wide space) ----
def _png(p):
    try:
        with open(p, 'rb') as f:
            f.read(16); w, h = struct.unpack('>II', f.read(8)); return w, h
    except Exception:
        return (1440, 1000)
_dim = {}
def imgdims(rel, base_dir):
    key = rel
    if key not in _dim:
        w, h = _png(os.path.join(base_dir, rel)) if rel else (1440, 1000)
        _dim[key] = (1440, round(h * 1440 / w))
    return _dim[key]

# ---- anchor resolution: bind a structural finding to a real extracted element by text ----
def _norm(t): return re.sub(r'[^a-z0-9]', '', (t or '').lower())[:48]
_rows = {}
def rowsmap(path, eng_dir):
    """{normtext: (box, fontSize)} from an extraction file. `path` may be 'live/foo.json' or
    'figma/file.json#slug'. Keeps the LARGEST-font occurrence so a page title beats a same-text
    sidebar/nav link (the duplicate-text collision that put pins on the sidebar)."""
    if path not in _rows:
        m = {}
        try:
            fp, _, slug = path.partition('#')
            d = json.load(open(os.path.join(eng_dir, fp)))
            if slug: d = d.get(slug, {})
            for r in d.get('rows', []):
                k = _norm(r.get('text'))
                if not k: continue
                fsz = r.get('fontSize') or 0; cur = m.get(k)
                if cur is None or fsz > cur[1]:
                    m[k] = ({x: r.get(x) for x in ('x', 'y', 'w', 'h')}, fsz)
        except Exception:
            pass
        _rows[path] = m
    return _rows[path]
def figpath(slug, eng_dir, figma_files=('figma/public.json', 'figma/authed.json')):
    for fp in figma_files:
        try:
            if slug in json.load(open(os.path.join(eng_dir, fp))): return f"{fp}#{slug}"
        except Exception:
            pass
    return None
def anchorbox(path, text, dy, H, eng_dir):
    hit = rowsmap(path, eng_dir).get(_norm(text))
    if not hit or hit[0].get('w') is None: return None
    bb = dict(hit[0])
    if dy: bb['y'] = bb['y'] + dy * H     # nudge (e.g. an icon sits above its label)
    return bb

def _ctr(b): return (b['x'] + b['w'] / 2, b['y'] + b['h'] / 2)
def _boxpct(px, py, W, H, bw=380, bh=90):
    return {'x': px / 100 * W - bw / 2, 'y': py / 100 * H - bh / 2, 'w': bw, 'h': bh}

# ---- diff -> human prose (engine findings) ----
def parse(diffs):
    fp, lp = [], []
    for d in diffs:
        m = re.search(r'font-size (\d+)px -> (\d+)px', d)
        if m: fp.append(f"font-size {m.group(1)}px"); lp.append(f"font-size {m.group(2)}px"); continue
        m = re.search(r'weight (\S+) -> (\S+)', d)
        if m: fp.append(f"weight {m.group(1)}"); lp.append(f"weight {m.group(2)}"); continue
        m = re.search(r'font (\S+) -> (\S+)', d)
        if m: fp.append(f"font {m.group(1)}"); lp.append(f"font {m.group(2)}"); continue
        m = re.search(r'colour (\S+) -> (rgb\([^)]*\)|#\w+)', d)
        if m: fp.append(f"colour {tohex(m.group(1))}"); lp.append(f"colour {tohex(m.group(2))}"); continue
    return ("Design: " + ", ".join(fp) + ".", "Build: " + ", ".join(lp) + ".", ", ".join(fp), ", ".join(lp))
def sevax(diffs):
    s = " ".join(diffs); big = False
    for d in diffs:
        m = re.search(r'font-size (\d+)px -> (\d+)px', d)
        if m and abs(int(m.group(1)) - int(m.group(2))) >= 6: big = True
    sv = "Major" if big else "Minor"
    ax = ("Color & Token" if ("colour" in s and "font-size" not in s and "weight" not in s)
          else "Typography")
    return sv, ax

# ---- THE geometry pass ----
def finalize(screen, eng_dir, base_dir):
    """Group a screen's findings by section, build a full-width crop around each section's real
    element union, place pins relative to that crop, assert each pin is inside its element + crop +
    image, and renumber findings top-to-bottom. Mutates `screen` in place."""
    order, bysec, secy = [], {}, {}
    for f in screen["findings"]:
        bysec.setdefault(f["section"], []).append(f)
        if f["section"] not in order: order.append(f["section"])
    for sec in order:
        fs = bysec[sec]
        figImg = fs[0].get("figmaImgO") or screen.get("figmaImg")
        livImg = fs[0].get("liveImgO") or screen.get("liveImg")
        Wf, Hf = imgdims(figImg, base_dir) if figImg else (1440, 1000)
        Wl, Hl = imgdims(livImg, base_dir)
        base = os.path.splitext(os.path.basename(livImg))[0] if livImg else None
        lpath = f"live/{base}.json" if base else None
        fpath = figpath(base, eng_dir) if base else None
        for f in fs:
            fb, lb = f.get("_fbox"), f.get("_lbox")
            if f.get("_anchor"):                                  # bind to a real element (preferred)
                at, dyL, dyF = f["_anchor"]
                if lb is None and lpath: lb = anchorbox(lpath, at, dyL, Hl, eng_dir)
                if fb is None and fpath: fb = anchorbox(fpath, at, dyF, Hf, eng_dir)
            if fb is None and f.get("_fpct"): fb = _boxpct(*f["_fpct"], Wf, Hf)   # %-fallback
            if lb is None and f.get("_lpct"): lb = _boxpct(*f["_lpct"], Wl, Hl)
            if lb is None and fb is not None:                     # MISSING: show the design location
                lb = {"x": fb["x"], "y": min(fb["y"], max(0, Hl - fb["h"])), "w": fb["w"], "h": fb["h"]}
            f["__fb"], f["__lb"] = fb, lb
        def crop(boxes, H):
            if not boxes: return [0, 0, 1440, min(H, 420)]
            y0 = min(b["y"] for b in boxes); y1 = max(b["y"] + b["h"] for b in boxes)
            pad = max(PAD_MIN, H * PAD_FRAC)
            return [0, max(0, round(y0 - pad)), 1440, min(H, round(y1 + pad))]
        fc = crop([f["__fb"] for f in fs if f.get("__fb")], Hf)
        lc = crop([f["__lb"] for f in fs if f.get("__lb")], Hl)
        secy[sec] = lc[1]
        def pinx(b): return (b['x'] + WIDE_BIAS) if b['w'] > WIDE_BOX else b['x'] + b['w'] / 2
        for f in fs:
            f["figmaBox"] = fc; f["liveBox"] = lc; f["sectionBox"] = lc
            fb, lb = f.pop("__fb", None), f.pop("__lb", None)
            if fb:
                cx, cy = pinx(fb), _ctr(fb)[1]
                f["figmaPin"] = {"x": round(cx / 1440 * 100), "y": round((cy - fc[1]) / max(1, fc[3] - fc[1]) * 100, 1)}
                if not (0 <= cx <= 1440 and 0 <= cy <= Hf + 1):
                    FAILURES.append(f"{f['id']}: figma element outside capture (cy={round(cy)} vs {Hf}) — recapture")
            else: f["figmaPin"] = None
            if lb:
                cx, cy = pinx(lb), _ctr(lb)[1]
                f["livePin"] = {"x": round(cx / 1440 * 100), "y": round((cy - lc[1]) / max(1, lc[3] - lc[1]) * 100, 1)}
                if not (0 <= cx <= 1440 and 0 <= cy <= Hl + 1):
                    FAILURES.append(f"{f['id']}: live element outside capture (cy={round(cy)} vs {Hl}) — recapture taller")
            else: f["livePin"] = None
            for k in ("_fbox", "_lbox", "_fpct", "_lpct", "_anchor"): f.pop(k, None)
    order = sorted(order, key=lambda s: secy.get(s, 1e9))         # render sections top-to-bottom
    ordered = [f for sec in order for f in bysec[sec]]
    for i, f in enumerate(ordered, 1):                            # pins read 1,2,3… not 1,4,2,3
        f["num"] = i; f["id"] = f"{f['id'].rsplit('-', 1)[0]}-{i:03d}"
    screen["findings"] = ordered

def write_failures(eng_dir):
    with open(os.path.join(eng_dir, "failures.md"), "w") as fh:
        fh.write("# design-qc assertion failures (last run)\n\n")
        fh.write("Every pin must fall inside its element box inside the crop inside the capture.\n"
                 "Misses below mean a wrong match or a too-short capture — fix before shipping.\n\n")
        fh.write("\n".join(f"- {x}" for x in FAILURES) if FAILURES
                 else "_No failures — all pins asserted inside their element + crop._")
    return len(FAILURES)
