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
 */

import * as React from "react";
import { useRouter } from "next/navigation";
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

/** The short names a table cell has room for — never the internal code "SHRESHTA_M2". */
const SCHEME_SHORT: Record<string, string> = {
  AVYAY: "AVYAY",
  SHRESHTA_M2: "SHRESHTA Mode 2",
  SMILE: "SMILE",
  NAPDDR: "NAPDDR",
};

const SCHEME_LABELS: Record<string, string> = {
  AVYAY: "AVYAY (Atal Vayo Abhyuday Yojana)",
  SHRESHTA_M2: "SHRESHTA Mode 2",
  SMILE: "SMILE (Garima Greh)",
  NAPDDR: "NAPDDR",
};


/** A reference number that wraps only after a "/", never inside a segment. */
function Reference({ id }: { id: string }) {
  const parts = id.split("/");
  return (
    <span className="font-mono">
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          <span className="whitespace-nowrap">
            {part}
            {i < parts.length - 1 ? "/" : ""}
          </span>
          {i < parts.length - 1 && <wbr />}
        </React.Fragment>
      ))}
    </span>
  );
}

export default function MyApplicationsPage() {
  const router = useRouter();
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
    toast(`The ${SCHEME_SHORT[d.code] ?? d.code} draft was discarded.`, "success");
  };
  const all = React.useMemo(() => (ngo ? ngoApplications(state, ngo.id) : []), [state, ngo]);

  const schemes = React.useMemo(
    () => Array.from(new Set(all.map((a) => a.schemeCode))).sort(),
    [all],
  );

  const rows = all.filter((a) => {
    if (!matchesNgoFilter(a, filter)) return false;
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
    { key: "id", header: "Reference", priority: 2, render: (a) => <Reference id={a.id} />, exportValue: (a) => a.id },
    { key: "schemeCode", header: "Scheme", priority: 2, render: (a) => SCHEME_SHORT[a.schemeCode] ?? a.schemeCode, exportValue: (a) => SCHEME_SHORT[a.schemeCode] ?? a.schemeCode },
    /* The project is what an applicant recognises their own application by. The year has its
       own column, so it is not repeated here. */
    { key: "projectLabel", header: "Project", priority: 1, render: (a) => a.projectLabel.split(" · ")[0] },
    { key: "financialYear", header: "Financial Year", priority: 3, render: (a) => <span className="whitespace-nowrap">{a.financialYear}</span> },
    { key: "total", header: "Requested", priority: 2, render: (a) => <span className="whitespace-nowrap">{formatGrant(a.total)}</span> },
    { key: "sanctioned", header: "Sanctioned", priority: 3, render: (a) => <span className="whitespace-nowrap">{a.sanction ? formatGrant(a.sanction.total) : "—"}</span> },
    { key: "submittedAt", header: "Submitted", priority: 3, render: (a) => <span className="whitespace-nowrap">{a.submittedAt ? formatDate(a.submittedAt) : "—"}</span> },
    {
      key: "status",
      header: "Status",
      priority: 2,
      render: (a) => <Badge status={statusTone(a.status)}>{ngoStatusLabel(a)}</Badge>,
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
    (filter !== "All" ? 1 : 0) + (scheme ? 1 : 0) + (query.trim() ? 1 : 0);

  const clearFilters = () => {
    setFilter("All");
    setScheme("");
    setQuery("");
  };

  return (
    <div className="space-y-8">
    <WorklistScreen
      title="My Applications"
      meta={
        drafts.length > 0 ? (
          <>
            All grant applications submitted by your organisation.{" "}
            <Link href="#saved-drafts">
              {drafts.length} saved {drafts.length === 1 ? "draft" : "drafts"} not yet submitted
            </Link>
          </>
        ) : (
          "All grant applications submitted by your organisation."
        )
      }
      columns={COLUMNS}
      rows={rows}
      registerTotal={all.length}
      getRowId={(a) => a.id}
      noun="application"
      rowActions={rowAction}
      activeFilterCount={activeFilterCount}
      onClearFilters={clearFilters}
      actions={
        <Button appearance="filled" onClick={() => router.push("/portals/e-anudaan/apply-grant")}>
          <Icon name="add" size={16} aria-hidden /> New Application
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
                  {SCHEME_LABELS[code] ?? code}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
            {NGO_STATUS_FILTERS.map((f) => (
              <Chip key={f} size="sm" selected={filter === f} onSelectedChange={() => setFilter(f)}>
                {f}
              </Chip>
            ))}
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
        emptyTitle: "No applications yet.",
        emptyDescription: "Start an application and it will appear here.",
        filteredTitle: "No applications match these filters.",
        filteredDescription: "Clear the filters to see every application from your organisation.",
        clearFiltersLabel: "Clear Filters",
      }}
    />

    {drafts.length > 0 && (
      <section id="saved-drafts" className="space-y-3">
        <SectionTitle title="Saved Drafts" description="Applications started on this device and not yet submitted." />
        <ListGroup bordered divided>
          {drafts.map((d) => {
            const short = SCHEME_SHORT[d.code] ?? d.code;
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
                title={SCHEME_LABELS[d.code] ?? d.code}
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
        A different {replacing ? (SCHEME_LABELS[replacing.schemeCode] ?? replacing.schemeCode) : ""} application is saved on this device. Continuing draft {replacing?.id} replaces it, and its answers cannot be recovered.
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
        The answers and documents saved for this {discarding ? (SCHEME_LABELS[discarding.code] ?? discarding.code) : ""} application will be deleted. This cannot be undone.
      </p>
    </Modal>
    </div>
  );
}
