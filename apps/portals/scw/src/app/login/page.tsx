"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Repeat } from "lucide-react";
import { Button, Field, TextInput } from "@/components/ui";
import { cn } from "@/lib/utils";

type RoleTab = "citizen" | "officer";
type CitizenType = "volunteer" | "sage";

export default function LoginPage() {
  const [roleTab, setRoleTab] = React.useState<RoleTab>("citizen");
  const [citizenType, setCitizenType] = React.useState<CitizenType>("volunteer");
  const [showPassword, setShowPassword] = React.useState(false);
  const [mobile, setMobile] = React.useState("");
  const [password, setPassword] = React.useState("");

  const useDemo = (demoMobile: string, tab?: RoleTab, type?: CitizenType) => {
    setMobile(demoMobile);
    setPassword("Demo@123");
    if (tab) setRoleTab(tab);
    if (type) setCitizenType(type);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left hero panel */}
      <aside className="scw-login-panel relative hidden flex-col justify-center p-12 text-white md:flex md:w-1/2">
        <img
          src="/portals/scw/brand/samavesh-logo.svg"
          alt="SAMAVESH"
          className="h-16 w-16"
        />
        <h1 className="mt-6 text-5xl font-bold tracking-tight">SAMAVESH</h1>
        <p className="mt-1 text-2xl text-white/80">समावेश</p>

        <div className="my-6 h-1 w-64 rounded bg-saffron" />

        <p className="text-3xl font-bold leading-tight">Justice. Equality. Dignity.</p>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/75">
          Single Access Mechanism for All Verticals of Empowerment &amp; Social
          Harmony - one unified gateway for every social justice service in India.
        </p>

        {/* Bottom signing-into strip */}
        <div className="absolute inset-x-12 bottom-12 flex items-center justify-between gap-4 border-t border-white/15 pt-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold">
              SC
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/55">
                Signing Into
              </p>
              <p className="text-sm font-bold">Senior Citizens Welfare</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Repeat className="h-4 w-4" />
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
                "rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
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
                "rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
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
                "flex-1 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
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
                "flex-1 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
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
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </Field>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-navy hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full">
              Login
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Demo credentials */}
          <details className="group mt-4 rounded-lg border border-dashed border-navy/25 bg-surface-muted">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2.5 text-xs font-semibold text-navy/60 hover:text-navy">
              <span>Demo credentials</span>
              <svg className="h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="border-t border-navy/10 px-4 pb-3 pt-2">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-ink-hint">
                    <th className="pb-1.5 text-left font-medium">Role</th>
                    <th className="pb-1.5 text-left font-medium">Mobile</th>
                    <th className="pb-1.5 text-left font-medium">Password</th>
                    <th className="pb-1.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {[
                    { role: "Volunteer (Citizen)", mob: "9800000001", tab: "citizen" as RoleTab, type: "volunteer" as CitizenType },
                    { role: "SAGE Organisation", mob: "9800000002", tab: "citizen" as RoleTab, type: "sage" as CitizenType },
                    { role: "Nodal Officer", mob: "9810000001", tab: "officer" as RoleTab, type: undefined },
                  ].map(({ role, mob, tab, type }) => (
                    <tr key={mob}>
                      <td className="py-1.5 font-medium text-ink">{role}</td>
                      <td className="py-1.5 font-mono text-ink">{mob}</td>
                      <td className="py-1.5 text-ink-muted">Demo@123</td>
                      <td className="py-1.5 text-right">
                        <button
                          type="button"
                          onClick={() => useDemo(mob, tab, type)}
                          className="rounded px-2 py-0.5 text-xs font-semibold text-navy hover:bg-navy/10"
                        >
                          Use
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-xs text-ink-hint">or</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          {/* Register CTAs */}
          <div className="text-center">
            <p className="mb-3 text-sm text-ink-muted">
              Don&apos;t have an account? Register as:
            </p>
            <div className="flex gap-3">
              <Link
                href="/volunteer"
                className="flex-1 rounded-lg border border-navy/30 px-4 py-2.5 text-center text-sm font-semibold text-navy transition-colors hover:bg-navy/5"
              >
                Volunteer
              </Link>
              <Link
                href="/sage-registration"
                className="flex-1 rounded-lg border border-navy/30 px-4 py-2.5 text-center text-sm font-semibold text-navy transition-colors hover:bg-navy/5"
              >
                SAGE Organisation
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-ink-hint">
            Ministry of Social Justice &amp; Empowerment, Government of India
          </p>
        </div>
      </main>
    </div>
  );
}
