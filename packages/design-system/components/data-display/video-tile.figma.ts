// url=<SAMAVESH>?node-id=57620-779
// source=packages/design-system/components/data-display/video-tile.tsx
// component=VideoTile
import figma from "figma";

const instance = figma.selectedInstance;

const state = instance.getEnum("State", {
  Live: "live",
  Recorded: "recorded",
  Connecting: "connecting",
  Offline: "offline",
});

/**
 * Nothing autoplays, and there is no prop to make it. `alternativeHref` is
 * emitted on every tile, because WCAG 1.2.1 asks for a text alternative and the
 * point of it being a prop is that its absence is visible at the call site.
 */
const playable = state === "live" || state === "recorded";

export default {
  example: figma.code`
    <VideoTile
      label="${state === "offline" ? "Main gate" : state === "connecting" ? "Kitchen" : "Dormitory corridor"}"
      state="${state}"
      caption="Garima Greh, Bankura"
      ${playable ? figma.code`src="/streams/dormitory.m3u8" poster="/streams/dormitory.jpg"` : ""}
      ${state === "offline" ? figma.code`offlineReason="The camera has not reported since 04:20 today."` : ""}
      alternativeHref="/cctv/log"
    />
  `,
  imports: ['import { VideoTile } from "@mosje/design-system"'],
  id: "video-tile",
  metadata: { nestable: false },
};
