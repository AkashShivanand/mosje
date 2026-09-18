#!/usr/bin/env python3
"""Crop each board's screenshot to the region it actually shows, and rewrite the master to match.

A full-page capture is up to 1440×12000. Embedding one per board produced a 277 MB PDF that no
ministry mailbox would accept. Each board needs only its crop, so this cuts it once, at 2× the
panel width, and rewrites the finding boxes into the crop's own coordinates.

  python3 make_boards.py      # rewrites out/audit-master.json in place, writes captures/board/
"""
import json, os, struct, subprocess, hashlib

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "out")
BOARD = os.path.join(BASE, "captures", "board")
os.makedirs(BOARD, exist_ok=True)
PANEL_2X = 1012          # 506 px panel at 2×
SINGLE_2X = 1500          # a build-only board: 2x of a 506 panel is plenty for a 58 MB budget
PAD = 140                # basis px of context above and below the marks


def png_size(p):
    with open(p, "rb") as fh:
        fh.read(16)
        return struct.unpack(">II", fh.read(8))


def crop_scale(src, box, basis, dst, target_w):
    """box is in `basis` px; writes dst cropped to box and scaled so its width is <= target_w.

    Pillow, not sips: `sips -c --cropOffset` silently returned the WHOLE page when the crop region
    ran to the image's bottom edge (the footer board, 18 Sep), so a footer finding was drawn on the
    masthead. The result is checked against the requested size before it is accepted."""
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    im = Image.open(src).convert("RGB")
    w, h = im.size
    sc = w / float(basis)
    x1, y1, x2, y2 = box
    X, Y = max(0, int(x1 * sc)), max(0, int(y1 * sc))
    X2, Y2 = min(w, int(x2 * sc)), min(h, int(y2 * sc))
    if X2 <= X or Y2 <= Y:
        return None
    crop = im.crop((X, Y, X2, Y2))
    assert crop.size == (X2 - X, Y2 - Y), "crop size mismatch"
    if crop.width > target_w:
        crop = crop.resize((target_w, round(crop.height * target_w / crop.width)), Image.LANCZOS)
    crop.save(dst, "JPEG", quality=78, optimize=True)
    return x2 - x1


def union(marks, basis, page_h):
    xs1 = [m["box"][0] for m in marks]
    ys1 = [m["box"][1] for m in marks]
    xs2 = [m["box"][2] for m in marks]
    ys2 = [m["box"][3] for m in marks]
    y1 = max(0, min(ys1) - PAD)
    y2 = max(ys2) + PAD
    if y2 - y1 < 320:
        y2 = y1 + 320
    if page_h:
        y2 = min(y2, page_h)
    x1, x2 = 0, basis
    if max(xs2) - min(xs1) < basis * 0.5 and basis > 700:
        cx = (min(xs1) + max(xs2)) / 2
        half = basis * 0.3
        x1 = max(0, min(cx - half, basis - 2 * half))
        x2 = x1 + 2 * half
    return [round(x1), round(y1), round(x2), round(y2)]


def do_side(screen, findings, side, target_w):
    """Crop ONE section's panel. side: 'live' | 'figma'. Writes the crop to captures/board/, sets the
    section's *ImgO override on its first finding (the generator reads overrides from there), and moves
    every mark of the section into crop coordinates."""
    img_key = "liveImg" if side == "live" else "figmaImg"
    basis_screen = "_basisLive" if side == "live" else "_basisFigma"
    basis_finding = "liveBasis" if side == "live" else "figmaBasis"
    box_key = "liveBox" if side == "live" else "figmaBox"
    img = screen.get(img_key)
    if not img:
        return None
    src = os.path.join(BASE, img)
    if not os.path.exists(src):
        return None
    basis = findings[0].get(basis_finding) or screen.get(basis_screen) or 1440
    marks = []
    for f in findings:
        if f.get(side + "Mark"):
            marks.append(f[side + "Mark"])
        marks.extend(f.get(side + "Marks") or [])
    w, h = png_size(src)
    page_h = h * basis / w
    box = union(marks, basis, page_h) if marks else [0, 0, basis, min(page_h, basis * 0.6)]
    name = hashlib.md5((img + str(box) + side).encode()).hexdigest()[:12] + ".jpg"
    dst = os.path.join(BOARD, name)
    if not os.path.exists(dst) and crop_scale(src, box, basis, dst, target_w) is None:
        return None
    new_basis = box[2] - box[0]
    for m in marks:
        m["box"] = [m["box"][0] - box[0], m["box"][1] - box[1], m["box"][2] - box[0], m["box"][3] - box[1]]
    for f in findings:
        f[basis_finding] = new_basis
        f[box_key] = [0, 0, new_basis, box[3] - box[1]]
    findings[0][img_key + "O"] = f"captures/board/{name}"
    return f"captures/board/{name}"


def main():
    am = json.load(open(os.path.join(OUT, "audit-master.json")))
    for s in am["screens"]:
        sections = {}
        for f in s["findings"]:
            sections.setdefault(f.get("section", "page"), []).append(f)
        first_live = first_fig = None
        for sec, fs in sections.items():
            has_live = any(f.get("liveMark") or f.get("liveMarks") for f in fs)
            has_fig = any(f.get("figmaMark") or f.get("figmaMarks") for f in fs)
            if not (has_live or has_fig):
                continue                       # page-level group: cards only, no board
            wide = not s.get("figmaImg")
            lv = do_side(s, fs, "live", SINGLE_2X if wide else PANEL_2X)
            fg = (do_side(s, fs, "figma", PANEL_2X if has_live else SINGLE_2X)
                  if s.get("figmaImg") and has_fig else None)
            for f in fs:
                f["sectionBox"] = f.get("liveBox") or [0, 0, f.get("liveBasis", 1440), 600]
            first_live = first_live or lv
            first_fig = first_fig or fg
        # the screen-level image is the first section's crop (reference boards read it)
        if first_live:
            s["liveImg"] = first_live
        if first_fig:
            s["figmaImg"] = first_fig
    json.dump(am, open(os.path.join(OUT, "audit-master.json"), "w"), indent=1)
    tot = sum(os.path.getsize(os.path.join(BOARD, f)) for f in os.listdir(BOARD))
    print(f"boards: {len(os.listdir(BOARD))} files, {tot / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
