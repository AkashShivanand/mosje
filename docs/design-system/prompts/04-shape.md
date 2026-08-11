# 04 — Document SAMAVESH Shape (radius & border)

> **Read `00-MASTER-documentation-law.md` in full before anything else.**
>
> ⚠ **This is a NEW documentation surface.** There is no `foundations/shape/` page today. Radius and
> border-width tokens ship in production and are documented **nowhere** on either surface. You are
> creating the page, the Figma frames and the route.

---

## WHAT THIS FOUNDATION OWNS

| Group | Tokens | Values |
|---|---:|---|
| `radius.*` (primitive) | 12 | `none` 0 · `xxs` 2 · `xs` 4 · `sm` 6 · `md` 8 · `lg` 12 · `xl` 16 · `2xl` 20 · `3xl` 24 · `4xl` 32 · `5xl` 40 · `full` 999px |
| `border.width.*` (primitive) | 5 | `none` 0 · `sm` 1 · `md` 2 · `lg` 3 · `xl` 4 |
| `control.radius` (semantic) | 1 | `{radius.md}` = 8px |
| `control.border.width` (semantic) | 1 | `{border.width.sm}` = 1px |
| `focus.width` · `focus.offset` | 2 | `{border.width.md}` = 2px · `{space.xxs}` = 2px |

Figma collection **`Radius`, 13 variables**. Current docs page: **none**.

### Boundary with colour — state this explicitly on the page

`border` spans two foundations and readers will conflate them:

- **`border.width.*`** — geometry. **This foundation.**
- **`border.neutral.*` / `border.brand.*` / `border.status.*`** — colour. **`01-colour.md`.**

Cross-link both ways. A border is a width *and* a colour, and neither page owns both.

---

## THE HEADLINE FINDING — SHAPE HAS ALMOST NO SEMANTIC TIER

Twelve radius primitives. **One** semantic radius token (`control.radius`). Five border-width
primitives. **One** semantic border-width token (`control.border.width`).

Colour has 46 `on/*` pairs and a full slot grammar. Space has four intent ladders. Shape has a raw
scale and essentially nothing on top of it — which means every component reaches straight for a
primitive, which is exactly what `tier-discipline.test.mjs` exists to prevent everywhere else.

**Establish, with evidence from the codebase:**

- `grep` every consumer of `--sa-radius-*` and `--sa-border-width-*` across `packages/design-system`
  and `apps/hub`. Which rungs are actually used, and by what?
- Is there a *de facto* semantic layer — cards always `lg`, chips always `full`, inputs always `md`
  — that is real in the code but unnamed in the tokens?
- Are any of the 12 rungs **dead**? A radius scale where five rungs have no consumer is five
  invitations to invent an inconsistency.

Then **propose** a semantic shape layer (`shape.control` / `shape.card` / `shape.surface` /
`shape.pill` / `shape.field`, or whatever the evidence supports). **Propose; do not execute.**
Documenting is in scope; adding tokens is not, without approval.

This proposal is the most valuable thing this prompt produces. Do it properly: name each proposed
token, its value, its consumers today, and what breaks if it is not added.

---

## PHASE 0 — the questions

Run the master's standard reconciliation, then:

1. **Twelve rungs, `xxs` 2 → `full` 999.** Is the ladder used at all its steps? Which are dead?
2. **`radius.full = 999px`.** Confirm nothing in the estate renders wider than 1998px in a context
   where 999px would fail to produce a pill. (It is the standard trick; document *why* it is a large
   number and not `50%` — `50%` on a non-square box produces an ellipse.)
3. **Radius and border-width interact.** A 1px border on a 2px radius renders differently from a 4px
   border on the same radius — the inner radius is `outer − width`. Does anything in the estate use
   a border wider than 2px on a small radius? Show the effect.
4. **`focus.offset = {space.xxs}`** — the focus ring's geometry borrows from the *space* scale while
   its width borrows from the *border* scale. `usage-guidance.mjs` already notes: *"The ring's colour
   was tokenised long before its geometry, so this was hardcoded."* Confirm that comment is still
   true, and document the ring as a three-part contract (colour + width + offset) governed by
   WCAG 2.4.7 and 1.4.11.
5. **The `Radius` collection has 13 variables for 12 primitives.** Identify the thirteenth.
6. **Border-width and non-text contrast.** WCAG 1.4.11 requires 3:1 for UI component boundaries.
   A 1px border at 3:1 and a 3px border at 3:1 are not equally perceivable. Does the estate lean on
   thin borders anywhere that a thicker one would serve better?
7. **The standard checks** — Figma parity, no hardcoded radii in the docs page, build + tests green
   (run sequentially).

