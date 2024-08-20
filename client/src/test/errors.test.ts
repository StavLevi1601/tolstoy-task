import { test, expect } from "@playwright/test";

test.describe.serial("Form submission tests", () => {
  test("form submission displays error on empty fields", async ({ page }) => {
    await page.goto("http://localhost:5174");

    await page.click('button[type="submit"]');

    await page.waitForSelector('text="URL is required"', { timeout: 60000 });

    const errorMessages = await page.$$eval(
      'text="URL is required"',
      (elements) => elements.map((element) => element.textContent)
    );
    expect(errorMessages).toContain("URL is required");
  });
});
