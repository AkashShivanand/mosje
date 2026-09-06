import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Carousel } from "@mosje/design-system";

const CARD: React.CSSProperties = {
  padding: 32,
  minHeight: 160,
  borderRadius: 12,
  background: "var(--sa-bg-brand-primary-base)",
  color: "var(--sa-text-neutral-bolder)",
};

const SLIDES = [
  { title: "Applications open for AVYAY 2026-27", body: "Institutions may apply until 31 October 2026." },
  { title: "Adarsh Gram declarations", body: "19,768 villages have been declared under PM-AJAY." },
  { title: "Nasha Mukt Bharat Abhiyaan", body: "Treatment centres are listed by district." },
  { title: "National Overseas Scholarship", body: "The scrutiny stage begins on 15 September." },
];

/**
 * **Carousel** — a band of slides the reader moves through.
 *
 * **Auto-rotation is off by default and the default should be respected.** A
 * carousel that moves on its own takes the sentence a citizen is reading away
 * mid-sentence, and it does that most to the slowest readers. WCAG 2.2.2 is met
 * when it is on — the pause control appears, rotation stops on hover and on
 * focus, and `prefers-reduced-motion` disables it outright — but meeting the
 * criterion is not the same as the thing being a good idea.
 *
 * **Everything essential must also exist outside the carousel.** Slides two
 * onwards are, in practice, unread: they sit behind an interaction most people
 * never perform. Put the important announcement on the page.
 *
 * The structure follows the WAI-ARIA carousel pattern — the region carries
 * `aria-roledescription="carousel"` and its name, each slide is a `group`
 * labelled "N of M", and moving by button announces the new position through a
 * polite live region, because the visual change alone tells a screen-reader user
 * nothing.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Data Display/Carousel",
  component: Carousel,
  args: {
    label: "Departmental announcements",
    autoPlay: false,
    interval: 7,
    showDots: true,
    children: SLIDES.map((s) => (
      <div key={s.title} style={CARD}>
        <h3 style={{
          margin: 0,
          fontSize: "var(--sa-type-title-2-size)",
          lineHeight: "var(--sa-type-title-2-lh)",
        }}>{s.title}</h3>
        <p style={{ marginBottom: 0 }}>{s.body}</p>
      </div>
    )),
  },
  argTypes: {
    label: { control: "text" },
    autoPlay: { control: "boolean" },
    interval: { control: { type: "number", min: 2, max: 30 } },
    showDots: { control: "boolean" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default, and the one to use: the reader moves it, nothing moves on its own. */
export const Playground: Story = {};

/**
 * Auto-rotating. Note what appears the moment it does: a pause control, because
 * WCAG 2.2.2 requires anything moving for more than five seconds to be stoppable.
 * Rotation also halts while the pointer is over the band or focus is inside it —
 * both are signals the reader is reading *this* slide.
 */
export const AutoRotating: Story = {
  args: { autoPlay: true, interval: 4 },
};

/** Without dots, for a band where the arrows are enough and the count is small. */
export const WithoutDots: Story = {
  args: { showDots: false },
};

/** A single slide. The controls still work and simply wrap onto themselves. */
export const OneSlide: Story = {
  args: {
    children: (
      <div style={CARD}>
        <h3 style={{
          margin: 0,
          fontSize: "var(--sa-type-title-2-size)",
          lineHeight: "var(--sa-type-title-2-lh)",
        }}>Applications open for AVYAY 2026-27</h3>
        <p style={{ marginBottom: 0 }}>Institutions may apply until 31 October 2026.</p>
      </div>
    ),
  },
};
