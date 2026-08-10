"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Icon, Input, Label, type DemoFillDetail } from "@mosje/design-system";
import { useApp } from "@/store/smile-admin/app-context";

// This page's own inline "quick accounts" panel, independent of the
// estate-wide DemoDock (which also reaches this form via the `demo:fill`
// listener below, using the registry in @mosje/design-system/demo).
const QUICK_ACCOUNTS = [
  { label: "Super Admin", mobile: "9000000900", scope: "All India" },
  { label: "Central Admin", mobile: "9000000901", scope: "All India" },
  { label: "State NO · Maharashtra", mobile: "9000000902", scope: "State" },
  { label: "Dist NO · Mumbai", mobile: "9000000903", scope: "District" },
  { label: "Dist NO · Pune", mobile: "9000000904", scope: "District" },
  { label: "Dist NO · New Delhi", mobile: "9000000905", scope: "District" },
];

const RETURN_TO_KEY = "smile.returnTo.v1";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, account } = useApp();
  const [mobile, setMobile] = useState("9000000900");
  const [password, setPassword] = useState("Password@123");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const mobileRef = useRef<HTMLInputElement>(null);

  // Autofocus first field on mount (skip on small screens where it pops the keyboard).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 640px)").matches) {
      mobileRef.current?.focus();
      mobileRef.current?.select();
    }
  }, []);

  useEffect(() => {
    if (!account) return;
    let next = "/portals/smile-admin/dashboard";
    try {
      const stored = sessionStorage.getItem(RETURN_TO_KEY);
      if (stored && stored.startsWith("/") && !stored.startsWith("/portals/smile-admin/login")) {
        next = stored;
      }
      sessionStorage.removeItem(RETURN_TO_KEY);
    } catch {
      /* ignore */
    }
    router.replace(next);
  }, [account, router]);

  // DemoDock prefill via the design-system CustomEvent.
  useEffect(() => {
    const handler = (e: Event) => {
      const { id, password: pw } = (e as CustomEvent<DemoFillDetail>).detail;
      setMobile(id);
      setPassword(pw);
      mobileRef.current?.focus();
    };
    window.addEventListener("demo:fill", handler);
    return () => window.removeEventListener("demo:fill", handler);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    setTimeout(() => {
      const res = signIn(mobile.trim(), password);
      setBusy(false);
      if (!res.ok) {
        setError(res.reason);
        // Return focus to the failing field so the user can fix it without reaching for the mouse.
        mobileRef.current?.focus();
        mobileRef.current?.select();
      }
      // success path: router.replace happens via useEffect when `account` updates
    }, 350);
  }

  return (
    <div className="space-y-lg">
      {/* Mobile brand */}
      <div className="flex items-center gap-md lg:hidden">
        <div className="grid h-11 w-11 place-items-center rounded-md bg-primary text-white">
          <span className="text-label-3 font-bold tracking-[0.16em]">MoSJE</span>
        </div>
        <div className="leading-tight">
          <div className="text-title-2 font-bold text-ink">SMILE Admin</div>
          <div className="text-label-3 text-ink-muted">
            Ministry of Social Justice &amp; Empowerment
          </div>
        </div>
      </div>

      <header className="space-y-xs">
        <div className="inline-flex items-center gap-xs rounded-full border border-primary-100 bg-primary-50 px-sm py-0.5 text-label-3 font-semibold uppercase tracking-[0.1em] text-primary">
          <Icon name="verified_user" size={12} aria-hidden />
          Secure sign in
        </div>
        <h1 className="text-headline-2 font-bold tracking-tight text-ink">
          Welcome back
        </h1>
        <p className="text-body-2 text-ink-muted">
          Sign in to manage beggary rehabilitation operations.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-md"
        aria-busy={busy}
        noValidate
      >
        <div className="space-y-xs">
          <Label htmlFor="mobile" required>
            Email or mobile number
          </Label>
          <Input
            ref={mobileRef}
            id="mobile"
            inputMode="email"
            enterKeyHint="next"
            placeholder="name@example.gov.in or 9876543210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            leftIcon={<Icon name="call" size={16} aria-hidden />}
            autoComplete="username"
            aria-invalid={error ? true : undefined}
            aria-required
          />
        </div>

        <div className="space-y-xs">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" required>
              Password
            </Label>
            <Link
              href="/portals/smile-admin/forget-password"
              className="text-label-3 font-semibold text-info-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            enterKeyHint="go"
            leftIcon={<Icon name="lock" size={16} aria-hidden />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
                aria-pressed={show}
                className="text-ink-hint hover:text-ink"
              >
                {show ? (
                  <Icon name="visibility_off" size={16} aria-hidden />
                ) : (
                  <Icon name="visibility" size={16} aria-hidden />
                )}
              </button>
            }
            autoComplete="current-password"
            aria-required
            aria-invalid={error ? true : undefined}
          />
        </div>

        <label className="flex items-center gap-sm text-body-3 text-ink-muted">
          <Checkbox
            checked={remember}
            onChange={(e) => setRemember(e.target.checked === true)}
          />
          Keep me signed in for 30 days
        </label>

        {error ? (
          <div
            role="alert"
            aria-live="assertive"
            className="rounded-md border border-danger-300 bg-danger-50 px-md py-sm text-body-3 text-danger-600"
          >
            {error}
          </div>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={busy}
          aria-live="polite"
        >
          {busy ? (
            <>
              <Icon name="progress_activity" size={16} aria-hidden className="animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-stroke-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-sm text-label-3 font-semibold uppercase tracking-[0.12em] text-ink-hint">
            Quick test accounts · Password@123
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-xs sm:grid-cols-2">
        {QUICK_ACCOUNTS.map((q) => (
          <button
            key={q.mobile}
            type="button"
            onClick={() => {
              setMobile(q.mobile);
              setPassword("Password@123");
              mobileRef.current?.focus();
            }}
            aria-label={`Use ${q.label} test account, mobile ${q.mobile}`}
            className="group flex items-center justify-between gap-sm rounded-md border border-stroke-200 bg-white px-sm py-1.5 text-body-3 transition-all hover:-translate-y-px hover:border-primary/60 hover:bg-primary-50/40 hover:shadow-xs"
          >
            <span className="truncate font-semibold text-ink group-hover:text-primary">
              {q.label}
            </span>
            <span
              aria-hidden
              className="shrink-0 font-mono text-label-3 text-ink-hint"
            >
              {q.mobile}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-sm border-t border-stroke-100 pt-md text-label-3 text-ink-hint">
        <span>256-bit TLS</span>
        <span>GIGW 3.0</span>
        <span>v1.0.0 · Build 2026.05.15b</span>
      </div>
    </div>
  );
}
