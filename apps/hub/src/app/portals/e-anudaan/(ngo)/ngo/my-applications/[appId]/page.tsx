"use client";

/**
 * Application detail — what the applicant sees after "View", and where a deficiency is resolved.
 *
 * DS Audit: Alert ✅ existing · Badge ✅ · Button ✅ · Icon ✅ · Card ✅ · SectionTitle ✅ ·
 * DescriptionList ✅ · ListGroup / ListRow ✅ · Accordion ✅ · EventList ✅ · Input ✅ ·
 * Textarea ✅ · FormField ✅ · PageHeader ✅ · Heading ✅ · Link ✅ · useToast ✅ ·
 * DocumentRow ➕ · DocumentFindings ➕ · DocumentHistorySheet ➕ (the Document Centre).
 * The document "Replace" control is still a hidden file input behind a Button: see the
 * conformance report — `MediaUpload` rejects PDFs whenever `accept` names an image type.
 *
 * Two modes, both from the review call of 11 Sep 2026:
 *
 *   Normal (T64–70, T80) — the whole application, in the order an applicant reads it: where it
 *   stands, what (if anything) is asked of them, the answers and documents behind collapsed
 *   sections, and the processing history LAST. The previous order put the history first and the
 *   full 60-field form open, which the call described as overwhelming.
 *
 *   Focused, `?focus=deficiency` (T55–79) — arrived at from a deficiency. "I know my form; tell
 *   me what is wrong so I can correct it and move on." Only the requested corrections are shown,
 *   each with the officer's remark and a way to put it right in place; the full application is
 *   one link away rather than open underneath.
 *
 * A replaced document is never overwritten — the earlier file stays on record as a version
 * (T83–92). Officer roles are never named to the applicant (T778–823); see `applicantStages`.
 *
 * Design-director audit of 16 Sep 2026 (N-04, N-05, N-09, N-10, X-07):
 *  • the page is fluid, as every portal surface is — a centred 896px column made the content jump
 *    left and right between this page and the lists either side of it;
 *  • a submitted file's sections are described ("12 questions"), never counted against;
 *  • one vocabulary on the correction list — "Ministry's remark", "To Correct" — and field and
 *    note answers save when the applicant leaves the box, so "Submit Correction" is the one
 *    button that sends anything;
 *  • each submitted document can be opened, and the history names the office that acted.
 */

import * as React from "react";
import NextLink from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  StatusScreen,
  Accordion,
  AccordionItem,
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  DescriptionList,
  FormField,
  Heading,
  Icon,
  Input,
  Link,
  ListGroup,
  ListRow,
  PageHeader,
  SectionTitle,
  Select,
  Textarea,
  EventList,
  DocumentHistorySheet,
  DocumentRow,
  useToast,
} from "@mosje/design-system";
import { DocumentViewSheet, Findings, rowStateOf } from "@/components/e-anudaan/document-centre-parts";
import {
  DOC_STATE_META,
  applicantFacts,
  docState,
  fileSizeLabel,
  historyEntriesOfRecord,
  simulateCheck,
} from "@/lib/e-anudaan/document-centre";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ownApplication, signedInNgoId } from "@/lib/e-anudaan/roles";
import { applicationNotFoundProps } from "@/components/e-anudaan/ngo-application-not-found";
import { answeredSectionSummary, answeredSectionsHeadline, divisionOfRole, formatGrant, ngoStatusLabel, statusTone } from "@/lib/e-anudaan/selectors";
import { DEFICIENCY, DIVISION_NAME } from "@/lib/e-anudaan/glossary";
import { formatDate, formatTime } from "@/lib/e-anudaan/format";
import { uploadProgress } from "@/lib/e-anudaan/doc-verification";
import { fieldLabel, type FieldDef } from "@/lib/e-anudaan/form-schema";
import { changesForAudit, editRuleOnFile, type ChangedAnswer, type EditRule } from "@/lib/e-anudaan/edit-policy";
import { answeredSections, applicantStages, applicantStanding, caseLabel, openDeficiencyOf, requestedAt } from "@/lib/e-anudaan/applicant";
import type { DeficiencyItem, EAnudaanState, GrantApplication, MockDoc } from "@/lib/e-anudaan/types";
import { routeOnClick } from "@/components/e-anudaan/ngo-shell";
import { SanctionedFilePanel } from "@/components/e-anudaan/sanctioned-file-panel";
import { useDemoFormFill } from "@/components/e-anudaan/use-demo-form-fill";
import { correctedValueOf } from "@/lib/e-anudaan/demo-forms/correct-application";
import { sampleChoices } from "@/lib/e-anudaan/sample-files";

/** A demo dock fill for Correct Your Application (lib/e-anudaan/demo-forms/correct-application.ts). */
type CorrectionFill = { n: number; values: Readonly<Record<string, string>> };

const BASE = "/portals/e-anudaan/ngo/my-applications";

export default function NgoApplicationDetailPage() {
  return (
    <React.Suspense fallback={null}>
      <ApplicationDetail />
    </React.Suspense>
  );
}

