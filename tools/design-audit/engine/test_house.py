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
class TheFigmaFileIsTheAuthority(unittest.TestCase):
    """The inversion, and the tests that pin it the right way round.

    The first version of `load_house` made the generated token contract convict and demoted the
    handoff file to corroboration. It reasoned that a literal is not a bound token and that the
    PM-AJAY page is a draft. Both premises are true; neither supports the conclusion — the PM-AJAY
    *page* being a draft is a reason not to treat *its frames* as a per-screen authority, not a
    reason to demote the whole file's established language.

    It mattered, twice over. The build's neutrals are Tailwind v4 **slate**; the file's are
    Tailwind v3 **gray**. Against the real standard the build's slate is a live PORTAL finding, and
    the inversion filed it as a design-system gap that EXCUSED the portal — while `#4a5565` and
    `#364153`, which turn out to be on ALL 224 screens, were absolved on the strength of one Figma
    page using them 44 and 22 times.

    The rule now: ALLOWED is the file's established language UNION everything the contract
    publishes, because either one is legitimate. A value in neither is charged.
    """

    def _house(self, tmp, **over):
        h = {
            "contract": {"colors": ["#1e2124", "#dcdee1"], "radii": [8, 12],
                         "fontSizes": [14], "fontSizeRanges": [], "fontFamilies": ["Noto Sans"]},
            "tokenNames": {"colors": {"#1e2124": ["sa-text-neutral-base"]}},
            "standard": {
                # the file's established language: on 3+ non-draft pages
                "colour": {
                    "standard": {"#1f2937": {"count": 25774, "pages": 11, "hasToken": False},
                                 "#ffffff": {"count": 8378, "pages": 11, "hasToken": True}},
                    "noToken": {"#1f2937": {"count": 25774, "pages": 11}},
                    "fileDefects": {"#d9d9d9": {"count": 4130, "pages": 11, "why": "default fill"}},
                },
                "radius": {"standard": {"8": {"count": 500, "pages": 11, "hasToken": True}},
                           "noToken": {}, "fileDefects": {}},
                "fontSize": {"standard": {"14": {"count": 11021, "pages": 11, "hasToken": True},
                                          "13": {"count": 1639, "pages": 11, "hasToken": False}},
                             "noToken": {"13": {"count": 1639, "pages": 11}}, "fileDefects": {}},
                "spacing": {"standard": {}, "noToken": {}, "fileDefects": {}},
                "fontFamily": {"standard": {"Noto Sans": {"count": 40000, "pages": 11}},
                               "noToken": {}, "fileDefects": {"Inter": {"count": 282, "pages": 3,
                                                                        "why": "not a MoSJE face"}}},
            },
            "provenance": {"contract": {"version": "9.9.9"}},
        }
        h.update(over)
        p2 = os.path.join(tmp, "house.json")
        json.dump(h, open(p2, "w"))
        return p2

    def test_the_files_own_language_is_allowed_even_with_no_token(self):
        """#1f2937 is the estate's ink on 25,774 nodes across every page and has NO token. A build
        rendering it is following the design, which is what the portal is built from."""
        with tempfile.TemporaryDirectory() as tmp:
            allow = A.load_house(self._house(tmp), {})
            self.assertIn("#1f2937", allow["colors"])
            self.assertIn(13, allow["fontSizes"], "13px is an established file step")

    def test_the_contracts_values_are_allowed_too_because_using_the_ds_is_never_a_defect(self):
        with tempfile.TemporaryDirectory() as tmp:
            allow = A.load_house(self._house(tmp), {})
            self.assertIn("#1e2124", allow["colors"])
            self.assertIn("#dcdee1", allow["colors"])

    def test_a_value_in_neither_is_charged_to_the_portal(self):
        """The slate ramp. This is the answer the inversion was hiding."""
        with tempfile.TemporaryDirectory() as tmp:
            allow = A.load_house(self._house(tmp), {})
            for slate in ("#314158", "#4a5565", "#364153", "#0f172b"):
                self.assertNotIn(slate, allow["colors"], f"{slate} is in neither the file nor "
                                                         f"the contract and must be charged")

    def test_nothing_is_excused_any_more(self):
        """`_gaps` is what conformance() consults to excuse a deviation. It must stay empty: the
        portal is built from the file, so a file/contract disagreement is not its defence."""
        with tempfile.TemporaryDirectory() as tmp:
            allow = A.load_house(self._house(tmp), {})
            self.assertEqual(allow["_gaps"], {"color": {}, "radius": {}, "fontSize": {},
                                              "fontFamily": {}})

    def test_a_standard_value_with_no_token_is_reported_as_a_design_system_gap(self):
        """Reported, not excusing. #1f2937 having no token is a real DS finding — the contract
        does not publish the estate's own most-used colour — and it is routed there."""
        with tempfile.TemporaryDirectory() as tmp:
            allow = A.load_house(self._house(tmp), {})
            self.assertIn("#1f2937", allow["_noToken"]["colour"])
            self.assertIn("13", allow["_noToken"]["fontSize"])

    def test_the_files_own_defects_are_not_the_standard(self):
        """Blessing the file wholesale is the mirror of the original error. #d9d9d9 is Figma's
        default rectangle fill on ~4,000 unstyled shapes; Inter is not a MoSJE face."""
        with tempfile.TemporaryDirectory() as tmp:
            allow = A.load_house(self._house(tmp), {})
            self.assertNotIn("#d9d9d9", allow["colors"])
            self.assertIn("#d9d9d9", allow["_fileDefects"]["colour"])
            self.assertIn("Inter", allow["_fileDefects"]["fontFamily"])

    def test_fluid_ranges_can_be_switched_off_for_a_build_that_loads_no_tokens(self):
        """A clamp() range belongs to the contract, so it may only excuse a build that consumes
        it. PM-AJAY loads ZERO --sa-* properties, and with ranges on its redefined 17px and 19px
        slipped through on a HEADING tier's bands — excusing the very defect being reported."""
        with tempfile.TemporaryDirectory() as tmp:
            src = self._house(tmp, contract={
                "colors": [], "radii": [], "fontSizes": [14],
                "fontSizeRanges": [{"min": 16.0, "max": 20.0, "tokens": ["sa-type-headline-5-size"]}],
                "fontFamilies": []})
            on = A.load_house(src, {}, fluid_ranges=True)
            off = A.load_house(src, {}, fluid_ranges=False)
            self.assertIn(17, on["fontSizes"], "with ranges on, 17px is admitted by the band")
            self.assertNotIn(17, off["fontSizes"], "with ranges off, 17px is charged")
            self.assertIn(14, off["fontSizes"], "a discrete step is unaffected")


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


