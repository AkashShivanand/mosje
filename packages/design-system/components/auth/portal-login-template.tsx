"use client";

import * as React from "react";
import { AccountPrompt, AuthDivider, ConsentLine, SSOButton } from "./auth-parts";
// DS Audit: every control below already existed in the barrel and every one was
// hand-rolled in this file instead — 77 arbitrary-value Tailwind classes wrapping
// `var(--sa-*)`, 8 raw inputs, 8 raw labels, 6 raw buttons and a raw select, with
// ZERO design-system imports. That is why the screen drifted from the design:
// nothing tied it to the components the design is drawn from.
// Alert ✅ · Button ✅ · FormField ✅ · Input ✅ · OtpInput ✅ · PasswordInput ✅
// · RadioGroup ✅ · Select ✅ · Tabs ✅ · BotCheck ➕ added in this change.
// ConsentLine ✅ and AccountPrompt ✅ were exported by the system and rendered by
// NOTHING — the consent sentence GIGW requires existed only in the Figma drawing.
import { Alert } from "../feedback/alert";
import { Button } from "../actions/button";
import { BotCheck } from "../forms/bot-check";
import { useBotCheck } from "../forms/use-bot-check";
import { RadioGroup } from "../forms/control-group";
import { FormField } from "../forms/form-field";
import { Input } from "../forms/input";
import { OtpInput } from "../forms/otp-input";
import { PasswordInput } from "../forms/password-input";
import { Select } from "../forms/select";
import { Tabs } from "../navigation/tabs";
import "./portal-login-template.css";
import { PortalLoginShell, PortalLoginTab } from "./portal-login-shell";
import { portalLoginUrl, roleFromUrl } from "./portal-login-url";
import {
  PortalLoginConfig,
  PortalAuthMode,
  PortalAuthModeOption,
  LoginSubmitPayload,
} from "./types";

export { portalLoginUrl, roleFromUrl, ROLE_PARAM } from "./portal-login-url";

/**
 * A `Record` rather than a ternary chain, so adding a mode to `PortalAuthMode`
 * fails to compile until it has a label. The chain this replaced had the fourth
 * arm as its `else`, which is how DigiLocker came to be labelled as a login
 * method at all.
 */
const MODE_LABELS: Record<PortalAuthMode, string> = {
  password: "Login via Password",
  otp: "Login via Mobile OTP",
  pin: "Login via PIN",
  darpan: "Login with NGO-DARPAN ID",
};

/**
 * A field label with its recovery route on the same row.
 *
 * The reference (`56693:8704`) puts "Forgot Password?" on the label line rather
 * than under the input — where a citizen looks BEFORE they have failed rather
 * than after. It is passed as `FormField`'s `label`, so associating it with the
 * control is still `FormField`'s job.
 */
function LabelWithLink({ text, href, linkText }: { text: string; href?: string; linkText: string }): React.JSX.Element {
  if (!href) return <>{text}</>;
  return (
    <span className="ds-plogin__labelrow">
      <span>{text}</span>
      <a href={href}>{linkText}</a>
    </span>
  );
}

export interface PortalLoginTemplateProps {
  /** Declarative configuration object for the portal */
  config: PortalLoginConfig;
  /** Submission callback triggered when the form is submitted */
  onSubmit?: (payload: LoginSubmitPayload) => void | Promise<void>;
  /** Loading state during form submission */
  loading?: boolean;
  /** Error message to display inside the alert banner */
  error?: string | null;
  /** Called when a footer link is clicked */
  onFooterLinkClick?: (link: "privacy" | "contact" | "about") => void;
  /**
   * Force the active role, overriding both the URL and `config.defaultRoleId`.
   *
   * For a caller that already knows who is arriving — a route that only officers
   * reach, say. Leave it unset to let the URL decide.
   */
  roleId?: string;
  /** Called with the role id whenever the active tab changes. */
  onRoleChange?: (roleId: string) => void;
  /**
   * Select the role from the URL on mount, and keep the URL in step as the
   * reader switches tabs. @default true
   *
   * Reads `?role=<id>` first, then `#role-<id>` — the second because that was
   * the tab anchor's href before this existed, so links already shared keep
   * working. An id that matches no role is IGNORED rather than treated as an
   * error: a stale link should open the default tab, not break the page.
   */
  deepLinkRole?: boolean;
  /**
   * Heading level for the form heading. @default 1
   *
   * A real login page is the whole page, so its heading is the `<h1>` — which
   * is what GIGW 3.0 requires, and why 1 is the default. Anywhere the template
   * is EMBEDDED in a page that already has an `<h1>` — a documentation page, a
   * modal inside an authenticated shell — pass 2 or 3, or the page ships two
   * first-level headings and a screen-reader user loses the outline.
   */
  headingLevel?: 1 | 2 | 3;
}

