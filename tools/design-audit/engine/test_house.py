#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""The design-less audit: house baseline, citation gates, and rendered fix previews.

Every case here is a mistake this run either made or came within one decision of making, on the
first portal audited with no design frames to compare against (PM-AJAY, 2026-09-12).

    python3 -m unittest discover -p "test_*.py" -t .      (from tools/design-audit/engine)
"""
import json, os, sys, tempfile, unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import analyze as A
import integrity as I
import fixpreview as FP


# ---------------------------------------------------------------------------------------------
class FluidTypeRamp(unittest.TestCase):
    """The estate's display and headline tiers are `clamp()` ranges, not numbers.

    The first version of the house parser stored one end of each interval, which would have
    reported EVERY fluid heading in EVERY MoSJE build as off-ramp. `--sa-type-headline-5-size` is
    `clamp(1.125rem, calc(1.0761rem + 0.217vw), 1.25rem)` — anything from 18px to 20px is the
    same conformant token.
    """

    def test_a_size_inside_a_fluid_range_is_conformant(self):
        allow = A.Allowed([14.0, 16.0], [(18.0, 20.0)])
        for n in (18, 19, 19.5, 20):
            self.assertIn(n, allow, f"{n}px is inside headline-5's published range")

    def test_a_size_outside_every_range_is_not(self):
        allow = A.Allowed([14.0, 16.0], [(18.0, 20.0)])
        for n in (15, 17, 21, 26):
            self.assertNotIn(n, allow)

    def test_a_discrete_token_still_matches_exactly(self):
        allow = A.Allowed([14.0], [])
        self.assertIn(14, allow)
        self.assertIn(14.0, allow)
        self.assertNotIn(13, allow)

    def test_sub_pixel_rendering_does_not_break_a_match(self):
        # a browser reports 19.9968px for a clamped size at some viewport widths
        allow = A.Allowed([], [(18.0, 20.0)])
        self.assertIn(20.4, allow)
        self.assertNotIn(21.2, allow)

    def test_an_empty_baseline_is_falsy_so_conformance_skips_the_axis(self):
        # conformance() does `if not allowed: continue` — an axis with no contract must not
        # silently flag every value on the screen as a deviation.
        self.assertFalse(A.Allowed([], []))
        self.assertTrue(A.Allowed([1], []))
        self.assertTrue(A.Allowed([], [(1, 2)]))


# ---------------------------------------------------------------------------------------------
class PrimaryFamily(unittest.TestCase):
    """getComputedStyle returns the requested STACK. Comparing whole stacks to a token compares
    two spellings of the same intent, and would flag every element in the estate."""

    def test_the_first_family_is_the_intent(self):
        self.assertEqual(A.primary_family('"Noto Sans", ui-sans-serif, system-ui'), "Noto Sans")
        self.assertEqual(A.primary_family("Noto Sans"), "Noto Sans")
        self.assertEqual(A.primary_family("'Material Symbols Rounded'"),
                         "Material Symbols Rounded")

    def test_a_non_string_passes_through_rather_than_crashing(self):
        self.assertIsNone(A.primary_family(None))


# ---------------------------------------------------------------------------------------------
class HouseGapIsNotAPortalDefect(unittest.TestCase):
    """The divergence that makes this whole split load-bearing.

    The handoff file's neutral ramp is Tailwind's default greys — #1f2937 alone on 23,853 sampled
    nodes across all ten non-draft pages — and NONE of those values appears even once in the
    generated token contract, which publishes #1e2124 / #3a3d41 / #dcdee1 / #6f757d, 4-11 points
    away. A build that followed the design file is not defective. Without this split the audit
    would have reported thousands of false findings, which is worth less than no report.
    """

    def _house(self, tmp):
        h = {
            "contract": {"colors": ["#1e2124", "#dcdee1"], "radii": [8, 12],
                         "fontSizes": [14], "fontSizeRanges": [], "fontFamilies": ["Noto Sans"]},
            "tokenNames": {"colors": {"#1e2124": ["sa-text-neutral-base"]}},
            "observed": {
                "colour": {"designFileDrift": {"#1f2937": {"count": 23853, "pages": 10}}},
                "radius": {"designFileDrift": {"10": {"count": 300, "pages": 8}}},
                "fontSize": {"designFileDrift": {"13": {"count": 1800, "pages": 9}}},
                "fontFamily": {"designFileDrift": {"Inter": 318}},
            },
            "provenance": {"contract": {"version": "9.9.9"}},
        }
        p = os.path.join(tmp, "house.json")
        json.dump(h, open(p, "w"))
        return p

    def test_a_widespread_file_value_is_classified_as_a_gap_not_a_deviation(self):
        with tempfile.TemporaryDirectory() as tmp:
            allow = A.load_house(self._house(tmp), {})
            self.assertIn("#1f2937", allow["_gaps"]["color"])
            # and the contract value is genuinely allowed
            self.assertIn("#1e2124", allow["colors"])
            self.assertNotIn("#1f2937", allow["colors"])

    def test_a_stray_typeface_is_never_excused_as_a_house_convention(self):
        """Inter appears on 318 nodes across five Figma pages, so by spread alone it would
        qualify. It is still not a gap: `CLAUDE.md` makes Noto Sans a standing instruction, so a
        stray typeface is a defect in BOTH the file and any build that copies it. There is no
        page-count at which the wrong font becomes the estate's standard."""
        with tempfile.TemporaryDirectory() as tmp:
            allow = A.load_house(self._house(tmp), {})
            self.assertEqual(allow["_gaps"]["fontFamily"], {})

    def test_a_one_page_value_is_not_corroborated_enough_to_excuse_the_portal(self):
        """What this nearly got wrong. `#4a5565` and `#364153` are the portal's two largest
        colour deviations (933 and 781 elements) and were excused as house gaps on the strength
        of ONE Figma page using them 44 and 22 times. If one stray literal could absolve a
        portal-wide deviation, any finding could be argued away."""
        with tempfile.TemporaryDirectory() as tmp:
            h = json.load(open(self._house(tmp)))
            h["observed"]["colour"]["designFileDrift"]["#4a5565"] = {"count": 44, "pages": 1}
            p2 = os.path.join(tmp, "h2.json")
            json.dump(h, open(p2, "w"))
            allow = A.load_house(p2, {})
            self.assertNotIn("#4a5565", allow["_gaps"]["color"],
                             "one page of evidence must not excuse a portal-wide deviation")
            self.assertIn("#1f2937", allow["_gaps"]["color"],
                          "ten pages of evidence is a real convention the contract lacks")

    def test_numeric_gaps_are_keyed_so_a_float_reading_still_matches(self):
        # the extraction reports radius 10, the evidence recorded "10" — both must resolve
        with tempfile.TemporaryDirectory() as tmp:
            allow = A.load_house(self._house(tmp), {})
            self.assertIn("10.0", allow["_gaps"]["radius"])
            self.assertIn("13.0", allow["_gaps"]["fontSize"])


