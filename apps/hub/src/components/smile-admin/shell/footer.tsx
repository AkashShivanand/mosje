export function Footer() {
  return (
    <footer className="mt-3xl border-t border-stroke-200 bg-white">
      <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-sm px-md py-md text-label-3 text-ink-muted md:flex-row md:items-center md:px-lg">
        <div className="leading-relaxed">
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
