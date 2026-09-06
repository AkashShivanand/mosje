/**
 * smile-admin's footer — a light band with the copyright, the powered-by line
 * and three policy links.
 *
 * It is NOT the design system's `Footer`, which is the slim navy app-shell band.
 * Adopting that here would turn this footer dark, which is a redesign rather
 * than a migration. See the note on the hub footer: one light variant in the
 * design system would let all three converge.
 */
export function SmileFooter() {
  return (
    <footer className="mt-3xl border-t border-stroke-200 bg-white">
      <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-sm px-md py-md text-body-3 text-ink-muted md:flex-row md:items-center md:px-lg">
        <div>
          <span className="hidden md:inline">
            © 2026 Ministry of Social Justice &amp; Empowerment, Government of India.
            All rights reserved.
          </span>
          <span className="md:hidden">© 2026 MoSJE, Government of India.</span>
        </div>
        <div className="flex flex-wrap items-center gap-md">
          <span className="hidden text-ink-hint md:inline">
            Powered by NeGD · MeitY Government of India · UX4G
          </span>
          <span className="text-ink-hint md:hidden">NeGD · MeitY · UX4G</span>
          <a href="#" className="hover:text-ink">
            Terms
          </a>
          <a href="#" className="hover:text-ink">
            Privacy
          </a>
          <a href="#" className="hover:text-ink">
            Accessibility
          </a>
        </div>
      </div>
    </footer>
  );
}
