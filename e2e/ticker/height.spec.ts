import { test, expect } from "@playwright/test";

/**
 * The panel's height: fixed alone, filled in company.
 *
 * `block-size: 100%` resolves to `auto` against a parent with no definite
 * height, and to the parent's height when there is one. So a panel standing on
 * its own is as tall as its `rows` ask for, and the same panel dropped into a
 * grid row beside other content takes the row. One declaration, both
 * behaviours, no prop for a consumer to get wrong.
 *
 * What follows from it is the part worth pinning: whether the list scrolls is
 * then a MEASUREMENT, not a count. Give the panel a tall enough row and the
 * whole list fits — at which point a marquee would be moving content that is
 * already entirely on screen, so it does not run and the controls that govern
 * it are not offered.
 */

const PANEL = '.sa-ticker[data-orientation="vertical"]';

test.describe("Latest Updates — height", () => {
  test("takes the row's height when it shares one, and shows the whole list", async ({ page }) => {
    await page.goto("/website");
    const panel = page.locator(PANEL);
    await expect(panel).toBeVisible();

    const { panelH, railH, fills } = await panel.evaluate((el) => {
      const rail = el.parentElement as HTMLElement;
      const p = el.getBoundingClientRect().height;
      const r = rail.getBoundingClientRect().height;
      return { panelH: p, railH: r, fills: Math.abs(p - r) < 2 };
    });
    expect(fills).toBe(true);
    // Not merely equal to its own content — actually taking a row taller than
    // the `rows` floor would have given it.
    expect(panelH).toBeGreaterThan(400);
    expect(railH).toBeGreaterThan(400);

    // The department's feed is far longer than any row, so it scrolls — and the
    // control that stops it is offered.
    await expect(panel.locator(".sa-ticker__viewport")).toHaveAttribute("data-scroll", "");
    await expect(panel.locator(".sa-ticker__control")).toHaveCount(1);
  });

  test("stands at its own height alone, and scrolls because the list overflows it", async ({ page }) => {
    await page.goto("/design-system/components/feedback/ticker");
    await page.getByText("Panel (vertical scroll)").click();
    const panel = page.locator(PANEL);
    await expect(panel).toBeVisible();

    const measured = await panel.evaluate((el) => {
      const vp = el.querySelector(".sa-ticker__viewport") as HTMLElement;
      const list = el.querySelector(".sa-ticker__list") as HTMLElement;
      return {
        panelH: el.getBoundingClientRect().height,
        viewportH: vp.getBoundingClientRect().height,
        listH: list.getBoundingClientRect().height,
      };
    });

    // The list is taller than the window it is shown through — which is exactly
    // the condition the marquee exists for.
    expect(measured.listH).toBeGreaterThan(measured.viewportH);
    await expect(panel.locator(".sa-ticker__viewport")).toHaveAttribute("data-scroll", "");
    await expect(panel.locator(".sa-ticker__list")).toHaveCount(2);
    await expect(panel.locator(".sa-ticker__control")).toHaveCount(1);
  });

  test("the seam is invisible: the wrapper is exactly two lists, and travels exactly one", async ({ page }) => {
    // This is the jerk that was reported. Each copy used to be its own animated
    // element translating -50% of ITS OWN height, so every cycle moved the list
    // half a length and snapped back. Translating the WRAPPER by -50% moves it
    // exactly one list, which is where the second copy already sits — the reset
    // lands on an identical frame.
    await page.goto("/website");
    const panel = page.locator(PANEL);
    await expect(panel).toBeVisible();
    await expect(panel.locator(".sa-ticker__viewport")).toHaveAttribute("data-scroll", "");

    const seam = await panel.evaluate((el) => {
      const track = el.querySelector(".sa-ticker__track") as HTMLElement;
      const list = el.querySelector(".sa-ticker__list") as HTMLElement;
      const anim = track.getAnimations()[0];
      const y = () => new DOMMatrixReadOnly(getComputedStyle(track).transform).m42;
      const duration = Number(anim.effect!.getTiming().duration);
      anim.currentTime = 0;
      const start = y();
      anim.currentTime = duration - 1;
      const end = y();
      anim.currentTime = 0;
      return {
        listH: list.getBoundingClientRect().height,
        trackH: track.getBoundingClientRect().height,
        travel: Math.abs(end - start),
      };
    });

    expect(Math.abs(seam.trackH - seam.listH * 2)).toBeLessThan(1.5);
    expect(Math.abs(seam.travel - seam.listH)).toBeLessThan(1.5);
  });

  test("a list that does not scroll can still be scrolled by hand", async ({ page }) => {
    // The still case used to render only the first `rows` items, which stranded
    // the rest: unreachable, and — because the overflow check measures this very
    // list — a sliced list can never be found to overflow, so a panel that
    // stopped scrolling could never start again. The whole list is always in the
    // DOM now, and the viewport scrolls normally when the marquee is not running.
    // The standalone playground panel is short enough to sit still.
    await page.goto("/design-system/components/feedback/ticker");
    await page.getByText("Panel (vertical scroll)").click();
    await page.getByText("Too short to move (controls go)").click();
    const panel = page.locator(PANEL);
    await expect(panel).toBeVisible();
    await expect(panel.locator(".sa-ticker__viewport")).not.toHaveAttribute("data-scroll", "");

    const rows = await panel.locator(".sa-ticker__list").first().locator(".sa-ticker__row").count();
    expect(rows).toBeGreaterThan(0);
    await expect(panel.locator(".sa-ticker__viewport")).toHaveCSS("overflow-y", "auto");
  });
});

test.describe("Latest Updates — the date is optional", () => {
  test("renders a real <time>, and the separator only when both halves exist", async ({ page }) => {
    await page.goto("/website");
    const meta = page.locator(`${PANEL} .sa-ticker__rowmeta`).first();
    await expect(meta).toBeVisible();

    // A machine-readable date, not a run of characters that looks like one.
    const time = meta.locator("time");
    await expect(time).toHaveAttribute("datetime", /^\d{4}-\d{2}-\d{2}$/);

    // Kind · date, with the middot between them.
    await expect(meta).toContainText("·");
    const text = (await meta.textContent())?.trim() ?? "";
    expect(text).toMatch(/^\S.*·.*\d{4}$/);
  });
});
