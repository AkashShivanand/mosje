import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { VideoPlayground } from "./video-playground";

export const metadata: Metadata = {
  title: "Video Tile — Design System",
  description:
    "One camera or one recording, with the four states a feed is actually in — and the words for each, because a dark rectangle is not an answer.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.4.2 Audio Control",
    level: "A",
    status: "verified",
    evidence:
      "Read from the rendered DOM: the <video> element carries controls and preload=none and has no autoplay attribute, so nothing begins playing or making sound without the reader pressing play. A wall of tiles is silent until asked.",
    description: "No tile plays audio on its own.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    status: "verified",
    evidence:
      'Read from the DOM: each badge contains the state as text — "Live", "Recording", "Connecting", "Offline" — and the red dot on the live badge is aria-hidden decoration on top of the word.',
    description: "The state is a word, not a colour.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    evidence:
      'The connecting and offline placeholders are role="status", so a reader whose feed drops is told rather than left with a tile that quietly changes.',
    description: "A feed changing state is announced.",
  },
];

export default function VideoTilePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Video Tile"
      status="Stable"
      summary="One camera or one recording, with the four states a feed is actually in. The video element is the browser's; what this adds is the states and the words for each."
      figma={{ absent: "Master pending in the SAMAVESH library — tracked on the component record." }}
      specimen={<VideoPlayground />}
      propsFrom="VideoTileProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A monitored feed — a residence's CCTV wall.",
          "A recording filed against a report, where the state and the transcript matter as much as the picture.",
        ],
        avoid: [
          "A promotional film on a public page. That is a Figure with a video in it, and it needs none of these states.",
          "A feed nobody is monitoring. A tile that is always offline is a page telling the reader nothing.",
        ],
      }}
      related={[
        { label: "Figure", href: "/design-system/components/data-display/figure", reason: "for a picture or film with a caption" },
        { label: "Event List", href: "/design-system/components/data-display/event-list", reason: "for the log a recording belongs to" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-auto">
            <h2 id="cdp-auto" className="cdp__h2">Never Autoplay, Never With Sound</h2>
            <p>
              A wall of nine tiles that all start playing is nine audio streams and a page that
              cannot be read. The reader presses play. There is no prop to change this, because
              there is no screen on this estate where nine simultaneous feeds is the right default.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-off">
            <h2 id="cdp-off" className="cdp__h2">Offline Is a Sentence, Not a Black Rectangle</h2>
            <p>
              &ldquo;The camera has not reported since 04:20 today&rdquo; is something an officer
              can act on. A dark tile is indistinguishable from a page that failed to load, and the
              officer&rsquo;s next move — reload, or report the camera — depends entirely on which
              of those it is.
            </p>
            <CodeBlock>{`import { VideoTile } from "@mosje/design-system";

<VideoTile
  label="Main gate"
  state="offline"
  offlineReason="The camera has not reported since 04:20 today."
  caption="Garima Greh, Bankura"
/>`}</CodeBlock>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-live">
            <h2 id="cdp-live" className="cdp__h2">&ldquo;Live&rdquo; Is Written</h2>
            <p>
              The red dot is decoration on top of the word, marked <code>aria-hidden</code>. A dot
              alone means nothing to a screen reader and nothing to a reader who cannot distinguish
              it from the recorded badge beside it.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-alt">
            <h2 id="cdp-alt" className="cdp__h2">The Text Alternative Is a Prop</h2>
            <p>
              WCAG 1.2.1 asks for one. Making <code>alternativeHref</code> part of the API means its
              absence is visible at the call site, where the developer can do something about it,
              rather than discovered later in an audit of a page that has already shipped.
            </p>
            <p>
              <code>captions</code> is separate and renders a real{" "}
              <code>&lt;track kind=&quot;captions&quot;&gt;</code>, on by default — WCAG 1.2.2 asks
              for captions on recorded speech, and a caption file is the only form of them a viewer
              can switch on. A live feed has none, which is why the two are different props rather
              than one standing in for the other.
            </p>
          </section>
        </>
      }
    />
  );
}
