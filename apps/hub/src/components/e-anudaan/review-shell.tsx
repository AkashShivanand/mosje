"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Alert, Badge, Button, Checkbox, FormField, Icon, Input, Select, Textarea, useToast } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { GRADE_FULL, ROLES } from "@/lib/e-anudaan/roles";
import { permittedActions, statusLabel } from "@/lib/e-anudaan/workflow";
import { formatDate, formatGrant, statusTone } from "@/lib/e-anudaan/selectors";
import type { DocReviewStatus, GrantApplication } from "@/lib/e-anudaan/types";

/**
 * The officer review screen — ONE component behind all ten grades.
 *
 * Section order, headings and helper copy are transcribed from the live captures
 * (docs/research/eanudaan-admin-dev.mosje.in/INVENTORY.md §16). The PD and IFD screens are
 * structurally identical apart from two things, and both are driven by capability, not by a
 * role check:
 *   • PD:ASO gets "Certification Declaration (mandatory)" and its own Record Certification button
 *   • IFD grades get "Online Inspection — BharatVC"
 * The action bar comes entirely from `permittedActions`, so no screen logic knows about grades.
 */
export function ReviewShell({ appId }: { appId: string }) {
  const router = useRouter();
  const { state, findApp, findNgo, act } = useEAnudaan();
  const { toast } = useToast();

  const app = findApp(appId);
  const role = state.session ? ROLES[state.session] : null;

  const [remarks, setRemarks] = React.useState("");
  const [certifyTicked, setCertifyTicked] = React.useState(false);

  if (!app || !role) {
    return (
      <Alert status="warning" title="Application not found">
        This application is not in the demo dataset. <a href="../">Back to the worklist</a>.
      </Alert>
    );
  }

  const ngo = findNgo(app.ngoId);
  const actions = permittedActions(app, role);
  const canCertify = actions.some((a) => a.action === "certify");
  const gradeTitle = role.grade ? GRADE_FULL[role.grade] : role.label;

  const run = (action: (typeof actions)[number]) => {
    const res = act(app.id, action.action, { remarks, certified: certifyTicked });
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    toast(`${action.label(role, app)} — recorded`, "success");
    setRemarks("");
    if (action.action !== "certify") router.push(role.home);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {role.shortLabel} Review — {app.id}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {gradeTitle} · {app.schemeCode === "SHRESHTA_M2" ? "SHRESHTA Mode-2" : app.schemeCode}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button appearance="outlined" onClick={() => toast("Review report generated (demo)", "info")}>
            <Icon name="description" size={16} aria-hidden /> Generate Review Report
          </Button>
          <Badge status={statusTone(app.status)}>{statusLabel(app)}</Badge>
        </div>
      </div>

      <Panel title="Applicant">
        <Facts
          items={[
            ["NGO", ngo?.name ?? app.ngoId],
            ["NGO-Darpan ID", ngo?.darpanId ?? "—"],
            ["Financial Year", app.financialYear],
            ["Total Beneficiaries", String(app.totalBeneficiaries)],
            ["Grant Sought", formatGrant(app.total)],
            ["ASO Certified", app.certifiedAt ? "Yes" : "No"],
          ]}
        />
      </Panel>

      <Panel
        title="Sanction & Disbursement — this Project"
        lead="Sanctioned grants for THIS project (same school/location across years) — with how much has actually been released. Read-only · due-diligence context."
      >
        {app.sanction ? (
          <Facts
            items={[
              ["Sanction No.", app.sanction.orderNo],
              ["Sanction Date", formatDate(app.sanction.sanctionedAt)],
              ["Sanctioned", formatGrant(app.sanction.total)],
              ["Released", "₹0"],
            ]}
          />
        ) : (
          <p className="text-sm text-ink-muted">No sanction recorded for this project yet.</p>
        )}
      </Panel>

      <Panel title="Application Details">
        <Facts
          items={[
            ["Institution Id", app.institutionId],
            ["Project", app.projectLabel],
            ["SC Beneficiaries", String(app.scBeneficiaries)],
            ["Other-Category Beneficiaries", String(app.otherBeneficiaries)],
            ["Recurring Grant Sought", formatGrant(app.recurring)],
            ["Non-Recurring Grant Sought", formatGrant(app.nonRecurring)],
          ]}
        />
      </Panel>

      <Panel
        title="Show Cause Notices"
        lead="Formal notices to the NGO requiring a written explanation. Issued by the SO and above; shown here for your reference."
      >
        {app.showCauseNotices.length === 0 ? (
          <p className="text-sm text-ink-muted">No show cause notice has been issued on this application.</p>
        ) : (
          <ul className="space-y-2">
            {app.showCauseNotices.map((n) => (
              <li key={n.id} className="text-sm text-ink">
                {n.grounds} <span className="text-ink-muted">· {formatDate(n.issuedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <DocumentsPanel app={app} />

      {/* PD:ASO only — a distinct gated step, not a checkbox on forward. */}
      {canCertify && (
        <Panel title="Certification Declaration (mandatory)">
          <Checkbox
            checked={certifyTicked}
            onChange={(e) => setCertifyTicked(e.target.checked)}
            label="I certify that the application and documents have been examined and are complete and correct as per scheme guidelines (BR-SM2-05)."
          />
          <div className="mt-3">
            <Button
              appearance="outlined"
              disabled={!certifyTicked}
              onClick={() => run(actions.find((a) => a.action === "certify")!)}
            >
              Record Certification
            </Button>
          </div>
        </Panel>
      )}

      {/* IFD grades only. */}
      {role.caps.includes("scheduleInspection") && (
        <Panel title="Online Inspection — BharatVC">
          <p className="text-sm text-ink-muted">
            Schedule a video inspection of the institution with the applicant.
          </p>
          <div className="mt-3">
            <Button appearance="outlined" onClick={() => toast("BharatVC scheduling is mocked in this demo", "info")}>
              Schedule BharatVC
            </Button>
          </div>
        </Panel>
      )}

      <Panel title="Officer Supporting Documents (0)">
        <p className="text-sm text-ink-muted">No supporting documents uploaded yet.</p>
      </Panel>

      {/* ── Your Action ────────────────────────────────────────────────────── */}
      <Panel title="Your Action">
        {actions.length === 0 ? (
          <p className="text-sm text-ink-muted">
            This application is not with you — it currently sits with{" "}
            <strong>{statusLabel(app)}</strong>. You are viewing it read-only.
          </p>
        ) : (
          <>
            <FormField label="Remarks (required to forward)" id="officer-remarks">
              {(control) => (
                <Textarea
                  {...control}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter your remarks…"
                  rows={4}
                />
              )}
            </FormField>
            <p className="mt-2 text-xs text-ink-muted">
              PDF / JPG / PNG, ≤ 5 MB. Attached to your forward, deficiency, or in-file-query remark.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {actions
                .filter((a) => a.action !== "certify")
                .map((a) => (
                  <Button
                    key={a.action}
                    variant={a.intent === "danger" ? "danger" : "primary"}
                    appearance={a.intent === "secondary" ? "outlined" : "filled"}
                    disabled={a.requiresRemarks && !remarks.trim()}
                    onClick={() => run(a)}
                  >
                    {a.label(role, app)}
                  </Button>
                ))}
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}

/* ── local building blocks ──────────────────────────────────────────────── */

function Panel({ title, lead, children }: { title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {lead && <p className="mt-1 text-sm text-ink-muted">{lead}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Facts({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k} className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
          <dt className="text-sm text-ink-muted">{k}</dt>
          <dd className="text-sm font-semibold text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

const DOC_STATUSES: DocReviewStatus[] = ["Pending", "Verified", "Deficient", "Not applicable"];

/**
 * The Documents table. The live screen splits the checklist into "Annual documents"
 * (verified & remarked each year) and "Permanent documents" (view-only unless re-uploaded),
 * and gives every row its OWN verdict and remarks — not one verdict for the whole set.
 */
function DocumentsPanel({ app }: { app: GrantApplication }) {
  const annual = app.documents.filter((d) => d.group === "annual");
  const permanent = app.documents.filter((d) => d.group === "permanent");

  return (
    <Panel title={`Documents (${app.documents.length})`}>
      <div className="space-y-6">
        <DocGroup label="Annual documents" hint="verified & remarked each year" docs={annual} />
        <DocGroup
          label="Permanent documents"
          hint="one-time · view-only unless re-uploaded this year"
          docs={permanent}
        />
      </div>
    </Panel>
  );
}

function DocGroup({
  label,
  hint,
  docs,
}: {
  label: string;
  hint: string;
  docs: GrantApplication["documents"];
}) {
  if (docs.length === 0) return null;
  return (
    <div>
      <div className="mb-3">
        <span className="text-sm font-semibold text-navy">{label}</span>{" "}
        <span className="text-xs text-ink-muted">{hint}</span>
      </div>
      <div className="grid gap-3">
        {docs.map((d) => (
          <div key={d.id} className="flex flex-col gap-3 rounded-lg border border-line p-4 md:flex-row md:items-start md:border-0 md:border-b md:border-line md:p-0 md:pb-3 md:last:border-0">
            <div className="text-ink-muted md:w-8 md:shrink-0">{d.slot}</div>
            <div className="flex-1">
              <span className="font-medium text-ink">{d.title}</span>
              {!d.optional && <span className="text-danger"> *</span>}
              {d.conditional && <span className="block text-xs text-ink-muted">{d.conditional}</span>}
              {d.reUploadedThisYear && (
                <Badge status="warning" size="sm" className="mt-1">
                  Permanent · re-uploaded this year · verify
                </Badge>
              )}
            </div>
            <div className="flex flex-col gap-2 md:w-40 md:shrink-0">
              <Select defaultValue={d.reviewStatus} aria-label={`Review status for ${d.title}`}>
                {DOC_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex-1">
              <Input
                defaultValue={d.officerRemarks ?? ""}
                placeholder="Add remarks…"
                aria-label={`Remarks for ${d.title}`}
              />
            </div>
            <div className="md:w-10 md:shrink-0 md:text-right">
              {d.fileName ? (
                <span className="inline-flex items-center gap-1 text-navy hover:underline cursor-pointer">
                  <Icon name="download" size={20} aria-hidden />
                  <span className="md:sr-only text-sm font-medium">Download</span>
                </span>
              ) : (
                <span className="text-ink-hint">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
