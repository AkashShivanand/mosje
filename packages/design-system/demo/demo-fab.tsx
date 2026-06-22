"use client";

/**
 * SAMAVESH Design System — DemoFab
 *
 * DEMO-ONLY component. Mount in your portal's root layout behind `devMode`.
 * Never ships to a public production build.
 *
 * The "Use" button fires a browser CustomEvent so the login page can prefill
 * its form without any prop-drilling or shared state:
 *
 *   // In your login page:
 *   React.useEffect(() => {
 *     const handler = (e: Event) => {
 *       const { id, password } = (e as CustomEvent<DemoFillDetail>).detail;
 *       setMobile(id);
 *       setPassword(password);
 *     };
 *     window.addEventListener("demo:fill", handler);
 *     return () => window.removeEventListener("demo:fill", handler);
 *   }, []);
 */

import * as React from "react";
import "./demo-fab.css";

const IconFlask = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/>
  </svg>
);

const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

const IconCopy = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);

const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ds-success, #16a34a)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

export interface DemoAccount {
  role: string;
  /** Mobile number, employee ID, or any login identifier shown to the reviewer. */
  id: string;
  password: string;
  /** Optional portal-specific payload forwarded verbatim in the demo:fill event. */
  extra?: Record<string, unknown>;
}

/** Shape of the CustomEvent detail dispatched when "Use" is clicked. */
export interface DemoFillDetail {
  id: string;
  password: string;
  /** Forwarded from DemoAccount.extra — cast to a portal-specific type in the listener. */
  extra?: Record<string, unknown>;
}

export interface DemoFabProps {
  /** Portal-specific demo accounts to display. */
  accounts: DemoAccount[];
  /**
   * Only renders when `true`. Wire to `process.env.NODE_ENV === "development"`
   * or a staging feature flag — never hard-code `true` in a production build.
   */
  devMode?: boolean;
  /** Column header for the ID column. Defaults to "Mobile / ID". */
  idLabel?: string;
}

export function DemoFab({
  accounts,
  devMode = false,
  idLabel = "Mobile / ID",
}: DemoFabProps) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState<string | null>(null);

  if (!devMode) return null;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const use = (account: DemoAccount) => {
    window.dispatchEvent(
      new CustomEvent<DemoFillDetail>("demo:fill", {
        detail: { id: account.id, password: account.password, extra: account.extra },
        bubbles: true,
      }),
    );
    setOpen(false);
  };

  return (
    <div className="ds-demo-fab">
      {open && (
        <div
          className="ds-demo-fab__panel"
          role="dialog"
          aria-label="Demo credentials"
          aria-modal="false"
        >
          <div className="ds-demo-fab__header">
            <span className="ds-demo-fab__header-label">
              <IconFlask />
              Demo Credentials
            </span>
            <button
              className="ds-demo-fab__close"
              onClick={() => setOpen(false)}
              aria-label="Close demo credentials"
            >
              <IconX />
            </button>
          </div>

          <div className="ds-demo-fab__body">
            <table className="ds-demo-fab__table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>{idLabel}</th>
                  <th>Password</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td className="ds-demo-fab__role">{account.role}</td>
                    <td>
                      <span className="ds-demo-fab__id">{account.id}</span>
                      <button
                        className="ds-demo-fab__copy"
                        onClick={() => copy(account.id, `id-${account.id}`)}
                        aria-label={`Copy ${account.id}`}
                      >
                        {copied === `id-${account.id}` ? <IconCheck /> : <IconCopy />}
                      </button>
                    </td>
                    <td>
                      <span className="ds-demo-fab__pw">{account.password}</span>
                      <button
                        className="ds-demo-fab__copy"
                        onClick={() => copy(account.password, `pw-${account.id}`)}
                        aria-label="Copy password"
                      >
                        {copied === `pw-${account.id}` ? <IconCheck /> : <IconCopy />}
                      </button>
                    </td>
                    <td>
                      <button
                        className="ds-demo-fab__use"
                        onClick={() => use(account)}
                        aria-label={`Use ${account.role} credentials`}
                      >
                        Use
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="ds-demo-fab__footer">
              For stakeholder review only · not for production use
            </p>
          </div>
        </div>
      )}

      <button
        className="ds-demo-fab__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle demo credentials"
        aria-expanded={open}
      >
        <IconFlask />
        Demo
      </button>
    </div>
  );
}
