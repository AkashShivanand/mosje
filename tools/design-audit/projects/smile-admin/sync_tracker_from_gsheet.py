#!/usr/bin/env python3
"""Bring an .xlsx tracker up to date with the live Google Sheet — additively.

The two files diverged. The Google Sheet carries work the .xlsx has not seen (43 NHAPOA findings
marked Fixed, and one hand-edited fix text). The .xlsx carries tabs the Google Sheet has not seen
(the Coverage sheets, TG, and now SMILE Beggary). So this is a MERGE, never a copy: cell values
come across from the Sheet for rows that exist in both, and nothing in the .xlsx is removed.

Run with --apply to write; without it, it reports what would change and touches nothing.
"""
import argparse, json, os, shutil, sys, collections
import openpyxl

HERE = os.path.dirname(os.path.abspath(__file__))
# the Sheet names its NHAPOA tab "NHAA"; the .xlsx files call it NHAPOA
TAB_ALIASES = {"NHAA": "NHAPOA"}
KEY = "ID"


def index(ws):
    hdr = [c.value for c in next(ws.iter_rows(min_row=1, max_row=1))]
    rows = {}
    for i, r in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
        if r and r[0] is not None:
            rows[str(r[0])] = (i, dict(zip(hdr, r)))
    return hdr, rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--gsheet", required=True, help="the Google Sheet exported as .xlsx")
    ap.add_argument("--xlsx", required=True, help="the tracker to bring up to date")
    ap.add_argument("--apply", action="store_true")
    a = ap.parse_args()

    G = openpyxl.load_workbook(a.gsheet)
    X = openpyxl.load_workbook(a.xlsx)
    changes, missing, unknown = [], [], []
    for gname in G.sheetnames:
        xname = TAB_ALIASES.get(gname, gname)
        if xname not in X.sheetnames:
            unknown.append(gname); continue
        gws, xws = G[gname], X[xname]
        ghdr, grows = index(gws)
        xhdr, xrows = index(xws)
        if gname in ("Read Me", "Rollup") or not grows:
            continue    # no ID column: the Rollup's own first column is a portal name, not a finding
        if ghdr != xhdr:
            print(f"   ! {gname}: header differs — skipped, merge by hand"); continue
        for fid, (grow, gvals) in grows.items():
            if fid not in xrows:
                missing.append((xname, fid)); continue
            xi, xvals = xrows[fid]
            for col in ghdr:
                if col is None:
                    continue
                gv, xv = gvals.get(col), xvals.get(col)
                if (gv or "") == (xv or ""):
                    continue
                changes.append((xname, fid, col, xv, gv))
                if a.apply:
                    xws.cell(row=xi, column=ghdr.index(col) + 1, value=gv)

    by_col = collections.Counter(c[2] for c in changes)
    print(f"{os.path.basename(a.xlsx)}: {len(changes)} cell(s) to bring across from the Sheet "
          f"{dict(by_col)}")
    for c in changes[:6]:
        print(f"   {c[1]} · {c[2]}: {str(c[3])[:40]!r} -> {str(c[4])[:40]!r}")
    if len(changes) > 6:
        print(f"   … and {len(changes) - 6} more")
    if missing:
        print(f"   ! {len(missing)} row(s) in the Sheet are not in this .xlsx: {missing[:4]}")
    if unknown:
        print(f"   note: tabs only in the Sheet: {unknown}")
    only_x = [t for t in X.sheetnames if t not in G.sheetnames and TAB_ALIASES.get(t, t) not in G.sheetnames
              and t not in TAB_ALIASES.values()]
    print(f"   kept, untouched — tabs the Sheet does not have: {only_x}")

    if a.apply and changes:
        bak = a.xlsx + ".before-sync.bak"
        if not os.path.exists(bak):
            shutil.copyfile(a.xlsx, bak)
        X.save(a.xlsx)
        print(f"   written. backup: {os.path.basename(bak)}")
    elif a.apply:
        print("   nothing to write")
    return 0


if __name__ == "__main__":
    sys.exit(main())
