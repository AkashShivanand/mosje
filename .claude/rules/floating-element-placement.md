# Where a floating element goes (MANDATORY)

**There are exactly TWO places a fixed element may float, and a new one may not
invent a third.** This rule says which, in what order, and what a widget has to
declare to take part.

It exists because the answer was correct but scattered — the corner stack in
`foundations/corner-rail.ts`, the wall in `foundations/wall-rail.ts`, the "not a
corner" reasoning inside `portal-appswitcher.md`, and the z-index ladder in a
comment in `chatbot.css`. Four sources, no single answer to "I am adding a
back-to-top button, where does it go?"

## The two rails

| Rail | Position | What lives there | Hook |
|---|---|---|---|
| **Bottom-right corner** | 32px in, stacking upward with 16px gaps | the citizen's own controls — accessibility widget, chatbot launcher, cookie consent, a future back-to-top | `useCornerRailOffset` |
| **Right wall** | flush right, vertically centred | navigators and tooling — DemoDock, the website's Important Links | `useWallRailOffset` |

**Both bottom corners and the top are already spoken for.** Bottom-left is
`PortalLoginShell`'s "Signing Into" strip; the top is the masthead and the
`AccessibilityBar`. Neither is available.

## Order in the corner: stack by PERMANENCE

The corner is a vertical stack, and the order is not arbitrary. **The most
permanent occupant anchors the corner; the most transient sits highest.**

```
        ↑  most transient — moves most, disturbs least
   ┌──────────────────┐
   │  back-to-top     │   appears and disappears on scroll
   ├──────────────────┤
   │  chatbot         │   per-surface, switched on at /admin/portals
   ├──────────────────┤
   │  accessibility   │   every page, statutory, never goes away
   └──────────────────┘   ← 32px from the corner
        ↓  most permanent — anchors the stack
```

The reason is movement, not importance. **Anything below a widget that comes and
goes will jump every time it appears.** Put a back-to-top button at the bottom of
the stack and the accessibility widget and the chat launcher slide up and down
the page as the citizen scrolls — on the two controls that most need to be
findable by muscle memory. Put it on top and nothing below it ever moves.

The accessibility widget anchoring the corner follows from the same rule and
happens to be right for a second reason: it is the one control on the page that
is a legal obligation, so it gets the most predictable position on the page.

## The contract is ONE attribute

```tsx
data-sa-corner-occupant=""   // I am fixed in the bottom-right corner
data-sa-wall-occupant=""     // I am fixed against the right wall
```

Add it **when you add the widget**, not after someone reports an overlap. The
rails measure live occupancy — they do not carry a table of known widgets — so a
marked element needs no change to `corner-rail.ts` to be respected, and an
unmarked one is invisible to everything else on the page.

The UX4G accessibility widget is third-party markup we cannot annotate, so the
rail knows it by its id (`#uw-widget-custom-trigger`). That is the only
exception, and it is a measurement, never a mutation.

### Four rules the attributes do not enforce for you

1. **Gate it on being FIXED.** An inline specimen is not in the corner and is not
   on the wall. `Chatbot` claimed both regardless of `placement`, and the docs
   page renders an inline one; nothing moved only because the rail's own guards
   rejected it twice (outside the corner zone, and 811px against a 200px
   ceiling). A widget saved by someone else's guard is a defect waiting for the
   day a specimen is small and bottom-right.
2. **A launcher is an occupant; an open panel is not.** The rail ignores anything
   over `MAX_OCCUPANT_PX` (200), because shoving every neighbour to the top of
   the viewport when a conversation panel opens is worse than the overlap it
   avoids.
3. **Never hard-code the offset.** Read `--sa-corner-rail-bottom`. The chatbot
   panel's `max-height` subtracts it, and the one time that was assumed instead
   of read, the panel opened at `y: -117` with its header off-screen — found only
   by deploying.
4. **Two attributes, not one, when a widget occupies both.** They are different
   contracts: the wall one keeps the dock's rail clear, the corner one lets the
   next corner widget stack above.

## Layering

**Since 2026-09-04 there IS a `--sa-z-*` ladder, and it is the only z-index app code
may write.** Fifteen Tier-2 rungs in `packages/tokens/src/semantic.json` (`z/*`),
documented at `/design-system/foundations/layering`; a literal z-index above 2 is now
a defect, and `tools/foundation-page-standard` plus the DS adoption pass bound the
21 the design system carried. The chrome rungs below are the ones this rule cares
about; the product rungs (dropdown 100 … tooltip 800) live on the foundation page.

| Layer | Token | Value | |
|---|---|---|---|
| demo dock | `--sa-z-demo` | 2147483000 | demo scaffolding, and the reason the number below is grotesque — RESERVED |
| chatbot, **open** | `--sa-z-top` | 2147483001 | the citizen deliberately summoned it; nothing decorative covers it — RESERVED |
| UX4G accessibility panel | `--sa-z-statutory` | 999999 | statutory, third-party — RESERVED, never bound to anything SAMAVESH draws |
| Important Links, the wall rail | `--sa-z-rail` | 1000 | (was a literal 1002) |
| chatbot, **closed** | `--sa-z-launcher` | 1010 | a launcher only needs to beat product chrome — and it stays UNDER the accessibility panel, because a chat launcher has no business sitting on a statutory control |

**Closed sits below the accessibility panel and open sits above everything.** That
split is deliberate; do not collapse it to one blanket maximum. Inside a component's
own stacking context, `--sa-z-raised` (1) and a literal 2 are local order, not layering.

## Narrow viewports

The stack grows upward, so three occupants plus a 32px inset is 268px of the
right edge before anything opens. On a 640px-tall phone that is 40% of the
viewport. **Do not add a fourth corner occupant** without deciding which of the
existing three hides below a breakpoint — and say which in the same change.

## Checklist when adding a floating element

- [ ] It is on one of the two rails — not a new location, not either bottom
      corner, not the top
- [ ] It carries `data-sa-corner-occupant` and/or `data-sa-wall-occupant`
- [ ] The attribute is gated on the element actually being `position: fixed`
- [ ] Its offset is read from the rail, never hard-coded
- [ ] Its place in the corner stack follows permanence — transient on top
- [ ] Its z-index is a literal with a comment saying what it must beat and why
- [ ] It does not make a fourth corner occupant without a breakpoint decision
- [ ] Verified with something else already in the corner, not on an empty page
