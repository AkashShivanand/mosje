import { DbimSectionHeading } from "@/components/website-dbim/ui/SectionHeading";
import { DBIM_SOCIAL_FEEDS } from "@/lib/website-dbim/social";

import { DbimSocialCarousel } from "./SocialCarousel";
import { DbimSocialFeed } from "./SocialFeed";
import "./home-bottom.css";

/**
 * "In Social Media" — the dark band of four feed cards (X, Youtube, Facebook,
 * Instagram). Four columns at ≥1280, two at 768–1279, one card at a time with
 * chevrons and dots on a phone, as the reference does.
 *
 * The feeds are the networks' own embeds and load only when the band nears the
 * viewport; until then, and whenever they cannot load, each card names the account
 * and links to it. See docs/research/dbim-reference/components/home-bottom.spec.md.
 */
export function DbimSocialMedia() {
  const slides = DBIM_SOCIAL_FEEDS.map((feed) => (
    <article key={feed.network} className="db-hb-social__card" aria-labelledby={`db-social-${feed.network}`}>
      <h3 id={`db-social-${feed.network}`} className="db-hb-social__title">
        {feed.title}
      </h3>
      <DbimSocialFeed feed={feed} />
    </article>
  ));

  return (
    <section className="db-hb-social" aria-labelledby="db-social-title">
      <div className="db-hb-social__head">
        <DbimSectionHeading id="db-social-title" icon="social" title="In Social Media" tone="inverse" />
      </div>
      <DbimSocialCarousel labels={DBIM_SOCIAL_FEEDS.map((f) => f.title)} slides={slides} />
    </section>
  );
}
