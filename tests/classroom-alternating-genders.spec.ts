import { test, expect } from "@playwright/test";
import { configureClassroom } from "./test-helpers";

test.describe("Classroom Alternating Genders", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Kartomat", level: 1 }),
    ).toBeVisible();
  });

  test("should alternate genders in seats when button is clicked", async ({
    page,
  }) => {
    // Configure a 3x3 classroom
    await configureClassroom(page, 3, 3);

    // Click the alternate button
    await page.getByRole("button", { name: /Annenhvert|alternate/i }).click();

    // Get all seat buttons (excluding the button we just clicked)
    const classroomRegion = page.getByRole("region", {
      name: /klasserom|classroom/i,
    });
    const seatButtons = classroomRegion.locator(
      'button[title*="Tilgjengelig sete"], button[title*="Available seat"]',
    );

    // Verify we have 9 seats
    await expect(seatButtons).toHaveCount(9);

    // Check the pattern: should alternate ♀ and ♂
    const expectedPattern = ["♀", "♂", "♀", "♂", "♀", "♂", "♀", "♂", "♀"];

    for (let i = 0; i < 9; i++) {
      const seatContent = await seatButtons.nth(i).textContent();
      expect(seatContent?.trim()).toBe(expectedPattern[i]);
    }
  });

  test("should skip disabled seats when alternating", async ({ page }) => {
    // Configure a 2x3 classroom
    await configureClassroom(page, 2, 3);

    const classroomRegion = page.getByRole("region", {
      name: /klasserom|classroom/i,
    });
    const seatButtons = classroomRegion.locator("button.aspect-square");

    // Disable some seats by clicking them until they show off state
    // Click the middle seat 3 times to cycle: n -> m -> f -> off
    await seatButtons.nth(1).click();
    await page.waitForTimeout(150); // Wait for throttle
    await seatButtons.nth(1).click();
    await page.waitForTimeout(150);
    await seatButtons.nth(1).click();
    await page.waitForTimeout(150);

    // Verify seat 1 is now disabled (off state)
    const seat1Title = await seatButtons.nth(1).getAttribute("title");
    expect(seat1Title).toMatch(/tom plass|empty space/i);

    // Click the last seat 3 times to cycle to off
    await seatButtons.nth(5).click();
    await page.waitForTimeout(150);
    await seatButtons.nth(5).click();
    await page.waitForTimeout(150);
    await seatButtons.nth(5).click();
    await page.waitForTimeout(150);

    // Verify seat 5 is now disabled (off state)
    const seat5Title = await seatButtons.nth(5).getAttribute("title");
    expect(seat5Title).toMatch(/tom plass|empty space/i);

    // Now click the alternate button
    await page.getByRole("button", { name: /Annenhvert|alternate/i }).click();

    // Check that only non-disabled seats have gender icons
    // Seats 0, 2, 3, 4 should have alternating ♀, ♂, ♀, ♂
    const seat0 = await seatButtons.nth(0).textContent();
    expect(seat0?.trim()).toBe("♀");

    const seat1 = await seatButtons.nth(1).textContent();
    expect(seat1?.trim()).toBe(""); // disabled seat

    const seat2 = await seatButtons.nth(2).textContent();
    expect(seat2?.trim()).toBe("♂");

    const seat3 = await seatButtons.nth(3).textContent();
    expect(seat3?.trim()).toBe("♀");

    const seat4 = await seatButtons.nth(4).textContent();
    expect(seat4?.trim()).toBe("♂");

    const seat5 = await seatButtons.nth(5).textContent();
    expect(seat5?.trim()).toBe(""); // disabled seat
  });

  test("should maintain alternating pattern after multiple clicks", async ({
    page,
  }) => {
    // Configure a 2x2 classroom
    await configureClassroom(page, 2, 2);

    const classroomRegion = page.getByRole("region", {
      name: /klasserom|classroom/i,
    });

    // Click alternate button multiple times
    const alternateButton = page.getByRole("button", {
      name: /Annenhvert|alternate/i,
    });
    await alternateButton.click();
    await alternateButton.click();

    // Pattern should still be consistent
    const seatButtons = classroomRegion.locator("button.aspect-square");
    const expectedPattern = ["♀", "♂", "♀", "♂"];

    for (let i = 0; i < 4; i++) {
      const seatContent = await seatButtons.nth(i).textContent();
      expect(seatContent?.trim()).toBe(expectedPattern[i]);
    }
  });
});
