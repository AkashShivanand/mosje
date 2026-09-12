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
FINDINGS = [
    # ---------------------------------------------------------------------------------------
    # The root cause. Everything below is a consequence of it, and it is stated first so a
    # reader does not fix five symptoms and wonder why the sixth came back.
    {
        "id": "PMA-GLOBAL-001",
        "title": "The Portal Does Not Load the Design System's Tokens",
        "severity": "Major",
        "axis": "Color & Token",
        "scope": "Global",
        "slug": REF_SLUG, "_route": REF_ROUTE, "_role": REF_ROLE,
        "_evidenceWhy": "There is no design side to crop against, so a DESIGN|BUILD crop pair "
                        "cannot exist for this audit. The evidence is stronger than a crop and "
                        "is on disk: capture.py's complete `colorInventory` for every screen — "
                        "every colour the page actually paints, containers included — plus, for "
                        "the two findings carrying a `_fix`, a BUILD and a PROPOSED rendering of "
                        "the real screen. The claims here are aggregate (a value across the "
                        "portal), not about one element's fill, which is what a crop is for.",
        "design": "Every MoSJE property consumes the published `--sa-*` contract from "
                  "@mosje/tokens, which is what makes one estate look like one estate and lets a "
                  "brand or density change reach every portal at once.",
        "build": "No `--sa-*` custom property is defined in any stylesheet the portal serves. "
                 "Counted in the live DOM on the sign-in page and on the Ministry dashboard: 0 of "
                 "them. The portal defines its own `--primary-color: #0a3a74` instead. Noto Sans "
                 "IS applied (728 of 766 elements on the sign-in page), so the typeface is right; "
                 "it is the token layer that is absent.",
        "fix": "Load the published token stylesheet and consume `--sa-*` rather than a private "
               "variable set. Until that happens every value below has to be corrected by hand "
               "and will drift again on the next release.",
        "_cites": ["--sa-text-neutral-base", "rules/design-system-architecture.md"],
        "_liveCheck": "Read from the live DOM 2026-09-12: iterated every document.styleSheets "
                      "rule and counted custom properties beginning --sa- ; the count was 0 on "
                      "both a pre-login and an authenticated screen.",
    },
    # ---------------------------------------------------------------------------------------
    {
        "id": "PMA-GLOBAL-002",
        "title": "Tailwind's Type Scale Is Redefined Three Pixels Larger Than the Published Ramp",
        "severity": "Major",
        "axis": "Typography",
        "scope": "Global",
        "slug": REF_SLUG, "_route": REF_ROUTE, "_role": REF_ROLE,
        "_evidenceWhy": "There is no design side to crop against, so a DESIGN|BUILD crop pair "
                        "cannot exist for this audit. The evidence is stronger than a crop and "
                        "is on disk: capture.py's complete `colorInventory` for every screen — "
                        "every colour the page actually paints, containers included — plus, for "
                        "the two findings carrying a `_fix`, a BUILD and a PROPOSED rendering of "
                        "the real screen. The claims here are aggregate (a value across the "
                        "portal), not about one element's fill, which is what a crop is for.",
        "design": "The published ramp is 12 / 14 / 16px for body and label text "
                  "(`--sa-type-body-3-size`, `--sa-type-body-2-size`, `--sa-type-body-1-size`), "
                  "with the heading tiers fluid above 16px. 14px is the estate's workhorse size.",
        "build": "The portal redefines Tailwind's own scale upward: `--text-xs` is `.9375rem` "
                 "(15px) where Tailwind ships `.75rem` (12px), `--text-sm` is `1.0625rem` (17px) "
                 "against `.875rem` (14px), and `--text-base` is `1.1875rem` (19px) against "
                 "`1rem`. Because every utility class resolves through those three variables, "
                 "{n:fontSize:15} elements across {s:fontSize:15} captured screens render at "
                 "15px — a size the contract does not publish at all — and the elements doing it "
                 "are marked up as "
                 "`text-xs`, which should be the SMALLEST step.",
        "fix": "Restore the three scale variables to the published steps. This is one declaration "
               "block and it corrects the size of every element on every screen at once; leaving "
               "the variables overridden and correcting sizes per component would have to be "
               "redone on each new screen.",
        "_cites": ["--sa-type-body-2-size", "--sa-type-body-3-size", "--sa-type-body-1-size"],
        "_liveCheck": "Read from the live DOM 2026-09-12 in a fresh tab before signing in, so the "
                      "UX4G accessibility widget's text-size control could not be the cause: "
                      "getComputedStyle(documentElement) returned --text-xs .9375rem, "
                      "--text-sm 1.0625rem, --text-base 1.1875rem with html font-size at 16px.",
        "_fix": {
            "selector": ":root",
            "css": ":root{--text-xs:.75rem;--text-sm:.875rem;--text-base:1rem;}",
            "why": "Returns the three Tailwind scale variables to the published 12/14/16 steps. "
                   "Every utility resolves through them, so the whole page comes back on scale "
                   "from one block.",
        },
    },
    # ---------------------------------------------------------------------------------------
    {
        "id": "PMA-GLOBAL-003",
        "title": "Body and Label Text Uses Tailwind's Slate Ramp, Not the Published Neutral Ink",
        "severity": "Major",
        "axis": "Color & Token",
        "scope": "Global",
        "slug": REF_SLUG, "_route": REF_ROUTE, "_role": REF_ROLE,
        "_evidenceWhy": "There is no design side to crop against, so a DESIGN|BUILD crop pair "
                        "cannot exist for this audit. The evidence is stronger than a crop and "
                        "is on disk: capture.py's complete `colorInventory` for every screen — "
                        "every colour the page actually paints, containers included — plus, for "
                        "the two findings carrying a `_fix`, a BUILD and a PROPOSED rendering of "
                        "the real screen. The claims here are aggregate (a value across the "
                        "portal), not about one element's fill, which is what a crop is for.",
        "design": "The contract publishes three neutral ink steps — "
                  "`--sa-text-neutral-base #1e2124` for primary text, "
                  "`--sa-text-neutral-subtle #3a3d41` for secondary, and "
                  "`--sa-text-neutral-subtler #6f757d` for the quietest supporting text.",
        "build": "Text is painted from Tailwind v4's slate ramp instead: #314158 on "
                 "{n:color:#314158} elements across {s:color:#314158} screens, #0f172b on "
                 "{n:color:#0f172b}, #45556c on {n:color:#45556c}, #62748e on "
                 "{n:color:#62748e}, #1d293d on {n:color:#1d293d} and #90a1b9 on "
                 "{n:color:#90a1b9}. The markup names them directly "
                 "(`text-slate-500`, `text-slate-900`). None of those six values appears in the "
                 "token contract. They are close enough to the published ink to look right and "
                 "far enough to be a different palette — which is why this needs measuring "
                 "rather than eyeballing.",
        "fix": "Map the slate steps onto the three published ink tokens — darkest slate to "
               "`--sa-text-neutral-base`, the mid steps to `--sa-text-neutral-subtle`, the "
               "lightest supporting text to `--sa-text-neutral-subtler` — rather than replacing "
               "six hexes with six other hexes.",
        "_cites": ["--sa-text-neutral-base", "--sa-text-neutral-subtle",
                   "--sa-text-neutral-subtler"],
        "_liveCheck": "Both halves were checked rather than assumed. The six values were read "
                      "from the live DOM on 2026-09-12 (oklch decoded through oklab to sRGB, the "
                      "decoder verified against slate-200 = #e2e8f0). Their absence from the "
                      "contract was checked by grepping the generated "
                      "packages/tokens/dist/tokens.css for each one: 0 occurrences apiece.",
        "_fix": {
            "selector": "body",
            "css": ("body .text-slate-900,body .text-slate-950,body .text-slate-800"
                    "{color:#1e2124 !important}"
                    "body .text-slate-700,body .text-slate-600{color:#3a3d41 !important}"
                    "body .text-slate-500,body .text-slate-400{color:#6f757d !important}"),
            "why": "Shows the published ink in place of the slate ramp. !important is used here "
                   "only because a preview patch is injected last and must beat a utility class; "
                   "the real fix is the token mapping, not this stylesheet.",
        },
    },
    # ---------------------------------------------------------------------------------------
    {
        "id": "PMA-GLOBAL-004",
        "title": "Status Colours Come From Tailwind's Palette Rather Than the Status Tokens",
        "severity": "Minor",
        "axis": "Color & Token",
        "scope": "Global",
        "slug": REF_SLUG, "_route": REF_ROUTE, "_role": REF_ROLE,
        "_evidenceWhy": "There is no design side to crop against, so a DESIGN|BUILD crop pair "
                        "cannot exist for this audit. The evidence is stronger than a crop and "
                        "is on disk: capture.py's complete `colorInventory` for every screen — "
                        "every colour the page actually paints, containers included — plus, for "
                        "the two findings carrying a `_fix`, a BUILD and a PROPOSED rendering of "
                        "the real screen. The claims here are aggregate (a value across the "
                        "portal), not about one element's fill, which is what a crop is for.",
        "design": "Status is a published set — `--sa-text-status-error-base #8b1f18`, "
                  "`--sa-bg-status-success-base #ecf4ee` and their siblings — so that a rejected "
                  "application looks the same in every portal on the estate.",
        "build": "The portal paints status from Tailwind's semantic palette: #e7000b on "
                 "{n:color:#e7000b} elements across {s:color:#e7000b} screens and #c10007 on "
                 "{n:color:#c10007} for errors and required-field markers, #f54900 on "
                 "{n:color:#f54900} for 'Active', and #008236 / #007a55 / #00a63e / #006045 "
                 "across four separate greens for approved and on-track states. Four greens for "
                 "one meaning is the part that matters: a reader cannot learn a colour that "
                 "changes between screens.",
        "fix": "Bind status text and status backgrounds to the published status tokens, and "
               "settle on ONE green for 'approved / on track' across the three components.",
        "_cites": ["--sa-text-status-error-base", "--sa-bg-status-success-base"],
    },
    # ---------------------------------------------------------------------------------------
    # DESIGN-SYSTEM findings. These are NOT the portal's to fix, and saying so is the whole point
    # — charging them to the portal team would hand them work they cannot do.
    {
        "id": "PMA-DS-001",
        "title": "Three Different Neutral Ramps Are in Use Across the Estate, and None Knows About the Others",
        "severity": "Major",
        "axis": "Color & Token",
        "scope": "Design System",
        "slug": REF_SLUG, "_route": REF_ROUTE, "_role": REF_ROLE,
        "_evidenceWhy": "There is no design side to crop against, so a DESIGN|BUILD crop pair "
                        "cannot exist for this audit. The evidence is stronger than a crop and "
                        "is on disk: capture.py's complete `colorInventory` for every screen — "
                        "every colour the page actually paints, containers included — plus, for "
                        "the two findings carrying a `_fix`, a BUILD and a PROPOSED rendering of "
                        "the real screen. The claims here are aggregate (a value across the "
                        "portal), not about one element's fill, which is what a crop is for.",
        "design": "One neutral ramp, published once, consumed everywhere.",
        "build": "There are three. The Figma handoff library draws Tailwind v3's grey ramp — "
                 "#1f2937 on 23,853 sampled nodes across all ten non-draft pages, plus #374151, "
                 "#e5e7eb, #d1d5db, #f9fafb and #6b7280. The token contract publishes its own — "
                 "#1e2124, #3a3d41, #dcdee1, #6f757d. The PM-AJAY build serves Tailwind v4's "
                 "slate. Not one of the library's grey values appears even once in tokens.css. "
                 "The ramps sit 4 to 11 points apart per channel, which is invisible on a screen "
                 "and decisive to any token check: no portal on the estate can be conformant on "
                 "neutrals while this stands.",
        "fix": "Decide which ramp is the estate's, in one place. Either the contract adopts the "
               "values the library has been drawing, or the library rebinds to the contract. "
               "Until then a neutral-colour finding against any portal is unanswerable, and this "
               "audit deliberately does not raise one.",
        "_cites": ["HOUSE-GAP", "--sa-text-neutral-base"],
    },
    {
        "id": "PMA-DS-002",
        "title": "The Contract Has No 11px Step, and the Library's label-3 Is 11px",
        "severity": "Minor",
        "axis": "Typography",
        "scope": "Design System",
        "slug": REF_SLUG, "_route": REF_ROUTE, "_role": REF_ROLE,
        "_evidenceWhy": "There is no design side to crop against, so a DESIGN|BUILD crop pair "
                        "cannot exist for this audit. The evidence is stronger than a crop and "
                        "is on disk: capture.py's complete `colorInventory` for every screen — "
                        "every colour the page actually paints, containers included — plus, for "
                        "the two findings carrying a `_fix`, a BUILD and a PROPOSED rendering of "
                        "the real screen. The claims here are aggregate (a value across the "
                        "portal), not about one element's fill, which is what a crop is for.",
        "design": "One type ramp, shared by the library and the code.",
        "build": "The Figma library resolves `label-3` to 11px and the estate draws 11px text on "
                 "9 of the 10 non-draft pages (898 sampled nodes). The generated contract "
                 "publishes `--sa-type-label-3-size: 0.75rem` — 12px. 11px exists in the file "
                 "only as `--sa-ref-size-11`, a Tier-1 primitive that app code may never consume "
                 "and that the token build fails a component for naming. So an 11px label is "
                 "simultaneously the library's published style and unreachable from any "
                 "conformant stylesheet.",
        "fix": "Reconcile the two: promote 11px to a Tier-2 semantic step so a stylesheet can "
               "legitimately reach it, or correct the library's label-3 to 12px and restyle the "
               "specimens that depend on it. Leaving it as a Tier-1 primitive only is the one "
               "option that keeps the contradiction.",
        "_cites": ["HOUSE-GAP", "--sa-type-label-3-size"],
        "_liveCheck": "Checked in the generated contract, not inferred: "
                      "packages/tokens/dist/tokens.css declares "
                      "`--sa-type-label-3-size: 0.75rem`, and its ONLY 0.6875rem (11px) "
                      "declaration is `--sa-ref-size-11` at line 586 — a Tier-1 primitive, "
                      "excluded from the consumable baseline by construction. The library's 11px "
                      "came from get_variable_defs on a PM-AJAY frame, which resolved label-3 "
                      "to 11.",
    },
    {
        "id": "PMA-DS-003",
        "title": "The Navy Shade #001933 Is Drawn on Seven Pages and Published by Neither Layer",
        "severity": "Nit",
        "axis": "Color & Token",
        "scope": "Design System",
        "slug": REF_SLUG, "_route": REF_ROUTE, "_role": REF_ROLE,
        "_evidenceWhy": "There is no design side to crop against, so a DESIGN|BUILD crop pair "
                        "cannot exist for this audit. The evidence is stronger than a crop and "
                        "is on disk: capture.py's complete `colorInventory` for every screen — "
                        "every colour the page actually paints, containers included — plus, for "
                        "the two findings carrying a `_fix`, a BUILD and a PROPOSED rendering of "
                        "the real screen. The claims here are aggregate (a value across the "
                        "portal), not about one element's fill, which is what a crop is for.",
        "design": "A brand shade used across the estate is a published token.",
        "build": "#001933 appears on 7 of the 10 non-draft Figma pages (165 sampled nodes) as the "
                 "darkest navy, and the contract does not publish it. It is a small gap next to "
                 "PMA-DS-001, and it is recorded here so the ramp decision covers the whole navy "
                 "family rather than only the neutrals.",
        "fix": "Publish it as the darkest navy step, or restyle the seven pages onto a step that "
               "exists.",
        "_cites": ["HOUSE-GAP"],
    },
]


LEDGER = {}


def _dev_index(conf):
    """{(prop, value): record} for every value the machine pass charged or excused."""
    out = {}
    for d in conf.get("deviations", []):
        out[(d["prop"], str(d["value"]).lower())] = d
    return out


def substitute(text, conf):
    """Replace `{n:prop:value}` with the MEASURED count, and `{s:prop:value}` with the screen count.

    The first version of this file typed the counts into the prose — "926 elements across 26 of
    the 27 captured screens". Nineteen more screens were captured an hour later and every one of
    those sentences became wrong while still reading as precise. A figure a reader cannot trust
    is worse than no figure, so the prose now names the measurement and the merge fills it in.
    """
    import re as _re
    idx = _dev_index(conf)

    def repl(m):
        kind, prop, val = m.group(1), m.group(2), m.group(3)
        rec = idx.get((prop, val.lower()))
        if not rec:
            # Never invent a number, and never leave a broken token in the prose.
            raise SystemExit(f"! findings.py: no measurement for {prop} {val} — the value is not "
                             f"in conformance.json. Re-run --phase analyze, or correct the "
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
