import { test, expect } from "@playwright/test";

test("ShopSphere AI homepage should open", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "ShopSphere AI" })
  ).toBeVisible();
});