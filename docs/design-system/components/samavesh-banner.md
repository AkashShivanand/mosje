# SamaveshBanner — behaviour specification

The component's **contract**: every state it can be in, every way it can be
entered and left, and every edge case that has been tested. Written because
"tested a few things and moved on" is how the two defects in §4 shipped.

Source: `packages/design-system/components/navigation/samavesh-banner.tsx`
Docs page: `/design-system/components/navigation/samavesh-banner`
Colour decision and its research: header of `samavesh-banner.css`, and entry 8 of
`docs/guidelines/README.md`.

---

## 1. What it is

A site-wide identity band with one control, which discloses a panel of the
portals that are actually built. It is **chrome, not content**: it mounts between
the header and `<main>`, never inside it.

It is a **disclosure**, not a modal. That single classification decides most of
what follows — no scrim, no focus trap, no scroll lock, no inert background.

## 2. States

| State | Band | Panel | Toggle |
|---|---|---|---|
| Closed | in flow, `position: relative` — scrolls away like any other band | `0fr`, `visibility: hidden`, `aria-hidden` | `aria-expanded="false"`, chevron at 0° |
| Open | **`position: sticky`** at `--sa-header-stuck`, full height | `1fr`, visible, capped and scrollable | `aria-expanded="true"`, chevron at 180° |
| Open, page scrolled | stays pinned, flush under the masthead in either of its states | pinned with the band | reachable |
| Open, panel overflowing | pinned | capped to the fold, scrolls internally | reachable |
| Open + masthead condensed | pinned and **condensed to 60px** — padding 12→6, badge 52→40, wordmark and subline one step each, control tighter. **Subline still present** | unchanged | unchanged |
| Closing while pinned | `--closing` for 260ms: stays pinned, translates up and fades, then releases to flow | snapped shut, not tweened | — |
| `sticky={false}` (specimens only) | never pins, never condenses, never exits | as above | as above |

**The band pins while its panel is open, and only then.** The pin exists to keep
the TOGGLE with the PANEL it controls — without it ~540px of scroll took the band,
and the only visible way to close, off the top while the panel stayed over the
page. That problem exists only in the open state, so the fix lives only there.

**The subline survives every state, and that is what decided this.** A version
pinned ALWAYS had to condense to be affordable — 143px of an 812px viewport
otherwise — and the condense dropped the subline, the one line telling a first
visitor SAMAVESH is a single access mechanism rather than a logo. Trading the
component's only explanatory sentence for chrome present when nobody is using it
is the wrong way round. Do not reintroduce a condensed band.

**It condenses while pinned, and the subline survives.** 80px → 60px, driven by
the masthead's own `:root[data-sa-header-condensed]` so the two condense on one
scroll with one set of thresholds. This is affordable here and was not when the
band pinned permanently: shrinking something ALWAYS present forces you to drop
the subline, shrinking something present only while the reader is choosing a
portal does not. **Reducing scale is a different act from deleting content**, and
only the second one was wrong.

**Closing while pinned is an exit, not a disappearance.** Dropping `--open`
reverts the band to `relative` in the same frame, returning it to a flow position
a thousand pixels above the fold — not a slide, an absence, and an 80px bar
vanishing out of the top of the viewport reads as a rendering fault. `--closing`
holds it pinned for 260ms and translates it up and out along the path it would
have taken had the reader scrolled it away. Guarded twice: only when ACTUALLY
pinned — measured from the element's own rect against its resolved `top`, not
re-derived from scroll position — and never under `prefers-reduced-motion`.
Reopening mid-exit cancels it.

**The offset is `--sa-header-stuck`, never `--sa-header-pinned`.** The two are
different measurements of the same edge: `--sa-header-pinned` is written only
while the masthead is RESTING, because `scroll-padding-top` must clear the taller
of its two states. A sticky offset needs the current one. That was the real
defect — about which variable, not about when the band pins.

## 3. Ways in and out

**In:** click/tap the toggle (the whole band below 768px), or `Enter`/`Space` on it.

**Out, and what each does with focus:**

| Exit | Closes | Focus |
|---|---|---|
| Toggle again | yes | stays on the toggle |
| `Escape` | yes | **returned to the toggle** |
| Pointer-down outside the banner | yes | **not moved** — the pointer has already gone elsewhere; yanking focus back would fight the click |
| Scrolling the page | **NO** | — |
| Following a portal link | navigation | — |

