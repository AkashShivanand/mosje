"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <header className="space-y-xs">
          <h1 className="text-headline-2 font-bold tracking-tight text-foreground">
            Password updated
          </h1>
          <p className="text-body-2 text-foreground-muted">
            Your password has been successfully reset. Use your new password to sign in.
          </p>
        </header>
        <Button size="lg" className="w-full" onClick={() => router.push("/login")}>
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
            <KeyRound className="h-5 w-5" />
          </div>
          <div className="space-y-xs">
            <h1 className="text-headline-2 font-bold tracking-tight text-foreground">
              Create new password
            </h1>
            <p className="text-body-2 text-foreground-muted">
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
              leftIcon={<Lock className="h-4 w-4" />}
            />
          </div>
          <div className="space-y-xs">
            <Label htmlFor="pw2">Confirm new password</Label>
            <Input
              id="pw2"
              type="password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              error={pw2 && pw !== pw2 ? "Passwords do not match" : undefined}
            />
          </div>
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
          <KeyRound className="h-5 w-5" />
        </div>
        <div className="space-y-xs">
          <h1 className="text-headline-2 font-bold tracking-tight text-foreground">
            Verify your phone number
          </h1>
          <p className="text-body-2 text-foreground-muted">
            For your security, enter the 6-digit OTP we sent to your registered phone.
          </p>
          <p className="text-body-3 text-foreground">
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

        <div className="flex items-center justify-between text-body-3 text-foreground-muted">
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
          href="/login"
          className="block text-center text-body-3 font-semibold text-foreground-muted hover:text-primary"
        >
          Cancel and return to sign in
        </Link>
      </form>
    </div>
  );
}
