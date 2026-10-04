"use client";

/**
 * Authorise Payment Advice — the Checker's review of one advice (PFMS BRD §5.5, Annexure G).
 *
 * Drawn after the Programme Division's review (handoff file, Officers · Paying Grants through PFMS,
 * PD Checker / Authorise Payment Advice / Ready to Sign · Returning to the Maker · Cannot Sign — You
 * Prepared It · DSC Not Found, 3 Oct 2026). The Checker's job is to see that what will be sent is
 * what was sanctioned (FR-PDC-002), so the screen opens on that comparison — six rows, each saying
 * in words whether the two agree — then the advice in summary, then the sanction order itself.
 * The full advice is one click away, not the first thing read.
 *
 * The decision panel carries what the old confirmation dialog did: the certificate the Checker will
 * sign with, or the reason they cannot sign yet, the consequence, and one button. The dialog that
 * remains (`SignDialog`) opens only once signing has started.
 *
 * DS Audit: DecisionScreen ✅ (back link, notice and a disabled submit added for this) · RecordScreen ✅
 * (the same advice once it is no longer the Checker's to decide) · Button ✅ · Card ✅ · SectionTitle ✅ ·
 * DataTable ✅ · DescriptionList ✅ · Badge ✅ · Alert ✅ · FormField ✅ · Textarea ✅ · EmptyState ✅ ·
 * Icon ✅ · useToast ✅ — composed with `AdviceSummary` (the full advice, read-only) and `SignDialog`.
 */

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  DataTable,
  DecisionScreen,
  DescriptionList,
  EmptyState,
  FormField,
  Icon,
  RecordScreen,
  SectionTitle,
  Textarea,
  buttonClasses,
  useToast,
  type DataTableColumn,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { projectTitleFor } from "@/lib/e-anudaan/applicant";
import { formatDate, formatTime } from "@/lib/e-anudaan/format";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { CERTIFICATE_MESSAGE, DOCUMENT_TYPES, divergences, netOf } from "@/lib/e-anudaan/pfms/advice";
import { configFor } from "@/lib/e-anudaan/pfms/masters";
import { payeeFor, sanctionFacts } from "@/lib/e-anudaan/pfms/selectors";
import type { HeadLine, HeadOfAccount, PaymentAdvice } from "@/lib/e-anudaan/pfms/types";
import type { RoleId } from "@/lib/e-anudaan/types";
import { AdviceSummary } from "@/components/e-anudaan/pfms/advice-summary";
import { SignDialog, useSigning } from "@/components/e-anudaan/pfms/sign-dialog";
import { StageBadge, exact, fixedCodesLine, statusHref } from "@/components/e-anudaan/pfms/payment-ui";
import { RefText } from "@/components/e-anudaan/worklist-table";

const QUEUE = "/portals/e-anudaan/dashboard/payments/authorise";
/** The handoff file's counter reads n/200 (Returning to the Maker). */
const REMARK_MAX = 200;

const uniq = (xs: (string | undefined)[]) => [...new Set(xs.filter((x): x is string => !!x))];
/** "31, 35 and 36". */
const andList = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);

/** Heads as one line — "2235021070101 · 31 and 35 · GEN · 093" — so the two sides read alike. */
function headsLine(heads: readonly Partial<HeadOfAccount>[]): string {
  if (heads.length === 0) return "Not yet configured";
  return [uniq(heads.map((h) => h.functionHead)).join(", "), andList(uniq(heads.map((h) => h.objectHead)).sort()), uniq(heads.map((h) => h.category)).join(", "), uniq(heads.map((h) => h.grantNumber)).join(", ")].join(" · ");
}

const sameHead = (a: Partial<HeadOfAccount>, b: Partial<HeadOfAccount>) => a.functionHead === b.functionHead && a.objectHead === b.objectHead && a.category === b.category && a.grantNumber === b.grantNumber;

