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
import { formatGrant, ngoStatusLabel, statusTone } from "@/lib/e-anudaan/selectors";
import { formatDate, formatTime } from "@/lib/e-anudaan/format";
import { uploadProgress } from "@/lib/e-anudaan/doc-verification";
import { fieldLabel, type FieldDef } from "@/lib/e-anudaan/form-schema";
import { answeredSections, applicantStages, applicantStanding, caseLabel, openDeficiencyOf, requestedAt } from "@/lib/e-anudaan/applicant";
import type { DeficiencyItem, GrantApplication, MockDoc } from "@/lib/e-anudaan/types";
import { routeOnClick } from "@/components/e-anudaan/ngo-shell";
import { SanctionedFilePanel } from "@/components/e-anudaan/sanctioned-file-panel";

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
  const { findApp, state } = useEAnudaan();
  // Another organisation's file reads exactly as a missing one (security audit S05).
  const app = ownApplication(findApp(decodeURIComponent(params.appId)), signedInNgoId(state));

  // The shared not-found props, rendered as the DS StatusScreen template directly.
  if (!app) return <StatusScreen {...applicationNotFoundProps(router)} />;

  const open = openDeficiencyOf(app);
  const focused = search.get("focus") === "deficiency" && !!open;
  const scheme = state.schemes.find((s) => s.code === app.schemeCode);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button appearance="text" size="sm" onClick={() => router.push(focused ? `${BASE}/deficiencies` : BASE)}>
        <Icon name="arrow_back" size={16} aria-hidden /> {focused ? "Back to Deficiencies" : "Back to My Applications"}
      </Button>

      <PageHeader
        eyebrow={
          <span className="break-all font-mono">
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
          <CorrectionPanel app={app} />
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

function CorrectionPanel({ app }: { app: GrantApplication }) {
  const { act, replaceDocument, correctDeficiencyItem, recordDocumentCheck } = useEAnudaan();
  const { toast } = useToast();
  const router = useRouter();
  const deficiency = openDeficiencyOf(app)!;
  const items = deficiency.items ?? [];
  const done = items.filter((i) => i.correctedAt).length;
  const [note, setNote] = React.useState("");
  const [attempted, setAttempted] = React.useState(false);
  const remaining = items.length - done;

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

  const submit = () => {
    setAttempted(true);
    if (remaining > 0) return;
    const res = act(app.id, "respondDeficiency", {
      remarks: note.trim() || `${items.length} item${items.length === 1 ? "" : "s"} corrected as requested.`,
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
                // No toast per item: three stacked toasts covered the next item's controls
                // (review panel, cycle 2). The item's own "Corrected" badge and line confirm it.
                onReplace={(doc, file) => {
                  replaceDocument(app.id, doc.id, file, "Replaced after the Ministry's query");
                  correctDeficiencyItem(app.id, item.id, `Replaced with ${file.name}`);
                }}
                onCorrectField={(value) => correctDeficiencyItem(app.id, item.id, "Answer corrected.", value)}
                onRespond={(text) => correctDeficiencyItem(app.id, item.id, text)}
              />
            </li>
          ))}
        </ol>

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
  onReplace,
  onCorrectField,
  onRespond,
}: {
  index: number;
  item: DeficiencyItem;
  app: GrantApplication;
  onReplace: (doc: MockDoc, file: { name: string; sizeKb: number }) => void;
  onCorrectField: (value: string) => void;
  onRespond: (text: string) => void;
}) {
  const fileInput = React.useRef<HTMLInputElement>(null);
  const doc = item.docId ? app.documents.find((d) => d.id === item.docId) : undefined;
  const current = item.fieldName ? (app.formValues?.[item.fieldName] ?? "") : "";
  const original = item.originalValue ?? current;
  const [value, setValue] = React.useState("");
  const corrected = !!item.correctedAt;
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
          {corrected ? "Corrected" : "To Correct"}
        </Badge>
      </div>
      )}

      {item.kind !== "document" && (
        <p className="text-body-2 text-ink">
          <span className="font-semibold">Officer&apos;s remark: </span>
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
            number={index}
            title={item.label}
            remark={item.remark}
            remarkLabel="Ministry's remark"
            state={corrected ? rowStateOf(docStateNow) : "review"}
            statusLabel={corrected ? `Replaced · ${DOC_STATE_META[docStateNow].words}` : "To correct"}
            file={doc.fileName ? { name: doc.fileName, size: doc.sizeKb != null ? fileSizeLabel(doc.sizeKb) : undefined, date: doc.uploadedAt ? formatDate(doc.uploadedAt) : undefined } : undefined}
            reason={corrected && (docStateNow === "invalid" || docStateNow === "review") ? (doc.aiVerdict?.reasons?.[0] ?? doc.aiVerdict?.summary) : undefined}
            findings={corrected && doc.aiVerdict && doc.aiVerdict.state !== "pending" && doc.aiVerdict.state !== "unavailable" ? (
              <Findings verdict={doc.aiVerdict} title={doc.title} facts={applicantFacts(app.formValues ?? {})} applicationFy={app.financialYear} />
            ) : undefined}
            showFindingsToggle={docStateNow !== "verified"}
            action={
              <Button
                // Outlined: Submit Correction is the page's one filled button.
                appearance="outlined"
                size="sm"
                nowrap
                onClick={() => fileInput.current?.click()}
                aria-label={`${corrected ? "Replace again" : "Replace"}: ${doc.title}`}
              >
                {corrected ? "Replace Again" : "Replace"}
              </Button>
            }
            menu={{
              items: [
                ...(doc.fileName ? [{ id: "view", label: "View", icon: "visibility" }] : []),
                { id: "history", label: "Upload History", icon: "history" },
              ],
              onSelect: (id) => (id === "view" ? setViewing(true) : setHistoryOpen(true)),
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
        <div className="space-y-3">
          {corrected && item.response && (
            <p className="text-body-2 text-ink-muted">
              Your answer: <span className="text-ink">{item.response}</span>
            </p>
          )}
          <FormField label={corrected ? "Change Your Answer" : "Your Answer"} id={`answer-${item.id}`} required={!corrected}>
            {(control) => <Textarea {...control} rows={3} maxLength={1000} value={value} onChange={(e) => setValue(e.target.value)} />}
          </FormField>
          <Button
            appearance={corrected ? "outlined" : "filled"}
            size="sm"
            disabled={value.trim() === "" || value.trim() === item.response}
            onClick={() => {
              onRespond(value.trim());
              setValue("");
            }}
          >
            {corrected ? "Update Answer" : "Save Answer"}
          </Button>
        </div>
      )}

      {item.kind === "field" && (
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[14rem] flex-1">
            {/* The first answer stays visible after correction, so the change can be read and
                audited: "Submitted 215 → Corrected 208" (review panel, cycle 2). The box starts
                empty so an item cannot be marked corrected by saving the old figure. */}
            <p className="mb-2 text-body-2 text-ink-muted">
              Submitted: <span className="font-semibold text-ink">{original || "—"}</span>
              {corrected && current !== original && (
                <>
                  {" "}→ Corrected: <span className="font-semibold text-ink">{current}</span>
                </>
              )}
            </p>
            <FormField label={corrected ? "Change the Corrected Answer" : "Corrected Answer"} id={`fix-${item.id}`}>
              {(control) => <Input {...control} value={value} onChange={(e) => setValue(e.target.value)} />}
            </FormField>
          </div>
          <Button
            appearance={corrected ? "outlined" : "filled"}
            size="sm"
            disabled={value.trim() === "" || value.trim() === original || (corrected && value.trim() === current)}
            onClick={() => {
              onCorrectField(value.trim());
              setValue("");
            }}
          >
            {corrected ? "Update Answer" : "Save Correction"}
          </Button>
        </div>
      )}
    </section>
  );
}

