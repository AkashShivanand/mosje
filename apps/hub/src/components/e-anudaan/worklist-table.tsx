"use client";

import * as React from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  buttonClasses,
  Card,
  CardBody,
  DataTable,
  DescriptionList,
  DatePicker,
  FilterSelect,
  FormField,
  Icon,
  Modal,
  Pagination,
  Search,
  Select,
  Textarea,
  useToast,
  type DataTableColumn,
  type WorklistColumn,
} from "@mosje/design-system";
import type { GrantApplication, Inspection, InspectionStatus, RoleId } from "@/lib/e-anudaan/types";
import {
  INSPECTION_ACTION_LABEL,
  INSPECTION_FILTERS,
  INSPECTION_STATUS_LABEL,
  INSPECTION_STATUS_TONE,
  inspectionActionFor,
  inspectionsFor,
  recordInspection,
  scheduleInspection,
  type InspectionAction,
} from "@/lib/e-anudaan/officer";
import { formatDate, formatGrant, rejectionOf, schemeLabel } from "@/lib/e-anudaan/selectors";
import { caseLabel, officerStatus } from "@/lib/e-anudaan/applicant";
import { holderLabel } from "@/lib/e-anudaan/workflow";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { placeOfProjectId } from "@/lib/e-anudaan/geography";
import { awaitingInspection } from "@/lib/e-anudaan/registers";
import { CASE_TYPE, RECEIVED } from "@/lib/e-anudaan/glossary";

export type WorklistVariant = "queue" | "explorer" | "sanctioned" | "rejected" | "forwarded";

export interface WorklistColumnOptions {
  /** e.g. "/portals/e-anudaan/dashboard/sm2/aso/review" — omit for read-only screens. */
  reviewBase?: string;
  /** Resolves an application's NGO to its registered name. */
  ngoName?: (ngoId: string) => string;
  /** Application ids with an inspection report ready to read. */
  inspectionReady?: ReadonlySet<string>;
  /** On the Forwarded register: whose forward the "Forwarded On" date is. */
  forwardedBy?: RoleId;
  /** Where an organisation's name leads — its NGO 360. Omit and the name is plain text. */
  ngoHref?: (ngoId: string) => string;
  /** The State and district a file belongs to, for the State column. */
  placeOf?: (app: GrantApplication) => { state: string; district: string } | undefined;
  /** On the Sanction Register: where a file's payment status opens. */
  paymentBase?: string;
}

/**
 * A government reference, allowed to break in ONE place only.
 *
 * "GIA/2026-27/SHRESHTA_M2/NORTH_WEST_DELHI/01426" has a hyphen inside the year, and a hyphen
 * is a line-break opportunity, so a narrow cell broke the year in two ("GIA/2026-" / "27").
 * Every segment is kept whole, and a single break is offered after the middle slash — so where
 * the column has room the reference sits on one line, and where it has not (a 1280 screen, a
 * phone card) it takes two tidy lines, "GIA/2026-27/SHRESHTA_M2/" over
 * "NORTH_WEST_DELHI/01426", rather than widening the table under the pinned Action column.
 */
export function RefText({ value, className, breakAtEverySlash = false }: {
  value: string;
  className?: string;
  /**
   * Offer a break after every slash instead of one. For a heading, where the reference is set
   * large and on a phone even half of it is wider than the screen (PD Review, 375px: 67px of
   * sideways scroll). Segments still never break inside themselves.
   */
  breakAtEverySlash?: boolean;
}) {
  const parts = value.split("/");
  const breakAfter = parts.length >= 3 ? Math.ceil(parts.length / 2) - 1 : -1;
  return (
    <span className={className}>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          <span className="whitespace-nowrap">
            {p}
            {i < parts.length - 1 ? "/" : ""}
          </span>
          {i === breakAfter || (breakAtEverySlash && i < parts.length - 1) ? <wbr /> : null}
        </React.Fragment>
      ))}
    </span>
  );
}

/**
 * The column sets behind every officer list screen.
 *
 * Reworked after the review call of 11 Sep 2026 (T851–933):
 *   • the first column is the PROJECT ID — what officers actually look for — with the long
 *     application reference as a caption beneath it and the case type (New / nth Instalment)
 *     as a badge, so the column says what the file is before the reader goes looking;
 *   • "Requested" and "Instalment" are gone from the working lists — the requested figure is
 *     not the sanctioned one, and the instalment now rides on the case badge;
 *   • Status carries the deficiency and rework states in words and an icon, never colour alone;
 *   • the Action column is pinned (`is-sticky-right`), so a wide register can scroll sideways
 *     without the reader losing the one control on the row.
 *
 * And after the screen QA of 13 Sep 2026: the scheme reads as its short name with the financial
 * year beneath it (one column where there were two), and no column forces a minimum width —
 * those minimums summed wider than the content area at 1440, so the pinned Action column sat on
 * top of "Pending For" and clipped it to "Penc".
 *
 * `priority` decides what survives on a phone: 1 becomes the card's title, 2 a label/value
 * pair, 3 is dropped.
 */
