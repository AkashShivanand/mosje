import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { DBIM_FOOTER_LINKS, DBIM_MENU, DBIM_POLICY_TABS, dbimHref, type DbimLink } from "@/lib/website-dbim/nav";
import { DBIM_PERSONAS, DBIM_UTILITY_LINKS } from "@/lib/website-dbim/utility";

interface SitemapSection {
  title: string;
  links: DbimLink[];
}

/**
 * Every section of the site, GENERATED from the menu, the footer, the policy tabs,
 * the utility pages and the personas — never typed. A page added to any of those
 * lists appears here the same day.
 *
 * "Website Policies" is a section of its own (its tabs), so it is not repeated among
 * the footer's links, and the Sitemap does not list itself.
 */
function sections(): SitemapSection[] {
  const footer = DBIM_FOOTER_LINKS.filter((l) => l.path !== "/policies" && l.path !== "/sitemap");
  const seen = new Set(footer.map((l) => l.path));
  return [
    ...DBIM_MENU.map((m) => ({ title: m.label, links: m.children })),
    { title: "Website Policies", links: [...DBIM_POLICY_TABS] },
    { title: "Useful Links", links: [...footer, ...DBIM_UTILITY_LINKS.filter((l) => !seen.has(l.path))] },
    { title: "Explore User Personas", links: DBIM_PERSONAS.map((p) => ({ label: p.title, path: `/persona/${p.slug}` })) },
  ];
}

export function DbimSitemapTree() {
  return (
    <nav className="db-u-sitemap" aria-label="Sitemap">
      <p className="db-u-sitemap__home">
        <Link href={dbimHref("/")}>
          <Icon name="home" size={24} weight={400} aria-hidden />
          Home
        </Link>
      </p>
      {sections().map((s) => {
        const id = `sitemap-${s.title.toLowerCase().replace(/[^a-z]+/g, "-")}`;
        return (
          <section key={s.title} aria-labelledby={id} className="db-u-sitemap__section">
            <h2 id={id} className="db-u-sitemap__title">
              {s.title}
            </h2>
            <ul className="db-u-sitemap__list">
              {s.links.map((l) => (
                <li key={l.path + l.label} className="db-u-sitemap__item">
                  <Icon name="chevron_right" size={24} weight={400} aria-hidden className="db-u-sitemap__chev" />
                  <Link href={dbimHref(l.path)}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </nav>
  );
}
