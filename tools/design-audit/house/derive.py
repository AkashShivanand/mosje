#!/usr/bin/env python3
"""Derive the SAMAVESH house standard — the baseline for a portal with no design frames.

WHY THIS EXISTS
---------------
PM-AJAY has no per-screen design to diff against — its handoff page is a draft. But "no frames for
this screen" is NOT "no standard": the estate's visual language is established across the other
eleven pages of the handoff file, several of them marked *Dev Synced*, and that file is what the
development teams actually build from.

    THE FIGMA HANDOFF FILE IS THE AUTHORITY. The token contract is the cross-reference.

**This was inverted in the first version of this file, and the inversion was the error.** It made
`packages/tokens/dist/tokens.css` convict and demoted the file to corroboration, on the reasoning
that a literal is not a bound token and that the PM-AJAY page is a draft. Both premises are true
and neither supports the conclusion: the PM-AJAY *page* being a draft is a reason not to treat *its
frames* as a per-screen authority, not a reason to demote the whole file's established language.

The consequence was not cosmetic. The build's neutrals are Tailwind v4 **slate**; the file's are
Tailwind v3 **gray**. Those genuinely differ, so against the real standard that is a live portal
finding — and the first version filed it as a design-system gap that EXCUSED the portal, then
reported "token adoption 9.3%" measured against an authority this portal was never built to.

So, the two sources and what each now does:

  1. THE STANDARD — `house/evidence/figma-page-histograms.json`, what the eleven non-draft pages
     actually draw, with frequencies. **This convicts.** A value established across three or more
     independently authored pages is the estate's language, and a build departing from it is a
     portal finding.

  2. THE CONTRACT — the generated Tier-2 `--sa-*` layer. **This cross-references.** Where the
     standard has no matching token, that is a real design-system gap worth publishing — but it
     does not excuse the portal, because the portal is built from the file. Where the two agree,
     a finding is doubly grounded and a developer cannot argue with it.

FILE DEFECTS ARE NOT THE STANDARD. The file also carries drift, and blessing it would be the
opposite error: `#d9d9d9` is Figma's default rectangle fill on ~4,000 unstyled shapes, `#000000` is
pure black text where the file's own dominant ink is `#1f2937`, and Inter/Roboto/Poppins/Open Sans
appear against a standing Noto Sans instruction. Those are excluded by name, with reasons, and
reported separately.

Run:  python3 house/derive.py            # writes house/samavesh-house-standard.json
      python3 house/derive.py --check    # exits non-zero if the written file is stale
"""
import json, os, re, subprocess, sys, argparse
from collections import defaultdict

HOUSE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HOUSE, "..", "..", ".."))
TOKENS_CSS = os.path.join(REPO, "packages", "tokens", "dist", "tokens.css")
TOKENS_PKG = os.path.join(REPO, "packages", "tokens", "package.json")
EVIDENCE = os.path.join(HOUSE, "evidence", "figma-page-histograms.json")
OUT = os.path.join(HOUSE, "samavesh-house-standard.json")

DECL = re.compile(r"--(sa-[a-z0-9-]+)\s*:\s*([^;]+);", re.I)
HEX = re.compile(r"#[0-9a-fA-F]{3,8}\b")
NUM = re.compile(r"^-?\d+(?:\.\d+)?")
# Innermost-block match: `[^{}]` cannot cross a brace, so for `@media x { :root { … } }` this
# finds `:root { … }` and never the at-rule wrapper. That is what we want — the wrapper carries
# no declarations of its own.
BLOCK = re.compile(r"([^{}]+)\{([^{}]*)\}", re.S)
VAR = re.compile(r"var\(\s*--([a-zA-Z0-9-]+)\s*(?:,([^()]*))?\)")
CLAMP = re.compile(r"clamp\(\s*([^,]+),(.*),\s*([^,]+?)\s*\)\s*$", re.S)
MAX_VALUES_PER_TOKEN = 24     # a token with more resolved values than this is a mode explosion,
                              # not a contract; stop expanding rather than growing without bound.

# A Tier-1 primitive is not part of the contract app code may consume — design-system-architecture.md
# fails the token build if component code names one. So it is excluded from the baseline: a build
# that renders a --sa-ref-* value is not thereby conformant.
TIER1 = re.compile(r"^sa-ref-")


