"use client";

import Link from "next/link";
import { AccessibilityBar, BrandLockup } from "@mosje/design-system";

// Next.js adds the basePath automatically to <Link> and the router, so nav
// paths stay basePath-RELATIVE (BASE = "") — prepending it doubles the path.
// next/image does NOT add the basePath, so image src must include it (IMG_BASE).
const BASE = "/portals/pm-ajay";
const IMG_BASE = "/portals/pm-ajay";

export default function ForgotPasswordPage() {
  return (
    <div className="login-page">
      {/* ── GoI utility bar — the shared DS AccessibilityBar ── */}
      <AccessibilityBar
        layout="fluid"
        govLink={{ href: "https://india.gov.in/", label: "Government of India" }}
        skipTo="#fp-main"
        showSkip
        fontSize
        accessibility
        language={{ label: "English" }}
      />

      <header className="login-brand">
        <div className="login-brand-inner">
          <div className="login-brand-left">
            {/* Identity from the DS lockup — inverse, because this strip is dark. */}
            <BrandLockup
              emblemSrc={`${IMG_BASE}/images/National_Emblem_logo_white.svg`}
              lines={{
                org: "Government of India",
                ministry: "Ministry of Social Justice & Empowerment",
                department: "Department of Social Justice & Empowerment",
              }}
              href={IMG_BASE}
              compact
              inverse
            />
          </div>
        </div>
      </header>

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

          <div style={{ padding: "28px 28px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "var(--sa-bg-status-info-subtler)", border: "1px solid var(--sa-color-infoScale-200)", borderRadius: 8, padding: "14px 16px", fontSize: 13, color: "var(--sa-bg-status-info-bolder)", lineHeight: 1.6 }}>
              <strong>NIC Helpdesk:</strong> 1800-111-555 (toll-free, 9am–6pm IST)<br />
              <strong>Email:</strong> helpdesk@nic.in
            </div>

            <p style={{ fontSize: 13, color: "var(--sa-color-text-muted)", lineHeight: 1.6, margin: 0 }}>
              For prototype / demo, all test accounts use the password <code style={{ background: "var(--sa-bg-neutral-subtler)", padding: "2px 6px", borderRadius: 4, fontFamily: "monospace" }}>Password@123</code>.
            </p>

            <Link
              href={`${BASE}/login`}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 44, background: "var(--sa-color-brand-navy)", color: "var(--sa-color-text-onPrimary)", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none" }}
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
