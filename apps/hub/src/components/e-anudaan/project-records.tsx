"use client";

/**
 * What an officer reads about one project beside NGO 360 and the application review: its CCTV
 * compliance, its staff roster and its weekly attendance (e-Anudaan parity brief §D items 2 and 3).
 *
 * READ-ONLY BY CONSTRUCTION. No component here takes a store action or renders a control that
 * changes a record — not a disabled checkbox, not a hidden edit button. The only controls are the
 * ones that change what is being looked at: the week, the register, a search and a flag filter.
 * Personal identifiers are masked (`lib/e-anudaan/masking.ts`).
 *
 * DS Audit: Card ✅ · SectionTitle ✅ · DataTable ✅ · Badge ✅ · MetricCard ✅ · EmptyState ✅ ·
 * Search ✅ · SegmentedControl ✅ · Checkbox ✅ · Button ✅ · Icon ✅ · Skeleton ✅ · Alert ✅ —
 * nothing new.
 */

import * as React from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Checkbox,
  DataTable,
  EmptyState,
  Icon,
  MetricCard,
  Search,
  SectionTitle,
  SegmentedControl,
  Skeleton,
  buttonClasses,
  type DataTableColumn,
} from "@mosje/design-system";
import { cctvCompliance } from "@/lib/e-anudaan/cctv";
import { formatDate } from "@/lib/e-anudaan/format";
import { maskMobile, maskedIdentity } from "@/lib/e-anudaan/masking";
import { LONG_ABSENCE_DAYS, STAFF_THRESHOLD_PERCENT, mondayOf, readWeek, type Kind, type PersonWeek } from "@/lib/e-anudaan/weekly-attendance";
import { projectRunningSince } from "@/lib/e-anudaan/applicant";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import type { Beneficiary, Employee } from "@/lib/e-anudaan/roster";
import type { CctvSetup, EAnudaanState, GrantApplication } from "@/lib/e-anudaan/types";
import { CctvFlags, CctvRecordFacts, CctvStatusBadge, CoverageList } from "./cctv-parts";

const PAGE_SIZE = 10;
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const projectRecordsHref = (ngoId: string, projectId: string) =>
  `/portals/e-anudaan/dashboard/ngo/${encodeURIComponent(ngoId)}/project/${encodeURIComponent(projectId)}`;

/** A loading block in the shape of a card of rows. `role="status"` says the wait is deliberate. */
export function RecordsSkeleton({ label }: { label: string }) {
  return (
    <Card variant="outlined">
      <CardBody className="space-y-3" role="status" aria-label={label}>
        <Skeleton width="30%" height="1.5rem" />
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} height="2.5rem" />
        ))}
      </CardBody>
    </Card>
  );
}

/* ── CCTV ─────────────────────────────────────────────────────────────────── */

export function CctvComplianceCard({ setup }: { setup: CctvSetup | undefined }) {
  const compliance = cctvCompliance(setup);
  return (
    <Card variant="outlined">
      <CardBody className="space-y-4">
        <SectionTitle
          title="CCTV Compliance"
          description={
            setup?.cameraRegister?.length
              ? `${setup.cameraRegister.length} camera${setup.cameraRegister.length === 1 ? "" : "s"} registered · ${compliance.covered} of ${compliance.coverage.length} mandated areas covered`
              : undefined
          }
        >
          <CctvStatusBadge compliance={compliance} size="lg" />
        </SectionTitle>
        {!setup ? (
          <EmptyState
            icon={<Icon name="videocam_off" size={32} aria-hidden />}
            title="CCTV Not Set Up"
            description="The organisation has not set up CCTV at this project."
          />
        ) : !setup.cameraRegister?.length ? (
          <EmptyState
            icon={<Icon name="videocam_off" size={32} aria-hidden />}
            title="No Cameras Registered"
            description={`The recorder was set up on ${formatDate(setup.savedAt)}, but no camera has been registered against the mandated areas.`}
          />
        ) : (
          <>
            <CctvFlags compliance={compliance} />
            <CoverageList coverage={compliance.coverage} />
            <CctvRecordFacts setup={setup} compliance={compliance} />
          </>
        )}
      </CardBody>
    </Card>
  );
}

/* ── staff roster ─────────────────────────────────────────────────────────── */

type StaffRow = Employee & Record<string, unknown>;