def norm_hex(h):
    """#abc -> #aabbcc; #rrggbbaa -> #rrggbb (alpha is not a colour identity here); lowercased."""
    h = h.strip().lower()
    if not h.startswith("#"):
        return None
    d = h[1:]
    if len(d) == 3:
        d = "".join(c * 2 for c in d)
    if len(d) == 8:
        d = d[:6]
    return "#" + d if len(d) == 6 and all(c in "0123456789abcdef" for c in d) else None


def px(v):
    """Leading number of a CSS value, in px. Returns None for anything not a bare length."""
    v = v.strip()
    m = NUM.match(v)
    if not m:
        return None
    n = float(m.group(0))
    rest = v[m.end():].strip()
    if rest in ("px", ""):
        return n
    if rest == "rem":
        return n * 16
    return None


def clamp_bounds(val):
    """`clamp(1.125rem, calc(1.0761rem + 0.217vw), 1.25rem)` -> (18.0, 20.0).

    The estate's display and headline tiers are FLUID: their size is a viewport-dependent range,
    not a number. A baseline that stored only one end of it would flag every fluid heading in the
    build as off-ramp — the single largest source of false findings this parser could have
    produced. Body, label and title tiers are fixed rem and come through `px()` unchanged.
    """
    m = CLAMP.match(val.strip())
    if not m:
        return None
    lo, hi = px(m.group(1)), px(m.group(3))
    return (lo, hi) if lo is not None and hi is not None and lo <= hi else None


def read_contract():
    """Parse the generated token CSS into the allowed sets, by axis.

    Two things make this more than a regex sweep, and both were found by the first version of it
    getting the wrong answer:

      * 2,894 of 4,885 declarations are `var()` references, so a single pass sees almost no
        values at all — it reported 117 colours and 3 font sizes. Chains are resolved here.
      * The file declares the same token under `:root`, `[data-brand="navy"]`, `[data-brand="dbim"]`,
        `[data-color-mode="blue-dark"]`, `[data-surface="portal"]` and `[data-density="compact"]`.
        The baseline takes the UNION across modes, which makes it deliberately PERMISSIVE: a build
        running in one brand mode is never convicted for a value another mode publishes. A
        superset costs some sensitivity and buys the thing that matters — no false convictions.
    """
    if not os.path.exists(TOKENS_CSS):
        sys.exit(f"! {TOKENS_CSS} missing — run `npm run build -w @mosje/tokens` first.\n"
                 "  The house standard is derived from the generated contract, never hand-typed.")
    src = open(TOKENS_CSS, encoding="utf-8").read()

    raw = defaultdict(set)      # token name -> every value it is declared with, any mode
    modes = defaultdict(set)    # token name -> the selectors that declare it
    for sel, body in BLOCK.findall(src):
        sel = " ".join(sel.split())
        if sel.startswith("@"):
            continue
        for name, val in DECL.findall(body):
            raw[name].add(val.strip())
            modes[name].add(sel)

    # Resolve var() chains. Shallow in practice (1-2 hops), but iterate until stable so a deeper
    # alias cannot silently drop out of the baseline.
    for _ in range(8):
        changed = False
        for name, vals in list(raw.items()):
            out = set()
            for v in vals:
                m = VAR.search(v)
                if not m:
                    out.add(v)
                    continue
                target, fallback = m.group(1), (m.group(2) or "").strip()
                reps = set(raw.get(target) or ())
                if not reps and fallback:
                    reps = {fallback}
                if not reps or any(VAR.search(r) for r in reps):
                    out.add(v)          # unresolvable yet, or still indirect — try next pass
                    if reps:
                        changed = True
                    continue
                for r in reps:
                    out.add((v[:m.start()] + r + v[m.end():]).strip())
                changed = True
            if len(out) > MAX_VALUES_PER_TOKEN:
                out = set(sorted(out)[:MAX_VALUES_PER_TOKEN])
            if out != vals:
                raw[name] = out
                changed = True
        if not changed:
            break

    colors, radii, sizes, ranges, space, families = {}, {}, {}, {}, {}, {}
    for name, vals in raw.items():
        if TIER1.match(name):
            continue                    # Tier-1 primitive: not part of the consumable contract
        for val in vals:
            if VAR.search(val):
                continue                # never resolved — cannot be an allowed value
            h = norm_hex(val) if val.startswith("#") else None
            if h:
                colors.setdefault(h, []).append(name)
                continue
            if "shape" in name or name.endswith("-radius"):
                n = px(val)
                if n is not None:
                    radii.setdefault(n, []).append(name)
                continue
            if re.search(r"type-.*-size$", name):
                cb = clamp_bounds(val)
                if cb:
                    ranges.setdefault(cb, []).append(name)
                    continue
                n = px(val)
                if n is not None:
                    sizes.setdefault(n, []).append(name)
                continue
            if re.match(r"^sa-(padding|stack|inline|gap|grid-gutter)", name):
                n = px(val)
                if n is not None:
                    space.setdefault(n, []).append(name)
                continue
            if re.match(r"^sa-font-(latin|devanagari|display|mono|icon)$", name):
                for fam in val.split(","):
                    fam = fam.strip().strip('"\'')
                    if fam:
                        families.setdefault(fam, []).append(name)
    return {"colors": colors, "radii": radii, "fontSizes": sizes, "fontSizeRanges": ranges,
            "spacing": space, "fontFamilies": families,
            "_modes": sorted({s for ss in modes.values() for s in ss})}