export function worklistColumns(
  variant: WorklistVariant,
  opts: WorklistColumnOptions = {},
): WorklistColumn<GrantApplication>[] {
  const { reviewBase, ngoName = () => "—", inspectionReady, forwardedBy, ngoHref, placeOf, paymentBase } = opts;
  const verb = variant === "queue" || variant === "explorer" ? "Review" : "View";

  const payment = (row: GrantApplication): React.ReactNode =>
    paymentBase && row.sanction ? (
      <Link
        href={`${paymentBase}/${encodeURIComponent(row.id)}`}
        className={buttonClasses("primary", "text", "sm", "whitespace-nowrap")}
        aria-label={`Payment status of project ${row.institutionId}`}
      >
        <Icon name="payments" size={16} aria-hidden />
        Payment Status
      </Link>
    ) : null;

  const action = (row: GrantApplication): React.ReactNode =>
    reviewBase ? (
      /* The router link wears the design system's text-button styling (`buttonClasses`), the
         estate's pattern for a `next/link` — the DS Link and Button render a plain <a>. */
      <Link
        href={`${reviewBase}/${encodeURIComponent(row.id)}`}
        className={buttonClasses("primary", "text", "sm", "whitespace-nowrap")}
        aria-label={`${verb} project ${row.institutionId}`}
      >
        {/* Same tab, so no `open_in_new`: that glyph promised a new window it never opened (X-06). */}
        {verb}
        <RowLinkIcon />
      </Link>
    ) : (
      <span className="text-ink-hint">—</span>
    );

  const reference: WorklistColumn<GrantApplication> = {
    key: "institutionId",
    header: "Project ID",
    priority: 1,
    sortable: true,
    sortValue: (r) => r.institutionId,
    exportValue: (r) => `${r.institutionId} (${r.id})`,
    render: (r) => (
      <span className="block">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="whitespace-nowrap font-mono font-semibold text-ink">{r.institutionId}</span>
          <Badge status={r.caseType === "New" ? "primary" : "neutral"} size="sm">
            {caseLabel(r)}
          </Badge>
        </span>
        <RefText value={r.id} className="mt-0.5 block font-mono text-body-3 text-ink-muted" />
      </span>
    ),
  };

  const ngo: WorklistColumn<GrantApplication> = {
    key: "ngo",
    header: "NGO",
    priority: 2,
    exportValue: (r) => ngoName(r.ngoId),
    render: (r) => (
      <span className="block min-w-[7rem]">
        {ngoHref ? (
          <Link href={ngoHref(r.ngoId)} className="block text-[var(--sa-text-brand-primary-base)] underline-offset-2 hover:underline">
            {ngoName(r.ngoId)}
          </Link>
        ) : (
          <span className="block text-ink">{ngoName(r.ngoId)}</span>
        )}
        <span className="block text-body-3 text-ink-muted">{r.projectLabel.split(" · ")[0]}</span>
      </span>
    ),
  };

  const stateCol: WorklistColumn<GrantApplication> = {
    key: "place",
    header: "State",
    priority: 3,
    sortable: true,
    sortValue: (r) => placeOf?.(r)?.state ?? "",
    exportValue: (r) => {
      const p = placeOf?.(r);
      return p ? `${p.district}, ${p.state}` : "";
    },
    render: (r) => {
      const p = placeOf?.(r);
      return p ? (
        <span className="block">
          <span className="block whitespace-nowrap text-ink">{p.state}</span>
          <span className="block whitespace-nowrap text-body-3 text-ink-muted">{p.district}</span>
        </span>
      ) : (
        "—"
      );
    },
  };

  const status: WorklistColumn<GrantApplication> = {
    key: "status",
    header: "Status",
    priority: 2,
    exportValue: (r) => officerStatus(r, inspectionReady?.has(r.id)).label,
    render: (r) => {
      const s = officerStatus(r, inspectionReady?.has(r.id));
      return (
        <span className="block min-w-[9.5rem]">
          {/* Wide enough for every status on one line but the longest, which may take two
              ("Resubmitted after" / "Deficiency") rather than push the table wider than a 1280
              screen and under the pinned Action column. */}
          <Badge status={s.tone} className="max-w-full whitespace-normal text-left">
            <Icon name={s.icon} size={16} aria-hidden /> {s.label}
          </Badge>
          {s.note && <span className="mt-1 block text-body-3 text-ink-muted">{s.note}</span>}
        </span>
      );
    },
  };

  /* The status with the seat now holding the file — on a register of files that have moved on, the
     live explorer's "JS-PD approved · with US-PD". Forwarded read "Under Examination" on every row
     with no word of where (inventory §19).

     The status's own note comes first and the seat second, always both: the queue read "By the
     Programme Director" and All Applications "With the Assistant Section Officer" for the same
     returned file, because each printed only one of the two facts (audit O-06). */
  const statusWithSeat: WorklistColumn<GrantApplication> = {
    ...status,
    exportValue: (r) => {
      const s = officerStatus(r, inspectionReady?.has(r.id));
      return [s.label, s.note, holderLabel(r.holder)].filter(Boolean).join(" · ");
    },
    render: (r) => {
      const s = officerStatus(r, inspectionReady?.has(r.id));
      const line = [s.note, holderLabel(r.holder)].filter(Boolean).join(" · ");
      return (
        <span className="block min-w-[9.5rem]">
          <Badge status={s.tone} className="max-w-full whitespace-normal text-left">
            <Icon name={s.icon} size={16} aria-hidden /> {s.label}
          </Badge>
          {line && <span className="mt-1 block text-body-3 text-ink-muted">{line}</span>}
        </span>
      );
    },
  };

  const scheme: WorklistColumn<GrantApplication> = {
    key: "schemeCode",
    header: "Scheme",
    priority: 2,
    sortable: true,
    sortValue: (r) => `${r.schemeCode}|${r.financialYear}`,
    exportValue: (r) => `${schemeLabel(r.schemeCode)} (FY ${r.financialYear})`,
    render: (r) => (
      <span className="block">
        <span className="block whitespace-nowrap text-ink">{schemeLabel(r.schemeCode)}</span>
        <span className="block whitespace-nowrap text-body-3 text-ink-muted">FY {r.financialYear}</span>
      </span>
    ),
  };

  const dateCell = (iso: string | undefined) => <span className="whitespace-nowrap">{iso ? formatDate(iso) : "—"}</span>;

  const actionCol: WorklistColumn<GrantApplication> = {
    key: "action",
    header: "Action",
    priority: 3,
    noExport: true,
    className: "is-sticky-right",
    render: action,
  };

  const SETS: Record<WorklistVariant, WorklistColumn<GrantApplication>[]> = {
    queue: [
      reference,
      ngo,
      scheme,
      status,
      {
        key: "ageingDays",
        header: "Pending For",
        priority: 2,
        sortable: true,
        sortValue: (r) => r.ageingDays,
        exportValue: (r) => String(r.ageingDays),
        render: (r) => (
          <span className={`whitespace-nowrap ${r.ageingDays > 7 ? "font-semibold text-[var(--sa-text-status-error-base)]" : "text-ink"}`}>
            {r.ageingDays} day{r.ageingDays === 1 ? "" : "s"}
          </span>
        ),
      },
      actionCol,
    ],
    explorer: placeOf ? [reference, ngo, stateCol, scheme, statusWithSeat, actionCol] : [reference, ngo, scheme, status, actionCol],
    sanctioned: [
      reference,
      ngo,
      ...(placeOf ? [stateCol] : []),
      scheme,
      {
        key: "sanctioned",
        header: "Sanctioned",
        priority: 2,
        sortable: true,
        sortValue: (r) => r.sanction?.total ?? 0,
        exportValue: (r) => (r.sanction ? formatGrant(r.sanction.total) : ""),
        render: (r) => <span className="whitespace-nowrap">{r.sanction ? formatGrant(r.sanction.total) : "—"}</span>,
      },
      {
        key: "sanctionDate",
        header: "Sanction Date",
        priority: 2,
        sortable: true,
        sortValue: (r) => r.sanction?.sanctionedAt ?? "",
        exportValue: (r) => (r.sanction ? formatDate(r.sanction.sanctionedAt) : ""),
        render: (r) => dateCell(r.sanction?.sanctionedAt),
      },
      {
        key: "release",
        header: "Release",
        priority: 3,
        exportValue: (r) => (r.status === "Released" ? "Released" : "Awaiting Release"),
        render: (r) => (
          <Badge status={r.status === "Released" ? "success" : "neutral"} size="sm">
            <span className="whitespace-nowrap">{r.status === "Released" ? "Released" : "Awaiting Release"}</span>
          </Badge>
        ),
      },
      {
        key: "orderNo",
        header: "Order No.",
        priority: 3,
        exportValue: (r) => r.sanction?.orderNo ?? "",
        render: (r) => (r.sanction ? <RefText value={r.sanction.orderNo} className="font-mono text-body-3" /> : "—"),
      },
      {
        ...actionCol,
        render: (r) => (
          <span className="flex flex-col items-start gap-1">
            {action(r)}
            {payment(r)}
          </span>
        ),
      },
    ],
    rejected: [
      reference,
      ngo,
      ...(placeOf ? [stateCol] : []),
      scheme,
      { key: "rejectedOn", header: "Rejected On", priority: 2, exportValue: (r) => { const e = rejectionOf(r); return e ? formatDate(e.at) : ""; }, render: (r) => dateCell(rejectionOf(r)?.at) },
      {
        key: "reason",
        header: "Reason",
        priority: 3,
        exportValue: (r) => rejectionOf(r)?.remarks ?? "",
        render: (r) => <span className="block min-w-[10rem]">{rejectionOf(r)?.remarks ?? "—"}</span>,
      },
      actionCol,
    ],
    forwarded: [
      reference,
      ngo,
      ...(placeOf ? [stateCol] : []),
      scheme,
      {
        key: "forwardedOn",
        header: "Forwarded On",
        priority: 2,
        exportValue: (r) => { const at = forwardedAt(r, forwardedBy); return at ? formatDate(at) : ""; },
        render: (r) => dateCell(forwardedAt(r, forwardedBy)),
      },
      statusWithSeat,
      actionCol,
    ],
  };

  return SETS[variant];
}

