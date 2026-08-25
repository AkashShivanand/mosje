import { test, expect } from "@playwright/test";

/**
 * Pause must hold the scroll where it is.
 *
 * It did not, and the reason is worth pinning: `canScroll` (a fact about the
 * content) and `isPlaying` (the citizen's choice) used to be a single flag.
 * Pressing pause dropped it, which removed the `animation` property outright,
 * unmounted the duplicated copy that makes the loop seamless, and re-sliced the
 * first one — so the track snapped back to `translateY(0)` and resumed from the
 * top. A pause that loses your place is not a pause; it is a reset with the
 * wrong label.
 *
 * The assertions are therefore about SAMENESS: the DOM is identical either side
 * of the press, and only `animation-play-state` moves.
 *
 * WHY THE WEB ANIMATIONS API AND NOT A SCREENSHOT. A marquee's position is a
 * function of elapsed time, so comparing pixels means racing the clock. Reading
 * `currentTime` off the animation object asks the question directly, and it
 * keeps working when the browser throttles animations in a background tab —
 * which is exactly what defeated the first attempt to measure this by hand.
 */

const PANEL = '.sa-ticker[data-orientation="vertical"]';
const VIEWPORT = ".sa-ticker__viewport";
const TRACK = ".sa-ticker__track";

/**
 * These run against the docs playground rather than the website, and the reason
 * is the component working correctly: the panel takes the height of the row it
 * sits in, and in the website's Offerings row that is tall enough for the whole
 * list — so nothing overflows, nothing scrolls, and there is no pause control to
 * press. A marquee moving content already entirely on screen would be motion for
 * its own sake. The playground instance stands alone at its `rows` height, which
 * is the case these assertions are about.
 */
async function openStandalonePanel(page: import("@playwright/test").Page) {
  await page.goto("/design-system/components/feedback/ticker");
  await page.getByText("Panel (vertical scroll)").click();
  await expect(page.locator(PANEL)).toBeVisible();
  await expect(page.locator(`${PANEL} ${VIEWPORT}`)).toHaveAttribute("data-scroll", "");
}

/** Elapsed time on the marquee, in ms — `null` if it is not animating. */
async function currentTime(page: import("@playwright/test").Page) {
  return page.locator(`${PANEL} ${TRACK}`).first().evaluate((el) => {
    const anim = el.getAnimations()[0];
    return anim ? Math.round(Number(anim.currentTime ?? 0)) : null;
  });
}

test.describe("Latest Updates — pause holds its position", () => {
  test.beforeEach(async ({ page }) => {
    await openStandalonePanel(page);
  });

  test("keeps its place across pause and resume, and only play-state moves", async ({ page }) => {
    const track = page.locator(`${PANEL} ${TRACK}`).first();
    const pause = page.locator(`${PANEL} .sa-ticker__control`).first();

    // Let it get somewhere first — a marquee that has not moved cannot show
    // whether pausing lost its place.
    await page.waitForTimeout(1200);

    const tracksBefore = await page.locator(`${PANEL} ${TRACK}`).count();
    const rowsBefore = await track.locator(".sa-ticker__row").count();
    expect(tracksBefore).toBe(2);

    await pause.click();
    await expect(page.locator(`${PANEL} ${VIEWPORT}`)).toHaveAttribute("data-paused", "");
    await expect(track).toHaveCSS("animation-play-state", "paused");

    // Read AFTER pausing: a running animation's clock moves between setting a
    // value and reading it back, so an exact comparison against a live one is
    // a race, not an assertion.
    const stopped = await currentTime(page);
    expect(stopped).not.toBeNull();
    expect(stopped!).toBeGreaterThan(0);

    // Frozen, not merely slowed.
    await page.waitForTimeout(600);
    expect(await currentTime(page)).toBe(stopped);

    // The DOM is identical either side of the press — this is what stopped the
    // reset: nothing unmounts, nothing is re-sliced.
    expect(await page.locator(`${PANEL} ${TRACK}`).count()).toBe(tracksBefore);
    expect(await track.locator(".sa-ticker__row").count()).toBe(rowsBefore);

    await pause.click();
    await expect(page.locator(`${PANEL} ${VIEWPORT}`)).not.toHaveAttribute("data-paused", "");
    await expect(track).toHaveCSS("animation-play-state", "running");

    // THE ONE THAT MATTERS. Resuming carries on from where it stopped; the bug
    // this pins returned it to zero. A small forward drift is the animation
    // running again, which is the point — so the assertion is "did not go
    // backwards to the start", not an exact equality it would lose to the clock.
    const resumed = await currentTime(page);
    expect(resumed!).toBeGreaterThanOrEqual(stopped!);
    expect(resumed!).toBeLessThan(stopped! + 2000);
  });

  test("the duplicated copy stays out of the way of assistive technology", async ({ page }) => {
    // A seamless loop needs the list twice; announcing it twice, or tabbing
    // through it twice, would be the defect that buys.
    const copies = page.locator(`${PANEL} ${TRACK}`);
    await expect(copies).toHaveCount(2);
    await expect(copies.nth(1)).toHaveAttribute("aria-hidden", "true");

    const tabIndexes = await copies.nth(1).locator("a").evaluateAll((els) =>
      els.map((el) => (el as HTMLAnchorElement).tabIndex),
    );
    expect(tabIndexes.length).toBeGreaterThan(0);
    expect(tabIndexes.every((t) => t === -1)).toBe(true);
  });

  test("hovering the list stops it without touching the button's own state", async ({ page }) => {
    // Two different mechanisms: the button is the deliberate control, hover is
    // the one that stops the accidents. Hover must not leave the button looking
    // pressed, or the citizen has no idea what state they are in.
    const track = page.locator(`${PANEL} ${TRACK}`).first();
    const viewport = page.locator(`${PANEL} ${VIEWPORT}`);

    await expect(track).toHaveCSS("animation-play-state", "running");
    await viewport.hover();
    await expect(track).toHaveCSS("animation-play-state", "paused");
    await expect(viewport).not.toHaveAttribute("data-paused", "");
    await expect(page.locator(`${PANEL} .sa-ticker__control`).first()).toHaveAttribute(
      "aria-label",
      /^Pause/,
    );
  });
});
