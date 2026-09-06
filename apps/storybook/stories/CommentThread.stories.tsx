import type { Meta, StoryObj } from "@storybook/react";
import { CommentThread, type ThreadComment } from "@mosje/design-system";

/**
 * The remarks officers leave on a case — NHAPOA clarifications, NOS scrutiny
 * notes, anything where one officer has to tell another why.
 *
 * **Use it** where a case carries a conversation between officers, or between an
 * officer and an applicant.
 *
 * **Do not use it** for a public comment section. Nothing on this estate has one,
 * and a thread with no moderation on a government page is a different product.
 *
 * It is `EventList` plus a composer, so a remark and an audit entry render
 * identically and a reader moving between the two screens is not learning a
 * second layout.
 *
 * `comments` are **oldest first** — a thread is a conversation and is read
 * downward, where a log is newest-first. Each carries `id`, `at`, `body` and
 * optionally `author`, `authorRole` and `unread`.
 *
 * `label` names the thread and is required. `onSubmit` receives the trimmed
 * text; without it the composer is not rendered at all. `composerLabel` and
 * `submitLabel` name the field and the button. `maxLength` caps a remark and the
 * remaining count appears only from 80% of it onward — from the first keystroke
 * it is a number nobody needs and everybody reads. `emptyText` is the answer
 * when there are no remarks.
 *
 * `closedReason` replaces the composer with a sentence. A closed thread that
 * silently hides its box is how a reader concludes the page failed to load.
 *
 * There is no edit control and there will not be one: on a departmental record a
 * remark that can change after another officer has acted on it is not a record.
 * A correction is a new remark.
 */
const meta = {
  title: "Data Display/CommentThread",
  component: CommentThread,
  parameters: { layout: "padded" },
  args: { onSubmit: () => {} },
} satisfies Meta<typeof CommentThread>;

export default meta;
type Story = StoryObj<typeof meta>;

const REMARKS: ThreadComment[] = [
  {
    id: "1",
    at: "2026-09-01T10:12:00+05:30",
    author: "R. Krishnan",
    authorRole: "District Nodal Officer",
    body: "The income certificate attached is issued by the block office. Scheme guidelines require one issued by the tehsildar.",
  },
  {
    id: "2",
    at: "2026-09-02T16:40:00+05:30",
    author: "Meena Kumari",
    authorRole: "Applicant",
    body: "The tehsildar's office has issued the certificate today. I have uploaded it in place of the earlier one.",
  },
];

export const Playground: Story = {
  args: { comments: REMARKS, label: "Remarks on this application" },
};

/** No remarks yet — the answer is written, not left blank. */
export const Empty: Story = {
  args: { comments: [], label: "Remarks on this application" },
};

/**
 * A decided case takes no further remarks, and the thread says so where the box
 * used to be.
 */
export const Closed: Story = {
  args: {
    comments: REMARKS,
    label: "Remarks on this application",
    closedReason: "This application was approved on 4 September 2026. Remarks are closed.",
  },
};

/** A short cap, to show the counter appearing only in the last fifth. */
export const ShortLimit: Story = {
  args: {
    comments: REMARKS,
    label: "Remarks on this application",
    maxLength: 120,
    composerLabel: "Add a scrutiny remark",
    submitLabel: "Record remark",
  },
};
