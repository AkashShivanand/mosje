#!/usr/bin/env python3
"""Keep the Drive tracker in step with the repo tracker — additively, and coverage-free.

The rule the reviewer set (2026-09-10):
  · the Drive tracker carries the defect list people work from — findings tabs, Read Me, Rollup;
  · the per-screen Coverage ledgers stay in the repo copy only;
  · a push never replaces what is already in Drive: it refreshes the portal tabs it owns, adds
    new ones, and leaves every other tab and every Status/Assignee/Date/Notes edit alone.

Status is the column the DEVS own. So when a portal tab already exists in Drive, this brings the
audit columns across (Screen, Category, Severity, Issue, Fix, links, Scope) but KEEPS Drive's
Status, Assignee, Date and Notes for any finding id that is already there. New ids arrive as Open.

    python3 push_tracker_to_drive.py            # dry run — says what it would do
    python3 push_tracker_to_drive.py --apply
"""
import argparse, os, shutil, sys, datetime
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

HERE = os.path.dirname(os.path.abspath(__file__))
REPO_XLSX = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "docs", "qc",
                                         "MoSJE-Portal-QC-Tracker.xlsx"))
DRIVE_XLSX = ("/Users/akashk/Library/CloudStorage/GoogleDrive-akashk@dewsolutions.in/"
              "My Drive/MoSJE/Design QC/MoSJE-Portal-QC-Tracker.xlsx")
DEV_OWNED = ("Status", "Assignee", "Date", "Notes")   # never overwritten once Drive has a value
NAVY = "FF003366"


def is_findings_tab(ws):
    hdr = [c.value for c in next(ws.iter_rows(min_row=1, max_row=1), [])]
    return bool(hdr) and hdr[:2] == ["ID", "Screen"]


def read(ws):
    hdr = [c.value for c in next(ws.iter_rows(min_row=1, max_row=1))]
    rows = {}
    for r in ws.iter_rows(min_row=2, values_only=True):
        if r and r[0] is not None:
            rows[str(r[0])] = dict(zip(hdr, r))
    return hdr, rows


def write_tab(wb, name, hdr, rows, widths):
    if name in wb.sheetnames:
        del wb[name]
    ws = wb.create_sheet(name, min(len(wb.sheetnames), 3))
    ws.append(hdr)
    for i, _ in enumerate(hdr, 1):
        c = ws.cell(row=1, column=i)
        c.font = Font(bold=True, color="FFFFFFFF", size=10)
        c.fill = PatternFill("solid", fgColor=NAVY)
        ws.column_dimensions[get_column_letter(i)].width = widths[min(i - 1, len(widths) - 1)]
    ws.freeze_panes = "A2"
    for fid in rows:
        ws.append([rows[fid].get(h) for h in hdr])
    for r in ws.iter_rows(min_row=2, max_row=ws.max_row):
        for c in r:
            c.alignment = Alignment(wrap_text=True, vertical="top")
        r[0].font = Font(size=9, bold=True)
    ws.auto_filter.ref = f"A1:{get_column_letter(len(hdr))}{ws.max_row}"
    return ws


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", default=REPO_XLSX)
    ap.add_argument("--drive", default=DRIVE_XLSX)
    ap.add_argument("--apply", action="store_true")
    a = ap.parse_args()

    R = openpyxl.load_workbook(a.repo)
    D = openpyxl.load_workbook(a.drive)
    portals = [t for t in R.sheetnames if is_findings_tab(R[t])]
    print(f"repo findings tabs: {portals}")
    print(f"drive tabs before : {D.sheetnames}")

    plan = []
    for name in portals:
        rhdr, rrows = read(R[name])
        keep = {}
        if name in D.sheetnames:
            dhdr, drows = read(D[name])
            for fid, rv in rrows.items():
                dv = drows.get(fid)
                if dv:                                   # keep what the devs have set
                    for col in DEV_OWNED:
                        if col in rhdr and (dv.get(col) not in (None, "")):
                            rv[col] = dv.get(col)
                keep[fid] = rv
            gone = [f for f in drows if f not in rrows]
            added = [f for f in rrows if f not in drows]
            held = sum(1 for f in rrows if drows.get(f, {}).get("Status") not in (None, "", "Open"))
            plan.append((name, len(rrows), len(added), len(gone), held))
        else:
            keep = rrows
            plan.append((name, len(rrows), len(rrows), 0, 0))
        if a.apply:
            write_tab(D, name, rhdr, keep, [22, 34, 22, 10, 86, 70, 34, 34, 10, 12, 12, 36, 10])

    for name, total, added, gone, held in plan:
        note = f"{total} rows (+{added} new"
        if gone:
            note += f", {gone} in Drive not in repo — LEFT ALONE" if not a.apply else f", {gone} dropped"
        note += f"); {held} dev status value(s) preserved"
        print(f"   {name:20} {note}")
    # Rollup: one row per findings tab, added if absent, never reordered or removed
    ro = D["Rollup"]
    hdr_row = next((i for i, r in enumerate(ro.iter_rows(values_only=True), 1)
                    if r and r[0] == "Portal"), None)
    have, last = {}, hdr_row or 1
    if hdr_row:
        r = hdr_row + 1
        while ro.cell(row=r, column=1).value:
            have[str(ro.cell(row=r, column=1).value)] = r
            last = r; r += 1
    for name in portals:
        if name in have:
            continue
        last += 1
        q = f"'{name}'"
        print(f"   Rollup: adding a row for {name} at row {last}")
        if a.apply:
            ro.cell(row=last, column=1, value=name)
            ro.cell(row=last, column=2, value=f"=COUNTA({q}!$A$2:$A$999)")
            for j, sev in enumerate(("Blocker", "Major", "Minor", "Nit"), 3):
                ro.cell(row=last, column=j, value=f'=COUNTIF({q}!$D:$D,"{sev}")')
            for j, st in enumerate(("Open", "Fixed", "Verified"), 7):
                ro.cell(row=last, column=j, value=f'=COUNTIF({q}!$I:$I,"{st}")')

    cov = [t for t in D.sheetnames if t.startswith("Coverage")]
    if cov:
        print(f"   ! coverage tabs found in Drive: {cov} — the rule says these stay local")

    if a.apply:
        bak = os.path.join(HERE, "out",
                           "drive-tracker.%s.bak.xlsx" % datetime.datetime.now().strftime("%Y%m%d-%H%M%S"))
        os.makedirs(os.path.dirname(bak), exist_ok=True)
        shutil.copyfile(a.drive, bak)
        D.save(a.drive)
        print(f"   written to Drive. backup kept OUT of Drive: {os.path.relpath(bak, HERE)}")
    else:
        print("   dry run — nothing written. Re-run with --apply.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
