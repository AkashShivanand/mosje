import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { PortalLoginShellSpecimen } from "./portal-login-shell-specimen";

export const metadata: Metadata = {
  title: "Portal Login Shell — Design System",
  description:
    "The full-page login layout every MoSJE portal signs in through — the utility bar, the Government of India masthead, the SAMAVESH hero, the tab strip and the footer. The form itself is the caller's.",
};

/*
 * Read off `PortalLoginShellProps` in
 * packages/design-system/components/auth/portal-login-shell.tsx.
 *
 * Corrected 2026-09-02: the previous table listed `title`, `subtitle`, `brandLogo` and
 * `helpUrl`. None of the four exists on this component, and the four that carry the
 * portal's brand assets were missing entirely.
 */
const PROPS: PropDef[] = [
  {
    name: "emblemSrc",
    type: "string",
    default: '"/brand/national-emblem.svg"',
    description:
      "The National Emblem, from the portal's own public directory. It is drawn by the shared BrandLockup, so the emblem, the line order and the BETA badge are estate policy rather than this shell's to retype.",
  },
  {
    name: "digitalIndiaSrc",
    type: "string",
    default: '"/brand/digital-india.svg"',
    description: "The Digital India logo, shown in the masthead's right cluster at 768px and above.",
  },
  {
    name: "samaveshLogoSrc",
    type: "string",
    // org-logo-exempt(prose): the component's documented default, quoted. Documentation
    // that names a path is not a consumer of it, and the SAMAVESH wordmark is not in the
    // org-logo registry — that registry holds the 17 ORGANISATION marks.
    default: '"/brand/samavesh-logo.svg"',
    description: "The SAMAVESH circular mark. It appears three times — in the masthead, in the hero, and in the “Signing Into” strip.",
  },
  {
    name: "signingInto",
    type: "string",
    required: true,
    description:
      "The portal or scheme being signed into, e.g. “Nasha Mukt Bharat Abhiyaan”. It names the strip at the foot of the hero, which is the reader's confirmation that they are at the right door.",
  },
  {
    name: "changeHref",
    type: "string",
    default: '"/"',
    description: "Where the “Change” control in that strip leads — the hub root, so a reader at the wrong portal can leave without using Back.",
  },
  {
    name: "tabs",
    type: "PortalLoginTab[]",
    required: true,
    description:
      "The role pills above the form, each `{ label, href, active, onClick? }`. They are real links so middle-click and “copy link address” both land on the right tab. Pass an empty array to render no strip at all.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description:
      "The form: heading, fields and submit control. It is placed inside the `#login-form` container the shell's skip link targets, so the caller does not wire the bypass.",
  },
  {
    name: "extraContent",
    type: "React.ReactNode",
    default: "undefined",
    description: "A block below the form area — a portal switcher grid, a registration prompt. It sits above the footer, inside the right panel.",
  },
  {
    name: "onFooterLinkClick",
    type: '(link: "privacy" | "contact" | "about") => void',
    default: "undefined",
    description:
      "Called when a footer link is activated. The footer's three links are buttons, so the consuming app routes them; the shell is framework-agnostic and does no navigation of its own.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.1 Bypass Blocks",
    level: "A",
    description:
      "The shell renders one AccessibilityBar, which carries the page's single skip link, targeting the `#login-form` container. It used to carry its own bar as well, so the page had two skip links to the same target; both are now one.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The hero column is `aria-hidden`, because it is decorative branding a screen-reader user would otherwise hear before reaching the form. The footer is a `<nav>` with its own accessible name.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description:
      "The form container carries `tabIndex={-1}` so the skip link can move focus into it. The hero, being aria-hidden and containing no controls, is skipped entirely.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    description: "White content on the hero's primaryScale-900 gradient and on the active tab's primaryScale-800 pill both clear AA.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description: "The hero is hidden below the large breakpoint and the right panel becomes the whole page, so the layout reads as one column at 320px.",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    description:
      "The bar drives `--sa-font-scale` on the document root, so a reader's text-size choice applies estate-wide and survives navigation. It used to scale this shell alone through an inline font-size, which is why resizing here did nothing on the page you landed on afterwards.",
  },
  {
    criterion: "GIGW 3.0 — Mandatory features",
    level: "GIGW",
    description: "The Government of India link, the emblem lockup, the accessibility controls and the Privacy Policy · Contact Us · About Us footer are all present on every portal that uses the shell.",
  },
];

