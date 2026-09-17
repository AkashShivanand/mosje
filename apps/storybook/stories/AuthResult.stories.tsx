import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthHelpLine, AuthResult, Button } from "@mosje/design-system";

/**
 * The end of an authentication journey: a mark, a heading, a sentence and the
 * way onward. `success` and `notice` came with password recovery; `warning`
 * and `error` were added for E-Anudaan's NGO-DARPAN return states.
 *
 * `warning` is an outcome the reader can recover from on this page, so it
 * carries a retry. `error` is one this page cannot resolve.
 */
const meta = {
  title: "Components/Auth/AuthResult",
  component: AuthResult,
  args: { heading: "Reset Link Sent", headingLevel: 2 },
  argTypes: { status: { control: "inline-radio", options: ["success", "notice", "warning", "error"] } },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "24rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuthResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    status: "success",
    heading: "Registration Request Submitted",
    description: "The organisation can sign in with NGO-DARPAN once the request is approved.",
    action: <AuthHelpLine href="#">Back to Login</AuthHelpLine>,
  },
};

export const Notice: Story = {
  args: {
    status: "notice",
    icon: "schedule",
    heading: "Sign-In Request Expired",
    description: "This sign-in request is no longer valid. Start again to continue.",
    action: <Button fullWidth>Sign In with NGO-DARPAN</Button>,
  },
};

/** `announce` makes the result a live region — for a result that REPLACES a form on the same route. */
export const Warning: Story = {
  args: {
    status: "warning",
    announce: true,
    heading: "NGO-DARPAN Is Not Responding",
    description:
      "The sign-in could not be completed because NGO-DARPAN did not respond. Try again in a few minutes, or sign in with your username and password.",
    action: (
      <>
        <Button fullWidth>Try Again</Button>
        <Button appearance="outlined" fullWidth>
          Sign In with Username and Password
        </Button>
      </>
    ),
  },
};

export const ErrorOutcome: Story = {
  args: {
    status: "error",
    heading: "NGO-DARPAN Registration Inactive",
    description:
      "E-Anudaan accepts sign-in only from organisations with an active registration. Renew the registration on NGO-DARPAN, then sign in again.",
    action: (
      <Button appearance="outlined" fullWidth>
        Back to Login
      </Button>
    ),
  },
};
