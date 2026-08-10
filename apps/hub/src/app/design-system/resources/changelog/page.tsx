import * as React from "react";
import type { Metadata } from "next";
import { Callout } from "@/components/design-system/docs-kit/index";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Every release of the SAMAVESH design system — what was added, changed, and fixed in each version.",
};

interface ChangeEntry {
  kind: "Added" | "Changed" | "Fixed" | "Removed";
  text: string;
}

interface Release {
  version: string;
  date: string;
  current?: boolean;
  changes: ChangeEntry[];
}

const RELEASES: Release[] = [
  {
    version: "v0.11.8",
    date: "2026-08-11",
    current: true,
    changes: [
      { kind: "Changed", text: "DemoDock's Colour tab: the plain swatch row plus live Button/Badge/Alert preview block is replaced by a wrapping grid of fixed-size (~72×48px) motif tiles — a miniature header bar, content surface, accent mark and button shape per mode. Each tile renders in that mode's own palette via a nested data-brand island on the tile itself, so a Navy tile looks navy even while the app is in Gov Blue, with no hardcoded hex" },
      { kind: "Removed", text: "The live Button/Badge/Alert preview block under the Colour tab's swatch list is gone. The motif tiles are the preview now, and — being fixed-size regardless of mode count — give the tab a height that no longer grows with a live component block or a longer mode list" },
      { kind: "Changed", text: "Selected state keeps the tick plus a visible ring (still not colour alone — WCAG 1.4.1); touch targets remain ≥44px (AAA, WCAG 2.5.5)" },
    ],
  },
  {
    version: "v0.11.7",
    date: "2026-08-10",
    changes: [
      { kind: "Changed", text: "DemoDock redesign: real visual hierarchy in the header (a badge mark, a tonal wash separating it from the body), a token-driven open/close animation and a swatch-selection animation, both collapsing to instant under prefers-reduced-motion. The footer disclaimer row (\"Demo tooling — not part of the product\") is gone — the dock is unambiguous demo chrome by context, and the row was pure noise" },
      { kind: "Fixed", text: "Switching to the Colour tab used to collapse the panel dramatically, because that tab had almost no content and nothing gave the body a floor. The body now carries a min-height calibrated to the Apps tab's typical unscrolled footprint, so no tab switch visibly resizes the panel" },
      { kind: "Removed", text: "ColorModeSwitcher is gone from the design system entirely — deleted from foundations/, the public barrel, and Storybook. The Colour tab is now a plain row of brand-palette swatches reading useColorMode() directly: no \"Colour mode\" label, no pill-track background, just swatches that apply on click. An app that still wants a standalone brand-mode control builds one from useColorMode() the same way" },
      { kind: "Changed", text: "The Sign in tab now renders — and leads the tab order — only when the current path IS a login route (isLoginRoute: ends in /login, /login-otp or /sign-in), not merely somewhere under a portal that has one. Previously it appeared on every page under a portal's prefix, including dashboards with no login form to fill. Apps and Colour keep their relative order behind it" },
    ],
  },
  {
    version: "v0.11.6",
    date: "2026-08-10",
    changes: [
      { kind: "Added", text: "DemoDock — the estate's single floating demo console (Apps / Colour / Sign in tabs behind one FAB), replacing three widgets that used to compete for the bottom-left corner: the AppSwitcher FAB, its hand-rolled colour swatches, and DemoFab mounted separately on 8 login pages. Mounted exactly once, by the hub root layout via ConditionalDemoDock, and gated estate-wide by NEXT_PUBLIC_DEMO_TOOLS — absent or anything but the literal string \"false\" keeps it visible, so the deployed review site (the one place stakeholders actually need it) shows it by default" },
      { kind: "Removed", text: "AppSwitcher is gone — no longer exported. The colour-mode swatches it carried were a hand-rolled duplicate of ColorModeSwitcher; they're deleted outright rather than ported, and DemoDock's Colour tab renders the real ColorModeSwitcher instead. ColorModeSwitcher also came out of SMILE Admin's access bar for the same reason: one colour control, not two" },
      { kind: "Added", text: "AppSwitcherPanel and DemoAccountsPanel, extracted as the reusable content behind DemoDock's Apps and Sign in tabs. AppSwitcherPanel owns the search box and the grouped destination list with no position:fixed and no scroll box of its own — whatever mounts it owns the one scrollbar. DemoAccountsPanel is now the single credentials table shared by DemoDock and DemoFab, so the two can no longer drift apart the way the old per-page copies did" },
      { kind: "Changed", text: "Demo credentials moved out of 8 per-page consts into one pathname-keyed registry, DEMO_ACCOUNTS in packages/design-system/demo/demo-accounts.ts, resolved via findDemoAccounts (longest-prefix match). This is a direct consequence of the dock mounting once, above every page — a page can no longer hand its accounts down as a prop to something already mounted above it in the tree. Where a path matches nothing in the registry (the website, a dashboard), the Sign in tab is not rendered at all rather than shown empty. .claude/rules/portal-login-demos.md now points at the registry as the source of truth instead of being one" },
      { kind: "Added", text: "AppEntry.group gained \"Reports\", carrying the two QC report pages (SCW Design QC, E-Utthan Admin QC) into the Apps tab's search alongside Website / Portals / Resources" },
      { kind: "Fixed", text: "AppSwitcherPanel's CSS lived only in the old AppSwitcher shell's stylesheet. Once the panel could be mounted by something else, DemoDock's Apps tab would have rendered completely unstyled — caught before it shipped, and the styles now live in their own app-switcher-panel.css so they load wherever the panel is used" },
      { kind: "Fixed", text: "4 of the 8 login pages (NMBA admin, NMBA treatment-centre, PM-AJAY, SMILE Admin) drove DemoFab's onFill prop directly and had no demo:fill listener at all. DemoDock only ever dispatches that event — without a listener, pressing Use on those four pages would have silently done nothing. A listener was added to each" },
      { kind: "Fixed", text: "The NMBA treatment-centre login — a Project Id + OTP flow, not the admin mobile-number form — was matching the broader /portals/nmba prefix and would have inherited the admin accounts. Gave it its own /portals/nmba/treatment-centre registry entry so the longest-prefix match resolves it correctly" },
      { kind: "Fixed", text: "npm test -w @mosje/design-system had never run in CI — the Design System Quality workflow only ever executed the tokens package's tests, so a broken design-system unit test could merge unnoticed. Added it as a CI step, and widened the package's own tsconfig include, which had stopped at index.ts/tokens.ts/components/** and left demo/, foundations/ and utils/ silently untypechecked" },
    ],
  },
  {
    version: "v0.11.5",
    date: "2026-08-10",
    changes: [
      { kind: "Changed", text: "The appearance axis is gone. `data-theme` (light/dark/hc) no longer exists: Figma's Theme collection is single-mode and tokens.css emits no [data-theme] block at all. The UX4G accessibility widget is the estate's single canonical dark and high-contrast mechanism \u2014 it applies its own .dark-mode class to <html> and never read data-theme, so this was a second parallel mechanism nothing consumed. Removing it removes confusion, not capability" },
      { kind: "Fixed", text: "Verified a true no-op: three selector contexts disappeared and ZERO tokens changed value in any surviving context. [data-theme=light] went too, correctly \u2014 it existed only to re-assert base values when returning from dark, and :root already holds them" },
      { kind: "Removed", text: "Three switches that would now toggle nothing: the gate-chrome light/dark toggle, the design-system docs-header toggle and the playground theme control \u2014 plus both theme modules, the no-flash init script and the orphaned CSS. Storybook's theme picker is gone, and its brand labels are corrected from the pre-rename \u201cBlue \u00b7 Light\u201d / \u201cBlue \u00b7 Dark\u201d to \u201cBlue\u201d / \u201cNavy\u201d" },
      { kind: "Fixed", text: "Figma alpha values: 33 were stored as 8-bit n/255 steps (0.47843137 = 122/255) while their siblings used clean percentages \u2014 one role, two conventions. All normalised to two decimals; RGB untouched, largest shift 0.16 percentage points. The other 156 fractional-looking alphas are NOT a defect \u2014 that is float32 storage, and rewriting them would change nothing" },
      { kind: "Changed", text: "The obsolete contrast test was replaced rather than deleted: mode-contrast.test.mjs now asserts the axis STAYS removed, and says that if it is ever wanted back, the contrast sweep must return in the same change. Deleting it would have let a future re-add ship an untested accessibility mode" },
    ],
  },
  {
    version: "v0.11.4",
    date: "2026-08-10",
    changes: [
      { kind: "Fixed", text: "The Figma exporter had a silent catch-all: anything under font/ that it did not recognise was filed as font-family/{name}. That labelled 13 px-valued numbers as font-family/size-100, font-family/lineHeight-100 and so on \u2014 a font-family folder full of sizes. font/size/* and font/lineHeight/* now map to font-size/ and line-height/, and the fallback THROWS instead of guessing. A catch-all that renames what it does not recognise is worse than a crash, because it ships" },
      { kind: "Added", text: "Figma library: created the 61 variables the code emitted but the library never had \u2014 Spacing 15 to 49 (the inline/stack/padding/section semantic scale) and Typography 79 to 106 (font families, the raw size and line-height scale, and the type/* role aliases). Literals are created before the aliases that reference them, and every variable gets an explicit scope rather than ALL_SCOPES" },
      { kind: "Changed", text: "Figma library: 28 in-place renames so it matches the shipped grammar \u2014 27 in Theme (prominence /Default to /Base, Text/Link/Default to Text/Link/Brand) and easing-in-out to easing-inOut in Motion. Renamed, never recreated, so every variable id survived and any binding follows" },
      { kind: "Fixed", text: "Color 149 to 141: retired 8 leftovers the code does not emit and nothing uses. Text/Secondary was NOT retired \u2014 it is bound on 12 nodes, and the pre-delete check caught that after an earlier scan reported it unused. Figma's findAll(predicate) proved unreliable, returning 0 and 12 for the same query minutes apart, so every deletion now needs three independent traversals to agree" },
      { kind: "Changed", text: "The 24 remaining Color names beyond the payload are deliberate: they are Figma-native primitives designers bind to directly (Text/Dark alone has 1,143 bindings) and the exporter withholds them on purpose. Five type/*-weight variables stay absent from Figma because Figma models font weight as a STRING style name and the code as a numeric FLOAT \u2014 Figma rejects an alias across resolved types, so that is a modelling decision, not a gap to paper over" },
    ],
  },
  {
    version: "v0.11.3",
    date: "2026-08-10",
    changes: [
      { kind: "Added", text: "Storybook now documents all 69 exported components, up from 10. The 59 entries in apps/storybook/coverage-baseline.json are paid off and the backlog array is empty, so the coverage ratchet is at 100% — a new component without a story now fails the build outright rather than being absorbed as declared debt" },
      { kind: "Added", text: "Every story is written against real MoSJE content — scheme names, districts, beneficiary counts, the three-tier approval chain — and each file's doc comment leads with the distinction that decides whether the component is the right one, not a restatement of its props. Modal vs SideSheet is about keeping list context visible rather than size; Skeleton vs Loader is about whether the shape is known; SlaProgressIndicator is not a Progress bar because a paused clock must render neutral" },
      { kind: "Added", text: "check:storybook:parity — the coverage gate only asks whether a story EXISTS, which misses the two ways it goes stale afterwards. Parity fails when a prop is added that no story mentions, and when a story still references an export the barrel no longer has. A story documenting a renamed or deleted component is worse than a missing one: a reviewer reads it and believes it" },
      { kind: "Added", text: "check:storybook:smoke — mounts every story in Chromium and fails on a thrown error, a console error, or an empty canvas. A story that satisfies the counter but throws in the canvas is worse than no story, because the gate then reports green while the documentation is blank. It reuses the Playwright already installed for test:e2e rather than adding @storybook/test-runner, which would bring Jest and a second Playwright pin for one page visit per story" },
      { kind: "Added", text: "Both new checks run in the Design System Quality workflow, and both were watched failing before they were trusted — a prop added to Badge and mentioned nowhere, an EmptyState renamed in the barrel with its story left behind, and a story that throws. A check nobody has seen fail is indistinguishable from one that cannot" },
      { kind: "Fixed", text: "Writing the stories surfaced 23 props across 12 components that no story mentioned — Button's href and icon slots, Card's variant and orientation, Radio's card variant, Alert's action and timestamp, SiteHeader's skipTo and accessibility-statement props among them. All are now documented; the parity gate is what found them and is what stops them recurring" },
      { kind: "Fixed", text: "Storybook's preview now loads icons.css. An app imports it once in its root layout, so without it every <Icon> in a story rendered its name as literal text — the component looking broken when only the harness was" },
    ],
  },
  {
    version: "v0.11.2",
    date: "2026-08-10",
    changes: [
      { kind: "Fixed", text: "Figma library: four variable names existed in both the Color and Theme collections, left over from an earlier hand-migration. All 504 live bindings were rebound onto the Theme copies and the Color leftovers removed. Focus/Ring stays in both deliberately \u2014 it is a brand-source companion that the appearance layer consumes" },
      { kind: "Fixed", text: "Two of those leftovers were mislabelled: Color's Background/Brand/Primary/Subtle held ramp step 50, which the prominence ladder calls `base`, not `subtle`, and Strong held Source rather than 600. The Theme copies already carried the correct ladder values, so retiring the leftovers brings 90 elements on the Accessibility Bar onto the values the code has always emitted. Figma and dist/tokens.css now agree token-for-token" },
      { kind: "Fixed", text: "That correction improves contrast rather than costing it: white text on the brand bar goes from 4.64:1 to 6.30:1 in Blue and 12.61:1 to 14.22:1 in Navy, both comfortably past WCAG 2.1 AA" },
      { kind: "Fixed", text: "The figma-live.json snapshot recorded the Theme collection as empty while the live library held 374 variables, so every Theme variable was reported as `new` in the import delta. Refreshed against the live library: the delta is now 27 new / 347 existing" },
    ],
  },
  {
    version: "v0.11.1",
    date: "2026-08-10",
    changes: [
      { kind: "Changed", text: "`default` now means exactly one thing. It had been sitting in three slot dictionaries at once \u2014 prominence, state and the link variant \u2014 so the token parser bound it greedily to the first one and never reached the others: text/link/visited/default parsed as a PROMINENCE and silently threw away the state it was spelling. The prominence canonical is now `base` (--sa-bg-neutral-base, --sa-text-status-error-base) and the link variant is now `brand` (--sa-text-link-brand-default). `default` stays the canonical state" },
      { kind: "Changed", text: "Nothing renders differently. This was a rename, not a redesign: all 27 moved token names resolve to byte-identical values in all 7 selector contexts (:root, light/dark/hc, brand, density, portal surface). The --ds-* names your code actually uses did not change at all \u2014 they were retargeted at the new canonical names" },
      { kind: "Added", text: "A visual-contract test that resolves every var() chain in the generated CSS down to a literal, per selector block, and pins all 8,393 of them. A rename must be declared, and the test then proves the old name's old value equals the new name's new value \u2014 so a rename that changes what renders cannot pass quietly" },
      { kind: "Fixed", text: "The Tailwind v4 @theme export (@mosje/tokens/tailwind-v4) aliased 111 custom properties that do not exist. It hand-rolled its target names as --sa-{path}, which drops the tier marker, so every Tier-1 entry pointed at --sa-color-* while the sheet declares --sa-ref-color-* \u2014 every colour utility built on them resolved to nothing. Names now come from toCssName/tierOfFile like everywhere else. No utility name changed; nothing in the estate imports this file yet, which is why it went unnoticed since v0.11.0" },
      { kind: "Added", text: "A UX4G parity contract that pins the combined tokens.css + ux4g.css sheet. ux4g.css emits --sa-* overrides inside its colour-mode blocks from a hand-typed name table \u2014 that is how the UX4G palette repaints SAMAVESH tokens \u2014 and nothing pinned them, so a rename that forgot that table would have left the UX4G colour modes silently failing to repaint --ds-surface while every other test stayed green" },
      { kind: "Added", text: "A theming-axis invariant: a page setting data-brand and data-theme together must resolve to a value one of those axes actually declares. 41 properties are declared by both axes, so neither single-axis test can say who wins. It holds today, so combinations are asserted rather than pinned" },
      { kind: "Added", text: "A slot-disjointness guard that fails the build if any word becomes reachable in two slots of the same token path. Two pre-existing ambiguities are pinned rather than fixed (primary/secondary/tertiary as both a brand variant and an ink prominence; visited as both a link variant and a state) \u2014 both are recorded in the spec and cost a token rename to resolve" },
    ],
  },
  {
    version: "v0.11.0",
    date: "2026-08-07",
    changes: [
      { kind: "Changed", text: "Brand axis renamed: data-color-mode \u2192 data-brand, and blue-light/blue-dark \u2192 blue/navy (ux4g-light/ux4g-dark \u2192 ux4g/ux4gdeep). The old ids read as light and dark THEMES \u2014 they never were: both brands render on light surfaces and differ only in palette. data-color-mode still matches as a deprecated alias selector and old ids are normalised on read, so existing markup and persisted cookies keep working" },
      { kind: "Fixed", text: "Skeleton shimmer darkened itself under the navy brand on a LIGHT surface, because a [data-color-mode$=\"-dark\"] suffix selector caught a brand id. It now keys off data-theme alone \u2014 a bug the old naming directly caused" },
      { kind: "Added", text: "Tier markers in every token name: --sa-ref-* (reference, banned in app code), --sa-* (system), --sa-cmp-* (component). Tier derives from the source file and is enforced by tests, not convention" },
      { kind: "Added", text: "Canonical Tier-2 namespace on the new grammar \u2014 111 tokens including 9 icon roles and a 6-token link set with visited, neither of which existed before. Values are identical to the legacy layer, proven in every theme and brand block" },
      { kind: "Added", text: "Generated Action matrix (288 component tokens) replacing filter: brightness() for hover and active. Naming each state made them testable, which found two live WCAG AA failures on the danger ramp" },
      { kind: "Added", text: "Figma exporter emits 898 variables across 5 collections with modes, types and 1,456 preserved alias edges, replacing the flat value dump; a round-trip test now fails the build if code and Figma drift" },
    ],
  },
  {
    version: "v0.10.0",
    date: "2026-08-07",
    changes: [
      { kind: "Added", text: "Tooltip — hover/focus hint that meets WCAG 1.4.13 (Escape dismisses, the bubble is hoverable, it never times out). Portalled, so a Card or DataTable's overflow can't clip it" },
      { kind: "Added", text: "Skeleton, SkeletonText and SkeletonRow — the loading placeholders design.md already required but the system didn't ship" },
      { kind: "Added", text: "Label — standalone form label for controls that aren't wrapped in FormField" },
      { kind: "Added", text: "LiveRegion + useLiveRegion — announces async results (\"12 records exported\") to screen readers; re-announces a repeated message instead of going silent" },
      { kind: "Added", text: "SectionTitle — the shared eyebrow/heading/count/actions row, so section headers stop being hand-rolled per page" },
      { kind: "Added", text: "Input gains leftIcon and rightIcon; a bare Input still renders with no wrapper, so existing layouts are untouched" },
      { kind: "Changed", text: "The estate is off lucide-react entirely — every icon is now Material Symbols Rounded through <Icon>, as CLAUDE.md and design.md always specified. 668 icons across 239 files; the dependency is gone" },
      { kind: "Changed", text: "SidebarNavItem.icon is a Material Symbols name, not a component — nav configs stay serialisable data" },
      { kind: "Changed", text: "shadcn and Radix are fully removed: 13 Radix packages plus class-variance-authority dropped, and smile-admin's 18-component island retired onto the design system" },
      { kind: "Fixed", text: "CardTitle rendered at 32px — it referenced the Headline 1 alias while its own fallback said 20px. Now bound to the canonical Title 1 role" },
      { kind: "Fixed", text: "Icon accepts a style prop, merged after its own font-size and variation axes" },
      { kind: "Fixed", text: "The AppSwitcher's design system and Storybook entries moved from the dev-only \"Dev\" group to \"Resources\" and are now visible everywhere — gating them on NODE_ENV hid them from the BAs, QAs and designers who most need them. AppSwitcher's devMode prop is deprecated and inert" },
      { kind: "Fixed", text: "/storybook no longer dead-ends on a bare DNS_HOSTNAME_RESOLVED_PRIVATE 404 in production. Storybook is not part of the deployment, so unless ZONE_DS_URL points somewhere public the route now serves the \"app not running\" page instead of proxying to loopback" },
    ],
  },
  {
    version: "v0.9.0",
    date: "2026-08-06",
    changes: [
      { kind: "Added", text: "SLA Progress Indicator — Right to Service Act deadline tracking" },
      { kind: "Added", text: "Identity inputs — Aadhaar, OTP and PAN, with per-format masking and validation" },
      { kind: "Added", text: "ApprovalTimeline, DeclarationCheckbox and GeoPhotoInput" },
      { kind: "Added", text: "PasswordInput — password field with a reveal toggle; use it for every password field rather than an Input plus a hand-rolled eye, which is how the submit-on-toggle bug and the missing accessible name get reintroduced" },
      { kind: "Changed", text: "Buttons now give on press (scale 0.97, reduced-motion aware) — colour alone told you the button noticed, not that it was listening" },
      { kind: "Added", text: "UX4G 3.0 parity layer — semantic spacing roles, display font family, shadow ramp" },
      { kind: "Changed", text: "Status colours moved to the 700 ramp step: success, warning and danger text on their tonal chips now meet WCAG AA (all four pairs previously shipped between 2.6:1 and 3.8:1)" },
      { kind: "Changed", text: "The brand contrast gate now covers status-on-tonal pairings, so this class of regression fails the build" },
      { kind: "Changed", text: "Type sizes are expressed in rem so they honour the browser's font-size setting" },
      { kind: "Fixed", text: "Contrast swept across every colour mode and theme, not just the default" },
    ],
  },
  {
    version: "v0.8.0",
    date: "2026-07-16",
    changes: [
      { kind: "Added", text: "NHAPOA (SAMBAL) portal built on the shared system — all 8 roles" },
      { kind: "Changed", text: "Token-lint gate made real: recursive glob, and 48 raw hex values tokenised" },
      { kind: "Fixed", text: "--ds-* aliases re-resolved inside [data-color-mode] blocks" },
    ],
  },
  {
    version: "v0.7.0",
    date: "2026-06-25",
    changes: [
      { kind: "Added", text: "White-label brand packs, gated by an automated WCAG contrast test" },
      { kind: "Added", text: "Data-visualisation layer — categorical, sequential and diverging chart tokens" },
      { kind: "Added", text: "Lightbox, MediaGalleryInput, FormCard and Tabs" },
      { kind: "Added", text: "Page patterns documentation" },
      { kind: "Changed", text: "Upgraded to Tailwind v4 with Turbopack" },
    ],
  },
  {
    version: "v0.6.0",
    date: "2026-06-13",
    changes: [
      { kind: "Added", text: "Portal component variants — Badge v2, Chip dropdown, Radio Card, Search sm" },
      { kind: "Added", text: "Info palette, corrected neutrals, responsive type scale" },
      { kind: "Changed", text: "Portal DS merged into SAMAVESH tokens; t-shirt size scale adopted" },
      { kind: "Changed", text: "design-system package reorganised by functional category" },
      { kind: "Fixed", text: "Portal-wide spacing — the --ds-space-* tokens were never defined" },
    ],
  },
  {
    version: "v0.5.0",
    date: "2026-06-12",
    changes: [
      { kind: "Added", text: "AppSwitcher with searchable panel, color-mode swatches, dev-mode toggle" },
      { kind: "Added", text: "FormField, Input, Textarea, Select with full accessibility wiring" },
      { kind: "Added", text: "Badge, Chip, Card, Button, Alert, EmptyState, Avatar, Loader" },
      { kind: "Added", text: "SAMAVESH documentation portal (this site)" },
      { kind: "Added", text: "Interactive Playground with react-live and prop controls" },
      { kind: "Changed", text: "tokens.css is now generated by @mosje/tokens Style Dictionary — never hand-edit" },
      { kind: "Fixed", text: "CSS comment syntax breaking token vars" },
    ],
  },
  {
    version: "v0.4.0",
    date: "2026-06-10",
    changes: [
      { kind: "Added", text: "ZoneSwitcher / AppSwitcher cross-zone navigation component" },
      { kind: "Added", text: "Multi-zone hub routing (dosje, smile-admin, pm-ajay, eutthan-admin)" },
    ],
  },
  {
    version: "v0.3.0",
    date: "2026-06-08",
    changes: [
      { kind: "Added", text: "Form atoms (Input, Textarea, Select, FormField, Checkbox, Radio, Toggle)" },
      { kind: "Added", text: "ColorModeProvider + ColorModeSwitcher for brand-axis theming" },
      { kind: "Added", text: "Storybook 8 + a11y addon + theme/density toolbar" },
    ],
  },
  {
    version: "v0.2.0",
    date: "2026-06-07",
    changes: [
      { kind: "Added", text: "@mosje/tokens DTCG token pipeline with Style Dictionary v4" },
      { kind: "Added", text: "3-tier token model (Primitive / Semantic / Component)" },
      { kind: "Added", text: "Light/dark/high-contrast themes + comfortable/compact density" },
      { kind: "Added", text: "--ds-* backward-compatible CSS var contract with 50-token snapshot test" },
    ],
  },
  {
    version: "v0.1.0",
    date: "2026-06-06",
    changes: [
      { kind: "Added", text: "Initial design system package with Button, Card, Badge, Chip, Avatar" },
      { kind: "Added", text: "Brand tokens (gov-blue, saffron, navy, gov-yellow) in tokens.css" },
    ],
  },
];

