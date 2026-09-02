# Unified Capture Bundle — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture a live portal deeply **once** during clone recon — every route, every wizard
step, every modal and validation state — and let the design-QC run reuse that capture instead of
traversing the portal again, refusing to reuse anything stale.

**Architecture:** A declarative `screen-manifest.yaml` per project describes how to reach states a
route-crawl cannot see. The engine executes it and writes `capture-bundle.json`, a timestamped,
hashed index of every screen state. A later run resolves freshness in three tiers — build
fingerprint, then per-screen hashes, then per-flow replay — and re-captures only what moved.

**Tech Stack:** Python 3 · Playwright (sync API) · PyYAML · stdlib `unittest` · Node for PDF render.

**Spec:** `docs/superpowers/specs/2026-09-02-unified-capture-bundle-design.md` — read it first.

## Global Constraints

- **Tests are stdlib `unittest` only. `pytest` is NOT installed.** Existing convention, stated at
  `engine/test_analyze.py:4`: *"stdlib only — no pytest, no new deps"*.
  Run tests as: `cd tools/design-audit && python3 -m unittest engine.test_capture_bundle -v`
- All engine code is **project-agnostic** — it reads `audit.config.json` and
  `screen-manifest.yaml` and nothing else about a project (`engine/config.py` docstring).
- **Never commit secrets.** `projects/*/secrets.json` stays gitignored.
- **Never fire a real OTP, and never commit a destructive action on `prod`.**
- `analyze.py`, `crosscheck.py`, `qc_geometry.py`, `report.py` must remain **unchanged**.
- `settle_height`, `shoot`, `slugify`, `merge_manifest` in `capture.py` must remain **unchanged**.
- The existing `captures/_captured.json` manifest keeps working exactly as it does today. The
  bundle is additive.
- Working directory for every command below is `tools/design-audit/`.

---

## File Structure

| File | Responsibility |
|---|---|
| `engine/manifest.py` | **new** — parse + validate `screen-manifest.yaml`; resolve volatiles per slug |
| `engine/bundle.py` | **new** — masking, the two hashes, bundle read/write, freshness resolution |
| `engine/drive.py` | **new** — execute `flows[].steps`; environment-gated submission |
| `engine/figures.py` | **new** — derive width-capped WebP report figures |
| `engine/test_capture_bundle.py` | **new** — unit tests for manifest, masking, hashing, freshness |
| `engine/capture.py` | **modify** — volatile-aware `EXTRACT_JS` + field inventory; write bundle; honour reuse |
| `engine/run.py` | **modify** — `--force`, `--verify`, `--phase bundle` |
| `engine/bootstrap.py` | **modify** — emit a starter `screen-manifest.yaml` |
| `requirements.txt` | **modify** — add PyYAML |
| `.gitignore` (tool-local) | **modify** — un-ignore two files inside `out/` |

Split rationale: hashing/freshness (`bundle.py`) is pure and unit-testable with no browser;
traversal (`drive.py`) needs a browser and cannot be unit-tested the same way. Keeping them apart
means the risky logic is the testable logic.

---

# Phase 1 — Bundle foundations

### Task 1: Manifest parsing

**Files:**
- Create: `engine/manifest.py`
- Modify: `requirements.txt`
- Test: `engine/test_capture_bundle.py`

**Interfaces:**
- Produces:
  - `load(project_dir: str) -> dict | None` — parsed manifest, or `None` if no file
  - `validate(raw: dict) -> list[str]` — list of human-readable errors, empty when valid
  - `staleness_seconds(m: dict) -> int` — default `14 * 86400`
  - `volatile_selectors(m: dict, slug: str | None) -> list[str]`
  - `volatile_patterns(m: dict, slug: str | None) -> list[str]`

- [ ] **Step 1: Write failing test**

```python
# engine/test_capture_bundle.py
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
```

- [ ] **Step 2: Run test and verify it fails**
  Run: `cd tools/design-audit && python3 -m unittest engine.test_capture_bundle -v`
  Expected: FAIL — `ModuleNotFoundError: No module named 'engine.manifest'`

- [ ] **Step 3: Add the PyYAML dependency**

```
# requirements.txt — append below the playwright lines
PyYAML>=6.0
```

- [ ] **Step 4: Write minimal implementation**

```python
#!/usr/bin/env python3
"""Parse and validate a project's screen-manifest.yaml — the declarative traversal recipe.

The manifest is the INPUT to a capture (how to reach states a route-crawl cannot see);
capture-bundle.json is the OUTPUT. Project-agnostic: nothing here knows a portal's name.

`volatile` entries are content that changes on every load (counters, dates, generated ids).
They are masked before hashing, or a dashboard looks dirty on every single run and the
per-screen freshness tier becomes dead weight.
"""
import os, re
import yaml

VALID_ENVIRONMENTS = ("dev", "uat", "prod")
DEFAULT_STALENESS = 14 * 86400
_DURATION = re.compile(r"^(\d+)\s*([smhd])$")
_UNIT = {"s": 1, "m": 60, "h": 3600, "d": 86400}


def load(project_dir):
    """Parse projects/<name>/screen-manifest.yaml. Returns None when absent."""
    path = os.path.join(project_dir, "screen-manifest.yaml")
    if not os.path.exists(path):
        return None
    with open(path) as fh:
        return yaml.safe_load(fh) or {}


def validate(raw):
    """Return a list of human-readable errors. Empty list means valid."""
    errs = []
    if not isinstance(raw, dict):
        return ["manifest is not a mapping"]
    if raw.get("version") != 1:
        errs.append(f"version must be 1, got {raw.get('version')!r}")
    env = raw.get("environment")
    if env not in VALID_ENVIRONMENTS:
        errs.append(f"environment must be one of {VALID_ENVIRONMENTS}, got {env!r}")
    for i, flow in enumerate(raw.get("flows") or []):
        if not flow.get("id"):
            errs.append(f"flows[{i}] has no id")
        if not flow.get("steps"):
            errs.append(f"flows[{i}] has no steps")
    seen = set()
    for flow in raw.get("flows") or []:
        fid = flow.get("id")
        if fid in seen:
            errs.append(f"duplicate flow id {fid!r}")
        seen.add(fid)
    return errs


def staleness_seconds(m):
    raw = (m or {}).get("stalenessCeiling")
    if raw is None:
        return DEFAULT_STALENESS
    if isinstance(raw, int):
        return raw
    hit = _DURATION.match(str(raw).strip())
    return int(hit.group(1)) * _UNIT[hit.group(2)] if hit else DEFAULT_STALENESS


def _screen(m, slug):
    for s in (m or {}).get("screens") or []:
        if s.get("slug") == slug:
            return s
    return {}


def _split(entries):
    """`volatile` accepts bare strings (patterns) or {selector:…} / {pattern:…} mappings."""
    sels, pats = [], []
    for e in entries or []:
        if isinstance(e, str):
            pats.append(e)
        elif isinstance(e, dict):
            if e.get("selector"):
                sels.append(e["selector"])
            if e.get("pattern"):
                pats.append(e["pattern"])
    return sels, pats


def volatile_selectors(m, slug=None):
    g, _ = _split((m or {}).get("volatile"))
    s, _ = _split(_screen(m, slug).get("volatile")) if slug else ([], [])
    return g + s


def volatile_patterns(m, slug=None):
    _, g = _split((m or {}).get("volatile"))
    _, s = _split(_screen(m, slug).get("volatile")) if slug else ([], [])
    return g + s
```

- [ ] **Step 5: Run tests and verify they pass**
  Run: `cd tools/design-audit && python3 -m unittest engine.test_capture_bundle -v`
  Expected: PASS — 5 tests

- [ ] **Step 6: Commit**

```bash
git add tools/design-audit/engine/manifest.py tools/design-audit/engine/test_capture_bundle.py tools/design-audit/requirements.txt
git commit -m "feat(design-audit): parse screen-manifest.yaml, the traversal recipe"
```

---

### Task 2: Masking and the two hashes

**Files:**
- Create: `engine/bundle.py`
- Modify: `engine/test_capture_bundle.py`

