"use client";

/**
 * The officer review screen's money, notice and inspection panels.
 *
 * DS Audit: Card ✅ · SectionTitle ✅ · DataTable ✅ · DescriptionList ✅ · ListGroup / ListRow ✅ ·
 * Badge ✅ · Button ✅ · FormField / Input / Textarea ✅ · DatePicker ✅ · TimePicker ✅ · Modal ✅ ·
 * Alert ✅ · buttonClasses ✅ — nothing new.
 *
 * Each follows a live DECISION capture of 16 Sep 2026 (parity inventory §21, §26, §30):
 *   FundingHistory     — "Previously Allocated Funds — this NGO", "Sanction & Disbursement — this Project"
 *   InstalmentsPanel   — "Instalments & Fund Release" (PD Under Secretary)
 *   ShowCausePanel     — "Show Cause Notices" / "Issue SCN" (PD SO and JS), the form in a Modal
 *   InspectionsPanel   — "Online Inspection — BharatVC" / "Schedule BharatVC", the form in a Modal
 *   CostNormsReview    — "Grant — Recurring vs Non-Recurring" against the norm (AVYAY)
 */

import * as React from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardBody,
  DataTable,
  DatePicker,
  DescriptionList,
  FormField,
  Input,
  ListGroup,
  ListRow,
  Modal,
  SectionTitle,
  Textarea,
  TimePicker,
  buttonClasses,
  useToast,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { GRADE_FULL, ROLES } from "@/lib/e-anudaan/roles";
import { formatDate, formatDateTime, formatMoney, rupees } from "@/lib/e-anudaan/format";
import { AUTO_CHECK } from "@/lib/e-anudaan/glossary";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { avyayEntitlement } from "@/lib/e-anudaan/form-schema";
import {
  instalmentSchedule,
  ngoSanctions,
  projectDisbursement,
  releasePatternFact,
  type NgoSanctionRow,
  type ProjectSanctionRow,
  type ScheduleRow,
} from "@/lib/e-anudaan/funding";
import type { EAnudaanState, GrantApplication, Inspection, RoleId } from "@/lib/e-anudaan/types";
import type { DocVerdict } from "@/lib/e-anudaan/doc-verification";
import { RefText } from "./worklist-table";
import { onlineInspectionError, showCauseError } from "@/lib/e-anudaan/officer-forms";
import { resolveDate } from "@/lib/e-anudaan/demo-forms/officer-values";
import { SHOW_CAUSE_NOTICE } from "@/lib/e-anudaan/demo-forms/show-cause-notice";
import { ONLINE_INSPECTION } from "@/lib/e-anudaan/demo-forms/online-inspection";
import { useDemoFormFill } from "./use-demo-form-fill";

const BASE = "/portals/e-anudaan";

/** A section of the review: the design system's Card with its section heading. */
export function Panel({ title, actions, children }: { title: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card variant="outlined">
      <CardBody className="space-y-4">
        <SectionTitle title={title}>{actions}</SectionTitle>
        {children}
      </CardBody>
    </Card>
  );
}

/** "the Section Officer" / "the Programme Director", for a line of attribution. */
export function officerOf(role: RoleId): string {
  const r = ROLES[role];
  if (!r) return "an officer";
  return r.grade ? `the ${GRADE_FULL[r.grade]}${r.division === "finance" ? ", Integrated Finance Division" : ""}` : `the ${r.label}`;
}

/**
 * The automatic check as an officer reads it: advice, with its confidence — "Automatic check ·
 * Looks right · 98%". Never "Verified", which is the officer's own word for their verdict and read
 * as though the machine had decided (design review, 16 Sep 2026). Shared by the review screen and
 * the Review Report so the two print the same words.
 */
