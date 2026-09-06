"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import "./video-tile.css";

export type VideoTileState = "live" | "recorded" | "connecting" | "offline";

export interface VideoTileProps {
  /** What this camera or recording shows — "Dormitory corridor", "Camp at Bankura". Required. */
  label: string;
  /** The stream or file. Omitted for `connecting` and `offline`, where there is nothing to play. */
  src?: string;
  /** Still shown before playback starts. */
  poster?: string;
  /** @default "recorded" */
  state?: VideoTileState;
  /**
   * Why the tile is offline, in the department's words — "The camera has not
   * reported since 04:20 today." A black rectangle is not an answer.
   */
  offlineReason?: string;
  /** A line under the tile — a location, a time, a warden's name. */
  caption?: string;
  /**
   * A captions file for a recording — WebVTT. Supply it wherever one exists;
   * WCAG 1.2.2 requires captions on recorded speech, and a caption file is the
   * only form of them a viewer can turn on.
   */
  captions?: { src: string; srcLang: string; label: string };
  /**
   * Address of a text alternative — a transcript, or the log the recording
   * belongs to. Required by WCAG 1.2.1 for recorded material, and the component
   * makes it a prop rather than an afterthought.
   */
  alternativeHref?: string;
  /** @default "Transcript and log" */
  alternativeLabel?: string;
  className?: string;
}

const STATE_WORD: Record<VideoTileState, string> = {
  live: "Live",
  recorded: "Recording",
  connecting: "Connecting",
  offline: "Offline",
};

/**
 * One camera or one recording, with the states a feed is actually in — Garima
 * Greh's CCTV wall, a camp recording attached to a report.
 *
 * The video element itself is the browser's, deliberately: its controls are
 * keyboard-operable, its captions track works, and every reader already knows
 * them. What this component adds is the four states a feed is in and the words
 * for each.
 *
 * Four rules:
 *
 * 1. **Never autoplay, and never with sound.** A wall of nine tiles that all
 *    start playing is nine audio streams and a page that cannot be read. The
 *    reader presses play.
 * 2. **Offline is a WORD and a reason, not a black rectangle.** "The camera has
 *    not reported since 04:20 today" is an answer an officer can act on; a dark
 *    tile is indistinguishable from a page that failed to load.
 * 3. **"Live" is written, not only coloured.** A red dot means nothing to a
 *    screen reader and nothing to a reader who cannot distinguish it.
 * 4. **A recording carries a way to its text alternative.** WCAG 1.2.1 asks for
 *    one; making it a prop means the absence is visible at the call site rather
 *    than discovered in an audit.
 */
export function VideoTile({
  label,
  src,
  poster,
  captions,
  state = "recorded",
  offlineReason,
  caption,
  alternativeHref,
  alternativeLabel = "Transcript and log",
  className,
}: VideoTileProps): React.JSX.Element {
  const playable = state === "live" || state === "recorded";

  return (
    <figure className={cn("ds-video", `ds-video--${state}`, className)}>
      <div className="ds-video__frame">
        {playable ? (
          // No autoPlay, and controls always. A wall of tiles that start on
          // their own is a page that cannot be read.
          //
          // A <track> is rendered whenever `captions` is supplied. A live CCTV
          // feed has no caption file to point at, so the component instead
          // carries `alternativeHref` — the transcript or the log — as a prop,
          // which is what makes its absence visible at the call site.
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video className="ds-video__media" src={src} poster={poster} controls preload="none" playsInline>
            {captions ? (
              <track kind="captions" src={captions.src} srcLang={captions.srcLang} label={captions.label} default />
            ) : null}
          </video>
        ) : (
          <div className="ds-video__placeholder" role="status">
            <Icon name={state === "connecting" ? "sync" : "videocam_off"} size={32} />
            <p className="ds-video__placeholderText">
              {state === "connecting"
                ? `Connecting to ${label}…`
                : (offlineReason ?? `${label} is not reporting.`)}
            </p>
          </div>
        )}
        <p className={cn("ds-video__badge", `is-${state}`)}>
          {state === "live" ? <span className="ds-video__dot" aria-hidden="true" /> : null}
          {STATE_WORD[state]}
        </p>
      </div>
      <figcaption className="ds-video__caption">
        <span className="ds-video__label">{label}</span>
        {caption ? <span className="ds-video__detail">{caption}</span> : null}
        {alternativeHref ? (
          <a className="ds-video__alt" href={alternativeHref}>
            {alternativeLabel}
          </a>
        ) : null}
      </figcaption>
    </figure>
  );
}
