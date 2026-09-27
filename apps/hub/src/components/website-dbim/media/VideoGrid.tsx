"use client";

import * as React from "react";
import Image from "next/image";
import { Button, Icon } from "@mosje/design-system";
import type { DbimVideo } from "@/lib/website-dbim/media";
import { DbimFilterBar } from "@/components/website-dbim/ui/FilterBar";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import { useListing } from "@/components/website-dbim/ui/useListing";
import { DbimNoMatch, DbimPager, describeFilters } from "@/components/website-dbim/connect/ListStates";

export type DbimVideoCard = DbimVideo & { when?: string };

const SORTS = {
  latest: { label: "Latest", compare: (a: DbimVideoCard, b: DbimVideoCard) => (b.date ?? "").localeCompare(a.date ?? "") },
  oldest: { label: "Oldest", compare: (a: DbimVideoCard, b: DbimVideoCard) => (a.date ?? "").localeCompare(b.date ?? "") },
};
const searchText = (v: DbimVideoCard) => `${v.title} ${v.category ?? ""}`;
const categoryOf = (v: DbimVideoCard) => v.category;

/** Media › Videos: Sort by · Category over every video, twelve to a page. Nothing plays until asked. */
export function DbimVideoGrid({ videos }: { videos: DbimVideoCard[] }) {
  const listing = useListing(videos, { searchText, category: categoryOf, sorts: SORTS, perPage: 12 });
  const top = React.useRef<HTMLDivElement>(null);

  return (
    <div className="db-media" ref={top}>
      <DbimFilterBar
        search={{ value: listing.query, onChange: listing.setQuery, placeholder: "Search...", label: "Search videos" }}
        sort={{ value: listing.sort, onChange: listing.setSort, options: listing.sortOptions, placeholder: "Sort by", label: "Sort by" }}
        category={{ value: listing.category, onChange: listing.setCategory, options: listing.categories, placeholder: "Category", label: "Category" }}
      />
      <p className="sr-only" role="status">
        {listing.total} {listing.total === 1 ? "video" : "videos"}
      </p>
      {videos.length === 0 ? (
        <DbimEmptyState />
      ) : listing.total === 0 ? (
        <DbimNoMatch
          noun="videos"
          what={describeFilters([
            listing.query.trim() && `the search “${listing.query.trim()}”`,
            listing.category && `the category “${listing.category}”`,
          ])}
          onClear={listing.clear}
        />
      ) : (
        <ul className="db-media-grid">
          {listing.visible.map((v) => (
            <VideoCard key={v.key} video={v} />
          ))}
        </ul>
      )}
      <DbimPager page={listing.page} pageCount={listing.pageCount} onChange={listing.setPage} target={top} />
    </div>
  );
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function VideoCard({ video }: { video: DbimVideoCard }) {
  const [duration, setDuration] = React.useState<string>();
  const [playing, setPlaying] = React.useState(false);
  const titleId = React.useId();
  const frame = React.useRef<HTMLIFrameElement>(null);
  // The play button is replaced by the player, so focus follows it rather than falling to the page.
  React.useEffect(() => {
    if (playing) frame.current?.focus();
  }, [playing]);

  return (
    <li className="db-media-card">
      <div className="db-media-frame db-video-frame">
        {video.file ? (
          // The Department publishes no caption track for these files; a <track> pointing
          // at nothing would tell assistive technology captions exist and serve silence.
          <video
            className="db-media-img"
            controls
            preload="metadata"
            poster={video.file.poster}
            src={video.file.src}
            aria-labelledby={titleId}
            onLoadedMetadata={(e) => {
              const d = e.currentTarget.duration;
              if (Number.isFinite(d) && d > 0) setDuration(clock(d));
            }}
          />
        ) : video.youtube && playing ? (
          <iframe
            ref={frame}
            className="db-media-img"
            src={`https://www.youtube-nocookie.com/embed/${video.youtube.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : video.youtube ? (
          <Button appearance="text" className="db-video-play" onClick={() => setPlaying(true)} aria-label={`Play video: ${video.title}`}>
            {/* Unoptimised: the still is YouTube's, and its host is not one the image optimiser serves. */}
            <Image src={video.youtube.still} alt="" fill unoptimized className="db-media-img" />
            <span className="db-video-play-icon" aria-hidden="true">
              <Icon name="play_arrow" size={40} fill aria-hidden />
            </span>
          </Button>
        ) : null}
      </div>
      <p className="db-media-title" id={titleId}>
        {video.title}
      </p>
      <p className="db-media-foot">
        <span>{video.when}</span>
        {duration && <span>{duration}</span>}
      </p>
    </li>
  );
}
