#!/usr/bin/env python3
"""Execute a manifest flow — the states a route-crawl cannot reach.

The engine's declarative crawl reads the sidebar, and nothing in any sidebar links a wizard's
step 4 or a confirm dialog. Those are the highest-value screens in a portal and, until now, were
reached by bespoke per-project drivers written once and discarded. This module replaces them.

SAFETY. Submission is gated twice: the environment must be dev or uat, AND the flow must set
`allowSubmit: true`. The DESTRUCTIVE regex is the prod guard, not a blanket ban — walking a
wizard to its end on dev/uat is the point.

What `prod` actually does, precisely: nothing prompts, halts or waits for a human. A flow on
prod still navigates to its entry, still runs its `fill` steps against the live form, and still
clicks labels that do not match DESTRUCTIVE. What it refuses is a destructive click — that step
is logged and skipped (or, for a forward `click`, the rest of the flow is abandoned). Run a flow
against prod only if filling its form with fixture data is itself acceptable.

The gate is applied TWICE per click: once against the label the step declared, and again
against the accessible name of the element that label actually resolved to (see `_click`).
"""
import json, os, re, sys

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
    """(allowed, reason). Both gates must open.

    `allowSubmit` must be the boolean `True` — not truthy. YAML makes it trivial to write
    `allowSubmit: "false"`, a non-empty string that a bare `if not flow.get(...)` would treat
    as opening the gate. Anything other than the literal `True` blocks, and the reason names
    what was actually found so a flow author sees exactly why.
    """
    val = flow.get("allowSubmit")
    if val is not True:
        return False, f"flow {flow.get('id')!r} allowSubmit is {val!r}, not True"
    env = str(environment or "").strip().lower()
    if env not in SAFE_ENVIRONMENTS:
        return False, (f"environment is {environment!r} — destructive clicks are refused and "
                       f"logged; nothing prompts, so re-run against dev/uat to walk the flow")
    return True, "dev/uat and the flow opted in"


def resolve_fixture(man, step):
    spec = dict((step or {}).get("fill") or {})
    name = spec.pop("fixture", None)
    base = dict(((man or {}).get("fixtures") or {}).get(name) or {}) if name else {}
    base.update(spec)
    return base


FILL_ALL_JS = """(F)=>{let n=0;
 document.querySelectorAll('input,select,textarea').forEach(e=>{
  if(e.type==='hidden'||e.disabled||e.readOnly||e.type==='file')return;
  if(e.tagName==='SELECT'){const o=[...e.options].find(o=>o.value&&o.value!=='');
    if(o&&!e.value){e.value=o.value;e.dispatchEvent(new Event('change',{bubbles:true}));n++;}return;}
  if(e.type==='radio'){
    const grp=[...document.querySelectorAll('input[type=radio][name="'+e.name+'"]')];
    if(grp.some(r=>r.checked))return;
    const lab=r=>((r.labels&&r.labels[0]?r.labels[0].innerText:'')+' '+(r.value||'')).toLowerCase();
    (grp.find(r=>/fresh|new/.test(lab(r)))||grp[0]).click();n++;return;}
  if(e.type==='checkbox'){if(!e.checked){e.click();n++;}return;}
  if(!e.value){const set=Object.getOwnPropertyDescriptor(e.__proto__,'value').set;
    set.call(e,F[e.type]||F.text);
    e.dispatchEvent(new Event('input',{bubbles:true}));
    e.dispatchEvent(new Event('change',{bubbles:true}));n++;}});
 return n;}"""

DEFAULT_VALUES = {"text": "Example Welfare Society", "textarea": "12 Example Road, Nagpur 440001",
                  "email": "contact@example-welfare.org", "tel": "9800000000", "number": "10",
                  "date": "2020-04-01", "url": "https://example-welfare.org", "search": "Example"}


def fill_all(pg, values=None, passes=3):
    """Populate every empty control on the current step with type-appropriate placeholder data.

    A government grant wizard has 100+ fields across a dozen steps; naming each one in the manifest
    is neither practical nor useful, because what the capture needs is a step that VALIDATES, not
    specific values. Radio groups prefer a `fresh`/`new` option so the walk follows the new-
    application path rather than a renewal path that demands an existing case. Runs several passes
    because conditional fields only mount after an earlier change settles.
    """
    vals = {**DEFAULT_VALUES, **(values or {})}
    total = 0
    for _ in range(passes):
        try:
            total += pg.evaluate(FILL_ALL_JS, vals)
        except Exception as e:
            print(f"    ! fill-all failed ({str(e)[:60]})", flush=True)
            break
        pg.wait_for_timeout(700)
    return total


