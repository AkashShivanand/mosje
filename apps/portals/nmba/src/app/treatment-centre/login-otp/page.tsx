"use client";

// DS Audit:
//   Button       ✅ @mosje/design-system
//   Input        ✅ @mosje/design-system
//   FormField    ✅ @mosje/design-system
//   Alert        ✅ @mosje/design-system
//   DemoFab      ✅ @mosje/design-system
//   PortalLoginShell ✅ @mosje/design-system (added this session)

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, KeyRound } from "lucide-react";
import { Button, Input, FormField, Alert, DemoFab, PortalLoginShell } from "@mosje/design-system";
import { useToast } from "@/components/toast";
import {
  TC_SESSION_COOKIE,
  encodeSession,
  sessionFromProjectId,
} from "@/lib/treatment-centre/roles";

const BASE = "/portals/nmba";
const DEMO_OTP = "123456";

const DEMO_ACCOUNTS = [
  { role: "IRCA", id: "IRCA001", password: DEMO_OTP },
  { role: "ODIC", id: "ODIC001", password: DEMO_OTP },
  { role: "CPLI", id: "CPLI001", password: DEMO_OTP },
  { role: "DDAC", id: "DDAC001", password: DEMO_OTP },
  { role: "US", id: "US001", password: DEMO_OTP },
];

const TABS = [
  { label: "Admin", href: `${BASE}/admin/login`, active: false },
  { label: "Patient Monitoring", href: `${BASE}/treatment-centre/login-otp`, active: true },
];

export default function TreatmentCentreLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = React.useState<"id" | "otp">("id");
  const [projectId, setProjectId] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const sendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const session = sessionFromProjectId(projectId);
    if (!session) {
      setError("Unknown Project Id. Use one of the demo IDs (e.g. IRCA001).");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      toast(`OTP sent to your registered mobile (demo OTP: ${DEMO_OTP}).`, "info");
    }, 500);
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const session = sessionFromProjectId(projectId);
    if (!session) {
      setError("Unknown Project Id.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (otp.trim() === DEMO_OTP) {
        document.cookie = `${TC_SESSION_COOKIE}=${encodeSession(session)}; path=/; max-age=${60 * 60 * 8}`;
        toast("Logged in successfully.", "success");
        router.push("/treatment-centre/dashboard");
      } else {
        setError("Invalid OTP. The demo OTP is 123456.");
      }
    }, 500);
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
          Enter your Project Id to receive a one-time password
        </p>

        {step === "id" ? (
          <form onSubmit={sendOtp} className="flex flex-col gap-4" noValidate>
            <FormField label="Project Id" id="projectId" required>
              {(control) => (
                <Input
                  {...control}
                  required
                  placeholder="e.g. IRCA001"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value.toUpperCase())}
                  invalid={!!error}
                  autoComplete="off"
                />
              )}
            </FormField>

            {error && <Alert status="error">{error}</Alert>}

            <Button
              type="submit"
              disabled={loading}
              iconLeft={loading ? undefined : <ShieldCheck className="h-4 w-4" />}
            >
              {loading ? "Sending OTP…" : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={verify} className="flex flex-col gap-4" noValidate>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">
                OTP sent to <strong className="text-ink">99******40</strong>
              </span>
              <button
                type="button"
                aria-label="Edit Project Id"
                onClick={() => { setStep("id"); setOtp(""); setError(""); }}
                className="text-navy hover:underline"
              >
                Edit
              </button>
            </div>

            <FormField label="Enter OTP" id="otp" required>
              {(control) => (
                <Input
                  {...control}
                  required
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  invalid={!!error}
                  autoComplete="one-time-code"
                />
              )}
            </FormField>

            {error && <Alert status="error">{error}</Alert>}

            <Button
              type="submit"
              disabled={loading}
              iconLeft={loading ? undefined : <KeyRound className="h-4 w-4" />}
            >
              {loading ? "Verifying…" : "Verify & Login"}
            </Button>

            <button
              type="button"
              onClick={() => toast("OTP resent (demo OTP: 123456).", "info")}
              className="text-center text-xs text-ink-hint hover:text-navy"
            >
              Didn&apos;t receive it? <span className="font-semibold text-navy">Resend OTP</span>
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-ink-hint">
          For access issues, contact the IDAMS helpdesk.
        </p>
      </PortalLoginShell>

      <DemoFab
        accounts={DEMO_ACCOUNTS}
        devMode={process.env.NODE_ENV === "development"}
        onFill={(id, pw) => {
          setProjectId(id.toUpperCase());
          setOtp(pw);
          setError("");
          setStep("otp");
        }}
      />
    </>
  );
}
