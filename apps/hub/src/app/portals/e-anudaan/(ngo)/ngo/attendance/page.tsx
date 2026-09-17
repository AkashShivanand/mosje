"use client";

/**
 * Attendance — one page, two tabs: the Overview and the Weekly register.
 *
 * DS Audit: Tabs / TabPanel ✅ existing · MetricCard ✅ · ChartCard ✅ · BarChart ✅ · Card ✅ ·
 * SectionTitle ✅ · FormField ✅ · Select ✅ · SegmentedControl ✅ · Checkbox ✅ · DataTable ✅ · PageHeader ✅ · Link ✅ ·
 * Badge ✅ · Button ✅ · Icon ✅ · Modal ✅ · DescriptionList ✅ · EmptyState ✅ · useToast ✅ —
 * nothing new.
 *
 * What the review call of 11 Sep 2026 changed (T200–271, T950–970):
 *
 *  • "Attendance Master" was not a master — a master is where records are kept, and it was a
 *    dashboard. It is the Overview tab here, and its three tabs (Dashboard, Monthly Returns,
 *    History) showed the same table three times, so they are one.
 *  • The roster moved out to Beneficiaries & Staff; this page reads it.
 *  • The week is chosen as a WEEK, not "any day in the week", and marking works per DAY as
 *    well as for the whole week — "Mark all Absent" could not mark only Saturday and Sunday.
 *
 * And what the review panel of 13 Sep 2026 changed on top of it: the register no longer opens
 * with everyone ticked present. That made one click on Submit a certificate of full attendance —
 * an audit risk the Ministry official on the panel named first. Nothing is ticked until the NGO
 * marks it, and Submit shows the totals being certified before it records them.
 *
 * Design-director audit, 16 Sep 2026 (N-12):
 *  • The Overview / Weekly Attendance switch was a full-width filled dark-blue block and read as
 *    the page's primary button. It is an underlined tab row: navigation, not an action.
 *  • A bar chart drew sixteen bars all near 99% across ~800px with 26px axis labels. It said
 *    nothing the Monthly Returns table below does not say exactly, so the trend is a sparkline
 *    on an 80–100% scale beside the average it describes, and the table carries the months.
 *  • "Returns Not Submitted 1" named no month and offered nothing to do. It names the month, and
 *    a warning offers the register.
 */

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  Checkbox,
  DataTable,
  DescriptionList,
  EmptyState,
  FormField,
  Icon,
  MetricCard,
  Link,
  Modal,
  PageHeader,
  SectionTitle,
  SegmentedControl,
  Select,
  Sparkline,
  TabPanel,
  Tabs,
  useToast,
  type DataTableColumn,
} from "@mosje/design-system";
import { routeOnClick } from "@/components/e-anudaan/ngo-shell";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { projectName, projectRunningSince, projectsOf } from "@/lib/e-anudaan/applicant";
import { formatDate, formatMonthYear } from "@/lib/e-anudaan/format";
import { WEEK_DAYS, buildReturnRows, weekStart } from "@/lib/e-anudaan/roster";
import { useDemoFormFill } from "@/components/e-anudaan/use-demo-form-fill";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "week", label: "Weekly Attendance" },
];
const PAGE_SIZE = 15;

export default function AttendancePage() {
  return (
    <React.Suspense fallback={null}>
      <Attendance />
    </React.Suspense>
  );
}

