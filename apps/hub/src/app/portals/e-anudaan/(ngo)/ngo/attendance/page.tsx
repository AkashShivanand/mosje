"use client";

import * as React from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const TABS = ["Weekly Attendance", "Beneficiaries", "Employees"] as const;
const ROSTER = ["Reshmi Kumari", "Anil Prasad", "Sunita Devi", "Manoj Kumar"];

/** Weekly attendance grid — columns and copy from the live screen (§9). */
export default function WeeklyAttendancePage() {
  const [tab, setTab] = React.useState<(typeof TABS)[number]>("Weekly Attendance");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Attendance</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Maintain your beneficiary &amp; employee roster and submit a whole week of attendance at once.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`rounded-full border px-3 py-1 text-sm ${
              tab === t ? "border-navy bg-navy text-white" : "border-line bg-surface text-ink hover:bg-surface-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <section className="rounded-xl border border-line bg-surface p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
                <th className="pb-2 pr-3 font-medium">Name</th>
                {DAYS.map((d) => <th key={d} className="pb-2 pr-3 font-medium">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {ROSTER.map((n) => (
                <tr key={n} className="border-b border-line">
                  <td className="py-2 pr-3 text-ink">{n}</td>
                  {DAYS.map((d) => (
                    <td key={d} className="py-2 pr-3">
                      <input type="checkbox" aria-label={`${n} present on ${d}`} defaultChecked={d !== "Sun"} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
