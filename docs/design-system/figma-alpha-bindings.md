# Figma bindings — alias plus opacity

> **Completed 2026-09-04.** 104 bound by hand in the variable panel and verified through the API: each resolves to its base at the expected alpha and follows the base when the base changes. The 32 `alpha/0` resting fills were then written by the API as `COMPOSE_COLOR` expressions, which the API accepts. Palette and Color now read back as the payload states them.

Generated 2026-09-04 from `packages/tokens/dist/figma.variables.json` (136 variables). For each variable: open it in the variable panel, set its value to an alias of **Base**, then set the alias's opacity to the **Alpha** variable (Static collection). The Plugin API cannot write an alias's opacity, which is why this is a checklist and not a push. When all are done, re-read the library and close the Palette and Color entries in `reference/figma-live.json` → `$valueChecksums.knownDifference`.

Every Palette variable takes the SAME binding in both modes (Blue and Navy); the base scale is what carries the brand.

## Palette — overlay tiers (48)

| # | Variable | Base (alias) | Alpha (opacity) | Done |
|---|---|---|---|---|
| 1 | `color/transparent/primary/8` | `color/primaryScale/600` | `alpha/8` | ☑ |
| 2 | `color/transparent/primary/16` | `color/primaryScale/600` | `alpha/16` | ☑ |
| 3 | `color/transparent/primary/24` | `color/primaryScale/600` | `alpha/24` | ☑ |
| 4 | `color/transparent/primary/32` | `color/primaryScale/600` | `alpha/32` | ☑ |
| 5 | `color/transparent/primary/40` | `color/primaryScale/600` | `alpha/40` | ☑ |
| 6 | `color/transparent/primary/48` | `color/primaryScale/600` | `alpha/48` | ☑ |
| 7 | `color/transparent/secondary/8` | `color/secondaryScale/400` | `alpha/8` | ☑ |
| 8 | `color/transparent/secondary/16` | `color/secondaryScale/400` | `alpha/16` | ☑ |
| 9 | `color/transparent/secondary/24` | `color/secondaryScale/400` | `alpha/24` | ☑ |
| 10 | `color/transparent/secondary/32` | `color/secondaryScale/400` | `alpha/32` | ☑ |
| 11 | `color/transparent/secondary/40` | `color/secondaryScale/400` | `alpha/40` | ☑ |
| 12 | `color/transparent/secondary/48` | `color/secondaryScale/400` | `alpha/48` | ☑ |
| 13 | `color/transparent/accent/8` | `color/accentScale/600` | `alpha/8` | ☑ |
| 14 | `color/transparent/accent/16` | `color/accentScale/600` | `alpha/16` | ☑ |
| 15 | `color/transparent/accent/24` | `color/accentScale/600` | `alpha/24` | ☑ |
| 16 | `color/transparent/accent/32` | `color/accentScale/600` | `alpha/32` | ☑ |
| 17 | `color/transparent/accent/40` | `color/accentScale/600` | `alpha/40` | ☑ |
| 18 | `color/transparent/accent/48` | `color/accentScale/600` | `alpha/48` | ☑ |
| 19 | `color/transparent/neutral/8` | `color/neutralScale/800` | `alpha/8` | ☑ |
| 20 | `color/transparent/neutral/16` | `color/neutralScale/800` | `alpha/16` | ☑ |
| 21 | `color/transparent/neutral/24` | `color/neutralScale/800` | `alpha/24` | ☑ |
| 22 | `color/transparent/neutral/32` | `color/neutralScale/800` | `alpha/32` | ☑ |
| 23 | `color/transparent/neutral/40` | `color/neutralScale/800` | `alpha/40` | ☑ |
| 24 | `color/transparent/neutral/48` | `color/neutralScale/800` | `alpha/48` | ☑ |
| 25 | `color/transparent/success/8` | `color/successScale/600` | `alpha/8` | ☑ |
| 26 | `color/transparent/success/16` | `color/successScale/600` | `alpha/16` | ☑ |
| 27 | `color/transparent/success/24` | `color/successScale/600` | `alpha/24` | ☑ |
| 28 | `color/transparent/success/32` | `color/successScale/600` | `alpha/32` | ☑ |
| 29 | `color/transparent/success/40` | `color/successScale/600` | `alpha/40` | ☑ |
| 30 | `color/transparent/success/48` | `color/successScale/600` | `alpha/48` | ☑ |
| 31 | `color/transparent/danger/8` | `color/dangerScale/500` | `alpha/8` | ☑ |
| 32 | `color/transparent/danger/16` | `color/dangerScale/500` | `alpha/16` | ☑ |
| 33 | `color/transparent/danger/24` | `color/dangerScale/500` | `alpha/24` | ☑ |
| 34 | `color/transparent/danger/32` | `color/dangerScale/500` | `alpha/32` | ☑ |
| 35 | `color/transparent/danger/40` | `color/dangerScale/500` | `alpha/40` | ☑ |
| 36 | `color/transparent/danger/48` | `color/dangerScale/500` | `alpha/48` | ☑ |
| 37 | `color/transparent/warning/8` | `color/warningScale/500` | `alpha/8` | ☑ |
| 38 | `color/transparent/warning/16` | `color/warningScale/500` | `alpha/16` | ☑ |
| 39 | `color/transparent/warning/24` | `color/warningScale/500` | `alpha/24` | ☑ |
| 40 | `color/transparent/warning/32` | `color/warningScale/500` | `alpha/32` | ☑ |
| 41 | `color/transparent/warning/40` | `color/warningScale/500` | `alpha/40` | ☑ |
| 42 | `color/transparent/warning/48` | `color/warningScale/500` | `alpha/48` | ☑ |
| 43 | `color/transparent/white/8` | `color/neutralScale/0` | `alpha/8` | ☑ |
| 44 | `color/transparent/white/16` | `color/neutralScale/0` | `alpha/16` | ☑ |
| 45 | `color/transparent/white/24` | `color/neutralScale/0` | `alpha/24` | ☑ |
| 46 | `color/transparent/white/32` | `color/neutralScale/0` | `alpha/32` | ☑ |
| 47 | `color/transparent/white/40` | `color/neutralScale/0` | `alpha/40` | ☑ |
| 48 | `color/transparent/white/48` | `color/neutralScale/0` | `alpha/48` | ☑ |

