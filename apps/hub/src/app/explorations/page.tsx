import type { Metadata } from "next";
import Link from "next/link";
import { HubSiteHeader } from "@/components/hub-site-header";
import { HubFooter } from "@/components/site-footer";
import { ExplorationIndex } from "@/components/explorations/ExplorationIndex";
import { EXPLORATIONS, counts } from "@/lib/explorations/registry";
import "@/components/explorations/explorations.css";

export const metadata: Metadata = {
  title: "Explorations — MoSJE Digital Estate",
  description:
    "Design options drawn for the estate, the question each one answers, and what became of it.",
  robots: { index: false, follow: false },
};

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

            {/*
             * Counted from the register, never typed — AND THE PARTS NOW ADD UP.
             * It read "30 options · 15 awaiting a decision · 9 kept for the
             * record", which leaves six unaccounted: the chosen ones, which the
             * line never mentioned. A reader who tries the arithmetic on a
             * government page and finds it wrong stops trusting the rest of it.
             */}
            <p className="mt-4 text-body-2 text-ink-muted">
              {n.surfaces} {n.surfaces === 1 ? "surface" : "surfaces"} · {n.modules}{" "}
              {n.modules === 1 ? "decision" : "decisions"} · {n.options} options — {n.open} awaiting
              a decision, {n.chosen} chosen, {n.kept} not chosen
            </p>
          </div>
        </div>

        <div className="sa-container py-10">
          <ExplorationIndex surfaces={EXPLORATIONS} />
        </div>
      </main>

      <HubFooter />
    </div>
  );
}
