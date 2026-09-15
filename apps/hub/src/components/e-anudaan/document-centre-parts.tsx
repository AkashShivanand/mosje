"use client";

/**
 * Parts of the e-Anudaan Document Centre shared by the upload step, the review step, the
 * deficiency flow and the officer's review (docs/plans/2026-09-16-e-anudaan-document-centre.md §3.6).
 *
 * DS Audit: DocumentChecklist / DocumentChecklistGroup ➕ added · DocumentRow ➕ added ·
 * DocumentFindings ➕ added · DocumentHistorySheet ➕ added · SideSheet ✅ · DescriptionList ✅ ·
 * Alert ✅ · Button ✅ · Icon ✅ · FormCard ✅.
 */

import * as React from "react";
import Link from "next/link";
import {
  Alert,
  Button,
  DescriptionList,
  DocumentChecklist,
  DocumentChecklistGroup,
  DocumentFindings,
  DocumentRow,
  SideSheet,
  type DocumentRowState,
} from "@mosje/design-system";
import type { DocDef } from "@/lib/e-anudaan/form-schema";
import { expectedDocumentYear, withYearCheck, type DocVerdict, type UploadedDoc } from "@/lib/e-anudaan/doc-verification";
import {
  DOC_STATE_META,
  applicantFacts,
  compareFindings,
  fileSizeLabel,
  groupDocuments,
  settleChecks,
  summariseDocuments,
  type ApplicantFacts,
  type DocState,
} from "@/lib/e-anudaan/document-centre";

/** How long the prototype's checking service takes to answer. */
export const CHECK_DELAY_MS = 1600;

/** The model's eleven states onto the design system's ten: both refusals are one row state. */
export function rowStateOf(state: DocState): DocumentRowState {
  return state === "rejected-type" || state === "rejected-size" ? "rejected" : state;
}

/**
 * Settle every document still being checked, as the checking service would, and say what came
 * back through `announce`. Runs wherever the documents are shown — the upload step and the review
 * step — so a check started on one finishes on the other.
 */
