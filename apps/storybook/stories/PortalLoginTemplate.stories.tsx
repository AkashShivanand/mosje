import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PortalLoginTemplate } from "@mosje/design-system";
import type { PortalLoginConfig } from "@mosje/design-system";

/**
 * **PortalLoginTemplate** — a login page described by a **config object** rather
 * than assembled by hand.
 *
 * Where `PortalLoginShell` gives you the page furniture and leaves the form to
 * the app, this goes one step further: you hand it `config` and it renders the
 * role tabs, the login-method selector and the correct fields for each of the
 * three `PortalAuthMode`s — `password`, `otp` and `digilocker`. (`darpan` and
 * `aadhaar` were removed on 2026-08-17: a full read of the handoff found no such
 * screen in any portal.) Submitting calls `onSubmit` with a `LoginSubmitPayload`
 * carrying the role, the mode and the credentials.
 *
 * **When to reach for which.** Use this when a portal's login is one of the
 * shapes the handoff already describes — which is most of them, and the reason
 * it exists is that those shapes kept being re-typed per portal. Use
 * `PortalLoginShell` directly when the form is genuinely bespoke (an extra
 * consent step, a non-standard identity provider), because forcing a one-off
 * through a config object produces a worse page than composing it.
 *
 * **Not yet adopted.** No page renders this today; both E-Anudaan logins still
 * use `PortalLoginShell`. It is exported so adoption can happen portal by
 * portal rather than in one sweep.
 *
 * > **Status: mid-rescope.** `LOGIN-SYSTEM-ANALYSIS.md` supersedes
 * > `FIGMA-SPEC.md` §9 — the Handoff carries **69 auth screens across 10
 * > pages**, not the 25 the designer's index frame counts. This component
 * > covers the original reading. Expect the config shape to grow.
 *
 * > **A caveat about this page in Storybook.** The template's layout is written
 * > in Tailwind utility classes, and Tailwind is built by the hub, not by
 * > Storybook. It renders here **structurally but unstyled** — the roles,
 * > modes, fields and submit wiring are real; the page furniture is not. Judge
 * > the composition here, the appearance in the hub.
 *
 * Lifecycle: **Beta** — the API is expected to change with the rescope.
 */

/** Placeholder brand *assets*; each portal passes basePath-aware public paths. */
const asset = (label: string, w: number, h: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      `<rect width="${w}" height="${h}" fill="none" stroke="#9ca3af" stroke-dasharray="3 3"/>` +
      `<text x="${w / 2}" y="${h / 2 + 4}" font-family="Noto Sans, sans-serif" font-size="10" fill="#6b7280" text-anchor="middle">${label}</text>` +
      `</svg>`,
  )}`;

const brandAssets = {
  emblemSrc: asset("Emblem", 48, 64),
  digitalIndiaSrc: asset("Digital India", 120, 44),
  samaveshLogoSrc: asset("SAMAVESH", 64, 64),
};

/** E-Anudaan: two audiences on one portal — the officer console and the NGO applicant. */
const eAnudaan: PortalLoginConfig = {
  portalId: "e-anudaan",
  portalName: "E-Anudaan — Grant-in-Aid Management",
  portalTagline: "Justice. Equality. Dignity.",
  portalDescription:
    "Grant-in-Aid to voluntary organisations working for the welfare of Scheduled Castes and Other Backward Classes.",
  brandAssets,
  roles: [
    {
      id: "officer",
      label: "Ministry Officer",
      description: "Programme Division and Integrated Finance users of the Ministry.",
      authModes: ["password"],
      defaultMode: "password",
    },
    {
      id: "ngo",
      label: "NGO / Applicant",
      description: "Voluntary organisations applying for or managing a grant.",
      authModes: ["password", "otp"],
      authSelectorType: "segmented",
      defaultMode: "password",
    },
  ],
  links: {
    forgotPasswordHref: "/portals/e-anudaan/forgot-password",
    registerHref: "/portals/e-anudaan/register",
    helpFaqHref: "/portals/e-anudaan/help",
  },
};

const meta = {
  title: "Components/PortalLoginTemplate",
  component: PortalLoginTemplate,
  args: { config: eAnudaan, loading: false, error: null },
  argTypes: {
    config: { control: false },
    loading: { control: "boolean" },
    error: { control: "text" },
    onSubmit: { control: false },
    onFooterLinkClick: { control: false },
  },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PortalLoginTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default: two roles, and the NGO role offering both a password and a
 * OTP route. Switching role re-derives the available login methods.
 */
export const Playground: Story = {};

/**
 * `error` renders the inline alert above the form. It is `role="alert"`, so a
 * screen reader announces it when it appears — do not replace it with a toast
 * for validation failures the user must correct in place.
 */
export const WithError: Story = {
  args: { error: "Incorrect password. 2 attempts remaining before the account is locked." },
};

/**
 * `loading` disables submission while a request is in flight. The fields stay
 * readable rather than being blanked, so a user can still check what they typed.
 */
export const Submitting: Story = {
  args: { loading: true },
};

/**
 * **Every login method in one place.** A single role exposing all three
 * `PortalAuthMode`s — not a realistic portal, but the fastest way to review the
 * field sets side by side. Note DigiLocker is an identity handoff, not a form mode: it
 * collect a consent action, not a password.
 */
export const AllAuthModes: Story = {
  args: {
    config: {
      ...eAnudaan,
      portalName: "All login methods (specimen)",
      roles: [
        {
          id: "all",
          label: "Every method",
          description: "A specimen role carrying all three modes for review.",
          authModes: ["password", "otp", "digilocker"],
          authSelectorType: "dropdown",
          defaultMode: "password",
        },
      ],
    },
  },
};

/**
 * **A single role hides the role tabs.** A portal with one audience — most of
 * them — should not render a tab strip with one tab in it. `extraContent`
 * fills the space below the form instead; the hub uses it for the portal
 * switcher grid.
 */
export const SingleRole: Story = {
  args: {
    config: {
      ...eAnudaan,
      roles: [eAnudaan.roles[0]!],
      extraContent: (
        <p style={{ fontSize: 12 }}>
          Demonstration portal on mock data. Open the demo console (bottom-left)
          to fill an officer role.
        </p>
      ),
    },
  },
};
