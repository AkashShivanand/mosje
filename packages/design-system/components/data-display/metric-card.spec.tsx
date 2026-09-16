import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MetricCard } from "./metric-card";

const html = (el: React.ReactElement): string => renderToStaticMarkup(el);

/**
 * A figure people act on. `ListRow` states the rule this follows: a thing is a LINK when it goes
 * somewhere and a BUTTON when it does something here, and it is never both. The state has to be
 * announced as well as tinted — an officer using a screen reader cannot see which tile is on.
 */
describe("MetricCard as a control", () => {
  it("stays a plain box when it neither goes nor does anything", () => {
    const out = html(<MetricCard label="New Projects" value="8" />);
    expect(out).toContain("<div");
    expect(out).not.toContain("ds-metric-card--interactive");
  });

  it("is a button when it does something here, and says whether it is the chosen one", () => {
    const off = html(<MetricCard label="New Projects" value="8" onSelect={() => {}} />);
    expect(off).toContain("<button");
    expect(off).toContain('type="button"');
    expect(off).toContain('aria-pressed="false"');
    expect(off).toContain("ds-metric-card--interactive");
    expect(off).not.toContain("ds-metric-card--selected");

    const on = html(<MetricCard label="New Projects" value="8" onSelect={() => {}} selected />);
    expect(on).toContain('aria-pressed="true"');
    expect(on).toContain("ds-metric-card--selected");
  });

  it("is a link when it goes somewhere, and marks the current one", () => {
    const out = html(<MetricCard label="Sanctioned" value="37" href="/register" selected />);
    expect(out).toContain("<a");
    expect(out).toContain('href="/register"');
    expect(out).toContain('aria-current="true"');
    expect(out).not.toContain("aria-pressed");
  });

  it("href wins over onSelect, so a tile is never both", () => {
    const out = html(<MetricCard label="Sanctioned" value="37" href="/register" onSelect={() => {}} />);
    expect(out).toContain("<a");
    expect(out).not.toContain("<button");
  });

  it("keeps the same accessible name whichever element it renders", () => {
    const name = 'aria-label="New Projects: 8"';
    expect(html(<MetricCard label="New Projects" value="8" />)).toContain(name);
    expect(html(<MetricCard label="New Projects" value="8" onSelect={() => {}} />)).toContain(name);
    expect(html(<MetricCard label="New Projects" value="8" href="/x" />)).toContain(name);
  });
});
