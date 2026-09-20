#!/usr/bin/env python3
"""Design intent (Figma handoff) vs the live build — spec comparison, never pixel diff.

Matches elements by their rendered TEXT (the only identity both sides share), then diffs the
properties a design owns: type size, weight, family, colour. Width/height are never compared —
they vary with content and viewport — and neither is dynamic data.

Each finding carries BOTH boxes, so the report draws the outline on the design frame and on the
build capture, with the measured values in the callout.

  python3 compare_design.py        # writes out/findings-design.json + out/design-rollup.json
"""
import json, os, re, glob, collections

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "out")
LIVE = os.path.join(BASE, "captures", "live")
SPECS = os.path.join(BASE, "inputs", "figma-specs")
os.makedirs(OUT, exist_ok=True)

MIN_TEXT = 4            # shorter strings collide constantly ("PDF", "of", "New")
SIZE_TOL = 1.0          # px
WEIGHT_TOL = 100

# Text that is DATA rather than UI copy: never a finding when it differs. A design frame fills its
# lists with sample people, e-mail addresses, rooms and figures; the live page shows the real ones.
# Reporting the sample as "missing copy" (CPIO's officer list, Contact Us's room numbers) is false.
DATA_RX = re.compile(
    r"^[\d\s,.:/₹%+()-]*$"                                   # numbers, amounts, dates
    r"|^\d{1,2}[-/ ][A-Za-z]{3,9}[-/ ]\d{2,4}$"
    r"|^(page|showing)\b"
    r"|^(shri|smt|dr|ms|mr|mrs|kumari|km)\.?\s"                # a person
    r"|\[at\]|\[dot\]|@|\bwww\.|https?:"                      # e-mail / web address
    r"|\broom no\b|\b[a-z]-wing\b|\bnew delhi\b|\b\d{6}\b"   # an address
    r"|₹|\b\d[\d,.]*\s?(cr|crore|lakh|lakhs|%)\b"               # a figure
    r"|^\d+(\.\d+)?\s?(mb|kb|gb)$"
    r"|\b\d{1,2}:\d{2}\s?(am|pm)\b|\bonwards\b", re.I)


def norm(t):
    t = re.sub(r"\s+", " ", (t or "")).strip().lower()
    t = t.replace("’", "'").replace("–", "-").replace("—", "-").replace("&amp;", "&")
    return re.sub(r"[ ]+", " ", t).strip(" .:·|")


def _px(v):
    try:
        return float(str(v).replace("px", ""))
    except (TypeError, ValueError):
        return None


def _hex(c):
    if isinstance(c, dict):                     # Figma fill: {"hex": "#343A40", "opacity": 1.0}
        c = c.get("hex")
    if not c:
        return None
    c = str(c).strip().lower()
    m = re.match(r"^#([0-9a-f]{6})", c)
    if m:
        return "#" + m.group(1).upper()
    m = re.match(r"^rgba?\(([^)]+)\)", c)
    if m:
        p = [float(x) for x in re.split(r"[ ,]+", m.group(1).strip())[:3]]
        return "#%02X%02X%02X" % tuple(int(round(v)) for v in p)
    return None


def load_specs():
    out = {}
    for p in glob.glob(os.path.join(SPECS, "*.json")):
        out[os.path.basename(p)[:-5]] = json.load(open(p))
    return out


def spec_texts(spec, frame_h=None):
    """[(normtext, {size, weight, family, colour, box})] for a frame's visible TEXT nodes."""
    rows = []
    nodes = spec.get("texts") or spec.get("text") or spec.get("textNodes") or []
    for n in nodes:
        t = norm(n.get("characters") or n.get("text"))
        if len(t) < MIN_TEXT or DATA_RX.search(t):
            continue
        b = n.get("box") or n.get("bbox") or n.get("absoluteBoundingBox") or {}
        if isinstance(b, dict):
            box = [b.get("x", 0), b.get("y", 0), b.get("x", 0) + b.get("width", b.get("w", 0)),
                   b.get("y", 0) + b.get("height", b.get("h", 0))]
        else:
            box = list(b)
        if box[2] - box[0] <= 0 or box[3] - box[1] <= 0:
            continue
        rows.append((t, {
            "raw": re.sub(r"\s+", " ", (n.get("characters") or n.get("text") or "")).strip(),
            "size": _px(n.get("fontSize")),
            "weight": n.get("fontWeight"),
            "family": (n.get("fontFamily") or n.get("fontName") or "").split(",")[0].strip(),
            "colour": _hex(n.get("fill") or n.get("color") or n.get("colour")),
            "opacity": (n.get("fill") or {}).get("opacity") if isinstance(n.get("fill"), dict) else None,
            "box": [round(v) for v in box],
        }))
    return rows


