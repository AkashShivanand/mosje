#!/usr/bin/env python3
"""Analysis core (project-agnostic, deterministic):
  1. coverage ledger  — union of Figma frames + captured live routes; UNMAPPED = coverage debt.
  2. baseline         — pluggable: tokens | derived | internal (see README).
  3. conformance      — every element's computed CSS vs the baseline -> deviations + DS-adoption %.
  4. assemble         — audit-master.json (machine findings, 🤖), geometry-pinned, status MACHINE-DRAFT.

This is the anti-drift heart: it verifies every element every run, so it does not rely on
design-system inheritance that developers may not be following."""
import json, os, re, glob, collections, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config as C
import qc_geometry as G
import crosscheck as XC

def tohex(c):
    c = (c or "").strip()
    if c.startswith("#"): return c.lower()
    if "0, 0, 0, 0" in c or "rgba(0, 0, 0, 0)" in c: return "transparent"
    m = re.findall(r"\d+", c)
    return "#%02x%02x%02x" % (int(m[0]), int(m[1]), int(m[2])) if len(m) >= 3 else c

def norm(t): return re.sub(r"[^a-z0-9]", "", (t or "").lower())

# ---------- 1. coverage ledger ----------
def load_frames(paths, cfg):
    fp = os.path.join(paths["project"], cfg["figma"].get("framesFile", "inputs/figma-frames.json"))
    if os.path.exists(fp):
        try: return json.load(open(fp))
        except Exception: return []
    return []

# A route's LAST path segment is what distinguishes screens within a role ("/admin/dashboard" →
# "dashboard"). A landing route is literally "/", which has no last segment — "/".split("/")[-1]
# is "" — so the key silently collapsed to the bare role and no home frame could key-match its own
# capture. Two real failures came from exactly that:
#   · NHAPOA  Citizen/Dashboard/01-Home (route "/") paired with a DISTRICT-OFFICER screenshot via
#             the old role-blind substring fallback, and still reported MAPPED.
#   · SCW     Public/Home (route "/") went UNMAPPED while its PUBLIC-HOME capture sat in EXTRA.
HOME_SEG = "home"

def _screen_seg(route):
    """The route's last path segment, or HOME_SEG for a root/landing route.

    rstrip("/") also normalises a trailing slash ("/events/" → "events"), which otherwise
    produced an empty segment and the same collapse.
    """
    seg = (route or "").rstrip("/").split("/")[-1]
    return norm(seg) if seg else HOME_SEG

def _is_home_frame(name):
    """True if the frame names itself the landing view in ANY segment.

    A landing frame's screen segment rarely equals its route: NHAPOA's citizen home is
    "Citizen/Dashboard/01-Home" — screen "dashboard", route "/". The home marker is in the
    state segment, so check every segment, not just the screen.
    """
    return any(h in norm(p) for p in (name or "").split("/") for h in ("home", "index", "landing"))

