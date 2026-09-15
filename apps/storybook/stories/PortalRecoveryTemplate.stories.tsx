import type { Meta, StoryObj } from "@storybook/react";
import { PortalRecoveryTemplate } from "@mosje/design-system";
import type { PortalRecoveryConfig } from "@mosje/design-system";

/**
 * **PortalRecoveryTemplate** — a portal's password recovery on the login page's
 * own chrome, in one of three flows.
 *
 * - `otp` — identifier, code, new password, confirmation (SCW, SMILE Admin).
 * - `link` — identifier, then "Reset Link Sent"; the reset page is the same
 *   template with `startAt="reset"` (E-Anudaan, SAMBAL).
 * - `contact` — one notice naming who resets passwords (PM-AJAY).
 *
 * `onRequest`, `onVerify` and `onReset` each return `{ ok: false, error }` to
 * keep the reader on the step with the reason against the field. `onStepChange`
 * reports each step reached. On the `link` flow `onRequest` must never say an
 * account does not exist — the confirmation is worded so it does not.
 *
 * Renders structurally but unstyled in Storybook, as the login template does:
 * the hub builds the Tailwind the shell's layout uses.
 */
const brandAssets = {
  emblemSrc: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='64'/>",
  digitalIndiaSrc: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='44'/>",
  samaveshLogoSrc: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'/>",
};

const scw: PortalRecoveryConfig = {
  portalId: "scw",
  portalName: "Senior Citizens Welfare",
  brandAssets,
  flow: "otp",
  loginHref: "#login",
};

const meta = {
  title: "Components/PortalRecoveryTemplate",
  component: PortalRecoveryTemplate,
  args: { config: scw, headingLevel: 1 },
  argTypes: { config: { control: false } },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=56640-4103",
    },
    layout: "fullscreen",
  },
} satisfies Meta<typeof PortalRecoveryTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The `otp` flow. The code 000000 is refused, so the wrong-code state is reachable. */
export const OtpFlow: Story = {
  args: {
    onVerify: (otp: string) => (otp === "000000" ? { ok: false, error: "That code is not correct." } : { ok: true }),
    onStepChange: (step) => console.info("step ->", step),
  },
};

/** The `link` flow's first half, with the prototype's onward button. */
export const LinkFlow: Story = {
  args: {
    config: { ...scw, portalName: "E-Anudaan", flow: "link", identifierLabel: "Username or Mobile Number", continueHref: "#reset" },
    onRequest: (value: string) => (value.length < 3 ? { ok: false, error: "Enter a username or mobile number." } : { ok: true }),
  },
};

/** The page the emailed link lands on: `startAt="reset"`, straight to Set New Password. */
export const LinkFlowResetPage: Story = {
  args: {
    config: { ...scw, portalName: "E-Anudaan", flow: "link", minPasswordLength: 10 },
    startAt: "reset",
    onReset: () => ({ ok: true }),
  },
};

/** The `contact` flow — no form; the page says who resets passwords. */
export const ContactFlow: Story = {
  args: {
    config: {
      ...scw,
      portalName: "PM-AJAY",
      flow: "contact",
      contact: "Passwords for this portal are reset by the NIC helpdesk: 1800-111-555, toll-free, 9 am to 6 pm.",
    },
  },
};
