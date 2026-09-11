#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Every case here is a real defect from the NMBA run of 2026-09-11 that a HUMAN caught.

Each test asserts two things: the gate fires on what was actually published, and it stays quiet
on the corrected version — so no gate can be satisfied by making a finding vaguer.

    python3 -m unittest engine.test_integrity          (from tools/design-audit)
"""
import os, sys, unittest
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import integrity as I


# ---------------------------------------------------------------------------------------------
class AbsenceClaims(unittest.TestCase):
    # NMB-SCREEN-016, published and wrong: the button was there all along, at x1171.
    PUBLISHED = {"id": "NMB-SCREEN-016", "slug": "home",
                 "title": "The pledge banner loses its call to action",
                 "build": "The banner renders the heading and the sentence, but the "
                          "'Take the Pledge' button is absent."}

    def test_the_claim_that_shipped_is_caught(self):
        self.assertEqual(len(I.gate_absence_claims([self.PUBLISHED])), 1)

    def test_a_live_checked_absence_passes(self):
        f = dict(self.PUBLISHED)
        f["build"] += " Checked in the DOM on the live build, 2026-09-11."
        self.assertEqual(I.gate_absence_claims([f]), [])

    def test_the_explicit_flag_also_passes(self):
        f = dict(self.PUBLISHED, _liveCheck=True)
        self.assertEqual(I.gate_absence_claims([f]), [])

    def test_a_difference_claim_is_not_an_absence_claim(self):
        f = {"id": "NMB-GLOBAL-001", "slug": "home",
             "title": "The page ground is off-white, not white",
             "build": "The ground renders #F9FAFB where the design draws #FFFFFF."}
        self.assertEqual(I.gate_absence_claims([f]), [])

    def test_every_phrasing_of_absence_is_covered(self):
        # each of these shipped at least once across the six portals
        for phrase in ["the second button is missing",
                       "the service tag pills are not rendered at all",
                       "the card carries no border",
                       "the strip has lost its ellipsis",
                       "there is no help text under the field",
                       "the icon was removed"]:
            with self.subTest(phrase=phrase):
                out = I.gate_absence_claims([{"id": "X-1", "slug": "s", "title": "t",
                                              "build": phrase}])
                self.assertEqual(len(out), 1, phrase)


# ---------------------------------------------------------------------------------------------
class QuotedBuildColours(unittest.TestCase):
    ROWS = [{"text": "Edit", "color": "rgb(237, 133, 37)"},          # #ED8525, the served value
            {"text": "Save", "bg": "rgb(0, 51, 102)"}]               # #003366
    INVENTORY = {"#ED8525": 3, "#003366": 12}

    def rows_for(self, slug):
        return self.ROWS if slug == "list" else None

    def inv_for(self, slug):
        return self.INVENTORY if slug == "list" else None

    def gate(self, f, warn=None):
        return I.gate_quoted_build_colours([f], self.rows_for, warn, self.inv_for)

    def test_a_sampled_colour_is_caught(self):
        # GLOBAL-005 as published: #E08020 is the anti-aliased average, not a value in the build
        f = {"id": "NMB-GLOBAL-005", "slug": "list",
             "build": "The edit glyph is drawn #E08020."}
        out = self.gate(f)
        self.assertEqual(len(out), 1)
        self.assertIn("#E08020", out[0])

    def test_the_corrected_colour_passes(self):
        f = {"id": "NMB-GLOBAL-005", "slug": "list",
             "build": "The edit glyph is drawn #ED8525."}
        self.assertEqual(self.gate(f), [])

    def test_case_does_not_matter(self):
        f = {"id": "X", "slug": "list", "build": "drawn #ed8525 on #003366."}
        self.assertEqual(self.gate(f), [])

    def test_a_screen_with_no_evidence_is_skipped_not_guessed(self):
        f = {"id": "X", "slug": "unknown", "build": "drawn #123456."}
        warn = []
        self.assertEqual(self.gate(f, warn), [])
        self.assertEqual(warn, [])

    def test_a_declared_exception_passes(self):
        # a colour legitimately read from the served SVG rather than a rendered element
        f = {"id": "X", "slug": "list", "build": "drawn #E08020.", "_colourWhy": "read from the SVG"}
        self.assertEqual(self.gate(f), [])


# ---------------------------------------------------------------------------------------------
class AnchorAmbiguity(unittest.TestCase):
    ROWS = [{"text": "Nasha Mukti Mitr"}, {"text": "Nasha Mukti Mitr Login"}, {"text": "Dashboard"}]

    def rows_for(self, slug):
        return self.ROWS if slug == "admin-home" else None

    def test_the_swallowed_label_is_caught(self):
        # NMB-SCREEN-027: the sidebar label claimed the masthead's longer one, 1100px away
        out = I.gate_anchor_ambiguity(
            {"NMB-SCREEN-027": {"slug": "admin-home", "text": "Nasha Mukti Mitr"}}, self.rows_for)
        self.assertEqual(len(out), 1)
        self.assertIn("Nasha Mukti Mitr Login", out[0])

    def test_the_full_string_passes(self):
        out = I.gate_anchor_ambiguity(
            {"NMB-SCREEN-027": {"slug": "admin-home", "text": "Nasha Mukti Mitr Login"}},
            self.rows_for)
        self.assertEqual(out, [])

    def test_an_unambiguous_anchor_passes(self):
        out = I.gate_anchor_ambiguity(
            {"X": {"slug": "admin-home", "text": "Dashboard"}}, self.rows_for)
        self.assertEqual(out, [])

    def test_a_soft_line_break_does_not_look_like_a_difference(self):
        # Figma writes U+2028; the extraction writes a space. Same string, and the gate knows it.
        rows = [{"text": "Nasha Mukti Mitr"}]
        out = I.gate_anchor_ambiguity({"X": {"slug": "s", "text": "Nasha Mukti Mitr"}},
                                      lambda s: rows)
        self.assertEqual(out, [])


# ---------------------------------------------------------------------------------------------
class ReviewSheetPins(unittest.TestCase):
    FINDINGS = [{"id": "A-1", "slug": "home"}, {"id": "A-2", "slug": "home"},
                {"id": "G-1"}]                                  # global, no screen: never pinned

    def test_an_unpinned_anchored_finding_is_caught(self):
        rows = [{"slug": "home", "pins": [{"id": "A-1", "dxPct": 40, "bxPct": 41}]}]
        out = I.gate_review_sheet_pins(rows, self.FINDINGS)
        self.assertEqual(len(out), 1)
        self.assertIn("A-2", out[0])

    def test_a_fully_pinned_sheet_passes(self):
        rows = [{"slug": "home", "pins": [{"id": "A-1", "dxPct": 40}, {"id": "A-2", "bxPct": 12}]}]
        self.assertEqual(I.gate_review_sheet_pins(rows, self.FINDINGS), [])

    def test_a_marker_off_the_picture_is_caught(self):
        # NMB-SCREEN-027 again, in its other form: x1478 on a 1440 image is 102.6%
        rows = [{"slug": "home", "pins": [{"id": "A-1", "bxPct": 102.6},
                                          {"id": "A-2", "dxPct": 50}]}]
        out = I.gate_review_sheet_pins(rows, self.FINDINGS)
        self.assertEqual(len(out), 1)
        self.assertIn("102.6", out[0])

    def test_a_deliberately_global_finding_is_not_asked_for_a_pin(self):
        # NMBA's filters note: one sentence for every filtered screen, by instruction, with no
        # single element to point at. Its "slug" is a pseudo-screen named after itself.
        findings = self.FINDINGS + [{"id": "G-31", "slug": "NMB-GLOBAL-031"}]
        rows = [{"slug": "home", "pins": [{"id": "A-1"}, {"id": "A-2"}]}]
        anchors = {"A-1": {}, "A-2": {}}                    # G-31 has no anchor
        self.assertEqual(I.gate_review_sheet_pins(rows, findings, anchors), [])

    def test_an_anchored_finding_is_still_asked_for_one(self):
        findings = self.FINDINGS + [{"id": "G-31", "slug": "NMB-GLOBAL-031"}]
        rows = [{"slug": "home", "pins": [{"id": "A-1"}, {"id": "A-2"}]}]
        out = I.gate_review_sheet_pins(rows, findings, {"A-1": {}, "A-2": {}, "G-31": {}})
        self.assertEqual(len(out), 1)
        self.assertIn("G-31", out[0])

    def test_zero_and_one_hundred_are_inside_the_picture(self):
        rows = [{"slug": "home", "pins": [{"id": "A-1", "dxPct": 0}, {"id": "A-2", "bxPct": 100}]}]
        self.assertEqual(I.gate_review_sheet_pins(rows, self.FINDINGS), [])


# ---------------------------------------------------------------------------------------------
class ReportMatchesMaster(unittest.TestCase):
    MASTER = [{"id": "NMB-SCREEN-030", "title": "The row actions are icons where the design "
                                                "draws buttons", "sev": "Major"},
              {"id": "NMB-SCREEN-050", "title": "A draft document is marked in the portal's "
                                                "error red", "sev": "Minor"}]

    def test_a_card_carrying_another_findings_text_is_caught(self):
        # exactly what shipped: 050's card rendered 030's title and severity under 050's id
        cards = [{"id": "NMB-SCREEN-030", "shownId": "NMB-SCREEN-030",
                  "title": "The row actions are icons where the design draws buttons",
                  "severity": "Major"},
                 {"id": "NMB-SCREEN-050", "shownId": "NMB-SCREEN-050",
                  "title": "The row actions are icons where the design draws buttons",
                  "severity": "Major"}]
        out = I.gate_report_matches_master(cards, self.MASTER)
        self.assertEqual(len(out), 2)                    # wrong title AND wrong severity
        self.assertTrue(all("NMB-SCREEN-050" in m for m in out))

    def test_an_id_only_check_would_have_passed_that_card(self):
        # the reason this gate compares the title: the ids were right on every corrupted card
        cards = [{"id": "NMB-SCREEN-050", "shownId": "NMB-SCREEN-050",
                  "title": "The row actions are icons where the design draws buttons",
                  "severity": "Minor"}]
        ids_only = [c for c in I.gate_report_matches_master(cards, self.MASTER)
                    if "shows the id" in c]
        self.assertEqual(ids_only, [])                   # id check clean…
        self.assertTrue(I.gate_report_matches_master(cards, self.MASTER))   # …gate still fails

    def test_the_repaired_report_passes(self):
        cards = [{"id": f["id"], "shownId": f["id"], "title": f["title"], "severity": f["sev"]}
                 for f in self.MASTER]
        self.assertEqual(I.gate_report_matches_master(cards, self.MASTER), [])

    def test_a_truncated_card_title_still_passes(self):
        # cards elide long titles; a prefix of the master's title is the card doing its job
        cards = [{"id": "NMB-SCREEN-050", "shownId": "NMB-SCREEN-050",
                  "title": "A draft document is marked", "severity": "Minor"},
                 {"id": "NMB-SCREEN-030", "shownId": "NMB-SCREEN-030",
                  "title": "The row actions are icons where the design draws buttons",
                  "severity": "Major"}]
        self.assertEqual(I.gate_report_matches_master(cards, self.MASTER), [])

    def test_a_missing_card_is_caught(self):
        cards = [{"id": "NMB-SCREEN-030", "shownId": "NMB-SCREEN-030",
                  "title": "The row actions are icons where the design draws buttons",
                  "severity": "Major"}]
        out = I.gate_report_matches_master(cards, self.MASTER)
        self.assertEqual(len(out), 1)
        self.assertIn("no card", out[0])


# ---------------------------------------------------------------------------------------------
class CaptureLayout(unittest.TestCase):
    def test_the_harness_defect_is_caught(self):
        # the citizen home page grew 1440 -> 2050 and pushed the pledge button to x1841
        screens = [{"slug": "home", "layoutShift": [
            {"text": "Take the Pledge", "before": 1171, "after": 1841}]}]
        out = I.gate_capture_layout(screens)
        self.assertEqual(len(out), 1)
        self.assertIn("1841", out[0])

    def test_a_clean_capture_passes(self):
        self.assertEqual(I.gate_capture_layout([{"slug": "home", "layoutShift": []}]), [])

    def test_a_capture_with_no_canary_recorded_passes(self):
        # an older bundle predates the canary; it must not fail every screen retroactively
        self.assertEqual(I.gate_capture_layout([{"slug": "home"}]), [])


# ---------------------------------------------------------------------------------------------
class TrackerParity(unittest.TestCase):
    LOCAL = {"NMB-SCREEN-016": {"Issue": "The pledge banner loses its call to action",
                                "Status": "Withdrawn",
                                "Notes": "WITHDRAWN: the button is present at x1171"},
             "NMB-SCREEN-030": {"Issue": "The row actions are icons", "Status": "Open",
                                "Notes": ""}}

    def test_the_drive_copy_calling_a_withdrawn_finding_open_is_caught(self):
        remote = {"NMB-SCREEN-016": dict(self.LOCAL["NMB-SCREEN-016"], Status="Open",
                                         Notes="env: dev"),
                  "NMB-SCREEN-030": dict(self.LOCAL["NMB-SCREEN-030"])}
        rep = I.tracker_parity(self.LOCAL, remote)
        self.assertEqual(rep["generated_differs"], [])            # Status/Notes are dev-owned…
        self.assertEqual(len(rep["dev_differs"]), 2)              # …so they surface here

    def test_a_generated_column_that_diverged_is_a_failure(self):
        # two writers worded the issue column differently; row counts and ids matched
        remote = {"NMB-SCREEN-016": dict(self.LOCAL["NMB-SCREEN-016"],
                                         Issue="Pledge banner CTA missing"),
                  "NMB-SCREEN-030": dict(self.LOCAL["NMB-SCREEN-030"])}
        out = I.gate_tracker_parity(self.LOCAL, remote)
        self.assertEqual(len(out), 1)
        self.assertIn("Issue", out[0])

    def test_byte_identical_tabs_pass(self):
        self.assertEqual(I.gate_tracker_parity(self.LOCAL, dict(self.LOCAL)), [])

    def test_a_row_on_one_side_only_is_caught(self):
        remote = {"NMB-SCREEN-030": dict(self.LOCAL["NMB-SCREEN-030"])}
        out = I.gate_tracker_parity(self.LOCAL, remote)
        self.assertEqual(len(out), 1)
        self.assertIn("NMB-SCREEN-016", out[0])

    def test_a_human_editing_the_shared_copy_is_not_a_failure(self):
        remote = {"NMB-SCREEN-016": dict(self.LOCAL["NMB-SCREEN-016"]),
                  "NMB-SCREEN-030": dict(self.LOCAL["NMB-SCREEN-030"], Status="In progress",
                                         Assignee="dev")}
        self.assertEqual(I.gate_tracker_parity(self.LOCAL, remote), [])


if __name__ == "__main__":
    unittest.main()


# ---------------------------------------------------------------------------------------------
class ColourParsing(unittest.TestCase):
    """The gate above is only as good as its reading of the extraction's own colour values."""

    def test_oklch_is_decoded_not_scraped(self):
        # Tailwind v4 emits oklch; a naive \\d+ scrape turned slate-300 into '#0036800'
        self.assertEqual(I.colours_in("oklch(0.929 0.013 255.508)"), ["#E2E8F0"])   # slate-200
        self.assertEqual(I.colours_in("oklch(1 0 0)"), ["#FFFFFF"])
        self.assertEqual(I.colours_in("oklch(0% 0 0)"), ["#000000"])

    def test_a_four_sided_border_yields_every_side(self):
        # reading only the first hides the odd side out, which is the side a finding is about
        self.assertEqual(I.colours_in("rgb(0, 120, 168) rgb(0, 120, 168) rgb(204, 204, 204)"),
                         ["#0078A8", "#0078A8", "#CCCCCC"])

    def test_rgba_and_plain_hex_both_read(self):
        self.assertEqual(I.colours_in("rgba(0, 51, 102, 0.5)"), ["#003366"])
        self.assertEqual(I.colours_in("#ed8525"), ["#ED8525"])

    def test_an_unreadable_value_yields_nothing_rather_than_a_guess(self):
        self.assertEqual(I.colours_in("transparent"), [])
        self.assertEqual(I.colours_in(None), [])


