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
  { label: "Help & Support", href: "/website/contact-us" },
  { label: "Sitemap", href: "/website/sitemap" },
  { label: "Terms & Conditions", href: "/website/terms-conditions" },
  { label: "Privacy Policy", href: "/website/privacy-policy" },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      {/* TOP AREA */}
      <div className="mx-auto max-w-[1280px] px-4 py-12">
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
              8th Floor, GPOA-3, Netaji Subhash Place, Wazirpur, New Delhi –
              110034
            </address>
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
        <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-white/70">
            <p>Developed &amp; Maintained by</p>
            <p className="font-medium text-white">
              Digital India Corporation, Ministry of Electronics &amp; IT
              (MeitY), Government of India
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
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-3 px-4 py-4 text-sm text-white/70 md:flex-row md:justify-between">
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
