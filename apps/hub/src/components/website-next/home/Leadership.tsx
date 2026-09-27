import { T } from "@/components/i18n/translation-provider";
import Image from "next/image";
import Link from "next/link";
import { Band, Icon, SectionTitle } from "@mosje/design-system";
import { MANDATE, MINISTRY_LINE } from "./facts";
import { DBIM_PEOPLE } from "@/lib/website-dbim/assets";

/**
 * About Us — the Department's mandate in its own words, the Ministry's line
 * under it, the three Ministers, and the divisions.
 *
 * Laid out as the design draws it (Figma "Home — Secretary Review", "About Us")
 * and as dosje.gov.in publishes it: the paragraph, then the Ministry's own
 * sentence as a pull-quote, then Our Team / Our Ministry / Our Reports in a
 * row. The Union Minister leads the column beside it in a card of his own, with
 * the two Ministers of State sharing the row beneath — a hierarchy three equal
 * cards did not carry.
 *
 * ONE THING THE DESIGN DOES NOT DRAW, AND IT STAYS: the divisions. Figma keeps
 * the Important Links wall rail, which this build does not have (MOB-04 — it
 * covered content on a phone), and nine division pages are reachable from
 * nowhere else in the chrome. They sit under the two columns as a quiet list
 * rather than as a third column, and they go the day the masthead carries them.
 *
 * The divisions list replaces the classic "Important Links" wall tab, which
 * covered content on a phone (MOB-04): the same division pages, in the page.
 * Portrait names and designations are the alt text (ACC-04). The three are ONE
 * portrait set to one specification (BRD-07, DBIM §6.1.4): the Department's own
 * DBIM build carries it, fetched 25 Sep 2026 (lib/website-dbim/assets.ts) — the
 * set this card used before mixed a flag, a pink and a grey backdrop.
 * The cards are this page's own: the design system's Avatar stops at 48px, and
 * a Minister's headshot is not an avatar.
 */
const MINISTERS = [
  {
    img: DBIM_PEOPLE.ministers[0].src,
    name: "Dr. Virendra Kumar",
    role: "Union Minister of Social Justice and Empowerment",
  },
  {
    img: DBIM_PEOPLE.ministers[1].src,
    name: "Shri Ramdas Athawale",
    role: "Minister of State for Social Justice and Empowerment",
  },
  {
    img: DBIM_PEOPLE.ministers[2].src,
    name: "Shri B. L. Verma",
    role: "Minister of State for Social Justice and Empowerment",
  },
];

/* The three the Department itself offers here, in its own words and order.
   "Citizen's Charter" was a fourth; it is in the footer, and the design's row
   holds three. */
const LINKS = [
  { label: "Our Team", href: "/website/whos-who" },
  { label: "Our Ministry", href: "/website/about-us" },
  { label: "Our Reports", href: "/website/annual-reports" },
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
            title={<T>About Us</T>}
          />
          <p className="wn-home-about__lead">
            <T>{MANDATE}</T>
          </p>
          {/* The Ministry speaking about itself, as it prints it. A blockquote
              because it is quoted, not authored here. */}
          <blockquote className="wn-home-about__quote">
            <p>
              <T>{MINISTRY_LINE}</T>
            </p>
          </blockquote>
          <ul className="wn-home-about__links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="wn-home-about__link">
                  <span>
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
            {MINISTERS.map((m, i) => (
              <li
                key={m.name}
                /* The Union Minister leads: a card of his own across the row,
                   portrait beside the name rather than above it. */
                className={
                  i === 0
                    ? "wn-home-minister wn-home-minister--lead"
                    : "wn-home-minister"
                }
              >
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
        </div>
      </div>
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
    </Band>
  );
}
