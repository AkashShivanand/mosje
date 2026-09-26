import Link from "next/link";

export interface PolicyPage {
  label: string;
  href: string;
  /** One line saying what the page covers. Shown on the Website Policies hub. */
  summary: string;
}

/**
 * The Website Policy pages, in one list (issues MAN-03, X-GIGW-03).
 *
 * DBIM 3.0 §5.6 asks for a Website Policy section; GIGW 3.0 §5.4.3 and the
 * Compliance & Certification Handbook name the policies it holds. The hub page
 * (`/website/website-policies`), each policy page's side panel and the sitemap
 * all read this list, so a policy added here appears in all three.
 */
export const POLICY_PAGES: PolicyPage[] = [
  { label: "Copyright Policy", href: "/website/copyright", summary: "The terms on which material on this website may be reproduced." },
  { label: "Hyperlinking Policy", href: "/website/hyperlinking-policy", summary: "Links from this website to other websites, and from other websites to this one." },
  { label: "Privacy Policy", href: "/website/privacy-policy", summary: "What information this website collects when you visit it, and how it is used." },
  { label: "Terms & Conditions", href: "/website/terms-conditions", summary: "The terms on which this website may be used." },
  { label: "Disclaimer", href: "/website/disclaimer", summary: "The limits of the Department's responsibility for this website and for the websites it links to." },
  { label: "Accessibility Statement", href: "/website/accessibility-statement", summary: "The accessibility standard this website is built to, its known limitations and how to report a barrier." },
  { label: "Screen Reader Access", href: "/website/screen-reader-access", summary: "Screen readers that can be used to read this website, and where to obtain them." },
  { label: "Cookie Policy", href: "/website/cookies", summary: "What this website stores in your browser, and why." },
  { label: "Archives", href: "/website/archives", summary: "Tenders, vacancies and other notices whose period of publication has ended." },
  { label: "Help", href: "/website/help", summary: "How to open the file formats in which documents on this website are published." },
];

/** The side panel on every policy page: the other policies, the current one marked. */
export function PolicySidebar({ current }: { current: string }) {
  return (
    <nav className="wn-panel" aria-labelledby="policy-nav-title">
      <h2 className="wn-panel__title" id="policy-nav-title">
        Website Policies
      </h2>
      <ul>
        {POLICY_PAGES.map((p) => (
          <li key={p.href}>
            <Link href={p.href} aria-current={p.href === current ? "page" : undefined}>
              {p.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
