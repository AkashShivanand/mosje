#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""One command, one board. Every gate in the engine, run over one project.

    python3 engine/verify.py --project nmba
    python3 engine/verify.py --project nmba --tests        # + the engine's unit tests

Why this exists: the NMBA run took five separate commands per cycle — claims_run, deliverable,
frozen_ids, crosscheck, and the unit tests — each with its own flags and its own idea of an exit
code. Running four of the five and forgetting the fifth is not a discipline problem, it is a tool
problem, and the tool is this file.

**SKIPPED is not PASS.** A gate whose inputs are not on disk says so on its own line and the board
prints a NOT PROVEN count at the bottom. That distinction is the whole point: the NMBA PDF was
once reported as regenerated when a 300-second timeout had killed the renderer and `| tail` had
eaten the exit code, so the shipped file was four hours stale. A gate that did not run must never
read as a gate that passed.
"""
import argparse, io, json, os, struct, subprocess, sys, unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import integrity as I

ENGINE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(ENGINE)
PROJECTS = os.path.join(ROOT, "projects")
REPO = os.path.abspath(os.path.join(ROOT, "..", ".."))

PASS, FAIL, SKIP = "PASS", "FAIL", "SKIP"


class Board:
    """Collects one line per gate and prints them together at the end, so a long run's result is
    readable in one glance instead of reconstructed from scrollback."""

    def __init__(self):
        self.rows = []

    def add(self, name, state, detail="", fails=()):
        self.rows.append({"name": name, "state": state, "detail": detail, "fails": list(fails)})
        mark = {PASS: "ok  ", FAIL: "FAIL", SKIP: "skip"}[state]
        print(f"  {mark}  {name}{('  — ' + detail) if detail else ''}", flush=True)
        for f in self.rows[-1]["fails"][:6]:
            print(f"          ! {f}", flush=True)
        extra = len(self.rows[-1]["fails"]) - 6
        if extra > 0:
            print(f"          … {extra} more", flush=True)

    def gate(self, name, fails, detail_pass="", baseline=None, warnings=()):
        """A gate's verdict, against its baseline. Debt is named and counted, never hidden: a
        board that silently swallowed known failures would be the same lie as a SKIP printed as
        a PASS."""
        new, owed, stale = I.ratchet(fails, baseline or {})
        hard = list(new) + [f"{k}: fixed — remove it from integrity-baseline.json ({name})"
                            for k in stale]
        bits = []
        if owed:
            bits.append(f"{len(owed)} known debt")
        if warnings:
            bits.append(f"{len(warnings)} warning(s)")
        if not hard and detail_pass:
            bits.insert(0, detail_pass)
        self.add(name, FAIL if hard else PASS,
                 (f"{len(hard)} failure(s)" if hard else "") + (" · ".join(bits) and
                  (("  " if hard else "") + " · ".join(bits))), hard)
        for w in list(warnings)[:4]:
            print(f"          ? {w}", flush=True)
        self.rows[-1]["owed"] = owed

    @property
    def failed(self):
        return [r for r in self.rows if r["state"] == FAIL]

    @property
    def skipped(self):
        return [r for r in self.rows if r["state"] == SKIP]

    def print_summary(self):
        width = max(len(r["name"]) for r in self.rows) + 2
        print("\n" + "=" * (width + 46))
        for r in self.rows:
            print(f"  {r['state']:<5} {r['name']:<{width}} {r['detail']}")
        print("=" * (width + 46))
        n_f, n_s = len(self.failed), len(self.skipped)
        verdict = "FAILED" if n_f else ("PASSED" if not n_s else "PASSED, NOT PROVEN")
        debt = sum(len(r.get("owed") or []) for r in self.rows)
        line = f"  {verdict}: {len(self.rows) - n_f - n_s} passed, {n_f} failed"
        if debt:
            line += f", {debt} known debt in integrity-baseline.json"
        if n_s:
            # named, not just counted — an unnamed skip is how a missing check hides in a green run
            line += f", {n_s} NOT RUN ({', '.join(r['name'] for r in self.skipped)})"
        print(line + "\n")


# ---------------------------------------------------------------------------------------------
def run_cmd(board, name, argv, ok_codes=(0,), grep=None):
    """A gate that already owns a CLI. Its stdout is kept and shown only when it fails — a green
    gate that prints twenty lines trains people to stop reading the board."""
    try:
        p = subprocess.run([sys.executable] + argv, cwd=ROOT, capture_output=True, text=True)
    except Exception as e:
        board.add(name, FAIL, f"could not run: {e}")
        return
    tail = [l for l in (p.stdout + p.stderr).strip().splitlines() if l.strip()]
    if p.returncode in ok_codes:
        # a gate that prints a row per portal must be quoted on THIS portal's row — the board
        # once reported tg's counts under nmba's name, which is worse than printing nothing
        pick = [l for l in tail if grep and grep in l] or tail
        board.add(name, PASS, pick[-1].strip()[:90] if pick else "")
    else:
        board.add(name, FAIL, f"exit {p.returncode}", tail[-8:])


def png_size(path):
    try:
        with open(path, "rb") as fh:
            fh.read(16)
            return struct.unpack(">II", fh.read(8))
    except Exception:
        return None


# ---------------------------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--tests", action="store_true", help="also run the engine's own unit tests")
    ap.add_argument("--skip-slow", action="store_true", help="omit the subprocess gates")
    a = ap.parse_args()

    proj = os.path.join(PROJECTS, a.project)
    if not os.path.isdir(proj):
        print(f"no such project: {proj}")
        return 2
    out = os.path.join(proj, "out")
    published_dir = os.path.join(REPO, "docs", "qc", "portals", a.project)

    def js(*p, default=None):
        f = p[0] if len(p) == 1 and os.path.isabs(p[0]) else os.path.join(proj, *p)
        try:
            return json.load(open(f))
        except Exception:
            return default

    baseline = js("integrity-baseline.json", default={}) or {}
    board = Board()
    print(f"\nverifying {a.project}\n")

    # -- the gates that already own a CLI ------------------------------------------------------
    if not a.tests:
        pass
    else:
        buf = io.StringIO()
        suite = unittest.defaultTestLoader.discover(ENGINE, pattern="test_*.py", top_level_dir=ENGINE)
        # the code under test prints — the flow guard narrates every refusal by design — and on
        # a board whose whole value is being readable at a glance, that is 30 lines of noise
        # between the header and the first verdict
        real, sys.stdout = sys.stdout, io.StringIO()
        try:
            res = unittest.TextTestRunner(stream=buf, verbosity=0).run(suite)
        finally:
            sys.stdout = real
        board.add("unit tests", PASS if res.wasSuccessful() else FAIL,
                  f"{res.testsRun} tests",
                  [str(t[0]) for t in (res.failures + res.errors)])

    if not a.skip_slow:
        run_cmd(board, "claim gates",
                [os.path.join(ENGINE, "claims_run.py"), "--project", a.project, "--strict"])
        run_cmd(board, "deliverable spec",
                [os.path.join(ENGINE, "deliverable.py"), "--check", "--portal", a.project],
                grep=a.project)
        run_cmd(board, "frozen ids",
                [os.path.join(ENGINE, "frozen_ids.py"), "--project", a.project])
        master = os.path.join(published_dir, "audit-master.json")
        if not os.path.exists(master):
            master = os.path.join(out, "audit-master.json")
        if os.path.exists(master):
            run_cmd(board, "design↔build crosscheck",
                    [os.path.join(ENGINE, "crosscheck.py"), "--master", master,
                     "--project", proj])
        else:
            board.add("design↔build crosscheck", SKIP, "no audit-master.json")

    # -- the integrity gates, in process -------------------------------------------------------
    am = js(os.path.join(published_dir, "audit-master.json")) or js("out", "audit-master.json")
    findings = []
    if am:
        for s in am.get("screens", []):
            for f in s.get("findings", []):
                findings.append({"id": f["id"], "slug": s.get("slug"), "sev": f.get("severity"),
                                 "title": f.get("element"), "build": f.get("live"),
                                 "_liveCheck": f.get("_liveCheck"),
                                 "_colourWhy": f.get("_colourWhy")})

    bundle = js("out", "capture-bundle.json") or {}
    screens = bundle.get("screens") or []
    rows_cache = {}
    inv = {s["slug"]: s["colorInventory"] for s in screens if s.get("colorInventory")}

    def inventory_for(slug):
        """What the page actually paints, or None. None is the honest answer for a capture taken
        before the inventory existed, and it costs the colour gate its power to fail — which is
        correct: incomplete evidence may warn, never convict."""
        return inv.get(slug)

    def rows_for(slug):
        """The extraction rows for one screen — bundle first (cheap, already in memory), then the
        per-screen JSON the capture wrote. Returns None, never [], when there is nothing to read:
        a gate must skip a screen it cannot see rather than conclude from silence."""
        if slug in rows_cache:
            return rows_cache[slug]
        val = None
        f = os.path.join(proj, "captures", "live", f"{slug}.json")
        if os.path.exists(f):
            try:
                val = json.load(open(f)).get("rows") or None
            except Exception:
                val = None
        rows_cache[slug] = val
        return val

    # capture layout — the canary capture.py records around the unclip pass
    judged = [s for s in screens if "layoutShift" in s]
    if not screens:
        board.add("capture layout", SKIP, "no capture bundle")
    elif not judged:
        board.add("capture layout", SKIP,
                  f"{len(screens)} screens predate the layout canary — re-capture to judge them")
    else:
        board.gate("capture layout", I.gate_capture_layout(judged),
                   f"{len(judged)} screens held still", baseline.get("capture layout"))

    if not findings:
        board.add("absence claims", SKIP, "no findings")
        board.add("quoted build colours", SKIP, "no findings")
    else:
        board.gate("absence claims", I.gate_absence_claims(findings),
                   f"{len(findings)} findings", baseline.get("absence claims"))
        seen = sum(1 for f in findings if f.get("slug") and rows_for(f["slug"]))
        if not seen:
            board.add("quoted build colours", SKIP, "no extraction rows on disk")
        else:
            warn = []
            board.gate("quoted build colours",
                       I.gate_quoted_build_colours(findings, rows_for, warn, inventory_for),
                       (f"{len(inv)} screens with a colour inventory" if inv else
                        f"{seen} findings, NO colour inventory — re-capture to judge colours"),
                       baseline.get("quoted build colours"), warn)

    ba = js("sheet", "anchors.json", default={}) or {}
    if not ba:
        board.add("anchor ambiguity", SKIP, "no sheet/anchors.json")
    else:
        board.gate("anchor ambiguity", I.gate_anchor_ambiguity(ba, rows_for),
                   f"{len(ba)} anchors", baseline.get("anchor ambiguity"))

    sheet_rows = js("sheet", "all_rows.json", default=None)
    if sheet_rows is None or not findings:
        board.add("review sheet pins", SKIP, "no sheet/all_rows.json")
    else:
        # the sheet's slugs are board names; a finding is pinned or it is not, and that is all
        # this gate asks
        board.gate("review sheet pins", I.gate_review_sheet_pins(sheet_rows, findings, ba or None),
                   f"{sum(len(r.get('pins') or []) for r in sheet_rows)} markers",
                   baseline.get("review sheet pins"))

    # report vs master — needs the cards READ BACK from Figma (sheet/report-cards.json)
    cards = js("sheet", "report-cards.json", default=None)
    if cards is None or not findings:
        board.add("report vs master", SKIP,
                  "no sheet/report-cards.json — read the cards back from Figma to judge this")
    else:
        board.gate("report vs master", I.gate_report_matches_master(cards, findings),
                   f"{len(cards)} cards", baseline.get("report vs master"))

    # tracker parity — needs the shared copy exported beside the local workbook
    local, remote = js("out", "tracker-local.json"), js("out", "tracker-remote.json")
    if not local or not remote:
        board.add("tracker parity", SKIP,
                  "export the shared tracker to out/tracker-remote.json to judge this")
    else:
        board.gate("tracker parity", I.gate_tracker_parity(local, remote),
                   f"{len(local)} rows", baseline.get("tracker parity"))

    board.print_summary()
    return 2 if board.failed else 0


if __name__ == "__main__":
    sys.exit(main())
