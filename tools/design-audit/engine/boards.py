#!/usr/bin/env python3
"""Crop and pin geometry for the side-by-side boards — the arithmetic every portal repeats.

Two rules, both bought with a bad board:

  · A GLOBAL finding gets its own board. Ten of them once shared three per-screen boards, which
    forced two markers to be clamped to the top of a crop that could not contain their element —
    a pin sitting on nothing, which is worse than no pin at all.
  · A crop grows DOWN, then UP. Growing only downwards produced a band shorter than the pin it had
    to hold whenever the anchor sat in the footer.

Every pin is asserted to sit inside its crop with the whole marker visible. A clamp is allowed
only where the element genuinely touches the top or bottom edge of the page; anywhere else it
means the crop is wrong and the run fails.
"""
import struct

COL = 688.0                    # the board column width the report and the Figma boards both use
SCALE = COL / 1440.0
PAD, MIN_CROP, MARKER = 130, 380, 28


def png_size(path):
    with open(path, "rb") as fh:
        fh.read(16)
        return struct.unpack(">II", fh.read(8))


def band(img_h, boxes, pad=PAD, min_crop=MIN_CROP):
    """The crop that holds every box given, in source pixels. Grows down, then up."""
    y0 = max(0, min(b[1] for b in boxes) - pad)
    y1 = min(img_h, max(b[1] + b[3] for b in boxes) + pad)
    if y1 - y0 < min_crop:
        y1 = min(img_h, y0 + min_crop)
    if y1 - y0 < min_crop:
        y0 = max(0, y1 - min_crop)
    return y0, y1


def pin(box, y0, scale=SCALE):
    """A marker's centre in board coordinates, relative to the top of its crop."""
    return [round((box[0] + box[2] / 2) * scale, 1),
            round((box[1] + box[3] / 2 - y0) * scale, 1)]


def board(design_png, build_png, design_boxes, build_boxes):
    """Everything a board needs: image heights, crop heights, offsets and pins, all scaled."""
    _, dH = png_size(design_png)
    _, bH = png_size(build_png)
    dy0, dy1 = band(dH, design_boxes)
    by0, by1 = band(bH, build_boxes)
    return {
        "dImgH": round(dH * SCALE), "bImgH": round(bH * SCALE),
        "dClipH": round((dy1 - dy0) * SCALE), "bClipH": round((by1 - by0) * SCALE),
        "dOff": round(-dy0 * SCALE), "bOff": round(-by0 * SCALE),
        "_dy0": dy0, "_by0": by0,
        "dPins": [pin(b, dy0) for b in design_boxes],
        "bPins": [pin(b, by0) for b in build_boxes],
    }


def check_pins(spec, ids=None):
    """Every marker inside its crop, whole. Returns failure strings — empty means publishable."""
    fails = []
    ids = ids or [str(i + 1) for i in range(len(spec["dPins"]))]
    for side, pins, clip, off, img in (("design", spec["dPins"], spec["dClipH"], spec["dOff"], spec["dImgH"]),
                                       ("build", spec["bPins"], spec["bClipH"], spec["bOff"], spec["bImgH"])):
        for fid, p in zip(ids, pins):
            if not (0 <= p[1] <= clip):
                fails.append(f"{fid}: {side} pin y={p[1]} outside crop 0..{clip}")
                continue
            if MARKER / 2 <= p[1] <= clip - MARKER / 2:
                continue
            at_top = p[1] < MARKER / 2 and off == 0
            at_bottom = p[1] > clip - MARKER / 2 and abs(-off + clip - img) <= 1
            if not (at_top or at_bottom):
                fails.append(f"{fid}: {side} pin y={p[1]} too close to the edge of a {clip}px crop "
                             f"— widen the crop, do not clamp the marker")
    return fails
