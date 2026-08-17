import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  DemoFab,
  FormField,
  Input,
  OtpInput,
  PasswordInput,
  PortalLoginShell,
} from "@mosje/design-system";

/**
 * **PortalLoginShell** — the shared full-page login layout every MoSJE portal
 * signs in through.
 *
 * It is a **page template**, and that is deliberate: `CLAUDE.md` requires
 * page-level layouts to live in the design system and be reused, so only the
 * slot content changes per portal. Never rebuild a login page. What varies is
 * the brand assets, the portal name in the "SIGNING INTO" strip, the tabs, and
 * the form itself.
 *
 * The three `*Src` props are **URLs, not imports**, because each portal is
 * mounted under its own basePath — e.g.
 * `/portals/nmba/brand/national-emblem.svg`. The shell cannot resolve that, so
 * the app passes the path.
 *
 * `tabs` carry their own `active` flag and `href`; they are **navigation**, not
 * local state. Each login method is its own route, so a user can be sent
 * straight to the OTP tab by link and the back button behaves.
 *
 * Every portal login must also carry a **demo credentials panel** — see
 * `.claude/rules/portal-login-demos.md`. The last story shows the shell with
 * `DemoFab` in place, which is how it actually ships in review builds.
 *
 * `extraContent` is a slot **below** the form, inside the card. It is for
 * content that belongs to the page rather than the credentials — the portal
 * switcher grid on E-Anudaan's officer login, a demo-data notice. Prefer
 * `children` for anything the user has to fill in: putting a field in
 * `extraContent` places it after the submit button, which is the wrong tab
 * order.
 *
 * > **A caveat about this page in Storybook.** The shell's own layout is
 * > written in Tailwind utility classes, and Tailwind is built by the hub, not
 * > by Storybook. So it renders here **structurally but unstyled** — the
 * > content, tabs, slots and form wiring are all real, the page furniture is
 * > not. Judge the composition here; judge the appearance in the hub at
 * > `/portals/<slug>/login`.
 *
 * Lifecycle: **Stable**.
 */

/**
 * Placeholder brand *assets*. Each portal passes basePath-aware paths to its
 * own `public/` folder instead.
 */
const asset = (label: string, w: number, h: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      `<rect width="${w}" height="${h}" fill="none" stroke="#9ca3af" stroke-dasharray="3 3"/>` +
      `<text x="${w / 2}" y="${h / 2 + 4}" font-family="Noto Sans, sans-serif" font-size="10" fill="#6b7280" text-anchor="middle">${label}</text>` +
      `</svg>`,
  )}`;

const meta = {
  title: "Components/PortalLoginShell",
  component: PortalLoginShell,
  args: {
    emblemSrc: asset("Emblem", 48, 64),
    digitalIndiaSrc: asset("Digital India", 120, 44),
    samaveshLogoSrc: asset("SAMAVESH", 64, 64),
    signingInto: "Nasha Mukt Bharat Abhiyaan",
    changeHref: "/",
    tabs: [
      { label: "Password", href: "/portals/nmba/admin/login", active: true },
      { label: "OTP", href: "/portals/nmba/admin/login-otp", active: false },
    ],
    children: null,
  },
  argTypes: {
    signingInto: { control: "text" },
    changeHref: { control: "text" },
    emblemSrc: { control: false },
    digitalIndiaSrc: { control: false },
    samaveshLogoSrc: { control: false },
    tabs: { control: false },
    children: { control: false },
    onFooterLinkClick: { control: false },
  },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PortalLoginShell>;

export default meta;
type Story = StoryObj<typeof meta>;

function PasswordForm() {
  const [mobile, setMobile] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <form id="login-form" style={{ display: "grid", gap: 16 }} onSubmit={(e) => e.preventDefault()}>
      <h1 style={{ margin: 0 }}>Sign in</h1>
      <FormField label="Mobile number" required hint="10 digits, no prefix">
        {(c) => (
          <Input
            {...c}
            inputMode="numeric"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="98900 01234"
          />
        )}
      </FormField>
      <FormField label="Password" required>
        {(c) => (
          <PasswordInput {...c} value={password} onChange={(e) => setPassword(e.target.value)} />
        )}
      </FormField>
      <Button type="submit">Sign in</Button>
    </form>
  );
}

/** The password tab — the default login method for most portals. */
export const PasswordTab: Story = {
  render: (args) => (
    <PortalLoginShell {...args}>
      <PasswordForm />
    </PortalLoginShell>
  ),
};

/**
 * The OTP tab active. Note the tab is a **route**, not local state — this is a
 * different URL, so it can be linked to directly and the back button works.
 */
export const OtpTab: Story = {
  render: function Render(args) {
    const [code, setCode] = React.useState("");
    return (
      <PortalLoginShell
        {...args}
        tabs={[
          { label: "Password", href: "/portals/nmba/admin/login", active: false },
          { label: "OTP", href: "/portals/nmba/admin/login-otp", active: true },
        ]}
      >
        <form id="login-form" style={{ display: "grid", gap: 16 }} onSubmit={(e) => e.preventDefault()}>
          <h1 style={{ margin: 0 }}>Sign in with a one-time password</h1>
          <p style={{ margin: 0, color: "var(--sa-color-text-muted)" }}>Sent to 98900 01234.</p>
          <OtpInput label="One-time password" value={code} onValueChange={setCode} />
          <Button type="submit">Verify and sign in</Button>
        </form>
      </PortalLoginShell>
    );
  },
};

/** A different portal — only the assets, the name and the tabs change. */
export const ADifferentPortal: Story = {
  args: {
    signingInto: "PM-AJAY — Pradhan Mantri Anusuchit Jaati Abhyuday Yojana",
    tabs: [{ label: "Employee ID", href: "/portals/pm-ajay/login", active: true }],
  },
  render: (args) => (
    <PortalLoginShell {...args}>
      <PasswordForm />
    </PortalLoginShell>
  ),
};

/** A single login method — the tab strip still renders, with one pill. */
export const SingleTab: Story = {
  args: {
    tabs: [{ label: "Password", href: "/portals/scw/login", active: true }],
    signingInto: "Senior Citizen Welfare",
  },
  render: (args) => (
    <PortalLoginShell {...args}>
      <PasswordForm />
    </PortalLoginShell>
  ),
};

/**
 * How it ships in a review build: the shell plus `DemoFab`, which is mandatory
 * on every portal login so reviewers can sign in without a real account.
 */
export const WithDemoCredentials: Story = {
  render: (args) => (
    <PortalLoginShell {...args}>
      <PasswordForm />
      <DemoFab
        devMode
        accounts={[
          { role: "Admin", id: "9999999999", password: "Demo@123" },
          { role: "State Nodal Officer (Maharashtra)", id: "9890123456", password: "Demo@123" },
          { role: "District Nodal Officer (Pune)", id: "9890001234", password: "Demo@123" },
        ]}
      />
    </PortalLoginShell>
  ),
};
