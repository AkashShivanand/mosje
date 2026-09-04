"use client";

import * as React from "react";
import Link from "next/link";
import { Button, Field, TextInput } from "@/components/scw/ui";
import { cn } from "@/lib/scw/utils";
import { Divider, Icon, type DemoFillDetail } from "@mosje/design-system";

type RoleTab = "citizen" | "officer";
type CitizenType = "volunteer" | "sage";

export default function LoginPage() {
  const [roleTab, setRoleTab] = React.useState<RoleTab>("citizen");
  const [citizenType, setCitizenType] = React.useState<CitizenType>("volunteer");
  const [showPassword, setShowPassword] = React.useState(false);
  const [mobile, setMobile] = React.useState("");
  const [password, setPassword] = React.useState("");

  // DemoDock prefill via the design-system CustomEvent.
  React.useEffect(() => {
    const handler = (e: Event) => {
      const { id, password: pw, extra } = (e as CustomEvent<DemoFillDetail>).detail;
      setMobile(id);
      setPassword(pw);
      if (extra?.tab) setRoleTab(extra.tab as RoleTab);
      if (extra?.type) setCitizenType(extra.type as CitizenType);
    };
    window.addEventListener("demo:fill", handler);
    return () => window.removeEventListener("demo:fill", handler);
  }, []);


  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left hero panel */}
      <aside className="scw-login-panel relative hidden flex-col justify-center p-12 text-white md:flex md:w-1/2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/portals/scw/brand/samavesh-logo.svg"
          alt="SAMAVESH"
          className="h-16 w-16"
        />
        <h1 className="mt-6 text-display-5 font-display">SAMAVESH</h1>
        <p lang="hi" className="mt-1 text-headline-4 text-white/80">समावेश</p>

        <div className="my-6 h-1 w-64 rounded bg-saffron" />

        <p className="text-headline-3">Justice. Equality. Dignity.</p>
        <p className="mt-5 max-w-md text-body-1 text-white/75">
          Single Access Mechanism for All Verticals of Empowerment &amp; Social
          Harmony - one unified gateway for every social justice service in India.
        </p>

        {/* Bottom signing-into strip */}
        {/* bottom offset clears the fixed AppSwitcher FAB (bottom-left) */}
        <div className="absolute inset-x-12 bottom-[var(--cmp-appsw-safe-area)] flex items-center justify-between gap-4 border-t border-white/15 pt-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-title-3">
              SC
            </span>
            <div>
              <p className="text-label-3 uppercase text-white/55">
                Signing Into
              </p>
              <p className="text-title-3">Senior Citizens Welfare</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-3.5 py-2 text-label-1 text-white transition-colors hover:bg-white/10"
          >
            <Icon name="repeat" size={16} />
            Change
          </button>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex flex-1 items-center justify-center bg-brandwash px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          {/* Role tab toggle */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setRoleTab("citizen")}
              className={cn(
                "rounded-lg px-4 py-2.5 text-label-1 transition-colors",
                roleTab === "citizen"
                  ? "bg-white text-navy shadow-sm"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              Citizen / Beneficiary
            </button>
            <button
              type="button"
              onClick={() => setRoleTab("officer")}
              className={cn(
                "rounded-lg px-4 py-2.5 text-label-1 transition-colors",
                roleTab === "officer"
                  ? "bg-white text-navy shadow-sm"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              Officer / Admin
            </button>
          </div>

          {/* Citizen sub-toggle */}
          <div className="mb-6 flex gap-2">
            <button
              type="button"
              onClick={() => setCitizenType("volunteer")}
              className={cn(
                "flex-1 rounded-full border px-4 py-2 text-label-1 transition-colors",
                citizenType === "volunteer"
                  ? "border-navy bg-navy text-white"
                  : "border-line text-ink-muted hover:bg-black/5"
              )}
            >
              Volunteer
            </button>
            <button
              type="button"
              onClick={() => setCitizenType("sage")}
              className={cn(
                "flex-1 rounded-full border px-4 py-2 text-label-1 transition-colors",
                citizenType === "sage"
                  ? "border-navy bg-navy text-white"
                  : "border-line text-ink-muted hover:bg-black/5"
              )}
            >
              SAGE Organisation
            </button>
          </div>

          <form className="space-y-5">
            <Field label="Mobile Number" required>
              <TextInput
                type="tel"
                placeholder="Enter your registered mobile number"
                value={mobile}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMobile(e.target.value)}
              />
            </Field>

            <Field label="Password" required>
              <div className="relative">
                <TextInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pr-11"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-hint hover:text-ink"
                >
                  {showPassword ? (
                    <Icon name="visibility_off" size={20} />
                  ) : (
                    <Icon name="visibility" size={20} />
                  )}
                </button>
              </div>
            </Field>

            <div className="text-right">
              <Link
                href="/portals/scw/forgot-password"
                className="text-label-1 text-navy hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full">
              Login
              <Icon name="arrow_forward" size={16} />
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <Divider className="flex-1" />
            <span className="text-body-3 text-ink-hint">or</span>
            <Divider className="flex-1" />
          </div>

          {/* Register CTAs */}
          <div className="text-center">
            <p className="mb-3 text-body-2 text-ink-muted">
              Don&apos;t have an account? Register as:
            </p>
            <div className="flex gap-3">
              <Link
                href="/portals/scw/volunteer"
                className="flex-1 rounded-lg border border-navy/30 px-4 py-2.5 text-center text-label-1 text-navy transition-colors hover:bg-navy/5"
              >
                Volunteer
              </Link>
              <Link
                href="/portals/scw/sage-registration"
                className="flex-1 rounded-lg border border-navy/30 px-4 py-2.5 text-center text-label-1 text-navy transition-colors hover:bg-navy/5"
              >
                SAGE Organisation
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-body-3 text-ink-hint">
            Ministry of Social Justice &amp; Empowerment, Government of India
          </p>
        </div>
      </main>
    </div>
  );
}
