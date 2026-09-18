#!/usr/bin/env python3
"""Turn pixel-judged focus verdicts (out/focus-verdicts.json) into A-FOCUS findings.

A stop is a finding only when focusing it changes under 1.5% of its region's pixels. Each finding
is marked on the page's full capture at the stop's document position; check_marks.py then proves
the box lands on something before the report draws it.

  python3 focus_findings.py     # appends A-FOCUS rows to out/findings-auto.json
"""
import json, os

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "out")


def main():
    verdicts = json.load(open(os.path.join(OUT, "focus-verdicts.json")))
    auto_p = os.path.join(OUT, "findings-auto.json")
    auto = [f for f in json.load(open(auto_p)) if f["code"] != "A-FOCUS"]
    added = []
    for r in verdicts["rows"]:
        if r["indicator"]:
            continue
        label = r["text"] or f"unnamed {r['tag']}"
        added.append({
            "code": "A-FOCUS", "standard": "GIGW/WCAG 2.2 AA", "clause": "2.4.7",
            "axis": "Components & States", "severity": "Blocker",
            "title": "No visible focus indicator", "element": label[:60],
            "box": [round(v) for v in r["box"]],
            "label": f"Tab stop {r['stop']} · {r['changedFraction'] * 100:.1f}% of pixels change on focus · WCAG 2.4.7 FAIL",
            "detail": (f"Tab stop {r['stop']} on this page ({r['tag']}"
                       f"{'#' + r['id'] if r.get('id') else ''}"
                       f"{', “' + r['text'][:60] + '”' if r['text'] else ', with no accessible text'}) "
                       f"was screenshotted focused and then blurred: {r['changedFraction'] * 100:.1f}% of its "
                       f"region's pixels differ, so a keyboard user cannot see where focus is."),
            "key": f"focus|{r['tag']}|{r['text'][:30]}", "slug": r["slug"], "viewport": "desktop",
            "url": r.get("url"), "png": f"captures/live/{r['slug']}.desktop.png", "liveBasis": 1440,
        })
    json.dump(auto + added, open(auto_p, "w"), indent=1)
    print(f"focus findings: {len(added)} (from {verdicts['stops']} stops judged on "
          f"{len(verdicts['pages'])} pages)")


if __name__ == "__main__":
    main()