def upload_all(pg, path, limit=None):
    """Attach the same fixture file to every file input on the step.

    An upload step whose forward control is disabled until every mandatory slot is filled cannot be
    walked past without this, and those steps are where the highest-value screens sit.
    """
    inputs = pg.query_selector_all("input[type=file]")
    done = 0
    for el in inputs[: limit or len(inputs)]:
        try:
            el.set_input_files(path)
            done += 1
            pg.wait_for_timeout(350)
        except Exception as e:
            print(f"    ! upload to slot {done + 1} failed ({str(e)[:50]})", flush=True)
    print(f"    uploaded {done}/{len(inputs)} document slot(s)", flush=True)
    return done


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



STEP_LABEL_JS = """()=>{const m=document.body.innerText.match(
 /Step\\s+(\\d+)\\s*(?:of|\\/)?\\s*(\\d+)?\\s*[\\u2014\\u2013-]\\s*([^\\n]{1,60})/);
 return m?{n:+m[1],of:m[2]?+m[2]:null,title:m[3].trim()}:null;}"""

FORWARD_LABELS = ("Save & Next", "Next", "Continue", "Proceed")
SUBMIT_LABELS = ("Submit Application", "Submit")


def step_label(pg):
    """Read `Step N of M — Title` off the page. A single-URL SPA wizard advertises its position
    nowhere else — `pg.url` is identical on every internal step, which is why an earlier version
    of this walker believed the form had not advanced when it had."""
    try:
        return pg.evaluate(STEP_LABEL_JS)
    except Exception:
        return None


def _position(pg):
    lab = step_label(pg) or {}
    return (pg.url, lab.get("n"), lab.get("title"))


def _walk_slug(prefix, pos, seen):
    """Deterministic, human-readable, and stable across runs — the slug is what the freshness
    hashes are filed under, so it must not shift when a scheme gains or loses a section."""
    _, n, title = pos
    # The page's step line is "Application Type. Fields marked * are mandatory." — the sentence
    # after the first stop is boilerplate repeated on every step, and carrying it into the slug
    # produced NGO-NAPDDR-S04-LOCATION-INFRASTRUCTURE-PREPAREDNESS-FIELDS-MARKED-ARE, truncated
    # mid-word with the identifying half squeezed out.
    head = (title or "step").split(".")[0]
    part = re.sub(r"-+", "-", re.sub(r"[^A-Za-z0-9]+", "-", head)).strip("-")[:44] or "step"
    base = f"{prefix}-S{n:02d}-{part}".upper() if n else f"{prefix}-{part}".upper()
    if base in seen:                      # a repeated title would otherwise overwrite its twin
        base = f"{base}-{seen[base] + 1}"
    return base


UPLOAD_COUNTER = re.compile(r"(\d+)\s*/\s*(\d+)\s+uploaded", re.I)

FORWARD_READY_JS = """(labels)=>{
 const bs=[...document.querySelectorAll('button')];
 const m=bs.find(b=>labels.some(l=>(b.innerText||'').toLowerCase().includes(l.toLowerCase())));
 if(!m) return 'absent';
 return (m.disabled||m.getAttribute('aria-disabled')==='true')?'disabled':'ready';}"""


def upload_status(pg):
    """(done, total) from the step's own "N / M uploaded" counter, or None."""
    try:
        m = UPLOAD_COUNTER.search(pg.inner_text("body") or "")
    except Exception:
        return None
    return (int(m.group(1)), int(m.group(2))) if m else None


def wait_for_forward(pg, labels, timeout_ms=120000, poll_ms=2000):
    """Wait until a forward control is present AND enabled.

    e-Anudaan disables "Next →" while it verifies uploaded documents and says so on the page:
    "Checking 12 documents… this takes a few seconds. Next opens as soon as the check completes."
    Clicking regardless spent Playwright's whole 30s actionability timeout and then reported the
    step as blocked — turning a portal behaving correctly into three flows that stopped one step
    short of their review pages.
    """
    waited = 0
    while waited < timeout_ms:
        try:
            state = pg.evaluate(FORWARD_READY_JS, list(labels))
        except Exception:
            return True                       # cannot tell — let the click try and report
        if state == "ready":
            return True
        if waited == 0:
            print(f"    · forward control is {state} — waiting up to {timeout_ms // 1000}s",
                  flush=True)
        pg.wait_for_timeout(poll_ms)
        waited += poll_ms
    print(f"    ! forward control still not enabled after {timeout_ms // 1000}s", flush=True)
    return False


