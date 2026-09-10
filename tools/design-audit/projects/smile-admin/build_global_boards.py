#!/usr/bin/env python3
"""Compute one DESIGN|BUILD board per GLOBAL finding, with a pin on each side.

Every global was previously grouped onto a shared board per screen, which meant two pins had
to be clamped to the top of a crop that could not contain their element — a marker that is not
on its element is worse than no marker (audit-rules §2/§F). One board per finding removes the
shared-crop constraint entirely: each crop is cut around its own anchor.
"""
import json, os, struct, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import findings_draft as F

COL, PAD, MINC = 688.0, 150, 380
SCALE = COL / 1440.0
SEV = {"Blocker": 0, "Major": 1, "Minor": 2, "Nit": 3}


def png_size(path):
    with open(path, "rb") as fh:
        fh.read(16)
        return struct.unpack(">II", fh.read(8))


def crop(img_h, box, pad=PAD, minc=MINC):
    """Cut a band around the anchor. Grows DOWN first, then UP — an anchor in the footer sits
    at the bottom of the image, so growing only downwards produced a crop shorter than the pin
    it had to contain, and the marker got clamped off its own element."""
    x, y, w, h = box
    y0 = max(0, y - pad)
    y1 = min(img_h, y + h + pad)
    if y1 - y0 < minc:
        y1 = min(img_h, y0 + minc)
    if y1 - y0 < minc:
        y0 = max(0, y1 - minc)
    return y0, y1, [round((x + w / 2) * SCALE, 1), round((y + h / 2 - y0) * SCALE, 1)]


def main():
    ba = json.load(open(os.path.join(HERE, "sheet", "anchors.json")))
    da = json.load(open(os.path.join(HERE, "design_anchors.json")))
    rows = {r["slug"]: r for r in json.load(open(os.path.join(HERE, "sheet", "figma_rows.json")))}
    hashes = json.load(open(os.path.join(HERE, "board_image_hashes.json")))

    globals_ = [f for f in (F.GLOBAL + F.DIFF + F.DIFF2) if f[1] == "Global"]
    globals_.sort(key=lambda f: (SEV[f[3]], f[0]))

    out, fail = [], []
    for i, f in enumerate(globals_, 1):
        fid = f[0]
        a = ba.get(fid)
        if not a:
            fail.append(f"{fid}: no build anchor"); continue
        slug = a["slug"]
        bp_ = os.path.join(HERE, "sheet", f"{slug}.build.png")
        dp_ = os.path.join(HERE, "sheet", f"{slug}.design.png")
        if not (os.path.exists(bp_) and os.path.exists(dp_)):
            fail.append(f"{fid}: no board image for {slug}"); continue
        _, bH = png_size(bp_); _, dH = png_size(dp_)
        by0, by1, bpin = crop(bH, a["box"])
        dbox = da.get(fid, {}).get("box")
        if not dbox:
            fail.append(f"{fid}: no design anchor"); continue
        dy0, dy1, dpin = crop(dH, dbox)
        r = rows[slug]
        out.append(dict(
            n=i, id=fid, sev=f[3], cat=f[4], title=f[5], design=f[6], build=f[7], fix=f[8],
            slug=slug, screen=r["title"], route=r["route"],
            figmaUrl=r["figmaUrl"], liveUrl=r["liveUrl"],
            dHash=hashes[slug + "|design"], bHash=hashes[slug + "|build"],
            dImgH=round(dH * SCALE), bImgH=round(bH * SCALE),
            dClipH=round((dy1 - dy0) * SCALE), bClipH=round((by1 - by0) * SCALE),
            dOff=round(-dy0 * SCALE), bOff=round(-by0 * SCALE),
            dp=dpin, bp=bpin))

    # A pin must sit inside its crop. The whole 28px marker should be visible too, but an
    # element that genuinely sits against the top of the page (the masthead controls) cannot
    # satisfy that — there the marker is allowed to be clamped, because it still lands on its
    # element. Anywhere else, a clamp means the crop is wrong and the run fails.
    for b in out:
        for side, pin, clip in (("design", b["dp"], b["dClipH"]), ("build", b["bp"], b["bClipH"])):
            if not (0 <= pin[1] <= clip):
                fail.append(f"{b['id']}: {side} pin y={pin[1]} outside crop 0..{clip}")
            elif not (14 <= pin[1] <= clip - 14):
                off = b["dOff"] if side == "design" else b["bOff"]
                img = b["dImgH"] if side == "design" else b["bImgH"]
                at_top = pin[1] < 14 and off == 0
                at_bottom = pin[1] > clip - 14 and abs(-off + clip - img) <= 1
                if not (at_top or at_bottom):
                    fail.append(f"{b['id']}: {side} pin y={pin[1]} too close to the crop edge "
                                f"(crop {clip}) — widen the crop, do not clamp the marker")
                else:
                    b.setdefault("clamped", []).append(side)

    json.dump(out, open(os.path.join(HERE, "sheet", "global_sections.json"), "w"), indent=1)
    for i in range(0, len(out), 5):
        part = out[i:i + 5]
        with open(os.path.join(HERE, "sheet", f"gbatch{i // 5 + 1}.json"), "w") as fh:
            json.dump(part, fh, ensure_ascii=False, separators=(",", ":"))
    print(f"{len(out)} global boards")
    for x in fail:
        print("   !", x)
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main())