/* ── Normal mode ─────────────────────────────────────────────────────────── */

function CorrectionSummary({ app, items }: { app: GrantApplication; items: DeficiencyItem[] }) {
  const router = useRouter();
  const remaining = items.filter((i) => !i.correctedAt).length;
  return (
    <Alert status="warning" title={`Correction Requested — ${remaining} of ${items.length} item${items.length === 1 ? "" : "s"} to correct`}>
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
        Resolve Now <Icon name="arrow_forward" size={16} aria-hidden />
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
  const missing = sections.reduce((a, s) => a + s.missingRequired, 0);
  const summary =
    app.status === "Draft"
      ? missing === 0
        ? "Every required question is answered."
        : `${missing} required question${missing === 1 ? "" : "s"} still to answer.`
      : undefined;

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
                  <span className="text-body-3 text-ink-muted">
                    {s.missingRequired > 0
                      ? `${s.missingRequired} required question${s.missingRequired === 1 ? "" : "s"} unanswered`
                      : `${s.fields.length} question${s.fields.length === 1 ? "" : "s"}`}
                  </span>
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
          {flagged && doc.officerRemarks && <span className="block text-ink">Officer&apos;s remark: {doc.officerRemarks}</span>}
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
      trailing={
        flagged ? (
          <Badge status="warning" size="sm">Needs Correction</Badge>
        ) : doc.reviewStatus === "Verified" ? (
          <Badge status="success" size="sm">Verified</Badge>
        ) : undefined
      }
    />
  );
}

function History({ app }: { app: GrantApplication }) {
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
            note: [s.until ? `From ${formatDate(s.at)}.` : "", s.detail ?? ""].filter(Boolean).join(" ") || undefined,
            icon: ICON[s.tone],
            tone: TONE[s.tone],
          }))}
        />
      </CardBody>
    </Card>
  );
}
