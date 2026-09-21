#!/usr/bin/env python3
"""Append hand-authored, verified findings to the PUBLISHED audit-master without re-measuring.

Why this exists: build_master.py rebuilds the whole report from the measured sets in out/
(findings-auto.json, findings-design.json) and the 266 captures in captures/live/. Those are
local, git-ignored artefacts, and on 2026-09-21 they were lost with the worktree that held them.
The committed report survived. Until the site is re-captured, this adds only what
inputs/findings-judgement.json and inputs/verified-correct.json hold that the report lacks,
reusing the builder's own anchoring, id assignment and board cropping so the result is exactly
what a full rebuild would produce for those findings.

Each new finding needs a fresh capture of its own page (capture_live.mjs pages --only <slug>).
New findings go on their own board per page, because an existing board is a crop of the lost
capture and cannot be redrawn. A full rebuild later merges them into the page's one board; the
per-page cap still holds (Who's Who 2 + 4, the official profile 1 + 1).

  python3 append_judged.py            # dry run
  python3 append_judged.py --apply    # writes out/ and docs/ masters, copies board crops
"""
import collections, json, os, shutil, sys
import build_master as bm
import make_boards as mb

BASE = bm.BASE
REPO = os.path.abspath(os.path.join(BASE, "..", "..", "..", ".."))
DOCS = os.path.join(REPO, "docs", "qc", "portals", "website")


def main():
    apply = "--apply" in sys.argv
    am = json.load(open(os.path.join(bm.OUT, "audit-master.json")))
    published = {f["id"] for s in am["screens"] for f in s["findings"]}
    frozen = json.load(open(os.path.join(BASE, "frozen_ids.json")))

    judged = json.load(open(os.path.join(BASE, "inputs", "findings-judgement.json")))
    def ident(f):
        return f"{f['code']}|{f.get('key')}|{f.get('slug')}"
    new = [f for f in judged if frozen.get(ident(f)) not in published]
    if not new:
        print("nothing to add")
    new = [bm.resolve_anchor(dict(f)) for f in new]
    missing = [f["key"] for f in new if not f.get("box")]
    if missing:
        sys.exit(f"no capture box for {missing} — capture the page first")
    if apply:
        new = bm.frozen_ids(new)          # adds ids to frozen_ids.json, never changes one
    else:
        for i, f in enumerate(new):
            f["id"] = frozen.get(ident(f)) or f"(new #{i + 1})"

    by_page = collections.defaultdict(list)
    for f in new:
        by_page[(f["slug"], f["viewport"])].append(f)
    screens = []
    for (slug, vp), group in sorted(by_page.items()):
        group.sort(key=lambda f: (bm.RANK[f["severity"]], f["box"][1]))
        fs = []
        for i, f in enumerate(group, 1):
            req, live = bm.card_text(f)
            fs.append(dict(num=i, id=f["id"], element=f["element"], section="Content accuracy",
                           axis=f["axis"], severity=f["severity"], figma=req, live=live,
                           fix=f["fix"], liveBasis=f["liveBasis"],
                           liveMark={"box": f["box"], "label": f["label"]},
                           **({"liveMarks": f["extraMarks"]} if f.get("extraMarks") else {})))
        # Same rule as build_master: marks more than 600px apart get their own area, so no board is
        # a tall sliver with an outline at either end.
        fs.sort(key=lambda x: x["liveMark"]["box"][1])
        start, n = None, 0
        for i, item in enumerate(fs, 1):
            y = item["liveMark"]["box"][1]
            if start is None or y - start > 600:
                start, n = y, n + 1
            item["num"] = i
            item["section"] = f"Area {n} · about {int(start) // 100 * 100}px down the page"
        name = slug.replace("-", " ").title()
        s = dict(slug=f"{slug}.{vp}.content", name=f"{name} · {vp} · content accuracy", env="live",
                 liveImg=f"captures/live/{slug}.{vp}.png", liveUrl=group[0]["url"],
                 _basisLive=fs[0]["liveBasis"], findings=fs)
        first = None
        sections = collections.OrderedDict()
        for f in fs:
            sections.setdefault(f["section"], []).append(f)
        for sec in sections.values():
            crop = mb.do_side(s, sec, "live", mb.SINGLE_2X)
            if not crop:
                sys.exit(f"could not crop a board for {slug}")
            for f in sec:
                f["sectionBox"] = f.get("liveBox")
            first = first or crop
        s["liveImg"] = first
        s["_crops"] = [f.get("liveImgO") for f in fs if f.get("liveImgO")]
        screens.append(s)
        print(f"{s['slug']}: {len(fs)} finding(s), {len(sections)} area(s) → {s['_crops']}")
        for f in fs:
            print(f"   {f['id']}  {f['severity']:<6} {f['element']}")

    checked = json.load(open(os.path.join(BASE, "inputs", "verified-correct.json")))
    have = {d.get("title") for d in am.get("deferred", [])}
    notes = [{"id": "CHECKED", "title": c["title"], "reason": c["reason"]}
             for c in checked if c["title"] not in have]
    print(f"checked-correct notes to add: {len(notes)}")

    if not apply:
        print("\ndry run — nothing written")
        return
    am["screens"] += screens
    am["deferred"] = am.get("deferred", []) + notes
    for path in (os.path.join(bm.OUT, "audit-master.json"), os.path.join(DOCS, "audit-master.json")):
        json.dump(am, open(path, "w"), indent=1)
    dst = os.path.join(DOCS, "captures", "board")
    for s in screens:
        for c in s.pop("_crops"):
            shutil.copy2(os.path.join(BASE, c), os.path.join(dst, os.path.basename(c)))
    print(f"written: {sum(len(s['findings']) for s in screens)} findings, {len(notes)} notes; boards copied")


if __name__ == "__main__":
    main()
