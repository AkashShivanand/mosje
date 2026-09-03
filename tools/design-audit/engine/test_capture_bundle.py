"""Unit tests for the capture bundle.

Run:  cd tools/design-audit && python3 -m unittest engine.test_capture_bundle -v
      (stdlib only — no pytest, no new deps)
"""
import datetime, os, re, sys, tempfile, unittest, unittest.mock
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

    def test_non_json_native_value_raises_type_error(self):
        """Non-serializable values must raise TypeError, not be silently coerced to str.
        A silent coercion would embed the process's memory address, breaking determinism."""
        rows = [_row(text=object())]
        with self.assertRaises(TypeError):
            B.structure_hash(rows)


class BundleIO(unittest.TestCase):
    def _paths(self):
        d = tempfile.mkdtemp()
        out = os.path.join(d, "out")
        os.makedirs(out, exist_ok=True)
        return {"project": d, "out": out}

    def test_load_returns_none_when_absent(self):
        self.assertIsNone(B.load_bundle(self._paths()))

    def test_write_then_load_round_trips(self):
        p = self._paths()
        b = B.new_bundle("nhapoa", "uat", "abc123")
        B.write_bundle(p, b)
        self.assertEqual(B.load_bundle(p)["project"], "nhapoa")
        self.assertEqual(B.load_bundle(p)["version"], B.BUNDLE_VERSION)

    def test_upsert_replaces_by_slug_and_preserves_order(self):
        b = B.new_bundle("p", "dev", "sha")
        first = B.screen_entry(slug="A", role="r", route="/a", url="u", reached_by="nav",
                               png="a.png", png_sha256="0", png_h=10, page_h=10,
                               truncated=False, rows_path="a.json", structure="s1",
                               geometry="g1", masked=0, total=5, fields=[], wizard=None,
                               captured_at="2026-09-02T00:00:00+05:30")
        second = dict(first, slug="B")
        B.upsert_screen(b, first)
        B.upsert_screen(b, second)
        B.upsert_screen(b, dict(first, structureHash="s2"))
        self.assertEqual([s["slug"] for s in b["screens"]], ["A", "B"])
        self.assertEqual(B.find_screen(b, "A")["structureHash"], "s2")


def _bundle(age_days=0, fp="main.aaaaaaaa.js"):
    when = datetime.datetime.now().astimezone() - datetime.timedelta(days=age_days)
    return {"version": 1, "project": "p", "environment": "uat",
            "capturedAt": when.isoformat(timespec="seconds"),
            "hosts": {"admin": {"base": "https://x.test", "buildFingerprint": fp}},
            "screens": [], "records": {}}


class Freshness(unittest.TestCase):
    CFG = {"live": {"roles": [{"name": "a", "base": "https://x.test"}]}}
    MAN = {"version": 1, "environment": "uat", "stalenessCeiling": "14d"}

    def test_no_bundle_means_full(self):
        self.assertEqual(B.resolve_freshness(None, self.MAN, self.CFG)["mode"], "full")

    def test_force_means_full_even_when_fresh(self):
        r = B.resolve_freshness(_bundle(), self.MAN, self.CFG, force=True)
        self.assertEqual(r["mode"], "full")

    def test_past_the_staleness_ceiling_means_full(self):
        r = B.resolve_freshness(_bundle(age_days=30), self.MAN, self.CFG)
        self.assertEqual(r["mode"], "full")
        self.assertIn("stale", r["reason"])

    def test_verify_flag_forces_the_per_screen_tier(self):
        r = B.resolve_freshness(_bundle(), self.MAN, self.CFG, verify=True,
                                _probe=lambda url: "main.aaaaaaaa.js")
        self.assertEqual(r["mode"], "verify")

    def test_matching_fingerprint_reuses_everything(self):
        r = B.resolve_freshness(_bundle(), self.MAN, self.CFG,
                                _probe=lambda url: "main.aaaaaaaa.js")
        self.assertEqual(r["mode"], "reuse-all")

    def test_moved_fingerprint_drops_to_verify_not_full(self):
        r = B.resolve_freshness(_bundle(), self.MAN, self.CFG,
                                _probe=lambda url: "main.zzzzzzzz.js")
        self.assertEqual(r["mode"], "verify")

    def test_unreachable_host_drops_to_verify(self):
        r = B.resolve_freshness(_bundle(), self.MAN, self.CFG, _probe=lambda url: None)
        self.assertEqual(r["mode"], "verify")

    def test_empty_bases_drops_to_verify_not_reuse(self):
        cfg = {"live": {"roles": []}}
        r = B.resolve_freshness(_bundle(), self.MAN, cfg, _probe=lambda url: "main.aaaaaaaa.js")
        self.assertEqual(r["mode"], "verify")
        self.assertIn("no host bases", r["reason"])

    def test_malformed_capturedAt_returns_full(self):
        b = _bundle()
        b["capturedAt"] = "not-a-date"
        r = B.resolve_freshness(b, self.MAN, self.CFG)
        self.assertEqual(r["mode"], "full")
        self.assertIn("unreadable", r["reason"])

    def test_timezone_naive_capturedAt_returns_full(self):
        b = _bundle()
        b["capturedAt"] = "2026-09-02T10:00:00"
        r = B.resolve_freshness(b, self.MAN, self.CFG)
        self.assertEqual(r["mode"], "full")
        self.assertIn("unreadable", r["reason"])


