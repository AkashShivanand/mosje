# Chatbot — component specification

> SAMAVESH Design System · Figma `3FF5l0SMNIwdpZrKkeyPTm` → page **Chatbot** (`55813:941`) →
> set **Chatbot** (`55826:37003`, 4 variants) and **Chatbot Mascot** (`55826:698`, 2 variants) ·
> documentation frame `Chatbot — Documentation` (`55827:730`) · prototype section
> `3 · Prototype` (`55846:730`, starting point `55846:731`) · motion specimen (`55852:893`).
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

`State` = `Closed · Typing · Greeting · Transcript` — the widget's own lifecycle order
(`component-authoring.md` §10).

**Typing comes BEFORE Greeting.** This was documented the other way round until the opening
effect was read line by line:

```ts
after(OPENING_BEAT_MS, () => setOwnTyping(true));
after(OPENING_BEAT_MS + typingDelayMs, () => { setOwnTyping(false); setOwnMessages([greeting]); });
after(OPENING_BEAT_MS + typingDelayMs + 320, () => setRepliesShown(true));
```

The dots are what the greeting arrives *out of*. That is also why the Typing frame is drawn
with an **empty log** — it is the one moment the indicator is the only thing on screen. The
same indicator recurs before every later bot turn.

**Only `Closed` maps to a prop** (`defaultOpen`). Do not add props to pin the widget into
Typing or Transcript — that would invent an API for something the component deliberately owns.

### Component properties

Beyond the variant axis the master carries four TEXT and two BOOLEAN properties, bound across
all three open variants:

| Figma property | Code prop |
|---|---|
| `Title` | `title` |
| `Subtitle` | `subtitle` |
| `Note` | `note` |
| `Placeholder` | `composerPlaceholder` |
| `Show composer` | `composer` |
| `Show subtitle` | *(no code equivalent — `subtitle=""` is how you suppress it; the boolean is that decision made switchable)* |

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
| Close disc | `ref/brand/samavesh/navy` + `on/bg/brand/primary/bolder`, `shape/full` |
| Seal ring | `bg/neutral/base` ground, wordmark `text/neutral/subtle` |
| Rhythm | `padding/16`, `stack/8`, `inline/8`, `inline/12` |

### Added to the library (never silent — `component-authoring.md` §3)

- `layout/chatbot/width` · `height` · `launcher` — Space collection, scoped `WIDTH_HEIGHT`,
  code syntax `var(--sa-layout-chatbot-*)`. Precedent: `layout/bar/height`, `layout/flag/width`.
- `ref/brand/samavesh/navy` — Static collection. The mascot disc is **artwork**, so it must not
  follow `data-brand`; this mirrors the existing `--sa-color-brand-navy` literal.

## Motion — two mechanisms, and the split is not a style choice

**State changes are transitions.** They must interrupt and retarget mid-flight when someone
double-clicks the launcher. In Figma these are prototype reactions with Smart Animate: 240ms
enter, 160ms exit, 260ms turn-in, all on `cubic-bezier(0.23, 1, 0.32, 1)` read from
`chatbot.css`, plus the 900ms `typingDelayMs` beat as an `AFTER_TIMEOUT`.

**Loops are keyframes.** There is nothing to retarget and they must run forever:

| Loop | Timing | Keyframes |
|---|---|---|
| Typing wave | 1200ms, 4 dots 110ms apart | opacity .35→1, `TRANSLATION_Y` 0→−3 at 30% of the cycle |
| Mascot float | 5s, constant | `TRANSLATION_Y` 0→−2.5→0, ease-in-and-out |
| Seal | 10s linear | `ROTATION` 0→−360 (negative is clockwise in the motion API) |

Two Figma constraints shaped where these live: **keyframes are refused on instance sublayers**,
so the loops sit on detached specimens in `06 · Motion specimen` rather than inside the
prototype frames; and a **`TEXT_PATH` cannot be animated**, so the seal turns inside a wrapper
frame. Verified by `export_video` + frame sampling, not by assertion.

