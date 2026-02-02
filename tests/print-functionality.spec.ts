import { test, expect } from "@playwright/test";
import { addStudents, solveSeating } from "./test-helpers";

test.describe("Print functionality", () => {
  test("print button appears after generating seating", async ({ page }) => {
    await page.goto("/Kartomat");

    // Add students and generate seating
    await addStudents(page, ["Anna", "Bjørn", "Carl", "Diana"]);
    await solveSeating(page);

    // Check that print button is visible
    const printButton = page.getByRole("button", { name: /skriv ut|print/i });
    await expect(printButton).toBeVisible();
  });

  test("print styles hide non-seating elements", async ({ page }) => {
    await page.goto("/Kartomat");

    // Add students and generate seating
    await addStudents(page, ["Anna", "Bjørn", "Carl", "Diana"]);
    await solveSeating(page);

    // Emulate print media
    await page.emulateMedia({ media: "print" });

    // Check that UI elements are hidden in print mode
    const header = page.locator("h1");
    await expect(header).not.toBeVisible();

    // Check that undo/redo buttons are hidden
    const undoButton = page.getByRole("button", { name: /angre|undo/i });
    await expect(undoButton).not.toBeVisible();

    // Check that seating arrangement is still visible
    const seatingArrangement = page.locator("#seating-arrangement");
    await expect(seatingArrangement).toBeVisible();
  });

  test("seating arrangement is the only visible content in print mode", async ({
    page,
  }) => {
    await page.goto("/Kartomat");

    // Add students and generate seating
    await addStudents(page, ["Anna", "Bjørn", "Carl"]);
    await solveSeating(page);

    // Emulate print media
    await page.emulateMedia({ media: "print" });

    // Verify seating arrangement exists
    const seatingArrangement = page.locator("#seating-arrangement");
    await expect(seatingArrangement).toBeVisible();

    // Verify student names appear in the seats
    await expect(seatingArrangement).toContainText("Anna");
    await expect(seatingArrangement).toContainText("Bjørn");
    await expect(seatingArrangement).toContainText("Carl");
  });
});
