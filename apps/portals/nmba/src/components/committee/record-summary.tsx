"use client";

// Read-only summary of a committee record's fields + its notification file.

import { FileText, CircleCheck } from "lucide-react";
import type { CommitteeRecord } from "@/lib/committee/types";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-ink-hint">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{value || "—"}</dd>
    </div>
  );
}

/** Human-readable compliance reference, e.g. NAPDDR/MH/DISTRICT/3A7F2C. */
function referenceCode(record: CommitteeRecord): string {
  const words = record.state.split(/\s+/).filter(Boolean);
  const st = (
    words.length >= 2
      ? words.map((w) => w[0]).join("") // multi-word: initials (e.g. Uttar Pradesh → UP)
      : record.state.replace(/[^A-Za-z]/g, "").slice(0, 2) // single word: first two letters (Maharashtra → Ma)
  )
    .slice(0, 3)
    .toUpperCase() || "XX";
  const id = record.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase();
  return `NAPDDR/${st}/${record.tier}/${id}`;
}

export function RecordSummary({ record }: { record: CommitteeRecord }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-success/30 bg-success/5 px-3 py-2">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success-fg">
          <CircleCheck className="h-4 w-4" />
          Registered
        </span>
        <span className="font-mono text-xs text-ink-muted">Ref: {referenceCode(record)}</span>
      </div>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="State" value={record.state} />
        {record.district && <Field label="District" value={record.district} />}
        {record.block && <Field label="Block" value={record.block} />}
        <Field
          label={record.tier === "STATE" ? "Chief Secretary" : "Chairperson"}
          value={record.chiefSecretaryName ?? record.chairpersonName ?? "—"}
        />
        {record.chairpersonDesignation && (
          <Field label="Chairperson Designation" value={record.chairpersonDesignation} />
        )}
        {record.memberSecretaryName && (
          <Field label="Member Secretary" value={record.memberSecretaryName} />
        )}
        {record.memberSecretaryDesignation && (
          <Field label="Member Secretary Designation" value={record.memberSecretaryDesignation} />
        )}
        {record.nodalDepartment && <Field label="Nodal Department" value={record.nodalDepartment} />}
        <Field label="Date of Formation" value={record.formationDate} />
        <Field label="No. of Members" value={String(record.memberCount)} />
      </dl>
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
        <FileText className="h-4 w-4 shrink-0 text-navy" />
        <span className="truncate text-sm text-ink">{record.notification.name}</span>
        <span className="ml-auto shrink-0 text-xs text-ink-hint">
          {record.notification.blobUrl ? "Uploaded this session" : "On file · re-upload to view"}
        </span>
      </div>
    </div>
  );
}
