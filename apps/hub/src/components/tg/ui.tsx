import * as React from "react";
import { Badge, DataTable as DsDataTable, Icon,
  PageHeader as DsPageHeader,
  type PageHeaderProps,
  Card,
} from "@mosje/design-system";
import { cn } from "@/lib/tg/utils";
import {
  STAGE_META,
  SLA_RISK_META,
  slaRisk,
  type Stage,
  type SlaRisk,
} from "@/lib/tg/store/types";

/** The DS Badge's status palette, derived from its props so it stays in sync. */
type BadgeStatus = NonNullable<React.ComponentProps<typeof Badge>["status"]>;

/* ----------------------------------------------------------------- Buttons */
/**
 * This portal's button.
 *
 * IT SHOULD BE the design system's `Button`, and it is not yet, for two reasons
 * that were measured rather than assumed on 6 September 2026:
 *
 * 1. BRAND. Inside this portal `--sa-bg-brand-primary-bolder` resolves to
 *    #005eb9, while this button draws Tailwind `navy`, #13366b. Adopting the
 *    system's today would turn every filled button in this portal gov-blue.
 *    `ds/portal-navy-default` (#335) sets the brand mode that makes the swap
 *    correct; it should land first.
 * 2. SAFFRON. The system's `variant` is primary | success | danger | neutral —
 *    it cannot express the estate's secondary brand. The tokens exist and are
 *    good (`bg/brand/secondary/bolder` is #c34700 with white on it, better
 *    contrast than the #b8500f used here), so the fix is a `secondary` variant
 *    on the system's Button, not a className override.
 *
 * Everything else about this component is already the system's job: the focus
 * ring, the disabled treatment, the icon slots, the loading state it does not
 * have.
 */
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
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-label-1 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

/* --------------------------------------------------- StatusPill / SlaBadge */
// Both render through the shared DS Badge (one status-chip implementation for
// the whole portal); we only map our domain tones onto Badge's status palette.
const STAGE_BADGE_STATUS: Record<Stage, BadgeStatus> = {
  SUBMITTED: "info",
  MAKER_REVIEW: "warning",
  CHECKER_REVIEW: "warning",
  DM_REVIEW: "warning",
  APPROVED_SIGNED: "success",
  CORRECTION_REQUESTED: "danger",
  REJECTED: "danger",
  WITHDRAWN: "neutral",
};

export function StatusPill({ status }: { status: Stage }) {
  return <Badge status={STAGE_BADGE_STATUS[status]}>{STAGE_META[status].label}</Badge>;
}

const SLA_BADGE_STATUS: Record<SlaRisk, BadgeStatus> = {
  overdue: "danger",
  "at-risk": "warning",
  safe: "success",
};

export function SlaBadge({ daysLeft }: { daysLeft: number }) {
  const risk = slaRisk(daysLeft);
  return <Badge status={SLA_BADGE_STATUS[risk]}>{SLA_RISK_META[risk].label}</Badge>;
}

/** Shared label class for ad-hoc form labels (e.g. modal note fields). */
export const cnField = "mb-1.5 block text-label-1 text-ink";

/* ------------------------------------------------------------------- Table */
export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

/**
 * Thin generic wrapper over the shared DS DataTable (paginated, Figma-styled).
 * The DS component constrains its row type to `Record<string, unknown>`; this
 * wrapper contains the single cast so call sites stay fully typed on `T` and
 * still render through the one shared table implementation.
 */
export function Table<T>({
  columns,
  data,
  total,
  caption,
  emptyLabel,
  className,
}: {
  columns: Column<T>[];
  data: T[];
  total?: number;
  caption?: string;
  emptyLabel?: React.ReactNode;
  className?: string;
}) {
  const Dt = DsDataTable as unknown as React.FC<{
    columns: Column<T>[];
    data: T[];
    total: number;
    caption?: string;
    emptyLabel?: React.ReactNode;
    className?: string;
  }>;
  return (
    <Dt
      columns={columns}
      data={data}
      total={total ?? data.length}
      caption={caption}
      emptyLabel={emptyLabel}
      className={className}
    />
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
      <div className={cn("mt-2 text-headline-2 tabular-nums", accents[accent])}>{value}</div>
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
        className="w-full rounded-lg border border-line bg-white py-2.5 pl-10 pr-3 text-body-2 text-ink placeholder:text-ink-hint focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/70"
      />
    </div>
  );
}

/* -------------------------------------------------------------- EmptyState */

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
        {required && <span className="ml-0.5 text-reject-fg">*</span>}
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
        {required && <span className="ml-0.5 text-reject-fg">*</span>}
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
        "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-body-2 text-ink placeholder:text-ink-hint focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/70",
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

/* ---------------------------------------------------------------- Textarea */

/* ---------------------------------------------------- Select (controlled) */

