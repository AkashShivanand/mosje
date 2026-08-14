# 06 — Document SAMAVESH Motion

> **Read `00-MASTER-documentation-law.md` in full before anything else.**

---

## WHAT THIS FOUNDATION OWNS

| Group | Tokens | Values |
|---|---:|---|
| `motion.duration.*` (primitive) | 3 | `fast` 150ms · `base` 250ms · `slow` 400ms |
| `motion.easing.*` (primitive) | 3 | `out` `cubic-bezier(0,0,.2,1)` · `in` `(.4,0,1,1)` · `inOut` `(.4,0,.2,1)` |
| `motion.enter.*` (semantic) | 2 | `base` + `out` |
| `motion.exit.*` (semantic) | 2 | `fast` + `in` |
| `motion.emphasis.*` (semantic) | 2 | `slow` + `inOut` |

Figma collection **`Motion`, 12 variables**. Page: **Motion** `4162:695`
(`figmaUrl(FIGMA_NODES.motion)`) — authored from `@mosje/tokens`. Docs page: 154 lines with
duration / easing / demo / reduced-motion / tokens / guidance. The **best-covered** of the thin
foundations; you are deepening it, not rebuilding it.

---

## THE GOVERNING PRINCIPLE — STATE IT FIRST AND ENFORCE IT THROUGHOUT

**Motion is decoration, never information.** The existing page already says this. Every section you
write must be consistent with it: if removing all motion loses meaning, the design is broken, not
the motion tokens. For a government service used on low-end devices over poor connections by people
with vestibular conditions, this is not a stylistic stance — it is the accessible default.

The asymmetry in the semantic tier is the system's second-best idea and is currently undocumented as
an idea: **enter is slow and decelerating (250ms, ease-out); exit is fast and accelerating (150ms,
ease-in).** Things arrive gently and leave briskly, because a user waiting for something to appear
is being served and a user dismissing something is being obstructed. Lead the easing section with
that, not with bezier curves.

---

## PHASE 0 — the questions

Run the master's standard reconciliation, then:

1. **Three durations only.** `grep` every consumer of `--sa-motion-*` and of raw `transition:` /
   `animation:` declarations across `packages/design-system` and `apps/hub`. How much motion in the
   estate is **untokenised**? Every hardcoded `0.2s ease` is a finding.
2. **There is no linear easing.** A spinner, a progress bar and a marquee all need `linear` —
   easing them is visibly wrong. What does `Loader` actually use? If it hardcodes `linear`, propose
   `motion.easing.linear`.
3. **400ms is the ceiling.** A full-screen sheet or a page transition travelling 800px in 400ms
   moves fast enough to read as a jump. Does anything in the estate animate that far? If so, either
   the token set needs a `slower` rung or the pattern needs rethinking. Report which.
4. **No stagger, no spring, no delay tokens.** Establish whether any exist in practice (a staggered
   list, a spring on a toggle). Untokenised motion vocabulary is the same class of problem as
   untokenised colour.
5. **`prefers-reduced-motion` — verify the implementation, do not trust the section heading.**
   Find the actual media query. Confirm it covers *every* animated property, including
   `scroll-behavior: smooth` and any JS-driven animation, which a CSS-only guard misses entirely.
   Test it in the browser with the preference set and **paste the evidence**.
6. **The UX4G accessibility widget has its own motion controls.** Establish whether they interact
   with, override, or are unaware of `prefers-reduced-motion`. Two mechanisms that disagree is a
   defect.
7. **The standard checks** — `Motion`'s 12 Figma variables match source; no hardcoded durations in
   the docs page; build + tests green, run sequentially.

---

## COVERAGE CONTRACT

1. **Why motion exists here** — orientation, continuity, feedback; and the hard limit that it never
   carries meaning alone. In plain terms.
2. **The duration scale** — three rungs, what each is for, and how to choose by travel distance.
3. **The easing set** — three curves, rendered as curves *and* as moving objects, with the physical
   intuition (out = arriving, in = leaving, inOut = moving within view).
4. **The enter/exit asymmetry** — the system's core motion idea, explained.
5. **Emphasis** — when 400ms + `inOut` is right, and the discipline that it is rare.
6. **Motion in components** — every DS component that animates, its tokens, generated not transcribed.
7. **Choreography** — what to do when two things move at once; the absence of stagger tokens and
   what to do instead.
