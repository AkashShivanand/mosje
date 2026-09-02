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


def _convert(src, dst, max_width, quality):
    img = Image.open(src).convert("RGB")
    if img.width > max_width:
        img = img.resize((max_width, round(img.height * max_width / img.width)), Image.LANCZOS)
    img.save(dst, "WEBP", quality=quality, method=6)


def derive(project, out_dir, max_width=1440, quality=80):
    """Emit <slug>-live.webp (from `liveImg`) and, when present, <slug>-design.webp
    (from `figmaImg`) for every screen in audit-master.json that carries an image
    reference. `slug` names the DESIGN frame and is NOT the live capture's filename
    (that comes from the route) — `liveImg`/`figmaImg` are audit-master.json's own
    relative paths and are always the correct source, regardless of naming scheme.

    A screen with neither field (e.g. the synthetic GLOBAL-DSCONF rollup row) is
    skipped without a warning — it is not a screen with a missing image, it never
    claimed to have one. A screen whose referenced file is missing on disk is
    skipped WITH a one-line warning naming the slug; one bad reference never aborts
    the run.
    """
    cfg, paths = C.load(project)
    master = os.path.join(paths["out"], "audit-master.json")
    if not os.path.exists(master):
        print("no audit-master.json — run analyze first"); return []
    data = json.load(open(master))
    os.makedirs(out_dir, exist_ok=True)
    written, no_ref, missing = [], 0, 0
    for s in data.get("screens", []):
        slug = s.get("slug")
        if not slug:
            continue
        refs = [(s.get("liveImg"), "live"), (s.get("figmaImg"), "design")]
        if not any(ref for ref, _ in refs):
            no_ref += 1
            continue
        for ref, kind in refs:
            if not ref:
                continue
            src = os.path.join(paths["project"], ref)
            if not os.path.exists(src):
                print(f"  ! {slug} ({kind}): {ref} not found on disk — skipped")
                missing += 1
                continue
            dst = os.path.join(out_dir, f"{slug}-{kind}.webp")
            _convert(src, dst, max_width, quality)
            written.append(dst)
    total = sum(os.path.getsize(p) for p in written)
    print(f"figures: {len(written)} webp, {total / 1e6:.1f} MB -> {out_dir} "
          f"({no_ref} screen(s) with no image reference, {missing} reference(s) missing on disk)")
    return written
