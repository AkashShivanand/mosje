"""Regression gates for build_ledger()'s design<->build pairing.

Run:  cd tools/design-audit && python3 -m unittest engine.test_analyze -v
      (stdlib only — no pytest, no new deps)

These lock down a real defect found in committed output, per the ruleset's running principle:
"escalate any mechanizable mistake into a gate ... wrong pairing -> cross-check".

The bug: a route's last path segment distinguishes screens within a role ("/admin/dashboard" ->
"dashboard"), but a landing route is literally "/", whose last segment is "". The key collapsed to
the bare role, so no home frame could key-match its own capture. The role-blind substring fallback
then grabbed SOME other role's capture and still reported MAPPED. Observed in the wild:

  · NHAPOA  Citizen/Dashboard/01-Home (route "/") -> DISTRICT-OFFICER-DISTRICT-OFFICER-DASHBOARD
            ...reported MAPPED. A citizen design diffed against a district-officer screenshot.
  · SCW     Public/Home (route "/") -> UNMAPPED, while its PUBLIC-HOME capture sat in EXTRA.

A cross-role pairing is worse than an UNMAPPED: UNMAPPED fails loudly, a false MAPPED is a
confident wrong answer that everything downstream trusts.
"""
import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import ONLY build_ledger at module scope. It exists in every version of the engine, so the
# BuildLedgerPairing tests below fail on a real ASSERTION if the pairing logic ever regresses.
# Importing the new helpers here instead would make a regressed engine fail at import time —
# which proves only that symbols moved, not that behaviour broke. The helper-level tests import
# them lazily for the same reason.
from engine.analyze import build_ledger


def _cap(role, route, slug):
    return {"role": role, "route": route, "slug": slug}


def _frame(name, node="1:1", heading=None):
    return {"node_id": node, "name": name, "heading": heading}


class _Tmp:
    """build_ledger writes coverage-ledger.json to paths['out'], so give it a real dir.

    captures_live is intentionally empty: _bhead() then returns "" and the optional MISMAP
    heading check is skipped, isolating these tests to PAIRING, which is what regressed.
    """

    def __enter__(self):
        self.d = tempfile.mkdtemp(prefix="ledger-test-")
        return {"project": self.d, "captures_live": self.d, "out": self.d}

    def __exit__(self, *exc):
        import shutil

        shutil.rmtree(self.d, ignore_errors=True)
        return False


def _row(ledger, frame):
    return next(r for r in ledger["rows"] if r.get("frame") == frame)


class ScreenSeg(unittest.TestCase):
    def setUp(self):
        from engine.analyze import HOME_SEG, _screen_seg
        self.HOME_SEG, self._screen_seg = HOME_SEG, _screen_seg

    def test_root_route_is_not_empty(self):
        # The whole bug in one assert: "" would collapse the key to the bare role.
        self.assertEqual(self._screen_seg("/"), self.HOME_SEG)
        self.assertEqual(self._screen_seg(""), self.HOME_SEG)

    def test_normal_route_uses_last_segment(self):
        self.assertEqual(self._screen_seg("/admin/dashboard"), "dashboard")
        self.assertEqual(self._screen_seg("/our-services/scheme"), "scheme")

    def test_trailing_slash_does_not_collapse(self):
        # "/events/".split("/")[-1] is "" -> would have silently become a home key.
        self.assertEqual(self._screen_seg("/events/"), "events")


class IsHomeFrame(unittest.TestCase):
    def setUp(self):
        from engine.analyze import _is_home_frame
        self._is_home_frame = _is_home_frame

    def test_home_marker_in_any_segment(self):
        # NHAPOA's marker is in the STATE segment, not the screen segment.
        self.assertTrue(self._is_home_frame("Citizen/Dashboard/01-Home"))
        self.assertTrue(self._is_home_frame("Public/Home/default"))

    def test_non_home_frames(self):
        self.assertFalse(self._is_home_frame("Admin/Events/Add"))
        self.assertFalse(self._is_home_frame("Global/Chrome/default"))


