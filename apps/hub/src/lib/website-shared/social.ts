/**
 * SOCIAL MEDIA — the Department's accounts as the live home page presents them,
 * shared by all three designs of the website. Rule: home.ts.
 *
 * SOURCE: the "Explore our Social Media Platforms" section of
 * https://dosje.gov.in/, read on SOCIAL_AS_ON — three account cards, each a
 * handle, one line and a Follow link. The live section shows no posts, so
 * none are shown here: until 28 Sep 2026 the New and Classic designs printed
 * nine posts of their own, with captions, dates and like counts nobody
 * published, under a Facebook address that is not the Department's.
 */

export const SOCIAL_AS_ON = "2026-09-28";

export const SOCIAL_SECTION = { title: "Explore our Social Media Platforms" } as const;

export type SocialNetwork = "facebook" | "x" | "instagram" | "youtube";

export interface SocialAccount {
  network: SocialNetwork;
  /** The platform's name as the live card heads it. */
  name: string;
  /** The account, as the live card prints it. */
  handle: string;
  href: string;
  /** The live card's line — absent where the live site carries no card. */
  blurb?: string;
  /** The live button, without its arrow. */
  cta?: string;
  /**
   * On the live home page. YouTube is not; it is here because DBIM 3.0 asks a
   * home page for at least four social platforms (Toolkit, "Citizen
   * Engagement"), and the Department's channel is the fourth it runs — the one
   * its footer and structured data already name.
   */
  onLiveHome: boolean;
}

/** In the live order; YouTube, which the live section does not carry, last. */
export const SOCIAL_ACCOUNTS: readonly SocialAccount[] = [
  {
    network: "facebook",
    name: "Facebook",
    handle: "@goimsje",
    href: "https://www.facebook.com/goimsje",
    blurb: "Follow us on Facebook to see our latest posts and updates.",
    cta: "Follow on Facebook",
    onLiveHome: true,
  },
  {
    network: "x",
    name: "X (Twitter)",
    handle: "@MSJEGOI",
    href: "https://twitter.com/MSJEGOI",
    blurb: "Follow us on X to see our latest posts and updates.",
    cta: "Follow on X",
    onLiveHome: true,
  },
  {
    network: "instagram",
    name: "Instagram",
    handle: "@msjegoi",
    href: "https://www.instagram.com/msjegoi",
    blurb: "Follow us on Instagram to see our latest posts and reels.",
    cta: "Follow on Instagram",
    onLiveHome: true,
  },
  {
    network: "youtube",
    name: "YouTube",
    handle: "@ministryofsocialjustice511",
    href: "https://www.youtube.com/@ministryofsocialjustice511",
    onLiveHome: false,
  },
];

/** The accounts the live home page shows. */
export const LIVE_SOCIAL_ACCOUNTS = SOCIAL_ACCOUNTS.filter((a) => a.onLiveHome);