def parse_hist(entries):
    """['#fff:12', ...] -> {value: count}. Non-integer numerics are dropped as scaled-instance
    artifacts: a 2.667px font is an icon inside a group someone resized, not a type decision."""
    out = {}
    for e in entries or []:
        k, _, c = str(e).rpartition(":")
        if not k:
            continue
        try:
            n = int(c)
        except ValueError:
            continue
        out[k] = out.get(k, 0) + n
    return out


def read_evidence():
    ev = json.load(open(EVIDENCE, encoding="utf-8"))
    pages = ev["pages"]
    # DRAFT pages carry no evidential weight. The PM-AJAY page is the portal under audit AND a
    # draft — counting it would let the thing being judged vote on the standard it is judged by.
    drafts = {n for n, p in pages.items() if "_status" in p and "DRAFT" in p["_status"]}
    axes = ("fontSizes", "weights", "families", "textColors", "radii", "frameFills", "strokes",
            "padding", "gaps", "canvasWidths", "libraries")
    agg = {a: defaultdict(lambda: {"count": 0, "pages": []}) for a in axes}
    bound = unbound = 0
    for name, p in pages.items():
        if name in drafts:
            continue
        bound += p.get("boundFills", 0)
        unbound += p.get("unboundFills", 0)
        for a in axes:
            for val, n in parse_hist(p.get(a)).items():
                agg[a][val]["count"] += n
                agg[a][val]["pages"].append(name)
    plain = {a: {v: {"count": d["count"], "pages": sorted(d["pages"])}
                 for v, d in agg[a].items()} for a in axes}
    return {"aggregate": plain, "drafts": sorted(drafts),
            "nonDraftPages": sorted(set(pages) - drafts),
            "boundFills": bound, "unboundFills": unbound,
            "variableDefsSample": ev.get("variableDefsSample", {}), "_source": ev["_source"]}


def is_int_like(s):
    try:
        return float(s) == int(float(s))
    except (TypeError, ValueError):
        return False


#: A value must appear on this many independently authored non-draft pages before it counts as
#: the estate's language. One page using a value is that page's own choice; three pages agreeing
#: is a convention a developer can be held to.
STANDARD_MIN_PAGES = 3

#: Values the FILE draws that are not the standard, with the reason each is excluded. Blessing
#: these would be the mirror of the error this module was built to fix: the file is the authority
#: for its established language, not for its accidents.
FILE_DEFECTS = {
    "#d9d9d9": "Figma's default rectangle fill — an unstyled placeholder shape on roughly 4,000 "
               "nodes, never a colour decision.",
    "#000000": "Pure black text. The file's own dominant ink is #1f2937 by an order of magnitude, "
               "and pure black is in neither the file's ramp nor the token contract.",
}
#: The only families the estate permits: Noto Sans for text, Material Symbols Rounded for icons.
#: CLAUDE.md makes this a standing instruction, so a stray typeface is a file defect at any
#: frequency — there is no page count at which the wrong font becomes the standard.
ALLOWED_FAMILIES = {"Noto Sans", "Noto Sans Devanagari", "Noto Sans Display",
                    "Material Symbols Rounded"}
#: A radius the file reports that no one drew: the artefact of a scaled instance.
IMPLAUSIBLE_RADIUS = 100.0