class ScreenDecision(unittest.TestCase):
    def test_unknown_screen_is_recaptured(self):
        self.assertEqual(B.decide_screen(None, "s", "g"), "recapture")

    def test_structure_change_is_a_full_recapture(self):
        prev = {"structureHash": "s1", "geometryHash": "g1"}
        self.assertEqual(B.decide_screen(prev, "s2", "g2"), "recapture")

    def test_geometry_only_change_is_a_reshoot(self):
        prev = {"structureHash": "s1", "geometryHash": "g1"}
        self.assertEqual(B.decide_screen(prev, "s1", "g2"), "reshoot")

    def test_both_unchanged_is_reuse(self):
        prev = {"structureHash": "s1", "geometryHash": "g1"}
        self.assertEqual(B.decide_screen(prev, "s1", "g1"), "reuse")


class Fingerprint(unittest.TestCase):
    def test_reads_hashed_cra_bundle_name(self):
        html = '<script src="/static/js/main.9f2c1a3b.js"></script>'
        self.assertEqual(B.extract_fingerprint(html), "main.9f2c1a3b.js")

    def test_reads_hashed_next_chunk_when_no_cra_bundle(self):
        html = '<script src="/_next/static/chunks/main-app-4c1e77aa21.js"></script>'
        self.assertEqual(B.extract_fingerprint(html), "main-app-4c1e77aa21.js")

    def test_unhashed_script_is_not_a_fingerprint(self):
        self.assertIsNone(B.extract_fingerprint('<script src="/js/app.js"></script>'))

    def test_first_hashed_script_wins_and_is_stable(self):
        html = ('<script src="/static/js/main.aaaaaaa1.js"></script>'
                '<script src="/static/js/2.bbbbbbb2.chunk.js"></script>')
        self.assertEqual(B.extract_fingerprint(html), "main.aaaaaaa1.js")

    def test_prefers_own_origin_bundle_over_hashed_cdn(self):
        html = ('<script src="https://cdn.example.com/vendor.1234567a.js"></script>'
                '<script src="/static/js/main.aaaaaaa1.js"></script>')
        self.assertEqual(B.extract_fingerprint(html), "main.aaaaaaa1.js")

    def test_hashed_name_in_body_text_is_not_fingerprint(self):
        html = '<div>The app bundle is main.12345678.js</div><script src="/app.js"></script>'
        self.assertIsNone(B.extract_fingerprint(html))

    def test_reads_vite_style_mixed_case_hash(self):
        html = '<script type="module" src="/assets/index-m7u9Vf46.js"></script>'
        self.assertEqual(B.extract_fingerprint(html), "index-m7u9Vf46.js")

    def test_unhashed_vite_asset_name_is_rejected(self):
        html = '<script type="module" src="/assets/vendor.js"></script>'
        self.assertIsNone(B.extract_fingerprint(html))

    def test_prefers_own_origin_assets_over_earlier_hashed_cdn(self):
        html = ('<script src="https://cdn.example.com/lib/react-vendor.a1b2c3d4.js"></script>'
                '<script type="module" src="/assets/index-m7u9Vf46.js"></script>')
        self.assertEqual(B.extract_fingerprint(html), "index-m7u9Vf46.js")


