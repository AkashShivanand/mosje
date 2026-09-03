import { expect, test } from "@playwright/test";

/**
 * The segmented control, added 2026-09-03.
 *
 * `attached` was always documented for buttons that are ALTERNATIVES to one another —
 * a view switcher, a date range — and there was no `aria-pressed` anywhere in the
 * estate, in any component. So a segmented control could be built and could not say
 * which alternative was current: the accessible half was available (it typechecks on
 * Button through React's AriaAttributes) and the visible half did not exist.
 */
const PAGE = "/design-system/components/actions/button-group";

/**
 * `ComponentDocPage` renders its panel twice (a responsive pair, both in the DOM), so
 * every locator here takes `.first()`. Without it Playwright's strict mode rejects the
 * two matches and the failure reads like a missing element, which is not what it is.
 */
async function openDesign(page: import("@playwright/test").Page) {
  await page.goto(PAGE);
  await page.getByRole("tab", { name: "Design", exact: true }).click();
  await expect(page.getByRole("tab", { name: "Design", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
}

test.describe("Button Group — the segmented control", () => {
  test("exactly one segment is pressed, and pressing another moves it", async ({ page }) => {
    await openDesign(page);
    const week = page.getByTestId("seg-week").first();
    const month = page.getByTestId("seg-month").first();

    await expect(month).toHaveAttribute("aria-pressed", "true");
    await expect(week).toHaveAttribute("aria-pressed", "false");

    await week.click();
    await expect(week).toHaveAttribute("aria-pressed", "true");
    await expect(month).toHaveAttribute("aria-pressed", "false");
  });

  /**
   * The whole point: a pressed segment must LOOK different. An outlined button is
   * transparent at rest and takes the filled treatment when pressed, so this compares
   * the two live rather than asserting a hard-coded colour.
   */
  test("the pressed segment is drawn differently from its neighbours", async ({ page }) => {
    await openDesign(page);
    const pressedBg = await page.getByTestId("seg-month").first().evaluate((el) => getComputedStyle(el).backgroundColor);
    const restingBg = await page.getByTestId("seg-week").first().evaluate((el) => getComputedStyle(el).backgroundColor);

    expect(pressedBg).not.toBe(restingBg);
    // Resting outlined draws no fill; pressed must draw a real, opaque one.
    expect(restingBg).toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
    expect(pressedBg).not.toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
  });

  /**
   * Hover must not wash the selection away. Without the guard, `--outlined:hover`'s 8%
   * tint paints OVER the fill and the current segment briefly looks unselected — at the
   * moment the reader is most likely to be looking straight at it.
   */
  test("hovering the selected segment does not make it look unselected", async ({ page }) => {
    await openDesign(page);
    const month = page.getByTestId("seg-month").first();
    const before = await month.evaluate((el) => getComputedStyle(el).backgroundColor);
    await month.hover();
    const after = await month.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(after).not.toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
    // Still a real fill, and still not the resting treatment of its neighbour.
    const neighbour = await page.getByTestId("seg-week").first().evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(after).not.toBe(neighbour);
    expect(before).not.toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
  });

  /** The group's two jobs: it is named, and it holds its actions 8px apart. */
  test("the group is named and spaced", async ({ page }) => {
    await openDesign(page);
    const group = page.getByRole("group", { name: "Reporting period" }).first();
    await expect(group).toBeVisible();
    // Attached collapses the seam rather than spacing it.
    await expect(group).toHaveCSS("gap", "0px");

    const spaced = page.getByRole("group", { name: "Application actions" }).first();
    await expect(spaced).toHaveCSS("gap", "8px");
  });
});
