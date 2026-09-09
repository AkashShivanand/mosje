import { expect, test } from "@playwright/test";

/**
 * THE DIALOG KEEPS FOCUS — on a page that actively works against it.
 *
 * This suite exists because the trap was escapable in production for as long as
 * the component had existed, and no amount of reading the code would have shown
 * it: the handler was correct, and its ASSUMPTION was not.
 *
 * It intercepted Tab only when focus sat on the first or last control, and
 * relied on the browser for everything between. That holds exactly as long as
 * the browser's sequential focus order inside the panel matches document order.
 * Every public page on this estate loads the UX4G accessibility widget, which
 * injects nineteen elements carrying a POSITIVE `tabindex` (1 through 11) —
 * and positive tabindex is visited BEFORE every `tabindex=0` element anywhere
 * in the document. So the browser's "next" from inside any dialog was one of
 * the widget's own buttons, behind the scrim.
 *
 * ── `.ds-modal`, NEVER `[role="dialog"]` ────────────────────────────────────
 *
 * The widget's own panel carries `role="dialog"` and holds sixty-seven
 * controls. An assertion phrased as "focus is inside `[role=\"dialog\"]`" is
 * therefore satisfied by focus having landed in the very thing the trap is
 * supposed to keep it away from — a green test for the bug. Every selector here
 * names the design system's own class instead.
 *
 * ── WHY THE TEST RUNS ON A REAL PAGE AND NOT A FIXTURE ──────────────────────
 *
 * A fixture would have passed. The widget is the entire mechanism of the
 * defect, so a page without it proves nothing — which is why this navigates to
 * a route that loads it, and asserts the widget is present before asserting
 * anything about focus. A day when that assertion fails is a day this suite has
 * quietly stopped testing what it says it tests.
 */

const PAGE = "/website/organisation/nasha-mukt-bharat-abhiyaan";

/**
 * THE CODE IS ON THE SECOND PANEL, AND THE BAND TURNS ON A SIX-SECOND TIMER.
 *
 * Reaching straight for the tile is a coin toss: half the time the volunteer
 * panel is showing and half the time it is `visibility: hidden` behind the
 * observance. The first draft of this suite did exactly that and failed on the
 * second test while passing the first, which is the signature of a test whose
 * subject wanders.
 *
 * Pressing the second pager dot selects that panel AND stops the rotation for
 * good — the band treats a reader who chose a panel as having said which one
 * they want — so everything after this line is standing still.
 */
async function openTheCodeDialog(page: import("@playwright/test").Page) {
  await page.locator(".orgab__dot").nth(1).click();
  const tile = page.locator(".orgab__mark--code");
  await expect(tile).toBeVisible();
  await tile.click();
  await expect(page.locator(".ds-modal")).toBeVisible();
  return tile;
}

/** Where focus actually is, named well enough to read in a failure message. */
const focusInfo = () =>
  ({
    inDialog: !!document.activeElement?.closest(".ds-modal"),
    where: document.activeElement
      ? `${document.activeElement.tagName.toLowerCase()}.${
          document.activeElement.className?.toString().split(" ")[0] ?? ""
        }`
      : "none",
  }) as const;

test.describe("Modal focus trap", () => {
  test("Tab cannot leave the dialog, in either direction", async ({ page }) => {
    await page.goto(PAGE);

    /*
     * THE PRECONDITION IS PART OF THE TEST. Without the widget's positive
     * tabindices on the page, a boundary-only trap passes this suite and ships
     * the bug again.
     */
    await expect
      .poll(
        async () =>
          page.evaluate(
            () =>
              [...document.querySelectorAll("[tabindex]")].filter(
                (el) => Number(el.getAttribute("tabindex")) > 0,
              ).length,
          ),
        {
          message:
            "the UX4G widget's positive tabindex elements are the mechanism this test exercises — without them it proves nothing",
          timeout: 20_000,
        },
      )
      .toBeGreaterThan(0);

    await openTheCodeDialog(page);

    // Focus starts inside, on the dialog's own first control.
    expect(await page.evaluate(focusInfo)).toMatchObject({ inDialog: true });

    /*
     * More presses than the dialog has controls, so the wraparound is exercised
     * rather than merely the first hop. Each one is asserted: a trap that leaks
     * on the fourth press and not the first is still a trap that leaks.
     */
    for (let i = 0; i < 8; i += 1) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(focusInfo);
      expect(info.inDialog, `Tab #${i + 1} left the dialog, landing on ${info.where}`).toBe(true);
    }

    for (let i = 0; i < 8; i += 1) {
      await page.keyboard.press("Shift+Tab");
      const info = await page.evaluate(focusInfo);
      expect(
        info.inDialog,
        `Shift+Tab #${i + 1} left the dialog, landing on ${info.where}`,
      ).toBe(true);
    }
  });

  test("Escape closes it and focus returns to whatever opened it", async ({ page }) => {
    await page.goto(PAGE);

    await openTheCodeDialog(page);

    await page.keyboard.press("Escape");
    await expect(page.locator(".ds-modal")).toHaveCount(0);

    /* Not merely "focus is somewhere sensible" — it is on the control the
       reader pressed, which is the only place that lets them carry on. */
    await expect
      .poll(() =>
        page.evaluate(() => document.activeElement?.className?.toString() ?? ""),
      )
      .toContain("orgab__mark--code");
  });
});
