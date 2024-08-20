import { test, expect } from "@playwright/test";

test("form submission displays result", async ({ page }) => {
  await page.goto("http://localhost:5174");

  await page.waitForSelector('input[placeholder="Enter Url"]', {
    timeout: 10000,
  });

  await page.fill('input[name="url1"]', "https://www.google.com");
  await page.fill('input[name="url2"]', "https://www.facebook.com");
  await page.fill('input[name="url3"]', "https://www.twitter.com");

  await page.click('button[type="submit"]');

  await page.waitForSelector("a", { timeout: 10000 });

  const metadataUrls = await page.$$eval("a", (elements) =>
    elements.map((element) => element.textContent)
  );

  console.log(metadataUrls);

  expect(metadataUrls.length).toBe(3);
  expect(metadataUrls[0]).toEqual("1. https://www.google.com");
  expect(metadataUrls[1]).toEqual("2. https://www.facebook.com");
  expect(metadataUrls[2]).toEqual("3. https://www.twitter.com");
});
