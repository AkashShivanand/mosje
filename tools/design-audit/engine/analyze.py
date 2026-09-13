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
import integrity as I

def tohex(c):
    """Normalise any computed colour to #rrggbb — including oklch().

    A `\\d+` scrape of `oklch(0.929 0.013 255.508)` produces `#0036800`: seven digits, not a
    colour, and every element carrying one counts as a deviation. That is not a hypothetical —
    PM-AJAY is Tailwind v4 and serves oklch() for nearly every colour it paints, so the first
    house-baseline run reported **DS-adoption 7.4%** on a set of deviations that were mostly
    mis-parsed greys with names like `#0017400`.

    `integrity.colours_in()` already decodes oklch through oklab to sRGB, verified against
    slate-200 = #E2E8F0. This delegates to it rather than growing a second decoder — the same
    lesson had already been learned and fixed in ONE of the two places that needed it, which is
    how it survived to be found again here.
    """
    c = (c or "").strip()
    if not c:
        return c
    if c.startswith("#"):
        return c.lower()
    # A fully transparent paint is not a colour; it must not be judged against the baseline.
    if "rgba(0, 0, 0, 0)" in c or "0, 0, 0, 0" in c:
        return "transparent"
    found = I.colours_in(c)
    if found:
        return found[0].lower()
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

#: The published full-round radius (`--sa-shape-full`).
FULL_RADIUS = 999.0
#: At or above this, a px radius IS the full round — browsers clamp `rounded-full` on a large
#: element to values like 33554400px.
FULL_CLAMP_MIN = 500.0
#: The largest genuine radius the contract publishes below `full` is 24. Anything between that
#: and the clamp, with no unit recorded, is most likely a percentage and is not judged.
MAX_REAL_RADIUS = 32.0

#: How many independently authored Figma pages must use a value before the design file is
#: treated as having adopted it as a convention the token contract has not caught up with.
#: Below this, a value absent from the contract is drift in BOTH places and the portal finding
#: stands. See load_house.corroborated() for what one page of evidence nearly excused.
HOUSE_GAP_MIN_PAGES = 3

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
        try:
            _j = json.load(open(fp))
            # pass pageW so the off-canvas guard knows where the viewport ends
            return XC.build_heading(_j.get("rows", []), _j.get("pageW"))
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
class Allowed:
    """A set of permitted values that can also permit RANGES.

    The estate's display and headline type tiers are fluid — `clamp(1.125rem, …vw, 1.25rem)` — so
    a conformant heading can render at any size between 18px and 20px and equals no discrete
    token at all. A plain set would flag every fluid heading in the build. `in` therefore tests
    membership OR containment in any interval.
    """

    def __init__(self, values=(), ranges=()):
        self.values = set(values)
        self.ranges = [(float(lo), float(hi)) for lo, hi in ranges]

    def __contains__(self, v):
        if v in self.values:
            return True
        try:
            n = float(v)
        except (TypeError, ValueError):
            return False
        return any(lo - 0.51 <= n <= hi + 0.51 for lo, hi in self.ranges)

    def __bool__(self):
        return bool(self.values or self.ranges)

    def __len__(self):
        return len(self.values) + len(self.ranges)


