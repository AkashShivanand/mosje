// url=<SAMAVESH>?node-id=57539-1051
// source=packages/design-system/components/feedback/feedback-widget.tsx
// component=FeedbackWidget
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * The four variants are the four steps of one sequence, and the sequence is INTERNAL —
 * the component walks it itself. There is no `state` prop, and adding one would let a
 * page pin the widget open on a step the reader had not reached.
 *
 * So the axis maps to nothing, and that is the correct mapping. What the developer
 * needs from Dev Mode is the question, the acknowledgement and the way out to help.
 */
const state = instance.getEnum("State", {
  Ask: "ask",
  "Comment (yes)": "comment",
  "Comment (no)": "comment",
  Sent: "sent",
});

export default {
  example: figma.code`
    <FeedbackWidget
      question="Was this page helpful?"
      thanks="Thank you. Your answer helps the department improve this page."
      helpHref="/help"
      helpLabel="Get help with an application"
      onSubmit={record}
    />
  `,
  imports: ['import { FeedbackWidget } from "@mosje/design-system"'],
  id: "feedback-widget",
  metadata: { nestable: false },
};
