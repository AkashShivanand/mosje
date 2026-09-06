"use client";
import * as React from "react";
import { VideoTile } from "@mosje/design-system";

const CAPTION: React.CSSProperties = {
  fontSize: "var(--sa-type-label-2-size)", lineHeight: "var(--sa-type-label-2-lh)",
  color: "var(--sa-text-neutral-subtle)", margin: 0,
};

/** Every state: live, recorded, connecting, offline. */
export function VideoPlayground(): React.JSX.Element {
  return (
    <div style={{ padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-subtle)",
      borderRadius: "var(--sa-shape-8)", display: "grid", gap: "var(--sa-stack-24)" }}>
      <div style={{ display: "grid", gap: "var(--sa-inline-16)", gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))" }}>
        <VideoTile label="Dormitory corridor" state="live" poster="/website/images/Banner-6.png"
          caption="Garima Greh, Bankura" alternativeHref="#log" />
        <VideoTile label="Awareness camp, Purulia" state="recorded" poster="/website/images/Banner-7.png"
          caption="Recorded 2 September 2026" alternativeHref="#transcript" alternativeLabel="Transcript" />
        <VideoTile label="Kitchen" state="connecting" caption="Garima Greh, Bankura" />
        <VideoTile label="Main gate" state="offline" caption="Garima Greh, Bankura"
          offlineReason="The camera has not reported since 04:20 today. The district office has been notified." />
      </div>
      <p style={CAPTION}>
        Nothing autoplays. &ldquo;Live&rdquo; is a word before it is a dot, and offline is a sentence
        an officer can act on rather than a dark rectangle.
      </p>
    </div>
  );
}
