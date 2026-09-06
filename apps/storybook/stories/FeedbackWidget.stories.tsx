import type { Meta, StoryObj } from "@storybook/react";
import { FeedbackWidget } from "@mosje/design-system";

/**
 * **Feedback Widget** — "Was this page useful?", the page-level control GIGW
 * expects on a government page, in three states: the question, the comment, and
 * the acknowledgement.
 *
 * **The comment box only appears after a verdict.** Asking for a verdict and a
 * paragraph at once gets neither: most readers will answer a two-button question
 * in passing and will not open a text field. Taking the click first means the
 * useful signal is captured even when nobody types.
 *
 * **It is deliberately not a contact form.** A feedback box on a page with no
 * visible way to reach the department becomes where grievances are filed, and a
 * grievance filed into an analytics endpoint is never answered. `helpHref`
 * exists so the reader who actually needed help is sent somewhere that will
 * answer them — supply it, on every page.
 *
 * The question should be about **this page**. A citizen can answer "did this
 * page tell you what you came for"; they cannot answer "how are we doing".
 *
 * The comment box carries a standing warning not to include Aadhaar numbers,
 * bank details or telephone numbers — because people do, and a free-text field
 * on a government page will collect personal data unless it says not to.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Feedback/Feedback Widget",
  component: FeedbackWidget,
  args: {
    question: "Was this page useful?",
    onSubmit: () => {},
    helpHref: "/website/contact",
    helpLabel: "Report a problem or contact the department",
  },
  argTypes: {
    question: { control: "text" },
    helpHref: { control: "text" },
    helpLabel: { control: "text" },
    thanks: { control: "text" },
    onSubmit: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeedbackWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Answer Yes or No and the comment box appears, with focus moved into it. */
export const Playground: Story = {};

/**
 * A slow endpoint. Returning a promise from `onSubmit` keeps the button in its
 * sending state until it settles, so the reader is not left pressing Send twice.
 */
export const Sending: Story = {
  args: {
    onSubmit: () => new Promise((resolve) => setTimeout(resolve, 2500)),
  },
};

/**
 * With the acknowledgement rewritten to say what does *not* happen. Where the
 * department cannot reply, saying so is the honest thing — and it is what stops
 * the box being used as a grievance channel.
 */
export const AnHonestAcknowledgement: Story = {
  args: {
    thanks:
      "Thank you. Responses are counted but not read individually, and the department cannot reply here.",
  },
};

/**
 * Without `helpHref` — how it should NOT be used on a citizen-facing page. There
 * is nowhere for the reader who needed help to go.
 */
export const WithoutAWayToGetHelp: Story = {
  args: { helpHref: undefined },
};
