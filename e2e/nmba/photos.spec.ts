import { test, expect } from "@playwright/test";
import path from "node:path";

// NMBA portal is mounted natively inside the hub under this basePath
// (apps/hub/src/app/portals/nmba/ — there is no standalone NMBA app any more).
const BASE = "/portals/nmba";

// Reuse an existing brand asset as the upload fixture — image/svg+xml matches
// the "image/*" accept filter and the app's own client-side type validation,
// so this exercises the real upload path without adding a binary test fixture.
const FIXTURE_IMAGE = path.join(
  __dirname,
  "../../apps/hub/public/design-system/samavesh-logo.svg",
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
    // The UX4G accessibility widget is mounted estate-wide from the root layout
    // and ships its own dialog full of controls — including buttons labelled
    // "Grid view" and "List view". Scope page-level queries to the page's own
    // <main> so the widget's controls can never satisfy them.
    const main = page.locator("#main-content");

    const caption = `E2E smoke test photo ${Date.now()}`;

    // ---- Upload ----
    await main.getByRole("button", { name: "Upload Photos" }).click();
    const uploadSheet = page.getByRole("dialog", { name: "Upload Photos & Videos" });
    await uploadSheet.locator('input[type="file"]').setInputFiles(FIXTURE_IMAGE);
    await uploadSheet.getByLabel("Album").selectOption({ label: "Infrastructure" });
    await uploadSheet.getByLabel("Caption / Event name").fill(caption);
    await uploadSheet.getByRole("button", { name: /Add \d+ to Gallery/ }).click();

    // Switch to list view — row actions are always rendered there (grid view
    // hides them behind a hover-reveal bar, which is flakier to automate).
    await main.getByRole("button", { name: "List view" }).click();

    const row = main.locator(`[data-testid="gallery-row"][data-caption="${caption}"]`);
    await expect(row).toBeVisible();

    // ---- Lightbox ----
    await row.getByRole("button", { name: `View ${caption}` }).click();
    // The Lightbox portals to <body> and is named by the active item's caption.
    const lightbox = page.getByRole("dialog", { name: caption });
    await expect(lightbox).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(lightbox).toBeHidden();

    // ---- Edit ----
    await row.getByRole("button", { name: "Edit" }).click();
    const editSheet = page.getByRole("dialog", { name: "Edit Photo Details" });
    const editedCaption = `${caption} (edited)`;
    await editSheet.getByLabel("Caption").fill(editedCaption);
    await editSheet.getByRole("button", { name: "Save Changes" }).click();

    const editedRow = main.locator(`[data-testid="gallery-row"][data-caption="${editedCaption}"]`);
    await expect(editedRow).toBeVisible();

    // ---- Bulk select + delete ----
    await main.getByRole("button", { name: "Select", exact: true }).click();
    await editedRow.getByRole("checkbox").check();

    const selectionBar = main.getByTestId("selection-bar");
    await expect(selectionBar).toContainText("1 selected");
    await selectionBar.getByRole("button", { name: "Delete" }).click();

    await page.getByRole("dialog", { name: "Delete Photo" }).getByRole("button", { name: "Delete" }).click();
    await expect(main.locator(`[data-caption="${editedCaption}"]`)).toHaveCount(0);
  });
});
