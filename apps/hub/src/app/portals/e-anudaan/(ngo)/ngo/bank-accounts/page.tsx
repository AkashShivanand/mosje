"use client";

/**
 * Project Bank Accounts — the account each project is paid into, and how to change it.
 *
 * DS Audit: Card ✅ existing · SectionTitle ✅ · ListGroup / ListRow ✅ · Badge ✅ · Button ✅ ·
 * Icon ✅ · Modal ✅ · FormField ✅ · Input ✅ · Textarea ✅ · RadioGroup ✅ · DescriptionList ✅ ·
 * FileList ✅ · ErrorSummary ✅ · useToast ✅ · Search ✅ · EmptyState ✅ — nothing new.
 *
 * What the review call of 11 Sep 2026 changed (T124–159, T537–576):
 *
 *  • An account belongs to a PROJECT. The page used to open with the NGO's "saved accounts" and
 *    an "Add account" button, then made the applicant go down to the project table and raise a
 *    second form to attach one — two forms for one intention. The first account is recorded when
 *    a project is created, in the application itself; after that the only thing to do here is
 *    change it, in ONE form.
 *  • Until the Ministry approves, the existing account stays in use, and the page says so.
 *  • The account being replaced is never deleted; every project keeps its earlier accounts on
 *    record.
 *  • The full account number is never shown back — last four digits, IFSC and branch are what an
 *    applicant needs to recognise it.
 */

import * as React from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  DescriptionList,
  EmptyState,
  ErrorSummary,
  FileList,
  FormField,
  Icon,
  Input,
  ListGroup,
  ListRow,
  Modal,
  PageHeader,
  Pagination,
  RadioGroup,
  Search,
  SectionTitle,
  Textarea,
  useToast,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { accountsFor, maskedAccount, projectName, projectsOf } from "@/lib/e-anudaan/applicant";
import { formatDate } from "@/lib/e-anudaan/format";
import type { BankChangeRequest, Institution, ProjectAccount } from "@/lib/e-anudaan/types";

const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const PAGE = 10;

export default function ProjectBankAccountsPage() {
  const { state } = useEAnudaan();
  const ngo = state.ngos[0];
  const projects = ngo ? projectsOf(state, ngo.id) : [];
  const [changing, setChanging] = React.useState<Institution | null>(null);
  const [page, setPage] = React.useState(1);
  /*
   * Usability audit UX-14 (14 Sep 2026): 37 projects, ten to a page, and no way to find one but
   * paging. The applicant knows either the project ID from a letter or the project's name.
   */
  const [q, setQ] = React.useState("");
  const needle = q.trim().toLowerCase();
  const shown = needle
    ? projects.filter((p) => p.id.toLowerCase().includes(needle) || projectName(p).toLowerCase().includes(needle))
    : projects;

  const bankRequests = state.changeRequests.filter((r): r is BankChangeRequest => r.kind === "bank");
  const pendingCount = bankRequests.filter((r) => r.status === "Pending").length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Project Bank Accounts"
        meta="Each project is paid into its own bank account. To change one, raise a request — the current account stays in use until the Ministry approves the change."
      />

      <Card variant="outlined">
        <CardBody className="space-y-3">
          <SectionTitle
            title="Accounts by Project"
            description={`${projects.length} projects${pendingCount ? ` · ${pendingCount} change request${pendingCount === 1 ? "" : "s"} under examination` : ""}`}
          />
          {projects.length > PAGE && (
            <div className="grid gap-2 sm:grid-cols-[minmax(0,22rem)_1fr] sm:items-center">
              <Search
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                onClear={() => {
                  setQ("");
                  setPage(1);
                }}
                placeholder="Project ID or name"
                aria-label="Search projects by project ID or name"
              />
              <p className="text-body-2 text-ink-muted sm:text-right" role="status">
                {needle ? `${shown.length} of ${projects.length} projects match` : ""}
              </p>
            </div>
          )}
          {shown.length === 0 ? (
            <EmptyState
              title="No project matches this search."
              description={`Check the project ID, or clear the search to see all ${projects.length} projects.`}
              action={
                <Button appearance="outlined" size="sm" onClick={() => setQ("")}>
                  Clear Search
                </Button>
              }
            />
          ) : (
          <ListGroup aria-label="Bank account of each project">
            {shown.slice((page - 1) * PAGE, page * PAGE).map((p) => (
              <ProjectRow
                key={p.id}
                project={p}
                accounts={accountsFor(state, p.id)}
                pending={bankRequests.find((r) => r.projectId === p.id && r.status === "Pending")}
                decided={bankRequests
                  .filter((r) => r.projectId === p.id && r.status !== "Pending" && r.decidedAt)
                  .sort((a, b) => Date.parse(b.decidedAt!) - Date.parse(a.decidedAt!))[0]}
                onChange={() => setChanging(p)}
              />
            ))}
          </ListGroup>
          )}
          {shown.length > PAGE && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-body-3 text-ink-muted">
                Showing {(page - 1) * PAGE + 1}–{Math.min(page * PAGE, shown.length)} of {shown.length}
              </p>
              <Pagination page={page} totalPages={Math.ceil(shown.length / PAGE)} onPageChange={setPage} label="Projects pages" />
            </div>
          )}
        </CardBody>
      </Card>

      {changing && (
        <ChangeAccountDialog project={changing} current={accountsFor(state, changing.id).current} onClose={() => setChanging(null)} />
      )}
    </div>
  );
}

