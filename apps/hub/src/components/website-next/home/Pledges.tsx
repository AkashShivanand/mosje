import Link from "next/link";
import { Band, Icon, SectionTitle, buttonClasses } from "@mosje/design-system";

import { T } from "@/components/i18n/translation-provider";

/**
 * Take a Pledge — the Department's national pledges, gathered in one place.
 *
 * Figma "Home — Secretary Review", the "Take a Pledge" section. The live home
 * page carries the Nasha Mukt Bharat pledge alone, inside the campaign block;
 * the Senior Citizens pledge and the two volunteering registers are reachable
 * only from their portals, which is why they are here.
 *
 * TWO THINGS FIGMA DRAWS AND THIS DOES NOT, both for stated reasons:
 *
 *  - **The pledge counts** ("31,80,579 Indians have already pledged", and a
 *    count on each card). No feed on this site publishes them and no snapshot
 *    of them is committed, so they would be typed figures on a government page
 *    — the same call the campaign band already records (live-data-fallback.md:
 *    a figure with no source does not go on the page at all).
 *  - **"I'm a non-user" and "I'm a recovered user" as separate pledges.** The
 *    NMBA pledge form asks for neither; both would land on the same form, so
 *    two doors would be a promise the page cannot keep. One pledge, one link.
 *
 * The wording of each pledge is the portal's own — the Senior Citizens line is
 * the first of the five pledge points the SCW portal publishes.
 */
const PLEDGES = [
  {
    key: "nmba",
    eyebrow: "Nasha Mukt Bharat Abhiyaan",
    title: "Pledge for a drug-free India",
    body: "Stay drug-free, and help spread awareness where you live, study and work.",
    href: "/portals/nmba/epledge",
    action: "Take the Pledge",
  },
  {
    key: "scw",
    eyebrow: "Senior Citizens",
    title: "Pledge for Senior Citizens",
    body: "I pledge to respect, love and care for the senior citizens in my family and community throughout my life.",
    href: "/portals/scw/epledge",
    action: "Take the Pledge",
  },
] as const;

const VOLUNTEERING = [
  {
    key: "mitr",
    title: "Become a Nasha Mukti Mitr",
    body: "Volunteer in your community for a drug-free India. No prior experience is needed.",
    href: "/portals/nmba/register-mitr",
    action: "Register as a volunteer",
  },
  {
    key: "scw-volunteer",
    title: "Volunteer for Senior Citizens",
    body: "Give time to the elderly in your area through the Department\u2019s senior citizen services.",
    href: "/portals/scw/volunteer",
    action: "Register as a volunteer",
  },
] as const;

export function Pledges() {
  return (
    <Band as="section" tone="default" spacing="xl" aria-labelledby="pledges-title">
      <SectionTitle
        size="display"
        headingId="pledges-title"
        title={<T>Take a Pledge</T>}
        description={
          <T>
            Join the pledges taken under the Department&rsquo;s national campaigns, or give
            your time as a volunteer.
          </T>
        }
      />

      <ul className="wn-home-pledges">
        {PLEDGES.map((p) => (
          <li key={p.key} className="wn-home-pledge">
            <p className="wn-home-pledge__eyebrow">
              <T>{p.eyebrow}</T>
            </p>
            <h3 className="wn-home-pledge__title">
              <T>{p.title}</T>
            </h3>
            <p className="wn-home-pledge__body">
              <T>{p.body}</T>
            </p>
            <Link href={p.href} className={buttonClasses("primary", "filled", "md")}>
              <T>{p.action}</T>
            </Link>
          </li>
        ))}
      </ul>

      <ul className="wn-home-pledges wn-home-pledges--volunteer">
        {VOLUNTEERING.map((v) => (
          <li key={v.key} className="wn-home-pledge wn-home-pledge--volunteer">
            <span className="wn-home-pledge__mark" aria-hidden="true">
              <Icon name="volunteer_activism" size={24} />
            </span>
            <div>
              <h3 className="wn-home-pledge__title">
                <T>{v.title}</T>
              </h3>
              <p className="wn-home-pledge__body">
                <T>{v.body}</T>
              </p>
            </div>
            <Link href={v.href} className={buttonClasses("primary", "outlined", "md")}>
              <T>{v.action}</T>
            </Link>
          </li>
        ))}
      </ul>
    </Band>
  );
}