export function PortalLoginTemplate({
  config,
  onSubmit,
  loading = false,
  error = null,
  onFooterLinkClick,
  roleId,
  onRoleChange,
  deepLinkRole = true,
  headingLevel = 1,
}: PortalLoginTemplateProps) {
  const initialRole =
    config.roles.find((r) => r.id === config.defaultRoleId) || config.roles[0];

  const [activeRoleId, setActiveRoleId] = React.useState<string>(
    initialRole ? initialRole.id : ""
  );

  const roleIds = React.useMemo(() => config.roles.map((r) => r.id), [config.roles]);

  /*
   * An explicit `roleId` wins over everything. Kept as an effect rather than as
   * initial state so a caller that resolves the role asynchronously — from a
   * session, say — still lands on the right tab.
   */
  React.useEffect(() => {
    if (roleId && roleIds.includes(roleId)) setActiveRoleId(roleId);
  }, [roleId, roleIds]);

  /*
   * URL -> tab, ONCE, AFTER MOUNT. Deliberately not a lazy `useState`
   * initialiser: that runs on the server too, where there is no `window`, and
   * guarding it with `typeof window` makes the server and the client disagree on
   * the first render — a hydration mismatch, which is worse than what this costs.
   *
   * What it costs is one frame of the default tab before the linked one takes
   * over. That is visible only as a flicker on a slow device and is the accepted
   * trade; the alternative is making this component read a framework's router,
   * which would tie a framework-agnostic package to Next.
   */
  React.useEffect(() => {
    if (!deepLinkRole || roleId) return;
    const wanted = roleFromUrl(window.location.href);
    if (wanted && roleIds.includes(wanted)) setActiveRoleId(wanted);
    // Mount only: later URL changes are the router's business, not this component's.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeRole =
    config.roles.find((r) => r.id === activeRoleId) || config.roles[0];

  // Derive normalized login method options for the active role
  const authOptions: PortalAuthModeOption[] = React.useMemo(() => {
    if (activeRole?.authModeOptions && activeRole.authModeOptions.length > 0) {
      return activeRole.authModeOptions;
    }
    const modes = activeRole?.authModes || ["password"];
    return modes.map((mode) => ({ mode, label: MODE_LABELS[mode] }));
  }, [activeRole]);

  const initialAuthMode: PortalAuthMode =
    activeRole?.defaultMode || authOptions[0]?.mode || "password";

  const [activeAuthMode, setActiveAuthMode] =
    React.useState<PortalAuthMode>(initialAuthMode);

  // Form field state
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [otp, setOtp] = React.useState("");
  // Resolved PER ROLE, portal default second, off last. The handoff asks a
  // Garima Greh organisation for a captcha and asks the same portal's citizen
  // for none, so the answer belongs to the tab rather than to the portal.
  //
  // `??`, never `||`: an explicit `captcha: false` on a role must be able to
  // switch it OFF for that role on a portal whose default is on, and `||` would
  // read that false as "unset" and fall straight through to the portal.
  //
  // OFF when neither says otherwise: a captcha is a cognitive function test, and
  // WCAG 2.2 3.3.8 Accessible Authentication (AA) forbids one without an
  // alternative. Mirrors the `Show captcha` boolean on the Figma
  // `Auth / AuthFormCard`, which defaults to false for the same reason.
  const showBotCheck = activeRole?.captcha ?? config.captcha ?? false;

  // Shared by the password and PIN forms.
  /*
   * BOTH HALVES ARE REQUIRED, exactly as for the DigiLocker card. The role asks
   * for a bot check; `botCheck.helpHref` (or the portal's help route) says where
   * a citizen goes when it will not pass them. A check with no escape hatch has
   * no accessible alternative at all — a shared connection, an older device, or a
   * screen reader that cannot complete the gesture simply locks the person out —
   * so a portal that switches one on without a route gets nothing rather than a
   * dead end.
   *
   * The mode defaults to `invisible`: the server decides from a self-hosted
   * proof-of-work token, a honeypot and rate limiting, and the citizen sees
   * nothing unless it fails. The distorted-characters test this file used to draw
   * no longer exists on the estate's recommended path at all: bots solve the audio
   * form of it over 85% of the time while only 31.2% of audio challenges get
   * three-person agreement among people, so it protected nothing and excluded
   * many. `BotCheck` was cut back to `invisible` and `checkbox` on 2026-09-03; a
   * legacy backend that can issue nothing else reaches for the deprecated
   * `CaptchaField` directly and records why in the change that does it.
   */
  /*
   * The check runs REAL proof-of-work in the browser — SHA-256 over a random
   * challenge until the digest clears 12 leading zero bits, a few hundred
   * milliseconds of actual computation. The status the citizen sees is earned,
   * not simulated.
   *
   * The half that is stubbed is the server's: the challenge is minted here
   * rather than issued and remembered by an endpoint, so a token proves work was
   * done but not that WE asked for it. `useBotCheck`'s docstring lists the four
   * things that move server-side to close that. The hook always runs — hooks
   * cannot be conditional — and its result is simply not rendered when the role
   * has not asked for a check.
   */
  const botCheckMode = config.botCheck?.mode ?? "invisible";
  const check = useBotCheck({ auto: botCheckMode !== "checkbox" });
  const botCheckHelpHref = config.botCheck?.helpHref ?? config.links?.helpFaqHref;
  const botCheck =
    showBotCheck && botCheckHelpHref ? (
      <BotCheck
        mode={botCheckMode}
        status={check.status}
        helpHref={botCheckHelpHref}
        onVerify={check.solve}
      />
    ) : null;

  // OTP resend timer state
  const [otpTimer, setOtpTimer] = React.useState(30);
  const [otpSent, setOtpSent] = React.useState(false);

  React.useEffect(() => {
    if (otpSent && otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpSent, otpTimer]);

  // Sync auth mode when active role changes
  React.useEffect(() => {
    if (activeRole) {
      const defaultMode = activeRole.defaultMode || authOptions[0]?.mode || "password";
      setActiveAuthMode(defaultMode);
    }
  }, [activeRoleId, authOptions]);

  const handleRoleChange = (nextRoleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveRoleId(nextRoleId);
    onRoleChange?.(nextRoleId);

    /*
     * `replaceState`, NOT `pushState`. A tab is a view of one page, not a place
     * you travelled to — pushing would make Back undo a tab switch instead of
     * leaving the page, so a reader who tried three tabs would need four presses
     * to get out. Replacing keeps the URL shareable and reload-safe without
     * putting anything in the history stack.
     */
    if (!deepLinkRole || typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("role", nextRoleId);
    url.hash = "";
    window.history.replaceState(null, "", url.toString());
  };

  const handleSendOtp = () => {
    if (!mobile || mobile.length < 10) return;
    setOtpSent(true);
    setOtpTimer(30);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    onSubmit({
      roleId: activeRoleId,
      authMode: activeAuthMode,
      credentials: {
        username,
        // The PIN form reuses the `password` field's state, but a consumer must
        // never receive a PIN under the name `password`.
        password: activeAuthMode === "pin" ? undefined : password,
        pin: activeAuthMode === "pin" ? password : undefined,
        mobile,
        otp,
      },
      // The proof-of-work receipt, where a check ran. A server verifies this;
      // see `useBotCheck` for what it must check and why a token it did not
      // issue has to be refused.
      botCheck: showBotCheck ? check.token : null,
    });
  };

  // Convert role config into tabs for PortalLoginShell
  const tabs: PortalLoginTab[] = config.roles.map((r) => ({
    label: r.label,
    // A real link, so middle-click and "copy link address" both land on this tab.
    href: portalLoginUrl(
      typeof window === "undefined" ? "" : window.location.pathname,
      r.id,
    ),
    active: r.id === activeRoleId,
    onClick: (e) => handleRoleChange(r.id, e),
  }));

  const selectorType = activeRole?.authSelectorType || (authOptions.length > 2 ? "radio" : "segmented");

  /*
   * Both halves are required. The role decides whether this portal offers the
   * handoff to this audience; the href decides whether there is anywhere to hand
   * off to. A card with no destination is worse than no card, so a portal that
   * sets the boolean and forgets the link gets nothing rather than a dead CTA.
   */
  const showDigiLocker = Boolean(
    activeRole?.digilocker && config.links?.digilockerHref
  );

  // The heading's LEVEL is the caller's; its size is not. Styling stays on the
  // element so an embedded template looks identical to a standalone one.
  const Heading = `h${headingLevel}` as "h1" | "h2" | "h3";
  const templateId = React.useId();

  return (
    <PortalLoginShell
      emblemSrc={config.brandAssets?.emblemSrc || "/brand/national-emblem.svg"}
      digitalIndiaSrc={config.brandAssets?.digitalIndiaSrc || "/brand/digital-india.svg"}
      samaveshLogoSrc={config.brandAssets?.samaveshLogoSrc || "/brand/samavesh-logo.svg"}
      signingInto={config.portalName}
      changeHref={config.changeHref || "/"}
      tabs={tabs}
      extraContent={config.extraContent}
      onFooterLinkClick={onFooterLinkClick}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* The reference (`56693:8704`, `Sign In — Login Form / Desktop`) heads
            the column "Log in to your account" — the citizen's own words for
            what they are doing. It used to read "Sign In to <portal>", which
            restates the portal name already standing in the hero's SIGNING INTO
            strip two hundred pixels to the left. */}
        <div>
          <Heading className="ds-plogin__title">Log in to your account</Heading>
          {activeRole?.description ? (
            <p className="ds-plogin__lede">{activeRole.description}</p>
          ) : null}
        </div>

        {error ? <Alert status="error">{error}</Alert> : null}

        {/* ── DIGILOCKER HANDOFF — ABOVE THE DIVIDER, OUTSIDE THE FORM ─────── */}
        {/* Position and visibility both come from the handoff (`10767:71293`):
            the card sits directly under the header and directly above the
            "or sign in with credentials" divider, and it appears on the Citizen
            frames only — Admin and Garima Greh carry neither the card nor the
            divider. Hence a per-role boolean rather than an audience rule.

            It is a LINK, not a submit: it leaves for the identity provider and
            takes nothing from the form with it. */}
        {showDigiLocker && (
          <div className="space-y-4 pt-1">
            <SSOButton
              href={config.links!.digilockerHref}
              markSrc={config.brandAssets?.digilockerLogoSrc}
            />
            <AuthDivider />
          </div>
        )}

        {/* ── HOW THIS ROLE PROVES ITSELF ──────────────────────────────────── */}
        {/* Drawn only when the role offers more than one way in. E-Anudaan's
            organisation applicants get Password / OTP / DARPAN ID; NOS gets PIN
            alone and therefore no selector at all. */}
        {authOptions.length > 1 && (
          <div className="pt-1">
            {selectorType === "segmented" && (
              <Tabs
                tabs={authOptions.map((o) => ({ id: o.mode, label: o.label }))}
                active={Math.max(0, authOptions.findIndex((o) => o.mode === activeAuthMode))}
                onChange={(i) => setActiveAuthMode(authOptions[i]!.mode)}
                idBase={`${templateId}-method`}
                ariaLabel="How you want to sign in"
                track="enclosed"
                indicator="pill"
              />
            )}

            {selectorType === "radio" && (
              <RadioGroup
                name={`${templateId}-method`}
                legend="How you want to sign in"
                value={activeAuthMode}
                onChange={(v: string) => setActiveAuthMode(v as PortalAuthMode)}
                options={authOptions.map((o) => ({
                  value: o.mode,
                  label: o.label,
                  hint: o.description,
                }))}
              />
            )}

            {selectorType === "dropdown" && (
              <FormField label="How you want to sign in">
                {(control) => (
                  <Select
                    {...control}
                    value={activeAuthMode}
                    onChange={(e) => setActiveAuthMode(e.target.value as PortalAuthMode)}
                  >
                    {authOptions.map((o) => (
                      <option key={o.mode} value={o.mode}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>
            )}
          </div>
        )}

        {/* ── PASSWORD ─────────────────────────────────────────────────────── */}
        {activeAuthMode === "password" && (
          <div className="space-y-3.5 pt-1">
            <FormField label="Username / Email / Mobile" required>
              {(control) => (
                <Input
                  {...control}
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter User ID or Registered Email"
                />
              )}
            </FormField>

            {/* The recovery link sits ON the label row, right-aligned — that is
                where the reference puts it, and it is the one place a citizen
                looks before they have failed rather than after. */}
            <FormField label={<LabelWithLink text="Password" href={config.links?.forgotPasswordHref} linkText="Forgot Password?" />} required>
              {(control) => (
                <PasswordInput
                  {...control}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                />
              )}
            </FormField>

            {botCheck}
          </div>
        )}

        {/* ── PIN ──────────────────────────────────────────────────────────── */}
        {/* NOS is PIN-only. Same anatomy as password, so the identifier field is
            deliberately identical — only the secret and its recovery link differ. */}
        {activeAuthMode === "pin" && (
          <div className="space-y-3.5 pt-1">
            <FormField label="Username / Email / Mobile" required>
              {(control) => (
                <Input
                  {...control}
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter User ID or Registered Mobile"
                />
              )}
            </FormField>

            <FormField label={<LabelWithLink text="PIN" href={config.links?.forgotPasswordHref} linkText="Forgot PIN?" />} required>
              {(control) => (
                <PasswordInput
                  {...control}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter your 6-digit PIN"
                />
              )}
            </FormField>

            {botCheck}
          </div>
        )}

        {/* ── DARPAN ───────────────────────────────────────────────────────── */}
        {/* E-Anudaan's organisation applicants sign in with the NGO-DARPAN
            Unique ID issued by NITI Aayog. The wizard's own fields say the
            organisation record is "Pre-filled from your login / NGO-Darpan", so
            the identity arrives with the login rather than being typed later. */}
        {activeAuthMode === "darpan" && (
          <div className="space-y-3.5 pt-1">
            <FormField
              label="NGO-DARPAN Unique ID"
              hint="The identifier issued by NITI Aayog, e.g. LGN/0000/0000000"
              required
            >
              {(control) => (
                <Input
                  {...control}
                  type="text"
                  autoComplete="organization"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toUpperCase())}
                  placeholder="Enter your NGO-DARPAN Unique ID"
                />
              )}
            </FormField>

            <FormField label={<LabelWithLink text="Password" href={config.links?.forgotPasswordHref} linkText="Forgot Password?" />} required>
              {(control) => (
                <PasswordInput
                  {...control}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                />
              )}
            </FormField>

            {botCheck}
          </div>
        )}

        {/* ── MOBILE OTP ───────────────────────────────────────────────────── */}
        {activeAuthMode === "otp" && (
          <div className="space-y-3.5 pt-1">
            <FormField label="Registered Mobile Number" required>
              {(control) => (
                <div className="flex gap-2">
                  <Input
                    {...control}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit mobile number"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    appearance="outlined"
                    onClick={handleSendOtp}
                    disabled={mobile.length < 10 || (otpSent && otpTimer > 0)}
                  >
                    {otpSent && otpTimer > 0 ? `${otpTimer}s` : otpSent ? "Resend" : "Send OTP"}
                  </Button>
                </div>
              )}
            </FormField>

            {otpSent && (
              <FormField
                label="6-Digit Verification OTP"
                hint={`OTP sent to +91 ${mobile}. Valid for 10 minutes.`}
                required
              >
                {(control) => (
                  <OtpInput
                    aria-describedby={control["aria-describedby"]}
                    invalid={control.invalid}
                    label="One-time password"
                    value={otp}
                    onValueChange={setOtp}
                  />
                )}
              </FormField>
            )}
          </div>
        )}

        {/* Additional Configurable Fields */}
        {config.extraFields}

        {/* Submit. Unconditional: every mode this form draws is a credential
            form with something to submit. */}
        <Button type="submit" loading={loading} className="mt-4 w-full">
          Log In
        </Button>

        {/* GIGW requires the consent disclosure, and the reference carries it
            directly under the button. It was exported by the system and rendered
            by nothing. */}
        <ConsentLine
          termsHref={config.links?.termsHref}
          privacyHref={config.links?.privacyHref}
        />

        {/* Registration, as the reference draws it: a rule with the question
            centred on it, then the route. Also exported and rendered by nothing. */}
        {config.links?.registerHref ? (
          <AccountPrompt
            options={[{ label: "Create Account", href: config.links.registerHref }]}
          />
        ) : null}

        {config.links?.helpFaqHref ? (
          <p className="ds-plogin__help">
            <a href={config.links.helpFaqHref}>Need Help?</a>
          </p>
        ) : null}
      </form>
    </PortalLoginShell>
  );
}
