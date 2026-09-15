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
import { useEAnudaan } from "@/lib/e-anudaan/store/store";

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
  const { reviewBase, ngoName = () => "—", inspectionReady, forwardedBy } = opts;
  const verb = variant === "queue" || variant === "explorer" ? "Review" : "View";

  const action = (row: GrantApplication): React.ReactNode =>
    reviewBase ? (
      /* The router link wears the design system's text-button styling (`buttonClasses`), the
         estate's pattern for a `next/link` — the DS Link and Button render a plain <a>. */
      <Link
        href={`${reviewBase}/${encodeURIComponent(row.id)}`}
        className={buttonClasses("primary", "text", "sm", "whitespace-nowrap")}
        aria-label={`${verb} project ${row.institutionId}`}
      >
        <Icon name="open_in_new" size={16} aria-hidden />
        {verb}
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
        <span className="block text-ink">{ngoName(r.ngoId)}</span>
        <span className="block text-body-3 text-ink-muted">{r.projectLabel.split(" · ")[0]}</span>
      </span>
    ),
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
    explorer: [reference, ngo, scheme, status, actionCol],
    sanctioned: [
      reference,
      ngo,
      scheme,
      {
        key: "sanctioned",
        header: "Sanctioned",
        priority: 2,
        exportValue: (r) => (r.sanction ? `${formatGrant(r.sanction.total)} on ${formatDate(r.sanction.sanctionedAt)}` : ""),
        render: (r) =>
          r.sanction ? (
            <span className="block whitespace-nowrap">
              {formatGrant(r.sanction.total)}
              <span className="block text-body-3 text-ink-muted">{formatDate(r.sanction.sanctionedAt)}</span>
            </span>
          ) : (
            "—"
          ),
      },
      {
        key: "orderNo",
        header: "Order No.",
        priority: 3,
        exportValue: (r) => r.sanction?.orderNo ?? "",
        render: (r) => (r.sanction ? <RefText value={r.sanction.orderNo} className="font-mono text-body-3" /> : "—"),
      },
      actionCol,
    ],
    rejected: [
      reference,
      ngo,
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
      scheme,
      {
        key: "forwardedOn",
        header: "Forwarded On",
        priority: 2,
        exportValue: (r) => { const at = forwardedAt(r, forwardedBy); return at ? formatDate(at) : ""; },
        render: (r) => dateCell(forwardedAt(r, forwardedBy)),
      },
      status,
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

/** The one empty-list sentence across the officer console, embedded table and full screen alike. */
export const EMPTY_LIST = "No applications in this list.";

/** The status groups an officer filters a worklist by. */
export const STATUS_FILTERS = [
  { value: "", label: "All Statuses" },
  { value: "Deficiency to Send", label: "Deficiency to Send" },
  { value: "Deficiency Raised", label: "Deficiency Raised" },
  { value: "Resubmitted after Deficiency", label: "Resubmitted after Deficiency" },
  { value: "Returned for Rework", label: "Returned for Rework" },
  { value: "New Submission", label: "New Submission" },
  { value: "Under Examination", label: "Under Examination" },
] as const;

export const TYPE_FILTERS = [
  { value: "", label: "All Case Types" },
  { value: "New", label: "New" },
  { value: "1", label: "1st Instalment" },
  { value: "2", label: "2nd Instalment" },
  { value: "3", label: "3rd Instalment" },
] as const;

export function matchesType(app: GrantApplication, type: string): boolean {
  if (!type) return true;
  if (type === "New") return app.caseType === "New";
  return app.caseType === "Ongoing" && String(app.instalment) === type;
}

/** Hook: the column options every officer list needs, resolved from the store once. */
export function useWorklistOptions(reviewBase?: string, forwardedBy?: RoleId): WorklistColumnOptions {
  const { state } = useEAnudaan();
  return React.useMemo(() => {
    const names = new Map(state.ngos.map((n) => [n.id, n.name]));
    const ready = new Set(
      state.inspections.filter((i) => i.status === "Submitted" || i.status === "Reviewed").map((i) => i.applicationId),
    );
    return { reviewBase, forwardedBy, ngoName: (id: string) => names.get(id) ?? "—", inspectionReady: ready };
  }, [state.ngos, state.inspections, reviewBase, forwardedBy]);
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
}: {
  rows: GrantApplication[];
  variant?: WorklistVariant;
  reviewBase?: string;
  caption: string;
}) {
  const [q, setQ] = React.useState("");
  const [type, setType] = React.useState("");
  const [status, setStatus] = React.useState("");
  const opts = useWorklistOptions(reviewBase);
  const columns = React.useMemo(() => worklistColumns(variant, opts), [variant, opts]);

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        matchesType(r, type) &&
        (!status || officerStatus(r).label === status) &&
        (!needle ||
          r.id.toLowerCase().includes(needle) ||
          r.institutionId.toLowerCase().includes(needle) ||
          (opts.ngoName?.(r.ngoId) ?? "").toLowerCase().includes(needle)),
    );
  }, [rows, q, type, status, opts]);

  const active = (q.trim() ? 1 : 0) + (type ? 1 : 0) + (status ? 1 : 0);

  return (
    <Card variant="outlined">
      <CardBody>
      <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center">
        <Search
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Project ID or NGO"
          aria-label="Search applications"
        />
        <FilterSelect label="Case Type" options={[...TYPE_FILTERS]} value={type} onChange={setType} />
        {/* Only the statuses present in these rows. A fixed list offered five statuses the
            Finance queue never holds, so every choice emptied the table (screen audit, 14 Sep). */}
        <FilterSelect
          label="Status"
          options={[STATUS_FILTERS[0], ...[...new Set(rows.map((r) => officerStatus(r).label))].sort().map((l) => ({ value: l, label: l }))]}
          value={status}
          onChange={setStatus}
        />
        <p className="text-body-2 text-ink-muted md:text-right" role="status">
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
      <DataTable
        columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
        data={filtered as unknown as Record<string, unknown>[]}
        total={filtered.length}
        caption={caption}
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
export function InspectionTable({ caption }: { caption: string }) {
  const store = useEAnudaan();
  const { state } = store;
  const { toast } = useToast();
  const [status, setStatus] = React.useState<"" | InspectionStatus>("");
  const [open, setOpen] = React.useState<{ insp: Inspection; action: InspectionAction } | null>(null);

  const rows = React.useMemo(() => inspectionsFor(state, status), [state, status]);
  const all = state.inspections.length;
  const names = React.useMemo(() => new Map(state.ngos.map((n) => [n.id, n.name])), [state.ngos]);
  const apps = React.useMemo(() => new Map(state.applications.map((a) => [a.id, a])), [state.applications]);

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
    [names, apps],
  );

  const save = (next: Inspection, done: string) => {
    store.saveInspection(next);
    toast(done, "success");
    setOpen(null);
  };

  return (
    <Card variant="outlined">
      <CardBody>
      <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,18rem)_1fr] md:items-end">
        <FilterSelect
          label="Status"
          options={INSPECTION_FILTERS}
          value={status}
          onChange={(v) => setStatus(v as "" | InspectionStatus)}
        />
        <p className="text-body-2 text-ink-muted md:text-right" role="status">
          {status
            ? `${rows.length} of ${all} match the filter`
            : `${all} ${all === 1 ? "inspection" : "inspections"}`}
          {status && (
            <Button appearance="text" size="sm" className="ml-2" onClick={() => setStatus("")}>
              Clear Filter
            </Button>
          )}
        </p>
      </div>
      <DataTable
        columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
        data={rows as unknown as Record<string, unknown>[]}
        total={rows.length}
        caption={caption}
        emptyLabel={status ? `No inspection is ${INSPECTION_STATUS_LABEL[status].toLowerCase()}.` : "No inspections in this list."}
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

function InspectionDialog({
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
