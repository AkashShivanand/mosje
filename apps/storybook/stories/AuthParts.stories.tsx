import type { Meta, StoryObj } from "@storybook/react";
import {
  AuthDivider,
  ConsentLine,
  ResendTimer,
  MaskedContactRow,
  SSOButton,
  AccountPrompt,
  SigningIntoBar,
} from "@mosje/design-system";

/**
 * **Auth parts** — the pieces every MoSJE portal login is assembled from.
 *
 * @covers AuthDivider, ConsentLine, ResendTimer, MaskedContactRow, SSOButton, AccountPrompt, SigningIntoBar
 *
 * These mirror the `Auth / *` component sets in the SAMAVESH Figma library one
 * for one. They exist because nine portals were each hand-rolling the same eight
 * fragments with eight different sets of rules; the rules now live here.
 *
 * **`AuthDivider`** — a labelled rule between two ways of signing in. Its
 * `label` names the route *below* it ("or sign in with credentials"), never a
 * bare "or", and it is `aria-hidden` because the two routes are already separate
 * controls. Takes `className`.
 *
 * **`ConsentLine`** — the standing consent sentence. The wording is fixed
 * estate-wide and deliberately has no prop: it is legal copy. Only `termsHref`,
 * `privacyHref` and `className` vary. GIGW requires the disclosure, so it is
 * never dropped to save height.
 *
 * **`ResendTimer`** — `secondsRemaining` drives everything: above zero it is
 * plain text, at zero it becomes a button wired to `onResend`. **On an
 * incorrect-OTP error, pass `0` immediately** — resending does not wait out the
 * remaining cooldown, because the code the user holds is already known-bad.
 * Copy is overridable via `waitingLabel`, `readyLabel` and `actionLabel`, plus
 * `className`.
 *
 * **`MaskedContactRow`** — `maskedValue` must arrive *already masked*; this
 * component never masks for you, and these screens are used on shared devices.
 * `channel` records whether it was a phone or an email, `onEdit` returns to the
 * previous step with the value pre-filled (never a fresh send), and `prompt`,
 * `actionLabel` and `className` tune the rest.
 *
 * **`SSOButton`** — the DigiLocker handoff. **Offer it per ROLE, not per
 * audience** (corrected 2026-09-02; it was written as an officer rule and the
 * handoff does not support one). The handoff carries the card on
 * SMILE-Transgender's Citizen frames and on neither Admin nor Garima Greh, so it
 * is narrower than "not an officer" — in `PortalLoginTemplate` that is
 * `PortalRoleTab.digilocker`. Set `href` and it renders an `<a>`, which is what a
 * handoff to an external identity provider actually is; leave it unset and it
 * stays a `<button>` for a caller running the redirect in `onClick`. `markSrc`
 * takes the provider's mark as an image path and `mark` as a node; without
 * either it draws a Material Symbols glyph. `title` and `subtitle` are
 * overridable, and the subtitle is a trust signal, not decoration.
 *
 * **`AccountPrompt`** — pass one `options` entry for a single Create Account
 * button, two when a portal registers genuinely different applicants (SCW's
 * Volunteer vs SAGE Organisation), and an empty array for portals with no
 * self-registration — which renders nothing rather than a disabled button.
 * `label` defaults sensibly per count; `className` is passed through.
 *
 * **`SigningIntoBar`** — `portalName` is the *scheme* name, never the acronym.
 * `tone` follows the **surface**: `hero` over the photograph scrim, `surface`
 * anywhere else — getting that backwards is the fastest way to fail contrast
 * here. `logoSrc`, `onChange`, `eyebrow`, `changeLabel` and `className` are the
 * rest; omit `onChange` and no Change control renders.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Auth/Auth parts",
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 390, display: "grid", gap: 32 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every part, stacked in the order a login form uses them. */
export const Playground: Story = {
  render: () => (
    <>
      <SSOButton onClick={() => {}} />
      <AuthDivider />
      <MaskedContactRow
        channel="phone"
        maskedValue="+91 98••••1234"
        onEdit={() => {}}
      />
      <ResendTimer secondsRemaining={23} onResend={() => {}} />
      <ConsentLine />
      <AccountPrompt options={[{ label: "Create Account", href: "#" }]} />
    </>
  ),
};

/**
 * **The handoff card, in both elements it can be.**
 *
 * With `href` it is an `<a>` — a real navigation to a government identity
 * provider, which is what the handoff is. Without one it is a `<button>`, for a
 * caller that runs the redirect itself. `markSrc` fills the logo slot with the
 * provider's own mark; the fallback glyph below it is what a caller gets when no
 * mark is supplied, and that is a complete card rather than a broken one.
 */
export const SSOModes: Story = {
  render: () => (
    <>
      <SSOButton
        href="https://digilocker.gov.in/"
        markSrc="/design-system/digilocker-mark.png"
      />
      <SSOButton onClick={() => {}} />
    </>
  ),
};

/**
 * The resend affordance in both states. The cooldown is **text**, not a disabled
 * button — a disabled control that flips to enabled on a timer is announced
 * badly and invites clicking.
 */
export const ResendStates: Story = {
  render: () => (
    <>
      <ResendTimer secondsRemaining={23} onResend={() => {}} />
      <ResendTimer secondsRemaining={0} onResend={() => {}} />
    </>
  ),
};

/**
 * SCW is the reason two options exist: it registers an individual Volunteer and
 * a SAGE Organisation, and making someone guess which "Create Account" means
 * them is the failure this prevents. Not for two brands of the same thing.
 */
export const RegistrationRoutes: Story = {
  render: () => (
    <>
      <AccountPrompt options={[{ label: "Create Account", href: "#" }]} />
      <AccountPrompt
        options={[
          { label: "Volunteer", href: "#" },
          { label: "SAGE Organisation", href: "#" },
        ]}
      />
    </>
  ),
};

/**
 * Tone follows the surface. The `hero` bar is shown on navy here because that is
 * the only place it is legible — rendering it on white is the contrast failure
 * the prop exists to prevent.
 */
export const SigningIntoTones: Story = {
  decorators: [(Story) => <div style={{ display: "grid", gap: 0 }}><Story /></div>],
  render: () => (
    <>
      <div style={{ background: "var(--sa-bg-brand-primary-boldest)", padding: 24 }}>
        <SigningIntoBar
          portalName="Senior Citizens Welfare"
          tone="hero"
          onChange={() => {}}
        />
      </div>
      <div style={{ background: "var(--sa-bg-neutral-base)", padding: 24 }}>
        <SigningIntoBar
          portalName="SAMBAL (NHAA 2.0)"
          tone="surface"
          onChange={() => {}}
        />
      </div>
    </>
  ),
};
