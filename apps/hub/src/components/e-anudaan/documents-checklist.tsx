"use client";

/**
 * The Upload Documents step — the e-Anudaan Document Centre (docs/plans/2026-09-16-e-anudaan-document-centre.md).
 *
 * DS Audit: DocumentChecklist / DocumentChecklistGroup ➕ added · DocumentRow ➕ added ·
 * DocumentPlacementTray ➕ added · DocumentHistorySheet ➕ added · DocumentFindings ➕ added ·
 * ErrorSummary ✅ (inside DocumentChecklist) · Chip ✅ · Button ✅ · Menu ✅ · SideSheet ✅.
 *
 * What it replaces, and why: one tall card per document made a verified file and a rejected one
 * the same size, so the document that needed action was found by scrolling past ten that did not;
 * four pills competed on every card; batch upload placed files silently; Continue was a dead
 * button; Replace destroyed the earlier file. Now: one compact row per document, height following
 * need; progress counted as documents READY; three filter chips for the three questions a clerk
 * has; a tray that shows where every dropped file went; an enabled Continue that explains itself;
 * and history for every document.
 *
 * The step's Continue is the wizard's button. The wizard asks this component through the ref
 * (`tryContinue`) and moves on only when it answers true.
 */

import * as React from "react";
import Link from "next/link";
import {
  Button,
  DocumentChecklist,
  DocumentChecklistGroup,
  DocumentHistorySheet,
  DocumentPlacementTray,
  DocumentRow,
} from "@mosje/design-system";
import type { DocDef } from "@/lib/e-anudaan/form-schema";
import { demoVerdictFor, withYearCheck, type UploadedDoc } from "@/lib/e-anudaan/doc-verification";
import {
  DEMO_DOC_STATE_EVENT,
  DOC_LIST_EVENT,
  DOC_STATE_META,
  acceptFromNote,
  blockerTitle,
  commitUpload,
  fileSizeLabel,
  groupDocuments,
  historyEntries,
  orderForAttention,
  placeFiles,
  rejectionOf,
  requestCheck,
  rowReason,
  seedOf,
  summariseDocuments,
  withdrawUpload,
  type DemoDocStateDetail,
  type DocBucket,
  type DocListDetail,
  type DocState,
  type PlacementItem,
  type UploadAttempt,
} from "@/lib/e-anudaan/document-centre";
import { ApplicantFindings, DocumentViewSheet, rowStateOf, useSettleChecks } from "./document-centre-parts";

export interface DocumentsChecklistHandle {
  /** Whether the step may be left. When it may not, the ErrorSummary is raised and focused. */
  tryContinue: () => boolean;
}

const FILTERS: { id: DocBucket; label: string }[] = [
  { id: "attention", label: "Needs your attention" },
  { id: "checking", label: "Being checked" },
  { id: "ready", label: "Ready" },
  { id: "optional", label: "Optional" },
];

/** How often an upload's progress moves, and the connection-drop keyword the demo uses. */
const TICK_MS = 140;
const DROPS_CONNECTION = /network|connection|drop[-_]?out|flaky/i;

const kbOf = (file: File) => Math.max(1, Math.round(file.size / 1024));
const rowId = (n: number) => `doc-${n}`;
const actionId = (n: number) => `doc-${n}-action`;

export const DocumentsChecklist = React.forwardRef<
  DocumentsChecklistHandle,
  {
    schemeCode: string;
    /** The scheme's format line, e.g. "PDF / JPG / PNG · Max 5 MB per file". */
    documentsNote: string;
    documents: readonly DocDef[];
    uploaded: Record<number, UploadedDoc>;
    /** The application's answers — the financial year and the facts each document is compared with. */
    values: Record<string, string>;
    onChange: React.Dispatch<React.SetStateAction<Record<number, UploadedDoc>>>;
  }
