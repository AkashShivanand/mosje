import { test, expect } from "@playwright/test";

/**
 * The assistant's transcript must stay reachable once it is longer than the panel.
 *
 * This exists because a transcript that had scrolled away was UNREACHABLE, and
 * nothing in the repo could see it. `.ds-chatbot__log` was `overflow-y: auto`
 * AND `justify-content: flex-end`, which overflows a scroll container in the
 * block-START direction — and there is no negative `scrollTop`, so the browser
 * reported `scrollHeight === clientHeight`, drew no scrollbar, and everything
 * above the fold was simply gone. Measured on a real run: a 5810px stream in a
 * 533px box, its top at -5291px, `scrollHeight` still 533.
 *
 * Typecheck, lint, the unit tests and every token gate passed throughout. Only
 * a browser can catch this, which is why the regression is pinned here.
 *
 * The bottom-anchoring the old rule was there for is asserted too — an empty
 * chat must still sit on the floor of the panel, not at its ceiling.
 */

const PANEL = ".ds-chatbot__log";

/** Walk the finder far enough that the transcript is longer than the panel. */
const RUN = [
  "Which scheme applies to me?",
  "Myself",
  "Scheduled Caste",
  "In college or beyond",
  "education",
  "That's all — show me",
  "Maharashtra",
  "Show the last 3",
];

test.describe("Samajik Sahayak — the transcript scrolls", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/website");
    await page.getByRole("button", { name: /Samajik Sahayak, chat assistant/ }).click();
    await expect(page.getByText("This is an assistant for the Ministry")).toBeVisible();
  });

  test("a short conversation sits on the floor of the panel, not its ceiling", async ({ page }) => {
    // Tall enough that the greeting and its six suggestions genuinely fit. At
    // the 720px default they do NOT — which is worth writing down: before the
    // fix, the opening state alone overflowed on a short viewport and the
    // greeting was already unreachable on first open, script or no script.
    await page.setViewportSize({ width: 1280, height: 1000 });
    await expect(page.getByText("This is an assistant for the Ministry")).toBeVisible();

    /*
     * The property is FREE SPACE ABOVE, not "the greeting is low on screen" —
     * the suggestion list is a sibling inside the same scroller and takes as
     * much room as it has entries, so on a short panel the greeting can be
     * high up and still be correctly floor-anchored.
     */
    const geometry = await page.locator(PANEL).evaluate((el) => {
      const style = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      const children = [...el.children].map((c) => c.getBoundingClientRect());
      return {
        contentTop: box.top + parseFloat(style.paddingTop),
        contentBottom: box.bottom - parseFloat(style.paddingBottom),
        firstChildTop: children[0]!.top,
        lastChildBottom: children[children.length - 1]!.bottom,
        overflows: el.scrollHeight > el.clientHeight,
      };
    });

    expect(geometry.overflows, "this case is only meaningful while nothing overflows").toBe(false);
    expect(
      geometry.firstChildTop - geometry.contentTop,
      "the transcript should be pushed down by the free space, not stuck to the ceiling",
    ).toBeGreaterThan(1);
    expect(
      Math.abs(geometry.lastChildBottom - geometry.contentBottom),
      "and it should rest on the floor",
    ).toBeLessThan(2);
  });

  test("a transcript longer than the panel is scrollable, and the top is reachable", async ({
    page,
  }) => {
    for (const label of RUN) {
      await page.getByRole("button", { name: label, exact: true }).click();
    }

    const log = page.locator(PANEL);
    const metrics = await log.evaluate((el) => ({
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
    }));

    expect(
      metrics.scrollHeight,
      "the container must report the overflow — flex-end alignment hides it entirely",
    ).toBeGreaterThan(metrics.clientHeight);

    // Nothing may sit above the top of the scroll range.
    const highest = await log.evaluate((el) => {
      const top = el.getBoundingClientRect().top;
      return Math.min(
        ...[...el.querySelectorAll(".ds-chatbot__bubble")].map(
          (b) => b.getBoundingClientRect().top - top + el.scrollTop,
        ),
      );
    });
    expect(highest, "a message was laid out above scrollTop 0, where nothing can reach it")
      .toBeGreaterThanOrEqual(0);

    // And scrolling to the top actually brings the first message back into view.
    await log.evaluate((el) => {
      el.style.scrollBehavior = "auto";
      el.scrollTop = 0;
    });
    await expect(page.getByText("This is an assistant for the Ministry")).toBeInViewport();
  });
});