SET_FIELD_JS = """([field,value])=>{
 const norm=t=>(t||'').replace(/\\s+/g,' ').trim().toLowerCase();
 // A field is named "case_type" in the DOM and "Case Type" in a manifest. Comparing those with
 // whitespace normalisation alone fails on the underscore, which is how every branch in the
 // first run aborted with "could not be set".
 const key=t=>norm(t).replace(/[^a-z0-9]/g,'');
 const want=norm(value);
 const labelOf=e=>{
   if(e.labels&&e.labels[0])return e.labels[0].innerText;
   if(e.getAttribute('aria-label'))return e.getAttribute('aria-label');
   const w=e.closest('label'); return w?w.innerText:'';
 };
 const matchField=e=>{
   const n=key(field);
   return key(e.name)===n||key(e.id)===n||key(labelOf(e)).includes(n);
 };
 for(const e of document.querySelectorAll('input[type=radio]')){
   if(!matchField(e))continue;
   if(norm(labelOf(e))===want||norm(e.value)===want||norm(labelOf(e)).includes(want)){
     if(!e.checked){e.click();}
     return 'radio';
   }
 }
 for(const e of document.querySelectorAll('select')){
   if(!matchField(e))continue;
   const o=[...e.options].find(o=>norm(o.text)===want||norm(o.text).includes(want));
   if(o){e.value=o.value;e.dispatchEvent(new Event('change',{bubbles:true}));return 'select';}
 }
 for(const e of document.querySelectorAll('input[type=checkbox]')){
   if(!matchField(e))continue;
   const on=['yes','true','on','checked'].includes(want);
   if(e.checked!==on){e.click();}
   return 'checkbox';
 }
 return null;}"""


def set_field(pg, field, value):
    """Set ONE controlling field to a named value, whatever control renders it.

    `fill_all` deliberately never overwrites an answer that is already there — which is right for
    filling a form and wrong for choosing a branch. A saved draft set to "Ongoing / Renewal" is
    how 43 wizard screens were captured on one path while the other was never seen: the walker
    filled around the controller and never touched it.
    """
    try:
        kind = pg.evaluate(SET_FIELD_JS, [field, value])
    except Exception as e:
        print(f"    ! set {field!r} failed ({str(e)[:60]})", flush=True)
        return False
    if kind:
        pg.wait_for_timeout(1200)
        print(f"    · set {field!r} = {value!r} ({kind})", flush=True)
        return True
    print(f"    ! no control matched {field!r} — branch NOT set, so the walk that follows would "
          f"repeat the branch already captured", flush=True)
    return False


def _is_review(pos, lab):
    """Is this the wizard's final review-and-submit page?

    Matching the TITLE loosely is wrong and cost three steps per scheme: a first attempt tested
    `review|declar|submit`, which matched "Verification & Declaration" (step 8 of 10) and
    "Grant Sought & Declaration" — so the walker declared the review page reached, tried to
    submit, found no Submit button and stopped, three steps short of the document uploads and
    the real review page. Position is the reliable signal; the title is only consulted for the
    exact phrase a review page actually uses.
    """
    url, n, title = pos
    if "/review" in (url or ""):
        return True
    of = (lab or {}).get("of")
    if n and of and n >= of:
        return True
    return bool(re.search(r"review\s*(&|and)\s*submit", title or "", re.I))