function accountLine(a: { bank: string; last4: string; ifsc: string; branch: string }): string {
  return `${a.bank} · ${maskedAccount(a.last4)} · ${a.ifsc} · ${a.branch}`;
}

function ProjectRow({
  project,
  accounts,
  pending,
  decided,
  onChange,
}: {
  project: Institution;
  accounts: { current?: ProjectAccount; previous: ProjectAccount[] };
  pending?: BankChangeRequest;
  /** The latest request the Ministry has decided on this project, with its remarks. */
  decided?: BankChangeRequest;
  onChange: () => void;
}) {
  const [showPrevious, setShowPrevious] = React.useState(false);
  const { current, previous } = accounts;

  return (
    <ListRow
      eyebrow={<span className="font-mono">{project.id}</span>}
      title={projectName(project)}
      description={
        <>
          {current ? (
            <span className="block text-ink">
              {accountLine(current)}
              <span className="ml-2 inline-flex align-middle">
                <Badge status={current.pfmsRegistered ? "success" : "neutral"} size="sm">
                  {current.pfmsRegistered ? "PFMS Registered" : "PFMS Not Declared"}
                </Badge>
              </span>
            </span>
          ) : (
            <span className="block">No account recorded for this project.</span>
          )}
          {pending && (
            <span className="mt-1 block">
              <Badge status="warning" size="sm">Change Under Examination</Badge>{" "}
              To {accountLine(pending)} · requested {formatDate(pending.submittedAt)}
            </span>
          )}
          {!pending && decided && (
            <span className="mt-1 block">
              <Badge status={decided.status === "Approved" ? "success" : "danger"} size="sm">
                {decided.status === "Approved" ? "Change Approved" : "Change Rejected"}
              </Badge>{" "}
              {formatDate(decided.decidedAt!)}
              {decided.decisionRemarks ? ` · ${decided.decisionRemarks}` : ""}
            </span>
          )}
          {previous.length > 0 && (
            <>
              <span className="mt-1 block">
                <Button appearance="text" size="sm" aria-expanded={showPrevious} onClick={() => setShowPrevious((v) => !v)}>
                  {previous.length} earlier account{previous.length === 1 ? "" : "s"}
                  <Icon name={showPrevious ? "expand_less" : "expand_more"} size={16} aria-hidden />
                </Button>
              </span>
              {showPrevious &&
                previous.map((a) => (
                  <span key={a.id} className="block text-body-3 text-ink-muted">
                    {accountLine(a)} · used {formatDate(a.activeFrom)} – {formatDate(a.activeTo!)}
                  </span>
                ))}
            </>
          )}
          {!pending && (
            <span className="mt-2 block sm:hidden">
              <Button appearance="outlined" size="sm" onClick={onChange} aria-label={`Request a change of account for ${projectName(project)}`}>
                Request Change
              </Button>
            </span>
          )}
        </>
      }
      trailing={
        // An action the applicant cannot take is omitted, not disabled: a second request is not
        // possible while one is under examination, and the row already says so.
        // On a phone the button moves under the account (below) — beside it, it left the account
        // details a 120px column and pushed the page 77px wide (screen crawl, 13 Sep 2026).
        pending ? undefined : (
          <Button
            appearance="outlined"
            size="sm"
            nowrap
            className="hidden sm:inline-flex"
            onClick={onChange}
            aria-label={`Request a change of account for ${projectName(project)}`}
          >
            Request Change
          </Button>
        )
      }
    />
  );
}

