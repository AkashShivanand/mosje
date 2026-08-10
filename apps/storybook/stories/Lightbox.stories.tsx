import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, Lightbox, type LightboxItem } from "@mosje/design-system";

/**
 * **Lightbox** — a full-screen viewer for paging through evidence media.
 *
 * The counterpart to `MediaGalleryInput` and `GeoPhotoInput`: those collect the
 * media, this is how a reviewer actually looks at it. A thumbnail grid is for
 * recognising a photograph; the lightbox is for reading the sanction number off
 * one.
 *
 * Use it when there is a **set** to page through. For a single image that just
 * needs to be bigger, a link to the file is simpler and does not trap focus.
 * Do not use it as a general dialog — it has no footer and no actions by
 * design; decisions belong in a `Modal` or a `SideSheet`.
 *
 * `index` is the *starting* item; the component owns the position after that
 * and reports moves through `onIndexChange`, so the opener can restore where
 * the reviewer left off. Arrow keys page, Escape closes.
 *
 * Lifecycle: **Stable**.
 */

/**
 * Placeholder image *content* — labelled rectangles as SVG data-URLs, standing
 * in for the field photographs a reviewer would page through. These colours are
 * picture content, not interface styling.
 */
const placeholder = (label: string, tone: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">` +
      `<rect width="1200" height="800" fill="${tone}"/>` +
      `<text x="600" y="415" font-family="Noto Sans, sans-serif" font-size="44" fill="#ffffff" text-anchor="middle">${label}</text>` +
      `</svg>`,
  )}`;

const ITEMS: LightboxItem[] = [
  {
    type: "image",
    src: placeholder("Approach road — before", "#4b5563"),
    caption: "Approach road before works · Wagholi, Haveli block, Pune · 12 May 2026",
    alt: "Unpaved approach road to Wagholi gram panchayat before construction.",
  },
  {
    type: "image",
    src: placeholder("Approach road — after", "#6b7280"),
    caption: "Approach road after works · Wagholi, Haveli block, Pune · 04 August 2026",
    alt: "The same approach road, now surfaced, with drainage on both sides.",
  },
  {
    type: "image",
    src: placeholder("Community hall", "#374151"),
    caption: "Community hall, first floor complete · 04 August 2026",
    alt: "Community hall with the first floor slab cast and walls plastered.",
  },
];

const WITH_VIDEO: LightboxItem[] = [
  ...ITEMS,
  {
    type: "video",
    src: "data:video/mp4;base64,",
    poster: placeholder("Inauguration clip", "#1f2937"),
    caption: "Inauguration by the district collector · 08 August 2026",
  },
];

const meta = {
  title: "Components/Feedback/Lightbox",
  component: Lightbox,
  args: {
    open: true,
    items: ITEMS,
    index: 0,
    onClose: () => {},
  },
  argTypes: {
    open: { control: "boolean" },
    index: { control: { type: "number", min: 0, max: 3 } },
    items: { control: false },
    onClose: { control: false },
    onIndexChange: { control: false },
  },
} satisfies Meta<typeof Lightbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Opened from a thumbnail row — how it is reached in the portals. */
export const Playground: Story = {
  render: function Render(args) {
    const [openAt, setOpenAt] = React.useState<number | null>(null);
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {ITEMS.map((item, i) => (
            <button
              key={item.caption}
              type="button"
              onClick={() => setOpenAt(i)}
              style={{
                padding: 0,
                border: "1px solid var(--ds-border)",
                borderRadius: "var(--ds-radius-md)",
                background: "none",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              <img src={item.src} alt={item.alt ?? ""} width={160} height={107} />
            </button>
          ))}
        </div>
        <Lightbox
          {...args}
          open={openAt !== null}
          index={openAt ?? 0}
          onClose={() => setOpenAt(null)}
          onIndexChange={setOpenAt}
        />
      </div>
    );
  },
};

/** Open on the first item. Arrow keys page; Escape closes. */
export const Open: Story = {};

/** Starting part-way through the set — `index` is the entry point, not a lock. */
export const StartingAtAnItem: Story = {
  args: { index: 2 },
};

/**
 * A single item: the paging controls stand down, because there is nowhere to
 * page to.
 */
export const SingleItem: Story = {
  args: { items: [ITEMS[0]] },
};

/** A mixed set — a video sits alongside the photographs, with its poster frame. */
export const WithVideo: Story = {
  args: { items: WITH_VIDEO, index: 3 },
};
