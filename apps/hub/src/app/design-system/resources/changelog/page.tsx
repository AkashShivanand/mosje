import * as React from "react";
import type { Metadata } from "next";
import { Callout } from "@/components/design-system/docs-kit/index";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Every release of the SAMAVESH design system — what was added, changed, and fixed in each version.",
};

interface ChangeEntry {
  kind: "Added" | "Changed" | "Fixed";
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
    version: "v0.11.3",
    date: "2026-08-10",
    current: true,
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