export function officerCheckLabel(verdict: DocVerdict | undefined, { column = false }: { column?: boolean } = {}): string {
  // Non-breaking around the confidence, so "· 98%" never wraps to a line of its own on a phone.
  const pct = verdict?.confidence != null ? `\u00a0·\u00a0${verdict.confidence}%` : "";
  // `column`: under an "Automatic Check" header, where repeating the name says nothing. The words
  // are the glossary's (AUTO_CHECK.officer) — "Does not match" here said "Doesn't match" elsewhere.
  const lead = column ? "" : `${AUTO_CHECK.name} · `;
  switch (verdict?.state) {
    case undefined:
      return column ? "Not checked" : "Not checked automatically";
    case "pending":
    case "unavailable":
      // "Automatic check · Unavailable", never "Automatic check unavailable" run into one phrase.
      return `${lead}${AUTO_CHECK.officer[verdict.state]}`;
    case "verified":
    case "review":
    case "invalid":
      return `${lead}${AUTO_CHECK.officer[verdict.state]}${pct}`;
  }
}

const isOpenFile = (app: GrantApplication) => app.status !== "Draft" && app.status !== "Rejected";

/**
 * What the scheme's cost norms admit for this file, as the CENTRAL share — the figure a sanction is
 * measured against. **AVYAY is the only scheme whose norms this portal holds**; for every other
 * scheme this is null and the sanction box states no admissible figure (design-director audit R-05,
 * and the coordinator's decision of 16 Sep 2026). Read by `CostNormsReview` and by the sanction
 * panel, so the two cannot disagree.
 */
export function schemeNorms(app: GrantApplication): { recurring: number; nonRecurring: number; total: number } | null {
  if (app.schemeCode !== "AVYAY") return null;
  const v = app.formValues ?? {};
  const norm = avyayEntitlement({
    natureOfProject: v.fld_nature_of_project,
    agencyType: v.fld_agency_type,
    projectState: v.fld_project_state,
    buildingOwnership: v.fld_building_ownership,
  });
  return { recurring: norm.recurringCentral, nonRecurring: norm.nonRecurringCentral, total: norm.totalCentral };
}

/* ── Funding history ─────────────────────────────────────────────────────── */

