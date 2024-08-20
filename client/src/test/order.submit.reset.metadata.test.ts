import { test, expect } from "@playwright/test";

test("form submission displays results in the correct order", async ({
  page,
}) => {
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

  expect(metadataUrls.length).toBe(3);
  expect(metadataUrls[0]).toContain("https://www.google.com");
  expect(metadataUrls[1]).toContain("https://www.facebook.com");
  expect(metadataUrls[2]).toContain("https://www.twitter.com");

  expect(metadataUrls.length).toBe(3);
  expect(metadataUrls[0]).toEqual("1. https://www.google.com");
  expect(metadataUrls[1]).toEqual("2. https://www.facebook.com");
  expect(metadataUrls[2]).toEqual("3. https://www.twitter.com");

  // reset
  const url1 = await page.inputValue('input[name="url1"]');
  const url2 = await page.inputValue('input[name="url2"]');
  const url3 = await page.inputValue('input[name="url3"]');

  expect(url1).toBe("");
  expect(url2).toBe("");
  expect(url3).toBe("");

  // metadata

  const metadataCards = await page.$$(".metadata-card");

  for (const card of metadataCards) {
    const title = await card.$eval(".metadata-title", (el) => el.textContent);
    const description = await card.$eval(
      ".metadata-description",
      (el) => el.textContent
    );
    const image = await card.$(".metadata-image");

    expect(title).not.toBeNull();
    expect(description).not.toBeNull();

    if (image) {
      const imageUrl = await image.getAttribute("src");
      expect(imageUrl).not.toBeNull();
    }
  }
});
