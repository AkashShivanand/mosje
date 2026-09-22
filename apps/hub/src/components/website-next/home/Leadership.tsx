import { T } from "@/components/i18n/translation-provider";
import Image from "next/image";
import Link from "next/link";
import {
  Band,
  Icon,
  SectionTitle,
  FactStrip,
  buttonClasses,
} from "@mosje/design-system";
import { GLANCE, MANDATE } from "./facts";

/**
 * About the Department: its mandate in its own words, its Ministers, and its
 * divisions. The live page's one-line statement beneath the mandate is left
 * out: it says the mandate again ("most vulnerable" twice; ui-restraint §1).
 *
 * The divisions list replaces the classic "Important Links" wall tab, which
 * covered content on a phone (MOB-04): the same division pages, in the page.
 * Portrait names and designations are the alt text (ACC-04). One portrait set
 * to one specification is still owed by the Department (BRD-07, DBIM §6.1.4).
 * The cards are this page's own: the design system's Avatar stops at 48px, and
 * a Minister's headshot is not an avatar.
 */
const MINISTERS = [
  {
    img: "/website/content/organisation/Dr.-Virendra-Kumar.png",
    name: "Dr. Virendra Kumar",
    role: "Union Minister of Social Justice and Empowerment",
  },
  {
    img: "/website/content/organisation/Shri-Ramdas-Athawale.png",
    name: "Shri Ramdas Athawale",
    role: "Minister of State for Social Justice and Empowerment",
  },
  {
    img: "/website/content/organisation/minister_3.png",
    name: "Shri B. L. Verma",
    role: "Minister of State for Social Justice and Empowerment",
  },
];

const LINKS = [
  { label: "About the Department", href: "/website/about-us" },
  { label: "Who’s Who", href: "/website/whos-who" },
  { label: "Annual Reports", href: "/website/annual-reports" },
  { label: "Citizen’s Charter", href: "/website/citizen-charter" },
];

const DIVISIONS = [
  { label: "Scheduled Caste Welfare", href: "/website/about-the-division" },
  {
    label: "Welfare of the Other Backward Classes",
    href: "/website/about-the-division-welfare-of-the-other-backward-classes",
  },
  {
    label: "Social Defence",
    href: "/website/about-the-division-social-defence",
  },
  { label: "Drug Division", href: "/website/drug-division" },
  {
    label: "Grants-in-Aid to NGOs",
    href: "/website/grants-in-aid-to-ngos-faqs",
  },
  {
    label: "Statistics Division",
    href: "/website/about-the-division-statistics-division",
  },
  { label: "Plan Division", href: "/website/about-the-division-2" },
  { label: "Official Language", href: "/website/official-language-background" },
];

export function Leadership() {
  return (
    <Band as="section" tone="brand" spacing="xl" aria-labelledby="about-title">
      <div className="wn-home-about">
        <div className="wn-home-about__copy">
          <SectionTitle
            size="display"
            headingId="about-title"
            title={<T>About the Department</T>}
          />
          <p className="wn-home-about__lead">
            <T>{MANDATE}</T>
          </p>
          <ul className="wn-home-links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="wn-home-link">
                  <span className="wn-home-link__label">
                    <T>{l.label}</T>
                  </span>
                  <Icon name="chevron_right" size={20} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="wn-home-about__side">
          <ul className="wn-home-ministers" aria-label="Ministers">
            {MINISTERS.map((m) => (
              <li key={m.name} className="wn-home-minister">
                <span className="wn-home-minister__photo">
                  <Image
                    src={m.img}
                    alt={`${m.name}, ${m.role}`}
                    width={200}
                    height={200}
                  />
                </span>
                <span className="wn-home-minister__name">
                  <T>{m.name}</T>
                </span>
                <span className="wn-home-minister__role">
                  <T>{m.role}</T>
                </span>
              </li>
            ))}
          </ul>
          <nav className="wn-home-divisions" aria-labelledby="divisions-title">
            <h3 id="divisions-title" className="wn-home-divisions__title">
              <T>Divisions of the Department</T>
            </h3>
            <ul className="wn-home-links wn-home-links--two">
              {DIVISIONS.map((d) => (
                <li key={d.href}>
                  <Link href={d.href} className="wn-home-link">
                    <span className="wn-home-link__label">
                      <T>{d.label}</T>
                    </span>
                    <Icon name="chevron_right" size={20} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      {/* The live page's statistics strip sits under About; so does this one. */}
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
          )}
        >
          <T>View Dashboard</T>
          <Icon name="arrow_forward" size={20} aria-hidden />
        </Link>
      </div>
    </Band>
  );
}
