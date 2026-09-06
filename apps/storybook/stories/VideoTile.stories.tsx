import type { Meta, StoryObj } from "@storybook/react";
import { VideoTile } from "@mosje/design-system";

/**
 * One camera or one recording, with the states a feed is actually in — Garima
 * Greh's CCTV wall, a camp recording attached to a report.
 *
 * **Use it** for a monitored feed or a filed recording.
 *
 * **Do not use it** for a promotional video on a public page — that is a Figure
 * with a video in it, and it needs none of these states.
 *
 * The video element is the browser's, deliberately: its controls are
 * keyboard-operable and every reader already knows them. What this adds is the
 * four states and the words for each.
 *
 * `label` says what the tile shows and is required. `src` is the stream or file
 * and `poster` the still before playback; both are omitted for `connecting` and
 * `offline`, where there is nothing to play. `state` is one of `live`,
 * `recorded`, `connecting` or `offline` and defaults to `recorded`.
 * `offlineReason` is the sentence an officer can act on — "The camera has not
 * reported since 04:20 today" — because a dark tile is indistinguishable from a
 * page that failed to load. `caption` is a line under the tile.
 *
 * `captions` is a WebVTT file — `{ src, srcLang, label }` — rendered as a
 * `<track kind="captions">` and turned on by default. Supply it wherever one
 * exists: WCAG 1.2.2 requires captions on recorded speech, and a caption file is
 * the only form of them a viewer can switch on. A live CCTV feed has none, which
 * is why the text alternative below is a separate prop rather than an
 * alternative to this one.
 *
 * `alternativeHref` and `alternativeLabel` point at the transcript or the log.
 * WCAG 1.2.1 asks for a text alternative; making it a prop means its absence is
 * visible at the call site rather than found in an audit.
 *
 * It never autoplays and never plays with sound. A wall of nine tiles that all
 * start on their own is nine audio streams and a page that cannot be read.
 * "Live" is written as a word, not signalled by a red dot alone.
 */
const meta = {
  title: "Data Display/VideoTile",
  component: VideoTile,
  parameters: { layout: "centered" },
} satisfies Meta<typeof VideoTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: "Dormitory corridor",
    state: "live",
    caption: "Garima Greh, Bankura",
    alternativeHref: "#log",
  },
};

/** A filed recording, with its transcript one link away. */
export const Recorded: Story = {
  args: {
    label: "Awareness camp, Purulia",
    state: "recorded",
    caption: "Recorded 2 September 2026",
    alternativeHref: "#transcript",
    alternativeLabel: "Transcript",
  },
};

/** Waiting for the stream. The tile says what it is doing. */
export const Connecting: Story = {
  args: { label: "Kitchen", state: "connecting", caption: "Garima Greh, Bankura" },
};

/**
 * Offline, with the reason. This is the state that matters most: a black
 * rectangle tells an officer nothing they can act on.
 */
export const Offline: Story = {
  args: {
    label: "Main gate",
    state: "offline",
    offlineReason: "The camera has not reported since 04:20 today. The district office has been notified.",
    caption: "Garima Greh, Bankura",
  },
};
