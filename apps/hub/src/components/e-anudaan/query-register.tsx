"use client";

/**
 * Queries / Finance Queries — the query log.
 *
 * Audit O-08, 16 Sep 2026: the Programme Division's register was "PD Queries", and in a portal
 * whose top decision-maker is the Programme Director that read as queries the Director raised. It
 * is "Queries", as its siblings are "Returned Applications" and "Rejected Applications". A query
 * addressed to this officer whose file is with them now offers "Review" (the file is theirs to act
 * on), not only "View"; "Respond and Send Back" is outlined, not a filled button on every row.
 *
 * DS Audit: WorklistScreen ✅ existing · SegmentedControl ✅ · Badge ✅ · Button ✅ · Modal ✅ ·
 * DescriptionList ✅ · FormField ✅ · Textarea ✅ · Icon ✅ · useToast ✅ · screenCopy ✅ — nothing new.
 *
 * Live shows each query's text, who raised it and when, an Open / Responded filter, and "Respond &
 * Send Back" beside "View Application". Ours reused the queue table with "Returned for Rework" and
 * nothing else (inventory §20, §25).
 *
 * The Open view is the same set of files as the dashboard's "Returned for Rework" figure
 * (`queryRowsFor` is built on `queriesFor`), so the tile and this list cannot disagree.
 */

