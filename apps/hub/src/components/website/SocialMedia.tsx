import Link from "next/link";
import { BrandGlyph, Button, Card, Icon } from "@mosje/design-system";
import { LIVE_SOCIAL_ACCOUNTS, SOCIAL_SECTION, type SocialNetwork } from "@/lib/website-shared/social";

/**
 * Explore our Social Media Platforms — the live home page's three account
 * cards, from the content every design shares (lib/website-shared/social.ts).
 *
 * THERE ARE NO POSTS HERE, because the live section shows none. This file used
 * to carry nine: captions, dates and like counts that no account published,
 * illustrated with reused banner photographs, under tabs that included a
 * YouTube feed the live section does not have. A government page that shows a
 * post shows the Department's post, or nothing.
 */

/**
 * The marks in their owners' colours, as the live cards draw them. BrandGlyph is
 * monochrome and its documentation puts a brand's colour at the call site:
 * these are the brands' colours, not the estate's, so there is no token for them.
 * X's mark is black, which is the page's ink.
 */
const MARK_COLOUR: Partial<Record<SocialNetwork, string>> = {
  facebook: "#1877F2",
  instagram: "#E4405F",
};

export function SocialMedia() {
  return (
    <section className="bg-surface-muted py-12 md:py-16" aria-labelledby="social-title">
      <div className="sa-container">
        <h2 id="social-title" className="text-headline-2 text-primary-dark">
          {SOCIAL_SECTION.title}
        </h2>

        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {LIVE_SOCIAL_ACCOUNTS.map((a) => (
            <li key={a.network}>
              <Card className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-0 shadow-xs">
                <div className="flex items-center gap-2 border-b border-gray-150 bg-surface-muted px-5 py-3">
                  <BrandGlyph
                    name={a.network}
                    size={18}
                    aria-hidden
                    style={{ color: MARK_COLOUR[a.network] }}
                    className="text-ink"
                  />
                  <h3 className="text-label-1 text-ink">{a.name}</h3>
                </div>
                <div className="flex flex-1 flex-col items-center px-6 py-8 text-center">
                  <BrandGlyph
                    name={a.network}
                    size={48}
                    aria-hidden
                    style={{ color: MARK_COLOUR[a.network] }}
                    className="text-ink"
                  />
                  <p className="mt-4 text-title-2 text-ink">{a.handle}</p>
                  {a.blurb && <p className="mt-2 max-w-xs text-body-2 text-ink-muted">{a.blurb}</p>}
                  <Button
                    href={a.href}
                    external
                    linkAs={Link}
                    variant="primary"
                    appearance="filled"
                    size="md"
                    iconRight={<Icon name="arrow_forward" size={16} aria-hidden />}
                    className="mt-6"
                  >
                    {a.cta ?? `Follow on ${a.name}`}
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
