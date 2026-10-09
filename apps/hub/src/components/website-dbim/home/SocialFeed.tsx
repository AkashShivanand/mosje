"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@mosje/design-system";

import { DbimIcon } from "@/components/website-dbim/ui/icons";
import { DBIM_SOCIAL_ACCOUNT, type DbimSocialFeed as Feed } from "@/lib/website-dbim/social";
import { SOCIAL_FEEDS } from "@/lib/website-shared/social";
import { loadEmbedScript } from "./embed-script";

const NEW_TAB = '<span class="sr-only"> (opens in a new tab)</span>';
const X_POST = SOCIAL_FEEDS.x.post;

/* The X post before widgets.js replaces it — a real link, so a blocked or offline
   script still leaves the reader the post. Handed to React as an HTML string so the
   script can replace it without React reconciling nodes it no longer owns. */
const X_HTML = `<blockquote class="twitter-tweet db-hb-feed__quote" data-dnt="true" data-conversation="none"><a href="${X_POST.href}" target="_blank" rel="noopener noreferrer">View this post on X${NEW_TAB}</a></blockquote>`;

/** The DBIM cookie bar's record (chrome/CookieConsent.tsx). Only "accepted" — every
    optional cookie — lets the networks' embeds load unasked, as the live site's social
    category does. */
const CONSENT = /(?:^|;\s*)dbim-cookie-consent=accepted(?:;|$)/;
const CONSENT_EVENT = "dbim-cookie-consent";

/** The live cards print dates as DD.MM.YYYY. */
const shown = (iso: string) => iso.split("-").reverse().join(".");

interface EmbedWindow {
  twttr?: { widgets?: { load: (el?: Element) => void } };
}

/**
 * One card body of "In Social Media", as dosje.gov.in draws it (read 8 Oct 2026).
 *
 * TWO STATES, BOTH RENDERED. Until the reader has accepted optional cookies, or asks for
 * this card's posts, the card is drawn from the live site's own records
 * (lib/website-shared/social.ts SOCIAL_FEEDS) and nothing is requested from the network:
 * a profile card for Facebook and Instagram, the latest post for X, the latest three
 * videos for YouTube. After, it loads the network's embed — Facebook's page plugin, the
 * one X post, the channel's player. Instagram has no embed on the live site and stays a
 * profile card. A loaded card is the embed alone, as on the live site: the network's own
 * frame carries its link to the account. Until 8 Oct 2026 the first state was grey
 * placeholder bars.
 *
 * An organisation's page passes its own account and `offerPosts={false}`: its card is the
 * profile card, because the posts and videos here are the Department's.
 */