## Color — scrim, washes and rules (4)

| # | Variable | Base (alias) | Alpha (opacity) | Done |
|---|---|---|---|---|
| 1 | `border/neutral/inverse/subtle` | `color/neutralScale/0` | `alpha/40` | ☑ |
| 2 | `overlay/neutral/boldest` | `color/neutralScale/800` | `alpha/48` | ☑ |
| 3 | `overlay/brand/hover` | `color/neutralScale/0` | `alpha/8` | ☑ |
| 4 | `overlay/brand/active` | `color/neutralScale/0` | `alpha/16` | ☑ |

## Color — inverse button states (52)

| # | Variable | Base (alias) | Alpha (opacity) | Done |
|---|---|---|---|---|
| 1 | `cmp/action/brand/primary/inverse/hover/bg` | `color/neutralScale/0` | `alpha/88` | ☑ |
| 2 | `cmp/action/brand/primary/inverse/hover/border` | `color/neutralScale/0` | `alpha/88` | ☑ |
| 3 | `cmp/action/brand/primary/inverse/active/bg` | `color/neutralScale/0` | `alpha/80` | ☑ |
| 4 | `cmp/action/brand/primary/inverse/active/border` | `color/neutralScale/0` | `alpha/80` | ☑ |
| 5 | `cmp/action/brand/primary/inverse/disabled/bg` | `color/neutralScale/0` | `alpha/40` | ☑ |
| 6 | `cmp/action/brand/primary/inverse/disabled/text` | `color/neutralScale/0` | `alpha/64` | ☑ |
| 7 | `cmp/action/brand/primary/inverse/disabled/border` | `color/neutralScale/0` | `alpha/40` | ☑ |
| 8 | `cmp/action/brand/secondary/inverse/default/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 9 | `cmp/action/brand/secondary/inverse/hover/bg` | `color/neutralScale/0` | `alpha/8` | ☑ |
| 10 | `cmp/action/brand/secondary/inverse/active/bg` | `color/neutralScale/0` | `alpha/16` | ☑ |
| 11 | `cmp/action/brand/secondary/inverse/disabled/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 12 | `cmp/action/brand/secondary/inverse/disabled/text` | `color/neutralScale/0` | `alpha/40` | ☑ |
| 13 | `cmp/action/brand/secondary/inverse/disabled/border` | `color/neutralScale/0` | `alpha/24` | ☑ |
| 14 | `cmp/action/success/primary/inverse/hover/bg` | `color/neutralScale/0` | `alpha/88` | ☑ |
| 15 | `cmp/action/success/primary/inverse/hover/border` | `color/neutralScale/0` | `alpha/88` | ☑ |
| 16 | `cmp/action/success/primary/inverse/active/bg` | `color/neutralScale/0` | `alpha/80` | ☑ |
| 17 | `cmp/action/success/primary/inverse/active/border` | `color/neutralScale/0` | `alpha/80` | ☑ |
| 18 | `cmp/action/success/primary/inverse/disabled/bg` | `color/neutralScale/0` | `alpha/40` | ☑ |
| 19 | `cmp/action/success/primary/inverse/disabled/text` | `color/neutralScale/0` | `alpha/64` | ☑ |
| 20 | `cmp/action/success/primary/inverse/disabled/border` | `color/neutralScale/0` | `alpha/40` | ☑ |
| 21 | `cmp/action/success/secondary/inverse/default/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 22 | `cmp/action/success/secondary/inverse/hover/bg` | `color/neutralScale/0` | `alpha/8` | ☑ |
| 23 | `cmp/action/success/secondary/inverse/active/bg` | `color/neutralScale/0` | `alpha/16` | ☑ |
| 24 | `cmp/action/success/secondary/inverse/disabled/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 25 | `cmp/action/success/secondary/inverse/disabled/text` | `color/neutralScale/0` | `alpha/40` | ☑ |
| 26 | `cmp/action/success/secondary/inverse/disabled/border` | `color/neutralScale/0` | `alpha/24` | ☑ |
| 27 | `cmp/action/destructive/primary/inverse/hover/bg` | `color/neutralScale/0` | `alpha/88` | ☑ |
| 28 | `cmp/action/destructive/primary/inverse/hover/border` | `color/neutralScale/0` | `alpha/88` | ☑ |
| 29 | `cmp/action/destructive/primary/inverse/active/bg` | `color/neutralScale/0` | `alpha/80` | ☑ |
| 30 | `cmp/action/destructive/primary/inverse/active/border` | `color/neutralScale/0` | `alpha/80` | ☑ |
| 31 | `cmp/action/destructive/primary/inverse/disabled/bg` | `color/neutralScale/0` | `alpha/40` | ☑ |
| 32 | `cmp/action/destructive/primary/inverse/disabled/text` | `color/neutralScale/0` | `alpha/64` | ☑ |
| 33 | `cmp/action/destructive/primary/inverse/disabled/border` | `color/neutralScale/0` | `alpha/40` | ☑ |
| 34 | `cmp/action/destructive/secondary/inverse/default/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 35 | `cmp/action/destructive/secondary/inverse/hover/bg` | `color/neutralScale/0` | `alpha/8` | ☑ |
| 36 | `cmp/action/destructive/secondary/inverse/active/bg` | `color/neutralScale/0` | `alpha/16` | ☑ |
| 37 | `cmp/action/destructive/secondary/inverse/disabled/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 38 | `cmp/action/destructive/secondary/inverse/disabled/text` | `color/neutralScale/0` | `alpha/40` | ☑ |
| 39 | `cmp/action/destructive/secondary/inverse/disabled/border` | `color/neutralScale/0` | `alpha/24` | ☑ |
| 40 | `cmp/action/neutral/primary/inverse/hover/bg` | `color/neutralScale/0` | `alpha/88` | ☑ |
| 41 | `cmp/action/neutral/primary/inverse/hover/border` | `color/neutralScale/0` | `alpha/88` | ☑ |
| 42 | `cmp/action/neutral/primary/inverse/active/bg` | `color/neutralScale/0` | `alpha/80` | ☑ |
| 43 | `cmp/action/neutral/primary/inverse/active/border` | `color/neutralScale/0` | `alpha/80` | ☑ |
| 44 | `cmp/action/neutral/primary/inverse/disabled/bg` | `color/neutralScale/0` | `alpha/40` | ☑ |
| 45 | `cmp/action/neutral/primary/inverse/disabled/text` | `color/neutralScale/0` | `alpha/64` | ☑ |
| 46 | `cmp/action/neutral/primary/inverse/disabled/border` | `color/neutralScale/0` | `alpha/40` | ☑ |
| 47 | `cmp/action/neutral/secondary/inverse/default/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 48 | `cmp/action/neutral/secondary/inverse/hover/bg` | `color/neutralScale/0` | `alpha/8` | ☑ |
| 49 | `cmp/action/neutral/secondary/inverse/active/bg` | `color/neutralScale/0` | `alpha/16` | ☑ |
| 50 | `cmp/action/neutral/secondary/inverse/disabled/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 51 | `cmp/action/neutral/secondary/inverse/disabled/text` | `color/neutralScale/0` | `alpha/40` | ☑ |
| 52 | `cmp/action/neutral/secondary/inverse/disabled/border` | `color/neutralScale/0` | `alpha/24` | ☑ |

