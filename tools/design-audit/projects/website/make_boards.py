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
    Returns the crop's width in basis px (the new basis for marks inside it)."""
    w, h = png_size(src)
    sc = w / float(basis)
    x1, y1, x2, y2 = box
    X, Y = max(0, int(x1 * sc)), max(0, int(y1 * sc))
    W, H = min(w - X, int((x2 - x1) * sc)), min(h - Y, int((y2 - y1) * sc))
    if W <= 0 or H <= 0:
        return None
    tmp = dst + ".crop.png"
    r = subprocess.run(["sips", "-c", str(H), str(W), "--cropOffset", str(Y), str(X), src,
                        "--out", tmp], capture_output=True, text=True)
    if r.returncode or not os.path.exists(tmp):
        return None
    # Boards ship as JPEG: the same crops as PNG made a 277 MB report, which no ministry mailbox
    # accepts. Quality 82 keeps 1px hairlines and 12px type legible at 2x.
    if W > target_w:
        subprocess.run(["sips", "--resampleWidth", str(target_w), tmp, "--out", tmp],
                       capture_output=True)
    subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "74", tmp, "--out", dst],
                   capture_output=True)
    if os.path.exists(tmp):
        os.remove(tmp)
    return (x2 - x1)          # new basis: the crop's width in basis px


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
    """side: 'live' | 'figma'. Crops that panel's image and moves its marks into crop space."""
    img_key = "liveImg" if side == "live" else "figmaImg"
    mark_key = "liveMark" if side == "live" else "figmaMark"
    basis_screen = "_basisLive" if side == "live" else "_basisFigma"
    basis_finding = "liveBasis" if side == "live" else "figmaBasis"
    box_key = "liveBox" if side == "live" else "figmaBox"

    img = screen.get(img_key)
    if not img:
        return
    src = os.path.join(BASE, img)
    if not os.path.exists(src):
        screen.pop(img_key, None)
        return
    basis = screen.get(basis_screen) or findings[0].get(basis_finding) or 1440
    marks = [f[mark_key] for f in findings if f.get(mark_key)]
    w, h = png_size(src)
    page_h = h * basis / w
    box = union(marks, basis, page_h) if marks else [0, 0, basis, min(page_h, basis * 0.75)]
    name = hashlib.md5((img + str(box)).encode()).hexdigest()[:12] + ".jpg"
    dst = os.path.join(BOARD, name)
    if not os.path.exists(dst) and crop_scale(src, box, basis, dst, target_w) is None:
        return
    new_basis = box[2] - box[0]
    screen[img_key] = f"captures/board/{name}"
    screen[basis_screen] = new_basis
    for f in findings:
        m = f.get(mark_key)
        if m:
            m["box"] = [m["box"][0] - box[0], m["box"][1] - box[1],
                        m["box"][2] - box[0], m["box"][3] - box[1]]
        f[basis_finding] = new_basis
        f[box_key] = [0, 0, new_basis, box[3] - box[1]]


def main():
    am = json.load(open(os.path.join(OUT, "audit-master.json")))
    for s in am["screens"]:
        fs = s["findings"]
        do_side(s, fs, "live", SINGLE_2X if not s.get("figmaImg") else PANEL_2X)
        do_side(s, fs, "figma", PANEL_2X)
        for f in fs:
            f["sectionBox"] = f.get("liveBox") or [0, 0, s.get("_basisLive", 1440), 600]
    json.dump(am, open(os.path.join(OUT, "audit-master.json"), "w"), indent=1)
    tot = sum(os.path.getsize(os.path.join(BOARD, f)) for f in os.listdir(BOARD))
    print(f"boards: {len(os.listdir(BOARD))} files, {tot / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