class ColourNearMiss(unittest.TestCase):
    ROWS = [{"borderColor": "rgb(229, 231, 235)"},          # #E5E7EB — a row, i.e. text/controls
            {"color": "rgb(237, 133, 37)"}]                 # #ED8525
    # what the page actually paints, from capture.py's COLOR_INVENTORY_JS
    INVENTORY = {"#E5E7EB": 16, "#ED8525": 4, "#FFFFFF": 15}

    def rows_for(self, slug):
        return self.ROWS

    def inv_for(self, slug):
        return self.INVENTORY

    def test_a_sampled_near_miss_fails_when_the_inventory_is_complete(self):
        # both real cases: the quoted value is a few points off one the build genuinely paints
        for quoted in ("#E5EAF2", "#E08020"):
            with self.subTest(quoted=quoted):
                out = I.gate_quoted_build_colours(
                    [{"id": "X", "slug": "s", "build": f"a 1px {quoted} edge"}],
                    self.rows_for, None, self.inv_for)
                self.assertEqual(len(out), 1)
                self.assertIn("pixel sample", out[0])

    def test_the_rows_alone_may_never_convict(self):
        # NMB-SCREEN-046, the regression this whole redesign exists for. The activity card's
        # #E5EAF2 edge is real — hard-coded in the class on nine cards — and invisible to the
        # element rows, which carry no containers. The first version of this gate failed it
        # because #E5E7EB, used on 16 OTHER elements, is 7 points away.
        warn = []
        out = I.gate_quoted_build_colours(
            [{"id": "NMB-SCREEN-046", "slug": "PUBLIC-ACTIVITIES",
              "build": "The card is 329x351 at radius 8 with a 1px #E5EAF2 edge"}],
            self.rows_for, warn)
        self.assertEqual(out, [])
        self.assertEqual(len(warn), 1)
        self.assertIn("no colour inventory", warn[0])

    def test_and_passes_outright_once_the_inventory_sees_it(self):
        inv = dict(self.INVENTORY, **{"#E5EAF2": 9})        # the nine activity cards
        warn = []
        out = I.gate_quoted_build_colours(
            [{"id": "NMB-SCREEN-046", "slug": "PUBLIC-ACTIVITIES",
              "build": "a 1px #E5EAF2 edge"}], self.rows_for, warn, lambda s: inv)
        self.assertEqual((out, warn), ([], []))

    def test_a_colour_nowhere_near_anything_warns_instead_of_failing(self):
        warn = []
        out = I.gate_quoted_build_colours(
            [{"id": "X", "slug": "s", "build": "the panel is #112233"}],
            self.rows_for, warn, self.inv_for)
        self.assertEqual(out, [])
        self.assertEqual(len(warn), 1)

    def test_a_design_owned_hex_in_the_build_paragraph_is_not_judged(self):
        # good writing names the design's value while reporting the build's; three of the four
        # first-run failures were this
        warn = []
        f = {"id": "X", "slug": "s",
             "build": "'Published' is #ED8525, a near-miss of the design's #27682A."}
        self.assertEqual(
            I.gate_quoted_build_colours([f], self.rows_for, warn, self.inv_for), [])
        self.assertEqual(warn, [])


