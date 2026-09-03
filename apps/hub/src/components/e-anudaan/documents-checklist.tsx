"use client";

/**
 * The upload step's Documents Checklist.
 *
 * DS Audit: Badge ✅ existing · Button ✅ · Icon ✅ · Alert ✅ — nothing new needed.
 *
 * Every row reproduces the live anatomy: number + title, the conditional note, the empty
 * dropzone ("Click to upload…"), and once filled the filename + size, the AI verdict headline,
 * its summary, its bullet reasons, the extracted key/values, the confidence pill, the
 * "Uploaded" status and the View / Replace / Re-verify actions.
 */

import * as React from "react";
import { Badge, Button, Icon, type BadgeStatus } from "@mosje/design-system";
import type { DocDef } from "@/lib/e-anudaan/form-schema";
import {
  DEMO_VERDICTS,
  demoVerdictFor,
  uploadProgress,
  VERDICT_GLYPH,
  verdictHeadline,
  verdictPill,
  type UploadedDoc,
  type VerdictState,
} from "@/lib/e-anudaan/doc-verification";
import { formatDate } from "@/lib/e-anudaan/format";

const TONE: Record<VerdictState, { text: string; border: string; bg: string }> = {
  pending: { text: "text-ink-muted", border: "border-line", bg: "bg-surface-muted" },
  verified: { text: "text-status-success", border: "border-status-success/30", bg: "bg-status-success/5" },
  review: { text: "text-status-warning", border: "border-status-warning/30", bg: "bg-status-warning/5" },
  invalid: { text: "text-status-error", border: "border-status-error/30", bg: "bg-status-error/5" },
};

const BADGE_STATUS: Record<VerdictState, BadgeStatus> = {
  pending: "info",
  verified: "success",
  review: "warning",
  invalid: "danger",
};

export function DocumentsChecklist({
  documents,
  note,
  uploaded,
  onChange,
  accept = "PDF / JPG / PNG",
}: {
  documents: readonly DocDef[];
  note: string;
  uploaded: Record<number, UploadedDoc>;
  onChange: (next: Record<number, UploadedDoc>) => void;
  accept?: string;
}) {
  // Both halves count the same set — see uploadProgress. Counting every upload against a
  // denominator of only the mandatory documents is what produces "10 / 7 uploaded".
  const { done: count, total: mandatory } = uploadProgress(documents, uploaded);

  const upload = (d: DocDef) => {
    // Demo behaviour: a fresh upload starts in "Verifying…", then settles as the live one does.
    onChange({
      ...uploaded,
      [d.n]: {
        fileName: `${d.title.replace(/[^A-Za-z0-9]+/g, "_").slice(0, 40)}.pdf`,
        sizeKb: 512,
        uploadedOn: formatDate(new Date()),
        verdict: DEMO_VERDICTS.pending,
      },
    });
  };

  const reverify = (d: DocDef) => {
    const existing = uploaded[d.n];
    if (!existing) return;
    const order: VerdictState[] = ["pending", "verified", "review", "invalid"];
    const nextState = order[(order.indexOf(existing.verdict.state) + 1) % order.length]!;
    onChange({ ...uploaded, [d.n]: { ...existing, verdict: demoVerdictFor(nextState, d.title) } });
  };

  return (
    <section className="space-y-4 rounded-xl border border-line bg-surface p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
        <div>
          <h2 className="text-base font-bold text-ink">Documents Checklist</h2>
          <p className="mt-1 text-sm text-ink-muted">{note}</p>
        </div>
        <Badge status={count >= mandatory ? "success" : "info"}>
          {count} / {mandatory} uploaded
        </Badge>
      </div>

      <ol className="space-y-3">
        {documents.map((d) => {
          const up = uploaded[d.n];
          const tone = up ? TONE[up.verdict.state] : TONE.pending;
          const pill = up ? verdictPill(up.verdict) : null;

          return (
            <li key={d.n} className="rounded-lg border border-line p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-semibold text-ink">
                    {d.n}. {d.title}
                    {!d.optional && <span className="text-status-error"> *</span>}
                    {d.optional && <span className="ml-2 text-xs font-normal text-ink-hint">OPTIONAL</span>}
                  </p>
                  {d.note && <p className="text-xs italic text-ink-muted">{d.note}</p>}
                  {d.description && <p className="text-xs text-ink-muted">{d.description}</p>}
                  {up && (
                    <p className="font-mono text-xs text-ink-muted">
                      {up.fileName} · {up.sizeKb} KB
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {up ? (
                    <>
                      {pill && <Badge status={BADGE_STATUS[up.verdict.state]}>{pill}</Badge>}
                      <Badge status="info">Uploaded</Badge>
                      <Button appearance="text" size="sm">
                        View
                      </Button>
                      <Button appearance="text" size="sm" onClick={() => upload(d)}>
                        Replace
                      </Button>
                      <Button appearance="text" size="sm" onClick={() => reverify(d)}>
                        Re-verify
                      </Button>
                    </>
                  ) : (
                    <Button appearance="outlined" size="sm" onClick={() => upload(d)}>
                      <Icon name="upload_file" size={16} aria-hidden /> Click to upload {accept}
                    </Button>
                  )}
                </div>
              </div>

              {up && (
                <div className={`mt-3 rounded-md border ${tone.border} ${tone.bg} p-3`}>
                  <p className={`flex items-center gap-1.5 text-sm font-semibold ${tone.text}`}>
                    <Icon name={VERDICT_GLYPH[up.verdict.state]} size={16} aria-hidden />
                    {verdictHeadline(up.verdict)}
                  </p>
                  {up.verdict.summary && <p className="mt-1.5 text-xs text-ink">{up.verdict.summary}</p>}
                  {up.verdict.reasons && (
                    <ul className="mt-1.5 list-disc space-y-1 pl-5 text-xs text-ink-muted">
                      {up.verdict.reasons.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  )}
                  {up.verdict.extracted && (
                    <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs">
                      {Object.entries(up.verdict.extracted).map(([k, v]) => (
                        <div key={k} className="flex gap-1.5">
                          <dt className="text-ink-muted">{k}:</dt>
                          <dd className="font-medium text-ink">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