def live_texts(d):
    rows = []
    for e in d.get("elements", []):
        t = norm(e.get("text"))
        if len(t) < MIN_TEXT or DATA_RX.search(t):
            continue
        b = e.get("bbox") or {}
        if not b or b.get("w", 0) <= 0 or b.get("h", 0) <= 0:
            continue
        rows.append((t, {
            "size": _px(e.get("fontSize")),
            "weight": int(str(e.get("fontWeight")).replace("bold", "700")) if str(
                e.get("fontWeight", "")).replace("bold", "700").isdigit() else None,
            "family": (e.get("fontFamily") or "").replace('"', "").split(",")[0].strip(),
            "colour": _hex(e.get("color")),
            "box": [round(b["x"]), round(b["y"]), round(b["x"] + b["w"]), round(b["y"] + b["h"])],
            "tag": e.get("tag"),
        }))
    return rows


def uniq(rows):
    """Only texts appearing exactly once on a side can be matched without ambiguity."""
    c = collections.Counter(t for t, _ in rows)
    return {t: v for t, v in rows if c[t] == 1}


def compare(entry, spec_slug, specs, viewport, chrome=frozenset(), match_kind="exact"):
    """Returns findings; each carries figmaBasis (the frame's natural width) for mark scaling."""
    live_path = os.path.join(LIVE, f"{entry['slug']}.{viewport}.json")
    if not os.path.exists(live_path) or spec_slug not in specs:
        return []
    d = json.load(open(live_path))
    if d.get("status") != 200 or not d.get("elementCount"):
        return []
    basis_fig = specs[spec_slug].get("width") or 1440
    basis_live = 1440 if viewport == "desktop" else 375
    fig = uniq(spec_texts(specs[spec_slug]))
    liv = uniq(live_texts(d))
    out = []
    is_home = entry.get("slug") == "home"
    for t, f in fig.items():
        l = liv.get(t)
        if not l:
            continue
        diffs, labels = [], []
        if f["size"] and l["size"] and abs(f["size"] - l["size"]) >= SIZE_TOL:
            diffs.append(("Typography", f"size {f['size']:.0f} → {l['size']:.0f}"))
            labels.append(f"Built {l['size']:.0f}px · design {f['size']:.0f}px")
        fw, lw = f.get("weight"), l.get("weight")
        if isinstance(fw, (int, float)) and isinstance(lw, (int, float)) and abs(fw - lw) >= WEIGHT_TOL:
            diffs.append(("Typography", f"weight {fw} → {lw}"))
            labels.append(f"Built {lw} weight · design {fw}")
        if f["colour"] and l["colour"] and f["colour"] != l["colour"]:
            diffs.append(("Color & Token", f"colour {f['colour']} → {l['colour']}"))
            labels.append(f"Built {l['colour']} · design {f['colour']}")
        if f["family"] and l["family"] and f["family"].lower() != l["family"].lower():
            diffs.append(("Typography", f"family {f['family']} → {l['family']}"))
            labels.append(f"Built {l['family']} · design {f['family']}")
        if not diffs:
            continue
        axis = diffs[0][0]
        sev = "Major" if any(a == "Color & Token" for a, _ in diffs) or len(diffs) > 1 else "Minor"
        out.append(dict(
            code="DVB-SPEC", axis=axis, severity=sev, standard="Figma handoff",
            title="Built value differs from the design",
            element=(f.get("raw") or t)[:60], slug=entry["slug"], viewport=viewport, url=entry.get("url"),
            figmaBoxRaw=f["box"], box=l["box"], figmaBasis=basis_fig, liveBasis=basis_live,
            cssFg=l["colour"], figmaFg=f["colour"],
            label=" · ".join(labels)[:110],
            figmaLabel=" · ".join(labels)[:110],
            detail=f"“{(f.get('raw') or t)[:70]}” — " + "; ".join(x for _, x in diffs) + ".",
            key=f"spec|{'|'.join(x for _, x in diffs)}",
            chrome=t in chrome, figmaSlug=spec_slug))
    # Content present in the design, absent from the build. Only meaningful where the frame IS this
    # page: a TEMPLATE frame (one design, 172 organisation pages) carries sample copy that no single
    # page is expected to repeat, and diffing it would publish a defect that does not exist.
    # The live text corpus must include what is NOT element innerText — form labels and
    # placeholders, image alt text and link accessible names — or a placeholder present on the page
    # reads as missing. (Verified against the home page's search field, 2026-09-18.)
    corpus = [e.get("text") for e in d.get("elements", [])]
    corpus += [h.get("text") for h in d.get("headings", [])]
    corpus += [i.get("alt") for i in d.get("images", [])]
    corpus += [l.get("accessibleName") or l.get("text") for l in d.get("links", [])]
    for fo in d.get("forms", []):
        for fl in fo.get("fields", []):
            corpus += [fl.get("label"), fl.get("placeholder"), fl.get("name")]
    for k, v in (d.get("dbim") or {}).items():
        if isinstance(v, dict):
            corpus.append(v.get("text"))
    live_all = " ".join(norm(x) for x in corpus if x)
    # Repeated content: a text style used by 3+ nodes in this frame is a list — event cards, gallery
    # tiles, table rows, scheme cards — filled with the designer's SAMPLE entries. Its absence from
    # the live page is different data, not missing copy (the Events frame's sample titles and times,
    # the Gallery frame's sample albums, 18 Sep). One-off interface copy keeps its own style.
    style_count = collections.Counter((round(v["size"] or 0), v.get("weight"), v.get("colour"))
                                      for _, v in spec_texts(specs[spec_slug]))
    for t, f in fig.items():
        if match_kind != "exact":
            break
        if style_count[(round(f["size"] or 0), f.get("weight"), f.get("colour"))] >= 3:
            continue
        if len(t) < 8 or t in liv or t in live_all:
            continue
        if f["size"] and f["size"] < 12:
            continue
        out.append(dict(
            code="DVB-MISSING", axis="Content & Iconography", severity="Major",
            standard="Figma handoff", title="Content in the design is not in the build",
            element=(f.get("raw") or t)[:60], slug=entry["slug"], viewport=viewport, url=entry.get("url"),
            figmaBoxRaw=f["box"], box=None, figmaBasis=basis_fig, liveBasis=basis_live,
            figmaFg=f["colour"],
            label=f"Design has “{(f.get('raw') or t)[:40]}” · not on the page",
            figmaLabel=f"Design: “{t[:40]}” · absent from the build",
            detail=f"The design frame carries “{(f.get('raw') or t)[:80]}” ({f['size'] and int(f['size'])}px). "
                   f"Nothing with that text renders on the live page.",
            key=f"missing|{t[:40]}", chrome=t in chrome, figmaSlug=spec_slug))
    # Chrome is one finding for the whole site, carried by the home page's pair.
    if not is_home:
        out = [f for f in out if not f.get("chrome")]
    # A page publishes at most 14 rows; the rest are the same defect said again.
    rank = {"Blocker": 0, "Major": 1, "Minor": 2, "Nit": 3}
    seen, capped = set(), []
    for f in sorted(out, key=lambda f: (rank[f["severity"]], f["code"])):
        if f["key"] in seen:
            continue
        seen.add(f["key"])
        capped.append(f)
        if len(capped) >= 14:
            break
    return capped


