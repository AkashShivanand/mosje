#!/usr/bin/env python3
"""Derive web-servable report figures from the local capture corpus.

The Hub serves /reports/<slug> at runtime, so its figures must be committed — but the raw corpus
is 220 MB across six portals and a previous attempt at committing full-resolution PNGs was
reverted for weight (PERF-007). Only the boards a report actually cites need to outlive the run,
and WebP at a capped width brings that set to single-digit MB.
"""
import json, os, sys
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config as C


def derive(project, out_dir, max_width=1440, quality=80):
    cfg, paths = C.load(project)
    master = os.path.join(paths["out"], "audit-master.json")
    if not os.path.exists(master):
        print("no audit-master.json — run analyze first"); return []
    data = json.load(open(master))
    slugs = {s.get("slug") for s in data.get("screens", []) if s.get("slug")}
    os.makedirs(out_dir, exist_ok=True)
    written = []
    for slug in sorted(slugs):
        src = os.path.join(paths["captures_live"], f"{slug}.png")
        if not os.path.exists(src):
            continue
        img = Image.open(src).convert("RGB")
        if img.width > max_width:
            img = img.resize((max_width, round(img.height * max_width / img.width)), Image.LANCZOS)
        dst = os.path.join(out_dir, f"{slug}.webp")
        img.save(dst, "WEBP", quality=quality, method=6)
        written.append(dst)
    total = sum(os.path.getsize(p) for p in written)
    print(f"figures: {len(written)} webp, {total / 1e6:.1f} MB -> {out_dir}")
    return written
