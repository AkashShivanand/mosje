import { T } from "@/components/i18n/translation-provider";
import Image from "next/image";
import Link from "next/link";
import {
  ActionTile,
  FactStrip,
  Icon,
  buttonClasses,
} from "@mosje/design-system";
import { GLANCE } from "./facts";

/**
 * The home page's first screen: what a citizen can DO here (issue NAV-01), and
 * the three figures the Department publishes about its reach (DBIM statistics
 * strip), under the banner carousel and the announcements ticker. The search
 * is a plain GET form rather than the design system's `Search`: `Search` is a
 * controlled client component, and this one must work before any script loads.
 * Five tasks as ActionTiles, then the figures as a FactStrip.
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
                <input
                  id="hero-q"
                  name="q"
                  type="search"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Search schemes and services"
                />
                <button
                  type="submit"
                  className={buttonClasses("primary", "filled", "md")}
                >
                  <T>Search</T>
                </button>
              </div>
            </form>
          </div>
          <div className="wn-home-hero__media">
            <Image
              src="/website/images/samavesh-citizens-4x3.jpg"
              alt="People of different ages and communities, including a wheelchair user, standing together"
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="wn-home-hero__img"
            />
          </div>
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

        <div className="wn-home-glance">
          <FactStrip
            ariaLabel="The Department at a Glance"
            items={GLANCE.map((g) => ({
              icon: g.icon,
              value: g.value,
              label: g.label,
              note: g.note,
            }))}
          />
          <Link
            href="/website/dashboard"
            className={buttonClasses(
              "primary",
              "outlined",
              "md",
              "wn-home-glance__cta",
              "inverse",
            )}
          >
            <T>View Dashboard</T>
            <Icon name="arrow_forward" size={20} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
