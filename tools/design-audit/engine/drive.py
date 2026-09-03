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
    for read in (lambda: loc.get_attribute("aria-label"),
                 lambda: loc.inner_text(),
                 lambda: loc.text_content()):
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
            pg.reload(wait_until="networkidle"); pg.wait_for_timeout(1500)
    if allowed and flow.get("reuseRecord") is None:
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
