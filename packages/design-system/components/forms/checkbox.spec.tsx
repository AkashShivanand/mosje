import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Checkbox } from "./checkbox";

const html = (el: React.ReactElement): string => renderToStaticMarkup(el);

describe("Checkbox", () => {
  it("never sets aria-checked on the native input", () => {
    expect(html(<Checkbox label="A" checked indeterminate onChange={() => {}} />)).not.toContain("aria-checked");
  });

  it("reports data-state for every combination, and indeterminate does not force checked", () => {
    expect(html(<Checkbox label="A" />)).toContain('data-state="unchecked"');
    expect(html(<Checkbox label="A" checked onChange={() => {}} />)).toContain('data-state="checked"');
    const mixed = html(<Checkbox label="A" indeterminate />);
    expect(mixed).toContain('data-state="indeterminate"');
    expect(mixed).not.toContain('checked=""');
  });

  it("links description and error through aria-describedby and keeps the caller's ids", () => {
    const out = html(
      <Checkbox id="c" label="A" description="More" error="Tick the box to continue" aria-describedby="outer" />,
    );
    expect(out).toContain('aria-describedby="c-description c-error outer"');
    expect(out).toContain('id="c-description"');
    expect(out).toMatch(/<p id="c-error" role="alert"/);
    expect(out).toContain('aria-invalid="true"');
  });

  it("invalid alone paints the state without an alert", () => {
    const out = html(<Checkbox label="A" invalid />);
    expect(out).toContain('aria-invalid="true"');
    expect(out).not.toContain('role="alert"');
  });

  it("readOnly is announced and is NOT disabled", () => {
    const out = html(<Checkbox label="A" readOnly />);
    expect(out).toContain('aria-readonly="true"');
    expect(out).not.toContain("disabled");
  });

  it("required renders the marker, the native attribute and aria-required", () => {
    const out = html(<Checkbox label="A" required />);
    expect(out).toContain('required=""');
    expect(out).toContain('aria-required="true"');
    expect(out).toContain("*");
  });

  it("hideLabel keeps the label linked and only hides it", () => {
    const out = html(<Checkbox id="c" label="Select row" hideLabel />);
    expect(out).toMatch(/<label for="c" class="ds-selection__label ds-sr-only">Select row/);
  });

  it("size, placement and variant reach the root as data attributes", () => {
    const out = html(<Checkbox label="A" size="lg" labelPlacement="start" variant="card" />);
    expect(out).toContain('data-size="lg"');
    expect(out).toContain('data-label-placement="start"');
    expect(out).toContain('data-variant="card"');
    expect(out).toContain("ds-selection--card");
  });

  it("card description sits OUTSIDE the label, so it is not part of the name", () => {
    const out = html(<Checkbox id="c" label="Title" description="Explains" variant="card" />);
    const label = out.match(/<label[^>]*>([\s\S]*?)<\/label>/)?.[1] ?? "";
    expect(label).not.toContain("Explains");
    expect(out).toContain('id="c-description"');
  });

  it("detailed card: meta joins aria-describedby, sits outside the label, and the layout reaches the root", () => {
    const out = html(<Checkbox id="c" label="NAPDDR" description="Prevention and treatment." meta="Target: Persons affected by substance abuse" variant="card" cardLayout="detailed" />);
    expect(out).toContain('data-card-layout="detailed"');
    expect(out).toContain("ds-selection--card-detailed");
    expect(out).toContain('aria-describedby="c-description c-meta"');
    const label = out.match(/<label[^>]*>([\s\S]*?)<\/label>/)?.[1] ?? "";
    expect(label).not.toContain("Target:");
  });

  it("meta is ignored outside the card variant, and compact is the default card layout", () => {
    expect(html(<Checkbox label="A" meta="x" />)).not.toContain("-meta");
    expect(html(<Checkbox label="A" variant="card" />)).toContain('data-card-layout="compact"');
  });

  it("uncontrolled: defaultChecked seeds the state", () => {
    expect(html(<Checkbox label="A" defaultChecked />)).toContain('data-state="checked"');
  });
});
