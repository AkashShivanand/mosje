import { test, expect } from "@playwright/test";

/**
 * The composer's text field must be the size it looks.
 *
 * The pill renders 42px tall. The `<input>` inside it had no height, so it was
 * 20px — its line box — and the parent's `align-items: center` floated that
 * band in the middle. Everything above and below it belonged to the FORM, which
 * focuses nothing: roughly half of what reads unmistakably as a text field did
 * nothing when tapped, and the real target sat at 20px, under the 24px WCAG 2.2
 * (2.5.8) minimum.
 *
 * Neither half is visible. The field looks correct in every screenshot, and
 * typecheck, lint and every token gate passed over it. Only a browser can see
 * that a click landed on the wrong element, which is why it is pinned here.
 */

const INPUT = ".ds-chatbot__input";
const PILL = ".ds-chatbot__composer";

test.describe("Samajik Sahayak — the composer is the size it looks", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/website");
    await page.getByRole("button", { name: /Samajik Sahayak, chat assistant/ }).click();
    await expect(page.getByText("This is an assistant for the Ministry")).toBeVisible();
  });

  test("the input clears the 24px WCAG 2.2 target minimum", async ({ page }) => {
    const height = await page.locator(INPUT).evaluate((el) => el.getBoundingClientRect().height);
    expect(height, "WCAG 2.2 §2.5.8 Target Size (Minimum) is 24x24 CSS px").toBeGreaterThanOrEqual(
      24,
    );
  });

  test("clicking anywhere in the pill focuses the input, not the form", async ({ page }) => {
    const pill = page.locator(PILL);
    const box = (await pill.boundingBox())!;

    // 4px below the pill's top border — inside the padding, which is exactly
    // where the old 20px input was not.
    await page.mouse.click(box.x + box.width / 2, box.y + 4);
    await expect(page.locator(INPUT)).toBeFocused();

    // And the mirror case, 4px above the bottom border.
    await page.locator(INPUT).blur();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height - 4);
    await expect(page.locator(INPUT)).toBeFocused();
  });

  test("the input spans the pill's inner height, with no dead band", async ({ page }) => {
    const gaps = await page.locator(PILL).evaluate((form) => {
      const input = form.querySelector(".ds-chatbot__input")!;
      const s = getComputedStyle(form);
      const f = form.getBoundingClientRect();
      const i = input.getBoundingClientRect();
      return {
        top: i.top - (f.top + parseFloat(s.borderTopWidth) + parseFloat(s.paddingTop)),
        bottom: f.bottom - parseFloat(s.borderBottomWidth) - parseFloat(s.paddingBottom) - i.bottom,
      };
    });
    expect(Math.abs(gaps.top), "dead band above the input").toBeLessThan(1);
    expect(Math.abs(gaps.bottom), "dead band below the input").toBeLessThan(1);
  });
});
