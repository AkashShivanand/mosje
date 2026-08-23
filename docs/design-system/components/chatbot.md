# Chatbot — component specification

> SAMAVESH Design System · Figma `3FF5l0SMNIwdpZrKkeyPTm` → page **Chatbot** (`55813:941`) →
> set **Chatbot** (`55826:37003`, 4 variants) and **Chatbot Mascot** (`55826:698`, 2 variants) ·
> documentation frame `Chatbot — Documentation` (`55827:730`).
> Promoted from MoSJE (WIP) on 2026-08-23 following `.claude/rules/component-authoring.md`.

Samajik Sahayak (सामाजिक सहायक) — the one help assistant the whole estate shares. A launcher on
the shared corner rail that opens a scripted, non-modal chat panel.

## Why it was promoted

It lived only in **MoSJE (WIP)** (`SVMfm1KApR7KYHSbwNBnOM`) as four 475×852 screen mockups
under a `Property 1 = Open | 1 | 2 | 3` axis, where `Open` meant *closed*. Three consequences
followed from being outside the library:

| Problem | Effect |
|---|---|
| Not in SAMAVESH | Code Connect could not publish it — the token cannot write that file, and `code connect publish` uploads all templates in one request, so **all 19 templates failed** until it was excluded |
| Screen mockups, not a component | 475×852 frames, so nothing matched the shipped 400×719 panel |
| `Property 1` with `Open`=closed | The one axis a consumer reads was actively misleading |

## Code component

`packages/design-system/components/feedback/chatbot.tsx` + `.css` + `chatbot-mascot.tsx`,
exported from the barrel. Story: `apps/storybook/stories/Chatbot.stories.tsx`.
Docs: `/design-system/components/feedback/chatbot`.
Code Connect: `chatbot.figma.ts`, repointed at `<SAMAVESH>?node-id=55826-37003`.

### Variants

`State` = `Closed · Greeting · Typing · Transcript` — the widget's own lifecycle order, not
insertion order (`component-authoring.md` §10).

**Only `Closed` maps to a prop** (`defaultOpen`). Greeting, Typing and Transcript are transient
internals `Chatbot` walks through by itself at roughly 260 ms, 1160 ms and 1480 ms after opening.
They are drawn as frames because a static file cannot show motion. Do not add props to pin the
widget into one — that would invent an API for something the component deliberately owns.

## Token map

| Part | Token |
|---|---|
| Panel size | `layout/chatbot/width` (400) × `layout/chatbot/height` (719) — **added** |
| Launcher | `layout/chatbot/launcher` (84) — **added** |
| Panel surface | `bg/neutral/base`, `border/neutral/subtle`, `shape/16`, `elevation/toast` |
| Bot bubble | `bg/neutral/subtler`, corners `shape/0 · 16 · 16 · 16` |
| User bubble | `bg/brand/primary/bolder` + `on/bg/brand/primary/bolder`, corners mirrored |
| Quick reply | `bg/brand/primary/base`, `shape/8`, `padding/8`×`padding/12` |
| Mascot disc | `ref/brand/samavesh/navy` (#003366) — **added** |
| Seal ring | `bg/neutral/base` ground, wordmark `text/neutral/subtle` |
| Rhythm | `padding/16`, `stack/8`, `inline/8`, `inline/12` |

### Added to the library (never silent — `component-authoring.md` §3)

- `layout/chatbot/width` · `height` · `launcher` — Space collection, scoped `WIDTH_HEIGHT`,
  code syntax `var(--sa-layout-chatbot-*)`. Precedent: `layout/bar/height`, `layout/flag/width`.
- `ref/brand/samavesh/navy` — Static collection. The mascot disc is **artwork**, so it must not
  follow `data-brand`; this mirrors the existing `--sa-color-brand-navy` literal.

## Rules

1. **Mount once per surface.** Viewport-level, `nestable: false`. Two instances means two
   launchers fighting for one corner.
2. **Never hard-code the bottom offset.** The launcher sits on the shared corner rail and reads
   `--sa-corner-rail-bottom`; the panel's `max-height` subtracts it. This was found only by
   deploying — the panel opened at `y: -117` with its header off-screen because the cap assumed
   the resting offset while the rail had lifted the launcher to 261 px.
3. **The composer is an affordance, not a model.** The script is fixed. `onSubmit` decides what
   an unrecognised question gets; with no handler it returns an honest "I can't answer that"
   rather than silence. Never write copy implying free-form AI.
4. **Never remove the footer note.** It is the honest statement that the assistant cannot see the
   user's application or personal data.
5. **End chat is a footer text link**, in the system error ink at 9.10:1 — deliberately not a
   button beside the close control, because destructive intent does not belong where people reach
   to dismiss.
6. **The seal rotates only while thinking.** A perpetual spin would be the estate's most-seen
   animation and its least useful, and would pull WCAG 2.2.2 in for no gain.
7. **Open, the widget outranks everything** (`z-index: 2147483001`), including the demo dock,
   Important Links and the accessibility widget. Closed, it sits at `1010`.

## Flagged for a human decision (`component-authoring.md` §7)

| # | Finding | Status |
|---|---|---|
| 1 | **The mascot artwork is not in the SAMAVESH file.** It is 59 vectors in the WIP file. The Plugin API has no cross-file copy, the components there are unpublished so import-by-key cannot reach them, and 58 KB of SVG cannot be moved through a script parameter. The masters carry a named `ARTWORK SLOT` frame instead. | **Open — needs one paste in the Figma UI** |
| 2 | **The user bubble is hard-coded navy.** `--sa-color-brand-navy` is a literal, so in the default `blue` brand the user bubble is `#003366` while everything else is `#0373DF`. Figma binds `bg/brand/primary/bolder` instead. | **Figma corrected; code change proposed** |
| 3 | **Panel title and subtitle are the same ink.** Both resolve to `#404040` (`--sa-color-text-muted`), so the header has no hierarchy. Figma uses `text/neutral/base` for the title. | **Figma corrected; code change proposed** |
| 4 | **Raw pixels in the component CSS.** `.ds-chatbot__icon-btn` is `32px` and its glyph `18px` — and 18 is not on the icon scale at all. Figma binds `icon/size/32` and `icon/size/20`. | **Figma corrected; code change proposed** |
| 5 | The seal wordmark in Figma is **live text on a path**, where the web ships flattened outlines. Live text is the better library artifact — editable, bound to a style — but the two are not byte-identical. | Recorded, no action |

## The strategic question, unchanged

The assistant on live `dosje.gov.in` is a **national myScheme/GovAI iframe embed**, not a DoSJE
build. This component is the estate's own scripted assistant. Whether the estate keeps its own or
adopts the national one is a product decision that has not been taken, and it determines whether
this component has a long life or is a bridge.