def build_ledger(cfg, frames, captured, paths):
    # Keyed by (role, screen) TUPLE rather than a concatenated string: concatenation let one role
    # bleed into another whenever a role name prefixed another (e.g. "state" vs "stateauthority").
    cap_by_key = {}
    # Also key every capture by its FULL route. The last-segment key is ambiguous the moment a
    # portal nests its verbs: SMILE-Beggary has three distinct Fund Monitoring screens at
    # /fund-monitoring/sanction-orders/create, /nisd-releases/create and
    # /nodal-officer-onward-releases/create — all three collapse to the segment "create", so two
    # of them silently overwrote the third in this dict and their design frames went UNMAPPED
    # while their captures sat in EXTRA. A frame can now also name its `route` outright, which
    # beats every heuristic below.
    cap_by_route = {}
    seg_seen = collections.Counter()
    for c in captured:
        cap_by_key[(norm(c["role"]), _screen_seg(c["route"]))] = c
        cap_by_route[(norm(c["role"]), norm(c["route"]))] = c
        seg_seen[(norm(c["role"]), _screen_seg(c["route"]))] += 1
    _collide = [f"{r}:{s}" for (r, s), n in seg_seen.items() if n > 1]
    if _collide:
        print(f"  ! route-segment collision ({len(_collide)}): {_collide} — pair these frames by "
              f"an explicit \"route\" in inputs/figma-frames.json", flush=True)
    rows = []; mapped = unmapped = extra = design_only = 0; mismap = 0
    used = set(); n_frames = 0
    def _bhead(slug):
        fp = os.path.join(paths["captures_live"], f"{slug}.json")
        if not os.path.exists(fp): return ""
        try: return XC.build_heading(json.load(open(fp)).get("rows", []))
        except Exception: return ""
    for fr in frames:
        node = fr.get("node_id") or fr.get("node")
        if not node:                 # skip comment/group markers — an entry with no node is not a frame
            continue
        n_frames += 1
        name = fr.get("name", "")
        parts = name.split("/")
        role = norm(parts[0]) if parts else ""
        screen = norm(parts[1]) if len(parts) > 1 else ""
        key = (role, screen)
        # A frame flagged `_designOnly` declares "no build exists yet" (future/undesigned state, a
        # modal reference, or acknowledged coverage debt). Never auto-pair it: the name-substring
        # fallback would otherwise grab an unrelated capture and invent a MISMAP. It is recorded as
        # DESIGN-ONLY (coverage debt), separate from a true UNMAPPED (a screen we expected but missed).
        is_design_only = bool(fr.get("_designOnly"))
        hit = None
        if not is_design_only:
            # An explicit `route` on the frame is the only unambiguous pairing there is. Use it
            # first, and never fall through to a heuristic when it is present but does not match —
            # a stated route that matches nothing is a real UNMAPPED, not an invitation to guess.
            # A frame may name its capture SLUG outright. That is the only pairing with no
            # inference in it at all, and it is the one way to pair a state that is not a route
            # — a modal, a wizard step, a tab — or the same screen captured as a second role.
            # Route and segment matching stay for frames that do not use it.
            declared_slug = fr.get("slug")
            declared = fr.get("route")
            if declared_slug:
                hit = next((c for c in captured if c["slug"] == declared_slug), None)
            elif declared:
                hit = cap_by_route.get((role, norm(declared)))
            else:
                hit = cap_by_key.get(key)
            # Landing frame → this role's ROOT capture. A root route offers no screen segment to
            # match on, so pair by role alone — but only for a frame that declares itself the home
            # view, or every unmatched frame in the role would grab the home screenshot.
            if not hit and not fr.get("route") and not fr.get("slug") and _is_home_frame(name):
                hit = cap_by_key.get((role, HOME_SEG))
            # Substring fallback — SCOPED TO THE SAME ROLE (r == role). Unscoped, this walked every
            # key in every role and paired one role's design against another role's screenshot while
            # still reporting MAPPED: a confident wrong answer, strictly worse than an honest
            # UNMAPPED, and invisible downstream because spec-diffing trusts the pairing.
            if not hit and not fr.get("route") and not fr.get("slug") and screen:
                hit = next((c for (r, s), c in cap_by_key.items() if r == role and screen in s), None)
        status = "MAPPED" if hit else ("DESIGN-ONLY" if is_design_only else "UNMAPPED")
        # design↔build MAPPING sanity: the frame's heading must agree with the paired capture's title,
        # or the pairing is wrong (a build screenshot on the wrong Figma frame — invisible to spec diffing).
        verdict = None
        # `_refFrame` means the pairing is deliberate but the design↔build TITLE check does not
        # apply — a style-reference frame, a sign-in page whose largest text is a wordmark, or a
        # pair whose titles genuinely differ and where that difference is itself a finding.
        # crosscheck.py already honours the flag; build_ledger did not, so it kept reporting
        # MISMAP for pairings a human had already adjudicated.
        if hit and fr.get("heading") and not fr.get("_refFrame"):
            dh, bh = fr["heading"], _bhead(hit["slug"])
            if bh:
                verdict = "MATCH" if XC._overlap(XC._toks(dh), XC._toks(bh)) >= 0.34 else "MISMAP"
                if verdict == "MISMAP": mismap += 1
        if hit: mapped += 1; used.add(hit["slug"])
        elif is_design_only: design_only += 1
        else: unmapped += 1
        rows.append({"source": "figma", "frame": name, "figma_node": node,
                     "heading": fr.get("heading"),
                     "state": fr.get("state") or ("/" in name and name.split("/")[-1]) or "",
                     "live_capture": hit["slug"] if hit else None, "status": status,
                     "verdict": verdict})
    for c in captured:
        if c["slug"] not in used:
            extra += 1
            rows.append({"source": "live", "frame": None, "figma_node": None,
                         "live_capture": c["slug"], "route": c["route"],
                         "status": "EXTRA", "verdict": None})
    ledger = {"rows": rows, "stats": {"figma_frames": n_frames, "captured": len(captured),
              "mapped": mapped, "unmapped": unmapped, "design_only": design_only,
              "extra_build_only": extra, "mismap": mismap},
              "gate": "FAIL" if (unmapped or mismap) else ("WARN" if design_only else "PASS"),
              "note": "UNMAPPED = a design frame we expected a build for but no capture matched (missed screen) → FAIL. "
                      "DESIGN-ONLY = a frame flagged _designOnly: designed but not built/captured yet (declared coverage debt) → WARN, documented not paired. "
                      "EXTRA = build-only screens (route to Design Suggestions, not findings). "
                      "MISMAP = a mapped pair whose design-frame title disagrees with the captured build title "
                      "(a build screenshot on the wrong Figma frame) — verify before shipping. "
                      "Provide a `heading` per frame in inputs/figma-frames.json to enable the MISMAP check."}
    json.dump(ledger, open(os.path.join(paths["out"], "coverage-ledger.json"), "w"), indent=2)
    return ledger