const STAFF_COLUMNS: DataTableColumn<StaffRow>[] = [
  { key: "name", header: "Name" },
  { key: "designation", header: "Designation", render: (e) => e.designation ?? "—" },
  { key: "qualification", header: "Qualification", render: (e) => e.qualification ?? "—" },
  {
    key: "mobile",
    header: "Mobile",
    className: "tabular-nums",
    render: (e) => (e.mobile ? <span aria-label={`Mobile ending ${e.mobile.slice(-3)}`}>{maskMobile(e.mobile)}</span> : "—"),
  },
  { key: "joiningDate", header: "Joined On", render: (e) => (e.joiningDate ? formatDate(e.joiningDate) : "—") },
  {
    key: "active",
    header: "Status",
    render: (e) => (
      <Badge status={e.active ? "success" : "neutral"} size="sm">
        {e.active ? "Active" : "Inactive"}
      </Badge>
    ),
  },
];

export function StaffRosterCard({ staff }: { staff: readonly Employee[] }) {
  const [q, setQ] = React.useState("");
  const needle = q.trim().toLowerCase();
  const rows = staff.filter((e) => !needle || `${e.name} ${e.designation ?? ""}`.toLowerCase().includes(needle));
  const active = staff.filter((e) => e.active).length;
  return (
    <Card variant="outlined">
      <CardBody className="space-y-4">
        <SectionTitle title="Staff Roster" description={staff.length ? `${active} active of ${staff.length} registered` : undefined}>
          {staff.length > 0 && (
            <div className="w-full sm:w-72">
              <Search value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} placeholder="Name or designation" aria-label="Search the staff roster" />
            </div>
          )}
        </SectionTitle>
        {staff.length === 0 ? (
          <EmptyState icon={<Icon name="badge" size={32} aria-hidden />} title="No Staff Registered" description="The organisation has not registered any staff for this project." />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<Icon name="search_off" size={32} aria-hidden />}
            title="No Staff Match This Search"
            description={`No member of staff matches “${q.trim()}”.`}
            action={
              <Button appearance="outlined" size="sm" onClick={() => setQ("")}>
                Clear Search
              </Button>
            }
          />
        ) : (
          <DataTable<StaffRow>
            key={needle}
            caption="Staff registered at this project. Mobile numbers are masked."
            columns={STAFF_COLUMNS}
            data={rows as StaffRow[]}
            total={rows.length}
            pageSizes={[PAGE_SIZE]}
            showPageSizes={false}
          />
        )}
      </CardBody>
    </Card>
  );
}

/* ── weekly attendance ───────────────────────────────────────────────────── */

type AttendanceRow = PersonWeek & Record<string, unknown>;

function markCell(mark: PersonWeek["marks"][number], name: string, day: string) {
  if (mark === null) return <span aria-label={`${name}: no mark owed on ${day}`}>—</span>;
  return (
    <span aria-label={`${name} ${mark === "P" ? "present" : "absent"} on ${day}`} className={mark === "A" ? "font-semibold text-ink" : "text-ink-muted"}>
      {mark}
    </span>
  );
}

