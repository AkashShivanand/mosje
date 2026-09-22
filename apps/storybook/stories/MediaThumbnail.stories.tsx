import type { Meta, StoryObj } from "@storybook/react-vite";
import { MediaThumbnail } from "@mosje/design-system";

/**
 * A photo or video that opens when pressed — the trigger for a Lightbox.
 *
 * **Use it** in a table cell or list row that holds photographs a reader may
 * want full size, and for the media area of a gallery card.
 *
 * **Do not use it** for a picture that leads to another page — that is a link
 * around a Figure — or for a picture that is only there to be looked at.
 *
 * `label` is required and is the button's whole name — "View 3 training
 * photos". The image inside is decorative, because its alt text and the action
 * are the same sentence. `src` is the image or a video's poster; without it the
 * component draws a dashed empty tile carrying `emptyLabel`, which is not
 * focusable because there is nothing to open. `kind="video"` draws a play glyph
 * at all times. `count` of two or more draws a "+N" badge counting the items NOT
 * shown. `size` is `sm` (64 × 48, a table cell), `md` (80 × 60, a list row) or
 * `fill` (the card decides the shape). `onClick` opens the item — usually a
 * Lightbox at this item's index — and is never called for the empty tile.
 */
const meta = {
  title: "Data Display/MediaThumbnail",
  component: MediaThumbnail,
  parameters: { layout: "centered" },
} satisfies Meta<typeof MediaThumbnail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { src: "/images/specimen-photo-1.jpg", count: 3, label: "View 3 training photos", size: "sm" },
};

/** A list row's thumbnail. */
export const Medium: Story = {
  args: { src: "/images/specimen-photo-2.jpg", label: "View Pledge drive, Bankura", size: "md" },
};

/** A video: the play glyph is always drawn, never a hover secret. */
export const Video: Story = {
  args: { src: "/images/specimen-photo-1.jpg", kind: "video", label: "Play Awareness session, Purulia", size: "md" },
};

/** Nothing uploaded yet. Drawn, not omitted, and not focusable. */
export const Empty: Story = {
  args: { label: "View photos", emptyLabel: "No photos uploaded", size: "sm" },
};
