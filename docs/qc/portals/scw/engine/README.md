# Design-QC extract-and-diff engine

Built per the LLM-council verdict: **the LLM was wrongly placed in the *measurement*
loop (eyeballing screenshots) instead of the *judgment* loop.** This engine inverts that —
it extracts structured specs from BOTH sides, diffs them numerically, and computes pins
from real bounding boxes. The LLM only ranks, phrases, and judges the few genuinely-visual
calls *using extracted facts*. It never measures.

## Pipeline
1. **extract_figma** (MCP `use_figma`, see `extract_figma.snippet.js`) → `figma/<slug>.json`
   — per TEXT node: `{text, x,y,w,h (frame-relative), fontFamily, fontSize, fontWeight, color}`.
2. **extract_live.py** (Playwright) → `live/<slug>.json` — per visible text/interactive
   element: same schema in CSS px @1440 + `pageW/pageH` (for pin mapping). `--login` opens
   headful + waits for manual login (sessionStorage-safe keep-alive) for authed screens.
3. **diff.py** → `candidates_<slug>.json` — matches Figma↔live by normalised text, diffs
   font-size (±2px), weight (exact), family (exact), colour (RGB Δ>12), text-block width
   (≥40px on headings), and presence (missing/extra). Each finding stores **design value,
   live value, delta** and a **computed pin** = centre(live bbox) in capture space. Findings
   that come from a numeric diff cannot hallucinate.
4. **LLM review (last 10%)** — read `candidates_*.json`, drop noise, rank severity, write the
   dev sentence, and add the few structural/visual findings the text-diff can't see
   (tab-bar present? divider element? icon = `<svg>` stroke vs fill?) — *using extracted facts*.

## Run (per screen)
```
python3 extract_live.py --url <live-url> --out live/<slug>.json     # add --login for authed
# (extract_figma via use_figma MCP into figma/<slug>.json)
python3 diff.py <slug> figma/<slug>.json live/<slug>.json           # -> candidates_<slug>.json
```

## Why this is faster + correct
- Extraction is parallel; findings are *computed*, not deliberated.
- Pins land correctly **by construction** (derived from the same bbox).
- Every finding has receipts (design X / live Y) → no "missing banner that's present",
  no "filled vs outline" when both outlined.
- Reusable: point it at any portal → CI conformance gate + token-drift dashboard across
  the whole estate (the 33-org prize).

## Proven on HOME
`candidates_home.json` produced, unprompted:
- Hero "Senior Citizens Welfare": font-size **32→24px**, text-block width **810→576px**, pin@45,24%.
- "Need Immediate Help?": font-size **16→18px**, colour **#d64539→#e65100** (a finding the eyeball pass MISSED).
- "WELFARE BENEFITS": MISSING in build.
