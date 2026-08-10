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
    version: "v0.12.3",
    date: "2026-08-10",
    current: true,
    changes: [
      { kind: "Added", text: "icon/size/* — five steps, md=24px being the default <Icon> already ships with. Every component needed an icon size and none had a token to bind, so each hardcoded its own and they drifted" },
      { kind: "Added", text: "focus/width and focus/offset. The focus ring's COLOUR was tokenised long ago and its geometry never was, which left WCAG 2.4.7's most-regulated affordance two-thirds hardcoded. All three parts are now tokens" },
      { kind: "Added", text: "container/* (5), including the 1280px content max-width that CLAUDE.md mandates estate-wide and that existed only as a literal in CSS — a rule no build could read is a rule that drifts" },
      { kind: "Added", text: "elevation/* — six semantic levels over the raw shadow ramp, so a card versus a dropdown versus a modal is chosen by WHAT THE SURFACE IS rather than by how deep the shadow looks. CSS only: Figma models shadows as effect styles, not variables, and a test now asserts that exclusion stays explained rather than becoming a silent gap" },
      { kind: "Added", text: "motion/{enter,exit,emphasis} — each pairing a duration with the easing that belongs to it. Entering decelerates and may take its time; leaving accelerates and gets out of the way. Binding a bare duration loses the pairing, which is the actual decision, so a test asserts each intent keeps both halves" },
      { kind: "Added", text: "control/radius and control/border/width. Density already moved a control's SIZE while its SHAPE stayed hardcoded per component — one radius is what keeps buttons, inputs and selects reading as a family" },
      { kind: "Fixed", text: "Figma routing is now TYPE-AWARE. focus, icon and control each own both a colour and a measurement — focus/ring is a colour, focus/width is a number — so routing by the path root alone put five FLOATs in the colour collection. Route the measurement by what it IS, not by whose namespace it sits in" },
    ],
  },
  {
    version: "v0.12.2",
    date: "2026-08-10",
    changes: [
      { kind: "Added", text: "Usage guidance on every semantic token — what it is FOR, alongside what it is WORTH. Descriptions carried a measured contrast ratio and at best a two-word label (“Hovered rows, quiet panels”), which is rigorous and nearly useless when choosing between two neighbouring tokens. UX4G's Figma library does the opposite (“Use when the tonal button's action is not available”): worse evidence, much better guidance. They were never alternatives, and both halves now ship. 417 variables had no description at all; 7 still do, and each of those is deliberate" },
      { kind: "Changed", text: "The vocabulary lives in ONE module derived from the token path, not 400 hand-written strings. Guidance written per-token drifts — the same rung ends up described three ways in three namespaces and nobody notices, because no two descriptions ever sit next to each other. One module means a whole rung can be reworded in a single edit, and a new token cannot ship with nothing to go on" },
      { kind: "Fixed", text: "The Tier-2 generator had been UNRUNNABLE. The ordinal-ladder rename updated its OUTPUT by hand and left five put() calls on retired rung names; the generator validates every path and exits before writing, so it failed silently every time. src/system.generated.json said “GENERATED — do not edit” while in fact being hand-maintained, and the only symptom was a message nobody ran. Both generators are now gated by a test that runs them and diffs the result against the committed file" },
      { kind: "Fixed", text: "Two prose bugs caught before they reached 800 variables — “the outline of a the primary brand colour control”, and borders described as “decorative fills” by wording that belongs to the fill ladder. Also fixed the contrast sentence for a boundary at the canonical rung, which read as if a divider were a fill" },
      { kind: "Changed", text: "The Figma push computed guidance in-plugin rather than shipping 108KB of text, then diffed itself against the build — which caught it dropping the measured-contrast half of every description, because the live text was still in the older “Guarantees ≥” format the reconstruction could not find. Those measurements were re-applied. A residual 1–4 characters per token of prose drift remains on ~330 variables; the build is authoritative and a faithful re-push is queued. The verification is the point: a copy that is diffed is a copy that cannot drift silently" },
    ],
  },
  {
    version: "v0.12.1",
    date: "2026-08-10",
    changes: [
      { kind: "Changed", text: "Type primitives are VALUE-NAMED, adopted from UX4G. --sa-ref-font-size-400 told you nothing; --sa-ref-font-size-16 cannot be misread. It is UX4G's convention and Tailwind's and Spectrum's, and it was the one naming decision where they were plainly better than us. Renamed in place in Figma, so every binding followed" },
      { kind: "Added", text: "size/* — a general numeric scale we simply did not have, carrying UX4G's 20 steps at their exact rem values plus 22 and 44 as a SAMAVESH superset our own type scale needs. Font sizes now ALIAS it, exactly as UX4G's fs-16 points at size-16, so a px value has one definition instead of one per namespace. That relationship is gated: a font step carrying its own literal fails the build" },
      { kind: "Added", text: "breakpoint/* — and this one matters less as a token than as a fix. 360, 768 and 1280 were restated as literals in TWO build files, so the estate had three copies of its own viewport anchors and no way to notice a drift. The fluid type curve and Figma's Type modes now both read the token, and a test fails if a literal comes back — a token that merely duplicates a constant is worse than none, because it is a second place to be wrong" },
      { kind: "Added", text: "blur/* (8) — UX4G's ramp and its four semantic names, verbatim. We had none" },
      { kind: "Changed", text: "NOT adopted: UX4G's 116 utility-value tokens. --ux4g-object-fit-cover: cover is a CSS keyword with a variable wrapped round it, not a design decision. Copying them would have moved our count past theirs while buying nothing a stylesheet does not already do — worth naming so the 925-vs-755 comparison is not misread as breadth" },
      { kind: "Fixed", text: "The raw type steps moved from px to rem as a side effect of aliasing the size scale. That is a UNIT change, not a rename, and is recorded as one rather than laundered through the rename ledger — which asserts old and new resolve identically, and 16px to 1rem does not. It is safe and an improvement: nothing renders from those tokens, and their one consumer is the UX4G parity layer, where --ux4g-line-height-16 IS 1rem in UX4G's own contract. All 755 conformance names still emit" },
    ],
  },
  {
    version: "v0.12.0",
    date: "2026-08-10",
    changes: [
      { kind: "Added", text: "The four scales the architecture promised and never built. border/width (5) and opacity (14) carry UX4G's exact values, bound by name so they cannot drift. The z ladder (8) is UX4G's verbatim — Bootstrap's numbers, which UX4G inherited and which third-party CSS in the estate already assumes, so diverging would put our modals under someone else's. layer/* (8) is Carbon's nestable-surface model, so a card inside a card inside a page resolves by depth instead of by eye. Until now all four were listed in the spec as advantages over UX4G while three of them were things UX4G had and we did not" },
      { kind: "Added", text: "on/* — 40 guaranteed foregrounds, one per fill that carries content, so nobody has to guess the label colour on a status chip. Every pairing was chosen BY MEASUREMENT: the ink that clears AA on that fill in the WORST brand, because a pairing is only as accessible as its least accessible brand. Three of the forty cannot reach AA — no ink rescues a surface that close to its own background — and they are the SAME three tokens as the prominence shortfall ledger, reached by an independent measurement. The test asserts that agreement, so if the two ledgers ever diverge the build fails" },
      { kind: "Added", text: "on-pair-contrast.test.mjs — spec §9.3, written together with the namespace it checks. A gate for a namespace nobody built is worse than no gate, because it reads as coverage" },
      { kind: "Removed", text: "The dead fixed 5-role type scale. It shadowed the fluid 21-role scale under a friendlier name (--sa-type-display-size beside --sa-type-display-1-size), aliased the raw size steps so it could never respond to surface or breakpoint, and had zero consumers anywhere — verified by exact-match grep including the generated sheet. In Figma it was RENAMED to deprecated/* rather than deleted: this is a published library and a binding in a consuming file cannot be ruled out from inside it. Type went 111 to 96" },
      { kind: "Changed", text: "Density is an axis again — 1 variable to 8. It now moves control padding, control gap, row height and row padding rather than a single control height, which is what a compact mode has to change for a data-dense portal table" },
      { kind: "Added", text: "A Static collection in Figma for the unitless scales. This is the one place spec §8.4's tier-per-collection design was actually buildable, and only because those tokens are new — Figma forbids MOVING a variable between collections, but nothing is bound to these yet, so creating them in the right home costs nothing" },
      { kind: "Fixed", text: "267 variables scoped, so a colour is no longer offered for corner radius and a duration no longer appears in the font-size picker. ref/z/* is hidden from publishing — it has no canvas property to bind to and was created in the same pass, so it is provably unbound. Blanket-hiding ref/* was deliberately NOT done: ref/color/ink/dark alone carries 1,143 bindings, and un-publishing a bound variable strands it in every file that uses it" },
      { kind: "Fixed", text: "A race that had been making the test suite non-deterministic. brand-contrast rebuilds dist/ under a different brand pack to prove a re-skin passes contrast, and node --test parallelises across files — so other tests were reading dist/tokens.css while it held the wrong brand's output. Two non-reproducing failures were traced to this. The suite now runs serially, and the reason is written where the rebuild happens" },
    ],
  },
  {
    version: "v0.11.11",
    date: "2026-08-10",
    changes: [
      { kind: "Fixed", text: "The entire component tier ignored the brand axis. All 296 --sa-cmp-* shipped as frozen hexes, so --sa-cmp-action-brand-primary-default-bg was #025fb8 under Blue and #025fb8 under Navy — the primary button never changed brand. The CSS format handed var() chains only to system.generated.json, and Tier 3 fell through to the resolved literal. The source was never at fault: Tier 3 is 196 references plus 92 deliberate literals (white-alpha inverse variants and transparent fills, which are correctly brand-invariant). 101 component tokens now repaint under Navy, up from zero" },
      { kind: "Fixed", text: "Re-assertion inside an axis block is now TRANSITIVE, and it had to be. An alias re-declared in a block becomes a changed source for anything pointing at it, so one pass only reaches depth 1. That was invisible while Tier 3 emitted literals; with the chains restored, cmp → bg/brand/primary/bolder → color/primaryScale/600 is three deep, and a single pass would have re-asserted the middle link while leaving the component token resolving against :root — brand-blind in exactly the way the fix exists to remove" },
      { kind: "Fixed", text: "Code and Figma had silently disagreed about this layer. Figma held the same tokens as ALIASES, where 85 of them did repaint under Navy, against zero in code — a divergence in the layer that describes buttons, which nothing detected because figma-roundtrip validates the payload against itself. 16 live variables were rebound onto the brand-bearing Palette; both sides now report 101 repainting and 195 brand-invariant, exactly" },
      { kind: "Fixed", text: "The gate that missed all of this. action-contrast.test.mjs resolved only :root — it checked the Blue brand and called that coverage. That was harmless while Navy rendered identically (which was itself the bug), but it would have left all 101 newly-live Navy values unverified. It now runs the full 48-combination matrix per brand; Navy passes AA" },
      { kind: "Added", text: "Two gates so this cannot return: no --sa-cmp-* whose SOURCE is a reference may be emitted as a literal (compared against the source, so the 92 legitimate literals are not flagged), and the component tier must measurably repaint between brands — a chain that bottoms out in something brand-invariant would pass the first check and fail the second" },
      { kind: "Changed", text: "Nothing that renders today changes. :root is byte-identical; every value that moved is inside [data-brand=navy], and the one component token anything currently consumes — --sa-cmp-badge-beta-bg, the gov-yellow accent — is correctly unchanged. The layer is now correct for whenever it is adopted" },
    ],
  },
  {
    version: "v0.11.10",
    date: "2026-08-10",
    changes: [
      { kind: "Fixed", text: "Every page in the estate was loading at 110% zoom with letter-spacing and line-height bumped, and three accessibility features showing as switched on that nobody had switched on. The cause was our own workaround for a null dereference in the UX4G v1.15 widget: it seeded the widget's settings key BEFORE the script ran, which pushed loadSettings() down its restore branch instead of the no-op path a fresh visitor should take — and that branch ends in updateWidgetToggles(), which calls the widget's own CLICK handlers, each of which advances a counter unconditionally. Seeding a neutral object was therefore indistinguishable from clicking three controls once per page load. The squeezed National Emblem in the header was the same bug, not a broken asset" },
      { kind: "Changed", text: "The UX4G accessibility widget is upgraded from accessibility-beta-v1.15 to accessibility-v3.28 — the build ux4g.gov.in itself serves. Both defects behind the above are fixed upstream: detectRouteChange() null-checks its read and settings moved to a cookie, so the seeding workaround is deleted rather than corrected. UX4G document the click-handler bug in v3.28's own source. New capabilities come with it: disability profiles, reading guides and masks, saturation controls, and a Ctrl+F2 shortcut" },
      { kind: "Changed", text: "The brand skin covers v3.x's palette. v1.15 exposed a single --color-dark-blue-1 hook; v3.28 hardcodes ~13 literal violets across roughly 25 declarations that the variable never reaches, so overriding it alone left the panel half brand-blue and half violet — the Reset button, view toggle, profile cards and submit button all stayed purple. Those now resolve to action-primary / -hover / -tonal. Rules are prefixed with #uw-main for SPECIFICITY, not scoping: the widget injects its stylesheet after ours and marks several of these !important, so at equal specificity source order would win" },
      { kind: "Fixed", text: "The reskin's font rule was matching a class the upgrade renamed. v3.x namespaced every class it ships (the trigger became .ux4g-accessibility-uw-widget-custom-trigger) but left element ids alone, so the rule is keyed on #uw-widget-custom-trigger — the hook that actually survived the upgrade" },
      { kind: "Added", text: "An analytics prop on UX4GAccessibilityWidget, defaulting to OFF. v3.28 beacons the full URL, pathname, referrer, user agent, language, screen resolution and a session id to audit360.ux4g.gov.in on load, then tracks panel opens and feature toggles — telemetry v1.15 had none of. On authenticated portals a full URL can carry application and beneficiary identifiers, so it is off unless a property opts in. There is no documented opt-out, but ANALYTICS_CONFIG is exposed by reference as window.UX4G_Analytics.config and the send path re-checks it, so flipping it suppresses every event including the initial load beacon" },
      { kind: "Fixed", text: "Two icons stay violet and are documented rather than patched: the Accessibility Profile square and the language icon carry fill='#613AF5' inside an SVG data: URI, which no CSS colour property can reach. Re-emitting the URI would hardcode a brand hex where no token can follow it, and this estate is multi-brand — so the residue is the better trade, and it is written down in the stylesheet" },
      { kind: "Fixed", text: "The keyboard shortcut is platform-correct on macOS. v3.28 hardcodes Ctrl+F2 into the trigger and binds exactly that, which on a Mac is wrong twice: Ctrl+F2 is a RESERVED macOS shortcut (move focus to the menu bar) that the OS consumes before the page sees it, and F2 is a media key unless the user has enabled standard function keys. A shortcut advertised on the button and then not working is worse than none — especially on an accessibility control, whose users are the keyboard users. Macs now get ⌘⌥A, with the trigger relabelled and the shortcut appended to its aria-label, since the aria-label overrides the visible text and would otherwise announce nothing. Windows and Linux are untouched and keep Ctrl+F2" },
      { kind: "Changed", text: "The Mac binding is a BRIDGE, not a reimplementation: it dispatches the synthetic Ctrl+F2 the widget already listens for, so open/close/focus stays vendor behaviour. ⌘⌥A was chosen specifically to avoid ⌃⌥, which is VoiceOver's modifier — binding that on an accessibility widget would collide with the screen reader its users are most likely running. Cmd also suppresses Option's character substitution, so it cannot type a stray å. Verified: ⌃⌥A, ⌘A, ⌘⌥⇧A and ⌘⌥S are all correctly ignored" },
      { kind: "Fixed", text: "The key match reads e.code OR e.key, not e.code alone. e.code is the correct layout-independent signal on real hardware — Option rewrites e.key — but it is not guaranteed: the first version silently dropped every press because the observed event arrived as {key: 'a', code: '', meta: true, alt: true}. Synthetic events, remote-input paths and some assistive tools deliver an empty code, which is precisely the population this shortcut exists for" },
    ],
  },
  {
    version: "v0.11.9",
    date: "2026-08-10",
    changes: [
      { kind: "Changed", text: "The prominence ladder is renamed and now actually ORDERS. UX4G's base / soft / subtle / emphasis / strong / stronger did not: subtle sat louder than soft while reading quieter, and base was the quietest of all while reading like the default. A ladder whose names do not sort is not a ladder, it is six adjectives. It is now base / subtler / subtle / bold / bolder / boldest for fills — Atlassian's shipped pattern rather than a private scale" },
      { kind: "Fixed", text: "The primary/secondary/tertiary overload is finally dissolved. Those words were ink rungs AND brand variants at once, separated only by the parser's greedy order — the mechanism that put “body and heading text” on sixteen backgrounds. Ink now uses the same ordinal words as fills, so the three are variants and nothing else and the collision cannot be spelled. The slot-disjointness guard is what forced the stale entries out of its own pinned list rather than leaving an exemption behind" },
      { kind: "Changed", text: "The contrast contract is now keyed per LADDER, not per word — and sharing one vocabulary is what forced it. subtle on a fill is a quiet tonal chip that need only be distinguishable (≥3:1, WCAG 1.4.11); subtle on ink is a caption, which is still text and still owes AA (≥4.5:1, 1.4.3). A single flat table could only ever have been right about one of them. A test fails if the two ladders ever stop differing, at which point the split has stopped earning its keep" },
      { kind: "Changed", text: "base is the CANONICAL value, not a loudness, so it sits at a different rung on each ladder — the ordinary fill is the quietest thing on the page, the ordinary ink is mid-way between a caption and a max-contrast heading. There is deliberately no subtlest: base already occupies that rung for fills, and adding it would mean two names for one value" },
      { kind: "Changed", text: "Figma collection names dropped their tier-number prefixes — Palette, Color, Space, Type, Radius, Motion, Density. The numbering came from a spec written when tier was going to BE the collection split; tier now lives in the variable path (ref/ … cmp/), so the prefix was redundant, and six of the seven read “2 ·” anyway, which conveys nothing" },
      { kind: "Fixed", text: "Nothing renders differently. 34 names moved and every one resolves byte-identically — dist/tokens.css is a 230-line diff with 230 insertions and 230 deletions, no additions and no removals, pinned by visual-contract.test.mjs" },
    ],
  },
  {
    version: "v0.11.8",
    date: "2026-08-10",
    changes: [
      { kind: "Changed", text: "The Figma library is canonical end to end. All 691 variables were renamed in place so a variable's NAME is its token path — bg/neutral/subtle, ref/space/md, cmp/action/brand/primary/hover/bg — and the collections are tier-ordered: 1 · Palette, 2 · Color, 2 · Space, 2 · Type, 2 · Radius, 2 · Motion, 2 · Density. 435 of 669 names previously differed from the path they came from, and 179 carried a hyphen inside a segment, which is the exact defect RULE 1 exists to remove" },
      { kind: "Changed", text: "RENAME ONLY, never recreate — and that was a finding, not a preference. Figma refuses to move a variable between collections (variableCollectionId is get-only; probed rather than assumed), so the six-collection tier split in spec §8.4 would have meant deleting and recreating ~500 variables. This is a PUBLISHED library whose consumers are other files, and a plugin running inside it cannot see their bindings — so a delete could not be shown to be safe, only hoped to be. Renaming preserves the variable id, so every binding in every consuming file followed automatically. Tier now lives in the NAME (ref/ … cmp/), which Figma's picker navigates exactly like a collection" },
      { kind: "Added", text: "40 tokens got a Figma home for the first time: the 38 data-visualisation tokens and the two Devanagari type tokens. The Devanagari pair had been unreachable because font-family/devanagari collided with the Tier-1 family of the same name — canonicalisation gave them distinct paths and the collision simply stopped existing" },
      { kind: "Fixed", text: "Source paths were canonicalised BEFORE projecting to Figma, so the rename would not bake in our own naming debt: spacing/* became space/* (the grammar's own group dictionary says space), color/chart/* moved to chart/* (spec §11.4 decided this and it had never been done), and the brand ramps' light/dark keys became blue/navy — they are two palettes, not two appearances, which is the whole reason §4.2 renamed the axis" },
      { kind: "Fixed", text: "The grammar allowlist is itemised instead of rooted. It was four ROOTS (color, type, spacing, density), and the check skipped every path beginning with one — so it exempted 188 existing tokens AND every token anyone might write under those roots in future. A brand-new ungrammatical color/… landed green, and the freeze criterion could never be met. It is now 150 explicit paths with two ratchet tests: a stale entry fails, and an entry that now parses fails. Three of the four roots turned out not to need exempting at all" },
      { kind: "Fixed", text: "Two repo pointers sent syncs to the wrong Figma file. Both .claude/commands/sync-figma.md and the sync handoff doc named older SAMAVESH copies that still contain variables — so a run against either looks successful and reaches nobody. Both now name the canonical file from GOVERNANCE.md, with the variable count to check against" },
      { kind: "Changed", text: "Renaming type/title1 to type/title/1 was attempted and REVERTED: it flattens onto a name the fluid font/role scale already owns, silently merging a fixed 22px semantic role with a clamp(). The visual-contract test caught it, and the two namespaces now stay spelled differently on purpose, with the reason written down where the next person will look" },
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
      { kind: "Fixed", text: "The Figma library was publishing 322 WCAG contrast guarantees that nothing had measured. They came from a substring scan of the token path, so any name containing a rung word got a class: 192 sat on Tier-3 Action/* variables, which have no prominence slot at all; Background/Brand/Primary/Base read “Guarantees ≥4.5:1, body and heading text” because primary is a brand VARIANT that happens to spell an ink rung; and motion/duration-base — a number — read “no contrast guarantee, decorative fills only”. Of the 41 claims that were measurable, 23 were false" },
      { kind: "Changed", text: "A contrast class is now a MEASUREMENT, not an assertion. Every applicable token is resolved through its alias chain, composited if translucent, and measured against its own surface across every brand — worst case wins, because a token is only as accessible as its least accessible brand. The description states the number it measured, and adds the permission sentence only where the threshold is actually met, so the true half is unconditional and the claim is conditional" },
      { kind: "Fixed", text: "Text and icon tokens are never silent. The ink ladder has no rung for the canonical value, so text/brand/primary/base and text/link/brand/default — brand body text and the text link, the two tokens that most obviously must be AA — fell through it entirely while a decorative fill got a paragraph. Where the ladder says nothing, WCAG 1.4.3 for text and 1.4.11 for icons apply, attributed to WCAG rather than to a rung" },
      { kind: "Added", text: "prominence-contract.test.mjs — spec §9.2, which had never been written. The only test on the subject asserted that the threshold TABLE was sorted; nothing had ever compared a claim to a colour. It now fails if any published sentence is unmeasured, disagrees with its own number, claims a threshold it misses, or lands on a non-colour, Tier-3 or disabled token. Hand-written ≥N:1 claims in authored prose are checked too. Watched failing on both original defects before being trusted" },
      { kind: "Added", text: "A shortfall ledger of 19 tokens whose rung name promises more than the token delivers — published in the Figma description rather than suppressed, and pinned in CI so it may only shrink. 17 are Background/* tonal chips measured against the page, where the fill ladder's ≥3:1 is the wrong requirement (WCAG 1.4.11 governs boundaries that identify a control, not quiet fills); 2 are Border/Neutral, where ≥3:1 genuinely is the bar. The likely fix is the ladder, not the colours — that decision is now visible instead of hidden behind a false guarantee" },
      { kind: "Changed", text: "The WCAG maths moved to build/wcag.mjs and test/lib/contrast.mjs re-exports it, so the build and the gates share one implementation rather than two copies staying accidentally identical. Nothing renders differently: this is a description-only change, and visual-contract.test.mjs proves no token moved" },
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
