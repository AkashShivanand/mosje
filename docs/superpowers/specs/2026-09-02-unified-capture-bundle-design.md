# Unified Capture Bundle — Design Spec

**Date:** 2026-09-02
**Status:** Draft for review
**Touches:** `tools/design-audit/` · `docs/qc/` · `apps/hub/public/reports/<slug>/figures/`

## Problem

Every portal is traversed twice against the same live build. Once as **clone recon** — capture
the vendor portal so it can be rebuilt on `@mosje/design-system` — and once as **design QC** —
capture the same portal to score it against the Figma handoff. Verified: the two activities
target identical hosts (`scw-admin-uat.mosje.in`, `eanudaan-*-dev.mosje.in`) and, per the product
owner, run within a few days of each other against the same build.

The duplicated cost is not the crawl. `engine/capture.py` discovers routes from the live sidebar
and shoots them unattended in ~20 minutes. The cost is everything the crawl **cannot reach**:

- Wizard steps behind a filled form, modals, validation and post-submit states.
- Today these are captured by bespoke, run-once, per-project Python drivers. `projects/tg/` alone
  carries ten (`capture_flows.py`, `capture_dm_modals.py`, `capture_login_states.py`,
  `citizen_register.py`, `citizen_apply.py`, `citizen_submit.py`, `capture_post_approval.py`, …).
  `projects/e-anudaan/capture_review.py` documents why: nothing in any sidebar links
  `/dashboard/**/review/:id`, yet it is the highest-value screen in the portal.
- That traversal knowledge is authored by hand, used once, and discarded.

Three further gaps make reuse impossible today:

1. Recon findings land in `docs/research/<host>/INVENTORY.md` as **prose**. A QC run cannot
   consume a paragraph.
2. `tools/design-audit/.gitignore` ignores **both** `projects/*/captures/` and `projects/*/out/`,
   so neither the captures nor `audit-master.json` survive the run.
3. `engine/bootstrap.py:90` already writes `"manifest": "screen-manifest.yaml"` into every
   config. Nothing reads it and no such file exists anywhere. The seat was reserved and left empty.

## Decisions (locked)

1. **One deep capture pass at clone time.** It captures screen *states*, not just routes. Design
   QC reuses it rather than re-traversing, gated on freshness.
2. **`screen-manifest.yaml` is the input** — the declarative traversal recipe, filling the slot
   `bootstrap.py` already names. **`capture-bundle.json` is the output.**
3. **Three-tier freshness.** Build fingerprint → per-screen fingerprint → per-flow replay.
4. **Two hashes per screen**, `structureHash` and `geometryHash`, because a geometrically shifted
   PNG breaks pin placement even when the design is unchanged.
5. **Volatile content is masked before hashing**, declared globally and per screen.
6. **`environment` is a first-class config field.** `dev` / `uat` → drivers may walk through final
   submission unattended. `prod` → the run halts for human confirmation; the existing
   `DESTRUCTIVE` regex becomes the `prod` guard rather than a blanket ban.
7. **Created records are recorded and reused**, so a re-run does not file a fresh application
   every time.
8. **Storage splits by lifetime.** Raw corpus stays local and gitignored (220 MB across six
   portals; it only has to outlive the run by days). Report figures are derived as width-capped
   WebP and committed. `img_hashes.json`, `audit-master.json` and `capture-bundle.json` are
   committed.
9. **A portal with no Figma design still gets a bundle.** The QC phases are skipped. This is
   already how `projects/e-anudaan/audit.config.json` declares itself (`baseline.mode: internal`,
   `_purpose: "CLONE RECON, not design QC"`).

Decision 8 reverses the existing ignore of `out/` for one file, and was taken on the product
owner's "go ahead"; it is called out here because it changes a prior decision.

## Architecture

### `projects/<name>/screen-manifest.yaml` (input)

