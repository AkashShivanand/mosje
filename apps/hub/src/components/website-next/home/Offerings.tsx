import { T } from "@/components/i18n/translation-provider";
import Link from "next/link";
import { Band, Icon, SectionTitle } from "@mosje/design-system";
import { OFFERINGS, OFFERING_ICON, SCHEMES } from "@/lib/website-next/schemes";
import { SchemeCard } from "@/components/website-next/templates/SchemeCard";

/**
 * Schemes and Services — the live home page's "Our Offerings": featured schemes
 * with where to apply, then the ten kinds of support (11 Sep decision), each
 * opening the scheme finder filtered to it.
 *
 * The featured six are an editorial choice, one scheme each for the main
 * groups (SC, OBC, students abroad, skills, transgender persons), from the
 * Annual Report-sourced scheme master; the Ministry may re-pick. The card is the
 * catalogue's own, so a scheme looks the same wherever it appears.
 */
const FEATURED = [
  "pms-sc",
  "pm-ajay",
  "yasasvi-post",
  "nos",
  "pm-daksh",
  "smile-tg",
];

export function Offerings() {
  const featured = FEATURED.flatMap((id) => SCHEMES.filter((s) => s.id === id));
  return (
    <Band
      as="section"
      tone="default"
      spacing="xl"
      aria-labelledby="offerings-title"
    >
      <SectionTitle
        size="display"
        headingId="offerings-title"
        title={<T>Schemes and Services</T>}
        description={
          <T>Major schemes of the Department and where to apply for them.</T>
        }
      >
        <Link href="/website/schemes-services" className="wn-home-more">
          <T>View All Schemes</T>
          <Icon name="arrow_forward" size={20} aria-hidden />
        </Link>
      </SectionTitle>
      <ul className="wn-home-schemes">
        {featured.map((s) => (
          <li key={s.id}>
            <SchemeCard scheme={s} />
          </li>
        ))}
      </ul>

      <section className="wn-home-kinds" aria-labelledby="kinds-title">
        <h3 id="kinds-title" className="wn-home-kinds__title">
          <T>Browse by Kind of Support</T>
        </h3>
        <ul className="wn-home-links wn-home-links--two">
          {OFFERINGS.map((o) => (
            <li key={o.id}>
              <Link
                href={`/website/schemes-services?offer=${o.id}`}
                className="wn-home-link"
              >
                <span className="wn-home-link__icon" aria-hidden>
                  <Icon name={OFFERING_ICON[o.id]} size={20} />
                </span>
                <span className="wn-home-link__label">
                  <T>{o.label}</T>
                </span>
                <Icon name="chevron_right" size={20} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Band>
  );
}