function Attendance() {
  const { state } = useEAnudaan();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const idBase = React.useId();
  const ngo = state.ngos[0];
  const projects = ngo ? projectsOf(state, ngo.id) : [];
  const projectId = params.get("project") ?? projects[0]?.id ?? "";
  const project = projects.find((p) => p.id === projectId);
  const tab = params.get("tab") === "week" ? 1 : 0;
  /** A demo dock fill for the register (lib/e-anudaan/demo-forms/weekly-attendance.ts); `n` remounts it. */
  const [demo, setDemo] = React.useState<{ n: number; values: Readonly<Record<string, string>> } | null>(null);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  useDemoFormFill("weekly-attendance", (values) => {
    setDemo((d) => ({ n: (d?.n ?? 0) + 1, values }));
    if (tab !== 1) setParam("tab", "week");
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Attendance"
        meta="Record weekly attendance of beneficiaries and staff, and follow each project's monthly returns."
      />

      <div className="max-w-xl">
        <FormField label="Project" id="attendance-project">
          {(c) => (
            <Select {...c} value={projectId} onChange={(e) => setParam("project", e.target.value)}>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} — {projectName(p)}
                </option>
              ))}
            </Select>
          )}
        </FormField>
      </div>

      <Tabs
        tabs={TABS}
        active={tab}
        onChange={(i) => setParam("tab", i === 1 ? "week" : "")}
        idBase={idBase}
        ariaLabel="Attendance sections"
        indicator="underline"
        track="none"
        panel
      />

      <TabPanel idBase={idBase} tabId={TABS[tab]!.id}>
        {tab === 0 ? (
          <Overview projectId={projectId} onRecord={() => setParam("tab", "week")} />
        ) : (
          <WeekRegister key={`${projectId}-${demo?.n ?? 0}`} projectId={projectId} projectLabel={project ? projectName(project) : ""} demo={demo?.values} />
        )}
      </TabPanel>
    </div>
  );
}

/* ── Overview ─────────────────────────────────────────────────────────────── */

type ReturnRow = ReturnType<typeof buildReturnRows>[number] & Record<string, unknown>;

const RETURN_COLUMNS: DataTableColumn<ReturnRow>[] = [
  { key: "monthStart", header: "Month", render: (r) => formatMonthYear(r.monthStart) },
  { key: "fy", header: "Financial Year" },
  { key: "avgPresent", header: "Average Present", className: "text-right tabular-nums", render: (r) => r.avgPresent ?? "—" },
  { key: "percent", header: "Attendance", className: "text-right tabular-nums", render: (r) => (r.percent == null ? "—" : `${r.percent.toFixed(1)}%`) },
  {
    key: "status",
    header: "Status",
    render: (r) => (
      <Badge status={r.status === "Submitted" ? "success" : r.status === "Due" ? "warning" : "danger"} size="sm">
        {r.status}
      </Badge>
    ),
  },
  { key: "submittedOn", header: "Submitted On", render: (r) => (r.submittedOn ? formatDate(r.submittedOn) : "—") },
];

function Overview({ projectId, onRecord }: { projectId: string; onRecord: () => void }) {
  const { state } = useEAnudaan();
  const onRoll = state.beneficiaries.filter((b) => b.projectId === projectId && b.active).length;
  // Returns are owed only by a running project: none before its first sanction.
  const runningSince = projectRunningSince(state, projectId);
  const rows = React.useMemo(() => buildReturnRows(new Date(), onRoll, runningSince), [onRoll, runningSince]);

  if (runningSince === null) {
    return (
      <EmptyState
        icon={<Icon name="event_busy" size={32} aria-hidden />}
        title="No Monthly Returns Are Due for This Project"
        description="Monthly attendance returns are due from the month after the grant is sanctioned. This project has not been sanctioned yet."
      />
    );
  }

  const submitted = rows.filter((r) => r.status === "Submitted");
  const due = rows.filter((r) => r.status === "Due").length;
  const missedRows = rows.filter((r) => r.status === "Not Submitted");
  const missed = missedRows.length;
  const missedMonths = missedRows.map((r) => formatMonthYear(r.monthStart));
  const currentFy = rows[0]?.fy ?? "";
  const inFy = submitted.filter((r) => r.fy === currentFy);
  const average = inFy.length ? Math.round(inFy.reduce((a, r) => a + (r.percent ?? 0), 0) / inFy.length) : 0;
  // The last twelve submitted months, oldest first, on the band attendance actually moves in.
  const trend = [...rows].reverse().filter((r) => r.status === "Submitted").slice(-12).map((r) => r.percent ?? 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Returns Submitted" value={String(submitted.length)} detail="in the last two years" />
        <MetricCard label="Returns Due" value={String(due)} detail="for the month running" />
        <MetricCard
          label="Returns Not Submitted"
          value={String(missed)}
          detail="for months already past"
          tone={missed ? "warning" : undefined}
        />
        <MetricCard
          label="Average Attendance"
          value={`${average}%`}
          detail={`FY ${currentFy} · last 12 returns shown`}
          aside={trend.length > 1 ? <Sparkline data={trend} min={80} max={100} width={96} height={32} /> : undefined}
        />
      </div>

      {missed > 0 && (
        <Alert
          status="warning"
          title={`Return Not Submitted for ${missedMonths.join(", ")}`}
          action={
            <Button appearance="outlined" size="sm" onClick={onRecord}>
              Record Attendance
            </Button>
          }
        />
      )}

      <Card variant="outlined">
        <CardBody className="space-y-3">
          <SectionTitle title="Monthly Returns" description={`${onRoll} beneficiaries on roll today`} />
          <DataTable<ReturnRow>
            caption="Monthly attendance returns, most recent first"
            columns={RETURN_COLUMNS}
            data={rows as ReturnRow[]}
            total={rows.length}
          />
        </CardBody>
      </Card>
    </div>
  );
}

