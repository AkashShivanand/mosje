import type { Metadata } from "next";
import { OG_CARD_IMAGE } from "./card";

/**
 * One social block for a single page.
 *
 * Next does NOT merge `openGraph` field-by-field down the layout tree: a page
 * that exports its own replaces the parent's entirely. So a detail page that
 * wants its own `og:title` must also restate `siteName`, `type` and `locale`,
 * or a link to it unfurls with the title of the page and the site name of
 * nothing. That restating is what this helper exists to stop people forgetting.
 *
 * `images` defaults to the estate card and should usually be left alone. It is
 * named rather than inherited on purpose — see `card.ts` for why inheritance
 * cannot be relied on here. Pass one only where the page has a genuinely
 * better-known image of its own, such as an organisation's own banner.
 */
export function socialCard({
  title,
  description,
  url,
  images = [OG_CARD_IMAGE],
  siteName = "Department of Social Justice & Empowerment",
}: {
  title: string;
  description?: string;
  /** Path relative to the site root, e.g. `/website/schemes-services/smile`. */
  url?: string;
  images?: NonNullable<NonNullable<Metadata["openGraph"]>["images"]>;
  siteName?: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName,
      title,
      description,
      url,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
