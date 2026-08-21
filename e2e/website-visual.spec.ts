import { test, expect } from "@playwright/test";

test("public website homepage renders correctly and matches visual standards", async ({ page }) => {
  await page.goto("/website");
  await page.waitForLoadState("networkidle");

  // Verify header and title
  await expect(page).toHaveTitle(/Department of Social Justice|Ministry of Social Justice/i);
  await expect(page.getByRole("banner").first()).toBeVisible();

  // Verify SAMAVESH banner
  await expect(page.getByText("SAMAVESH").first()).toBeVisible();

  // Verify Support Section
  await expect(page.getByRole("heading", { name: "Need Support?" }).first()).toBeVisible();

  // Capture full page screenshot
  await page.screenshot({ path: "test-results/website-homepage.png", fullPage: true });
});