**Interfaces:**
- Consumes: `manifest.volatile_patterns` (Task 1)
- Produces:
  - `mask_rows(rows: list[dict], patterns: list[str]) -> tuple[list[dict], int]` — returns
    `(kept_rows, masked_count)`. A row is masked out when `row["volatile"]` is true **or** its
    `text` matches any pattern.
  - `structure_hash(rows: list[dict]) -> str` — sha256 hex, **excludes** `x`/`y`/`w`/`h`
  - `geometry_hash(rows: list[dict], page_h: int) -> str` — sha256 hex, **includes** them
  - `MASK_WARN_RATIO = 0.30`

- [ ] **Step 1: Write failing test**

```python
# append to engine/test_capture_bundle.py, above the __main__ guard
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
```

- [ ] **Step 2: Run tests and verify they fail**
  Run: `cd tools/design-audit && python3 -m unittest engine.test_capture_bundle -v`
  Expected: FAIL — `ModuleNotFoundError: No module named 'engine.bundle'`

- [ ] **Step 3: Write minimal implementation**

```python
#!/usr/bin/env python3
"""The capture bundle: masking, fingerprints, freshness.

Two hashes per screen, deliberately:
  structureHash — did the DESIGN change?  (excludes x/y/w/h)
  geometryHash  — did the LAYOUT move?    (includes them, plus pageH)

They are separate because `qc_geometry` asserts pin ⊂ element ⊂ crop ⊂ image. A table that
gained a row is visually unchanged but geometrically shifted; reusing its screenshot puts every
pin in the wrong place. One combined hash would either re-shoot constantly or ship broken pins.
"""
import hashlib, json, re

MASK_WARN_RATIO = 0.30

STRUCTURE_KEYS = ("tag", "role", "dsComponent", "text", "fontFamily", "fontSize",
                  "fontWeight", "lineHeight", "color", "bg", "radius", "padding",
                  "borderStyle", "borderColor")
GEOMETRY_KEYS = STRUCTURE_KEYS + ("x", "y", "w", "h")


def mask_rows(rows, patterns):
    """Drop volatile rows before hashing. Returns (kept, masked_count).

    Selector-based volatiles are flagged in-browser (rows carry `volatile: true`) because a CSS
    selector cannot be re-evaluated against extracted JSON. Pattern-based ones are applied here.
    """
    compiled = [re.compile(p) for p in patterns or []]
    kept, masked = [], 0
    for r in rows:
        text = r.get("text") or ""
        if r.get("volatile") or any(c.search(text) for c in compiled):
            masked += 1
            continue
        kept.append(r)
    return kept, masked


def _digest(rows, keys, extra=None):
    payload = [[r.get(k) for k in keys] for r in rows]
    blob = json.dumps([payload, extra], separators=(",", ":"), sort_keys=True, default=str)
    return hashlib.sha256(blob.encode("utf-8")).hexdigest()


def structure_hash(rows):
    return _digest(rows, STRUCTURE_KEYS)


def geometry_hash(rows, page_h):
    return _digest(rows, GEOMETRY_KEYS, extra={"pageH": page_h})
```

- [ ] **Step 4: Run tests and verify they pass**
  Run: `cd tools/design-audit && python3 -m unittest engine.test_capture_bundle -v`
  Expected: PASS — 11 tests

- [ ] **Step 5: Commit**

```bash
git add tools/design-audit/engine/bundle.py tools/design-audit/engine/test_capture_bundle.py
git commit -m "feat(design-audit): structure and geometry hashes with volatile masking"
```

---

### Task 3: Bundle read, write and screen entries

**Files:**
- Modify: `engine/bundle.py`, `engine/test_capture_bundle.py`

**Interfaces:**
- Produces:
  - `BUNDLE_VERSION = 1`
  - `bundle_path(paths: dict) -> str` — `<out>/capture-bundle.json`
  - `load_bundle(paths: dict) -> dict | None`
  - `write_bundle(paths: dict, b: dict) -> None`
  - `new_bundle(project: str, environment: str, engine_sha: str) -> dict`
  - `screen_entry(slug, role, route, url, reached_by, png, png_sha256, png_h, page_h, truncated, rows_path, structure, geometry, masked, total, fields, wizard, captured_at) -> dict`
  - `upsert_screen(b: dict, entry: dict) -> None` — replace by `slug`, else append
  - `find_screen(b: dict, slug: str) -> dict | None`
  - `sha256_file(path: str) -> str`

- [ ] **Step 1: Write failing test**

```python
# append to engine/test_capture_bundle.py, above the __main__ guard
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
        B.upsert_screen(b, dict(first, structure="s2"))
        self.assertEqual([s["slug"] for s in b["screens"]], ["A", "B"])
        self.assertEqual(B.find_screen(b, "A")["structureHash"], "s2")
```

- [ ] **Step 2: Run tests and verify they fail**
  Run: `cd tools/design-audit && python3 -m unittest engine.test_capture_bundle.BundleIO -v`
  Expected: FAIL — `AttributeError: module 'engine.bundle' has no attribute 'load_bundle'`

- [ ] **Step 3: Write minimal implementation**

```python
# append to engine/bundle.py
import datetime, os

BUNDLE_VERSION = 1


def bundle_path(paths):
    return os.path.join(paths["out"], "capture-bundle.json")


def load_bundle(paths):
    p = bundle_path(paths)
    if not os.path.exists(p):
        return None
    try:
        with open(p) as fh:
            return json.load(fh)
    except Exception:
        return None


def write_bundle(paths, b):
    with open(bundle_path(paths), "w") as fh:
        json.dump(b, fh, indent=2)


def now_iso():
    return datetime.datetime.now().astimezone().isoformat(timespec="seconds")


def new_bundle(project, environment, engine_sha):
    return {"version": BUNDLE_VERSION, "project": project, "environment": environment,
            "engineSha": engine_sha, "capturedAt": now_iso(),
            "hosts": {}, "screens": [], "records": {}}


def screen_entry(slug, role, route, url, reached_by, png, png_sha256, png_h, page_h,
                 truncated, rows_path, structure, geometry, masked, total, fields,
                 wizard, captured_at):
    return {"slug": slug, "role": role, "route": route, "url": url,
            "reachedBy": reached_by, "png": png, "pngSha256": png_sha256,
            "pngH": png_h, "pageH": page_h, "truncated": truncated, "rows": rows_path,
            "structureHash": structure, "geometryHash": geometry,
            "maskedRows": masked, "totalRows": total,
            "fields": fields or [], "wizard": wizard, "capturedAt": captured_at}


def find_screen(b, slug):
    for s in b.get("screens", []):
        if s.get("slug") == slug:
            return s
    return None


def upsert_screen(b, entry):
    for i, s in enumerate(b.setdefault("screens", [])):
        if s.get("slug") == entry["slug"]:
            b["screens"][i] = entry
            return
    b["screens"].append(entry)


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()
```

- [ ] **Step 4: Run tests and verify they pass**
  Run: `cd tools/design-audit && python3 -m unittest engine.test_capture_bundle -v`
  Expected: PASS — 14 tests

- [ ] **Step 5: Commit**

```bash
git add tools/design-audit/engine/bundle.py tools/design-audit/engine/test_capture_bundle.py
git commit -m "feat(design-audit): capture-bundle.json read, write and screen entries"
```

---

### Task 4: Volatile-aware extraction and the field inventory

**Files:**
- Modify: `engine/capture.py` (`EXTRACT_JS`, and its two call sites in `capture_role`)

**Interfaces:**
- Produces: `EXTRACT_JS` now takes one argument, `{volatileSelectors: string[]}`, and its return
  value gains `fields` (list) while each row gains `volatile` (bool).
- Field record shape, relied on by Task 9:
  `{name, label, type, required, options, helper, validationMessage, conditionalOn}`
  — `validationMessage` and `conditionalOn` are `null` here and filled in by `drive.py`.

- [ ] **Step 1: Replace `EXTRACT_JS` in `engine/capture.py`**

