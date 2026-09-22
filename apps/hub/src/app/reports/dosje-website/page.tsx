/**
 * The dosje.gov.in issue register — one page for everyone.
 *
 * Read-only to anyone past the site gate; a signed-in admin sees the same page
 * with status controls (one issue, or many at once) and every change is logged.
 * Filters live in the address, so a view such as "open Blockers the developers
 * own" is a link someone can share. Nothing here needs client script.
 *
 * DS Audit: Breadcrumb ✅ · Badge ✅ · Button ✅ · Input ✅ · Select ✅ · Checkbox ✅
 *           · MetricCard ✅ · Pagination ✅ · Alert ✅ · EmptyState ✅
 *           · SectionTitle ✅ · RegisterHeader ➕ page-local (composes Breadcrumb)
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  Alert,
  Button,
  Checkbox,
  EmptyState,
  Input,
  MetricCard,
  Pagination,
  SectionTitle,
  Select,
} from "@mosje/design-system";
import { HubSiteHeader } from "@/components/hub-site-header";
import { HubFooter } from "@/components/site-footer";
import { isIssuesEditor } from "@/lib/admin/auth";
import { ISSUES, META } from "@/lib/website-issues/data";
import { applyFilters, filterHref, hasFilters, parseFilters, statusOf, STANDARD_FAMILIES } from "@/lib/website-issues/filters";
import { readAllStatuses, statusStoreConfigured } from "@/lib/website-issues/status-store";
import { SCOPES, SEVERITIES, STATUSES, type IssueStatus, type StatusRecord } from "@/lib/website-issues/types";
import { editorName, updateMany } from "./actions";
import { BASE, RegisterHeader, SeverityBadge, StatusBadge, formatDate } from "./ui";

export const metadata: Metadata = {
  title: "dosje.gov.in Website Issues — MoSJE Digital Estate",
  description: "Every open issue on www.dosje.gov.in, with its evidence, fix, standards and current status.",
  robots: { index: false, follow: false },
};

// Statuses change from minute to minute; never serve a cached page.
export const dynamic = "force-dynamic";

const PER_PAGE = 25;
const VIEWS = [
  { key: "issues", label: "Issues" },
  { key: "links", label: "Broken Links" },
  { key: "duplicates", label: "Duplicates" },
  { key: "resolved", label: "Resolved & Withdrawn" },
] as const;

const CATEGORIES = [...new Set(ISSUES.map((i) => i.category))].sort();
const OWNERS = [...new Set(ISSUES.map((i) => i.owner))].sort();
const opts = (xs: readonly string[], all: string) => [{ label: all, value: "" }, ...xs.map((x) => ({ label: x, value: x }))];

type SP = Record<string, string | string[] | undefined>;

function SavedNotice({ saved }: { saved: string }) {
  if (!saved) return null;
  const n = Number(saved);
  if (n > 0) return <Alert status="success" title={n === 1 ? "Saved." : `Saved ${n} issues.`} />;
  const msg: Record<string, string> = {
    noname: "Enter your name so the change can be traced to you, then save again.",
    none: "Select at least one issue.",
    nothing: "Choose a status, an assignee or a target date to apply.",
    error: "The change was not saved. Try again; if it keeps failing, the status store may be unavailable.",
  };
  return <Alert status={saved === "error" ? "error" : "warning"} title={msg[saved] ?? msg.error} />;
}

function ListTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[40rem] border-collapse text-body-2">
        <thead>
          <tr className="bg-surface-muted text-left text-label-2 text-ink-muted">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border align-top">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-3 text-ink">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function pageOf<T>(xs: T[], page: number, per = PER_PAGE) {
  const total = Math.max(1, Math.ceil(xs.length / per));
  const p = Math.min(page, total);
  return { slice: xs.slice((p - 1) * per, p * per), page: p, total };
}

export default async function WebsiteIssuesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const view = (VIEWS.find((v) => v.key === sp.view)?.key ?? "issues") as (typeof VIEWS)[number]["key"];
  const saved = typeof sp.saved === "string" ? sp.saved : "";
  const f = parseFilters(sp);

  const [editor, stored] = await Promise.all([isIssuesEditor(), readAllStatuses()]);
  const statuses: Record<string, StatusRecord> = stored ?? {};
  const storeDown = stored === null && statusStoreConfigured();
  const name = editor ? await editorName() : "";

  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<IssueStatus, number>;
  for (const i of ISSUES) counts[statusOf(i.id, statuses)] += 1;
  const done = counts.Fixed + counts.Verified;

  const here = filterHref(f);

  return (
    <div className="flex min-h-screen flex-col bg-surface-canvas">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-label-1 focus:font-semibold focus:text-on-primary">
        Skip to main content
      </a>
      <HubSiteHeader current="/reports" />

      <main id="main-content" className="flex-1">
        <RegisterHeader
          crumbs={[{ label: "dosje.gov.in Website Issues" }]}
          title="dosje.gov.in Website Issues"
          lede={`Every open issue on www.dosje.gov.in from all audits, checked on the live site between 18 and 21 September 2026. ${ISSUES.length.toLocaleString("en-IN")} issues.`}
        >
          <Button linkAs={Link} href={META.reportPdf} variant="neutral" appearance="outlined" size="md">
            Issues Report (PDF)
          </Button>
          <Button href={`${BASE}/export${filterHref({ ...f, page: 1 }, "")}`} variant="primary" size="md">
            Download Tracker (CSV)
          </Button>
        </RegisterHeader>

        <div className="sa-container flex flex-col gap-8 py-10">
          <SavedNotice saved={saved} />
          {storeDown ? (
            <Alert status="warning" title="Statuses could not be loaded.">
              Every issue is shown as Open until the status store answers. Reload the page to try again.
            </Alert>
          ) : null}

          <section aria-labelledby="progress-h">
            <SectionTitle as={2} headingId="progress-h" title="Progress" description={`${done.toLocaleString("en-IN")} of ${ISSUES.length.toLocaleString("en-IN")} issues fixed or verified.`} />
            <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              {STATUSES.map((s) => (
                <li key={s}>
                  <MetricCard
                    size="sm"
                    label={s}
                    value={counts[s].toLocaleString("en-IN")}
                    href={filterHref({ status: s })}
                    linkAs={Link}
                    selected={f.status === s}
                    className="h-full"
                  />
                </li>
              ))}
            </ul>
          </section>

          <nav aria-label="Register views" className="flex flex-wrap gap-2 border-b border-border">
            {VIEWS.map((v) => (
              <Link
                key={v.key}
                href={v.key === "issues" ? BASE : `${BASE}?view=${v.key}`}
                aria-current={view === v.key ? "page" : undefined}
                className={`-mb-px border-b-2 px-3 py-2.5 text-label-1 ${view === v.key ? "border-primary font-semibold text-link-brand-default" : "border-transparent text-ink-muted hover:text-ink"}`}
              >
                {v.label}
              </Link>
            ))}
          </nav>

          {view === "issues" ? (
            <IssuesView f={f} statuses={statuses} editor={editor} name={name} here={here} />
          ) : view === "links" ? (
            <SimpleList
              title="Broken Links"
              description="Every broken link found on 19 September, with the page it sits on."
              head={["Issue", "Page", "Link text", "Broken address", "Problem"]}
              rows={META.broken.map((b) => [b[0], b[1], b[2], b[3], b[4]])}
              page={f.page}
              q={f.q}
              view="links"
              render={(r) => [
                <Link key="i" href={`${BASE}/${r[0]}`} className="font-mono text-label-1 text-link-brand-default hover:underline">{r[0]}</Link>,
                <a key="p" href={`https://www.dosje.gov.in${r[1] || "/"}`} className="text-link-brand-default hover:underline">{r[1] || "/"}</a>,
                r[2],
                <span key="b" className="break-all text-body-3">{r[3]}</span>,
                r[4],
              ]}
            />
          ) : view === "duplicates" ? (
            <SimpleList
              title="Duplicates"
              description="Pages, files and titles published more than once. Rows in the same group are copies of each other."
              head={["Type", "Group", "Address", "Title", "Issue"]}
              rows={META.duplicates.map((d) => [d[0], d[1], d[2], d[3], d[4]])}
              page={f.page}
              q={f.q}
              view="duplicates"
              render={(r) => [
                r[0],
                <span key="g" className="font-mono">{r[1]}</span>,
                <a key="a" href={(r[2] ?? "").startsWith("/") ? `https://www.dosje.gov.in${r[2]}` : r[2]} className="break-all text-link-brand-default hover:underline">{r[2]}</a>,
                r[3],
                <Link key="i" href={`${BASE}/${r[4]}`} className="font-mono text-label-1 text-link-brand-default hover:underline">{r[4]}</Link>,
              ]}
            />
          ) : (
            <ResolvedView />
          )}
        </div>
      </main>
      <HubFooter />
    </div>
  );
}

function IssuesView({
  f,
  statuses,
  editor,
  name,
  here,
}: {
  f: ReturnType<typeof parseFilters>;
  statuses: Record<string, StatusRecord>;
  editor: boolean;
  name: string;
  here: string;
}) {
  const matched = applyFilters(ISSUES, statuses, f);
  const { slice, page, total } = pageOf(matched, f.page);
  const filtered = hasFilters(f);

  return (
    <section aria-labelledby="issues-h" className="flex flex-col gap-5">
      <SectionTitle
        as={2}
        headingId="issues-h"
        title="Issues"
        count={matched.length.toLocaleString("en-IN")}
        description={filtered ? `${matched.length.toLocaleString("en-IN")} of ${ISSUES.length.toLocaleString("en-IN")} issues match these filters.` : "Most severe first. Open an issue for its evidence, steps, fix and history."}
      >
        {editor ? (
          <span className="text-body-3 text-ink-muted">Signed in to edit</span>
        ) : (
          <Button linkAs={Link} href={`/admin/login?next=${encodeURIComponent(BASE)}`} variant="neutral" appearance="outlined" size="sm">
            Sign In to Update Statuses
          </Button>
        )}
      </SectionTitle>

      <form method="get" action={BASE} role="search" aria-label="Filter issues" className="grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1.5 text-label-2 text-ink-muted sm:col-span-2 lg:col-span-4">
          Search
          <Input name="q" type="search" defaultValue={f.q} placeholder="Issue ID, words, page address, WCAG 1.4.3, a token…" />
        </label>
        {(
          [
            ["severity", "Severity", SEVERITIES, "All severities"],
            ["status", "Status", STATUSES, "All statuses"],
            ["category", "Category", CATEGORIES, "All categories"],
            ["owner", "Who fixes it", OWNERS, "Everyone"],
            ["scope", "Scope", SCOPES, "All scopes"],
            ["standard", "Standard", STANDARD_FAMILIES, "All standards"],
          ] as const
        ).map(([key, label, xs, all]) => (
          <label key={key} className="flex flex-col gap-1.5 text-label-2 text-ink-muted">
            {label}
            <Select name={key} defaultValue={f[key]} options={opts(xs, all)} />
          </label>
        ))}
        <div className="flex items-end gap-3 lg:col-span-2">
          <Button type="submit" size="md">Apply Filters</Button>
          {filtered ? (
            <Link href={BASE} className="text-label-1 text-link-brand-default hover:underline">Clear Filters</Link>
          ) : null}
        </div>
      </form>

      {matched.length === 0 ? (
        <EmptyState
          title="No issue matches these filters."
          description={f.q ? `Nothing matches “${f.q}” with the filters chosen.` : "Try removing a filter."}
          action={<Button linkAs={Link} href={BASE} variant="neutral" appearance="outlined" size="sm">Clear Filters</Button>}
        />
      ) : (
        <form action={updateMany} className="flex flex-col gap-4">
          <input type="hidden" name="return" value={here} />
          {editor ? (
            <fieldset className="grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-5">
              <legend className="px-1 text-label-1 font-semibold text-ink">Update Selected Issues</legend>
              <label className="flex flex-col gap-1.5 text-label-2 text-ink-muted">
                Set status
                <Select name="bulkStatus" defaultValue="" options={opts(STATUSES, "Leave as it is")} />
              </label>
              <label className="flex flex-col gap-1.5 text-label-2 text-ink-muted">
                Assign to
                <Input name="bulkAssignee" placeholder="Leave as it is" />
              </label>
              <label className="flex flex-col gap-1.5 text-label-2 text-ink-muted">
                Target date
                <Input name="bulkTargetDate" type="date" />
              </label>
              <label className="flex flex-col gap-1.5 text-label-2 text-ink-muted">
                Your name
                <Input name="editor" defaultValue={name} required autoComplete="name" />
              </label>
              <div className="flex items-end">
                <Button type="submit" size="md">Apply to Selected</Button>
              </div>
            </fieldset>
          ) : null}

          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full min-w-[56rem] border-collapse text-body-2">
              <caption className="sr-only">Issues, page {page} of {total}</caption>
              <thead>
                <tr className="bg-surface-muted text-left text-label-2 text-ink-muted">
                  {editor ? <th scope="col" className="w-10 px-4 py-3"><span className="sr-only">Select</span></th> : null}
                  <th scope="col" className="px-4 py-3 font-semibold">ID</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Issue</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Severity</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Who fixes it</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Assigned to</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Target</th>
                </tr>
              </thead>
              <tbody>
                {slice.map((i) => {
                  const st = statuses[i.id];
                  return (
                    <tr key={i.id} className="border-t border-border align-top">
                      {editor ? (
                        <td className="px-4 py-3">
                          <Checkbox name="ids" value={i.id} aria-label={`Select ${i.id}`} />
                        </td>
                      ) : null}
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-label-1 text-ink">{i.id}</td>
                      <td className="px-4 py-3">
                        <Link href={`${BASE}/${i.id}`} className="font-semibold text-link-brand-default hover:underline">{i.title}</Link>
                        <div className="mt-1 text-body-3 text-ink-muted">{i.category} · {i.scope} · {i.reach}</div>
                      </td>
                      <td className="px-4 py-3"><SeverityBadge severity={i.severity} /></td>
                      <td className="px-4 py-3 text-ink-muted">{i.owner}</td>
                      <td className="px-4 py-3"><StatusBadge status={statusOf(i.id, statuses)} /></td>
                      <td className="px-4 py-3 text-ink-muted">{st?.assignee ?? ""}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-muted">{formatDate(st?.targetDate)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </form>
      )}

      {total > 1 ? (
        <Pagination page={page} totalPages={total} hrefFor={(p) => filterHref({ ...f, page: p })} label="Issue pages" />
      ) : null}
    </section>
  );
}

function SimpleList({
  title,
  description,
  head,
  rows,
  page,
  q,
  view,
  render,
}: {
  title: string;
  description: string;
  head: string[];
  rows: string[][];
  page: number;
  q: string;
  view: string;
  render: (r: string[]) => React.ReactNode[];
}) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const matched = words.length ? rows.filter((r) => words.every((w) => r.join(" ").toLowerCase().includes(w))) : rows;
  const p = pageOf(matched, page, 50);
  return (
    <section aria-labelledby="list-h" className="flex flex-col gap-5">
      <SectionTitle as={2} headingId="list-h" title={title} count={matched.length.toLocaleString("en-IN")} description={description} />
      <form method="get" action={BASE} role="search" aria-label={`Search ${title.toLowerCase()}`} className="flex flex-wrap items-end gap-3">
        <input type="hidden" name="view" value={view} />
        <label className="flex min-w-[16rem] flex-1 flex-col gap-1.5 text-label-2 text-ink-muted">
          Search
          <Input name="q" type="search" defaultValue={q} placeholder="Page, address, text or issue ID" />
        </label>
        <Button type="submit" size="md">Search</Button>
        {q ? <Link href={`${BASE}?view=${view}`} className="text-label-1 text-link-brand-default hover:underline">Clear</Link> : null}
      </form>
      {matched.length === 0 ? (
        <EmptyState title={`Nothing matches “${q}”.`} action={<Button linkAs={Link} href={`${BASE}?view=${view}`} variant="neutral" appearance="outlined" size="sm">Clear Search</Button>} />
      ) : (
        <ListTable head={head} rows={p.slice.map(render)} />
      )}
      {p.total > 1 ? (
        <Pagination page={p.page} totalPages={p.total} hrefFor={(n) => `${BASE}?view=${view}${q ? `&q=${encodeURIComponent(q)}` : ""}&page=${n}`} label={`${title} pages`} />
      ) : null}
    </section>
  );
}

function ResolvedView() {
  return (
    <section aria-labelledby="res-h" className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <SectionTitle as={2} headingId="res-h" title="Fixed Since First Reported" description="Kept so they are not raised again." />
        <ListTable head={["Reported as", "Now", "Checked"]} rows={META.resolved.map((r) => [`${r[0]} — ${r[1]}`, r[2], r[3]])} />
      </div>
      <div className="flex flex-col gap-4">
        <SectionTitle as={2} title="Withdrawn or Corrected" />
        <ListTable head={["Earlier claim", "What was found", "Checked"]} rows={META.withdrawn.map((r) => [r[0], r[1], r[2]])} />
      </div>
    </section>
  );
}
