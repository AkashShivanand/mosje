"use client";

/**
 * The upload step's documents, drawn in the form-wizard visual language
 * (docs/design-system/form-wizard-visual-language.md §7): mandatory and optional documents
 * as two sub-sections of document tiles, two to a row.
 *
 * DS Audit: FormCard ✅ · DocumentTiles / DocumentTile ✅ (added for this language) · Alert ✅ ·
 * Badge ✅ · Button ✅ · Icon ✅.
 *
 * An upload is "Uploaded", never "Verified": the automated check's findings are shown only
 * where they ask something of the applicant (the document may be the wrong one, or not valid).
 * A clean check says so in one line. Verification is the officer's.
 */

import * as React from "react";
import { Alert, Button, DocumentTile, DocumentTiles, FormCard, Icon } from "@mosje/design-system";
import type { DocDef } from "@/lib/e-anudaan/form-schema";
import {
  DEMO_VERDICTS,
  demoVerdictFor,
  verdictHeadline,
  withYearCheck,
  type UploadedDoc,
} from "@/lib/e-anudaan/doc-verification";
import { formatDate } from "@/lib/e-anudaan/format";

export function DocumentsChecklist({
  documents,
  uploaded,
  applicationFy,
  onChange,
  accept = "PDF, JPG or PNG",
  maxSize = "5 MB",
}: {
  documents: readonly DocDef[];
  uploaded: Record<number, UploadedDoc>;
  /** The application's financial year — what each document's own year is checked against. */
  applicationFy?: string;
  onChange: (next: Record<number, UploadedDoc>) => void;
  accept?: string;
  maxSize?: string;
}) {
  const checked = withYearCheck(documents, uploaded, applicationFy);

  const upload = (d: DocDef) => {
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

  const remove = (d: DocDef) => {
    const next = { ...uploaded };
    delete next[d.n];
    onChange(next);
  };

  // The demo's automated check settles a moment after an upload.
  React.useEffect(() => {
    const pending = documents.filter((d) => uploaded[d.n]?.verdict.state === "pending");
    if (pending.length === 0) return;
    const t = window.setTimeout(() => {
      const next = { ...uploaded };
      for (const d of pending) next[d.n] = { ...next[d.n]!, verdict: demoVerdictFor("verified", d.title, applicationFy) };
      onChange(next);
    }, 1800);
    return () => window.clearTimeout(t);
  }, [documents, uploaded, onChange, applicationFy]);

  const tile = (d: DocDef) => {
    const up = checked[d.n];
    const state = up?.verdict.state;
    const flagged = state === "review" || state === "invalid";
    const hint = [d.note, d.description].filter(Boolean).join(" ");
    return (
      <DocumentTile
        key={d.n}
        title={d.title}
        required={!d.optional}
        state={!up ? "upcoming" : state === "invalid" ? "invalid" : "uploaded"}
        meta={
          up
            ? `${up.fileName} · ${up.sizeKb} KB${state === "pending" ? " · Checking…" : state === "verified" ? " · No problems found" : ""}`
            : hint || `${accept}, up to ${maxSize}.`
        }
        actions={
          up ? (
            <>
              <Button appearance="outlined" size="sm" onClick={() => upload(d)} aria-label={`Change ${d.title}`}>
                Change
              </Button>
              <Button appearance="text" size="sm" onClick={() => remove(d)} aria-label={`Remove ${d.title}`}>
                <Icon name="delete" size={16} aria-hidden />
              </Button>
            </>
          ) : (
            <Button appearance="outlined" size="sm" nowrap onClick={() => upload(d)} aria-label={`Browse file for ${d.title}`}>
              Browse File
            </Button>
          )
        }
      >
        {up && flagged ? (
          <Alert status={state === "invalid" ? "error" : "warning"} title={verdictHeadline(up.verdict)}>
            {up.verdict.summary && <p>{up.verdict.summary}</p>}
            {up.verdict.reasons && (
              <ul className="mt-1.5 list-disc space-y-1 pl-5">
                {up.verdict.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            )}
          </Alert>
        ) : null}
      </DocumentTile>
    );
  };

  const mandatory = documents.filter((d) => !d.optional);
  const optional = documents.filter((d) => d.optional);

  return (
    <>
      <FormCard title="Mandatory Documents">
        <DocumentTiles aria-label="Mandatory documents">{mandatory.map(tile)}</DocumentTiles>
      </FormCard>
      {optional.length > 0 && (
        <FormCard title="Optional Documents">
          <DocumentTiles aria-label="Optional documents">{optional.map(tile)}</DocumentTiles>
        </FormCard>
      )}
    </>
  );
}