```javascript
(arg) => {
  const volatileSel = (arg && arg.volatileSelectors) || [];
  const isVolatile = el => volatileSel.some(s => { try { return el.matches(s) || el.closest(s); } catch (e) { return false; } });
  const px = v => Math.round(parseFloat(v)||0);
  const rows = [];
  const els = document.querySelectorAll('h1,h2,h3,h4,h5,h6,button,a,label,p,span,th,td,input,textarea,select,li,[role=button],[role=tab]');
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    let text = '';
    for (const n of el.childNodes) if (n.nodeType === 3) text += n.textContent;
    text = text.replace(/\s+/g,' ').trim();
    const ph = (el.tagName==='INPUT'||el.tagName==='TEXTAREA') ? (el.placeholder||'') : '';
    if (!text && !ph && !['BUTTON','A','INPUT','TEXTAREA','SELECT'].includes(el.tagName)) continue;
    rows.push({
      tag: el.tagName.toLowerCase(), role: el.getAttribute('role') || null,
      text: (text||ph).slice(0,80), isPlaceholder: !text && !!ph,
      x: Math.round(r.left + window.scrollX), y: Math.round(r.top + window.scrollY),
      w: Math.round(r.width), h: Math.round(r.height),
      fontFamily: cs.fontFamily.split(',')[0].replace(/["']/g,''),
      fontSize: px(cs.fontSize), fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight==='normal'?null:px(cs.lineHeight),
      color: cs.color, bg: cs.backgroundColor, radius: px(cs.borderTopLeftRadius),
      padding: [px(cs.paddingTop),px(cs.paddingRight),px(cs.paddingBottom),px(cs.paddingLeft)],
      borderStyle: cs.borderStyle, borderColor: cs.borderColor,
      dsComponent: el.getAttribute('data-ds-component') || null,
      dsState: el.getAttribute('data-ds-state') || null,
      volatile: isVolatile(el),
    });
  }
  // Field inventory — the machine-readable replacement for the prose in INVENTORY.md.
  const labelFor = el => {
    if (el.getAttribute('aria-label')) return el.getAttribute('aria-label');
    if (el.id) { const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`); if (l) return l.innerText.trim(); }
    const wrap = el.closest('label');
    return wrap ? wrap.innerText.trim() : null;
  };
  const fields = [];
  for (const el of document.querySelectorAll('input,select,textarea')) {
    if (el.type === 'hidden') continue;
    fields.push({
      name: el.name || el.id || null,
      label: labelFor(el),
      type: el.tagName === 'SELECT' ? 'select' : (el.type || el.tagName.toLowerCase()),
      required: el.required || el.getAttribute('aria-required') === 'true',
      options: el.tagName === 'SELECT' ? [...el.options].map(o => o.text.trim()).slice(0, 200) : null,
      helper: el.placeholder || el.getAttribute('aria-describedby') || null,
      validationMessage: null,
      conditionalOn: null,
    });
  }
  return { pageW: document.documentElement.scrollWidth,
           pageH: document.documentElement.scrollHeight, rows, fields };
}
```

- [ ] **Step 2: Update the call site in `capture_role`**
  In `engine/capture.py`, change `data = pg.evaluate(EXTRACT_JS)` to pass the selectors:

```python
data = pg.evaluate(EXTRACT_JS, {"volatileSelectors": vol_selectors})
```

  and add near the top of `capture_role`, after `routes = discover_routes(pg, cfg)`:

```python
    man = paths.get("_manifest")  # injected by run(); None when the project has no manifest
```

  then inside the per-path loop, before the `pg.evaluate` call:

```python
        vol_selectors = MAN.volatile_selectors(man, slug) if man else []
```

  and add `import manifest as MAN` beside the existing `import config as C`.

- [ ] **Step 3: Verify extraction still works end to end on a real project**
  Run: `cd tools/design-audit && python3 engine/run.py --project scw --phase capture --role citizen`
  Expected: `ok <SLUG>: N rows pageH=…` lines, no `extract failed`, and
  `python3 -c "import json;d=json.load(open('projects/scw/captures/live/CITIZEN-HOME.json'));print(len(d['rows']), len(d['fields']))"`
  prints two numbers with no `KeyError`.

- [ ] **Step 4: Confirm the untouched functions are untouched**
  Run: `cd tools/design-audit && git diff --stat engine/capture.py`
  Expected: `capture.py` changed; confirm by eye that `settle_height`, `shoot`, `slugify`,
  `merge_manifest` show no diff hunks.

- [ ] **Step 5: Commit**

```bash
git add tools/design-audit/engine/capture.py
git commit -m "feat(design-audit): volatile-aware extraction and a per-screen field inventory"
```

---

### Task 5: Write the bundle during capture

**Files:**
- Modify: `engine/capture.py` (`capture_role`, `run`), `engine/run.py`

**Interfaces:**
- Consumes: `bundle.new_bundle`, `bundle.screen_entry`, `bundle.upsert_screen`,
  `bundle.write_bundle`, `bundle.sha256_file`, `bundle.mask_rows`, `bundle.structure_hash`,
  `bundle.geometry_hash`, `manifest.load`, `manifest.validate`
- Produces: `projects/<name>/out/capture-bundle.json` written on every capture run.

- [ ] **Step 1: Load and validate the manifest in `capture.run`**
  In `engine/capture.py`, inside `run()` immediately after `cfg, paths = C.load(project)`:

```python
    man = MAN.load(paths["project"])
    if man:
        errs = MAN.validate(man)
        if errs:
            print("!! screen-manifest.yaml is invalid:", flush=True)
            for e in errs:
                print(f"   - {e}", flush=True)
            return []
    paths["_manifest"] = man
    env = (man or {}).get("environment") or cfg.get("live", {}).get("environment") or "dev"
    bdl = B.new_bundle(project, env, _engine_sha())
```

  and add `import bundle as B` beside the other engine imports.

- [ ] **Step 2: Add the engine SHA helper to `engine/capture.py`**

```python
def _engine_sha():
    """Short git sha of the engine, recorded so a bundle can be traced to the code that made it."""
    try:
        return subprocess.run(["git", "rev-parse", "--short", "HEAD"],
                              cwd=os.path.dirname(os.path.abspath(__file__)),
                              capture_output=True, text=True, timeout=5).stdout.strip() or None
    except Exception:
        return None
```

- [ ] **Step 3: Record each captured screen into the bundle**
  In `capture_role`, immediately after the existing `captured.append({...})` call:

```python
            kept, masked = B.mask_rows(data["rows"], MAN.volatile_patterns(man, slug) if man else [])
            entry = B.screen_entry(
                slug=slug, role=role["name"], route=path, url=base + path, reached_by="nav",
                png=f"captures/live/{slug}.png", png_sha256=B.sha256_file(png),
                png_h=png_h, page_h=data["pageH"], truncated=truncated,
                rows_path=f"captures/live/{slug}.json",
                structure=B.structure_hash(kept), geometry=B.geometry_hash(kept, data["pageH"]),
                masked=masked, total=len(data["rows"]),
                fields=data.get("fields") or [], wizard=None, captured_at=B.now_iso())
            # `decision` is introduced in Task 9; until then it is always "recapture".
            entry["designUnchanged"] = (locals().get("decision") == "reshoot")
            B.upsert_screen(bdl, entry)
            if len(data["rows"]) and masked / len(data["rows"]) > B.MASK_WARN_RATIO:
                print(f"  ! {slug}: {masked}/{len(data['rows'])} rows masked as volatile — "
                      f"the mask is doing too much work and the fingerprint means little",
                      flush=True)
```

  `capture_role` takes `bdl` and `man` as new parameters; update its signature to
  `def capture_role(pg, role, cfg, paths, bdl, man):` and its call site in `run()` to
  `manifest += capture_role(pg, role, cfg, paths, bdl, man)`.

- [ ] **Step 4: Write the bundle at the end of `run`**
  In `engine/capture.py`, immediately before the final `return out`:

```python
    prev = B.load_bundle(paths)
    if only_role and prev:
        # A --role run must not speak for roles it never visited (same contract as _captured.json).
        for s in prev.get("screens", []):
            if s.get("role") != only_role and not B.find_screen(bdl, s["slug"]):
                B.upsert_screen(bdl, s)
        bdl["records"] = {**prev.get("records", {}), **bdl.get("records", {})}
    B.write_bundle(paths, bdl)
    print(f"BUNDLE {len(bdl['screens'])} screen states -> out/capture-bundle.json", flush=True)
