import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { SchedulePlayground } from "./schedule-playground";

export const metadata: Metadata = {
  title: "Schedule Grid — Design System",
  description:
    "A timetable — Garima Greh's daily programme, an attendance week, a district's camp calendar. It is a real table, because every entry means something only in relation to its day and its time.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      'Read from the rendered DOM on this page: a <table> with a <caption>, column headers scope="col" carrying the day and its date, and row headers scope="row" carrying the time slot. An entry is therefore announced with both of its coordinates.',
    description: "The two dimensions of a schedule are in the markup, not only in the layout.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      'The horizontally scrolling container is role="region" with an accessible name and tabIndex=0, so a keyboard user can focus it and scroll with the arrow keys. Verified in a browser at a narrow width.',
    description: "A wide table can be scrolled without a pointer.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    status: "verified",
    evidence:
      "Tone sets only the leading rule of an entry; the title and detail carry the meaning in words. Read from the computed style: an entry's background is the same in every tone.",
    description: "No entry depends on its colour to be understood.",
  },
];

export default function ScheduleGridPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Schedule Grid"
      status="Stable"
      summary="A timetable. It is a real table, because every entry means something only in relation to its day and its time — built from divs, a screen reader reads a stream of session titles with no way to say which day any of them is in."
      figma={{ absent: "Master pending in the SAMAVESH library — tracked on the component record." }}
      specimen={<SchedulePlayground />}
      propsFrom="ScheduleGridProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Entries mean something only in relation to a day and a time — a residence's daily programme, an attendance week.",
          "The reader compares across days as well as down the day.",
        ],
        avoid: [
          "Dated events with no time structure. That is a List or an Event List.",
          "One day's agenda. A single column is a list, and reads better as one.",
        ],
      }}
      related={[
        { label: "Event List", href: "/design-system/components/data-display/event-list", reason: "for dated entries with no grid" },
        { label: "Data Table", href: "/design-system/components/data-display/data-table", reason: "when the data is rows rather than a grid" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-table">
            <h2 id="cdp-table" className="cdp__h2">A Real Table Is the Whole Design</h2>
            <p>
              A schedule is two-dimensional data. As a table with row and column headers, an entry
              is announced as &ldquo;Monday, 09:00 to 10:30, Literacy class&rdquo;. Built from divs
              it is a stream of session titles, and the day and hour — the only things that make
              them mean anything — are lost to the reader who cannot see the grid.
            </p>
            <CodeBlock>{`import { ScheduleGrid } from "@mosje/design-system";

<ScheduleGrid
  caption="Daily programme, week of 1 September 2026"
  columns={[{ id: "mon", label: "Monday", sublabel: "1 September" }]}
  rows={[{ id: "s1", label: "09:00", sublabel: "to 10:30" }]}
  entries={[
    { id: "e1", columnId: "mon", rowId: "s1", title: "Literacy class", detail: "Common room" },
  ]}
/>`}</CodeBlock>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-caption">
            <h2 id="cdp-caption" className="cdp__h2">The Caption Is Visible and Required</h2>
            <p>
              &ldquo;Daily programme&rdquo; and &ldquo;Attendance, week of 1 September&rdquo; are
              different tables that look identical. A grid with no title is a page of words a reader
              has to work out the purpose of.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-empty">
            <h2 id="cdp-empty" className="cdp__h2">An Empty Cell Is Empty</h2>
            <p>
              No dash, no em rule, nothing to read. There is genuinely nothing scheduled, and a
              screen reader announcing a dash forty times is noise. An empty <em>schedule</em>, on
              the other hand, says so in a sentence rather than drawing a grid of nothing.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-scroll">
            <h2 id="cdp-scroll" className="cdp__h2">It Scrolls in Its Own Region, Not Inside a Card</h2>
            <p>
              Seven columns do not fit a phone. The scroll sits on a labelled region with a tab
              stop, which is what makes a horizontally scrolling table operable rather than merely
              visible — a scrolling box with no tab stop cannot be reached without a pointer.
            </p>
          </section>
        </>
      }
    />
  );
}