class Integrity(unittest.TestCase):
    def test_drifted_png_is_reported(self):
        d = tempfile.mkdtemp()
        os.makedirs(os.path.join(d, "captures", "live"), exist_ok=True)
        p = os.path.join(d, "captures", "live", "A.png")
        with open(p, "wb") as fh:
            fh.write(b"original")
        good = B.sha256_file(p)
        b = {"screens": [{"slug": "A", "png": "captures/live/A.png", "pngSha256": good}]}
        self.assertEqual(B.verify_integrity(b, d), [])
        with open(p, "wb") as fh:
            fh.write(b"tampered")
        self.assertEqual(B.verify_integrity(b, d), ["A"])

    def test_missing_png_is_reported(self):
        d = tempfile.mkdtemp()
        b = {"screens": [{"slug": "GONE", "png": "captures/live/GONE.png", "pngSha256": "x"}]}
        self.assertEqual(B.verify_integrity(b, d), ["GONE"])


class FreshnessGate(unittest.TestCase):
    def _paths(self):
        d = tempfile.mkdtemp()
        out = os.path.join(d, "out")
        os.makedirs(out, exist_ok=True)
        return {"project": d, "out": out}

    def test_gate_fails_on_drift_and_says_so(self):
        p = self._paths()
        ok = B.write_freshness(p, _bundle(), {"mode": "reuse-all", "reason": "r"}, {}, ["A"])
        self.assertFalse(ok)
        body = open(os.path.join(p["out"], "freshness.md")).read()
        self.assertIn("FAIL", body)
        self.assertIn("A", body)

    def test_gate_passes_with_no_drift(self):
        p = self._paths()
        ok = B.write_freshness(p, _bundle(), {"mode": "reuse-all", "reason": "r"}, {}, [])
        self.assertTrue(ok)
        self.assertIn("PASS", open(os.path.join(p["out"], "freshness.md")).read())


from engine import drive as D


class SubmitGating(unittest.TestCase):
    FLOW = {"id": "f", "allowSubmit": True, "steps": []}

    def test_dev_allows_submission(self):
        ok, _ = D.is_submit_allowed("dev", self.FLOW)
        self.assertTrue(ok)

    def test_uat_allows_submission(self):
        ok, _ = D.is_submit_allowed("uat", self.FLOW)
        self.assertTrue(ok)

    def test_prod_never_allows_submission_unattended(self):
        ok, why = D.is_submit_allowed("prod", self.FLOW)
        self.assertFalse(ok)
        self.assertIn("prod", why)

    def test_flow_must_opt_in_even_on_dev(self):
        ok, why = D.is_submit_allowed("dev", {"id": "f", "steps": []})
        self.assertFalse(ok)
        self.assertIn("allowSubmit", why)

    def test_string_false_does_not_open_the_gate(self):
        """YAML's `allowSubmit: "false"` is a non-empty string — truthy in Python. A bare
        `if not flow.get("allowSubmit")` would treat that as opt-in; it must not."""
        ok, why = D.is_submit_allowed("uat", {"id": "f", "allowSubmit": "false", "steps": []})
        self.assertFalse(ok)
        self.assertIn("allowSubmit", why)
        self.assertIn("false", why)

    def test_environment_matching_is_case_insensitive(self):
        ok, _ = D.is_submit_allowed("UAT", self.FLOW)
        self.assertTrue(ok)
        ok, why = D.is_submit_allowed("PROD", self.FLOW)
        self.assertFalse(ok)
        self.assertIn("PROD", why)


class Fixtures(unittest.TestCase):
    MAN = {"fixtures": {"ngo": {"orgName": "Example Welfare Society"}}}

    def test_named_fixture_resolves(self):
        self.assertEqual(D.resolve_fixture(self.MAN, {"fill": {"fixture": "ngo"}}),
                         {"orgName": "Example Welfare Society"})

    def test_inline_values_win_over_the_fixture(self):
        got = D.resolve_fixture(self.MAN, {"fill": {"fixture": "ngo", "orgName": "Other"}})
        self.assertEqual(got["orgName"], "Other")

    def test_unknown_fixture_is_empty_not_an_error(self):
        self.assertEqual(D.resolve_fixture(self.MAN, {"fill": {"fixture": "nope"}}), {})