class Ratchet(unittest.TestCase):
    BASE = {"NMB-GLOBAL-002": "checked live on 2026-09-11; the published text does not say so"}

    def test_a_baselined_failure_is_debt_not_a_failure(self):
        new, owed, stale = I.ratchet(["NMB-GLOBAL-002: claims something is absent"], self.BASE)
        self.assertEqual(new, [])
        self.assertEqual(owed, ["NMB-GLOBAL-002"])

    def test_a_new_failure_still_fails(self):
        new, owed, stale = I.ratchet(
            ["NMB-GLOBAL-002: claims something is absent",
             "NMB-SCREEN-099: claims something is absent"], self.BASE)
        self.assertEqual(len(new), 1)
        self.assertIn("NMB-SCREEN-099", new[0])

    def test_a_repaired_entry_must_be_removed_from_the_baseline(self):
        # without this the ratchet is a suppression list, and one repair pays for another's
        # regression without anyone seeing it
        new, owed, stale = I.ratchet([], self.BASE)
        self.assertEqual(stale, ["NMB-GLOBAL-002"])

    def test_a_message_with_no_id_is_kept_whole(self):
        new, owed, stale = I.ratchet(["the capture bundle is unreadable"], {})
        self.assertEqual(new, ["the capture bundle is unreadable"])
