"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Icon, Modal , Textarea, Card} from "@mosje/design-system";
import { Button, StatusPill, SlaBadge, cnField } from "@/components/tg/ui";
import { useTg } from "@/lib/tg/store/store";
import { ROLES } from "@/lib/tg/roles";
import { canTransition, ROLE_ACTS_ON, type Stage } from "@/lib/tg/store/types";
import { cn } from "@/lib/tg/utils";

/** The "approve/forward" target for the current stage. */
function forwardTarget(stage: Stage): { to: Stage; label: string } | null {
  switch (stage) {
    case "SUBMITTED":
      return { to: "MAKER_REVIEW", label: "Pick up for Review" };
    case "MAKER_REVIEW":
      return { to: "CHECKER_REVIEW", label: "Approve & Forward to Checker" };
    case "CHECKER_REVIEW":
      return { to: "DM_REVIEW", label: "Approve & Forward to DM" };
    case "DM_REVIEW":
      return { to: "APPROVED_SIGNED", label: "Approve and Sign" };
    default:
      return null;
  }
}

type ActionKind = "approve" | "correction" | "reject" | null;

const TABS = [
  { id: "details" as const, label: "Applicant Details" },
  { id: "documents" as const, label: "Documents" },
];

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2">
      <dt className="text-label-3 uppercase text-ink-hint">{label}</dt>
      <dd className="text-body-2 text-ink">{value || "—"}</dd>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { state, hydrated, findApp, transition } = useTg();
  const [tab, setTab] = React.useState<"details" | "documents">("details");
  const [action, setAction] = React.useState<ActionKind>(null);
  const [note, setNote] = React.useState("");

  if (!hydrated || state.session === null || state.session === "citizen") return null;
  const role = ROLES[state.session];
  const app = findApp(id);

  if (!app) {
    return (
      <Card className="p-10 text-center">
        <p className="text-body-2 font-semibold text-ink">Application {id} not found.</p>
        <Link href="/portals/tg/admin/dashboard" className="mt-3 inline-block text-label-1 font-semibold text-navy hover:underline">
          ← Back to Dashboard
        </Link>
      </Card>
    );
  }

  const fwd = forwardTarget(app.stage);
  // Separation of duties: an officer may only act on stages in their own queue;
  // Central Admin is an override. This gates the review actions (the store
  // enforces the same rule as a backstop).
  const canAct = role.id === "central-admin" || ROLE_ACTS_ON[role.id].includes(app.stage);
  const canApprove = fwd !== null && canTransition(app.stage, fwd.to);
  const canReview =
    canAct && ["SUBMITTED", "MAKER_REVIEW", "CHECKER_REVIEW", "DM_REVIEW"].includes(app.stage);

  function run(to: Stage, defaultNote?: string) {
    transition(app!.id, to, note || defaultNote, role.id);
    setAction(null);
    setNote("");
  }

  const a = app.applicant;
  const submitted = new Date(app.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/portals/tg/admin/dashboard" className="mb-4 inline-flex items-center gap-1.5 text-label-1 font-semibold text-ink-muted hover:text-navy">
        <Icon name="arrow_back" size={16} /> Back to Dashboard
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-headline-1 text-ink">{app.id}</h1>
            <StatusPill status={app.stage} />
          </div>
          <p className="mt-1 text-body-2 text-ink-muted">
            Submitted on {submitted} • {app.type} Certificate • <SlaBadge daysLeft={app.slaDaysLeft} />
          </p>
        </div>
        {canReview && (
          <div className="flex flex-wrap gap-2">
            <Button variant="danger" onClick={() => setAction("reject")}>Reject</Button>
            <Button variant="outline" onClick={() => setAction("correction")}>Request Correction</Button>
            {canApprove && (
              <Button onClick={() => setAction("approve")}>
                {app.stage === "DM_REVIEW" ? <Icon name="verified_user" size={16} /> : <Icon name="check_circle" size={16} />}
                {fwd!.label}
              </Button>
            )}
          </div>
        )}
        {!canAct && ["SUBMITTED", "MAKER_REVIEW", "CHECKER_REVIEW", "DM_REVIEW"].includes(app.stage) && (
          <p className="rounded-lg border border-line bg-white px-3 py-2 text-body-3 font-medium text-ink-muted">
            View only — this application is at the <StatusPill status={app.stage} /> stage, outside your queue.
          </p>
        )}
      </div>

      {/* System validation */}
      <Card className="mb-6 p-5">
        <h2 className="mb-3 text-label-3 uppercase text-ink-hint">System Validation</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-lg border border-approve/30 bg-approve-bg/40 px-3 py-2 text-body-2">
            <Icon name="check_circle" size={16} className="text-approve-fg" />
            <span className="font-medium text-ink">Data Validation</span>
            <span className="ml-auto text-body-3 text-ink-muted">All mandatory fields present</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-approve/30 bg-approve-bg/40 px-3 py-2 text-body-2">
            <Icon name="check_circle" size={16} className="text-approve-fg" />
            <span className="font-medium text-ink">Document Verification</span>
            <span className="ml-auto text-body-3 text-ink-muted">{app.documents.length} documents uploaded</span>
          </div>
        </div>
      </Card>

      {/* Tabs (WAI-ARIA APG Tabs pattern: roving focus + arrow keys) */}
      <div role="tablist" aria-label="Application sections" className="mb-4 flex gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const i = TABS.findIndex((x) => x.id === tab);
              const next = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
              if (!next) return;
              setTab(next.id);
              document.getElementById(`tab-${next.id}`)?.focus();
            }}
            className={cn(
              "border-b-2 px-4 py-2.5 text-label-1 font-semibold transition-colors",
              tab === t.id ? "border-navy text-navy" : "border-transparent text-ink-muted hover:text-navy",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Applicant details / documents tab panels */}
      {tab === "details" ? (
        <div role="tabpanel" id="panel-details" aria-labelledby="tab-details" className="grid gap-6 md:grid-cols-2">
          <Card className="p-5">
            <h3 className="mb-2 text-label-3 uppercase text-ink-hint">Self-Perceived Identity</h3>
            <dl className="divide-y divide-line">
              <Row label="Full Legal Name" value={a.fullLegalName} />
              <Row label="Chosen Name" value={a.chosenName} />
              <Row label="Name to Print on Certificate" value={a.nameToPrint} />
              <Row label="Gender (At Birth)" value={a.genderAtBirth} />
              <Row label="Gender Requested" value={a.genderRequested} />
              <Row label="Date of Birth" value={a.dob} />
              <Row label="Parent / Guardian Name" value={a.guardianName} />
            </dl>
          </Card>
          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="mb-2 text-label-3 uppercase text-ink-hint">Address & Contact</h3>
              <dl className="divide-y divide-line">
                <Row label="Mobile Number" value={a.mobile} />
                <Row label="Email Address" value={a.email} />
                <Row label="State" value={a.state} />
                <Row label="District" value={a.district} />
                <Row label="Pincode" value={a.pincode} />
                <Row label="Full Address" value={a.address} />
              </dl>
            </Card>
            <Card className="p-5">
              <h3 className="mb-2 text-label-3 uppercase text-ink-hint">Education Details</h3>
              <dl className="divide-y divide-line">
                <Row label="Educational Qualification" value={a.education} />
                <Row label="Caste Category" value={a.caste} />
                <Row label="Annual Income" value={a.annualIncome} />
              </dl>
            </Card>
          </div>
        </div>
      ) : (
        <div role="tabpanel" id="panel-documents" aria-labelledby="tab-documents">
        <Card className="divide-y divide-line">
          {app.documents.map((d) => (
            <div key={d.filename} className="flex items-center gap-3 px-5 py-3.5">
              <Icon name="description" size={20} className="shrink-0 text-navy" />
              <div className="min-w-0">
                <div className="truncate text-body-2 font-medium text-ink">{d.type}</div>
                <div className="text-body-3 text-ink-hint">{d.filename} • {d.sizeKb} KB</div>
              </div>
              <button type="button" className="ml-auto inline-flex items-center gap-1 text-label-1 font-semibold text-navy hover:underline">
                <Icon name="download" size={16} /> View
              </button>
            </div>
          ))}
        </Card>
        </div>
      )}

      {/* Timeline */}
      <Card className="mt-6 p-5">
        <h3 className="mb-3 text-label-3 uppercase text-ink-hint">Review Trail</h3>
        <ol className="space-y-3">
          {app.timeline.map((t, i) => (
            <li key={i} className="flex items-start gap-3 text-body-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-navy" />
              <div>
                <span className="font-semibold text-ink"><StatusPill status={t.stage} /></span>
                <span className="ml-2 text-ink-muted">
                  {new Date(t.at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  {t.note ? ` — ${t.note}` : ""}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      {/* Action modals */}
      <Modal
        open={action === "approve"}
        onClose={() => setAction(null)}
        title={fwd?.label ?? "Approve"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setAction(null)}>Cancel</Button>
            <Button onClick={() => fwd && run(fwd.to)}>Confirm</Button>
          </>
        }
      >
        <p className="text-body-2 text-ink-muted">
          {app.stage === "DM_REVIEW"
            ? "Approve and digitally sign this application. A Certificate of Identity will be issued to the applicant."
            : "Approve this application and forward it to the next reviewer."}
        </p>
        <label className="mt-4 block">
          <span className={cnField}>Note (optional)</span>
          <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an internal note…" />
        </label>
      </Modal>

      <Modal
        open={action === "correction"}
        onClose={() => setAction(null)}
        title="Request Correction"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAction(null)}>Cancel</Button>
            <Button variant="outline" onClick={() => run("CORRECTION_REQUESTED", "Correction requested")}>Send back to applicant</Button>
          </>
        }
      >
        <p className="text-body-2 text-ink-muted">The application returns to the applicant for correction and resubmission.</p>
        <label className="mt-4 block">
          <span className={cnField}>Reason for correction</span>
          <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What needs to be corrected?" />
        </label>
      </Modal>

      <Modal
        open={action === "reject"}
        onClose={() => setAction(null)}
        title="Reject Application"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAction(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => run("REJECTED", "Application rejected")}>Confirm Rejection</Button>
          </>
        }
      >
        <p className="text-body-2 text-ink-muted">This permanently rejects the application. The applicant will be notified.</p>
        <label className="mt-4 block">
          <span className={cnField}>Reason for rejection</span>
          <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason (required for the applicant's record)…" />
        </label>
      </Modal>

      {/* After a terminal action, offer to return */}
      {!canReview && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => router.push("/portals/tg/admin/dashboard")}>Back to Dashboard</Button>
        </div>
      )}
    </div>
  );
}
