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

  /**
   * REWRITTEN 2026-08-25, and the assertion is now the OPPOSITE of what it was.
   *
   * It used to require FREE SPACE ABOVE the transcript — proof that the log was
   * bottom-anchored rather than stuck to its ceiling. That was the right test
   * for a panel with a fixed 719px height, where free space was guaranteed and
   * the only question was which end of it the conversation sat at.
   *
   * The panel no longer has a fixed height. It sizes to its content up to a
   * 719px cap, because the free space that test was measuring turned out to be
   * the defect: on open, a 531px log held 96px of greeting, so 435px — about
   * 45% of the panel — was white. Bottom-anchoring meant it collected under the
   * header, which is exactly where a panel looks unfinished.
   *
   * So the property worth pinning flipped: there should be NO free space at
   * rest, and the panel should be well under its cap. The floor assertion
   * survives unchanged, because `margin-block-start: auto` is still what puts
   * the transcript on the floor whenever free space does exist — a consumer
   * forcing a height, or a viewport cap taller than the content.
   */
  test("a short conversation fills the panel — no dead space above it", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await expect(page.getByText("This is an assistant for the Ministry")).toBeVisible();

    const geometry = await page.locator(PANEL).evaluate((el) => {
      const style = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      const children = [...el.children].map((c) => c.getBoundingClientRect());
      const panel = el.closest(".ds-chatbot__panel")!;
      return {
        contentTop: box.top + parseFloat(style.paddingTop),
        contentBottom: box.bottom - parseFloat(style.paddingBottom),
        firstChildTop: children[0]!.top,
        lastChildBottom: children[children.length - 1]!.bottom,
        overflows: el.scrollHeight > el.clientHeight,
        panelHeight: panel.getBoundingClientRect().height,
        panelCap: parseFloat(getComputedStyle(panel).maxHeight),
      };
    });

    expect(geometry.overflows, "this case is only meaningful while nothing overflows").toBe(false);
    expect(
      geometry.firstChildTop - geometry.contentTop,
      "the panel should have shrunk to its content, leaving no white band under the header",
    ).toBeLessThan(2);
    expect(
      Math.abs(geometry.lastChildBottom - geometry.contentBottom),
      "and the transcript should still rest on the floor",
    ).toBeLessThan(2);
    expect(
      geometry.panelHeight,
      "the opening panel must be comfortably under the cap, not pinned to it",
    ).toBeLessThan(geometry.panelCap - 100);
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
