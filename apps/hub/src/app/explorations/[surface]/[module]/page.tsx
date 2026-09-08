import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HubSiteHeader } from "@/components/hub-site-header";
import { HubFooter } from "@/components/site-footer";
import { ExplorationViewer } from "@/components/explorations/ExplorationViewer";
import { allModuleParams, moduleById, surfaceById } from "@/lib/explorations/registry";
import "@/components/explorations/explorations.css";

interface Params {
  params: Promise<{ surface: string; module: string }>;
}

export function generateStaticParams() {
  return allModuleParams();
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { surface, module } = await params;
  const s = surfaceById(surface);
  const m = moduleById(surface, module);
  if (!s || !m) return { title: "Explorations — MoSJE Digital Estate" };
  return {
    title: `${m.title} — ${s.title} explorations`,
    description: m.question,
    robots: { index: false, follow: false },
  };
}

export default async function ExplorationModulePage({ params }: Params) {
  const { surface, module } = await params;
  const s = surfaceById(surface);
  const m = moduleById(surface, module);
  if (!s || !m) notFound();

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
              <ol className="flex flex-wrap items-center gap-2 text-body-2 text-ink-muted">
                <li>
                  <Link href="/" className="hover:text-primary hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/explorations" className="hover:text-primary hover:underline">
                    Explorations
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>{s.title}</li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-medium text-ink">
                  {m.title}
                </li>
              </ol>
            </nav>

            <h1 className="text-headline-2 text-ink">{m.title}</h1>

            {/*
             * The QUESTION carries the standfirst slot, because a reviewer who
             * reads only one line on this page should read the thing being
             * decided — not a description of the module.
             */}
            <p className="mt-3 max-w-measure text-body-1 text-ink">{m.question}</p>
            <p className="mt-2 text-body-3 text-ink-muted">
              Drawn {m.date} · {m.options.length} options
              {s.route ? (
                <>
                  {" · "}
                  <Link href={s.route} className="text-primary hover:underline">
                    the live page
                  </Link>
                </>
              ) : null}
            </p>
          </div>
        </div>

        <div className="sa-container py-10">
          <ExplorationViewer surfaceId={s.id} module={m} />
        </div>
      </main>

      <HubFooter />
    </div>
  );
}