# ---------------------------------------------------------------------------------------------
class StandardCitation(unittest.TestCase):
    """With no design frame in the left panel, a finding that cites nothing is unfalsifiable."""

    def test_a_finding_with_no_citation_fails(self):
        out = I.gate_standard_citation([{"id": "PMA-001", "title": "The card edge is too light"}])
        self.assertEqual(len(out), 1)
        self.assertIn("no `_cites`", out[0])

    def test_a_token_citation_passes(self):
        self.assertEqual(I.gate_standard_citation(
            [{"id": "PMA-001", "_cites": ["--sa-border-neutral-subtle"]}]), [])

    def test_a_wcag_citation_needs_its_version(self):
        # "1.4.3" alone is ambiguous between WCAG versions AND between standards
        out = I.gate_standard_citation([{"id": "PMA-002", "_cites": ["1.4.3"]}])
        self.assertEqual(len(out), 1)
        self.assertIn("bare number", out[0])
        self.assertEqual(I.gate_standard_citation(
            [{"id": "PMA-002", "_cites": ["WCAG 2.2 1.4.3"]}]), [])

    def test_the_mandatory_government_standards_are_recognised(self):
        for c in ("GIGW 3.0 3.4.2", "DBIM §4.4", "UX4G 3.2", "HOUSE-GAP"):
            with self.subTest(cite=c):
                self.assertEqual(I.gate_standard_citation([{"id": "X", "_cites": [c]}]), [])

    def test_a_citation_that_names_nothing_checkable_fails(self):
        out = I.gate_standard_citation(
            [{"id": "PMA-003", "_cites": ["best practice", "looks wrong"]}])
        self.assertEqual(len(out), 1)
        self.assertIn("no recognised authority", out[0])

    def test_a_declared_judgment_call_is_allowed_but_must_give_its_reason(self):
        self.assertEqual(I.gate_standard_citation(
            [{"id": "X", "_judgment": "Two competing primary actions in one toolbar; which one "
                                      "leads is a product decision, not a token question"}]), [])
        out = I.gate_standard_citation([{"id": "Y", "_judgment": "  "}])
        self.assertEqual(len(out), 1)
        self.assertIn("no reason", out[0])

    def test_a_string_citation_is_accepted_as_well_as_a_list(self):
        self.assertEqual(I.gate_standard_citation(
            [{"id": "X", "_cites": "--sa-shape-12"}]), [])

    def test_the_gate_is_off_where_a_design_frame_exists(self):
        # a side-by-side audit's authority IS the frame; requiring a citation there would be busywork
        self.assertEqual(I.gate_standard_citation(
            [{"id": "X", "title": "no cites here"}], require=False), [])


