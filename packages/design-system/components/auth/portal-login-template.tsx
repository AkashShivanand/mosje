"use client";

import * as React from "react";
import { AccountPrompt, AuthDivider, ConsentLine, SSOButton } from "./auth-parts";
import type { DemoFillDetail } from "../../demo/demo-fab";
// DS Audit: every control below already existed in the barrel and every one was
// hand-rolled in this file instead — 77 arbitrary-value Tailwind classes wrapping
// `var(--sa-*)`, 8 raw inputs, 8 raw labels, 6 raw buttons and a raw select, with
// ZERO design-system imports. That is why the screen drifted from the design:
// nothing tied it to the components the design is drawn from.
// Alert ✅ · Button ✅ · FormField ✅ · Input ✅ · OtpInput ✅ · PasswordInput ✅
// · RadioGroup ✅ · Select ✅ · Tabs ✅ · BotCheck ➕ added in this change.
// ConsentLine ✅ and AccountPrompt ✅ were exported by the system and rendered by
// NOTHING — the consent sentence GIGW requires existed only in the Figma drawing.
import { Button } from "../actions/button";
import { BotCheck } from "../forms/bot-check";
import { useBotCheck } from "../forms/use-bot-check";
import { RadioGroup } from "../forms/control-group";
import { FormField } from "../forms/form-field";
import { Select } from "../forms/select";
import { Icon } from "../utilities/icon";
import { TabPanel, Tabs } from "../navigation/tabs";
// The card's seven fixed regions and the stacks that fill its one slot. Before
// 2026-09-06 all of it was inline here: a four-armed conditional over
// `activeAuthMode` in which three arms drew the same two fields. The anatomy now
// lives in one component and the modes are interchangeable parts of it, which is
// what the Figma master was re-cut to on the same day.
import { AuthFormCard } from "./auth-form-card";
// The change-portal picker: the handoff's `E-Anudaan | Portal Switch` draws it as
// a side sheet over the login page, not a trip to the hub root.
import { breakpoint } from "../../tokens";
import { SideSheet } from "../feedback/side-sheet";
import { PortalList } from "./portal-list";
import {
  DarpanFields,
  OtpRequestFields,
  OtpVerifyFields,
  PasswordFields,
  PinFields,
} from "./credential-fields";
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
 * What the submit button says, per mode.
 *
 * A `Record`, so a new `PortalAuthMode` fails to compile until somebody has
 * decided what its button says. It used to be a ternary that asked only whether
 * the mode was OTP and gave every other mode "Log In" as its `else` — which is
 * how DARPAN came to be submitted by a button reading "Log In" while the
 * department's own screen reads "Continue with DARPAN".
 *
 * OTP takes the second of its pair once a code has been sent; every other mode
 * ignores `sent`.
 */
const PRIMARY_ACTION_LABELS: Record<PortalAuthMode, { initial: string; sent?: string }> = {
  password: { initial: "Log In" },
  pin: { initial: "Log In" },
  darpan: { initial: "Continue with DARPAN" },
  otp: { initial: "Send OTP", sent: "Verify and Log In" },
};

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
   * Offer the change-portal picker from the SIGNING INTO strip. @default true
   *
   * The handoff draws it as a side sheet over the login page. Switch it OFF for a
   * portal a reader arrived at deliberately and cannot swap out of — then the
   * strip's Change control falls back to `config.changeHref`.
   */
  portalPicker?: boolean;
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