def walk_wizard(pg, spec, flow, man, cfg, paths, bdl, role, fid, allowed, why):
    """Walk a multi-step wizard to its end, discovering the steps rather than declaring them.

    Every scheme in a grant portal has a DIFFERENT number of internal sections behind the same
    two URLs, so a manifest that numbers its capture steps by hand is wrong the moment a scheme
    is added — and wrong silently, filing a document page under a review page's name. This walks
    until the page stops advancing, naming each state after the step title the page itself shows.
    """
    prefix = spec.get("prefix") or fid.upper()
    max_steps = int(spec.get("maxSteps", 24))
    upload_file = spec.get("upload")
    upload_path = os.path.join(paths["project"], upload_file) if upload_file else None
    if upload_path and not os.path.exists(upload_path):
        print(f"    ! upload fixture missing: {upload_path}", flush=True)
        upload_path = None
    forward = tuple(spec.get("forward") or FORWARD_LABELS)
    done, seen, submitted = [], {}, False

    for _ in range(max_steps):
        pos = _position(pg)
        slug = _walk_slug(prefix, pos, seen)
        seen[slug] = seen.get(slug, 0) + 1
        on_review = _is_review(pos, step_label(pg))

        _capture_state(pg, f"{slug}-ARRIVED", role, cfg, paths, bdl, man, fid,
                       {"flow": fid, "step": len(done) + 1, "of": max_steps})
        done.append(f"{slug}-ARRIVED")

        filled = fill_all(pg, spec.get("values"), spec.get("passes", 3))
        uploaded = 0
        if upload_path:
            n_slots = len(pg.query_selector_all("input[type=file]"))
            status = upload_status(pg)
            if status and status[0] >= status[1] > 0:
                # Every slot already holds a document. Replacing them costs nothing and breaks
                # something: the portal re-verifies each new file and holds the forward control
                # shut until it finishes, so re-uploading a complete, already-verified set is
                # how a walk gets stuck on a step that was ready when it arrived.
                print(f"    · {status[0]}/{status[1]} already uploaded — leaving them alone",
                      flush=True)
            elif n_slots:
                uploaded = upload_all(pg, upload_path)
                pg.wait_for_timeout(spec.get("uploadSettleMs", 3000))
                fill_all(pg, spec.get("values"), 1)   # slots that mount only after a file lands
        print(f"    step {pos[1]} {pos[2]!r}: filled {filled}, uploaded {uploaded}", flush=True)

        _capture_state(pg, f"{slug}-FILLED", role, cfg, paths, bdl, man, fid, None)
        done.append(f"{slug}-FILLED")

        if on_review:
            submitted = _submit_review(pg, spec, prefix, role, cfg, paths, bdl, man, fid,
                                       allowed, why, done)
            break

        wait_for_forward(pg, forward, spec.get("forwardTimeoutMs", 120000))
        moved = False
        for label in forward:
            if _destructive_and_blocked(label, allowed):
                continue
            if _click(pg, label, spec.get("waitMs", 3000), allowed):
                pg.wait_for_timeout(spec.get("settleMs", 1200))
                if _position(pg) != pos:
                    moved = True
                    break
                print(f"    · {label!r} clicked but the wizard stayed on step {pos[1]}", flush=True)
        if not moved:
            print(f"[flow {fid}] STOPPED at step {pos[1]} {pos[2]!r} — no forward control "
                  f"advanced the wizard. Captured {len(done)} state(s); nothing beyond this "
                  f"point is captured rather than filed under the wrong name.", flush=True)
            break
    else:
        print(f"[flow {fid}] hit maxSteps={max_steps} without reaching a review page", flush=True)

    if not submitted:
        print(f"[flow {fid}] did NOT reach a completed submission", flush=True)
    return done


def _submit_review(pg, spec, prefix, role, cfg, paths, bdl, man, fid, allowed, why, done):
    """Tick the declaration, submit, and capture the acknowledgement. Returns whether the
    submission actually went through — the caller reports it, because a flow that stops one
    click short of the confirmation screen looks identical to a complete one in the bundle."""
    labels = tuple(spec.get("submit") or SUBMIT_LABELS)
    if not allowed:
        print(f"    ! review reached but submission is blocked — {why}", flush=True)
        return False
    for label in labels:
        if _click(pg, label, spec.get("submitWaitMs", 6000), allowed):
            pg.wait_for_timeout(spec.get("confirmSettleMs", 3000))
            _capture_state(pg, f"{prefix}-SUBMITTED", role, cfg, paths, bdl, man, fid, None)
            done.append(f"{prefix}-SUBMITTED")
            print(f"[flow {fid}] SUBMITTED — acknowledgement captured as {prefix}-SUBMITTED",
                  flush=True)
            return True
    print(f"    ! none of {labels} resolved on the review page — not submitted", flush=True)
    return False


