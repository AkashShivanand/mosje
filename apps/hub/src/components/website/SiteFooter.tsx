import Image from "next/image";
import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

const columns: FooterColumn[] = [
  {
    heading: "Department",
    links: [
      { label: "About Ministry", href: "/website/about-us" },
      { label: "Vision & Mission", href: "/website/about-us" },
      { label: "Organisational Chart", href: "/website/about-us" },
      { label: "Ministers & Officials", href: "/website/whos-who" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Schemes & Benefits", href: "/website/schemes-services" },
      { label: "Tenders", href: "/website/tenders" },
      { label: "Vacancies", href: "/website/vacancies" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help & Support", href: "/website/contact-us" },
      { label: "Contact Us", href: "/website/contact-us" },
      { label: "RTI", href: "/website/rti" },
      { label: "Sitemap", href: "/website/sitemap" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Notices", href: "/website/notices" },
      { label: "Acts & Rules", href: "/website/acts-rules" },
      { label: "Reports", href: "/website/annual-reports" },
      { label: "Publications", href: "/website/publications" },
      { label: "Statistics", href: "/website/about-the-division-statistics-division" },
    ],
  },
];

const bottomLinks: FooterLink[] = [
  { label: "Terms & Conditions", href: "/website/terms-conditions" },
  { label: "Privacy Policy", href: "/website/privacy-policy" },
  { label: "Copyright Policy", href: "/website/copyright" },
  { label: "Hyperlinking Policy", href: "/website/terms-conditions#hyperlink" },
  { label: "Accessibility Statement", href: "/website/accessibility" },
  { label: "Help & Support", href: "/website/contact-us" },
  { label: "Sitemap", href: "/website/sitemap" },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      {/* TOP AREA */}
      <div className="sa-container py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Column 1 — Brand + Contact (wider) */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-3">
              <Image
                src="/website/images/National_Emblem_logo_white.svg"
                alt="National Emblem of India"
                width={42}
                height={56}
                className="h-14 w-auto shrink-0"
              />
              <div className="leading-tight">
                <p className="text-sm text-white/80">Government of India</p>
                <p className="text-sm text-white/80">
                  Ministry of Social Justice &amp; Empowerment
                </p>
                <p className="text-sm font-bold text-white">
                  Department of Social Justice &amp; Empowerment
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-white">Need Support?</h3>
              <p className="mt-1 text-sm text-white/70">
                Reach out to us and we will get back to you!
              </p>
              <Link
                href="/website/contact-us"
                className="mt-3 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Get in Touch
              </Link>
            </div>

            <address className="mt-6 text-sm not-italic leading-relaxed text-white/70">
              8th Floor, GPOA-3, Netaji Nagar, New Delhi – 110023
            </address>

            {/* Social media links */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.facebook.com/goimsje"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.022 1.792-4.69 4.533-4.69 1.312 0 2.686.235 2.686.235v2.969h-1.514c-1.491 0-1.956.93-1.956 1.886v2.243h3.328l-.532 3.49h-2.796V24C19.612 23.093 24 18.099 24 12.073z"/></svg>
              </a>
              <a
                href="https://x.com/msjegoi"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://www.instagram.com/msjegoi"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href="https://www.youtube.com/@ministryofsocialjustice511"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h3 className="font-semibold text-white">{column.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* ATTRIBUTION ROW */}
      <div className="border-t border-white/15">
        <div className="sa-container flex flex-col items-start gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-white/70">
            <p>Developed &amp; Maintained by</p>
            <p className="font-medium text-white">
              Digital India Corporation, Ministry of Electronics &amp; IT
              (MeitY), Government of India
            </p>
            <p className="mt-1 text-xs text-white/50">
              Contents owned and managed by Department of Social Justice and Empowerment, GOI
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-6">
            <Image
              src="/website/images/NeGD-Logo.svg"
              alt="National e-Governance Division (NeGD)"
              width={90}
              height={40}
              className="h-10 w-auto"
            />
            <Image
              src="/website/images/Digital-India-White.svg"
              alt="Digital India"
              width={90}
              height={40}
              className="h-10 w-auto"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="bg-primary-dark">
        <div className="sa-container flex flex-col items-center gap-3 py-4 text-sm text-white/70 md:flex-row md:justify-between">
          <p>
            © 2026 Department of Social Justice &amp; Empowerment. All Rights
            Reserved.
          </p>
          <nav aria-label="Footer legal links">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {bottomLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
