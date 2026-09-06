import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { CookieConsent, type CookieCategory } from "@mosje/design-system";

/**
 * The choice a citizen makes about non-essential cookies.
 *
 * **A notice and a choice are different things, and it tells them apart.** Where
 * every category is `required` there is nothing to consent to, so it renders one
 * acknowledgement — named by `acknowledgeLabel` — instead of "Accept all" and
 * "Reject optional" against an empty set. That is the form the website's banner
 * takes today, because every cookie it sets is strictly necessary. The moment a
 * portal adds analytics, the same component becomes a real choice.
 *
 * **Use it** wherever a surface sets cookies and has to say so.
 *
 * **Do not use it** on a surface that sets none. A banner about nothing teaches
 * people to dismiss consent controls without reading them.
 *
 * `categories` are what the site actually sets, each `{ id, label, description,
 * required? }`. `accepted` are the ids already agreed to and `onDecide` receives
 * the new set — required ids are always included, whatever the reader chose.
 * `description` is the paragraph above the choices and `policyHref` the full
 * statement; both are required, because a consent control with neither is not
 * one. `title`, `policyLabel`, `acceptAllLabel`, `rejectLabel` and `saveLabel`
 * name the rest.
 *
 * Every rule here answers a dark pattern. Rejecting is a button of equal weight
 * beside accepting, in the first view — not two clicks away through a settings
 * panel. Optional categories start OFF and there is no prop to pre-tick them. A
 * required category shows as required rather than as a toggle that cannot move.
 * And it is a region at the foot of the page rather than a modal: a citizen
 * looking for a scheme deadline should not have to answer a cookie question
 * first.
 *
 * `placement` is `"fixed"` by default — pinned to the foot of the viewport, and
 * carrying `data-sa-corner-occupant` so the accessibility widget and the chat
 * launcher lift clear of it. It does not read the corner rail itself: consent
 * comes before a chat widget on a government site, so the bar stays put and the
 * widgets move. `"inline"` renders it in the flow, which is what these
 * specimens use.
 */
const meta = {
  title: "Feedback/CookieConsent",
  component: CookieConsent,
  parameters: { layout: "padded" },
} satisfies Meta<typeof CookieConsent>;

export default meta;
type Story = StoryObj<typeof meta>;

const CATEGORIES: CookieCategory[] = [
  {
    id: "essential",
    label: "Essential cookies",
    description: "Keep you signed in and remember the language you chose. The site does not work without them.",
    required: true,
  },
  {
    id: "analytics",
    label: "Usage measurement",
    description: "Count how many people reach each page, so the Department can see which pages are hard to find.",
  },
];

const DESCRIPTION =
  "The Department uses cookies to keep this site working and, with your permission, to count how many people use each page. No cookie on this site identifies you.";

function Controlled(props: Partial<React.ComponentProps<typeof CookieConsent>>) {
  const [accepted, setAccepted] = React.useState<string[]>(["essential"]);
  return (
    <CookieConsent
      categories={CATEGORIES}
      accepted={accepted}
      onDecide={setAccepted}
      description={DESCRIPTION}
      policyHref="#cookies"
      placement="inline"
      {...props}
    />
  );
}

export const Playground: Story = {
  args: { categories: CATEGORIES, accepted: [], onDecide: () => {}, description: DESCRIPTION, policyHref: "#cookies" },
  render: () => <Controlled />,
};

/**
 * Every category required — the form the website's banner takes. One
 * acknowledgement, because there is nothing to consent to.
 */
export const NoticeOnly: Story = {
  args: { categories: CATEGORIES, accepted: [], onDecide: () => {}, description: DESCRIPTION, policyHref: "#cookies" },
  render: () => (
    <Controlled
      categories={[CATEGORIES[0]!]}
      acknowledgeLabel="Accept and continue"
      description="This website uses essential cookies to keep the site secure and to meet the Government of India's web guidelines. No cookie on this site identifies you."
    />
  ),
};

/** The renamed controls a portal might use, and a third optional category. */
export const ThreeCategories: Story = {
  args: { categories: CATEGORIES, accepted: [], onDecide: () => {}, description: DESCRIPTION, policyHref: "#cookies" },
  render: () => (
    <Controlled
      title="Cookies on the SMILE portal"
      policyLabel="Read the full cookie statement"
      acceptAllLabel="Accept all cookies"
      rejectLabel="Reject optional cookies"
      saveLabel="Save these choices"
      categories={[
        ...CATEGORIES,
        {
          id: "video",
          label: "Embedded video",
          description: "Lets awareness films play in the page. The film's provider sets its own cookies.",
        },
      ]}
    />
  ),
};
