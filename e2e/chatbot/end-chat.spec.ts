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
 *
 * WHAT CHANGED AGAIN, 2026-08-27, and it inverts two MORE assertions. The
 * control no longer clears anything. It appends: a labelled rule goes in under
 * the last turn and a fresh greeting lands below it, with everything said
 * before still there, scrolled up. So the two tests that used to prove the
 * transcript was GONE now prove it SURVIVED. Read them as the design, not as a
 * test somebody forgot to finish.
 *
 * It also moved. It sat hard right, in the same 32px column as Send with the
 * whole of Send's width 25px directly above it — the most-pressed control in
 * the panel stacked on the rarest and, at the time, the most destructive. It is
 * hard left now, and `does not share a column with Send` is what stops that
 * being undone by a future tidy-up. Every measurement passed BEFORE the move
 * (32px targets against WCAG 2.2 §2.5.8's 24, 25px gaps against UX4G's 8), so
 * no standards check would have caught the regression. This test would.
 */

const START_OVER = ".ds-chatbot__end";
const SEND = ".ds-chatbot__send";
const BUBBLE = ".ds-chatbot__bubble";
const USER_BUBBLE = ".ds-chatbot__bubble--user";
const BREAK = ".ds-chatbot__break";
const NOTE = ".ds-chatbot__note";
const COMPOSER = ".ds-chatbot__composer";
const TYPING = ".ds-chatbot__typing";
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
    //
    // IF THIS FAILS DURING THE BUTTON REBUILD, IT IS THE DEPENDENCY, NOT A BUG
    // HERE. Button is being restructured separately (button-cleanup-prompt.md).
    // These three class names are a contract: either they survive, or this test
    // is updated in the SAME change. Do not delete the assertion to get green —
    // it is the only thing standing between this control and a fourth
    // hand-rolled button.
    await expect(page.locator(START_OVER)).toHaveClass(/ds-btn/);
    await expect(page.locator(START_OVER)).toHaveClass(/ds-btn--neutral/);
    await expect(page.locator(START_OVER)).toHaveClass(/ds-btn--text/);
  });

  test("does not share a column with Send — a mis-tap must cost a reach", async ({
    page,
  }) => {
    const send = await page.locator(SEND).boundingBox();
    const startOver = await page.locator(START_OVER).boundingBox();
    expect(send).not.toBeNull();
    expect(startOver).not.toBeNull();
    if (!send || !startOver) return;

    // No horizontal overlap at all: Send begins after Start over ends.
    expect(send.x).toBeGreaterThan(startOver.x + startOver.width);

    // And not by a hair. Send is pressed constantly and this control is rare;
    // they should not be reachable by the same thumb position. Measured at
    // 171px on a 375px-wide viewport, so 100 fails on a regression rather than
    // on a design tweak.
    expect(send.x - (startOver.x + startOver.width)).toBeGreaterThan(100);
  });

  test("the footer keeps ONE left edge — composer, note and Start over", async ({ page }) => {
    // THIS IS THE HALF THAT WAS MISSED THE FIRST TIME, and it was caught on
    // review rather than by any gate. Getting Start over out of Send's column
    // by putting it at the head of the note's row worked geometrically and
    // wrecked the layout: 101px of button in front of the paragraph pushed the
    // disclaimer 109px inside the composer's left edge, giving the panel a
    // ragged left margin, and rewrapped the note from two lines to three so the
    // button floated with dead space above it.
    //
    // Both facts are asserted because fixing either one alone reintroduces the
    // other: the gap test above passes in BOTH arrangements.
    const composer = await page.locator(COMPOSER).boundingBox();
    const note = await page.locator(NOTE).boundingBox();
    const startOver = await page.locator(START_OVER).boundingBox();
    expect(composer).not.toBeNull();
    expect(note).not.toBeNull();
    expect(startOver).not.toBeNull();
    if (!composer || !note || !startOver) return;

    expect(Math.abs(note.x - composer.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(startOver.x - composer.x)).toBeLessThanOrEqual(1);

    // The note runs the full width of the panel rather than being squeezed
    // beside the button — that squeeze is what cost it the extra line.
    expect(note.width).toBeGreaterThan(composer.width - 2);

    // And the control is BELOW the note, not beside it.
    expect(startOver.y).toBeGreaterThanOrEqual(note.y + note.height - 1);
  });

  test("KEEPS the conversation, rules it off, and greets again below", async ({ page }) => {
    for (const label of ["Which scheme applies to me?", "Myself", "Scheduled Caste"]) {
      await page.getByRole("button", { name: label, exact: true }).click();
    }
    await expect(page.locator(TYPING)).toHaveCount(0);
    const before = await page.locator(BUBBLE).count();
    expect(before).toBeGreaterThan(3);

    await page.locator(START_OVER).click();

    // The panel does NOT close. Closing is the header's ✕, and only that.
    await expect(page.locator(PANEL)).toBeVisible();

    // Focus stays inside the dialog, at the top of what changed.
    await expect(page.locator(PANEL)).toBeFocused();

    // The greeting arrives on its own, in place.
    await expect(page.getByText("This is an assistant for the Ministry")).toBeVisible();
    await expect(page.locator(TYPING)).toHaveCount(0);

    // NOTHING WAS DESTROYED. Every bubble that was there is still there, and
    // the greeting is one more on top — not a transcript of one.
    expect(await page.locator(BUBBLE).count()).toBe(before + 1);

    // A single labelled rule marks where the new conversation starts.
    await expect(page.locator(BREAK)).toHaveCount(1);
    await expect(page.locator(BREAK)).toHaveAttribute("aria-label", "New conversation");

    await expect(page.getByRole("button", { name: "Which scheme applies to me?" })).toBeVisible();

    // No unread nudge: the citizen did this themselves, nothing arrived for them.
    await expect(page.locator(".ds-chatbot__nudge")).toHaveCount(0);
  });

  test("the answers already given stay above the fresh start", async ({ page }) => {
    for (const label of ["Which scheme applies to me?", "Myself"]) {
      await page.getByRole("button", { name: label, exact: true }).click();
    }
    await expect(page.locator(TYPING)).toHaveCount(0);
    await expect(page.locator(USER_BUBBLE).filter({ hasText: "Myself" })).toHaveCount(1);

    await page.locator(START_OVER).click();
    await expect(page.getByText("This is an assistant for the Ministry")).toBeVisible();

    // This is the whole point of the change. The citizen who reached for Send
    // and hit this instead has lost nothing — the answer they gave is still on
    // screen, above the rule, and they can read it back rather than retype it.
    await expect(page.locator(USER_BUBBLE).filter({ hasText: "Myself" })).toHaveCount(1);
    expect(await page.locator(USER_BUBBLE).count()).toBeGreaterThan(0);
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
