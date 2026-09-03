import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Masked Contact Row — Design System",
  description: "Confirms where a one-time code was sent, and offers the way back to change it.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    status: "verified",
    evidence: "The row states the channel and the masked destination together, so the reader can confirm the code is going somewhere they still hold.",
    description: "“We sent a code” without saying where is the failure this replaces.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Masked Contact Row"
      status="Stable"
      summary="Confirms where a one-time code was sent, and offers the way back to change it. It always shows a MASKED value, because these screens are routinely used on shared and public devices."
      figma={{ absent: "Part of the auth-parts set; no separate Figma node." }}
      specimen={<Specimen />}
      propsFrom="MaskedContactRowProps"
      a11y={A11Y}
      whenToUse={{
        use: ["Above a one-time-code field, naming the phone or email the code went to."],
        avoid: [
          "Passing an unmasked phone or email. Keep the last four of a phone and the first and last of an email local part — enough to recognise, not enough to identify.",
          "Wiring `onEdit` to anything that loses what was typed: it returns to the previous step with the value pre-filled.",
        ],
      }}
      related={[
        { label: "OTP Input", href: "/design-system/components/forms/otp-input", reason: "the field this sits above" },
        { label: "Resend Timer", href: "/design-system/components/auth/resend-timer", reason: "the control below it" },
      ]}
    />
  );
}
