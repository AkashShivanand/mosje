import type { Meta, StoryObj } from "@storybook/react";
import { Figure } from "@mosje/design-system";

/**
 * **Figure** — an image and its caption, as one thing.
 *
 * The point is the `<figure>`/`<figcaption>` pairing. A caption placed in a
 * sibling paragraph is read as the next paragraph, so a screen-reader user
 * meets a sentence with no idea it describes the picture they have just passed.
 * The markup here makes the association, and it costs nothing visually.
 *
 * **This component does not supply alt text and cannot.** The alternative text
 * belongs on the image the caller passes, because only the caller knows what
 * the picture is doing on the page — the same photograph is decorative beside a
 * heading and load-bearing on an evidence screen.
 *
 * A caption is not a substitute for alt text either. The caption is read by
 * everyone; the alt text stands in for the picture when it cannot be seen.
 * Where the two would say the same thing, the image is decorative and its `alt`
 * should be empty.
 *
 * `fit` matters more than it looks. `cover` crops to fill and is right for a
 * photograph; `contain` fits the whole image and is right for a logo, a
 * certificate or a scanned document, where cropping removes the thing being
 * shown.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Data Display/Figure",
  component: Figure,
  args: {
    ratio: "video",
    bordered: true,
    fit: "cover",
    caption: "Adarsh Gram village, Bankura district, West Bengal.",
    credit: "Photograph: PM-AJAY Management Information System",
    children: (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="https://placehold.co/1200x675/0373DF/FFFFFF?text=Scheme+photograph"
        alt="A village road with newly laid paving and street lighting."
      />
    ),
  },
  argTypes: {
    ratio: {
      control: "inline-radio",
      options: ["auto", "square", "video", "photo", "portrait"],
    },
    fit: { control: "inline-radio", options: ["cover", "contain"] },
    bordered: { control: "boolean" },
    caption: { control: "text" },
    credit: { control: "text" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, maxWidth: 520 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Figure>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default: a photograph locked to 16:9, cropped to fill, with its source named. */
export const Playground: Story = {};

/**
 * `contain` for a document. A crop here would remove the seal, the signature or
 * the reference number — which is the whole reason the scan is on the page.
 */
export const AScannedDocument: Story = {
  args: {
    ratio: "portrait",
    fit: "contain",
    caption: "Sanction order, AVYAY 2026-27.",
    credit: undefined,
    children: (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="https://placehold.co/900x1200/EEF0F3/1E2124?text=Sanction+order"
        alt="Scanned sanction order dated 3 September 2026, reference MOSJE slash AVYAY slash 2026 slash 004821."
      />
    ),
  },
};

/**
 * `auto` leaves the height to the image — right for a diagram or a screenshot,
 * where any crop removes information.
 */
export const ADiagram: Story = {
  args: {
    ratio: "auto",
    caption: "How an application moves between officers.",
    credit: undefined,
    children: (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="https://placehold.co/1200x400/FFFFFF/1E2124?text=Approval+flow"
        alt="Applicant submits, district officer verifies, screening committee recommends, ministry sanctions."
      />
    ),
  },
};

/** No caption and no credit: just a framed image. The figure adds only the frame. */
export const Bare: Story = {
  args: { caption: undefined, credit: undefined, ratio: "square" },
};
