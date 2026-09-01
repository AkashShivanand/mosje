import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  PropsTable,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";
import { Footer } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Footer — Design System",
  description:
    "The slim navy app-shell footer: the NeGD and MeitY credit line, plus optional policy links.",
};


/* `FooterLink` is a data shape rather than a props interface, so it is documented here. */
const FOOTER_LINK_SHAPE: PropDef[] = [
  { name: "label", type: "string", required: true, description: "The link's visible text, and its accessible name." },
  {
    name: "href",
    type: "string",
    description:
      "Destination. With an href the entry renders an anchor; without one it renders a button, which is correct for a control that opens something in place rather than navigating.",
  },
  {
    name: "onClick",
    type: "() => void",
    description: "Handler for the button form. Ignored when href is set.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Renders a real `<footer>`, which is the `contentinfo` landmark when it is not nested inside another sectioning element. The links are a real `<ul>`.",
    status: "verified",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "Anchors and buttons only — a link with an `onClick` and no `href` renders as a `<button>`, so it is reachable by Tab and activated by Enter and Space rather than being a clickable span.",
    status: "verified",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    description:
      "The band and its ink are a bound pair in the component's stylesheet, so the credit line and the links clear 4.5:1 on the navy without a caller choosing a colour.",
  },
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    description:
      "Each link's text is its own label — “Privacy Policy”, not “click here”. The component renders the label it is given, so this one is on the caller.",
    status: "partial",
    evidence: "Label text is caller-supplied.",
  },
  {
    criterion: "GIGW 3.0 — Mandatory page elements",
    level: "GIGW",
    description:
      "This footer carries a credit line and optional policy links, and nothing else. It does NOT satisfy the statutory footer requirements — lineage, sitemap, related links, help, feedback, last updated. A public government page needs Site Footer.",
    status: "verified",
    evidence: "By design; see When to Use It.",
  },
];

export default function FooterPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Footer"
      status="Stable"
      summary="The slim navy app-shell footer: one band carrying the NeGD and MeitY credit line, plus optional policy links. It ends a signed-in workflow, not a public page."
      figma={{
        absent:
          "Matches the portal footer inside the Navbar and app-shell masters in the SAMAVESH library; it is not published as its own node in the estate's Figma index.",
      }}
      specimen={
        <Footer
          links={[
            { label: "Terms of Use", href: "#" },
            { label: "Privacy Policy", href: "#" },
          ]}
        />
      }
      propsFrom="FooterProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The foot of a signed-in portal page, in App Shell's footer slot.",
          "An internal index surface that is not a public government page — the hub landing, the reports index.",
          "Anywhere a single credit line and two or three policy links are the whole requirement.",
        ],
        avoid: [
          "A public website page — use Site Footer, whose statutory bar carries the six DBIM-required elements this component does not have.",
          "Multi-column navigation — that is Site Footer's website variant.",
          "A portal that must publish the statutory apparatus — use Site Footer with `variant=\"portal\"`, which renders the statutory half alone.",
        ],
      }}
      related={[
        {
          label: "Site Footer",
          href: "/design-system/components/navigation/site-footer",
          reason: "when the statutory elements are required",
        },
        {
          label: "App Shell",
          href: "/design-system/components/layout/app-shell",
          reason: "the portal skeleton whose footer slot this fills",
        },
        {
          label: "Navbar (Header)",
          href: "/design-system/components/section-templates/site-header",
          reason: "the chrome at the other end, whose maxWidth this must match",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-scope">
            <h2 id="cdp-scope" className="cdp__h2">
              What This Footer Is Not
            </h2>
            <p>
              It carries a credit line and, optionally, two or three policy links. It does not
              carry the lineage sentence, the hyperlinked logos, the sitemap, related links, help,
              feedback, or a last-updated date. Those are DBIM 5.6 requirements for a government
              page, and <code>SiteFooter</code> makes three of them required props for exactly that
              reason.
            </p>
            <Callout type="warning" title="A portal is still a government surface">
              If a portal must publish the statutory apparatus, reach for{" "}
              <code>SiteFooter variant=&quot;portal&quot;</code> rather than adding links to this
              one. That variant renders the statutory bar alone, and it is the same statutory bar
              the website renders — which is what stops the two drifting apart.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-width">
            <h2 id="cdp-width" className="cdp__h2">
              Keep the Width in Step with the Header
            </h2>
            <p>
              The footer&apos;s content column is capped by <code>maxWidth</code> and the
              masthead&apos;s by its own. When the two disagree, the credit line and the emblem sit
              on different left edges on any screen wider than the smaller cap — a misalignment
              that is invisible on a laptop and obvious on a large display. Pass the same value to
              both, or leave both at their defaults.
            </p>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-link-shape">
            <h2 id="cdp-link-shape" className="cdp__h2">
              FooterLink
            </h2>
            <PropsTable props={FOOTER_LINK_SHAPE} />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Footer } from "@mosje/design-system";

<Footer
  links={[
    { label: "Terms of Use", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ]}
/>`}</CodeBlock>
          <p>
            A link with no <code>href</code> renders as a button. Use that for something that opens
            in place rather than navigating — a cookie preferences dialog, for instance — so the
            control&apos;s role matches what it does.
          </p>
          <CodeBlock>{`<Footer
  copyright={<>© {year} Department of Social Justice &amp; Empowerment</>}
  links={[{ label: "Cookie Preferences", onClick: openCookieDialog }]}
/>`}</CodeBlock>
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-landmark">
          <h2 id="cdp-landmark" className="cdp__h2">
            The contentinfo Landmark
          </h2>
          <p>
            A <code>&lt;footer&gt;</code> is the page&apos;s <code>contentinfo</code> landmark only
            when it is not nested inside an <code>&lt;article&gt;</code> or{" "}
            <code>&lt;section&gt;</code>. <code>AppShell</code> renders it as a sibling of{" "}
            <code>&lt;main&gt;</code>, which is correct. Placing this component inside a page&apos;s
            content instead demotes it to a plain footer element and removes a landmark a
            screen-reader user navigates by.
          </p>
          <p>
            One <code>contentinfo</code> per page. A portal that renders both this and a second
            footer inside its content gives a reader two.
          </p>
        </section>
      }
    />
  );
}
