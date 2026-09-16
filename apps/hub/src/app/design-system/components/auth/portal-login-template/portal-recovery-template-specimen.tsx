"use client";

import * as React from "react";
import {
  PortalRecoveryTemplate,
  RadioGroup,
  type PortalRecoveryConfig,
  type PortalRecoveryFlow,
} from "@mosje/design-system";

/**
 * `PortalRecoveryTemplate`, running, in each of its three flows.
 *
 * The flow is switched here rather than drawn three times because the chrome is
 * identical across them — that sameness is what the template exists to hold —
 * and only the card changes. `key` remounts the template on a switch so each
 * flow opens on its first step.
 *
 * The `otp` flow refuses the code 000000, so the wrong-code state is reachable:
 * any other six digits continue to Set New Password.
 */
const BASE: Omit<PortalRecoveryConfig, "flow"> = {
  portalId: "scw",
  portalName: "Senior Citizens Welfare",
  changeHref: "#",
  loginHref: "#",
  brandAssets: {
    emblemSrc: "/design-system/national-emblem.svg",
    digitalIndiaSrc: "/website/images/digital-india-logo.svg",
    // org-logo-exempt(specimen): a required explicit-path prop; see the shell's specimen.
    samaveshLogoSrc: "/design-system/samavesh-logo.svg",
  },
};

const FLOWS: { value: PortalRecoveryFlow; label: string; description: string }[] = [
  { value: "otp", label: "otp", description: "Identifier, code, new password, done — SCW and SMILE Admin." },
  { value: "link", label: "link", description: "Identifier, then a reset link is sent — E-Anudaan and SAMBAL." },
  { value: "contact", label: "contact", description: "No self-service; the page says who resets passwords — PM-AJAY." },
];

export function PortalRecoveryTemplateSpecimen(): React.JSX.Element {
  const [flow, setFlow] = React.useState<PortalRecoveryFlow>("otp");

  return (
    <div className="cdp-stack">
      <RadioGroup
        name="recovery-flow"
        legend="Flow"
        value={flow}
        onChange={(v: string) => setFlow(v as PortalRecoveryFlow)}
        options={FLOWS}
      />
      <PortalRecoveryTemplate
        key={flow}
        headingLevel={2}
        config={{
          ...BASE,
          flow,
          continueHref: flow === "link" ? "#" : undefined,
          contact:
            flow === "contact"
              ? "Passwords for this portal are reset by the NIC helpdesk: 1800-111-555, toll-free, 9 am to 6 pm."
              : undefined,
        }}
        onVerify={(otp) => (otp === "000000" ? { ok: false, error: "That code is not correct." } : { ok: true })}
      />
    </div>
  );
}
