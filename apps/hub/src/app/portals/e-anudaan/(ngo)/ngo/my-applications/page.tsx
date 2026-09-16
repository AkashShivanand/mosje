"use client";

/**
 * My Applications — the applicant's register of every grant application.
 *
 * DS Audit: WorklistScreen ✅ existing · Badge ✅ · Button ✅ · Chip ✅ · Icon ✅ · Input ✅ ·
 * Select ✅ · SectionTitle ✅ · ListGroup / ListRow ✅ · Modal ✅ — nothing new. WorklistScreen has
 * no slot between its header and its filters, so the Saved Drafts section sits below the
 * register and the header's meta line links to it (gap reported, serious audit UX-04). The table, its pager, the count line, the empty and
 * filtered-to-nothing states and the phone's card list are all the template's.
 *
 * Header, search placeholder, scheme filter, the six status chips, the nine columns and the
 * "Showing 1–10 of N" pager are all transcribed from the live screen (walkthrough 2026-08-22).
 *
 * Design-director audit, 16 Sep 2026 (N-06, N-08, N-01):
 *  • The reference led every row and wrapped to four monospaced lines, so ten rows ran ~1,000px.
 *    The project leads now, with the Project ID and the reference as one line of secondary text;
 *    a long reference is shortened in the middle and read out in full.
 *  • The status badge never shrinks below its words ("Action Requir" at 1440).
 *  • The page action is "Apply for Grant", as the sidebar and the dashboard name it.
 *  • The count reads "95 applications", not the register's "95 in the register."
 *  • `?claim=ready` narrows the list to instalments open to claim — the dashboard's "View All".
 */

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Badge,
  Button,
  Chip,
  Icon,
  Input,
  Link,
  ListGroup,
  ListRow,
  Modal,
  SectionTitle,
  Select,
  WorklistScreen,
  useToast,
  type WorklistColumn,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import {
  NGO_STATUS_FILTERS,
  formatDate,
  formatGrant,
  matchesNgoFilter,
  ngoApplications,
  ngoStatusLabel,
  statusTone,
  type NgoStatusFilter,
} from "@/lib/e-anudaan/selectors";
import type { GrantApplication } from "@/lib/e-anudaan/types";
import { activeKey, draftFromRegister, hasAnswers, listDrafts, parseDraft, type DraftListing } from "@/lib/e-anudaan/drafts";
import { formatDateTime } from "@/lib/e-anudaan/format";
import { caseLabel } from "@/lib/e-anudaan/applicant";
import { instalmentLabel, nextInstalmentNotice } from "@/lib/e-anudaan/instalments";

/** Every entry in this browser's localStorage, for the draft listing. */
function storageEntries(): [string, string | null][] {
  try {
    const ls = window.localStorage;
    return Array.from({ length: ls.length }, (_, i) => ls.key(i)).filter((k): k is string => k != null).map((k) => [k, ls.getItem(k)]);
  } catch {
    return [];
  }
}
import { routeOnClick } from "@/components/e-anudaan/ngo-shell";
import { ngoScheme } from "@/components/e-anudaan/ngo-schemes";

/** The short names a table cell has room for — never the internal code "SHRESHTA_M2". */
const schemeShort = (code: string) => ngoScheme(code).short;
/** The full "Acronym — Full name", where a control has the room. */
const schemeTitle = (code: string) => ngoScheme(code).title;

/**
 * A reference on one line. `GIA/2026-27/SHRESHTA_M2/NORTH_WEST_DELHI/00001` keeps its year and its
 * serial — the two parts an applicant quotes — and shortens the middle; the full reference is the
 * tooltip and what a screen reader hears.
 */
function Reference({ id }: { id: string }) {
  const parts = id.split("/");
  const short = parts.length > 3 && id.length > 24 ? `${parts[0]}/${parts[1]}/…/${parts[parts.length - 1]}` : id;
  return (
    <span className="whitespace-nowrap tabular-nums" title={short === id ? undefined : id}>
      <span aria-hidden={short === id ? undefined : true}>{short}</span>
      {short === id ? null : <span className="sr-only">{id}</span>}
    </span>
  );
}

export default function MyApplicationsPage() {
  return (
    <React.Suspense fallback={null}>
      <MyApplications />
    </React.Suspense>
  );
}

