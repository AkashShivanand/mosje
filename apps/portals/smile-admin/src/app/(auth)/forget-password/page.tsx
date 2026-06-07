"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgetPasswordPage() {
  const [mobile, setMobile] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="space-y-lg">
      <Link
        href="/login"
        className="inline-flex items-center gap-xs text-body-3 font-semibold text-foreground-muted hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>

      <header className="space-y-sm">
        <div className="grid h-12 w-12 place-items-center rounded-md bg-primary-50 text-primary ring-8 ring-primary-50/40">
          <KeyRound className="h-5 w-5" />
        </div>
        <div className="space-y-xs">
          <h1 className="text-headline-2 font-bold tracking-tight text-foreground">
            Reset your password
          </h1>
          <p className="text-body-2 text-foreground-muted">
            Enter the mobile number associated with your account. We will send a one-time
            password to verify it&apos;s you.
          </p>
        </div>
      </header>

      {sent ? (
        <div className="space-y-md rounded-lg border border-success-300 bg-success-50 p-lg">
          <div className="flex items-center gap-sm">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-success-600 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div className="text-title-2 font-semibold text-success-600">OTP sent</div>
          </div>
          <p className="text-body-3 text-foreground">
            We&apos;ve sent a one-time password to{" "}
            <span className="font-semibold">
              +91 {mobile.slice(0, 2)}••••{mobile.slice(-4)}
            </span>
            . Continue on the next screen to enter it.
          </p>
          <Link href="/reset-password">
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
          <div className="space-y-xs">
            <Label htmlFor="mobile">Registered mobile number</Label>
            <Input
              id="mobile"
              placeholder="9876543210"
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              leftIcon={<Phone className="h-4 w-4" />}
              hint="We'll send a 6-digit OTP via SMS."
            />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Send OTP
          </Button>
        </form>
      )}
    </div>
  );
}
