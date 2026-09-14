#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Add the NMBA sheets to the master tracker, in the shape the other portals use.

Writes `NMBA` (one row per finding) and `Coverage – NMBA` (one row per screen compared), and adds
the portal to the Rollup. Column order and styling follow the SMILE Beggary and NHAPOA sheets so
the workbook stays one document rather than a pile of formats.

Dev-owned columns - Status, Assignee, Date, Notes - are preserved when a row already exists, so
re-running this never overwrites somebody's triage.
"""
import collections, json, os, re, sys
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
XLSX = os.environ.get("TRACKER_XLSX") or os.path.join(REPO, "docs", "qc", "MoSJE-Portal-QC-Tracker.xlsx")
SHEET, COV = "NMBA", "Coverage – NMBA"
HEAD = ["ID", "Screen", "Category", "Severity", "Issue (Design → Built)", "Recommended Fix (Dev)",
        "Figma URL", "Live URL", "Status", "Assignee", "Date", "Notes", "Scope"]
COVHEAD = ["Screen", "Role", "Figma URL", "Has Design?", "Built?", "QC Status", "# Findings", "Notes"]
NAVY = "FF003366"
WIDTHS = [20, 34, 22, 10, 78, 66, 30, 30, 10, 12, 12, 34, 10]
DEV_COLS = (9, 10, 11, 12)          # Status, Assignee, Date, Notes - never overwritten


def style_header(ws, head, widths):
    ws.append(head)
    for i, h in enumerate(head, 1):
        c = ws.cell(row=1, column=i)
        c.font = Font(bold=True, color="FFFFFFFF", size=10)
        c.fill = PatternFill("solid", fgColor=NAVY)
        c.alignment = Alignment(vertical="center")
        ws.column_dimensions[get_column_letter(i)].width = widths[i - 1]
    ws.freeze_panes = "A2"


def existing_dev_values(wb):
    """{finding id: {col: value}} for whatever triage is already in the workbook."""
    if SHEET not in wb.sheetnames:
        return {}
    ws = wb[SHEET]
    out = {}
    for r in ws.iter_rows(min_row=2, max_row=ws.max_row):
        fid = r[0].value
        if not fid:
            continue
        keep = {c: r[c - 1].value for c in DEV_COLS if r[c - 1].value not in (None, "")}
        if keep:
            out[fid] = keep
    return out


def main():
    am = json.load(open(os.path.join(REPO, "docs", "qc", "portals", "nmba", "audit-master.json")))
    wb = openpyxl.load_workbook(XLSX)
    carried = existing_dev_values(wb)

    for name in (SHEET, COV):
        if name in wb.sheetnames:
            del wb[name]
    at = wb.sheetnames.index("NHAPOA") if "NHAPOA" in wb.sheetnames else len(wb.sheetnames)
    ws = wb.create_sheet(SHEET, at)
    style_header(ws, HEAD, WIDTHS)

    rows = 0
    for s in am["screens"]:
        for f in s["findings"]:
            # Same wording as engine/tracker.rows_from_master, so the local workbook and the
            # Drive copy hold BYTE-IDENTICAL rows. They diverged for months - one said
            # "Figma: … / Built: …", the other "Figma: … → Live: …" - which made every
            # sync_from_export report all 51 rows as changed and buried the one real edit.
            issue = ("Figma: " + str(f.get("figma", "")) +
                     "  \u2192  Live: " + str(f.get("live", "")))
            note = "env: " + s.get("env", "dev")
            if f.get("scope") == "Global":
                note += "  ·  Scope: Global — fix once, lands everywhere"
            ws.append([f["id"], s["name"], f["axis"], f["severity"], issue, f["fix"],
                       s.get("figmaUrl"), s.get("liveUrl"), "Open", None, None, note,
                       f.get("scope", "Screen")])
            rows += 1
            # restore any triage a dev had already recorded against this id
            for col, val in carried.get(f["id"], {}).items():
                ws.cell(row=ws.max_row, column=col, value=val)

    # ---- withdrawn findings stay in the sheet ------------------------------------------------
    # An id a dev has already seen must not vanish. NMB-SCREEN-016 was published, was in this tab,
    # and was then shown to be wrong; deleting its row would leave anyone who had triaged it with
    # a dangling reference and no answer. It stays, marked Withdrawn, with the reason in Notes.
    #
    # Sourced from findings_final.json, NOT from the master's `deferred[]`. Since 2026-09-12 the
    # published report renders no deferred section, so `deferred[]` is empty by design — and
    # reading it here silently dropped all three Withdrawn rows from this tab, which is the
    # opposite of what the instruction asked for. The report's rendering choice must not decide
    # what the DEV working document remembers.
    withdrawn = 0
    fin = json.load(open(os.path.join(HERE, "findings_final.json")))
    dropped = [{"id": d.get("old") or d.get("id") or "", "title": d["title"],
                "reason": d["reason"]} for d in fin.get("dropped", [])]
    for d in dropped:
        fid = str(d.get("id") or "")
        # Same rule as engine/tracker.rows_from_master, so the local copy and the Drive copy hold
        # the same rows. A July id like NMB-SNODASH-004 was published too and counts.
        if not re.match(r"^[A-Z]{2,5}-[A-Z]+-\d{3}$", fid):
            continue
        ws.append([fid, "—", "—", "—", d.get("title", ""), "No fix required — this finding was "
                   "withdrawn.", None, None, "Withdrawn", None, None,
                   "WITHDRAWN: " + d.get("reason", ""), "—"])
        withdrawn += 1
        for col, val in carried.get(fid, {}).items():
            if col == 9:          # never restore a stale Status onto a withdrawn row
                continue
            if col == 12:
                # The withdrawal REASON is the point of the row. Only a human's own note is
                # carried, appended after it; the generated "env: dev" boilerplate is not a note
                # and must not displace the reason (it did, on NMB-SCREEN-029).
                # ...and never re-append our own output, which begins "WITHDRAWN:" - doing so
                # compounds on every rebuild. One cell reached 8,850 characters.
                if (not val or str(val).startswith("env: ")
                        or str(val).startswith("WITHDRAWN:")):
                    continue
                val = ws.cell(row=ws.max_row, column=12).value + "\n\nEarlier note: " + str(val)
            ws.cell(row=ws.max_row, column=col, value=val)

    for r in ws.iter_rows(min_row=2, max_row=ws.max_row):
        for c in r:
            c.alignment = Alignment(wrap_text=True, vertical="top")
        r[0].font = Font(size=9, bold=True)
    ws.auto_filter.ref = f"A1:M{ws.max_row}"

    # ---- coverage (LOCAL ONLY - never pushed to the Drive copy) ------------------------------
    cov = wb.create_sheet(COV, wb.sheetnames.index(SHEET) + 1)
    style_header(cov, COVHEAD, [46, 22, 30, 12, 10, 16, 12, 62])
    all_rows = [r for r in json.load(open(os.path.join(HERE, "sheet", "all_rows.json")))
                if r["role"] != "global"]
    for r in all_rows:
        n = sum(1 for s in am["screens"] if s["slug"] == r["slug"] for _ in s["findings"])
        cov.append([r["title"], r["roleTitle"], r.get("figmaUrl"),
                    "Yes" if r.get("designPng") else "No", "Yes",
                    "Compared" if r.get("designPng") else "Vs. visual language",
                    n,
                    None if r.get("designPng") else
                    "No Figma frame for this route; audited against the visual language."])
    # declared coverage debt, stated rather than left as a silent gap
    frames = json.load(open(os.path.join(HERE, "inputs", "figma-frames.json")))
    n_designonly = sum(1 for f in frames if f.get("_designOnly"))
    cov.append(["Design-only frames (states, wizards, detail views)", "all", None, "Yes", "No",
                "Not built on dev", 0,
                f"{n_designonly} frames are designed but have no build on dev — form wizards, "
                "edit/detail states, register flows and the two further sign-in states. Declared "
                "coverage debt, not a miss."])
    for role, user in (("CPLI", "DR/KL/TVP/*"), ("ODIC", "DR/MN/UKH/*"), ("DDAC", "DR/AP/PAU/*"),
                       ("USDP", "USDP*"), ("Line Ministry", "officer-*")):
        cov.append([f"Role — {role}", role, None, "Yes", "Yes", "Out of scope this pass", 0,
                    "Working dev credentials exist and the design page carries a section for this "
                    "role. Deferred by decision for this run; ready to run as-is."])
    cov.append(["Role — MV / Institutions", "MV/Institutions", None, "Yes", "Unknown",
                "Not reachable", 0,
                "11 design frames, but the credentials sheet lists no login for this role."])
    # Carried forward from the July 2026 standalone tracker, each re-verified on 2026-09-11.
    # The standalone is retired; nothing it held is lost.
    for label, why in (
        ("Citizen Helpline screen",
         "Designed (National De-Addiction Helpline 14446 plus call statistics). Re-checked "
         "2026-09-11: still no /helpline route on the citizen build — the sidebar slot the design "
         "gives Helpline is occupied by 'Feedback / Grievances'."),
        ("e-Pledge OTP and certificate states",
         "OTP-gated. A real OTP is never fired on dev, so the flow is captured up to the wall and "
         "the states beyond it are not audited."),
        ("Row-level detail views and committee record states",
         "Re-checked 2026-09-11: the dev database now seeds a few committee rows, but not enough "
         "to exercise the record states the design draws."),
        ("18 August National Pledge Against Drug Abuse Report",
         "39 design frames for a reporting flow with no corresponding routes on the dev build.")):
        cov.append([label, "all", None, "Yes", "No", "Not audited", 0, why])
    # Build-only additions: per the audit rules these are NOT findings. They are design-side
    # questions, carried here so they stay visible instead of being lost with the standalone file.
    for label in (
        # Was listed here as a build-only addition. It is not: the design DOES draw an Export
        # control - one button with a chevron, and a menu where a format choice is offered. The
        # difference is its SHAPE, which makes it a finding, NMB-GLOBAL-033, not a coverage note.
        "The citizen sidebar ships 'Nasha Mukti Mitr' and 'Feedback / Grievances' where the design shows 'Helpline'",
        "The e-Pledge screen adds 'General Pledge' / 'Recovered Drug User' tabs the design does not draw",
        "Admin list screens add State / District / Pledge Date columns beyond the designed column set",
        "Admin list rows add a file-type icon before the document name, which the design does not draw"):
        cov.append([label, "design question", None, "No", "Yes", "Build-only addition", 0,
                    "Present in the build, absent from the design. Not raised as a finding — "
                    "confirm whether it is intended and, if so, add it to the design."])
    for r in cov.iter_rows(min_row=2, max_row=cov.max_row):
        for c in r:
            c.alignment = Alignment(wrap_text=True, vertical="top")
    cov.auto_filter.ref = f"A1:H{cov.max_row}"

    # ---- rollup ------------------------------------------------------------------------------
    ro = wb["Rollup"]
    hdr = None
    for i, row in enumerate(ro.iter_rows(min_row=1, max_row=12, values_only=True), 1):
        if row and row[0] == "Portal":
            hdr = i
            break
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
          f"{cov.max_row - 1} coverage rows, rollup row {at}, "
          f"{len(carried)} row(s) of existing triage preserved")
    print("sheets:", wb.sheetnames)
    return 0


if __name__ == "__main__":
    sys.exit(main())
