# Brand packs — white-labelling SAMAVESH

A **brand pack** is the only thing a new government portal must supply. Everything
else (the semantic token contract, every component, pattern, page template, and
accessibility behaviour) is the **universal core** and is inherited unchanged.

This is the mechanism behind the IA's Universal-Core / Brand-Layer split — see
`packages/design-system/INFORMATION-ARCHITECTURE.md` §2 and §7.

## What's in a brand pack

```
brands/<brand-id>/
└─ brand.json     # brand-identity PRIMITIVE tokens (DTCG)
```

`brand.json` supplies only the brand-identity primitives:

| Token path | Meaning |
|------------|---------|
| `color.primaryRamp.light.50…900` | Primary brand ramp (default appearance) |
| `color.primaryRamp.dark.50…900`  | Primary ramp for the `blue-dark`-style brand mode |
| `color.saffron.{50,500,700}`     | Brand accent ramp |
| `color.navy.700`                 | Deep brand shade (footers, dark surfaces) |
| `color.yellow.500`               | Brand warning-background accent |

**Keep the token PATHS identical** — change only the values. The universal
semantic tier (`color.action.*`, `color.text.*`, …) references these paths, so a
value swap re-skins the entire system with no other edits.

Brand assets that are *not* tokens — emblem/logo SVGs, favicon, portal/zone
names, footer/contact, locale defaults, optional typeface — live with the
consuming app (or a `brand.config.ts` next to `brand.json`); they are not built
by Style Dictionary.

## What stays invariant (never per-brand)

The core neutrals, status hues (`green`/`red`/`info`), spacing, radius, shadow,
motion, and type-role scales (`src/primitive.json`), the whole semantic contract
(`src/semantic.json`), every component, pattern, page template, and the chart
structural tokens. A brand pack may **not** fork a component or change a semantic
token's meaning.

## Build a brand

```bash
# default brand (MoSJE)
npm run build -w @mosje/tokens

# any other brand
BRAND=<brand-id> npm run build -w @mosje/tokens
```

The build emits that brand's `--sa-*` brand primitives into every output
(`dist/tokens.css`, the design-system `tokens.css`, Tailwind v3/v4, TS, Figma).

## Stand up a new government portal

1. `cp -r brands/_starter brands/<your-body>` (the `_starter` template is a
   deliberately different emerald palette so a re-skin is obvious).
2. Replace the values in `brand.json` with your body's identity; drop in the
   emblem/logo/favicon and names in the consuming app.
3. `BRAND=<your-body> npm run build -w @mosje/tokens`.
4. `npm test -w @mosje/tokens` — the **contrast gate** must pass.
5. Compose the screens from the design-system components + page templates. No
   core code is touched.

## The contrast gate (honest accessibility)

There is no "compliance by construction." Instead, `test/brand-contrast.test.mjs`
asserts that the active brand's load-bearing pairings meet WCAG 2.1 AA:

| Pairing | Minimum |
|---------|---------|
| `--ds-on-primary` on `--ds-primary` (button label) | 4.5:1 |
| `--ds-ink` on `--ds-surface` (body text) | 4.5:1 |
| `--ds-ink-muted` on `--ds-surface` (muted text) | 4.5:1 |
| `--ds-primary` on `--ds-surface` (link / UI) | 3.0:1 |

If a brand's primary ramp is too light, white button text fails 4.5:1 and the
build **fails loudly** — an inaccessible brand cannot ship. Keep
`primaryRamp.*.500` dark enough that white-on-primary stays ≥ 4.5:1.

Components remain audited per release with the `accessibility-auditor`; this gate
covers the one thing a white-label can break — colour contrast.
