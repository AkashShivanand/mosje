import { test, expect } from "@playwright/test";

/**
 * "Start over" must exist, and must actually start over.
 *
 * It went missing once when the assistant moved to the controlled path: the
 * widget gated the footer button on `!controlledTranscript`, so a consumer that
 * owns its own transcript lost the only way to reset a conversation — while
 * every other check in the repo stayed green. The gate now asks whether the
 * chat CAN be reset (`onEndChat` supplied) rather than who is driving the
 * widget.
 *
 * WHAT CHANGED, 2026-08-25. The control used to be called "End chat" and used
 * to CLOSE the panel as well as clear it. Both are gone, and the reason is that
 * neither name was true of the behaviour: a control that closes the panel is not
 * "start over", and a control that resets the transcript is not "end chat". It
 * was also a second way to close, next to a header ✕ already labelled "Minimise
 * chat" — two controls that both close, one of which destroys the transcript, is
 * how somebody loses a conversation reaching for the wrong one.
 *
 * So the assertions below are the INVERSE of what they used to be on two
 * points, deliberately: the panel stays OPEN, and focus stays inside it. Those
 * lines are the test, not an oversight.
 */

const START_OVER = ".ds-chatbot__end";
const BUBBLE = ".ds-chatbot__bubble";
const PANEL = ".ds-chatbot__panel";

test.describe("Samajik Sahayak — Start over", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/website");
    await page.getByRole("button", { name: /Samajik Sahayak, chat assistant/ }).click();
    await expect(page.getByText("This is an assistant for the Ministry")).toBeVisible();
  });

  test("is offered in the footer once there is a conversation", async ({ page }) => {
    await expect(page.locator(START_OVER)).toBeVisible();
    await expect(page.locator(START_OVER)).toHaveText("Start over");
  });

  test("is a design-system Button, not a hand-rolled one", async ({ page }) => {
    // The hand-rolled version is what drifted into the estate's rejection red
    // for an action that is housekeeping. Pinning the class is what stops it
    // being quietly re-written by hand later.
    await expect(page.locator(START_OVER)).toHaveClass(/ds-btn/);
    await expect(page.locator(START_OVER)).toHaveClass(/ds-btn--neutral/);
    await expect(page.locator(START_OVER)).toHaveClass(/ds-btn--text/);
  });

  test("clears the transcript, KEEPS the panel open, and greets again", async ({ page }) => {
    for (const label of ["Which scheme applies to me?", "Myself", "Scheduled Caste"]) {
      await page.getByRole("button", { name: label, exact: true }).click();
    }
    expect(await page.locator(BUBBLE).count()).toBeGreaterThan(3);

    await page.locator(START_OVER).click();

    // The panel does NOT close. Closing is the header's ✕, and only that.
    await expect(page.locator(PANEL)).toBeVisible();

    // Focus stays inside the dialog. The button unmounts the moment the
    // transcript empties, so without this it falls to <body> and a keyboard
    // user is silently dropped out of a panel that is still on screen.
    await expect(page.locator(PANEL)).toBeFocused();

    // The greeting comes back on its own, in place.
    await expect(page.getByText("This is an assistant for the Ministry")).toBeVisible();
    expect(await page.locator(BUBBLE).count()).toBe(1);
    await expect(page.getByRole("button", { name: "Which scheme applies to me?" })).toBeVisible();

    // No unread nudge: the citizen did this themselves, nothing arrived for them.
    await expect(page.locator(".ds-chatbot__nudge")).toHaveCount(0);
  });

  test("drops the whole frame stack, not just the visible turn", async ({ page }) => {
    for (const label of ["Which scheme applies to me?", "Myself"]) {
      await page.getByRole("button", { name: label, exact: true }).click();
    }
    await expect(page.getByText("Question 2 of 5")).toBeVisible();

    await page.locator(START_OVER).click();
    await expect(page.getByText("This is an assistant for the Ministry")).toBeVisible();

    // No half-finished run waiting underneath the fresh greeting.
    await expect(page.getByText("Question 2 of 5")).toHaveCount(0);
  });

  test("the header ✕ closes WITHOUT clearing — the two are cleanly separated", async ({
    page,
  }) => {
    for (const label of ["Which scheme applies to me?", "Myself"]) {
      await page.getByRole("button", { name: label, exact: true }).click();
    }
    // Wait for the typing beat to finish before counting. Counting straight
    // after the click races the 900ms answer, and the bubble that lands during
    // the close then reads as one the reopen invented — which is exactly the
    // false failure this line was added to remove.
    await expect(page.locator(".ds-chatbot__typing")).toHaveCount(0);
    await expect(page.getByText("Question 2 of 5")).toBeVisible();
    const before = await page.locator(BUBBLE).count();
    expect(before).toBeGreaterThan(1);

    await page.getByRole("button", { name: "Minimise chat" }).click();
    await expect(page.locator(PANEL)).toBeHidden();

    await page.getByRole("button", { name: /Samajik Sahayak, chat assistant/ }).click();
    // The conversation survived the close. This is the half that used to be
    // impossible to demonstrate, because the only labelled exit destroyed it.
    await expect(page.getByText("Question 2 of 5")).toBeVisible();
    expect(await page.locator(BUBBLE).count()).toBe(before);
  });
});
