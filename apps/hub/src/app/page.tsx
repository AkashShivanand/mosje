import { Globe, BookOpen, LayoutDashboard, FileBarChart, ArrowRight } from "lucide-react";

const destinations = [
  {
    title: "Website",
    description: "Unified informational site for DoSJE and its associated organisations.",
    icon: Globe,
    href: "/website",
    cta: "Visit website",
    available: true,
  },
  {
    title: "Design System",
    description: "SAMAVESH component library, design tokens, and Storybook documentation.",
    icon: BookOpen,
    href: "/storybook/",
    cta: "Open Storybook",
    available: true,
  },
  {
    title: "Portals",
    description: "Authenticated workflow portals for schemes, scholarships, and organisations.",
    icon: LayoutDashboard,
    href: "/portals",
    cta: "Select a portal",
    available: true,
  },
  {
    title: "Reports",
    description: "QC and audit reports for the MoSJE digital estate.",
    icon: FileBarChart,
    href: "/reports",
    cta: "Coming soon",
    available: false,
  },
] as const;

export default function GatePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Gov utility bar */}
      <header className="border-b border-border bg-surface py-4">
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-6">
          <span className="text-lg font-semibold text-gov-blue">MoSJE</span>
          <span aria-hidden="true" className="text-border">|</span>
          <span className="text-sm text-ink-muted">Digital Estate</span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-[1280px] px-6 pb-4 pt-16">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gov-blue">
          Government of India
        </p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-ink">
          Ministry of Social Justice &amp; Empowerment
        </h1>
        <p className="max-w-xl text-ink-muted">
          Select a destination to access the website, design system, workflow
          portals, or audit reports.
        </p>
      </section>

      {/* Destination cards */}
      <main id="main-content" className="mx-auto w-full max-w-[1280px] flex-1 px-6 pb-16 pt-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map(({ title, description, icon: Icon, href, cta, available }) =>
            available ? (
              <a
                key={title}
                href={href}
                className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition hover:border-gov-blue hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-gov-blue"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gov-blue-tonal text-gov-blue">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="mb-1.5 text-lg font-semibold text-ink">{title}</h2>
                <p className="mb-6 flex-1 text-sm text-ink-muted">{description}</p>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-gov-blue transition-all group-hover:gap-2.5">
                  {cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </a>
            ) : (
              <div
                key={title}
                aria-label={`${title} — ${cta}`}
                className="flex cursor-not-allowed flex-col rounded-xl border border-border bg-surface-muted p-6 opacity-60"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-border text-ink-muted">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="mb-1.5 text-lg font-semibold text-ink">{title}</h2>
                <p className="mb-6 flex-1 text-sm text-ink-muted">{description}</p>
                <span className="text-sm text-ink-muted">{cta}</span>
              </div>
            )
          )}
        </div>
      </main>

      <footer className="border-t border-border bg-surface px-6 py-4 text-center text-xs text-ink-muted">
        Ministry of Social Justice and Empowerment — Government of India
      </footer>
    </div>
  );
}
