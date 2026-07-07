# Correcting mappings & adding screens — your workflow

The Figma **3-column QC sheet** (Design-QC file → page `NHAPOA` → the review board) is your editable
surface. Change anything there, then tell me **"sync from Figma"** and I fold it into the **PDF report**
and the **master tracker**. Nothing is one-way — you drive, I re-read and regenerate.

There is also a safety net: after every sync I run the **design↔build cross-check gate**, which compares
the design frame's title against the live capture's title. If a screenshot is paired with the wrong Figma
frame (or vice versa), it FAILs the run and names the offending screen — so a bad mapping can't quietly
ship even if we both miss it by eye.

---

## A. Fix a wrong design ↔ build mapping

On the affected `row · <slug>`, do **any one** of these, then say "sync":

1. **Wrong Figma frame paired** → update the **"Figma frame ↗"** link (top-right of the row) to point at
   the correct frame *(in Figma: select the "Figma frame ↗" text → paste the right frame's link)*. I
   re-fetch that frame's screenshot at full res and re-pair it.
   - *Or* just drop the correct frame's screenshot into the **DESIGN** column image.
2. **Wrong build screenshot** → fix the **"Live page ↗"** link to the correct route (I re-capture it), or
   drop the correct build screenshot into the **BUILD** column.
3. **Two screens swapped** → you don't even need to touch the sheet; just tell me *"do-reports and
   do-clarifications are swapped"* and I'll fix the pairing.

After the sync I re-run the cross-check and confirm the titles now agree (gate green).

> Tip: you never have to guess the node id — the **"Figma frame ↗"** link *is* the mapping. Point it at
> the right frame and the mapping is corrected.

---

## B. Add a screen or a whole flow I missed

Two ways — pick whichever is easier:

### B1 — In the Figma sheet (same as the existing rows)
1. **Duplicate** any existing `row · <slug>` and rename it `row · <your-slug>` (e.g. `row · do-bulk-assign`).
2. Fill the three columns:
   - **DESIGN** — drag in the frame's screenshot, **and/or** set the **"Figma frame ↗"** link to that frame.
     *(No design yet? Leave it as the "No Figma frame" placeholder — I'll render it BUILD-only.)*
   - **BUILD** — drag in the live screenshot, **and/or** set the **"Live page ↗"** link to a URL I can capture.
   - **ISSUES** — your points, one per line (plain language, the way the other rows read).
3. Put it under the right navy role header (or tell me the role).
4. Say **"sync"**. I read the new row, export its images to local PNGs, register it, and regenerate the
   report + tracker.

### B2 — Just tell me (no Figma needed)
Message me, e.g.:
> Add screen — role: District Officer · name: Bulk Assign · Figma: `<frame link>` · live: `<url>`
> (or attach a screenshot) · issues: numbered pins vs Prev/Next; status chips off the tokens.

I fetch the design frame, capture/receive the build, and fold it in.

---

## What "sync" does (so it's not a black box)

1. Read every `row · *` under the review root — title, the **Figma-frame link → node**, the
   **Live-page link → URL**, the **DESIGN/BUILD images**, and the **ISSUES** text.
2. For new/changed rows: export the **design** (the linked frame at full res, preferred) and the **build**
   (live capture, or the image you placed) to local PNGs, normalized to 1440-wide.
3. Register them in `inputs/manual-screens.json` (added screens) or update the paired frame/issues for
   corrections — **no code edits needed for additions; it's pure data.**
4. Regenerate the **PDF report** and the **master tracker** (kept in lockstep), then run the **cross-check
   gate** and report any remaining flag.

### `inputs/manual-screens.json` — the drop-in schema for added screens
```json
[
  {
    "slug": "do-bulk-assign",
    "role": "District Officer",
    "name": "District Officer — Bulk Assign",
    "node": "5986:99999",                 // Figma frame id (null if undesigned → BUILD-only board)
    "live": "https://nhapoa-admin-dev.mosje.in/district-officer/cases",
    "design": "captures/synced/do-bulk-assign-design.png",   // null if undesigned
    "build":  "captures/synced/do-bulk-assign-build.png",
    "issues": "Numbered pagination + rows-per-page selector.\nStatus chips should use the DS semantic colours."
  }
]
```
Drop the two PNGs in `captures/synced/`, add the entry, run `python3 build_final_report.py` — the screen
appears in the report and tracker. (When you edit the sheet instead, I generate this file for you.)
