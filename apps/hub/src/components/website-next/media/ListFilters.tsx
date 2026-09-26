"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Select } from "@mosje/design-system";

export interface FilterField {
  /** The URL parameter this filter writes. */
  name: string;
  label: string;
  /** Current value; "" means "all". */
  value: string;
  /** The "all" option's label, e.g. "All Organisations". */
  allLabel: string;
  options: { label: string; value: string }[];
}

interface ListFiltersProps {
  /** The page the filters belong to, e.g. "/website/events". */
  basePath: string;
  fields: FilterField[];
  /** A free-text filter, where the list has one. */
  query?: { name: string; label: string; value: string; placeholder?: string };
  /** Parameters owned by something else on the page (a tab) that a filter change keeps. */
  keep?: Record<string, string | undefined>;
}

/**
 * The filter bar of a listing (issues NAV-15, ACC-21, LAY-03).
 *
 * THE URL IS THE STATE. Every change is a navigation, so a filtered list can be
 * shared and the back button undoes it, and the page renders its result count
 * and its filtered-to-nothing state on the server from the same parameters. A
 * filter change always returns to page 1.
 *
 * A filter with one option filters nothing and is not drawn (NAV-15).
 */
export function ListFilters({ basePath, fields, query, keep = {} }: ListFiltersProps) {
  const router = useRouter();
  const [text, setText] = React.useState(query?.value ?? "");
  const baseId = React.useId();

  const current = React.useMemo(() => {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(keep)) if (v) out[k] = v;
    for (const f of fields) if (f.value) out[f.name] = f.value;
    if (query?.value) out[query.name] = query.value;
    return out;
  }, [fields, keep, query]);

  const go = (patch: Record<string, string>) => {
    const next = { ...current, ...patch };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v) params.set(k, v);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
  };

  const shown = fields.filter((f) => f.options.length > 1);
  const active = fields.some((f) => f.value) || !!query?.value;
  const clearHref = (() => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(keep)) if (v) params.set(k, v);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  })();

  if (shown.length === 0 && !query) return null;

  return (
    <div className="wn-filters" role="search" aria-label="Filter this list">
      {query && (
        <div className="wn-filters__field wn-filters__field--grow">
          <label htmlFor={`${baseId}-q`} className="wn-filters__label">
            {query.label}
          </label>
          <Search
            id={`${baseId}-q`}
            size="md"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onClear={() => {
              setText("");
              go({ [query.name]: "" });
            }}
            onSubmit={(v) => go({ [query.name]: v.trim() })}
            placeholder={query.placeholder}
          />
        </div>
      )}
      {shown.map((f) => (
        <div key={f.name} className="wn-filters__field">
          <label htmlFor={`${baseId}-${f.name}`} className="wn-filters__label">
            {f.label}
          </label>
          <Select
            id={`${baseId}-${f.name}`}
            value={f.value}
            onChange={(e) => go({ [f.name]: e.target.value })}
            options={[{ label: f.allLabel, value: "" }, ...f.options]}
          />
        </div>
      ))}
      {active && (
        <Link href={clearHref} scroll={false} className="wn-filters__clear">
          Clear Filters
        </Link>
      )}
    </div>
  );
}
