import Image from "next/image";
import Link from "next/link";
import { Icon, buttonClasses } from "@mosje/design-system";
import { GLANCE } from "./facts";

/**
 * The home page's first screen: what a citizen can DO here (issue NAV-01), and
 * the three figures the Department publishes about its reach (DBIM statistics
 * strip). One static message (no carousel: WCAG 2.2.2, ACC-11), a search that
 * works without JavaScript (a plain GET form), five tasks as tiles, then the
 * figures along the foot of the band.
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
    <section className="wn-home-hero" aria-labelledby="hero-title" data-sa-rail-clear="">
      <div className="sa-container">
        <div className="wn-home-hero__grid">
          <div className="wn-home-hero__copy">
            <h1 id="hero-title" className="wn-home-hero__title">
              Find Schemes, Services and Support
            </h1>
            <p className="wn-home-hero__lead">
              For Scheduled Castes, Other Backward Classes, senior citizens, transgender persons and every group the
              Department serves.
            </p>
            <form className="wn-home-hero__search" action="/website/search" method="get" role="search">
              <label htmlFor="hero-q" className="sr-only">
                Search schemes, services and documents
              </label>
              <div className="wn-home-hero__field">
                <Icon name="search" size={24} aria-hidden />
                <input
                  id="hero-q"
                  name="q"
                  type="search"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Search schemes and services"
                />
                <button type="submit" className={buttonClasses("primary", "filled", "md")}>
                  Search
                </button>
              </div>
            </form>
          </div>
          <div className="wn-home-hero__media">
            <Image
              src="/website/images/samavesh-citizens-4x3.jpg"
              alt="People of different ages and communities, including a wheelchair user, standing together"
              fill
              priority
              sizes="(min-width: 1024px) 480px, 100vw"
              className="wn-home-hero__img"
            />
          </div>
        </div>

        <nav aria-label="Common tasks" className="wn-home-tasks">
          <ul>
            {TASKS.map((t) => (
              <li key={t.label}>
                {"external" in t ? (
                  <a href={t.href} target="_blank" rel="noopener noreferrer" className="wn-home-task">
                    <span className="wn-home-task__icon" aria-hidden>
                      <Icon name={t.icon} size={24} />
                    </span>
                    <span className="wn-home-task__label">
                      {t.label}
                      <span className="sr-only"> (opens in a new window)</span>
                    </span>
                    <span className="wn-home-task__go" aria-hidden>
                      <Icon name="open_in_new" size={20} />
                    </span>
                  </a>
                ) : (
                  <Link href={t.href} className="wn-home-task">
                    <span className="wn-home-task__icon" aria-hidden>
                      <Icon name={t.icon} size={24} />
                    </span>
                    <span className="wn-home-task__label">{t.label}</span>
                    <span className="wn-home-task__go" aria-hidden>
                      <Icon name="arrow_forward" size={20} />
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <section className="wn-home-glance" aria-labelledby="glance-title">
          <h2 id="glance-title" className="sr-only">
            The Department at a Glance
          </h2>
          <dl className="wn-home-glance__list">
            {GLANCE.map((g) => (
              <div key={g.label} className="wn-home-glance__item">
                <dt className="wn-home-glance__label">{g.label}</dt>
                <dd className="wn-home-glance__value">{g.value}</dd>
                <dd className="wn-home-glance__note">{g.note}</dd>
              </div>
            ))}
          </dl>
          <Link href="/website/dashboard" className={buttonClasses("primary", "outlined", "md", "wn-home-glance__cta", "inverse")}>
            View Dashboard
            <Icon name="arrow_forward" size={20} aria-hidden />
          </Link>
        </section>
      </div>
    </section>
  );
}
