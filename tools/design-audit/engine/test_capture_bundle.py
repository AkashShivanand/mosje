"""Unit tests for the capture bundle.

Run:  cd tools/design-audit && python3 -m unittest engine.test_capture_bundle -v
      (stdlib only — no pytest, no new deps)
"""
import os, sys, tempfile, unittest
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from engine import manifest as M


class ManifestLoad(unittest.TestCase):
    def _write(self, body):
        d = tempfile.mkdtemp()
        with open(os.path.join(d, "screen-manifest.yaml"), "w") as fh:
            fh.write(body)
        return d

    def test_missing_file_returns_none(self):
        self.assertIsNone(M.load(tempfile.mkdtemp()))

    def test_staleness_parses_day_suffix(self):
        d = self._write("version: 1\nenvironment: uat\nstalenessCeiling: 3d\n")
        self.assertEqual(M.staleness_seconds(M.load(d)), 3 * 86400)

    def test_staleness_defaults_to_14_days(self):
        d = self._write("version: 1\nenvironment: uat\n")
        self.assertEqual(M.staleness_seconds(M.load(d)), 14 * 86400)

    def test_bad_environment_is_an_error(self):
        errs = M.validate({"version": 1, "environment": "staging"})
        self.assertTrue(any("environment" in e for e in errs))

    def test_per_screen_volatiles_extend_global_ones(self):
        d = self._write(
            "version: 1\nenvironment: uat\n"
            "volatile:\n  - pattern: 'GLOBAL'\n"
            "screens:\n  - slug: DASH\n    route: /d\n    volatile: ['LOCAL']\n"
        )
        m = M.load(d)
        self.assertEqual(M.volatile_patterns(m, "DASH"), ["GLOBAL", "LOCAL"])
        self.assertEqual(M.volatile_patterns(m, "OTHER"), ["GLOBAL"])
from engine import bundle as B


def _row(text="Hello", **kw):
    base = dict(tag="p", role=None, text=text, fontFamily="Noto Sans", fontSize=16,
                fontWeight="400", lineHeight=24, color="rgb(0,0,0)", bg="rgba(0,0,0,0)",
                radius=0, padding=[0, 0, 0, 0], borderStyle="none", borderColor="rgb(0,0,0)",
                dsComponent=None, x=10, y=20, w=100, h=24, volatile=False)
    base.update(kw)
    return base


class Masking(unittest.TestCase):
    def test_pattern_match_is_masked(self):
        kept, n = B.mask_rows([_row("Updated 01/02/2026"), _row("Applications")],
                              [r"\d{2}/\d{2}/\d{4}"])
        self.assertEqual([r["text"] for r in kept], ["Applications"])
        self.assertEqual(n, 1)

    def test_selector_flagged_row_is_masked_without_any_pattern(self):
        kept, n = B.mask_rows([_row("1,204", volatile=True), _row("Total")], [])
        self.assertEqual([r["text"] for r in kept], ["Total"])
        self.assertEqual(n, 1)


class Hashing(unittest.TestCase):
    def test_identical_extractions_hash_identically(self):
        a, b = [_row()], [_row()]
        self.assertEqual(B.structure_hash(a), B.structure_hash(b))
        self.assertEqual(B.geometry_hash(a, 900), B.geometry_hash(b, 900))

    def test_colour_change_moves_structure_hash(self):
        base = [_row()]
        changed = [_row(color="rgb(255,0,0)")]
        self.assertNotEqual(B.structure_hash(base), B.structure_hash(changed))

    def test_inserted_row_moves_only_geometry_hash(self):
        """A table gaining a row shifts everything below it down. The design did not change,
        but every pin derived from the old geometry is now wrong."""
        before = [_row("A", y=100), _row("B", y=140)]
        after = [_row("A", y=100), _row("B", y=180)]
        self.assertEqual(B.structure_hash(before), B.structure_hash(after))
        self.assertNotEqual(B.geometry_hash(before, 900), B.geometry_hash(after, 940))

    def test_page_height_alone_moves_geometry_hash(self):
        rows = [_row()]
        self.assertNotEqual(B.geometry_hash(rows, 900), B.geometry_hash(rows, 1200))


if __name__ == "__main__":
    unittest.main()