**Scrolling deliberately does not close it.** Scrolling is how a reader looks at
a long list, not how they say "never mind". An earlier version dismissed on
scroll and that was the interface overruling the person using it.

## 4. Defects this component has actually shipped

Kept because each one names a trap the next change can fall into.

| # | Defect | Cause | Fix |
|---|---|---|---|
| 1 | NOS linked a portal that does not exist — a 404 on every page of the website | the portal list was a hand-kept copy of the registry, and it had drifted | list is DERIVED from `DEFAULT_APPS`; an unbuilt portal cannot be rendered as a link |
| 2 | White band text at 2.91:1 | WCAG 2 misjudges saturated mid-tones | three tones; the failure is recorded rather than hidden |
| 3 | Banner 16px out of line with the page | a restated `max-width: 1320px` | binds `.sa-container` |
| 4 | Last portal card ran under the Important Links rail | same cause as 3 | same fix |
| 5 | A 2px white line under the band on every page | the collapsed drawer still reserved its `border-bottom`, which `visibility: hidden` then refused to paint | the rule belongs to the open state only |
| 6 | The hero carousel painted through the open panel | carousel arrows are `z-20` and the banner was `z-20`; equal z-index falls back to DOM order | banner raised to 30 |
| 7 | Drawer `<h2>` sat above the page's `<h1>` | heading order is a document property, so moving it out of `<main>` did not fix it | it is a `<p>` naming a `<nav>` |
| 8 | **The bottom of the panel was unreachable on a phone** | the band is sticky while open and the panel hangs off it absolutely, so the panel pinned too — 1062px of panel in an 812px viewport, 594px past the fold, and scrolling moved the band without revealing any of it | panel caps at `100dvh − header − band` and scrolls internally |
| 9 | **A fast double-tap left it open when it should have closed** | `handleToggle` computed `!open` from the render closure, so two clicks in one tick both read the same stale value and the second was swallowed | functional updater |
| 10 | **A strip of page content ran between the masthead and the band once the masthead condensed** — 89px on desktop, 155px on a phone | the band pinned to `--sa-header-pinned`, which is written ONLY while the masthead is resting, because `scroll-padding-top` must clear its taller state. So the band sat at 154/212 while the condensed header ended at 65/57. The right value for a sticky offset is the opposite one | `SiteHeader` publishes `--sa-header-stuck` — the same measurement, written in whichever state the masthead is in — and the band reads that |
| 11 | `--sa-header-pinned` was being written as the CONDENSED height, which is precisely what it exists not to be | `measure()` read `condensed` from the React value its effect closed over. At every transition React re-renders, the condensed bar is in the DOM at its new height, and the ResizeObserver registered by the *previous* effect is still the one attached — so it fired with new geometry and an old flag. That number is `scroll-padding-top`, so the frame that got it wrong left an anchor 155px short of clearing an expanded masthead (WCAG 2.4.11) | `measure()` reads `is-scrolled` off the element it is measuring. A class set by the same render that produced the geometry cannot be a frame out of step with it |
| 12 | Pinning the band permanently would have put anchor targets under it | the document's `scroll-padding-top` accounted for the masthead only, because until now the band always scrolled away | the band publishes its RESTING height and a rule at the foot of its stylesheet adds it. Both values are resting heights, since an anchor can land before the page has scrolled far enough for either to condense |
| 18 | **Pinning the band permanently cost the subline** | a band that never leaves has to shrink to be affordable, and the shrink took the one sentence explaining what SAMAVESH is. The pin was solving a problem — the toggle leaving with the band — that only exists while the panel is open | pins only while open, at full height. Defect 12's `scroll-padding` surcharge went with it, or every anchor on every page would have been over-padded by 86px to clear a band that is not there |
| 19 | **The mark registry returned nothing on the server** | `ORG_LOGOS` and its resolvers sat in the `"use client"` component file, so a server component importing them got a client-reference proxy. `Object.keys()` returned `[]`, the documentation page's catalogue of all sixteen marks rendered as nothing, and no error appeared anywhere. Found by counting tiles on the page | data and pure resolvers split into `org-logo-registry.ts`, which carries no directive; the component re-exports them so callers see one module |
| 20 | **The band vanished instead of leaving when closed while pinned** | `--open` carried the `position: sticky`, so dropping it teleported the band back to a flow position off the top of the screen in a single frame | `--closing` keeps it pinned for one 260ms exit, translating up and out, then releases it once it is already off-screen |
| 21 | **SAMBAL rendered as the State Emblem** | its `org-logo` variant had a real device sitting UNDER a 74-node, one-TEXT-node-per-character strapline inside a 56px box. Illegible, and it meant the mark had never been exported — so the slug was missing from the registry and every surface fell back | strapline removed in the library, device fitted to the 48px inset its siblings use, exported, registered against `/portals/nhapoa` |
| 22 | **The Figma card's mark slot instanced the SAMAVESH logo**, not `org-logo` | so every card in the library wore the same mark and none could be swapped per organisation — the exact defect `org-logo` exists to prevent, inside the component that most needs it | swapped to an `org-logo` instance in all four variants |
| 13 | **`onToggle` fired twice per click in development** | the fix for defect 9 moved the callback INSIDE `setInternalOpen`'s updater. React requires updaters to be pure and StrictMode double-invokes them, so one click ran the consumer's callback twice — a fix that traded a visible bug for an invisible one | a synchronous `openRef` mirror: the second tap reads the first tap's decision, and the callback fires once, outside the updater |
| 14 | **The Code Connect template instructed agents to do the opposite of what ships** | its first rule said the band's ink is deep India green and told the reader not to "correct" it back to white. Written before the three-tone decision; the shipped default IS white, deliberately. It also named `successStrong`, the one dark ink the stylesheet explicitly rejects | rewritten against the shipped component, both variant axes mapped exhaustively, and the six code props with no Figma property each explained |
| 15 | **`PortalCard`'s planned branch dropped `ref` and every passed prop**, and its `aria-label` was inert | two return branches, one of which forwarded nothing. ARIA forbids naming an element with an implicit generic role, so the label was dropped by screen readers while reading as an accessibility affordance | both forwarded on both branches; the label removed, since the card's own text announces correctly |
| 16 | **`external` opened a new tab with no warning** | the prop's doc told the CALLER to "pair with a visible cue" and gave them nothing to pair with. Undetected because no live portal is external yet | glyph plus visually-hidden text, both, in the component [WCAG G201] |
| 17 | **Four documents claimed `PortalCard` had ended the duplicate-card problem** | only the banner adopted it. `/portals` still draws `portals-gw__card`, so the extraction made three cards rather than one | the claim withdrawn and recorded as open work, with the reason the consolidation is a design call rather than a swap |

