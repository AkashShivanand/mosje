#!/usr/bin/env python3
"""Derive the SAMAVESH house standard — the baseline for a portal with no design frames.

WHY THIS EXISTS
---------------
Every audit so far has had a Figma page to diff against. PM-AJAY does not: its handoff page is a
draft the user has said may not reflect the built UI. Without a design side, an audit either
becomes opinion, or it convicts against a *written* standard. This file builds that standard, and
it builds it from two independent sources so neither can be wrong alone:

  1. THE CONTRACT — `packages/tokens/dist/tokens.css`, the generated Tier-2 `--sa-*` layer. This is
     the authority. It is versioned, generated from DTCG source, and already gated by
     `npm test -w @mosje/tokens`. A finding convicts against this and nothing else.

  2. THE EVIDENCE — `house/evidence/figma-page-histograms.json`, what all 12 pages of the handoff
     file actually draw, with frequencies. This does NOT create authority; it does three other
     jobs. It CORROBORATES (a contract value the estate demonstrably uses is a precedent a
     developer cannot argue with), it RANKS (a value on 11 of 12 pages is a stronger call than one
     on 2), and it exposes DESIGN-FILE DRIFT (a value the file uses that the contract does not
     publish — which is a defect in the design file, not in the build).

THE RULE THIS ENCODES, and it is the one that makes a design-less audit honest:

    A build value is convicted only when it is absent from the CONTRACT.
    A value absent from the contract but WIDESPREAD in the design file is a house-standard GAP —
    raise it against the design system, never against the portal.

Without that split, the audit punishes a developer for following the estate's own drift. That is
the same error as `gate_quoted_build_colours` convicting a correct finding: judging against
evidence that is not complete. Here the contract is complete by construction; the file is not.

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


def classify(contract, evidence):
    """Split observed values into corroborated / contract-only / design-file drift."""
    ev = evidence["aggregate"]
    npages = len(evidence["nonDraftPages"])

    # --- colour: text fills, container fills and strokes are all one colour contract ---
    observed_colors = defaultdict(lambda: {"count": 0, "pages": set(), "axes": set()})
    for axis in ("textColors", "frameFills", "strokes"):
        for val, d in ev[axis].items():
            h = norm_hex(val)
            if not h:
                continue
            observed_colors[h]["count"] += d["count"]
            observed_colors[h]["pages"].update(d["pages"])
            observed_colors[h]["axes"].add(axis)

    corrob_c, drift_c = {}, {}
    for h, d in observed_colors.items():
        rec = {"count": d["count"], "pages": len(d["pages"]), "axes": sorted(d["axes"])}
        if h in contract["colors"]:
            rec["tokens"] = sorted(contract["colors"][h])[:4]
            corrob_c[h] = rec
        else:
            # nearest contract colour, so the report can say "7 points from #e5e7eb" rather than
            # "unknown colour" — the near-miss is the finding, per the ledger's 2026-09-12 entry.
            near = nearest(h, contract["colors"])
            if near:
                rec["nearest"], rec["distance"] = near
            drift_c[h] = rec

    def split_num(axis_names, contract_key, ranges=None):
        corrob, drift = {}, {}
        merged = defaultdict(lambda: {"count": 0, "pages": set()})
        for axis in axis_names:
            for val, d in ev[axis].items():
                if not is_int_like(val):
                    continue          # scaled-instance artifact, not a decision
                merged[float(val)]["count"] += d["count"]
                merged[float(val)]["pages"].update(d["pages"])
        for n, d in merged.items():
            rec = {"count": d["count"], "pages": len(d["pages"])}
            if n in contract[contract_key]:
                rec["tokens"] = sorted(contract[contract_key][n])[:4]
                corrob[n] = rec
                continue
            # A fluid tier is a RANGE. A size inside one is conformant even though no discrete
            # token equals it — the design file draws the tier at one viewport, the contract
            # publishes the whole interval.
            hit = [t for (lo, hi), tt in (ranges or {}).items() if lo <= n <= hi for t in tt]
            if hit:
                rec["tokens"] = sorted(set(hit))[:4]
                rec["viaFluidRange"] = True
                corrob[n] = rec
            else:
                drift[n] = rec
        return corrob, drift

    corrob_r, drift_r = split_num(("radii",), "radii")
    corrob_s, drift_s = split_num(("fontSizes",), "fontSizes",
                                  ranges=contract.get("fontSizeRanges"))
    corrob_p, drift_p = split_num(("padding", "gaps"), "spacing")

    fams = {v: d["count"] for v, d in ev["families"].items() if v != "mixed"}
    allowed_fams = set(contract["fontFamilies"])
    return {
        "pagesOfEvidence": npages,
        "colour": {"corroborated": corrob_c, "designFileDrift": drift_c},
        "radius": {"corroborated": corrob_r, "designFileDrift": drift_r},
        "fontSize": {"corroborated": corrob_s, "designFileDrift": drift_s},
        "spacing": {"corroborated": corrob_p, "designFileDrift": drift_p},
        "fontFamily": {"allowed": sorted(allowed_fams),
                       "observed": dict(sorted(fams.items(), key=lambda kv: -kv[1])),
                       "designFileDrift": {f: c for f, c in fams.items()
                                           if f not in allowed_fams}},
        "weights": dict(sorted(((v, d["count"]) for v, d in ev["weights"].items()),
                               key=lambda kv: -kv[1])),
        "canvasWidths": dict(sorted(((v, d["count"]) for v, d in ev["canvasWidths"].items()
                                     if is_int_like(v)), key=lambda kv: -kv[1])[:8]),
        "components": dict(sorted(((v, d["count"]) for v, d in ev["libraries"].items()),
                                  key=lambda kv: -kv[1])[:40]),
    }


def nearest(h, contract_colors):
    """Closest contract colour by max per-channel distance — the same metric integrity.py uses,
    so 'near-miss' means the same thing in the standard and in the gate."""
    try:
        r, g, b = (int(h[i:i + 2], 16) for i in (1, 3, 5))
    except ValueError:
        return None
    best, bd = None, 1e9
    for c in contract_colors:
        try:
            r2, g2, b2 = (int(c[i:i + 2], 16) for i in (1, 3, 5))
        except ValueError:
            continue
        d = max(abs(r - r2), abs(g - g2), abs(b - b2))
        if d < bd:
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
    cls = classify(contract, evidence)
    pkg = json.load(open(TOKENS_PKG, encoding="utf-8")) if os.path.exists(TOKENS_PKG) else {}
    bound, unbound = evidence["boundFills"], evidence["unboundFills"]
    return {
        "_what": "The SAMAVESH house standard: the baseline a MoSJE portal is audited against when "
                 "it has no design frames of its own. Generated — never hand-edited. "
                 "Regenerate with `python3 tools/design-audit/house/derive.py`.",
        "_authority": "CONTRACT convicts; EVIDENCE corroborates and ranks. A build value absent "
                      "from `contract` is a finding against the portal. A value absent from the "
                      "contract but widespread in the Figma file is a house-standard GAP and is "
                      "raised against the design system, not against the portal.",
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
        "observed": cls,
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
        if json.dumps(have, sort_keys=True) != json.dumps(fresh, sort_keys=True):
            sys.exit("FAIL house standard is stale — the token contract or the Figma evidence "
                     "moved. Re-run `python3 tools/design-audit/house/derive.py`.")
        print("PASS house standard is current")
        return
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(fresh, f, indent=2, sort_keys=True)
        f.write("\n")
    c = fresh["contract"]
    o = fresh["observed"]
    print(f"wrote {os.path.relpath(OUT, REPO)}")
    print(f"  contract: {len(c['colors'])} colours · {len(c['radii'])} radii · "
          f"{len(c['fontSizes'])} fixed sizes + {len(c['fontSizeRanges'])} fluid ranges · "
          f"{len(c['spacing'])} spacing · {len(c['fontFamilies'])} families")
    print(f"  evidence: {o['pagesOfEvidence']} non-draft pages · "
          f"binding rate {fresh['provenance']['evidence']['variableBindingRate']}")
    print(f"  corroborated: {len(o['colour']['corroborated'])} colours · "
          f"{len(o['radius']['corroborated'])} radii · {len(o['fontSize']['corroborated'])} sizes")
    print(f"  design-file drift (raise against the DS, not the portal): "
          f"{len(o['colour']['designFileDrift'])} colours · "
          f"{len(o['radius']['designFileDrift'])} radii · "
          f"{len(o['fontSize']['designFileDrift'])} sizes · "
          f"{len(o['fontFamily']['designFileDrift'])} font families")


if __name__ == "__main__":
    main()