```yaml
version: 1
environment: uat                  # dev | uat | prod
stalenessCeiling: 14d

volatile:                         # masked before hashing — global
  - selector: "[data-testid=last-updated]"
  - pattern: '\b\d{2}/\d{2}/\d{4}\b'

fixtures:
  ngo:
    orgName: "Example Welfare Society"
    darpanId: "MH/2019/0123456"

screens:                          # overrides only; nav routes stay auto-discovered
  - slug: ADMIN-DASHBOARD
    route: /dashboard
    roles: [pd-aso]
    volatile: ['\b\d+\b']         # KPI counters, this screen only

flows:                            # the expensive tier
  - id: shreshta-m2-apply
    role: ngo
    entry: /apply-grant/shreshta-m2/step-1
    allowSubmit: true             # honoured only when environment is dev|uat
    alwaysReplay: false
    reuseRecord: null             # written back after the first submit
    steps:
      - { fill: { fixture: ngo } }
      - { capture: NGO-SHRESHTA-STEP-1 }
      - { captureValidation: NGO-SHRESHTA-STEP-1-ERRORS }
      - { click: "Save & Next" }
      - { capture: NGO-SHRESHTA-STEP-2 }
```

`captureValidation` submits the step empty, shoots the error state, then resets the form.

### `projects/<name>/out/capture-bundle.json` (output, committed)

Per screen state: `slug`, `role`, `route`, `url`, `reachedBy` (`nav` or `flow:<id>`), `png` +
`pngSha256`, `pngH`, `pageH`, `truncated`, `rows` path, `structureHash`, `geometryHash`,
`capturedAt`, and for form screens a **field inventory** — `name`, `label`, `type`, `required`,
`options`, `helper`, `validationMessage`, `conditionalOn`. Wizard screens carry
`{flow, step, of}`. The bundle header carries `capturedAt`, `environment`, `engineSha`, and per
host a `buildFingerprint`. Created records live under `records`.

The field inventory is what replaces the prose in `INVENTORY.md` as the machine-readable clone
reference. `INVENTORY.md` remains as the human narrative.

### Hashing

Both hashes are computed over the extracted rows after volatile masking, in DOM order.

- `structureHash` — `tag`, `role`, `dsComponent`, `text`, `fontFamily`, `fontSize`, `fontWeight`,
  `lineHeight`, `color`, `bg`, `radius`, `padding`, `borderStyle`, `borderColor`. **Excludes
  `x`/`y`/`w`/`h`.** Answers "did the design change?"
- `geometryHash` — the above plus `x`, `y`, `w`, `h` and `pageH`. Answers "did the layout move?"

Each screen records `maskedRows` / `totalRows`. A screen masking **>30%** of its rows emits a
warning: the mask is doing too much work and the fingerprint has stopped meaning anything.

### Freshness resolution

```
--force                                   -> full capture, no reuse
now - bundle.capturedAt > stalenessCeiling -> full capture
otherwise, per host: GET the app shell, read the hashed bundle name
  fingerprints all match AND not --verify -> REUSE ALL (no browser launched)
  otherwise                               -> tier 1, per screen:
      goto -> extract -> mask -> hash
      both hashes match      -> reuse existing PNG and rows
      either hash differs    -> re-capture the screen in full (settle + shoot + rows)
                                and record which hash moved
tier 2, per flow: replay when the entry screen's structureHash moved,
      or its field inventory changed, or alwaysReplay is set
```

A screen where only `geometryHash` moved is re-shot and its rows rewritten, but is marked
`designUnchanged: true` so Tier-B judgment findings can be carried forward rather than re-authored.

QC runs default to `--verify` (tier 1 always runs). Clone recon defaults to full capture.

### Engine changes

| File | Change |
|---|---|
| `engine/manifest.py` | **new** — parse and validate `screen-manifest.yaml` |
| `engine/bundle.py` | **new** — hashing, masking, freshness resolution, bundle read/write |
| `engine/drive.py` | **new** — execute `flows[].steps`; environment-gated submission |
| `engine/figures.py` | **new** — derive width-capped WebP report figures |
| `engine/capture.py` | consume the manifest; write the bundle; honour reuse decisions. `EXTRACT_JS` gains the field inventory. `settle_height` / `shoot` / `slugify` / `merge_manifest` unchanged |
| `engine/run.py` | `--force`, `--verify`, `--phase bundle` |
| `engine/bootstrap.py` | emit a starter `screen-manifest.yaml` seeded from any existing `_captured.json` |

