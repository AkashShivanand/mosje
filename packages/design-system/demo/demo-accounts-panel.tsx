"use client";

/**
 * SAMAVESH Design System — DemoAccountsPanel
 *
 * DEMO-ONLY component. The credentials list shared by `DemoFab` and
 * `DemoDock` — one definition, so the two never drift apart. Renders one row
 * per account: the role on its own line (the longest field, so it doesn't
 * fight the rest of the row for space), then id / password / actions
 * aligned in a grid below it, with copy-to-clipboard and a "Use" button.
 *
 * Default behaviour on "Use": dispatches a `demo:fill` CustomEvent so a login
 * page can prefill its form without prop-drilling — see `DemoFab`'s doc
 * comment for the full listener pattern. Every login page that already wires
 * up that listener keeps working unchanged. Pass `onFill` to replace the
 * dispatch — e.g. when the consumer needs its own side effect on selection,
 * such as closing a floating panel.
 */

import * as React from "react";
import "./demo-accounts-panel.css";
import { cn } from "../utils/cn";
import type { DemoAccount, DemoFillDetail } from "./demo-fab";

const IconCopy = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const IconCheck = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--ds-success)"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export interface DemoAccountsPanelProps {
  /** Demo accounts to render, one row per account. */
  accounts: DemoAccount[];
  /** Column header for the ID column. */
  idLabel?: string;
  /**
   * Called when a row's "Use" button is clicked. When provided, replaces the
   * default global `demo:fill` CustomEvent dispatch.
   */
  onFill?: (id: string, password: string, extra?: Record<string, unknown>) => void;
  /**
   * Called after a row's credentials are applied, whichever path ran —
   * the default `demo:fill` dispatch or a supplied `onFill`. Lets a
   * containing shell (e.g. `DemoFab`) close itself on selection without
   * listening to the global `demo:fill` event, which is reserved for "a
   * credential was chosen" as seen by a login page, not "some demo picker
   * somewhere was used."
   */
  onUse?: () => void;
  className?: string;
}

/**
 * DemoAccountsPanel — the shared credentials list body used by `DemoFab`
 * and DemoDock. Pure content: no floating chrome, no open/close state — a
 * shell (e.g. `DemoFab`) owns that and renders this for its body.
 */
export function DemoAccountsPanel({
  accounts,
  idLabel = "Mobile / ID",
  onFill,
  onUse,
  className,
}: DemoAccountsPanelProps): React.JSX.Element {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const use = (account: DemoAccount) => {
    if (onFill) {
      onFill(account.id, account.password, account.extra);
    } else {
      window.dispatchEvent(
        new CustomEvent<DemoFillDetail>("demo:fill", {
          detail: { id: account.id, password: account.password, extra: account.extra },
          bubbles: true,
        }),
      );
    }
    onUse?.();
  };

  return (
    <div className={cn("ds-demo-accounts", className)}>
      <div className="ds-demo-accounts__col-labels" aria-hidden="true">
        <span>{idLabel}</span>
        <span>Password</span>
      </div>
      <ul className="ds-demo-accounts__list">
        {accounts.map((account) => (
          <li className="ds-demo-accounts__row" key={account.id}>
            {/* The role name is the longest field in the row, so it gets its
                own line — cramming it into a fourth table column is what
                forced the id/password/actions to fight for space. */}
            <div className="ds-demo-accounts__role">{account.role}</div>
            <div className="ds-demo-accounts__data">
              <span className="ds-demo-accounts__cell">
                <span className="ds-sr-only">{idLabel}: </span>
                <span className="ds-demo-accounts__id">{account.id}</span>
                <button
                  className="ds-demo-accounts__copy"
                  onClick={() => copy(account.id, `id-${account.id}`)}
                  aria-label={`Copy ${account.id}`}
                >
                  {copied === `id-${account.id}` ? <IconCheck /> : <IconCopy />}
                </button>
              </span>
              <span className="ds-demo-accounts__cell">
                <span className="ds-sr-only">Password: </span>
                <span className="ds-demo-accounts__pw">{account.password}</span>
                <button
                  className="ds-demo-accounts__copy"
                  onClick={() => copy(account.password, `pw-${account.id}`)}
                  aria-label="Copy password"
                >
                  {copied === `pw-${account.id}` ? <IconCheck /> : <IconCopy />}
                </button>
              </span>
              <button
                className="ds-demo-accounts__use"
                onClick={() => use(account)}
                aria-label={`Use ${account.role} credentials`}
              >
                Use
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="ds-demo-accounts__footer">
        For stakeholder review only · not for production use
      </p>
    </div>
  );
}