# ---------------------------------------------------------------------------------------------
class SkeletonHeuristicIsSaturationAware(unittest.TestCase):
    """A warning from an instrument is not evidence about the product.

    PM-AJAY, 2026-09-12: `wait_for_data`'s placeholder count treated any empty coloured div
    6-60px tall as a skeleton, which on the Ministry dashboard is its PROGRESS BARS. It reported
    "STILL LOADING (22 skeleton placeholders)" on three screens whose figures had all arrived —
    47,333 / 22,030 / 19,763 / 14,994 were in the same extraction, with zero em-dash rows — and a
    finding was drafted from the warning before the instrument was checked. It was withdrawn.

    These assert the RULE the fix encodes, on the classifier's own terms: a grey fill is a
    placeholder, a saturated fill is data. The JS is exercised by the capture; this pins the
    boundary so the next edit cannot quietly move it back.
    """

    @staticmethod
    def _neutral(r, g, b):
        # the same test WAIT_FOR_DATA_JS applies
        return (max(r, g, b) - min(r, g, b)) <= 64

    def test_a_grey_placeholder_still_counts_as_a_skeleton(self):
        # the estate's greys are COOL greys; slate-500 spreads 44, which a tighter bound
        # misfiled as data. Measured, not guessed.
        for grey in [(229, 231, 235), (241, 245, 249), (156, 163, 175), (148, 163, 184),
                     (49, 65, 88), (98, 116, 142)]:
            with self.subTest(rgb=grey):
                self.assertTrue(self._neutral(*grey))

    def test_a_brand_coloured_bar_is_data_not_a_skeleton(self):
        # the fills actually on PM-AJAY's dashboard bars: gov-blue, a green, a saffron, a navy
        for bar in [(3, 115, 223), (0, 130, 54), (245, 73, 0), (10, 58, 116)]:
            with self.subTest(rgb=bar):
                self.assertFalse(self._neutral(*bar),
                                 "a saturated fill is a chart, and counting it as a placeholder "
                                 "is what produced a false 'never loads' finding")

    def test_the_boundary_sits_in_the_measured_gap(self):
        # greys observed up to 44, chart fills from 106 — the bound is 64, and both margins
        # matter: too tight misfiles placeholders, too loose misfiles charts.
        self.assertTrue(self._neutral(100, 120, 164))    # 64 apart — grey side
        self.assertFalse(self._neutral(100, 120, 165))   # 65 apart — coloured side


