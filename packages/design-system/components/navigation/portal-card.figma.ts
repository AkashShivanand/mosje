// url=<SAMAVESH>?node-id=56486-832
// source=packages/design-system/components/navigation/portal-card.tsx
// component=PortalCard
//
// Code Connect template for `PortalCard`.
//
//   library : 3FF5l0SMNIwdpZrKkeyPTm  ·  page "Portal Card" (Navigation)
//   set     : 56486:832  key c92d933367e5ab7dbdc8dad24c576170fb41c25a
//   axes    : Variant (Compact | Detailed) × Selected (False | True) = 4 variants
//
// FIGMA AND CODE AGREE AS OF 31 Aug 2026. The set previously carried
// Status=Live|Planned, which had no code counterpart once `planned` was removed —
// this file said so rather than pretending otherwise, and the set has now been
// restructured in place. The KEY is unchanged, so every instance and this mapping
// survived: the variants were renamed and rebuilt, never replaced.
//
// NOT PUBLISHABLE UNTIL THE LIBRARY IS PUBLISHED — a human action in the Figma
// UI. Then `npm run figma:connect` from the REPO ROOT with a FIGMA_ACCESS_TOKEN.
//
// PROPERTY COVERAGE — every Figma property is mapped or its absence explained.
//   Variant  (variant)   -> variant     Compact -> omitted (the default) ·
//                           Detailed -> variant="detailed". Exhaustive.
//   Selected (variant)   -> selected    False -> omitted · True -> set. Exhaustive.
//   Code     (text)      -> code
//   Name     (text)      -> name
//
// CODE PROPS WITH NO FIGMA PROPERTY, deliberately:
//   href        -> a destination is DATA, not a design decision. Required in code
//                  so an unbuilt portal cannot be rendered as a link at all.
//   path / org  -> which mark to show. Resolved through the OrgLogo registry; in
//                  Figma this is the org-logo instance's own `Org` property.
//   description -> `detailed` only. Figma carries a specimen string; the real one
//   category       comes from the estate registry, so the snippet leaves both to
//                  the caller rather than emitting the placeholder.
//   ctaLabel    -> defaults to "Open portal" and no surface overrides it yet.
//   external    -> BEHAVIOUR. It renders its own cue (see rule 5); Figma has no
//                  property for it, and one should be drawn when the first
//                  external portal ships.
//
// ─────────────────────────────────────────────────────────────────────────────
// RULES — the things an agent gets wrong from the geometry alone
//
// 1. THE BORDER AND THE CODE SIT ON DIFFERENT SAFFRON STEPS, and copying one to
//    the other is the mistake this rule exists to stop. Border is
//    `--sa-color-secondaryScale-500`; the code and the CTA are `-600`. They have
//    different jobs: the border is the card's ONLY boundary so WCAG 1.4.11 asks
//    3:1 of it, while the code is 16px BOLD — not "large" text, which starts at
//    18.66px bold — so 1.4.3 asks 4.5:1. On white they measure 3.79 and 4.97.
// 2. NEVER USE `secondaryScale-400` (#ff671f) FOR EITHER. The handoff mock at
//    node 9364:82791 does exactly that, and at 2.91:1 its border fails non-text
//    contrast and its code fails text contrast. The mock is the design intent for
//    LIGHTNESS, not a set of values to transcribe.
// 3. THERE IS NO PLANNED STATE AND `href` IS REQUIRED. Every surface lists LIVE
//    portals only. An optional destination is how an unbuilt portal got rendered
//    as a link and shipped a 404 on every page of the website.
// 4. THE MARK COMES FROM `OrgLogo` — pass `path` (a route) or `org` (a slug),
//    never a file. There is no `logoSrc`, and `check:org-logos` fails the build on
//    a mark path written outside the registry.
// 5. `external` CARRIES ITS OWN CUE — an `open_in_new` glyph plus a
//    visually-hidden "(opens in a new tab)". Both, because the glyph is
//    aria-hidden and a label is invisible to a sighted reader [WCAG G201]. Do not
//    add a second cue around it, and do not give external cards their own style:
//    every portal is external in production, so a decoration on all of them says
//    nothing.
// 6. NEVER WRAP IT IN `role="listitem"`. An explicit role REPLACES the implicit
//    `link` one. Use a real `<li>` around it.
// 7. THE CARD DOES NOT LOOK UP ITS OWN STATUS. The caller reads the registry and
//    passes what to show — see `liveSamaveshPortals()`.
//
// TOKENS
//   border --sa-color-secondaryScale-500 · code + CTA --sa-color-secondaryScale-600
//   ground --sa-bg-neutral-base · radius --sa-shape-20 · tile rule
//   --sa-border-neutral-subtle · check --sa-brand-samavesh-green
//   type --sa-type-title-3 / body-2 / body-3 / label-1 / label-2

import figma from "figma";

const instance = figma.selectedInstance;

const code = instance.getString("Code");
const name = instance.getString("Name");

/* Both axes, mapped exhaustively. `Compact` and `Selected=False` are the
   component's own defaults and emit nothing — a snippet that spelled out
   `variant="compact"` would teach an agent to pass the default everywhere. */
const variant = instance.getEnum("Variant", {
  Compact: "",
  Detailed: '\n  variant="detailed"',
});

const selected = instance.getEnum("Selected", {
  False: "",
  True: "\n  selected",
});

export default {
  example: figma.code`<li>
  <PortalCard
    code="${code}"
    name="${name}"
    href="/portals/…"
    path="/portals/…"${variant}${selected}
  />
</li>`,
};
