/**
 * One issue: what is wrong, the evidence, how to see it, the fix, the design
 * tokens and standards, the pages it affects, and its status history. A signed-in
 * admin also gets the form to change status, assignee, target date and note.
 *
 * DS Audit: Breadcrumb ✅ (via RegisterHeader) · Badge ✅ · Button ✅ · Input ✅
 *           · Select ✅ · Textarea ✅ · Figure ✅ · DescriptionList ✅ · Pagination ✅
 *           · Alert ✅ · SectionTitle ✅
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Alert,
  Button,
  DescriptionList,
  Figure,
  Input,
  Pagination,
  SectionTitle,
  Select,
  Textarea,
} from "@mosje/design-system";
import { HubSiteHeader } from "@/components/hub-site-header";
import { HubFooter } from "@/components/site-footer";
import { isIssuesEditor } from "@/lib/admin/auth";
import { ISSUES, META, getAffected, getIssue } from "@/lib/website-issues/data";
import { readAllStatuses, readHistory, statusStoreConfigured } from "@/lib/website-issues/status-store";
import { STATUSES } from "@/lib/website-issues/types";
import { editorName, updateIssue } from "../actions";
import { BASE, RegisterHeader, SeverityBadge, StatusBadge, formatDate, formatDateTime } from "../ui";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const i = getIssue((await params).id);
  return { title: i ? `${i.id} · ${i.title} — Website Issues` : "Issue not found", robots: { index: false, follow: false } };
}

const AFF_PER_PAGE = 20;

export default async function IssuePage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const i = getIssue(id);
  if (!i) notFound();

  const [editor, statuses, history, affected] = await Promise.all([isIssuesEditor(), readAllStatuses(), readHistory(i.id), getAffected(i.id)]);
  const st = statuses?.[i.id];
  const status = st?.status ?? "Open";
  const name = editor ? await editorName() : "";
  const saved = typeof sp.saved === "string" ? sp.saved : "";
  const ap = Math.max(1, Number.parseInt(typeof sp.ap === "string" ? sp.ap : "1", 10) || 1);
  const apTotal = Math.max(1, Math.ceil(affected.length / AFF_PER_PAGE));
  const apPage = Math.min(ap, apTotal);
  const idx = ISSUES.findIndex((x) => x.id === i.id);
  const prev = ISSUES[idx - 1];
  const next = ISSUES[idx + 1];
  const path = i.url.replace("https://www.dosje.gov.in", "") || "/";

  return (
    <div className="flex min-h-screen flex-col bg-surface-canvas">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-label-1 focus:font-semibold focus:text-on-primary">
        Skip to main content
      </a>
      <HubSiteHeader current="/reports" />
      <main id="main-content" className="flex-1">
        <RegisterHeader crumbs={[{ label: "dosje.gov.in Website Issues", href: BASE }, { label: i.id }]} title={i.title}>
          <SeverityBadge severity={i.severity} />
          <StatusBadge status={status} />
        </RegisterHeader>

        <div className="sa-container grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex min-w-0 flex-col gap-10">
            {saved === "1" ? <Alert status="success" title="Saved." /> : null}
            {saved && saved !== "1" ? <Alert status="error" title="The change was not saved.">Check your name is filled in, then try again.</Alert> : null}

            <DescriptionList
              columns={2}
              items={[
                { term: "Issue ID", value: i.id },
                { term: "Category", value: i.category },
                { term: "Who fixes it", value: i.owner },
                { term: "Scope", value: i.scope },
                { term: "Affects", value: i.reach },
                { term: "Page", value: <a href={i.url} className="break-all text-link-brand-default hover:underline">{path}</a> },
                { term: "Where on the page", value: i.where },
                { term: "In the report", value: i.reportPage ? <a href={META.reportPdf} className="text-link-brand-default hover:underline">Page {i.reportPage}</a> : "In the tracker only" },
              ]}
            />

            <section aria-labelledby="wrong-h" className="flex flex-col gap-3">
              <SectionTitle as={2} headingId="wrong-h" title="What Is Wrong" />
              <p className="max-w-measure text-body-1 text-ink">{i.issue}</p>
              {i.why ? <p className="max-w-measure text-body-2 text-ink-muted">{i.why}</p> : null}
            </section>

            {i.evidence.length ? (
              <section aria-labelledby="ev-h" className="flex flex-col gap-4">
                <SectionTitle as={2} headingId="ev-h" title={i.evidence.length > 1 ? "Screenshots" : "Screenshot"} />
                <div className={i.evidence.length > 1 ? "grid gap-6 md:grid-cols-2" : ""}>
                  {i.evidence.map((e) => (
                    <Figure key={e.file} caption={e.caption}>
                      <a href={`${BASE}/evidence/${e.file}`} aria-label={`Open the screenshot full size: ${e.caption}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- static evidence served from /public; sizes vary per capture */}
                        <img src={`${BASE}/evidence/${e.file}`} alt={e.caption} loading="lazy" className="w-full rounded-lg border border-border bg-surface" />
                      </a>
                    </Figure>
                  ))}
                </div>
              </section>
            ) : null}

            <section aria-labelledby="see-h" className="flex flex-col gap-3">
              <SectionTitle as={2} headingId="see-h" title="How to See It" />
              <ol className="flex max-w-measure list-decimal flex-col gap-1.5 pl-5 text-body-1 text-ink">
                {i.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="fix-h" className="flex flex-col gap-3">
              <SectionTitle as={2} headingId="fix-h" title="Fix" />
              <p className="max-w-measure rounded-xl border border-border bg-surface p-5 text-body-1 text-ink">{i.fix}</p>
              {i.tokens.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-[28rem] border-collapse text-body-2">
                    <caption className="mb-2 text-left text-label-1 font-semibold text-ink">Design tokens</caption>
                    <thead>
                      <tr className="text-left text-label-2 text-ink-muted">
                        <th scope="col" className="py-1.5 pr-6 font-semibold">Token</th>
                        <th scope="col" className="py-1.5 pr-6 font-semibold">Value today</th>
                        <th scope="col" className="py-1.5 font-semibold">CSS variable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {i.tokens.map((t) => (
                        <tr key={t.token} className="border-t border-border">
                          <td className="py-1.5 pr-6 font-mono text-label-1">{t.token}</td>
                          <td className="py-1.5 pr-6">{t.value}</td>
                          <td className="py-1.5 font-mono text-body-3 text-ink-muted">{t.css}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>

            <section aria-labelledby="std-h" className="flex flex-col gap-3">
              <SectionTitle as={2} headingId="std-h" title="Standards Failed" />
              <ul className="flex flex-col gap-1.5 text-body-1">
                {i.standards.map((s) => (
                  <li key={s.id}>
                    <a href={s.url} className="text-link-brand-default hover:underline" target="_blank" rel="noopener noreferrer">
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            {affected.length ? (
              <section aria-labelledby="aff-h" className="flex flex-col gap-4">
                <SectionTitle as={2} headingId="aff-h" title="Affected Pages" count={affected.length.toLocaleString("en-IN")} />
                <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                  <table className="w-full min-w-[36rem] border-collapse text-body-2">
                    <thead>
                      <tr className="bg-surface-muted text-left text-label-2 text-ink-muted">
                        <th scope="col" className="px-4 py-3 font-semibold">Page</th>
                        <th scope="col" className="px-4 py-3 font-semibold">What was found there</th>
                      </tr>
                    </thead>
                    <tbody>
                      {affected.slice((apPage - 1) * AFF_PER_PAGE, apPage * AFF_PER_PAGE).map(([p, title, found], n) => (
                        <tr key={`${p}-${n}`} className="border-t border-border align-top">
                          <td className="px-4 py-3">
                            <a href={`https://www.dosje.gov.in${p}`} className="text-link-brand-default hover:underline">{title || p}</a>
                            <div className="break-all text-body-3 text-ink-muted">{p}</div>
                          </td>
                          <td className="px-4 py-3 text-ink">{found}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {apTotal > 1 ? <Pagination page={apPage} totalPages={apTotal} hrefFor={(n) => `${BASE}/${i.id}?ap=${n}#aff-h`} label="Affected page list" /> : null}
              </section>
            ) : null}

            {i.related.length ? (
              <p className="text-body-2 text-ink-muted">
                Related:{" "}
                {i.related.map((r, n) => (
                  <span key={r}>
                    {n ? ", " : ""}
                    <Link href={`${BASE}/${r}`} className="font-mono text-link-brand-default hover:underline">{r}</Link>
                  </span>
                ))}
              </p>
            ) : null}

            <nav aria-label="Other issues" className="flex flex-wrap justify-between gap-4 border-t border-border pt-6 text-label-1">
              {prev ? <Link href={`${BASE}/${prev.id}`} className="text-link-brand-default hover:underline">← {prev.id}</Link> : <span />}
              <Link href={BASE} className="text-link-brand-default hover:underline">All Issues</Link>
              {next ? <Link href={`${BASE}/${next.id}`} className="text-link-brand-default hover:underline">{next.id} →</Link> : <span />}
            </nav>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
            <section aria-labelledby="status-h" className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
              <h2 id="status-h" className="text-title-1 text-ink">Status</h2>
              {editor ? (
                <form action={updateIssue} className="flex flex-col gap-4">
                  <input type="hidden" name="id" value={i.id} />
                  <input type="hidden" name="return" value={`${BASE}/${i.id}`} />
                  <label className="flex flex-col gap-1.5 text-label-2 text-ink-muted">
                    Status
                    <Select name="status" defaultValue={status} options={STATUSES.map((s) => ({ label: s, value: s }))} />
                  </label>
                  <label className="flex flex-col gap-1.5 text-label-2 text-ink-muted">
                    Assigned to
                    <Input name="assignee" defaultValue={st?.assignee ?? ""} />
                  </label>
                  <label className="flex flex-col gap-1.5 text-label-2 text-ink-muted">
                    Target date
                    <Input name="targetDate" type="date" defaultValue={st?.targetDate ?? ""} />
                  </label>
                  <label className="flex flex-col gap-1.5 text-label-2 text-ink-muted">
                    Note
                    <Textarea name="note" rows={3} defaultValue={st?.note ?? ""} />
                  </label>
                  <label className="flex flex-col gap-1.5 text-label-2 text-ink-muted">
                    Your name
                    <Input name="editor" defaultValue={name} required autoComplete="name" />
                  </label>
                  <Button type="submit" size="md">Save</Button>
                </form>
              ) : (
                <>
                  <DescriptionList
                    items={[
                      { term: "Status", value: status },
                      { term: "Assigned to", value: st?.assignee },
                      { term: "Target date", value: formatDate(st?.targetDate) },
                      { term: "Note", value: st?.note },
                    ]}
                  />
                  <Button linkAs={Link} href={`/admin/login?next=${encodeURIComponent(`${BASE}/${i.id}`)}`} variant="neutral" appearance="outlined" size="sm">
                    Sign In to Update
                  </Button>
                </>
              )}
              {statuses === null && statusStoreConfigured() ? (
                <p className="text-body-3 text-ink-muted">Statuses could not be loaded; this issue is shown as Open.</p>
              ) : null}
            </section>

            <section aria-labelledby="hist-h" className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
              <h2 id="hist-h" className="text-title-1 text-ink">History</h2>
              {history.length ? (
                <ol className="flex flex-col gap-3 text-body-2">
                  {history.map((h) => (
                    <li key={h.changedAt} className="border-l-2 border-border pl-3">
                      <div className="font-semibold text-ink">{h.status}{h.assignee ? ` · ${h.assignee}` : ""}{h.targetDate ? ` · by ${formatDate(h.targetDate)}` : ""}</div>
                      {h.note ? <div className="text-ink">{h.note}</div> : null}
                      <div className="text-body-3 text-ink-muted">{h.changedBy ?? "Unknown"} · {formatDateTime(h.changedAt)}</div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-body-2 text-ink-muted">No changes yet. Reported on 21 September 2026.</p>
              )}
            </section>
          </aside>
        </div>
      </main>
      <HubFooter />
    </div>
  );
}
