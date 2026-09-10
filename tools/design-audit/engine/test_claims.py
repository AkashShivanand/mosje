#!/usr/bin/env python3
"""Every case here is a real mistake from the SMILE Beggary run. Each test asserts the gate now
catches the thing that reached the reviewer, and — just as important — does NOT fire on the
corrected version, so the gates cannot be satisfied by making findings vaguer.

    python3 -m unittest engine.test_claims          (from tools/design-audit)
"""
import os, sys, unittest
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import claims as C


class Classification(unittest.TestCase):
    def test_presence_claim_needs_a_picture(self):
        # published wrong: the build HAS a tinted tile, it is 36px against the design's 56px
        cls = C.classify("KPI icons lost their tinted chip",
                         "Each icon sits in a rounded square filled with a light tint.",
                         "The icons are drawn bare on the card, with no ground behind them.")
        self.assertIn("presence", cls)
        self.assertTrue(C.needs_picture(cls))

    def test_the_corrected_size_claim_does_not(self):
        # the same finding, rewritten as a measurement, is safe from the extraction
        cls = C.classify("The KPI icon tile is 36px where the design draws 56px",
                         "measured at 56 x 56", "the same tile, at 36 x 36")
        self.assertFalse(C.needs_picture(cls))

    def test_colour_claim_needs_a_picture(self):
        cls = C.classify("Agency names are drawn as orange links")   # they are navy #003366
        self.assertIn("colour", cls)
        self.assertTrue(C.needs_picture(cls))

    def test_count_and_position_claims_need_a_picture(self):
        self.assertTrue(C.needs_picture(C.classify(
            "The table carries twelve columns where the design specifies five")))
        self.assertTrue(C.needs_picture(C.classify(
            "The last column of the table is off the side of the screen")))

    def test_typography_measurements_do_not(self):
        for t in ("Breadcrumbs are 12px where the design says 14px",
                  "Footer links are smaller and lighter than drawn"):
            self.assertFalse(C.needs_picture(C.classify(t)), t)


class DesignRead(unittest.TestCase):
    def test_truncated_read_fails(self):
        # the actual numbers: 45 text nodes without setCurrentPageAsync, 201 with it
        bad = {"SUPER-ADMIN-MASTER-SETTING": {"_meta": {"pageLoaded": True, "totalText": 45},
                                              "elements": []}}
        fails = C.gate_design_read(bad)
        self.assertTrue(any("partly-loaded" in f for f in fails), fails)

    def test_missing_marker_fails(self):
        fails = C.gate_design_read({"X": {"_meta": {"totalText": 201}}})
        self.assertTrue(any("pageLoaded" in f for f in fails), fails)

    def test_full_read_passes(self):
        self.assertEqual([], C.gate_design_read(
            {"X": {"_meta": {"pageLoaded": True, "totalText": 201}}}))

    def test_a_genuinely_sparse_frame_can_be_declared(self):
        self.assertEqual([], C.gate_design_read(
            {"X": {"_meta": {"pageLoaded": True, "totalText": 6, "smallFrameOK": True}}}))

    def test_empty_dump_fails(self):
        self.assertTrue(C.gate_design_read({}))


class Evidence(unittest.TestCase):
    def test_presence_claim_without_a_crop_fails(self):
        f = [{"id": "G06", "title": "KPI icons lost their tinted chip"}]
        self.assertTrue(C.gate_evidence(f, evidence={}))

    def test_with_a_crop_it_passes(self):
        f = [{"id": "G06", "title": "KPI icons lost their tinted chip"}]
        self.assertEqual([], C.gate_evidence(f, evidence={"G06": "out/evidence/G06.png"}))

    def test_a_waiver_must_say_why(self):
        f = [{"id": "S14", "title": "The screen has no loading state in the design",
              "_evidenceWhy": "a timing behaviour; the crop cannot show a 25-second wait"}]
        self.assertEqual([], C.gate_evidence(f, evidence={}))

    def test_measurement_claims_need_no_crop(self):
        f = [{"id": "G14", "title": "Breadcrumbs are 12px where the design says 14px"}]
        self.assertEqual([], C.gate_evidence(f, evidence={}))


