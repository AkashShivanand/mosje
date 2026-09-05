import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CheckboxGroup, RadioGroup } from "./control-group";

const html = (el: React.ReactElement): string => renderToStaticMarkup(el);
const OPTS = [
  { value: "a", label: "A" },
  { value: "b", label: "B", description: "About B" },
];

describe("RadioGroup", () => {
  it("is a fieldset with role=radiogroup carrying aria-invalid, aria-required and aria-describedby", () => {
    const out = html(
      <RadioGroup id="g" legend="Q" name="q" options={OPTS} required hint="H" error="Choose one to continue" />,
    );
    expect(out).toMatch(/<fieldset[^>]*role="radiogroup"/);
    expect(out).toContain('aria-invalid="true"');
    expect(out).toContain('aria-required="true"');
    expect(out).toContain('aria-describedby="g-hint g-error"');
    expect(out).toMatch(/<p id="g-error" role="alert"/);
  });

  it("readOnly is announced on the radiogroup, where ARIA permits it, not on each radio", () => {
    const out = html(<RadioGroup legend="Q" name="q" options={OPTS} readOnly />);
    expect(out).toMatch(/<fieldset[^>]*aria-readonly="true"/);
    expect(out.match(/aria-readonly/g)?.length).toBe(1);
  });

  it("does not invent a selection when value is undefined", () => {
    const out = html(<RadioGroup legend="Q" name="q" options={OPTS} />);
    expect(out).not.toContain('checked=""');
  });

  it("disabled renders a native disabled fieldset; hideLegend keeps a legend", () => {
    const out = html(<RadioGroup legend="Q" name="q" options={OPTS} disabled hideLegend />);
    expect(out).toMatch(/<fieldset[^>]*disabled=""/);
    // The fieldset disables the inputs, but the drawn box reads data-disabled on its root —
    // so the group must pass disabled down, or every option looks enabled while it is not.
    expect(out.match(/data-disabled/g)?.length).toBe(OPTS.length);
    expect(out).toMatch(/<legend class="ds-control-group__legend ds-sr-only">Q/);
  });

  it("reveal is always in the DOM, hidden unless selected, and the input carries aria-controls", () => {
    const opts = [{ value: "a", label: "A", reveal: <p>Follow-up</p> }, { value: "b", label: "B" }];
    const closed = html(<RadioGroup id="g" legend="Q" name="q" options={opts} value="b" />);
    expect(closed).toMatch(/<div id="g-a-reveal" class="ds-control-group__reveal" hidden=""/);
    expect(closed).toContain('aria-controls="g-a-reveal"');
    expect(closed).not.toContain("aria-expanded");
    const open = html(<RadioGroup id="g" legend="Q" name="q" options={opts} value="a" />);
    expect(open).toMatch(/<div id="g-a-reveal" class="ds-control-group__reveal">/);
  });
});

describe("CheckboxGroup", () => {
  it("keeps role=group semantics: no aria-invalid/required on the fieldset, aria-invalid on each input", () => {
    const out = html(<CheckboxGroup id="g" legend="Q" name="q" options={OPTS} required error="Select at least one" />);
    const fieldset = out.match(/<fieldset[^>]*>/)?.[0] ?? "";
    expect(fieldset).not.toContain("role=");
    expect(fieldset).not.toContain("aria-invalid");
    expect(fieldset).not.toContain("aria-required");
    expect(fieldset).toContain('aria-describedby="g-error"');
    expect(out.match(/aria-invalid="true"/g)?.length).toBe(2);
    expect(out).toContain('<span class="ds-sr-only"> (required)</span>');
  });

  it("posts name on every box and honours per-option description", () => {
    const out = html(<CheckboxGroup id="g" legend="Q" name="claims" options={OPTS} />);
    expect(out.match(/name="claims"/g)?.length).toBe(2);
    expect(out).toContain('id="g-b-description"');
  });

  it("renders the divider before an exclusive option and a select-all parent above the options", () => {
    const opts = [...OPTS, { value: "none", label: "None of the above", exclusive: true }];
    const out = html(<CheckboxGroup id="g" legend="Q" options={opts} selectAll="Select all" value={["a"]} />);
    expect(out.indexOf("ds-control-group__select-all")).toBeLessThan(out.indexOf('id="g-a"'));
    expect(out.indexOf("ds-control-group__divider")).toBeGreaterThan(out.indexOf('id="g-b"'));
    expect(out.indexOf("ds-control-group__divider")).toBeLessThan(out.indexOf('id="g-none"'));
    expect(out).toMatch(/id="g-select-all"[\s\S]*?data-state="indeterminate"|data-state="indeterminate"[\s\S]*?id="g-select-all"/);
  });

  it("cardLayout and per-option meta reach every card in a group", () => {
    const opts = [{ value: "a", label: "A", meta: "Target: Senior citizens" }, { value: "b", label: "B" }];
    const out = html(<CheckboxGroup id="g" legend="Q" options={opts} variant="card" cardLayout="detailed" />);
    expect(out.match(/data-card-layout="detailed"/g)?.length).toBe(2);
    expect(out).toContain('id="g-a-meta"');
    expect(out).not.toContain('id="g-b-meta"');
  });

  it("checkbox reveal also reports aria-expanded", () => {
    const opts = [{ value: "a", label: "A", reveal: <p>More</p> }];
    expect(html(<CheckboxGroup legend="Q" options={opts} value={["a"]} />)).toContain('aria-expanded="true"');
    expect(html(<CheckboxGroup legend="Q" options={opts} value={[]} />)).toContain('aria-expanded="false"');
  });
});
