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


class SyncFromExportColumns(unittest.TestCase):
    """A Drive export holds the GENERATED columns too, in whatever wording it was exported with.
    Syncing those back overwrites the current audit with a stale copy of itself."""

    def _books(self):
        import openpyxl
        head = ["ID", "Severity", "Issue (Design → Built)", "Status", "Assignee", "Date", "Notes"]
        g = openpyxl.Workbook(); g.active.title = "P"
        g["P"].append(head)
        g["P"].append(["F-1", "Major", "LAST MONTH'S WORDING", "Done", None, None, None])
        x = openpyxl.Workbook(); x.active.title = "P"
        x["P"].append(head)
        x["P"].append(["F-1", "Major", "this run's wording", "Open", None, None, None])
        import tempfile, os
        d = tempfile.mkdtemp()
        gp, xp = os.path.join(d, "g.xlsx"), os.path.join(d, "x.xlsx")
        g.save(gp); x.save(xp)
        return gp, xp

    def test_generated_columns_do_not_come_back(self):
        gp, xp = self._books()
        ch = T.sync_from_export(gp, xp, apply=False)
        self.assertEqual([(c[1], c[2], c[4]) for c in ch], [("F-1", "Status", "Done")])

    def test_columns_none_takes_everything(self):
        gp, xp = self._books()
        ch = T.sync_from_export(gp, xp, apply=False, columns=None)
        self.assertIn("Issue (Design → Built)", [c[2] for c in ch])


class WithdrawnRowsSurvive(unittest.TestCase):
    """NMB-SCREEN-016 was published, was in the tracker, and was then shown to be wrong. Deleting
    its row leaves anyone who triaged it with a dangling id and no answer."""

    MASTER = {"screens": [{"name": "S", "env": "dev", "findings": [
                  {"id": "ABC-SCREEN-001", "severity": "Major", "axis": "Layout",
                   "figma": "f", "live": "l", "fix": "x"}]}],
              "deferred": [{"id": "ABC-SCREEN-002", "title": "wrong claim",
                            "reason": "the button IS built"},
                           {"id": "-", "title": "no id", "reason": "not a finding"},
                           {"id": "design-file", "title": "note", "reason": "design defect"}]}

    def test_withdrawn_finding_keeps_its_row(self):
        rows = T.rows_from_master(self.MASTER)
        self.assertIn("ABC-SCREEN-002", rows)
        self.assertEqual(rows["ABC-SCREEN-002"]["Status"], "Withdrawn")
        self.assertIn("the button IS built", rows["ABC-SCREEN-002"]["Notes"])

    def test_non_finding_deferrals_get_no_row(self):
        rows = T.rows_from_master(self.MASTER)
        self.assertNotIn("-", rows)
        self.assertNotIn("design-file", rows)

    def test_a_live_finding_is_never_overwritten_by_a_deferral(self):
        m = dict(self.MASTER)
        m["deferred"] = [{"id": "ABC-SCREEN-001", "title": "x", "reason": "y"}]
        rows = T.rows_from_master(m)
        self.assertEqual(rows["ABC-SCREEN-001"]["Status"], "Open")


