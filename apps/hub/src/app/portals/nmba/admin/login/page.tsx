"use client";

// DS Audit:
//   Button           ✅ @mosje/design-system
//   Input            ✅ @mosje/design-system
//   FormField        ✅ @mosje/design-system
//   Alert            ✅ @mosje/design-system
//   DemoFab          ✅ @mosje/design-system
//   PortalLoginShell ✅ @mosje/design-system (added this session)

import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/nmba/toast";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button, Input, FormField, Alert, DemoFab, PortalLoginShell } from "@mosje/design-system";
import { accountFromMobile, DEMO_PORTAL_ACCOUNTS } from "@/lib/nmba/committee/masters";
import {
  ALL_MASS_PLEDGE_ACCOUNTS,
  massPledgeAccountFromMobile,
} from "@/lib/nmba/mass-pledge/masters";
import { PORTAL_SESSION_COOKIE, encodeSession, roleLabel, scopeLabel } from "@/lib/nmba/committee/session";

const BASE = "/portals/nmba";

// Both account sets sign in through this one form. The committee accounts are
// the pre-existing portal logins; the Mass Pledge set adds the bottom of the
// approval chain (Block) and the four non-geographic reporters.
const DEMO_ACCOUNTS = [
  ...DEMO_PORTAL_ACCOUNTS.map((a) => ({
    role: roleLabel(a.session.role),
    id: a.id,
    password: a.password,
  })),
  ...ALL_MASS_PLEDGE_ACCOUNTS.map((a) => ({
    // Spares are marked, because every other Mass Pledge account already owns a
    // seeded report and the one-report-per-account rule will refuse a second.
    role: `${roleLabel(a.session.role)} — ${scopeLabel(a.session)}${a.spare ? " · can file" : ""}`,
    id: a.id,
    password: a.password,
  })),
];

/** Landing route per role after sign-in. */
const LANDING: Record<string, string> = {
  ADMIN: `${BASE}/admin/dashboard`,
  STATE: `${BASE}/admin/napddr/state`,
  DISTRICT: `${BASE}/admin/napddr/district`,
  // Block and organisation logins exist for Mass Pledge only, so they land there.
  BLOCK: `${BASE}/admin/mass-pledge`,
  ENTITY: `${BASE}/admin/mass-pledge`,
};

const TABS = [
  { label: "Admin", href: `${BASE}/admin/login`, active: true },
  { label: "Patient Monitoring", href: `${BASE}/treatment-centre/login-otp`, active: false },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [mobile, setMobile] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const account = accountFromMobile(mobile) ?? massPledgeAccountFromMobile(mobile);
      if (account && password.length > 0) {
        document.cookie = `${PORTAL_SESSION_COOKIE}=${encodeSession(account.session)}; path=/; max-age=${60 * 60 * 8}`;
        toast("Logged in successfully.", "success");
        router.push(LANDING[account.session.role] ?? `${BASE}/admin/dashboard`);
      } else if (mobile.length === 10 && password.length > 0) {
        // Unknown-but-valid-looking number → default Admin (prototype convenience).
        document.cookie = `${PORTAL_SESSION_COOKIE}=mock-session-token; path=/; max-age=${60 * 60 * 8}`;
        toast("Logged in successfully.", "success");
        router.push(`${BASE}/admin/dashboard`);
      } else {
        setError("Invalid credentials. Please check your mobile number and password.");
      }
    }, 600);
  };

  return (
    <>
      <PortalLoginShell
        emblemSrc={`${BASE}/brand/national-emblem.svg`}
        digitalIndiaSrc={`${BASE}/brand/digital-india.svg`}
        samaveshLogoSrc={`${BASE}/brand/samavesh-logo.svg`}
        signingInto="Nasha Mukt Bharat Abhiyaan"
        tabs={TABS}
        onFooterLinkClick={() => toast("This page is coming soon.", "info")}
      >
        <h2 className="mb-1 text-xl font-bold text-ink">Log in to your account</h2>
        <p className="mb-6 text-sm text-ink-muted">
          Enter your registered mobile number and password
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <FormField label="Mobile Number" id="mobile">
            {(control) => (
              <Input
                {...control}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                required
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                aria-describedby={error ? "login-error" : undefined}
                invalid={!!error}
              />
            )}
          </FormField>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-ink">
                Password
              </label>
              <button
                type="button"
                onClick={() => toast("This page is coming soon.", "info")}
                className="text-xs text-navy hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                invalid={!!error}
                style={{ paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-hint hover:text-ink"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <Alert id="login-error" status="error">
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            disabled={loading}
            iconLeft={loading ? undefined : <LogIn className="h-4 w-4" />}
            style={{ marginTop: "4px" }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-hint">
          For access issues, contact your State Nodal Officer or the NMBA helpdesk.
        </p>
      </PortalLoginShell>

      <DemoFab
        accounts={DEMO_ACCOUNTS}
        devMode={process.env.NODE_ENV === "development"}
        onFill={(id, pw) => { setMobile(id); setPassword(pw); }}
      />
    </>
  );
}