/** When this officer last forwarded the file; the file's last movement if no officer is named. */
function forwardedAt(app: GrantApplication, by?: RoleId): string | undefined {
  if (!by) return app.updatedAt;
  return [...app.audit].reverse().find((e) => e.byRole === by && e.action === "forward")?.at;
}

/**
 * The same rows as cards, below the tablet anchor — for the tables embedded in a dashboard, which
 * do not sit in `WorklistScreen` and so never got its card view. On a 375px phone the table kept
 * two columns, Project ID and Action: the NGO, status and days pending were off-screen and the
 * "New" badge clipped to "Ne" (review call of 11 Sep 2026: "on mobile, a card view, not a table").
 *
 * Read through the columns' own `priority`, exactly as `WorklistScreen` reads them: 1 is the title,
 * 2 a label/value pair, and the Action column the card's footer. Paged at the table's first page
 * size, so a phone and a desktop count the same pages.
 */
const CARD_PAGE_SIZE = 10;

function ColumnCards<T extends object>({
  columns,
  rows,
  rowId,
  label,
  emptyLabel,
  className,
}: {
  columns: WorklistColumn<T>[];
  rows: T[];
  rowId: (row: T) => string;
  label: string;
  emptyLabel: string;
  className?: string;
}) {
  const [page, setPage] = React.useState(1);
  const pages = Math.max(1, Math.ceil(rows.length / CARD_PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = rows.slice((current - 1) * CARD_PAGE_SIZE, current * CARD_PAGE_SIZE);
  const cell = (c: WorklistColumn<T>, row: T): React.ReactNode =>
    c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "");
  const title = columns.find((c) => c.priority === 1);
  const action = columns.find((c) => c.key === "action");
  const pairs = columns.filter((c) => c !== title && c !== action && (c.priority ?? 2) === 2);

  if (rows.length === 0) {
    return <p className={`py-6 text-center text-body-2 text-ink-muted ${className ?? ""}`}>{emptyLabel}</p>;
  }

  return (
    <div className={className}>
      <ul className="m-0 flex list-none flex-col gap-3 p-0" aria-label={label}>
        {shown.map((row) => (
          <li key={rowId(row)}>
            <Card variant="outlined">
              <CardBody className="gap-3 p-4">
                {title ? <div className="min-w-0 [overflow-wrap:anywhere]">{cell(title, row)}</div> : null}
                {/* The label column takes only the width of its longest label, as WorklistScreen's
                    card does. DescriptionList's inline layout gave the label half the card and
                    pushed a status badge past its right edge. */}
                <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 text-body-2">
                  {pairs.map((c) => (
                    <React.Fragment key={c.key}>
                      <dt className="text-ink-muted">{c.header}</dt>
                      <dd className="m-0 min-w-0 [overflow-wrap:anywhere]">{cell(c, row)}</dd>
                    </React.Fragment>
                  ))}
                </dl>
                {action ? <div className="flex justify-end">{cell(action, row)}</div> : null}
              </CardBody>
            </Card>
          </li>
        ))}
      </ul>
      {pages > 1 ? (
        <div className="flex justify-center pt-4">
          <Pagination page={current} totalPages={pages} onPageChange={setPage} size="sm" label={`${label} pages`} />
        </div>
      ) : null}
    </div>
  );
}

/** The one empty-list sentence across the officer console, embedded table and full screen alike. */
export const EMPTY_LIST = "No applications in this list.";

/** The status groups an officer filters a worklist by. */
export const STATUS_FILTERS = [
  { value: "", label: "All Statuses" },
  { value: "Deficiency to Send", label: "Deficiency to Send" },
  { value: "Deficiency Raised", label: "Deficiency Raised" },
  { value: "Resubmitted after Deficiency", label: "Resubmitted after Deficiency" },
  { value: "Returned for Rework", label: "Returned for Rework" },
  { value: RECEIVED, label: RECEIVED },
  { value: "Under Examination", label: "Under Examination" },
] as const;

/**
 * Not a status but a fact about the file, offered in the queue's Status filter so the dashboard's
 * "Inspection Report Available" figure can open exactly the rows it counts.
 */
export const INSPECTION_READY_FILTER = "Inspection Report Available";

export const TYPE_FILTERS = [
  { value: "", label: "All Case Types" },
  { value: "New", label: CASE_TYPE.new },
  { value: "1", label: "1st Instalment" },
  { value: "2", label: "2nd Instalment" },
  { value: "3", label: "3rd Instalment" },
] as const;

export function matchesType(app: GrantApplication, type: string): boolean {
  if (!type) return true;
  if (type === "New") return app.caseType === "New";
  return app.caseType === "Ongoing" && String(app.instalment) === type;
}

/**
 * The trailing mark on a row link that opens another screen in the same tab. Every officer register
 * uses this one, so no list goes back to `open_in_new` (audit X-06).
 */
export function RowLinkIcon() {
  return <Icon name="chevron_right" size={16} aria-hidden />;
}

/**
 * A search field with a visible label, sized and labelled like the `FilterSelect`s beside it.
 *
 * The bare `Search` carried only a placeholder, which truncated to "Search application" and left
 * the one text field in the bar as the only control without a label (audit O-07).
 */
export function LabelledSearch({
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const id = React.useId();
  return (
    <div className={`flex min-w-0 flex-col gap-1 ${className ?? ""}`}>
      <label htmlFor={id} className="text-label-2 font-semibold text-[var(--sa-text-neutral-subtle)]">
        {label}
      </label>
      <Search id={id} size="sm" value={value} onChange={(e) => onChange(e.target.value)} onClear={() => onChange("")} placeholder={placeholder} />
    </div>
  );
}

/** Hook: the column options every officer list needs, resolved from the store once. */
export function useWorklistOptions(
  reviewBase?: string,
  forwardedBy?: RoleId,
  extra: Pick<WorklistColumnOptions, "paymentBase"> & { withPlace?: boolean; withNgoLink?: boolean } = {},
): WorklistColumnOptions {
  const { state } = useEAnudaan();
  const { paymentBase, withPlace = false, withNgoLink = false } = extra;
  return React.useMemo(() => {
    const names = new Map(state.ngos.map((n) => [n.id, n.name]));
    const ready = new Set(
      state.inspections.filter((i) => i.status === "Submitted" || i.status === "Reviewed").map((i) => i.applicationId),
    );
    const places = new Map(state.ngos.flatMap((n) => n.institutions.map((i) => [i.id, { state: i.state, district: i.district }] as const)));
    return {
      reviewBase,
      forwardedBy,
      paymentBase,
      ngoName: (id: string) => names.get(id) ?? "—",
      inspectionReady: ready,
      ngoHref: withNgoLink ? (id: string) => `/portals/e-anudaan/dashboard/ngo/${encodeURIComponent(id)}/360` : undefined,
      placeOf: withPlace ? (app: GrantApplication) => places.get(app.institutionId) ?? placeOfProjectId(app.institutionId) : undefined,
    };
  }, [state.ngos, state.inspections, reviewBase, forwardedBy, paymentBase, withPlace, withNgoLink]);
}

/**
 * The embedded application table — the Action Queue and the scheme worklists render it inside
 * their own page, so it carries its own search and filters but no page heading.
 */
export function WorklistTable({
  rows,
  variant = "queue",
  reviewBase,
  caption,
  id,
  status: controlledStatus,
  onStatusChange,
  caseType: controlledType,
  onCaseTypeChange,
}: {
  rows: GrantApplication[];
  variant?: WorklistVariant;
  reviewBase?: string;
  caption: string;
  /** The card's id, so a figure elsewhere on the page can bring the reader to this table. */
  id?: string;
  /**
   * The Status filter, when the page owns it — the dashboard's figures set it so that each opens
   * exactly the rows it counts (audit O-03). Omit and the table keeps its own.
   */
  status?: string;
  onStatusChange?: (status: string) => void;
  /**
   * The Case Type filter, when the page owns it — the dashboard's case tiles set it, so a tile
   * and this table cannot disagree about which files it means. Omit and the table keeps its own.
   */
  caseType?: string;
  onCaseTypeChange?: (type: string) => void;
}) {
  const [q, setQ] = React.useState("");
  const [ownType, setOwnType] = React.useState("");
  const type = controlledType ?? ownType;
  const setType = onCaseTypeChange ?? setOwnType;
  const [ownStatus, setOwnStatus] = React.useState("");
  const status = controlledStatus ?? ownStatus;
  const setStatus = onStatusChange ?? setOwnStatus;
  // NGO names link to NGO 360 in every officer list, the queue included (audit O-06).
  const opts = useWorklistOptions(reviewBase, undefined, { withNgoLink: true });
  const columns = React.useMemo(() => worklistColumns(variant, opts), [variant, opts]);

  const statusOptions = React.useMemo(() => {
    const labels = [...new Set(rows.map((r) => officerStatus(r).label))].sort();
    const withReport = rows.some((r) => opts.inspectionReady?.has(r.id));
    return [
      STATUS_FILTERS[0],
      ...labels.map((l) => ({ value: l, label: l })),
      ...(withReport || status === INSPECTION_READY_FILTER ? [{ value: INSPECTION_READY_FILTER, label: INSPECTION_READY_FILTER }] : []),
    ];
  }, [rows, opts, status]);

  const matchesStatus = React.useCallback(
    (r: GrantApplication) =>
      !status || (status === INSPECTION_READY_FILTER ? !!opts.inspectionReady?.has(r.id) : officerStatus(r).label === status),
    [status, opts],
  );

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        matchesType(r, type) &&
        matchesStatus(r) &&
        (!needle ||
          r.id.toLowerCase().includes(needle) ||
          r.institutionId.toLowerCase().includes(needle) ||
          (opts.ngoName?.(r.ngoId) ?? "").toLowerCase().includes(needle)),
    );
  }, [rows, q, type, matchesStatus, opts]);

  const active = (q.trim() ? 1 : 0) + (type ? 1 : 0) + (status ? 1 : 0);

  return (
    <Card variant="outlined" id={id} tabIndex={id ? -1 : undefined} className={id ? "scroll-mt-4 outline-none" : undefined}>
      <CardBody>
      <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
        <LabelledSearch label="Search" value={q} onChange={setQ} placeholder="Project ID or NGO" />
        <FilterSelect label="Case Type" options={[...TYPE_FILTERS]} value={type} onChange={setType} />
        {/* Only the statuses present in these rows. A fixed list offered five statuses the
            Finance queue never holds, so every choice emptied the table (screen audit, 14 Sep). */}
        <FilterSelect label="Status" options={statusOptions} value={status} onChange={setStatus} />
        <p className="text-body-2 text-ink-muted md:pb-2.5 md:text-right" role="status">
          {/* The table's own footer says which page of rows is shown; this line only says how
              many the filters let through, so the two never state different "Showing" counts. */}
          {active > 0
            ? `${filtered.length} of ${rows.length} match the filters`
            : `${rows.length} ${rows.length === 1 ? "application" : "applications"}`}
          {active > 0 && (
            <Button
              appearance="text"
              size="sm"
              className="ml-2"
              onClick={() => {
                setQ("");
                setType("");
                setStatus("");
              }}
            >
              Clear filters
            </Button>
          )}
        </p>
      </div>
      {/* DataTable is generic over Record<string, unknown>. GrantApplication is a precise
          interface with no index signature, so it is widened here rather than loosening the
          domain model for every other consumer. */}
      <div className="hidden md:block">
        <DataTable
          columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
          data={filtered as unknown as Record<string, unknown>[]}
          total={filtered.length}
          caption={caption}
          emptyLabel={active > 0 ? "No application matches these filters." : EMPTY_LIST}
        />
      </div>
      <ColumnCards
        className="md:hidden"
        columns={columns}
        rows={filtered}
        rowId={(r) => r.id}
        label={caption}
        emptyLabel={active > 0 ? "No application matches these filters." : EMPTY_LIST}
      />
      </CardBody>
    </Card>
  );
}

