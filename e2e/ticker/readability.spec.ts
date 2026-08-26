import { test, expect } from "@playwright/test";

/**
 * The Ticker's readability rules, pinned.
 *
 * Each of these shipped broken once, which is why they are here rather than in
 * a reviewer's head.
 */

const PANEL = '.sa-ticker[data-orientation="vertical"]';

/**
 * Wait until a locator's box stops moving.
 *
 * `/website` keeps loading below the fold long after the panel is visible, and
 * each of those loads reflows the column the panel sits in. Playwright refuses
 * to dispatch a hover until the target is "stable", so a hover races the
 * reflow and times out against a component that is behaving perfectly — 1 run
 * in 3 locally. `networkidle` does not fix it, because the movement is layout
 * settling rather than requests finishing.
 *
 * Nothing is ever actually covering the row: with the page settled,
 * `elementFromPoint` at the row's centre returns the row's own title. So this
 * waits for the geometry rather than forcing the interaction, which would hide
 * a real overlay if one ever appeared.
 */
async function settled(locator: import("@playwright/test").Locator) {
  let previous = "";
  for (let i = 0; i < 40; i++) {
    const box = await locator.boundingBox();
    const current = JSON.stringify(box);
    if (box && current === previous) return;
    previous = current;
    await locator.page().waitForTimeout(100);
  }
}

test.describe("Latest Updates — readability", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/website");
    await expect(page.locator(PANEL)).toBeVisible();
    // WAIT FOR THE PAGE TO STOP MOVING BEFORE TOUCHING ANYTHING.
    // /website keeps loading below the fold long after the panel is visible,
    // and every one of those loads reflows the column the panel sits in. A
    // hover then races the reflow: Playwright refuses to dispatch until the
    // target is "stable", the target keeps moving, and the test times out
    // against a component that is behaving perfectly. Verified by measuring —
    // with the page settled, `elementFromPoint` at the row's centre returns
    // the row's own title, so nothing is ever actually covering it.
    await page.waitForLoadState("networkidle");
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
    // Stop it first. A row in a running marquee is never "stable", so Playwright
    // will not hover it — and a citizen cannot reliably hover it either, which
    // is exactly why hovering the list pauses it in the first place.
    await page.locator(`${PANEL} .sa-ticker__control`).first().click();
    await expect(page.locator(`${PANEL} .sa-ticker__viewport`)).toHaveAttribute("data-paused", "");

    const row = page.locator(`${PANEL} .sa-ticker__rowlink`).first();
    await settled(row);
    await row.hover();
    await expect(row.locator(".sa-ticker__rowtitle")).toHaveCSS("text-decoration-line", "none");
    const bg = await row.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("is a list to a screen reader, and is not a live region", async ({ page }) => {
    // A list is read at the reader's own pace. A live region would interrupt
    // them every time the marquee moved.
    await expect(page.locator(`${PANEL} ul.sa-ticker__list`).first()).toBeVisible();
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
    await expect(panel.locator(".sa-ticker__list")).toHaveCount(1);

    // The way out survives — it is how the remaining notices are reached.
    await expect(panel.locator(".sa-ticker__action")).toBeVisible();

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflows).toBe(false);
  });
});
