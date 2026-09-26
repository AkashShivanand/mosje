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
      // A portal row's title is its name ("Senior Citizens Welfare"); an organisation row's is its abbreviation.
      ...(col.items ?? []).map((o) => ({ label: /\s/.test(o.abbr) ? o.abbr : o.name, href: o.href })),
      ...(col.action ? [{ label: col.action.label, href: col.action.href }] : []),
      ...(col.links ?? []).map((l) => ({ label: l.label, href: l.href })),
    ].filter((l) => l.href && l.href !== "#");
    if (links.length) groups.push({ heading: col.heading, links });
  }
  return groups;
}

/*
 * PAGES THE MENU DOES NOT LIST. The masthead carries the live site's menu (restored
 * 22 Sep 2026), which is narrower than the pages this site has; these are reached
 * from the home page, the footer and the pages themselves, and a sitemap must still
 * name them (GIGW).
 */
const OTHER_PAGES = [
  { label: "Divisions", href: "/website/about-the-division" },
  { label: "Citizen’s Charter", href: "/website/citizen-charter" },
  { label: "Official Language", href: "/website/official-language-act" },
  { label: "For Students", href: "/website/for-student" },
  { label: "For Beneficiaries", href: "/website/for-beneficiary" },
  { label: "For Researchers", href: "/website/for-researcher" },
  { label: "For Government Officials", href: "/website/for-government-official" },
  { label: "Schemes and Services", href: "/website/schemes-services" },
  { label: "Citizen Portals", href: "/portals" },
  { label: "Dashboard", href: "/website/dashboard" },
  { label: "Latest Updates", href: "/website/updates" },
  { label: "Newsletter", href: "/website/newsletter" },
  { label: "Research and Evaluation Studies", href: "/website/list-of-research-evaluation-studies" },
  { label: "Parliament Questions", href: "/website/lok-sabha-question-answer" },
  { label: "Grants to Voluntary Organisations", href: "/website/grants-in-aid-to-ngos-faqs" },
  { label: "Feedback", href: "/website/feedback" },
  { label: "Help", href: "/website/help" },
];

const SECTIONS: { heading: string; groups: Group[] }[] = [
  { heading: "Home", groups: [{ links: [{ label: "Home", href: "/website" }] }] },
  // Home is the first section already; a menu entry with no menu adds nothing here.
  ...NAV.filter((item) => item.children?.length || item.columns?.length).map((item) => ({
    heading: item.label,
    groups: groupsOf(item),
  })),
  { heading: "Other Pages", groups: [{ links: OTHER_PAGES }] },
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