def load_house(src, allow, fluid_ranges=True):
    """Baseline mode `house` — audit a portal whose own screens were never designed.

    THE FIGMA HANDOFF FILE IS THE AUTHORITY. The token contract cross-references it.

    The estate's visual language is established across the eleven non-draft pages of the handoff
    file, several marked *Dev Synced*, and that file is what the development teams build from. So a
    build value outside that language is a PORTAL finding.

    **This was inverted in the first version and the inversion was the error.** It made the token
    contract convict and demoted the file to corroboration, reasoning that a literal is not a bound
    token and that the PM-AJAY page is a draft. Both premises are true; neither supports the
    conclusion. The PM-AJAY *page* being a draft is a reason not to treat *its frames* as a
    per-screen authority — not a reason to demote the whole file's established language.

    It mattered. The build's neutrals are Tailwind v4 **slate**; the file's are Tailwind v3
    **gray**. Those genuinely differ, so against the real standard the build's neutrals are a live
    portal finding — and the first version filed them as a design-system gap that EXCUSED the
    portal, then reported a token-adoption figure measured against an authority the portal was
    never built to.

    WHAT IS ALLOWED is the union of two things, because either one is legitimate:

      * the file's established language — a value drawn on >= 3 independently authored pages; and
      * anything the token contract publishes, fluid ranges included — using the design system is
        never a defect, even where no page happens to draw that exact value.

    A value in NEITHER is charged to the portal. On PM-AJAY the slate ramp is in neither, which is
    the correct answer and the one the inversion was hiding.

    `_noToken` records standard values the contract does not publish. That is a real design-system
    gap worth raising — but it no longer excuses anything, because the portal is built from the
    file, not from the contract.
    """
    h = json.load(open(src))
    c = h.get("contract", {})
    std = h.get("standard", {})

    def std_values(axis, cast=None):
        vals = (std.get(axis, {}) or {}).get("standard", {}) or {}
        return [cast(v) if cast else v for v in vals]

    # colour: the file's language, plus every colour the contract publishes
    allow["colors"] = Allowed(
        [tohex(x) for x in std_values("colour")] + [tohex(x) for x in c.get("colors", [])])
    allow["radii"] = Allowed(
        [float(x) for x in std_values("radius")] + [float(x) for x in c.get("radii", [])])
    # FLUID RANGES belong to the token contract, so they may only excuse a build that actually
    # consumes it. PM-AJAY loads ZERO `--sa-*` custom properties — counted in the live DOM — so it
    # cannot be rendering a fluid token, and admitting its 17px and 19px on the strength of a
    # HEADING tier's 16-18 and 18-20 ranges would excuse the very thing the type-scale finding is
    # about: a wholesale redefinition of Tailwind's scale. A project sets
    # `baseline.fluidRanges: false` to say so, with the reason in the config.
    allow["fontSizes"] = Allowed(
        [float(x) for x in std_values("fontSize")] + [float(x) for x in c.get("fontSizes", [])],
        [(r["min"], r["max"]) for r in c.get("fontSizeRanges", [])] if fluid_ranges else [])
    allow["spacing"] = Allowed(
        [float(x) for x in std_values("spacing")] + [float(x) for x in c.get("spacing", [])])
    # A computed font-family is a whole stack; conformance() tests the PRIMARY family, so both the
    # file's families and the contract's stack entries are legitimate members.
    allow["fontFamilies"] = Allowed(
        list(std_values("fontFamily")) + list(c.get("fontFamilies", [])))

    # No value is excused any more. `_gaps` stays empty so conformance()'s house-gap branch is
    # simply never taken — kept rather than deleted so a project on an older standard file does
    # not crash, and so the reason is visible here rather than inferred from an absence.
    allow["_gaps"] = {"color": {}, "radius": {}, "fontSize": {}, "fontFamily": {}}
    allow["_noToken"] = {
        axis: (std.get(axis, {}) or {}).get("noToken", {}) or {}
        for axis in ("colour", "radius", "fontSize", "spacing", "fontFamily")
    }
    allow["_fileDefects"] = {
        axis: (std.get(axis, {}) or {}).get("fileDefects", {}) or {}
        for axis in ("colour", "radius", "fontSize", "spacing", "fontFamily")
    }
    allow["_standardSize"] = {axis: len((std.get(axis, {}) or {}).get("standard", {}) or {})
                              for axis in ("colour", "radius", "fontSize", "spacing",
                                           "fontFamily")}
    allow["_tokenNames"] = h.get("tokenNames", {})
    allow["_provenance"] = h.get("provenance", {})
    allow["_authority"] = h.get("_authority")
    return allow


def load_baseline(cfg, captured, paths):
    mode = cfg.get("baseline", {}).get("mode", "internal")
    allow = {"colors": set(), "radii": set(), "fontSizes": set(), "fontFamilies": set()}
    src = os.path.join(paths["project"], cfg.get("baseline", {}).get("source", ""))
    if mode == "house":
        if not os.path.exists(src):
            sys.exit(f"! baseline mode 'house' needs {src} — run "
                     "`python3 tools/design-audit/house/derive.py` first.")
        fluid = cfg.get("baseline", {}).get("fluidRanges", True)
        return mode, load_house(src, allow, fluid_ranges=fluid)
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

def primary_family(v):
    """First family in a computed font-family stack: 'Noto Sans, ui-sans-serif, …' -> 'Noto Sans'.

    getComputedStyle returns the REQUESTED stack, not the face that rendered, so comparing whole
    stacks to a token compares two spellings of the same intent. The first family is the intent;
    whether it actually loaded is a font-LOADING finding and a different check (audit-rules.md B).
    """
    if not isinstance(v, str):
        return v
    return v.split(",")[0].strip().strip('"\'') or None


def judgeable_radius(row):
    """The row's radius as a px number the contract can judge — or None when it cannot.

    `px()` in the extractor drops the unit, and the unit carries the meaning:

      * `50%` / `70%`  a circular or elliptical corner. Conformant by intent, and comparing the
                       bare 50 against a px contract convicts an avatar for being round.
      * `33554400px`   a browser's clamp for an over-large `rounded-full`. It IS the full radius,
                       so it resolves to the published `--sa-shape-full`.
      * anything else  a real px radius, judged normally.

    All three appeared on the first PM-AJAY run — 50 and 70 on all 27 screens, 33554400 on 188
    elements — and every one of them would have shipped as an off-token radius finding.

    A capture taken before `radiusRaw` existed has no unit to read. Rather than guess, an
    implausible value (over the contract's largest real radius and not the full clamp) returns
    None and is not judged; `conformance()` counts it as neither conformant nor deviant.
    """
    raw = row.get("radiusRaw")
    val = row.get("radius")
    if isinstance(raw, str):
        raw = raw.strip().split()[0] if raw.strip() else ""
        if raw.endswith("%"):
            return None                      # a proportional corner is not a px token
        if raw.endswith("px"):
            try:
                n = float(raw[:-2])
            except ValueError:
                return val
            return FULL_RADIUS if n >= FULL_CLAMP_MIN else n
        return val
    # No raw string on this capture: fall back to plausibility.
    if isinstance(val, (int, float)):
        if val >= FULL_CLAMP_MIN:
            return FULL_RADIUS
        if val > MAX_REAL_RADIUS:
            return None                      # very probably a percentage; refuse to guess
    return val


