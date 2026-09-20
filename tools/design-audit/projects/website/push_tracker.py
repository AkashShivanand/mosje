#!/usr/bin/env python3
"""Write the website's tab into the QC tracker — repo copy, then the Drive copy, additively.

Status / Assignee / Date / Notes belong to the developers: a push brings across the audit columns
and keeps whatever the destination already holds for an id it knows. The coverage ledger stays in
the repo copy only, as it does for every other portal.

  python3 push_tracker.py            # dry run: prints what would change
  python3 push_tracker.py --apply    # writes the repo workbook, then the Drive copy
"""
import json, os, sys, collections, datetime, shutil

BASE = os.path.dirname(os.path.abspath(__file__))
ENGINE = os.path.abspath(os.path.join(BASE, "..", "..", "engine"))
REPO = os.path.abspath(os.path.join(BASE, "..", "..", "..", ".."))
sys.path.insert(0, ENGINE)
import tracker  # noqa: E402

TAB = "MoSJE Website"
MASTER = os.path.join(REPO, "docs", "qc", "portals", "website", "audit-master.json")
REPO_XLSX = os.path.join(REPO, "docs", "qc", "MoSJE-Portal-QC-Tracker.xlsx")
DRIVE_XLSX = ("/Users/akashk/Library/CloudStorage/GoogleDrive-akashk@dewsolutions.in/My Drive/"
              "MoSJE/Design QC/MoSJE-Portal-QC-Tracker.xlsx")
BACKUPS = os.path.join(BASE, "out", "tracker-backups")


def coverage_rows():
    """One row per live page/state captured: does it have a design, is it built, what came out."""
    pages = json.load(open(os.path.join(BASE, "inputs", "pages.json")))
    fmap = json.load(open(os.path.join(BASE, "inputs", "frame-map.json")))
    am = json.load(open(MASTER))
    by_slug = collections.Counter()
    for s in am["screens"]:
        for f in s["findings"]:
            for p in (s.get("_pages") or [s["slug"].split(".")[0]]):
                by_slug[p] += 1
    mapping = {e["slug"]: e for e in fmap.get("entries", [])}
    idx = json.load(open(os.path.join(BASE, "captures", "live", "_index.json")))
    captured = {e["slug"] for e in idx.get("entries", []) if e.get("viewport") == "desktop"}
    rows = []
    for p in pages:
        slug = p["slug"]
        m = (mapping.get(slug) or {}).get("mapping") or {}
        node = (m.get("desktop") or {}).get("node_id")
        rows.append({
            "Screen": slug,
            "Section": "Record template" if p["kind"] == "template-sample" else "Page",
            "Figma URL": (f"https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-"
                          f"?node-id={node.replace(':', '-')}" if node else None),
            "Has Design?": "Yes" if node else "No",
            "Built?": "Yes",
            "QC Status": "Audited" if slug in captured else "Not captured",
            "# Findings": by_slug.get(slug, 0),
            "Notes": (m.get("reason") or "")[:180],
        })
    for e in idx.get("entries", []):
        if not e["slug"].startswith("state--") or e.get("viewport") != "desktop":
            continue
        rows.append({"Screen": e["slug"], "Section": "State", "Figma URL": None,
                     "Has Design?": "No", "Built?": "Yes", "QC Status": "Audited",
                     "# Findings": by_slug.get(e["slug"], 0), "Notes": ""})
    return rows


def main():
    apply = "--apply" in sys.argv
    wd = None       # withdrawn findings travel in the master's deferred[] (build_master.py)
    cov = coverage_rows()
    for path, with_cov in ((REPO_XLSX, cov), (DRIVE_XLSX, None)):
        if not os.path.exists(path):
            print(f"!! not found: {path}")
            continue
        rep = tracker.push(MASTER, path, TAB, coverage=with_cov, apply=apply, backup_dir=BACKUPS,
                           withdrawn=wd)
        where = "repo" if path == REPO_XLSX else "DRIVE"
        print(f"\n[{where}] {os.path.basename(path)}")
        print(f"  rows {rep['rows']}  new {rep['new']}  dev-status preserved {rep['dev_status_preserved']}")
        print(f"  severities {rep['counts']}")
        if rep["in_destination_only"]:
            print(f"  ids in the destination but not in this run ({len(rep['in_destination_only'])}): "
                  f"{rep['in_destination_only'][:8]}")
        if with_cov:
            print(f"  coverage rows (repo copy only): {len(with_cov)}")
    print("\nDRY RUN — nothing written. Re-run with --apply." if not apply else "\nWritten.")


if __name__ == "__main__":
    main()
