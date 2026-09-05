import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Radio } from "./radio";

const html = (el: React.ReactElement): string => renderToStaticMarkup(el);

describe("Radio", () => {
  it("passes name and value to the native input and reports data-state", () => {
    const out = html(<Radio name="cat" value="sc" label="Scheduled Caste" checked onChange={() => {}} />);
    expect(out).toContain('name="cat"');
    expect(out).toContain('value="sc"');
    expect(out).toContain('data-state="checked"');
    expect(out).not.toContain("aria-checked");
  });

  it("links the description through aria-describedby in both variants, outside the label", () => {
    for (const variant of ["default", "card"] as const) {
      const out = html(<Radio id="r" name="n" value="v" label="Title" description="Explains" variant={variant} />);
      expect(out).toContain('aria-describedby="r-description"');
      const label = out.match(/<label[^>]*>([\s\S]*?)<\/label>/)?.[1] ?? "";
      expect(label).not.toContain("Explains");
    }
  });

  it("required, invalid and size are expressed as on Checkbox; readOnly carries NO aria-readonly (not permitted on role radio)", () => {
    const out = html(<Radio name="n" value="v" label="A" readOnly required invalid size="sm" />);
    expect(out).not.toContain("aria-readonly");
    expect(out).toContain('data-readonly="true"');
    expect(out).toContain('aria-required="true"');
    expect(out).toContain('aria-invalid="true"');
    expect(out).toContain('data-size="sm"');
    expect(out).not.toContain("disabled");
  });

  it("detailed card: meta joins aria-describedby after the description, sits outside the label, and the layout reaches the root", () => {
    const out = html(
      <Radio id="r" name="scheme" value="napddr" label="NAPDDR" description="Prevention and treatment." meta="Target: Persons affected by substance abuse" variant="card" cardLayout="detailed" />,
    );
    expect(out).toContain('data-card-layout="detailed"');
    expect(out).toContain('aria-describedby="r-description r-meta"');
    expect(out).toMatch(/<span[^>]*id="r-meta"[^>]*>Target: Persons affected by substance abuse<\/span>/);
    expect(out).not.toMatch(/<label[^>]*>[^<]*Target:/);
    expect(html(<Radio name="s" value="a" label="A" meta="x" />)).not.toContain("-meta");
  });

  it("has no error prop: the error belongs to the group", () => {
    // @ts-expect-error — error is not a RadioProps member
    const out = html(<Radio name="n" value="v" label="A" error="x" />);
    expect(out).not.toContain('role="alert"');
  });
});
