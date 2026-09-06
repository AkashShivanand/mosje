import type { Meta, StoryObj } from "@storybook/react";
import { BackToTop } from "@mosje/design-system";

/**
 * **Back to Top** — the control that returns a reader to the top of a long page.
 * One MIS report on this estate is 12,796px tall; without it, getting back to
 * the filters is a scroll a citizen on a phone will not make.
 *
 * **It sits at the top of the corner stack, and that is not arbitrary.** The
 * rail orders by permanence: the accessibility widget anchors the corner because
 * it is statutory and never goes away, the chat launcher sits above it, and this
 * — which appears and disappears as the reader scrolls — sits above both.
 * Putting it at the bottom would slide the two controls that most need to be
 * findable by muscle memory up and down the page on every scroll.
 *
 * **It moves focus, not just the scroll position.** Scrolling to the top leaves
 * a keyboard reader's focus where it was, half a page down, so the next Tab
 * takes them back to where they started and the button appears to have done
 * nothing. This moves focus to the page's `main` landmark as well.
 *
 * It carries `data-sa-corner-occupant`, which is how the rail knows it is there
 * — added with the control rather than after somebody reports an overlap — and
 * it reads its offset from `--sa-corner-rail-bottom` rather than hard-coding it.
 *
 * **It renders nothing until the reader has scrolled past `showAfter`.** A
 * control that does nothing is a control in the way.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Utilities/Back to Top",
  component: BackToTop,
  args: { showAfter: 200, label: "Back to top" },
  argTypes: {
    showAfter: { control: { type: "number", min: 0, max: 2000, step: 100 } },
    label: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div>
        <p style={{ maxWidth: 480 }}>
          Scroll this frame. The control appears once you pass the threshold and
          is absent from the DOM before that.
        </p>
        <div style={{ height: 1600 }} />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BackToTop>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Appears after 200px here so the story is short. The estate default is 800. */
export const Playground: Story = {};

/** The estate default — a page has to be genuinely long before the control earns its corner. */
export const EstateDefault: Story = { args: { showAfter: 800 } };
