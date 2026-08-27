import { test, expect } from "@playwright/test";

/**
 * The bar's entry transition, pinned.
 *
 * It entered from a fixed +2rem regardless of which way the citizen stepped —
 * so PREVIOUS slid the message in from the right, the motion saying "forward"
 * while the control said "back". On a stepped component that is the difference
 * between holding a position and reshuffling, and it is invisible in a still
 * screenshot, which is why it survived several visual passes.
 */
const BAR = '.sa-ticker:not([data-orientation="vertical"])';
const DOCS = "/design-system/components/feedback/ticker";

const enterOffset = (bar: import("@playwright/test").Locator) =>
  bar.evaluate((n) => {
    const item = n.querySelector(".sa-ticker__item") as HTMLElement;
    return getComputedStyle(item).getPropertyValue("--sa-ticker-enter-from").trim();
  });

test.describe("Latest Updates — the bar enters from the side it came from", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(DOCS);
    await expect(page.locator(BAR).first()).toBeVisible();
  });

  test("forward and back enter from opposite sides", async ({ page }) => {
    const bar = page.locator(BAR).first();
    await expect(bar).toHaveAttribute("data-step", "forward");
    const forward = await enterOffset(bar);

    await bar.getByLabel(/^Previous item/).click();
    await expect(bar).toHaveAttribute("data-step", "back");
    const back = await enterOffset(bar);

    // Opposite signs, same distance — not merely different values.
    expect(back).toBe(`-${forward}`);

    await bar.getByLabel(/^Next item/).click();
    await expect(bar).toHaveAttribute("data-step", "forward");
    expect(await enterOffset(bar)).toBe(forward);
  });

  test("the direction is logical, so it flips in RTL", async ({ page }) => {
    // The estate runs `dir="rtl"` in Urdu, where "next" travels leftward. A
    // physical +x offset would have the message arriving from the direction it
    // is about to leave towards.
    const bar = page.locator(BAR).first();
    const ltrForward = await enterOffset(bar);

    await page.evaluate(() => document.documentElement.setAttribute("dir", "rtl"));
    await expect(bar).toHaveAttribute("data-step", "forward");
    expect(await enterOffset(bar)).toBe(`-${ltrForward}`);
  });

  test("it is short enough to sit behind a message that changes every 5s", async ({ page }) => {
    const bar = page.locator(BAR).first();
    const anim = await bar.evaluate((n) => {
      const cs = getComputedStyle(n.querySelector(".sa-ticker__item") as HTMLElement);
      return { duration: cs.animationDuration, easing: cs.animationTimingFunction };
    });
    // Under 300ms, and a strong ease-out rather than a curve that eases IN.
    expect(Number.parseFloat(anim.duration)).toBeLessThanOrEqual(0.3);
    expect(anim.easing).toBe("cubic-bezier(0.23, 1, 0.32, 1)");
  });
});
