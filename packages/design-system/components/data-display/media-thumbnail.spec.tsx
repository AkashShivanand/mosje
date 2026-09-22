import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MediaThumbnail } from "./media-thumbnail";

const html = (el: React.ReactElement): string => renderToStaticMarkup(el);

describe("MediaThumbnail", () => {
  it("is a button named by label, with a decorative image", () => {
    const out = html(<MediaThumbnail src="/a.png" label="View 3 training photos" />);
    expect(out).toMatch(/^<button type="button" aria-label="View 3 training photos" class="ds-media-thumb ds-media-thumb--sm"/);
    expect(out).toMatch(/<img class="ds-media-thumb__img" src="\/a.png" alt=""/);
  });

  it("counts the items NOT shown", () => {
    expect(html(<MediaThumbnail src="/a.png" count={3} label="x" />)).toContain(">+2</span>");
    expect(html(<MediaThumbnail src="/a.png" count={1} label="x" />)).not.toContain("ds-media-thumb__count");
  });

  it("draws a play glyph for a video", () => {
    expect(html(<MediaThumbnail src="/a.png" kind="video" label="x" />)).toMatch(/ds-media-thumb--video[\s\S]*play_arrow/);
  });

  it("draws the empty tile, which is not a button", () => {
    const out = html(<MediaThumbnail label="View photos" emptyLabel="No photos uploaded" />);
    expect(out).not.toContain("<button");
    expect(out).toMatch(/<span role="img" aria-label="No photos uploaded" class="ds-media-thumb ds-media-thumb--sm ds-media-thumb--empty"/);
  });
});
