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


def withdrawn(master):
    """{finding id: why} for ids published as WITHDRAWN rather than deleted.

    A finding that is withdrawn is still published - it appears in the report's deferred section
    and, marked Withdrawn, in the tracker. So its id has not disappeared, and the gate must not
    say it has. This is the difference between retracting a claim in public and quietly erasing
    it."""
    out = {}
    for d in master.get("deferred", []):
        i = str(d.get("id") or "")
        if i and i not in ("-", "design-file"):
            out[i] = d.get("reason", "")
    return out


def load_accepted(path):
    """Deliberate, reviewed re-wordings of a published id: {id: reason}.

    A title change on an id that is already out is worth stopping for even when it is intended -
    somebody may be reading it in a tracker. So it is not detected more loosely; it is ACCEPTED,
    once, in writing, and the acceptance is committed beside the audit."""
    if path and os.path.exists(path):
        return json.load(open(path))
    return {}


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
    accepted = load_accepted(os.path.join(
        os.path.dirname(cur_path), "accepted-id-rewordings.json"))
    bad = [v for v in check(pub, cur) if v["id"] not in accepted]
    noted = [v for v in check(pub, cur) if v["id"] in accepted]
    a_i, b_i = index(pub), index(cur)
    with_ = withdrawn(cur)
    added = sorted(set(b_i) - set(a_i))
    retracted = sorted(i for i in set(a_i) - set(b_i) if i in with_)
    gone = sorted(i for i in set(a_i) - set(b_i) if i not in with_)
    print(f"frozen-ids: {len(a_i)} published, {len(b_i)} current, "
          f"{len(added)} added, {len(retracted)} withdrawn, {len(gone)} no longer present")
    for i in retracted:
        print(f"  · {i} withdrawn (still published, with its reason): {with_[i][:90]}")
    for v in noted:
        print(f"  · {v['id']} re-worded, accepted: {accepted[v['id']][:100]}")
    if gone:
        print("  ! these IDs have DISAPPEARED. A finding a reviewer has seen is published as "
              "withdrawn, never deleted:", gone)
        return 2
    if bad:
        print(f"  !! {len(bad)} PUBLISHED ID(S) NOW NAME A DIFFERENT FINDING:")
        for v in bad:
            print(f"     {v['id']}\n        was: {v['was']}\n        now: {v['now']}")
        return 2
    print("  ok — every published id still names the finding it named before")
    return 0


if __name__ == "__main__":
    sys.exit(main())
