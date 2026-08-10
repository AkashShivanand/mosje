import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  FormField,
  MediaGalleryInput,
  type GalleryMediaItem,
} from "@mosje/design-system";

/**
 * **MediaGalleryInput** — a tiled, multi-file picker for event evidence.
 *
 * The difference from `MediaUpload` is not "more files": it is that the gallery
 * is a **list the user curates**. Items are added and removed individually, the
 * count is capped by `maxItems`, and each tile keeps its own name so the
 * reporter can tell one pledge photograph from another.
 *
 * It accepts video as well as images and captures a **poster frame** from each
 * video on add, so a gallery of clips does not render as a row of black
 * rectangles. As with `MediaUpload`, files are read to data-URLs in the
 * browser; nothing is sent anywhere until you submit.
 *
 * Use it for the Mass Pledge photographs, camp documentation, inspection
 * records. Do **not** use it where each photograph must carry coordinates —
 * that is `GeoPhotoInput`, which will not accept an untagged image silently.
 *
 * Spread the `FormField` control props onto it. The `id` it passes lands on the
 * add tile, so the label points at the thing the user actually operates rather
 * than at the grid around it.
 *
 * Lifecycle: **Stable**.
 */

/**
 * Placeholder image *content* — a labelled rectangle encoded as an SVG
 * data-URL, standing in for the photographs a reporter would attach. The
 * colours here are picture content, not interface styling.
 */
const placeholder = (label: string, tone: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">` +
      `<rect width="320" height="240" fill="${tone}"/>` +
      `<text x="160" y="126" font-family="Noto Sans, sans-serif" font-size="18" fill="#ffffff" text-anchor="middle">${label}</text>` +
      `</svg>`,
  )}`;

const SEEDED: GalleryMediaItem[] = [
  { url: placeholder("Pledge — Haveli block", "#4b5563"), type: "image", name: "pledge-haveli-01.jpg" },
  { url: placeholder("School assembly", "#6b7280"), type: "image", name: "assembly-zp-school.jpg" },
  {
    url: placeholder("Rally clip", "#374151"),
    type: "video",
    name: "awareness-rally.mp4",
    poster: placeholder("Rally clip", "#374151"),
  },
];

const meta = {
  title: "Components/Forms/MediaGalleryInput",
  component: MediaGalleryInput,
  args: {
    value: [],
    onChange: () => {},
    accept: "image/*,video/*",
    maxItems: 12,
    maxSizeMb: 25,
    invalid: false,
    disabled: false,
  },
  argTypes: {
    maxItems: { control: { type: "number", min: 1, max: 24 } },
    maxSizeMb: { control: { type: "number", min: 1, max: 100 } },
    accept: { control: "text" },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    value: { control: false },
    onChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MediaGalleryInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Add your own files — the add tile stays until `maxItems` is reached. */
export const Playground: Story = {
  render: function Render(args) {
    const [items, setItems] = React.useState<GalleryMediaItem[]>([]);
    return <MediaGalleryInput {...args} value={items} onChange={setItems} />;
  },
};

/** Empty — the whole component is the add tile plus its hint. */
export const Empty: Story = {};

/** Seeded with a mix of photographs and a video, which carries a poster frame. */
export const WithItems: Story = {
  render: function Render(args) {
    const [items, setItems] = React.useState<GalleryMediaItem[]>(SEEDED);
    return (
      <FormField
        label="Event photographs and video"
        required
        hint="At least three photographs of the pledge ceremony"
      >
        {(c) => <MediaGalleryInput {...args} {...c} value={items} onChange={setItems} />}
      </FormField>
    );
  },
};

/** At `maxItems` the add tile disappears — there is nothing left to do. */
export const AtCapacity: Story = {
  render: function Render(args) {
    const [items, setItems] = React.useState<GalleryMediaItem[]>(SEEDED);
    return <MediaGalleryInput {...args} maxItems={3} value={items} onChange={setItems} />;
  },
};

/** Images only, with a tighter size cap and the error state. */
export const ImagesOnlyInvalid: Story = {
  render: (args) => (
    <FormField
      label="Event photographs"
      required
      error="Attach at least three photographs before submitting."
    >
      {(c) => (
        <MediaGalleryInput
          {...args}
          {...c}
          accept="image/*"
          maxSizeMb={5}
          value={[]}
          onChange={() => {}}
        />
      )}
    </FormField>
  ),
};

export const Disabled: Story = {
  args: { value: SEEDED, disabled: true },
};
