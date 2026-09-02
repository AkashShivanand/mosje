"use client";

import * as React from "react";
import { PortalLoginTemplate, type PortalLoginConfig } from "@mosje/design-system";

/**
 * The template, running, from one config object.
 *
 * Three roles with different authentication modes, so the specimen shows what
 * the config actually decides: the tab strip, the mode selector's presentation,
 * which fields the form draws, and the two things that are switched per role
 * rather than per portal — the DigiLocker card (Citizen) and the security
 * captcha (Implementing Agency).
 *
 * `deepLinkRole` is OFF here. On a real login page it is the point of the
 * component — but on a documentation page it would rewrite this page's URL with
 * `?role=…` as the reader tries the tabs.
 *
 * `headingLevel` is 2 for the same class of reason: this page already has an
 * `<h1>`, and GIGW 3.0 allows one per page.
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
    // DigiLocker's own mark, cropped from the handoff's logo slot. There is no
    // default for it: a portal mounts under its own basePath, so the path has
    // to come from the caller.
    digilockerLogoSrc: "/design-system/digilocker-mark.png",
  },
  links: { digilockerHref: "https://digilocker.gov.in/" },
  roles: [
    {
      id: "citizen",
      audience: "citizen",
      label: "Citizen",
      description: "For a member of the public tracking their own application.",
      // All three form modes on one role, so the specimen shows every field set
      // the template can draw. A real portal offers what its own register uses.
      authModes: ["password", "otp", "pin"],
      defaultMode: "password",
      // On the citizen tab only — switch to Officer or Implementing Agency and
      // both the card and its divider go, which is the rule the handoff sets.
      digilocker: true,
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
      // On this tab only. An agency signing in on behalf of a shelter home is a
      // different risk from a citizen checking their own application, and the
      // captcha follows the tab rather than the portal for that reason.
      captcha: true,
    },
  ],
};

export function PortalLoginTemplateSpecimen(): React.JSX.Element {
  return (
    <PortalLoginTemplate
      config={CONFIG}
      deepLinkRole={false}
      headingLevel={2}
      onSubmit={() => undefined}
    />
  );
}
