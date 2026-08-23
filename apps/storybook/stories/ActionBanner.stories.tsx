import type { Meta, StoryObj } from "@storybook/react";
import { ActionBanner, buttonClasses } from "@mosje/design-system";

/**
 * **ActionBanner** — a call to action: a title, an optional sentence, one control.
 *
 * **Two variants, one content model.** `banner` is the full-width strip that
 * closes a page section; `card` is the same content in a column, for a grid of
 * two or three parallel offers. They are variants rather than two components
 * because only the axis changes — a second component would be a second thing to
 * keep in step, and the first symptom of that is two CTAs on one estate with
 * different padding.
 *
 * **The `card` variant stretches and pins its action to the bottom.** In a grid
 * that means every card is the same height and every button sits on one line,
 * however long the descriptions run. It is the single rule that makes a card
 * grid look composed rather than assembled.
 *
 * **One action.** `action` is a slot and will hold whatever it is given, but a
 * banner with two equal buttons has no call to action — it has a decision. If a
 * secondary path is genuinely needed, make it a text link beside the button.
 *
 * **Colour resolves through `--sa-color-primaryScale-*`,** so the panel follows
 * `data-brand` across all eight modes. It previously painted a
 * `blue-50 → indigo-50` gradient with `neutral` grey text: indigo is not a
 * SAMAVESH colour, a literal palette cannot answer to the brand mode, and grey
 * on a tinted ground reads as washed out. Secondary text is now a deeper shade
 * of the same tint.
 *
 * **Accessibility:** the title is a real heading so the CTA appears in the
 * document outline — pass `as` to fit the surrounding hierarchy. The panel is
 * not a landmark; it is a paragraph and a button.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/ActionBanner",
  component: ActionBanner,
  args: {
    title: "Need help with a scheme or an application?",
    description: "Write to the department and an officer will respond.",
    variant: "banner",
    action: (
      <a href="#contact" className={buttonClasses("primary", "filled", "md")}>
        Get in Touch
      </a>
    ),
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["banner", "card"] },
    as: { control: "inline-radio", options: ["h2", "h3", "h4"] },
    action: { control: false },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof ActionBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default: full width, text left, action right. One per section. */
export const Banner: Story = {};

/** Title only. The sentence is optional, but a CTA usually needs it — the
 *  heading says what the subject is, the sentence says what happens if you
 *  press the button. */
export const WithoutDescription: Story = {
  args: { description: undefined },
};

/** The `card` variant on its own. Compare with `CardGrid` below — the stretch
 *  behaviour only shows itself when there is a sibling to line up with. */
export const Card: Story = {
  args: { variant: "card" },
};

/**
 * Three cards with descriptions of deliberately different lengths. The buttons
 * still land on one line, because the card stretches to the grid row and pushes
 * its action to the bottom.
 */
export const CardGrid: Story = {
  render: (args) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "var(--sa-inline-24)",
        alignItems: "stretch",
      }}
    >
      <ActionBanner
        {...args}
        variant="card"
        title="Apply for a scholarship"
        description="Pre-matric and post-matric scholarships for students from SC, OBC and DNT communities."
      />
      <ActionBanner
        {...args}
        variant="card"
        title="Raise a grievance"
        description="Track it end to end."
      />
      <ActionBanner
        {...args}
        variant="card"
        title="Find a scheme"
        description="Answer five questions and see which of the department's schemes you may be eligible for, with the documents each one asks for."
      />
    </div>
  ),
};

/**
 * The banner stacks below 640px and the action goes full width — a button
 * floating alone on a narrow screen reads as orphaned. Set the viewport to
 * mobile to see it.
 */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