const KIND_COLOR: Record<ChangeEntry["kind"], string> = {
  Added: "var(--ds-success)",
  Changed: "var(--ds-info)",
  Fixed: "var(--ds-saffron)",
  // Taking something away is worth its own badge: a reader scanning for "why did that control
  // disappear" should not have to read a paragraph filed under "Changed" to find out.
  Removed: "var(--ds-danger)",
};

export default function ChangelogPage(): React.JSX.Element {
  return (
    <>
      {/* ── Page header ───────────────────────────────────────── */}
      <header className="docs-page-header">
        <div className="docs-page-header__text">
          <h1 className="docs-page-header__title">Changelog</h1>
          <p className="docs-page-header__desc">
            A complete, dated history of the SAMAVESH design system. Each entry is
            tagged <strong>Added</strong>, <strong>Changed</strong>, or{" "}
            <strong>Fixed</strong> so you can see at a glance what a release means
            for your work. Versions follow{" "}
            <a href="/design-system/resources/governance#semver">semantic versioning</a>.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <Callout type="info" title="How to read this">
          While we are pre-1.0, minor versions (the middle number) may include
          breaking changes. Watch the <strong>Changed</strong> entries — those are
          the ones most likely to need action when you upgrade.
        </Callout>

        <div
          style={{
            marginTop: "var(--ds-spacing-2xl)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--ds-spacing-3xl)",
          }}
        >
          {RELEASES.map((release) => (
            <article
              key={release.version}
              id={release.version.replace(/\./g, "-")}
              style={{ scrollMarginTop: "calc(56px + var(--ds-spacing-2xl))" }}
            >
              {/* Release heading */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "var(--ds-spacing-md)",
                  flexWrap: "wrap",
                  paddingBottom: "var(--ds-spacing-md)",
                  borderBottom: "1px solid var(--ds-border)",
                  marginBottom: "var(--ds-spacing-lg)",
                }}
              >
                <h2
                  style={{
                    fontSize: "var(--ds-text-title-1)",
                    fontWeight: 700,
                    color: "var(--ds-ink)",
                  }}
                >
                  {release.version}
                </h2>
                <span
                  style={{
                    fontSize: "var(--ds-text-body-2)",
                    color: "var(--ds-ink-muted)",
                  }}
                >
                  {release.date}
                </span>
                {release.current ? (
                  <span
                    style={{
                      fontSize: "var(--ds-text-body-3)",
                      fontWeight: 600,
                      color: "#fff",
                      background: "var(--ds-primary)",
                      padding: "2px var(--ds-spacing-sm)",
                      borderRadius: "var(--ds-radius-sm)",
                    }}
                  >
                    Current
                  </span>
                ) : null}
              </div>

              {/* Change list */}
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--ds-spacing-md)",
                }}
              >
                {release.changes.map((change, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: "var(--ds-spacing-md)",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        minWidth: 64,
                        textAlign: "center",
                        fontSize: "var(--ds-text-body-3)",
                        fontWeight: 700,
                        color: "#fff",
                        background: KIND_COLOR[change.kind],
                        padding: "2px var(--ds-spacing-sm)",
                        borderRadius: "var(--ds-radius-sm)",
                      }}
                    >
                      {change.kind}
                    </span>
                    <span
                      style={{
                        fontSize: "var(--ds-text-body-2)",
                        color: "var(--ds-ink)",
                        lineHeight: "var(--ds-leading-body-2)",
                      }}
                    >
                      {change.text}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
