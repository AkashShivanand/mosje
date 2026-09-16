---
paths:
  - "packages/design-system/**"
  - "packages/tokens/**"
  - "tools/figma-*/**"
  - "docs/**"
---

# Figma calls are a shared daily budget — spend them like one (MANDATORY)

On **2026-09-16** a token pass stopped one step from finished: the Figma MCP seat hit its
daily ceiling mid-task, and the REST API answered `429` on the next attempt too. Nothing
was broken and nothing was over-quota by subscription — the day's allowance had simply
been spent, most of it on reads that need never have been made twice.

## 1. The two quotas, and what they cost

| Transport | Used by | Limit | Notes |
|---|---|---|---|
| **MCP** (`use_figma`, `get_screenshot`) | agents | **600 calls/day, 20/min per SEAT** on a Full seat of an Organization plan | Shared by every session signed in as the same person. `whoami` is exempt — it is the tool for diagnosing the limit. |
| **REST** (`api.figma.com`) | `tools/figma-*/check.mjs`, `figma connect publish`, `tools/figma-read` | its own, larger, still finite | Also returned `429` on 2026-09-16 when everything ran at once. |

Neither is per-file or per-project. **A second session doing Figma work is spending the
same allowance**, and on this estate three or four run at a time.

## 2. Read from the cheapest source that can answer

In order. Stop at the first one that can.

1. **The committed snapshots.** `packages/tokens/reference/figma-live.json` (every variable,
   its value, description, scopes, publishing flag), `tools/figma-index-parity/index.json`
   (every page and card), `tools/figma-doc-parity/claims.json` (every recorded claim),
   `tools/code-connect-parity/figma-properties.json` (every component's properties).
   These exist because the answer was already paid for once.
2. **`node tools/figma-read/read.mjs`** — REST, cached in `.cache/figma/` for six hours.
   `nodes` for geometry, names, fills, strokes, effects, bound-variable ids and text;
   `image` for a rendered PNG; `styles` for the published styles. A repeat read is free.
3. **The live gates** (`check:figma-index:live`, `:docs`, `:arrangements`, `:text-styles`,
   `:hand-rolled`) when the question is "has anything drifted" — they are REST, and they
   answer for the whole library in one pass.
4. **MCP**, last, and only for what the others cannot do:
   - **variables and their values** (REST needs the Enterprise `file_variables:read` scope),
   - **`componentPropertyDefinitions`** (REST carries overrides, not the schema),
   - **anything that writes.**

## 3. Batching: one script, one call

`use_figma` costs the same whether it reads one property or walks the whole page. So:

- **Ask every question you have about a node in ONE script.** The 2026-09-16 audit asked
  eight — set variants, then bindings, then instances, then the tag, then the mark, then
  the overflow — where one would have answered all eight.
- **Write in one pass too.** Build, bind, rename and record in a single script, then
  screenshot once to verify. Nine variants were created, ordered, re-badged and recorded in
  four calls when two would have done.
- **Never re-read to confirm what a write already returned.** Return the ids and the values
  you set, and trust them; a failed call rolls back and says so
  (`ds-documentation-standard.md` §5).
- **A probe frame costs three calls** — create, screenshot, delete. Compute the geometry from
  the node tree in the read you are already making, and probe only when the question is
  genuinely "what does this LOOK like".

## 4. Screenshots

`get_screenshot` is a call. `await node.screenshot()` inside a `use_figma` script you are
running anyway is **not** an extra one. Prefer the inline form; reach for `get_screenshot`
when you need a URL to save to disk, and pass `maxDimension` so you are not paying for
pixels you will not read.

## 5. When the limit is hit, do not fake your way past it

The gates that compare code to the library (`figma-value-parity`, `figma-docs`,
`figma-index`) exist to catch a record that asserts a state the library is not in. If the
read that would refresh a record is unavailable:

- **say so, in the commit and the PR**, and leave the gate failing;
- **do not** update a checksum, a snapshot or a baseline from the payload side alone;
- resume when the allowance returns.

`whoami` still answers when everything else is refused — use it to confirm which seat and
plan are being billed before concluding anything about why.

## 6. Before a Figma-heavy task

- Ask whether another session is already in the file. If it is, do the local half first.
- Take the inventory ONCE, at the start, and keep it in the transcript rather than
  re-reading the same page for each question.
- On a long pass, prefer `--depth` on reads: a masthead's geometry is three levels down,
  not thirty.
