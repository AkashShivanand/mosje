#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gate: a published finding ID must never come to name a different finding.

The ledger has said this since NHAPOA r13 ("Freeze published IDs") and it was prose, so it was
forgotten. On NMBA, 2026-09-11, inserting one new finding into the middle of the list renumbered
everything after it and silently re-pointed three IDs that had already gone out in a PR, a PDF and
a Google Drive tracker - where a developer may already have written a status against them.

The rule is one line: IDs are a MAP, never a position. This module proves it after the fact.

    python3 engine/frozen_ids.py --project nmba
"""
import argparse, json, os, subprocess, sys


def index(master):
    """{finding id: its title} for a loaded audit-master."""
    return {f["id"]: f.get("element") for s in master.get("screens", []) for f in s["findings"]}


def check(published, current):
    """Returns the list of violations. A violation is an ID present in BOTH that has changed
    meaning. Adding an ID is fine. Removing one is reported separately by the caller - a withdrawn
    finding is published as withdrawn, not deleted."""
    a, b = index(published), index(current)
    return [{"id": i, "was": a[i], "now": b[i]}
            for i in sorted(set(a) & set(b)) if a[i] != b[i]]


def published_from_git(repo, path, ref="HEAD"):
    """The last COMMITTED master - what the world has actually seen."""
    r = subprocess.run(["git", "show", f"{ref}:{path}"], capture_output=True, text=True, cwd=repo)
    if r.returncode or not r.stdout.strip():
        return None
    return json.loads(r.stdout)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--ref", default="HEAD")
    a = ap.parse_args()
    engine = os.path.dirname(os.path.abspath(__file__))
    repo = os.path.abspath(os.path.join(engine, "..", "..", ".."))
    rel = os.path.join("docs", "qc", "portals", a.project, "audit-master.json")
    cur_path = os.path.join(repo, rel)
    if not os.path.exists(cur_path):
        print(f"frozen-ids: no current master at {rel} — nothing to check")
        return 0
    pub = published_from_git(repo, rel, a.ref)
    if pub is None:
        print("frozen-ids: no committed master to compare against — first publication, nothing frozen yet")
        return 0
    cur = json.load(open(cur_path))
    bad = check(pub, cur)
    a_i, b_i = index(pub), index(cur)
    added, gone = sorted(set(b_i) - set(a_i)), sorted(set(a_i) - set(b_i))
    print(f"frozen-ids: {len(a_i)} published, {len(b_i)} current, "
          f"{len(added)} added, {len(gone)} no longer present")
    if gone:
        print("  ! these IDs have DISAPPEARED. A finding a reviewer has seen is published as "
              "withdrawn, never deleted:", gone)
    if bad:
        print(f"  !! {len(bad)} PUBLISHED ID(S) NOW NAME A DIFFERENT FINDING:")
        for v in bad:
            print(f"     {v['id']}\n        was: {v['was']}\n        now: {v['now']}")
        return 2
    print("  ok — every published id still names the finding it named before")
    return 0


if __name__ == "__main__":
    sys.exit(main())