## Prototype

`3 · Prototype` — five 1440×900 frames on a neutral stage, wired on **instances of the master**
so a fix to the component propagates without re-linking:

`01 Closed` → `02 Thinking` → `03 Greeting` → `04 Asked` → `05 Answered`

The instance is anchored bottom-right, which is what makes Smart Animate grow the panel out of
the launcher and shrink it back into the same place. Both the minimise control and the close
disc return to `01` from anywhere. Hover and press are **not** prototyped: representing them
would mean duplicating every frame for a state already fully specified in `chatbot.css`.

One simplification, deliberate: `04 Asked` hides the answer bubble by instance override, so the
900ms beat between question and answer is the frame delay rather than a second dots frame.

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
4. **Never remove the footer note.** It is the honest statement that the assistant cannot see
   the user's application or personal data.
5. **End chat is a footer text link**, in the system error ink at 9.10:1 — deliberately not a
   button beside the close control, because destructive intent does not belong where people
   reach to dismiss.
6. **The seal rotates only while thinking.** A perpetual spin would be the estate's most-seen
   animation and its least useful, and would pull WCAG 2.2.2 in for no gain.
7. **Open, the widget outranks everything** (`z-index: 2147483001`), including the demo dock,
   Important Links and the accessibility widget. Closed, it sits at `1010`.

## Flagged for a human decision (`component-authoring.md` §7)

| # | Finding | Status |
|---|---|---|
| 1 | **Mascot artwork.** Was blocked on a cross-file move the Plugin API cannot do. | **Closed 2026-08-23** — pasted by hand; the placeholder slots are deleted and the artwork now SCALEs (it was pinned CENTER/CENTER and overflowed the 40px avatar by 3px a side) |
| 2 | **The user bubble is hard-coded navy.** `--sa-color-brand-navy` is a literal, so in the default `blue` brand the user bubble is `#003366` while everything else is `#0373DF`. Figma binds `bg/brand/primary/bolder`. | **Figma corrected; code change proposed** |
| 3 | **Panel title and subtitle are the same ink.** Both resolve to `#404040`, so the header has no hierarchy. Figma uses `text/neutral/base` for the title. | **Figma corrected; code change proposed** |
| 4 | **Raw pixels in the component CSS.** `.ds-chatbot__icon-btn` is `32px` and its glyph `18px` — 18 is not on the icon scale. Figma binds `icon/size/32` and `icon/size/20`. | **Figma corrected; code change proposed** |
| 5 | The seal wordmark in Figma is **live text on a path**, where the web ships flattened outlines. | Recorded, no action |
| 6 | **The typing indicator has no bubble in code** — a bare `<span>` of four 5px dots. Figma drew three 6px dots in a 246×96 slab, which was the bot bubble's geometry copied over. Figma is now a **hugging 56×29 pill** with the four dots the code ships. The pill is the deliberate improvement: it occupies the position the answer will occupy, so the answer grows out of it instead of appearing beside it. | **Figma leads; code change proposed** |
| 7 | **The seal turns where nobody can see it.** It rotates on `[data-thinking]`, but the widget only thinks while open, and while open the launcher has already crossfaded the mark to a close ×. The estate's most carefully specified loop is behind the thing that replaced it; the signal that actually reads is the typing indicator. | **Open — needs a design decision**: move the spin to the avatar, or stop specifying it as a thinking cue |
| 8 | **`State`'s variant option order cannot be rewritten.** Figma reports `Greeting, Closed, Typing, Transcript` — a stored registration order, not child order. A child reorder and a temp-rename cycle both no-op'd. Canvas order and `defaultValue` are correct; only the properties-panel dropdown reads oddly. | Recorded, cosmetic |

## The strategic question, unchanged

The assistant on live `dosje.gov.in` is a **national myScheme/GovAI iframe embed**, not a DoSJE
build. This component is the estate's own scripted assistant. Whether the estate keeps its own
or adopts the national one is a product decision that has not been taken, and it determines
whether this component has a long life or is a bridge.