export function FundingHistory({ app }: { app: GrantApplication }) {
  const { state } = useEAnudaan();
  const ngo = ngoSanctions(state, app.ngoId, app.id);
  const project = projectDisbursement(state, app.institutionId);
  const ngo360 = `${BASE}/dashboard/ngo/${encodeURIComponent(app.ngoId)}/360`;

  return (
    <Panel
      title="Funding History"
      actions={
        <Link href={ngo360} className={buttonClasses("primary", "text", "sm", "whitespace-nowrap")}>
          Open NGO 360
        </Link>
      }
    >
      <div className="space-y-3">
        <SectionTitle as={3} title="Previously Allocated Funds — This NGO" />
        {ngo.rows.length === 0 ? (
          <p className="text-body-2 text-ink-muted">No earlier sanction order has been issued to this NGO.</p>
        ) : (
          <>
            <DataTable<NgoSanctionRow & Record<string, unknown>>
              caption="Sanction orders issued to this NGO"
              columns={[
                { key: "financialYear", header: "Financial Year", render: (r) => <span className="whitespace-nowrap">{r.financialYear}</span> },
                { key: "orderNo", header: "Sanction No.", render: (r) => <span className="whitespace-nowrap font-mono">{r.orderNo}</span> },
                { key: "sanctionedAt", header: "Date", render: (r) => <span className="whitespace-nowrap">{formatDate(r.sanctionedAt)}</span> },
                { key: "scheme", header: "Scheme", render: (r) => schemeLabel(r.scheme) },
                { key: "amount", header: "Sanctioned Amount", className: "text-right", render: (r) => <span className="whitespace-nowrap tabular-nums">{formatMoney(r.amount)}</span> },
              ]}
              data={ngo.rows as (NgoSanctionRow & Record<string, unknown>)[]}
              total={ngo.rows.length}
              pageSizes={[5, 25]}
            />
            <p className="text-body-2 text-ink">
              Total previously allocated: <strong className="tabular-nums">{formatMoney(ngo.total)}</strong> across {ngo.rows.length} sanction order{ngo.rows.length === 1 ? "" : "s"}.
            </p>
          </>
        )}
      </div>

      <div className="space-y-3">
        <SectionTitle as={3} title="Sanction & Disbursement — This Project" />
        {project.rows.length === 0 ? (
          <p className="text-body-2 text-ink-muted">No grant has been sanctioned for project {app.institutionId}.</p>
        ) : (
          <>
        <DescriptionList
          columns={3}
          size="sm"
          items={[
            { term: "Sanctioned Grants", value: String(project.rows.length) },
            { term: "Total Sanctioned", value: <span className="tabular-nums">{formatMoney(project.totalSanctioned)}</span> },
            { term: "Total Released", value: <span className="tabular-nums">{formatMoney(project.totalReleased)}</span> },
          ]}
        />
          <DataTable<ProjectSanctionRow & Record<string, unknown>>
            caption={`Grants sanctioned for project ${app.institutionId}`}
            columns={[
              { key: "id", header: "Application No.", render: (r) => <RefText value={r.app.id} className="font-mono text-body-3" /> },
              { key: "fy", header: "FY", render: (r) => <span className="whitespace-nowrap">{r.app.financialYear}</span> },
              { key: "date", header: "Sanction Date", render: (r) => <span className="whitespace-nowrap">{formatDate(r.app.sanction!.sanctionedAt)}</span> },
              { key: "sanctioned", header: "Sanctioned", className: "text-right", render: (r) => <span className="whitespace-nowrap tabular-nums">{formatMoney(r.sanctioned)}</span> },
              { key: "released", header: "Released", className: "text-right", render: (r) => <span className="whitespace-nowrap tabular-nums">{formatMoney(r.released)}</span> },
            ]}
            data={project.rows as (ProjectSanctionRow & Record<string, unknown>)[]}
            total={project.rows.length}
            pageSizes={[5, 25]}
          />
          </>
        )}
      </div>
    </Panel>
  );
}

/* ── Instalments and fund release ────────────────────────────────────────── */

