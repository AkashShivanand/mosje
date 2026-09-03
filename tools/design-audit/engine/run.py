#!/usr/bin/env python3
"""design-audit orchestrator (project-agnostic).

Phases:
  capture  — log in per role (keep-alive), discover routes, screenshot + extract every element
  analyze  — coverage ledger (Figma ∪ live) + per-element DS-conformance + audit-master.json
  report   — render the MACHINE-DRAFT PDF/HTML with 🤖/👤 stamps + coverage/DS-adoption tiles

Usage:
  python engine/run.py --project nhapoa                 # analyze + report from existing captures
  python engine/run.py --project nhapoa --phase capture # (re)capture live screens first
  python engine/run.py --project nhapoa --phase all     # capture + analyze + report

Phase 0 (agent, once per run, before analyze): dump Figma via the Figma MCP into
  projects/<p>/inputs/figma-frames.json   [{node_id,name,role,screen,state}]
  projects/<p>/inputs/tokens.json         {colors:[],radii:[],fontSizes:[],fontFamilies:[]}
  projects/<p>/captures/figma/<SLUG>.png  (design frames, optional, for side-by-side boards)
The deterministic phases below need no MCP and run standalone."""
import argparse, sys, os, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
ENGINE = os.path.dirname(os.path.abspath(__file__))
import capture as CAP, analyze as AN, report as REP
# NOTE: `figures` is imported inside its own phase branch, not here. It imports PIL, and
# preflight() installs npm deps and chromium but nothing installs Python deps — so a module-scope
# import would make `--phase analyze` (which needs no PIL, and worked before figures existed) die
# at import on any machine without Pillow.

def preflight(need_browser):
    """Self-install deps so the user never runs setup commands. Idempotent + fast when already present."""
    if not os.path.isdir(os.path.join(ENGINE, "node_modules")):
        print("  (first run) installing PDF deps…")
        subprocess.run(["npm", "i"], cwd=ENGINE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if need_browser:
        try:
            from playwright.sync_api import sync_playwright
            with sync_playwright() as p:
                p.chromium.launch(channel="chrome", headless=True).close()
        except Exception:
            print("  (first run) installing chromium…")
            subprocess.run([sys.executable, "-m", "playwright", "install", "chromium"],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--phase", default="analyze+report",
                    choices=["capture", "analyze", "report", "analyze+report", "all", "bundle", "figures"])
    ap.add_argument("--role", default=None, help="capture only this role (merged into the "
                    "existing manifest — other roles' entries are preserved)")
    ap.add_argument("--allow-empty", action="store_true",
                    help="permit a full capture that captured nothing to overwrite a non-empty manifest")
    ap.add_argument("--force", action="store_true",
                    help="ignore any existing capture-bundle.json and re-capture everything")
    ap.add_argument("--verify", action="store_true",
                    help="always run the per-screen freshness check, even when the build "
                         "fingerprint is unchanged. Applies to --phase capture/all; "
                         "--phase bundle always verifies whether or not this is passed")
    a = ap.parse_args()
    ph = a.phase
    preflight(need_browser=ph in ("capture", "all", "bundle"))
    if ph in ("capture", "all"):
        print("== PHASE: capture =="); CAP.run(a.project, a.role, a.allow_empty, a.force, a.verify)
    if ph == "bundle":
        # verify=True ALWAYS, and by keyword. `--verify` is a store_true, so passing it
        # positionally handed refresh() a False that overrode its deliberate verify=True default
        # — letting the documented QC entry point reach `reuse-all` on the build fingerprint
        # alone, when defaulting to --verify is precisely the spec's stated mitigation for a
        # fingerprint missing server-rendered content change. `--force` still wins: it re-captures
        # everything regardless.
        print("== PHASE: bundle =="); CAP.refresh(a.project, force=a.force, verify=True)
    if ph == "figures":
        import figures as FIG   # local: keeps PIL out of every other phase (see the note above)
        hub = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(ENGINE))),
                           "apps", "hub", "public", "reports", a.project, "figures")
        print("== PHASE: figures =="); FIG.derive(a.project, hub)
    if ph in ("analyze", "analyze+report", "all"):
        print("== PHASE: analyze =="); AN.run(a.project)
    if ph in ("report", "analyze+report", "all"):
        print("== PHASE: report =="); REP.build(a.project)
    print("\nNEXT (human track → CERTIFIED):")
    print("  • confirm 🤖 severities, run the keyboard + screen-reader a11y pass, review Hindi/RTL content,")
    print("    sign brand/GIGW — then flip status to CERTIFIED. Machine draft cannot self-certify.")

if __name__ == "__main__":
    main()
