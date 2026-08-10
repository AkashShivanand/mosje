import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FormField, GeoPhotoInput, type GeoPhoto } from "@mosje/design-system";

/**
 * **GeoPhotoInput** — evidence photographs that record **where** they were
 * taken.
 *
 * Reach for it when the location is part of the record, not an extra: an
 * inspection, an Adarsh Gram works photograph, a camp held in a named block.
 * For photographs that are just documentation, `MediaGalleryInput` is lighter
 * and does not ask for location permission.
 *
 * Two behaviours are worth knowing before you use it:
 *
 * - **Coordinates are resolved per photo**, from the image's own EXIF GPS tag
 *   when it survives, otherwise from the device's location at upload. A photo
 *   that yields neither is still accepted and marked `UNAVAILABLE` — forwarded
 *   photographs routinely lose EXIF, and refusing them would strand honest
 *   reporters. **You decide what an unlocated photo means**; the component will
 *   not decide it for you.
 * - **Originals are never kept.** Each file is re-encoded into a ~1600px view
 *   copy and a ~320px thumbnail, so a four-photo submission stays a few hundred
 *   KB instead of tens of MB. `viewMaxEdge`, `thumbMaxEdge` and `quality` tune
 *   that; the defaults are what the portals ship.
 *
 * The browser asks for location permission **once per mount** — a live story
 * below will prompt. `minItems` is hint text only; enforce the minimum in your
 * own validation.
 *
 * Lifecycle: **Stable**.
 */

/**
 * Placeholder image *content* for the seeded stories — a labelled rectangle as
 * an SVG data-URL, standing in for a field photograph. These colours are
 * picture content, not interface styling.
 */
const placeholder = (label: string, tone: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">` +
      `<rect width="320" height="240" fill="${tone}"/>` +
      `<text x="160" y="126" font-family="Noto Sans, sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">${label}</text>` +
      `</svg>`,
  )}`;

const photo = (
  id: string,
  label: string,
  tone: string,
  geo: Pick<GeoPhoto, "lat" | "lng" | "accuracyM" | "source">,
): GeoPhoto => ({
  id,
  thumbDataUrl: placeholder(label, tone),
  viewDataUrl: placeholder(label, tone),
  originalName: `${id}.jpg`,
  originalBytes: 3_145_728,
  mime: "image/jpeg",
  capturedAt: "2026-08-18T09:40:00.000Z",
  ...geo,
});

const SEEDED: GeoPhoto[] = [
  photo("adarsh-gram-approach-road", "Approach road — Wagholi", "#4b5563", {
    lat: 18.5793,
    lng: 73.9781,
    accuracyM: 8,
    source: "EXIF",
  }),
  photo("adarsh-gram-community-hall", "Community hall", "#6b7280", {
    lat: 18.5801,
    lng: 73.9764,
    accuracyM: 24,
    source: "DEVICE",
  }),
  photo("adarsh-gram-water-point", "Water point", "#374151", {
    lat: null,
    lng: null,
    accuracyM: null,
    source: "UNAVAILABLE",
  }),
];

const meta = {
  title: "Components/Forms/GeoPhotoInput",
  component: GeoPhotoInput,
  args: {
    value: [],
    onChange: () => {},
    maxItems: 4,
    minItems: 1,
    maxSizeMb: 10,
    viewMaxEdge: 1600,
    thumbMaxEdge: 320,
    quality: 0.72,
    invalid: false,
    disabled: false,
  },
  argTypes: {
    maxItems: { control: { type: "number", min: 1, max: 8 } },
    minItems: { control: { type: "number", min: 0, max: 4 } },
    maxSizeMb: { control: { type: "number", min: 1, max: 25 } },
    viewMaxEdge: { control: { type: "number", min: 400, max: 3000, step: 100 } },
    thumbMaxEdge: { control: { type: "number", min: 120, max: 640, step: 20 } },
    quality: { control: { type: "range", min: 0.3, max: 1, step: 0.02 } },
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
} satisfies Meta<typeof GeoPhotoInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Live. Attaching a photograph will ask for location permission — decline it
 * and the photo is still accepted, marked as having no coordinates.
 */
export const Playground: Story = {
  render: function Render(args) {
    const [photos, setPhotos] = React.useState<GeoPhoto[]>([]);
    return <GeoPhotoInput {...args} value={photos} onChange={setPhotos} />;
  },
};

export const Empty: Story = {};

/**
 * All three provenances at once — EXIF, device, and unavailable. The third is
 * the one to look at: it is accepted, and labelled, not rejected.
 */
export const AllThreeProvenances: Story = {
  render: function Render(args) {
    const [photos, setPhotos] = React.useState<GeoPhoto[]>(SEEDED);
    return (
      <FormField
        label="Site photographs"
        required
        hint="At least one photograph of the completed works, taken on site"
      >
        {(c) => <GeoPhotoInput {...args} {...c} value={photos} onChange={setPhotos} />}
      </FormField>
    );
  },
};

/** At `maxItems` the add control goes — there is nothing further to attach. */
export const AtCapacity: Story = {
  render: function Render(args) {
    const [photos, setPhotos] = React.useState<GeoPhoto[]>(SEEDED);
    return <GeoPhotoInput {...args} maxItems={3} value={photos} onChange={setPhotos} />;
  },
};

/** Validation failed at submit — the minimum is yours to enforce, not the component's. */
export const Invalid: Story = {
  render: (args) => (
    <FormField
      label="Site photographs"
      required
      error="Attach at least one photograph of the completed works."
    >
      {(c) => <GeoPhotoInput {...args} {...c} value={[]} onChange={() => {}} />}
    </FormField>
  ),
};

export const Disabled: Story = {
  args: { value: SEEDED, disabled: true },
};