/* ── PMU inspections ──────────────────────────────────────────────────────── */

type Recommendation = NonNullable<Inspection["recommendation"]>;
const RECOMMENDATIONS: Recommendation[] = ["Satisfactory", "Needs improvement", "Unsatisfactory"];

/**
 * The PMU field officer's inspection table — the dashboard and the PMU Inspections screen both
 * render it, so the two cannot list, word or act on an inspection differently.
 *
 * Screen QA, 13 Sep 2026: the list was subtitled "Awaiting inspection" while it held Scheduled
 * and Submitted visits, its "Action" column held status badges and no action, and the
 * dashboard's copy had no reference number. Each row now carries its reference, its state in
 * words, and the one next step that state allows.
 */
export function InspectionTable({
  caption,
  scope = "all",
  searchable = false,
  showFinding = false,
}: {
  caption: string;
  /** "open" — the officer's visits not yet reported (live "My open visits"). */
  scope?: "all" | "open";
  /** A search box over Project ID, application and NGO (live PMU worklist). */
  searchable?: boolean;
  /** The Finding column: recommendation and the first line of the findings. */
  showFinding?: boolean;
}) {
  const store = useEAnudaan();
  const { state } = store;
  const { toast } = useToast();
  const [status, setStatus] = React.useState<"" | InspectionStatus>("");
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState<{ insp: Inspection; action: InspectionAction } | null>(null);

  const names = React.useMemo(() => new Map(state.ngos.map((n) => [n.id, n.name])), [state.ngos]);
  const apps = React.useMemo(() => new Map(state.applications.map((a) => [a.id, a])), [state.applications]);
  const base = React.useMemo(
    () => (scope === "open" ? inspectionsFor(state).filter((i) => i.status === "Pending" || i.status === "Scheduled") : inspectionsFor(state)),
    [state, scope],
  );
  const rows = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return base.filter(
      (i) =>
        (!status || i.status === status) &&
        (!needle ||
          i.institutionId.toLowerCase().includes(needle) ||
          i.applicationId.toLowerCase().includes(needle) ||
          (names.get(i.ngoId) ?? "").toLowerCase().includes(needle)),
    );
  }, [base, status, q, names]);
  const all = base.length;
  const filterOptions = scope === "open" ? INSPECTION_FILTERS.filter((f) => f.value === "" || f.value === "Pending" || f.value === "Scheduled") : INSPECTION_FILTERS;

  const columns = React.useMemo<WorklistColumn<Inspection>[]>(
    () => [
      {
        key: "reference",
        header: "Reference",
        priority: 1,
        exportValue: (i) => `${i.institutionId} (${i.applicationId})`,
        render: (i) => (
          <span className="block">
            <span className="block whitespace-nowrap font-mono font-semibold text-ink">{i.institutionId}</span>
            <RefText value={i.applicationId} className="mt-0.5 block font-mono text-body-3 text-ink-muted" />
          </span>
        ),
      },
      {
        key: "ngo",
        header: "NGO",
        priority: 2,
        render: (i) => (
          <span className="block min-w-[7rem]">
            <span className="block text-ink">{names.get(i.ngoId) ?? "—"}</span>
            <span className="block text-body-3 text-ink-muted">{apps.get(i.applicationId)?.projectLabel.split(" · ")[0] ?? ""}</span>
          </span>
        ),
      },
      {
        key: "scheduledFor",
        header: "Visit",
        priority: 2,
        exportValue: (i) => `${i.scheduledFor ? formatDate(i.scheduledFor) : "Not Scheduled"} (${i.visitType})`,
        render: (i) => (
          <span className="block whitespace-nowrap">
            {i.scheduledFor ? formatDate(i.scheduledFor) : "Not Scheduled"}
            <span className="block text-body-3 text-ink-muted">{i.visitType} Visit</span>
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        priority: 2,
        render: (i) => (
          <Badge status={INSPECTION_STATUS_TONE[i.status]}>
            <span className="whitespace-nowrap">{INSPECTION_STATUS_LABEL[i.status]}</span>
          </Badge>
        ),
      },
      ...(showFinding
        ? [
            {
              key: "finding",
              header: "Finding",
              priority: 2 as const,
              exportValue: (i: Inspection) => [i.recommendation, i.findings].filter(Boolean).join(" — "),
              render: (i: Inspection) =>
                i.status === "Submitted" || i.status === "Reviewed" ? (
                  <span className="block min-w-[10rem]">
                    <span className="block text-ink">{i.recommendation ?? "Not Recorded"}</span>
                    {i.findings && <span className="line-clamp-2 block text-body-3 text-ink-muted">{i.findings}</span>}
                  </span>
                ) : (
                  <span className="text-ink-hint">—</span>
                ),
            },
          ]
        : []),
      {
        key: "action",
        header: "Action",
        priority: 3,
        noExport: true,
        className: "is-sticky-right",
        render: (i) => {
          const action = inspectionActionFor(i);
          return (
            <Button
              appearance={action === "view" ? "text" : "outlined"}
              size="sm"
              onClick={() => setOpen({ insp: i, action })}
              aria-label={`${INSPECTION_ACTION_LABEL[action]} — ${i.institutionId}`}
            >
              <span className="whitespace-nowrap">{INSPECTION_ACTION_LABEL[action]}</span>
            </Button>
          );
        },
      },
    ],
    [names, apps, showFinding],
  );

  const save = (next: Inspection, done: string) => {
    store.saveInspection(next);
    toast(done, "success");
    setOpen(null);
  };

  return (
    <Card variant="outlined">
      <CardBody>
      <div className={`mb-4 grid gap-3 md:items-end ${searchable ? "md:grid-cols-[minmax(0,18rem)_minmax(0,18rem)_1fr]" : "md:grid-cols-[minmax(0,18rem)_1fr]"}`}>
        {searchable && (
          <Search value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} placeholder="Project ID or NGO" aria-label="Search inspections by Project ID, application or NGO" />
        )}
        <FilterSelect
          label="Status"
          options={filterOptions}
          value={status}
          onChange={(v) => setStatus(v as "" | InspectionStatus)}
        />
        {/* Bottom-aligned with the select's own text: the grid ends at the control, and the label
            above the control would otherwise leave the count floating 10px below its baseline. */}
        <p className="text-body-2 text-ink-muted md:pb-2.5 md:text-right" role="status">
          {status || q.trim()
            ? `${rows.length} of ${all} match the filters`
            : `${all} ${all === 1 ? "inspection" : "inspections"}`}
          {(status || q.trim()) && (
            <Button
              appearance="text"
              size="sm"
              className="ml-2"
              onClick={() => {
                setStatus("");
                setQ("");
              }}
            >
              Clear Filters
            </Button>
          )}
        </p>
      </div>
      <div className="hidden md:block">
        <DataTable
          columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
          data={rows as unknown as Record<string, unknown>[]}
          total={rows.length}
          caption={caption}
          emptyLabel={status || q.trim() ? "No inspection matches these filters." : scope === "open" ? "No visit is open." : "No inspections in this list."}
        />
      </div>
      <ColumnCards
        className="md:hidden"
        columns={columns}
        rows={rows}
        rowId={(r) => r.id}
        label={caption}
        emptyLabel={status || q.trim() ? "No inspection matches these filters." : scope === "open" ? "No visit is open." : "No inspections in this list."}
      />
      {open && (
        <InspectionDialog
          key={`${open.insp.id}-${open.action}`}
          insp={open.insp}
          action={open.action}
          ngoName={names.get(open.insp.ngoId) ?? "—"}
          onClose={() => setOpen(null)}
          onSave={save}
        />
      )}
      </CardBody>
    </Card>
  );
}

