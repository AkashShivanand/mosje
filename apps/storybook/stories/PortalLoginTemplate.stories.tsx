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
 * role tabs, the login-method selector and the correct fields for each
 * `PortalAuthMode` — `password`, `otp`, `pin` and `digilocker`. (`darpan` and
 * `aadhaar` were removed on 2026-08-17: a full read of the handoff found no such
 * screen in any portal.) Submitting calls `onSubmit` with a `LoginSubmitPayload`
 * carrying the role, the mode and the credentials. A PIN arrives as
 * `credentials.pin`, never as `credentials.password`.
 *
 * ### The captcha is OFF unless the portal asks for it
 *
 * `config.captcha` adds the security-code field to the password and PIN forms,
 * and it defaults to `false` deliberately. A captcha is a cognitive function
 * test, and WCAG 2.2 3.3.8 Accessible Authentication (AA) forbids one without an
 * alternative. Switch it on only for a portal that offers that alternative, and
 * say which in the same change. The Figma master mirrors this: `Show captcha` on
 * `Auth / AuthFormCard` is `false` by default for the same reason.
 *
 * ### Landing on a specific role tab
 *
 * `deepLinkRole` (on by default) selects the role from `?role=<id>` on mount and
 * keeps the URL in step as the reader switches tabs, so a login opened from a
 * citizen surface lands on the citizen tab and one opened from an officer
 * directory lands on the officer tab. Build the link with `portalLoginUrl`
 * rather than concatenating — it is the one place that knows the parameter is
 * called `role`. The legacy `#role-<id>` hash is still read as a fallback, so
 * links shared before this existed keep working.
 *
 * `roleId` overrides both the URL and `config.defaultRoleId` for a caller that
 * already knows who is arriving; `onRoleChange` reports every switch. Set
 * `deepLinkRole={false}` to opt out entirely — worth doing for a specimen or a
 * story, where rewriting the page's URL would be surprising.
 *
 * Three behaviours that are easy to get wrong, and are deliberate: an id
 * matching no role is IGNORED so a stale link opens the default tab rather than
 * breaking; the URL is rewritten with `replaceState` not `pushState`, because a
 * tab is a view of one page and Back should leave the page rather than undo
 * three tab switches; and the selection runs in an effect AFTER mount, costing
 * one frame of the default tab, because reading `window` during render would
 * make the server and client disagree and a hydration mismatch is worse than a
 * flicker.
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
  /*
   * `deepLinkRole` is OFF for every story. It is on by default in the product,
   * but in Storybook a story that rewrote the surrounding page's URL on each tab
   * click would fight the addon's own routing and leave `?role=` on the docs
   * page. The behaviour is demonstrated in the DeepLinkedRole story below by
   * passing `roleId` directly, which is the same code path minus the URL write.
   */
  args: { config: eAnudaan, loading: false, error: null, deepLinkRole: false },
  argTypes: {
    config: { control: false },
    loading: { control: "boolean" },
    error: { control: "text" },
    onSubmit: { control: false },
    onFooterLinkClick: { control: false },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55397-1364"
    }, layout: "fullscreen" },
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
 * **Every login method in one place.** A single role exposing all four
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
          description: "A specimen role carrying all four modes for review.",
          authModes: ["password", "otp", "pin", "digilocker"],
          authSelectorType: "dropdown",
          defaultMode: "password",
        },
      ],
    },
  },
};

/**
 * **A PIN portal, with the captcha switched on.**
 *
 * The National Overseas Scholarship signs in on a registered identifier and a
 * six-digit numeric PIN — both its screens in the handoff are `Sign In Pin`, so
 * `pin` is a real mode rather than a variation of `password`. The field takes
 * digits only, is masked with a Show/Hide toggle, and recovers through
 * "Forgot PIN?" rather than the password link.
 *
 * `captcha: true` is set here to show the field, and it is the exception rather
 * than the pattern: leave it off unless the portal offers a non-cognitive way
 * through (WCAG 2.2 3.3.8).
 */
export const PinLogin: Story = {
  args: {
    config: {
      ...eAnudaan,
      portalId: "nos",
      portalName: "National Overseas Scholarship",
      portalDescription:
        "Scholarship for Scheduled Caste, Denotified Nomadic and Semi-Nomadic Tribe, Landless Agricultural Labourer and Traditional Artisan candidates studying abroad.",
      captcha: true,
      roles: [
        {
          id: "applicant",
          label: "Applicant",
          audience: "citizen",
          description: "Candidates registered for the scholarship.",
          authModes: ["pin"],
          defaultMode: "pin",
        },
      ],
      links: {
        forgotPasswordHref: "/portals/nos/forgot-pin",
        registerHref: "/portals/nos/register",
        helpFaqHref: "/portals/nos/help",
      },
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

/**
 * **Landing on a specific role tab.**
 *
 * In the product this comes from the URL — `/portals/e-anudaan/login?role=ngo`,
 * built with `portalLoginUrl`. Here it is passed as `roleId`, which is the same
 * selection path without the URL write, so the story does not rewrite the page's
 * address on every click.
 *
 * Note what is NOT happening: the config's own `defaultRoleId` is being
 * overridden. That is the point — the tab a reader lands on should follow the
 * door they came through, not a constant baked into the portal.
 */
export const DeepLinkedRole: Story = {
  args: {
    roleId: eAnudaan.roles[eAnudaan.roles.length - 1]?.id,
    onRoleChange: (id: string) => console.info("role ->", id),
  },
};

/**
 * **Embedded in a page that already has an `<h1>`.**
 *
 * The form heading is the page's `<h1>` by default, which is what a real login
 * page needs and what GIGW 3.0's one-h1-per-page rule assumes. Wherever the
 * template sits INSIDE another page — the documentation page for it, a modal in
 * an authenticated shell — `headingLevel` demotes it so the host page keeps a
 * single first-level heading and its outline stays readable.
 */
export const EmbeddedHeadingLevel: Story = {
  args: {
    headingLevel: 2,
  },
};
