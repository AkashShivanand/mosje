import type { Metadata } from "next";
import Link from "next/link";
import type { NavItem } from "@mosje/design-system";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { NAV } from "@/components/website-next/chrome/nav";
import { POLICY_PAGES } from "@/components/website-next/templates/content/policies";

const TITLE = "Sitemap";
const DESCRIPTION = "Every section of this website and the pages within it, arranged as in the main menu.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/**
 * GENERATED FROM THE NAVIGATION, NOT TYPED (issue X-GIGW-03, MAN-09).
 *
 * The previous sitemap was a hand list of 28 links that had already drifted from the
 * menu: four of eighteen organisations, no Documents sub-sections, and an
 * Accessibility Statement address that is now a redirect. This page reads the same
 * `NAV` model the masthead renders, so a page added to the menu is on the sitemap the
 * same day, and the Website Policy pages from the list their own hub reads.
 *
 * `lastUpdated` is the date this generated page was authored (21 Sep 2026).
 *
 * The footer's columns are not exported by Footer.tsx, so the pages only the footer
 * links (Archives, Feedback) are reached here through Website Policies and Contact.
 */
interface Group {
  heading?: string;
  links: { label: string; href: string }[];
}

function groupsOf(item: NavItem): Group[] {
  const groups: Group[] = [];
  if (item.children?.length) {
    groups.push({ links: item.children.filter((c) => c.href && c.href !== "#").map((c) => ({ label: c.label, href: c.href })) });
  }
  for (const col of item.columns ?? []) {
    const links = [
      ...(col.items ?? []).map((o) => ({ label: o.name, href: o.href })),
      ...(col.links ?? []).map((l) => ({ label: l.label, href: l.href })),
    ].filter((l) => l.href && l.href !== "#");
    if (links.length) groups.push({ heading: col.heading, links });
  }
  return groups;
}

const SECTIONS: { heading: string; groups: Group[] }[] = [
  { heading: "Home", groups: [{ links: [{ label: "Home", href: "/website" }] }] },
  ...NAV.map((item) => ({
    heading: item.label === "Organisations" ? "Organisations and Scheme Portals" : item.label,
    groups: groupsOf(item),
  })),
  { heading: "Website Policies", groups: [{ links: POLICY_PAGES.map((p) => ({ label: p.label, href: p.href })) }] },
];

const slug = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function Page() {
  return (
    <ContentPage title={TITLE} breadcrumb={[{ label: TITLE }]} description={DESCRIPTION} lastUpdated="21 Sep 2026">
      <nav aria-labelledby="sitemap-contents" className="wn-toc">
        <h2 className="wn-toc__title" id="sitemap-contents">
          Sections
        </h2>
        <ol>
          {SECTIONS.map((s) => (
            <li key={s.heading}>
              <a href={`#${slug(s.heading)}`}>{s.heading}</a>
            </li>
          ))}
        </ol>
      </nav>
      {SECTIONS.map((section) => (
        <section key={section.heading} aria-labelledby={slug(section.heading)}>
          <h2 id={slug(section.heading)}>{section.heading}</h2>
          {section.groups.map((g, i) => (
            <div key={g.heading ?? i}>
              {g.heading && <h3>{g.heading}</h3>}
              <ul>
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </ContentPage>
  );
}