/** The credential fields, as the tabpanel of the method tabs when those are drawn. */
function ModeFields({
  asPanel,
  idBase,
  tabId,
  children,
}: {
  asPanel: boolean;
  idBase: string;
  tabId: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return asPanel ? (
    <TabPanel idBase={idBase} tabId={tabId}>
      {children}
    </TabPanel>
  ) : (
    <>{children}</>
  );
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
  portalPicker = true,
  headingLevel = 1,
}: PortalLoginTemplateProps) {
  const initialRole =
    config.roles.find((r) => r.id === config.defaultRoleId) || config.roles[0];

  const [activeRoleId, setActiveRoleId] = React.useState<string>(() =>
    roleId && config.roles.some((r) => r.id === roleId)
      ? roleId
      : initialRole
        ? initialRole.id
        : ""
  );

  const roleIds = React.useMemo(() => config.roles.map((r) => r.id), [config.roles]);

  /**
   * An explicit `roleId` wins over everything, and it has to win in BOTH places.
   *
   * The effect this replaces carried two jobs at once, and only one of them was
   * obvious. On mount it applied `roleId` over `config.defaultRoleId`, because
   * the initial state above did not consider it; on update it caught a caller
   * that resolves the role asynchronously — from a session, say. Moving it to a
   * render-time adjustment drops the mount half, since prev and current start
   * equal, so the initialiser now takes `roleId` directly and this handles only
   * genuine changes. Splitting them is the point: each half now says which case
   * it serves.
   */
  const [prevRoleId, setPrevRoleId] = React.useState(roleId);
  if (prevRoleId !== roleId) {
    setPrevRoleId(roleId);
    if (roleId && roleIds.includes(roleId)) setActiveRoleId(roleId);
  }

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
  /*
   * The organisation's PAN, the second half of the DARPAN route's proof.
   *
   * It gets its own state rather than reusing `password`, which is what the
   * DARPAN form did while it was a clone of the password form. A PAN is a public
   * tax identifier printed on the organisation's own letterhead; a password is a
   * secret. Storing one in the other's variable is how a PAN reaches a consumer
   * labelled `password` and gets hashed into a credentials table.
   */
  const [pan, setPan] = React.useState("");
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

  /*
   * DemoDock prefill. Every hand-built login on the estate listened for this
   * event itself; a portal that adopts the template lost the demo console's
   * "Use" button until this existed. The id lands in whichever identifier the
   * active mode reads — the username field, or the mobile field for OTP.
   */
  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<DemoFillDetail>).detail;
      if (!detail) return;
      setUsername(detail.id);
      setPassword(detail.password);
      setMobile(detail.id.replace(/\D/g, "").slice(-10));
    };
    window.addEventListener("demo:fill", handler);
    return () => window.removeEventListener("demo:fill", handler);
  }, []);

  React.useEffect(() => {
    if (otpSent && otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpSent, otpTimer]);

  /**
   * The auth mode follows the active role. Only on a CHANGE — `initialAuthMode`
   * above already resolves the same expression for the first render, so the
   * effect's mount pass was setting the value it already held.
   */
  const [prevRoleForMode, setPrevRoleForMode] = React.useState(activeRoleId);
  if (prevRoleForMode !== activeRoleId) {
    setPrevRoleForMode(activeRoleId);
    if (activeRole) {
      setActiveAuthMode(activeRole.defaultMode || authOptions[0]?.mode || "password");
    }
  }

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
    // The OTP form is two steps, and the primary action IS the first step: the
    // handoff (`56693:4742`) draws one full-width "Send OTP" under the
    // identifier, then the masked row, the code boxes and "Verify and Log In".
    if (activeAuthMode === "otp" && !otpSent) {
      handleSendOtp();
      return;
    }
    if (!onSubmit) return;

    onSubmit({
      roleId: activeRoleId,
      authMode: activeAuthMode,
      credentials: {
        username,
        // The PIN form reuses the `password` field's state, but a consumer must
        // never receive a PIN under the name `password`. Nor a PAN: the DARPAN
        // route sends no password at all, because the department's screen asks
        // for none.
        password: activeAuthMode === "pin" || activeAuthMode === "darpan" ? undefined : password,
        pin: activeAuthMode === "pin" ? password : undefined,
        pan: activeAuthMode === "darpan" ? pan : undefined,
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
    // RELATIVE — a bare query string resolves against the page's own path in
    // every browser, so the server and the client render the same href. It used
    // to read `window.location.pathname` on the client and "" on the server,
    // which is a hydration mismatch on every page that uses the template.
    href: portalLoginUrl("", r.id),
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

  /* The picker is the TEMPLATE's state, not the shell's: the shell draws two
     Change controls (desktop and mobile) and both must drive one panel. */
  const [pickerOpen, setPickerOpen] = React.useState(false);

  /*
   * Which anchoring the picker takes. `breakpoint.tablet` (768) is the estate's
   * own anchor, read from the token file rather than typed here.
   *
   * FALSE UNTIL MOUNT, deliberately: there is no `window` on the server, and
   * guessing makes the first client render disagree with the server's — a
   * hydration mismatch, which costs more than the one frame of a right-anchored
   * sheet this avoids. The sheet is shut on that frame anyway, so nothing is
   * visible either way.
   */
  /*
   * WHICH PORTAL IS ALREADY OPEN, for the picker's selected card.
   *
   * Read from the page's own path rather than added to `PortalLoginConfig`: a
   * login page lives at `/portals/<slug>/login`, so the portal's path is that
   * minus the last segment, and every portal already knows it without a second
   * place to keep in step. Client-only for the same reason as `isPhone`.
   */
  const [activePortalPath, setActivePortalPath] = React.useState<string | undefined>();
  React.useEffect(() => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (parts[0] === "portals" && parts[1]) setActivePortalPath(`/portals/${parts[1]}`);
  }, []);

  const [isPhone, setIsPhone] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint.tablet - 1}px)`);
    const sync = () => setIsPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const templateId = React.useId();

  /*
   * ▸ THE SLOT'S CONTENTS — resolved ONCE, in one expression.
   *
   * Everything downstream that depends on the active mode reads this decision
   * rather than re-deciding: the button's label, the submit branch, the disabled
   * state. Four separate `activeAuthMode === …` conditionals is how the button
   * came to say "Log In" on a form whose own screen says "Continue with DARPAN".
   *
   * The OTP route resolves to a DIFFERENT STACK at each of its two steps, which
   * is the case a variant axis could never express without pretending a
   * two-screen journey was one drawing.
   */
  const credentialFields = (() => {
    switch (activeAuthMode) {
      case "password":
        return (
          <PasswordFields
            identifier={username}
            onIdentifierChange={setUsername}
            password={password}
            onPasswordChange={setPassword}
            identifierLabel={activeRole?.identifierLabel}
            identifierPlaceholder={activeRole?.identifierPlaceholder}
            forgotHref={config.links?.forgotPasswordHref}
            botCheck={botCheck}
          />
        );
      case "pin":
        return (
          <PinFields
            identifier={username}
            onIdentifierChange={setUsername}
            pin={password}
            onPinChange={setPassword}
            identifierLabel={activeRole?.identifierLabel}
            identifierPlaceholder={activeRole?.identifierPlaceholder}
            forgotHref={config.links?.forgotPasswordHref}
            botCheck={botCheck}
          />
        );
      case "darpan":
        /* No `botCheck`, and the stack takes no prop for one. The department's
           own DARPAN screen has no security check: two registry identifiers are
           not a typed secret, so there is nothing here for a check to protect. */
        return (
          <DarpanFields
            darpanId={username}
            onDarpanIdChange={setUsername}
            pan={pan}
            onPanChange={setPan}
            note={config.darpanNote}
          />
        );
      case "otp":
        return otpSent ? (
          <OtpVerifyFields
            maskedValue={`+91 ${mobile.slice(0, 2)}••••${mobile.slice(-4)}`}
            onEdit={() => {
              setOtpSent(false);
              setOtp("");
            }}
            otp={otp}
            onOtpChange={setOtp}
            secondsRemaining={otpTimer}
            onResend={handleSendOtp}
          />
        ) : (
          <OtpRequestFields mobile={mobile} onMobileChange={setMobile} />
        );
    }
  })();

  const action = PRIMARY_ACTION_LABELS[activeAuthMode];
  const actionLabel = otpSent && action.sent ? action.sent : action.initial;

  /*
   * The credential-mode switch, drawn only when the role offers more than one
   * way in. E-Anudaan's organisation applicants get Password / DARPAN ID; NOS
   * gets PIN alone and therefore no switch at all.
   */
  const methodSwitch =
    authOptions.length > 1 ? (
      <div>
        {selectorType === "segmented" && (
          <Tabs
            tabs={authOptions.map((o) => ({ id: o.mode, label: o.label }))}
            active={Math.max(0, authOptions.findIndex((o) => o.mode === activeAuthMode))}
            onChange={(i) => setActiveAuthMode(authOptions[i]!.mode)}
            idBase={`${templateId}-method`}
            ariaLabel="How you want to sign in"
            /* The OPEN list with an underline, which is what the handoff draws
               (`52380:187221`) and not what this rendered until 2026-09-06: a
               filled `enclosed` track holding pills. Two reasons the handoff is
               right. It reads as a switch between two views of the same form
               rather than as two buttons competing with the submit below it —
               and a filled track spends horizontal room on its own padding,
               which this row cannot afford.

               MEASURED 2026-09-06, and this is what settled it: "Login with
               Credentials" is 185px and "Login with DARPAN ID" is 183px. In the
               `enclosed` track that was 368px of labels in 340px of usable room
               and both clipped; on the open list they have the column's full
               384px and both fit with room to spare.

               `overflow` stays regardless. It is not the COUNT that overflows,
               it is the label width — a portal that writes a longer mode name,
               or a reader who scales text up, gets the More menu rather than a
               tab silently cut in half, and every tab stays focusable and
               arrow-reachable either way. */
            track="none"
            indicator="underline"
            overflow
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
              description: o.description,
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
    ) : null;

  return (
    <PortalLoginShell
      emblemSrc={config.brandAssets?.emblemSrc || "/brand/national-emblem.svg"}
      digitalIndiaSrc={config.brandAssets?.digitalIndiaSrc || "/brand/digital-india.svg"}
      samaveshLogoSrc={config.brandAssets?.samaveshLogoSrc || "/brand/samavesh-logo.svg"}
      signingInto={config.portalName}
      changeHref={config.changeHref || "/"}
      onChangePortal={portalPicker ? () => setPickerOpen(true) : undefined}
      portalPickerOpen={pickerOpen}
      tabs={tabs}
      extraContent={config.extraContent}
      onFooterLinkClick={onFooterLinkClick}
    >
      <AuthFormCard
        headingLevel={headingLevel}
        description={activeRole?.description}
        error={error}
        onSubmit={handleSubmit}
        /* ── DIGILOCKER HANDOFF — ABOVE THE DIVIDER, OUTSIDE THE FIELDS ─────
           Position and visibility both come from the handoff (`10767:71293`):
           the card sits directly under the header and directly above the
           "or sign in with credentials" divider, and it appears on the Citizen
           frames only — Admin and Garima Greh carry neither the card nor the
           divider. Hence a per-role boolean rather than an audience rule.

           It is a LINK, not a submit: it leaves for the identity provider and
           takes nothing from the form with it. */
        sso={
          showDigiLocker ? (
            <div className="ds-plogin__sso">
              <SSOButton
                href={config.links!.digilockerHref}
                markSrc={config.brandAssets?.digilockerLogoSrc}
              />
              <AuthDivider />
            </div>
          ) : null
        }
        methodTabs={methodSwitch}
        /* The mode's fields are the tab panel the method tabs point at. Without
           it every tab's aria-controls named an id that did not exist — axe
           aria-valid-attr-value, critical, caught by the production build and
           not by the dev server. Radio and dropdown selectors are not tablists
           and get no panel. */
        credentialFields={
          <>
            <ModeFields
              asPanel={authOptions.length > 1 && selectorType === "segmented"}
              idBase={`${templateId}-method`}
              tabId={activeAuthMode}
            >
              {credentialFields}
            </ModeFields>
            {config.extraFields}
          </>
        }
        /* One primary action per step, never two. The label comes from
           `PRIMARY_ACTION_LABELS`, so a mode cannot ship without one. */
        primaryAction={
          <Button
            type="submit"
            loading={loading}
            disabled={activeAuthMode === "otp" && !otpSent && mobile.length < 10}
            fullWidth
            iconRight={
              activeAuthMode === "darpan" ? (
                <Icon name="arrow_forward" size={20} aria-hidden="true" />
              ) : undefined
            }
          >
            {actionLabel}
          </Button>
        }
        /* GIGW requires the consent disclosure, and the reference carries it
           directly under the button. */
        consent={
          <ConsentLine
            termsHref={config.links?.termsHref}
            privacyHref={config.links?.privacyHref}
          />
        }
        /* Registration, as the reference draws it: a rule with the question
           centred on it, then the route. */
        accountPrompt={
          config.links?.registerHref ? (
            <AccountPrompt
              options={[{ label: "Create Account", href: config.links.registerHref }]}
            />
          ) : null
        }
        footer={
          config.links?.helpFaqHref ? (
            <p className="ds-plogin__help">
              <a href={config.links.helpFaqHref}>Need Help?</a>
            </p>
          ) : null
        }
      />
      {/* THE PICKER. `SideSheet` + `PortalList` — there is no third component for
          the composition, which is the Figma master's own decision.

          It is rendered INSIDE the shell so it inherits the login page's stacking
          context, and it takes `side="bottom"` on a phone because a thumb reaches
          the bottom edge and not the far one. */}
      {portalPicker && (
        <SideSheet
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          title="Choose a portal to login"
          side={isPhone ? "bottom" : "right"}
        >
          {/* NO `onSelect`. Each card stays a real `<a href>` to its portal, so
              middle-click, "copy link address" and a keyboard Enter all work, and
              the picker keeps working with JavaScript off. Intercepting the click
              would buy only closing a sheet that a full navigation discards
              anyway. */}
          <PortalList activePath={activePortalPath} />
        </SideSheet>
      )}
    </PortalLoginShell>
  );
}
