#!/usr/bin/env python3
"""The tracker's one non-negotiable: a push must never overwrite what the devs have set.

The case behind it: the Drive tracker had 43 NHAPOA findings marked Fixed that the repo copy had
never seen. A naive "write the audit's rows" would have set all 43 back to Open and nobody would
have noticed until someone re-fixed them.
"""
import os, sys, tempfile, unittest
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import openpyxl
import tracker as T


def _wb_with(rows):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "P"
    ws.append(T.HEAD)
    for r in rows:
        ws.append([r.get(h) for h in T.HEAD])
    return wb


class Merge(unittest.TestCase):
    def test_dev_status_survives_a_push(self):
        want = {"A-1": {"ID": "A-1", "Severity": "Major", "Status": "Open", "Notes": "env: dev"}}
        wb = _wb_with([{"ID": "A-1", "Severity": "Major", "Status": "Fixed",
                        "Assignee": "dev@x", "Notes": "done in sprint 4"}])
        merged, new, kept = T.merge_preserving_dev_columns(want, wb["P"])
        self.assertEqual("Fixed", merged["A-1"]["Status"])
        self.assertEqual("dev@x", merged["A-1"]["Assignee"])
        self.assertEqual("done in sprint 4", merged["A-1"]["Notes"])
        self.assertEqual((0, 1), (new, kept))

    def test_the_audit_columns_are_refreshed(self):
        want = {"A-1": {"ID": "A-1", "Severity": "Minor", "Recommended Fix (Dev)": "new wording",
                        "Status": "Open"}}
        wb = _wb_with([{"ID": "A-1", "Severity": "Major",
                        "Recommended Fix (Dev)": "old wording", "Status": "Fixed"}])
        merged, _, _ = T.merge_preserving_dev_columns(want, wb["P"])
        self.assertEqual("Minor", merged["A-1"]["Severity"])
        self.assertEqual("new wording", merged["A-1"]["Recommended Fix (Dev)"])
        self.assertEqual("Fixed", merged["A-1"]["Status"])

    def test_a_new_finding_arrives_open(self):
        want = {"A-2": {"ID": "A-2", "Severity": "Nit", "Status": "Open"}}
        wb = _wb_with([{"ID": "A-1", "Status": "Fixed"}])
        merged, new, kept = T.merge_preserving_dev_columns(want, wb["P"])
        self.assertEqual("Open", merged["A-2"]["Status"])
        self.assertEqual((1, 0), (new, kept))

    def test_a_first_push_needs_no_destination(self):
        want = {"A-1": {"ID": "A-1", "Status": "Open"}}
        merged, new, kept = T.merge_preserving_dev_columns(want, None)
        self.assertEqual((1, 0), (new, kept))
        self.assertEqual(want, merged)


class Rollup(unittest.TestCase):
    def _wb(self):
        wb = openpyxl.Workbook()
        ro = wb.active
        ro.title = "Rollup"
        ro.append(["Portal QC — Rollup"])
        ro.append(["Portal", "Total", "Blocker", "Major", "Minor", "Nit", "Open", "Fixed", "Verified"])
        ro.append(["Existing", 1, 0, 1, 0, 0, 1, 0, 0])
        return wb

    def test_a_new_portal_gets_a_row(self):
        wb = self._wb()
        at = T.ensure_rollup(wb, "NMBA")
        self.assertEqual(4, at)
        self.assertEqual("NMBA", wb["Rollup"].cell(row=4, column=1).value)
        self.assertIn("COUNTIF('NMBA'", wb["Rollup"].cell(row=4, column=3).value)

    def test_an_existing_portal_is_not_duplicated(self):
        wb = self._wb()
        self.assertEqual(3, T.ensure_rollup(wb, "Existing"))
        self.assertIsNone(wb["Rollup"].cell(row=4, column=1).value)


class SyncBack(unittest.TestCase):
    def test_only_differing_cells_come_back_and_nothing_is_removed(self):
        with tempfile.TemporaryDirectory() as d:
            src, dst = os.path.join(d, "g.xlsx"), os.path.join(d, "x.xlsx")
            _wb_with([{"ID": "A-1", "Status": "Fixed"}]).save(src)
            x = _wb_with([{"ID": "A-1", "Status": "Open"}])
            x.create_sheet("Coverage – P")          # a tab the export does not have
            x.save(dst)
            ch = T.sync_from_export(src, dst, apply=True)
            self.assertEqual([("P", "A-1", "Status", "Open", "Fixed")], ch)
            back = openpyxl.load_workbook(dst)
            self.assertIn("Coverage – P", back.sheetnames)
            self.assertEqual("Fixed", back["P"].cell(row=2, column=9).value)


if __name__ == "__main__":
    unittest.main(verbosity=2)
