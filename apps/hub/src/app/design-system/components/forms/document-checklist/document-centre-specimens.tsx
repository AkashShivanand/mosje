"use client";

/**
 * Specimens for the Document Centre components — DocumentChecklist, DocumentRow,
 * DocumentFindings, DocumentPlacementTray and DocumentHistorySheet. Illustrative data only.
 */

import * as React from "react";
import Link from "next/link";
import {
  Button,
  DocumentChecklist,
  DocumentChecklistGroup,
  DocumentFindings,
  DocumentHistorySheet,
  DocumentPlacementTray,
  DocumentRow,
  SegmentedControl,
  type DocumentPlacement,
  type DocumentRowState,
} from "@mosje/design-system";

const frame: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--sa-stack-24)",
  padding: "var(--sa-padding-24)",
  background: "var(--sa-bg-neutral-base)",
  border: "var(--sa-stroke-1) solid var(--sa-border-neutral-subtle)",
  borderRadius: "var(--sa-shape-8)",
};

const FINDINGS = (
  <DocumentFindings
    summary="This Registration Certificate is for Illustrative Other Welfare Society, not Sankalp Seva Sansthan."
    fields={[
      { label: "Organisation Name", found: "Illustrative Other Welfare Society", expected: "Sankalp Seva Sansthan", matches: false },
      { label: "Registration Number", found: "51-54", expected: "51-54", matches: true },
    ]}
    reasons={[
      "The organisation on this document is Illustrative Other Welfare Society. Your application is for Sankalp Seva Sansthan.",
      "Upload the Registration Certificate issued to Sankalp Seva Sansthan.",
    ]}
  />
);

const ROWS: { state: DocumentRowState; title: string; file?: string; reason?: string; action?: string }[] = [
  { state: "missing", title: "List of Managing Committee Members", action: "Upload" },
  { state: "optional", title: "Staff Monitoring Sheet", action: "Upload" },
  { state: "uploading", title: "Audited Accounts", file: "audited-accounts.pdf", action: "Cancel" },
  { state: "failed", title: "Agreement Bond / PSR on Stamp Paper", file: "bond.pdf", reason: "The connection dropped before the file arrived. Check your connection and try again.", action: "Try Again" },
  { state: "rejected", title: "Rent Agreement", file: "rent-agreement.pdf", reason: "This file is 7.2 MB. The limit is 5 MB.", action: "Choose Another File" },
  { state: "checking", title: "Annual Report — Previous Financial Year", file: "annual-report-2025-26.pdf" },
  { state: "verified", title: "Bank Authorisation Letter", file: "bank-letter.pdf" },
  { state: "review", title: "List of Beneficiaries — Previous Year", file: "beneficiaries-scan.pdf", reason: "Some of the text is too faint to read, so the details could not be confirmed automatically." },
  { state: "invalid", title: "Registration Certificate", file: "registration-other-org.pdf", reason: "The organisation on this document is Illustrative Other Welfare Society. Your application is for Sankalp Seva Sansthan.", action: "Replace" },
  { state: "unavailable", title: "Budget Estimates — Current Year", file: "budget-2026-27.pdf" },
];

/** Every state of a row, in the order of the spec's table. */
export function DocumentRowStates(): React.JSX.Element {
  return (
    <div style={frame}>
      <DocumentChecklistGroup title="Every State">
        {ROWS.map((r, i) => (
          <DocumentRow
            key={r.state}
            number={i + 1}
            title={r.title}
            required={r.state !== "optional"}
            state={r.state}
            progress={r.state === "uploading" ? 64 : undefined}
            file={r.file ? { name: r.file, size: "812 KB", date: r.state === "uploading" ? undefined : "14 Sep 2026" } : undefined}
            reason={r.reason}
            findings={r.state === "invalid" || r.state === "review" ? FINDINGS : undefined}
            action={
              r.action ? (
                <Button size="sm" nowrap appearance={r.action === "Cancel" ? "text" : "outlined"} aria-label={`${r.action}: ${r.title}`}>
                  {r.action}
                </Button>
              ) : undefined
            }
            menu={
              r.file && r.state !== "uploading"
                ? {
                    items: [
                      { id: "view", label: "View", icon: "visibility" },
                      { id: "history", label: "Upload History", icon: "history" },
                    ],
                    onSelect: () => undefined,
                  }
                : undefined
            }
          />
        ))}
      </DocumentChecklistGroup>
    </div>
  );
}

