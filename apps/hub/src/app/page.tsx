import { DEFAULT_APPS, Icon } from "@mosje/design-system";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EstateField } from "@/components/estate-field";

// ── Estate stats, derived from the single-source registry ──────────────────────
const portals = DEFAULT_APPS.filter((a) => a.group === "Portals");
const livePortals = portals.filter((a) => (a.status ?? "live") === "live").length;
const totalPortals = portals.length;

const destinations = [
  {
    title: "Website",
    description:
      "The unified informational site for the department and its associated organisations.",
    icon: "language",
    href: "/website",
    cta: "Visit website",
  },
  {
    title: "Portals",
    description:
      "Authenticated workflow portals for schemes, scholarships, finance corporations and commissions.",
    icon: "grid_view",
    href: "/portals",
    cta: "Browse portals",
  },
  {
    title: "Design System",
    description:
      "SAMAVESH — foundations, tokens, components and documentation that power every property.",
    icon: "widgets",
    href: "/design-system",
    cta: "Open SAMAVESH",
  },
  {
    title: "Reports",
    description:
      "Design QC, accessibility and audit reports across the MoSJE digital estate.",
    icon: "assessment",
    href: "/reports",
    cta: "View reports",
  },
] as const;

const glance = [
  { icon: "language", value: "1", label: "Unified website", sub: "consolidating 13 legacy sites" },
  { icon: "grid_view", value: `${totalPortals}`, label: "Workflow portals", sub: `${livePortals} live, rest in development` },
  { icon: "apartment", value: "33+", label: "Organisations & schemes", sub: "across the ministry" },
  { icon: "verified_user", value: "AA", label: "WCAG 2.1 + GIGW", sub: "accessibility & gov standards" },
] as const;

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:left-4 focus:top-4 focus:rounded-lg focus:bg-gov-blue focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-primary"
      >
        Skip to main content
      </a>

      <SiteHeader current="/" />

      <main id="main-content" className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-border bg-surface">
          {/* The estate's signature surface — shared verbatim with the gate. */}
          <EstateField />

          <div className="relative mx-auto max-w-[1280px] px-6 py-20 sm:py-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-gov-blue shadow-xs backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gov-blue" />
              Government of India
            </div>

            {/* No max-width clamp: the full title fits the 1280px column on one
                line at lg. Clamping it to max-w-3xl (768px) forced a wrap that
                orphaned the "&" at the end of line 1. */}
            <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
              Ministry of Social Justice{" "}
              <span className="whitespace-nowrap text-gov-blue">&amp; Empowerment</span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
              One front door to the entire digital estate — the unified website,
              the SAMAVESH design system, every workflow portal, and the reports
              behind them.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/portals"
                className="inline-flex items-center gap-2 rounded-lg bg-gov-blue px-5 py-3 text-sm font-semibold text-on-primary shadow-xs transition-colors hover:bg-gov-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gov-blue"
              >
                Browse the portals
                <Icon name="arrow_forward" size={16} aria-hidden="true" />
              </a>
              <a
                href="/website"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-border-strong hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gov-blue"
              >
                Visit the website
              </a>
            </div>
          </div>
        </section>

        {/* ── Destination cards ────────────────────────────────────────── */}
        <section
          aria-labelledby="destinations-heading"
          className="mx-auto max-w-[1280px] px-6 py-16"
        >
          <div className="mb-8">
            <h2
              id="destinations-heading"
              className="text-2xl font-bold tracking-tight text-ink"
            >
              Explore the estate
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map(({ title, description, icon: iconName, href, cta }) => (
              <a
                key={title}
                href={href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-gov-blue/40 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gov-blue"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gov-blue transition-transform duration-300 group-hover:scale-x-100"
                />
                <div className="mb-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gov-blue-tonal text-gov-blue transition-colors group-hover:bg-gov-blue group-hover:text-on-primary">
                    <Icon name={iconName} aria-hidden="true" />
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-ink">{title}</h3>
                <p className="mb-6 mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                  {description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gov-blue transition-all group-hover:gap-2.5">
                  {cta}
                  <Icon name="arrow_forward" size={16} aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Estate at a glance ───────────────────────────────────────── */}
        <section
          aria-labelledby="glance-heading"
          className="border-y border-border bg-surface"
        >
          <div className="mx-auto max-w-[1280px] px-6 py-12">
            <h2
              id="glance-heading"
              className="mb-8 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted"
            >
              The estate at a glance
            </h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
              {glance.map(({ icon: iconName, value, label, sub }) => (
                <div key={label} className="flex flex-col gap-2">
                  <Icon name={iconName} size={20} className="text-gov-blue" aria-hidden="true" />
                  <dd className="text-4xl font-bold tracking-tight text-ink">
                    {value}
                  </dd>
                  <dt className="text-sm font-semibold text-ink">{label}</dt>
                  <p className="text-xs text-ink-muted">{sub}</p>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