/** "Meera Krishnan, Under Secretary, Programme Division". */
function officerLine(id: RoleId | undefined): string {
  const r = id ? ROLES[id] : undefined;
  return r ? `${r.personName}, ${r.label.replace(" - ", ", ")}` : "";
}

type CheckRow = {
  item: string;
  sanction: React.ReactNode;
  advice: React.ReactNode;
  agrees: boolean;
};

export default function AuthoriseAdvicePage() {
  const params = useParams<{ appId: string }>();
  const appId = decodeURIComponent(params.appId);
  const router = useRouter();
  const { toast } = useToast();
  const { state, hydrated } = useEAnudaan();
  const { pfms, hydrated: pfmsHydrated, returnToMaker, checkCertificate } = usePfms();
  const signing = useSigning(appId);
  const role = state.session ? ROLES[state.session] : null;
  const app = state.applications.find((a) => a.id === appId);
  const advice = pfms.advices.find((a) => a.appId === appId);
  const [choice, setChoice] = React.useState("");
  const [remark, setRemark] = React.useState("");
  const [tried, setTried] = React.useState(false);
  const [showFull, setShowFull] = React.useState(false);
  // "Try Again" asks the signing utility once more; the answer is read fresh on the next render.
  const [, setRecheck] = React.useState(0);

  if (!hydrated || !pfmsHydrated) {
    return <RecordScreen title="Payment Advice" loading tabs={[]} />;
  }
  if (!app || !advice) {
    return <EmptyState title="Payment Advice Not Found" description="There is no payment advice for this application." action={<Link href={QUEUE} className={buttonClasses("primary", "outlined", "md")}>Back to Authorisation Queue</Link>} />;
  }

  const facts = sanctionFacts(pfms, app)!;
  const ngoName = state.ngos.find((n) => n.id === app.ngoId)?.name ?? app.ngoId;
  const waiting = advice.state === "submitted";
  const off = divergences(advice);
  const designation = pfms.designations.find((d) => d.ddoCode === advice.header.ddoCode);
  const reviewKey = role ? reviewKeyOf(role) : null;
  const cfg = configFor(pfms.configs, app.schemeCode);
  const payee = payeeFor(state, pfms, app);
  const ben = advice.beneficiaries[0];
  const gross = advice.beneficiaries.reduce((s, b) => s + b.gross, 0);
  const pfmsCode = cfg?.pfmsSchemeCode;
  const schemeText = `${schemeLabel(app.schemeCode)}${pfmsCode ? ` · PFMS code ${pfmsCode}` : ""}`;
  const adviceHeads = headsLine(advice.heads) + (advice.heads.length > 1 ? ` (${advice.heads.length} heads)` : "");

  const checks: CheckRow[] = [
    { item: "Sanction Number", sanction: facts.orderNo, advice: app.sanction?.orderNo ?? "", agrees: true },
    { item: "Amount", sanction: exact(facts.amount), advice: exact(gross), agrees: !off.includes("ben-total") },
    {
      item: "Payee",
      sanction: typeof payee === "string" ? "No payee code on record" : `${payee.name} · ${payee.payeeCode}`,
      advice: ben ? `${ben.name} · ${ben.payeeCode}` : "",
      agrees: typeof payee !== "string" && !!ben && ben.payeeCode === payee.payeeCode,
    },
    {
      item: "Head of Account",
      sanction: headsLine(cfg?.heads ?? []),
      advice: adviceHeads,
      agrees: !off.includes("heads-total") && advice.heads.every((h: HeadLine) => (cfg?.heads ?? []).some((c) => sameHead(c, h))),
    },
    { item: "Financial Year", sanction: facts.financialYear, advice: advice.financialYear, agrees: facts.financialYear === advice.financialYear },
    { item: "Scheme", sanction: schemeText, advice: `${schemeLabel(advice.schemeCode)}${pfmsCode ? ` · PFMS code ${pfmsCode}` : ""}`, agrees: advice.schemeCode === app.schemeCode },
  ];
  const disagreements = checks.filter((c) => !c.agrees);

  const checkColumns: DataTableColumn<CheckRow>[] = [
    { key: "item", header: "Item", render: (r) => <span className="whitespace-nowrap text-body-3 text-ink-muted">{r.item}</span> },
    { key: "sanction", header: "In the Sanction Order", render: (r) => r.sanction },
    { key: "advice", header: "In the Payment Advice", render: (r) => r.advice },
    {
      key: "check",
      header: "Check",
      render: (r) =>
        r.agrees ? (
          <Badge status="success" size="sm">Matches</Badge>
        ) : (
          <Badge status="danger" size="sm" className="h-auto whitespace-nowrap">Does not match</Badge>
        ),
    },
  ];

  const ddo = pfms.masters.ddos.find((d) => d.code === advice.header.ddoCode);
  const docs = advice.documents.map((d) => DOCUMENT_TYPES[d.type]);
  const docNames = docs.length === 0 ? "None attached" : docs.length === 1 ? docs[0]! : `${docs.slice(0, -1).join(", ")} and ${docs.at(-1)}`;
  const lastRequest = advice.requests.at(-1);

  const summary = (a: PaymentAdvice) => (
    <DescriptionList
      columns={2}
      size="sm"
      items={[
        { term: "Sanction · Scheme · Year", value: `${facts.orderNo} · ${schemeLabel(a.schemeCode)}${pfmsCode ? ` (${pfmsCode})` : ""} · ${a.financialYear}` },
        { term: "DDO · PD Code", value: `${a.header.ddoCode}${ddo ? ` ${ddo.name}` : ""} · ${a.header.pdCode}` },
        { term: "Fixed Codes", value: fixedCodesLine(a) },
        { term: "Head of Account", value: adviceHeads },
        { term: "Payee · Claim Reference", value: ben ? `${ben.name} · ${ben.payeeCode}${ben.claimReference ? ` · ${ben.claimReference}` : ""}` : "" },
        { term: "Net Payable", value: ben ? `${exact(netOf(ben))} to XXXX XXXX ${ben.accountLast4} · ${ben.ifsc}` : "" },
        // The fingerprints were taken in the browser at upload; PFMS compares them, the portal does not.
        { term: "Documents", value: `${docNames} · fingerprints recorded` },
        { term: "Unique Identifier", value: lastRequest ? <span className="font-mono">{lastRequest.uniqueIdentifier}</span> : "Generated when you sign" },
      ]}
    />
  );

  const meta = (
    <span className="block space-y-1">
      <span className="block text-body-2 text-ink">
        {projectTitleFor(state, app)} · {schemeLabel(app.schemeCode)} · FY {app.financialYear}
      </span>
      <span className="block text-body-3 text-ink-muted">
        Application No. <RefText value={app.id} className="text-ink" /> · Payment Advice {advice.id}
      </span>
    </span>
  );

  const record = (
    <div className="space-y-6">
      <Card variant="outlined">
        <CardBody className="space-y-4">
          <SectionTitle as={2} title="Checked Against the Sanction Order" />
          <DataTable<CheckRow> columns={checkColumns} data={checks} total={checks.length} caption="The payment advice checked against the sanction order" />
        </CardBody>
      </Card>

      <section aria-labelledby="pfms-payload" className="space-y-4">
        <SectionTitle
          as={2}
          headingId="pfms-payload"
          title="What Will Be Sent to PFMS"
          description={advice.submittedAt ? `Prepared by ${ROLES[advice.preparedBy ?? "pd-maker"]?.personName ?? "the Maker"}, Maker, and submitted on ${formatDate(advice.submittedAt)} at ${formatTime(advice.submittedAt)}.` : undefined}
        />
        <Card variant="outlined">
          <CardBody className="space-y-4">
            <SectionTitle as={3} title="Summary" />
            {summary(advice)}
            <Button appearance="text" size="sm" className="self-start" aria-expanded={showFull} aria-controls="full-advice" iconLeft={<Icon name={showFull ? "expand_less" : "description"} size={16} aria-hidden />} onClick={() => setShowFull((v) => !v)}>
              {showFull ? "Hide the Full Advice" : "Show the Full Advice"}
            </Button>
          </CardBody>
        </Card>
        {showFull && (
          <div id="full-advice">
            <AdviceSummary advice={advice} masters={pfms.masters} />
          </div>
        )}
      </section>

      <Card variant="outlined">
        <CardBody className="space-y-4">
          <SectionTitle as={2} title="Original Sanction Order" />
          <DescriptionList
            columns={2}
            size="sm"
            items={[
              { term: "Sanction Number", value: facts.orderNo },
              { term: "Sanction Date", value: formatDate(facts.sanctionedAt) },
              { term: "Sanction Amount", value: exact(facts.amount) },
              { term: "Payee", value: typeof payee === "string" ? "No payee code on record" : `${payee.name} · ${payee.payeeCode}` },
              { term: "Head of Account", value: headsLine(cfg?.heads ?? []) },
              { term: "Financial Year", value: facts.financialYear },
              { term: "IFD Concurrence", value: `${facts.ifdNumber} · ${formatDate(facts.ifdDate)}` },
              { term: "Scheme", value: `${schemeLabel(facts.schemeCode)}${pfmsCode ? ` · PFMS scheme code ${pfmsCode}` : ""}` },
              ...(app.sanction?.sanctionedBy ? [{ term: "Sanctioned By", value: officerLine(app.sanction.sanctionedBy) }] : []),
            ]}
          />
          {/* The handoff file links the sanction order as a PDF. The portal holds the order as a
              record, not a file, so this opens the sanctioned application it was issued against. */}
          {reviewKey && (
            <Link href={`/portals/e-anudaan/dashboard/sm2/${reviewKey}/review/${encodeURIComponent(appId)}`} className={buttonClasses("primary", "text", "sm")}>
              <Icon name="description" size={16} aria-hidden /> Open the Sanctioned Application
            </Link>
          )}
        </CardBody>
      </Card>
    </div>
  );

  const back = (
    <Button href={QUEUE} linkAs={Link} appearance="text" size="sm" iconLeft={<Icon name="arrow_back" size={16} aria-hidden />}>
      Authorisation Queue
    </Button>
  );

  // The dialog sits second in BOTH trees below. Signing moves the advice out of "submitted", which
  // swaps DecisionScreen for RecordScreen; a dialog kept at the same position survives the swap, so
  // the Checker reads PFMS's answer instead of watching it vanish (found by the scripted walk).
  const signDialog = <SignDialog phase={signing.phase} onClose={signing.reset} onFinished={() => router.push(QUEUE)} />;

  // Once the advice has left the Checker, the same record is shown with no decision to take.
  if (!waiting || !role?.caps.includes("authoriseAdvice")) {
    return (
      <>
        <RecordScreen
          breadcrumb={[{ label: "Authorisation Queue", href: QUEUE }, { label: "Payment Advice" }]}
          title={ngoName}
          meta={meta}
          status={<StageBadge stage={waiting ? "awaiting-authorisation" : "received"} />}
          actions={
            <Link href={statusHref(appId)} className={buttonClasses("primary", "outlined", "sm", "whitespace-nowrap")}>
              <Icon name="timeline" size={16} aria-hidden /> Payment Status
            </Link>
          }
          tabs={[
            {
              id: "advice",
              label: "Payment Advice",
              render: () => (
                <div className="space-y-5">
                  <Alert status="info" title="Not Awaiting Your Authorisation">
                    This advice is {advice.state === "returned" ? "back with the Maker" : "no longer in the authorisation queue"}. It is shown read-only.
                  </Alert>
                  {record}
                </div>
              ),
            },
          ]}
        />
        {signDialog}
      </>
    );
  }

  // The certificate is asked about as soon as the Checker chooses to sign, so a missing token is
  // known before the button is pressed, not after (handoff file, DSC Not Found).
  const cert = checkCertificate(appId);
  const ownAdvice = cert === "own-advice";
  // An advice that disagrees with its sanction order cannot be approved at all, so the verdict is
  // not offered (screen-templates §4); the reason is the notice above the one that is.
  const canApprove = disagreements.length === 0;
  const approving = choice === "approve" && canApprove;
  const retryable = cert === "no-token" || cert === "no-utility";

  const remarkError = tried && choice === "return" && !remark.trim() ? "Enter the reason for returning the advice. The Maker reads it." : undefined;
  const chooseError = tried && !choice ? "Choose whether to approve and sign, or return the advice to the Maker." : undefined;

  const submit = () => {
    setTried(true);
    if (!choice) return;
    if (choice === "approve") {
      if (retryable) {
        setRecheck((n) => n + 1);
        return;
      }
      if (cert !== "ok") return;
      signing.sign();
      return;
    }
    if (!remark.trim()) return;
    const res = returnToMaker(appId, remark);
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    toast(`Payment advice ${advice.id} returned to the Maker.`, "success");
    router.push(QUEUE);
  };

  const notice = ownAdvice ? (
    <Alert status="error" title={CERTIFICATE_MESSAGE["own-advice"].title}>
      {CERTIFICATE_MESSAGE["own-advice"].body}
    </Alert>
  ) : !canApprove ? (
    <Alert status="error" title="Does Not Agree with the Sanction Order">
      {disagreements.map((d) => d.item).join(", ")} {disagreements.length === 1 ? "does" : "do"} not match. Return the advice to the Maker.
    </Alert>
  ) : undefined;

  const extras = approving ? (
    cert === "ok" ? (
      <DescriptionList
        columns={1}
        size="sm"
        items={[{ term: "Your Digital Signature", value: `DSC token found · ${role.personName}${designation ? ` · valid until ${formatDate(designation.certificateExpires)}` : ""}` }]}
      />
    ) : cert !== "own-advice" ? (
      <Alert status="error" title={CERTIFICATE_MESSAGE[cert].title}>
        {CERTIFICATE_MESSAGE[cert].body} Nothing has been sent.
      </Alert>
    ) : undefined
  ) : undefined;

  return (
    <>
      <DecisionScreen
        back={back}
        title={ngoName}
        meta={meta}
        status={<StageBadge stage="awaiting-authorisation" size="sm" />}
        record={record}
        panelTitle="Your Decision"
        legend="Is this payment advice ready to be sent to PFMS?"
        notice={notice}
        options={[
          ...(canApprove ? [{ id: "approve", label: "Approve and Sign", irreversibleNote: "Once PFMS accepts it, the advice cannot be recalled from e-Anudaan." }] : []),
          { id: "return", label: "Return to Maker" },
        ]}
        value={choice}
        onChange={(id) => {
          setChoice(id);
          setTried(false);
        }}
        remarks={
          choice === "return" ? (
            <FormField label="Reason for Returning" id="return-remark" required error={remarkError} characterCount={{ value: remark, maxLength: REMARK_MAX }}>
              {(c) => <Textarea {...c} rows={4} maxLength={REMARK_MAX} value={remark} onChange={(e) => setRemark(e.target.value)} />}
            </FormField>
          ) : undefined
        }
        extras={extras}
        errors={[...(chooseError ? [{ fieldId: "decision", message: chooseError }] : []), ...(remarkError ? [{ fieldId: "return-remark", message: remarkError }] : [])]}
        submitLabel={choice === "return" ? "Return to Maker" : retryable && approving ? "Try Again" : "Approve and Sign"}
        submitIcon={choice === "return" ? undefined : <Icon name="draw" size={20} aria-hidden />}
        submitDisabled={approving && (ownAdvice || cert === "expired" || cert === "not-designated")}
        submitting={signing.phase.kind === "signing"}
        onSubmit={submit}
      />

      {signDialog}
    </>
  );
}
