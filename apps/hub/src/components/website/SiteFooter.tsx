import Image from "next/image";
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { getContentSyncedDate } from "@/lib/website/content";

/*
 * DS Audit — SiteFooter
 *   Icon                ✅ existing  · @mosje/design-system (Material Symbols Rounded 300)
 *   Link / Image        ✅ existing  · next/link, next/image
 *   Brand + social SVGs ✅ existing  · inline SVGs per CLAUDE.md (brand marks are not Icon glyphs)
 *   Footer (DS)         ⛔ not used  · the DS `Footer` is the slim single-band *app-shell* footer
 *                                      for portals. This is the content-bound public-website
 *                                      footer (MoSJE routes, address, lineage); it composes DS
 *                                      primitives rather than duplicating the shell component.
 *
 * COMPLIANCE NOTES
 *   [DBIM 5.6]  Footer background is the darkest shade of the key colour group
 *               (`--sa-color-brand-navy` via `bg-navy`). The bottom bar deepens the same
 *               colour with `bg-black/15` instead of the previous *lighter* `bg-primary-dark`,
 *               which violated "darkest shade".
 *   [DBIM 5.6]  Required elements present: Website Policies, Sitemap, Related Links, Help,
 *               Feedback, Last Updated On, Social Media Links, hyperlinked lineage logos.
 *               "Archives" is listed by DBIM as optional and has no page on this estate yet.
 *   [DBIM 5.6]  Lineage statement uses the mandated Central-Government-Department wording.
 *   [DBIM 3.7]  Icons are inclusive white; social glyphs render at 24px (a DBIM icon size)
 *               inside 40px controls so the hit area also clears WCAG 2.2 §2.5.8.
 *   [WCAG AA]   Every muted tone is >= white/70 on navy (>= 6.9:1). white/50 (4.27:1) is gone.
 *   [WCAG 2.4.7 / 2.4.11]  Every interactive element carries a visible focus ring.
 *   [GIGW]      External links open in a new window and say so to screen readers.
 */

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  heading: string;
  /** Stable id so the <nav> can be labelled BY the visible heading, not a duplicate string. */
  id: string;
  links: FooterLink[];
}

const columns: FooterColumn[] = [
  {
    heading: "Department",
    id: "footer-department",
    links: [
      { label: "About Ministry", href: "/website/about-us" },
      { label: "Vision & Mission", href: "/website/about-us" },
      { label: "Organisational Chart", href: "/website/whos-who" },
      { label: "Ministers & Officials", href: "/website/mosje-directory" },
    ],
  },
  {
    heading: "Services",
    id: "footer-services",
    links: [
      { label: "Schemes & Benefits", href: "/website/schemes-services" },
      { label: "Tenders", href: "/website/tenders" },
      { label: "Vacancies", href: "/website/vacancies" },
    ],
  },
  {
    heading: "Support",
    id: "footer-support",
    links: [
      { label: "Help & Support", href: "/website/contact-us" },
      { label: "Contact Us", href: "/website/contact-us" },
      { label: "RTI", href: "/website/rti" },
      { label: "Sitemap", href: "/website/sitemap" },
    ],
  },
  {
    heading: "Resources",
    id: "footer-resources",
    links: [
      { label: "Notices", href: "/website/notices" },
      { label: "Acts & Rules", href: "/website/acts-rules" },
      { label: "Reports", href: "/website/annual-reports" },
      { label: "Publications", href: "/website/publications" },
      { label: "Statistics", href: "/website/dashboard" },
    ],
  },
];

/** [DBIM 5.6] "Related Links" — hyperlinks to other government platforms. All external. */
const relatedLinks: FooterLink[] = [
  { label: "National Portal of India", href: "https://www.india.gov.in/" },
  { label: "MyGov", href: "https://www.mygov.in/" },
  { label: "Open Government Data", href: "https://data.gov.in/" },
  { label: "Digital India", href: "https://www.digitalindia.gov.in/" },
  { label: "Grievance Redressal (CPGRAMS)", href: "https://pgportal.gov.in/" },
];

/** [DBIM 5.6] Website Policies + Help + Feedback + Sitemap. */
const policyLinks: FooterLink[] = [
  { label: "Terms & Conditions", href: "/website/terms-conditions" },
  { label: "Privacy Policy", href: "/website/privacy-policy" },
  { label: "Copyright Policy", href: "/website/copyright" },
  { label: "Hyperlinking Policy", href: "/website/hyperlinking-policy" },
  { label: "Accessibility Statement", href: "/website/accessibility" },
  { label: "Feedback", href: "/website/contact-us#feedback" },
  { label: "Help & Support", href: "/website/contact-us" },
  { label: "Sitemap", href: "/website/sitemap" },
];

interface SocialLink {
  label: string;
  href: string;
  path: string;
}

const socialLinks: SocialLink[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/goimsje",
    path: "M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.022 1.792-4.69 4.533-4.69 1.312 0 2.686.235 2.686.235v2.969h-1.514c-1.491 0-1.956.93-1.956 1.886v2.243h3.328l-.532 3.49h-2.796V24C19.612 23.093 24 18.099 24 12.073z",
  },
  {
    label: "X (formerly Twitter)",
    href: "https://x.com/msjegoi",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/msjegoi",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@ministryofsocialjustice511",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    label: "WhatsApp Channel",
    href: "https://whatsapp.com/channel/0029Vb7GfwH6mYPMHOvTd51W",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.8 11.8 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.8 11.8 0 0 0 20.465 3.49",
  },
];