## Color — transparent resting fills (32)

| # | Variable | Base (alias) | Alpha (opacity) | Done |
|---|---|---|---|---|
| 1 | `cmp/action/brand/secondary/default/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 2 | `cmp/action/brand/secondary/disabled/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 3 | `cmp/action/brand/tertiary/default/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 4 | `cmp/action/brand/tertiary/default/border` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 5 | `cmp/action/brand/tertiary/hover/border` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 6 | `cmp/action/brand/tertiary/active/border` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 7 | `cmp/action/brand/tertiary/disabled/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 8 | `cmp/action/brand/tertiary/disabled/border` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 9 | `cmp/action/success/secondary/default/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 10 | `cmp/action/success/secondary/disabled/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 11 | `cmp/action/success/tertiary/default/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 12 | `cmp/action/success/tertiary/default/border` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 13 | `cmp/action/success/tertiary/hover/border` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 14 | `cmp/action/success/tertiary/active/border` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 15 | `cmp/action/success/tertiary/disabled/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 16 | `cmp/action/success/tertiary/disabled/border` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 17 | `cmp/action/destructive/secondary/default/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 18 | `cmp/action/destructive/secondary/disabled/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 19 | `cmp/action/destructive/tertiary/default/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 20 | `cmp/action/destructive/tertiary/default/border` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 21 | `cmp/action/destructive/tertiary/hover/border` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 22 | `cmp/action/destructive/tertiary/active/border` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 23 | `cmp/action/destructive/tertiary/disabled/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 24 | `cmp/action/destructive/tertiary/disabled/border` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 25 | `cmp/action/neutral/secondary/default/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 26 | `cmp/action/neutral/secondary/disabled/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 27 | `cmp/action/neutral/tertiary/default/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 28 | `cmp/action/neutral/tertiary/default/border` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 29 | `cmp/action/neutral/tertiary/hover/border` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 30 | `cmp/action/neutral/tertiary/active/border` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 31 | `cmp/action/neutral/tertiary/disabled/bg` | `color/neutralScale/0` | `alpha/0` | ☑ |
| 32 | `cmp/action/neutral/tertiary/disabled/border` | `color/neutralScale/0` | `alpha/0` | ☑ |
