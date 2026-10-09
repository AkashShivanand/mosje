import { DbimSectionHeading } from "@/components/website-dbim/ui/SectionHeading";
import { DBIM_SOCIAL_FEEDS } from "@/lib/website-dbim/social";

import { DbimSocialCarousel } from "./SocialCarousel";
import { DbimSocialFeed } from "./SocialFeed";
import "./home-bottom.css";

/**
 * The social-media band — the reference's dark band of four feed cards, under the
 * live site's heading and with its accounts in its order (lib/website-shared/social.ts):
 * Facebook, X, YouTube, Instagram. Four columns at ≥1280, two at 768–1279, one card at
 * a time with chevrons and dots on a phone, as the reference does.
 *
 * Each card is drawn from the live site's own records — a profile, the latest post, the
 * latest videos — and loads the network's embed only after the reader accepts optional
 * cookies or asks for that card's posts (SocialFeed.tsx).
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
    // DBIM 3.0 Figure 61 titles this band "In Social Media"; the other designs keep
    // the shared title (lib/website-shared/home.ts). Decided 28 Sep 2026.
    <section className="db-hb-social" aria-labelledby="db-social-title">
      <div className="db-hb-social__head">
        <DbimSectionHeading id="db-social-title" icon="social-media" title="In Social Media" tone="inverse" />
      </div>
      <DbimSocialCarousel labels={DBIM_SOCIAL_FEEDS.map((f) => f.title)} slides={slides} />
    </section>
  );
}