class BuildLedgerPairing(unittest.TestCase):
    def test_home_frame_pairs_with_its_own_root_capture(self):
        """SCW: Public/Home (route '/') must MAP to PUBLIC-HOME, not sit in EXTRA."""
        with _Tmp() as paths:
            led = build_ledger({}, [_frame("Public/Home/default")],
                               [_cap("public", "/", "PUBLIC-HOME")], paths)
        row = _row(led, "Public/Home/default")
        self.assertEqual(row["status"], "MAPPED")
        self.assertEqual(row["live_capture"], "PUBLIC-HOME")
        self.assertEqual(led["stats"]["extra_build_only"], 0)

    def test_landing_frame_named_dashboard_pairs_by_role(self):
        """NHAPOA: Citizen/Dashboard/01-Home (route '/') — screen segment is 'dashboard',
        so only the home marker + role can pair it."""
        with _Tmp() as paths:
            led = build_ledger({}, [_frame("Citizen/Dashboard/01-Home")],
                               [_cap("citizen", "/", "CITIZEN-HOME")], paths)
        self.assertEqual(_row(led, "Citizen/Dashboard/01-Home")["live_capture"], "CITIZEN-HOME")

    def test_never_pairs_across_roles(self):
        """THE regression: with no citizen capture at all, the citizen frame must go UNMAPPED —
        it must NOT steal the district-officer dashboard and report MAPPED."""
        with _Tmp() as paths:
            led = build_ledger({}, [_frame("Citizen/Dashboard/01-Home")],
                               [_cap("district-officer", "/district-officer/dashboard",
                                     "DISTRICT-OFFICER-DISTRICT-OFFICER-DASHBOARD")], paths)
        row = _row(led, "Citizen/Dashboard/01-Home")
        self.assertEqual(row["status"], "UNMAPPED")
        self.assertIsNone(row["live_capture"])

    def test_two_roles_each_keep_their_own_home(self):
        """Both roles have a root capture; neither may take the other's."""
        with _Tmp() as paths:
            led = build_ledger({}, [_frame("Citizen/Dashboard/01-Home", "1:1"),
                                    _frame("Admin/Dashboard/01-Home", "2:2")],
                               [_cap("citizen", "/", "CITIZEN-HOME"),
                                _cap("admin", "/", "ADMIN-HOME")], paths)
        self.assertEqual(_row(led, "Citizen/Dashboard/01-Home")["live_capture"], "CITIZEN-HOME")
        self.assertEqual(_row(led, "Admin/Dashboard/01-Home")["live_capture"], "ADMIN-HOME")

    def test_exact_screen_match_still_wins(self):
        """The home fallback must not hijack a frame that already matches its own route."""
        with _Tmp() as paths:
            led = build_ledger({}, [_frame("Admin/Dashboard/01-Home")],
                               [_cap("admin", "/admin/dashboard", "ADMIN-DASHBOARD"),
                                _cap("admin", "/", "ADMIN-HOME")], paths)
        self.assertEqual(_row(led, "Admin/Dashboard/01-Home")["live_capture"], "ADMIN-DASHBOARD")

    def test_role_prefix_does_not_bleed(self):
        """Tuple keys, not concatenation: 'state' must not match 'stateauthority'."""
        with _Tmp() as paths:
            led = build_ledger({}, [_frame("State/Cases/01-Home")],
                               [_cap("state-authority", "/state-authority/cases", "SA-CASES")], paths)
        self.assertEqual(_row(led, "State/Cases/01-Home")["status"], "UNMAPPED")

    def test_design_only_frame_is_never_auto_paired(self):
        """Pre-existing contract: _designOnly declares 'no build exists yet'."""
        fr = _frame("Public/Home/default")
        fr["_designOnly"] = True
        with _Tmp() as paths:
            led = build_ledger({}, [fr], [_cap("public", "/", "PUBLIC-HOME")], paths)
        self.assertEqual(_row(led, "Public/Home/default")["status"], "DESIGN-ONLY")


if __name__ == "__main__":
    unittest.main()