export function WeeklyAttendanceCard({
  beneficiaries,
  staff,
  since,
}: {
  beneficiaries: readonly Beneficiary[];
  staff: readonly Employee[];
  /** `projectRunningSince`: null when the project owes no returns yet. */
  since: string | null | undefined;
}) {
  const now = React.useMemo(() => new Date(), []);
  const [start, setStart] = React.useState(() => mondayOf(now));
  const [kind, setKind] = React.useState<Kind>("beneficiaries");
  const [q, setQ] = React.useState("");
  const [flaggedOnly, setFlaggedOnly] = React.useState(false);

  const people = React.useMemo(
    () =>
      kind === "beneficiaries"
        ? beneficiaries.filter((b) => b.active).map((b) => ({ id: b.id, name: b.name, detail: maskedIdentity(b.idType, b.idNumber) }))
        : staff.filter((e) => e.active).map((e) => ({ id: e.id, name: e.name, detail: e.designation })),
    [kind, beneficiaries, staff],
  );
  const week = React.useMemo(() => readWeek(people, kind, start, now, since), [people, kind, start, now, since]);
  const needle = q.trim().toLowerCase();
  const rows = week.rows.filter((r) => (!flaggedOnly || r.flag) && (!needle || r.name.toLowerCase().includes(needle)));
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  const isCurrent = start.getTime() >= mondayOf(now).getTime();
  const shift = (weeks: number) => setStart(new Date(start.getFullYear(), start.getMonth(), start.getDate() + weeks * 7));
  const noun = kind === "staff" ? "staff" : "beneficiaries";
  const flagRule =
    kind === "staff" ? `Staff below ${STAFF_THRESHOLD_PERCENT}% for the week` : `Beneficiaries absent ${LONG_ABSENCE_DAYS} or more days running`;

  const columns: DataTableColumn<AttendanceRow>[] = [
    {
      key: "name",
      header: "Name",
      render: (r) => (
        <>
          {r.name}
          {r.detail ? <span className="block text-body-3 text-ink-muted tabular-nums">{r.detail}</span> : null}
        </>
      ),
    },
    ...DAY_NAMES.map(
      (d, i): DataTableColumn<AttendanceRow> => ({
        key: d,
        header: d,
        headerNode: (
          <span className="inline-flex flex-col items-center">
            <span>{d}</span>
            <span className="text-body-3 normal-case">{Number(week.days[i]!.slice(8))}</span>
          </span>
        ),
        className: "text-center tabular-nums",
        render: (r) => markCell(r.marks[i] ?? null, r.name, `${d} ${Number(week.days[i]!.slice(8))}`),
      }),
    ),
    { key: "percent", header: "Week", className: "text-right tabular-nums", render: (r) => (r.percent === null ? "—" : `${r.percent}%`) },
    {
      key: "flag",
      header: "Flag",
      render: (r) =>
        r.flag ? (
          <span className="inline-block whitespace-nowrap">
            <Badge status="warning" size="sm">
              {r.flag === "below-threshold" ? `Below ${STAFF_THRESHOLD_PERCENT}%` : `Absent ${r.absentStreak} Days Running`}
            </Badge>
          </span>
        ) : (
          ""
        ),
    },
  ];

  return (
    <Card variant="outlined">
      <CardBody className="space-y-4">
        <SectionTitle title="Weekly Attendance" description="P present · A absent · — no mark owed" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2" role="group" aria-label="Week">
            <Button appearance="outlined" size="sm" onClick={() => shift(-1)} aria-label="Previous week">
              <Icon name="chevron_left" size={20} aria-hidden />
            </Button>
            <p className="min-w-[15rem] text-center text-body-1 font-semibold text-ink" aria-live="polite">
              {formatDate(start)} – {formatDate(end)}
            </p>
            {/* Omitted, not disabled, for the week now running: there is no later week on record. */}
            {!isCurrent && (
              <Button appearance="outlined" size="sm" onClick={() => shift(1)} aria-label="Next week">
                <Icon name="chevron_right" size={20} aria-hidden />
              </Button>
            )}
          </div>
          <SegmentedControl<Kind>
            ariaLabel="Attendance of"
            value={kind}
            onChange={(v) => {
              setKind(v);
              setFlaggedOnly(false);
              setQ("");
            }}
            options={[
              { value: "beneficiaries", label: `Beneficiaries (${beneficiaries.filter((b) => b.active).length})` },
              { value: "staff", label: `Staff (${staff.filter((e) => e.active).length})` },
            ]}
          />
        </div>

        {since === null ? (
          <EmptyState
            icon={<Icon name="event_busy" size={32} aria-hidden />}
            title="No Attendance Is Due for This Project"
            description="Attendance is recorded from the month after the grant is sanctioned. This project has not been sanctioned yet."
          />
        ) : people.length === 0 ? (
          <EmptyState
            icon={<Icon name="group_off" size={32} aria-hidden />}
            title={kind === "staff" ? "No Staff on This Project" : "No Beneficiaries on This Project"}
            description={`The organisation has not registered any active ${noun} for this project.`}
          />
        ) : week.recordedDays === 0 ? (
          <EmptyState
            icon={<Icon name="event_busy" size={32} aria-hidden />}
            title="No Attendance for This Week"
            description="Attendance for this project is recorded from a later date. Choose a later week."
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard label="Attendance" value={week.percent === null ? "—" : `${week.percent}%`} detail={`${people.length} ${noun} · ${week.recordedDays} day${week.recordedDays === 1 ? "" : "s"} recorded`} />
              <MetricCard label="Flagged" value={String(week.flagged)} detail={flagRule} tone={week.flagged ? "warning" : undefined} />
              <MetricCard
                label="Absent Person-Days"
                value={String(week.rows.reduce((n, r) => n + (r.recorded - r.present), 0))}
                detail={`of ${week.rows.reduce((n, r) => n + r.recorded, 0)} recorded`}
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-full sm:w-72">
                <Search value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} placeholder="Name" aria-label={`Search ${noun} by name`} />
              </div>
              <Checkbox checked={flaggedOnly} onCheckedChange={setFlaggedOnly} label={`Flagged Only (${week.flagged})`} />
            </div>
            {rows.length === 0 ? (
              <EmptyState
                icon={<Icon name="filter_alt_off" size={32} aria-hidden />}
                title={flaggedOnly && !needle ? `No ${kind === "staff" ? "Staff" : "Beneficiaries"} Flagged This Week` : `No ${kind === "staff" ? "Staff" : "Beneficiaries"} Match These Filters`}
                description={
                  flaggedOnly && needle
                    ? `No flagged person is named “${q.trim()}”.`
                    : flaggedOnly
                      ? `${flagRule}: none.`
                      : `No one named “${q.trim()}” is on the roll.`
                }
                action={
                  <Button
                    appearance="outlined"
                    size="sm"
                    onClick={() => {
                      setQ("");
                      setFlaggedOnly(false);
                    }}
                  >
                    Clear Filters
                  </Button>
                }
              />
            ) : (
              <DataTable<AttendanceRow>
                key={`${kind}:${week.weekStart}:${needle}:${flaggedOnly}`}
                caption={`Attendance of ${noun} for the week of ${formatDate(start)}. Identity numbers are masked.`}
                columns={columns}
                data={rows as AttendanceRow[]}
                total={rows.length}
                pageSizes={[PAGE_SIZE]}
                showPageSizes={false}
              />
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
}

/* ── the review's summary ────────────────────────────────────────────────── */

/** The last complete week's attendance, for a summary line. */
export function lastWeekReading(state: EAnudaanState, projectId: string, now: Date = new Date()) {
  const since = projectRunningSince(state, projectId);
  const lastWeek = new Date(mondayOf(now).getTime() - 7 * 86_400_000);
  const ben = state.beneficiaries.filter((b) => b.projectId === projectId && b.active).map((b) => ({ id: b.id, name: b.name }));
  const emp = state.employees.filter((e) => e.projectId === projectId && e.active).map((e) => ({ id: e.id, name: e.name }));
  return {
    since,
    start: lastWeek,
    beneficiaries: readWeek(ben, "beneficiaries", lastWeek, now, since),
    staff: readWeek(emp, "staff", lastWeek, now, since),
  };
}

/** On the application review: where the project stands, and the way to its records. */
export function ProjectRecordsSummary({ app }: { app: GrantApplication }) {
  const { state, findCctv } = useEAnudaan();
  const compliance = cctvCompliance(findCctv(app.institutionId));
  const w = lastWeekReading(state, app.institutionId);
  const href = projectRecordsHref(app.ngoId, app.institutionId);
  const pct = (p: number | null) => (p === null ? "no marks owed" : `${p}%`);

  return (
    <Card variant="outlined">
      <CardBody className="space-y-4">
        <SectionTitle title="Project Records">
          <Link href={href} className={buttonClasses("primary", "text", "sm", "whitespace-nowrap")}>
            Open Project Records
          </Link>
        </SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="flex flex-wrap items-center gap-2 text-body-2 font-semibold text-ink">
              CCTV <CctvStatusBadge compliance={compliance} />
            </p>
            {compliance.flags.length > 0 && (
              <ul className="list-disc space-y-1 pl-5 text-body-3 text-ink">
                {compliance.flags.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-body-2 font-semibold text-ink">Attendance, Week of {formatDate(w.start)}</p>
            {w.since === null ? (
              <p className="text-body-3 text-ink">Not due: the project has not been sanctioned.</p>
            ) : (
              <>
                <p className="text-body-3 text-ink">
                  Beneficiaries {pct(w.beneficiaries.percent)}
                  {w.beneficiaries.flagged ? ` · ${w.beneficiaries.flagged} absent ${LONG_ABSENCE_DAYS}+ days running` : ""}
                </p>
                <p className="text-body-3 text-ink">
                  Staff {pct(w.staff.percent)}
                  {w.staff.flagged ? ` · ${w.staff.flagged} below ${STAFF_THRESHOLD_PERCENT}%` : ""}
                </p>
              </>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
