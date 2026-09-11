"""Unit tests for the published-ID freeze.

Run:  cd tools/design-audit && python3 -m unittest engine.test_frozen_ids -v
"""
import os, sys, unittest
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from engine import frozen_ids as F


def master(pairs):
    return {"screens": [{"slug": "S", "findings": [{"id": i, "element": t} for i, t in pairs]}]}


class Freeze(unittest.TestCase):
    def test_unchanged_is_clean(self):
        m = master([("X-001", "a"), ("X-002", "b")])
        self.assertEqual(F.check(m, m), [])

    def test_appending_a_finding_is_allowed(self):
        a = master([("X-001", "a")])
        b = master([("X-001", "a"), ("X-002", "new")])
        self.assertEqual(F.check(a, b), [])

    def test_an_id_that_changes_meaning_is_a_violation(self):
        """The NMBA defect: a finding inserted mid-list shunts every later id along by one."""
        a = master([("X-001", "a"), ("X-002", "b"), ("X-003", "c")])
        b = master([("X-001", "a"), ("X-002", "inserted"), ("X-003", "b"), ("X-004", "c")])
        bad = F.check(a, b)
        self.assertEqual([v["id"] for v in bad], ["X-002", "X-003"])
        self.assertEqual(bad[0]["was"], "b")
        self.assertEqual(bad[0]["now"], "inserted")

    def test_reordering_without_renumbering_is_clean(self):
        a = master([("X-001", "a"), ("X-002", "b")])
        b = master([("X-002", "b"), ("X-001", "a")])
        self.assertEqual(F.check(a, b), [])

    def test_a_removed_id_is_not_a_remap(self):
        # Disappearing is reported by the caller, not by check() - different problem, different fix.
        a = master([("X-001", "a"), ("X-002", "b")])
        b = master([("X-001", "a")])
        self.assertEqual(F.check(a, b), [])


if __name__ == "__main__":
    unittest.main()