# ---------- 2. baseline (pluggable) ----------
def load_baseline(cfg, captured, paths):
    mode = cfg.get("baseline", {}).get("mode", "internal")
    allow = {"colors": set(), "radii": set(), "fontSizes": set(), "fontFamilies": set()}
    src = os.path.join(paths["project"], cfg.get("baseline", {}).get("source", ""))
    if mode in ("tokens", "derived") and os.path.exists(src):
        t = json.load(open(src))
        allow["colors"] = {tohex(x) for x in t.get("colors", [])}
        allow["radii"] = {int(x) for x in t.get("radii", [])}
        allow["fontSizes"] = {int(x) for x in t.get("fontSizes", [])}
        allow["fontFamilies"] = {x for x in t.get("fontFamilies", [])}
        return mode, allow
    # internal-consistency: derive the dominant value set from the build itself
    ctr = {"colors": collections.Counter(), "radii": collections.Counter(),
           "fontSizes": collections.Counter(), "fontFamilies": collections.Counter()}
    for f in glob.glob(os.path.join(paths["captures_live"], "*.json")):
        for r in json.load(open(f)).get("rows", []):
            ctr["colors"][tohex(r.get("color"))] += 1
            ctr["radii"][r.get("radius")] += 1
            ctr["fontSizes"][r.get("fontSize")] += 1
            ctr["fontFamilies"][r.get("fontFamily")] += 1
    total = max(1, sum(ctr["fontSizes"].values()))
    # dominant = values used by >=2% of elements (the de-facto "system")
    for k in allow:
        allow[k] = {v for v, n in ctr[k].items() if v not in (None, "transparent") and n / total >= 0.02}
    return "internal", allow

# ---------- 3. conformance ----------
def conformance(cfg, captured, allow, mode, paths):
    dev = collections.defaultdict(lambda: {"count": 0, "screens": set(), "sample": None, "loc": None})
    total = conf = excluded = 0
    for c in captured:
        fp = os.path.join(paths["captures_live"], f"{c['slug']}.json")
        if not os.path.exists(fp): continue
        for r in json.load(open(fp)).get("rows", []):
            # Skip OFF-CANVAS elements. A hidden third-party panel is extracted like anything
            # else — the UX4G accessibility widget sits at x~1690 with its own stylesheet — and on
            # SMILE-Beggary that was 2,099 of 11,442 measured elements, 18%, none of them ours and
            # none of them fixable by us. Counting them makes DS-adoption a number about somebody
            # else's CSS. The exclusion is reported so it is never silent.
            _x, _w = r.get("x"), r.get("w")
            if isinstance(_x, (int, float)) and isinstance(_w, (int, float)) and (_x < 0 or _x + _w > 1441):
                excluded += 1
                continue
            total += 1; ok = True
            checks = [("color", tohex(r.get("color")), allow["colors"]),
                      ("radius", r.get("radius"), allow["radii"]),
                      ("fontSize", r.get("fontSize"), allow["fontSizes"]),
                      ("fontFamily", r.get("fontFamily"), allow["fontFamilies"])]
            for prop, val, allowed in checks:
                if not allowed: continue
                if val in (None, "transparent", 0): continue
                if val not in allowed:
                    ok = False
                    d = dev[(prop, str(val))]
                    d["count"] += 1; d["screens"].add(c["slug"])
                    # The FIRST occurrence is not necessarily a PINNABLE one. A third-party
                    # off-canvas widget (the UX4G accessibility panel sits at x~1690, outside the
                    # 1440 viewport) is extracted like anything else, and picking it as the sample
                    # produced a pin at x=120% that failed the geometry assertion — a real gate
                    # failure caused by a bad sample, not by a bad capture. Take the first sample
                    # whose box is inside the captured viewport.
                    _x, _y, _w = r.get("x"), r.get("y"), r.get("w")
                    _pinnable = (isinstance(_x, (int, float)) and isinstance(_w, (int, float))
                                 and _x >= 0 and _x + _w <= 1441)
                    if d["loc"] is None and _pinnable:
                        d["sample"] = r.get("text", "")[:30]
                        d["loc"] = (c["slug"], _x, _y, _w, r.get("h"), c.get("pageH", 1000))
                    elif d["sample"] is None:
                        d["sample"] = r.get("text", "")[:30]
            if ok: conf += 1
    ds_adoption = round(100 * conf / max(1, total), 1)
    ranked = sorted(dev.items(), key=lambda kv: -kv[1]["count"])
    devlist = [{"prop": k[0], "value": k[1], "count": v["count"], "screens": len(v["screens"]),
                "sample": v["sample"], "loc": v["loc"]} for k, v in ranked]
    if excluded:
        print("  excluded %d off-canvas element(s) from conformance (hidden/third-party chrome "
              "outside the 1440 viewport); DS-adoption is over the %d that are ours"
              % (excluded, total), flush=True)
    return {"mode": mode, "ds_adoption_pct": ds_adoption, "elements_checked": total,
            "elements_excluded_offcanvas": excluded,
            "elements_conformant": conf, "deviations": devlist}

