# Onboard a new project (checklist)

> Full lifecycle manual: **[../../AUDIT-A-PORTAL.md](../../AUDIT-A-PORTAL.md)** · docs home:
> **[../../README.md](../../README.md)** · worked example: **[../nhapoa/README.md](../nhapoa/README.md)** ·
> the rules the audit learns by: `~/.claude/skills/design-qc/references/audit-rules.md` (read the
> **Canonical playbook** at the top first). This is the quick checklist.

## A. Set up (once)
1. Copy this folder: `cp -r projects/_template projects/<slug>`
2. Fill `audit.config.json` — portal name, idPrefix, Figma fileKey/rootNode, live base URLs + auth
   selectors, roles (usernames only), baseline mode (`tokens` | `derived` | `internal`).
3. `cp secrets.example.json secrets.json` (in the new folder) and fill role passwords. `secrets.json`
   is gitignored — never commit it. (Copy `../nhapoa/secrets.example.json` if this template lacks one.)

## B. Phase 0 — design truth (agent, via Figma MCP → `inputs/`)
4. `figma-frames.json` — `[{node_id, name:"Role/Screen/State", heading, kind}]` from `get_metadata`.
   **`heading` = the frame's rendered H1/title** — required for the design↔build mapping gate.
5. `tokens.json` — `{colors,radii,fontSizes,fontFamilies}` from `get_variable_defs` (or set
   `baseline.mode:"internal"` to skip and derive from the build).
6. `captures/figma/<SLUG>.png` — design frames for the side-by-side boards.

## C. Machine pass + gates
7. Run: `python3 engine/run.py --project <slug> --phase all`
8. Read `out/`: `coverage-ledger.json` (coverage gate) · `crosscheck.md` (**mapping gate** — run
   `python3 engine/crosscheck.py --master projects/<slug>/out/audit-master.json --project projects/<slug>`)
   · `failures.md` (pin gate) · `conformance.json` (DS-adoption + deviations) · `…-MACHINE-DRAFT.pdf`.
   **Ship only when all three gates are green.**

## D. Curated human deliverables (the polished path — copy the NHAPOA pattern)
9. Build the **3-column Figma review sheet** (DESIGN | BUILD | ISSUES) for 👤 review. The reviewer edits
   the issues; say **"sync from Figma"** to fold them back.
10. Copy `../nhapoa/build_final_report.py` + `sync_data.py` as this project's source-of-truth. Adjust:
    the `SCREENS` / `META` lists (your screens + slug→review-sheet mapping), `DEST` (your
    `docs/qc/portals/<slug>/`), the tracker `SHEET` name, and the Global-findings list. Running it
    regenerates the **curated PDF** (via the fixed, project-agnostic `docs/.../generate_pdf.py` — never
    hand-roll the layout), the **master Excel tracker** (with a Scope column), and the mapping gate — all
    in lockstep. After regenerating, verify the PDF byte size CHANGED + mtime fresh + rasterize a page.
11. Optional **pinned Figma report** (draggable pins): reuse the file's kit (`Pin/*`, `Finding Card`) +
    harvest image hashes from the review sheet; each screenshot in a white rounded card on a light-gray
    panel (match the `findings-screen-ref` component). NAME every frame you create.

## E. Publish + certify
12. **Google Drive:** the connector can't overwrite a fileId in place — to keep share links, upload each
    fresh local file as a **new version** (Manage versions). On a re-run, get a **row-level changelog vs
    the live Drive copy** (diff the tracker by ID, ignoring dev-owned Status/Assignee/Date) so only
    changed rows are updated.
13. **Human track → CERTIFIED:** confirm severities, keyboard + screen-reader a11y pass, Hindi/RTL
    content, brand/GIGW sign-off. Correct/add screens: see `../nhapoa/SYNC-GUIDE.md`.

Baseline modes: `tokens` (strict, vs `inputs/tokens.json`) · `derived` (from Figma variables) ·
`internal` (no design system — flag statistical outliers).

---

## Before you write a single finding

Three things this engine learned the hard way. They cost a portal about one wrong claim in five
before they were gates; now they are gates, and the run refuses to publish without them.

**1. Read the design with `engine/figma_dump.js`, never a hand-rolled traversal.** `use_figma`
returns a TRUNCATED node tree when the frame's page was never loaded — 45 text nodes on a frame
that has 201 — and tells you nothing. The snippet sets the page and records `_meta.pageLoaded` and
`_meta.totalText` for every frame; write the result to `inputs/design-elements.json`. Leave
`WITH_ELEMENTS = false` for the whole-page pass: meta alone is what the gate needs, and two frames
of elements overflow the MCP response.

**2. Anchor every finding, in `resolve_anchors.py`.** Copy the pattern from
`projects/smile-admin/resolve_anchors.py`: your file holds only the `ANCHORS` dict, and
`engine/anchors.py` does the resolving. That is what gives every finding a real element box — and
therefore a crop pair, a pin, and a claim gate that can check it. When an anchor is deliberately
the NEIGHBOUR of the thing the finding is about (an icon, a tinted banner, a card), say so with
`why="…"` on the spec.

**3. Turn the claim gates on** (`"claimGates": true`) and read `out/claims.md`. Every presence,
colour, count or position claim gets a 1:1 crop of both sides in `out/evidence/<ID>.png` with the
element ringed. **Look at it before you write the sentence.** Everything that went wrong in the
SMILE Beggary run — "the icons lost their tinted chip" (they hadn't), "the KPI row lost its
container" (it hadn't), "the column is not built" (it is; it is off-screen) — would have died at
that picture.

`out/claims.md` also lists every design frame drawing content OUTSIDE its own bounds. Nothing out
there renders — not in the export, not in Dev Mode — so the build implements a spec nobody can
see. That is a finding about the design file, and it is usually news to the design team.