def _reload(pg):
    """Reload, tolerating an SPA that never reaches networkidle.

    e-Anudaan keeps a long-lived connection open, so `wait_until="networkidle"` times out after
    30s and RAISES — which aborted the whole role from inside a flow, taking the two flows that
    had not run yet with it. Same two-attempt pattern the entry `goto` uses, and a failure here
    is reported, not fatal: the page is still on screen and the walk can carry on from it."""
    for wait in ("networkidle", "domcontentloaded"):
        try:
            pg.reload(wait_until=wait, timeout=30000)
            pg.wait_for_timeout(1500)
            return True
        except Exception as e:
            last = e
    print(f"    ! reload did not settle ({str(last)[:60]}) — continuing from the current page",
          flush=True)
    return False


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
    json.dump(data, open(os.path.join(paths["captures_live"], f"{slug}.json"), "w"), indent=2)
    kept, masked = B.mask_rows(data["rows"], MAN.volatile_patterns(man, slug))
    # Guarded exactly as capture.py guards it: shoot() tolerates a failed screenshot, so
    # sha256_file must never raise on a missing PNG — record null and warn instead.
    try:
        png_sha = B.sha256_file(png)
    except OSError:
        png_sha = None
        print(f"  ! {slug}: screenshot missing — pngSha256 recorded as null", flush=True)
    B.upsert_screen(bdl, B.screen_entry(
        slug=slug, role=role, route=pg.url, url=pg.url, reached_by=f"flow:{flow_id}",
        png=f"captures/live/{slug}.png", png_sha256=png_sha,
        png_h=None, page_h=data["pageH"], truncated=False,
        rows_path=f"captures/live/{slug}.json",
        structure=B.structure_hash(kept), geometry=B.geometry_hash(kept, data["pageH"]),
        masked=masked, total=len(data["rows"]), fields=data.get("fields") or [],
        wizard=wizard, captured_at=B.now_iso()))
    print(f"  ok {slug}: {len(data['rows'])} rows (flow {flow_id})", flush=True)


def _resolved_text(loc):
    """The accessible name of the element a locator actually resolved to, normalised.

    Returns None when nothing readable comes back — an unnamed control, or a locator that
    matched nothing at all. The caller treats None as "cannot prove this is safe".
    """
    for read in (lambda: loc.get_attribute("aria-label", timeout=2000),
                 lambda: loc.inner_text(timeout=2000),
                 lambda: loc.text_content(timeout=2000)):
        try:
            txt = read()
        except Exception:
            continue
        if txt and txt.strip():
            return " ".join(txt.split())
    return None


def _resolve(pg, label, exact):
    """(locator, resolved_text) for the button `label` would click, or (None, None).

    Role first, CSS second — the same two-step tolerance the old `_click` had, but it now
    hands back the ELEMENT instead of clicking it blind, so the caller can inspect what was
    really matched. `exact` picks `:text-is()` over `:has-text()` for the CSS leg too, so an
    engine-chosen label cannot fuzzy-match through the fallback either.
    """
    for build in (lambda: pg.get_by_role("button", name=label, exact=exact).first,
                  lambda: pg.locator(
                      (f'button:text-is("{label}")' if exact else f'button:has-text("{label}")')
                  ).first):
        try:
            loc = build()
        except Exception:
            continue
        txt = _resolved_text(loc)
        if txt is not None:
            return loc, txt
    return None, None


def _click(pg, label, waitms, allowed, exact=False):
    """Click a button by visible text, tolerant of role/CSS variance. Never raises — a
    button that cannot be found is printed, not fatal, so one missing control on a live
    portal doesn't abort the whole flow silently or noisily crash the run.

    SAFETY — the second half of the gate. `_destructive_and_blocked` tests the label a flow
    author (or the engine) DECLARED, but Playwright's `name=` resolves by case-insensitive
    substring: `"Next"` passes the gate and then matches a button whose real accessible name
    is `"Save & Next"`, which is destructive. So before clicking, read the accessible name of
    the element that was actually resolved and test THAT against DESTRUCTIVE. `allowed` is
    passed in explicitly by every caller — never read from a module global — so there is one
    obvious place to see which authority a click is proceeding under.
    """
    loc, resolved = _resolve(pg, label, exact)
    if loc is None:
        print(f"    ! could not click {label!r} (no button resolved) — step skipped", flush=True)
        return False
    if not allowed:
        if resolved is None:
            print(f"    ! requested {label!r} but the resolved button has no readable name — "
                  f"cannot prove it is non-destructive, gate closed, not clicked", flush=True)
            return False
        if DESTRUCTIVE.search(resolved):
            print(f"    ! requested {label!r} but resolved to {resolved!r} — destructive, "
                  f"gate closed, not clicked", flush=True)
            return False
    try:
        loc.click()
    except Exception as e:
        print(f"    ! could not click {label!r} ({str(e)[:80]}) — step skipped", flush=True)
        return False
    pg.wait_for_timeout(waitms)
    return True


