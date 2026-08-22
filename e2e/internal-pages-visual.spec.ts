import { test, expect } from "@playwright/test";

test.describe("Complete Internal Pages Visual Suite", () => {
  test("1. About Us Page", async ({ page }) => {
    await page.goto("/website/about-us", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "About Us" }).first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: "test-results/about-us.png", fullPage: true });
  });

  test("2. Who's Who Leadership", async ({ page }) => {
    await page.goto("/website/whos-who", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Who's Who" }).first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: "test-results/whos-who.png", fullPage: true });
  });

  test("3. Schemes & Services Catalog", async ({ page }) => {
    await page.goto("/website/schemes-services", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Schemes & Services" }).first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: "test-results/schemes-services.png", fullPage: true });
  });

  test("4. Annual Reports Document Catalog", async ({ page }) => {
    await page.goto("/website/annual-reports", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Annual Reports" }).first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: "test-results/annual-reports.png", fullPage: true });
  });

  test("5. Organisation Detail Page (NCSC)", async ({ page }) => {
    await page.goto("/website/organisation/national-commission-for-scheduled-castes", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /National Commission for Scheduled Castes/i }).first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: "test-results/organisation-detail.png", fullPage: true });
  });

  test("6. Contact Us Directory", async ({ page }) => {
    await page.goto("/website/contact-us", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Contact Us" }).first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: "test-results/contact-us.png", fullPage: true });
  });

  test("7. Events Listing", async ({ page }) => {
    await page.goto("/website/events", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Events" }).first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: "test-results/events.png", fullPage: true });
  });

  test("8. Photo Gallery", async ({ page }) => {
    await page.goto("/website/gallery", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Gallery" }).first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: "test-results/gallery.png", fullPage: true });
  });

  test("9. Vacancies & Circulars", async ({ page }) => {
    await page.goto("/website/vacancies", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Vacancies" }).first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: "test-results/vacancies.png", fullPage: true });
  });

  test("10. Tenders & Procurements", async ({ page }) => {
    await page.goto("/website/tenders", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Tenders" }).first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: "test-results/tenders.png", fullPage: true });
  });
});
