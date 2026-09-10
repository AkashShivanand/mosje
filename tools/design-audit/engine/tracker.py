#!/usr/bin/env python3
"""The master QC tracker — one sheet per portal, shared across every project.

Three jobs that were three per-project scripts until the SMILE run proved they are the same
everywhere: write a portal's sheet from its audit-master, push the workbook to the Drive copy
without trampling the devs' columns, and pull back changes made in the Google Sheet.

Two standing rules, both learned on a live file:
  · Status / Assignee / Date / Notes belong to the DEVS. A push keeps whatever the destination
    already has for a finding id it knows, and brings across only the audit columns. New ids
    arrive as Open. Getting this wrong once would have wiped 43 findings someone had marked Fixed.
  · Coverage sheets stay in the repo copy. The Drive tracker carries the defect list people work
    from; the per-screen ledger is ours.
"""
import collections, datetime, json, os, shutil
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

HEAD = ["ID", "Screen", "Category", "Severity", "Issue (Design → Built)", "Recommended Fix (Dev)",
        "Figma URL", "Live URL", "Status", "Assignee", "Date", "Notes", "Scope"]
COVHEAD = ["Screen", "Section", "Figma URL", "Has Design?", "Built?", "QC Status", "# Findings", "Notes"]
DEV_OWNED = ("Status", "Assignee", "Date", "Notes")
WIDTHS = [22, 34, 22, 10, 86, 70, 34, 34, 10, 12, 12, 36, 10]
NAVY = "FF003366"


def _header(ws, head, widths):
    ws.append(head)
    for i, _ in enumerate(head, 1):
        c = ws.cell(row=1, column=i)
        c.font = Font(bold=True, color="FFFFFFFF", size=10)
        c.fill = PatternFill("solid", fgColor=NAVY)
        ws.column_dimensions[get_column_letter(i)].width = widths[min(i - 1, len(widths) - 1)]
    ws.freeze_panes = "A2"


def _read(ws):
    hdr = [c.value for c in next(ws.iter_rows(min_row=1, max_row=1))]
    rows = {}
    for i, r in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
        if r and r[0] is not None:
            rows[str(r[0])] = (i, dict(zip(hdr, r)))
    return hdr, rows


def is_findings_tab(ws):
    hdr = [c.value for c in next(ws.iter_rows(min_row=1, max_row=1), [])]
    return bool(hdr) and hdr[:2] == ["ID", "Screen"]


def rows_from_master(am):
    """audit-master.json -> the rows this portal's sheet should hold."""
    out = {}
    for s in am["screens"]:
        for f in s["findings"]:
            out[f["id"]] = {
                "ID": f["id"], "Screen": s["name"], "Category": f.get("axis"),
                "Severity": f["severity"],
                "Issue (Design → Built)": f"Figma: {f.get('figma')}  →  Live: {f.get('live')}",
                "Recommended Fix (Dev)": f.get("fix"),
                "Figma URL": s.get("figmaUrl"), "Live URL": s.get("liveUrl"),
                "Status": "Open", "Assignee": None, "Date": None,
                "Notes": "env: " + (s.get("env") or "dev") +
                         ("  ·  Scope: Global — fix once, lands everywhere"
                          if f.get("scope") == "Global" else ""),
                "Scope": f.get("scope", "Screen")}
    return out


def write_sheet(wb, name, rows, after=None):
    """Replace (or add) one portal's findings tab, preserving nothing — callers merge first."""
    if name in wb.sheetnames:
        del wb[name]
    at = wb.sheetnames.index(after) if after in wb.sheetnames else len(wb.sheetnames)
    ws = wb.create_sheet(name, at)
    _header(ws, HEAD, WIDTHS)
    for fid in rows:
        ws.append([rows[fid].get(h) for h in HEAD])
    for r in ws.iter_rows(min_row=2, max_row=ws.max_row):
        for c in r:
            c.alignment = Alignment(wrap_text=True, vertical="top")
        r[0].font = Font(size=9, bold=True)
    ws.auto_filter.ref = f"A1:M{ws.max_row}"
    return ws


def write_coverage(wb, name, rows):
    if name in wb.sheetnames:
        del wb[name]
    ws = wb.create_sheet(name, len(wb.sheetnames))
    _header(ws, COVHEAD, [44, 18, 34, 12, 10, 14, 12, 52])
    for r in rows:
        ws.append([r.get(h) for h in COVHEAD])
    for r in ws.iter_rows(min_row=2, max_row=ws.max_row):
        for c in r:
            c.alignment = Alignment(wrap_text=True, vertical="top")
    ws.auto_filter.ref = f"A1:H{ws.max_row}"
    return ws