class WithdrawnBeatsAPreservedStatus(unittest.TestCase):
    """A row that was Open before it was withdrawn kept saying Open in the destination for ever.
    The Drive tracker told a developer NMB-SCREEN-016 was open work, when it had been withdrawn
    precisely because the finding was wrong."""

    def _ws(self, status):
        import openpyxl
        wb = openpyxl.Workbook(); wb.active.title = "P"
        wb["P"].append(["ID", "Severity", "Status", "Assignee", "Date", "Notes"])
        wb["P"].append(["F-1", "—", status, "Asha", None, "looking at it"])
        return wb["P"]

    def test_withdrawn_overrides_a_stale_open(self):
        want = {"F-1": {"ID": "F-1", "Severity": "—", "Status": "Withdrawn",
                        "Assignee": None, "Date": None, "Notes": "WITHDRAWN: it was wrong"}}
        merged, _, _ = T.merge_preserving_dev_columns(want, self._ws("Open"))
        self.assertEqual(merged["F-1"]["Status"], "Withdrawn")

    def test_withdrawn_overrides_even_a_real_triage_status(self):
        want = {"F-1": {"ID": "F-1", "Severity": "—", "Status": "Withdrawn",
                        "Assignee": None, "Date": None, "Notes": "WITHDRAWN: it was wrong"}}
        merged, _, _ = T.merge_preserving_dev_columns(want, self._ws("In progress"))
        self.assertEqual(merged["F-1"]["Status"], "Withdrawn")

    def test_the_other_dev_columns_are_still_preserved_on_a_withdrawn_row(self):
        want = {"F-1": {"ID": "F-1", "Severity": "—", "Status": "Withdrawn",
                        "Assignee": None, "Date": None, "Notes": "WITHDRAWN: it was wrong"}}
        merged, _, _ = T.merge_preserving_dev_columns(want, self._ws("Open"))
        self.assertEqual(merged["F-1"]["Assignee"], "Asha")

    def test_a_live_finding_still_keeps_the_destination_status(self):
        want = {"F-1": {"ID": "F-1", "Severity": "Major", "Status": "Open",
                        "Assignee": None, "Date": None, "Notes": ""}}
        merged, _, _ = T.merge_preserving_dev_columns(want, self._ws("Done"))
        self.assertEqual(merged["F-1"]["Status"], "Done")


class WithdrawalReasonSurvivesIntoNotes(unittest.TestCase):
    """The Drive copy showed 'env: dev' in Notes on two withdrawn rows, hiding WHY they were
    retracted — including NMB-SCREEN-016, withdrawn because the finding was wrong."""

    def _ws(self, note):
        import openpyxl
        wb = openpyxl.Workbook(); wb.active.title = "P"
        wb["P"].append(["ID", "Severity", "Status", "Assignee", "Date", "Notes"])
        wb["P"].append(["F-1", "—", "Open", None, None, note])
        return wb["P"]

    WANT = {"F-1": {"ID": "F-1", "Severity": "—", "Status": "Withdrawn",
                    "Assignee": None, "Date": None, "Notes": "WITHDRAWN: the button IS built"}}

    def test_generated_boilerplate_does_not_displace_the_reason(self):
        merged, _, _ = T.merge_preserving_dev_columns(dict(self.WANT), self._ws("env: dev"))
        self.assertEqual(merged["F-1"]["Notes"], "WITHDRAWN: the button IS built")

    def test_a_humans_note_is_appended_after_the_reason(self):
        merged, _, _ = T.merge_preserving_dev_columns(dict(self.WANT), self._ws("asked QA to recheck"))
        self.assertTrue(merged["F-1"]["Notes"].startswith("WITHDRAWN: the button IS built"))
        self.assertIn("asked QA to recheck", merged["F-1"]["Notes"])

    def test_a_live_row_still_keeps_its_note(self):
        want = {"F-1": {"ID": "F-1", "Severity": "Major", "Status": "Open",
                        "Assignee": None, "Date": None, "Notes": "env: dev"}}
        merged, _, _ = T.merge_preserving_dev_columns(want, self._ws("mine, keep it"))
        self.assertEqual(merged["F-1"]["Notes"], "mine, keep it")


class WithdrawalNoteDoesNotCompound(unittest.TestCase):
    """Appending the previous note on every rebuild re-appends our OWN output. One cell in the
    local workbook reached 8,850 characters before anyone looked at it."""

    def test_rebuilding_twice_does_not_grow_the_note(self):
        import openpyxl
        want = {"F-1": {"ID": "F-1", "Severity": "—", "Status": "Withdrawn",
                        "Assignee": None, "Date": None, "Notes": "WITHDRAWN: it was wrong"}}
        wb = openpyxl.Workbook(); wb.active.title = "P"
        wb["P"].append(["ID", "Severity", "Status", "Assignee", "Date", "Notes"])
        wb["P"].append(["F-1", "—", "Withdrawn", None, None, "WITHDRAWN: it was wrong"])
        first, _, _ = T.merge_preserving_dev_columns(dict(want), wb["P"])
        wb["P"].cell(row=2, column=6, value=first["F-1"]["Notes"])
        second, _, _ = T.merge_preserving_dev_columns(dict(want), wb["P"])
        self.assertEqual(second["F-1"]["Notes"], "WITHDRAWN: it was wrong")
        self.assertEqual(len(second["F-1"]["Notes"]), len(first["F-1"]["Notes"]))
