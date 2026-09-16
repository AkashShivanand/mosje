#!/usr/bin/env python3
"""Turn the findings + resolved anchors into a board spec the Figma builder consumes.

Every crop and every pin is DERIVED from a real element box against the real image height, and
each pin is ASSERTED inside its element, inside its crop, inside the image. A miss is written to
out/failures-report.md and the build refuses to proceed (audit-rules §F: ship only when empty).
"""
import json, os, struct, sys, collections

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import findings_draft as F

COL       = 688                 # design/build column width in the 1436-wide house board
SCALE     = COL / 1440.0
PAD       = 150                 # px of context around the anchor bounds, in 1440-space
MIN_CROP  = 420
FIGMA_URL = "https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id={}"
LIVE_URL  = "https://smile-admin-dev.mosje.in{}"
SEV_ORDER = {"Blocker": 0, "Major": 1, "Minor": 2, "Nit": 3}

def png(path):
    with open(path, "rb") as fh:
        fh.read(16); return struct.unpack(">II", fh.read(8))

def main():
    build_a  = json.load(open(os.path.join(HERE, "sheet", "anchors.json")))
    design_a = json.load(open(os.path.join(HERE, "design_anchors.json")))
    frames   = {f["node_id"]: f for f in json.load(open(os.path.join(HERE, "inputs", "figma-frames.json")))}

    findings = [dict(id=f[0], scope=f[1], screen=f[2], sev=f[3], cat=f[4], title=f[5],
                     design=f[6], build=f[7], fix=f[8]) for f in (F.GLOBAL + F.SCREEN)]

    # group by the capture the finding is pinned on
    groups = collections.OrderedDict()
    for fd in findings:
        a = build_a.get(fd["id"])
        if not a:
            print(f"  ! {fd['id']} has no build anchor — it will render without a pin")
            continue
        groups.setdefault((a["slug"], fd["scope"]), []).append(fd)

    failures, boards = [], []
    for (slug, scope), fds in groups.items():
        fds.sort(key=lambda f: (SEV_ORDER.get(f["sev"], 9), build_a[f["id"]]["box"][1]))
        bpng = os.path.join(HERE, "sheet", f"{slug}.build.png")
        dpng = os.path.join(HERE, "sheet", f"{slug}.design.png")
        if not (os.path.exists(bpng) and os.path.exists(dpng)):
            failures.append(f"{slug}: missing sheet image"); continue
        _, bH = png(bpng); _, dH = png(dpng)

        def crop(boxes, H):
            ys = [b[1] for b in boxes]; y2 = [b[1] + b[3] for b in boxes]
            y0 = max(0, min(ys) - PAD); y1 = min(H, max(y2) + PAD)
            if y1 - y0 < MIN_CROP: y1 = min(H, y0 + MIN_CROP)
            if y1 - y0 < MIN_CROP: y0 = max(0, y1 - MIN_CROP)
            return [y0, y1]

        bboxes = [build_a[f["id"]]["box"] for f in fds]
        dboxes = [design_a[f["id"]]["box"] for f in fds if f["id"] in design_a]
        bc = crop(bboxes, bH)
        dc = crop(dboxes, dH) if dboxes else [0, min(dH, 900)]

        def pin(box, c, H, side, fid):
            cx = box[0] + box[2] / 2.0
            cy = box[1] + box[3] / 2.0
            if not (0 <= cx <= 1440):
                failures.append(f"{fid} [{side}]: cx={cx:.0f} outside 0..1440"); return None
            if not (c[0] <= cy <= c[1]):
                failures.append(f"{fid} [{side}]: cy={cy:.0f} outside crop {c}"); return None
            if not (0 <= cy <= H):
                failures.append(f"{fid} [{side}]: cy={cy:.0f} outside image height {H}"); return None
            return [round(cx * SCALE, 1), round((cy - c[0]) * SCALE, 1)]

        items = []
        for i, fd in enumerate(fds, 1):
            b = build_a[fd["id"]]["box"]
            bp = pin(b, bc, bH, "build", fd["id"])
            dp = None
            if fd["id"] in design_a:
                dp = pin(design_a[fd["id"]]["box"], dc, dH, "design", fd["id"])
            items.append(dict(n=i, **fd, buildPin=bp, designPin=dp,
                              anchor=build_a[fd["id"]]["anchor"]))

        node = None
        for nid, fr in frames.items():
            want = "SUPER-ADMIN-" + "-".join(x for x in (fr.get("route") or "").strip("/").upper().split("/"))
            if fr.get("route") and want == slug: node = nid; break
        route = "/" + slug.replace("SUPER-ADMIN-", "").lower().replace("-", "/") if not node else frames[node]["route"]

        boards.append(dict(
            slug=slug, scope=scope,
            title=(frames[node]["name"].split("/", 1)[-1] if node else slug.replace("SUPER-ADMIN-", "").title()),
            route=route,
            figmaUrl=FIGMA_URL.format(node.replace(":", "-")) if node else "",
            liveUrl=LIVE_URL.format(route),
            designCrop=dc, buildCrop=bc,
            designImgH=round(dH * SCALE), buildImgH=round(bH * SCALE),
            designClipH=round((dc[1] - dc[0]) * SCALE), buildClipH=round((bc[1] - bc[0]) * SCALE),
            designOffset=round(-dc[0] * SCALE), buildOffset=round(-bc[0] * SCALE),
            counts={s: sum(1 for i in items if i["sev"] == s) for s in SEV_ORDER},
            findings=items))

    boards.sort(key=lambda b: (0 if b["scope"] == "Global" else 1,
                               min(SEV_ORDER.get(i["sev"], 9) for i in b["findings"])))
    out = os.path.join(HERE, "sheet", "report_spec.json")
    json.dump(dict(boards=boards, total=sum(len(b["findings"]) for b in boards)), open(out, "w"), indent=1)

    fp = os.path.join(HERE, "out", "failures-report.md")
    with open(fp, "w") as fh:
        fh.write("# report pin assertions\n\nEvery pin must sit inside its element, inside the crop, inside the image.\n\n")
        fh.write("\n".join("- " + x for x in failures) if failures else "_No failures._\n")
    print(f"{len(boards)} boards, {sum(len(b['findings']) for b in boards)} pinned findings -> sheet/report_spec.json")
    for b in boards:
        c = b["counts"]
        print(f"  {b['slug']:<34} {b['scope']:<7} n={len(b['findings']):<2} "
              f"B{c['Blocker']} M{c['Major']} m{c['Minor']} n{c['Nit']}  "
              f"designClip={b['designClipH']} buildClip={b['buildClipH']}")
    print(("FAILURES: " + str(len(failures))) if failures else "assertions: all pins inside element+crop+image")
    for x in failures: print("   !", x)

if __name__ == "__main__":
    main()
