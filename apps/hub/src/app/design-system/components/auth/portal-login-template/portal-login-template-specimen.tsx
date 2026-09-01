"use client";

import * as React from "react";
import { PortalLoginTemplate, type PortalLoginConfig } from "@mosje/design-system";

/**
 * The template, running, from one config object.
 *
 * Three roles with different authentication modes, so the specimen shows what
 * the config actually decides: the tab strip, the mode selector's presentation,
 * and which fields the form draws.
 *
 * `deepLinkRole` is OFF here. On a real login page it is the point of the
 * component — but on a documentation page it would rewrite this page's URL with
 * `?role=…` as the reader tries the tabs.
 */
const CONFIG: PortalLoginConfig = {
  portalId: "nmba",
  portalName: "Nasha Mukt Bharat Abhiyaan",
  changeHref: "#",
  brandAssets: {
    emblemSrc: "/design-system/national-emblem.svg",
    digitalIndiaSrc: "/website/images/digital-india-logo.svg",
    // org-logo-exempt(specimen): a required explicit-path prop; see the shell's specimen.
    // The SAMAVESH wordmark is not an organisation mark and is not in the registry.
    samaveshLogoSrc: "/design-system/samavesh-logo.svg",
  },
  roles: [
    {
      id: "citizen",
      audience: "citizen",
      label: "Citizen",
      description: "For a member of the public tracking their own application.",
      authModes: ["password", "otp"],
      defaultMode: "password",
    },
    {
      id: "officer",
      audience: "officer",
      label: "Officer",
      description: "For a departmental officer processing applications.",
      authModes: ["password"],
    },
    {
      id: "organisation",
      audience: "organisation",
      label: "Implementing Agency",
      description: "For an agency reporting against a sanctioned project.",
      authModes: ["password", "otp"],
      authSelectorType: "radio",
    },
  ],
};

export function PortalLoginTemplateSpecimen(): React.JSX.Element {
  return <PortalLoginTemplate config={CONFIG} deepLinkRole={false} onSubmit={() => undefined} />;
}
