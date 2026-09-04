import { expect, test } from "@playwright/test";

/**
 * Link, added 2026-09-03. The `--sa-text-link-*` token family had existed since the token
 * build and no component consumed it — the tokens were designed for a Link that was never
 * built, so 194 hand-rolled brand-coloured anchors were counted across the hub, each
 * deciding its own colour, underline, focus ring and new-tab handling.
 *
 * `ComponentDocPage` renders its panel twice (a responsive pair, both in the DOM), so
 * every locator takes `.first()`.
 */
const PAGE = "/design-system/components/navigation/link";

async function openDesign(page: import("@playwright/test").Page) {
  await page.goto(PAGE);
  await page.getByRole("tab", { name: "Design", exact: true }).click();
  await expect(page.getByRole("tab", { name: "Design", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
}

test.describe("Link — colour is never the only signal", () => {
  /**
   * WCAG 2.2 §1.4.1. A link inside a block of text must not be distinguished from the
   * surrounding text by colour alone, and colour is the only OTHER signal a text link
   * has — so the underline is the compliance, not the decoration.
   */
  test("an inline link is underlined at rest", async ({ page }) => {
    await openDesign(page);
    const link = page.getByTestId("link-inline").first();
    await expect(link).toBeVisible();
    await expect(link).toHaveCSS("text-decoration-line", "underline");

    // And it is genuinely inside prose — otherwise this test proves nothing about 1.4.1.
    const insideParagraph = await link.evaluate((el) => el.closest("p") != null);
    expect(insideParagraph).toBe(true);
  });

  /**
   * A standalone link is NOT inside a block of text, so 1.4.1 does not bind it and the
   * underline can wait for hover. It must still appear on interaction.
   */
  test("a standalone link underlines on hover", async ({ page }) => {
    await openDesign(page);
    const link = page.getByTestId("link-external").first();
    await expect(link).toHaveCSS("text-decoration-line", "none");
    await link.hover();
    await expect(link).toHaveCSS("text-decoration-line", "underline");
  });
});

test.describe("Link — leaving the site", () => {
  /**
   * `external` must do all four things. The glyph serves the people who can see it and
   * the hidden text serves the people who cannot; one without the other serves half the
   * audience. GIGW 3.0 requires the notice.
   */
  test("an external link opens safely and says so", async ({ page }) => {
    await openDesign(page);
    const link = page.getByTestId("link-external").first();

    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");

    // The warning is INSIDE the anchor, so it forms part of the accessible name rather
    // than being a sibling node the reader may never reach.
    const name = await link.evaluate((el) => (el.textContent ?? "").replace(/\s+/g, " ").trim());
    expect(name).toContain("(opens in a new tab)");

    // And it is visually hidden, not merely small.
    const hidden = await link.evaluate((el) => {
      const s = el.querySelector(".ds-sr-only");
      if (!s) return null;
      const cs = getComputedStyle(s);
      return { position: cs.position, w: cs.width, h: cs.height };
    });
    expect(hidden).not.toBeNull();
    expect(hidden!.position).toBe("absolute");
    expect(parseFloat(hidden!.w)).toBeLessThanOrEqual(1);
  });

  test("a download link marks itself as a file", async ({ page }) => {
    await openDesign(page);
    const link = page.getByTestId("link-download").first();
    await expect(link).toHaveAttribute("download", /.*/);
    // It does not become a new-tab link by accident.
    await expect(link).not.toHaveAttribute("target", "_blank");
  });
});

test.describe("Link — focus and the inert form", () => {
  test("the focus ring is the estate's, offset and bound", async ({ page }) => {
    await openDesign(page);
    const link = page.getByTestId("link-inline").first();
    await page.keyboard.press("Tab"); // establish keyboard modality for :focus-visible
    await link.focus();
    await expect(link).toBeFocused();
    const ring = await link.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { style: cs.outlineStyle, width: cs.outlineWidth, offset: cs.outlineOffset };
    });
    expect(ring.style).toBe("solid");
    expect(parseFloat(ring.width)).toBeGreaterThan(0);
    expect(parseFloat(ring.offset)).toBeGreaterThan(0);
  });
});

test.describe("Link — Windows High Contrast Mode", () => {
  /**
   * The forced palette removes colour as a signal entirely, so a STANDALONE link — which
   * relies on colour at rest — would have nothing left to say it is a link. Every link is
   * underlined in this mode, standalone included.
   */
  test("every link is underlined once the OS takes the palette", async ({ page }) => {
    await openDesign(page);
    await page.emulateMedia({ forcedColors: "active" });
    expect(
      await page.evaluate(() => matchMedia("(forced-colors: active)").matches),
      "forced-colors emulation is not active — this would measure ordinary mode",
    ).toBe(true);

    const standalone = page.getByTestId("link-external").first();
    await expect(standalone).toHaveCSS("text-decoration-line", "underline");
  });
});