import * as React from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  DescriptionList,
  FormField,
  Icon,
  Modal,
  SegmentedControl,
  Textarea,
  WorklistScreen,
  buttonClasses,
  screenCopy,
  useToast,
  type WorklistColumn,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { GRADE_FULL, ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { RETURN } from "@/lib/e-anudaan/glossary";
import { formatDate } from "@/lib/e-anudaan/format";
import { queryRowsFor, type QueryRow } from "@/lib/e-anudaan/registers";
import { seatName } from "@/lib/e-anudaan/workflow";
import { holderIsRole } from "@/lib/e-anudaan/types";
import { RefText, RowLinkIcon, useWorklistOptions, splitRowActions } from "./worklist-table";

type View = "open" | "responded";

function raisedBy(row: QueryRow): string {
  const r = ROLES[row.query.raisedBy];
  if (!r) return "";
  return r.grade ? `${r.personName}, ${GRADE_FULL[r.grade]}` : `${r.personName}, ${r.label}`;
}

export function QueryRegister({ title }: { title: string }) {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  const key = role ? reviewKeyOf(role) : null;
  const opts = useWorklistOptions(undefined, undefined, { withPlace: true, withNgoLink: true });
  const [view, setView] = React.useState<View>("open");
  const [responding, setResponding] = React.useState<QueryRow | null>(null);

  const all = React.useMemo(() => (role ? queryRowsFor(state, role.id) : []), [state, role]);
  const open = all.filter((r) => r.open);
  const responded = all.filter((r) => !r.open);
  const rows = view === "open" ? open : responded;

  const columns: WorklistColumn<QueryRow>[] = [
    {
      key: "project",
      header: "Project ID",
      priority: 1,
      exportValue: (r) => `${r.app.institutionId} (${r.app.id})`,
      render: (r) => (
        <span className="block">
          <span className="block whitespace-nowrap font-mono font-semibold text-ink">{r.app.institutionId}</span>
          <RefText value={r.app.id} className="mt-0.5 block font-mono text-body-3 text-ink-muted" />
          {/* Linked, as in every officer list (audit O-06). */}
          <Link href={opts.ngoHref!(r.app.ngoId)} className="mt-0.5 block text-body-3 text-[var(--sa-text-brand-primary-base)] underline-offset-2 hover:underline">
            {opts.ngoName?.(r.app.ngoId)}
          </Link>
        </span>
      ),
    },
    {
      key: "query",
      header: "Query",
      priority: 2,
      exportValue: (r) => r.query.detail,
      render: (r) => (
        <span className="block min-w-[14rem]">
          <span className="block text-ink">{r.query.detail || "—"}</span>
          <span className="mt-1 block text-body-3 text-ink-muted">
            Raised by {raisedBy(r)} on {formatDate(r.query.raisedAt)}
          </span>
        </span>
      ),
    },
    {
      key: "with",
      header: "Asked Of",
      priority: 3,
      exportValue: (r) => GRADE_FULL[r.query.returnedTo],
      render: (r) => <span className="block min-w-[8rem]">{GRADE_FULL[r.query.returnedTo]}</span>,
    },
    {
      key: "status",
      header: "Status",
      priority: 2,
      exportValue: (r) => (r.open ? "Open" : `Responded ${r.query.resolvedAt ? formatDate(r.query.resolvedAt) : ""}`),
      render: (r) => (
        <span className="block">
          <Badge status={r.open ? "warning" : "success"}>
            <Icon name={r.open ? "help" : "task_alt"} size={16} aria-hidden /> {r.open ? "Open" : "Responded"}
          </Badge>
          {r.query.resolvedAt && <span className="mt-1 block whitespace-nowrap text-body-3 text-ink-muted">{formatDate(r.query.resolvedAt)}</span>}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      priority: 3,
      noExport: true,
      className: "is-sticky-right",
      render: (r) => {
        const withMe = !!role && holderIsRole(r.app.holder, role.id);
        const verb = withMe ? "Review" : "View";
        return (
          <span className="flex flex-col items-start gap-1">
            {r.canRespond && (
              <Button size="sm" appearance="outlined" nowrap onClick={() => setResponding(r)} aria-label={`Respond and send back project ${r.app.institutionId}`}>
                {RETURN.respond}
              </Button>
            )}
            {key && (
              <Link
                href={`/portals/e-anudaan/dashboard/sm2/${key}/review/${encodeURIComponent(r.app.id)}`}
                className={buttonClasses("primary", "text", "sm", "whitespace-nowrap")}
                aria-label={`${verb} project ${r.app.institutionId}`}
              >
                {verb}
                <RowLinkIcon />
              </Link>
            )}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <WorklistScreen<QueryRow>
        title={title}
        meta="Queries raised on files, by you or to you, with their answers."
        {...splitRowActions(columns)}
        rows={rows}
        registerTotal={all.length}
        getRowId={(r) => r.id}
        noun="query"
        pluralNoun="queries"
        countLine={null}
        /* A view switch, not a filter: drawn under the header with no grey frame (audit X-05). */
        views={
          <SegmentedControl<View>
            ariaLabel="Show queries"
            value={view}
            onChange={setView}
            options={[
              { value: "open", label: `Open (${open.length})` },
              { value: "responded", label: `Responded (${responded.length})` },
            ]}
          />
        }
        copy={screenCopy({
          loadingLabel: "Loading queries",
          emptyTitle: view === "open" ? "No Open Queries" : "No Responded Queries",
          emptyDescription: view === "open" ? "No file is waiting on an answer to a query, from you or to you." : "No query you raised or were asked has been answered yet.",
          filteredTitle: "No Query Matches",
          clearFiltersLabel: "Clear Filters",
        })}
      />
      {responding && <RespondDialog key={responding.id} row={responding} onClose={() => setResponding(null)} />}
    </>
  );
}

function RespondDialog({ row, onClose }: { row: QueryRow; onClose: () => void }) {
  const { act } = useEAnudaan();
  const { toast } = useToast();
  const [remarks, setRemarks] = React.useState("");
  const [tried, setTried] = React.useState(false);

  const submit = () => {
    setTried(true);
    if (!remarks.trim()) return;
    const res = act(row.app.id, "resolveQuery", { remarks });
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    toast(`Query answered. File sent to ${seatName(res.app.holder)}.`, "success");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      dirty={remarks.trim() !== ""}
      title="Respond and Send Back"
      footer={
        <div className="flex justify-end gap-2">
          <Button appearance="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit}>Send Back with Response</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <DescriptionList
          layout="inline"
          columns={1}
          size="sm"
          items={[
            { term: "Project ID", value: row.app.institutionId },
            { term: "Application", value: <RefText value={row.app.id} className="font-mono" /> },
            { term: "Query", value: row.query.detail },
            { term: "Raised By", value: `${raisedBy(row)}, ${formatDate(row.query.raisedAt)}` },
          ]}
        />
        <FormField
          label="Your Response"
          id="query-response"
          required
          error={tried && !remarks.trim() ? "Write your response to the query." : undefined}
          characterCount={{ value: remarks, maxLength: 1000 }}
        >
          {(c) => <Textarea {...c} rows={4} maxLength={1000} value={remarks} onChange={(e) => setRemarks(e.target.value)} />}
        </FormField>
      </div>
    </Modal>
  );
}
