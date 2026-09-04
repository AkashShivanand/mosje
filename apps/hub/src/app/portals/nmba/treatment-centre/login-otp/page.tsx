"use client";

// DS Audit:
//   Button       ✅ @mosje/design-system
//   Input        ✅ @mosje/design-system
//   FormField    ✅ @mosje/design-system
//   Alert        ✅ @mosje/design-system
//   PortalLoginShell ✅ @mosje/design-system (added this session)

import * as React from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, FormField, Icon, Input, PortalLoginShell, type DemoFillDetail } from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import {
  TC_SESSION_COOKIE,
  encodeSession,
  sessionFromProjectId,
} from "@/lib/nmba/treatment-centre/roles";

const BASE = "/portals/nmba";
const DEMO_OTP = "123456";

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

  // DemoDock prefill via the design-system CustomEvent.
  React.useEffect(() => {
    const handler = (e: Event) => {
      const { id, password: pw } = (e as CustomEvent<DemoFillDetail>).detail;
      setProjectId(id.toUpperCase());
      setOtp(pw);
      setError("");
      setStep("otp");
    };
    window.addEventListener("demo:fill", handler);
    return () => window.removeEventListener("demo:fill", handler);
  }, []);

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
        router.push("/portals/nmba/treatment-centre/dashboard");
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
        <h1 className="mb-1 text-headline-3 text-ink">Log in to your account</h1>
        <p className="mb-6 text-body-2 text-ink-muted">
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
              iconLeft={loading ? undefined : <Icon name="verified_user" size={16} />}
            >
              {loading ? "Sending OTP…" : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={verify} className="flex flex-col gap-4" noValidate>
            <div className="flex items-center justify-between text-body-2">
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
              iconLeft={loading ? undefined : <Icon name="key" size={16} />}
            >
              {loading ? "Verifying…" : "Verify & Login"}
            </Button>

            <button
              type="button"
              onClick={() => toast("OTP resent (demo OTP: 123456).", "info")}
              className="text-center text-label-2 text-ink-hint hover:text-navy"
            >
              Didn&apos;t receive it? <span className="font-semibold text-navy">Resend OTP</span>
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-body-3 text-ink-hint">
          For access issues, contact the IDAMS helpdesk.
        </p>
      </PortalLoginShell>
    </>
  );
}