def ensure_rollup(wb, portal, total_range="$A$2:$A$999"):
    """One Rollup row per portal, added if absent. Never reordered, never removed."""
    ro = wb["Rollup"]
    hdr_row = next((i for i, r in enumerate(ro.iter_rows(values_only=True), 1)
                    if r and r[0] == "Portal"), None)
    if not hdr_row:
        return None
    r = hdr_row + 1
    last = hdr_row
    while ro.cell(row=r, column=1).value:
        if str(ro.cell(row=r, column=1).value) == portal:
            return r
        last = r
        r += 1
    at = last + 1
    q = f"'{portal}'"
    ro.cell(row=at, column=1, value=portal)
    ro.cell(row=at, column=2, value=f"=COUNTA({q}!{total_range})")
    for j, sev in enumerate(("Blocker", "Major", "Minor", "Nit"), 3):
        ro.cell(row=at, column=j, value=f'=COUNTIF({q}!$D:$D,"{sev}")')
    for j, st in enumerate(("Open", "Fixed", "Verified"), 7):
        ro.cell(row=at, column=j, value=f'=COUNTIF({q}!$I:$I,"{st}")')
    return at


def merge_preserving_dev_columns(want, existing_ws):
    """`want` is what the audit says; the destination keeps its own Status/Assignee/Date/Notes for
    any id it already knows. Returns (merged, n_new, n_preserved)."""
    if existing_ws is None:
        return dict(want), len(want), 0
    _, have = _read(existing_ws)
    merged, new, kept = {}, 0, 0
    for fid, row in want.items():
        if fid in have:
            cur = have[fid][1]
            for col in DEV_OWNED:
                if cur.get(col) not in (None, ""):
                    row = dict(row, **{col: cur[col]})
                    if col == "Status" and cur[col] != "Open":
                        kept += 1
        else:
            new += 1
        merged[fid] = row
    return merged, new, kept


def push(master_path, xlsx_path, portal, coverage=None, apply=False, backup_dir=None):
    """Write one portal's tab into an existing workbook, additively. Returns a report dict."""
    am = json.load(open(master_path))
    want = rows_from_master(am)
    wb = openpyxl.load_workbook(xlsx_path)
    merged, new, kept = merge_preserving_dev_columns(
        want, wb[portal] if portal in wb.sheetnames else None)
    gone = []
    if portal in wb.sheetnames:
        _, have = _read(wb[portal])
        gone = [f for f in have if f not in want]
    rep = {"portal": portal, "rows": len(merged), "new": new, "dev_status_preserved": kept,
           "in_destination_only": gone,
           "counts": dict(collections.Counter(r["Severity"] for r in merged.values()))}
    if apply:
        if backup_dir:
            os.makedirs(backup_dir, exist_ok=True)
            shutil.copyfile(xlsx_path, os.path.join(
                backup_dir, "tracker.%s.bak.xlsx" % datetime.datetime.now().strftime("%Y%m%d-%H%M%S")))
        write_sheet(wb, portal, merged, after="NHAPOA")
        if coverage:
            write_coverage(wb, f"Coverage – {portal}", coverage)
        ensure_rollup(wb, portal)
        wb.save(xlsx_path)
    return rep


def sync_from_export(export_path, xlsx_path, tab_aliases=None, apply=False):
    """Bring cell values back from a Google Sheet export for rows that exist in both. Never removes
    a row, a column or a tab; skips Read Me and Rollup, whose first column is not a finding id."""
    aliases = tab_aliases or {}
    G, X = openpyxl.load_workbook(export_path), openpyxl.load_workbook(xlsx_path)
    changes = []
    for gname in G.sheetnames:
        xname = aliases.get(gname, gname)
        if gname in ("Read Me", "Rollup") or xname not in X.sheetnames:
            continue
        ghdr, grows = _read(G[gname])
        xhdr, xrows = _read(X[xname])
        if ghdr != xhdr or not grows:
            continue
        for fid, (_, gv) in grows.items():
            if fid not in xrows:
                continue
            xi, xv = xrows[fid]
            for col in ghdr:
                if col is None or (gv.get(col) or "") == (xv.get(col) or ""):
                    continue
                changes.append((xname, fid, col, xv.get(col), gv.get(col)))
                if apply:
                    X[xname].cell(row=xi, column=ghdr.index(col) + 1, value=gv.get(col))
    if apply and changes:
        X.save(xlsx_path)
    return changes
