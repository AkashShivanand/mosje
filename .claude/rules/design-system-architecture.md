# SAMAVESH Design System Architecture (For AI Agents & Developers)

> **Context:** This rule file governs how UI components are built and maintained across the `@mosje/design-system` package and downstream applications. It merges the best principles of Atomic Design (composability, reusability, separation of concerns) with the SAMAVESH functional token-driven architecture.

## 1. Core Principles (The "Atomic-Functional" Hybrid)
We do not use strict Atomic nomenclature (Atoms, Molecules, Organisms) in our folder structure because functional grouping (`actions`, `forms`, `data-display`) scales better for large enterprise systems. However, we *strictly* follow Atomic principles in how components are constructed:

- **Single Responsibility (Atoms):** Primitive components like `Button`, `Input`, and `Badge` must be extremely dumb. They accept props, read tokens, and emit events. They do not fetch data.
- **Slot-based Composability (Molecules/Organisms):** Never build "God Components" with dozens of configuration props (e.g., `<Card title="..." subtitle="..." footer="..." />`). Use a slot-based architecture using React children.
  - *Correct:* `<Card><CardHeader><CardTitle>...</CardTitle></CardHeader><CardContent>...</CardContent></Card>`
- **Headless UI Foundation:** Complex interactive components (`Select`, `Modal`, `Tabs`, `Combobox`) must separate accessibility logic from visual styling. Use robust headless primitives (like Radix UI) where possible, skinning them with SAMAVESH tokens. Do not hand-roll complex focus traps or ARIA state machines.

## 2. Token Strictness (The White-label Mandate)
SAMAVESH is a white-label government design system. A component must work flawlessly whether the portal uses the `blue`, `navy`, or custom `dbim-*` brand pack.
- **NEVER use raw hex codes, `rgb()`, or arbitrary colors** in CSS, Tailwind classes, or React styles.
- **ALWAYS use semantic tokens.** The estate's contract is `--sa-*` (Tier 2); `--ds-*` is the
  older alias still emitted for compatibility. **Never** reach for a Tier-1 `--sa-ref-*`
  primitive from component code — `npm test -w @mosje/tokens` fails the build if you do.
- Stylelint (`npm run lint:css`) actively enforces this and will block commits with hardcoded colors.
- Spacing uses `--sa-padding-*` / `--sa-stack-*` / `--sa-inline-*`, radius `--sa-shape-*`,
  and type `--sa-type-*-size`. Font weight is `--sa-font-weight-{light,regular,medium,semibold,bold,displayMedium}`
  (Tier 2 since 2026-08-26; this line said "no token" until 2026-09-05 while 530 declarations typed the number).
- **The one Tier-1 name an app may write:** `apps/hub/src/app/globals.css` re-declares the three
  `--sa-ref-font-family-*` stacks so the webfont variable `next/font` injects leads the stack. It is a
  declaration, not a consumption, only the app knows what it loads, and the comment beside it says
  so. Nothing else in `apps/**` or `components/**` may name a `--sa-ref-*`.

## 2a. Cascade layers (why a utility can override a component)

Every stylesheet under `packages/design-system/components/` opens with:

```css
@layer theme, base, components, utilities;   /* declare the ORDER first */
@layer components { /* …the component's rules… */ }
```

Both lines matter, and the order statement is the one that is easy to forget.

Each component CSS file is imported from its own `.tsx`, so the bundler treats it as a separate
CSS root. A cascade layer's position is fixed by where its **name first appears** anywhere in
the document — so if a component file loads before the app's `globals.css`, it registers
`components` first and Tailwind's `base` and `utilities` land *after* it. Preflight's
`* { padding: 0 }` then outranks every component rule in the estate. Repeating the order
statement in each file is harmless (first one wins) and makes each file correct on its own.

**What this buys you:** `<SidebarNav className="hidden md:flex" />` works. Before layering, DS
CSS was unlayered — and unlayered styles beat *all* layered ones — so seven portal shells asked
for a rail that collapses on mobile and every one was silently ignored.

**What it costs you:** a component's own CSS no longer wins by default. If a consumer's utility
is fighting your component, that is now working as intended — fix the consumer, or make the
rule more specific *inside* the layer. Never move a rule out of the layer to win an argument.

## 2b. Router links: a component that takes `linkAs` must be GIVEN it

**`linkAs` is how a framework-agnostic component gets the app's router link.** The
design system has no Next dependency and is not gaining one, so `SiteHeader`,
`NavSheet`, `BrandLockup`, `PortalCard`, `SamaveshBanner`, `SiteFooter`,
`ContentNav`, `Breadcrumb`, `Ticker` and the five Navbar parts each take a
`linkAs` prop and default to a plain `<a>`.

**Pass it. `import Link from "next/link"` and `linkAs={Link}`.**

Forgetting it does not break the page, and that is the entire problem: the
component falls back to `<a href>`, so every click is a full document load — the
bundle re-fetched, the tree re-hydrated, the scroll position lost, no prefetch.
Measured on the website home page before this was fixed, one masthead menu click
re-fetched **30 script files** and took **1.9s** to `loadEventEnd`, on localhost
with a warm cache.

It was missed on **22 call sites** for months because nothing checked, and then
it came back on `eutthan-shell.tsx` within a day of being fixed — a parallel
branch correctly dropped the prop because it did not exist on `main` yet, and
nothing pulled it back once it landed.

**`npm run check:link-as` is the gate.** The component list is DERIVED from the
design-system source, so a component that gains `linkAs` tomorrow is covered the
same day with nothing to remember. Documentation specimens and Storybook stories
are out of scope with their reasons stated — both render components to be looked
at, not navigated, and Storybook has no router at all. A call site that genuinely
must not route declares it on the tag:

```tsx
{/* linkAs-exempt(specimen): nav hrefs are "#"; this is drawn, not navigated */}
```

Categories are `specimen`, `external-only` and `no-router`; an unrecognised one
fails, as does an exclusion path that has stopped matching anything.

**Four hrefs never route, whatever is passed** — `navLinkTag` decides this once so
no call site has to: a disabled row (a `<span role="link">`), an external
destination, anything carrying a scheme or a protocol-relative host, and any `"#"`
fragment. The last is load-bearing: a nav entry that owns a menu carries
`href="#"` and cancels its own click.

## 3. Visual Regression & Quality Assurance
- **Playwright VRT:** Components and internal pages are verified using Playwright. When altering a core component, ensure you run the visual suite (`npm run test:e2e`) to catch unintended drifts across the estate.
- **Figma Code Connect:** We use `@figma/code-connect`. When building a new component that has a Figma counterpart, you MUST create a `.figma.ts` file in the component's directory to map the React props to the Figma component properties. This ensures the "Source of Truth" between Figma and Code remains unbroken.

## 4. Agent Instructions
When an AI agent (Claude, Antigravity, or other) is tasked with creating or modifying UI:
1. Check `INFORMATION-ARCHITECTURE.md` §6 to find the correct functional group for the
   component. That group is BOTH its folder under `packages/design-system/components/` and its
   docs route under `apps/hub/src/app/design-system/components/`. One component, one home —
   `npm run check:docs-routes` fails if a second page appears for the same component.
2. Read the `tokens.css` or run token commands to find the precise semantic token needed.
3. Use composition (sub-components) rather than bloated prop interfaces.
4. Ensure the component passes `npm run lint:css`.
5. Ensure `Code Connect` mappings are updated if applicable.
