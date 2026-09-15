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
 *
 * The last five switches arrived on 2026-09-14 with the portals moving onto the
 * template: an OTP sent to an email (the Transgender Portal), a "Your role"
 * select inside a tab and two registration routes (SCW), a field-level error
 * after submit, and a code request the portal refuses (NMBA's Project Id).
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
  otpEmail: boolean;
  subRoles: boolean;
  registerOptions: boolean;
  fieldErrors: boolean;
  refuseOtp: boolean;
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
  { key: "otpEmail", label: 'otpIdentifierKind="email"' },
  { key: "subRoles", label: "Sub-roles (Your role)" },
  { key: "registerOptions", label: "Two register options" },
  { key: "fieldErrors", label: "fieldErrors" },
  { key: "refuseOtp", label: "onRequestOtp refuses" },
];

const FIELD_ERRORS = {
  identifier: "That username is not registered on this portal.",
  secret: "The password is incorrect.",
};

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
    otpEmail: false,
    subRoles: false,
    registerOptions: false,
    fieldErrors: false,
    refuseOtp: false,
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
      otpIdentifierKind: s.otpEmail ? "email" : "mobile",
      subRoles: s.subRoles
        ? [
            { id: "volunteer", label: "Volunteer" },
            { id: "sage", label: "SAGE Organisation" },
          ]
        : undefined,
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
        registerOptions:
          s.accountPrompt && s.registerOptions
            ? [
                { label: "Volunteer", href: "#" },
                { label: "SAGE Organisation", href: "#" },
              ]
            : undefined,
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
        fieldErrors={s.fieldErrors ? FIELD_ERRORS : null}
        onRequestOtp={() =>
          s.refuseOtp ? { ok: false, error: "No account is registered to that address." } : { ok: true }
        }
        onSubmit={() => undefined}
      />
    </div>
  );
}