# ---------- 4. assemble audit-master.json ----------
PROP_AXIS = {"color": "Color & Token", "radius": "Components & States",
             "fontSize": "Typography", "fontFamily": "Typography"}
PROP_TOKEN = {"color": "colour token", "radius": "radius token",
              "fontSize": "type-scale token", "fontFamily": "font-family token"}

def assemble(cfg, ledger, conf, paths, top_n=12):
    findings = []
    # A deviation whose every occurrence sits off-canvas (a hidden third-party panel) has no
    # pinnable sample. Report it — the drift is real — but do not try to place a marker for it,
    # and do not let it crash the assembly, which it did until this guard existed.
    devs = [d for d in conf["deviations"] if d.get("loc")][:top_n]
    unpinnable = [d for d in conf["deviations"][:top_n] if not d.get("loc")]
    if unpinnable:
        _names = ", ".join("%s=%s" % (d["prop"], d["value"]) for d in unpinnable)
        print("  ! %d deviation(s) have no on-canvas sample and are reported without a pin: %s"
              % (len(unpinnable), _names), flush=True)
    for i, d in enumerate(devs, 1):
        loc = d["loc"]; slug = loc[0]
        H = loc[5] or 1000
        xp = round(100 * (loc[1] + loc[3] / 2) / 1440) if loc[1] is not None else 50
        yp = round(100 * (loc[2] + loc[4] / 2) / H, 1) if loc[2] is not None else 50
        findings.append({
            "num": i, "id": f"{cfg['idPrefix']}-DSCONF-{i:03d}",
            "element": f"Off-token {d['prop']}: {d['value']}",
            "section": "ds-conformance", "axis": PROP_AXIS.get(d["prop"], "Color & Token"),
            "severity": "Major" if d["count"] >= 20 else ("Minor" if d["count"] >= 5 else "Nit"),
            "figma": f"Every element should use a {PROP_TOKEN[d['prop']]} from the design system.",
            "live": f"{d['count']} element(s) across {d['screens']} screen(s) render {d['prop']}={d['value']}, which is not a design-system token (first seen near \"{d['sample']}\").",
            "fix": f"Replace the raw {d['prop']} value with the correct design-system token, or add it to the token set if legitimately new.",
            "check": "🤖 machine", "liveImgO": f"captures/live/{slug}.png",
            "_lpct": (xp, yp)})
    screens = []
    if findings:
        screens.append({"slug": "GLOBAL-DSCONF",
            "name": "Global — Design-System Conformance (machine-verified every element)",
            "figmaImg": None, "liveImg": f"captures/live/{conf['deviations'][0]['loc'][0]}.png" if conf["deviations"] else None,
            "figmaUrl": None, "liveUrl": None,
            "note": f"DS-adoption: {conf['ds_adoption_pct']}% of {conf['elements_checked']} elements use design-system tokens. "
                    f"Baseline mode: {conf['mode']}. The full deviation table is in out/conformance.json. "
                    f"These are 🤖 machine checks — verify severity with a human before certifying.",
            "findings": findings})
    # merge human-authored judgment screens (Tier-B fidelity findings) — durable, geometry-pinned
    # the same way as machine screens. Each finding carries identity (_anchor/_fpct/_lpct), not
    # final coordinates; finalize() derives the crops + pins and asserts them. Authored screens
    # render first, the machine GLOBAL-DSCONF screen last.
    manual = []
    mfp = os.path.join(paths["project"], "inputs/manual-screens.json")
    if os.path.exists(mfp):
        try:
            md = json.load(open(mfp)); manual = md if isinstance(md, list) else md.get("screens", [])
        except Exception as e:
            print(f"manual-screens.json ignored ({e})")
    screens = manual + screens
    for sc in screens:
        G.finalize(sc, eng_dir=paths["captures"], base_dir=paths["project"])
    G.write_failures(paths["out"])
    master = {"portal": cfg["portal"], "idPrefix": cfg["idPrefix"],
              "generated": os.environ.get("AUDIT_DATE", "auto"),
              "status": "MACHINE-DRAFT",
              "figmaUrl": C.figma_url(cfg, cfg["figma"].get("rootNode")),
              "method": f"Machine pass (project-agnostic engine). Baseline={conf['mode']}. "
                        f"DS-adoption {conf['ds_adoption_pct']}%. Coverage gate={ledger['gate']}. "
                        f"🤖 machine checks only; human sign-off (👤) required before CERTIFIED.",
              "coverage": ledger["stats"], "coverage_gate": ledger["gate"],
              "ds_adoption_pct": conf["ds_adoption_pct"],
              "deferred": [], "screens": screens}
    json.dump(master, open(os.path.join(paths["out"], "audit-master.json"), "w"), indent=2)
    json.dump(conf, open(os.path.join(paths["out"], "conformance.json"), "w"), indent=2, default=str)
    return master