# ---------------------------------------------------------------------------------------------
class HouseGapRouting(unittest.TestCase):
    """A gap between the contract and the handoff library is owed by the design system. Charging
    it to the portal hands a developer thousands of items they cannot act on."""

    def test_a_house_gap_finding_must_be_scoped_to_the_design_system(self):
        out = I.gate_house_gap_routing(
            [{"id": "PMA-010", "_cites": ["HOUSE-GAP"], "scope": "Global"}])
        self.assertTrue(any("scope" in m for m in out))

    def test_a_correctly_routed_house_gap_passes(self):
        self.assertEqual(I.gate_house_gap_routing(
            [{"id": "PMA-010", "_cites": ["HOUSE-GAP"], "scope": "Design System",
              "severity": "Major"}]), [])

    def test_a_house_gap_cannot_be_a_blocker_on_the_portal(self):
        out = I.gate_house_gap_routing(
            [{"id": "PMA-011", "_cites": ["HOUSE-GAP"], "scope": "Design System",
              "severity": "Blocker"}])
        self.assertTrue(any("Blocker" in m for m in out))

    def test_an_ordinary_finding_is_untouched(self):
        self.assertEqual(I.gate_house_gap_routing(
            [{"id": "X", "_cites": ["--sa-shape-8"], "scope": "Global",
              "severity": "Blocker"}]), [])


# ---------------------------------------------------------------------------------------------
class FixPreviewCollateral(unittest.TestCase):
    """A proposed fix that moves half the page is not a fix. Same measurement as
    gate_capture_layout: elements outside the patch target must hold still."""

    def test_an_unmoved_page_reports_no_collateral(self):
        before = {"TD|Total|1": [100, 200], "A|Back|2": [10, 20]}
        self.assertEqual(FP.collateral(before, dict(before)), [])

    def test_sub_pixel_reflow_is_tolerated(self):
        before = {"TD|Total|1": [100, 200]}
        self.assertEqual(FP.collateral(before, {"TD|Total|1": [101, 202]}), [])

    def test_a_real_shove_is_reported_worst_first(self):
        before = {"TD|Total|1": [100, 200], "A|Back|2": [10, 20]}
        after = {"TD|Total|1": [100, 260], "A|Back|2": [18, 20]}
        out = FP.collateral(before, after)
        self.assertEqual(len(out), 2)
        self.assertEqual(out[0]["element"], "TD|Total")
        self.assertEqual(out[0]["dy"], 60)

    def test_an_element_that_appeared_or_vanished_is_not_a_shift(self):
        # a content difference is not a measurable move, and guessing at one would be noise
        self.assertEqual(FP.collateral({"A|x|1": [0, 0]}, {"B|y|1": [0, 0]}), [])


if __name__ == "__main__":
    unittest.main()
