import { test, expect } from "@playwright/test";

test.describe("Internal Pages Visual Parity Suite", () => {
  test("1. Schemes & Services Catalog", async ({ page }) => {
    await page.goto("/website/schemes-services", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Schemes & Services" }).first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: "test-results/schemes-services.png", fullPage: true });
  });

  test("2. Annual Reports Document Catalog", async ({ page }) => {
    await page.goto("/website/annual-reports", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Annual Reports" }).first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: "test-results/annual-reports.png", fullPage: true });
  });

  test("3. Who's Who Senior Leadership", async ({ page }) => {
    await page.goto("/website/whos-who", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Who's Who" }).first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: "test-results/whos-who.png", fullPage: true });
  });

  test("4. Organisation Detail Page (NCSC)", async ({ page }) => {
    await page.goto("/website/organisation/national-commission-for-scheduled-castes", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /National Commission for Scheduled Castes/i }).first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: "test-results/organisation-detail.png", fullPage: true });
  });

  test("5. Contact Us Directory", async ({ page }) => {
    await page.goto("/website/contact-us", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Contact Us" }).first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: "test-results/contact-us.png", fullPage: true });
  });

  test("6. Events Listing", async ({ page }) => {
    await page.goto("/website/events", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Events" }).first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: "test-results/events.png", fullPage: true });
  });
});
