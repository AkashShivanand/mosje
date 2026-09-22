import { BrandGlyph, Icon, SectionTitle } from "@mosje/design-system";
import { SOCIAL } from "./facts";

/**
 * Social media (DBIM home-page component). The classic home page drew posts
 * with like and share counts that no feed on this site supplies; here each
 * official account is a card that opens it. When a live feed is connected,
 * its posts belong in these cards; until then nothing is shown that the
 * Department did not publish.
 */
export function Social() {
  return (
    <section className="wn-home-band wn-home-band--muted" aria-labelledby="social-title">
      <div className="sa-container">
        <SectionTitle
          size="display"
          headingId="social-title"
          title="Follow the Department"
          description="Official accounts of the Department of Social Justice & Empowerment."
        />
        <ul className="wn-home-social">
          {SOCIAL.map((s) => (
            <li key={s.name}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className={`wn-home-social__item wn-home-social__item--${s.glyph}`}>
                <span className="wn-home-social__glyph" aria-hidden>
                  <BrandGlyph name={s.glyph} size={28} />
                </span>
                <span className="wn-home-social__text">
                  <span className="wn-home-social__name">{s.name}</span>
                  <span className="wn-home-social__handle">{s.handle}</span>
                </span>
                <span className="sr-only"> (opens in a new window)</span>
                <span className="wn-home-social__go" aria-hidden>
                  <Icon name="open_in_new" size={20} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