class FlowReplay(unittest.TestCase):
    FLOW = {"id": "apply", "entry": "/apply/step-1", "steps": [{"capture": "S1"}]}

    def test_no_previous_bundle_means_replay(self):
        self.assertTrue(D.should_replay(self.FLOW, None, {}))

    def test_always_replay_wins(self):
        b = {"screens": [{"slug": "S1", "reachedBy": "flow:apply"}]}
        self.assertTrue(D.should_replay(dict(self.FLOW, alwaysReplay=True), b, {}))

    def test_unchanged_entry_screen_means_skip(self):
        b = {"screens": [{"slug": "S1", "reachedBy": "flow:apply"}]}
        self.assertFalse(D.should_replay(self.FLOW, b, {"CITIZEN-APPLY-STEP-1": "reuse"}))

    def test_changed_entry_screen_means_replay(self):
        b = {"screens": [{"slug": "S1", "reachedBy": "flow:apply"}]}
        self.assertTrue(D.should_replay(self.FLOW, b, {"CITIZEN-APPLY-STEP-1": "recapture"}))

    def test_entry_not_among_nav_screens_replays(self):
        """A flow entry no nav links to yields no decision. Replay rather than skip — a skipped
        flow silently serves stale wizard captures, which is the failure this whole design exists
        to prevent."""
        b = {"screens": [{"slug": "S1", "reachedBy": "flow:apply"}]}
        self.assertTrue(D.should_replay(self.FLOW, b, {"SOMETHING-ELSE": "reuse"}))


class _FakeLocator:
    """What `pg.get_by_role(...).first` / `pg.locator(...).first` returns.

    `resolved` is the accessible name of the button the query really matched — which is NOT
    always the name that was asked for, because Playwright's `name=` is a case-insensitive
    SUBSTRING match. That gap is the whole point of the FlowSafety tests below. `None` means
    the query matched nothing, so both reading the name and clicking raise, exactly as
    Playwright does.
    """
    def __init__(self, page, requested, resolved):
        self.page, self.requested, self.resolved = page, requested, resolved

    @property
    def first(self):
        return self

    def get_attribute(self, name, timeout=None):
        return None

    def inner_text(self, timeout=None):
        if self.resolved is None:
            raise Exception(f"no element matching {self.requested!r}")
        return self.resolved

    def text_content(self, timeout=None):
        return self.inner_text()

    def click(self):
        if self.resolved is None:
            raise Exception(f"no element matching {self.requested!r}")
        self.page.calls.append(("click", self.requested))


class FakePage:
    """Records every click Playwright would have been asked to attempt. No network, no
    browser — just enough surface for run_flow to walk a flow against it.

    `buttons` names the accessible names really on the page, and the locators resolve against
    them the way Playwright does (substring, or exact when asked). Left as None, any label
    resolves to a button of exactly that name — the older, simpler model, kept because most
    tests only care whether a click was attempted at all.
    """
    def __init__(self, button_exists=True, buttons=None):
        self.calls = []
        self.url = "http://fake.invalid/screen"
        self._button_exists = button_exists
        self._buttons = buttons

    def _match(self, label, exact):
        """The accessible name Playwright would resolve `label` to, or None."""
        if label is None:
            return None
        if self._buttons is None:
            return label if self._button_exists else None
        for b in self._buttons:
            if (b.lower() == label.lower()) if exact else (label.lower() in b.lower()):
                return b
        return None

    def goto(self, *a, **k):
        self.calls.append(("goto", a))

    def wait_for_timeout(self, *a, **k):
        pass

    def reload(self, **k):
        self.calls.append(("reload",))

    def inner_text(self, *a, **k):
        return ""

    def get_by_role(self, kind, name=None, exact=False):
        self.calls.append(("get_by_role", name))
        return _FakeLocator(self, name, self._match(name, exact))

    def locator(self, selector):
        # _click's CSS leg: `button:has-text("X")` (substring) or `button:text-is("X")` (exact).
        self.calls.append(("locator", selector))
        m = re.search(r'(has-text|text-is)\("(.*)"\)', selector)
        kind, label = (m.group(1), m.group(2)) if m else ("has-text", None)
        return _FakeLocator(self, label, self._match(label, kind == "text-is"))

    def click(self, selector):
        # Legacy CSS fallback. drive.py no longer calls this — it needs the ELEMENT so it can
        # re-check the resolved name — but a recorded call here would still fail the tests.
        self.calls.append(("click_css", selector))
        raise Exception("no fallback button either — fine, the test only checks attempts")


