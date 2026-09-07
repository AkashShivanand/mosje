import type { Meta, StoryObj } from "@storybook/react";
import { PageHeaderCarousel } from "@mosje/design-system";

const SLIDES = [
  {
    src: "/website/content/organisation/nmba-hero-1.jpg",
    alt: "A Nasha Mukt Bharat Abhiyaan event at a Government of India venue",
  },
  { src: "/website/content/organisation/nmba-hero-2-goa.png", alt: "An Abhiyaan event in Goa" },
  {
    src: "/website/content/organisation/nmba-hero-3-blv.png",
    alt: "Shri B. L. Verma, Minister of State, at an Abhiyaan event",
  },
  {
    src: "/website/content/organisation/nmba-hero-4-ra.png",
    alt: "Shri Ramdas Athawale, Minister of State, at an Abhiyaan event",
  },
];

const meta = {
  title: "Layout/PageHeaderCarousel",
  component: PageHeaderCarousel,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The circular photo carousel in a landing page header — the second of " +
          "`SitePageHeader`'s two media variants.\n\n" +
          "**The still portrait is decorative; this is not.** The header hides `media` from " +
          "assistive technology by contract, because a single portrait repeats nothing the " +
          "copy says. A carousel shows several different pictures and carries buttons, so it " +
          "is a named region instead — which is why the header gates the variant on " +
          "`mediaLabel` rather than on styling. Buttons inside an `aria-hidden` subtree stay " +
          "in the tab order while being invisible to a screen reader, which is worse than " +
          "either hiding them properly or exposing them properly.\n\n" +
          "**Autoplay is opt-in, stops on interaction, and never starts under " +
          "`prefers-reduced-motion`.** WCAG 2.2 §2.2.2 gives a reader the right to stop " +
          "anything that moves for more than five seconds. NMBA ships without it, as its " +
          "source does.\n\n" +
          "**One slide is in the DOM at a time.** A track of four images inside a circle " +
          "means three pictures a screen-reader user walks through and a sighted reader " +
          "cannot see; a polite live region announces the change instead.\n\n" +
          "**The dots are 24×24 targets around an 8px dot** (WCAG 2.2 §2.5.8), and the " +
          "current one is a bar rather than a brighter circle, so shape carries the state " +
          "and not only tone.",
      },
    },
  },
} satisfies Meta<typeof PageHeaderCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** As NMBA ships it: four photographs, reader-driven, no autoplay. */
export const Default: Story = {
  args: { slides: SLIDES, label: "Abhiyaan photographs" },
  render: (args) => (
    <div style={{ width: 340, height: 340 }}>
      <PageHeaderCarousel {...args} />
    </div>
  ),
};

/** A single picture renders with no controls at all — at which point the still
    portrait variant is the better choice, and this is what it degrades to. */
export const SingleSlide: Story = {
  args: { slides: [SLIDES[0]!], label: "Abhiyaan photograph" },
  render: (args) => (
    <div style={{ width: 340, height: 340 }}>
      <PageHeaderCarousel {...args} />
    </div>
  ),
};

/** Autoplay, for the rare surface that wants it. It stops for good on hover or
    focus, and does not start when the reader has asked for reduced motion. */
export const Autoplaying: Story = {
  args: { slides: SLIDES, label: "Abhiyaan photographs", autoPlayMs: 3000 },
  render: (args) => (
    <div style={{ width: 340, height: 340 }}>
      <PageHeaderCarousel {...args} />
    </div>
  ),
};
