import type { Meta, StoryObj } from "@storybook/react";
import { BiometricCapture } from "@mosje/design-system";

const CONSENT =
  "Your fingerprint is taken to verify your identity against the Aadhaar record and is not stored by the department.";

/**
 * **Biometric Capture** — the capture surface for a fingerprint, an iris scan
 * or a photograph: the enrolment step in SMILE and the Transgender portal.
 *
 * **It draws states; it never touches a device.** Reading a scanner is the
 * portal's job, through whatever RD service the centre has, and that varies per
 * deployment. What is shared is the screen a citizen looks at while it happens,
 * and the states it has to have: waiting, reading, done, failed, and no reader
 * at all.
 *
 * **`unavailable` is a designed state, not an error.** A centre whose reader is
 * unplugged, and a citizen who opened the page on a phone, must be told plainly
 * and sent to the alternative — not shown a button that will never work.
 *
 * **`fallbackHref` is required, and that is deliberate.** Biometric capture
 * fails for worn fingerprints, for cataracts, for manual labourers and for the
 * elderly — which is to say it fails most often for exactly the citizens these
 * schemes exist to serve. A screen with no way past it does not stop the
 * department; it stops the application. WCAG 3.3.8 asks the same question from
 * the other direction: there must be a route that does not depend on one bodily
 * capability. The alternative is offered in *every* state, including success,
 * because hiding the way out until something fails makes failure the only way to
 * find it.
 *
 * The consent sentence is shown **before** capture, not after: under the DPDP
 * Act 2023 a biometric is personal data, and the citizen is told what is taken
 * and why before it is taken.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Forms/Biometric Capture",
  component: BiometricCapture,
  args: {
    modality: "fingerprint",
    state: "idle",
    onCapture: () => {},
    subject: "Sunita Devi",
    fallbackHref: "/portals/tg/verify/manual",
    fallbackLabel: "Verify with documents instead",
    consent: CONSENT,
  },
  argTypes: {
    modality: { control: "inline-radio", options: ["fingerprint", "iris", "face"] },
    state: {
      control: "inline-radio",
      options: ["idle", "capturing", "captured", "failed", "unavailable"],
    },
    subject: { control: "text" },
    failureReason: { control: "text" },
    fallbackHref: { control: "text" },
    fallbackLabel: { control: "text" },
    consent: { control: "text" },
    onCapture: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BiometricCapture>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Waiting for the citizen to place a finger. The consent sentence is already visible. */
export const Playground: Story = {};

/** Reading. The pulse says the device is still working; under reduced motion it holds steady. */
export const Capturing: Story = { args: { state: "capturing" } };

/** Done. The consent sentence goes; the alternative route stays. */
export const Captured: Story = { args: { state: "captured" } };

/**
 * Failed, with a reason a person at the counter can act on. "The finger was
 * lifted too early" is actionable; a device error code is not.
 */
export const Failed: Story = {
  args: { state: "failed", failureReason: "The finger was lifted too early. Hold it flat until the reader beeps." },
};

/** No reader attached — stated plainly, with no control that could not work. */
export const Unavailable: Story = { args: { state: "unavailable" } };

/** The iris modality, which has its own instruction and its own mark. */
export const Iris: Story = {
  args: {
    modality: "iris",
    consent:
      "Your iris scan is taken to verify your identity against the Aadhaar record and is not stored by the department.",
  },
};
