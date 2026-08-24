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
| Mascot disc | `bg/brand/primary/bolder` — follows `data-brand` |
| Close disc | `bg/brand/primary/bolder` + `on/bg/brand/primary/bolder`, `shape/full` |
| Seal ring | `bg/neutral/base` ground, wordmark `text/neutral/subtle` |
| Rhythm | `padding/16`, `stack/8`, `inline/8`, `inline/12` |

### Added to the library (never silent — `component-authoring.md` §3)

- `layout/chatbot/width` · `height` · `launcher` — Space collection, scoped `WIDTH_HEIGHT`,
  code syntax `var(--sa-layout-chatbot-*)`. Precedent: `layout/bar/height`, `layout/flag/width`.
- `ref/brand/samavesh/navy` — Static collection, **added then abandoned**. It was created on the
  argument that a mascot is artwork and artwork does not re-tone. That argument does not survive
  contact with the disc: the artwork is the **robot**, and the disc is the surface it is mounted
  on, which is ordinary brand chrome. Every blue surface in the widget now binds
  `bg/brand/primary/bolder`, in code and in Figma. The variable is left in place rather than
  deleted — deleting a library variable orphans any node that later takes it.

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

**The master is an interactive component.** Its variants are wired to each other, so an instance
dropped into any frame walks the lifecycle on its own — launcher opens, the bot composes for
900ms, the greeting lands, a suggestion is answered, and close returns it. No frame-level
prototyping needed.

`3 · Prototype` — five 1440×900 frames on a neutral stage, wired on **instances of the master**
so a fix to the component propagates without re-linking. The two mechanisms answer different
questions: the interactive component shows how the widget *behaves* anywhere; the frames show
what it looks like *on a page*, growing out of the corner — which variant-switching in place
cannot show.

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
6. **The seal never turns on its own.** It runs only when a caller asks for it (`spin`), for
   documentation and specimens. A perpetual spin would be the estate's most-seen animation and
   its least useful, and would pull WCAG 2.2.2 in for no gain — and the thinking trigger it used
   to carry fired only while the mark was hidden behind the close ×, so it signalled to nobody.
7. **Open, the widget outranks everything** (`z-index: 2147483001`), including the demo dock,
   Important Links and the accessibility widget. Closed, it sits at `1010`.

## Flagged for a human decision (`component-authoring.md` §7)

