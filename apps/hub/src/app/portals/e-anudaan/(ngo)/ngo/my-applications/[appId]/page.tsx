"use client";

/**
 * Application detail — what the applicant sees after "View →".
 *
 * DS Audit: Alert ✅ existing · Badge ✅ · Button ✅ · Icon ✅ · MetricCard ✅ · Accordion ✅ ·
 * AccordionItem ✅ · ApprovalTimeline ✅ · EmptyState ✅ — nothing new.
 *
 * Section order and copy follow the live screen (walkthrough 2026-08-22):
 *   Processing History → "N Documents Require Attention" callout → Application Summary →
 *   Application Data — as submitted → Uploaded Documents.
 *
 * The per-document AI verdict is the APPLICANT-facing check and is shown alongside — but
 * separately from — the officer's own Status column, exactly as the live portal does.
 */

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Badge, Button, Icon, MetricCard } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES } from "@/lib/e-anudaan/roles";
import { formatDate, formatGrant, ngoStatusLabel, statusTone } from "@/lib/e-anudaan/selectors";
import { wizardFor, type FieldDef } from "@/lib/e-anudaan/form-schema";
import { VERDICT_GLYPH, verdictHeadline, verdictPill } from "@/lib/e-anudaan/doc-verification";
import type { AuditAction, MockDoc } from "@/lib/e-anudaan/types";

/** The live timeline's own wording for each transition. */
const ACTION_TITLE: Record<AuditAction, string> = {
  submit: "Application submitted",
  certify: "Verification completed",
  forward: "Forwarded up the chain",
  raiseQuery: "Query raised",
  resolveQuery: "Query resolved",
  raiseDeficiency: "Deficiency raised",
  communicateDeficiency: "Deficiency communicated",
  respondDeficiency: "Response submitted",
  concur: "Financial concurrence recorded",
  sanction: "Sanctioned",
  reject: "Rejected",
  return: "Returned for correction",
  routeDown: "Routed back down the chain",
  inspectionScheduled: "Inspection scheduled",
  inspectionSubmitted: "Inspection report submitted",
  inspectionReviewed: "Inspection report reviewed",
};

