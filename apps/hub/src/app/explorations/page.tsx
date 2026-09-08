import type { Metadata } from "next";
import Link from "next/link";
import { HubSiteHeader } from "@/components/hub-site-header";
import { HubFooter } from "@/components/site-footer";
import { EXPLORATIONS, counts } from "@/lib/explorations/registry";
import "@/components/explorations/explorations.css";

export const metadata: Metadata = {
  title: "Explorations — MoSJE Digital Estate",
  description:
    "Design options drawn for the estate, the question each one answers, and what became of it.",
  robots: { index: false, follow: false },
};

const STATUS_WORD = {
  chosen: "Chosen",
  proposed: "Awaiting a decision",
  superseded: "Not chosen",
  parked: "Parked",
} as const;

export default function ExplorationsPage() {
  const n = counts();

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:left-4 focus:top-4 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-label-1 focus:font-semibold focus:text-on-primary"
      >
        Skip to main content
      </a>

      <HubSiteHeader current="/explorations" />

      <main id="main-content" className="flex-1">
        <div className="border-b border-border bg-surface">
          <div className="sa-container pb-8 pt-10">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-body-2 text-ink-muted">
                <li>
                  <Link href="/" className="hover:text-primary hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-medium text-ink">
                  Explorations
                </li>
              </ol>
            </nav>

            <h1 className="text-headline-1 text-ink">Design Explorations</h1>
            <p className="mt-3 max-w-measure text-body-1 text-ink-muted">
              Options drawn for a decision, kept after it. Each module states the
              question it answers and holds every option considered — including
              the ones that were not chosen, with what beat them.
            </p>

            {/* Counted from the register, never typed. */}
            <p className="mt-4 text-body-2 text-ink-muted">
              {n.surfaces} {n.surfaces === 1 ? "surface" : "surfaces"} · {n.modules}{" "}
              {n.modules === 1 ? "decision" : "decisions"} · {n.options} options ·{" "}
              {n.open} awaiting a decision · {n.kept} kept for the record
            </p>
          </div>
        </div>

        <div className="sa-container py-10">
          {EXPLORATIONS.map((surface) => (
            <section key={surface.id} className="xpl-surface" aria-labelledby={`xpl-${surface.id}`}>
              <h2 id={`xpl-${surface.id}`} className="text-headline-3 text-ink">
                {surface.title}
              </h2>
              <p className="mt-2 max-w-measure text-body-2 text-ink-muted">{surface.summary}</p>
              {surface.route ? (
                <p className="mt-2 text-body-3">
                  <Link href={surface.route} className="text-primary hover:underline">
                    Open the live page
                  </Link>
                </p>
              ) : null}

              <div className="xpl-modules">
                {surface.modules.map((m) => (
                  <Link
                    key={m.id}
                    href={`/explorations/${surface.id}/${m.id}`}
                    className="xpl-module-card"
                  >
                    <span className="xpl-module-card__title">{m.title}</span>
                    <span className="xpl-module-card__question">{m.question}</span>
                    <span className="xpl-module-card__foot">
                      {m.options.map((o) => (
                        <span key={o.id} className={`xpl-status xpl-status--${o.status}`}>
                          {o.title} — {STATUS_WORD[o.status]}
                        </span>
                      ))}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <HubFooter />
    </div>
  );
}