export function InspectionDialog({
  insp,
  action,
  ngoName,
  onClose,
  onSave,
}: {
  insp: Inspection;
  action: InspectionAction;
  ngoName: string;
  onClose: () => void;
  onSave: (next: Inspection, done: string) => void;
}) {
  const initialDate = insp.scheduledFor?.slice(0, 10) ?? "";
  const [date, setDate] = React.useState(initialDate);
  const [visitType, setVisitType] = React.useState<Inspection["visitType"]>(insp.visitType);
  const [findings, setFindings] = React.useState("");
  /*
   * No default (usability audit UX-08, 14 Sep 2026). The field used to open on "Satisfactory", so
   * a report submitted without a decision recorded one anyway — the most favourable one.
   */
  const [recommendation, setRecommendation] = React.useState<"" | Recommendation>("");
  const [tried, setTried] = React.useState(false);
  /** Record Inspection asks "Submit this report?" with a summary before anything is saved. */
  const [confirming, setConfirming] = React.useState(false);
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  React.useEffect(() => {
    if (confirming) summaryRef.current?.focus();
  }, [confirming]);

  const factItems = [
    { term: "Project ID", value: <span className="font-mono font-semibold">{insp.institutionId}</span> },
    { term: "Application", value: <RefText value={insp.applicationId} className="font-mono" /> },
    { term: "NGO", value: ngoName },
  ];
  const facts = <DescriptionList layout="inline" columns={1} size="sm" items={factItems} />;

  if (action === "view") {
    return (
      <Modal
        open
        onClose={onClose}
        title="Inspection Report"
        printable
        footer={
          <>
            {/* Prints the report alone — `printable` hides the page behind it (UX-24). */}
            <Button appearance="outlined" onClick={() => window.print()}>
              <Icon name="print" size={20} aria-hidden /> Print
            </Button>
            <Button onClick={onClose}>Close</Button>
          </>
        }
      >
        <div className="space-y-4">
          <DescriptionList
            layout="inline"
            columns={1}
            size="sm"
            items={[
              ...factItems,
              { term: "Visit Type", value: insp.visitType },
              { term: "Inspected On", value: insp.scheduledFor ? formatDate(insp.scheduledFor) : "—" },
              { term: "Report Submitted", value: insp.submittedAt ? formatDate(insp.submittedAt) : "—" },
              { term: "Status", value: INSPECTION_STATUS_LABEL[insp.status] },
              /* A report is only viewable once submitted, so an absent recommendation was never
                 recorded — "Not yet" promised one was coming. Three seeded reports have none. */
              { term: "Recommendation", value: insp.recommendation ?? "Not recorded" },
            ]}
          />
          <DescriptionList
            layout="stacked"
            columns={1}
            size="sm"
            items={[{ term: "Findings", value: insp.findings || "No findings were recorded." }]}
          />
        </div>
      </Modal>
    );
  }

  if (action === "schedule") {
    const error = tried && !date ? "Choose the date of the visit." : undefined;
    return (
      <Modal
        open
        onClose={onClose}
        dirty={date !== initialDate || visitType !== insp.visitType}
        title="Schedule Inspection"
        footer={
          <>
            <Button appearance="outlined" onClick={onClose}>Cancel</Button>
            <Button
              onClick={() => {
                setTried(true);
                if (!date) return;
                onSave(scheduleInspection(insp, date, visitType), `Inspection scheduled for ${formatDate(date)}.`);
              }}
            >
              Schedule
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {facts}
          <DatePicker label="Visit Date" value={date} onChange={setDate} min={today} required error={error} />
          <FormField label="Visit Type" id="insp-visit-type">
            {(c) => (
              <Select {...c} value={visitType} onChange={(e) => setVisitType(e.target.value as Inspection["visitType"])}>
                <option value="Physical">Physical</option>
                <option value="Online">Online</option>
              </Select>
            )}
          </FormField>
        </div>
      </Modal>
    );
  }

  const findingsError = tried && !findings.trim() ? "Record what was found at the visit." : undefined;
  const recommendationError = tried && !recommendation ? "Select a recommendation." : undefined;
  return (
    <Modal
      open
      onClose={onClose}
      dirty={findings.trim() !== "" || recommendation !== ""}
      title={confirming ? "Submit Inspection Report?" : "Record Inspection"}
      size="lg"
      footer={
        confirming ? (
          <>
            <Button
              appearance="outlined"
              nowrap
              onClick={() => {
                setConfirming(false);
                // Back to the field the reader is most likely to change.
                requestAnimationFrame(() => document.getElementById("insp-findings")?.focus());
              }}
            >
              Back to Edit
            </Button>
            <Button
              nowrap
              onClick={() => {
                if (!recommendation) return;
                onSave(
                  recordInspection(insp, { findings, recommendation }, new Date().toISOString()),
                  "Inspection report submitted.",
                );
              }}
            >
              Confirm and Submit
            </Button>
          </>
        ) : (
          <>
            <Button appearance="outlined" onClick={onClose}>Cancel</Button>
            <Button
              onClick={() => {
                setTried(true);
                if (!findings.trim() || !recommendation) return;
                setConfirming(true);
              }}
            >
              Submit Report
            </Button>
          </>
        )
      }
    >
      {confirming ? (
        <div ref={summaryRef} tabIndex={-1} className="space-y-4 outline-none">
          {facts}
          <p className="text-body-2 text-ink">A submitted report cannot be edited. Check the recommendation and findings below.</p>
          <DescriptionList
            layout="stacked"
            columns={1}
            size="sm"
            items={[
              { term: "Recommendation", value: recommendation },
              { term: "Findings", value: <span className="whitespace-pre-line">{findings.trim()}</span> },
            ]}
          />
        </div>
      ) : (
      <div className="space-y-4">
        {facts}
        <FormField label="Findings" id="insp-findings" required error={findingsError}>
          {(c) => <Textarea {...c} rows={5} value={findings} onChange={(e) => setFindings(e.target.value)} />}
        </FormField>
        <FormField label="Recommendation" id="insp-recommendation" required error={recommendationError}>
          {(c) => (
            <Select
              {...c}
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value as "" | Recommendation)}
            >
              <option value="">Select</option>
              {RECOMMENDATIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Select>
          )}
        </FormField>
      </div>
      )}
    </Modal>
  );
}

