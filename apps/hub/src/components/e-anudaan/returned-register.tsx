"use client";

/**
 * Returned Applications / Finance Returned — the files this officer sent back.
 *
 * DS Audit: WorklistScreen ✅ existing · Badge ✅ · Icon ✅ · Search ✅ · FilterSelect ✅ ·
 * screenCopy ✅ — nothing new.
 *
 * Live `/pd/<grade>/rejected` and `/finance/<grade>/rejected` are "Returned Applications" — files
 * "reverted to the previous level", with Returned On, Reason and whether the query was answered.
 * Ours relabelled those paths "Rejected" and listed final rejections only, so a file an officer
 * had sent back was on no register (inventory §18, §24). Rejections keep their own page.
 *
 * `?response=open` and `?fy=` open it pre-filtered: the dashboard's "Returned by You, Awaiting
 * Response" figure links here, and counts with the same `returnedBy` rows and the same two tests
 * (audit O-09). The year is a visible filter, not a hidden one, so the reader can clear it.
 */

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Badge, FilterSelect, Icon, WorklistScreen, buttonClasses, screenCopy, type WorklistColumn } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { formatDate } from "@/lib/e-anudaan/format";
import { returnedBy, type ReturnedRow } from "@/lib/e-anudaan/registers";
import { LabelledSearch, RefText, RowLinkIcon, useWorklistOptions, splitRowActions } from "./worklist-table";

type Answer = "" | "open" | "responded";

export function ReturnedRegister({ title }: { title: string }) {
  return (
    <React.Suspense fallback={null}>
      <Register title={title} />
    </React.Suspense>
  );
}

function Register({ title }: { title: string }) {
  const { state } = useEAnudaan();
  const params = useSearchParams();
  const role = state.session ? ROLES[state.session] : null;
  const key = role ? reviewKeyOf(role) : null;
  const opts = useWorklistOptions(undefined, undefined, { withPlace: true, withNgoLink: true });
  const [q, setQ] = React.useState("");
  const [answer, setAnswer] = React.useState<Answer>(() => {
    const r = params.get("response");
    return r === "open" || r === "responded" ? r : "";
  });
  const [fy, setFy] = React.useState(() => params.get("fy") ?? "");

  const all = React.useMemo(() => (role ? returnedBy(state, role.id) : []), [state, role]);
  const years = React.useMemo(() => [...new Set(all.map((r) => r.app.financialYear))].sort().reverse(), [all]);
  const rows = all.filter((r) => {
    const needle = q.trim().toLowerCase();
    if (answer === "open" && r.responded) return false;
    if (answer === "responded" && !r.responded) return false;
    if (fy && r.app.financialYear !== fy) return false;
    return (
      !needle ||
      r.app.id.toLowerCase().includes(needle) ||
      r.app.institutionId.toLowerCase().includes(needle) ||
      (opts.ngoName?.(r.app.ngoId) ?? "").toLowerCase().includes(needle)
    );
  });

  const columns: WorklistColumn<ReturnedRow>[] = [
    {
      key: "project",
      header: "Project ID",
      priority: 1,
      exportValue: (r) => `${r.app.institutionId} (${r.app.id})`,
      render: (r) => (
        <span className="block">
          <span className="block whitespace-nowrap font-mono font-semibold text-ink">{r.app.institutionId}</span>
          <RefText value={r.app.id} className="mt-0.5 block font-mono text-body-3 text-ink-muted" />
        </span>
      ),
    },
    {
      key: "ngo",
      header: "NGO",
      priority: 2,
      exportValue: (r) => opts.ngoName?.(r.app.ngoId) ?? "",
      render: (r) => (
        <span className="block min-w-[7rem]">
          <Link href={opts.ngoHref!(r.app.ngoId)} className="block text-[var(--sa-text-brand-primary-base)] underline-offset-2 hover:underline">
            {opts.ngoName?.(r.app.ngoId)}
          </Link>
          {(() => {
            const p = opts.placeOf?.(r.app);
            return p ? <span className="block text-body-3 text-ink-muted">{p.district}, {p.state}</span> : null;
          })()}
        </span>
      ),
    },
    {
      key: "returnedOn",
      header: "Returned On",
      priority: 2,
      exportValue: (r) => formatDate(r.entry.at),
      render: (r) => (
        <span className="block">
          <span className="block whitespace-nowrap">{formatDate(r.entry.at)}</span>
          <span className="block text-body-3 text-ink-muted">To {r.returnedTo}</span>
        </span>
      ),
    },
    { key: "reason", header: "Reason", priority: 2, exportValue: (r) => r.reason, render: (r) => <span className="block min-w-[12rem]">{r.reason || "—"}</span> },
    {
      key: "response",
      header: "Response",
      priority: 2,
      exportValue: (r) => (r.responded ? `Responded${r.respondedAt ? ` ${formatDate(r.respondedAt)}` : ""}` : "Awaiting Response"),
      render: (r) => (
        <span className="block">
          <Badge status={r.responded ? "success" : "warning"}>
            <Icon name={r.responded ? "task_alt" : "hourglass_top"} size={16} aria-hidden />
            <span className="whitespace-nowrap">{r.responded ? "Responded" : "Awaiting Response"}</span>
          </Badge>
          {r.respondedAt && <span className="mt-1 block whitespace-nowrap text-body-3 text-ink-muted">{formatDate(r.respondedAt)}</span>}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      priority: 3,
      noExport: true,
      className: "is-sticky-right",
      render: (r) =>
        key ? (
          <Link
            href={`/portals/e-anudaan/dashboard/sm2/${key}/review/${encodeURIComponent(r.app.id)}`}
            className={buttonClasses("primary", "text", "sm", "whitespace-nowrap")}
            aria-label={`View project ${r.app.institutionId}`}
          >
            View
            <RowLinkIcon />
          </Link>
        ) : null,
    },
  ];

  const active = (q.trim() ? 1 : 0) + (answer ? 1 : 0) + (fy ? 1 : 0);

  return (
    <WorklistScreen<ReturnedRow>
      title={title}
      meta="Files you sent back — with a query to the level below, or to the NGO — and whether each has been answered."
      {...splitRowActions(columns)}
      rows={rows}
      registerTotal={all.length}
      getRowId={(r) => r.app.id}
      noun="application"
      activeFilterCount={active}
      onClearFilters={() => {
        setQ("");
        setAnswer("");
        setFy("");
      }}
      filters={
        <>
          <LabelledSearch label="Search" value={q} onChange={setQ} placeholder="Project ID, application or NGO" />
          <FilterSelect
            label="Response"
            value={answer}
            onChange={(v) => setAnswer(v as Answer)}
            options={[
              { value: "", label: "All" },
              { value: "open", label: "Awaiting Response" },
              { value: "responded", label: "Responded" },
            ]}
          />
          <FilterSelect
            label="Financial Year"
            value={fy}
            onChange={setFy}
            options={[{ value: "", label: "All Years" }, ...[...new Set([...years, ...(fy ? [fy] : [])])].map((y) => ({ value: y, label: `FY ${y}` }))]}
          />
        </>
      }
      copy={screenCopy({
        loadingLabel: "Loading returned applications",
        emptyTitle: "No Applications Returned",
        emptyDescription: "You have not sent any application back.",
        filteredTitle: "No Returned Application Matches",
        filteredDescription: "Clear the filters to see every file you returned.",
        clearFiltersLabel: "Clear Filters",
      })}
    />
  );
}