export function InstalmentsPanel({ app }: { app: GrantApplication }) {
  const { state, releaseFunds, openForClaim } = useEAnudaan();
  const { toast } = useToast();
  const [releasing, setReleasing] = React.useState<GrantApplication | null>(null);
  const schedule = instalmentSchedule(state, app);
  const role = state.session ? ROLES[state.session] : null;
  if (!schedule) return null;
  const canRelease = !!role?.caps.includes("releaseFunds");

  const release = (target: GrantApplication) => {
    const res = releaseFunds(target.id);
    setReleasing(null);
    if (!res.ok) toast(res.error, "error");
    else toast(`${rupees(target.sanction!.total)} released against sanction order ${target.sanction!.orderNo}.`, "success");
  };
  const open = (row: ScheduleRow) => {
    if (!row.openedFrom) return;
    const res = openForClaim(row.openedFrom.id, row.label);
    if (!res.ok) toast(res.error, "error");
    else toast(`${row.label} opened for claim. The NGO has been notified.`, "success");
  };

  const status = (r: ScheduleRow): React.ReactNode => {
    switch (r.state) {
      case "released":
        return (
          <span className="block">
            <Badge status="success" size="sm">Released</Badge>
            {r.claim?.release && <span className="mt-1 block whitespace-nowrap text-body-3 text-ink-muted">{formatDate(r.claim.release.releasedAt)}</span>}
          </span>
        );
      case "to-release":
        return canRelease && r.claim ? (
          <Button size="sm" nowrap onClick={() => setReleasing(r.claim!)}>
            Release Funds
          </Button>
        ) : (
          <Badge status="warning" size="sm">Awaiting Release</Badge>
        );
      case "claimed":
        return <Badge status="info" size="sm">Claimed · Under Examination</Badge>;
      case "open":
        return (
          <span className="block">
            <Badge status="info" size="sm">Open for Claim</Badge>
            {r.openedFrom?.claimOpenedAt && <span className="mt-1 block whitespace-nowrap text-body-3 text-ink-muted">Since {formatDate(r.openedFrom.claimOpenedAt)}</span>}
          </span>
        );
      case "can-open":
        return canRelease ? (
          <Button size="sm" appearance="outlined" nowrap onClick={() => open(r)}>
            Open for Claim
          </Button>
        ) : (
          <Badge status="neutral" size="sm">Not Opened</Badge>
        );
      case "not-yet":
        return <span className="text-body-3 text-ink-muted">Opens when the financial year begins.</span>;
      default:
        return <span className="text-body-3 text-ink-muted">Opens once the {r.previousLabel ?? "previous instalment"} is released.</span>;
    }
  };

  return (
    <Panel
      title="Instalments & Fund Release"
      actions={
        <Link href={`${BASE}/finance/payment-status/${encodeURIComponent(app.id)}`} className={buttonClasses("primary", "text", "sm", "whitespace-nowrap")}>
          Payment Status
        </Link>
      }
    >
      <DescriptionList
        columns={2}
        size="sm"
        items={[
          { term: "Released So Far", value: <span className="tabular-nums">{formatMoney(schedule.releasedSoFar)}</span> },
          { term: "Release Pattern", value: releasePatternFact(schedule.pattern) },
        ]}
      />
      {/* A list, not a six-column table: the status holds the action, and a table this wide scrolled
          sideways inside the review column at 1440px and on a phone (review call B17, B18). */}
      <ListGroup aria-label={`Instalments for FY ${schedule.financialYear}`}>
        {schedule.rows.map((r) => (
          <ListRow
            key={r.key}
            title={
              <span>
                {r.label}
                {r.share != null && <span className="font-normal text-ink-muted"> · {r.share}%</span>}
              </span>
            }
            description={
              <span className="block">
                Planned <span className="tabular-nums">{formatMoney(r.planned)}</span>
                {r.claim?.sanction && <> · sanction {r.claim.sanction.orderNo}</>}
                {r.claim && <> · claimed <span className="tabular-nums">{formatMoney(r.claim.total)}</span></>}
                {" · "}released <span className="tabular-nums">{formatMoney(r.released)}</span>
              </span>
            }
            trailing={status(r)}
          />
        ))}
      </ListGroup>

      <Modal
        open={releasing !== null}
        onClose={() => setReleasing(null)}
        title="Release the Funds?"
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button appearance="outlined" onClick={() => setReleasing(null)}>
              Cancel
            </Button>
            <Button onClick={() => releasing && release(releasing)}>Release {releasing?.sanction ? rupees(releasing.sanction.total) : ""}</Button>
          </div>
        }
      >
        {releasing?.sanction && (
          <div className="space-y-4">
            <p className="text-body-2 text-ink">The amount is released to the project&apos;s bank account on record. A release cannot be withdrawn from this portal.</p>
            <DescriptionList
              columns={1}
              layout="inline"
              size="sm"
              divided
              items={[
                { term: "Application No.", value: releasing.id },
                { term: "Sanction Order", value: releasing.sanction.orderNo },
                { term: "Amount to Release", value: rupees(releasing.sanction.total) },
              ]}
            />
          </div>
        )}
      </Modal>
    </Panel>
  );
}

/* ── Show Cause Notices ──────────────────────────────────────────────────── */

/** Whether the signed-in officer may issue a Show Cause Notice on this file — the decision panel's "More Actions" asks. */
export function canIssueShowCause(app: GrantApplication, role: RoleId | null | undefined): boolean {
  return !!role && !!ROLES[role]?.caps.includes("issueShowCause") && isOpenFile(app);
}