/* ── PMU: sanctioned files awaiting inspection ────────────────────────────── */

/**
 * Sanctioned files with no inspection raised — the live PMU's "Awaiting inspection", where each
 * row carries `Inspect`. Ours had no such list: an inspection could only be scheduled once one
 * already existed (inventory §37). "Inspect" raises the inspection and opens its schedule.
 */
export function AwaitingInspectionTable({ caption }: { caption: string }) {
  const store = useEAnudaan();
  const { state } = store;
  const { toast } = useToast();
  const [q, setQ] = React.useState("");
  const [scheduling, setScheduling] = React.useState<Inspection | null>(null);
  const opts = useWorklistOptions(undefined, undefined, { withPlace: true });

  const all = React.useMemo(() => awaitingInspection(state), [state]);
  const rows = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all.filter(
      (a) =>
        !needle ||
        a.id.toLowerCase().includes(needle) ||
        a.institutionId.toLowerCase().includes(needle) ||
        (opts.ngoName?.(a.ngoId) ?? "").toLowerCase().includes(needle),
    );
  }, [all, q, opts]);

  const columns = React.useMemo<WorklistColumn<GrantApplication>[]>(() => {
    const base = worklistColumns("sanctioned", opts).filter((c) => ["institutionId", "ngo", "place", "sanctionDate"].includes(c.key));
    return [
      ...base,
      {
        key: "action",
        header: "Action",
        priority: 3,
        noExport: true,
        className: "is-sticky-right",
        render: (a) => (
          <Button
            size="sm"
            appearance="outlined"
            nowrap
            onClick={() => {
              const insp = store.raiseInspection(a.id);
              if (insp) setScheduling(insp);
              else toast("An inspection could not be raised on this file.", "error");
            }}
            aria-label={`Inspect project ${a.institutionId}`}
          >
            Inspect
          </Button>
        ),
      },
    ];
  }, [opts, store, toast]);

  return (
    <Card variant="outlined">
      <CardBody>
        <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,18rem)_1fr] md:items-center">
          <Search value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} placeholder="Project ID or NGO" aria-label="Search files awaiting inspection" />
          <p className="text-body-2 text-ink-muted md:text-right" role="status">
            {q.trim() ? `${rows.length} of ${all.length} match the search` : `${all.length} sanctioned ${all.length === 1 ? "file" : "files"} with no inspection`}
          </p>
        </div>
        <div className="hidden md:block">
          <DataTable
            columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
            data={rows as unknown as Record<string, unknown>[]}
            total={rows.length}
            caption={caption}
            emptyLabel={q.trim() ? "No file matches this search." : "Every sanctioned file has an inspection."}
          />
        </div>
        <ColumnCards
          className="md:hidden"
          columns={columns}
          rows={rows}
          rowId={(r) => r.id}
          label={caption}
          emptyLabel={q.trim() ? "No file matches this search." : "Every sanctioned file has an inspection."}
        />
        {scheduling && (
          <InspectionDialog
            key={scheduling.id}
            insp={scheduling}
            action="schedule"
            ngoName={opts.ngoName?.(scheduling.ngoId) ?? "—"}
            onClose={() => setScheduling(null)}
            onSave={(next, done) => {
              store.saveInspection(next);
              toast(done, "success");
              setScheduling(null);
            }}
          />
        )}
      </CardBody>
    </Card>
  );
}

/**
 * Hand a column set's Action column to `WorklistScreen` as `rowActions`.
 *
 * As a column it carried priority 3, which the phone's card view drops — so on a 375px screen
 * no register row could be opened or acted on (screen check, 16 Sep 2026). As `rowActions` it is
 * the pinned last column on a table and the card's footer on a phone.
 */
export function splitRowActions<T>(columns: WorklistColumn<T>[]): {
  columns: WorklistColumn<T>[];
  rowActions?: (row: T) => React.ReactNode;
} {
  const action = columns.find((c) => c.key === "action");
  return {
    columns: columns.filter((c) => c.key !== "action"),
    rowActions: action?.render ? (row: T) => action.render!(row) : undefined,
  };
}
