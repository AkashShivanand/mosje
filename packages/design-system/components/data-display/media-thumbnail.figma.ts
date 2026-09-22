// url=<SAMAVESH>?node-id=58689-591
// source=packages/design-system/components/data-display/media-thumbnail.tsx
// component=MediaThumbnail
import figma from "figma";

const instance = figma.selectedInstance;

const size = instance.getEnum("Size", {
  Small: "sm",
  Medium: "md",
  Fill: "fill",
});

const kind = instance.getEnum("Kind", {
  Image: "image",
  Video: "video",
  Empty: "empty",
});

const showCount = instance.getBoolean("Show count");

/**
 * State (Default / Hover / Focused) is drawn for the designer and has no prop:
 * the browser drives hover and focus. `label` has no Figma property because
 * nothing in the picture shows it — the snippet carries a placeholder the
 * developer must replace with the action, "View 3 training photos".
 */
export default {
  example: figma.code`
    <MediaThumbnail
      size="${size}"
      ${kind === "empty" ? 'emptyLabel="No photos uploaded"' : "src={photos[0]}"}
      ${kind === "video" ? 'kind="video"' : ""}
      ${showCount ? "count={photos.length}" : ""}
      label="View photos"
      onClick={() => openLightbox(0)}
    />
  `,
  imports: ['import { MediaThumbnail } from "@mosje/design-system"'],
  id: "media-thumbnail",
  metadata: { nestable: true },
};
