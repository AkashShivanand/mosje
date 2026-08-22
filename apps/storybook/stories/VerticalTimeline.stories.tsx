import type { Meta, StoryObj } from "@storybook/react";
import { VerticalTimeline, VerticalTimelineItem } from "@mosje/design-system";

/**
 * **VerticalTimeline** — dated entries down a single rule, newest first or
 * oldest first as the story requires. `VerticalTimelineItem` is documented
 * here rather than in a story of its own.
 *
 * Use it where the *order* of events is the content: a ministry's milestones,
 * a scheme's history, an application's processing trail. Do not use it for a
 * list that merely happens to have dates on it — a table sorts, filters and
 * scans, and a timeline does none of those. For an application moving through
 * an approval chain reach for `ApprovalTimeline`, which knows about actors and
 * outcomes. Lifecycle: **Stable**.
 *
 * `date` is optional; an item without one still gets its marker, which is what
 * you want for an entry whose date is unknown or not yet set.
 */
const meta = {
  title: "Components/Data display/VerticalTimeline",
  component: VerticalTimeline,
} satisfies Meta<typeof VerticalTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <VerticalTimeline>
      <VerticalTimelineItem title="Ministry established" date="1985">
        <p>
          The Ministry of Welfare is created, carrying the mandate for the welfare of Scheduled
          Castes, Other Backward Classes and persons with disabilities.
        </p>
      </VerticalTimelineItem>
      <VerticalTimelineItem title="Renamed to Social Justice & Empowerment" date="1998">
        <p>The name changes to reflect a shift from welfare to empowerment.</p>
      </VerticalTimelineItem>
      <VerticalTimelineItem title="SAMAVESH launched" date="2026">
        <p>
          A single access mechanism brings thirteen websites and twenty workflow portals under
          one design system.
        </p>
      </VerticalTimelineItem>
    </VerticalTimeline>
  ),
};

/** An entry with no date — the marker still anchors it to the rule. */
export const WithoutDate: Story = {
  render: () => (
    <VerticalTimeline>
      <VerticalTimelineItem title="Scheme guidelines under revision">
        <p>Publication date to be announced.</p>
      </VerticalTimelineItem>
    </VerticalTimeline>
  ),
};