## 5. Edge cases — tested, with the result

Measured on the running site at 375×812 unless stated.

| # | Case | Expected | Result |
|---|---|---|---|
| E1 | Panel taller than the viewport | caps to the fold, scrolls inside | **PASS** — cap 514px = 812 − 212 header − 86 band; last card and footer link reachable |
| E2 | Page scrolled with panel open | band pins, panel stays open | **PASS** — measured at scrollY 2200: band flush under the condensed masthead, gap 0, panel open |
| E2b | Page scrolled with panel CLOSED | band scrolls away | **PASS** — at scrollY 1311 the band sits at −1200. It is not chrome when nothing is open |
| E3 | Masthead condenses while the panel is open | band follows it, no gap | **PASS after fix** — recorded PASS once and was wrong; see defect 10. Measured across rest → deep scroll → open → scroll further: gap 0 in every read, band 80px throughout, subline present throughout |
| E14 | Anchor or skip link landing while the band is pinned | target clears the band | **PASS after fix** — the band publishes its resting height and the document's `scroll-padding-top` adds it: 302px on a phone (212 masthead + 86 band + 4). Three real page headings land at y 302 against a band bottom of 109. WCAG 2.4.11 |
| E15 | Inline specimen (`sticky={false}`) | does not pin | **PASS** — the docs page's four specimens and every Storybook story pass it; three stacked tone specimens would otherwise pin to the same offset and cover each other |
| E4 | `Escape` | closes, focus to toggle | **PASS** |
| E5 | Pointer-down inside the panel | stays open | **PASS** |
| E6 | Pointer-down outside | closes, focus not stolen | **PASS** |
| E7 | Rapid double toggle | returns to closed, `aria-expanded` agrees | **PASS after fix** — previously ended open |
| E8 | Cards while closed | not focusable | **PASS** — `visibility: hidden` removes them from the tab order |
| E9 | Cap recomputes on resize | follows live variables | **PASS** — reads `--sa-header-bottom` and `--_band-h`, both from ResizeObservers. Deliberately **not** the `--sa-header-stuck` the band pins to: the two differ by the accessibility bar's 46px for the first 46px of scroll, and a cap 46px too short only loses height the panel scrolls past anyway, while one 46px too tall puts the last rows below the fold with nothing to reach them |
| E10 | Overscroll at the end of the panel | **chains to the page** | **PASS after fix** — `contain` was a scroll trap: the open panel covers ~65% of the viewport, so once the list bottomed out the page stopped responding to scroll at all. The band is sticky, so chaining cannot drag it away |
| E11 | `prefers-reduced-motion` | no travel, no stagger delay, state still changes | **PASS** |
| E12 | One category of portals | filter row absent | **PASS** — pinned in `portal-categories.test.ts` |
| E13 | Two or more categories | filter renders with counts | **PASS** — verified on the docs specimen |

