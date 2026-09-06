"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon, Modal , Textarea} from "@mosje/design-system";
import { Card, StatusPill, Button, Field } from "@/components/nhapoa/ui";
import { SlaPill, PriorityBadge } from "@/components/nhapoa/case-views";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { doActionsFor, fmtDate, fmtINR } from "@/lib/nhapoa/case-helpers";
import { CASE_STATUS_META, type CaseStatus } from "@/lib/nhapoa/store/types";

type TabKey = "overview" | "investigation" | "clarifications" | "documents" | "audit";
const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "investigation", label: "Investigation" },
  { key: "clarifications", label: "Clarifications" },
  { key: "documents", label: "Documents" },
  { key: "audit", label: "Audit Log" },
];

export default function CaseDetailPage() {
  const params = useParams<{ id: string }>();
  const { state, transitionCase } = useNhapoa();
  const c = state.cases.find((x) => x.id === params.id);
  const [tab, setTab] = React.useState<TabKey>("overview");
  const [action, setAction] = React.useState<{ to: CaseStatus; label: string } | null>(null);
  const [clarifyOpen, setClarifyOpen] = React.useState(false);
  const [note, setNote] = React.useState("");

  if (!c) {
    return (
      <div>
        <Link href="/portals/nhapoa/district-officer/cases" className="inline-flex items-center gap-1 text-label-1 font-semibold text-navy hover:underline"><Icon name="arrow_back" size={16} /> Back to My Cases</Link>
        <Card className="mt-6 p-10 text-center text-body-2 text-ink-muted">Case not found.</Card>
      </div>
    );
  }

  const actions = doActionsFor(c.status);

  function confirmAction() {
    if (!action) return;
    transitionCase(c!.id, action.to, note || undefined, "district-officer");
    setAction(null);
    setNote("");
    setTab("audit");
  }

  return (
    <div>
      <Link href="/portals/nhapoa/district-officer/cases" className="inline-flex items-center gap-1 text-label-1 font-semibold text-navy hover:underline"><Icon name="arrow_back" size={16} /> Back to My Cases</Link>

      {/* Header */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-headline-1 text-navy">{c.refNo}</h1>
            <StatusPill status={c.status} />
            <PriorityBadge case={c} />
          </div>
          <p className="mt-1 text-body-2 text-ink-muted">{c.type} · {c.category} · {c.district}, {c.state}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setClarifyOpen(true)}><Icon name="feedback" size={16} /> Raise Clarification</Button>
          {actions.map((a) => (
            <Button key={a.to} onClick={() => setAction(a)}>{a.label}</Button>
          ))}
        </div>
      </div>

      {/* SLA + submitted */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-body-2">
        <span className="text-ink-hint">Submitted <span className="font-medium text-ink">{fmtDate(c.createdAt)}</span></span>
        <span className="text-ink-hint">SLA</span> <SlaPill case={c} />
        {c.reliefAmount != null && <span className="text-ink-hint">Relief <span className="font-medium text-ink">{fmtINR(c.reliefAmount)}</span></span>}
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-label-1 font-semibold transition-colors ${tab === t.key ? "border-navy text-navy" : "border-transparent text-ink-muted hover:text-ink"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "overview" && (
          <div className="space-y-6">
            <DetailBlock title="Informer Details" rows={[["Name", c.complainant.name], ["Mobile", c.complainant.mobile], ["Role", c.complainantRole], ["Location", [c.complainant.district, c.complainant.state].filter(Boolean).join(", ")]]} />
            {c.victim && <DetailBlock title="Victim Details" rows={[["Name", c.victim.name], ["Mobile", c.victim.mobile]]} />}
            <DetailBlock title="Grievance Details" rows={[["Type", c.type], ["Category", c.category], ["FIR", c.hasFir ? `Yes${c.firNumber ? ` · ${c.firNumber}` : ""}` : "No"], ["Description", c.details ?? "—"]]} />
          </div>
        )}
        {tab === "investigation" && (
          <Card className="p-6 text-body-2 text-ink-muted">
            {c.status === "UNDER_INVESTIGATION" || c.status === "PENDING_APPROVAL" || c.status === "APPROVED" || c.status === "DISBURSED" || c.status === "CLOSED"
              ? "Investigation in progress. Evidence and field-verification notes are recorded here."
              : "Investigation has not started for this case yet. Assign and move it to investigation to begin."}
          </Card>
        )}
        {tab === "clarifications" && <Card className="p-6 text-body-2 text-ink-muted">No clarifications raised on this case.</Card>}
        {tab === "documents" && <Card className="p-6 text-body-2 text-ink-muted">Supporting documents submitted with the grievance appear here.</Card>}
        {tab === "audit" && (
          <Card className="p-6">
            <ol className="relative ml-2 border-l border-line">
              {c.timeline.map((t, i) => (
                <li key={i} className="mb-5 ml-6 last:mb-0">
                  <span className="absolute -left-2.5 mt-1 h-5 w-5 rounded-full bg-approve text-white grid place-items-center"><Icon name="check_circle" size={12} /></span>
                  <p className="text-title-3 text-ink">{CASE_STATUS_META[t.status].label}</p>
                  <p className="text-body-3 text-ink-hint">{new Date(t.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}{t.byRole ? ` · ${t.byRole}` : ""}</p>
                  {t.note && <p className="mt-1 text-body-3 text-ink-muted">{t.note}</p>}
                </li>
              ))}
            </ol>
          </Card>
        )}
      </div>

      {/* Action confirm modal */}
      <Modal
        open={!!action}
        onClose={() => setAction(null)}
        size="sm"
        title={action?.label ?? ""}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAction(null)}>Cancel</Button>
            <Button onClick={confirmAction}>Confirm</Button>
          </div>
        }
      >
        <div className="space-y-4 text-body-2 text-ink-muted">
          <p>This will move <span className="font-mono font-semibold text-ink">{c.refNo}</span> to <span className="font-semibold text-ink">{action ? CASE_STATUS_META[action.to].label : ""}</span>.</p>
          <Field label="Note (optional)"><Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note for the audit log" /></Field>
        </div>
      </Modal>

      {/* Raise clarification modal */}
      <Modal
        open={clarifyOpen}
        onClose={() => setClarifyOpen(false)}
        size="sm"
        title="Raise Clarification"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setClarifyOpen(false)}>Cancel</Button>
            <Button onClick={() => { setClarifyOpen(false); setNote(""); }}>Send to Citizen</Button>
          </div>
        }
      >
        <div className="space-y-4 text-body-2 text-ink-muted">
          <p>Request additional information from the citizen. They will be notified and can respond via Track Status.</p>
          <Field label="Clarification requested" required><Textarea rows={3} placeholder="e.g. Please upload a copy of the FIR." /></Field>
        </div>
      </Modal>
    </div>
  );
}

function DetailBlock({ title, rows }: { title: string; rows: [string, string | undefined][] }) {
  return (
    <Card className="p-6">
      <p className="mb-4 text-label-3 uppercase text-ink-hint">{title}</p>
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map(([label, value]) => (
          <div key={label}>
            <div className="text-body-3 text-ink-hint">{label}</div>
            <div className="mt-0.5 text-body-2 text-ink">{value || "—"}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
