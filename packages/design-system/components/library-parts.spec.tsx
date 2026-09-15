import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ChartCard } from "./dashboard/chart-card";
import { BulkActionsBar } from "./data-display/bulk-actions-bar";
import { MetricCard } from "./data-display/metric-card";
import { VideoTile } from "./data-display/video-tile";
import { Chatbot } from "./feedback/chatbot";
import { FeedbackWidget } from "./feedback/feedback-widget";
import { DateRangePicker } from "./forms/date-range-picker";
import { TimePicker } from "./forms/time-picker";

/**
 * EACH OF THESE COMPONENTS RENDERS THE LIBRARY PART, NOT A COPY OF IT.
 *
 * Their Figma masters instance Button, IconButton, Chip and Badge, and until
 * 2026-09-14 the code drew its own element in each slot — a `<button>` with a
 * stroke and a label, a pill span with a hand-set fill. A copy looks right on
 * the day it is written and then drifts from the part it imitates. These specs
 * pin the class each library part stamps, so a component that goes back to
 * drawing its own control fails here rather than in a review.
 */
const html = (el: React.ReactElement): string => renderToStaticMarkup(el);
const noop = () => {};

describe("design-system components use the library parts", () => {
  it("FeedbackWidget: the verdicts are outlined neutral Buttons that carry aria-pressed", () => {
    const out = html(<FeedbackWidget onSubmit={noop} />);
    expect(out).toMatch(/<button[^>]*class="ds-btn ds-btn--neutral ds-btn--outlined ds-btn--md[^"]*"[^>]*aria-pressed="false"[^>]*>Yes/);
    expect(out).not.toContain("ds-feedback__verdict--chosen");
  });

  it("BulkActionsBar: actions are small outlined Buttons, a danger action is danger, Clear is a text Button", () => {
    const out = html(
      <BulkActionsBar
        count={2}
        noun="application"
        actions={[
          { id: "return", label: "Return for correction", tone: "warning" },
          { id: "reject", label: "Reject", tone: "danger" },
        ]}
        onAction={noop}
        onClear={noop}
      />,
    );
    expect(out).toMatch(/class="ds-btn ds-btn--neutral ds-btn--outlined ds-btn--sm[^"]*"[^>]*>Return for correction/);
    expect(out).toMatch(/class="ds-btn ds-btn--danger ds-btn--outlined ds-btn--sm[^"]*"[^>]*>Reject/);
    expect(out).toMatch(/class="ds-btn ds-btn--neutral ds-btn--text ds-btn--sm[^"]*"[^>]*>Clear selection/);
  });

  it("ChartCard: the retry in a failed card is a small outlined Button", () => {
    const out = html(<ChartCard title="Applications Cleared" state="error" onRetry={noop}>x</ChartCard>);
    expect(out).toMatch(/class="ds-btn ds-btn--neutral ds-btn--outlined ds-btn--sm[^"]*"[^>]*>Try again/);
  });

  it("TimePicker: the trigger is an outlined IconButton with the clock glyph", () => {
    const out = html(<TimePicker label="Appointment time" value="14:30" onChange={noop} />);
    expect(out).toMatch(/class="ds-btn ds-btn--neutral ds-btn--outlined ds-btn--md ds-icon-btn[^"]*ds-timepicker__trigger"/);
    expect(out).toContain(">schedule<");
    expect(out).not.toContain("&#9711;");
  });

  it("DateRangePicker: each quick period is a Chip, and the active one is selected and pressed", () => {
    const out = html(
      <DateRangePicker
        label="Period"
        value={{ from: "2026-07-01", to: "2026-09-30" }}
        onChange={noop}
        presets={[
          { id: "30", label: "Last 30 days", from: "2026-08-15", to: "2026-09-14" },
          { id: "q", label: "This quarter", from: "2026-07-01", to: "2026-09-30" },
        ]}
      />,
    );
    expect(out).toMatch(/class="ds-chip ds-chip--md ds-chip--interactive"[^>]*aria-pressed="false"[^>]*><span class="ds-chip__label">Last 30 days/);
    expect(out).toMatch(/class="ds-chip ds-chip--md ds-chip--selected ds-chip--interactive"[^>]*aria-pressed="true"[^>]*><span class="ds-chip__label">This quarter/);
  });

  it("Chatbot: a quick reply is a Chip announced as a button, never as a pressed toggle", () => {
    const out = html(
      <Chatbot placement="inline" defaultOpen messages={[]} quickReplies={[{ id: "find", label: "Find a scheme" }]} />,
    );
    const reply = out.match(/<div[^>]*class="ds-chip[^"]*ds-chatbot__reply"[^>]*>/)?.[0] ?? "";
    expect(reply).toContain('role="button"');
    expect(reply).not.toContain("aria-pressed");
  });

  it("MetricCard: the change pill and the status are Badges", () => {
    const out = html(
      <MetricCard
        label="Hotspots Covered"
        value="10.2%"
        changeValue="12.4%"
        changeDirection="up"
        changeLabel="vs last year"
        status={{ label: "Below target", tone: "danger" }}
      />,
    );
    expect(out).toMatch(/class="ds-badge ds-badge--success ds-badge--sm[^"]*ds-metric-card__pill"/);
    expect(out).toMatch(/class="ds-badge ds-badge--danger ds-badge--sm[^"]*ds-metric-card__status"/);
  });

  it("VideoTile: the state word is a Badge, and live carries its dot", () => {
    const live = html(<VideoTile label="Dormitory corridor" state="live" src="/x.mp4" />);
    expect(live).toMatch(/class="ds-badge ds-badge--danger ds-badge--sm[^"]*ds-video__badge is-live"/);
    const connecting = html(<VideoTile label="Kitchen" state="connecting" />);
    expect(connecting).toMatch(/class="ds-badge ds-badge--warning ds-badge--sm[^"]*ds-video__badge is-connecting"/);
  });
});
