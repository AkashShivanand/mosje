"use client";

import * as React from "react";
import { PortalLoginShell, PortalLoginTab } from "./portal-login-shell";
import {
  PortalLoginConfig,
  PortalAuthMode,
  PortalAuthModeOption,
  LoginSubmitPayload,
} from "./types";

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
}

export function PortalLoginTemplate({
  config,
  onSubmit,
  loading = false,
  error = null,
  onFooterLinkClick,
}: PortalLoginTemplateProps) {
  const initialRole =
    config.roles.find((r) => r.id === config.defaultRoleId) || config.roles[0];

  const [activeRoleId, setActiveRoleId] = React.useState<string>(
    initialRole ? initialRole.id : ""
  );

  const activeRole =
    config.roles.find((r) => r.id === activeRoleId) || config.roles[0];

  // Derive normalized login method options for the active role
  const authOptions: PortalAuthModeOption[] = React.useMemo(() => {
    if (activeRole?.authModeOptions && activeRole.authModeOptions.length > 0) {
      return activeRole.authModeOptions;
    }
    const modes = activeRole?.authModes || ["password"];
    return modes.map((mode) => ({
      mode,
      label:
        mode === "password"
          ? "Login via Password"
          : mode === "otp"
          ? "Login via Mobile OTP"
          : mode === "digilocker"
          ? "Fast-track DigiLocker SSO"
          : mode === "darpan"
          ? "Login with NGO DARPAN ID"
          : "Aadhaar e-KYC OTP",
    }));
  }, [activeRole]);

  const initialAuthMode: PortalAuthMode =
    activeRole?.defaultMode || authOptions[0]?.mode || "password";

  const [activeAuthMode, setActiveAuthMode] =
    React.useState<PortalAuthMode>(initialAuthMode);

  // Form field state
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [mobile, setMobile] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [darpanId, setDarpanId] = React.useState("");
  const [aadhaarNo, setAadhaarNo] = React.useState("");
  const [captchaInput, setCaptchaInput] = React.useState("");

  // Captcha code generator
  const [captchaCode, setCaptchaCode] = React.useState("7K9P2");
  const generateCaptcha = React.useCallback(() => {
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput("");
  }, []);

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

  const handleRoleChange = (roleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveRoleId(roleId);
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
        password,
        mobile,
        otp,
        darpanId,
        aadhaarNo,
        captcha: captchaInput,
      },
    });
  };

  // Convert role config into tabs for PortalLoginShell
  const tabs: PortalLoginTab[] = config.roles.map((r) => ({
    label: r.label,
    href: `#role-${r.id}`,
    active: r.id === activeRoleId,
    onClick: (e) => handleRoleChange(r.id, e),
  }));

  const selectorType = activeRole?.authSelectorType || (authOptions.length > 2 ? "radio" : "segmented");

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
        {/* Form Heading */}
        <div className="text-center sm:text-left">
          <h1 className="text-xl font-bold tracking-tight text-[var(--sa-color-primaryScale-800)]">
            Sign In to {config.portalName}
          </h1>
          <p className="mt-1 text-xs text-[var(--sa-text-neutral-subtle)]">
            {activeRole?.description ||
              `Access your ${activeRole?.label || "account"} workspace.`}
          </p>
        </div>

        {/* Inline Error Alert */}
        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-md border border-[var(--sa-border-status-error-base)] bg-[var(--sa-bg-status-error-subtler)] p-3 text-xs text-[var(--sa-on-bg-status-error-subtler)]"
          >
            <span aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* ── CONFIGURABLE SUB-SELECTION BELOW ROLE TABS ────────────────────── */}
        {authOptions.length > 1 && (
          <div className="space-y-1.5 pt-1">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--sa-text-neutral-subtle)]">
              Authentication Method
            </span>

            {/* VARIANT 1: SEGMENTED PILLS */}
            {selectorType === "segmented" && (
              <div className="flex rounded-lg bg-[var(--sa-bg-neutral-subtler)] p-1 text-xs">
                {authOptions.map((opt) => (
                  <button
                    key={opt.mode}
                    type="button"
                    onClick={() => setActiveAuthMode(opt.mode)}
                    className={`flex-1 rounded-md py-1.5 px-2 text-center transition ${
                      activeAuthMode === opt.mode
                        ? "bg-white text-[var(--sa-color-primaryScale-800)] shadow-sm font-semibold"
                        : "text-[var(--sa-text-neutral-subtle)] hover:text-black font-medium"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* VARIANT 2: RADIO LIST GROUP */}
            {selectorType === "radio" && (
              <div className="space-y-1.5 rounded-lg border border-[var(--sa-border-neutral-subtle)] bg-[var(--sa-bg-neutral-subtler)] p-2 text-xs">
                {authOptions.map((opt) => (
                  <label
                    key={opt.mode}
                    className={`flex items-start gap-2.5 rounded-md p-2 cursor-pointer transition ${
                      activeAuthMode === opt.mode
                        ? "bg-white border border-[var(--sa-color-primaryScale-800)]/30 shadow-sm"
                        : "hover:bg-[var(--sa-bg-neutral-subtle)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="authModeRadio"
                      value={opt.mode}
                      checked={activeAuthMode === opt.mode}
                      onChange={() => setActiveAuthMode(opt.mode)}
                      className="mt-0.5 text-[var(--sa-color-primaryScale-800)] focus:ring-0"
                    />
                    <div>
                      <span className={`block font-semibold ${activeAuthMode === opt.mode ? "text-[var(--sa-color-primaryScale-800)]" : "text-[var(--sa-text-neutral-base)]"}`}>
                        {opt.label}
                      </span>
                      {opt.description && (
                        <span className="block text-[10px] text-[var(--sa-text-neutral-subtle)] mt-0.5">
                          {opt.description}
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* VARIANT 3: DROPDOWN SELECT */}
            {selectorType === "dropdown" && (
              <select
                value={activeAuthMode}
                onChange={(e) => setActiveAuthMode(e.target.value as PortalAuthMode)}
                className="w-full rounded-md border border-[var(--sa-border-neutral-subtle)] bg-white px-3 py-2 text-xs font-semibold text-[var(--sa-text-neutral-base)] focus:border-[var(--sa-color-primaryScale-800)] focus:outline-none"
              >
                {authOptions.map((opt) => (
                  <option key={opt.mode} value={opt.mode}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* ── MODE 1: PASSWORD LOGIN ───────────────────────────────────────── */}
        {activeAuthMode === "password" && (
          <div className="space-y-3.5 pt-1">
            <div>
              <label
                htmlFor="login-username"
                className="block text-xs font-semibold text-[var(--sa-text-neutral-base)]"
              >
                Username / Email / Mobile <span className="text-[var(--sa-text-status-error-base)]">*</span>
              </label>
              <input
                id="login-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter User ID or Registered Email"
                className="mt-1 w-full rounded-md border border-[var(--sa-border-neutral-subtle)] px-3 py-2 text-sm text-[var(--sa-text-neutral-base)] focus:border-[var(--sa-color-primaryScale-800)] focus:outline-none focus:ring-1 focus:ring-[var(--sa-color-primaryScale-800)]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-[var(--sa-text-neutral-base)]"
                >
                  Password <span className="text-[var(--sa-text-status-error-base)]">*</span>
                </label>
                {config.links?.forgotPasswordHref && (
                  <a
                    href={config.links.forgotPasswordHref}
                    className="text-xs font-medium text-[var(--sa-color-primaryScale-800)] hover:underline"
                  >
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative mt-1">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full rounded-md border border-[var(--sa-border-neutral-subtle)] px-3 py-2 pr-10 text-sm text-[var(--sa-text-neutral-base)] focus:border-[var(--sa-color-primaryScale-800)] focus:outline-none focus:ring-1 focus:ring-[var(--sa-color-primaryScale-800)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--sa-text-neutral-subtle)] hover:text-black"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Captcha Block */}
            <div className="rounded-md border border-[var(--sa-border-neutral-subtle)] bg-[var(--sa-bg-neutral-subtler)] p-2.5">
              <label
                htmlFor="login-captcha"
                className="block text-xs font-semibold text-[var(--sa-text-neutral-base)]"
              >
                Security Captcha <span className="text-[var(--sa-text-status-error-base)]">*</span>
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex h-9 items-center justify-center rounded bg-[var(--sa-bg-neutral-subtle)] px-4 font-mono text-base font-bold tracking-widest text-[var(--sa-text-neutral-base)] select-none">
                  <span className="line-through decoration-gray-400">
                    {captchaCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  title="Refresh Captcha"
                  aria-label="Refresh Captcha Security Code"
                  className="rounded p-2 text-xs font-semibold text-[var(--sa-text-neutral-subtle)] hover:bg-[var(--sa-bg-neutral-subtle)]"
                >
                  ↻ Refresh
                </button>
              </div>
              <input
                id="login-captcha"
                type="text"
                required
                maxLength={6}
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Enter characters shown above"
                className="mt-2 w-full rounded-md border border-[var(--sa-border-neutral-subtle)] px-3 py-1.5 text-xs text-[var(--sa-text-neutral-base)] focus:border-[var(--sa-color-primaryScale-800)] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ── MODE 2: MOBILE OTP LOGIN ────────────────────────────────────── */}
        {activeAuthMode === "otp" && (
          <div className="space-y-3.5 pt-1">
            <div>
              <label
                htmlFor="login-mobile"
                className="block text-xs font-semibold text-[var(--sa-text-neutral-base)]"
              >
                Registered Mobile Number <span className="text-[var(--sa-text-status-error-base)]">*</span>
              </label>
              <div className="mt-1 flex gap-2">
                <div className="flex items-center rounded-md border border-[var(--sa-border-neutral-subtle)] bg-[var(--sa-bg-neutral-subtler)] px-3 text-xs font-medium text-[var(--sa-text-neutral-subtle)]">
                  +91
                </div>
                <input
                  id="login-mobile"
                  type="tel"
                  maxLength={10}
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit mobile number"
                  className="flex-1 rounded-md border border-[var(--sa-border-neutral-subtle)] px-3 py-2 text-sm text-[var(--sa-text-neutral-base)] focus:border-[var(--sa-color-primaryScale-800)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={mobile.length < 10 || (otpSent && otpTimer > 0)}
                  className="rounded-md bg-[var(--sa-color-primaryScale-800)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {otpSent && otpTimer > 0 ? `${otpTimer}s` : otpSent ? "Resend" : "Send OTP"}
                </button>
              </div>
            </div>

            {otpSent && (
              <div>
                <label
                  htmlFor="login-otp"
                  className="block text-xs font-semibold text-[var(--sa-text-neutral-base)]"
                >
                  6-Digit Verification OTP <span className="text-[var(--sa-text-status-error-base)]">*</span>
                </label>
                <input
                  id="login-otp"
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit OTP"
                  className="mt-1 w-full rounded-md border border-[var(--sa-border-neutral-subtle)] px-3 py-2 text-center font-mono text-base tracking-widest text-[var(--sa-text-neutral-base)] focus:border-[var(--sa-color-primaryScale-800)] focus:outline-none"
                />
                <p className="mt-1 text-[10px] text-[var(--sa-text-neutral-subtle)]">
                  OTP sent to +91 {mobile}. Valid for 10 minutes.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── MODE 3: DIGILOCKER SSO ─────────────────────────────────────── */}
        {activeAuthMode === "digilocker" && (
          <div className="space-y-4 py-2 text-center">
            <div className="rounded-lg border border-[var(--sa-border-brand-primary-base)] bg-[var(--sa-bg-brand-primary-subtler)] p-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--sa-bg-brand-primary-subtle)] text-[var(--sa-color-primaryScale-800)] font-bold text-xl">
                🔒
              </div>
              <h3 className="mt-2 text-sm font-bold text-[var(--sa-text-neutral-base)]">
                Fast-Track Identity Verification
              </h3>
              <p className="mt-1 text-xs text-[var(--sa-text-neutral-subtle)]">
                Sign in with DigiLocker to auto-verify your identity and retrieve required documents seamlessly.
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--sa-color-primaryScale-800)] px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-[var(--sa-color-primaryScale-900)] transition"
            >
              <span>Sign in with DigiLocker</span>
              <span>→</span>
            </button>
          </div>
        )}

        {/* ── MODE 4: NGO DARPAN ID ───────────────────────────────────────── */}
        {activeAuthMode === "darpan" && (
          <div className="space-y-3.5 pt-1">
            <div>
              <label
                htmlFor="login-darpan"
                className="block text-xs font-semibold text-[var(--sa-text-neutral-base)]"
              >
                NGO DARPAN ID <span className="text-[var(--sa-text-status-error-base)]">*</span>
              </label>
              <input
                id="login-darpan"
                type="text"
                required
                value={darpanId}
                onChange={(e) => setDarpanId(e.target.value.toUpperCase())}
                placeholder="e.g. DL/2016/0104728"
                className="mt-1 w-full rounded-md border border-[var(--sa-border-neutral-subtle)] px-3 py-2 font-mono text-sm text-[var(--sa-text-neutral-base)] focus:border-[var(--sa-color-primaryScale-800)] focus:outline-none"
              />
              <p className="mt-1 text-[10px] text-[var(--sa-text-neutral-subtle)]">
                As registered on NITI Aayog NGO DARPAN portal.
              </p>
            </div>

            <div>
              <label
                htmlFor="login-darpan-pass"
                className="block text-xs font-semibold text-[var(--sa-text-neutral-base)]"
              >
                Password <span className="text-[var(--sa-text-status-error-base)]">*</span>
              </label>
              <input
                id="login-darpan-pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Portal Password"
                className="mt-1 w-full rounded-md border border-[var(--sa-border-neutral-subtle)] px-3 py-2 text-sm text-[var(--sa-text-neutral-base)] focus:border-[var(--sa-color-primaryScale-800)] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ── MODE 5: AADHAAR OTP ────────────────────────────────────────── */}
        {activeAuthMode === "aadhaar" && (
          <div className="space-y-3.5 pt-1">
            <div>
              <label
                htmlFor="login-aadhaar"
                className="block text-xs font-semibold text-[var(--sa-text-neutral-base)]"
              >
                Aadhaar Number <span className="text-[var(--sa-text-status-error-base)]">*</span>
              </label>
              <input
                id="login-aadhaar"
                type="text"
                maxLength={12}
                required
                value={aadhaarNo}
                onChange={(e) => setAadhaarNo(e.target.value.replace(/\D/g, ""))}
                placeholder="12-digit Aadhaar Number"
                className="mt-1 w-full rounded-md border border-[var(--sa-border-neutral-subtle)] px-3 py-2 font-mono text-sm tracking-wider text-[var(--sa-text-neutral-base)] focus:border-[var(--sa-color-primaryScale-800)] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Additional Configurable Fields */}
        {config.extraFields}

        {/* Submit Button (for non-DigiLocker modes) */}
        {activeAuthMode !== "digilocker" && (
          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center rounded-md bg-[var(--sa-color-primaryScale-800)] px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-95 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Sign In →"}
          </button>
        )}

        {/* Secondary Links (Register / Help) */}
        <div className="flex items-center justify-between pt-2 text-xs text-[var(--sa-text-neutral-subtle)]">
          {config.links?.registerHref ? (
            <a
              href={config.links.registerHref}
              className="font-medium text-[var(--sa-color-primaryScale-800)] hover:underline"
            >
              New User? Register Here
            </a>
          ) : (
            <span />
          )}

          {config.links?.helpFaqHref && (
            <a
              href={config.links.helpFaqHref}
              className="hover:underline"
            >
              Need Help?
            </a>
          )}
        </div>
      </form>
    </PortalLoginShell>
  );
}
