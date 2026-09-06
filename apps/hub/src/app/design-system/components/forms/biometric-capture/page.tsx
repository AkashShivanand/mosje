import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { BiometricPlayground } from "./biometric-playground";

export const metadata: Metadata = {
  title: "Biometric Capture — Design System",
  description:
    "The capture surface for a fingerprint, iris scan or photograph — five designed states, a consent line shown before capture, and a required alternative route.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "3.3.8 Accessible Authentication (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "`fallbackHref` is a required prop, so the component cannot render without an alternative route, and the link is present in all five states — read from the DOM of every specimen on this page, including `captured`.",
    description:
      "There is always a route that does not depend on one bodily capability, and it cannot be omitted.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    evidence:
      'A single <p role="status" aria-live="polite"> carries the message for every state, so a change is announced once. Read from the DOM while driving the live specimen from idle through capturing to captured.',
    description:
      "A reader who cannot see the panel change is told the capture succeeded, failed, or cannot happen here.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "verified",
    evidence:
      "Every state changes the sentence in the live region as well as the stage's fill; `failed` additionally sets the message in the error tone at medium weight. Read from computed styles and from the rendered text of all five states.",
    description:
      "State is carried by words first and colour second — never by colour alone.",
  },
  {
    criterion: "2.3.3 Animation from Interactions",
    level: "AAA",
    status: "verified",
    evidence:
      "Under prefers-reduced-motion the capturing pulse becomes a steady ring rather than disappearing: the rule sets animation: none with opacity 1. Read from the stylesheet; the media query itself was not emulated in this pass, so this row rests on the rule rather than on a rendered observation.",
    description:
      "The pulse carries meaning, so reduced motion holds it steady rather than removing the information.",
  },
];

export default function BiometricCapturePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Biometric Capture"
      status="Stable"
      summary="The screen a citizen looks at while a fingerprint, iris scan or photograph is taken. It draws five states and never touches a device — reading a scanner belongs to the portal, and varies per deployment."
      figma={{ absent: "Master pending in the SAMAVESH library — tracked on the component record." }}
      specimen={<BiometricPlayground />}
      propsFrom="BiometricCaptureProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "An enrolment or verification step captures a fingerprint, an iris scan or a photograph at a centre.",
          "The portal already owns the device integration and needs the screen around it.",
        ],
        avoid: [
          "There is no alternative route. Build that first — this component requires one, deliberately.",
          "The capture is a document photograph the citizen uploads — that is Media Upload.",
          "Identity can be verified without a biometric. Then do that: the least intrusive route that works is the right one.",
        ],
      }}
      related={[
        { label: "Media Upload", href: "/design-system/components/forms/media-upload", reason: "when the citizen supplies a file rather than a live capture" },
        { label: "Aadhaar Input", href: "/design-system/components/forms/aadhaar-input", reason: "for the number, which is masked and checked" },
        { label: "Consent Line", href: "/design-system/components/auth/consent-line", reason: "for consent attached to a form rather than to a capture" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-nodevice">
            <h2 id="cdp-nodevice" className="cdp__h2">It Draws States; It Never Touches a Device</h2>
            <p>
              Reading a scanner is the portal&apos;s job, through whatever RD service the centre
              has, and that varies per deployment. What is shared — and what was being rebuilt on
              every enrolment screen — is the surface a citizen looks at while it happens, and the
              five states it has to have.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-unavailable">
            <h2 id="cdp-unavailable" className="cdp__h2"><code>unavailable</code> Is a Designed State</h2>
            <p>
              A centre whose reader is unplugged, and a citizen who opened the page on a phone, are
              not error cases. They are ordinary and they are common, and both must be told plainly
              and sent to the alternative rather than shown a button that will never work.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-fallback">
            <h2 id="cdp-fallback" className="cdp__h2">The Alternative Is Required, and Always Visible</h2>
            <p>
              Biometric capture fails for worn fingerprints, for cataracts, for manual labourers and
              for the elderly — which is to say it fails most often for exactly the citizens these
              schemes exist to serve. A screen with no way past it does not stop the department; it
              stops the application.
            </p>
            <p>
              So <code>fallbackHref</code> is a required prop rather than a recommendation, and the
              link is offered in <em>every</em> state, including success. Hiding the way out until
              something fails makes failure the only way to find it.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-consent">
            <h2 id="cdp-consent" className="cdp__h2">Consent Before, Not After</h2>
            <p>
              Under the DPDP Act 2023 a biometric is personal data, and the citizen is told what is
              taken and why <em>before</em> it is taken. The consent sentence is therefore visible in{" "}
              <code>idle</code>, <code>capturing</code> and <code>failed</code>, and drops away once
              the capture is done — at which point it is a record of what happened, not a notice.
            </p>
            <p>
              Say what is captured, what it is checked against, and whether the department keeps it.
              &ldquo;…and is not stored by the department&rdquo; is the sentence a citizen most wants
              and least often gets.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-reason">
            <h2 id="cdp-reason" className="cdp__h2">A Failure Reason a Person Can Act On</h2>
            <p>
              &ldquo;The finger was lifted too early. Hold it flat until the reader beeps.&rdquo; is
              actionable at a counter. A device error code is not — it tells the operator to call
              somebody, and the citizen waits.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`import { BiometricCapture } from "@mosje/design-system";

const [state, setState] = React.useState<BiometricState>(
  hasReader ? "idle" : "unavailable",
);

<BiometricCapture
  modality="fingerprint"
  state={state}
  subject={applicant.name}
  onCapture={async () => {
    setState("capturing");
    const result = await rdService.capture();
    setState(result.ok ? "captured" : "failed");
  }}
  failureReason={lastError}
  consent="Your fingerprint is taken to verify your identity against the Aadhaar record and is not stored by the department."
  fallbackHref="/portals/tg/verify/manual"
  fallbackLabel="Verify with documents instead"
/>`}</CodeBlock>
          <p>
            The component is fully controlled: it owns no timers and no device handles, so a portal
            can drive it from whatever its RD service reports.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-3338">
          <h2 id="cdp-3338" className="cdp__h2">WCAG 3.3.8, From the Other Direction</h2>
          <p>
            The criterion asks that authentication not require a cognitive function test without an
            alternative. A biometric is not a cognitive test — but the same reasoning applies to a
            bodily one, and the practical requirement is identical: there must be a route that does
            not depend on one capability.
          </p>
          <p>
            Making <code>fallbackHref</code> required is how that is enforced here. A recommendation
            in documentation is followed by whoever read it; a required prop is followed by everyone.
          </p>
        </section>
      }
    />
  );
}
