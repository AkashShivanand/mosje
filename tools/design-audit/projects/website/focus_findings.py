#!/usr/bin/env python3
"""Turn pixel-judged focus verdicts (out/focus-verdicts.json) into A-FOCUS findings.

A Tab stop is a finding when focusing it changes under 1.5% of its region's pixels: under 0.3% is
"none" (Blocker), 0.3–1.5% is "weak" (Minor — verified by eye: pagination numbers only turn their
digit from grey to black). Stops are classified by what they are, so the same control on nine pages
is ONE Global finding rather than nine: a pagination arrow, a pagination number, the hero banner.

  python3 focus_findings.py     # appends A-FOCUS rows to out/findings-auto.json
"""
import json, os, collections

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "out")


def kind(r):
    w = r["box"][2] - r["box"][0]
    if r["text"].strip().isdigit():
        return "pagination number", "Pagination page numbers"
    if not r["text"] and w < 60:
        return "pagination arrow", "Pagination previous / next arrows"
    if not r["text"] and w > 600:
        return "banner link", "Home hero banner (an unlabelled link)"
    return f"{r['tag']}:{r['text'][:30]}", (r["text"] or f"unlabelled {r['tag']}")[:60]


def main():
    verdicts = json.load(open(os.path.join(OUT, "focus-verdicts.json")))
    auto_p = os.path.join(OUT, "findings-auto.json")
    auto = [f for f in json.load(open(auto_p)) if f["code"] != "A-FOCUS"]
    per = {}
    for r in verdicts["rows"]:
        if r["strength"] == "clear":
            continue
        k, name = kind(r)
        key = f"focus|{r['strength']}|{k}"
        if (key, r["slug"]) in per:
            per[(key, r["slug"])]["stops"].append(r["stop"])
            continue
        weak = r["strength"] == "weak"
        per[(key, r["slug"])] = {
            "code": "A-FOCUS", "standard": "GIGW/WCAG 2.2 AA", "clause": "2.4.7",
            "axis": "Components & States", "severity": "Minor" if weak else "Blocker",
            "title": "Focus indicator too faint to find" if weak else "No visible focus indicator",
            "element": name, "box": [round(v) for v in r["box"]],
            "label": (f"Tab stop {r['stop']} · focused only the digit darkens ({r['changedFraction'] * 100:.1f}% of pixels)"
                      if weak else f"Tab stop {r['stop']} · nothing changes on focus · WCAG 2.4.7 FAIL"),
            "detail": (f"{name}: screenshotted focused and then blurred, "
                       + (f"only {r['changedFraction'] * 100:.1f}% of the region changes — the digit turns "
                          "from grey to black, with no ring or fill, which is hard to find on a page."
                          if weak else
                          "no pixel changes, so a keyboard user cannot see where focus is.")),
            "key": key, "slug": r["slug"], "viewport": "desktop", "url": r.get("url"),
            "png": f"captures/live/{r['slug']}.desktop.png", "liveBasis": 1440, "stops": [r["stop"]],
        }
    rows = list(per.values())
    pages = collections.defaultdict(set)
    for f in rows:
        pages[f["key"]].add(f["slug"])
    for f in rows:
        f["pageCount"] = len(pages[f["key"]])
        f["scope"] = "Global" if f["pageCount"] >= 3 else "Screen"
    json.dump(auto + rows, open(auto_p, "w"), indent=1)
    print(f"focus findings: {len(rows)} rows, {len(pages)} distinct defects "
          f"(from {verdicts['stops']} stops judged on {len(verdicts['pages'])} pages)")
    for k, v in pages.items():
        print(f"  {len(v):2} pages  {k}")


if __name__ == "__main__":
    main()
