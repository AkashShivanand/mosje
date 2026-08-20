import { test, expect } from "@playwright/test";

/**
 * "End chat" must exist, and must actually end the chat.
 *
 * It went missing when the assistant moved to the controlled path: the widget
 * gated the footer button on `!controlledTranscript`, so a consumer that owns
 * its own transcript lost the only way out of a conversation — while every
 * other check in the repo stayed green. The gate now asks whether the chat CAN
 * be ended (`onEndChat` supplied) rather than who is driving the widget.
 *
 * Ending is destructive, so the test asserts the whole consequence, not just
 * the click: the transcript is gone, the panel is closed, focus is back on the
 * launcher, and reopening starts a genuinely fresh conversation.
 */

const END = ".ds-chatbot__end";
const BUBBLE = ".ds-chatbot__bubble";

test.describe("Samajik Sahayak — End chat", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/website");
    await page.getByRole("button", { name: /Samajik Sahayak, chat assistant/ }).click();
    await expect(page.getByText("This is an assistant for the Ministry")).toBeVisible();
  });

  test("is offered in the footer once there is a conversation", async ({ page }) => {
    await expect(page.locator(END)).toBeVisible();
    await expect(page.locator(END)).toHaveText("End chat");
  });

  test("clears the transcript, closes the panel, and returns focus to the launcher", async ({
    page,
  }) => {
    for (const label of ["Which scheme applies to me?", "Myself", "Scheduled Caste"]) {
      await page.getByRole("button", { name: label, exact: true }).click();
    }
    expect(await page.locator(BUBBLE).count()).toBeGreaterThan(3);

    await page.locator(END).click();

    await expect(page.locator(".ds-chatbot__panel")).toBeHidden();
    await expect(page.getByRole("button", { name: /Samajik Sahayak, chat assistant/ })).toBeFocused();
    // No unread nudge: the citizen ended this themselves, nothing arrived for them.
    await expect(page.locator(".ds-chatbot__nudge")).toHaveCount(0);
  });

  test("reopening after ending starts a fresh conversation, not the old one", async ({ page }) => {
    for (const label of ["Which scheme applies to me?", "Myself"]) {
      await page.getByRole("button", { name: label, exact: true }).click();
    }
    await expect(page.getByText("Question 2 of 5")).toBeVisible();

    await page.locator(END).click();
    await page.getByRole("button", { name: /Samajik Sahayak, chat assistant/ }).click();

    await expect(page.getByText("This is an assistant for the Ministry")).toBeVisible();
    // The whole stack went with it — no half-finished run waiting underneath.
    await expect(page.getByText("Question 2 of 5")).toHaveCount(0);
    expect(await page.locator(BUBBLE).count()).toBe(1);
    await expect(page.getByRole("button", { name: "Which scheme applies to me?" })).toBeVisible();
  });
});
