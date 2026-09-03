import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Resend Timer — Design System",
  description: "The resend affordance under a one-time-code field.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      "During the cooldown the component renders TEXT, not a disabled button. A disabled control that silently becomes enabled on a timer is announced badly and invites clicking at nothing.",
    description: "The state change is a change of element, not of an attribute nobody is told about.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Resend Timer"
      status="Stable"
      summary="The resend affordance under a one-time-code field. The cooldown is TEXT rather than a disabled button, because a disabled control that quietly becomes enabled on a timer is announced badly and invites clicking at nothing."
      figma={{ absent: "Part of the auth-parts set; no separate Figma node." }}
      specimen={<Specimen />}
      propsFrom="ResendTimerProps"
      a11y={A11Y}
      whenToUse={{ use: ["Under any one-time-code field."], avoid: ["Rendering a disabled button during the cooldown."] }}
      related={[
        { label: "OTP Input", href: "/design-system/components/forms/otp-input", reason: "the field above it" },
        { label: "Masked Contact Row", href: "/design-system/components/auth/masked-contact-row", reason: "where the code was sent" },
      ]}
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-rule">
          <h2 id="cdp-rule" className="cdp__h2">The Rule Most Often Got Wrong</h2>
          <p>
            On an <strong>incorrect-code error, go straight to the active state</strong> — pass{" "}
            <code>secondsRemaining={0}</code>. Do not wait out the remaining cooldown.
          </p>
          <p>
            The code the citizen is holding is now known to be bad. Making them sit through a timer
            before they can ask for a working one punishes them for an error the system already
            knows about.
          </p>
        </section>
      }
    />
  );
}
