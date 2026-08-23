import type { Meta, StoryObj } from "@storybook/react";
import { VerticalTimeline, VerticalTimelineItem } from "@mosje/design-system";

/**
 * **VerticalTimeline / VerticalTimelineItem** — a narrative chronology, for
 * telling the story of how something came to be.
 *
 * @covers VerticalTimeline, VerticalTimelineItem
 *
 * **The estate has two timelines and they are not interchangeable.** This one
 * is *editorial*: dated events on a public information page, written as prose,
 * where the reader is learning history. `ApprovalTimeline` is a *record*: the
 * audit trail of one application moving through Block → District → State, where
 * marker colour encodes the action and a returned step must never be dropped.
 * If the thing you are rendering has a status, an actor and consequences, it is
 * ApprovalTimeline. If it is something that happened and is being recounted,
 * it is this.
 *
 * The estate's case is the About Us page: eight events from the 1985–86
 * bifurcation of the Ministry of Welfare to the 2012 split into DoSJE and
 * DEPwD. That is what this component is shaped for — a handful of entries,
 * each with a paragraph.
 *
 * **When NOT to reach for it.** Not for a process the reader is currently
 * moving through — that is `Stepper`, which shows where you *are*. Not for
 * thirty entries: past roughly a dozen the vertical rule becomes a long walk
 * and a table sorts, filters and scans better. And not for undated items,
 * because `date` is what makes a timeline a timeline; without it you have a
 * list of cards with a decorative line down the side.
 *
 * **`date` is free text, deliberately.** Real government chronology does not
 * fit an ISO date: the estate ships "1985-1986", "May 1998" and "11th Five Year
 * Plan Period" as legitimate entries. It renders as a pill beside the title, so
 * keep it short — a long date wraps and pushes the title around.
 *
 * **`title` renders as an `h3`, fixed.** It suits a section already introduced
 * by an `h2`, which is how About Us uses it. There is no prop to change the
 * level, so a page whose outline needs something else will produce a heading
 * skip — worth knowing before reaching for it inside a deeper section.
 *
 * Items are `div`s rather than an ordered list, so the chronology is conveyed
 * visually and by the dates, not structurally.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Data Display/VerticalTimeline",
  component: VerticalTimelineItem,
  args: {
    title: "Renamed as Ministry of Social Justice & Empowerment",
    date: "May 1998",
    children:
      "Subsequently, the name of the Ministry was changed to the Ministry of Social Justice & Empowerment in May, 1998.",
  },
  argTypes: {
    title: { control: "text" },
    date: { control: "text" },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof VerticalTimelineItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single event, so the marker, the date pill and the card are visible alone. */
export const Item: Story = {
  render: (args) => (
    <VerticalTimeline>
      <VerticalTimelineItem {...args} />
    </VerticalTimeline>
  ),
};

const HISTORY = [
  {
    title: "Formation of the Ministry of Welfare",
    date: "1985-1986",
    body: "The erstwhile Ministry of Welfare was bifurcated into the Department of Women and Child Development and the Department of Welfare. The Scheduled Castes Development, Tribal Development and Minorities and Backward Classes Welfare Divisions moved across from the Ministry of Home Affairs.",
  },
  {
    title: "Renamed as Ministry of Social Justice & Empowerment",
    date: "May 1998",
    body: "The name of the Ministry was changed to the Ministry of Social Justice & Empowerment.",
  },
  {
    title: "Formation of the Ministry of Tribal Affairs",
    date: "October 1999",
    body: "The Tribal Development Division moved out to form a separate Ministry of Tribal Affairs.",
  },
  {
    title: "Recognition of the need for a dedicated Disability Department",
    date: "11th Five Year Plan Period",
    body: "To facilitate the inclusion of persons with disabilities into the mainstream, an announcement was made regarding the creation of a separate Department of Disability Affairs.",
  },
  {
    title: "Creation of two Departments under the Ministry",
    date: "May 12, 2012",
    body: "Two distinct departments were established by notification: the Department of Social Justice & Empowerment (DoSJE) and the Department of Empowerment of Persons with Disabilities (DEPwD).",
  },
];

/**
 * The estate's own chronology. Note the `date` values — a year range, a month,
 * and a plan period. This is why the prop is free text rather than a date.
 */
export const DepartmentHistory: Story = {
  render: () => (
    <VerticalTimeline>
      {HISTORY.map((e) => (
        <VerticalTimelineItem key={e.title} title={e.title} date={e.date}>
          {e.body}
        </VerticalTimelineItem>
      ))}
    </VerticalTimeline>
  ),
};

/**
 * `date` omitted. The pill disappears and the entries still stack, but nothing
 * now says *when* — which is the point of the component. If your data looks
 * like this, you probably want a plain list of cards.
 */
export const WithoutDates: Story = {
  render: () => (
    <VerticalTimeline>
      {HISTORY.slice(0, 3).map((e) => (
        <VerticalTimelineItem key={e.title} title={e.title}>
          {e.body}
        </VerticalTimelineItem>
      ))}
    </VerticalTimeline>
  ),
};