>(function DocumentsChecklist({ schemeCode, documentsNote, documents, uploaded, values, onChange }, ref) {
  const rule = React.useMemo(() => acceptFromNote(documentsNote), [documentsNote]);
  const fy = values.fld_financial_year;

  const [attempts, setAttempts] = React.useState<Record<number, UploadAttempt>>({});
  const [filter, setFilter] = React.useState<DocBucket | null>(null);
  const [showErrors, setShowErrors] = React.useState(false);
  const [revision, setRevision] = React.useState(0);
  const [tray, setTray] = React.useState<PlacementItem[] | null>(null);
  const [historyOf, setHistoryOf] = React.useState<DocDef | null>(null);
  const [viewing, setViewing] = React.useState<DocDef | null>(null);
  const [findingsOpen, setFindingsOpen] = React.useState<Record<number, boolean>>({});
  const [polite, setPolite] = React.useState("");
  const [assertive, setAssertive] = React.useState("");
  const [held, setHeld] = React.useState<ReadonlySet<number>>(() => new Set());
  const fileInput = React.useRef<HTMLInputElement>(null);
  const target = React.useRef<number | null>(null);
  /** Object URLs for files chosen in this sitting, so View can show them. */
  const previews = React.useRef(new Map<string, string>());
  /** The browser's File for each attempt, kept so a retry resends the same bytes. */
  const files = React.useRef(new Map<number, File | null>());

  const checked = withYearCheck(documents, uploaded, fy);
  const summary = summariseDocuments(documents, checked, attempts);
  // Numbered as drawn, group by group — SHRESHTA's groups put document 15 between 9 and 18, and a
  // column of numbers out of order reads as a mistake.
  const position = new Map(groupDocuments(schemeCode, documents).flatMap((g) => g.docs).map((d, i) => [d.n, i + 1]));

  /**
   * The order rows are drawn in: needing attention first. A snapshot, refreshed when the
   * applicant opens the step, drops files or presses Continue — never on a verdict arriving,
   * which would move the row being worked on out from under the pointer.
   */
  const [order, setOrder] = React.useState<Record<number, DocState>>(() => summary.states);
  const refreshOrder = () => setOrder(summary.states);

  useSettleChecks({ documents, uploaded, setUploaded: onChange, values, held, announce: setPolite });

  React.useEffect(() => {
    const map = previews.current;
    return () => map.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  /* ── Uploads ──────────────────────────────────────────────────────────── */

  const startUpload = React.useCallback(
    (n: number, file: { name: string; sizeKb: number }, blob?: File | null, tries = 0) => {
      const rejected = rejectionOf(file, rule);
      files.current.set(n, blob ?? null);
      setAttempts((prev) => ({ ...prev, [n]: { fileName: file.name, sizeKb: file.sizeKb, phase: rejected ?? "uploading", progress: 0, tries } }));
      if (rejected) {
        const title = documents.find((d) => d.n === n)?.title ?? "The document";
        setAssertive(`${title}: ${file.name} can't be uploaded. ${rejected === "rejected-size" ? `The limit is ${fileSizeLabel(rule.maxKb)}.` : `Only ${rule.typesLabel} files can be uploaded.`}`);
      }
      if (blob && !rejected) {
        const url = URL.createObjectURL(blob);
        previews.current.set(`${n}|${file.name}`, url);
      }
    },
    [rule, documents],
  );

  // Progress, as the network would report it. A file whose name says the connection drops fails
  // on its first try, so the failure state can be rehearsed; its retry arrives.
  const attemptsRef = React.useRef(attempts);
  React.useEffect(() => {
    attemptsRef.current = attempts;
  }, [attempts]);
  const uploading = Object.entries(attempts).some(([n, a]) => a.phase === "uploading" && !held.has(Number(n)));
  React.useEffect(() => {
    if (!uploading) return;
    const t = window.setInterval(() => {
      const current = attemptsRef.current;
      const changes = new Map<number, UploadAttempt | null>();
      const arrived: { n: number; name: string; sizeKb: number }[] = [];
      const failed: string[] = [];
      for (const [key, a] of Object.entries(current)) {
        const n = Number(key);
        if (a.phase !== "uploading" || held.has(n)) continue;
        const progress = Math.min(100, (a.progress ?? 0) + 14 + (seedOf(a.fileName) % 12));
        if (DROPS_CONNECTION.test(a.fileName) && !a.tries && progress >= 60) {
          changes.set(n, { ...a, phase: "failed", progress });
          failed.push(documents.find((d) => d.n === n)?.title ?? a.fileName);
        } else if (progress >= 100) {
          changes.set(n, null);
          arrived.push({ n, name: a.fileName, sizeKb: a.sizeKb });
        } else {
          changes.set(n, { ...a, progress });
        }
      }
      // The updater only applies what was computed above, so it is safe to run twice.
      setAttempts((prev) => {
        const next = { ...prev };
        for (const [n, change] of changes) {
          if (prev[n] !== current[n]) continue; // cancelled or replaced meanwhile
          if (change) next[n] = change;
          else delete next[n];
        }
        return next;
      });
      if (arrived.length) {
        onChange((prev) => arrived.reduce((acc, f) => commitUpload(acc, f.n, { name: f.name, sizeKb: f.sizeKb }), prev));
        setPolite(`${arrived.length === 1 ? "File" : `${arrived.length} files`} uploaded. Checking now.`);
      }
      if (failed.length) setAssertive(`${failed.join(", ")}: upload failed. Check your connection and try again.`);
    }, TICK_MS);
    return () => window.clearInterval(t);
  }, [uploading, held, documents, onChange]);

  const cancelAttempt = (n: number) =>
    setAttempts((prev) => {
      const next = { ...prev };
      delete next[n];
      return next;
    });

  const choose = (n: number) => {
    target.current = n;
    fileInput.current?.click();
  };

  /* ── Batch drop and the tray ──────────────────────────────────────────── */

  const onFiles = (list: File[]) => {
    const now = Date.now().toString(36);
    const items = placeFiles(
      list.map((f) => ({ name: f.name, sizeKb: kbOf(f) })),
      documents,
      checked,
      rule,
      fy,
      (i) => `drop-${now}-${i}`,
    );
    items.forEach((item, i) => {
      if (item.n != null) startUpload(item.n, { name: item.fileName, sizeKb: item.sizeKb }, list[i]);
    });
    setTray((prev) => [...(prev ?? []), ...items]);
    setFilter(null);
    refreshOrder();
    const placed = items.filter((i) => i.n != null).length;
    setPolite(`${placed} of ${items.length} file${items.length === 1 ? "" : "s"} placed. The list of where each went is above the documents.`);
  };

  const moveTrayItem = (itemId: string, targetId: string | null) => {
    const item = tray?.find((i) => i.id === itemId);
    if (!item) return;
    const to = targetId == null ? null : Number(targetId);
    if (item.n != null) {
      if (attempts[item.n]?.fileName === item.fileName) cancelAttempt(item.n);
      else onChange((prev) => withdrawUpload(prev, item.n!, item.fileName));
    }
    if (to != null) startUpload(to, { name: item.fileName, sizeKb: item.sizeKb }, null);
    setTray((prev) =>
      (prev ?? []).map((i) =>
        i.id === itemId
          ? {
              ...i,
              n: to,
              replaces: to != null ? checked[to]?.fileName : undefined,
              unplaced: to == null ? ("unrecognised" as const) : undefined,
            }
          : i,
      ),
    );
  };

  /* ── Row commands ─────────────────────────────────────────────────────── */

  const onMenu = (d: DocDef) => (id: string) => {
    if (id === "view") setViewing(d);
    else if (id === "replace") choose(d.n);
    else if (id === "check") {
      onChange((prev) => requestCheck(prev, d.n));
      setPolite(`Checking ${d.title} again.`);
    } else if (id === "history") setHistoryOf(d);
    else if (id === "findings") setFindingsOpen((o) => ({ ...o, [d.n]: !o[d.n] }));
    else if (id === "keep") cancelAttempt(d.n);
    else if (id === "remove")
      onChange((prev) => {
        const next = { ...prev };
        delete next[d.n];
        return next;
      });
  };

  /* ── The gate ─────────────────────────────────────────────────────────── */

  React.useImperativeHandle(ref, () => ({
    tryContinue: () => {
      if (summary.continueBlockers.length === 0) {
        setShowErrors(false);
        return true;
      }
      setShowErrors(true);
      setRevision((r) => r + 1);
      const onlyUploading = summary.continueBlockers.every((b) => b.state === "uploading");
      setFilter(onlyUploading ? "checking" : "attention");
      setOrder(summary.states);
      return false;
    },
  }));

  // The summary stays until the last blocker is resolved, and shrinks as each one is. It lists the
  // rows the filter is showing, in the order they are drawn, so every entry lands on a visible row:
  // what needs the applicant first; uploads still in flight only when nothing else stops them.
  const displayRank = new Map(
    groupDocuments(schemeCode, documents)
      .flatMap((g) => orderForAttention(g.docs, order))
      .map((d, i) => [d.n, i] as const),
  );
  const acting = summary.continueBlockers.filter((b) => b.state !== "uploading");
  const shownBlockers = (acting.length ? acting : summary.continueBlockers).sort((a, b) => (displayRank.get(a.n) ?? 0) - (displayRank.get(b.n) ?? 0));
  const errors = showErrors ? shownBlockers.map((b) => ({ fieldId: actionId(b.n), message: b.message })) : [];

  /* ── The demo dock ────────────────────────────────────────────────────── */

  React.useEffect(() => {
    const detail: DocListDetail = { scheme: schemeCode, documents: documents.map((d) => ({ n: d.n, title: d.title, optional: d.optional })) };
    (window as unknown as { __eAnudaanDocList?: DocListDetail }).__eAnudaanDocList = detail;
    window.dispatchEvent(new CustomEvent(DOC_LIST_EVENT, { detail }));
  }, [schemeCode, documents]);

  React.useEffect(() => {
    const onForce = (e: Event) => {
      const { n, state } = (e as CustomEvent<DemoDocStateDetail>).detail;
      const list = n === "all" ? documents : documents.filter((d) => d.n === n);
      const nameOf = (d: DocDef) => `${d.title.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 36).toLowerCase()}.pdf`;
      const isAttempt = state === "uploading" || state === "failed" || state === "rejected-type" || state === "rejected-size";
      // Updaters throughout: the dock can fire several forces before this component re-renders.
      setAttempts((prev) => {
        const next = { ...prev };
        for (const d of list) {
          delete next[d.n];
          if (isAttempt) {
            next[d.n] = {
              fileName: state === "rejected-type" ? nameOf(d).replace(/\.pdf$/, ".docx") : nameOf(d),
              sizeKb: state === "rejected-size" ? 7373 : 412,
              phase: state,
              progress: 64,
            };
          }
        }
        return next;
      });
      setHeld((prev) => {
        const next = new Set(prev);
        for (const d of list) {
          if (state === "uploading" || state === "checking") next.add(d.n);
          else next.delete(d.n);
        }
        return next;
      });
      if (!isAttempt) {
        onChange((prev) => {
          const next = { ...prev };
          for (const d of list) {
            const base = next[d.n] ?? { fileName: nameOf(d), sizeKb: 412, uploadedOn: "16 Sep 2026" };
            if (state === "missing" || state === "optional") delete next[d.n];
            else if (state === "checking") next[d.n] = { ...base, verdict: { state: "pending" } };
            else {
              // The demo verdict names its own illustrative organisation; read as this application's.
              const v = demoVerdictFor(state, d.title, fy);
              const org = values.fld_ngo_name;
              next[d.n] = {
                ...base,
                verdict: v.extracted && org && v.extracted["Organisation Name"] ? { ...v, extracted: { ...v.extracted, "Organisation Name": org } } : v,
              };
            }
          }
          return next;
        });
      }
      setShowErrors(false);
    };
    window.addEventListener(DEMO_DOC_STATE_EVENT, onForce);
    return () => window.removeEventListener(DEMO_DOC_STATE_EVENT, onForce);
  }, [documents, onChange, fy, values.fld_ngo_name]);

  /* ── Render ───────────────────────────────────────────────────────────── */

  const groups = groupDocuments(schemeCode, documents)
    .map((g) => ({
      ...g,
      docs: orderForAttention(g.docs, order).filter((d) => !filter || DOC_STATE_META[summary.states[d.n]!].bucket === filter),
    }))
    .filter((g) => g.docs.length > 0);
  const visible = groups.reduce((a, g) => a + g.docs.length, 0);
  const optionalCount = documents.filter((d) => d.optional).length;

  const row = (d: DocDef) => {
    const up = checked[d.n];
    const attempt = attempts[d.n];
    const state = summary.states[d.n]!;
    const reason = rowReason(state, up, attempt, rule);
    const hasVerdictDetail = !attempt && up && (state === "verified" || state === "review" || state === "invalid");
    const file = attempt
      ? { name: attempt.fileName, size: fileSizeLabel(attempt.sizeKb) }
      : up
        ? { name: up.fileName, size: fileSizeLabel(up.sizeKb), date: up.uploadedOn }
        : undefined;

    const primary: Partial<Record<DocState, { label: string; run: () => void; appearance?: "filled" | "outlined" | "text" }>> = {
      // Every row action is outlined: the step's Save and Continue is the only filled button on the
      // screen. A row's trouble is already carried by its icon, its status words and its reason.
      missing: { label: "Upload", run: () => choose(d.n), appearance: "outlined" },
      optional: { label: "Upload", run: () => choose(d.n), appearance: "outlined" },
      uploading: { label: "Cancel", run: () => cancelAttempt(d.n), appearance: "text" },
      failed: { label: "Try Again", run: () => attempt && startUpload(d.n, { name: attempt.fileName, sizeKb: attempt.sizeKb }, files.current.get(d.n), (attempt.tries ?? 0) + 1) },
      "rejected-type": { label: "Choose Another File", run: () => choose(d.n) },
      "rejected-size": { label: "Choose Another File", run: () => choose(d.n) },
      invalid: { label: "Replace", run: () => choose(d.n) },
    };
    const p = primary[state];

    const items = [
      ...(up ? [{ id: "view", label: "View", icon: "visibility" }] : []),
      ...(up && state !== "invalid" ? [{ id: "replace", label: "Replace", icon: "upload" }] : []),
      ...(up && !attempt && (state === "invalid" || state === "review" || state === "unavailable") ? [{ id: "check", label: "Check Again", icon: "refresh" }] : []),
      ...(hasVerdictDetail && state === "verified" ? [{ id: "findings", label: findingsOpen[d.n] ? "Hide What We Found" : "What We Found", icon: "fact_check" }] : []),
      ...(up ? [{ id: "history", label: "Upload History", icon: "history" }] : []),
      ...(attempt && up && attempt.phase !== "uploading" ? [{ id: "keep", label: `Keep ${up.fileName}`, icon: "undo" }] : []),
      ...(up && d.optional ? [{ kind: "separator" as const }, { id: "remove", label: "Remove", icon: "delete", tone: "danger" as const }] : []),
    ];

    return (
      <DocumentRow
        linkAs={Link}
        key={d.n}
        id={rowId(d.n)}
        number={position.get(d.n)}
        title={d.title}
        required={!d.optional}
        hint={[d.note, d.description].filter(Boolean).join(" ") || undefined}
        state={rowStateOf(state)}
        // The row prints "Uploading 64%" itself from `progress`.
        statusLabel={state === "uploading" ? undefined : DOC_STATE_META[state].words}
        progress={attempt?.progress}
        file={file}
        reason={reason}
        action={
          p ? (
            <Button id={actionId(d.n)} size="sm" appearance={p.appearance ?? "outlined"} nowrap onClick={p.run} aria-label={`${p.label}: ${d.title}`}>
              {p.label}
            </Button>
          ) : (
            <span id={actionId(d.n)} tabIndex={-1} />
          )
        }
        menu={items.length ? { items, onSelect: onMenu(d) } : undefined}
        findings={hasVerdictDetail ? <ApplicantFindings verdict={up!.verdict} title={d.title} values={values} /> : undefined}
        showFindingsToggle={state !== "verified"}
        findingsOpen={state === "verified" ? !!findingsOpen[d.n] : undefined}
      />
    );
  };

  return (
    <>
      <DocumentChecklist
        formats={rule.label}
        ready={summary.readyRequired}
        required={summary.required}
        filters={FILTERS.filter((f) => f.id !== "optional" || optionalCount > 0).map((f) => ({ ...f, count: summary.counts[f.id], tone: f.id === "attention" ? ("danger" as const) : undefined }))}
        activeFilter={filter}
        onFilterChange={(id) => {
          setFilter(id as DocBucket | null);
          refreshOrder();
        }}
        onFiles={onFiles}
        accept={rule.inputAccept}
        errors={errors}
        errorTitle={blockerTitle(shownBlockers.length, "continue")}
        errorsRevision={revision}
        politeMessage={polite}
        assertiveMessage={assertive}
        visibleCount={visible}
        tray={
          tray && tray.length > 0 ? (
            <DocumentPlacementTray
              items={tray.map((i) => ({
                id: i.id,
                fileName: i.fileName,
                size: fileSizeLabel(i.sizeKb),
                targetId: i.n == null ? null : String(i.n),
                replaces: i.replaces,
                rejected: i.rejected ? rowReason(i.rejected, undefined, { fileName: i.fileName, sizeKb: i.sizeKb, phase: i.rejected }, rule) : undefined,
                unplacedReason: i.unplaced === "duplicate" ? "Another file in this drop was placed in the document this looks like." : undefined,
              }))}
              options={documents.map((d) => ({ id: String(d.n), label: `${position.get(d.n)}. ${d.title}`, filled: !!checked[d.n] || !!attempts[d.n] }))}
              onChange={moveTrayItem}
              onRemove={(id) => setTray((prev) => (prev ?? []).filter((i) => i.id !== id))}
              onDone={() => {
                setTray(null);
                refreshOrder();
              }}
            />
          ) : undefined
        }
      >
        {groups.map((g) => (
          <DocumentChecklistGroup
            key={g.id}
            title={g.title}
            // Where a 17-document list is scanned group by group, each heading says whether the group needs anything.
            meta={(() => {
              const all = groupDocuments(schemeCode, documents).find((x) => x.id === g.id)?.docs ?? [];
              const need = all.filter((d) => DOC_STATE_META[summary.states[d.n]!].bucket === "attention").length;
              return need > 0 ? `${need} need${need === 1 ? "s" : ""} attention` : undefined;
            })()}
          >
            {g.docs.map(row)}
          </DocumentChecklistGroup>
        ))}
      </DocumentChecklist>

      {/* One input for every row's Upload, Replace and Choose Another File. */}
      <input
        ref={fileInput}
        type="file"
        accept={rule.inputAccept}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          const n = target.current;
          target.current = null;
          e.target.value = "";
          if (f && n != null) startUpload(n, { name: f.name, sizeKb: kbOf(f) }, f);
          if (n != null) window.requestAnimationFrame(() => document.getElementById(actionId(n))?.focus());
        }}
      />

      <DocumentHistorySheet
        linkAs={Link}
        open={historyOf != null}
        onClose={() => setHistoryOf(null)}
        title={historyOf ? `Upload History — ${historyOf.title}` : ""}
        entries={historyEntries(historyOf ? checked[historyOf.n] : undefined).map((h) => ({
          id: h.id,
          fileName: h.fileName,
          size: h.sizeKb != null ? fileSizeLabel(h.sizeKb) : undefined,
          date: h.uploadedOn,
          current: h.current,
          status: h.status,
          note: h.note,
          onView: h.current && historyOf ? () => { setViewing(historyOf); setHistoryOf(null); } : undefined,
        }))}
      />

      <DocumentViewSheet
        open={viewing != null}
        onClose={() => setViewing(null)}
        title={viewing?.title ?? ""}
        file={viewing && checked[viewing.n] ? { name: checked[viewing.n]!.fileName, sizeKb: checked[viewing.n]!.sizeKb, uploadedOn: checked[viewing.n]!.uploadedOn } : undefined}
        previewUrl={viewing && checked[viewing.n] ? previews.current.get(`${viewing.n}|${checked[viewing.n]!.fileName}`) : undefined}
      />
    </>
  );
});
