"use client";

import Link from "next/link";
import { Navbar } from "@/components/pm-ajay/shell/navbar";

// Next.js adds the basePath automatically to <Link> and the router, so nav
// paths stay basePath-RELATIVE (BASE = "") — prepending it doubles the path.
// next/image does NOT add the basePath, so image src must include it (IMG_BASE).
const BASE = "/portals/pm-ajay";

export default function ForgotPasswordPage() {
  return (
    <div className="login-page">
      <Navbar />

      <div className="login-scheme-bar">
        <div className="login-scheme-inner">
          <span className="login-scheme-badge">MIS Portal</span>
          <span className="login-scheme-name">PM-AJAY — Password Recovery</span>
        </div>
      </div>

      <main id="fp-main" className="login-main" style={{ justifyContent: "center" }}>
        <div className="login-card" style={{ maxWidth: 440 }}>
          <div className="login-card-head">
            <div className="login-shield">
              <span className="material-symbols-rounded">lock_reset</span>
            </div>
            <h1 className="login-title">Reset Password</h1>
            <p className="login-sub">
              Contact your NIC helpdesk or your ministry nodal officer to reset your password.
            </p>
          </div>

          <div style={{ padding: "var(--sa-padding-24) var(--sa-padding-24) var(--sa-padding-20)", display: "flex", flexDirection: "column", gap: "var(--sa-stack-16)" }}>
            <div style={{ background: "var(--sa-bg-status-info-subtler)", border: "1px solid var(--sa-color-infoScale-200)", borderRadius: "var(--sa-shape-8)", padding: "var(--sa-padding-12) var(--sa-padding-16)", fontSize: "var(--sa-type-body-2-size)", lineHeight: "var(--sa-type-body-2-lh)", color: "var(--sa-bg-status-info-bolder)" }}>
              <strong>NIC Helpdesk:</strong> 1800-111-555 (toll-free, 9am–6pm IST)<br />
              <strong>Email:</strong> helpdesk@nic.in
            </div>

            <p style={{ fontSize: "var(--sa-type-body-2-size)", lineHeight: "var(--sa-type-body-2-lh)", color: "var(--sa-color-text-muted)", margin: 0 }}>
              For prototype / demo, all test accounts use the password <code style={{ background: "var(--sa-bg-neutral-subtler)", padding: "var(--sa-padding-2) var(--sa-padding-6)", borderRadius: "var(--sa-shape-4)", fontFamily: "var(--sa-font-mono)" }}>Password@123</code>.
            </p>

            <Link
              href={`${BASE}/login`}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--sa-inline-8)", height: 44, background: "var(--sa-color-brand-navy)", color: "var(--sa-color-text-onPrimary)", borderRadius: "var(--sa-shape-8)", fontWeight: "var(--sa-font-weight-semibold)", fontSize: "var(--sa-type-label-1-size)", lineHeight: "var(--sa-type-label-1-lh)", textDecoration: "none" }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: 18 }}>arrow_back</span>
              Back to Sign-In
            </Link>
          </div>
        </div>
      </main>

      <footer className="login-footer">
        <span>© 2025 — Department of Social Justice &amp; Empowerment. Content owned by MoSJE. Designed, developed &amp; hosted by NIC.</span>
      </footer>
    </div>
  );
}