class AnchorMatchesComponent(unittest.TestCase):
    def test_a_chip_finding_anchored_to_an_unfilled_element_fails(self):
        # G02 exactly: the words "Per page" have no background, so they cannot be the chip
        f = [{"id": "G02", "title": "The active page number is a saffron chip"}]
        a = {"G02": {"slug": "S", "anchor": "Per page", "text": "Per page", "tag": "span",
                     "bg": "rgba(0, 0, 0, 0)"}}
        self.assertTrue(C.gate_anchor_matches(f, a))

    def test_the_corrected_anchor_passes(self):
        f = [{"id": "G02", "title": "The current page is a solid gold chip"}]
        a = {"G02": {"slug": "S", "anchor": "1", "text": "1", "tag": "button",
                     "bg": "rgb(245, 190, 20)"}}
        self.assertEqual([], C.gate_anchor_matches(f, a))

    def test_a_chip_on_a_span_is_fine_when_it_is_actually_filled(self):
        f = [{"id": "G16", "title": "Status chips are a size up and a different colour"}]
        a = {"G16": {"slug": "S", "anchor": "Uploaded", "tag": "span", "bg": "rgb(236, 253, 245)"}}
        self.assertEqual([], C.gate_anchor_matches(f, a))

    def test_a_button_finding_on_a_plain_span_fails(self):
        f = [{"id": "X", "title": "The export became two buttons"}]
        a = {"X": {"slug": "S", "anchor": "CSV", "tag": "span", "bg": "rgb(1,2,3)"}}
        self.assertTrue(C.gate_anchor_matches(f, a))

    def test_unknown_background_is_not_judged(self):
        f = [{"id": "X", "title": "The status chip is the wrong colour"}]
        a = {"X": {"slug": "S", "anchor": "Active", "tag": "span"}}     # no bg recorded
        self.assertEqual([], C.gate_anchor_matches(f, a))

    def test_a_declared_neighbour_passes(self):
        f = [{"id": "G07", "title": "The KPI icon tile is 36px where the design draws 56px",
              "_anchorWhy": "the tile has no text node; anchored to the label beside it"}]
        a = {"G07": {"slug": "S", "anchor": "Male", "text": "Male", "tag": "span",
                     "bg": "rgba(0, 0, 0, 0)"}}
        self.assertEqual([], C.gate_anchor_matches(f, a))

    def test_findings_naming_no_component_are_not_touched(self):
        f = [{"id": "G11", "title": "The sidebar is a different typeface and size from the design"}]
        a = {"G11": {"slug": "S", "anchor": "City Profiling", "text": "City Profiling", "tag": "span"}}
        self.assertEqual([], C.gate_anchor_matches(f, a))

    def test_word_overlap_is_a_soft_signal_only(self):
        f = [{"id": "X", "title": "The current page is a solid gold chip"}]
        a = {"X": {"slug": "S", "anchor": "1", "text": "1", "tag": "button"}}
        self.assertEqual([], C.gate_anchor_matches(f, a))       # not fatal
        self.assertEqual(1, len(C.anchor_word_overlap(f, a)))   # but listed to eyeball


class DuplicateAnchors(unittest.TestCase):
    def test_two_findings_on_one_box_fails(self):
        # G08 (text-size controls) and G09 (contrast control) both had the language selector
        d = {"G08": {"node": "8664:51029", "box": [1351, 16, 39, 12]},
             "G09": {"node": "8664:51029", "box": [1351, 16, 39, 12]}}
        self.assertTrue(C.gate_duplicate_anchors(d))

    def test_declared_sharing_passes(self):
        d = {"S08": {"node": "n", "box": [1, 2, 3, 4]}, "G17": {"node": "n", "box": [1, 2, 3, 4]}}
        self.assertEqual([], C.gate_duplicate_anchors(d, allow=[("S08", "G17")]))

    def test_distinct_boxes_pass(self):
        d = {"G08": {"node": "n", "box": [1046, 4, 96, 32]},
             "G09": {"node": "n", "box": [1190, 10, 20, 20]}}
        self.assertEqual([], C.gate_duplicate_anchors(d))


if __name__ == "__main__":
    unittest.main(verbosity=2)
