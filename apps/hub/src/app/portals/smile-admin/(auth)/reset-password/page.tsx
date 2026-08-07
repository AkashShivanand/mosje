"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, FormField, Icon, Input, Label } from "@mosje/design-system";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<"otp" | "password" | "done">("otp");
  const [otp, setOtp] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [seconds, setSeconds] = useState(23);

  useEffect(() => {
    if (stage !== "otp") return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [stage]);

  if (stage === "done") {
    return (
      <div className="space-y-lg text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-50 text-success-600 ring-8 ring-success-50/40">
          <Icon name="check_circle" size={32} />
        </div>
        <header className="space-y-xs">
          <h1 className="text-headline-2 font-bold tracking-tight text-ink">
            Password updated
          </h1>
          <p className="text-body-2 text-ink-muted">
            Your password has been successfully reset. Use your new password to sign in.
          </p>
        </header>
        <Button size="lg" className="w-full" onClick={() => router.push("/portals/smile-admin/login")}>
          Continue to sign in
        </Button>
      </div>
    );
  }

  if (stage === "password") {
    return (
      <div className="space-y-lg">
        <header className="space-y-sm">
          <div className="grid h-12 w-12 place-items-center rounded-md bg-primary-50 text-primary ring-8 ring-primary-50/40">
            <Icon name="key" size={20} />
          </div>
          <div className="space-y-xs">
            <h1 className="text-headline-2 font-bold tracking-tight text-ink">
              Create new password
            </h1>
            <p className="text-body-2 text-ink-muted">
              At least 8 characters with one uppercase letter, one number and one symbol.
            </p>
          </div>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pw && pw === pw2) setStage("done");
          }}
          className="space-y-md"
        >
          <div className="space-y-xs">
            <Label htmlFor="pw">New password</Label>
            <Input
              id="pw"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              leftIcon={<Icon name="lock" size={16} />}
            />
          </div>
          {/* FormField owns the label/error wiring (htmlFor, aria-describedby,
              role="alert"), which the old island Input did by hand.
              `pw2.length > 0` rather than `pw2 &&`: FormField treats any
              non-null error as present, and the old truthiness check would
              hand it an empty string on first render. */}
          <FormField
            label="Confirm new password"
            id="pw2"
            error={
              pw2.length > 0 && pw !== pw2 ? "Passwords do not match" : undefined
            }
          >
            {(control) => (
              <Input
                {...control}
                type="password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                leftIcon={<Icon name="lock" size={16} />}
              />
            )}
          </FormField>
          <Button type="submit" size="lg" className="w-full">
            Update password
          </Button>
        </form>
      </div>
    );
  }

  // OTP stage
  return (
    <div className="space-y-lg">
      <header className="space-y-sm">
        <div className="grid h-12 w-12 place-items-center rounded-md bg-primary-50 text-primary ring-8 ring-primary-50/40">
          <Icon name="key" size={20} />
        </div>
        <div className="space-y-xs">
          <h1 className="text-headline-2 font-bold tracking-tight text-ink">
            Verify your phone number
          </h1>
          <p className="text-body-2 text-ink-muted">
            For your security, enter the 6-digit OTP we sent to your registered phone.
          </p>
          <p className="text-body-3 text-ink">
            Sent to <span className="font-semibold">+91 98••••1234</span>.
          </p>
        </div>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (otp.length === 6) setStage("password");
        }}
        className="space-y-md"
      >
        <div className="space-y-xs">
          <Label htmlFor="otp">6-digit OTP</Label>
          <Input
            id="otp"
            inputMode="numeric"
            placeholder="• • • • • •"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="text-center font-mono text-headline-5 tracking-[0.4em]"
          />
        </div>

        <div className="flex items-center justify-between text-body-3 text-ink-muted">
          <span>
            Resend in{" "}
            <span className="font-mono tabular-nums">
              00:{seconds.toString().padStart(2, "0")}
            </span>
          </span>
          <button
            type="button"
            disabled={seconds > 0}
            onClick={() => setSeconds(23)}
            className="font-semibold text-info-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Resend
          </button>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={otp.length !== 6}>
          Continue
        </Button>

        <Link
          href="/portals/smile-admin/login"
          className="block text-center text-body-3 font-semibold text-ink-muted hover:text-primary"
        >
          Cancel and return to sign in
        </Link>
      </form>
    </div>
  );
}