/**
 * Focus ring shared by every footer control. White at full strength on the navy
 * ground (11.9:1) so it clears WCAG 2.2 §1.4.11 non-text contrast on its own.
 *
 * NO radius utility here, deliberately. It carried `rounded-sm` briefly, and because
 * this string is appended last, that 6px beat the `rounded-full` on the social
 * buttons and turned all five circles into squircles. The outline follows each
 * element's own border-radius anyway, so the ring never needed one.
 */
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/** Marks an external destination for assistive tech without adding visual noise. */
function NewWindowNote() {
  return <span className="sr-only"> (opens in a new window)</span>;
}

export interface SiteFooterProps {
  /**
   * [DBIM 5.6] "Last Updated On" — "the latest date of content updation of the
   * RESPECTIVE page", so `PageLayout` hands down the page's own stamp and the
   * footer only falls back to the estate-wide content sync date. Without this the
   * footer contradicted the page hero, which shows the per-page date already.
   */
  lastUpdated?: string;
}

export function SiteFooter({ lastUpdated }: SiteFooterProps = {}) {
  const updatedOn = lastUpdated ?? getContentSyncedDate();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <h2 className="sr-only">Site footer</h2>

      {/* SUPPORT BAND — mirrors the "Need Support?" strip on dosje.gov.in */}
      <div className="border-b border-white/15">
        <div className="sa-container flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Need Support?</h3>
            <p className="mt-1 text-sm text-white/80">
              Reach out to us and we will get back to you!
            </p>
          </div>
          {/*
            White fill, navy label. `bg-primary` on navy only reached 2.72:1 against the
            footer ground and failed WCAG 1.4.11; white reaches 12.6:1 and is the
            DBIM-sanctioned "inclusive white" treatment on the key colour. [DBIM 3.7]
          */}
          <Link
            href="/website/contact-us"
            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-white/90 ${focusRing}`}
          >
            Get in Touch
            <Icon name="arrow_forward" size={20} />
          </Link>
        </div>
      </div>

      {/* MAIN BAND */}
      <div className="sa-container py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand · address · social */}
          <div className="lg:col-span-4">
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

            <address className="mt-6 flex items-start gap-2 text-sm not-italic leading-relaxed text-white/80">
              <Icon name="location_on" size={20} className="mt-px shrink-0" />
              <span>8th Floor, GPOA-3, Netaji Nagar, New Delhi – 110023</span>
            </address>

            <nav aria-label="Social media" className="mt-6">
              <ul className="flex flex-wrap items-center gap-3">
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 ${focusRing}`}
                    >
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d={social.path} />
                      </svg>
                      <span className="sr-only">
                        {social.label}
                        <NewWindowNote />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <nav key={column.id} aria-labelledby={column.id} className="lg:col-span-2">
              <h3 id={column.id} className="font-semibold text-white">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`text-sm text-white/80 transition-colors hover:text-white hover:underline ${focusRing}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* RELATED LINKS — [DBIM 5.6] required element; also carries the GIGW-mandated
            india.gov.in link on every page of the estate. */}
        <nav
          aria-labelledby="footer-related"
          className="mt-10 border-t border-white/15 pt-8"
        >
          <h3 id="footer-related" className="font-semibold text-white">
            Related Links
          </h3>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5">
            {relatedLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1 text-sm text-white/80 transition-colors hover:text-white hover:underline ${focusRing}`}
                >
                  {link.label}
                  <Icon name="open_in_new" size={16} />
                  <NewWindowNote />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ATTRIBUTION — hyperlinked lineage logos [DBIM 5.6] */}
        <div className="mt-8 flex flex-col items-start gap-6 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-white/80">
            <p>Developed &amp; Maintained by</p>
            <p className="font-medium text-white">
              Digital India Corporation, Ministry of Electronics &amp; IT (MeitY),
              Government of India
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-6">
            <a
              href="https://negd.gov.in/"
              target="_blank"
              rel="noreferrer"
              className={`inline-flex ${focusRing}`}
            >
              <Image
                src="/website/images/NeGD-Logo.svg"
                alt="National e-Governance Division (NeGD)"
                width={90}
                height={40}
                className="h-10 w-auto"
              />
              <NewWindowNote />
            </a>
            <span className="flex items-center gap-3 text-sm text-white/80">
              Powered by
              <a
                href="https://www.digitalindia.gov.in/"
                target="_blank"
                rel="noreferrer"
                className={`inline-flex ${focusRing}`}
              >
                <Image
                  src="/website/images/Digital-India-White.svg"
                  alt="Digital India"
                  width={90}
                  height={40}
                  className="h-10 w-auto"
                />
                <NewWindowNote />
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR — the same key colour, deepened. Never a lighter blue. [DBIM 5.6] */}
      <div className="border-t border-white/15 bg-black/15">
        <div className="sa-container py-6">
          {/* [DBIM 5.6] Lineage statement, Central Government Department wording. */}
          <p className="text-sm text-white/80">
            This website belongs to the Department of Social Justice &amp; Empowerment,
            Ministry of Social Justice &amp; Empowerment, Government of India.
          </p>

          <nav aria-label="Website policies" className="mt-4">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {policyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`text-white/80 transition-colors hover:text-white hover:underline ${focusRing}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 text-sm text-white/80 md:flex-row md:items-center md:justify-between">
            {/* One interpolated string, not `© {year} Department…` — JSX dropped the
                space between the expression and the following text node, which shipped
                as "© 2026Department". */}
            <p>{`© ${year} Department of Social Justice & Empowerment. All Rights Reserved.`}</p>
            {/* [DBIM 5.6 · GIGW] "Last Updated On" is a mandatory footer element. */}
            {updatedOn && (
              <p>
                Last Updated: <time>{updatedOn}</time>
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
