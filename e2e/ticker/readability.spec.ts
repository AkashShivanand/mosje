import { test, expect } from "@playwright/test";

/**
 * The Ticker's readability rules, pinned.
 *
 * Each of these shipped broken once, which is why they are here rather than in
 * a reviewer's head.
 */

const PANEL = '.sa-ticker[data-orientation="vertical"]';

test.describe("Latest Updates — readability", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/website");
    await expect(page.locator(PANEL)).toBeVisible();
  });

  test("nothing is truncated", async ({ page }) => {
    // Two of the department's notices both open "Extension of Application
    // Submission Date for Financial Adviser (FA) Post at…". Clipped, they were
    // the SAME visible string — two links reading identically and leading to
    // different pages. Truncation here is a loss of meaning, not a compromise.
    const titles = page.locator(`${PANEL} .sa-ticker__rowtitle`);
    await expect(titles.first()).toBeVisible();

    const clipped = await titles.evaluateAll((els) =>
      els.some((el) => {
        const s = getComputedStyle(el);
        return s.textOverflow === "ellipsis" || s.whiteSpace === "nowrap";
      }),
    );
    expect(clipped).toBe(false);

    // And no title is actually overflowing its box.
    const overflowing = await titles.evaluateAll((els) =>
      els.filter((el) => el.scrollHeight > el.clientHeight + 1).length,
    );
    expect(overflowing).toBe(0);
  });

  test("every row carries a marker, and the text hangs off it", async ({ page }) => {
    // The marker is not decoration: without it every line starts at the same x,
    // and only a 32px gap against 20px inside a wrapped title says whether a
    // line begins a notice or continues one. The HANGING INDENT is the point —
    // a marker with the text wrapping back underneath it does nothing.
    const row = page.locator(`${PANEL} .sa-ticker__rowlink`).first();
    const marker = await row.evaluate((el) => {
      const before = getComputedStyle(el, "::before");
      return { content: before.content, width: before.width };
    });
    expect(marker.content).not.toBe("none");
    expect(marker.width).not.toBe("auto");

    const indent = await row.evaluate((el) => {
      const title = el.querySelector(".sa-ticker__rowtitle") as HTMLElement;
      return title.getBoundingClientRect().left - el.getBoundingClientRect().left;
    });
    // The title starts clear of the marker column, not on top of it.
    expect(indent).toBeGreaterThan(16);
  });

  test("rows do not underline on hover — the wash is the affordance", async ({ page }) => {
    // WCAG 1.4.1 asks that a link be distinguishable from the text AROUND it.
    // In a list where every row is a link there is no surrounding text, so the
    // underline carried no weight and struck through both lines of a wrapped
    // notice.
    const row = page.locator(`${PANEL} .sa-ticker__rowlink`).first();
    await row.hover();
    await expect(row.locator(".sa-ticker__rowtitle")).toHaveCSS("text-decoration-line", "none");
    const bg = await row.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("is a list to a screen reader, and is not a live region", async ({ page }) => {
    // A list is read at the reader's own pace. A live region would interrupt
    // them every time the marquee moved.
    await expect(page.locator(`${PANEL} ul.sa-ticker__track`).first()).toBeVisible();
    await expect(page.locator(`${PANEL} [aria-live]`)).toHaveCount(0);
  });
});

test.describe("Latest Updates — on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("stands still, drops the motion controls, and does not overflow", async ({ page }) => {
    // On touch there is no hover to stop it with, so a moving row is a moving
    // tap target and the citizen ends up chasing the link. Below 640px the
    // panel is a still list — and a pause button on something that is not
    // moving is worse than absent: it advertises motion to escape from.
    await page.goto("/website");
    const panel = page.locator(PANEL);
    await expect(panel).toBeVisible();

    await expect(panel.locator(".sa-ticker__viewport")).not.toHaveAttribute("data-scroll", "");
    await expect(panel.locator(".sa-ticker__control")).toHaveCount(0);
    await expect(panel.locator(".sa-ticker__track")).toHaveCount(1);

    // The way out survives — it is how the remaining notices are reached.
    await expect(panel.locator(".sa-ticker__action")).toBeVisible();

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflows).toBe(false);
  });
});
