# Figma Token Sync Handoff — 12 Jun 2026

## Summary

Code is the source of truth. This document tells the designer how to import the latest token file into the SAMAVESH Figma library.

**Figma target file:** [SAMAVESH Design System](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System) (`3FF5l0SMNIwdpZrKkeyPTm`)

> *Corrected 2026-08-10.* This previously pointed at `qyzTEy8dlb3ssYctlkMX5o`, an older copy
> that still has 261 variables and no `Theme` collection — so importing there looks successful
> and reaches nobody. The canonical library is the one in `GOVERNANCE.md`, with 690 variables.
**Token file to import:** `packages/tokens/dist/figma.tokens.json`

---

## What changed this cycle

| Token | Old | New | Why |
|---|---|---|---|
| `color.status.warningTonal` | _(missing)_ | `#ffedd5` | Completes the tonal set (danger + success tonals already existed) |
| Button `letter-spacing` | _(not set)_ | `0.1px` | Verified against UX4G DS Figma (node 609:282721, `--letter-spacing/2`) |

---

## Drift check: Code ↔ Figma (UX4G DS)

Checked against file `T3bkN5gNKfaNeY6dpT6FwF` (UX4G - Digital India Corporation DS).

| Property | Figma value | Code token | Match |
|---|---|---|---|
| Primary fill | `#0373df` | `--ds-primary` | ✅ |
| Border radius (button) | `8px` | `--ds-radius-md` = `8px` | ✅ |
| Font family | Noto Sans | `--ds-font-sans` | ✅ |
| Font weight (button) | `500` | `font-weight: 500` | ✅ |
| Button height (default) | `40px` (10+20+10) | `.ds-btn--md` height `40px` | ✅ |
| Horizontal padding | `24px` | `.ds-btn--md` padding `0 24px` | ✅ |
| Letter spacing | `0.1px` | `letter-spacing: 0.1px` | ✅ (fixed this cycle) |

**No source token changes required.** All core colour, spacing, and typography values are in sync.

---

## How to import into Figma (designer step)

This step requires the **Tokens Studio for Figma** plugin (free tier is sufficient).

1. Open `https://www.figma.com/design/qyzTEy8dlb3ssYctlkMX5o/SAMAVESH-Design-System` in Figma desktop.
2. Open Plugins → **Tokens Studio for Figma**.
3. In the plugin, go to **Settings → Sync → Local file**.
4. Point it to `packages/tokens/dist/figma.tokens.json` (or paste its contents).
5. Click **Load tokens**.
6. In the token list, select all changed tokens and click **Apply to document**.
7. **Publish the library** so all connected portals and site files pick up the change.

> If you use the Tokens Studio Pro JSON sync (GitHub/GitLab), the file is already at the path above in the repo — point the sync to `packages/tokens/dist/figma.tokens.json`.

---

## Next sync trigger

Run `npm run build -w @mosje/tokens` any time a source token in `packages/tokens/src/*.json` changes to regenerate the dist files. Then share the new `figma.tokens.json` with the designer for re-import.

Code Connect (automated push) requires a Figma Dev seat — set up when one becomes available per `docs/research/figma-code-connect-readiness.md`.