8. **Reduced motion** — the media query, what it disables, what it must *not* disable (a state
   change still has to be perceivable), the widget interaction, and how to test it.
9. **Performance** — animate `transform` and `opacity`; the compositor; why animating `height`,
   `top` or `box-shadow` costs frames; what this means on the low-end Android devices a
   citizen-facing portal actually runs on.
10. **Accessibility** — WCAG 2.3.3 (Animation from Interactions), 2.2.2 (Pause, Stop, Hide) for
    anything auto-playing or longer than 5s, and 2.3.1 (Three Flashes).
11. **Do / Don't** — six pairs minimum, as **playable** examples rather than descriptions.
12. **Handoff** — token → CSS variable → React prop → the `motion-framer` idiom where used.
13. **Provenance** — which curves are UX4G's, which Material's, which SAMAVESH decisions.

---

## PHASE 1 — Figma (`Motion`, node `4162:695`)

Motion is the foundation Figma represents worst — a static frame cannot show a curve in time.
Do not fake it. Instead:

- Verify the `Motion` collection's 12 variables and their descriptions.
- Build frames that show what a still frame *can*: the bezier curves plotted, the distance-vs-time
  graph, the enter/exit asymmetry as a filmstrip, and a table of which component uses which token.
- **Every frame carries a deep link to the live web page**, which is where motion is actually
  demonstrable. Say so on the frame. Documenting the limitation honestly beats a misleading GIF.

### Frames

1. At a glance · 2. Anatomy of a motion token · 3. The three tiers · 4. The curves plotted ·
5. Enter/exit asymmetry as a filmstrip · 6. Duration by travel distance · 7. Motion per component ·
8. Reduced motion · 9. Do / Don't · 10. Handoff · 11. Provenance.

---

## PHASE 2 — Website (`apps/hub/src/app/design-system/foundations/motion/`)

The existing live demo is the right idea. Deepen it.

### What only the web can do

- **A side-by-side curve player** — the same object, all three easings, replayable, with a
  slow-motion control.
- **A travel-distance calculator** — set a distance, get the recommended duration token and see it.
- **A reduced-motion toggle** that actually applies the preference to the page, so a reviewer can
  see both states without changing OS settings.
- **A performance readout** — animate a `transform` and a `height` side by side with a frame counter.
  Nothing argues the point better than watching one drop frames.
- **Playable do/don't pairs.**
- **Copy-to-clipboard** on every token; **deep link** via `figmaUrl(FIGMA_NODES.motion)`.

---

## PHASE 3 — pressure test

The master's six passes, plus:

- With `prefers-reduced-motion: reduce` set at the OS level, does **every** animation on the
  documentation page stop — including the demos? (A motion page that ignores the preference while
  explaining it is the worst possible failure.) The demos may remain *replayable on demand*; they
  may not autoplay.
- Can a designer, cold, pick a duration and an easing for a dropdown, a toast and a modal?
- Is any duration or easing hardcoded in the page's own markup?
- Does the page ever imply motion carries meaning?

**Score 1–5** on the master's eight dimensions.

---

## DEFINITION OF DONE

- [ ] Phase 0's seven questions answered with evidence; untokenised-motion census pasted
- [ ] `prefers-reduced-motion` implementation verified in the browser; evidence pasted
- [ ] `motion.easing.linear` proposed if the evidence supports it
- [ ] Token build + tests pass (sequentially); output pasted
- [ ] Figma: 12 `Motion` variables verified and described, 11 frames built with honest limitation
      notes and web deep links, published **and verified from a consumer file**
- [ ] `figma-live.json` refreshed and `$note` appended
- [ ] Website: page deepened, data module generated, DS audit inline, reusables in `docs-kit`
- [ ] Curve player, travel calculator and reduced-motion toggle working in the browser
- [ ] All 13 coverage-contract items addressed, and stated where
- [ ] `design.md` "Motion Tokens" updated; `AGENTS.md`, `llms.txt`, changelog, nav updated
- [ ] `accessibility-auditor` and `gov-compliance` run; output pasted; issues fixed
- [ ] `npm run lint` + `npm run typecheck` pass in `apps/hub`
- [ ] Verified in browser at 360 / 768 / 1280 and with `prefers-reduced-motion: reduce`
- [ ] Six pressure-test passes run; findings, fixes and the eight scores written up
