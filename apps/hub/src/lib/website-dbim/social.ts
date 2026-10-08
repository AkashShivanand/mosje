/**
 * The Department's accounts as the DBIM home page's "In Social Media" band lists them.
 *
 * SOURCE: lib/website-shared/social.ts — the accounts, and SOCIAL_FEEDS, what each card
 * shows, both read from dosje.gov.in on 8 Oct 2026. Until then this file kept the
 * reference build's own posts (five on X, five on Facebook, five videos and an Instagram
 * post, captured 25 Sep 2026); the live band shows one post, three videos and two
 * profile cards, and every design now reads those.
 */

import { SOCIAL_ACCOUNTS, type SocialNetwork } from "@/lib/website-shared/social";

export type DbimSocialNetwork = SocialNetwork;

export interface DbimSocialFeed {
  network: DbimSocialNetwork;
  /** The card title — the live site's name for the platform. */
  title: string;
  /** The network's name in running text ("View on YouTube"). */
  networkName: string;
  /** The account, as it is written on the network. */
  handle: string;
  href: string;
  /** The profile card's line and button, where the live card prints them. */
  blurb?: string;
  cta?: string;
}

const ACCOUNT = "Department of Social Justice and Empowerment";
export const DBIM_SOCIAL_ACCOUNT = ACCOUNT;

/**
 * The four accounts, from the content every design shares (lib/website-shared/social.ts):
 * the four the live band shows, in its order (Facebook, X, YouTube, Instagram). Names,
 * handles, lines and links are the live site's — until 28 Sep 2026 this list kept its
 * own, in the reference build's order. What each card shows is SOCIAL_FEEDS there.
 */
export const DBIM_SOCIAL_FEEDS: DbimSocialFeed[] = SOCIAL_ACCOUNTS.map((a) => ({
  network: a.network,
  title: a.name,
  networkName: a.network === "x" ? "X" : a.name,
  handle: a.handle,
  href: a.href,
  blurb: a.blurb,
  cta: a.cta,
}));