---

## COVERAGE CONTRACT

1. **What radius communicates** — softness, affordance, containment; why a government service uses
   restrained radii, in plain terms.
2. **The radius scale** — all 12 rungs at true size, each with what it is for and what uses it today.
3. **The pill** — `full`, when it is right (chips, tags, avatars, toggle tracks) and when it is not.
4. **The border-width scale** — all 5, rendered, with the 1.4.11 contrast consequence.
5. **The semantic gap** — the Phase 0 proposal, stated openly as a known gap with a proposed fix.
6. **Nesting** — inner vs outer radius, the `outer − width` rule, and what a wrong nest looks like.
7. **Shape in components** — every DS component's actual radius and border, in one table, generated
   from the source rather than transcribed.
8. **The focus ring** — colour + width + offset as one contract; WCAG 2.4.7 and 1.4.11; never
   suppress it; cross-link `09-accessibility.md`.
9. **Shape and elevation** — radius changes how a shadow reads. Cross-link `05-depth.md`.
10. **Do / Don't** — six pairs minimum on real MoSJE UI.
11. **UX4G 3.0 parity** — the radius crosswalk and the measured conformance figure.
12. **Handoff** — token → CSS variable → Tailwind utility → React prop.
13. **Provenance** — which values are UX4G's, which SAMAVESH's, which inherited.

---

## PHASE 1 — Figma

There is no dedicated shape page. **Ask before creating a new top-level page**; the default is to
build the frames on the existing **Layout Grid** page (`2140:295915`) alongside space, or on
**Effects** (`2140:295914`) alongside elevation — and to add a `shape` entry to `FIGMA_NODES` in
`apps/hub/src/lib/design-system/figma.ts` once the node exists.

Standard hygiene from the master, plus: confirm the `Radius` collection's 13 variables, confirm
every variable carries a description naming its consumers, and confirm no component in the library
uses a **detached** corner radius.

### Frames

1. At a glance · 2. Anatomy of a shape token · 3. The three tiers · 4. The radius scale at true size
· 5. The border-width scale · 6. Nesting (inner vs outer) · 7. Shape across every component ·
8. The focus ring contract · 9. Do / Don't · 10. Handoff · 11. Provenance.

---

## PHASE 2 — Website (`apps/hub/src/app/design-system/foundations/shape/`) — NEW ROUTE

Create the route, add it to the foundations nav, add it to `llms.txt`, and add a changelog entry.

### What only the web can do

- **A live radius playground** — one box, a slider across the 12 rungs, showing the rendered corner
  and the token name, with a border-width slider beside it so the nesting effect is visible.
- **A nesting demo** — outer box + inner box, both adjustable, with the computed inner radius shown
  and the wrong result rendered next to the right one.
- **A component shape table** rendered from live components, not from a transcription.
- **A focus-ring inspector** — tab through real controls and see the ring's computed colour, width
  and offset.
- **Copy-to-clipboard** on every token.
- **Deep link** to whichever Figma node the frames land on.

---

## PHASE 3 — pressure test

The master's six passes, plus:

- Can a designer, cold, pick the right radius for a card, a chip, an input and a modal — and say why?
- Does the page make the semantic gap honest, or does it paper over it?
- Under `forced-colors: active`, do borders survive? (They are frequently the *only* thing that
  survives — say so.)
- Does the page hardcode any radius or border width in its own markup?

**Score 1–5** on the master's eight dimensions.

---

## DEFINITION OF DONE

- [ ] Phase 0's seven questions answered with evidence; consumer `grep` results pasted
- [ ] The semantic-shape-layer proposal written up: token, value, consumers, what breaks without it
- [ ] Token build + tests pass (sequentially); output pasted
- [ ] Figma: node location agreed, 11 frames built, `Radius`'s 13 variables verified and described,
      published **and verified from a consumer file**; `FIGMA_NODES.shape` added
- [ ] `figma-live.json` refreshed and `$note` appended
- [ ] Website: **new route created**, added to foundations nav + `llms.txt` + changelog, data module
      generated from tokens, DS audit inline, reusables in `docs-kit`
- [ ] All 13 coverage-contract items addressed, and stated where
- [ ] `design.md` "Shape Tokens" section updated and `Last reviewed` bumped; `AGENTS.md` updated
- [ ] `accessibility-auditor` and `gov-compliance` run; output pasted; issues fixed
- [ ] `npm run lint` + `npm run typecheck` pass in `apps/hub`
- [ ] Verified in browser at 360 / 768 / 1280, both brands, and under `forced-colors: active`
- [ ] Six pressure-test passes run; findings, fixes and the eight scores written up
