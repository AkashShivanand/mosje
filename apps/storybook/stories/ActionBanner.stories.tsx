import type { Meta, StoryObj } from "@storybook/react";
import { ActionBanner, Button } from "@mosje/design-system";

/**
 * **ActionBanner** — a full-width band that names one thing the reader can do
 * next and gives them the control to do it.
 *
 * Use it once per page, at the foot of a section, to carry the single obvious
 * next step: apply, contact, download. Two banners on a page cancel each other
 * out — if everything is the call to action, nothing is. Do not use it for a
 * warning or a status message; that is `Alert`, which carries a semantic
 * colour and a role a screen reader announces. Lifecycle: **Stable**.
 *
 * `description` is optional. Leave it out when the title already says
 * everything — a banner that explains its own button is usually one that
 * needed a better button label.
 */
const meta = {
  title: "Components/Feedback/ActionBanner",
  component: ActionBanner,
  args: {
    title: "Ready to apply for grant-in-aid?",
    description: "Choose a scheme and we will guide you through the application.",
  },
} satisfies Meta<typeof ActionBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { action: <Button>Start an application</Button> },
};

/** Without a description, when the title carries the whole message. */
export const TitleOnly: Story = {
  args: {
    title: "Need help with your application?",
    description: undefined,
    action: <Button appearance="outlined">Contact the helpdesk</Button>,
  },
};
