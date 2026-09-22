import { T } from "@/components/i18n/translation-provider";
import Link from "next/link";
import { HeroSearchInput } from "./HeroSearchInput";
import { ActionTile, Icon, buttonClasses } from "@mosje/design-system";

/**
 * The citizen's starting point (issue NAV-01), in a compact band under the
 * banner carousel and the announcements ticker — the one addition to the live
 * home page's structure, because the live page offers no task at all. The
 * headline and the search share a row; the five tasks follow. The search is a
 * plain GET form rather than the design system's `Search`: `Search` is a
 * controlled client component, and this one must work before any script loads.
 */
const TASKS = [
  {
    label: "Find a Scheme",
    href: "/website/schemes-services",
    icon: "manage_search",
  },
  { label: "Apply and Track Online", href: "/portals", icon: "assignment" },
  {
    label: "File a Grievance",
    href: "https://pgportal.gov.in/",
    icon: "report",
    external: true,
  },
  { label: "Call a Helpline", href: "#helplines", icon: "call" },
  { label: "Tenders and Vacancies", href: "/website/tenders", icon: "work" },
] as const;

export function Hero() {
  return (
    <section
      className="wn-home-hero"
      aria-labelledby="hero-title"
      data-sa-rail-clear=""
    >
      <div className="sa-container">
        <div className="wn-home-hero__grid">
          <div className="wn-home-hero__copy">
            <h1 id="hero-title" className="wn-home-hero__title">
              <T>Find Schemes, Services and Support</T>
            </h1>
            <p className="wn-home-hero__lead">
              <T>
                For Scheduled Castes, Other Backward Classes, senior citizens,
                transgender persons and every group the Department serves.
              </T>
            </p>
          </div>
          <form
            className="wn-home-hero__search"
            action="/website/search"
            method="get"
            role="search"
          >
            <label htmlFor="hero-q" className="sr-only">
              <T>Search schemes, services and documents</T>
            </label>
            <div className="wn-home-hero__field">
              <Icon name="search" size={24} aria-hidden />
              <HeroSearchInput />
              <button
                type="submit"
                className={buttonClasses("primary", "filled", "md")}
              >
                <T>Search</T>
              </button>
            </div>
          </form>
        </div>

        <nav aria-label="Common tasks" className="wn-home-tasks">
          <ul>
            {TASKS.map((t) => (
              <li key={t.label}>
                <ActionTile
                  linkAs={Link}
                  href={t.href}
                  title={<T>{t.label}</T>}
                  tone="inverse"
                  external={"external" in t}
                  media={<Icon name={t.icon} size={24} />}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
