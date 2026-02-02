import { test, expect } from "@playwright/test";

test.describe("UI Components", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Kartomat", level: 1 }),
    ).toBeVisible();
  });

  test("should display the main UI elements", async ({ page }) => {
    // Check for main components
    await expect(
      page.getByRole("heading", { name: "Elever", level: 2 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Klasserom", level: 2 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Begrensninger", level: 2 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Klassekart", level: 2 }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Generer Klassekart" }),
    ).toBeVisible();
  });
});
