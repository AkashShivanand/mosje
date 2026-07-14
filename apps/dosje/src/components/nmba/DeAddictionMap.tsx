"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Phone } from "lucide-react";
import { Select } from "@mosje/design-system";
import { cn } from "@/lib/utils";
import {
  DEADDICTION_CENTRES,
  CENTRE_TYPE_META,
  CENTRE_TYPE_ORDER,
  TOTAL_CENTRES,
  HELPLINE,
  type CentreType,
  type DeAddictionCentre,
} from "@/content/deaddiction-centres";

const CentreMapCanvas = dynamic(
  () => import("./CentreMapCanvas").then((m) => m.CentreMapCanvas),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[440px] w-full animate-pulse bg-surface-muted md:h-[540px]"
        aria-hidden
      />
    ),
  },
);

const ALL_STATES = Array.from(
  new Set(DEADDICTION_CENTRES.map((c) => c.state)),
).sort((a, b) => a.localeCompare(b));

function districtsForState(state: string): string[] {
  return Array.from(
    new Set(
      DEADDICTION_CENTRES.filter((c) => c.state === state).map((c) => c.district),
    ),
  ).sort((a, b) => a.localeCompare(b));
}

export function DeAddictionMap() {
  const [state, setState] = React.useState("");
  const [district, setDistrict] = React.useState("");
  const [type, setType] = React.useState<CentreType | "">("");

  const districts = state ? districtsForState(state) : [];

  const filtered: DeAddictionCentre[] = DEADDICTION_CENTRES.filter((c) => {
    if (state && c.state !== state) return false;
    if (district && c.district !== district) return false;
    if (type && c.type !== type) return false;
    return true;
  });

  return (
    <div>
      {/* Control bar — filters + a legend that doubles as the type counts */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-ink">State</span>
            <Select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setDistrict("");
              }}
              aria-label="Filter centres by state"
            >
              <option value="">All States</option>
              {ALL_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-ink">District</span>
            <Select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!state}
              aria-label="Filter centres by district"
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setType("")}
            aria-pressed={type === ""}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              type === ""
                ? "bg-gov-blue text-white"
                : "bg-surface-muted text-ink-muted hover:bg-gov-blue/10 hover:text-gov-blue-dark",
            )}
          >
            All centres
            <span className={cn(type === "" ? "text-white/70" : "text-ink")}>
              {TOTAL_CENTRES}
            </span>
          </button>
          {CENTRE_TYPE_ORDER.map((t) => {
            const active = type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(active ? "" : t)}
                aria-pressed={active}
                title={CENTRE_TYPE_META[t].label}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-gov-blue text-white"
                    : "bg-surface-muted text-ink-muted hover:bg-gov-blue/10 hover:text-gov-blue-dark",
                )}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: CENTRE_TYPE_META[t].color }}
                  aria-hidden
                />
                {t}
                <span className={cn(active ? "text-white/70" : "text-ink")}>
                  {CENTRE_TYPE_META[t].count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map + results */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <CentreMapCanvas centres={filtered} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-[13px] font-medium text-ink-muted">
              Showing {filtered.length} of {DEADDICTION_CENTRES.length} listed centres
            </p>
            {filtered.length === 0 ? (
              <p className="py-6 text-center text-[14px] text-ink-muted">
                No listed centres for this selection yet. Try a wider filter, or call the
                helpline below.
              </p>
            ) : (
              <ul className="mt-3 max-h-[360px] space-y-4 overflow-y-auto pr-1">
                {filtered.map((c, i) => (
                  <li
                    key={`${c.name}-${i}`}
                    className="flex items-start gap-3 border-l-2 pl-3"
                    style={{ borderColor: CENTRE_TYPE_META[c.type].color }}
                  >
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium leading-snug text-ink">
                        {c.name}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-ink-muted">
                        {c.address}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Helpline — quiet, single line */}
          <a
            href={`tel:${HELPLINE}`}
            className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition-colors hover:border-gov-blue/40"
          >
            <Phone className="h-5 w-5 shrink-0 text-gov-blue" aria-hidden />
            <span className="text-[14px] text-ink-muted">
              24×7 Drug De-addiction Helpline
            </span>
            <span className="ml-auto text-[18px] font-bold tracking-tight text-gov-blue-dark">
              {HELPLINE}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
