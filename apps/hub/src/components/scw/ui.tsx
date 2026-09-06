import * as React from "react";
import { cn } from "@/lib/scw/utils";
import type { AppStatus } from "@/lib/scw/types";
import { Icon,
  PageHeader as DsPageHeader,
  type PageHeaderProps,
} from "@mosje/design-system";

/* ----------------------------------------------------------------- Buttons */
export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "danger" | "saffron";
}) {
  const variants: Record<string, string> = {
    primary: "bg-navy text-white hover:bg-navy-800",
    outline: "border border-navy/30 text-navy hover:bg-navy/5",
    ghost: "text-ink-muted hover:bg-black/5",
    danger: "border border-red-400 text-red-600 hover:bg-red-50",
    // saffron-600, NOT the bare `saffron` (#ec6a1f): white on that measures
    // 3.15:1 and fails WCAG 1.4.3 for the button's 14px label. saffron-600
    // #b8500f is 5.01:1. Hover deepens rather than repeating the rest state.
    saffron: "bg-saffron-600 text-white hover:bg-saffron-dark",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-label-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------- StatusPill */
export function StatusPill({ status }: { status: AppStatus | string }) {
  const map: Record<string, string> = {
    Approved: "bg-approve-bg text-approve-fg",
    "Awaiting Evaluation": "bg-await-bg text-await-fg",
    Rejected: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-label-2",
        map[status] ?? "bg-slate-100 text-slate-600"
      )}
    >
      {status === "Approved" && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-approve" />}
      {status}
    </span>
  );
}

/* ------------------------------------------------------------- PageHeader */
/**
 * The page's opening row — the design system's `PageHeader` with this portal's
 * page rhythm.
 *
 * The heading block itself is the system's, so it receives the system's fixes:
 * the type roles, the wrap-rather-than-truncate behaviour, the actions that fall
 * below the title on a narrow viewport. What is this portal's is the space under
 * it, which is why the wrapper exists at all — and why it does not carry the
 * system's name.
 */
export function PortalPageHeader({ className, ...props }: PageHeaderProps) {
  return <DsPageHeader {...props} className={cn("mb-6", className)} />;
}

/* ------------------------------------------------------------ SectionCard */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-2xl border border-line bg-white shadow-card", className)}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------ SearchInput */
export function SearchInput({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-hint" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-lg border border-line bg-white py-2.5 pl-10 pr-3 text-body-2 text-ink placeholder:text-ink-hint focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15"
      />
    </div>
  );
}

/* ----------------------------------------------------------- PeriodFilter */
/*
 * RENAMED off `FilterSelect` — the design system now exports one. This is a
 * narrower thing (an uncontrolled period chip with a default label, no value
 * prop), so it is not simply the DS component with different classes. The name
 * was the collision; see pm-ajay's kit for the same note.
 */
export function PeriodFilter({
  options,
  defaultLabel,
  className,
}: {
  options: readonly string[];
  defaultLabel: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        defaultValue=""
        className="w-full appearance-none rounded-lg border border-line bg-white py-2.5 pl-4 pr-9 text-body-2 text-ink focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15"
      >
        <option value="">{defaultLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Icon name="keyboard_arrow_down" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-hint" />
    </div>
  );
}

/* ------------------------------------------------------------- Pagination */
export function Pagination({
  total,
  pageSize = 10,
  totalPages,
}: {
  total: number;
  pageSize?: number;
  totalPages: number;
}) {
  const pages = totalPages <= 6 ? Array.from({ length: totalPages }, (_, i) => i + 1) : [1, 2, 3, 4, 5];
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">
      <nav className="flex items-center gap-1.5 text-label-1">
        <PageBtn disabled>‹</PageBtn>
        {pages.map((p) => (
          <PageBtn key={p} active={p === 1}>
            {p}
          </PageBtn>
        ))}
        {totalPages > 6 && (
          <>
            <span className="px-1 text-ink-hint">…</span>
            <PageBtn>{totalPages}</PageBtn>
          </>
        )}
        <PageBtn>›</PageBtn>
      </nav>
      <div className="flex items-center gap-2 text-body-2 text-ink-muted">
        <span>Showing</span>
        <span className="relative">
          <select className="appearance-none rounded-md border border-line bg-white py-1 pl-2.5 pr-7 text-body-2">
            <option>{pageSize}</option>
            <option>50</option>
            <option>100</option>
          </select>
          <Icon name="keyboard_arrow_down" size={14} className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-ink-hint" />
        </span>
        <span>
          of <span className="font-semibold text-ink">{total}</span> items
        </span>
      </div>
    </div>
  );
}

function PageBtn({
  children,
  active,
  disabled,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-label-1 transition-colors",
        active
          ? "border-navy bg-navy/5 font-semibold text-navy"
          : "border-line text-ink-muted hover:bg-black/5",
        disabled && "cursor-not-allowed opacity-40 hover:bg-transparent"
      )}
    >
      {children}
    </button>
  );
}

/* --------------------------------------------------------------- DataTable */
export function DataTable({
  columns,
  children,
  className,
}: {
  columns: { key: string; label: string; className?: string }[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-line bg-white shadow-card", className)}>
      <table className="w-full min-w-[640px] text-left text-body-2">
        <thead>
          <tr className="border-b border-line text-ink-muted">
            {columns.map((c) => (
              <th key={c.key} className={cn("px-6 py-4 font-semibold", c.className)}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

/* --------------------------------------------------------------- FieldGrid */
/** Label-above-value read-only grid used on detail pages. */
export function FieldGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(([label, value], i) => (
        <div key={`${label}-${i}`}>
          <div className="text-label-2 text-ink-hint">{label}</div>
          <div className="mt-1 text-body-2 text-ink">{value || "-"}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * An uppercase kicker above a block of content.
 *
 * It is NOT the design system's `SectionTitle`, which is a section header with a
 * title, an optional description and a place for actions. This renders the
 * kicker alone, which is why it no longer carries that name — an import of
 * `SectionTitle` in this portal used to resolve to either one, silently.
 */
export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 text-label-3 uppercase text-ink-hint">{children}</h2>
  );
}

/* ----------------------------------------------------------------- Stepper */

/* ------------------------------------------------------------- Form atoms */
export function Field({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-label-1 text-ink">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-body-2 text-ink placeholder:text-ink-hint focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15",
        props.className
      )}
    />
  );
}

export function Select({
  options,
  placeholder,
  className,
}: {
  options: readonly string[];
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        defaultValue=""
        className="w-full appearance-none rounded-lg border border-line bg-white px-3.5 py-2.5 pr-9 text-body-2 text-ink focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <Icon name="keyboard_arrow_down" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-hint" />
    </div>
  );
}
