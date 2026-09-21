import Image from "next/image";
import Link from "next/link";
import { Icon, buttonClasses } from "@mosje/design-system";

/**
 * The home page's first screen: what a citizen can DO here (issue NAV-01).
 *
 * The classic site opened on an auto-advancing carousel of event banners
 * (WCAG 2.2.2, issues ACC-11 and X-ACC-01) and put no task on the first screen.
 * This is one static message, a search that works without JavaScript (a plain
 * GET form to the results page), and the five tasks citizens come for.
 */
const TASKS = [
  { label: "Find a Scheme", href: "/website/schemes-services", icon: "manage_search" },
  { label: "Apply and Track Online", href: "/portals", icon: "assignment" },
  { label: "File a Grievance", href: "https://pgportal.gov.in/", icon: "report", external: true },
  { label: "Call a Helpline", href: "#helplines", icon: "call" },
  { label: "Tenders and Vacancies", href: "/website/tenders", icon: "work" },
] as const;

export function Hero() {
  return (
    <section className="wn-hero" aria-labelledby="hero-title">
      <div className="sa-container wn-hero__grid">
        <div className="wn-hero__copy">
          <h1 id="hero-title" className="wn-hero__title">
            Find Schemes, Services and Support
          </h1>
          <p className="wn-hero__lead">
            For Scheduled Castes, Other Backward Classes, senior citizens, transgender persons and every
            group the Department serves.
          </p>
          <form className="wn-hero__search" action="/website/search" method="get" role="search">
            <label htmlFor="hero-q" className="wn-hero__label">
              Search schemes, services and documents
            </label>
            <div className="wn-hero__field">
              <Icon name="search" size={24} aria-hidden />
              <input
                id="hero-q"
                name="q"
                type="search"
                autoComplete="off"
                spellCheck={false}
                placeholder="For example, scholarship…"
              />
              <button type="submit" className={buttonClasses("primary", "filled", "md")}>
                Search
              </button>
            </div>
          </form>
          <nav aria-label="Common tasks" className="wn-hero__tasks">
            <ul>
              {TASKS.map((t) => (
                <li key={t.label}>
                  {"external" in t ? (
                    <a href={t.href} target="_blank" rel="noopener noreferrer">
                      <Icon name={t.icon} size={20} aria-hidden />
                      <span>{t.label}</span>
                      <span className="sr-only"> (opens in a new window)</span>
                      <Icon name="open_in_new" size={16} aria-hidden />
                    </a>
                  ) : (
                    <Link href={t.href}>
                      <Icon name={t.icon} size={20} aria-hidden />
                      <span>{t.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="wn-hero__media">
          <Image
            src="/website/images/samavesh-citizens-4x3.jpg"
            alt="People of different ages and communities, including a wheelchair user, standing together"
            fill
            priority
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
