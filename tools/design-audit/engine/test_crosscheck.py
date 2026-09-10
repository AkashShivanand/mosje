"""Unit tests for the design<->build mapping gate's title picker.

Run:  cd tools/design-audit && python3 -m unittest engine.test_crosscheck -v
      (stdlib only — no pytest, no new deps)

Every case here is a real reading from the NMBA September 2026 run, where a correctly-paired
screen was reported MISMAP. A gate that cries wolf is worse than no gate, because people learn
to ignore it — so the picker is tested against the pages that broke it.
"""
import os, sys, unittest
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from engine import crosscheck as XC


def row(text, x, y, fs, w=200):
    return {"text": text, "x": x, "y": y, "w": w, "fontSize": fs}


def rail(n=6, y0=170):
    """A persistent left nav rail: several short labels stacked in the left 300px."""
    labels = ["Dashboard", "Activity Snapshot", "E-Pledge", "Facilities", "Helpline", "Feedback"]
    return [row(labels[i % len(labels)], 64, y0 + i * 48, 16, w=180) for i in range(n)]


class SidebarDetection(unittest.TestCase):
    def test_a_rail_is_detected(self):
        self.assertEqual(XC.sidebar_cutoff(rail()), XC.SIDEBAR_X)

    def test_a_page_with_no_rail_keeps_the_full_width(self):
        self.assertEqual(XC.sidebar_cutoff([row("Title", 500, 200, 32)]), 0)

    def test_a_few_short_left_texts_are_not_a_rail(self):
        # A caption and a label near the left edge must not switch the guard on and hide a
        # left-aligned page title.
        self.assertEqual(XC.sidebar_cutoff([row("Note", 40, 300, 12), row("Label", 40, 320, 12)]), 0)


class BuildHeading(unittest.TestCase):
    def test_the_sidebars_first_item_is_not_the_page_title(self):
        """The defect: e-Pledge's title sits at y576 under a hero image, so the y120-300 band
        held nothing but the rail's first link, and a correct pairing was called MISMAP."""
        rows = rail() + [row("Nasha Mukt Bharat Abhiyaan Pledge", 493, 576, 24, w=440)]
        self.assertEqual(XC.build_heading(rows, 1440), "Nasha Mukt Bharat Abhiyaan Pledge")

    def test_the_accessibility_widget_panel_is_not_the_page_title(self):
        """The widget renders OUTSIDE the 1440 viewport at display sizes. It is invisible to a
        reader, it is not ours, and it is the largest text in the extraction."""
        rows = rail() + [row("Bigger Text", 1690, 210, 40),
                         row("Feedback / Grievance", 493, 560, 24, w=300)]
        self.assertEqual(XC.build_heading(rows, 1440), "Feedback / Grievance")

    def test_an_accessibility_label_inside_the_viewport_is_still_refused(self):
        rows = rail() + [row("Bigger Text", 900, 200, 40),
                         row("Activity Snapshots", 493, 560, 24, w=300)]
        self.assertEqual(XC.build_heading(rows, 1440), "Activity Snapshots")

    def test_a_normal_title_in_the_band_still_wins(self):
        """The common case must not regress: a title in the ordinary band beats anything lower."""
        rows = rail() + [row("User Management", 320, 160, 24, w=260),
                         row("Add New User", 320, 700, 24, w=200)]
        self.assertEqual(XC.build_heading(rows, 1440), "User Management")

    def test_numbers_and_currency_are_never_a_title(self):
        rows = rail() + [row("9,628", 500, 200, 48), row("Dashboard Statistics", 500, 260, 28, w=300)]
        self.assertEqual(XC.build_heading(rows, 1440), "Dashboard Statistics")

    def test_a_page_with_no_rail_can_still_have_a_left_aligned_title(self):
        rows = [row("Help Centres & Facilities", 40, 200, 32, w=400)]
        self.assertEqual(XC.build_heading(rows, 1440), "Help Centres & Facilities")


if __name__ == "__main__":
    unittest.main()