def build_standard(contract, evidence):
    """The estate's established visual language, from the non-draft pages. THIS is what convicts.

    Three buckets come out of every axis:

      * `standard`   — established on >= STANDARD_MIN_PAGES pages and not a named file defect.
                       A build value outside this is a PORTAL finding.
      * `fileOnly`   — in the standard but with no matching token. A real design-system gap worth
                       publishing; it does NOT excuse the portal, because the portal is built
                       from the file.
      * `defects`    — drawn by the file and excluded by name, with the reason.

    Whether a standard value also has a token is recorded per value as `hasToken`, so a finding
    can say "the file draws this and the contract publishes it" — which is the strongest form the
    claim takes, and the one a developer cannot argue with.
    """
    ev = evidence["aggregate"]
    npages = len(evidence["nonDraftPages"])

    def bucket(observed, contract_values, kind):
        std, file_only, defects = {}, {}, {}
        for val, d in observed.items():
            rec = {"count": d["count"], "pages": len(d["pages"])}
            if kind == "colour" and val in FILE_DEFECTS:
                defects[val] = {**rec, "why": FILE_DEFECTS[val]}
                continue
            if kind == "family" and val not in ALLOWED_FAMILIES:
                defects[val] = {**rec, "why": "Not a MoSJE typeface. Noto Sans is a standing "
                                              "instruction; Material Symbols Rounded is the icon "
                                              "font."}
                continue
            if kind == "radius" and float(val) >= IMPLAUSIBLE_RADIUS and float(val) < 500:
                defects[val] = {**rec, "why": "A scaled-instance artefact, not a drawn radius."}
                continue
            if rec["pages"] < STANDARD_MIN_PAGES:
                continue                      # one or two pages is not yet the estate's language
            in_contract = val in contract_values
            rec["hasToken"] = in_contract
            if in_contract and kind != "family":
                rec["tokens"] = sorted(contract_values[val])[:4]
            std[val] = rec
            if not in_contract:
                file_only[val] = rec
        return std, file_only, defects

    # --- colour: text fills, container fills and strokes are one colour language ---
    obs_c = defaultdict(lambda: {"count": 0, "pages": set(), "axes": set()})
    for axis in ("textColors", "frameFills", "strokes"):
        for val, d in ev[axis].items():
            h = norm_hex(val)
            if not h:
                continue
            obs_c[h]["count"] += d["count"]
            obs_c[h]["pages"].update(d["pages"])
            obs_c[h]["axes"].add(axis)
    std_c, only_c, def_c = bucket(obs_c, contract["colors"], "colour")
    for h, rec in std_c.items():
        rec["axes"] = sorted(obs_c[h]["axes"])

    def numeric(axes, contract_key, kind="num"):
        merged = defaultdict(lambda: {"count": 0, "pages": set()})
        for axis in axes:
            for val, d in ev[axis].items():
                if not is_int_like(val):
                    continue              # scaled-instance artefact, never a decision
                merged[float(val)]["count"] += d["count"]
                merged[float(val)]["pages"].update(d["pages"])
        return bucket(merged, contract[contract_key], kind)

    std_r, only_r, def_r = numeric(("radii",), "radii", "radius")
    std_s, only_s, def_s = numeric(("fontSizes",), "fontSizes")
    std_p, only_p, def_p = numeric(("padding", "gaps"), "spacing")

    # A size inside a published FLUID range has a token even though no discrete value equals it.
    for n, rec in std_s.items():
        if rec.get("hasToken"):
            continue
        hit = [t for (lo, hi), tt in (contract.get("fontSizeRanges") or {}).items()
               if lo <= n <= hi for t in tt]
        if hit:
            rec["hasToken"] = True
            rec["tokens"] = sorted(set(hit))[:4]
            rec["viaFluidRange"] = True
            only_s.pop(n, None)

    fam_obs = {v: {"count": d["count"], "pages": set(d["pages"])}
               for v, d in ev["families"].items() if v != "mixed"}
    std_f, only_f, def_f = bucket(fam_obs, {k: [] for k in contract["fontFamilies"]}, "family")

    return {
        "pagesOfEvidence": npages,
        "minPagesToCount": STANDARD_MIN_PAGES,
        "colour": {"standard": std_c, "noToken": only_c, "fileDefects": def_c},
        "radius": {"standard": std_r, "noToken": only_r, "fileDefects": def_r},
        "fontSize": {"standard": std_s, "noToken": only_s, "fileDefects": def_s},
        "spacing": {"standard": std_p, "noToken": only_p, "fileDefects": def_p},
        "fontFamily": {"standard": std_f, "noToken": only_f, "fileDefects": def_f},
        "weights": dict(sorted(((v, d["count"]) for v, d in ev["weights"].items()),
                               key=lambda kv: -kv[1])),
        "canvasWidths": dict(sorted(((v, d["count"]) for v, d in ev["canvasWidths"].items()
                                     if is_int_like(v)), key=lambda kv: -kv[1])[:8]),
        "components": dict(sorted(((v, d["count"]) for v, d in ev["libraries"].items()),
                                  key=lambda kv: -kv[1])[:40]),
    }


