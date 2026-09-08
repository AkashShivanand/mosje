"""Unit tests for the wizard filler's embedded JavaScript.

Run:  cd tools/design-audit && python3 -m unittest engine.test_drive_fill -v
      (stdlib only — no pytest, no new deps)

Two defects live in this file's subject that no browser reports and no screenshot shows, so
they are asserted here instead: a mangled escape (the JavaScript is a raw string, and stops
working silently the day that `r` is dropped) and the value table the JavaScript reads by name.
"""
import os, re, sys, unittest
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from engine import drive as D


class FillerJavaScript(unittest.TestCase):
    def test_word_boundaries_reach_the_browser_intact(self):
        # Without the r prefix Python turns every \b into \x08 before the browser sees it, so
        # the regex word boundaries never match. AVYAY's step 4 blocked on exactly that.
        for name in ("FILL_ALL_JS", "HEAL_NUMERIC_JS", "_HELPERS_JS"):
            self.assertNotIn("\x08", getattr(D, name), f"{name} lost its raw-string prefix")
        self.assertIn(r"\b(?:number of|", D.FILL_ALL_JS)

    def test_both_scripts_carry_the_shared_helpers(self):
        for name in ("FILL_ALL_JS", "HEAL_NUMERIC_JS"):
            self.assertIn("labelOf", getattr(D, name))

    def test_every_value_the_javascript_reads_is_defined(self):
        for js in (D.FILL_ALL_JS, D.HEAL_NUMERIC_JS):
            for key in sorted(set(re.findall(r"\bF\.([A-Za-z_][A-Za-z0-9_]*)", js))):
                self.assertIn(key, D.DEFAULT_VALUES,
                              f"the JavaScript reads F.{key}, which DEFAULT_VALUES lacks")

    def test_the_end_of_a_date_span_falls_after_its_start(self):
        # NAPDDR's step 2 needs "Registration valid up to" to be after "Date of Registration".
        self.assertGreater(D.DEFAULT_VALUES["dateLater"], D.DEFAULT_VALUES["date"])