# ---------- 3. conformance ----------
def conformance(cfg, captured, allow, mode, paths):
    dev = collections.defaultdict(lambda: {"count": 0, "screens": set(), "sample": None, "loc": None,
                                           "houseGap": False, "gapEvidence": None})
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
                      ("radius", judgeable_radius(r), allow["radii"]),
                      ("fontSize", r.get("fontSize"), allow["fontSizes"]),
                      ("fontFamily", primary_family(r.get("fontFamily")), allow["fontFamilies"])]
            for prop, val, allowed in checks:
                if not allowed: continue
                if val in (None, "transparent", 0): continue
                if val not in allowed:
                    # A value the CONTRACT omits but the handoff file uses estate-wide is a
                    # house-standard GAP, not a portal defect. It is counted separately and
                    # never charged against the build's DS-adoption — see load_house().
                    gap = allow.get("_gaps", {}).get(prop, {}).get(str(val))
                    if gap is None and prop in ("radius", "fontSize"):
                        try:
                            gap = allow["_gaps"][prop].get(str(float(val)))
                        except (TypeError, ValueError, KeyError):
                            gap = None
                    d = dev[(prop, str(val))]
                    if gap is not None:
                        d["houseGap"] = True
                        d["gapEvidence"] = gap
                    else:
                        ok = False
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
                "sample": v["sample"], "loc": v["loc"],
                # houseGap: the token contract omits this value but the handoff file uses it
                # estate-wide. Raise it against the design system, never against this portal.
                "houseGap": bool(v.get("houseGap")), "gapEvidence": v.get("gapEvidence")}
               for k, v in ranked]
    gaps = [d for d in devlist if d["houseGap"]]
    if excluded:
        print("  excluded %d off-canvas element(s) from conformance (hidden/third-party chrome "
              "outside the 1440 viewport); DS-adoption is over the %d that are ours"
              % (excluded, total), flush=True)
    # ROOT-CAUSE CONCENTRATION. "DS-adoption 8.6%" reads as "91% of the portal is wrong", and on
    # a build that swapped ONE palette that is badly misleading: PM-AJAY's non-conformance is
    # overwhelmingly a single substitution — Tailwind v4's slate ramp where the contract publishes
    # its own neutrals — repeated on every text element, not thousands of independent defects.
    # Stating the concentration beside the percentage is what stops the headline being misread,
    # and it tells a developer the truth that matters: fix one thing, not four thousand.
    charged = [d for d in devlist if not d["houseGap"]]
    dev_total = sum(d["count"] for d in charged) or 1
    concentration = {
        "deviating_element_instances": dev_total,
        "distinct_values_charged": len(charged),
        "top1_share_pct": round(100 * sum(d["count"] for d in charged[:1]) / dev_total, 1),
        "top3_share_pct": round(100 * sum(d["count"] for d in charged[:3]) / dev_total, 1),
        "top10_share_pct": round(100 * sum(d["count"] for d in charged[:10]) / dev_total, 1),
        "_note": "Share of all charged deviation instances explained by the 1/3/10 most common "
                 "values. A high top-10 share means few root causes, not many defects — report "
                 "the causes, never the instance count.",
    }
    print("  concentration: the 10 most common values explain %.1f%% of all charged deviations "
          "(%d distinct values over %d element instances) — few root causes, not many defects"
          % (concentration["top10_share_pct"], len(charged), dev_total), flush=True)
    if gaps:
        print("  %d deviation value(s) are HOUSE-STANDARD GAPS (the token contract omits them, "
              "the handoff file uses them estate-wide). Not charged against this portal; raised "
              "against the design system." % len(gaps), flush=True)
    return {"mode": mode, "ds_adoption_pct": ds_adoption, "elements_checked": total,
            "elements_excluded_offcanvas": excluded,
            "elements_conformant": conf, "deviations": devlist,
            "house_gaps": gaps,
            "concentration": concentration,
            "baseline_provenance": allow.get("_provenance") if isinstance(allow, dict) else None,
            "token_names": allow.get("_tokenNames") if isinstance(allow, dict) else None}

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
