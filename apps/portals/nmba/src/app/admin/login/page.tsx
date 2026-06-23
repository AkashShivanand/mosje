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
import { useToast } from "@/components/toast";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button, Input, FormField, Alert, DemoFab, PortalLoginShell } from "@mosje/design-system";

const BASE = "/portals/nmba";

const DEMO_ACCOUNTS = [
  { role: "Admin", id: "9999999999", password: "Demo@123" },
];

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
      if (mobile.length === 10 && password.length > 0) {
        document.cookie = `nmba_admin_session=mock-session-token; path=/; max-age=${60 * 60 * 8}`;
        toast("Logged in successfully.", "success");
        router.push("/admin/dashboard");
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