```

- [ ] **Step 5: Run a real capture and inspect the bundle**
  Run: `cd tools/design-audit && python3 engine/run.py --project scw --phase capture`
  Then: `python3 -c "import json;b=json.load(open('projects/scw/out/capture-bundle.json'));print(b['version'],b['environment'],len(b['screens']));print(b['screens'][0]['structureHash'][:12], b['screens'][0]['geometryHash'][:12])"`
  Expected: version `1`, a screen count matching the capture log, and two different hashes.

- [ ] **Step 6: Verify the bundle is stable across two runs of an unchanged site**
  Run the capture twice and compare only the hashes (not `capturedAt`):

```bash
cd tools/design-audit
python3 -c "
import json;b=json.load(open('projects/scw/out/capture-bundle.json'))
print(json.dumps({s['slug']:[s['structureHash'],s['geometryHash']] for s in b['screens']},indent=0))" > /tmp/h1.txt
python3 engine/run.py --project scw --phase capture >/dev/null
python3 -c "
import json;b=json.load(open('projects/scw/out/capture-bundle.json'))
print(json.dumps({s['slug']:[s['structureHash'],s['geometryHash']] for s in b['screens']},indent=0))" > /tmp/h2.txt
diff /tmp/h1.txt /tmp/h2.txt && echo STABLE || echo "UNSTABLE — add volatile entries"
```

  Expected: `STABLE`. If not, the diff names the screens whose volatile content needs declaring —
  add them to `screen-manifest.yaml` and repeat. **Do not proceed to Task 6 until this is stable**,
  because every freshness decision rests on it.

- [ ] **Step 7: Commit**

```bash
git add tools/design-audit/engine/capture.py
git commit -m "feat(design-audit): write capture-bundle.json on every capture run"
```

---

# Phase 2 — Freshness

### Task 6: Build fingerprint

**Files:**
- Modify: `engine/bundle.py`, `engine/test_capture_bundle.py`

**Interfaces:**
- Produces:
  - `extract_fingerprint(html: str) -> str | None` — the hashed bundle filename, e.g.
    `main.9f2c1a3b.js`
  - `build_fingerprint(base_url: str, timeout: int = 10) -> str | None` — fetches `base_url` and
    returns `extract_fingerprint` of the body; `None` on any network failure

- [ ] **Step 1: Write failing test**

```python
# append to engine/test_capture_bundle.py, above the __main__ guard
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
        html = ('<script src="/static/js/main.aaaaaaaa.js"></script>'
                '<script src="/static/js/2.bbbbbbbb.chunk.js"></script>')
        self.assertEqual(B.extract_fingerprint(html), "main.aaaaaaaa.js")
```

- [ ] **Step 2: Run tests and verify they fail**
  Run: `cd tools/design-audit && python3 -m unittest engine.test_capture_bundle.Fingerprint -v`
  Expected: FAIL — `AttributeError: … has no attribute 'extract_fingerprint'`

- [ ] **Step 3: Write minimal implementation**

```python
# append to engine/bundle.py
import urllib.request

# A hashed asset name: at least 8 hex chars between separators. Matches CRA's
# `main.<hash>.js` and Next's `<name>-<hash>.js`. An unhashed `/js/app.js` is not a
# fingerprint — it would never change and would make tier 0 always say "unchanged".
_HASHED = re.compile(r"/([A-Za-z0-9_\-]+[.\-][0-9a-f]{8,}(?:\.chunk)?\.js)")


def extract_fingerprint(html):
    hit = _HASHED.search(html or "")
    return hit.group(1) if hit else None


