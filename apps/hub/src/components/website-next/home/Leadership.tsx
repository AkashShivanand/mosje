import Image from "next/image";
import Link from "next/link";
import { Icon, SectionTitle } from "@mosje/design-system";
import { MANDATE } from "./facts";

/**
 * About the Department: its mandate in its own words, its Ministers, and its
 * divisions. The live page's one-line statement beneath the mandate is left
 * out: it says the mandate again ("most vulnerable" twice; ui-restraint §1).
 *
 * The divisions list replaces the classic "Important Links" wall tab, which
 * covered content on a phone (MOB-04): the same division pages, in the page.
 * Portrait names and designations are the alt text (ACC-04). One portrait set
 * to one specification is still owed by the Department (BRD-07).
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
    <section
      className="wn-home-band wn-home-band--tint"
      aria-labelledby="about-title"
    >
      <div className="sa-container">
        <div className="wn-home-about">
          <div className="wn-home-about__copy">
            <SectionTitle
              size="display"
              headingId="about-title"
              title="About the Department"
            />
            <p className="wn-home-about__lead">{MANDATE}</p>
            <ul className="wn-home-about__links">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>
                    <span>{l.label}</span>
                    <Icon name="arrow_forward" size={20} aria-hidden />
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
                  <span className="wn-home-minister__name">{m.name}</span>
                  <span className="wn-home-minister__role">{m.role}</span>
                </li>
              ))}
            </ul>
            <nav
              className="wn-home-divisions"
              aria-labelledby="divisions-title"
            >
              <h3 id="divisions-title" className="wn-home-divisions__title">
                Divisions of the Department
              </h3>
              <ul>
                {DIVISIONS.map((d) => (
                  <li key={d.href}>
                    <Link href={d.href}>{d.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