/**
 * The notices issued on the file, and the dialog that issues one. The dialog is opened from the
 * decision panel's "More Actions" (audit R-04): the button used to sit on this card about 5,000px
 * below "Your Decision", so the card now holds history only and is drawn only when there is some.
 */
export function ShowCausePanel({
  app,
  dialogOpen,
  onDialogOpen,
  onDialogClose,
}: {
  app: GrantApplication;
  dialogOpen: boolean;
  onDialogOpen: () => void;
  onDialogClose: () => void;
}) {
  const { state, issueShowCauseNotice } = useEAnudaan();
  const { toast } = useToast();
  const [grounds, setGrounds] = React.useState("");
  const [respondBy, setRespondBy] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const notices = app.showCauseNotices;
  const today = new Date().toISOString().slice(0, 10);

  const close = () => {
    onDialogClose();
    setGrounds("");
    setRespondBy("");
    setError(null);
  };
  const issue = () => {
    const invalid = showCauseError({ grounds, respondBy: respondBy || undefined }, new Date().toISOString());
    if (invalid) {
      setError(invalid);
      return;
    }
    const res = issueShowCauseNotice(app.id, { grounds, respondBy: respondBy || undefined });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    close();
    toast("Show Cause Notice issued. The NGO has been notified.", "success");
  };

  // The demo dock's fill (demo-forms/show-cause-notice.ts): opens the dialog filled, and for a rule
  // preset shows the message Issue Notice would.
  useDemoFormFill(SHOW_CAUSE_NOTICE.id, (v, preset) => {
    if (!canIssueShowCause(app, state.session)) {
      toast(`${SHOW_CAUSE_NOTICE.title} is not open to you on this file.`, "info");
      return;
    }
    const next = { grounds: v.grounds ?? "", respondBy: resolveDate(v.respondBy, today) };
    setGrounds(next.grounds);
    setRespondBy(next.respondBy);
    setError(preset.valid ? null : showCauseError({ grounds: next.grounds, respondBy: next.respondBy || undefined }, new Date().toISOString()));
    onDialogOpen();
  });

  return (
    <>
      {notices.length > 0 && (
        <Panel title="Show Cause Notices">
        <ListGroup aria-label="Show Cause Notices issued">
          {[...notices].reverse().map((n) => (
            <ListRow
              key={n.id}
              title={n.grounds}
              description={
                <>
                  Issued by {officerOf(n.issuedBy)}, {formatDate(n.issuedAt)}
                  {n.respondBy ? ` · response due ${formatDate(n.respondBy)}` : ""}
                  {n.respondedAt && <span className="block">Answered {formatDate(n.respondedAt)}{n.response ? `: ${n.response}` : ""}</span>}
                </>
              }
              trailing={<Badge status={n.respondedAt ? "success" : "warning"} size="sm">{n.respondedAt ? "Answered" : "Awaiting Reply"}</Badge>}
            />
          ))}
        </ListGroup>
        </Panel>
      )}
      {/* The form opens on request. Inline it stood open on every SO and JS review, a textarea and a
          date the officer had not asked for, between the documents and the file movement. The dialog
          states what issuing does and asks before discarding typed grounds. */}
      <Modal
        open={dialogOpen}
        onClose={close}
        dirty={grounds.trim() !== "" || respondBy !== ""}
        title="Issue a Show Cause Notice"
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button appearance="outlined" onClick={close}>
              Cancel
            </Button>
            <Button onClick={issue}>Issue Notice</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-body-2 text-ink">
            The NGO is notified and asked for a written explanation. The file stays with you.
          </p>
          <FormField id={`scn-grounds-${app.id}`} label="Grounds for the Notice" required error={(!grounds.trim() && error) || undefined}>
            {(c) => <Textarea {...c} rows={4} value={grounds} onChange={(e) => setGrounds(e.target.value)} />}
          </FormField>
          <div className="max-w-xs">
            <DatePicker
              id={`scn-due-${app.id}`}
              label="Response Deadline"
              hint="Optional"
              value={respondBy}
              onChange={setRespondBy}
              min={today}
              error={(grounds.trim() && error) || undefined}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ── Inspections ─────────────────────────────────────────────────────────── */

function inspectionLine(i: Inspection): string {
  const when = i.scheduledFor ? `${formatDateTime(i.scheduledFor)}${i.endsAt ? ` to ${formatDateTime(i.endsAt).split(", ").pop()}` : ""}` : "Not scheduled";
  const parts = [i.status === "Scheduled" ? `Scheduled for ${when}` : i.status === "Pending" ? "Awaiting a visit date" : `${i.status}${i.submittedAt ? ` ${formatDate(i.submittedAt)}` : ""}`];
  if (i.recommendation) parts.push(`Recommendation: ${i.recommendation}`);
  if (i.scheduledBy) parts.push(`Scheduled by ${officerOf(i.scheduledBy)}`);
  return parts.join(" · ");
}

const EMPTY_INSPECTION = { title: "", description: "", date: "", start: "", end: "" };

/** A date and a time as the officer's local date-time, ISO; "" until both are entered. */
const at = (date: string, time: string) => (date && time ? new Date(`${date}T${time}:00`).toISOString() : "");

/** Whether the signed-in officer may schedule an online inspection now — none is already booked. */
export function canScheduleInspection(state: EAnudaanState, app: GrantApplication): boolean {
  const role = state.session ? ROLES[state.session] : null;
  const onlineBooked = state.inspections.some((i) => i.applicationId === app.id && i.visitType === "Online" && i.status === "Scheduled");
  return !!role?.caps.includes("scheduleInspection") && isOpenFile(app) && !onlineBooked;
}

/** The inspections on the file, and the dialog that schedules one — opened from "More Actions" (R-04). */
export function InspectionsPanel({
  app,
  dialogOpen,
  onDialogOpen,
  onDialogClose,
}: {
  app: GrantApplication;
  dialogOpen: boolean;
  onDialogOpen: () => void;
  onDialogClose: () => void;
}) {
  const { state, scheduleOnlineInspection } = useEAnudaan();
  const { toast } = useToast();
  const inspections = state.inspections.filter((i) => i.applicationId === app.id);
  const [f, setF] = React.useState(EMPTY_INSPECTION);
  const [error, setError] = React.useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);
  const dirty = Object.values(f).some((v) => v !== "");

  const close = () => {
    onDialogClose();
    setF(EMPTY_INSPECTION);
    setError(null);
  };
  const schedule = () => {
    const res = scheduleOnlineInspection(app.id, { title: f.title, description: f.description, startsAt: at(f.date, f.start), endsAt: at(f.date, f.end) });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    close();
    toast("Online inspection scheduled. The NGO has been notified.", "success");
  };

  // The demo dock's fill (demo-forms/online-inspection.ts): opens the dialog filled, and for a rule
  // preset shows the message Schedule Inspection would.
  useDemoFormFill(ONLINE_INSPECTION.id, (v, preset) => {
    if (!canScheduleInspection(state, app)) {
      toast(`${ONLINE_INSPECTION.title} is not open to you on this file.`, "info");
      return;
    }
    const next = { title: v.title ?? "", description: v.description ?? "", date: resolveDate(v.date, today), start: v.start ?? "", end: v.end ?? "" };
    setF(next);
    setError(
      preset.valid
        ? null
        : onlineInspectionError({ title: next.title, startsAt: at(next.date, next.start), endsAt: at(next.date, next.end) }, new Date().toISOString()),
    );
    onDialogOpen();
  });

  return (
    <>
      {inspections.length > 0 && (
        <Panel title="Inspections">
        <ListGroup aria-label="Inspections on this application">
          {inspections.map((i) => (
            <ListRow
              key={i.id}
              title={`${i.visitType} Inspection${i.title ? `: ${i.title}` : ""}`}
              description={
                <>
                  {inspectionLine(i)}
                  {i.description && <span className="block">{i.description}</span>}
                </>
              }
              trailing={<Badge status={i.status === "Reviewed" || i.status === "Submitted" ? "success" : "info"} size="sm">{i.status}</Badge>}
            />
          ))}
        </ListGroup>
        </Panel>
      )}
      {/* The BharatVC form opens on request. Inline, five empty fields stood open on every review
          that could schedule one — 520px of the page for an action most files never take. */}
      <Modal
        open={dialogOpen}
        onClose={close}
        dirty={dirty}
        title="Schedule Online Inspection (BharatVC)"
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button appearance="outlined" onClick={close}>
              Cancel
            </Button>
            <Button onClick={schedule}>Schedule Inspection</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-body-2 text-ink">The NGO is notified of the date and time of the video inspection.</p>
          <FormField id={`vc-title-${app.id}`} label="Title" required>
            {(c) => <Input {...c} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />}
          </FormField>
          <FormField id={`vc-desc-${app.id}`} label="Description" optional>
            {(c) => <Textarea {...c} rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />}
          </FormField>
          <DatePicker id={`vc-date-${app.id}`} label="Date" required min={today} value={f.date} onChange={(date) => setF({ ...f, date })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <TimePicker id={`vc-start-${app.id}`} label="Start Time" required value={f.start} onChange={(start) => setF({ ...f, start })} />
            <TimePicker id={`vc-end-${app.id}`} label="End Time" required value={f.end} onChange={(end) => setF({ ...f, end })} />
          </div>
          {error && (
            <p className="text-body-3 text-[var(--sa-text-status-error-bolder)]" role="alert">
              {error}
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}

/* ── AVYAY: the grant against the cost norms ─────────────────────────────── */

export function CostNormsReview({ app }: { app: GrantApplication }) {
  if (app.schemeCode !== "AVYAY") return null;
  const v = app.formValues ?? {};
  const norm = avyayEntitlement({
    natureOfProject: v.fld_nature_of_project,
    agencyType: v.fld_agency_type,
    projectState: v.fld_project_state,
    buildingOwnership: v.fld_building_ownership,
  });
  const line = (sought: number, allowed: number) => (
    <span className="flex flex-wrap items-center gap-2">
      <span className="tabular-nums">{formatMoney(sought)}</span>
      <span className="text-body-3 text-ink-muted">admissible {formatMoney(allowed)}</span>
      {sought > allowed && <Badge status="warning" size="sm">Above the Norm</Badge>}
    </span>
  );
  const ownedHint = norm.ownedDeduction > 0 ? `Norm ${formatMoney(norm.recurringNorm)}, less ${formatMoney(norm.ownedDeduction)} for an owned building` : undefined;
  // An instalment claims a share of the year's recurring grant, so the NORM is compared with the
  // year's figure, never with the instalment — a 40% claim read as far below a norm it is not.
  const annual = Number(v.fld_sanctioned_recurring || 0);
  const items =
    app.caseType === "Ongoing"
      ? [
          { term: "Year's Recurring Grant", hint: ownedHint, value: annual > 0 ? line(annual, norm.recurringCentral) : <span className="text-body-3 text-ink-muted">Not recorded · admissible {formatMoney(norm.recurringCentral)}</span> },
          { term: "This Instalment", value: <span className="tabular-nums">{formatMoney(app.recurring)}</span> },
        ]
      : [
          { term: "Recurring", hint: ownedHint, value: line(app.recurring, norm.recurringCentral) },
          { term: "Non-Recurring", value: line(app.nonRecurring, norm.nonRecurringCentral) },
          { term: "Total", value: line(app.total, norm.totalCentral) },
        ];
  return (
    <Panel title="Grant Against the Cost Norms">
      <DescriptionList columns={1} layout="inline" size="sm" divided items={items} />
      <p className="text-body-3 text-ink-muted">Central share {norm.share}%.</p>
    </Panel>
  );
}