function ApplicationDetail() {
  const params = useParams<{ appId: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const { findApp, state, replaceDocument, correctDeficiencyItem } = useEAnudaan();
  // Another organisation's file reads exactly as a missing one (security audit S05).
  const app = ownApplication(findApp(decodeURIComponent(params.appId)), signedInNgoId(state));
  const [demo, setDemo] = React.useState<CorrectionFill | null>(null);

  /* The correct fill saves each open item the way leaving its box (or choosing its file) does; it
     does not submit. Every fill then opens the correction form, which the panel remounts to show. */
  useDemoFormFill("correct-application", (v, preset) => {
    const deficiency = app ? openDeficiencyOf(app) : undefined;
    if (!app || !deficiency) return;
    if (v.items === "correct") {
      for (const item of deficiency.items ?? []) {
        if (item.correctedAt) continue;
        const doc = item.docId ? app.documents.find((d) => d.id === item.docId) : undefined;
        if (item.kind === "document" && doc) {
          const name = sampleChoices(doc.title)[0]?.source.fileName ?? `${doc.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;
          replaceDocument(app.id, doc.id, { name, sizeKb: 640 }, "Replaced after the Ministry's query");
          correctDeficiencyItem(app.id, item.id, `Replaced with ${name}`);
        } else if (item.kind === "field" && item.fieldName) {
          const rule = editRuleOnFile(app, item.fieldName);
          if (rule?.kind === "locked") {
            const answer = /ifsc|bank/.test(item.fieldName) ? v.answerIfsc : /ngo_name/.test(item.fieldName) ? v.answerName : v.answerOther;
            correctDeficiencyItem(app.id, item.id, answer ?? "");
          } else {
            const value = correctedValueOf(item.originalValue ?? app.formValues?.[item.fieldName] ?? "");
            correctDeficiencyItem(app.id, item.id, rule?.kind === "editable-with-reason" ? (v.reason ?? "") : "Answer corrected.", value);
          }
        } else {
          correctDeficiencyItem(app.id, item.id, v.answerOther ?? "");
        }
      }
    }
    setDemo((d) => ({ n: (d?.n ?? 0) + 1, values: v }));
    if (search.get("focus") !== "deficiency") router.replace(`${BASE}/${encodeURIComponent(app.id)}?focus=deficiency`, { scroll: false });
    // A rule preset's message can sit well down a long list: bring the first one into view.
    if (!preset.valid) {
      window.setTimeout(() => {
        const shown = document.querySelector(".ds-field__message--error") ?? document.getElementById("change-another") ?? document.querySelector(".ds-alert--error");
        shown?.scrollIntoView({ block: "center" });
      }, 450);
    }
  });

  // The shared not-found props, rendered as the DS StatusScreen template directly.
  if (!app) return <StatusScreen {...applicationNotFoundProps(router)} />;

  const open = openDeficiencyOf(app);
  const focused = search.get("focus") === "deficiency" && !!open;
  const scheme = state.schemes.find((s) => s.code === app.schemeCode);

  return (
    <div className="space-y-6">
      <Button appearance="text" size="sm" onClick={() => router.push(focused ? `${BASE}/deficiencies` : BASE)}>
        <Icon name="arrow_back" size={16} aria-hidden /> {focused ? "Back to Deficiencies" : "Back to My Applications"}
      </Button>

      <PageHeader
        // The correction form is a single task, so it takes the compact title; the file itself is a page.
        size={focused ? "compact" : "default"}
        eyebrow={
          <span className="break-all tabular-nums">
            Project ID {app.institutionId} · Application {app.id}
          </span>
        }
        title={focused ? "Correct Your Application" : (app.projectLabel.split(" · ")[0] ?? app.projectLabel)}
        meta={
          <span className="flex flex-wrap items-center gap-3">
            <Badge status={statusTone(app.status)}>{ngoStatusLabel(app)}</Badge>
            <span>
              {focused
                ? `${app.projectLabel.split(" · ")[0]} · ${scheme?.name ?? app.schemeCode} · FY ${app.financialYear}`
                : applicantStanding(app)}
            </span>
          </span>
        }
      />

      {focused ? (
        <>
          <CorrectionPanel key={demo?.n ?? 0} app={app} demo={demo} />
          <p className="text-body-2 text-ink-muted">
            Need to check what you submitted?{" "}
            <Link href={`${BASE}/${encodeURIComponent(app.id)}`} onClick={routeOnClick(router, `${BASE}/${encodeURIComponent(app.id)}`)}>
              View the full application
            </Link>
          </p>
        </>
      ) : (
        <>
          {/* Summary first, then what is asked of the applicant (verify N5). */}
          <SummaryCard app={app} schemeName={scheme?.name ?? app.schemeCode} />
          {open && <CorrectionSummary app={app} items={open.items ?? []} />}
          <SanctionedFilePanel app={app} />
          <ApplicationData app={app} />
          <Documents app={app} />
          <History app={app} />
        </>
      )}
    </div>
  );
}

/* ── Focused mode — the corrections ─────────────────────────────────────── */

function CorrectionPanel({ app, demo }: { app: GrantApplication; demo?: CorrectionFill | null }) {
  const { act, replaceDocument, correctDeficiencyItem, recordDocumentCheck } = useEAnudaan();
  const { toast } = useToast();
  const router = useRouter();
  const deficiency = openDeficiencyOf(app)!;
  const items = deficiency.items ?? [];
  const done = items.filter((i) => i.correctedAt).length;
  const fill = demo?.values;
  const [note, setNote] = React.useState(fill?.items === "correct" ? (fill.note ?? "") : "");
  const [attempted, setAttempted] = React.useState(fill?.submit === "attempt");
  const remaining = items.length - done;

  /* Which item a rule preset lands on: the first the problem can arise in. Where no item can show it
     (no significant answer was raised on this file), Change Another Answer shows it instead. */
  const ruleOf = (i: DeficiencyItem) => (i.kind === "field" && i.fieldName ? editRuleOnFile(app, i.fieldName)?.kind : undefined);
  const sameItem = fill?.item === "same" ? items.find((i) => ruleOf(i) === "editable" || ruleOf(i) === "editable-with-reason") : undefined;
  const reasonItem = fill?.item === "no-reason" ? items.find((i) => ruleOf(i) === "editable-with-reason") : undefined;
  const itemFill = (i: DeficiencyItem): "same" | "no-reason" | undefined => (i === sameItem ? "same" : i === reasonItem ? "no-reason" : undefined);
  const anotherFill =
    fill?.another ||
    (fill?.item === "same" && !sameItem ? "same" : "") ||
    (fill?.item === "no-reason" && !reasonItem ? "no-reason" : "") ||
    undefined;

  // A replacement is checked as any upload is. The verdict is recorded on the file that was checked.
  const pendingKey = app.documents.filter((d) => d.aiVerdict?.state === "pending" && d.fileName).map((d) => `${d.id}|${d.fileName}`).join(",");
  React.useEffect(() => {
    if (!pendingKey) return;
    const t = window.setTimeout(() => {
      const facts = applicantFacts(app.formValues ?? {});
      const checklist = app.documents.map((d) => ({ n: d.slot, title: d.title }));
      for (const key of pendingKey.split(",")) {
        const [docId, fileName] = key.split("|") as [string, string];
        const doc = app.documents.find((d) => d.id === docId);
        if (!doc) continue;
        recordDocumentCheck(app.id, docId, fileName, simulateCheck({ slot: { n: doc.slot, title: doc.title }, checklist, fileName, sizeKb: doc.sizeKb ?? 0, applicationFy: app.financialYear, facts }));
      }
    }, 1600);
    return () => window.clearTimeout(t);
    // The key names every file awaiting a check; the rest of `app` is read as it stands when the check answers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingKey]);

  const changed = changedAnswersOf(app, deficiency);

  const submit = () => {
    setAttempted(true);
    if (remaining > 0) return;
    // The file's own record of what changed, and why: the audit trail keeps these remarks.
    const base = note.trim() || `${items.length} item${items.length === 1 ? "" : "s"} corrected as requested.`;
    const res = act(app.id, "respondDeficiency", {
      remarks: changed.length ? `${base} Answers changed — ${changesForAudit(changed)}.` : base,
    });
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    toast("Correction submitted. The Ministry will examine it again.", "success");
    router.push(`${BASE}/${encodeURIComponent(app.id)}`);
  };

  return (
    <Card variant="outlined">
      <CardBody className="space-y-5">
        <SectionTitle
          title="Corrections Requested"
          description={`Requested on ${formatDate(requestedAt(app, deficiency))}. Correct each item below, then submit.`}
        >
          <Badge status={remaining === 0 ? "success" : "warning"}>
            {done} of {items.length} corrected
          </Badge>
        </SectionTitle>

        {/* The Section Officer's message to the applicant — never the ASO's internal note, which
            reached the NGO as "ask the NGO for a clear copy" (screen audit, 14 Sep 2026). */}
        {(deficiency.message ?? (deficiency.communicatedAt ? undefined : deficiency.detail)) && (
          <p className="text-body-2 text-ink">
            <span className="font-semibold">Ministry&apos;s message: </span>
            {deficiency.message ?? deficiency.detail}
          </p>
        )}

        {/* One level of container. Items are rows divided by a rule, not cards inside the card
            (review panel, 13 Sep 2026: "a grey box inside an item card inside a card"). */}
        <ol className="divide-y divide-line border-y border-line">
          {items.map((item, i) => (
            <li key={item.id}>
              <CorrectionItem
                index={i + 1}
                item={item}
                app={app}
                demo={itemFill(item)}
                // No toast per item: three stacked toasts covered the next item's controls
                // (review panel, cycle 2). The item's own "Corrected" badge and line confirm it.
                onReplace={(doc, file) => {
                  replaceDocument(app.id, doc.id, file, "Replaced after the Ministry's query");
                  correctDeficiencyItem(app.id, item.id, `Replaced with ${file.name}`);
                }}
                onCorrectField={(value, reason) => correctDeficiencyItem(app.id, item.id, reason ?? "Answer corrected.", value)}
                onRespond={(text) => correctDeficiencyItem(app.id, item.id, text)}
              />
            </li>
          ))}
        </ol>

        <ChangeAnotherAnswer app={app} excluded={new Set(items.map((i) => i.fieldName).filter((n): n is string => !!n))} demo={anotherFill} />

        {changed.length > 0 && <ChangedAnswers app={app} changes={changed} />}

        <FormField
          label="Note to the Ministry (optional)"
          id="correction-note"
          hint="Explain anything the officer should know about these corrections."
        >
          {(control) => (
            <Textarea {...control} rows={3} maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} />
          )}
        </FormField>

        {attempted && remaining > 0 && (
          <Alert status="error" title={`${remaining} item${remaining === 1 ? " is" : "s are"} not corrected yet`}>
            Replace the file, correct the answer or write your answer for every item before submitting.
          </Alert>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={submit}>Submit Correction</Button>
          <span className="text-body-3 text-ink-muted">
            {remaining === 0 ? "All items corrected." : `${remaining} item${remaining === 1 ? "" : "s"} left to correct.`}
          </span>
        </div>
      </CardBody>
    </Card>
  );
}

function CorrectionItem({
  index,
  item,
  app,
  demo,
  onReplace,
  onCorrectField,
  onRespond,
}: {
  index: number;
  item: DeficiencyItem;
  app: GrantApplication;
  /** A demo fill's problem to show on this item's answer. */
  demo?: "same" | "no-reason";
  onReplace: (doc: MockDoc, file: { name: string; sizeKb: number }) => void;
  onCorrectField: (value: string, reason?: string) => void;
  onRespond: (text: string) => void;
}) {
  const fileInput = React.useRef<HTMLInputElement>(null);
  const doc = item.docId ? app.documents.find((d) => d.id === item.docId) : undefined;
  const current = item.fieldName ? (app.formValues?.[item.fieldName] ?? "") : "";
  const original = item.originalValue ?? current;
  const corrected = !!item.correctedAt;
  /* Field and note answers are held in the box and saved when the applicant leaves it (N-10).
     Each item used to carry its own "Save Correction" beside the page's "Submit Correction": two
     save models on one list, and an answer typed but not saved was silently lost on submit. */
  const [value, setValue] = React.useState(() => (item.kind === "note" ? (item.response ?? "") : ""));
  const rule = item.fieldName ? ruleAtCorrection(app, item.fieldName) : undefined;
  const headingId = `item-${item.id}`;
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [viewing, setViewing] = React.useState(false);
  const docStateNow = doc ? docState(doc, doc.fileName ? { verdict: doc.aiVerdict ?? { state: "unavailable" } } : undefined) : "missing";

  return (
    <section aria-labelledby={item.kind === "document" && doc ? `${headingId}-row-title` : headingId} className="space-y-3 py-5">
      {/* A document correction is one DocumentRow, which carries its own heading and status. */}
      {!(item.kind === "document" && doc) && (
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Heading level={3} variant="title-2" id={headingId}>
          {index}. {item.label}
        </Heading>
        <Badge status={corrected ? "success" : "warning"}>
          <Icon name={corrected ? "check_circle" : "report"} size={16} aria-hidden />
          {corrected ? "Corrected" : TO_CORRECT}
        </Badge>
      </div>
      )}

      {item.kind !== "document" && (
        <p className="text-body-2 text-ink">
          <span className="font-semibold">{REMARK_LABEL}: </span>
          {item.remark}
        </p>
      )}

      {item.kind === "document" && doc && (
        <>
          <DocumentRow
            linkAs={NextLink}
            as="div"
            id={`${headingId}-row`}
            titleAs="h3"
            layout="stacked"
            number={index}
            title={item.label}
            remark={item.remark}
            remarkLabel={REMARK_LABEL}
            state={corrected ? rowStateOf(docStateNow) : "review"}
            statusLabel={corrected ? `Replaced · ${DOC_STATE_META[docStateNow].words}` : TO_CORRECT}
            file={doc.fileName ? { name: doc.fileName, size: doc.sizeKb != null ? fileSizeLabel(doc.sizeKb) : undefined, date: doc.uploadedAt ? formatDate(doc.uploadedAt) : undefined } : undefined}
            reason={corrected && (docStateNow === "invalid" || docStateNow === "review") ? (doc.aiVerdict?.reasons?.[0] ?? doc.aiVerdict?.summary) : undefined}
            findings={corrected && doc.aiVerdict && doc.aiVerdict.state !== "pending" && doc.aiVerdict.state !== "unavailable" ? (
              <Findings verdict={doc.aiVerdict} title={doc.title} facts={applicantFacts(app.formValues ?? {})} applicationFy={app.financialYear} />
            ) : undefined}
            showFindingsToggle={docStateNow !== "verified"}
            action={
              <>
                {doc.fileName && (
                  <Button appearance="text" size="sm" nowrap iconLeft={<Icon name="visibility" size={16} aria-hidden />} onClick={() => setViewing(true)} aria-label={`View: ${doc.title}`}>
                    View
                  </Button>
                )}
                <Button
                  // Outlined: Submit Correction is the page's one filled button.
                  appearance="outlined"
                  size="sm"
                  nowrap
                  iconLeft={<Icon name="upload" size={16} aria-hidden />}
                  onClick={() => fileInput.current?.click()}
                  aria-label={`${corrected ? "Replace again" : "Replace"}: ${doc.title}`}
                >
                  {corrected ? "Replace Again" : "Replace"}
                </Button>
              </>
            }
            menu={{
              items: [{ id: "history", label: "Upload History", icon: "history" }],
              onSelect: () => setHistoryOpen(true),
            }}
          />
          <input
            ref={fileInput}
            type="file"
            accept="application/pdf,image/jpeg,image/png"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onReplace(doc, { name: f.name, sizeKb: Math.max(1, Math.round(f.size / 1024)) });
              e.target.value = "";
            }}
          />
          <DocumentHistorySheet
            linkAs={NextLink}
            open={historyOpen}
            onClose={() => setHistoryOpen(false)}
            title={`Upload History — ${doc.title}`}
            entries={historyEntriesOfRecord(doc).map((h) => ({
              id: h.id,
              fileName: h.fileName,
              size: h.sizeKb != null ? fileSizeLabel(h.sizeKb) : undefined,
              date: h.uploadedOn,
              current: h.current,
              status: h.status,
              note: h.note,
            }))}
          />
          <DocumentViewSheet
            open={viewing}
            onClose={() => setViewing(false)}
            title={doc.title}
            file={doc.fileName ? { name: doc.fileName, sizeKb: doc.sizeKb ?? 0, uploadedOn: doc.uploadedAt ? formatDate(doc.uploadedAt) : undefined } : undefined}
          />
        </>
      )}

      {item.kind === "note" && (
        <FormField
          label="Your Answer"
          id={`answer-${item.id}`}
          required={!corrected}
          hint="Saved when you leave the box."
        >
          {(control) => (
            <Textarea
              {...control}
              rows={3}
              maxLength={1000}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => {
                const v = value.trim();
                if (v && v !== item.response) onRespond(v);
              }}
            />
          )}
        </FormField>
      )}

      {item.kind === "field" && (
        <FieldCorrection
          item={item}
          app={app}
          rule={rule}
          original={original}
          current={current}
          corrected={corrected}
          demo={demo}
          onCorrectField={onCorrectField}
          onRespond={onRespond}
        />
      )}
    </section>
  );
}

/* ── What the edit policy allows while correcting (lib/e-anudaan/edit-policy.ts) ── */

function ruleAtCorrection(app: GrantApplication, fieldName: string): EditRule | undefined {
  return editRuleOnFile(app, fieldName);
}

/** Every answer this correction changes: the items the Ministry asked about, then the applicant's own. */
function changedAnswersOf(app: GrantApplication, deficiency: NonNullable<ReturnType<typeof openDeficiencyOf>>): ChangedAnswer[] {
  const values = app.formValues ?? {};
  const fromItems = (deficiency.items ?? [])
    .filter((i) => i.kind === "field" && i.fieldName && i.correctedAt && i.originalValue != null && (values[i.fieldName] ?? "") !== i.originalValue)
    .map((i) => ({
      fieldName: i.fieldName!,
      label: i.label,
      from: i.originalValue!,
      to: values[i.fieldName!] ?? "",
      ...(ruleAtCorrection(app, i.fieldName!)?.kind === "editable-with-reason" && i.response ? { reason: i.response } : {}),
    }));
  const own = (deficiency.changes ?? []).map(({ fieldName, label, from, to, reason }) => ({ fieldName, label, from, to, ...(reason ? { reason } : {}) }));
  return [...fromItems, ...own];
}

/** A locked answer: read-only, why, and where it is changed instead. */
function LockedAnswer({ rule }: { rule: Extract<EditRule, { kind: "locked" }> }) {
  const router = useRouter();
  const to = rule.changeAt;
  return (
    <p className="flex items-start gap-2 text-body-2 text-ink">
      <Icon name="lock" size={16} className="mt-0.5 shrink-0 text-ink-muted" aria-hidden />
      <span>
        <span className="font-semibold">This answer cannot be changed here. </span>
        {rule.reason}{" "}
        {to &&
          (to.external ? (
            <Link href={to.href} external>
              {to.label}
            </Link>
          ) : (
            <Link href={to.href} onClick={routeOnClick(router, to.href)}>
              {to.label}
            </Link>
          ))}
      </span>
    </p>
  );
}

function FieldCorrection({
  item,
  app,
  rule,
  original,
  current,
  corrected,
  demo,
  onCorrectField,
  onRespond,
}: {
  item: DeficiencyItem;
  app: GrantApplication;
  rule: EditRule | undefined;
  original: string;
  current: string;
  corrected: boolean;
  /** A demo fill's problem, shown as leaving the box would show it: the answer already submitted, or a changed answer with no reason. */
  demo?: "same" | "no-reason";
  onCorrectField: (value: string, reason?: string) => void;
  onRespond: (text: string) => void;
}) {
  const needsReason = rule?.kind === "editable-with-reason";
  const [value, setValue] = React.useState(() => (demo === "same" ? original : demo === "no-reason" ? correctedValueOf(original) : corrected ? current : ""));
  const [reason, setReason] = React.useState(() => (needsReason && corrected && !demo ? (item.response ?? "") : ""));
  const [answer, setAnswer] = React.useState(() => (rule?.kind === "locked" ? (item.response ?? "") : ""));
  const [sameAsSubmitted, setSameAsSubmitted] = React.useState(demo === "same");
  const [reasonMissing, setReasonMissing] = React.useState(demo === "no-reason");
  void app;

  /* Saved when the applicant leaves a box, as every answer on this list is (N-10) — and, where the
     policy asks for a reason, only once the reason is there too. */
  const save = () => {
    const v = value.trim();
    const r = reason.trim();
    if (!v) return;
    if (v === original) {
      setSameAsSubmitted(true);
      return;
    }
    if (needsReason && !r) {
      setReasonMissing(true);
      return;
    }
    if (corrected && v === current && (!needsReason || r === (item.response ?? ""))) return;
    onCorrectField(v, needsReason ? r : undefined);
  };

  return (
    <div className="max-w-measure space-y-2">
      {/* The first answer stays visible after correction, so the change can be read and
          audited: "Submitted 215 → Corrected 208" (review panel, cycle 2). An item cannot be
          marked corrected by saving the figure already submitted. Where the register holds no
          submitted answer, it says so rather than printing a dash beside a remark about that
          very figure (N-05). */}
      <p className="text-body-2 text-ink-muted">
        Submitted: <span className="font-semibold text-ink">{original || "Not answered in the application"}</span>
        {corrected && current !== original && (
          <>
            {" "}→ Corrected: <span className="font-semibold text-ink">{current}</span>
          </>
        )}
      </p>

      {rule?.kind === "locked" ? (
        <>
          <LockedAnswer rule={rule} />
          <FormField label="Your Answer" id={`answer-${item.id}`} required={!corrected} hint="Say what has been done about it. Saved when you leave the box.">
            {(control) => (
              <Textarea
                {...control}
                rows={3}
                maxLength={1000}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onBlur={() => {
                  const v = answer.trim();
                  if (v && v !== item.response) onRespond(v);
                }}
              />
            )}
          </FormField>
        </>
      ) : (
        <>
          <FormField
            label={corrected ? "Corrected Answer" : "Your Corrected Answer"}
            id={`fix-${item.id}`}
            hint={needsReason ? "Saved with the reason below when you leave either box." : "Saved when you leave the box."}
            error={sameAsSubmitted ? "This is the answer already submitted. Enter the corrected answer." : undefined}
          >
            {(control) => (
              <Input
                {...control}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setSameAsSubmitted(false);
                }}
                onBlur={save}
              />
            )}
          </FormField>
          {needsReason && (
            <FormField
              label="Reason for the Change"
              id={`reason-${item.id}`}
              required
              hint={rule.why}
              error={reasonMissing && !reason.trim() ? "Enter the reason for the change." : undefined}
            >
              {(control) => (
                <Textarea
                  {...control}
                  rows={2}
                  maxLength={500}
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setReasonMissing(false);
                  }}
                  onBlur={save}
                />
              )}
            </FormField>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Another answer the applicant finds wrong while correcting. The Ministry asked about some answers;
 * the applicant may put right others, within what the edit policy allows at this stage — a locked
 * one says why and where it is changed instead, and a significant one asks for a reason.
 */
function ChangeAnotherAnswer({
  app,
  excluded,
  demo,
}: {
  app: GrantApplication;
  excluded: ReadonlySet<string>;
  /** A demo fill: open on a field the policy locks, or show one of the three messages Save Change can. */
  demo?: string;
}) {
  const { amendAnswer } = useEAnudaan();
  const values = app.formValues ?? {};
  const sections = answeredSections(app.schemeCode, values);
  // The field a fill chooses: the first answered one the policy treats the way the fill needs.
  const [initial] = React.useState(() => {
    const wanted = demo === "locked" ? "locked" : demo === "no-reason" ? "editable-with-reason" : "editable";
    const field = demo
      ? sections.flatMap((s) => s.fields).find((f) => !excluded.has(f.name) && (values[f.name] ?? "").trim() && editRuleOnFile(app, f.name)?.kind === wanted)
      : undefined;
    const submittedAnswer = field ? (values[field.name] ?? "") : "";
    return {
      name: field?.name ?? "",
      value: demo === "same" ? submittedAnswer : demo === "no-reason" ? correctedValueOf(submittedAnswer) : "",
    };
  });
  const [open, setOpen] = React.useState(!!initial.name);
  const [name, setName] = React.useState(initial.name);
  const [value, setValue] = React.useState(initial.value);
  const [reason, setReason] = React.useState("");
  const [tried, setTried] = React.useState(!!initial.name);

  const field = sections.flatMap((s) => s.fields).find((f) => f.name === name);
  const rule = field ? editRuleOnFile(app, field.name) : undefined;
  const label = field ? fieldLabel(field, values) : "";
  const submitted = field ? (values[field.name] ?? "") : "";

  const choose = (next: string) => {
    setName(next);
    setValue(next ? (values[next] ?? "") : "");
    setReason("");
    setTried(false);
  };

  const problem = !field
    ? undefined
    : !value.trim()
      ? "Enter the new answer."
      : value.trim() === submitted.trim()
        ? "This is the answer already on the application."
        : undefined;
  const reasonProblem = rule?.kind === "editable-with-reason" && !reason.trim() ? "Enter the reason for the change." : undefined;

  const save = () => {
    setTried(true);
    if (!field || problem || reasonProblem) return;
    amendAnswer(app.id, field.name, label, value.trim(), rule?.kind === "editable-with-reason" ? reason.trim() : undefined);
    choose("");
    setOpen(false);
  };

  if (!open) {
    return (
      <div>
        <Button appearance="text" size="sm" iconLeft={<Icon name="edit" size={16} aria-hidden />} onClick={() => setOpen(true)}>
          Change Another Answer
        </Button>
      </div>
    );
  }

  return (
    <section aria-labelledby="change-another" className="space-y-3 border-t border-line pt-5">
      <Heading level={3} variant="title-2" id="change-another">
        Change Another Answer
      </Heading>
      <div className="max-w-measure space-y-3">
        <FormField label="Answer to Change" id="change-field">
          {(control) => (
            <Select {...control} value={name} onChange={(e) => choose(e.target.value)}>
              <option value="">Select…</option>
              {sections.map((s) => (
                <optgroup key={`${s.index}-${s.title}`} label={s.title}>
                  {s.fields
                    .filter((f) => !excluded.has(f.name))
                    .map((f) => (
                      <option key={f.name} value={f.name}>
                        {fieldLabel(f, values)}
                      </option>
                    ))}
                </optgroup>
              ))}
            </Select>
          )}
        </FormField>

        {field && (
          <>
            <p className="text-body-2 text-ink-muted">
              Submitted: <span className="font-semibold text-ink">{submitted || "Not answered in the application"}</span>
            </p>
            {rule?.kind === "locked" ? (
              <LockedAnswer rule={rule} />
            ) : (
              <>
                <FormField label="New Answer" id="change-value" required error={tried ? problem : undefined}>
                  {(control) => <Input {...control} value={value} onChange={(e) => setValue(e.target.value)} />}
                </FormField>
                {rule?.kind === "editable-with-reason" && (
                  <FormField label="Reason for the Change" id="change-reason" required hint={rule.why} error={tried ? reasonProblem : undefined}>
                    {(control) => <Textarea {...control} rows={2} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} />}
                  </FormField>
                )}
              </>
            )}
          </>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {field && rule?.kind !== "locked" && (
            <Button appearance="outlined" size="sm" onClick={save}>
              Save Change
            </Button>
          )}
          <Button
            appearance="text"
            size="sm"
            onClick={() => {
              choose("");
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </section>
  );
}

/** What this correction changes, read back before it is submitted — the officer sees the same list. */
function ChangedAnswers({ app, changes }: { app: GrantApplication; changes: readonly ChangedAnswer[] }) {
  const { amendAnswer } = useEAnudaan();
  const deficiency = openDeficiencyOf(app);
  const own = new Set((deficiency?.changes ?? []).map((c) => c.fieldName));
  return (
    <section aria-labelledby="answers-changed" className="space-y-3 border-t border-line pt-5">
      <Heading level={3} variant="title-2" id="answers-changed">
        Answers Changed ({changes.length})
      </Heading>
      <ListGroup size="sm" aria-labelledby="answers-changed">
        {changes.map((c) => (
          <ListRow
            key={c.fieldName}
            title={c.label}
            description={
              <>
                <span className="block">
                  {c.from || "Not answered"} → <span className="font-semibold text-ink">{c.to || "Not answered"}</span>
                </span>
                {c.reason && <span className="block">Reason: {c.reason}</span>}
              </>
            }
            trailing={
              own.has(c.fieldName) ? (
                <Button appearance="text" size="sm" nowrap onClick={() => amendAnswer(app.id, c.fieldName, c.label, c.from)} aria-label={`Undo change: ${c.label}`}>
                  Undo
                </Button>
              ) : undefined
            }
          />
        ))}
      </ListGroup>
    </section>
  );
}

/* ── Normal mode ─────────────────────────────────────────────────────────── */

/** The applicant's word for an item still open, on documents and answers alike (N-10). */
const TO_CORRECT = "To Correct";
/** Every remark on the correction list is the Ministry's; officer roles are not named to the applicant. */
const REMARK_LABEL = "Ministry's remark";

function CorrectionSummary({ app, items }: { app: GrantApplication; items: DeficiencyItem[] }) {
  const router = useRouter();
  const remaining = items.filter((i) => !i.correctedAt).length;
  // "Deficiency Raised", as the history and the bell name the same event (glossary). "Correction
  // Requested" was a third name for it, and the button said "Resolve".
  return (
    <Alert status="warning" title={`${DEFICIENCY.raised} — ${remaining} of ${items.length} item${items.length === 1 ? "" : "s"} to correct`}>
      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-body-2">
        {items.map((i) => (
          <li key={i.id}>
            <span className="font-semibold">{i.label}</span> — {i.remark}
          </li>
        ))}
      </ul>
      <Button
        size="sm"
        className="mt-3"
        onClick={() => router.push(`${BASE}/${encodeURIComponent(app.id)}?focus=deficiency`)}
      >
        Correct Your Application <Icon name="arrow_forward" size={16} aria-hidden />
      </Button>
    </Alert>
  );
}

function SummaryCard({ app, schemeName }: { app: GrantApplication; schemeName: string }) {
  return (
    <Card variant="outlined">
      <CardBody className="space-y-3">
        <SectionTitle title="Application Summary" />
        <DescriptionList
          columns={3}
          items={[
            { term: "Scheme", value: schemeName },
            { term: "Financial Year", value: app.financialYear },
            { term: "Case Type", value: caseLabel(app) },
            { term: app.sanction ? "Sanctioned" : "Requested", value: formatGrant(app.sanction?.total ?? app.total) },
            { term: "Beneficiaries (as Applied)", value: app.totalBeneficiaries.toLocaleString("en-IN") },
            { term: "Submitted On", value: app.submittedAt ? formatDate(app.submittedAt) : "" },
          ]}
        />
      </CardBody>
    </Card>
  );
}

function ApplicationData({ app }: { app: GrantApplication }) {
  // Only the questions this application's own branch asked. A step or field the path never showed
  // is not listed, and an optional question left blank is not counted as outstanding.
  const sections = answeredSections(app.schemeCode, app.formValues ?? {});
  if (sections.length === 0) return null;
  // A draft's progress, and a plain description for a submitted file (N-04, selectors.ts).
  const summary = answeredSectionsHeadline(sections, app);

  return (
    <Card variant="outlined">
      <CardBody className="space-y-3">
        <SectionTitle title="Application Details" description={summary} />
        <Accordion>
          {sections.map((s) => (
            <AccordionItem
              key={`${s.index}-${s.title}`}
              title={
                <span className="flex w-full flex-wrap items-center justify-between gap-2 pr-2">
                  <span className="text-body-2 font-semibold text-ink">
                    {s.index}. {s.title}
                  </span>
                  <span className="text-body-3 text-ink-muted">{answeredSectionSummary(s, app)}</span>
                </span>
              }
            >
              <DescriptionList
                columns={2}
                size="sm"
                items={s.fields.map((f: FieldDef) => ({ term: fieldLabel(f, app.formValues ?? {}), value: displayValue(f, (app.formValues ?? {})[f.name]) }))}
              />
            </AccordionItem>
          ))}
        </Accordion>
      </CardBody>
    </Card>
  );
}

/** An answer as a person reads it: dates and times in the portal's one shape, blanks said plainly. */
function displayValue(field: FieldDef, raw: string | undefined): string {
  const v = (raw ?? "").trim();
  if (!v) return field.required ? "" : "Not provided";
  if (field.kind === "date") return formatDate(v) || v;
  if (field.kind === "time") return formatTime(v) || v;
  if (field.kind === "checkbox") return v === "true" ? "Yes" : v === "false" ? "No" : v;
  return v;
}

function Documents({ app }: { app: GrantApplication }) {
  // The same count the upload step shows, from the same function, so the form and the record agree.
  const progress = uploadProgress(
    app.documents.map((d) => ({ n: d.slot, optional: d.optional })),
    Object.fromEntries(app.documents.filter((d) => d.fileName).map((d) => [d.slot, d])),
  );
  return (
    <Card variant="outlined">
      <CardBody className="space-y-3">
        <SectionTitle title="Documents" description={`${progress.done} of ${progress.total} uploaded`} />
        <ListGroup aria-label="Documents uploaded with this application" size="sm">
          {app.documents.map((d) => (
            <SubmittedDocument key={d.id} doc={d} />
          ))}
        </ListGroup>
      </CardBody>
    </Card>
  );
}

/**
 * One document, as the applicant needs it after submission: the file, when it went in, and —
 * only when the Ministry has queried it — what is wrong. Two things were taken off after the
 * review panel of 13 Sep 2026: the automated check's verdict (it read "Not valid · 95%" on files
 * no officer had queried, which frightened the applicant about nothing they could act on — it
 * still shows at upload time, where it can be acted on), and a "Pending" badge on eighteen
 * untouched files, which read as eighteen problems.
 */
function SubmittedDocument({ doc }: { doc: MockDoc }) {
  const [showVersions, setShowVersions] = React.useState(false);
  const [viewing, setViewing] = React.useState(false);
  const flagged = doc.reviewStatus === "Deficient";

  return (
    <ListRow
      leading={<Icon name={doc.fileName ? "description" : "draft"} size={20} className="text-ink-muted" />}
      title={
        <span>
          {doc.slot}. {doc.title}
          {!doc.optional && <span className="sr-only"> (required)</span>}
        </span>
      }
      description={
        <>
          <span className="block">
            {doc.fileName ? `${doc.fileName} · uploaded ${doc.uploadedAt ? formatDate(doc.uploadedAt) : ""}` : "Not uploaded"}
          </span>
          {flagged && doc.officerRemarks && <span className="block text-ink">{REMARK_LABEL}: {doc.officerRemarks}</span>}
          {doc.versions?.length ? (
            <>
              <span className="mt-1 block">
                <Button appearance="text" size="sm" aria-expanded={showVersions} onClick={() => setShowVersions((v) => !v)}>
                  {doc.versions.length} earlier version{doc.versions.length === 1 ? "" : "s"}
                  <Icon name={showVersions ? "expand_less" : "expand_more"} size={16} aria-hidden />
                </Button>
              </span>
              {showVersions && (
                <span className="mt-1 block space-y-0.5">
                  {[...doc.versions].reverse().map((v) => (
                    <span key={v.replacedAt + v.fileName} className="block text-body-3 text-ink-muted">
                      {v.fileName} · replaced {formatDate(v.replacedAt)}
                    </span>
                  ))}
                </span>
              )}
            </>
          ) : null}
        </>
      }
      /* The applicant could not re-read their own file after submitting it (N-09). */
      trailing={
        <span className="flex items-center gap-3">
          {flagged ? (
            <Badge status="warning" size="sm">{TO_CORRECT}</Badge>
          ) : doc.reviewStatus === "Verified" ? (
            <Badge status="success" size="sm">Verified</Badge>
          ) : null}
          {doc.fileName ? (
            <>
              <Button appearance="text" size="sm" onClick={() => setViewing(true)} aria-label={`View ${doc.title}`}>
                <Icon name="visibility" size={16} aria-hidden /> View
              </Button>
              <DocumentViewSheet
                open={viewing}
                onClose={() => setViewing(false)}
                title={doc.title}
                file={{ name: doc.fileName, sizeKb: doc.sizeKb ?? 0, uploadedOn: doc.uploadedAt ? formatDate(doc.uploadedAt) : undefined }}
              />
            </>
          ) : null}
        </span>
      }
    />
  );
}

/**
 * Who acted, as the applicant is told it (N-09, glossary "Who acted"): their own organisation for
 * their own act, and otherwise the OFFICE — never the officer's seat (T778–823). Every entry used to
 * read "System", which the event list prints when no actor is given.
 */
function actorOf(state: EAnudaanState, app: GrantApplication, stageId: string): string | undefined {
  const entry = app.audit.find((e) => e.id === stageId);
  if (!entry) return undefined;
  if (entry.byRole === "ngo") return state.ngos.find((n) => n.id === app.ngoId)?.name ?? "Your organisation";
  const division = divisionOfRole(entry.byRole);
  if (division) return DIVISION_NAME[division];
  return entry.byRole === "pmu-field" ? "Project Monitoring Unit" : undefined;
}

function History({ app }: { app: GrantApplication }) {
  const { state } = useEAnudaan();
  const stages = applicantStages(app);
  const ICON: Record<(typeof stages)[number]["tone"], string> = {
    neutral: "pending",
    attention: "report",
    done: "check_circle",
    closed: "cancel",
  };
  const TONE = { neutral: "neutral", attention: "warning", done: "success", closed: "danger" } as const;
  return (
    <Card variant="outlined">
      <CardBody className="space-y-3">
        <SectionTitle title="Processing History" description="Most recent first." />
        <EventList
          linkAs={NextLink}
          label="Processing history"
          emptyText="Not submitted yet."
          events={[...stages].reverse().map((s) => ({
            id: s.id,
            at: s.until ?? s.at,
            action: s.title,
            actor: actorOf(state, app, s.id),
            note: [s.until ? `From ${formatDate(s.at)}.` : "", s.detail ?? ""].filter(Boolean).join(" ") || undefined,
            icon: ICON[s.tone],
            tone: TONE[s.tone],
          }))}
        />
      </CardBody>
    </Card>
  );
}
