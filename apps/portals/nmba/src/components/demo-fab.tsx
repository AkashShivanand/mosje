"use client";

import * as React from "react";
import { FlaskConical, X, Copy, Check } from "lucide-react";

interface DemoAccount {
  role: string;
  id: string;
  password: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: "Admin", id: "9999999999", password: "Demo@123" },
];

export function DemoFab({ devMode = false }: { devMode?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState<string | null>(null);

  if (!devMode) return null;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div
          className="w-72 overflow-hidden rounded-xl border border-line bg-white shadow-pop"
          role="dialog"
          aria-label="Demo credentials"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <FlaskConical className="h-3.5 w-3.5 text-navy" />
              <span className="text-xs font-semibold text-ink">Demo Credentials</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded p-0.5 text-ink-hint hover:bg-black/5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="p-3">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-ink-hint">
                  <th className="pb-2 text-left font-medium">Role</th>
                  <th className="pb-2 text-left font-medium">Mobile / ID</th>
                  <th className="pb-2 text-left font-medium">Password</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {DEMO_ACCOUNTS.map(({ role, id, password }) => (
                  <tr key={id}>
                    <td className="py-2 font-medium text-ink">{role}</td>
                    <td className="py-2">
                      <span className="font-mono text-ink">{id}</span>
                      <button
                        onClick={() => copy(id, `id-${id}`)}
                        aria-label={`Copy ${id}`}
                        className="ml-1.5 text-ink-hint hover:text-navy"
                      >
                        {copied === `id-${id}`
                          ? <Check className="inline h-3 w-3 text-approve" />
                          : <Copy className="inline h-3 w-3" />}
                      </button>
                    </td>
                    <td className="py-2">
                      <span className="text-ink-muted">{password}</span>
                      <button
                        onClick={() => copy(password, `pw-${id}`)}
                        aria-label={`Copy password`}
                        className="ml-1.5 text-ink-hint hover:text-navy"
                      >
                        {copied === `pw-${id}`
                          ? <Check className="inline h-3 w-3 text-approve" />
                          : <Copy className="inline h-3 w-3" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2.5 text-[10px] text-ink-hint">For stakeholder review only · not for production use</p>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle demo credentials"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full bg-navy px-3 py-2 text-xs font-semibold text-white shadow-pop hover:bg-navy/90 active:scale-95 transition-transform"
      >
        <FlaskConical className="h-3.5 w-3.5" />
        Demo
      </button>
    </div>
  );
}
