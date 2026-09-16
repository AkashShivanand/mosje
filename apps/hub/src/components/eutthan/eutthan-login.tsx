"use client";

// DS Audit: PortalLoginTemplate ✅ existing. The hand-drawn seal, split panel,
// form and inline "Demo Credentials" panel this replaces are gone — demo
// accounts come from the DemoDock, which the template answers on its own.

import { useState } from "react";
import { PortalLoginTemplate, type PortalLoginConfig } from "@mosje/design-system";

/**
 * E-Utthan Admin login, following the handoff (`9009:95752`): "Log in to your
 * account", User ID or Email + Password, Log In. No role tabs — the account
 * decides whether the reader is the Admin or the Ministry.
 *
 * NOT BUILT although the handoff draws them: "Forgot Password?" and "Don't have
 * an account?". Neither has a destination in this portal, and a link to nowhere
 * is worse than no link.
 */
const CONFIG: PortalLoginConfig = {
  portalId: "eutthan-admin",
  portalName: "E-Utthan",
  portalTagline: "Development Action Plan for Scheduled Castes",
  changeHref: "/portals",
  roles: [
    {
      id: "officer",
      audience: "officer",
      label: "Officer",
      authModes: ["password"],
      identifierLabel: "User ID or Email",
      identifierPlaceholder: "Enter your registered user ID or email",
    },
  ],
};

export function LoginPage({
  onLogin,
}: {
  /** Returns the error sentence, or `null` when the credentials were accepted. */
  onLogin: (u: string, p: string) => string | null;
}) {
  const [error, setError] = useState<string | null>(null);

  return (
    <PortalLoginTemplate
      config={CONFIG}
      error={error}
      onRoleChange={() => setError(null)}
      onSubmit={({ credentials }) =>
        setError(onLogin((credentials.username ?? "").trim(), credentials.password ?? ""))
      }
    />
  );
}
