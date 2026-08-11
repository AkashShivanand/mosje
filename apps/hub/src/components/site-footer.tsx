const LINKS = [
  { label: "Website", href: "/website" },
  { label: "Portals", href: "/portals" },
  { label: "Design System", href: "/design-system" },
  { label: "Storybook", href: "/storybook/" },
  { label: "Reports", href: "/reports" },
] as const;

/** Shared estate footer for the gate pages. */
export function SiteFooter() {
  const year = 2026;
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <p className="text-sm font-semibold text-ink">
              Ministry of Social Justice &amp; Empowerment
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Government of India — unified digital estate. Built on the SAMAVESH
              design system to DBIM, GIGW &amp; WCAG&nbsp;2.1&nbsp;AA standards.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-sm text-ink-muted transition-colors hover:text-primary hover:underline"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-5 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Government of India. All rights reserved.</span>
          <span>Accessible · Bilingual-ready · Open standards</span>
        </div>
      </div>
    </footer>
  );
}