| # | Finding | Status |
|---|---|---|
| 1 | **Mascot artwork.** Was blocked on a cross-file move the Plugin API cannot do. | **Closed 2026-08-23** — pasted by hand; the placeholder slots are deleted and the artwork now SCALEs (it was pinned CENTER/CENTER and overflowed the 40px avatar by 3px a side) |
| 2 | **The user bubble was hard-coded navy.** `--sa-color-brand-navy` is a literal, not a themed slot, so the bubble painted `#003366` in every brand mode — including the default blue one, where everything around it is `#0373DF`. | **Fixed 2026-08-23** — `bg/brand/primary/bolder` + its `on/` pair. White measures 6.36:1 in blue; navy mode resolves to `#003366` and renders byte-identical, so only the mode that was wrong changed |
| 3 | **Panel title and subtitle were the same ink**, leaving the header with no hierarchy. | **Fixed 2026-08-23** — the title takes `text/default`, the subtitle keeps `text/muted` |
| 4 | **Raw pixels in the component CSS.** `.ds-chatbot__icon-btn` was `32px` with an `18px` glyph, and 18 is not on the icon scale at all. | **Fixed 2026-08-23** — `icon/size/32` and `icon/size/20` |
| 5 | ~~**The code's seal is a flattened outline that bakes in a `~` separator**~~ where Figma uses `·`, and it repeats the wordmark twice where Figma repeats it once. `chatbot-assets.ts` states plainly that the 40,888-character path must not be hand-edited — it is re-exported. Now that the master lives in SAMAVESH, that is the node to re-export from (`55825:701`). | **Resolved 2026-08-23** — re-exported from `55825:701` by cloning the TEXT_PATH, `figma.flatten()`, SVG export, merging the 56 `d` attributes at 2dp. The viewBox comes from the *flattened* node's own bounds, not Figma's SVG header, which rounds to integers and stretches the artwork by a fraction of a percent |
| 6 | **The typing indicator had no bubble in code** — a bare `<span>` of four 5px dots, so it read as the whole panel loading rather than one turn arriving. | **Fixed 2026-08-23** — a hugging pill on the bot bubble's own tail geometry, so the reply grows out of the indicator instead of appearing beside it |
| 7 | **The seal turned where nobody could see it.** It rotated on `[data-thinking]`, but the widget only thinks while open, and while open the launcher has already crossfaded the mark to the close ×. | **Resolved 2026-08-23** — trigger removed. Moving it to the 40px avatar was rejected on legibility (the wordmark is a grey smudge at that size). `--spin` remains for documentation and specimens, and is now the only thing that starts it. `data-thinking` stays as a state hook for consumers and tests |
| 8 | **The send button had BOTH defects at once** — hard-coded navy and a raw `32px` box. Found while fixing the others; not in the original audit. | **Fixed 2026-08-23** — `bg/brand/primary/bolder` and `icon/size/32`, matching what the Figma master already bound |
| 9 | **`State`'s variant option order cannot be rewritten.** Figma reports `Greeting, Closed, Typing, Transcript` — a stored registration order, not child order. A child reorder and a temp-rename cycle both no-op'd. Canvas order and `defaultValue` are correct; only the properties-panel dropdown reads oddly. | Recorded, cosmetic |
| 10 | **`.ds-chatbot__end` was declared twice and the second one silently won.** The later block re-declared `padding: 0` and `font: inherit`, overriding the first block's WCAG padding, so the control rendered **49×16 — under the 24px 2.5.8 minimum** — while this spec and the docs page both claimed a 24px box. The orphaned negative margin was pulling it out of the gutter to compensate for padding that no longer existed. Found because stylelint's `no-duplicate-selectors` blocks any commit touching this file. | **Fixed 2026-08-23** — merged into one rule in the footer section; now 73×28 |
| 11 | **The unread nudge ring was the last navy literal.** It rings the mascot disc, which now follows the brand, so a fixed navy ring would have been the odd one out. | **Fixed 2026-08-23** — `bg/brand/primary/bolder` |
| 12 | **The Figma seal was 6.6px off-centre**, so its glyphs overran the 84px frame at the top and the `·` separators rendered as half-dots — the semicircle that was reported. The path circle was centred on (35.4, 35.4) while the disc is centred on (42, 42). The wordmark also covered only ~60% of the ring, because it was set at zero tracking. | **Fixed 2026-08-23** — centred, and tracked to 2.59px so the string closes the circle exactly |
| 13 | **The Figma mascot was drawn far too small.** `chatbot.css` sizes the figure at 71.5% of the mark without the ring and 66% with it; Figma had 54.8% and 39.3%. | **Fixed 2026-08-23** — both derived from the CSS percentages and the image's own crop aspect |
| 14 | **The bottom half of the seal reads inverted.** That is inherent to a single circular path and the shipped component does the same, so Figma matches it. A seal that reads upright top AND bottom needs two arcs with the lower one reversed. | Recorded — a design decision, not a defect |

## Figma ↔ code parity — measured 2026-08-23, re-measured after the parity pass

Every property compared, Figma master against `chatbot.css`/`chatbot.tsx`. Aligned unless noted.

