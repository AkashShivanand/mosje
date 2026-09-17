"use client";

/**
 * The receiving desk for a project change the NGO has asked for — the Joint Secretary's Bank
 * Account Changes and the PMU's Location Changes. One screen for both, because they are the same
 * job: read the request against what the Ministry holds, then decide it with remarks the NGO sees.
 *
 * DS Audit: WorklistScreen ✅ existing · SegmentedControl ✅ · Badge ✅ · Button ✅ · Modal ✅ ·
 * DescriptionList ✅ · FormField ✅ · Textarea ✅ · Alert ✅ · Icon ✅ · Link ✅ · useToast ✅ ·
 * screenCopy ✅ — nothing new.
 *
 * Live: "SHRESHTA Mode-2 — Project Bank-Account Change" (SM2 JS-PD) and "Project Location Change"
 * (AVYAY PMU), each with Pending / All (parity inventory §36, §40).
 */

import * as React from "react";
import { splitRowActions } from "./worklist-table";
import {
  Alert,
  Badge,
  Button,
  DescriptionList,
  FormField,
  Icon,
  Link,
  Modal,
  SegmentedControl,
  Textarea,
  WorklistScreen,
  screenCopy,
  useToast,
  type WorklistColumn,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { accountsFor, maskedAccount, projectName } from "@/lib/e-anudaan/applicant";
import {
  bankChangeQueue,
  currentAddressOf,
  locationChangeQueue,
  locationCheckFor,
  projectOwner,
  requestStatusLabel,
  requestStatusTone,
  type ChangeDecision,
  type QueueView,
} from "@/lib/e-anudaan/change-requests";
import { farLine, type LocationCheck } from "@/lib/e-anudaan/district-centres";
import { formatDate } from "@/lib/e-anudaan/format";
import { ROLES } from "@/lib/e-anudaan/roles";
import type { BankChangeRequest, ChangeRequest, LocationChangeRequest } from "@/lib/e-anudaan/types";
import { changeDecisionError } from "@/lib/e-anudaan/officer-forms";
import type { DemoFormPreset } from "@/lib/e-anudaan/demo-forms";
import {
  BANK_CHANGE_APPROVE,
  BANK_CHANGE_REFUSE,
  LOCATION_CHANGE_APPROVE,
  LOCATION_CHANGE_REFUSE,
} from "@/lib/e-anudaan/demo-forms/change-request-decisions";
import { useDemoFormFill } from "./use-demo-form-fill";

/** A demo dock fill the decision dialog opens with. */
interface DecisionDemoFill {
  remarks: string;
  valid: boolean;
  n: number;
}

type Kind = "bank" | "location";

const COPY: Record<Kind, { title: string; meta: string; noun: string; approve: string; reject: string; approved: string; rejected: string }> = {
  bank: {
    title: "Bank Account Changes",
    meta: "Requests from NGOs to change the account a project is paid into. Payments continue to the current account until a request is approved.",
    noun: "request",
    // The decision's words are the glossary's (CHANGE_REQUEST_DECISION): the row the officer then
    // sees reads "Approved" or "Not Approved", so the buttons that produce it say the same.
    approve: "Approve",
    reject: "Do Not Approve",
    approved: "Request approved. The new account is now the project's account, and the NGO has been notified.",
    rejected: "Request not approved. The NGO has been notified with your remarks.",
  },
  location: {
    title: "Location Changes",
    meta: "Requests from NGOs to record a new address for a project within its district.",
    noun: "request",
    approve: "Approve",
    reject: "Do Not Approve",
    approved: "Request approved. The project's address is updated, and the NGO has been notified.",
    rejected: "Request not approved. The NGO has been notified with your remarks and may raise a new request.",
  },
};

function accountLine(a: { bank: string; last4: string; ifsc: string; branch: string }): string {
  return `${a.bank} · ${maskedAccount(a.last4)} · ${a.ifsc} · ${a.branch}`;
}

export function ChangeRequestDesk({ kind }: { kind: Kind }) {
  const { state } = useEAnudaan();
  const { toast } = useToast();
  const [view, setView] = React.useState<QueueView>("Pending");
  const [open, setOpen] = React.useState<ChangeRequest | null>(null);
  const [demo, setDemo] = React.useState<DecisionDemoFill | null>(null);
  const copy = COPY[kind];

  /*
   * The demo dock's fills (demo-forms/change-request-decisions.ts): open a pending request — for an
   * approval one that can be approved as it stands, for a refusal one with something wrong where the
   * register has one — filled, with the message shown for a rule preset.
   */
  const fillDecision = (approve: boolean) => (v: Readonly<Record<string, string>>, preset: DemoFormPreset) => {
    const pendingRows: ChangeRequest[] = kind === "bank" ? bankChangeQueue(state, "Pending") : locationChangeQueue(state, "Pending");
    const flawed = (r: ChangeRequest) =>
      r.kind === "bank" ? !r.pfmsRegistered : locationCheckFor(state, r).kind === "far";
    const request = pendingRows.find((r) => flawed(r) !== approve) ?? pendingRows[0];
    if (!request) {
      toast("No request awaits a decision.", "info");
      return;
    }
    setView("Pending");
    setDemo({ remarks: v.remarks ?? "", valid: !!preset.valid, n: Date.now() });
    setOpen(request);
  };
  useDemoFormFill(BANK_CHANGE_APPROVE.id, fillDecision(true));
  useDemoFormFill(BANK_CHANGE_REFUSE.id, fillDecision(false));
  useDemoFormFill(LOCATION_CHANGE_APPROVE.id, fillDecision(true));
  useDemoFormFill(LOCATION_CHANGE_REFUSE.id, fillDecision(false));

  const rows: ChangeRequest[] = kind === "bank" ? bankChangeQueue(state, view) : locationChangeQueue(state, view);
  const total = kind === "bank" ? bankChangeQueue(state, "All").length : locationChangeQueue(state, "All").length;
  const pending = kind === "bank" ? bankChangeQueue(state, "Pending").length : locationChangeQueue(state, "Pending").length;

  const columns = React.useMemo<WorklistColumn<ChangeRequest>[]>(() => {
    const project: WorklistColumn<ChangeRequest> = {
      key: "projectId",
      header: "Project",
      priority: 1,
      exportValue: (r) => r.projectId,
      render: (r) => {
        const owner = projectOwner(state, r.projectId);
        return (
          <span className="block">
            <span className="block whitespace-nowrap font-mono font-semibold text-ink">{r.projectId}</span>
            <span className="block text-body-3 text-ink-muted">
              {owner ? `${owner.ngo.name} · ${owner.project.district}, ${owner.project.state}` : ""}
            </span>
          </span>
        );
      },
    };
    const change: WorklistColumn<ChangeRequest> =
      kind === "bank"
        ? {
            key: "change",
            header: "Requested Account",
            priority: 2,
            render: (r) => {
              const b = r as BankChangeRequest;
              return (
                <span className="block min-w-[12rem]">
                  <span className="block text-ink">{accountLine(b)}</span>
                  <span className="block text-body-3 text-ink-muted">PFMS: {b.pfmsRegistered ? "Registered" : "Not registered"}</span>
                </span>
              );
            },
          }
        : {
            key: "change",
            header: "Requested Address",
            priority: 2,
            render: (r) => {
              const check = locationCheckFor(state, r as LocationChangeRequest);
              return (
                <span className="block min-w-[12rem]">
                  <span className="block text-ink">{(r as LocationChangeRequest).address}</span>
                  <PositionBadge check={check} />
                </span>
              );
            },
          };
    return [
      project,
      change,
      { key: "reason", header: "Reason", priority: 3, render: (r) => <span className="block min-w-[10rem]">{r.reason}</span> },
      { key: "submittedAt", header: "Requested On", priority: 2, render: (r) => <span className="whitespace-nowrap">{formatDate(r.submittedAt)}</span> },
      {
        key: "status",
        header: "Status",
        priority: 2,
        render: (r) => (
          <span className="block">
            <Badge status={requestStatusTone(r)}>{requestStatusLabel(r)}</Badge>
            {r.decidedAt && <span className="mt-1 block whitespace-nowrap text-body-3 text-ink-muted">{formatDate(r.decidedAt)}</span>}
          </span>
        ),
      },
      {
        key: "action",
        header: "Action",
        priority: 3,
        noExport: true,
        className: "is-sticky-right",
        render: (r) => (
          <Button
            size="sm"
            appearance={r.status === "Pending" ? "outlined" : "text"}
            nowrap
            onClick={() => setOpen(r)}
            aria-label={`${r.status === "Pending" ? "Examine" : "View"} the request for project ${r.projectId}`}
          >
            {r.status === "Pending" ? "Examine" : "View"}
          </Button>
        ),
      },
    ];
  }, [kind, state]);

  return (
    <>
      <WorklistScreen<ChangeRequest>
        title={copy.title}
        meta={copy.meta}
        {...splitRowActions(columns)}
        rows={rows}
        registerTotal={total}
        getRowId={(r) => r.id}
        noun={copy.noun}
        countLine={null}
        /* A view, not a filter: in the filter bar the Pending / All switch sat in a grey framed box
           and read as a filter nobody had set (audit X-05, NOTES: Bank Account Changes). */
        views={
          <SegmentedControl<QueueView>
            ariaLabel="Show requests"
            value={view}
            onChange={setView}
            options={[
              { value: "Pending", label: `Pending (${pending})` },
              { value: "All", label: `All (${total})` },
            ]}
          />
        }
        copy={screenCopy({
          loadingLabel: "Loading requests",
          emptyTitle: view === "Pending" ? "No Request Awaits a Decision" : "No Requests Received",
          emptyDescription: view === "Pending" ? "Every request received has been decided." : undefined,
          filteredTitle: "No Request Matches",
          clearFiltersLabel: "Show All",
        })}
      />
      {open && (
        <DecisionDialog
          key={`${open.id}-${demo?.n ?? 0}`}
          request={open}
          kind={kind}
          demo={demo}
          onClose={() => {
            setOpen(null);
            setDemo(null);
          }}
        />
      )}
    </>
  );
}

function PositionBadge({ check }: { check: LocationCheck }) {
  if (check.kind === "far") {
    return (
      <span className="mt-1 inline-flex">
        <Badge status="danger" size="sm">
          <Icon name="wrong_location" size={16} aria-hidden /> {check.km.toLocaleString("en-IN")} km Outside District
        </Badge>
      </span>
    );
  }
  if (check.kind === "within") {
    return (
      <span className="mt-1 inline-flex">
        <Badge status="success" size="sm">
          <Icon name="where_to_vote" size={16} aria-hidden /> Within District
        </Badge>
      </span>
    );
  }
  return null;
}

function DecisionDialog({
  request,
  kind,
  demo,
  onClose,
}: {
  request: ChangeRequest;
  kind: Kind;
  demo: DecisionDemoFill | null;
  onClose: () => void;
}) {
  const { state, decideChangeRequest } = useEAnudaan();
  const { toast } = useToast();
  const copy = COPY[kind];
  const [remarks, setRemarks] = React.useState(demo?.remarks ?? "");
  const [tried, setTried] = React.useState(demo ? !demo.valid : false);
  const remarksError = changeDecisionError(remarks);
  const owner = projectOwner(state, request.projectId);
  const pending = request.status === "Pending";

  const decide = (decision: ChangeDecision) => {
    setTried(true);
    if (remarksError) return;
    const res = decideChangeRequest(request.id, decision, remarks);
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    toast(decision === "approve" ? copy.approved : copy.rejected, "success");
    onClose();
  };

  const common = [
    { term: "Project", value: owner ? `${request.projectId} — ${projectName(owner.project)}` : request.projectId },
    { term: "NGO", value: owner ? `${owner.ngo.name} (NGO-Darpan ${owner.ngo.darpanId})` : "" },
    { term: "Requested On", value: formatDate(request.submittedAt) },
    { term: "Supporting Document", value: request.documentName ?? "None attached" },
  ];

  let details: { term: string; value: React.ReactNode }[];
  let warning: React.ReactNode = null;
  if (request.kind === "bank") {
    const { current } = accountsFor(state, request.projectId);
    details = [
      { term: "Current Account", value: current ? accountLine(current) : "None recorded" },
      { term: "Requested Account", value: accountLine(request) },
      { term: "PFMS DBT Module", value: request.pfmsRegistered ? "Declared registered" : "Not registered — to be registered before the next release" },
    ];
  } else {
    const check = locationCheckFor(state, request);
    const hasPosition = request.latitude !== undefined && request.longitude !== undefined;
    details = [
      { term: "Current Address", value: currentAddressOf(state, request.projectId) },
      { term: "Requested Address", value: request.address },
      {
        term: "Recorded Position",
        value: hasPosition ? (
          <span className="block">
            <span className="font-mono">
              {request.latitude!.toFixed(4)}, {request.longitude!.toFixed(4)}
            </span>{" "}
            <Link
              href={`https://www.openstreetmap.org/?mlat=${request.latitude}&mlon=${request.longitude}#map=16/${request.latitude}/${request.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Map
            </Link>
            {check.kind === "within" && (
              <span className="block text-body-3 text-ink-muted">About {check.km} km from {check.centre.headquarters}, within {check.centre.district}.</span>
            )}
            {check.kind === "unchecked" && (
              <span className="block text-body-3 text-ink-muted">The distance from the district cannot be checked for this district.</span>
            )}
          </span>
        ) : (
          "Not recorded — the NGO did not use its current location"
        ),
      },
    ];
    if (check.kind === "far") {
      warning = (
        <Alert status="warning" title="Position Outside the Project's District">
          {farLine(check)} A project may move within its district only.
        </Alert>
      );
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      dirty={remarks.trim() !== ""}
      size="lg"
      title={request.kind === "bank" ? "Bank Account Change Request" : "Location Change Request"}
      footer={
        pending ? (
          <div className="flex flex-wrap justify-end gap-2">
            <Button appearance="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant={kind === "bank" ? "danger" : undefined} appearance="outlined" onClick={() => decide("reject")}>
              {copy.reject}
            </Button>
            <Button onClick={() => decide("approve")}>{copy.approve}</Button>
          </div>
        ) : (
          <Button onClick={onClose}>Close</Button>
        )
      }
    >
      <div className="space-y-5">
        <DescriptionList layout="inline" columns={1} size="sm" divided items={[...common, ...details, { term: "Reason", value: request.reason }]} />
        {warning}
        {pending ? (
          <FormField
            label="Remarks"
            id="decision-remarks"
            required
            hint="The NGO is shown these with the decision."
            error={tried ? remarksError : undefined}
            characterCount={{ value: remarks, maxLength: 500 }}
          >
            {(c) => <Textarea {...c} rows={3} maxLength={500} value={remarks} onChange={(e) => setRemarks(e.target.value)} />}
          </FormField>
        ) : (
          <DescriptionList
            layout="inline"
            columns={1}
            size="sm"
            items={[
              { term: "Decision", value: requestStatusLabel(request) },
              { term: "Decided On", value: request.decidedAt ? formatDate(request.decidedAt) : "" },
              { term: "Decided By", value: request.decidedBy ? `${ROLES[request.decidedBy].personName}, ${ROLES[request.decidedBy].label}` : "" },
              { term: "Remarks", value: request.decisionRemarks ?? "" },
            ]}
          />
        )}
      </div>
    </Modal>
  );
}
