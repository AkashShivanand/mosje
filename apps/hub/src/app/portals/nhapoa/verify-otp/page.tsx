"use client";

import * as React from "react";
import Link from "next/link";
import { Button, Field, TextInput } from "@/components/nhapoa/ui";
import { Icon } from "@mosje/design-system";

/**
 * Mock OTP verify screen. Any 6-digit code is accepted (demo). Shown where the
 * live portal gates an action behind OTP; wired into the citizen flows in NHA-2.
 */
export default function VerifyOtpPage() {
  const [otp, setOtp] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "ok" | "err">("idle");

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-card">
        <h1 className="text-xl font-bold text-ink">Verify OTP</h1>
        <p className="mt-1 mb-6 text-sm text-ink-muted">
          Enter the 6-digit code sent to your registered mobile number.
        </p>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setStatus(/^\d{6}$/.test(otp) ? "ok" : "err");
          }}
        >
          <Field label="One-Time Password" required>
            <TextInput
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              className="tracking-[0.5em]"
            />
          </Field>
          {status === "ok" && <p className="text-sm font-medium text-approve-fg">Verified successfully.</p>}
          {status === "err" && <p className="text-sm font-medium text-reject-fg">Enter a valid 6-digit code.</p>}
          <Button type="submit" className="w-full">
            Verify
          </Button>
        </form>
        <Link href="/portals/nhapoa/login" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline">
          <Icon name="arrow_back" size={16} /> Back to login
        </Link>
      </div>
    </main>
  );
}