# ---------------------------------------------------------------------------------------------
class LayoutCanaryNeedsUnambiguousText(unittest.TestCase):
    """The instrument built to detect instrument failure committed the ledger's oldest error.

    PM-AJAY, 2026-09-12: the canary reported "LAYOUT SHIFTED" on 7 of 62 captures — 5 of 14 GIA
    screens — and every one was false. It keys on text, and "Add Beneficiary" is both the
    top-right button (x1220) and a sidebar nav item (x44); "Beneficiary List", "Misc. Reports",
    "Project Status" and "Executive Summary" are each a page heading AND a sidebar label. The
    before and after readings keyed to different elements. Every screenshot was correct.

    That is `audit-rules.md` §0 lesson 2 verbatim. These pin the selection rule the fix encodes:
    a text that occurs more than once is not usable as a key, and ambiguity is judged on the TEXT
    alone — tag+text would have hidden the button/link collision that caused this.
    """

    @staticmethod
    def _select(candidates):
        """Mirror of CANARY_JS's filter: [(tag, text, x)] -> {key: x} for unique texts only."""
        counts = {}
        for _, t, _ in candidates:
            counts[t] = counts.get(t, 0) + 1
        return {f"{tag}|{t}": x for tag, t, x in candidates if counts[t] == 1}

    def test_a_text_on_two_elements_is_dropped(self):
        # the exact collision: a sidebar link and a page button sharing a label
        picked = self._select([("A", "Add Beneficiary", 44),
                               ("BUTTON", "Add Beneficiary", 1220),
                               ("H2", "Beneficiaries", 319)])
        self.assertEqual(list(picked), ["H2|Beneficiaries"])

    def test_ambiguity_is_judged_on_text_not_on_tag_plus_text(self):
        # keying on tag+text would make these two "unique" and reinstate the false positive
        picked = self._select([("A", "Misc. Reports", 44), ("H2", "Misc. Reports", 319)])
        self.assertEqual(picked, {})

    def test_a_unique_label_is_still_tracked_so_a_real_shift_is_caught(self):
        # the NMBA defect the canary exists for: a genuinely unique button that moved 670px
        before = self._select([("BUTTON", "Take the pledge", 1171)])
        after = self._select([("BUTTON", "Take the pledge", 1841)])
        moved = [k for k in before if abs(after[k] - before[k]) > 2]
        self.assertEqual(moved, ["BUTTON|Take the pledge"])

    def test_three_occurrences_are_dropped_too(self):
        self.assertEqual(self._select([("A", "Reports", 1), ("A", "Reports", 2),
                                       ("H2", "Reports", 3)]), {})


# ---------------------------------------------------------------------------------------------
class TheGeneratedStandardMustBeReproducible(unittest.TestCase):
    """A generated artefact that differs from itself cannot have a staleness gate.

    `check:house-standard` was permanently red on a file it had just written, for two reasons —
    one in the generator and one in the comparison, and both are the same mistake in different
    clothes: comparing things that are not the same kind.

    1. `nearest()` picked between EQUIDISTANT contract colours by dict order, so #dcdee1 and
       #dcdee2 swapped between runs over identical inputs.
    2. `build()` returns dicts keyed by FLOAT (radii, font sizes). `sort_keys` orders those
       numerically — 8.0, 12.0, 999.0 — while the same dict reloaded from JSON has string keys
       and sorts lexically — "12.0", "8.0", "999.0". The two dumps differed on ordering alone,
       identical in length and content.
    """

    def test_ties_break_on_the_value_so_the_answer_never_depends_on_dict_order(self):
        import importlib.util, os as _os
        here = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
        spec = importlib.util.spec_from_file_location(
            "derive_mod", _os.path.join(here, "house", "derive.py"))
        D = importlib.util.module_from_spec(spec); spec.loader.exec_module(D)
        # two contract colours exactly as near to the probe
        a = D.nearest("#dcdee0", ["#dcdee1", "#dcdee2"])
        b = D.nearest("#dcdee0", ["#dcdee2", "#dcdee1"])
        self.assertEqual(a, b, "the same inputs in a different order must give the same answer")
        self.assertEqual(a[0], "#dcdee1", "the tie breaks on the sorted value")

    def test_float_keyed_dicts_compare_equal_only_after_a_json_round_trip(self):
        # the exact shape that made two identical standards look different
        fresh = {"radii": {8.0: "a", 12.0: "b", 999.0: "c"}}
        reloaded = json.loads(json.dumps(fresh))
        self.assertNotEqual(json.dumps(fresh, sort_keys=True),
                            json.dumps(reloaded, sort_keys=True),
                            "if this ever matches, the round trip in --check is redundant")
        self.assertEqual(json.dumps(json.loads(json.dumps(fresh)), sort_keys=True),
                         json.dumps(reloaded, sort_keys=True))


if __name__ == "__main__":
    unittest.main()
