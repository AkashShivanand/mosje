import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import auditRaw from "@/data/scw-audit.json";
import { Icon } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "SCW Design QC — MoSJE Digital Estate",
  description:
    "Design quality-control audit of the Senior Citizens Welfare (SCW) UAT build vs the SAMAVESH Figma handoff.",
};

type Sev = "Blocker" | "Major" | "Minor" | "Nit";
interface Finding {
  num: number;
  id: string;
  element: string;
  section: string;
  axis: string;
  severity: Sev;
  figma: string;
  live: string;
  fix: string;
}
interface Screen {
  slug: string;
  name: string;
  note?: string | null;
  figmaUrl?: string | null;
  liveUrl?: string | null;
  findings: Finding[];
}
const audit = auditRaw as unknown as {
  portal: string;
  generated: string;
  method: string;
  screens: Screen[];
  deferred?: { id: string; title: string; reason?: string }[];
};

const PDF = "/reports/SCW-Senior-Citizens-Welfare-Design-QC-Report.pdf";

const SEV: Record<Sev, { bg: string; fg: string }> = {
  Blocker: { bg: "color-mix(in srgb, var(--sa-color-status-danger) 14%, transparent)", fg: "var(--sa-color-status-danger)" },
  Major: { bg: "color-mix(in srgb, var(--sa-color-brand-saffron) 16%, transparent)", fg: "var(--sa-color-brand-saffronDark)" },
  Minor: { bg: "color-mix(in srgb, var(--sa-color-status-warning) 24%, transparent)", fg: "var(--sa-color-text-default)" },
  Nit: { bg: "var(--sa-bg-neutral-subtler)", fg: "var(--sa-color-text-muted)" },
};

function Chip({ s, n }: { s: Sev; n?: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-label-2 font-semibold"
      style={{ background: SEV[s].bg, color: SEV[s].fg }}
    >
      {n != null && <span className="font-bold">{n}</span>}
      {s}
    </span>
  );
}

export default function ScwReportPage() {
  const all = audit.screens.flatMap((s) => s.findings);
  const count = (s: Sev) => all.filter((f) => f.severity === s).length;
  const stats: { label: string; value: number; color: string }[] = [
    { label: "Screens", value: audit.screens.length, color: "text-primary" },
    { label: "Findings", value: all.length, color: "text-ink" },
    { label: "Blockers", value: count("Blocker"), color: "text-danger" },
    { label: "Major", value: count("Major"), color: "text-ink" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:left-4 focus:top-4 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-label-1 focus:font-semibold focus:text-on-primary"
      >
        Skip to main content
      </a>
      <SiteHeader current="/reports" />

      <main id="main-content" className="flex-1">
        <div className="border-b border-border bg-surface">
          <div className="sa-container pb-8 pt-10">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-body-2 text-ink-muted">
                <li><Link href="/" className="hover:text-primary hover:underline">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/reports" className="hover:text-primary hover:underline">Reports</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-medium text-ink">SCW</li>
              </ol>
            </nav>

            <Link href="/reports" className="mb-4 inline-flex items-center gap-1.5 text-label-1 font-semibold text-primary hover:underline">
              <Icon name="arrow_back" size={16} aria-hidden="true" /> All reports
            </Link>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-headline-1 text-ink">
                  SCW — Senior Citizens Welfare
                </h1>
                <p className="mt-2 max-w-measure text-body-1 text-ink-muted">
                  Design QC of the <strong>UAT</strong> build
                  (scw-user-uat · scw-admin-uat) vs the SAMAVESH Figma handoff. Generated {audit.generated}.
                </p>
              </div>
              <a
                href={PDF}
                download
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-1 font-semibold text-on-primary transition-colors hover:bg-primary-dark"
              >
                <Icon name="download" size={16} aria-hidden="true" /> Download PDF
              </a>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(({ label, value, color }) => (
                <div key={label} className="rounded-xl border border-border bg-surface px-4 py-3">
                  <dd className={`text-headline-4 font-bold tabular-nums ${color}`}>{value}</dd>
                  <dt className="text-body-3 text-ink-muted">{label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="sa-container space-y-6 py-10">
          {audit.screens.map((screen) => (
            <section key={screen.slug} className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-headline-5 text-ink">{screen.name}</h2>
                <div className="flex items-center gap-3 text-body-3">
                  {screen.figmaUrl && (
                    <a href={screen.figmaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                      Figma frame <Icon name="open_in_new" size={12} aria-hidden="true" />
                    </a>
                  )}
                  {screen.liveUrl && (
                    <a href={screen.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                      Live page <Icon name="open_in_new" size={12} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>

              {screen.note && (
                <p className="mt-3 rounded-lg bg-surface-muted px-4 py-3 text-body-2 text-ink-muted">{screen.note}</p>
              )}

              {screen.findings.length > 0 && (
                <ul className="mt-4 space-y-3">
                  {screen.findings.map((f) => (
                    <li key={f.id} className="rounded-xl border border-border p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Chip s={f.severity} />
                        <span className="text-title-3 text-ink">{f.element}</span>
                        <span className="text-body-3 text-ink-muted">· {f.axis}</span>
                        <span className="ml-auto font-mono text-body-3 text-ink-muted">{f.id}</span>
                      </div>
                      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                          <dt className="text-label-3 uppercase text-primary">Design — Figma intent</dt>
                          <dd className="mt-1 text-body-2 text-ink-muted">{f.figma}</dd>
                        </div>
                        <div>
                          <dt className="text-label-3 uppercase text-saffron-dark">Build — Live</dt>
                          <dd className="mt-1 text-body-2 text-ink-muted">{f.live}</dd>
                        </div>
                      </dl>
                      <div className="mt-3 rounded-lg bg-success-tonal px-3 py-2">
                        <span className="text-label-3 uppercase text-success">Fix</span>
                        <p className="mt-0.5 text-body-2 text-ink">{f.fix}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {audit.deferred && audit.deferred.length > 0 && (
            <section className="rounded-2xl border border-dashed border-border p-6">
              <h2 className="text-headline-6 text-ink-muted">Deferred — by decision</h2>
              <ul className="mt-3 space-y-2">
                {audit.deferred.map((d) => (
                  <li key={d.id} className="text-body-2 text-ink-muted">
                    <span className="font-semibold text-ink">{d.title}</span>
                    {d.reason && <> — {d.reason}</>}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
