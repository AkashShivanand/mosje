# Design-system follow-ups

Hand-maintained. Things the estate knows are wrong or missing, deliberately deferred
rather than forgotten, each parked against the change that will pick it up.

This is **not** a backlog of ideas. An entry earns its place by being a *recorded
divergence* — something already shipped is working around it, and a later reader who
does not know why will "fix" the workaround instead of the cause. Every entry names
the workaround so that reader finds this file first.

Sibling documents: `parity-ledger.md` (generated — what is designed vs built),
`packages/design-system/design.md` (the component contracts themselves).

---

## Open

### Button has no `inverse` axis in Figma

**Deferred to:** the next Button component rework. Agreed 2026-08-25.

**Corroborated independently.** The Button audit that landed in PR #188 reached the
same finding from the other direction — see `components/button.md`, gap **7**
("`inverse` / `inverseOutlined` absent from Figma entirely") and its note that the
Tier-3 `inverse` branch has to be bound first. That document is now the authority on
what Button needs; this entry exists to record what is *working around* the gap
today, so whoever closes it there knows to come back here.

**What is wrong.** `packages/design-system/components/actions/button.css` ships six
appearances — `filled · outlined · text · tonal · inverse · inverseOutlined`. The Figma
`Button` component set (`609:283111`, Buttons page) carries only four:
`Sub-type = Filled | Outlined | Text | Tonal`. The two inverse appearances exist in
code and are used, but cannot be drawn.

**The tokens are already there.** This is a component gap, not a token gap:

| appearance | Figma tokens that already resolve it |
|---|---|
| `inverse` | `cmp/action/brand/primary/inverse/{default,hover,active,disabled}/{bg,text,border}` |
| `inverseOutlined` | `cmp/action/brand/secondary/inverse/{default,hover,active,disabled}/{bg,text,border}` |

`cmp/action/brand/secondary/inverse/default/*` resolves to transparent fill · white
text · `#ffffff` at 40% border — exactly what `.ds-btn--inverseOutlined` paints.

**What is working around it right now.** `Ticker / Action` in the SAMAVESH library is a
**local part** bound to the `secondary/inverse` tokens, not a `Button` instance. That
breaks the estate's usual rule that nested parts are library instances, and it is
deliberate: a `Sub-type=Outlined` Button on the Ticker's brand-blue bar draws its border
in a blue nobody can see. The divergence is recorded in the Ticker component's Figma
description and in `design.md`.

**What closing it looks like.**
1. Add an `inverse` axis to the Figma `Button` set. Prefer a **separate boolean or
   Tone property over multiplying `Sub-type`** — Button is already
   Size × Type × Sub-type × State × Icon, and a fifth full axis is a variant explosion.
2. Bind it to the `cmp/action/*/inverse/*` tokens above; do not mint new ones.
3. Replace `Ticker / Action` with a real Button instance, and delete the local part.
4. Drop the "Known gap" paragraph from the Ticker description and from `design.md`.
5. Check the other surfaces that sit on solid brand fills for the same workaround
   before assuming Ticker is the only one — portal mastheads and `SiteHeader` are the
   likely places.

**Where it is referenced:** `packages/design-system/design.md` (Ticker § Known gap),
the SAMAVESH `Ticker` component description, `components/button.md` gap 7, PR #187.