export default function PortalLoginShellPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Portal Login Shell"
      status="Stable"
      summary="The full-page login layout every MoSJE portal signs in through. It owns the utility bar, the Government of India masthead, the SAMAVESH hero, the role tab strip and the footer; the form inside it is the caller's."
      figma={{
        absent: "Not yet published as a master in the Figma library. The bar it opens with is published as Accessibility Bar.",
      }}
      specimen={<PortalLoginShellSpecimen />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A portal needs a login page and should look like every other portal's login page.",
          "The sign-in form is bespoke to the portal but the chrome around it must not be.",
          "A reader arriving from the hub needs to be told, on the page, which portal they are signing into.",
        ],
        avoid: [
          "The portal's roles and authentication modes can be described declaratively — use Portal Login Template, which builds the tabs, the form and the mode selector from one config object.",
          "The page is an interior portal screen rather than the door — use App Shell, which carries the signed-in navigation.",
          "You only need the top utility band — use Accessibility Bar on its own.",
        ],
      }}
      related={[
        { label: "Portal Login Template", href: "/design-system/components/auth/portal-login-template", reason: "the declarative layer above this shell; it renders the form for you" },
        { label: "Accessibility Bar", href: "/design-system/components/utilities/accessibility-bar", reason: "the utility band the shell opens with" },
        { label: "Brand Lockup", href: "/design-system/components/navigation/brand-lockup", reason: "the emblem and ministry lines in the masthead" },
        { label: "App Shell", href: "/design-system/components/layout/app-shell", reason: "the layout for the screens behind the login" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-anatomy">
            <h2 id="cdp-anatomy" className="cdp__h2">
              What the Shell Owns, and What It Does Not
            </h2>
            <p>
              The layout is four bands: the utility bar, the brand header, a two-column body — a
              58% hero and a 42% panel — and the footer. Everything in that list is the
              shell&rsquo;s. The only thing the caller supplies inside the frame is the form, plus
              an optional block beneath it.
            </p>
            <p>
              What changes per portal is small and declared: the three brand asset paths, the name
              in the &ldquo;Signing Into&rdquo; strip, the tab labels, and the form. What does not
              change is everything else, which is the point — a citizen who has signed into one
              MoSJE portal should recognise the next one before they read a word of it.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-hero">
            <h2 id="cdp-hero" className="cdp__h2">
              The Hero Is Decorative, and Disappears
            </h2>
            <p>
              The left column carries the SAMAVESH identity and nothing operable. It is hidden
              below the large breakpoint, so a phone gets the form and the chrome and none of the
              branding column &mdash; and it is <code>aria-hidden</code> at every width, so a
              screen-reader user is not read a tagline before being given a field to type in.
            </p>
            <Callout type="info" title="One accessibility bar, not two">
              The shell used to carry its own utility bar: two skip links to the same target, a
              bespoke A−/A/A+ stepper wired to local state nothing else read, and ◑ ♿ 🌐 as literal
              emoji rather than Material Symbols. It was a second accessibility bar living inside
              the design system, free to drift from the real one &mdash; and it had. The shared
              <code> AccessibilityBar</code> replaced it, and the duplicate skip link went with it.
            </Callout>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { PortalLoginShell } from "@mosje/design-system";

<PortalLoginShell
  // Each portal serves its own copy under /portals/<slug>/brand/.
  emblemSrc={\`\${brand}/national-emblem.svg\`}
  digitalIndiaSrc={\`\${brand}/digital-india.svg\`}
  samaveshLogoSrc={\`\${brand}/samavesh-wordmark.svg\`}
  signingInto="Nasha Mukt Bharat Abhiyaan"
  tabs={[
    { label: "Admin", href: "/portals/nmba/login?role=admin", active: true },
    { label: "Patient Monitoring", href: "/portals/nmba/login?role=monitoring", active: false },
  ]}
  onFooterLinkClick={(link) => router.push(FOOTER_ROUTES[link])}
>
  {/* heading, fields, submit */}
</PortalLoginShell>`}</CodeBlock>
          <p>
            The tabs are anchors with an optional <code>onClick</code>. Give them real hrefs even
            where the click handler does the work &mdash; a role tab that cannot be copied as a
            link is a page a colleague cannot be sent to.
          </p>
        </section>
      }
    />
  );
}