export default function NgoApplicationDetailPage() {
  const params = useParams<{ appId: string }>();
  const router = useRouter();
  const { findApp, state } = useEAnudaan();
  const app = findApp(decodeURIComponent(params.appId));

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  if (!app) {
    return (
      <Alert status="warning" title="Application not found.">
        <Button appearance="outlined" size="sm" onClick={() => router.push("/portals/e-anudaan/ngo/my-applications")}>
          Back to My Applications
        </Button>
      </Alert>
    );
  }

  const ngo = state.ngos.find((n) => n.id === app.ngoId);
  const scheme = state.schemes.find((s) => s.code === app.schemeCode);
  const wizard = wizardFor(app.schemeCode);
  const values = app.formValues ?? {};

  const flagged = app.documents.filter((d) => d.reviewStatus === "Deficient");
  const uploaded = app.documents.filter((d) => d.fileName);

  /** The form's sections, in wizard order, with their answered counts. */
  const sections = (wizard?.steps ?? [])
    .filter((s) => s.kind !== "documents" && s.kind !== "review")
    .flatMap((s) => s.sections)
    .map((section, i) => {
      // Count EVERY field the form asks, not only the answered ones — the live screen reads
      // "12/14 filled" precisely because Telephone and Fax were left blank.
      const fields = section.fields;
      const filled = fields.filter((f) => (values[f.name] ?? "").trim() !== "").length;
      return { index: i + 1, title: section.title, lead: section.lead, fields, filled };
    });

  const totalFields = sections.reduce((a, s) => a + s.fields.length, 0);
  const totalFilled = sections.reduce((a, s) => a + s.filled, 0);
  const allOpen = sections.length > 0 && sections.every((s) => expanded[s.title]);

  const toggleAll = () => {
    const next: Record<string, boolean> = {};
    for (const s of sections) next[s.title] = !allOpen;
    setExpanded(next);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Button appearance="text" size="sm" onClick={() => router.back()}>
        <Icon name="arrow_back" size={16} aria-hidden /> Go back
      </Button>

      <header className="space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-ink">Application — {app.id}</h1>
          <Badge status={statusTone(app.status)}>{ngoStatusLabel(app)}</Badge>
        </div>
        <p className="text-sm text-ink-muted">{ngo?.name}</p>
        <p className="text-sm text-ink-muted">
          {app.schemeCode} — {scheme?.name ?? app.schemeCode}
        </p>
      </header>

      {/* ── Processing History ─────────────────────────────────────────────── */}
      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-base font-bold text-ink">Processing History</h2>
        <p className="mt-1 text-sm text-ink-muted">Where your application has been, and when.</p>
        {app.audit.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">Not submitted yet.</p>
        ) : (
          <ol className="mt-4 space-y-4">
            {app.audit.map((e) => (
              <li key={e.id} className="border-l-2 border-primary/30 pl-4">
                <p className="text-sm font-semibold text-ink">{ACTION_TITLE[e.action] ?? e.action}</p>
                <p className="text-xs text-ink-muted">
                  {formatDate(e.at)} · {e.byRole === "ngo" ? "You" : ROLES[e.byRole].label}
                </p>
                {e.remarks && <p className="mt-1 text-sm text-ink-muted">{e.remarks}</p>}
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* ── Documents requiring attention ──────────────────────────────────── */}
      {flagged.length > 0 && (
        <Alert
          status="warning"
          title={`${flagged.length} Document${flagged.length === 1 ? "" : "s"} Require Attention`}
        >
          <p className="text-sm">
            The following documents were flagged during verification by Assistant Section Officer.
          </p>
          <p className="mt-2 text-sm">
            No action is needed from you yet — the application is still with the Ministry. If a
            correction is required, it will be returned to you and you will be able to replace
            these files here.
          </p>
          <ul className="mt-3 space-y-1.5">
            {flagged.map((d) => (
              <li key={d.id} className="text-sm">
                <span className="font-semibold text-ink">
                  {d.slot}. {d.title}
                </span>
                <span className="block text-xs text-ink-muted">
                  {d.officerRemarks
                    ? `Flagged by Assistant Section Officer — ${d.officerRemarks}`
                    : "Flagged by Assistant Section Officer — no remark recorded."}
                </span>
              </li>
            ))}
          </ul>
        </Alert>
      )}

      {/* ── Application Summary ────────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-ink">Application Summary</h2>
          <Badge status={statusTone(app.status)}>{ngoStatusLabel(app)}</Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard label="Financial year" value={app.financialYear} />
          <MetricCard label="Requested" value={formatGrant(app.total)} />
          <MetricCard label="Sanctioned strength" value={`${app.totalBeneficiaries} beneficiaries`} />
        </div>

        <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {(
            [
              ["Application ID", app.id],
              ["NGO Name", ngo?.name ?? "—"],
              ["Scheme", `${app.schemeCode} — ${scheme?.name ?? app.schemeCode}`],
              ["Project Title", app.projectLabel],
              ["Project Location", values.fld_institution_location ?? "—"],
              ["Submitted Date", app.submittedAt ? formatDate(app.submittedAt) : "—"],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="flex flex-col border-b border-line/50 py-1.5">
              <dt className="text-xs text-ink-muted">{label}</dt>
              <dd className="text-sm font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Application Data — as submitted ────────────────────────────────── */}
      {sections.length > 0 && (
        <section className="space-y-3 rounded-xl border border-line bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-ink">Application Data — as submitted</h2>
              <p className="mt-0.5 text-sm text-ink-muted">
                {totalFilled} of {totalFields} answered
              </p>
            </div>
            <Button appearance="outlined" size="sm" onClick={toggleAll}>
              {allOpen ? "Collapse all" : "Expand all"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <button
                key={s.title}
                type="button"
                className="rounded-full border border-line bg-surface-muted px-3 py-1 text-xs text-ink hover:bg-surface"
                onClick={() => {
                  setExpanded((e) => ({ ...e, [s.title]: true }));
                  document.getElementById(`sec-${s.index}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                {s.index}. {s.title}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {sections.map((s) => {
              const open = expanded[s.title] ?? false;
              return (
                <div key={s.title} id={`sec-${s.index}`} className="rounded-lg border border-line">
                  <button
                    type="button"
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                    onClick={() => setExpanded((e) => ({ ...e, [s.title]: !open }))}
                  >
                    <span className="text-sm font-semibold text-ink">
                      {s.index}. {s.title}
                    </span>
                    <span className="flex items-center gap-2">
                      <Badge status={s.filled === s.fields.length ? "success" : "warning"}>
                        {s.filled}/{s.fields.length} filled
                      </Badge>
                      <Icon name={open ? "expand_less" : "expand_more"} size={20} aria-hidden />
                    </span>
                  </button>
                  {open && (
                    <div className="border-t border-line px-4 py-3">
                      {s.lead && <p className="mb-3 text-sm text-ink-muted">{s.lead}</p>}
                      <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                        {s.fields.map((f: FieldDef) => (
                          <div key={f.name} className="flex flex-col border-b border-line/40 py-1">
                            <dt className="text-xs text-ink-muted">{f.label}</dt>
                            <dd className="text-sm font-medium text-ink">
                              {(values[f.name] ?? "").trim() || "—"}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Uploaded Documents ─────────────────────────────────────────────── */}
      <section className="space-y-3 rounded-xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-ink">Uploaded Documents</h2>
          <Badge status="info">
            {uploaded.length} of {app.documents.length} uploaded
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-sm">
            <caption className="sr-only">Documents uploaded with this application</caption>
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
                <th scope="col" className="pb-2 pr-3 font-medium">Document</th>
                <th scope="col" className="pb-2 pr-3 font-medium">Uploaded On</th>
                <th scope="col" className="pb-2 pr-3 font-medium">Status</th>
                <th scope="col" className="pb-2 pr-3 font-medium">Remarks</th>
                <th scope="col" className="pb-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {app.documents.map((d) => (
                <DocumentRow key={d.id} doc={d} schemeCode={app.schemeCode} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function DocumentRow({ doc, schemeCode }: { doc: MockDoc; schemeCode: string }) {
  const verdict = doc.aiVerdict;
  const pill = verdict ? verdictPill(verdict) : null;
  const flagged = doc.reviewStatus === "Deficient";

  return (
    <>
      <tr className="border-b border-line align-top">
        <td className="py-2 pr-3">
          <span className="block text-sm font-medium text-ink">
            {doc.slot}. {doc.title}
            {!doc.optional && <span className="text-status-error"> *</span>}
          </span>
          <span className="mt-0.5 block text-xs text-ink-hint">{schemeCode}</span>
          {verdict && (
            <span className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
              <Icon name={VERDICT_GLYPH[verdict.state]} size={16} aria-hidden />
              AI: {verdict.state === "pending" ? "pending" : verdict.state === "verified" ? "verified" : verdict.state === "review" ? "needs review" : "not valid"}
              {pill && <span className="text-ink-hint">· {pill}</span>}
            </span>
          )}
          {verdict?.summary && verdict.state !== "pending" && (
            <span className="mt-1 block text-xs text-ink-muted">{verdictHeadline(verdict)} — {verdict.summary}</span>
          )}
        </td>
        <td className="py-2 pr-3 text-ink">{doc.uploadedAt ? formatDate(doc.uploadedAt) : "—"}</td>
        <td className="py-2 pr-3">
          <Badge status={flagged ? "warning" : doc.reviewStatus === "Verified" ? "success" : "neutral"}>
            {flagged ? "Needs Correction" : doc.reviewStatus}
          </Badge>
        </td>
        <td className="py-2 pr-3 text-ink-muted">{doc.officerRemarks ?? "—"}</td>
        <td className="py-2">
          {doc.fileName ? (
            <Button appearance="text" size="sm">
              View
            </Button>
          ) : (
            <span className="text-ink-hint">—</span>
          )}
        </td>
      </tr>
      {flagged && (
        <tr className="border-b border-line">
          <td colSpan={5} className="px-0 pb-2 text-xs text-ink-muted">
            You will be able to upload a corrected file once the application is returned to you.
          </td>
        </tr>
      )}
    </>
  );
}