def nearest(h, contract_colors):
    """Closest contract colour by max per-channel distance — the same metric integrity.py uses,
    so 'near-miss' means the same thing in the standard and in the gate.

    DETERMINISTIC. The contract holds colours that tie: `#dcdee1` and `#dcdee2` are both exactly
    as near to some greys, and with `d < bd` the winner was whichever the dict yielded first. The
    written file therefore differed between two runs over identical inputs, which made
    `--check` report "stale" forever and would have made the CI gate permanently red. A generated
    artefact that differs from itself cannot have a staleness gate.

    Ties break on the colour string, so the answer is the same everywhere, every run.
    """
    try:
        r, g, b = (int(h[i:i + 2], 16) for i in (1, 3, 5))
    except ValueError:
        return None
    best, bd = None, None
    for c in sorted(contract_colors):
        try:
            r2, g2, b2 = (int(c[i:i + 2], 16) for i in (1, 3, 5))
        except ValueError:
            continue
        d = max(abs(r - r2), abs(g - g2), abs(b - b2))
        if bd is None or d < bd:
            best, bd = c, d
    return (best, bd) if best else None


def git_sha():
    try:
        return subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=REPO,
                              capture_output=True, text=True, timeout=10).stdout.strip() or None
    except Exception:
        return None


def build():
    contract = read_contract()
    evidence = read_evidence()
    std = build_standard(contract, evidence)
    pkg = json.load(open(TOKENS_PKG, encoding="utf-8")) if os.path.exists(TOKENS_PKG) else {}
    bound, unbound = evidence["boundFills"], evidence["unboundFills"]
    return {
        "_what": "The SAMAVESH house standard: the baseline a MoSJE portal is audited against when "
                 "it has no design frames of its own. Generated — never hand-edited. "
                 "Regenerate with `python3 tools/design-audit/house/derive.py`.",
        "_authority": "THE FIGMA HANDOFF FILE CONVICTS; the token contract cross-references. A "
                      "build value outside `standard` — the language established on 3+ non-draft "
                      "pages — is a finding against the PORTAL, because the portal is built from "
                      "the file. A standard value with no matching token (`noToken`) is a real "
                      "design-system gap worth publishing, but it does NOT excuse the portal. "
                      "Values the file draws that are excluded by name are in `fileDefects`.",
        "_correction": "This was inverted in the first version: the contract convicted and the "
                       "file only corroborated. That reported a token-adoption figure against an "
                       "authority PM-AJAY was never built to, and filed the build's Tailwind-v4 "
                       "slate neutrals as a design-system gap that excused the portal, when "
                       "against the file's Tailwind-v3 gray they are a live portal finding.",
        "provenance": {
            "contract": {
                "source": "packages/tokens/dist/tokens.css (generated Tier-2 --sa-* layer)",
                "package": pkg.get("name"), "version": pkg.get("version"),
                "excludes": "--sa-ref-* Tier-1 primitives — app code may never consume one",
                "counts": {k: len(v) for k, v in contract.items() if not k.startswith("_")},
                "brandModes": contract.get("_modes", []),
                "_modeNote": "The baseline is the UNION across every brand/mode/surface block, so "
                             "a build in one mode is never convicted for a value another mode "
                             "publishes. Deliberately permissive.",
            },
            "evidence": {
                "source": evidence["_source"],
                "pagesCounted": evidence["nonDraftPages"],
                "pagesExcludedAsDraft": evidence["drafts"],
                "variableBindingRate": round(bound / (bound + unbound), 4) if bound + unbound else None,
                "_bindingNote": "Share of sampled fills bound to a Figma variable rather than set "
                                "as a literal. A literal that merely EQUALS a token is not bound to "
                                "it (documentation-ds-linkage.md). This is the design FILE's own "
                                "adoption figure and is not a measure of any build.",
            },
            "gitSha": git_sha(),
        },
        "contract": {
            "colors": sorted(contract["colors"]),
            "radii": sorted(contract["radii"]),
            "fontSizes": sorted(contract["fontSizes"]),
            "fontSizeRanges": [{"min": lo, "max": hi, "tokens": sorted(set(t))[:4]}
                               for (lo, hi), t in sorted(contract["fontSizeRanges"].items())],
            "spacing": sorted(contract["spacing"]),
            "fontFamilies": sorted(contract["fontFamilies"]),
        },
        "tokenNames": {
            "colors": {h: sorted(n)[:4] for h, n in contract["colors"].items()},
            "radii": {str(n): sorted(t)[:4] for n, t in contract["radii"].items()},
            "fontSizes": {str(n): sorted(t)[:4] for n, t in contract["fontSizes"].items()},
            "spacing": {str(n): sorted(t)[:4] for n, t in contract["spacing"].items()},
        },
        "standard": std,
        "typeRamp": evidence["variableDefsSample"].get("type", {}),
        "chrome": {
            "_what": "The components every page of the estate composes. A portal missing one of "
                     "these is missing estate chrome, which is a finding a token diff cannot see.",
            "everyPage": ["navbar", "Accessibility Bar", "Logo"],
            "everyAdminPage": ["sidebar/type-1", "sidebar/type-1/main-item"],
            "common": ["Button", "Icon Button", "input-field/text", "Badge", "drop-down",
                       "Default Chips", "Tab", "Checkbox", "radio-buttons", "Toggle",
                       "step/type-2", "step-count/type-2", "progress-indicator",
                       "file-uploader/small", "Input Area", "OTP-input-container", "card/kpi",
                       "Footer - Bottom Strip", "icon-font"],
        },
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true",
                    help="fail if the committed standard differs from a fresh derivation")
    a = ap.parse_args()
    fresh = build()
    if a.check:
        if not os.path.exists(OUT):
            sys.exit(f"FAIL {OUT} missing — run `python3 house/derive.py`")
        have = json.load(open(OUT, encoding="utf-8"))
        # gitSha moves with every commit and says nothing about the standard's content.
        for d in (fresh, have):
            d.get("provenance", {}).pop("gitSha", None)
        # Compare LIKE WITH LIKE. `build()` returns dicts keyed by float (radii, font sizes), and
        # `sort_keys` orders those numerically — 8.0, 12.0, 999.0 — while the same dict reloaded
        # from JSON has string keys and sorts lexically — "12.0", "8.0", "999.0". The two dumps
        # differed on ordering alone, identical in length and content, so the gate reported the
        # standard stale on a file it had just written and would have been permanently red in CI.
        # Round-tripping the fresh object gives it the same key types the file has.
        fresh = json.loads(json.dumps(fresh))
        if json.dumps(have, sort_keys=True) != json.dumps(fresh, sort_keys=True):
            sys.exit("FAIL house standard is stale — the token contract or the Figma evidence "
                     "moved. Re-run `python3 tools/design-audit/house/derive.py`.")
        print("PASS house standard is current")
        return
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(fresh, f, indent=2, sort_keys=True)
        f.write("\n")
    c = fresh["contract"]
    o = fresh["standard"]
    print(f"wrote {os.path.relpath(OUT, REPO)}")
    print(f"  contract: {len(c['colors'])} colours · {len(c['radii'])} radii · "
          f"{len(c['fontSizes'])} fixed sizes + {len(c['fontSizeRanges'])} fluid ranges · "
          f"{len(c['spacing'])} spacing · {len(c['fontFamilies'])} families")
    print(f"  evidence: {o['pagesOfEvidence']} non-draft pages · "
          f"binding rate {fresh['provenance']['evidence']['variableBindingRate']}")
    print(f"  STANDARD (convicts, from {o['pagesOfEvidence']} non-draft pages, "
          f">={o['minPagesToCount']} pages each): "
          f"{len(o['colour']['standard'])} colours · {len(o['radius']['standard'])} radii · "
          f"{len(o['fontSize']['standard'])} sizes · {len(o['spacing']['standard'])} spacing · "
          f"{len(o['fontFamily']['standard'])} families")
    print(f"  of those, NO matching token (a design-system gap, not a portal defect): "
          f"{len(o['colour']['noToken'])} colours · {len(o['radius']['noToken'])} radii · "
          f"{len(o['fontSize']['noToken'])} sizes")
    print(f"  file defects excluded by name: "
          f"{len(o['colour']['fileDefects'])} colours · "
          f"{len(o['fontFamily']['fileDefects'])} families · "
          f"{len(o['radius']['fileDefects'])} radii")


if __name__ == "__main__":
    main()
