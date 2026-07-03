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
import argparse, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import capture as CAP, analyze as AN, report as REP

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--phase", default="analyze+report",
                    choices=["capture", "analyze", "report", "analyze+report", "all"])
    ap.add_argument("--role", default=None, help="capture only this role")
    a = ap.parse_args()
    ph = a.phase
    if ph in ("capture", "all"):
        print("== PHASE: capture =="); CAP.run(a.project, a.role)
    if ph in ("analyze", "analyze+report", "all"):
        print("== PHASE: analyze =="); AN.run(a.project)
    if ph in ("report", "analyze+report", "all"):
        print("== PHASE: report =="); REP.build(a.project)
    print("\nNEXT (human track → CERTIFIED):")
    print("  • confirm 🤖 severities, run the keyboard + screen-reader a11y pass, review Hindi/RTL content,")
    print("    sign brand/GIGW — then flip status to CERTIFIED. Machine draft cannot self-certify.")

if __name__ == "__main__":
    main()