/* ── Weekly register ──────────────────────────────────────────────────────── */

type Who = "beneficiaries" | "staff";
type Person = { id: string; name: string; sub: string | undefined };

function WeekRegister({
  projectId,
  projectLabel,
  demo,
}: {
  projectId: string;
  projectLabel: string;
  /** A demo dock fill, applied as the register mounts. */
  demo?: Readonly<Record<string, string>>;
}) {
  const { state } = useEAnudaan();
  const router = useRouter();
  const { toast } = useToast();
  const [start, setStart] = React.useState(() => {
    const d = weekStart(new Date());
    if (demo?.week === "previous") d.setDate(d.getDate() - 7);
    return d;
  });
  const [who, setWho] = React.useState<Who>(demo?.who === "staff" ? "staff" : "beneficiaries");
  /** Present marks, keyed `${personId}:${day}`. Nothing is marked until the NGO marks it. */
  const [present, setPresent] = React.useState<Set<string>>(() => new Set());
  const [confirming, setConfirming] = React.useState(demo?.confirm === "yes");
  const [submittedWeeks, setSubmittedWeeks] = React.useState<Record<string, string>>({});

  const people =
    who === "beneficiaries"
      ? state.beneficiaries.filter((b) => b.projectId === projectId && b.active).map((b): Person => ({ id: b.id, name: b.name, sub: undefined }))
      : state.employees.filter((e) => e.projectId === projectId && e.active).map((e): Person => ({ id: e.id, name: e.name, sub: e.designation }));
  const counts = {
    beneficiaries: state.beneficiaries.filter((b) => b.projectId === projectId && b.active).length,
    staff: state.employees.filter((e) => e.projectId === projectId && e.active).length,
  };

  const weekKey = `${who}:${start.toISOString().slice(0, 10)}`;
  const submittedOn = submittedWeeks[weekKey];
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const isCurrentOrFuture = start.getTime() >= weekStart(new Date()).getTime();
  /*
   * A day that has not happened cannot be marked. On 16 Sep the register let Saturday 19 and
   * Sunday 20 be ticked and certified (verify bug 7). Days after today are shown, not markable, and
   * the totals being certified count only the days so far.
   */
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const dateOf = (i: number) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  };
  const openDays = WEEK_DAYS.filter((_, i) => dateOf(i).getTime() <= endOfToday.getTime());
  const isOpenDay = (d: string) => (openDays as readonly string[]).includes(d);
  const key = (id: string, d: string) => `${id}:${d}`;

  /* A fill's marks, placed once as the register mounts. Marking goes through the register's own
     rule: a day that has not come yet takes no mark, whatever the fill asked for. */
  const [demoMarked, setDemoMarked] = React.useState(!demo?.marks || demo.marks === "none");
  if (!demoMarked) {
    setDemoMarked(true);
    const asked = demo?.marks === "whole-week" ? WEEK_DAYS : openDays;
    const marks = people.flatMap((p) => asked.filter(isOpenDay).map((d) => key(p.id, d)));
    // Two absences on the first day, so the certified totals are not a perfect week.
    setPresent(new Set(demo?.marks === "all-but-two" ? marks.filter((_, i) => !(i < 2 * openDays.length && i % openDays.length === 0)) : marks));
  }

  const presentOn = (d: string) => people.filter((p) => present.has(key(p.id, d))).length;
  const setDay = (d: string, on: boolean) =>
    setPresent((prev) => {
      const next = new Set(prev);
      for (const p of people) {
        if (on) next.add(key(p.id, d));
        else next.delete(key(p.id, d));
      }
      return next;
    });
  const setWeek = (on: boolean) => setPresent(on ? new Set(people.flatMap((p) => openDays.map((d) => key(p.id, d)))) : new Set());
  const toggle = (id: string, d: string, on: boolean) =>
    setPresent((prev) => {
      const next = new Set(prev);
      if (on) next.add(key(id, d));
      else next.delete(key(id, d));
      return next;
    });

  const shiftWeek = (weeks: number) => {
    const d = new Date(start);
    d.setDate(d.getDate() + weeks * 7);
    setStart(d);
    setPresent(new Set());
  };

  const cells = people.length * openDays.length;
  const presentCount = people.reduce((n, p) => n + WEEK_DAYS.filter((d) => present.has(key(p.id, d))).length, 0);
  const noun = who === "staff" ? "staff" : "beneficiaries";
  const beneficiariesHref = `/portals/e-anudaan/ngo/beneficiaries?project=${encodeURIComponent(projectId)}${who === "staff" ? "&tab=staff" : ""}`;

  return (
    <Card variant="outlined">
      <CardBody className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2" role="group" aria-label="Week">
            <Button appearance="outlined" size="sm" onClick={() => shiftWeek(-1)} aria-label="Previous week">
              <Icon name="chevron_left" size={20} aria-hidden />
            </Button>
            <p className="min-w-[15rem] text-center text-body-1 font-semibold text-ink" aria-live="polite">
              {formatDate(start)} – {formatDate(end)}
            </p>
            {/* Omitted, not disabled, for the week now running: there is no later week to record. */}
            {!isCurrentOrFuture && (
              <Button appearance="outlined" size="sm" onClick={() => shiftWeek(1)} aria-label="Next week">
                <Icon name="chevron_right" size={20} aria-hidden />
              </Button>
            )}
          </div>
          <SegmentedControl<Who>
            ariaLabel="Record attendance for"
            value={who}
            onChange={(v) => setWho(v)}
            options={[
              { value: "beneficiaries", label: `Beneficiaries (${counts.beneficiaries})` },
              { value: "staff", label: `Staff (${counts.staff})` },
            ]}
          />
        </div>

        {submittedOn && (
          <p className="flex items-center gap-2 text-body-2 text-ink">
            <Icon name="check_circle" size={20} aria-hidden className="text-[var(--sa-text-status-success-base)]" />
            This week was submitted on {formatDate(submittedOn)}.
          </p>
        )}

        {people.length === 0 ? (
          <EmptyState
            title={who === "staff" ? "No Staff on This Project" : "No Beneficiaries on This Project"}
            description={`Add them on Beneficiaries & Staff for ${projectLabel} before recording attendance.`}
            action={
              <Link variant="standalone" href={beneficiariesHref} onClick={routeOnClick(router, beneficiariesHref)}>
                Go to Beneficiaries &amp; Staff
              </Link>
            }
          />
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Button appearance="outlined" size="sm" onClick={() => setWeek(true)}>
                {openDays.length === WEEK_DAYS.length ? `Mark All ${people.length} Present for the Week` : `Mark All ${people.length} Present to Date`}
              </Button>
              <Button appearance="text" size="sm" onClick={() => setWeek(false)}>
                Clear Marks
              </Button>
            </div>

            {/* Keyed on the week and the register, so moving to another week or switching between
                beneficiaries and staff starts again at the first page. */}
            <DataTable<Person>
              key={weekKey}
              caption={`Attendance for the week of ${formatDate(start)}. A ticked box means present; the box under each day marks all ${people.length} ${noun}.`}
              columns={[
                {
                  key: "name",
                  header: "Name",
                  render: (p) => (
                    <>
                      {p.name}
                      {p.sub ? <span className="block text-body-3 text-ink-muted">{p.sub}</span> : null}
                    </>
                  ),
                },
                ...WEEK_DAYS.map((d, i): DataTableColumn<Person> => {
                  const date = new Date(start);
                  date.setDate(date.getDate() + i);
                  const n = presentOn(d);
                  return {
                    key: d,
                    header: d,
                    className: "text-center",
                    headerNode: (
                      <span className="inline-flex flex-col items-center">
                        <span className="block">{d}</span>
                        <span className="block text-body-3 normal-case">{date.getDate()}</span>
                        <span className="mt-1 inline-flex flex-col items-center">
                          <Checkbox
                            size="sm"
                            hideLabel
                            label={isOpenDay(d) ? `Mark all ${people.length} present on ${d} ${date.getDate()}` : `${d} ${date.getDate()} has not come yet`}
                            checked={n === people.length}
                            indeterminate={n > 0 && n < people.length}
                            disabled={!isOpenDay(d)}
                            onCheckedChange={(on) => setDay(d, on)}
                          />
                          <span className="text-body-3 normal-case" aria-hidden>
                            All
                          </span>
                        </span>
                      </span>
                    ),
                    render: (p) => (
                      <span className="inline-flex justify-center">
                        <Checkbox
                          size="sm"
                          hideLabel
                          label={`${p.name} present on ${d}`}
                          checked={present.has(key(p.id, d))}
                          disabled={!isOpenDay(d)}
                          onCheckedChange={(on) => toggle(p.id, d, on)}
                        />
                      </span>
                    ),
                  };
                }),
              ]}
              data={people}
              total={people.length}
              pageSizes={[PAGE_SIZE]}
              showPageSizes={false}
            />

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => setConfirming(true)}>{submittedOn ? "Resubmit Week" : "Submit Week"}</Button>
              <span className="text-body-3 text-ink-muted" role="status">
                {presentCount} of {cells} marked present
              </span>
            </div>
          </>
        )}

        <Modal
          open={confirming}
          onClose={() => setConfirming(false)}
          title="Submit This Week's Attendance?"
          footer={
            <div className="flex justify-end gap-2">
              <Button appearance="outlined" onClick={() => setConfirming(false)}>
                Go Back
              </Button>
              <Button
                onClick={() => {
                  setSubmittedWeeks((w) => ({ ...w, [weekKey]: new Date().toISOString() }));
                  setConfirming(false);
                  toast(`Attendance for the week of ${formatDate(start)} submitted.`, "success");
                }}
              >
                Submit
              </Button>
            </div>
          }
        >
          <p className="mb-4 text-body-2 text-ink">You are certifying the attendance below for {projectLabel}. Anything not ticked is recorded as absent.</p>
          <DescriptionList
            columns={2}
            items={[
              { term: "Week", value: `${formatDate(start)} – ${formatDate(end)}` },
              { term: "Recorded For", value: `${people.length} ${noun}` },
              { term: "Present", value: `${presentCount} of ${cells} person-days` },
              { term: "Absent", value: `${cells - presentCount} person-days` },
            ]}
          />
        </Modal>
      </CardBody>
    </Card>
  );
}
