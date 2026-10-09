/**
 * SOCIAL MEDIA — the Department's accounts as the live home page presents them,
 * shared by all three designs of the website. Rule: home.ts.
 *
 * SOURCE: https://dosje.gov.in/, read on SOCIAL_AS_ON — the accounts, handles and lines
 * its cards print, and (SOCIAL_FEEDS, below) what the DBIM band's cards show. Until
 * 28 Sep 2026 the New and Classic designs printed nine posts of their own, with captions,
 * dates and like counts nobody published, under a Facebook address that is not the
 * Department's; nothing here is invented — every post, video and date is the live
 * site's.
 */

export const SOCIAL_AS_ON = "2026-10-08";

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

/**
 * In the order dosje.gov.in's "In Social Media" band shows them on SOCIAL_AS_ON —
 * Facebook, X, YouTube, Instagram. The New and Classic designs list the three marked
 * `onLiveHome`, in this order.
 */
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
    network: "youtube",
    name: "YouTube",
    handle: "@ministryofsocialjustice511",
    href: "https://www.youtube.com/@ministryofsocialjustice511",
    onLiveHome: false,
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
];

/** The accounts the live home page shows. */
export const LIVE_SOCIAL_ACCOUNTS = SOCIAL_ACCOUNTS.filter((a) => a.onLiveHome);

/**
 * WHAT EACH CARD OF THE DBIM "In Social Media" BAND SHOWS, as dosje.gov.in shows it on
 * SOCIAL_AS_ON (its `.db-hb-social` band, read 8 Oct 2026).
 *
 * Two states, both the live site's. Until the reader has accepted optional cookies, or
 * asks for one card's posts, each card is drawn here from these records — a profile card
 * (Facebook, Instagram), the latest post (X), the latest videos (YouTube) — and nothing is
 * requested from the network. After, the card loads the network's own embed: the
 * Facebook page plugin, the one X post, the channel's uploads player. Instagram stays a
 * profile card, as on the live site.
 */
export const SOCIAL_FEEDS = {
  facebook: {
    /** The live card's page plugin; width and height are the card's, filled in on load. */
    embed:
      "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fgoimsje&tabs=timeline&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false",
  },
  x: {
    /** The account's display name on X, as the live card prints it. */
    name: "Ministry of Social Justice & Empowerment, GOI",
    post: {
      id: "1967465293812490519",
      href: "https://x.com/MSJEGOI/status/1967465293812490519",
      hashtags: [
        "NAMASTEscheme", "WastePickerEmpowerment", "MoSJE", "MoHUA",
        "NSKFDC", "AndhraPradesh", "YerraguntlaMunicipality", "NavajeevanOrganizationRO",
      ],
      date: "2025-09-15",
    },
  },
  youtube: {
    /** The channel's uploads playlist — the live card's player. */
    playlist: "UUDvIvFEeSJlo8dOihp2SUig",
    videos: [
      { title: "Nasha Mukt Bharat Abhiyaan (NMBA)", href: "https://www.youtube.com/watch?v=kgMmCQCR1wk", date: "2026-10-07" },
      { title: "Samavesh Utsav - A celebration of inclusion, Empowerment of DNT Communities", href: "https://www.youtube.com/watch?v=e541Hn3RWNY", date: "2026-09-02" },
      { title: "📞 Call 14446 — Talk. Seek help. Begin the journey towards a healthier, drug-free life.", href: "https://www.youtube.com/watch?v=0_jCQ_pw4Wk", date: "2026-08-27" },
    ],
  },
} as const;
