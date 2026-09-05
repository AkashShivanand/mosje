"use client";

import * as React from "react";
import { Checkbox, PortalLoginTemplate, type PortalLoginConfig } from "@mosje/design-system";

type PortalRoleTab = PortalLoginConfig["roles"][number];

/**
 * The arrangements the config decides, switched one at a time on a live
 * template. The Figma page's arrangements section draws the same list on the
 * Auth Form Card — its seven booleans, the OTP form after its cooldown, the
 * dual prompt — and the three props only code has: `error`, `loading` and
 * `roleId`. A designer reading the library and a developer reading this page
 * see one set.
 */
interface Switches {
  roleTabs: boolean;
  digilocker: boolean;
  methodTabs: boolean;
  accountPrompt: boolean;
  captcha: boolean;
  error: boolean;
  loading: boolean;
  officer: boolean;
}

const CONTROLS: { key: keyof Switches; label: string }[] = [
  { key: "roleTabs", label: "Role tabs (two roles)" },
  { key: "digilocker", label: "DigiLocker card" },
  { key: "methodTabs", label: "Method tabs (password + OTP)" },
  { key: "accountPrompt", label: "Account prompt (registerHref)" },
  { key: "captcha", label: "Captcha on the citizen role" },
  { key: "error", label: "error" },
  { key: "loading", label: "loading" },
  { key: "officer", label: 'roleId="officer"' },
];

const BRAND = {
  emblemSrc: "/design-system/national-emblem.svg",
  digitalIndiaSrc: "/website/images/digital-india-logo.svg",
  // org-logo-exempt(specimen): a required explicit-path prop; see the shell's specimen.
  samaveshLogoSrc: "/design-system/samavesh-logo.svg",
  digilockerLogoSrc: "/design-system/digilocker-mark.png",
};

export function PortalLoginTemplateArrangements(): React.JSX.Element {
  const [s, setS] = React.useState<Switches>({
    roleTabs: true,
    digilocker: true,
    methodTabs: true,
    accountPrompt: true,
    captcha: false,
    error: false,
    loading: false,
    officer: false,
  });
  const toggle = (k: keyof Switches) => setS((v) => ({ ...v, [k]: !v[k] }));

  const config = React.useMemo<PortalLoginConfig>(() => {
    const citizen: PortalRoleTab = {
      id: "citizen",
      audience: "citizen",
      label: "Citizen",
      description: "For a member of the public tracking their own application.",
      authModes: s.methodTabs ? ["password", "otp"] : ["password"],
      defaultMode: "password",
      digilocker: s.digilocker,
      captcha: s.captcha,
    };
    const officer: PortalRoleTab = {
      id: "officer",
      audience: "officer",
      label: "Officer",
      description: "For a departmental officer processing applications.",
      authModes: ["password"],
    };
    return {
      portalId: "nmba",
      portalName: "Nasha Mukt Bharat Abhiyaan",
      changeHref: "#",
      brandAssets: BRAND,
      links: {
        digilockerHref: s.digilocker ? "https://digilocker.gov.in/" : undefined,
        forgotPasswordHref: "#",
        registerHref: s.accountPrompt ? "#" : undefined,
        helpFaqHref: "#",
        termsHref: "#",
        privacyHref: "#",
      },
      botCheck: { mode: "invisible", helpHref: "#" },
      roles: s.roleTabs ? [citizen, officer] : [citizen],
    };
  }, [s]);

  return (
    <div className="cdp-stack">
      <fieldset
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--sa-inline-16)",
          border: "1px solid var(--sa-border-neutral-subtle)",
          borderRadius: "var(--sa-shape-8)",
          padding: "var(--sa-padding-12) var(--sa-padding-16)",
          margin: 0,
        }}
      >
        <legend
          style={{
            fontSize: "var(--sa-type-label-3-size)",
            lineHeight: "var(--sa-type-label-3-lh)",
            textTransform: "uppercase",
            color: "var(--sa-text-brand-primary-base)",
            padding: "0 var(--sa-padding-4)",
          }}
        >
          Arrangements
        </legend>
        {CONTROLS.map((c) => (
          <Checkbox key={c.key} size="sm" label={c.label} checked={s[c.key]} onChange={() => toggle(c.key)} />
        ))}
      </fieldset>
      <PortalLoginTemplate
        config={config}
        deepLinkRole={false}
        headingLevel={2}
        error={s.error ? "The username or password is incorrect. Check both and try again, or use Forgot Password." : null}
        loading={s.loading}
        roleId={s.officer ? "officer" : undefined}
        onSubmit={() => undefined}
      />
    </div>
  );
}