export function DbimSocialFeed({
  feed,
  account = DBIM_SOCIAL_ACCOUNT,
  offerPosts = true,
}: {
  feed: Feed;
  /** Whose account the card names. An organisation's page passes the body's name. */
  account?: string;
  /** Whether the Department's posts and the embed are offered (the home page's band). */
  offerPosts?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const embeds = useRef<HTMLDivElement>(null);
  const [asked, setAsked] = useState(false);
  const [consented, setConsented] = useState(false);
  const [offline, setOffline] = useState(false);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  const isDept = account === DBIM_SOCIAL_ACCOUNT;
  const canEmbed = offerPosts && feed.network !== "instagram";
  const live = canEmbed && (asked || consented);

  useEffect(() => {
    const sync = () => setConsented(CONSENT.test(document.cookie));
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  // An offline reader keeps the drawn card; the button says why it cannot load.
  useEffect(() => {
    const sync = () => setOffline(navigator.onLine === false);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  // The button that asked goes with the drawn card; keep a keyboard reader in the region.
  useEffect(() => {
    if (asked) ref.current?.focus();
  }, [asked]);

  // Facebook's page plugin takes a pixel width and height: the card's own.
  useEffect(() => {
    if (!live || feed.network !== "facebook" || !ref.current) return;
    const el = ref.current;
    const measure = () => {
      const cs = getComputedStyle(el);
      const w = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const h = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      setSize({ w: Math.max(180, Math.min(500, Math.floor(w))), h: Math.max(200, Math.floor(h)) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [live, feed.network]);

  useEffect(() => {
    if (!live || feed.network !== "x" || !embeds.current) return;
    const root = embeds.current;
    const w = window as unknown as EmbedWindow;
    loadEmbedScript("https://platform.twitter.com/widgets.js", "db-embed-x")
      .then(() => w.twttr?.widgets?.load(root))
      .catch(() => undefined); // the blockquote link remains
  }, [live, feed.network]);

  const more = (
    <a className="db-hb-feed__more" href={feed.href} target="_blank" rel="noopener noreferrer">
      View on {feed.networkName}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
  const consentId = `db-social-${feed.network}-consent`;

  return (
    <div
      ref={ref}
      className="db-hb-social__body"
      role="region"
      aria-label={`Latest from ${isDept ? "the Department" : account} on ${feed.networkName}`}
      tabIndex={0}
    >
      {live ? (
        <div className="db-hb-feed db-hb-feed--live">
          {feed.network === "x" && <div ref={embeds} dangerouslySetInnerHTML={{ __html: X_HTML }} />}
          {feed.network === "youtube" && (
            <iframe
              className="db-hb-feed__yt"
              loading="lazy"
              title="Latest videos from the Department's YouTube channel"
              src={`https://www.youtube-nocookie.com/embed/videoseries?list=${SOCIAL_FEEDS.youtube.playlist}`}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {feed.network === "facebook" && size && (
            <iframe
              className="db-hb-feed__fb"
              title="The Department's Facebook page"
              src={`${SOCIAL_FEEDS.facebook.embed}&width=${size.w}&height=${size.h}`}
              width={size.w}
              height={size.h}
              allow="clipboard-write; encrypted-media; picture-in-picture"
            />
          )}
        </div>
      ) : (
        <div className="db-hb-feed">
          <div className="db-hb-feed__content">
            {offerPosts && feed.network === "x" ? (
              <XPost feed={feed} />
            ) : offerPosts && feed.network === "youtube" ? (
              <VideoList />
            ) : (
              <Profile feed={feed} account={isDept ? undefined : account} />
            )}
          </div>
          {canEmbed ? (
            <div className="db-hb-feed__cta">
              {feed.network !== "facebook" && more}
              <Button
                variant="primary"
                appearance="outlined"
                size="sm"
                className="db-hb-feed__load"
                disabled={offline}
                aria-describedby={consentId}
                onClick={() => setAsked(true)}
              >
                {offline ? "Posts Load When You Are Back Online" : "Show Latest Posts"}
              </Button>
              <p className="db-hb-feed__consent" id={consentId}>
                The posts load from {feed.networkName}, which then receives data about your visit.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

/** Facebook, Instagram, and every organisation card: the account and a follow link. */
function Profile({ feed, account }: { feed: Feed; account?: string }) {
  return (
    <div className="db-hb-follow">
      <span className="db-hb-follow__icon">
        <DbimIcon name={feed.network} size={24} />
      </span>
      {account && <p className="db-hb-follow__name">{account}</p>}
      {feed.handle && <p className="db-hb-follow__handle">{feed.handle}</p>}
      <p className="db-hb-follow__text">
        {feed.blurb ?? `See the latest from ${account ?? "the Department"} on ${feed.networkName}.`}
      </p>
      {/* linkAs-exempt(external-only): the network's own address, opened in a new tab */}
      <Button href={feed.href} external variant="primary" size="sm" className="db-hb-follow__button">
        {feed.cta ?? `Follow on ${feed.networkName}`}
      </Button>
    </div>
  );
}

/** X: the latest post, as the live card prints it. */
function XPost({ feed }: { feed: Feed }) {
  return (
    <article className="db-hb-post" aria-label="Latest post on X">
      <div className="db-hb-feed__who">
        <span className="db-hb-feed__avatar">
          <DbimIcon name="x" size={20} />
        </span>
        <span>
          <span className="db-hb-feed__name">{SOCIAL_FEEDS.x.name}</span>
          <span className="db-hb-feed__handle">{feed.handle}</span>
        </span>
      </div>
      <p className="db-hb-post__text">
        {X_POST.hashtags.map((tag) => (
          <a key={tag} href={`https://x.com/hashtag/${tag}`} target="_blank" rel="noopener noreferrer">
            #{tag}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
      </p>
      <p className="db-hb-post__meta">
        <time dateTime={X_POST.date}>{shown(X_POST.date)}</time>
        <a href={X_POST.href} target="_blank" rel="noopener noreferrer">
          View post on X<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </article>
  );
}

/** YouTube: the channel's latest three videos, as the live card lists them. */
function VideoList() {
  return (
    <ul className="db-hb-videos" aria-label="Latest videos">
      {SOCIAL_FEEDS.youtube.videos.map((v) => (
        <li key={v.href} className="db-hb-videos__item">
          <span className="db-hb-videos__play">
            <DbimIcon name="play-arrow" size={24} />
          </span>
          <span className="db-hb-videos__body">
            <a href={v.href} target="_blank" rel="noopener noreferrer" className="db-hb-videos__link">
              {v.title}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <time dateTime={v.date} className="db-hb-videos__date">
              {shown(v.date)}
            </time>
          </span>
        </li>
      ))}
    </ul>
  );
}
