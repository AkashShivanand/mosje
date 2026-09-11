"""Unit tests for the deliverable spec gate.

Run:  cd tools/design-audit && python3 -m unittest engine.test_deliverable -v
"""
import json, os, sys, unittest
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from engine import deliverable as D


def master(portal="P", findings=(("P-1", "a"),), **extra):
    m = {"portal": portal, "generated": "2026-01-01", "idPrefix": "P", "figmaUrl": "u",
         "method": "m", "deferred": [],
         "screens": [{"slug": "S", "name": "Screen", "findings": [
             {"id": i, "element": t, "severity": "Major", "axis": "Typography",
              "figma": "d", "live": "b", "fix": "f"} for i, t in findings]}]}
    m.update(extra)
    return m


class SpecShape(unittest.TestCase):
    def test_the_required_set_is_the_documented_one(self):
        names = [n for n, _ in D.REQUIRED]
        for n in ("audit-master.json", "README.md", "DESIGN-QA-REPORT.md",
                  "generate_pdf.py", "render.js"):
            self.assertIn(n, names)

    def test_build_artefacts_are_forbidden(self):
        for n in ("report-generated.html", "report-sections.json", "node_modules",
                  "package.json", "package-lock.json"):
            self.assertIn(n, D.FORBIDDEN)

    def test_capture_and_build_scripts_do_not_belong_in_the_deliverable(self):
        for p in ("_cap_", "build_", "screens."):
            self.assertIn(p, D.FORBIDDEN_PREFIX)


class Generators(unittest.TestCase):
    def test_report_names_every_finding(self):
        md = D.report_md("p", master(findings=(("P-1", "alpha"), ("P-2", "beta"))), {})
        self.assertIn("alpha", md)
        self.assertIn("beta", md)
        self.assertIn("P-1", md)

    def test_report_separates_global_from_screen_findings(self):
        m = master()
        m["screens"][0]["findings"][0]["scope"] = "Global"
        md = D.report_md("p", m, {})
        self.assertIn("Findings that apply to every screen", md)

    def test_report_publishes_the_deferred_items(self):
        m = master(deferred=[{"title": "withdrawn thing", "reason": "it was wrong"}])
        md = D.report_md("p", m, {})
        self.assertIn("withdrawn thing", md)
        self.assertIn("it was wrong", md)

    def test_readme_names_the_tracker_tab_when_there_is_one(self):
        rd = D.readme_md("p", master(), {"p": {"trackerTab": "My Tab"}})
        self.assertIn("My Tab", rd)

    def test_readme_says_so_when_there_is_no_tracker_tab(self):
        rd = D.readme_md("p", master(), {})
        self.assertIn("not yet added", rd)

    def test_a_master_with_no_method_still_renders(self):
        m = master(); del m["method"]
        self.assertIn("Summary", D.report_md("p", m, {}))


if __name__ == "__main__":
    unittest.main()
