import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { CookiesPlayground } from "./cookies-playground";

export const metadata: Metadata = {
  title: "Cookie Consent — Design System",
  description:
    "The cookie decision — a notice where every cookie is necessary, a choice where some are not. Every rule in it answers a dark pattern.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "Read from the rendered DOM on this page: the control is a <section> named by its own <h2> through aria-labelledby, and each category is a <li> whose checkbox has its own visible label.",
    description: "It is a named region, not an anonymous strip.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    status: "verified",
    evidence:
      "It renders in the flow at the foot of the page rather than as a modal: nothing is trapped, the page behind stays scrollable, and Tab passes through the banner and out of it. Verified in a browser.",
    description: "Reading the page does not require answering the banner first.",
  },
  {
    criterion: "3.2.4 Consistent Identification",
    level: "AA",
    status: "verified",
    evidence:
      'Read from the DOM: the choice specimen offers "Accept all", "Reject optional cookies" and "Choose which cookies" together before any panel is opened, and the notice specimen offers one button, "Accept and continue". Opening the choices showed the optional category unticked and the required one reading "Always on — needed for the site to work" rather than a toggle.',
    description: "Rejecting takes exactly as many presses as accepting.",
  },
];

export default function CookieConsentPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Cookie Consent"
      status="Stable"
      summary="The cookie decision. Where every category is required it renders a notice with one acknowledgement; where some are optional it renders a real choice, with rejecting exactly as easy as accepting."
      figma={{ absent: "No master in the SAMAVESH library yet — the gap, and the order the seventeen are being closed in, are recorded in docs/audit/design-system-completeness-2026-09-06.md." }}
      specimen={<CookiesPlayground />}
      propsFrom="CookieConsentProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A surface sets cookies and has to say so. The website\u2019s banner renders this today, in its notice form, because every cookie it sets is strictly necessary.",
          "A portal introduces its first optional cookie — analytics, an embedded film — and now needs a real choice.",
        ],
        avoid: [
          "A surface that sets no cookies at all. A banner about nothing teaches people to dismiss consent controls without reading them.",
          "As a modal. It is a bar at the foot of the page, and there is no variant that takes the page away.",
        ],
      }}
      related={[
        { label: "Alert", href: "/design-system/components/feedback/alert", reason: "for a statement that is not a choice" },
        { label: "Modal", href: "/design-system/components/feedback/modal", reason: "for a decision that must be made before continuing — which this is not" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-none">
            <h2 id="cdp-none" className="cdp__h2">A Notice and a Choice Are Different Things</h2>
            <p>
              Where every category is <code>required</code> there is nothing to consent to, so the
              component renders a notice with a single acknowledgement rather than
              &ldquo;Accept all&rdquo; and &ldquo;Reject optional&rdquo; against an empty set.
              Offering a decision the reader does not have is how consent controls stop meaning
              anything — and it is the form the website&rsquo;s own banner takes, because every
              cookie it sets is strictly necessary. The moment a portal adds analytics, the same
              component becomes a real choice.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-place">
            <h2 id="cdp-place" className="cdp__h2">Fixed by Default, and It Does Not Yield</h2>
            <p>
              A real banner is pinned to the foot of the viewport and carries{" "}
              <code>data-sa-corner-occupant</code>, so the accessibility widget and the chat
              launcher lift clear of it. It does not read the corner rail itself: consent comes
              before a chat widget on a government site, so the bar stays put and the widgets move.
              Pass <code>placement=&quot;inline&quot;</code> for a specimen or a settings page.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-equal">
            <h2 id="cdp-equal" className="cdp__h2">Rejecting Is as Easy as Accepting</h2>
            <p>
              Both are buttons in the same row, in the first view. A banner where accepting is one
              press and rejecting is two clicks through a settings panel is not collecting consent;
              it is collecting fatigue.
            </p>
            <CodeBlock>{`import { CookieConsent } from "@mosje/design-system";

<CookieConsent
  categories={categories}       // required: true marks the ones that cannot be refused
  accepted={accepted}
  onDecide={save}
  description="The Department uses cookies to keep this site working…"
  policyHref="/cookies"
/>`}</CodeBlock>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-off">
            <h2 id="cdp-off" className="cdp__h2">Optional Categories Start Off</h2>
            <p>
              There is no prop to pre-tick them. A pre-ticked box is not consent, whatever the
              banner says above it.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-req">
            <h2 id="cdp-req" className="cdp__h2">A Required Category Says So</h2>
            <p>
              &ldquo;Always on — needed for the site to work&rdquo;, not a switch that cannot move.
              A control that will not respond is a control that lies about what the reader can do,
              and it is the fastest way to lose their trust in the rest of the panel.
            </p>
          </section>
        </>
      }
    />
  );
}
