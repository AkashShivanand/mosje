import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { IconButton } from "./icon-button";

const html = (el: React.ReactElement): string => renderToStaticMarkup(el);

describe("IconButton — loading", () => {
  it("draws the spinner in place of the glyph, and keeps the name", () => {
    const out = html(<IconButton aria-label="Refresh the list" loading icon={<span data-glyph="refresh" />} />);
    expect(out).toContain("ds-btn__spinner");
    expect(out).not.toContain("data-glyph");
    expect(out).toContain('aria-label="Refresh the list"');
    expect(out).toContain('aria-busy="true"');
  });
  it("draws the glyph when not loading", () => {
    expect(html(<IconButton aria-label="Edit" icon={<span data-glyph="edit" />} />)).toContain("data-glyph");
  });
});