| Part | Figma | Code | |
|---|---|---|---|
| Panel | 400×719, bound to `layout/chatbot/width` · `height` | resolves the same two tokens | ✅ |
| Geometry tokens | `layout/chatbot/*` — 5 variables, bound on the master | `--sa-layout-chatbot-*`, resolved by `chatbot.css` | **reconciled** — the family existed only in the library until 2026-08-24 |
| Header | pad `padding/16`, gap `inline/12`, 1px bottom border | identical | ✅ |
| Header mark | 40 | `--ds-chatbot-mascot-size: 40px` | ✅ |
| Title | `Title/title-2` 16 Medium, `text/neutral/base` | `title-2`, weight 500, `text-default` | ✅ |
| Title text | `Samajik Sahayak` | `title = CHATBOT_NAME` | **fixed in Figma** (was `Chat with us`, which two JSDoc `@default` tags and the web props table also still claimed) |
| Subtitle | `Body/body-3` 12, `text/neutral/subtle` | `body-3`, `text-muted` | ✅ |
| Icon buttons | 32, `shape/8`, glyph 20, `icon/neutral/subtle` | identical | ✅ |
| Icon glyphs | Material Symbols Rounded Light — `open_in_full`, `close`, `send` | were four hand-drawn `<svg>` paths, which `component-authoring.md` §2 forbids | **fixed in code** |
| Typing dot | 5, bound to `layout/chatbot/typingDot` | `var(--sa-layout-chatbot-typingDot)` | **fixed in both** — the variable said 6 and was bound to nothing |
| Typing wave | keyframed on `State=Typing`, 1.2s × 25 over a 30s timeline | `1200ms infinite`, 110ms stagger | ✅ |
| Mascot float | keyframed on `Chatbot Mascot`, 5s × 6 | `5s ease-in-out infinite`, 2.5px | ✅ |
| Seal turn | a declared specimen in §09, never on the master | `--spin` only; nothing in the lifecycle starts it | ✅ |
| Log | pad `padding/16`, gap `stack/8`, bottom-anchored | identical | ✅ |
| Turn | **row**, gap `inline/8`, top-aligned | was a **column** with a 37px avatar above the bubble | **fixed in code** |
| Avatar | 40 | was **37** — on no scale, and 40 sits beside it in the header | **fixed in code** |
| Bot bubble | `bg/neutral/subtler`, pad `padding/12`, radius `0·16·16·16`, `Body/body-1` **Regular** | was `font-weight: 500` | **fixed in code** |
| User bubble | `bg/brand/primary/bolder` + `on/…` | identical | ✅ |
| Bubble cap | 246 of 368 = 67% | `max-width: 67%` | ✅ |
| Quick reply | `bg/brand/primary/base`, pad `padding/8`×`padding/12`, `shape/8`, `Body/body-2`, `text/neutral/subtle` | identical | ✅ |
| Quick reply border | 1px OUTSIDE stroke on its own fill colour | `border: 1px solid transparent`, so hover colours it without resizing | ✅ — renders 38; Figma *reports* 36, because an outside stroke is excluded from a node's measured size |
| Quick reply copy | Find a scheme · Check application status · I'm not receiving OTP | identical | **fixed in Figma** (was developer-portal copy: API documentation, register as a developer) |
| Replies | wrap, packed **right**, gap `stack/8`×`inline/8` | identical | **fixed in both** — Figma stacked one-per-row, code packed left |
| Reply item margin | n/a | `margin: 0`, so an ambient `li + li` prose rule cannot offset the row | **fixed in code** |
| Footer | pad `12/16/16/16`, gap `stack/8`, 1px top border | identical | ✅ |
| Composer | pad `4/4/4/12`, gap `inline/8`, `shape/full`, 1px border | identical | ✅ |
| Composer text | `Body/body-2` 14 | `body-2` | ✅ |
| Send | 32, `bg/brand/primary/bolder`, `shape/full`, glyph **16** | identical | ✅ |
| Send at rest | drawn at 35% — the composer is empty in every variant | `:disabled { opacity: 0.35 }` | **fixed in Figma** (was drawn enabled) |
| Note | `Body/body-3` 12, `text/neutral/subtle` | `body-3`, `text-muted` | ✅ |
| Note text | "…points you to the right portal. It cannot decide or change an application." | identical | **fixed in Figma** |
| End chat | `Label/label-1` 14, `text/status/error/base`, 1px `border/status/error/base`, `shape/8`, pad `padding/6`×`padding/12` | identical | **redesigned in both** — it was an underlined word, which reads as a link |
| End chat target | 83×32 reported, 83×34 rendered — the 1px border is an OUTSIDE stroke | 83×34 | ✅ — the TEXT node now sits inside a HUG button frame, so the hit area is real geometry rather than a claim |
| End chat position | same row as the note, hard right, bottom-aligned | identical (`.ds-chatbot__footer-row`, `align-items: flex-end`) | ✅ |
| Launcher | 84, `bg/neutral/base`, `shape/full`, `elevation/toast` | identical | ✅ |
| Close disc | full-bleed, `bg/brand/primary/bolder`, glyph 24 | full-bleed, glyph 30% of 84 = 25.2 | ✅ within a pixel |
| Mascot disc | `bg/brand/primary/bolder` | identical | ✅ |
| Mascot figure | 60 (Ring=Off) · 56 (Ring=On) of 84 | 71.43% = 60 · 66.67% = 56 | ✅ derived from the master, not eyeballed |
| Seal | live text on a path, `·` separator, doubled, Noto Sans Medium 6.5 on a 68px circle | flattened outline of that exact node, viewBox `0 0 77.19 76.07` | **resolved** — re-exported from `55825:701`; ring insets recomputed from the same measurement |

## The strategic question, unchanged

The assistant on live `dosje.gov.in` is a **national myScheme/GovAI iframe embed**, not a DoSJE
build. This component is the estate's own scripted assistant. Whether the estate keeps its own
or adopts the national one is a product decision that has not been taken, and it determines
whether this component has a long life or is a bridge.
