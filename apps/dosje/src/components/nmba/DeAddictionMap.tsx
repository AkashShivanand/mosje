"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { MapPin, Phone } from "lucide-react";
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
        className="h-[420px] w-full animate-pulse bg-surface-muted md:h-[520px]"
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
      {/* National footprint — stat band */}
      <div className="overflow-hidden rounded-xl bg-gradient-to-r from-gov-blue-dark to-gov-blue">
        <dl className="grid grid-cols-2 divide-x divide-y divide-white/15 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
          <div className="px-4 py-5 text-center">
            <dd className="text-[28px] font-bold leading-none text-white">{TOTAL_CENTRES}</dd>
            <dt className="mt-2 text-[12px] font-medium uppercase tracking-wide text-white/80">
              Total Centres
            </dt>
          </div>
          {CENTRE_TYPE_ORDER.map((t) => (
            <div key={t} className="px-4 py-5 text-center">
              <dd className="text-[28px] font-bold leading-none text-white">
                {CENTRE_TYPE_META[t].count}
              </dd>
              <dt className="mt-2 text-[12px] font-medium uppercase tracking-wide text-white/80">
                {t}
              </dt>
            </div>
          ))}
        </dl>
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
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
          <label>
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

        {/* Centre-type pill filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setType("")}
            aria-pressed={type === ""}
            className={cn(
              "rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors",
              type === ""
                ? "bg-gov-blue text-white shadow-sm"
                : "bg-surface-muted text-ink-muted hover:bg-gov-blue/10 hover:text-gov-blue-dark",
            )}
          >
            All types
          </button>
          {CENTRE_TYPE_ORDER.map((t) => {
            const active = type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(active ? "" : t)}
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors",
                  active
                    ? "bg-gov-blue text-white shadow-sm"
                    : "bg-surface-muted text-ink-muted hover:bg-gov-blue/10 hover:text-gov-blue-dark",
                )}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: CENTRE_TYPE_META[t].color }}
                  aria-hidden
                />
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map + results */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <CentreMapCanvas centres={filtered} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-[13px] font-medium text-ink-muted">
              {filtered.length} centre{filtered.length === 1 ? "" : "s"} shown
            </p>
            {filtered.length === 0 ? (
              <p className="py-4 text-center text-[14px] text-ink-muted">
                No listed centres for this selection yet. Try a wider filter or call the
                helpline below.
              </p>
            ) : (
              <ul className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
                {filtered.map((c, i) => (
                  <li key={`${c.name}-${i}`} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-gov-blue/10">
                      <MapPin
                        className="h-4 w-4"
                        style={{ color: CENTRE_TYPE_META[c.type].color }}
                        aria-hidden
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium leading-snug text-ink">
                        {c.name}
                      </span>
                      <span className="block text-[13px] text-ink-muted">{c.address}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Helpline */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-gov-blue/10 text-gov-blue">
              <Phone className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] text-ink-muted">Drug De-addiction Helpline</p>
              <a
                href={`tel:${HELPLINE}`}
                className="text-[20px] font-bold leading-tight text-gov-blue-dark hover:underline"
              >
                {HELPLINE}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
