const LINKS = [
  { label: "Website", href: "/website" },
  { label: "Portals", href: "/portals" },
  { label: "Design System", href: "/design-system" },
  { label: "Storybook", href: "/storybook/" },
  { label: "Reports", href: "/reports" },
  // Administration is the estate's back of house, and this footer is the one
  // piece of chrome every hub page already carries — so it is where the door
  // belongs, rather than a new floating control or a URL people memorise.
  //
  // Exposing the link is not exposing the panel: `/admin` sits OUTSIDE the site
  // gate by design (it is the recovery path when the gate password is lost) and
  // is guarded on its own by `requireAdmin()`. An unauthenticated visitor
  // following this link reaches a password form, which is the same thing they
  // would reach by typing the path — the link only saves them from having to
  // know it.
  { label: "Administration", href: "/admin" },
] as const;

/**
 * The hub's own footer — the index surfaces at `/`, `/portals` and `/reports`.
 *
 * It is NOT the design system's `SiteFooter`, which is the statutory website
 * footer (organisation block, policy links, credits, lineage), nor its `Footer`,
 * which is the portal app-shell's slim navy band. This is a third thing: a light
 * two-tier footer for internal wayfinding. If the estate decides it wants one
 * footer rather than three, the design system needs a light variant of `Footer`
 * — that is a design decision, not a rename.
 */
export function HubFooter() {
  const year = 2026;
  return (
    <footer className="border-t border-border bg-surface">
      <div className="sa-container py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <p className="text-title-3 text-ink">
              Ministry of Social Justice &amp; Empowerment
            </p>
            <p className="mt-1 text-body-2 text-ink-muted">
              Government of India — unified digital estate. Built on the SAMAVESH
              design system to DBIM, GIGW &amp; WCAG&nbsp;2.1&nbsp;AA standards.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-body-2 text-ink-muted transition-colors hover:text-primary hover:underline"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-5 text-body-3 text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Government of India. All rights reserved.</span>
          <span>Accessible · Bilingual-ready · Open standards</span>
        </div>
      </div>
    </footer>
  );
}
