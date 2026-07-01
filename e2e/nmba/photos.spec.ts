import { test, expect } from "@playwright/test";
import path from "node:path";

// NMBA portal is mounted under this basePath (see apps/portals/nmba/next.config.*).
const BASE = "/portals/nmba";

// Reuse an existing brand asset as the upload fixture — image/svg+xml matches
// the "image/*" accept filter and the app's own client-side type validation,
// so this exercises the real upload path without adding a binary test fixture.
const FIXTURE_IMAGE = path.join(
  __dirname,
  "../../apps/portals/nmba/public/brand/samavesh-logo.svg",
);

test.describe("NMBA Centre Photo Gallery — critical path", () => {
  test.beforeEach(async ({ page }) => {
    // ---- Demo OTP login (IRCA role) ----
    await page.goto(`${BASE}/treatment-centre/login-otp`);
    await page.getByLabel("Project Id").fill("IRCA001");
    await page.getByRole("button", { name: "Send OTP" }).click();
    await page.getByLabel("Enter OTP").fill("123456");
    await page.getByRole("button", { name: "Verify & Login" }).click();
    await page.waitForURL(`**${BASE}/treatment-centre/dashboard`);

    await page.goto(`${BASE}/treatment-centre/photos`);
    await expect(page.getByRole("heading", { name: "Centre Photo Gallery" })).toBeVisible();
  });

  test("upload, view in the lightbox, edit, then bulk-delete a photo", async ({ page }) => {
    const caption = `E2E smoke test photo ${Date.now()}`;

    // ---- Upload ----
    await page.getByRole("button", { name: "Upload Photos" }).click();
    await page.locator('input[type="file"]').setInputFiles(FIXTURE_IMAGE);
    await page.getByLabel("Album").selectOption({ label: "Infrastructure" });
    await page.getByLabel("Caption / Event name").fill(caption);
    await page.getByRole("button", { name: /Add \d+ to Gallery/ }).click();

    // Switch to list view — row actions are always rendered there (grid view
    // hides them behind a hover-reveal bar, which is flakier to automate).
    await page.getByRole("button", { name: "List view" }).click();

    const row = page.locator(`[data-testid="gallery-row"][data-caption="${caption}"]`);
    await expect(row).toBeVisible();

    // ---- Lightbox ----
    await row.getByRole("button", { name: `View ${caption}` }).click();
    const lightbox = page.getByRole("dialog");
    await expect(lightbox).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(lightbox).toBeHidden();

    // ---- Edit ----
    await row.getByRole("button", { name: "Edit" }).click();
    const editedCaption = `${caption} (edited)`;
    await page.getByLabel("Caption").fill(editedCaption);
    await page.getByRole("button", { name: "Save Changes" }).click();

    const editedRow = page.locator(`[data-testid="gallery-row"][data-caption="${editedCaption}"]`);
    await expect(editedRow).toBeVisible();

    // ---- Bulk select + delete ----
    await page.getByRole("button", { name: "Select", exact: true }).click();
    await editedRow.getByRole("checkbox").check();

    const selectionBar = page.getByTestId("selection-bar");
    await expect(selectionBar).toContainText("1 selected");
    await selectionBar.getByRole("button", { name: "Delete" }).click();

    await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
    await expect(page.locator(`[data-caption="${editedCaption}"]`)).toHaveCount(0);
  });
});
