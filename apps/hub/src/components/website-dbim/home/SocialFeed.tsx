"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@mosje/design-system";

import {
  DBIM_FACEBOOK_POSTS,
  DBIM_INSTAGRAM_POSTS,
  DBIM_SOCIAL_ACCOUNT,
  DBIM_X_POSTS,
  DBIM_YOUTUBE_UPLOADS,
  type DbimSocialFeed as Feed,
} from "@/lib/website-dbim/social";
import { loadEmbedScript } from "./embed-script";

const NEW_TAB = '<span class="sr-only"> (opens in a new tab)</span>';

/* Pre-render markup for the two script-driven networks. It is a real link, so if
   widgets.js / embed.js is blocked or offline the reader still has the post. Handed to
   React as an HTML string so the third-party script can replace it without React
   reconciling nodes it no longer owns. */
const X_HTML = DBIM_X_POSTS.map(
  (id) =>
    `<blockquote class="twitter-tweet db-hb-feed__quote" data-dnt="true" data-conversation="none"><a href="https://twitter.com/msjegoi/status/${id}" target="_blank" rel="noopener noreferrer">View this post on X${NEW_TAB}</a></blockquote>`,
).join("");
const IG_HTML = DBIM_INSTAGRAM_POSTS.map(
  (url) =>
    `<blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14"><a href="${url}" target="_blank" rel="noopener noreferrer">View this post on Instagram${NEW_TAB}</a></blockquote>`,
).join("");

interface EmbedWindow {
  twttr?: { widgets?: { load: (el?: Element) => void } };
  instgrm?: { Embeds?: { process: () => void } };
}

/**
 * One card body of "In Social Media": a named, focusable 310px region holding the
 * network's own embeds.
 *
 * NOTHING IS REQUESTED FROM THE NETWORK UNTIL THE READER ASKS. The card first names the
 * account and links to it; "Show Latest Posts" loads that one network's embeds. It used
 * to go live on approach (within 400px of the viewport), which put X's, Facebook's and
 * Instagram's scripts — and their own console errors, trackers and ~100 background
 * requests a minute — on every visit to the home page, for a band most readers scroll
 * past. Gated on intent, as data-state-completeness.md §5.1 asks of anything heavy.
 */
export function DbimSocialFeed({ feed }: { feed: Feed }) {
  const ref = useRef<HTMLDivElement>(null);
  const embeds = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [offline, setOffline] = useState(false);

  // An offline reader keeps the account card; the button says why it cannot load.
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

  // The button that asked disappears with the account card; keep a keyboard reader in
  // the region it loaded rather than dropping focus to the page.
  useEffect(() => {
    if (live) ref.current?.focus();
  }, [live]);

  useEffect(() => {
    if (!live || !embeds.current) return;
    const root = embeds.current;
    const w = window as unknown as EmbedWindow;
    if (feed.network === "x") {
      loadEmbedScript("https://platform.twitter.com/widgets.js", "db-embed-x")
        .then(() => w.twttr?.widgets?.load(root))
        .catch(() => undefined); // the blockquote links remain
    } else if (feed.network === "instagram") {
      loadEmbedScript("https://www.instagram.com/embed.js", "db-embed-ig")
        .then(() => w.instgrm?.Embeds?.process())
        .catch(() => undefined);
    }
  }, [live, feed.network]);

  const more = (
    <a className="db-hb-feed__more" href={feed.href} target="_blank" rel="noopener noreferrer">
      View on {feed.networkName}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );

  return (
    <div
      ref={ref}
      className="db-hb-social__body"
      role="region"
      aria-label={`Latest from the Department on ${feed.networkName}`}
      tabIndex={0}
    >
      {live ? (
        <>
          {feed.network === "x" && <div ref={embeds} dangerouslySetInnerHTML={{ __html: X_HTML }} />}
          {feed.network === "instagram" && <div ref={embeds} className="db-hb-feed__ig" dangerouslySetInnerHTML={{ __html: IG_HTML }} />}
          {feed.network === "youtube" && (
            <div ref={embeds}>
              {Array.from({ length: DBIM_YOUTUBE_UPLOADS.count }, (_, i) => (
                <iframe
                  key={i}
                  className="db-hb-feed__yt"
                  loading="lazy"
                  title={`Video ${i + 1} from the Department's YouTube channel`}
                  src={`https://www.youtube-nocookie.com/embed/videoseries?list=${DBIM_YOUTUBE_UPLOADS.playlist}&index=${i + 1}`}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ))}
            </div>
          )}
          {feed.network === "facebook" && (
            <div ref={embeds}>
              {DBIM_FACEBOOK_POSTS.map((p, i) => (
                <iframe
                  key={p.href}
                  className="db-hb-feed__fb"
                  loading="lazy"
                  title={`Facebook ${p.kind === "video" ? "video" : "post"} ${i + 1} from the Department`}
                  src={`https://www.facebook.com/plugins/${p.kind}.php?href=${encodeURIComponent(p.href)}&show_text=true&width=500`}
                  allow="clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ))}
            </div>
          )}
          <p className="db-hb-feed__end">{more}</p>
        </>
      ) : (
        <div className="db-hb-feed__account">
          <p className="db-hb-feed__name">{DBIM_SOCIAL_ACCOUNT}</p>
          <p className="db-hb-feed__handle">{feed.handle}</p>
          {more}
          <Button
            variant="primary"
            appearance="outlined"
            size="sm"
            className="db-hb-feed__load"
            disabled={offline}
            onClick={() => setLive(true)}
          >
            {offline ? "Posts Load When You Are Back Online" : "Show Latest Posts"}
          </Button>
        </div>
      )}
    </div>
  );
}