def run(project):
    cfg, paths = C.load(project)
    # THE MANIFEST IS A CACHE; THE DISK IS THE TRUTH.
    #
    # `_captured.json` records what the LAST run visited. A partial run — one role, or a
    # --verify pass that reused most screens — writes a NARROWER manifest, and every capture it
    # did not touch then disappears from the audit even though the file is sitting right there.
    # That happened on SMILE-Beggary: 75 captures on disk, 56 in the manifest, and 19 real
    # screens silently excluded from coverage — the exact failure the coverage gate exists to
    # catch, arriving through the gate's own input. Always reconcile, and always say so.
    cap_path = os.path.join(paths["captures"], "_captured.json")
    captured = []
    if os.path.exists(cap_path):
        try:
            captured = json.load(open(cap_path))
        except Exception:
            captured = []
    known = {c.get("slug") for c in captured}
    recovered = []
    for f in sorted(glob.glob(os.path.join(paths["captures_live"], "*.json"))):
        if os.path.basename(f).startswith("_"): continue
        slug = os.path.splitext(os.path.basename(f))[0]
        if slug in known: continue
        try:
            d = json.load(open(f))
        except Exception:
            continue
        if not isinstance(d, dict) or "rows" not in d: continue
        captured.append({"slug": slug, "role": d.get("role", slug.split("-")[0].lower()),
                         "route": d.get("route", "/" + slug.lower()), "url": d.get("url"),
                         "png": f"captures/live/{slug}.png", "pageH": d.get("pageH", 1000),
                         "rows": len(d.get("rows", []))})
        recovered.append(slug)
    if recovered:
        print(f"  reconciled: {len(recovered)} capture(s) on disk were missing from the manifest "
              f"and have been added — {recovered[:4]}{'...' if len(recovered) > 4 else ''}",
              flush=True)
    frames = load_frames(paths, cfg)
    ledger = build_ledger(cfg, frames, captured, paths)
    mode, allow = load_baseline(cfg, captured, paths)
    conf = conformance(cfg, captured, allow, mode, paths)
    master = assemble(cfg, ledger, conf, paths)
    print(f"coverage: {ledger['stats']} gate={ledger['gate']}")
    print(f"ds-adoption: {conf['ds_adoption_pct']}%  ({conf['elements_conformant']}/{conf['elements_checked']} elements)")
    print(f"deviations: {len(conf['deviations'])}  -> top {min(12,len(conf['deviations']))} as findings")
    return master

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(); ap.add_argument("--project", required=True)
    a = ap.parse_args(); run(a.project)