def build_fingerprint(base_url, timeout=10):
    """One HTTP GET of the app shell. Returns None on any failure — callers treat that as
    'unknown', which falls through to the per-screen tier rather than trusting the bundle."""
    try:
        req = urllib.request.Request(base_url, headers={"User-Agent": "mosje-design-audit"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return extract_fingerprint(resp.read(400_000).decode("utf-8", "replace"))
    except Exception:
        return None
```

- [ ] **Step 4: Run tests and verify they pass**
  Run: `cd tools/design-audit && python3 -m unittest engine.test_capture_bundle -v`
  Expected: PASS — 18 tests

- [ ] **Step 5: Commit**

```bash
git add tools/design-audit/engine/bundle.py tools/design-audit/engine/test_capture_bundle.py
git commit -m "feat(design-audit): read the live build fingerprint from the app shell"
```

---

### Task 7: Freshness resolution and the per-screen decision

**Files:**
- Modify: `engine/bundle.py`, `engine/test_capture_bundle.py`

**Interfaces:**
- Produces:
  - `resolve_freshness(b, man, cfg, force=False, verify=False, now=None) -> dict` returning
    `{"mode": "full" | "verify" | "reuse-all", "reason": str}`
  - `decide_screen(prev: dict | None, structure: str, geometry: str) -> str` returning
    `"recapture" | "reshoot" | "reuse"`

- [ ] **Step 1: Write failing test**

```python
# append to engine/test_capture_bundle.py, above the __main__ guard
import datetime


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
```

- [ ] **Step 2: Run tests and verify they fail**
  Run: `cd tools/design-audit && python3 -m unittest engine.test_capture_bundle.Freshness -v`
  Expected: FAIL — `AttributeError: … has no attribute 'resolve_freshness'`

- [ ] **Step 3: Write minimal implementation**

```python
# append to engine/bundle.py
def decide_screen(prev, structure, geometry):
    """reuse | reshoot | recapture.

    `reshoot` means the design is unchanged but the layout moved — the findings carry forward,
    the screenshot does not, because pins are geometry-bound.
    """
    if not prev:
        return "recapture"
    if prev.get("structureHash") != structure:
        return "recapture"
    if prev.get("geometryHash") != geometry:
        return "reshoot"
    return "reuse"


def resolve_freshness(b, man, cfg, force=False, verify=False, now=None, _probe=None):
    """Tier 0. Returns {"mode": full|verify|reuse-all, "reason": …}.

    Never returns reuse-all on a doubt: an unreachable host, an unreadable fingerprint or an
    absent one all fall through to `verify`, which re-checks every screen cheaply.
    """
    if force:
        return {"mode": "full", "reason": "--force"}
    if b is None:
        return {"mode": "full", "reason": "no existing bundle"}
    if not b.get("capturedAt"):
        return {"mode": "full", "reason": "bundle has no capturedAt"}
    now = now or datetime.datetime.now().astimezone()
    age = (now - datetime.datetime.fromisoformat(b["capturedAt"])).total_seconds()
    ceiling = 14 * 86400
    if man is not None:
        from engine import manifest as _M  # local import keeps bundle.py importable standalone
        ceiling = _M.staleness_seconds(man)
    if age > ceiling:
        return {"mode": "full", "reason": f"bundle is stale ({int(age // 86400)}d > {ceiling // 86400}d)"}
    probe = _probe or build_fingerprint
    bases = sorted({r.get("base") for r in cfg.get("live", {}).get("roles", []) if r.get("base")})
    recorded = {h.get("base"): h.get("buildFingerprint") for h in (b.get("hosts") or {}).values()}
    for base in bases:
        live = probe(base)
        if not live:
            return {"mode": "verify", "reason": f"could not read a build fingerprint for {base}"}
        if recorded.get(base) != live:
            return {"mode": "verify", "reason": f"build moved on {base}: {recorded.get(base)} -> {live}"}
    if verify:
        return {"mode": "verify", "reason": "--verify requested"}
    return {"mode": "reuse-all", "reason": "build fingerprint unchanged and bundle is fresh"}
```

- [ ] **Step 4: Run tests and verify they pass**
  Run: `cd tools/design-audit && python3 -m unittest engine.test_capture_bundle -v`
  Expected: PASS — 29 tests

- [ ] **Step 5: Commit**

```bash
git add tools/design-audit/engine/bundle.py tools/design-audit/engine/test_capture_bundle.py
git commit -m "feat(design-audit): three-tier freshness resolution"
```

---

### Task 8: The freshness gate

**Files:**
- Modify: `engine/bundle.py`, `engine/test_capture_bundle.py`
- Creates at runtime: `projects/<name>/out/freshness.md`

**Interfaces:**
- Produces:
  - `verify_integrity(b: dict, project_dir: str) -> list[str]` — slugs whose recorded
    `pngSha256` no longer matches the file on disk (or whose file is missing)
  - `write_freshness(paths: dict, b: dict, resolution: dict, decisions: dict, drift: list[str]) -> bool`
    — writes `out/freshness.md`, returns `False` when the gate FAILs

- [ ] **Step 1: Write failing test**

```python
# append to engine/test_capture_bundle.py, above the __main__ guard
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
```

- [ ] **Step 2: Run tests and verify they fail**
  Run: `cd tools/design-audit && python3 -m unittest engine.test_capture_bundle.Integrity -v`
  Expected: FAIL — `AttributeError: … has no attribute 'verify_integrity'`

- [ ] **Step 3: Write minimal implementation**

```python
# append to engine/bundle.py
def verify_integrity(b, project_dir):
    """A reused screenshot must still be the file the bundle hashed.

    Same corruption class `capture.audit_capture_integrity()` already catches — a stale or
    overwritten PNG that still renders, so every gate passes and the audit silently describes a
    screen that no longer exists. Mechanised here so reuse can never inherit it.
    """
    bad = []
    for s in b.get("screens", []):
        p = os.path.join(project_dir, s.get("png") or "")
        if not s.get("png") or not os.path.exists(p) or sha256_file(p) != s.get("pngSha256"):
            bad.append(s.get("slug"))
    return bad


def write_freshness(paths, b, resolution, decisions, drift):
    ok = not drift
    tally = {}
    for v in (decisions or {}).values():
        tally[v] = tally.get(v, 0) + 1
    lines = [
        "# Freshness gate", "",
        f"**Result:** {'PASS' if ok else 'FAIL'}", "",
        f"- Bundle captured: `{b.get('capturedAt')}`",
        f"- Environment: `{b.get('environment')}`",
        f"- Engine: `{b.get('engineSha')}`",
        f"- Decision: **{resolution.get('mode')}** — {resolution.get('reason')}", "",
    ]
    if tally:
        lines += ["| Decision | Screens |", "|---|---|"]
        lines += [f"| {k} | {v} |" for k, v in sorted(tally.items())] + [""]
    if drift:
        lines += ["## FAIL — reused captures no longer match their recorded hash", "",
                  "Re-capture these before trusting any finding derived from them:", ""]
        lines += [f"- `{s}`" for s in drift] + [""]
    with open(os.path.join(paths["out"], "freshness.md"), "w") as fh:
        fh.write("\n".join(lines))
    return ok
```

- [ ] **Step 4: Run tests and verify they pass**
  Run: `cd tools/design-audit && python3 -m unittest engine.test_capture_bundle -v`
  Expected: PASS — 33 tests

- [ ] **Step 5: Commit**

```bash
git add tools/design-audit/engine/bundle.py tools/design-audit/engine/test_capture_bundle.py
git commit -m "feat(design-audit): freshness gate — reused captures must match their hash"
```

---

### Task 9: Wire reuse into the capture run

**Files:**
- Modify: `engine/capture.py`, `engine/run.py`

**Interfaces:**
- Consumes: `bundle.resolve_freshness`, `bundle.decide_screen`, `bundle.verify_integrity`,
  `bundle.write_freshness`
- Produces: `capture.run(project, only_role=None, allow_empty=False, force=False, verify=False)`

- [ ] **Step 1: Add the flags to `engine/run.py`**

```python
    ap.add_argument("--force", action="store_true",
                    help="ignore any existing capture-bundle.json and re-capture everything")
    ap.add_argument("--verify", action="store_true",
                    help="always run the per-screen freshness check, even when the build "
                         "fingerprint is unchanged (the default for a QC run)")
```

  and change the capture dispatch to:

```python
    if ph in ("capture", "all"):
        print("== PHASE: capture =="); CAP.run(a.project, a.role, a.allow_empty, a.force, a.verify)
```

  Add `"bundle"` to the `--phase` `choices` list, and after the capture dispatch:

```python
    if ph == "bundle":
        print("== PHASE: bundle =="); CAP.refresh(a.project, a.force, a.verify)
```

- [ ] **Step 2: Implement the per-screen reuse path in `capture_role`**
  Inside the per-path loop in `engine/capture.py`, replace the unconditional
  `settled = settle_height(...)` / `shoot(...)` block with:

```python
        vol_selectors = MAN.volatile_selectors(man, slug) if man else []
        prev = B.find_screen(prev_bundle, slug) if prev_bundle else None
        png = os.path.join(paths["captures_live"], f"{slug}.png")
        dpr = cfg.get("capture", {}).get("dpr", 2)

        decision = "recapture"
        if mode == "verify" and prev:
            # Cheap probe: extract only, no settle and no screenshot.
            try:
                probe = pg.evaluate(EXTRACT_JS, {"volatileSelectors": vol_selectors})
                kept, _ = B.mask_rows(probe["rows"], MAN.volatile_patterns(man, slug) if man else [])
                decision = B.decide_screen(prev, B.structure_hash(kept),
                                           B.geometry_hash(kept, probe["pageH"]))
            except Exception:
                decision = "recapture"
        decisions[slug] = decision

        if decision == "reuse" and os.path.exists(png):
            B.upsert_screen(bdl, prev)
            captured.append({"slug": slug, "role": role["name"], "route": path,
                             "url": base + path, "png": prev["png"], "rows": prev["totalRows"],
                             "pageH": prev["pageH"], "pngH": prev["pngH"],
                             "truncated": prev["truncated"]})
            print(f"  = {slug}: reused (design and layout unchanged)", flush=True)
            continue

        settled = settle_height(pg, UNCLIP_JS, width=width, base_h=1000)
        try:
            shoot(pg, png, settled, dpr, width)
        except Exception: pass
```

  `capture_role` gains `prev_bundle`, `mode` and `decisions` parameters; update the signature to
  `def capture_role(pg, role, cfg, paths, bdl, man, prev_bundle, mode, decisions):` and its call
  site accordingly. When `decision == "reshoot"` the code falls through to the normal capture
  path, and the new entry carries `"designUnchanged": True` so Tier-B findings can be carried
  forward. Task 5 already sets `entry["designUnchanged"]` from `decision`, so no further change
  is needed there.

- [ ] **Step 3: Short-circuit the whole run on `reuse-all`**
  In `capture.run()`, after loading `prev_bundle = B.load_bundle(paths)`:

```python
    res = B.resolve_freshness(prev_bundle, man, cfg, force=force, verify=verify)
    print(f"freshness: {res['mode']} — {res['reason']}", flush=True)
    if res["mode"] == "reuse-all":
        drift = B.verify_integrity(prev_bundle, paths["project"])
        ok = B.write_freshness(paths, prev_bundle, res, {}, drift)
        print(("freshness gate: PASS — reusing the existing bundle, no browser launched"
               if ok else f"freshness gate: FAIL — {len(drift)} capture(s) drifted, see out/freshness.md"),
              flush=True)
        return existing
    mode = res["mode"]
```

  and before the final `return out`, write the gate for the browser path too:

```python
    drift = B.verify_integrity(bdl, paths["project"])
    if not B.write_freshness(paths, bdl, res, decisions, drift):
        print(f"freshness gate: FAIL — {len(drift)} capture(s) drifted, see out/freshness.md", flush=True)
```

- [ ] **Step 4: Add `capture.refresh` for `--phase bundle`**

```python
def refresh(project, force=False, verify=True):
    """Re-check freshness without a full capture. `--phase bundle` — what a QC run calls first."""
    return run(project, only_role=None, allow_empty=False, force=force, verify=verify)
```

- [ ] **Step 5: Verify reuse actually happens**
  Run twice against an unchanged site:

```bash
cd tools/design-audit
python3 engine/run.py --project scw --phase capture --force >/dev/null
time python3 engine/run.py --project scw --phase bundle | tee /tmp/reuse.log
grep -c "reused" /tmp/reuse.log
cat projects/scw/out/freshness.md
```

  Expected: the second run prints `freshness: reuse-all …` **or** a `verify` pass with every
  screen `= … reused`; `freshness.md` says `PASS`; the second run is materially faster.

- [ ] **Step 6: Verify the gate catches a tampered capture**

```bash
cd tools/design-audit
cp projects/scw/captures/live/*.png /tmp/orig.png.bak 2>/dev/null || true
python3 -c "
import glob;p=sorted(glob.glob('projects/scw/captures/live/*.png'))[0]
open(p,'ab').write(b'x');print('tampered',p)"
python3 engine/run.py --project scw --phase bundle | tail -3
grep -n "FAIL" projects/scw/out/freshness.md
```

  Expected: the run reports `freshness gate: FAIL` and `freshness.md` names the tampered slug.
  Then restore with `python3 engine/run.py --project scw --phase capture --force`.

- [ ] **Step 7: Commit**

```bash
git add tools/design-audit/engine/capture.py tools/design-audit/engine/run.py
git commit -m "feat(design-audit): reuse a fresh bundle instead of re-traversing"
```

---

### Task 10: Commit the bundle and the audit master

**Files:**
- Modify: `tools/design-audit/.gitignore`

- [ ] **Step 1: Replace the directory exclusion with a contents exclusion**
  In `tools/design-audit/.gitignore`, replace the line `projects/*/out/` with:

```gitignore
# `projects/*/out/` as a DIRECTORY exclusion cannot be undone by a negation — git will not
# descend into an excluded directory, so `!projects/*/out/audit-master.json` below would
# silently do nothing. Exclude the CONTENTS instead, then name the two files back in.
projects/*/out/*
!projects/*/out/capture-bundle.json
!projects/*/out/audit-master.json
```

- [ ] **Step 2: Verify the negation actually works**

```bash
cd tools/design-audit
git check-ignore -v projects/scw/out/capture-bundle.json && echo "STILL IGNORED — wrong" || echo "TRACKED — correct"
git check-ignore -v projects/scw/out/coverage-ledger.json >/dev/null && echo "ledger ignored — correct"
```

  Expected: `TRACKED — correct` and `ledger ignored — correct`.

- [ ] **Step 3: Confirm nothing heavy is about to be committed**

```bash
cd /Users/akashk/Documents/Projects/MoSJE
git add tools/design-audit/.gitignore tools/design-audit/projects/*/out/capture-bundle.json
git status --porcelain | grep "^A" | while read _ f; do du -h "$f"; done
```

  Expected: only `capture-bundle.json` files, each well under 5 MB. If any exceeds that, stop —
  the field inventory is capturing more than intended.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore(design-audit): track capture-bundle.json and audit-master.json"
```

---

# Phase 3 — Driven flows

### Task 11: The step executor

**Files:**
- Create: `engine/drive.py`
- Modify: `engine/test_capture_bundle.py`

**Interfaces:**
- Consumes: `capture.EXTRACT_JS`, `capture.settle_height`, `capture.shoot`, `capture.UNCLIP_JS`,
  `bundle.*`
- Produces:
  - `DESTRUCTIVE` — the compiled regex, moved here from `projects/e-anudaan/capture_review.py`
  - `is_submit_allowed(environment: str, flow: dict) -> tuple[bool, str]`
  - `resolve_fixture(man: dict, step: dict) -> dict`
  - `run_flow(pg, flow, man, cfg, paths, bdl, environment) -> list[dict]`

- [ ] **Step 1: Write failing test** (pure logic only — the browser parts are exercised in Step 6)

```python
# append to engine/test_capture_bundle.py, above the __main__ guard
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
```

- [ ] **Step 2: Run tests and verify they fail**
  Run: `cd tools/design-audit && python3 -m unittest engine.test_capture_bundle.SubmitGating -v`
  Expected: FAIL — `ModuleNotFoundError: No module named 'engine.drive'`

- [ ] **Step 3: Write minimal implementation**

```python
#!/usr/bin/env python3
"""Execute a manifest flow — the states a route-crawl cannot reach.

The engine's declarative crawl reads the sidebar, and nothing in any sidebar links a wizard's
step 4 or a confirm dialog. Those are the highest-value screens in a portal and, until now, were
reached by bespoke per-project drivers written once and discarded. This module replaces them.

SAFETY. Submission is gated twice: the environment must be dev or uat, AND the flow must set
`allowSubmit: true`. On prod the run stops and asks for a human. The DESTRUCTIVE regex is the
prod guard, not a blanket ban — walking a wizard to its end on dev/uat is the point.
"""
import os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bundle as B
import manifest as MAN
from capture import EXTRACT_JS, UNCLIP_JS, settle_height, shoot, slugify  # noqa: E402

DESTRUCTIVE = re.compile(
    r"forward|approve|reject|sanction|concur|submit|deficien|quer|return|save|confirm|delete|send",
    re.I,
)

SAFE_ENVIRONMENTS = ("dev", "uat")


def is_submit_allowed(environment, flow):
    """(allowed, reason). Both gates must open."""
    if not flow.get("allowSubmit"):
        return False, f"flow {flow.get('id')!r} does not set allowSubmit"
    if environment not in SAFE_ENVIRONMENTS:
        return False, (f"environment is {environment!r} — submission on prod needs a human; "
                       f"re-run with the flow disabled or confirm interactively")
    return True, "dev/uat and the flow opted in"


def resolve_fixture(man, step):
    spec = dict((step or {}).get("fill") or {})
    name = spec.pop("fixture", None)
    base = dict(((man or {}).get("fixtures") or {}).get(name) or {}) if name else {}
    base.update(spec)
    return base
```

- [ ] **Step 4: Run tests and verify they pass**
  Run: `cd tools/design-audit && python3 -m unittest engine.test_capture_bundle -v`
  Expected: PASS — 40 tests

- [ ] **Step 5: Add the browser-driving half to `engine/drive.py`**

```python
def _fill(pg, values):
    """Fill by field name, then id, then label. Missing fields are skipped, not fatal —
    a wizard step legitimately shows a subset of the fixture."""
    for key, val in (values or {}).items():
        for sel in (f'[name="{key}"]', f'#{key}'):
            try:
                if pg.query_selector(sel):
                    pg.fill(sel, str(val)); break
            except Exception:
                continue
        else:
            try:
                pg.get_by_label(key, exact=False).first.fill(str(val))
            except Exception:
                print(f"    · no field for {key!r} on this step", flush=True)


def _capture_state(pg, slug, role, cfg, paths, bdl, man, flow_id, wizard):
    width = cfg.get("capture", {}).get("width", 1440)
    dpr = cfg.get("capture", {}).get("dpr", 2)
    vol = MAN.volatile_selectors(man, slug)
    settled = settle_height(pg, UNCLIP_JS, width=width, base_h=1000)
    png = os.path.join(paths["captures_live"], f"{slug}.png")
    shoot(pg, png, settled, dpr, width)
    data = pg.evaluate(EXTRACT_JS, {"volatileSelectors": vol})
    data["role"] = role; data["route"] = pg.url; data["slug"] = slug
    data["figmaImg"] = None; data["url"] = pg.url
    import json
    json.dump(data, open(os.path.join(paths["captures_live"], f"{slug}.json"), "w"), indent=2)
    kept, masked = B.mask_rows(data["rows"], MAN.volatile_patterns(man, slug))
    B.upsert_screen(bdl, B.screen_entry(
        slug=slug, role=role, route=pg.url, url=pg.url, reached_by=f"flow:{flow_id}",
        png=f"captures/live/{slug}.png", png_sha256=B.sha256_file(png),
        png_h=None, page_h=data["pageH"], truncated=False,
        rows_path=f"captures/live/{slug}.json",
        structure=B.structure_hash(kept), geometry=B.geometry_hash(kept, data["pageH"]),
        masked=masked, total=len(data["rows"]), fields=data.get("fields") or [],
        wizard=wizard, captured_at=B.now_iso()))
    print(f"  ok {slug}: {len(data['rows'])} rows (flow {flow_id})", flush=True)


def run_flow(pg, flow, man, cfg, paths, bdl, environment):
    """Walk one flow, capturing each declared state. Returns the slugs captured."""
    role = flow.get("role") or "citizen"
    fid = flow["id"]
    allowed, why = is_submit_allowed(environment, flow)
    print(f"[flow {fid}] submission {'ALLOWED' if allowed else 'BLOCKED'} — {why}", flush=True)
    base = next((r["base"] for r in cfg["live"]["roles"] if r["name"] == role), None)
    if flow.get("entry") and base:
        pg.goto(base + flow["entry"], wait_until="networkidle", timeout=45000)
        pg.wait_for_timeout(cfg.get("capture", {}).get("waitMs", 1800))
    done, step_no = [], 0
    steps = flow.get("steps") or []
    total = sum(1 for s in steps if "capture" in s)
    for step in steps:
        if "fill" in step:
            _fill(pg, resolve_fixture(man, step))
        elif "click" in step:
            label = step["click"]
            if DESTRUCTIVE.search(label) and not allowed:
                print(f"    ! stopping before {label!r} — {why}", flush=True)
                break
            try:
                pg.get_by_role("button", name=label, exact=False).first.click()
            except Exception:
                pg.click(f'button:has-text("{label}")')
            pg.wait_for_timeout(step.get("waitMs", 2500))
        elif "capture" in step:
            step_no += 1
            _capture_state(pg, step["capture"], role, cfg, paths, bdl, man, fid,
                           {"flow": fid, "step": step_no, "of": total})
            done.append(step["capture"])
        elif "captureValidation" in step:
            # Submit the step empty to reveal inline errors, shoot, then reload to reset.
            try:
                pg.get_by_role("button", name=re.compile("next|save|submit", re.I)).first.click()
                pg.wait_for_timeout(1200)
            except Exception:
                pass
            _capture_state(pg, step["captureValidation"], role, cfg, paths, bdl, man, fid, None)
            done.append(step["captureValidation"])
            pg.reload(wait_until="networkidle"); pg.wait_for_timeout(1500)
    return done
```

- [ ] **Step 6: Prove a flow works against a real portal**
  Author a minimal `projects/scw/screen-manifest.yaml` with one flow of two `capture` steps and
  no `allowSubmit`, then:
  `cd tools/design-audit && python3 engine/run.py --project scw --phase capture --force`
  Expected: `[flow …] submission BLOCKED` and two new `ok <SLUG>` lines with `(flow …)`.

- [ ] **Step 7: Commit**

```bash
git add tools/design-audit/engine/drive.py tools/design-audit/engine/test_capture_bundle.py tools/design-audit/projects/scw/screen-manifest.yaml
git commit -m "feat(design-audit): drive manifest flows to reach wizard and modal states"
```

---

### Task 12: Record reuse, flow replay, and manifest seeding

**Files:**
- Modify: `engine/drive.py`, `engine/capture.py`, `engine/bootstrap.py`, `engine/test_capture_bundle.py`

**Interfaces:**
- Produces:
  - `should_replay(flow: dict, prev_bundle: dict | None, decisions: dict) -> bool`
  - `bootstrap.seed_manifest(project: str) -> str` — writes a starter `screen-manifest.yaml`

- [ ] **Step 1: Write failing test**

```python
# append to engine/test_capture_bundle.py, above the __main__ guard
class FlowReplay(unittest.TestCase):
    FLOW = {"id": "apply", "entry": "/apply/step-1", "steps": [{"capture": "S1"}]}

    def test_no_previous_bundle_means_replay(self):
        self.assertTrue(D.should_replay(self.FLOW, None, {}))

    def test_always_replay_wins(self):
        b = {"screens": [{"slug": "S1", "reachedBy": "flow:apply"}]}
        self.assertTrue(D.should_replay(dict(self.FLOW, alwaysReplay=True), b, {}))

    def test_unchanged_entry_screen_means_skip(self):
        b = {"screens": [{"slug": "S1", "reachedBy": "flow:apply"}]}
        self.assertFalse(D.should_replay(self.FLOW, b, {"APPLY-STEP-1": "reuse"}))

    def test_changed_entry_screen_means_replay(self):
        b = {"screens": [{"slug": "S1", "reachedBy": "flow:apply"}]}
        self.assertTrue(D.should_replay(self.FLOW, b, {"APPLY-STEP-1": "recapture"}))
```

- [ ] **Step 2: Run tests and verify they fail**
  Run: `cd tools/design-audit && python3 -m unittest engine.test_capture_bundle.FlowReplay -v`
  Expected: FAIL — `AttributeError: … has no attribute 'should_replay'`

- [ ] **Step 3: Write minimal implementation**

```python
# append to engine/drive.py
def should_replay(flow, prev_bundle, decisions):
    """Tier 2. Replay a flow only when its entry screen moved, or nothing is known about it.

    Driving a flow is the expensive tier — it fills forms and clicks through a wizard. Skipping
    it when the entry screen is byte-identical is the whole point of the bundle.
    """
    if flow.get("alwaysReplay"):
        return True
    if not prev_bundle:
        return True
    captured = [s for s in prev_bundle.get("screens", [])
                if s.get("reachedBy") == f"flow:{flow['id']}"]
    if not captured:
        return True
    entry_slug = slugify(flow.get("role") or "citizen", flow.get("entry") or "")
    verdict = (decisions or {}).get(entry_slug)
    if verdict is None:
        return False
    return verdict != "reuse"
```

- [ ] **Step 4: Persist and reuse created records**
  In `engine/drive.py`, at the end of `run_flow`, before `return done`:

```python
    if allowed and flow.get("reuseRecord") is None:
        # Harvest whatever identifier the success screen shows, so the next run edits/views that
        # record instead of filing a fresh application on dev every time.
        try:
            txt = pg.inner_text("body")
            hit = re.search(r"\b([A-Z]{2,}[-/][A-Z0-9\-/]{4,})\b", txt)
            if hit:
                bdl.setdefault("records", {})[fid] = {"id": hit.group(1), "createdAt": B.now_iso()}
                print(f"    · recorded {fid} -> {hit.group(1)} (re-used on the next run)", flush=True)
        except Exception:
            pass
```

- [ ] **Step 5: Call flows from `capture.run`**
  In `engine/capture.py`, inside the per-role block after `capture_role(...)` returns:

```python
                for flow in (man or {}).get("flows") or []:
                    if flow.get("role") != role["name"]:
                        continue
                    if not DRV.should_replay(flow, prev_bundle, decisions):
                        for s in (prev_bundle or {}).get("screens", []):
                            if s.get("reachedBy") == f"flow:{flow['id']}":
                                B.upsert_screen(bdl, s)
                        print(f"[flow {flow['id']}] skipped — entry screen unchanged", flush=True)
                        continue
                    if flow.get("reuseRecord") is None and (prev_bundle or {}).get("records", {}).get(flow["id"]):
                        flow["reuseRecord"] = prev_bundle["records"][flow["id"]]["id"]
                    DRV.run_flow(pg, flow, man, cfg, paths, bdl, env)
```

  and add `import drive as DRV` beside the other engine imports.

- [ ] **Step 6: Seed a manifest from an existing capture**
  In `engine/bootstrap.py`, add:

```python
def seed_manifest(project):
    """Write a starter screen-manifest.yaml from whatever has already been captured.

    Authoring one from nothing is the main adoption cost, so give the user a file that already
    lists their screens and only needs volatiles and flows added by hand.
    """
    import json as _json
    import config as _C
    pdir = _C.project_dir(project)
    path = os.path.join(pdir, "screen-manifest.yaml")
    if os.path.exists(path):
        print(f"screen-manifest.yaml already exists at {path} — not overwriting")
        return path
    mpath = os.path.join(pdir, "captures", "_captured.json")
    rows = _json.load(open(mpath)) if os.path.exists(mpath) else []
    lines = ["version: 1", "environment: uat  # dev | uat | prod", "stalenessCeiling: 14d", "",
             "volatile:", "  # Content that changes on every load. Without these, dashboards look",
             "  # dirty on every run and the per-screen freshness tier stops meaning anything.",
             "  - pattern: '\\b\\d{2}/\\d{2}/\\d{4}\\b'", "",
             "fixtures: {}", "", "screens:"]
    for r in rows:
        lines += [f"  - slug: {r.get('slug')}", f"    route: {r.get('route')}",
                  f"    roles: [{r.get('role')}]"]
    lines += ["", "flows: []  # add wizards, modals and validation states here", ""]
    with open(path, "w") as fh:
        fh.write("\n".join(lines))
    print(f"seeded {path} with {len(rows)} screens")
    return path
```

  and expose it: `python3 -c "import sys;sys.path.insert(0,'engine');import bootstrap;bootstrap.seed_manifest('scw')"`

- [ ] **Step 7: Run the full suite and a real end-to-end capture**
  Run: `cd tools/design-audit && python3 -m unittest engine.test_capture_bundle -v && python3 engine/run.py --project scw --phase all`
  Expected: all tests PASS; the run completes; `out/freshness.md` says PASS; `out/failures.md`
  is empty and `out/crosscheck.md` is not FAIL.

- [ ] **Step 8: Commit**

```bash
git add tools/design-audit/engine/
git commit -m "feat(design-audit): flow replay decisions, record reuse and manifest seeding"
```

---

# Phase 4 — Report figures

### Task 13: Derive WebP figures

**Files:**
- Create: `engine/figures.py`
- Modify: `engine/run.py`

**Interfaces:**
- Produces: `derive(project: str, out_dir: str, max_width: int = 1440, quality: int = 80) -> list[str]`

- [ ] **Step 1: Write the implementation**

```python
#!/usr/bin/env python3
"""Derive web-servable report figures from the local capture corpus.

The Hub serves /reports/<slug> at runtime, so its figures must be committed — but the raw corpus
is 220 MB across six portals and a previous attempt at committing full-resolution PNGs was
reverted for weight (PERF-007). Only the boards a report actually cites need to outlive the run,
and WebP at a capped width brings that set to single-digit MB.
"""
import json, os, sys
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config as C


def derive(project, out_dir, max_width=1440, quality=80):
    cfg, paths = C.load(project)
    master = os.path.join(paths["out"], "audit-master.json")
    if not os.path.exists(master):
        print("no audit-master.json — run analyze first"); return []
    data = json.load(open(master))
    slugs = {s.get("slug") for s in data.get("screens", []) if s.get("slug")}
    os.makedirs(out_dir, exist_ok=True)
    written = []
    for slug in sorted(slugs):
        src = os.path.join(paths["captures_live"], f"{slug}.png")
        if not os.path.exists(src):
            continue
        img = Image.open(src).convert("RGB")
        if img.width > max_width:
            img = img.resize((max_width, round(img.height * max_width / img.width)), Image.LANCZOS)
        dst = os.path.join(out_dir, f"{slug}.webp")
        img.save(dst, "WEBP", quality=quality, method=6)
        written.append(dst)
    total = sum(os.path.getsize(p) for p in written)
    print(f"figures: {len(written)} webp, {total / 1e6:.1f} MB -> {out_dir}")
    return written
```

- [ ] **Step 2: Add the phase to `engine/run.py`**
  Add `"figures"` to the `--phase` choices, `import figures as FIG`, and:

```python
    if ph == "figures":
        hub = os.path.join(os.path.dirname(os.path.dirname(ENGINE)),
                           "apps", "hub", "public", "reports", a.project, "figures")
        print("== PHASE: figures =="); FIG.derive(a.project, hub)
```

- [ ] **Step 3: Run it and check the weight**
  Run: `cd tools/design-audit && python3 engine/run.py --project scw --phase figures`
  Then: `du -sh /Users/akashk/Documents/Projects/MoSJE/apps/hub/public/reports/scw/figures`
  Expected: a size in single-digit MB. If it exceeds 10 MB, lower `quality` to 70 and re-run
  before committing — the whole point is not to repeat PERF-007.

- [ ] **Step 4: Confirm the existing ignore does not catch the new portal**

```bash
cd /Users/akashk/Documents/Projects/MoSJE
git check-ignore -v apps/hub/public/reports/scw/figures/ && echo "IGNORED — investigate" || echo "TRACKED — correct"
```

  Expected: `TRACKED — correct`. The PERF-007 ignore is scoped to
  `apps/hub/public/reports/eutthan-admin/figures/` alone and must stay that way.

- [ ] **Step 5: Commit**

```bash
git add tools/design-audit/engine/figures.py tools/design-audit/engine/run.py apps/hub/public/reports/scw/figures
git commit -m "feat(design-audit): derive webp report figures for the Hub"
```

---

### Task 14: Document the new workflow

**Files:**
- Modify: `tools/design-audit/AUDIT-A-PORTAL.md`, `tools/design-audit/README.md`,
  `.claude/rules/design-audit.md`, `docs/qc/README.md`

- [ ] **Step 1: Add a step to `AUDIT-A-PORTAL.md`**
  Insert between the current steps 2 and 3, and renumber the rest:

```markdown
## 2b. Reuse the clone capture (skip if this portal was never cloned)
If the portal was cloned within the staleness window, its capture bundle already holds every
screen, wizard step and modal state — do not traverse it again:

```bash
cd tools/design-audit
python3 engine/run.py --project <name> --phase bundle    # tier 0 + tier 1, reuses what is unchanged
```

`out/freshness.md` records the decision and is a **gate**: it FAILs when a reused capture no
longer matches the hash recorded for it. `--force` re-captures everything; `--verify` always runs
the per-screen check. The traversal recipe lives in `projects/<name>/screen-manifest.yaml`.
```

- [ ] **Step 2: Add the freshness gate to the gates table in `AUDIT-A-PORTAL.md`**

```markdown
| Freshness | `out/freshness.md` | a reused capture no longer matches its recorded sha256 |
```

- [ ] **Step 3: Add the new modules to `.claude/rules/design-audit.md`**
  Under the "Two things ARE legitimately per-portal" bullet, append:

```markdown
- **Interactive drivers are now declarative.** New flows belong in
  `projects/<name>/screen-manifest.yaml` and are executed by `engine/drive.py`. Do not write a
  new bespoke `projects/<name>/*.py` capture driver — the existing ones keep working and migrate
  portal by portal. Submission is gated by `environment` (dev/uat auto, prod human) **and** by
  the flow's own `allowSubmit`.
```

- [ ] **Step 4: Note the shared capture in `docs/qc/README.md`**
  Under "How it works (per screen)", after item 2:

```markdown
> **Live truth is captured once.** A portal cloned within the staleness window already has a
> `capture-bundle.json`; the QC run reuses it and re-captures only what moved. See
> `tools/design-audit/AUDIT-A-PORTAL.md` §2b.
```

- [ ] **Step 5: Verify the docs gates still pass**
  Run: `cd /Users/akashk/Documents/Projects/MoSJE && npm run check:docs-links 2>/dev/null || node tools/docs-links/check.mjs`
  Expected: no broken links.

- [ ] **Step 6: Commit**

```bash
git add tools/design-audit/AUDIT-A-PORTAL.md tools/design-audit/README.md .claude/rules/design-audit.md docs/qc/README.md
git commit -m "docs(design-audit): the shared capture bundle and the freshness gate"
```

---

## Definition of done

- `python3 -m unittest engine.test_capture_bundle -v` passes — 44 tests.
- A second run against an unchanged portal launches no browser (`reuse-all`) or reuses every
  screen (`verify`), and is materially faster than the first.
- Tampering with one captured PNG makes `out/freshness.md` FAIL and name that slug.
- The four existing gates — coverage, mapping, pins, fresh PDF — still pass unchanged.
- A tg QC run reusing a fresh bundle produces the same finding set as a full re-capture.
- `capture-bundle.json` and `audit-master.json` are tracked; `captures/` is not.
- A portal with no Figma design still produces a bundle:
  `python3 engine/run.py --project e-anudaan --phase capture` writes
  `projects/e-anudaan/out/capture-bundle.json` and never reads `inputs/figma-frames.json`.
