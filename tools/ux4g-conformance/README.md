# UX4G conformance tooling

Three files, one job: make "how UX4G-compliant are we?" a **number produced by a script**
rather than an opinion. The adoption directive has not yet defined what "using UX4G" means
(`docs/ux4g/UX4G-Clarification-Questionnaire.md`), so this is the most objective measure we
can publish, and the method ships with every figure.

Full position and rationale: [`docs/ux4g/UX4G-Code-Readiness-Audit.md`](../../docs/ux4g/UX4G-Code-Readiness-Audit.md).

## The three pieces

| File | What it does |
|---|---|
| `extract-ux4g-tokens.mjs` | Reads the `:root` blocks out of UX4G's published stylesheet and writes `packages/tokens/reference/ux4g-3.0.tokens.json` — the specification we measure against. Declarations only; nothing executable. |
| `component-map.json` | UX4G's 59 published components → SAMAVESH, hand-maintained. Feeds the coverage figure. |
| `measure.mjs` | Computes the four-part conformance number from the built token set + the component map. |

## Usage

```bash
npm run build -w @mosje/tokens          # measure.mjs reads the built CSS
node tools/ux4g-conformance/measure.mjs           # human-readable
node tools/ux4g-conformance/measure.mjs --json    # machine-readable
node tools/ux4g-conformance/measure.mjs --write   # also writes docs/ux4g/conformance-report.md
```

Exits non-zero if any **structural** token has drifted from UX4G's published value, so it can
gate CI.

Re-extract when UX4G publishes a new version — the diff in the reference JSON is the upgrade
surface:

```bash
node tools/ux4g-conformance/extract-ux4g-tokens.mjs --version 1.1.0
```

## What the four measures mean

- **Token coverage** — UX4G tokens SAMAVESH expresses at all.
- **Token binding** — of those, how many resolve (transitively) to a SAMAVESH token rather
  than carrying a copy of UX4G's literal. Bound tokens share one number and cannot drift;
  literals can. This is the number to push up over time.
- **Structural conformance** — non-colour tokens resolving to UX4G's **exact** published
  value. This is the one that can silently regress, so it is the one that gates the build.
- **Component coverage** — share of UX4G's 59 published components SAMAVESH ships.

Colour is excluded from the value check **by design**. It maps by *role* onto the ministry's
key colour, as DBIM requires and as UX4G's own Theme Craft is built to allow, so comparing
hex values there would measure the wrong thing. To see UX4G's literal palette, set
the retired `ux4g-light` mode — removed on 2026-09-04 with the shipped parity sheet; the mapping now lives only in `parity.generated.css`, a build output of `@mosje/tokens` read by `measure.mjs`.

## Keeping it honest

`component-map.json` is hand-maintained, which means it is the part that can rot. Update it
in the same change that adds or removes a component. A `status` of `partial` means the thing
exists but is not exported as a shared component (pagination lives inside `DataTable`, for
example) — resist upgrading those to `exact` without actually extracting them.