def chrome_texts(specs, frames_used):
    """Text that appears on most design frames is CHROME (masthead, mega-menu, footer). Comparing it
    per page would publish the same defect 172 times; it is compared ONCE, as a Global finding."""
    seen = collections.Counter()
    for slug in frames_used:
        spec = specs.get(slug)
        if not spec:
            continue
        for t, _ in spec_texts(spec):
            seen[t] += 1
    n = max(1, len(frames_used))
    return {t for t, c in seen.items() if c >= max(3, 0.6 * n)}


def main():
    fm = json.load(open(os.path.join(BASE, "inputs", "frame-map.json")))
    specs = load_specs()
    frames_used = {m.get(side, {}).get("slug")
                   for e in fm.get("entries", []) for side in ("desktop", "mobile")
                   for m in [e.get("mapping") or {}] if (m.get(side) or {}).get("slug")}
    CHROME = chrome_texts(specs, [f for f in frames_used if f])
    findings, compared = [], []
    for e in fm.get("entries", []):
        m = e.get("mapping") or {}
        for viewport, side in (("desktop", "desktop"), ("mobile", "mobile")):
            frame = m.get(side)
            if not frame or not frame.get("slug"):
                continue
            got = compare(e, frame["slug"], specs, viewport, CHROME, m.get("match") or "exact")
            if got:
                for g in got:
                    g["figmaNode"] = frame.get("node_id")
                    g["figmaPng"] = f"captures/figma/{frame['slug']}.png"
                    g["livePng"] = f"captures/live/{e['slug']}.{viewport}.png"
                    g["confidence"] = m.get("confidence")
                    g["matchKind"] = m.get("match")
                findings += got
            compared.append({"slug": e["slug"], "viewport": viewport, "frame": frame["slug"],
                             "findings": len(got), "confidence": m.get("confidence")})
    by_key = collections.defaultdict(list)
    for f in findings:
        by_key[(f["code"], f.get("key"))].append(f)
    for group in by_key.values():
        slugs = {f["slug"] for f in group}
        for f in group:
            f["pageCount"] = len(slugs)
            f["scope"] = "Global" if len(slugs) >= 3 else "Screen"
    json.dump(findings, open(os.path.join(OUT, "findings-design.json"), "w"), indent=1)
    roll = {
        "pairsCompared": len(compared),
        "pairsWithFindings": sum(1 for c in compared if c["findings"]),
        "findings": len(findings),
        "byCode": dict(collections.Counter(f["code"] for f in findings)),
        "bySeverity": dict(collections.Counter(f["severity"] for f in findings)),
        "byAxis": dict(collections.Counter(f["axis"] for f in findings)),
        "topPages": collections.Counter(f["slug"] for f in findings).most_common(12),
    }
    json.dump(roll, open(os.path.join(OUT, "design-rollup.json"), "w"), indent=1)
    print(json.dumps(roll, indent=1))


if __name__ == "__main__":
    main()
