/**
 * The Department's social-media feeds as the home page's "In Social Media" band shows them,
 * and the poster of the scholarship campaign video.
 *
 * SOURCE: master-socialjustice.digifootprint.gov.in home page, rendered DOM captured
 * 25 Sep 2026 (`.socialMediaContainer`, `.centralimg-layout-2-3 video[poster]`). The posts
 * are the Department's own, on its own accounts (the account links are `DBIM_BRAND.social`
 * in `./assets.ts`). No other design of the website embeds live feeds, so these live here
 * where every design can reach them.
 */

export type DbimSocialNetwork = "x" | "youtube" | "facebook" | "instagram";

export interface DbimSocialFeed {
  network: DbimSocialNetwork;
  /** The card title, verbatim from the reference. */
  title: string;
  /** The network's name in running text ("View on YouTube"). */
  networkName: string;
  /** The account, as it is written on the network. */
  handle: string;
  href: string;
}

const ACCOUNT = "Department of Social Justice and Empowerment";
export const DBIM_SOCIAL_ACCOUNT = ACCOUNT;

/** In the reference's order: X, Youtube, Facebook, Instagram. */
export const DBIM_SOCIAL_FEEDS: DbimSocialFeed[] = [
  { network: "x", title: "X", networkName: "X", handle: "@msjegoi", href: "https://x.com/msjegoi" },
  { network: "youtube", title: "Youtube", networkName: "YouTube", handle: "@ministryofsocialjustice511", href: "https://www.youtube.com/@ministryofsocialjustice511" },
  { network: "facebook", title: "Facebook", networkName: "Facebook", handle: "goimsje", href: "https://www.facebook.com/goimsje" },
  { network: "instagram", title: "Instagram", networkName: "Instagram", handle: "@msjegoi", href: "https://www.instagram.com/msjegoi/" },
];

/** Five posts on X, newest first, as the reference embeds them. */
export const DBIM_X_POSTS = [
  "1991371654619087292",
  "1991366814409060699",
  "1991330402670465472",
  "1991330214203552139",
  "1991330106317607150",
] as const;

/** The Department channel's uploads playlist; the reference embeds its first five. */
export const DBIM_YOUTUBE_UPLOADS = { playlist: "UUDvIvFEeSJlo8dOihp2SUig", count: 5 } as const;

/** Five Facebook items; `video` ones use the video plugin. */
export const DBIM_FACEBOOK_POSTS: { href: string; kind: "post" | "video" }[] = [
  { kind: "post", href: "https://www.facebook.com/goimsje/posts/pfbid0hE4yVnkhAv76LfxC8z5zRNs87i6kJ7xojA2wtM9mai7tpS25MnqCkWFGmd5JiGXAl" },
  { kind: "post", href: "https://www.facebook.com/goimsje/posts/pfbid02GDKZR6KHSJ2crAP9Xyppyb8EKWoEEqwBuQZtRrXUEGuahbPajSrqRtDeZGhv53Ncl" },
  { kind: "video", href: "https://www.facebook.com/reel/1640454500733313/" },
  { kind: "post", href: "https://www.facebook.com/goimsje/posts/pfbid0jF2tUr5KTCyPjCLq8Wqu8eecPGuda3osqBWR37qZdYJWpHZ7UkU7rdWMGHXwHMkUl" },
  { kind: "post", href: "https://www.facebook.com/goimsje/posts/pfbid031QvpY8qertrheVKrawGC1w6KbBuCgzTdesCfjEAbdhRYhEuUY7VYjBkBGQQY2qsal" },
];

/** One Instagram post. */
export const DBIM_INSTAGRAM_POSTS = ["https://www.instagram.com/p/DRRA_9rD6oz/"] as const;

/**
 * Poster frame of the scholarship video (`DBIM_CAMPAIGNS.scholarshipVideo`). Fetched on
 * 25 Sep 2026 from the reference's media host (ccps.digifootprint.gov.in, 2025/04/
 * 1788fb793d870f1ee49f02201be384e1.jpg) and served from our own public folder.
 */
export const DBIM_SCHOLARSHIP_POSTER = "/website/dbim/home/scholarship-video-poster.jpg";
