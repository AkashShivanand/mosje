import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { BarChart, BulletChart, SmallMultiples, texturedColor } from "@mosje/design-system";

/**
 * @covers BulletChart, SmallMultiples
 *
 * **BulletChart is the shape of almost every figure this department reports.**
 * Sanctioned against released, released against utilised, places created against
 * places filled. Drawn as two bars side by side those read as two comparable
 * quantities; on one line, with the target as a tick across the measure, "did it
 * reach the target" becomes a single visual question.
 *
 * `ranges` are the department's own thresholds and are drawn in NEUTRAL bands on
 * purpose — the estate reserves status colour for status, and a component that
 * decides 60% is "amber" has made a policy judgement belonging to the scheme.
 *
 * **SmallMultiples is the answer to running out of colours.** The categorical
 * ramp has exactly six mutually distinguishable slots and that is the proven
 * ceiling for any palette at this saturation. Twenty-eight states cannot be
 * coloured; as twenty-eight panels they need no colour at all, because position
 * carries identity. Every panel shares one scale — which is why `valuesOf` is
 * required and `renderItem` is handed `sharedMax` rather than being trusted to
 * work it out. Panels that each scale to their own maximum are worse than no
 * chart, because they look rigorous while being incomparable.
 *
 * `columns` sets the widest layout (2, 3, 4 or 6); it always drops to one column
 * on a phone. `emptyLabel` covers the filtered-to-nothing case.
 *
 * `valueFormat` swaps the number formatter — it defaults to the Indian grouping
 * (`formatIndian`, so 12,34,567 rather than 1,234,567), which is what every
 * figure on this estate should use unless the source publishes otherwise.
 * `summary` overrides the screen-reader sentence; the default already names each
 * measure against its target, so set it only when the chart's point is something
 * the numbers do not say on their own.
 */
const meta = {
  title: "DataDisplay/BulletChart",
  component: BulletChart,
  parameters: { layout: "padded" },
} satisfies Meta<typeof BulletChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    title: "Scheme Delivery Against Target",
    unit: "₹ crore",
    rows: [
      { label: "Grants Released", value: 940, target: 1200, ranges: [600, 1000], max: 1400 },
      { label: "Utilisation Certified", value: 610, target: 940, ranges: [400, 800], max: 1400 },
      { label: "Hostels Completed", value: 128, target: 110, ranges: [60, 100], max: 140 },
    ],
  },
};

/** No target published: the tick is simply absent, not drawn at zero. */
export const WithoutTargets: Story = {
  args: {
    title: "Applications Received",
    rows: [
      { label: "Uttar Pradesh", value: 4520 },
      { label: "Maharashtra", value: 3180 },
      { label: "Bihar", value: 2740 },
    ],
  },
};

/** No thresholds published: the track is plain, which is the honest default. */
export const WithoutRanges: Story = {
  args: {
    title: "Places Filled Against Sanctioned",
    rows: [
      { label: "Boys' Hostels", value: 8600, target: 9000 },
      { label: "Girls' Hostels", value: 7420, target: 9000 },
    ],
  },
};

export const Loading: Story = { args: { ...Playground.args, state: "loading" } };
export const Empty: Story = { args: { title: "Scheme Delivery", rows: [] } };
export const ErrorState: Story = {
  args: { ...Playground.args, state: "error", onRetry: () => {} },
};

/**
 * Small multiples with a shared scale, and TEXTURE.
 *
 * `texturedColor(i)` points a series at the hatch patterns `textured` emits.
 * Texture is what survives colour-vision deficiency, print and forced-colors —
 * the three situations that take the six colour slots away. It keeps the hue as
 * well as the geometry, so a reader who can see colour loses nothing.
 */
export const SmallMultiplesWithTexture: StoryObj = {
  render: function SmallMultiplesStory() {
    const states = [
      { name: "Uttar Pradesh", values: [450, 380, 290] },
      { name: "Maharashtra", values: [310, 300, 260] },
      { name: "Bihar", values: [280, 210, 180] },
      { name: "Madhya Pradesh", values: [240, 230, 150] },
    ];
    return (
      <SmallMultiples
        title="Applications by State and Category"
        items={states}
        columns={4}
        labelOf={(s) => s.name}
        valuesOf={(s) => s.values}
        renderItem={(s, sharedMax) => (
          <BarChart
            title={`${s.name} applications`}
            tableView="sr-only"
            textured
            max={sharedMax}
            data={s.values.map((v, i) => ({
              label: ["SC", "ST", "OBC"][i] ?? String(i),
              value: v,
              color: texturedColor(i),
            }))}
          />
        )}
      />
    );
  },
};
