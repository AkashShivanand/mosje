"use client";

import { useState } from "react";
import { DEMO_CREDENTIALS } from "./eutthan-shared";

export function LoginPage({
  onLogin,
}: {
  onLogin: (u: string, p: string) => string | null;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const err = onLogin(username.trim(), password);
    if (err) setError(err);
  }

  return (
    <div className="login-split">
      {/* Left — blue panel */}
      <div className="login-left">
        <div className="login-left-content">
          <svg
            width="72"
            height="72"
            viewBox="0 0 72 72"
            fill="none"
            aria-hidden="true"
            style={{ marginBottom: "var(--sa-stack-24)" }}
          >
            <circle
              cx="36"
              cy="36"
              r="33"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
            />
            <circle
              cx="36"
              cy="36"
              r="21"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.5"
            />
            <circle cx="36" cy="22" r="5" fill="rgba(255,255,255,0.75)" />
            <path d="M36 27L24 48H48L36 27Z" fill="rgba(255,255,255,0.5)" />
          </svg>
          <div className="login-portal-name">eUtthan</div>
          <div className="login-ministry-name">
            Ministry of Social Justice
            <br />
            &amp; Empowerment
          </div>
          <div className="login-tagline">
            DAPSC Allocation &amp; Progress Tracking Portal
          </div>
          <div className="login-gov-tag">Government of India</div>
        </div>
      </div>

      {/* Right — form */}
      <div className="login-right">
        <form className="login-form-inner" onSubmit={submit} noValidate>
          <h1 className="login-form-title">Log In</h1>
          <p className="login-form-subtitle">
            Enter your credentials to access the portal
          </p>

          {error && (
            <div className="login-error-box" role="alert">
              {error}
            </div>
          )}

          <div className="field" style={{ marginTop: "var(--sa-stack-24)" }}>
            <label htmlFor="eu-username">Username / ID</label>
            <input
              id="eu-username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null);
              }}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>

          <div className="field" style={{ marginTop: "var(--sa-stack-16)" }}>
            <label htmlFor="eu-password">Password</label>
            <input
              id="eu-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button"
            style={{ marginTop: "var(--sa-stack-24)", width: "100%" }}
          >
            Log In
          </button>
        </form>

        {/* Demo credentials — DEMO ONLY, remove before production */}
        <div className="demo-creds-panel">
          <div className="demo-creds-header">Demo Credentials</div>
          <div className="demo-creds-rows">
            {DEMO_CREDENTIALS.map((cred) => (
              <button
                key={cred.role}
                type="button"
                className="demo-creds-row"
                onClick={() => {
                  setUsername(cred.username);
                  setPassword(cred.demoPin);
                  setError(null);
                }}
                aria-label={"Use " + cred.label + " demo account: " + cred.username}
              >
                <span className="demo-role-tag">{cred.label}</span>
                <span className="demo-username">{cred.username}</span>
                <span className="demo-pin">{cred.demoPin}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
