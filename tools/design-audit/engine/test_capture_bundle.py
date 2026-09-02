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


if __name__ == "__main__":
    unittest.main()
