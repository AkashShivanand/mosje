"use client";

/* PM-AJAY Login Page
   Full-page government-identity login screen.
   On success, redirects to the dashboard. Already-authenticated users are
   bounced away from this page to the dashboard. */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/store/auth-context";

// Next.js adds the basePath automatically to <Link> and the router, so nav
// paths stay basePath-RELATIVE (BASE = "") — prepending it doubles the path.
// next/image does NOT add the basePath, so image src must include it (IMG_BASE).
const BASE = "";
const IMG_BASE = "/portals/pm-ajay";

const DEMO_ACCOUNTS = [
  { label: "Joint Secretary", id: "JS001", scope: "All India" },
  { label: "Deputy Secretary", id: "DS002", scope: "All India" },
  { label: "Section Officer · MH", id: "SO003", scope: "State" },
  { label: "Section Officer · TN", id: "SO004", scope: "State" },
  { label: "District Officer · GJ", id: "DO005", scope: "District" },
];

export default function LoginPage() {
  const router = useRouter();
  const { account, signIn } = useAuth();
  const [employeeId, setEmployeeId] = useState("JS001");
  const [password, setPassword] = useState("Password@123");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const idRef = useRef<HTMLInputElement>(null);

  // If already signed in, redirect to dashboard
  useEffect(() => {
    if (account) router.replace(BASE + "/");
  }, [account, router]);

  // Auto-focus employee ID field on desktop
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches) {
      idRef.current?.focus();
      idRef.current?.select();
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    setTimeout(() => {
      const res = signIn(employeeId, password);
      setBusy(false);
      if (!res.ok) {
        setError(res.reason ?? "Sign-in failed");
        idRef.current?.focus();
        idRef.current?.select();
      }
      // success: useEffect above fires when account updates
    }, 350);
  }

  return (
    <div className="login-page">
      {/* ── GoI utility bar ── */}
      <div className="pm-nav-utility">
        <a href="#login-main" className="sr-only focus:not-sr-only">Skip to Main Content</a>
        <div className="gov-bar-inner">
          <span className="gov-bar-flag">
            <Image src={`${IMG_BASE}/images/Indian-Flag.svg`} alt="" width={33} height={22} aria-hidden />
            Government of India
          </span>
        </div>
      </div>

      {/* ── Brand strip ── */}
      <header className="login-brand">
        <div className="login-brand-inner">
          <div className="login-brand-left">
            <Image
              src={`${IMG_BASE}/images/National_Emblem_logo_white.svg`}
              alt="National Emblem of India"
              width={40}
              height={66}
              className="login-emblem"
            />
            <div className="login-brand-text">
              <span className="login-brand-gov">Government of India</span>
              <span className="login-brand-min">Ministry of Social Justice &amp; Empowerment</span>
              <span className="login-brand-dept">Department of Social Justice &amp; Empowerment</span>
            </div>
          </div>
          <div className="login-brand-logos">
            <Image src={`${IMG_BASE}/images/digital-india-logo.svg`} alt="Digital India" width={100} height={39} />
          </div>
        </div>
      </header>

      {/* ── Scheme identity bar ── */}
      <div className="login-scheme-bar">
        <div className="login-scheme-inner">
          <span className="login-scheme-badge">MIS Portal</span>
          <span className="login-scheme-name">
            PM-AJAY — Pradhan Mantri Anusuchit Jaati Abhyuday Yojana
          </span>
        </div>
      </div>

      {/* ── Main login card ── */}
      <main id="login-main" className="login-main">
        <div className="login-card">
          {/* Card header */}
          <div className="login-card-head">
            <div className="login-shield">
              <span className="material-symbols-rounded">verified_user</span>
            </div>
            <h1 className="login-title">Secure Sign-In</h1>
            <p className="login-sub">
              Authorised MoSJE officials only. This MIS is not for public access.
            </p>
          </div>

          {/* Form */}
          <form
            id="login-form"
            onSubmit={handleSubmit}
            className="login-form"
            aria-busy={busy}
            noValidate
          >
            <div className="login-field">
              <label htmlFor="emp-id" className="login-label">
                Employee / Officer ID
                <span className="login-required" aria-hidden>*</span>
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon material-symbols-rounded" aria-hidden>badge</span>
                <input
                  ref={idRef}
                  id="emp-id"
                  type="text"
                  className={"login-input" + (error ? " err" : "")}
                  placeholder="e.g. JS001 or DO005"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  autoComplete="username"
                  aria-required
                  aria-invalid={error ? true : undefined}
                />
              </div>
            </div>

            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="password" className="login-label">
                  Password
                  <span className="login-required" aria-hidden>*</span>
                </label>
                <Link href={`${BASE}/forgot-password`} className="login-forgot">
                  Forgot password?
                </Link>
              </div>
              <div className="login-input-wrap">
                <span className="login-input-icon material-symbols-rounded" aria-hidden>lock</span>
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  className={"login-input" + (error ? " err" : "")}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  enterKeyHint="go"
                  aria-required
                  aria-invalid={error ? true : undefined}
                />
                <button
                  type="button"
                  className="login-eye"
                  onClick={() => setShow(!show)}
                  aria-label={show ? "Hide password" : "Show password"}
                  aria-pressed={show}
                  tabIndex={0}
                >
                  <span className="material-symbols-rounded" aria-hidden>
                    {show ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" aria-live="assertive" className="login-error">
                <span className="material-symbols-rounded" aria-hidden>error</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-btn"
              disabled={busy}
              aria-live="polite"
            >
              {busy ? (
                <>
                  <span className="login-spinner" aria-hidden />
                  Signing in…
                </>
              ) : (
                <>
                  <span className="material-symbols-rounded" aria-hidden>login</span>
                  Sign in to PM-AJAY MIS
                </>
              )}
            </button>
          </form>

          {/* Quick test accounts */}
          <div className="login-divider">
            <span>Demo accounts · Password@123</span>
          </div>
          <div className="login-demos">
            {DEMO_ACCOUNTS.map((q) => (
              <button
                key={q.id}
                type="button"
                className="login-demo-btn"
                onClick={() => {
                  setEmployeeId(q.id);
                  setPassword("Password@123");
                  idRef.current?.focus();
                }}
                aria-label={`Use ${q.label} demo account (${q.id})`}
              >
                <span className="login-demo-label">{q.label}</span>
                <span className="login-demo-meta">
                  <span className="login-demo-id">{q.id}</span>
                  <span className={"login-demo-scope scope-" + q.scope.toLowerCase().replace(/\s.*/,"")}>{q.scope}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Compliance footer */}
          <div className="login-card-foot">
            <span>256-bit TLS encryption</span>
            <span>GIGW 3.0 compliant</span>
            <span>NIC hosted</span>
            <span>v1.0 · Jun 2026</span>
          </div>
        </div>

        {/* Scheme info panel */}
        <aside className="login-info" aria-label="About PM-AJAY">
          <div className="login-info-head">
            <span className="material-symbols-rounded" aria-hidden>info</span>
            About PM-AJAY
          </div>
          <p className="login-info-text">
            <strong>Pradhan Mantri Anusuchit Jaati Abhyuday Yojana</strong> is the umbrella
            scheme for Scheduled Caste welfare under the Ministry of Social Justice &amp;
            Empowerment, integrating:
          </p>
          <ul className="login-info-list">
            <li><span className="material-symbols-rounded" aria-hidden>volunteer_activism</span>Grant-in-Aid (GIA) to NGOs &amp; institutions</li>
            <li><span className="material-symbols-rounded" aria-hidden>apartment</span>Hostel construction for SC students</li>
            <li><span className="material-symbols-rounded" aria-hidden>holiday_village</span>Pradhan Mantri Adarsh Gram Yojana (PMAGY)</li>
          </ul>
          <div className="login-info-stat-row">
            <div className="login-info-stat">
              <span className="v">₹9,250 Cr</span>
              <span className="l">FY 25-26 Budget</span>
            </div>
            <div className="login-info-stat">
              <span className="v">24.19 L</span>
              <span className="l">Beneficiaries</span>
            </div>
            <div className="login-info-stat">
              <span className="v">36</span>
              <span className="l">States / UTs</span>
            </div>
          </div>
        </aside>
      </main>

      {/* ── Page footer ── */}
      <footer className="login-footer">
        <span>© 2025 — Department of Social Justice &amp; Empowerment. Content owned by MoSJE. Designed, developed &amp; hosted by NIC.</span>
        <span className="login-footer-links">
          <a href="#">Terms &amp; Conditions</a>
          <span aria-hidden>|</span>
          <a href="#">Privacy Policy</a>
          <span aria-hidden>|</span>
          <a href="#">Help</a>
        </span>
      </footer>
    </div>
  );
}
