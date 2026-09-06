import * as React from "react";
import { cn } from "@/lib/nhapoa/utils";
import { CASE_STATUS_META, type CaseStatus } from "@/lib/nhapoa/store/types";
import { Icon } from "@mosje/design-system";

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
    danger: "border border-reject text-reject hover:bg-reject-bg",
    saffron: "bg-saffron-600 text-white hover:bg-saffron-600/90",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-label-1 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------- StatusPill */
const TONE_CLASSES: Record<string, string> = {
  info: "bg-navy/10 text-navy",
  await: "bg-await-bg text-await-fg",
  approve: "bg-approve-bg text-approve-fg",
  reject: "bg-reject-bg text-reject-fg",
  muted: "bg-slate-100 text-slate-600",
};

export function StatusPill({ status }: { status: CaseStatus }) {
  const meta = CASE_STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-label-2 font-semibold",
        TONE_CLASSES[meta.tone] ?? TONE_CLASSES.muted,
      )}
    >
      {meta.label}
    </span>
  );
}

/* ------------------------------------------------------------- PageHeader */
export function PageHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex items-start justify-between gap-4", className)}>
      <div>
        <h1 className="text-headline-1 text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-body-2 text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
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

/* --------------------------------------------------------------- StatTile */
export function StatTile({
  label,
  value,
  accent = "navy",
}: {
  label: string;
  value: React.ReactNode;
  accent?: "navy" | "approve" | "await" | "reject";
}) {
  const accents: Record<string, string> = {
    navy: "text-navy",
    approve: "text-approve-fg",
    await: "text-await-fg",
    reject: "text-reject-fg",
  };
  return (
    <Card className="p-5">
      <div className="text-label-3 uppercase text-ink-hint">{label}</div>
      <div className={cn("mt-2 text-headline-2 font-bold tabular-nums", accents[accent])}>{value}</div>
    </Card>
  );
}

/* ------------------------------------------------------------ SearchInput */
export function SearchInput({
  placeholder,
  value,
  onChange,
  className,
}: {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-hint" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-line bg-white py-2.5 pl-10 pr-3 text-body-2 text-ink placeholder:text-ink-hint focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15"
      />
    </div>
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
              <th key={c.key} scope="col" className={cn("px-6 py-4 font-semibold", c.className)}>
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

/* -------------------------------------------------------------- EmptyState */
export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white/60 px-6 py-16 text-center">
      <div className="text-title-3 text-ink">{title}</div>
      {hint && <div className="mt-1 text-body-3 text-ink-hint">{hint}</div>}
    </div>
  );
}

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

/** Group wrapper for radio/checkbox sets — uses fieldset/legend (never a <label>,
 *  which would nest labels and break group-name announcement). */
export function Fieldset({
  legend,
  required,
  children,
  className,
}: {
  legend: string;
  required?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="mb-1.5 block text-label-1 text-ink">
        {legend}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </legend>
      {children}
    </fieldset>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-body-2 text-ink placeholder:text-ink-hint focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15",
        props.className,
      )}
    />
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
export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number; // 0-indexed active step
}) {
  return (
    <nav aria-label="Form progress" className="flex items-start">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <div className="flex min-w-0 flex-col items-center text-center" aria-current={active ? "step" : undefined}>
              <div
                aria-hidden="true"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-label-1 font-semibold",
                  done
                    ? "bg-approve text-white"
                    : active
                      ? "border-2 border-navy text-navy"
                      : "border border-line bg-white text-ink-hint",
                )}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={cn(
                  "mt-2 max-w-[8rem] text-label-2",
                  active ? "font-semibold text-navy" : done ? "text-ink" : "text-ink-hint",
                )}
              >
                <span className="sr-only">Step {i + 1} of {steps.length}{active ? ", current" : done ? ", completed" : ""}: </span>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div aria-hidden="true" className={cn("mt-4 h-0.5 flex-1", done ? "bg-approve" : "bg-line")} />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/* ---------------------------------------------------------------- Textarea */
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-body-2 text-ink placeholder:text-ink-hint focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15",
        props.className,
      )}
    />
  );
}

/* ---------------------------------------------------- Select (controlled) */
export function Select({
  options,
  placeholder,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: readonly string[];
  placeholder?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        {...props}
        className="w-full appearance-none rounded-lg border border-line bg-white px-3.5 py-2.5 pr-9 text-body-2 text-ink focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Icon name="keyboard_arrow_down" size={16} className="pointer-events-none absolute right-3 top-1/2  -translate-y-1/2 text-ink-hint" />
    </div>
  );
}

