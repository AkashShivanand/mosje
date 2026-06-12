import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DEFAULT_APPS } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Portals — MoSJE Digital Estate",
  description:
    "Select a workflow portal to access schemes, scholarships, and organisational services.",
};

export default function PortalsPage() {
  const portalApps = DEFAULT_APPS.filter((a) => a.group === "Portals");
  const live = portalApps.filter((a) => (a.status ?? "live") === "live");
  const planned = portalApps.filter((a) => a.status === "planned");

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-ink-muted">
            <li>
              <Link href="/" className="hover:text-gov-blue hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              Portals
            </li>
          </ol>
        </nav>

        <h1 className="mb-2 text-3xl font-bold text-ink">Workflow Portals</h1>
        <p className="mb-10 text-ink-muted">
          Authenticated portals for managing schemes, scholarships, and
          organisations under MoSJE.
        </p>

        {/* Live portals */}
        <section aria-labelledby="live-heading" className="mb-12">
          <h2 id="live-heading" className="mb-5 text-xl font-semibold text-ink">
            Available now
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {live.map((portal) => (
              <a
                key={portal.path}
                href={portal.path}
                className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition hover:border-gov-blue hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-gov-blue"
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-ink">{portal.name}</h3>
                  <span className="shrink-0 rounded-full bg-success-tonal px-2 py-0.5 text-xs font-semibold text-success">
                    Live
                  </span>
                </div>
                {portal.org && (
                  <p className="mb-2 text-xs text-ink-muted">{portal.org}</p>
                )}
                {portal.desc && (
                  <p className="mb-5 flex-1 text-sm text-ink-muted">{portal.desc}</p>
                )}
                <span className="flex items-center gap-1.5 text-sm font-semibold text-gov-blue transition-all group-hover:gap-2.5">
                  Open portal
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Planned portals */}
        {planned.length > 0 && (
          <section aria-labelledby="planned-heading">
            <h2 id="planned-heading" className="mb-5 text-xl font-semibold text-ink">
              In development
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {planned.map((portal) => (
                <div
                  key={portal.path}
                  className="flex flex-col rounded-xl border border-border bg-surface p-6 opacity-60"
                  aria-label={`${portal.name} — Planned`}
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-ink">{portal.name}</h3>
                    <span className="shrink-0 rounded-full bg-border px-2 py-0.5 text-xs font-semibold text-ink-muted">
                      Planned
                    </span>
                  </div>
                  {portal.org && (
                    <p className="mb-2 text-xs text-ink-muted">{portal.org}</p>
                  )}
                  {portal.desc && (
                    <p className="flex-1 text-sm text-ink-muted">{portal.desc}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
