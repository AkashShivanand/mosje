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


class WithdrawnIsStillPublished(unittest.TestCase):
    """A withdrawn finding appears in the deferred section and, marked Withdrawn, in the tracker.
    Its id has not disappeared — and one that is genuinely deleted must FAIL, not warn."""

    def _m(self, ids, deferred=()):
        return {"screens": [{"findings": [{"id": i, "element": "t-" + i} for i in ids]}],
                "deferred": [{"id": i, "title": "x", "reason": "why " + i} for i in deferred]}

    def test_withdrawn_id_is_recognised(self):
        w = F.withdrawn(self._m(["A-1"], deferred=["A-2"]))
        self.assertEqual(list(w), ["A-2"])

    def test_placeholder_deferrals_are_not_ids(self):
        w = F.withdrawn({"deferred": [{"id": "-"}, {"id": "design-file"}, {"id": None}]})
        self.assertEqual(w, {})

    def test_a_retitled_id_is_still_a_violation(self):
        bad = F.check(self._m(["A-1"]), {"screens": [{"findings":
              [{"id": "A-1", "element": "something else"}]}]})
        self.assertEqual(len(bad), 1)
        self.assertEqual(bad[0]["id"], "A-1")

    def test_accepted_file_missing_is_empty_not_an_error(self):
        self.assertEqual(F.load_accepted("/nonexistent/accepted.json"), {})