class FlowSafety(unittest.TestCase):
    """Finding 1's regression tests: a label matching DESTRUCTIVE must never be clicked while
    is_submit_allowed() is False, no matter which kind of step asked for it. Test (b) is the
    proof — it fails against the pre-fix `captureValidation` branch, which clicked "Save"/
    "Submit" unconditionally as an automatic fallback chain, gate or no gate."""

    CFG = {"live": {"roles": [{"name": "citizen", "base": "http://fake.invalid"}]}, "capture": {}}

    def _run(self, flow, environment, button_exists=True, buttons=None):
        pg = FakePage(button_exists=button_exists, buttons=buttons)
        captured = []
        with unittest.mock.patch.object(D, "_capture_state",
                                        lambda *a, **k: captured.append(a[1])):
            D.run_flow(pg, flow, {}, self.CFG, {"captures_live": "/dev/null"}, {}, environment)
        return pg, captured

    @staticmethod
    def _clicks(pg):
        return [c for c in pg.calls if c[0] in ("click", "click_css")]

    def test_a_click_step_matching_destructive_is_never_attempted_on_prod(self):
        flow = {"id": "f", "role": "citizen", "steps": [{"click": "Submit"}]}
        pg, _ = self._run(flow, "prod")
        self.assertEqual(pg.calls, [], "no click of any kind should have been attempted")

    def test_b_capture_validation_never_clicks_destructive_label_on_prod(self):
        """The CRITICAL regression: an explicit destructive submitLabel inside
        captureValidation must be gated exactly like the `click` branch is. Against the
        pre-fix code (which clicked step.get('submitLabel') unconditionally, then fell back
        to "Save" and "Submit" if that failed) this assertion fails."""
        flow = {"id": "f", "role": "citizen",
                "steps": [{"captureValidation": "STATE", "submitLabel": "Submit"}]}
        pg, captured = self._run(flow, "prod", button_exists=False)
        clicked_labels = [c[1] for c in pg.calls if c[0] in ("get_by_role", "click", "click_css")]
        self.assertEqual(clicked_labels, [], f"a destructive click was attempted: {clicked_labels}")
        self.assertEqual(captured, [], "the validation state must not be captured when skipped")

    def test_c_capture_validation_clicks_when_both_gates_open(self):
        flow = {"id": "f", "role": "citizen", "allowSubmit": True,
                "steps": [{"captureValidation": "STATE", "submitLabel": "Submit"}]}
        pg, captured = self._run(flow, "uat", button_exists=True)
        self.assertIn(("click", "Submit"), pg.calls)
        self.assertEqual(captured, ["STATE"])

    def test_d_string_false_allow_submit_blocks_on_uat(self):
        ok, why = D.is_submit_allowed("uat", {"id": "f", "allowSubmit": "false"})
        self.assertFalse(ok)
        self.assertIn("allowSubmit", why)

    # --- The gate guards the DECLARED label; these guard the RESOLVED one. -----------------
    # Playwright's `name=` is a case-insensitive SUBSTRING match, so a label that passes
    # `_destructive_and_blocked` can still resolve to a destructive control. Tests (e) and (g)
    # both FAIL against the pre-fix drive.py, which clicked whatever the substring matched.

    def test_e_engine_default_next_must_not_resolve_to_save_and_next(self):
        """THE critical case. `captureValidation` with no `submitLabel` defaults to "Next",
        which passes the label gate — and on a real wizard resolves to "Save & Next", which
        saves the step server-side while the log prints "submission BLOCKED"."""
        flow = {"id": "f", "role": "citizen",
                "steps": [{"captureValidation": "STEP-1-ERRORS"}]}
        pg, captured = self._run(flow, "prod", buttons=["Save & Next"])
        self.assertEqual(self._clicks(pg), [],
                         f"'Next' resolved to a destructive button and was clicked: {pg.calls}")
        self.assertEqual(captured, [], "nothing may be captured after a refused click")

    def test_f_same_flow_does_click_save_and_next_when_both_gates_open(self):
        """The refusal is the gate doing its job, not the feature being neutered: on uat with
        allowSubmit the identical flow clicks and captures exactly as before."""
        flow = {"id": "f", "role": "citizen", "allowSubmit": True,
                "steps": [{"captureValidation": "STEP-1-ERRORS"}]}
        pg, captured = self._run(flow, "uat", buttons=["Save & Next"])
        self.assertTrue(self._clicks(pg), f"the click should have happened: {pg.calls}")
        self.assertEqual(captured, ["STEP-1-ERRORS"])

    def test_g_declared_click_resolving_to_a_destructive_button_is_refused(self):
        """A `click:` label the author believes is safe — "Continue" — resolving to
        "Confirm & Continue". The declared label carries no DESTRUCTIVE word, so only the
        resolved-name re-check can catch this one."""
        flow = {"id": "f", "role": "citizen",
                "steps": [{"click": "Continue"}, {"capture": "STEP-2"}]}
        pg, captured = self._run(flow, "prod", buttons=["Confirm & Continue"])
        self.assertEqual(self._clicks(pg), [], f"a destructive click was made: {pg.calls}")
        self.assertEqual(captured, [], "the flow must abort, not capture the unmoved page")

    def test_h_declared_save_resolving_to_save_and_exit_is_refused(self):
        """"Save" is caught by the declared-label gate before `_click` is even reached; this
        pins that the belt and the braces agree, so a later refactor cannot drop one and pass."""
        flow = {"id": "f", "role": "citizen", "steps": [{"click": "Save"}]}
        pg, _ = self._run(flow, "prod", buttons=["Save & Exit"])
        self.assertEqual(self._clicks(pg), [], f"a destructive click was made: {pg.calls}")

    def test_i_failed_forward_click_aborts_the_flow(self):
        """I3. A forward click that did not happen leaves the page where it was, so every
        later `capture:` step would shoot THAT page under the NEXT screen's slug."""
        flow = {"id": "f", "role": "citizen", "allowSubmit": True,
                "steps": [{"capture": "STEP-1"}, {"click": "Next"}, {"capture": "STEP-2"}]}
        pg, captured = self._run(flow, "uat", buttons=["Something Else Entirely"])
        self.assertEqual(captured, ["STEP-1"],
                         "STEP-2 must not be captured after the forward click failed")