def _destructive_and_blocked(label, allowed):
    """The ONE test any step must pass before it may click a button. A label matching
    DESTRUCTIVE (submit/save/confirm/delete/…) is refused whenever `allowed` is False —
    regardless of which kind of step asked for it. `click` and `captureValidation` both
    route through this; neither may click a destructive control on its own authority.

    This is the FIRST of two tests. It only sees the DECLARED label; `_click` re-tests the
    accessible name of the element that label actually resolved to, because a declared label
    is a substring query and a substring of a safe word can name a destructive control."""
    return bool(DESTRUCTIVE.search(label)) and not allowed


def run_flow(pg, flow, man, cfg, paths, bdl, environment):
    """Walk one flow, capturing each declared state. Returns the slugs captured."""
    role = flow.get("role") or "citizen"
    fid = flow["id"]
    allowed, why = is_submit_allowed(environment, flow)
    print(f"[flow {fid}] submission {'ALLOWED' if allowed else 'BLOCKED'} — {why}", flush=True)
    base = next((r["base"] for r in cfg["live"]["roles"] if r["name"] == role), None)
    if flow.get("entry") and base:
        # Same two-attempt pattern the route crawl uses: an SPA that keeps its token in
        # sessionStorage can sit forever short of networkidle, and a flow that cannot reach its
        # entry screen is a silent no-op otherwise.
        try:
            pg.goto(base + flow["entry"], wait_until="networkidle", timeout=45000)
        except Exception:
            pg.goto(base + flow["entry"], wait_until="domcontentloaded", timeout=45000)
        pg.wait_for_timeout(cfg.get("capture", {}).get("waitMs", 1800))
    done, step_no = [], 0
    steps = flow.get("steps") or []
    total = sum(1 for s in steps if "capture" in s)
    for step in steps:
        if "fill" in step:
            _fill(pg, resolve_fixture(man, step))
        elif "click" in step:
            label = step["click"]
            if _destructive_and_blocked(label, allowed):
                print(f"    ! stopping before {label!r} — {why}", flush=True)
                break
            if not _click(pg, label, step.get("waitMs", 2500), allowed):
                # A forward click that did not happen leaves the page where it was. Every
                # later `capture:` step would then shoot THAT page under the NEXT screen's
                # slug, with real structure/geometry hashes and a wizard marker — and
                # should_replay would skip the flow on later runs because the entry screen is
                # unchanged, so the wrong state would persist for the whole staleness ceiling.
                print(f"[flow {fid}] ABORTED at click {label!r} (step {len(done) + 1} captured "
                      f"so far) — the forward click failed, so nothing further is captured for "
                      f"this flow rather than filing this page under the next screen's name",
                      flush=True)
                break
        elif "fillAll" in step:
            spec = step["fillAll"] if isinstance(step["fillAll"], dict) else {}
            vals = dict(((man or {}).get("fixtures") or {}).get(spec.get("fixture"), {})) if spec.get("fixture") else {}
            print(f"    filled {fill_all(pg, vals, spec.get('passes', 3))} control(s)", flush=True)
        elif "upload" in step:
            spec = step["upload"] if isinstance(step["upload"], dict) else {"file": step["upload"]}
            path = os.path.join(paths["project"], spec["file"])
            if not os.path.exists(path):
                print(f"    ! upload fixture missing: {path}", flush=True)
            else:
                upload_all(pg, path, spec.get("limit"))
        elif "set" in step:
            spec = step["set"]
            if not set_field(pg, spec["field"], spec["value"]) and spec.get("required", True):
                print(f"[flow {fid}] ABORTED — {spec['field']!r} could not be set to "
                      f"{spec['value']!r}; walking on would re-capture the branch already held",
                      flush=True)
                break
        elif "goto" in step:
            target = base + step["goto"] if base else step["goto"]
            for wait in ("networkidle", "domcontentloaded"):
                try:
                    pg.goto(target, wait_until=wait, timeout=45000); break
                except Exception:
                    continue
            pg.wait_for_timeout(cfg.get("capture", {}).get("waitMs", 1800))
        elif "walk" in step:
            spec = step["walk"] if isinstance(step["walk"], dict) else {}
            done.extend(walk_wizard(pg, spec, flow, man, cfg, paths, bdl, role, fid, allowed, why))
        elif "capture" in step:
            step_no += 1
            _capture_state(pg, step["capture"], role, cfg, paths, bdl, man, fid,
                           {"flow": fid, "step": step_no, "of": total})
            done.append(step["capture"])
        elif "captureValidation" in step:
            # Submit the step empty to reveal inline errors, shoot, then reload to reset. The
            # automatic attempt may ONLY use a non-destructive label — the flow's explicit
            # submitLabel if given, else "Next". No fallback chain to "Save"/"Submit": both
            # match DESTRUCTIVE, and trying them unconditionally regardless of the gate was
            # the exact bug this branch used to have (both click branches now share one test).
            declared = step.get("submitLabel")
            label = declared or "Next"
            if _destructive_and_blocked(label, allowed):
                print(f"    ! validation state {step['captureValidation']!r} skipped — "
                      f"{label!r} needs allowSubmit — {why}", flush=True)
                continue
            # The engine's OWN default label gets EXACT matching whenever the gate is closed, so
            # the engine's fallback cannot fuzzy-match "Next" into "Save & Next" on a portal it
            # has no authority to submit to. With both gates open the flow IS authorised to
            # submit, and substring tolerance is then the point — a wizard's forward control is
            # labelled "Save & Next" as often as "Next". An author-declared submitLabel stays
            # substring-tolerant either way (portals label the same control a dozen ways); the
            # resolved-name re-check inside _click is what protects that case.
            if not _click(pg, label, 1200, allowed, exact=not declared and not allowed):
                print(f"    ! validation state {step['captureValidation']!r} skipped — the "
                      f"{label!r} click did not happen, so this would capture the untouched "
                      f"form rather than its error state", flush=True)
                continue
            _capture_state(pg, step["captureValidation"], role, cfg, paths, bdl, man, fid, None)
            done.append(step["captureValidation"])
            _reload(pg)
    # Only a flow that actually reached a confirmation screen has an identifier to harvest.
    # Without this test the regex ran on whatever page the flow stopped on and recorded junk —
    # three real runs filed "NGO-DARPAN" and "GIA/2026-27/AVYAY/" as record ids for flows that
    # never submitted, which then tells the NEXT run a record exists when none does.
    submitted = any(str(slug).endswith("-SUBMITTED") for slug in done)
    if allowed and submitted and flow.get("reuseRecord") is None:
        # Harvest whatever identifier the success screen shows and remember it in the bundle.
        #
        # What this does and does NOT do: recording an id only stops the NEXT run re-harvesting
        # one. Nothing here navigates to that record, edits it, or reuses it in place of a fresh
        # submission — so if this flow replays with both gates open, it submits again and files a
        # second record. The thing that actually keeps a second submission from happening is
        # should_replay(), which skips a flow whose entry screen is byte-identical.
        try:
            txt = pg.inner_text("body")
            hit = re.search(r"\b([A-Z]{2,}[-/][A-Z0-9\-/]{4,})\b", txt)
            if hit:
                bdl.setdefault("records", {})[fid] = {"id": hit.group(1), "createdAt": B.now_iso()}
                print(f"    · recorded {fid} -> {hit.group(1)} (re-used on the next run)", flush=True)
        except Exception:
            pass
    return done


def should_replay(flow, prev_bundle, decisions):
    """Tier 2. Replay a flow only when its entry screen moved, or nothing is known about it.

    Driving a flow is the expensive tier — it fills forms and clicks through a wizard. Skipping
    it when the entry screen is byte-identical is the whole point of the bundle. But a flow
    entry that no nav link reaches has no decision recorded for it at all (the nav-based decide
    step never visited it) — in that case this returns True (replay), because a skipped flow
    would silently serve stale wizard captures forever, which is the failure this whole design
    exists to prevent.
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
        return True
    return verdict != "reuse"