function MyApplications() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  /** `?claim=ready` — only projects whose next instalment can be claimed now. */
  const claimReady = params.get("claim") === "ready";
  const setClaimReady = (on: boolean) => {
    const next = new URLSearchParams(params.toString());
    if (on) next.set("claim", "ready");
    else next.delete("claim");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const { state } = useEAnudaan();
  const { toast } = useToast();
  const [filter, setFilter] = React.useState<NgoStatusFilter>("All");
  const [scheme, setScheme] = React.useState("");
  const [query, setQuery] = React.useState("");

  const ngo = state.ngos[0];

  /**
   * Applications started and not yet submitted (serious audit UX-04). A draft lives on this
   * device, not in the register, so it was listed nowhere: the only way back was to start the
   * same scheme again. The portal shell renders nothing until the store has hydrated, so reading
   * storage in the initialiser cannot mismatch the server render.
   */
  const [drafts, setDrafts] = React.useState<DraftListing[]>(() =>
    typeof window === "undefined" ? [] : listDrafts(storageEntries(), ngo?.id),
  );
  const [discarding, setDiscarding] = React.useState<DraftListing | null>(null);
  /** A Draft row whose form would replace a different saved draft of the same scheme, awaiting a choice. */
  const [replacing, setReplacing] = React.useState<GrantApplication | null>(null);
  React.useEffect(() => {
    const refresh = () => setDrafts(listDrafts(storageEntries(), ngo?.id));
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [ngo?.id]);

  const continueDraft = (d: DraftListing) => {
    // The applicant has chosen to resume, so the form carries the draft on rather than offering it.
    window.sessionStorage.setItem(activeKey(d.code), "1");
    router.push(d.route);
  };
  /**
   * A Draft row opens its form on the Review step (audit C4 · S15). It used to carry a Submit
   * button that filed the draft in one click, without any of the checks the form runs.
   *
   * The form holds one saved draft per scheme. If this row's draft is already the one saved, it
   * resumes where it was left; if a different draft of the scheme is saved, the applicant chooses.
   */
  const openRegisterDraft = (a: GrantApplication, replace = false) => {
    const opened = draftFromRegister(a);
    if (!opened) {
      toast("This draft cannot be opened.", "error");
      return;
    }
    let saved = null;
    try {
      saved = parseDraft(window.localStorage.getItem(opened.key));
    } catch {
      saved = null;
    }
    const own = drafts.find((d) => d.key === opened.key);
    if (hasAnswers(saved) && saved.registerId === a.id && own) {
      continueDraft(own);
      return;
    }
    if (hasAnswers(saved) && !replace) {
      setReplacing(a);
      return;
    }
    try {
      window.localStorage.setItem(opened.key, JSON.stringify(opened.draft));
    } catch {
      toast("This draft could not be opened on this device. Try again.", "error");
      return;
    }
    setReplacing(null);
    window.sessionStorage.setItem(activeKey(a.schemeCode), "1");
    router.push(opened.route);
  };
  const discard = (d: DraftListing) => {
    try {
      window.localStorage.removeItem(d.key);
    } catch {
      /* nothing to remove */
    }
    setDrafts(listDrafts(storageEntries(), ngo?.id));
    setDiscarding(null);
    toast(`The ${schemeShort(d.code)} draft was discarded.`, "success");
  };
  const all = React.useMemo(() => (ngo ? ngoApplications(state, ngo.id) : []), [state, ngo]);

  const schemes = React.useMemo(
    () => Array.from(new Set(all.map((a) => a.schemeCode))).sort(),
    [all],
  );

  const rows = all.filter((a) => {
    if (!matchesNgoFilter(a, filter)) return false;
    if (claimReady && !nextInstalmentNotice(state, a)?.href) return false;
    if (scheme && a.schemeCode !== scheme) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const hay = `${a.id} ${a.schemeCode} ${a.projectLabel}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const COLUMNS: WorklistColumn<GrantApplication>[] = [
    // A year, an amount and a date are read as one token each and never wrap ("GIA/2026-" over
    // "27/…" split the year in two). A reference is too long to hold on one line beside eight
    // other columns, so it breaks only BETWEEN its segments, after a slash.
    /* The project is what an applicant recognises their own application by, so it leads. The
       Project ID (how the Ministry refers to the project, inventory §2, A26) and the reference sit
       under it on one line. The year has its own column. */
    {
      key: "projectLabel",
      header: "Project",
      priority: 1,
      exportValue: (a) => `${a.projectLabel.split(" · ")[0]} (${a.institutionId}) ${a.id}`,
      render: (a) => (
        <span className="block min-w-[14rem]">
          <span className="block font-semibold text-ink">{a.projectLabel.split(" · ")[0]}</span>
          {/* One line where the table has room; on a narrow screen it breaks between the two IDs,
              never inside one. */}
          <span className="block text-body-3 tabular-nums text-ink-muted">
            <span className="whitespace-nowrap">{a.institutionId}</span> · <Reference id={a.id} />
          </span>
        </span>
      ),
    },
    { key: "schemeCode", header: "Scheme", priority: 2, render: (a) => schemeShort(a.schemeCode), exportValue: (a) => schemeShort(a.schemeCode) },
    // New file or which instalment — a renewal could not be told from a new file in the list.
    {
      key: "caseType",
      header: "Instalment",
      priority: 2,
      exportValue: (a) => `${caseLabel(a)} · FY ${a.financialYear}`,
      render: (a) => {
        // On the project's latest sanctioned file: whether the next instalment is open to claim —
        // it opens once this one is released — or what it is waiting for (review call, T669–671).
        const next = nextInstalmentNotice(state, a);
        // A saved draft of that claim is continued, not started again (batch B4's `draft`).
        const hasDraft = !!next && "draft" in next && !!(next as { draft?: unknown }).draft;
        return (
          <span className="flex flex-col items-start gap-0.5">
            <span className="whitespace-nowrap">{caseLabel(a)}</span>
            {/* The year sits under the case rather than in a column of its own, so the table fits
                a 1280 screen without scrolling the Status column under the pinned Actions. */}
            <span className="whitespace-nowrap text-body-3 text-ink-muted">FY {a.financialYear}</span>
            {next?.href ? (
              <Link size="sm" href={next.href} onClick={routeOnClick(router, next.href)}>
                {hasDraft ? "Continue Draft" : `Claim ${instalmentLabel(next.plan.instalment ?? 1)}`}
              </Link>
            ) : next ? (
              <span className="text-body-3 text-ink-muted">{next.title}.</span>
            ) : null}
          </span>
        );
      },
    },
    /* One amount column: what was sanctioned once there is a sanction, what was requested until
       then, each named. Two columns, one of them "—" on most rows, pushed the table past a 1280
       screen and slid Status under the pinned Actions column (N-06). */
    {
      key: "total",
      header: "Amount",
      priority: 2,
      exportValue: (a) => (a.sanction ? `Sanctioned ${formatGrant(a.sanction.total)}` : `Requested ${formatGrant(a.total)}`),
      render: (a) => (
        <span className="flex flex-col items-start gap-0.5 whitespace-nowrap">
          <span className="tabular-nums">{formatGrant(a.sanction ? a.sanction.total : a.total)}</span>
          <span className="text-body-3 text-ink-muted">{a.sanction ? "Sanctioned" : "Requested"}</span>
        </span>
      ),
    },
    { key: "submittedAt", header: "Submitted", priority: 3, render: (a) => <span className="whitespace-nowrap">{a.submittedAt ? formatDate(a.submittedAt) : "—"}</span> },
    {
      key: "status",
      header: "Status",
      priority: 2,
      // Never ellipsised: it is the one cell an applicant scans the list for (N-06).
      render: (a) => (
        <span className="inline-block whitespace-nowrap">
          <Badge status={statusTone(a.status)}>{ngoStatusLabel(a)}</Badge>
        </span>
      ),
    },
  ];

  const rowAction = (a: GrantApplication) =>
    a.status === "Draft" ? (
      <Button size="sm" nowrap onClick={() => openRegisterDraft(a)} aria-label={`Continue draft ${a.id}`}>
        Continue
      </Button>
    ) : (
      <Link
        variant="standalone"
        size="sm"
        className="whitespace-nowrap"
        href={`/portals/e-anudaan/ngo/my-applications/${encodeURIComponent(a.id)}`}
        onClick={routeOnClick(router, `/portals/e-anudaan/ngo/my-applications/${encodeURIComponent(a.id)}`)}
        aria-label={`View application ${a.id}`}
        iconRight={<Icon name="arrow_forward" size={16} aria-hidden />}
      >
        View
      </Link>
    );

  /* The REAL predicate, not the presence of a control. A default "All schemes"
     and the "All" status chip are not filters, and counting them would tell an
     applicant with no applications to try clearing filters they never set. */
  const activeFilterCount =
    (filter !== "All" ? 1 : 0) + (scheme ? 1 : 0) + (query.trim() ? 1 : 0) + (claimReady ? 1 : 0);

  const clearFilters = () => {
    setFilter("All");
    setScheme("");
    setQuery("");
    if (claimReady) setClaimReady(false);
  };

  return (
    <div className="space-y-8">
    <WorklistScreen
      title="My Applications"
      meta={
        drafts.length > 0 ? (
          <>
            Every grant application from your organisation, including drafts.{" "}
            <Link href="#saved-drafts">
              {drafts.length} saved {drafts.length === 1 ? "draft" : "drafts"} not yet submitted
            </Link>
          </>
        ) : (
          "Every grant application from your organisation, including drafts."
        )
      }
      columns={COLUMNS}
      rows={rows}
      registerTotal={all.length}
      countLine={
        rows.length === all.length
          ? `${all.length.toLocaleString("en-IN")} application${all.length === 1 ? "" : "s"}.`
          : `Showing ${rows.length.toLocaleString("en-IN")} of ${all.length.toLocaleString("en-IN")} applications, filtered.`
      }
      getRowId={(a) => a.id}
      noun="application"
      rowActions={rowAction}
      activeFilterCount={activeFilterCount}
      onClearFilters={clearFilters}
      actions={
        <Button appearance="filled" onClick={() => router.push("/portals/e-anudaan/apply-grant")}>
          <Icon name="add" size={16} aria-hidden /> Apply for Grant
        </Button>
      }
      filters={
        <>
          <div>
            <label htmlFor="app-search" className="sr-only">
              Search applications
            </label>
            <Input
              id="app-search"
              type="search"
              value={query}
              placeholder="Search by reference, scheme, project..."
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="scheme-filter" className="sr-only">
              Filter by scheme
            </label>
            <Select
              id="scheme-filter"
              aria-label="Filter by scheme"
              value={scheme}
              onChange={(e) => setScheme(e.target.value)}
            >
              <option value="">All schemes</option>
              {schemes.map((code) => (
                <option key={code} value={code}>
                  {schemeTitle(code)}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
              {NGO_STATUS_FILTERS.map((f) => (
                <Chip key={f} size="sm" selected={filter === f} onSelectedChange={() => setFilter(f)}>
                  {f}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by instalment">
              <Chip size="sm" selected={claimReady} onSelectedChange={() => setClaimReady(!claimReady)}>
                Instalment Ready to Claim
              </Chip>
            </div>
          </div>
        </>
      }
      copy={{
        idleTitle: "Search the Register",
        loadingLabel: "Loading your applications",
        errorTitle: "This Information Could Not Be Loaded",
        errorDescription: "The service did not respond. Please try again.",
        retryLabel: "Try Again",
        /* Two different sentences, because they need two different actions:
           nothing applied for yet, versus applied for but excluded by a filter
           the applicant themselves set. */
        emptyTitle: "No Applications Yet",
        emptyDescription: "Start an application and it will appear here.",
        filteredTitle: "No Applications Match These Filters",
        filteredDescription: "Clear the filters to see every application from your organisation.",
        clearFiltersLabel: "Clear Filters",
      }}
    />

    {drafts.length > 0 && (
      <section id="saved-drafts" className="space-y-3">
        <SectionTitle title="Saved Drafts" description="Applications started on this device and not yet submitted." />
        <ListGroup bordered divided>
          {drafts.map((d) => {
            const short = schemeShort(d.code);
            const actions = (
              <>
                <Button size="sm" onClick={() => continueDraft(d)} aria-label={`Continue the ${short} draft`}>
                  Continue
                </Button>
                <Button appearance="text" size="sm" onClick={() => setDiscarding(d)} aria-label={`Discard the ${short} draft`}>
                  Discard
                </Button>
              </>
            );
            return (
              <ListRow
                key={d.key}
                title={schemeTitle(d.code)}
                description={
                  <>
                    <span className="block">
                      Step {d.step.index + 1} of {d.step.total}: {d.step.title}
                    </span>
                    {d.savedAt && <span className="block">Last saved {formatDateTime(d.savedAt)}</span>}
                    {/* On a phone the actions go under the text: beside it they left the text a
                        100px column that broke the scheme's name a word to a line. */}
                    <span className="mt-2 flex flex-wrap items-center gap-2 sm:hidden">{actions}</span>
                  </>
                }
                trailing={<span className="hidden flex-wrap items-center gap-2 sm:flex">{actions}</span>}
              />
            );
          })}
        </ListGroup>
      </section>
    )}

    <Modal
      open={replacing != null}
      onClose={() => setReplacing(null)}
      title="Replace Saved Draft?"
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button appearance="outlined" onClick={() => setReplacing(null)}>
            Keep Saved Draft
          </Button>
          <Button onClick={() => replacing && openRegisterDraft(replacing, true)}>Replace and Continue</Button>
        </div>
      }
    >
      <p className="text-body-2">
        A different {replacing ? schemeTitle(replacing.schemeCode) : ""} application is saved on this device. Continuing draft {replacing?.id} replaces it, and its answers cannot be recovered.
      </p>
    </Modal>

    <Modal
      open={discarding != null}
      onClose={() => setDiscarding(null)}
      title="Discard Saved Draft?"
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button appearance="outlined" onClick={() => setDiscarding(null)}>
            Keep Draft
          </Button>
          <Button variant="danger" onClick={() => discarding && discard(discarding)}>
            Discard Draft
          </Button>
        </div>
      }
    >
      <p className="text-body-2">
        The answers and documents saved for this {discarding ? schemeTitle(discarding.code) : ""} application will be deleted. This cannot be undone.
      </p>
    </Modal>
    </div>
  );
}