function ChangeAccountDialog({ project, current, onClose }: { project: Institution; current?: ProjectAccount; onClose: () => void }) {
  const { raiseChangeRequest } = useEAnudaan();
  const { toast } = useToast();
  const fileInput = React.useRef<HTMLInputElement>(null);
  const [f, setF] = React.useState({ bank: "", branch: "", account: "", confirm: "", ifsc: "", pfms: "", reason: "" });
  const [doc, setDoc] = React.useState<{ name: string; size: number } | null>(null);
  const [tried, setTried] = React.useState(false);

  const errors = [
    !f.bank.trim() && { id: "chg-bank", text: "Enter the name of the bank." },
    !f.branch.trim() && { id: "chg-branch", text: "Enter the branch." },
    !/^\d{9,18}$/.test(f.account) && { id: "chg-account", text: "Enter an account number of 9 to 18 digits." },
    f.account && f.confirm !== f.account && { id: "chg-confirm", text: "The account numbers do not match." },
    !IFSC.test(f.ifsc) && { id: "chg-ifsc", text: "Enter an 11-character IFSC, for example SBIN0001234." },
    current && f.account.endsWith(current.last4) && f.ifsc === current.ifsc && { id: "chg-account", text: "This is the account already recorded for the project." },
    !f.pfms && { id: "chg-pfms", text: "Say whether the account is registered on the PFMS DBT module." },
    !f.reason.trim() && { id: "chg-reason", text: "Give the reason for the change." },
  ].filter(Boolean) as { id: string; text: string }[];
  const errorFor = (id: string) => (tried ? errors.find((e) => e.id === id)?.text : undefined);

  const submit = () => {
    setTried(true);
    if (errors.length) return;
    raiseChangeRequest({
      kind: "bank",
      projectId: project.id,
      bank: f.bank.trim(),
      branch: f.branch.trim(),
      last4: f.account.slice(-4),
      ifsc: f.ifsc,
      pfmsRegistered: f.pfms === "yes",
      reason: f.reason.trim(),
      documentName: doc?.name,
    } as Omit<BankChangeRequest, "id" | "submittedAt" | "status">);
    toast("Change request submitted. Payments continue to the current account until it is approved.", "success");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      /* Escape or a click outside once discarded five typed fields without a word (UX-06). */
      dirty={Object.values(f).some((v) => v !== "") || doc !== null}
      title="Request a Change of Bank Account"
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button appearance="outlined" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Submit Request</Button>
        </div>
      }
    >
      <div className="space-y-5">
        {tried && errors.length > 0 && <ErrorSummary autoFocus errors={errors.map((e) => ({ fieldId: e.id, message: e.text }))} />}

        <DescriptionList
          columns={2}
          items={[
            { term: "Project", value: `${project.id} — ${projectName(project)}` },
            { term: "Current Account", value: current ? accountLine(current) : "None recorded" },
          ]}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Bank Name" id="chg-bank" required error={errorFor("chg-bank")}>
            {(c) => <Input {...c} value={f.bank} onChange={(e) => setF({ ...f, bank: e.target.value })} />}
          </FormField>
          <FormField label="Branch" id="chg-branch" required error={errorFor("chg-branch")}>
            {(c) => <Input {...c} value={f.branch} onChange={(e) => setF({ ...f, branch: e.target.value })} />}
          </FormField>
          <FormField label="Account Number" id="chg-account" required error={errorFor("chg-account")}>
            {(c) => (
              <Input {...c} inputMode="numeric" autoComplete="off" value={f.account} onChange={(e) => setF({ ...f, account: e.target.value.replace(/\D/g, "").slice(0, 18) })} />
            )}
          </FormField>
          <FormField label="Confirm Account Number" id="chg-confirm" required error={errorFor("chg-confirm")}>
            {(c) => (
              <Input
                {...c}
                inputMode="numeric"
                autoComplete="off"
                value={f.confirm}
                onChange={(e) => setF({ ...f, confirm: e.target.value.replace(/\D/g, "").slice(0, 18) })}
              />
            )}
          </FormField>
          <FormField label="IFSC" id="chg-ifsc" required hint="11 characters, printed on the cheque book." error={errorFor("chg-ifsc")}>
            {(c) => <Input {...c} autoComplete="off" value={f.ifsc} onChange={(e) => setF({ ...f, ifsc: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11) })} />}
          </FormField>
        </div>

        <RadioGroup
          id="chg-pfms"
          name="chg-pfms"
          legend="Is this account registered on the PFMS DBT module?"
          required
          orientation="horizontal"
          value={f.pfms}
          onChange={(v) => setF({ ...f, pfms: v })}
          hint="If it is not, the Ministry registers it before the next release."
          error={errorFor("chg-pfms")}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />

        <FormField label="Reason for the Change" id="chg-reason" required error={errorFor("chg-reason")} characterCount={{ value: f.reason, maxLength: 500 }}>
          {(c) => <Textarea {...c} rows={3} maxLength={500} value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} />}
        </FormField>

        <FormField label="Supporting Document" id="chg-doc" optional hint="For example the bank's letter or a cancelled cheque. PDF, JPG or PNG, up to 2 MB.">
          {(c) => (
            <div className="space-y-2">
              <input
                ref={fileInput}
                id={c.id}
                aria-describedby={c["aria-describedby"]}
                type="file"
                accept="application/pdf,image/jpeg,image/png"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setDoc({ name: file.name, size: file.size });
                  e.target.value = "";
                }}
              />
              {doc ? (
                <FileList label="Supporting document" files={[{ id: "doc", name: doc.name, size: doc.size, state: "ready" }]} onRemove={() => setDoc(null)} />
              ) : (
                <Button appearance="outlined" size="sm" onClick={() => fileInput.current?.click()}>
                  <Icon name="upload" size={16} aria-hidden /> Choose File
                </Button>
              )}
            </div>
          )}
        </FormField>

        <Alert status="info">Payments continue to the current account until the Ministry approves this request.</Alert>
      </div>
    </Modal>
  );
}