/** The checklist with its header, chips, drop zone, a raised gate and two groups. */
export function DocumentChecklistSpecimen(): React.JSX.Element {
  const [filter, setFilter] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState(false);
  const [rev, setRev] = React.useState(0);
  const [dropped, setDropped] = React.useState<string>("");
  const rows = [
    { n: 1, title: "Registration Certificate", state: "verified" as const, group: "identity", bucket: "ready" },
    { n: 2, title: "PAN of the Organisation", state: "invalid" as const, group: "identity", bucket: "attention" },
    { n: 6, title: "Budget Estimates — Current Year", state: "checking" as const, group: "financial", bucket: "checking" },
    { n: 7, title: "Audited Accounts", state: "missing" as const, group: "financial", bucket: "attention" },
  ];
  const shown = rows.filter((r) => !filter || r.bucket === filter);
  const count = (b: string) => rows.filter((r) => r.bucket === b).length;
  return (
    <div style={frame}>
      <DocumentChecklist
        formats="PDF, JPG or PNG · up to 5 MB each"
        ready={1}
        required={4}
        filters={[
          { id: "attention", label: "Needs your attention", count: count("attention"), tone: "danger" },
          { id: "checking", label: "Being checked", count: count("checking") },
          { id: "ready", label: "Ready", count: count("ready") },
        ]}
        activeFilter={filter}
        onFilterChange={setFilter}
        onFiles={(files) => setDropped(`${files.length} file${files.length === 1 ? "" : "s"} received.`)}
        accept="application/pdf,image/jpeg,image/png"
        errors={errors ? [
          { fieldId: "spec-doc-7-action", message: "Upload the Audited Accounts" },
          { fieldId: "spec-doc-2-action", message: "The PAN of the Organisation doesn't match what was asked for — replace it" },
        ] : []}
        errorTitle="2 Documents Need Your Attention Before You Continue"
        errorsRevision={rev}
        politeMessage={dropped}
        visibleCount={shown.length}
      >
        {["identity", "financial"].map((g) => {
          const list = shown.filter((r) => r.group === g);
          if (!list.length) return null;
          return (
            <DocumentChecklistGroup key={g} title={g === "identity" ? "Registration & Identity" : "Financial"}>
              {list.map((r) => (
                <DocumentRow
                  key={r.n}
                  number={r.n}
                  title={r.title}
                  required
                  state={r.state}
                  file={r.state === "missing" ? undefined : { name: `${r.title.toLowerCase().replace(/[^a-z]+/g, "-")}.pdf`, size: "240 KB", date: "14 Sep 2026" }}
                  reason={r.state === "invalid" ? "This looks like the Registration Certificate, not the PAN of the Organisation." : undefined}
                  action={
                    r.state === "missing" || r.state === "invalid" ? (
                      <Button id={`spec-doc-${r.n}-action`} size="sm" appearance="outlined" aria-label={`${r.state === "missing" ? "Upload" : "Replace"}: ${r.title}`}>
                        {r.state === "missing" ? "Upload" : "Replace"}
                      </Button>
                    ) : undefined
                  }
                />
              ))}
            </DocumentChecklistGroup>
          );
        })}
      </DocumentChecklist>
      <div>
        <Button
          appearance="outlined"
          onClick={() => {
            setErrors(true);
            setRev((r) => r + 1);
            setFilter("attention");
          }}
        >
          Press Continue
        </Button>
      </div>
    </div>
  );
}

/**
 * An officer's review list: compact rows with the verdict in the line, a folded row an earlier
 * grade verified, and the bulk verdict for the documents the automatic check found nothing wrong
 * with. Illustrative data only.
 */
export function DocumentOfficerReviewSpecimen(): React.JSX.Element {
  type Verdict = "pending" | "verified" | "correction";
  const DOCS = [
    { n: 1, title: "Registration Certificate (Societies Registration Act 1860 / Charitable Trust)", file: "Registration_Certificate_of_the_Organisation.pdf", check: "verified" as const },
    { n: 2, title: "PAN Card of the Organisation", file: "PAN_Card_of_the_Organisation.pdf", check: "verified" as const },
    { n: 3, title: "Audited Accounts — Previous Financial Year", file: "Audited_Accounts_2025-26.pdf", check: "invalid" as const },
    { n: 4, title: "Annual Report — Previous Financial Year", file: "Annual_Report_2025-26.pdf", check: "verified" as const },
    { n: 5, title: "Bank Authorisation Letter", file: "Bank_Authorisation_Letter.pdf", check: "verified" as const },
  ];
  const [verdicts, setVerdicts] = React.useState<Record<number, Verdict>>({ 1: "verified" });
  const [open, setOpen] = React.useState<Record<number, boolean>>({});
  const remaining = DOCS.filter((d) => (verdicts[d.n] ?? "pending") === "pending" && d.check === "verified");
  return (
    <div style={frame}>
      <DocumentChecklist
        ready={DOCS.filter((d) => (verdicts[d.n] ?? "pending") !== "pending").length}
        required={DOCS.length}
        progressLabel={`${DOCS.filter((d) => (verdicts[d.n] ?? "pending") !== "pending").length} of ${DOCS.length} required documents examined`}
        visibleCount={DOCS.length}
        bulkAction={{
          label: "Mark All Remaining as Verified",
          count: remaining.length,
          description: "Documents not yet examined where the automatic check found nothing wrong.",
          confirmDescription: `A verdict of Verified will be recorded in your name against each of the ${remaining.length} documents. The automatic check flagged none of them. Each verdict can still be changed before the file is forwarded.`,
          onConfirm: () => setVerdicts((v) => ({ ...v, ...Object.fromEntries(remaining.map((d) => [d.n, "verified" as Verdict])) })),
        }}
      >
        <DocumentChecklistGroup title="Required Documents" hideRequiredMarks>
          {DOCS.map((d) => {
            const verdict = verdicts[d.n] ?? "pending";
            const settled = verdict === "verified" && d.n === 1;
            return (
              <DocumentRow
                key={d.n}
                density="compact"
                number={d.n}
                title={d.title}
                required
                state={d.check}
                statusLabel={d.check === "invalid" ? "Automatic check · Does not match" : "Automatic check · Looks right"}
                file={{ name: d.file, size: "212 KB", date: "14 Sep 2026" }}
                collapsible={settled}
                expanded={!!open[d.n]}
                onExpandedChange={(o) => setOpen((x) => ({ ...x, [d.n]: o }))}
                summary="Verified by the Assistant Section Officer, 12 Sep 2026"
                aside={
                  <SegmentedControl<Verdict>
                    ariaLabel={`Verdict on ${d.title}`}
                    value={verdict}
                    onChange={(v) => setVerdicts((x) => ({ ...x, [d.n]: v }))}
                    options={[
                      { value: "verified", label: "Verified" },
                      { value: "correction", label: "Needs Correction" },
                    ]}
                  />
                }
                action={
                  <Button size="sm" appearance="outlined" nowrap aria-label={`View ${d.title}`}>
                    View
                  </Button>
                }
              />
            );
          })}
        </DocumentChecklistGroup>
      </DocumentChecklist>
    </div>
  );
}

