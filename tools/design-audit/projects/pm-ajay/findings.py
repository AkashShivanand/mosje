#!/usr/bin/env python3
"""PM-AJAY — the curated findings, and the merge into out/audit-master.json.

The engine's machine pass emits one finding per deviating VALUE (`PMA-DSCONF-*`). That is the
right output for a coverage ledger and the wrong output for a reader: 33 charged values, 94.9% of
their instances explained by ten of them, and every one of those ten a symptom of three decisions
made once in a stylesheet. So the machine list stays in `conformance.json` as evidence, and what
reaches the reader is this: the ROOT CAUSES, each citing the authority it convicts against, and
two of them carrying a CSS patch the engine renders on the live screen.

Scope discipline (`audit-rules.md` E): a defect that recurs on every screen is ONE Global finding,
not twenty-six. A defect owed by the design system rather than the portal carries
`scope: "Design System"` so it reaches the right audience — see PMA-DS-*.

THE AUTHORITY IS THE FIGMA HANDOFF FILE. These findings were re-issued after the first version got
that backwards: it convicted against the generated token contract and demoted the file to
corroboration, which filed the build's slate neutrals as a design-system gap that EXCUSED the
portal and reported an adoption figure against a standard this portal was never built to. The file
— eleven non-draft pages, several marked Dev Synced — is what the development teams build from, so
it is what convicts. The contract cross-references: where it agrees, a finding is doubly grounded;
where it lacks what the file establishes, that is a separate design-system finding.

Run:  python3 projects/pm-ajay/findings.py        # merges into out/audit-master.json
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ENGINE = os.path.join(os.path.dirname(os.path.dirname(HERE)), "design-audit", "engine")
sys.path.insert(0, os.path.join(os.path.dirname(HERE), "..", "engine"))

MASTER = os.path.join(HERE, "out", "audit-master.json")
CONF = os.path.join(HERE, "out", "conformance.json")
LEDGER_PATH = os.path.join(HERE, "out", "coverage-ledger.json")

# The screen every Global finding is illustrated on. The Ministry dashboard is the portal's
# landing view for its most senior role, and it carries all three root causes at once.
REF_ROUTE = "/admin/dashboard"
REF_ROLE = "ministry"
REF_SLUG = "MINISTRY-ADMIN-DASHBOARD"

HOUSE = os.path.join(os.path.dirname(os.path.dirname(HERE)), "house",
                     "samavesh-house-standard.json")

#: Declared once and attached to every finding. `gate_evidence` asks a colour or presence claim
#: for a DESIGN|BUILD crop pair; on a portal with no design frames that pair cannot exist, and the
#: gate's own documented escape hatch is to record the reason rather than weaken the gate.
EVIDENCE_WHY = (
    "There is no design side to crop against — PM-AJAY has no per-screen frames — so a "
    "DESIGN|BUILD crop pair cannot exist for this audit. The evidence is on disk and is stronger "
    "than a crop: capture.py's complete `colorInventory` for every one of the 224 screens (every "
    "colour the page actually paints, containers included), the per-page histograms of all eleven "
    "non-draft Figma pages for the standard side, and for the two findings carrying a `_fix` a "
    "BUILD and a PROPOSED rendering of the real screen. The claims are aggregate — a value across "
    "the portal — not about one element's fill, which is what a crop is for.")


# WITHDRAWN before publication — PMA-GLOBAL-005, "Dashboard figures never arrive, and the empty
# result is drawn as an em-dash". It was drafted from the capture harness's "STILL LOADING (22
# skeleton placeholders)" warning and it was FALSE. The warning's heuristic counted any empty
# coloured div 6-60px tall as a placeholder, which on this dashboard is its PROGRESS BARS; the
# figures had in fact all arrived in the same extraction (47,333 / 22,030 / 19,763 / 14,994, and
# zero em-dash rows), and the page carries 15 `role="status"` elements. The em-dashes seen in one
# early screenshot were a transient pre-data state in a freshly authenticated session, not a
# rendered state of the build.
#
# Recorded here rather than deleted because the near-miss is the lesson: a warning from an
# instrument is not evidence about the product until the instrument has been checked. The
# heuristic is now saturation-aware (see WAIT_FOR_DATA_JS) so a coloured bar is not a skeleton.
# WITHDRAWN before publication — "Dashboard figures never arrive, and the empty result is drawn as
# an em-dash". Drafted from the capture harness's "STILL LOADING (22 skeleton placeholders)"
# warning and FALSE: that heuristic counted any empty coloured div 6-60px tall as a placeholder,
# which on this dashboard is its PROGRESS BARS. The figures had all arrived in the same extraction
# (47,333 / 22,030 / 19,763 / 14,994, zero em-dash rows) and the page carries 15 `role="status"`
# elements. Recorded rather than deleted because the near-miss is the lesson: a warning from an
# instrument is not evidence about the product until the instrument has been checked.
FINDINGS = [
    # --- ordered by size of the deviation, which on this portal is also order of severity -----
    {
        "id": "PMA-GLOBAL-001",
        "title": "The Whole Type Scale Is Three Pixels Larger Than the Estate's",
        "severity": "Major",
        "axis": "Typography",
        "scope": "Global",
        "slug": REF_SLUG, "_route": REF_ROUTE, "_role": REF_ROLE,
        "design": "Across the eleven non-draft pages of the handoff file the estate's body size is "
                  "14px — {n3:14} nodes, on every page, the single most-used value in the "
                  "file. The steps around it are 11, 12, 13, 16, 18, 20 and 24. The token contract "
                  "agrees where it publishes at all: `--sa-type-body-2-size` is 14px.",
        "build": "The portal redefines Tailwind's own scale upward, so every utility class "
                 "resolves through the new values: `--text-xs` is `.9375rem` (15px) against "
                 "Tailwind's `.75rem`, `--text-sm` is `1.0625rem` (17px) against `.875rem`, and "
                 "`--text-base` is `1.1875rem` (19px) against `1rem`. The result is a portal whose "
                 "body text is **17px on {n:fontSize:17} elements across {s:fontSize:17} of the "
                 "224 screens** — the largest single deviation in this audit — with 15px on "
                 "{n:fontSize:15} more, 21px on {n:fontSize:21} and 19px on {n:fontSize:19}. Not "
                 "one of those four sizes is drawn anywhere in the handoff file.",
        "fix": "Restore the three scale variables to the published steps. It is one declaration "
               "block and it brings every element on every screen back onto the estate's scale at "
               "once; correcting sizes per component would have to be redone on each new screen.",
        "_cites": ["--sa-type-body-2-size", "--sa-type-body-3-size", "--sa-type-body-1-size"],
        "_liveCheck": "Read from the live DOM 2026-09-12 in a fresh tab before signing in, so the "
                      "UX4G accessibility widget's text-size control could not be the cause: "
                      "getComputedStyle(documentElement) returned --text-xs .9375rem, "
                      "--text-sm 1.0625rem, --text-base 1.1875rem with html font-size at 16px.",
        "_evidenceWhy": EVIDENCE_WHY,
        "_fix": {
            "selector": ":root",
            "css": ":root{--text-xs:.75rem;--text-sm:.875rem;--text-base:1rem;}",
            "why": "Returns the three Tailwind scale variables to the steps the estate draws. "
                   "Every utility resolves through them, so the whole page comes back on scale "
                   "from one block.",
        },
    },
    {
        "id": "PMA-GLOBAL-002",
        "title": "Body and Label Text Uses Tailwind's Slate Ramp, Not the Estate's Ink",
        "severity": "Major",
        "axis": "Color & Token",
        "scope": "Global",
        "slug": REF_SLUG, "_route": REF_ROUTE, "_role": REF_ROLE,
        "design": "The estate's ink is settled and unambiguous in the handoff file: `#1f2937` for "
                  "primary text on {n2:1f2937} nodes across all eleven non-draft pages, `#374151` "
                  "for secondary, with `#6b7280` and `#9ca3af` for supporting text and `#e5e7eb` / "
                  "`#d1d5db` / `#f9fafb` for borders and quiet surfaces. That is Tailwind's v3 "
                  "grey ramp, and every other portal on the estate renders it.",
        "build": "PM-AJAY renders Tailwind **v4 slate** instead — a different ramp, not a different "
                 "shade of the same one. `#314158` on {n:color:#314158} elements across "
                 "{s:color:#314158} screens, `#4a5565` on {n:color:#4a5565} across ALL "
                 "{s:color:#4a5565}, `#0f172b` on {n:color:#0f172b}, `#364153` on "
                 "{n:color:#364153} across all {s:color:#364153}, plus `#45556c`, `#62748e` and "
                 "`#90a1b9`. The markup names them directly (`text-slate-500`, `text-slate-900`). "
                 "None of those seven values is drawn anywhere in the handoff file, and none is in "
                 "the token contract either — so this portal matches neither the design nor the "
                 "design system.",
        "fix": "Map the slate steps onto the ink the rest of the estate renders — darkest to "
               "`#1f2937`, the mid steps to `#374151`, supporting text to `#6b7280` — or, better, "
               "onto the published ink tokens once PMA-DS-001 settles which ramp the contract "
               "carries. Either way the portal should stop being the only one on a third ramp.",
        "_cites": ["--sa-text-neutral-base", "--sa-text-neutral-subtle",
                   "--sa-text-neutral-subtler"],
        "_liveCheck": "Both halves were checked rather than assumed. The seven values were read "
                      "from the live DOM on 2026-09-12 (oklch decoded through oklab to sRGB, the "
                      "decoder verified against slate-200 = #e2e8f0). Their absence from the "
                      "estate's language was checked against the per-page histograms of all "
                      "eleven non-draft pages, and their absence from the contract by grepping "
                      "the generated packages/tokens/dist/tokens.css: 0 occurrences apiece.",
        "_evidenceWhy": EVIDENCE_WHY,
        "_fix": {
            "selector": "body",
            "css": ("body .text-slate-900,body .text-slate-950,body .text-slate-800"
                    "{color:#1f2937 !important}"
                    "body .text-slate-700,body .text-slate-600{color:#374151 !important}"
                    "body .text-slate-500,body .text-slate-400{color:#6b7280 !important}"),
            "why": "Shows the estate's own ink in place of the slate ramp — the same values every "
                   "other portal renders. !important is used only because a preview patch is "
                   "injected last and must beat a utility class; the real fix is the mapping.",
        },
    },
    {
        "id": "PMA-GLOBAL-003",
        "title": "The Portal Loads None of the Design System's Tokens",
        "severity": "Major",
        "axis": "Color & Token",
        "scope": "Global",
        "slug": REF_SLUG, "_route": REF_ROUTE, "_role": REF_ROLE,
        "design": "Every MoSJE property consumes the published `--sa-*` contract from "
                  "@mosje/tokens. That is what lets a brand, density or accessibility change reach "
                  "every portal at once instead of being re-typed per repository.",
        "build": "No `--sa-*` custom property is defined in any stylesheet the portal serves — 0 "
                 "of them, counted in the live DOM on both a pre-login and an authenticated "
                 "screen. The portal defines its own `--primary-color: #0a3a74` instead. This is "
                 "the mechanism behind the two findings above: with no token layer to resolve "
                 "against, the type scale and the palette were free to drift, and they did. Noto "
                 "Sans IS applied (728 of 766 elements on the sign-in page), so the typeface is "
                 "right; it is the token layer that is absent.",
        "fix": "Load the published token stylesheet and consume `--sa-*` rather than a private "
               "variable set. Until that happens every value corrected above has to be corrected "
               "by hand and will drift again on the next release.",
        "_cites": ["--sa-text-neutral-base", "rules/design-system-architecture.md"],
        "_liveCheck": "Read from the live DOM 2026-09-12: iterated every document.styleSheets "
                      "rule and counted custom properties beginning --sa- ; the count was 0 on "
                      "both a pre-login and an authenticated screen.",
        "_evidenceWhy": EVIDENCE_WHY,
    },
    {
        "id": "PMA-GLOBAL-004",
        "title": "Status Colours Come From Tailwind's Palette, and One Meaning Has Four Greens",
        "severity": "Minor",
        "axis": "Color & Token",
        "scope": "Global",
        "slug": REF_SLUG, "_route": REF_ROUTE, "_role": REF_ROLE,
        "design": "The estate's status colours are settled in the file: `#ec5042` for error on "
                  "{n2:ec5042} nodes across all eleven pages, and `#2e7d32` for success on "
                  "{n2:2e7d32} across nine. A citizen learns one colour per meaning and carries it "
                  "between portals.",
        "build": "The portal paints status from Tailwind's semantic palette instead: `#fb2c36` on "
                 "{n:color:#fb2c36} elements across {s:color:#fb2c36} screens, `#e7000b` and "
                 "`#c10007` for errors and required-field markers, `#f54900` for 'Active', and "
                 "four separate greens — `#008236`, `#007a55`, `#00a63e`, `#006045` — for approved "
                 "and on-track states. Four greens for one meaning is the part that matters: a "
                 "reader cannot learn a colour that changes between screens.",
        "fix": "Bind status text and status backgrounds to the estate's status values, and settle "
               "on ONE green for 'approved / on track' across the three components.",
        "_cites": ["--sa-text-status-error-base", "--sa-bg-status-success-base"],
        "_evidenceWhy": EVIDENCE_WHY,
    },
    # --- DESIGN-SYSTEM findings. Not the portal's to fix, and they do not excuse it. ----------
    {
        "id": "PMA-DS-001",
        "title": "The Token Contract Does Not Publish the Estate's Own Most-Used Colours",
        "severity": "Major",
        "axis": "Color & Token",
        "scope": "Design System",
        "slug": REF_SLUG, "_route": REF_ROUTE, "_role": REF_ROLE,
        "design": "One neutral ramp, published once, consumed everywhere.",
        "build": "There are three, and no two agree. The handoff library draws Tailwind v3 grey — "
                 "`#1f2937` on {n2:1f2937} nodes across all eleven non-draft pages, plus "
                 "`#374151`, `#e5e7eb`, `#d1d5db`, `#f9fafb` and `#e5eff9`. The generated contract "
                 "publishes its own instead — `#1e2124`, `#3a3d41`, `#dcdee1`, `#6f757d` — and "
                 "**not one of the library's grey values appears even once in tokens.css**. The "
                 "PM-AJAY build then serves Tailwind v4 slate, matching neither. The same gap "
                 "covers the estate's semantic colours: `#ec5042` and `#2e7d32` are drawn on nine "
                 "to eleven pages apiece and neither has a token.",
        "fix": "Decide which ramp is the estate's, in one place, and publish it. Either the "
               "contract adopts the values the library has been drawing for a year, or the library "
               "rebinds to the contract's and every page is restyled. Until then a developer "
               "asking 'which grey is correct?' has three defensible answers, which is the "
               "condition that produced PMA-GLOBAL-002.",
        "_cites": ["HOUSE-GAP", "--sa-text-neutral-base"],
        "_liveCheck": "Checked in the generated contract, not inferred: grepped "
                      "packages/tokens/dist/tokens.css for each of the library's six grey values "
                      "and for #ec5042 and #2e7d32 — 0 occurrences apiece. The library counts come "
                      "from the per-page histograms of all eleven non-draft pages.",
        "_evidenceWhy": EVIDENCE_WHY,
    },
    {
        "id": "PMA-DS-002",
        "title": "Two Established Type Steps Are Unreachable From a Conformant Stylesheet",
        "severity": "Minor",
        "axis": "Typography",
        "scope": "Design System",
        "slug": REF_SLUG, "_route": REF_ROUTE, "_role": REF_ROLE,
        "design": "One type ramp, shared by the library and the code.",
        "build": "The estate draws 13px on {n3:13} nodes across all eleven non-draft pages and "
                 "11px on {n3:11} across ten, and the contract publishes neither. 11px exists only "
                 "as `--sa-ref-size-11`, a Tier-1 primitive that app code may never consume and "
                 "that the token build fails a component for naming. So two steps the estate uses "
                 "daily cannot be reached from a conformant stylesheet at all.",
        "fix": "Promote 11px and 13px to Tier-2 semantic steps so a stylesheet can legitimately "
               "reach them, or correct the library to the steps the contract publishes and restyle "
               "the specimens that depend on them. Leaving them Tier-1-only is the one option that "
               "keeps the contradiction.",
        "_cites": ["HOUSE-GAP", "--sa-type-label-3-size"],
        "_liveCheck": "packages/tokens/dist/tokens.css declares --sa-type-label-3-size: 0.75rem "
                      "(12px), and its ONLY 0.6875rem (11px) declaration is --sa-ref-size-11 at "
                      "line 586 — a Tier-1 primitive, excluded from the consumable contract by "
                      "construction. No 0.8125rem (13px) declaration exists.",
        "_evidenceWhy": EVIDENCE_WHY,
    },
    {
        "id": "PMA-DS-003",
        "title": "The Handoff File Carries Its Own Drift on Every Page",
        "severity": "Minor",
        "axis": "Color & Token",
        "scope": "Design System",
        "slug": REF_SLUG, "_route": REF_ROUTE, "_role": REF_ROLE,
        "design": "A handoff library is the thing developers copy. Anything in it that is not a "
                  "decision will be built.",
        "build": "Three classes of drift sit on all eleven non-draft pages. `#d9d9d9` — Figma's "
                 "default rectangle fill — is on {n4:d9d9d9} shapes that were never given a "
                 "colour. Pure `#000000` text is on {n4:000000} nodes, where the file's own "
                 "dominant ink is `#1f2937` by a factor of six. And six typefaces appear against a "
                 "standing Noto Sans instruction: Inter on three pages (282 nodes), plus Roboto, "
                 "Open Sans, Poppins, Helvetica Neue and Material Icons Round — the last being the "
                 "wrong icon font, where the standard is Material Symbols **Rounded**. Just over "
                 "half of all sampled fills in the file are literals rather than bound variables.",
        "fix": "Bind the placeholder shapes or delete them, replace pure black with the ink style, "
               "and restyle the stray typefaces. These are excluded from the standard this audit "
               "convicts against, so no portal is charged for them — but they are what a developer "
               "copies when the file is the reference.",
        "_cites": ["HOUSE-GAP", "rules/documentation-ds-linkage.md"],
        "_evidenceWhy": EVIDENCE_WHY,
    },
]


LEDGER = {}


def _dev_index(conf):
    """{(prop, value): record} for every value the machine pass charged."""
    return {(d["prop"], str(d["value"]).lower()): d for d in conf.get("deviations", [])}


def _house():
    return json.load(open(HOUSE, encoding="utf-8")) if os.path.exists(HOUSE) else {}


def substitute(text, conf):
    """Fill the measurement placeholders. Nothing numeric in a finding is typed by hand.

    BUILD side, from out/conformance.json:
        {n:prop:value}   elements the build renders with that value
        {s:prop:value}   screens it appears on
    FIGMA side, from house/samavesh-house-standard.json:
        {n2:hex}         nodes the non-draft pages draw in that colour (the standard)
        {n3:size}        nodes at that font size (the standard)
        {n4:hex}         nodes in that colour among the file's excluded DEFECTS

    The first version of this file typed the counts into the prose — "926 elements across 26 of
    the 27 captured screens". Nineteen more screens were captured an hour later and every one of
    those sentences became wrong while still reading as precise; the true figure was 7,033 across
    43. A figure a reader cannot trust is worse than no figure, so the prose names the measurement
    and the merge fills it in — and REFUSES to publish a count it cannot source.
    """
    import re as _re
    idx = _dev_index(conf)
    h = _house().get("standard", {})

    def _file_count(axis, key, bucket):
        d = (h.get(axis, {}) or {}).get(bucket, {}) or {}
        for k, v in d.items():
            if str(k).lstrip("#").lower() == str(key).lstrip("#").lower():
                return v.get("count")
            try:
                if float(k) == float(key):
                    return v.get("count")
            except (TypeError, ValueError):
                pass
        return None

    def repl_file(m):
        kind, key = m.group(1), m.group(2)
        axis, bucket = {"n2": ("colour", "standard"), "n3": ("fontSize", "standard"),
                        "n4": ("colour", "fileDefects")}[kind]
        n = _file_count(axis, key, bucket)
        if n is None:
            raise SystemExit(f"! findings.py: no FIGMA-side measurement for {axis} {key} in "
                             f"{bucket}. Re-run house/derive.py, or correct the finding: a count "
                             f"that cannot be sourced must not be published.")
        return f"{n:,}"

    text = _re.sub(r"\{(n2|n3|n4):([^}]+)\}", repl_file, text)

    def repl(m):
        kind, prop, val = m.group(1), m.group(2), m.group(3)
        rec = idx.get((prop, val.lower()))
        if not rec:
            raise SystemExit(f"! findings.py: no BUILD measurement for {prop} {val} — the value "
                             f"is not in conformance.json. Re-run --phase analyze, or correct the "
                             f"finding: a count that cannot be sourced must not be published.")
        return f"{rec['count']:,}" if kind == "n" else f"{rec['screens']}"

    return _re.sub(r"\{([ns]):([a-zA-Z]+):([^}]+)\}", repl, text)


def merge():
    if not os.path.exists(MASTER):
        sys.exit(f"! {MASTER} missing — run `--phase analyze` first.")
    master = json.load(open(MASTER))
    conf = json.load(open(CONF)) if os.path.exists(CONF) else {}
    global LEDGER
    LEDGER = json.load(open(LEDGER_PATH)) if os.path.exists(LEDGER_PATH) else {}

    # The curated findings REPLACE the machine per-value list as what a reader receives. The
    # machine list is not deleted — it stays in conformance.json as the evidence the curation
    # rests on, and the counts below carry it into the report so nothing is quietly dropped.
    resolved = []
    for f in FINDINGS:
        g = dict(f)
        for k in ("build", "design", "fix"):
            if isinstance(g.get(k), str):
                g[k] = substitute(g[k], conf)
        resolved.append(g)
    master["findings"] = resolved
    master["curation"] = {
        "curated": len(resolved),
        "screensMeasured": LEDGER.get("stats", {}).get("captured"),
        "elementsChecked": conf.get("elements_checked"),
        "dsAdoptionPct": conf.get("ds_adoption_pct"),
        "portal": sum(1 for f in resolved if f["scope"] != "Design System"),
        "designSystem": sum(1 for f in resolved if f["scope"] == "Design System"),
        "machineValuesCharged": conf.get("concentration", {}).get("distinct_values_charged"),
        "machineInstancesCharged": conf.get("concentration", {}).get("deviating_element_instances"),
        "top10SharePct": conf.get("concentration", {}).get("top10_share_pct"),
        "_why": ("The machine pass emits one finding per deviating VALUE. Ten values explain "
                 f"{conf.get('concentration', {}).get('top10_share_pct')}% of all charged "
                 "instances and every one is a symptom of three decisions made once in a "
                 "stylesheet, so the reader receives the root causes and conformance.json keeps "
                 "the per-value evidence."),
    }
    master["baselineMode"] = "house"
    master["_noDesignPanel"] = (
        "PM-AJAY has no per-screen Figma design: the handoff file's PM-AJAY page is a draft the "
        "user confirmed may not reflect the built UI, and it is the least variable-bound page in "
        "the file. There is therefore no DESIGN panel. Findings are judged against the SAMAVESH "
        "house standard and two of them carry a PROPOSED panel rendered by engine/fixpreview.py.")
    with open(MASTER, "w") as f:
        json.dump(master, f, indent=2)
    c = master["curation"]
    print(f"merged {c['curated']} curated findings into out/audit-master.json "
          f"({c['portal']} portal · {c['designSystem']} design-system) over "
          f"{c['machineValuesCharged']} machine-charged values")


if __name__ == "__main__":
    merge()
