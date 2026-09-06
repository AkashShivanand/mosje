// url=<SAMAVESH>?node-id=57600-48770
// source=packages/design-system/components/data-display/event-list.tsx
// component=EventList
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Figma publishes the ROW; code publishes the LIST. This template emits a
 * one-event list — the container is not a Figma master, because a container of
 * N rows tells a designer nothing they cannot see by stacking rows.
 *
 * CommentThread and NotificationCentre are composed from this same row. If you
 * are reaching for a second row style for either, that is the defect this
 * component exists to prevent.
 */
const tone = instance.getEnum("Tone", {
  Neutral: "neutral",
  Info: "info",
  Success: "success",
  Warning: "warning",
  Danger: "danger",
});

const note = instance.getEnum("Note", {
  true: "with",
  false: "without",
});

const notePart =
  note === "with"
    ? `, note: "The income certificate is issued by the block office."`
    : "";

export default {
  example: figma.code`
    <EventList
      label="Case history"
      events={[
        {
          id: "3",
          at: "2026-09-02T11:05:00+05:30",
          actor: "R. Krishnan",
          actorRole: "District Nodal Officer",
          action: "Returned for correction",
          subject: "Application 2026/PMS/01284",
          tone: "${tone}"${notePart},
        },
      ]}
    />
  `,
  imports: ['import { EventList } from "@mosje/design-system"'],
  id: "event-list",
  metadata: { nestable: false },
};