### Known and accepted

- **No focus trap.** It is a disclosure, not a modal: `Tab` past the last card
  continues into the page behind. Trapping focus in something that does not dim
  or block the page would strand a keyboard user in a panel they can see past.
- **No scroll lock.** Same reason. The page scrolls under an open panel by design.
- **Focus does not move into the panel on open.** The toggle keeps focus and
  `aria-expanded` announces the change; moving focus is modal behaviour.
- **Controlled mode with `isOpen` and no `onToggle` freezes the panel.** The
  component reports intent and does not own the state. Documented on the prop.

## 6. Responsive behaviour

| Width | Band | Panel grid |
|---|---|---|
| < 768 | whole band is the button; chevron only; subline on its own lines | 1 column |
| 768–1023 | wordmark · rule · subline · Explore pill | 2 columns |
| ≥ 1024 | as above | 4 columns |

The subline is never hidden **by width**. An earlier pass made it visually-hidden
below 768px to keep the band short; the mobile design keeps it, and it is what
tells a first visitor that SAMAVESH is a mechanism rather than a logo. The Explore
**pill** is what gives way instead.

It *is* hidden **by scroll depth**, once the masthead condenses — along with the
vertical rule, with the badge at 32 rather than 44/52 and the wordmark one step
down the type scale. The band goes 80→52 on desktop and 86→52 on a phone. The
distinction is the point: at first sight, at any width, the sentence is there;
120px further down the page the reader has either read it or decided not to, and
what they need from the band is the way in.

The change is **instant, not tweened**, matching the masthead, which swaps its
tiers in one frame at the same moment. Two halves of one chrome block easing at
different rates read as two things; changing together reads as one.

## 7. Motion

| What | Value | Why |
|---|---|---|
| Panel open/close | `grid-template-rows` 380ms `cubic-bezier(0.22, 1, 0.36, 1)` | exponential ease-out reads as arriving under its own momentum; a `max-height` cap would clip silently once the list grows |
| Chevron | 180° rotation, same curve | one glyph rotating, never two swapping — a swap is a discrete jump mid-gesture |
| Cards | opacity + 6px rise, 28ms apart, **capped at 8 steps** | uncapped, the tail of a long list arrives after the eye has gone looking for it |
| Press | `scale(0.97)` | inherited from the DS `Button` |

All of it is removed under `prefers-reduced-motion`, **including the stagger's
delay** — a delay with no transition would hold the cards invisible for 250ms.

## 8. Rules for changing it

1. **Never restate a width.** Both rows carry `.sa-container`.
2. **Never hand-write the portal list.** It derives from the registry.
3. **Never put `role="listitem"` on a card.** It replaces the implicit link role.
4. **Never mount it inside `<main>`.**
5. **Never reintroduce close-on-scroll.**
5a. **Never pin anything to `--sa-header-pinned`.** It is the RESTING height, for
   `scroll-padding-top`. A sticky offset takes `--sa-header-stuck`. Defect 10.
5b. **Never read a React state value inside a ResizeObserver callback** to decide
   what the geometry you just measured means. Read it off the element. Defect 11.
5c. **`sticky` is on by default and off for every specimen.** A pinned example
   detaches from the prose explaining it, and stacked ones cover each other.
6. **Do not add a focus trap or a scroll lock** without first reclassifying it as
   a modal, which is a different component.
7. **Re-test §5 after any change to position, overflow or open-state.** Defects 8
   and 9 were both invisible to the type checker and to every gate.
