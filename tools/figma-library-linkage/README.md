# `check:figma-linkage` — SAMAVESH masters bind to SAMAVESH, and to nothing else

## What it measures

Per **content page** of the SAMAVESH library (`3FF5l0SMNIwdpZrKkeyPTm`), inside
**component masters only** — a `COMPONENT_SET`, or a `COMPONENT` whose parent is not a
set, and everything beneath it:

| Count | What it is |
|---|---|
| `remoteVariableBindings` | node × variable pairs bound to a variable published by **another library**. In the REST API a local variable id reads `VariableID:12345:678`; a subscribed one carries a library key segment, `VariableID:<40-hex>/12345:678`. Read anywhere in the node's own properties — `boundVariables`, `fills[].boundVariables.color`, `strokes[]`, corner radii, text overrides — and de-duplicated per node, so one radius bound on four corners, or one fill reported twice by the API, is one binding. |
| `remoteInstances` | `INSTANCE` nodes whose component the `/nodes` response's `components` map marks `remote: true` (or does not list at all). Counted once and **not descended**: the remote master's own nested instances belong to the other library, and replacing the one instance clears them all. |

**Excluded, deliberately:** instances named `SAMAVESH seal` — a documented remote
component that must be used at its natural size and cannot be repaired here
(`.claude/rules/ds-documentation-standard.md` §5) — and artwork, meaning an instance,
component or component-set name matching `/org-?logo|Emblem|Digital India|logo/i`, with
everything inside it. Pages are every page in the file minus the divider, the group-label
pages, `Thumbnail`, `Index` and `Archive — Deprecated`, using the `pageExclusionRules` in
`tools/figma-index-parity/index.json` so one list governs every Figma gate.

## Why

`CLAUDE.md` ("Figma libraries: SAMAVESH is the only one we BUILD from") records what this
gate makes checkable. The other libraries reachable from this estate — `MoSJE + UX4G DS`
and `MoSJE Portal DS` — are read-only reference, and they are **near-misses**: `Primary/800
#01376B` against SAMAVESH's `bg/brand/primary/boldest #003975`, `Neutral/200 #E2E6EA`
against `border/neutral/subtle #DCDEE1`. A master bound to the wrong one looks right and
drifts from the estate by a shade nobody can name. That happened to the service-discovery
deck on 2026-09-08, and it was caught by reading `figma.config.json` for the file key — not
by looking at the file. Looking at it does not work; reading the ids does.

## How to run

```bash
npm run check:figma-linkage        # offline — is baseline.json coherent?
npm run check:figma-linkage:live   # compare the baseline with the live file
npm run check:figma-linkage:sync   # re-capture the baseline (takes ~5 min)
```

`:live` and `:sync` read `FIGMA_ACCESS_TOKEN` from the environment; with no token the live
half skips with a notice and the offline half still ran. Both walk every content page with
`GET /v1/files/:key/nodes` two pages at a time (a busy page is ~10 MB), pausing between
requests and backing off on 429 — the library's other gates are rate-limited today, so a
run prints the odd wait line and continues.

Exit 1 is drift (the rule's business), exit 2 is the tool or the network.

## What an increase means

A master now binds to a variable, or places a component, from a library that is not
SAMAVESH. The gate names the page and sample nodes with their ids. **Import the SAMAVESH
variable and bind it** — do not type the matching hex, because a literal that merely equals
a token is not bound to it. For an instance, swap it for the SAMAVESH component, or, if
none exists, build it here and record the gap on that page's `— Component record`.

A **decrease also fails**, on purpose: run `:sync` and commit the smaller baseline, so one
page's cleanup cannot silently pay for another page's regression.

## Not in CI

Deliberately not wired into `.github/workflows/ds-quality.yml` yet. The other Figma gates
run their offline half on every PR and their live half guarded on the secret; this one's
live half takes about five minutes of rate-limited requests against the whole file, which is
a different order of cost from theirs. Wire it in when the counts are at zero and the run is
a regression check rather than a survey — or run the live half on a schedule.
