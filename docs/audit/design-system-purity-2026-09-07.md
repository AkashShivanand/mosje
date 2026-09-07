# Design-system purity audit — 7 September 2026

Two questions, asked of both halves of the system:

1. Does anything on these surfaces use a **token or component from outside the
   design system**, brand logos excepted?
2. Are **Figma and code in sync**?

Scope: the auth family in code (`packages/design-system/components/auth`,
`apps/hub/src/app/portals/e-anudaan`) and the Figma **Portal Login Template**
page — sections 1 Template, 2 Organisms, 3 Parts, 4 Portal Hero. The token
checks were then widened estate-wide, because a token imported from outside
would not confine itself to one family.

---

## 1. Nothing comes from outside the system

### Figma — 453 nodes scanned

| Check | Result |
|---|---|
| Components whose master lives in another library | **0** |
| Visible fills with no bound variable and no style | **0** |
| Visible strokes with no bound variable and no style | **0** |
| Text with no text style | **0** |
| Exempt: brand artwork (SAMAVESH seal, National Emblem) | 38 fills, 166 text nodes |

The 204 exempt nodes are the vector artwork of the two marks — single letters at
5.7px spelling the SAMAVESH strapline, and the Emblem's paths. Artwork is not
bound to variables in any design system, and it is the exemption this audit was
asked to make.

**Two false positives, recorded because the method mattered.** A first pass
reported `Forgot password` and `Forgot PIN` as unbound white fills. Both are
`visible: false` — a disabled fill inherited from the `Link` master, rendering
nothing. The audit counted `fills.some(f => f.type === "SOLID")` without
checking `visible`. Corrected, and the corrected count is the table above.

### Code

| Check | Result |
|---|---|
| External UI libraries (`@radix-ui`, `lucide-react`, `@headlessui`, `@heroicons`, `react-icons`, `antd`, `@mui`) | **0 imports anywhere** in `apps/hub/src` or `packages/design-system/components` |
| Raw colour literals (`#hex`, `rgb()`, `hsl()`) in the auth family | **0** |
| Icons not drawn by the DS `<Icon>` | **0** |
| Tier-1 `--sa-ref-*` reached from app or component code | **0** — every hit is documentation prose *saying it is banned* |

The one raw hex in DS component CSS estate-wide is
`card-skeleton.css:129` — `mask: radial-gradient(…, #000000 56%)`, where the
colour is not a colour: in a mask, `#000000` means "keep this pixel". Its own
comment says so.

### Seven locally-named custom properties — reported, not changed

`--cmp-appsw-sticky-offset`, `--cmp-card-span`, `--metric-card-value-line`,
`--ranked-ink`, `--sla-fill`, `--sla-ink`, `--sla-soft` use neither the `--sa-*`
nor the `--ds-*` prefix. 50 references across 8 files.

**Every one is assigned a `--sa-*` token** — they are local aliases that switch
which token applies per modifier class, which is a good pattern:

```css
.ds-ranked__row--warning { --ranked-ink: var(--sa-text-status-warning-base); }
```

So no value enters from outside the system; the drift is in the naming, which
keeps them out of the tooling's view. Renaming 50 references across five
components nobody is otherwise editing buys nothing behavioural, so it is
written down here instead.

---

## 2. Figma and code are in sync

| Gate | Result |
|---|---|
| `check:figma-docs:live` | ✔ 67 claims · 173 assertions match the live file |
| `check:figma-index:live` | ✔ 86 pages · 85 cards, page for page |
| `check:figma-arrangements:live` | ✔ every component page draws its arrangements |
| `check:code-connect` | ✔ 68 templates, props/enums/Figma properties line up |
| `check:ds-linkage` · `type` · `space` · `radius` | ✔ all four |
| `check:token-consumers` | ✔ 428 of 1061 Tier-2 tokens unconsumed, at baseline |
| `check:icon-scale` | ✔ no new off-scale sizing |

### The one divergence that remains, and it needs a designer

`Auth / AuthFormCard` has six regions and none is a consent line;
`Auth / RecoveryFormCard` has one. Following the instruction of 7 Sep 2026 the
consent line is now off in code on every auth surface, which means **code and
the AuthFormCard master agree**, and it is `RecoveryFormCard` that is out of
step — it still draws a line no screen renders.

Either that master drops the region or it is excused in writing. Adding or
removing a region changes every instance, which is a design decision.

---

## What this audit changed

Nothing about tokens — there was nothing to change. It did fix two accessibility
defects found while verifying, both recorded in `packages/design-system/components/navigation/tabs.tsx`:

- an **unselected** tab pointed `aria-controls` at a panel that does not exist,
  because every consumer of `Tabs` renders one `TabPanel` at a time. Estate-wide;
  axe does not flag it.
- a **tablist with no panels at all** — 23 specimens on the Tabs documentation
  page — did the same on its selected tab. That one axe *does* flag, and it was
  live on that page. `panel={false}` declares it.

Measured after: 0 dangling references on the Tabs docs page (was 16), the
E-Anudaan login, the login-shell docs page and the NMBA admin login. The only
serious axe rule still reported on those routes is `tabindex`, and all 18 of its
nodes are inside MeitY's third-party accessibility widget, which the estate's own
axe spec excludes.