from engine import capture as CAP


class ManifestPruning(unittest.TestCase):
    """Regression test for the bug where a `--role X` run that captured ZERO screens (every
    route failed — outage, expired login, DNS blip) still had its rows pruned from the
    manifest, emptying `_captured.json` on a single-role project despite the "manifest left
    untouched" log line right above it. Exercises `rows_to_prune`, the pure helper
    `run()` now calls for this decision."""

    ROWS = [
        {"slug": "CITIZEN-HOME"}, {"slug": "CITIZEN-APPLY"}, {"slug": "ADMIN-DASH"},
    ]

    def test_role_with_zero_captures_is_not_pruned(self):
        # CITIZEN's every route failed this run (captured_counts has no entry for it, or 0) —
        # its failed slug must survive, exactly as the "manifest left untouched" guard intends.
        failures = {"citizen": ["CITIZEN-HOME"]}
        kept, pruned, skipped = CAP.rows_to_prune(
            self.ROWS, failures, visited_roles={"citizen"}, captured_counts={})
        self.assertEqual(kept, self.ROWS, "a 0-capture role's rows must not be pruned")
        self.assertEqual(pruned, [])
        self.assertEqual(skipped, ["citizen"])

    def test_role_with_at_least_one_capture_is_pruned(self):
        # CITIZEN captured 1 screen successfully and 1 route failed — the failed one's stale
        # row is correctly removed.
        failures = {"citizen": ["CITIZEN-APPLY"]}
        kept, pruned, skipped = CAP.rows_to_prune(
            self.ROWS, failures, visited_roles={"citizen"}, captured_counts={"citizen": 1})
        self.assertEqual(kept, [{"slug": "CITIZEN-HOME"}, {"slug": "ADMIN-DASH"}])
        self.assertEqual(pruned, ["CITIZEN-APPLY"])
        self.assertEqual(skipped, [])

    def test_role_not_visited_this_run_is_left_alone(self):
        # A role excluded by --role, skipped (missing creds) or aborted keeps every row,
        # regardless of stale `failures` data left over from a previous run.
        failures = {"citizen": ["CITIZEN-HOME"]}
        kept, pruned, skipped = CAP.rows_to_prune(
            self.ROWS, failures, visited_roles=set(), captured_counts={})
        self.assertEqual(kept, self.ROWS)
        self.assertEqual(pruned, [])
        self.assertEqual(skipped, [])


if __name__ == "__main__":
    unittest.main()