`analyze.py`, `crosscheck.py`, `qc_geometry.py` and `report.py` are **unchanged**.

### Report figures

`engine/figures.py` reads `audit-master.json`, and for each screen the report actually uses emits
width-capped WebP to `apps/hub/public/reports/<slug>/figures/`. Only ~30–50 boards per portal, so
the set should land around 5–8 MB against the ~32 MB that triggered PERF-007. The existing ignore
is scoped to `apps/hub/public/reports/eutthan-admin/figures/` alone, so this does not reopen that
decision for eutthan-admin; new portals commit their WebP figures.

The three consumers then resolve as: **PDF** reads full-resolution PNGs from the local corpus at
generate time; **Figma** reuses `img_hashes.json` to avoid re-upload; **Hub** serves the committed
WebP.

### Ignore rules (implementation trap)

`tools/design-audit/.gitignore` currently excludes the **directory** `projects/*/out/`. Git cannot
re-include a file inside an excluded directory, so a `!projects/*/out/capture-bundle.json`
negation added on top of the current line silently does nothing. The directory line must be
replaced with a contents line first:

```gitignore
projects/*/out/*
!projects/*/out/capture-bundle.json
!projects/*/out/audit-master.json
```

`projects/*/captures/` stays a directory exclusion and is unchanged — the raw corpus is never
committed.

## Phasing

1. **Bundle + hashing, no behaviour change.** `bundle.py`, `manifest.py`, the field inventory in
   `EXTRACT_JS`. Existing runs additionally write `capture-bundle.json`. Nothing reuses it yet.
2. **Freshness resolution.** Tiers 0 and 1, `--force` / `--verify`, `out/freshness.md`.
3. **Driven flows.** `drive.py`, environment gating, `reuseRecord`. Migrate one portal's bespoke
   drivers (tg is the densest, so it is the honest test) into its manifest.
4. **Figures.** `figures.py` and the Hub wiring.

## Verification & testing

- `engine/test_capture_bundle.py`, alongside the existing `engine/test_analyze.py`: hash stability
  across identical extractions; masking removes exactly what it claims; a colour change moves
  `structureHash`; an inserted table row moves only `geometryHash`.
- **New gate** — `out/freshness.md`, joining the existing gate table. FAILs when a reused screen's
  `pngSha256` no longer matches the file on disk. This is the same class of corruption
  `audit_capture_integrity()` already catches, mechanised per the project's running principle.
- Existing gates (coverage, mapping, pins, fresh PDF) unchanged and still required.
- Acceptance: a tg QC run reusing a fresh bundle produces a finding set identical to a
  full re-capture, and the mapping and pin gates stay green.

## Trade-offs & risks

- **Masking can hide real change.** Mitigated by reporting masked/total per screen and warning
  above 30%.
- **A fingerprint can miss server-rendered or CMS content change.** Mitigated by the staleness
  ceiling and by QC defaulting to `--verify` rather than trusting tier 0 alone.
- **Submission pollutes dev data.** Mitigated by `reuseRecord`. Never automatic on `prod`.
- **Authoring a manifest is real per-portal work.** Mitigated by `bootstrap.py` seeding it from an
  existing capture, and by migration being opt-in per portal.
- **Tier 1 saves less than it appears** — an unchanged screen still costs `goto` + `waitMs` +
  extract, roughly 3–4× faster than a full capture, not an order of magnitude. The large saving is
  tier 2, whose cost is authoring rather than runtime.

## Out of scope

- Figma-side capture is unchanged; `inputs/figma-frames.json` and `tokens.json` keep their current
  Phase 0 flow.
- No change to conformance scoring, the mapping cross-check, pin geometry, or report layout.
- No object storage or CDN. Committed WebP is the Hub's answer.
- No retroactive migration of the six existing projects' bespoke drivers; they keep working
  unchanged and move portal by portal.
