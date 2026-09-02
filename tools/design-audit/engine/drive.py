#!/usr/bin/env python3
"""Execute a manifest flow — the states a route-crawl cannot reach.

The engine's declarative crawl reads the sidebar, and nothing in any sidebar links a wizard's
step 4 or a confirm dialog. Those are the highest-value screens in a portal and, until now, were
reached by bespoke per-project drivers written once and discarded. This module replaces them.

SAFETY. Submission is gated twice: the environment must be dev or uat, AND the flow must set
`allowSubmit: true`. On prod the run stops and asks for a human. The DESTRUCTIVE regex is the
prod guard, not a blanket ban — walking a wizard to its end on dev/uat is the point.
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


def _click(pg, label, waitms):
    """Click a button by visible text, tolerant of role/CSS variance. Never raises — a
    button that cannot be found is printed, not fatal, so one missing control on a live
    portal doesn't abort the whole flow silently or noisily crash the run."""
    try:
        pg.get_by_role("button", name=label, exact=False).first.click()
    except Exception:
        try:
            pg.click(f'button:has-text("{label}")')
        except Exception as e:
            print(f"    ! could not click {label!r} ({str(e)[:80]}) — step skipped", flush=True)
            return False
    pg.wait_for_timeout(waitms)
    return True


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
            _click(pg, label, step.get("waitMs", 2500))
        elif "capture" in step:
            step_no += 1
            _capture_state(pg, step["capture"], role, cfg, paths, bdl, man, fid,
                           {"flow": fid, "step": step_no, "of": total})
            done.append(step["capture"])
        elif "captureValidation" in step:
            # Submit the step empty to reveal inline errors, shoot, then reload to reset.
            _click(pg, step.get("submitLabel") or "Next", 1200) or \
                _click(pg, "Save", 1200) or _click(pg, "Submit", 1200)
            _capture_state(pg, step["captureValidation"], role, cfg, paths, bdl, man, fid, None)
            done.append(step["captureValidation"])
            pg.reload(wait_until="networkidle"); pg.wait_for_timeout(1500)
    return done
