"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, FormField, Icon, Input } from "@mosje/design-system";

export default function ForgetPasswordPage() {
  const [mobile, setMobile] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="space-y-lg">
      <Link
        href="/portals/smile-admin/login"
        className="inline-flex items-center gap-xs text-body-3 font-semibold text-ink-muted hover:text-primary"
      >
        <Icon name="arrow_back" size={16} /> Back to sign in
      </Link>

      <header className="space-y-sm">
        <div className="grid h-12 w-12 place-items-center rounded-md bg-primary-50 text-primary ring-8 ring-primary-50/40">
          <Icon name="key" size={20} />
        </div>
        <div className="space-y-xs">
          <h1 className="text-headline-2 font-bold tracking-tight text-ink">
            Reset your password
          </h1>
          <p className="text-body-2 text-ink-muted">
            Enter the mobile number associated with your account. We will send a one-time
            password to verify it&apos;s you.
          </p>
        </div>
      </header>

      {sent ? (
        <div className="space-y-md rounded-lg border border-success-300 bg-success-50 p-lg">
          <div className="flex items-center gap-sm">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-success-600 text-white">
              <Icon name="check_circle" size={20} />
            </span>
            <div className="text-title-2 font-semibold text-success-600">OTP sent</div>
          </div>
          <p className="text-body-3 text-ink">
            We&apos;ve sent a one-time password to{" "}
            <span className="font-semibold">
              +91 {mobile.slice(0, 2)}••••{mobile.slice(-4)}
            </span>
            . Continue on the next screen to enter it.
          </p>
          <Link href="/portals/smile-admin/reset-password">
            <Button size="md" className="w-full sm:w-auto">
              Continue to verification
            </Button>
          </Link>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (mobile.length >= 10) setSent(true);
          }}
          className="space-y-md"
        >
          <FormField
            label="Registered mobile number"
            id="mobile"
            hint="We'll send a 6-digit OTP via SMS."
          >
            {(control) => (
              <Input
                {...control}
                placeholder="9876543210"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                leftIcon={<Icon name="call" size={16} />}
              />
            )}
          </FormField>
          <Button type="submit" size="lg" className="w-full">
            Send OTP
          </Button>
        </form>
      )}
    </div>
  );
}
