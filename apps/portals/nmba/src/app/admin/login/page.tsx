"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast";
import { Eye, EyeOff, LogIn } from "lucide-react";

const BASE = "/portals/nmba";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [mobile, setMobile] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (mobile.length === 10 && password.length > 0) {
        document.cookie = `nmba_admin_session=mock-session-token; path=/; max-age=${60 * 60 * 8}`;
        toast("Logged in successfully.", "success");
        router.push(`${BASE}/admin/dashboard`);
      } else {
        setError("Invalid credentials. Please check your mobile number and password.");
      }
    }, 600);
  };

  const footerToast = () => toast("This page is coming soon.", "info");

  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-navy px-12 text-white">
        <img
          src={`${BASE}/brand/national-emblem-white.svg`}
          alt="National Emblem of India"
          className="mb-6 h-20 w-auto opacity-90"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = `${BASE}/brand/national-emblem.svg`;
          }}
        />
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-white/60">
            Government of India
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-snug">
            Ministry of Social Justice<br />&amp; Empowerment
          </h1>
          <div className="mt-4 h-px w-16 bg-white/30 mx-auto" />
          <p className="mt-4 text-lg font-semibold text-saffron">
            Nasha Mukt Bharat Abhiyaan
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-white/50">
            Signing Into
          </p>
          <p className="mt-1 text-sm font-bold text-saffron">
            Nasha Mukt Bharat Abhiyaan
          </p>
        </div>

        {/* SAMAVESH / Digital India badges */}
        <div className="mt-12 flex items-center gap-4 opacity-60">
          <span className="text-xs font-semibold tracking-widest uppercase">SAMAVESH</span>
          <span className="h-4 w-px bg-white/40" />
          <span className="text-xs font-semibold tracking-widest uppercase">Digital India</span>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center bg-surface-muted px-6 py-12">
          {/* Mobile masthead (hidden on desktop) */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center lg:hidden">
            <img
              src={`${BASE}/brand/national-emblem.svg`}
              alt="National Emblem of India"
              className="h-16 w-auto"
            />
            <div>
              <div className="text-xs text-ink-hint">Government of India</div>
              <div className="text-base font-bold text-ink">
                Ministry of Social Justice &amp; Empowerment
              </div>
              <div className="mt-0.5 text-sm font-semibold text-navy">
                Nasha Mukt Bharat Abhiyaan
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="w-full max-w-sm">
            <div className="rounded-2xl border border-line bg-white p-8 shadow-pop">
              <h2 className="mb-1 text-center text-lg font-bold text-ink">Admin Sign In</h2>
              <p className="mb-6 text-center text-xs text-ink-muted">
                Enter your registered mobile number and password
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <div>
                  <label htmlFor="mobile" className="mb-1.5 block text-sm font-medium text-ink">
                    Mobile Number
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-lg border border-line px-3 py-2.5 text-sm text-ink placeholder:text-ink-hint focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15"
                    aria-describedby={error ? "login-error" : undefined}
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-ink">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={footerToast}
                      className="text-xs text-navy hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPw ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-line px-3 py-2.5 pr-10 text-sm text-ink placeholder:text-ink-hint focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-hint hover:text-ink"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p id="login-error" role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
                >
                  {loading ? "Signing in…" : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </>
                  )}
                </button>
              </form>
            </div>

            <p className="mt-4 text-center text-xs text-ink-hint">
              For access issues, contact your State Nodal Officer or the NMBA helpdesk.
            </p>
          </div>
        </div>

        {/* Footer links */}
        <footer className="border-t border-line bg-white px-6 py-3">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-ink-hint">
            <button type="button" onClick={footerToast} className="hover:text-navy hover:underline">
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={footerToast} className="hover:text-navy hover:underline">
              Contact Us
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={footerToast} className="hover:text-navy hover:underline">
              About Us
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