export function useSettleChecks({
  documents,
  uploaded,
  setUploaded,
  values,
  held,
  announce,
}: {
  documents: readonly DocDef[];
  uploaded: Record<number, UploadedDoc>;
  setUploaded: React.Dispatch<React.SetStateAction<Record<number, UploadedDoc>>>;
  values: Record<string, string>;
  /** Documents the demo dock is holding in "Checking…". */
  held?: ReadonlySet<number>;
  announce?: (message: string) => void;
}) {
  const pending = documents.filter((d) => uploaded[d.n]?.verdict.state === "pending" && !held?.has(d.n)).map((d) => d.n);
  const key = pending.join(",");
  const fy = values.fld_financial_year;
  const facts = React.useMemo(() => applicantFacts(values), [values]);
  const latest = React.useRef(uploaded);
  // The checklist is recomputed on every render of the wizard; the timer must not restart with it,
  // or a check never settles while an upload's progress bar is re-rendering the page.
  const checklist = React.useRef(documents);
  React.useEffect(() => {
    latest.current = uploaded;
    checklist.current = documents;
  }, [uploaded, documents]);
  React.useEffect(() => {
    if (!key) return;
    const ns = new Set(key.split(",").map(Number));
    const all = checklist.current;
    const list = all.filter((d) => ns.has(d.n));
    const t = window.setTimeout(() => {
      // The check is a function of the file, so the verdicts announced are the verdicts applied.
      // Against the WHOLE checklist, so a file that is plainly another document is named as that one.
      const settled = withYearCheck(list, settleChecks(latest.current, all, fy, facts, ns), fy);
      setUploaded((prev) => settleChecks(prev, all, fy, facts, ns));
      const said = list
        .map((d) => settled[d.n]?.verdict)
        .map((v, i) => (v && v.state !== "pending" ? `${list[i]!.title}: ${DOC_STATE_META[v.state].words.toLowerCase()}` : null))
        .filter(Boolean);
      if (said.length) announce?.(said.join(". "));
    }, CHECK_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [key, fy, facts, setUploaded, announce]);
}

/** "What we found" for the applicant: every field compared with the application, every reason — no confidence. */
export function ApplicantFindings({ verdict, title, values }: { verdict: DocVerdict; title: string; values: Record<string, string> }) {
  const facts = applicantFacts(values);
  return <Findings verdict={verdict} title={title} facts={facts} applicationFy={values.fld_financial_year} />;
}

/** The same panel for an officer, with the confidence the applicant is not shown. */
export function Findings({
  verdict,
  title,
  facts,
  applicationFy,
  officer = false,
}: {
  verdict: DocVerdict;
  title: string;
  facts: ApplicantFacts;
  applicationFy?: string;
  officer?: boolean;
}) {
  const fields = compareFindings(verdict.extracted, facts, expectedDocumentYear(title, applicationFy)).map((f) => ({
    ...f,
    expected: f.expected,
  }));
  return (
    <DocumentFindings
      summary={verdict.summary}
      fields={fields}
      reasons={verdict.reasons ?? []}
      confidence={officer && verdict.confidence != null ? { value: verdict.confidence, threshold: 90 } : undefined}
      expectedLabel={officer ? "The application says" : "Your application says"}
    />
  );
}

/** The file an applicant opens from a row. Bytes exist only for a file chosen in this sitting. */
export function DocumentViewSheet({
  open,
  onClose,
  title,
  file,
  previewUrl,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  file?: { name: string; sizeKb: number; uploadedOn?: string };
  previewUrl?: string;
}) {
  const isImage = /\.(png|jpe?g)$/i.test(file?.name ?? "");
  return (
    <SideSheet open={open} onClose={onClose} size="lg" title={title} footer={<Button appearance="outlined" onClick={onClose}>Close</Button>}>
      {file ? (
        <div className="space-y-5">
          <DescriptionList
            columns={2}
            size="sm"
            items={[
              { term: "File Name", value: file.name },
              { term: "Size", value: fileSizeLabel(file.sizeKb) },
              { term: "Uploaded On", value: file.uploadedOn || "Not recorded" },
            ]}
          />
          {previewUrl ? (
            isImage ? (
              // eslint-disable-next-line @next/next/no-img-element -- a blob: URL from the applicant's own device
              <img src={previewUrl} alt={`${title}, as uploaded`} className="w-full rounded-md border border-line" />
            ) : (
              <iframe title={`Preview of ${title}`} src={previewUrl} className="h-[32rem] w-full rounded-md border border-line" />
            )
          ) : (
            <Alert status="info" title="Preview Not Available">
              The file is saved with the application. It can be previewed here only in the session it was chosen in.
            </Alert>
          )}
        </div>
      ) : (
        <p className="text-body-2 text-ink-muted">No file has been uploaded for this document.</p>
      )}
    </SideSheet>
  );
}

/**
 * The Review & Submit step's documents: read-only rows with View and status, in the upload
 * step's groups, and what still stops Submit said above them (spec §3.6).
 */
export function ReviewDocuments({
  schemeCode,
  documents,
  uploaded,
  setUploaded,
  values,
  onEditDocuments,
}: {
  schemeCode: string;
  documents: readonly DocDef[];
  uploaded: Record<number, UploadedDoc>;
  setUploaded: React.Dispatch<React.SetStateAction<Record<number, UploadedDoc>>>;
  values: Record<string, string>;
  onEditDocuments?: () => void;
}) {
  const [polite, setPolite] = React.useState("");
  const [viewing, setViewing] = React.useState<DocDef | null>(null);
  useSettleChecks({ documents, uploaded, setUploaded, values, announce: setPolite });
  const checked = withYearCheck(documents, uploaded, values.fld_financial_year);
  const summary = summariseDocuments(documents, checked);
  const checking = summary.submitBlockers.filter((b) => b.state === "checking").length;
  const needing = summary.submitBlockers.length - checking;
  const position = new Map(groupDocuments(schemeCode, documents).flatMap((g) => g.docs).map((d, i) => [d.n, i + 1]));

  return (
    <>
      {summary.submitBlockers.length > 0 && (
        <Alert
          status={needing > 0 ? "warning" : "info"}
          title={
            needing > 0
              ? `${needing} Document${needing === 1 ? " Needs" : "s Need"} Attention Before You Can Submit`
              : `${checking} Document${checking === 1 ? " Is" : "s Are"} Still Being Checked`
          }
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-body-2">
              {needing > 0
                ? summary.submitBlockers.filter((b) => b.state !== "checking").map((b) => b.title).join(" · ")
                : "Submit is available as soon as the check finishes. You can keep reading the application."}
            </p>
            {needing > 0 && onEditDocuments && (
              <Button size="sm" onClick={onEditDocuments}>
                Go to Upload Documents
              </Button>
            )}
          </div>
        </Alert>
      )}
      <DocumentChecklist ready={summary.readyRequired} required={summary.required} politeMessage={polite} visibleCount={documents.length}>
        {groupDocuments(schemeCode, documents).map((g) => (
          <DocumentChecklistGroup key={g.id} title={g.title}>
            {g.docs.map((d) => {
              const up = checked[d.n];
              const state = summary.states[d.n]!;
              return (
                <DocumentRow
                  linkAs={Link}
                  key={d.n}
                  number={position.get(d.n)}
                  title={d.title}
                  required={!d.optional}
                  state={rowStateOf(state)}
                  statusLabel={DOC_STATE_META[state].words}
                  file={up ? { name: up.fileName, size: fileSizeLabel(up.sizeKb), date: up.uploadedOn } : undefined}
                  action={
                    up ? (
                      <Button appearance="text" size="sm" onClick={() => setViewing(d)} aria-label={`View ${d.title}`}>
                        View
                      </Button>
                    ) : undefined
                  }
                />
              );
            })}
          </DocumentChecklistGroup>
        ))}
      </DocumentChecklist>
      <DocumentViewSheet
        open={viewing != null}
        onClose={() => setViewing(null)}
        title={viewing?.title ?? ""}
        file={viewing && checked[viewing.n] ? { name: checked[viewing.n]!.fileName, sizeKb: checked[viewing.n]!.sizeKb, uploadedOn: checked[viewing.n]!.uploadedOn } : undefined}
      />
    </>
  );
}
