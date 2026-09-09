import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HubSiteHeader } from "@/components/hub-site-header";
import { HubFooter } from "@/components/site-footer";
import { ExplorationViewer } from "@/components/explorations/ExplorationViewer";
import {
  STATUS_TALLY,
  allModuleParams,
  moduleById,
  optionTally,
  surfaceById,
} from "@/lib/explorations/registry";
import "@/components/explorations/explorations.css";

interface Params {
  params: Promise<{ surface: string; module: string }>;
  /**
   * `?option=<id>` — which of the module's options to open on.
   *
   * Every link to a module used to open that module's own default, so "look at
   * the third one" was not a thing anyone could send: the reader arrived
   * somewhere else and had to be told which pill to press. Resolved here rather
   * than in the client component so the first paint is already correct — see the
   * note on `initialOptionId`.
   */
  searchParams: Promise<{ option?: string | string[] }>;
}

export function generateStaticParams() {
  return allModuleParams();
}

export async function generateMetadata({ params }: Pick<Params, "params">): Promise<Metadata> {
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

export default async function ExplorationModulePage({ params, searchParams }: Params) {
  const { surface, module } = await params;
  const { option } = await searchParams;
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
            {/*
             * THE TALLY, WHICH IS ALSO THE LEGEND.
             *
             * The tabs below carry a coloured dot instead of a status sentence,
             * and a dot alone means nothing to a reader who has not been told
             * what it stands for. This line tells them — the same dot beside the
             * same word — while also answering the question the header should
             * answer anyway: where has this decision got to?
             *
             * One element doing two jobs, both of which the screen needs. A
             * separate legend row would be a second thing saying the first
             * thing's numbers, which `ui-restraint-and-copy.md` §1 rules out.
             */}
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-3 text-ink-muted">
              <span>
                Drawn {m.date} · {m.options.length} options
              </span>
              {optionTally(m.options).map((t) => (
                <span key={t.status} className="xpl-tally">
                  <span className={`xpl-dot xpl-dot--${t.status}`} aria-hidden />
                  {t.n} {STATUS_TALLY[t.status]}
                </span>
              ))}
              {s.route ? (
                <span>
                  {/* The separator is inside the span, not a gap: a bare link
                      after two tally items read as a third tally item. */}
                  <span aria-hidden>· </span>
                  <Link href={s.route} className="text-primary hover:underline">
                    the live page
                  </Link>
                </span>
              ) : null}
            </p>
          </div>
        </div>

        <div className="sa-container py-10">
          <ExplorationViewer
            surfaceId={s.id}
            module={m}
            initialOptionId={typeof option === "string" ? option : undefined}
          />
        </div>
      </main>

      <HubFooter />
    </div>
  );
}
