import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

/**
 * The standalone size ramp must climb. It read label-1 / body-1 / body-2 until
 * 2026-09-05, and label-1 and body-2 are both 14px — so `size="sm"` and `size="lg"`
 * rendered identically, found the day the arrangements section drew them side by side.
 */
const css = readFileSync(new URL("./link.css", import.meta.url), "utf8");
const rule = (size: string): string => {
  const m = css.match(new RegExp(`\\.ds-link--standalone\\.ds-link--${size}\\s*\\{([^}]*)\\}`));
  assert.ok(m, `no rule for size ${size}`);
  return m[1];
};

/* The library's ramp, as the Figma `Link` masters link it: Small `Label/label-2` 12, Default
   `Label/label-1` 14, Large `Title/title-2` 16 SemiBold. Still three different, ascending roles —
   the older 14 / 16 / 22 set body and title roles at weight 500, which no text style has. */
test("link: standalone sizes bind three different, ascending type roles", () => {
  assert.match(rule("sm"), /--sa-type-label-2-size/);
  assert.match(rule("md"), /--sa-type-label-1-size/);
  assert.match(rule("lg"), /--sa-type-title-2-size/);
});

test("link: the inverse tone uses the secondary-inverse ink, not the blue that sits on a white fill", () => {
  const m = css.match(/\.ds-link--inverse\s*\{([^}]*)\}/);
  assert.ok(m);
  assert.match(m[1], /--sa-cmp-action-brand-secondary-inverse-default-text/);
});