/** The panel on its own, with a mismatch, a match and a field with nothing to compare. */
export function DocumentFindingsSpecimen(): React.JSX.Element {
  return (
    <div style={frame}>
      {FINDINGS}
      <DocumentFindings
        summary="Appears to be the List of Beneficiaries for FY 2025-26, but some particulars could not be read with confidence."
        fields={[
          { label: "Financial Year", found: "2025-26", expected: "2025-26", matches: true },
          { label: "Beneficiary Count", found: "86" },
        ]}
        reasons={["Some of the text is too faint to read, so the details could not be confirmed automatically."]}
        confidence={{ value: 78, threshold: 90 }}
        expectedLabel="The application says"
      />
      <DocumentFindings />
    </div>
  );
}

/** A drop of five files: placed, placed over an earlier file, unrecognised, and refused. */
export function DocumentPlacementTraySpecimen(): React.JSX.Element {
  const [items, setItems] = React.useState<DocumentPlacement[]>([
    { id: "a", fileName: "budget-2026-27.pdf", size: "400 KB", targetId: "6" },
    { id: "b", fileName: "annual-report-2025-26.pdf", size: "900 KB", targetId: "3", replaces: "annual_2025.pdf" },
    { id: "c", fileName: "scan0043.pdf", size: "300 KB", targetId: null },
    { id: "d", fileName: "rent-agreement.pdf", size: "7.2 MB", targetId: null, rejected: "This file is 7.2 MB. The limit is 5 MB." },
  ]);
  const [done, setDone] = React.useState(false);
  return (
    <div style={frame}>
      {done ? (
        <Button appearance="outlined" onClick={() => setDone(false)}>
          Show the Tray Again
        </Button>
      ) : (
        <DocumentPlacementTray
          items={items}
          options={[
            { id: "1", label: "1. Registration Certificate", filled: true },
            { id: "3", label: "3. Annual Report — Previous Financial Year", filled: true },
            { id: "5", label: "5. List of Managing Committee Members" },
            { id: "6", label: "6. Budget Estimates — Current Year" },
          ]}
          onChange={(id, targetId) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, targetId, replaces: undefined } : i)))}
          onRemove={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
          onDone={() => setDone(true)}
        />
      )}
    </div>
  );
}

/** A document replaced twice, opened from a button. */
export function DocumentHistorySheetSpecimen(): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={frame}>
      <div>
        <Button onClick={() => setOpen(true)}>Open Upload History</Button>
      </div>
      <DocumentHistorySheet
        open={open}
        onClose={() => setOpen(false)}
        title="Upload History — Budget Estimates — Current Year"
        linkAs={Link}
        entries={[
          { id: "3", fileName: "budget-2026-27-v3.pdf", size: "95 KB", date: "16 Sep 2026", current: true, status: "Looks right", onView: () => undefined },
          { id: "2", fileName: "budget-2026-27-v2.pdf", size: "90 KB", date: "16 Sep 2026", status: "Doesn't match", note: "Replaced 16 Sep 2026" },
          { id: "1", fileName: "budget-2026-27.pdf", size: "6 KB", date: "14 Sep 2026", status: "Doesn't match", note: "Replaced after the Ministry's query" },
        ]}
      />
    </div>
  );
}
