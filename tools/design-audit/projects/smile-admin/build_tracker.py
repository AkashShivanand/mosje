#!/usr/bin/env python3
"""Add the SMILE Beggary sheets to the master tracker, in the shape the other portals use.

Writes `SMILE Beggary` (one row per finding) and `Coverage – SMILE Beggary` (one row per screen
compared), and adds the portal to the Rollup. Styling and column order follow the NHAPOA sheet so
the workbook stays one document rather than a pile of formats.
"""
import json, os, sys, collections
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
XLSX = os.environ.get("TRACKER_XLSX") or os.path.join(REPO, "docs", "qc", "MoSJE-Portal-QC-Tracker.xlsx")
SHEET, COV = "SMILE Beggary", "Coverage – SMILE Beggary"
HEAD = ["ID", "Screen", "Category", "Severity", "Issue (Design → Built)", "Recommended Fix (Dev)",
        "Figma URL", "Live URL", "Status", "Assignee", "Date", "Notes", "Scope"]
COVHEAD = ["Screen", "Section", "Figma URL", "Has Design?", "Built?", "QC Status", "# Findings", "Notes"]
NAVY = "FF003366"
WIDTHS = [20, 34, 20, 10, 78, 66, 30, 30, 10, 12, 12, 34, 10]


def style_header(ws, head, widths):
    ws.append(head)
    for i, h in enumerate(head, 1):
        c = ws.cell(row=1, column=i)
        c.font = Font(bold=True, color="FFFFFFFF", size=10)
        c.fill = PatternFill("solid", fgColor=NAVY)
        c.alignment = Alignment(vertical="center")
        ws.column_dimensions[get_column_letter(i)].width = widths[i - 1]
    ws.freeze_panes = "A2"


def main():
    am = json.load(open(os.path.join(REPO, "docs", "qc", "portals", "smile-admin", "audit-master.json")))
    wb = openpyxl.load_workbook(XLSX)
    for name in (SHEET, COV):
        if name in wb.sheetnames:
            del wb[name]
    at = wb.sheetnames.index("NHAPOA") if "NHAPOA" in wb.sheetnames else len(wb.sheetnames)
    ws = wb.create_sheet(SHEET, at)
    style_header(ws, HEAD, WIDTHS)
    rows = 0
    for s in am["screens"]:
        for f in s["findings"]:
            issue = f"Figma: {f['figma']}\nBuilt: {f['live']}"
            note = f"env: {s.get('env','dev')}"
            if f.get("scope") == "Global":
                note += "  ·  Scope: Global — fix once, lands everywhere"
            ws.append([f["id"], s["name"], f["axis"], f["severity"], issue, f["fix"],
                       s.get("figmaUrl"), s.get("liveUrl"), "Open", None, None, note,
                       f.get("scope", "Screen")])
            rows += 1
    for r in ws.iter_rows(min_row=2, max_row=ws.max_row):
        for c in r:
            c.alignment = Alignment(wrap_text=True, vertical="top")
        r[0].font = Font(size=9, bold=True)
    ws.auto_filter.ref = f"A1:M{ws.max_row}"

    cov = wb.create_sheet(COV, wb.sheetnames.index(SHEET) + 1)
    style_header(cov, COVHEAD, [40, 18, 30, 12, 10, 14, 12, 46])
    all_rows = {r["slug"]: r for r in json.load(open(os.path.join(HERE, "sheet", "all_rows.json")))}
    for slug, r in all_rows.items():
        n_find = sum(1 for s in am["screens"] if s["slug"] == slug for _ in s["findings"])
        section = r["role"]
        cov.append([f"{r['role']} — {r['title']}", section, r["figmaUrl"], "Yes", "Yes",
                    "In Review", f"=COUNTIF('{SHEET}'!$B:$B,\"{r['title']}\")",
                    None])
    cov.append(["Surveyor detail (/surveyors/<id>)", "super-admin", None, "No", "Yes",
                "Not compared", 0,
                "No design frame on 'Smile Beggary (Synced)' — the nearest frame is the surveyor LIST."])
    for label in ("View Catalog", "Edit Permissions", "Create Survey Location", "View Beneficiary",
                  "Dashboard chart tabs", "Add District"):
        cov.append([label, "super-admin", None, "Yes", "Yes", "Not reached", 0,
                    "The control resolves and the click lands, but the view does not finish loading "
                    "inside the capture window."])
    for label in ("State Nodal Officer", "Nodal Officer", "Implementing Agency"):
        cov.append([f"Role — {label}", label, None, "Yes", "Yes", "Skipped", 0,
                    "Skipped at the reviewer's instruction for this pass."])
    for r in cov.iter_rows(min_row=2, max_row=cov.max_row):
        for c in r:
            c.alignment = Alignment(wrap_text=True, vertical="top")
    cov.auto_filter.ref = f"A1:H{cov.max_row}"

    # rollup row
    ro = wb["Rollup"]
    hdr = None
    for i, row in enumerate(ro.iter_rows(min_row=1, max_row=12, values_only=True), 1):
        if row and row[0] == "Portal":
            hdr = i; break
    at = hdr + 1
    while ro.cell(row=at, column=1).value:
        if ro.cell(row=at, column=1).value == SHEET:
            break
        at += 1
    q = f"'{SHEET}'"
    ro.cell(row=at, column=1, value=SHEET)
    ro.cell(row=at, column=2, value=f"=COUNTA({q}!$A$2:$A$999)")
    for j, sev in enumerate(("Blocker", "Major", "Minor", "Nit"), 3):
        ro.cell(row=at, column=j, value=f'=COUNTIF({q}!$D:$D,"{sev}")')
    for j, st in enumerate(("Open", "Fixed", "Verified"), 7):
        ro.cell(row=at, column=j, value=f'=COUNTIF({q}!$I:$I,"{st}")')

    wb.save(XLSX)
    counts = collections.Counter(f["severity"] for s in am["screens"] for f in s["findings"])
    print(f"tracker: {rows} rows on '{SHEET}' ({dict(counts)}), "
          f"{cov.max_row - 1} coverage rows, rollup row {at}")
    print("sheets:", wb.sheetnames)


if __name__ == "__main__":
    sys.exit(main())
