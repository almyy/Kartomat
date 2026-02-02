import { test, expect } from "@playwright/test";
import {
  addStudents,
  configureClassroom,
  addTogetherConstraint,
  solveSeating,
  verifyStudentInSeating,
  getStudentPosition,
  areAdjacent,
} from "./test-helpers";

test.describe("Must Be Together Constraint", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Kartomat", level: 1 }),
    ).toBeVisible();
  });

  test('should handle "Must Be Together" constraint', async ({ page }) => {
    await configureClassroom(page, 2, 3);
    await addStudents(page, ["Alice", "Bob", "Charlie", "David"]);

    // Add constraint: Alice and Bob must be together
    await addTogetherConstraint(page, "Alice", "Bob");

    // Verify constraint is displayed
    await expect(page.getByText("Alice og Bob MÅ sitte sammen")).toBeVisible();

    await solveSeating(page);

    // Verify solution exists
    await verifyStudentInSeating(page, "Alice");
    await verifyStudentInSeating(page, "Bob");

    // Verify Alice and Bob are adjacent
    const alicePos = await getStudentPosition(page, "Alice");
    const bobPos = await getStudentPosition(page, "Bob");

    expect(alicePos).not.toBeNull();
    expect(bobPos).not.toBeNull();

    if (alicePos && bobPos) {
      expect(areAdjacent(alicePos, bobPos)).toBe(true);
    }
  });

  test("should handle conflicting together constraints with solution", async ({
    page,
  }) => {
    await configureClassroom(page, 2, 3);
    await addStudents(page, ["Alice", "Bob", "Charlie"]);

    // Chain constraints: Alice-Bob together, Bob-Charlie together
    await addTogetherConstraint(page, "Alice", "Bob");
    await addTogetherConstraint(page, "Bob", "Charlie");

    await solveSeating(page);

    // Should find a solution where all three are in a line
    await verifyStudentInSeating(page, "Alice");
    await verifyStudentInSeating(page, "Bob");
    await verifyStudentInSeating(page, "Charlie");

    const alicePos = await getStudentPosition(page, "Alice");
    const bobPos = await getStudentPosition(page, "Bob");
    const charliePos = await getStudentPosition(page, "Charlie");

    // Verify Alice-Bob are adjacent
    if (alicePos && bobPos) {
      expect(areAdjacent(alicePos, bobPos)).toBe(true);
    }

    // Verify Bob-Charlie are adjacent
    if (bobPos && charliePos) {
      expect(areAdjacent(bobPos, charliePos)).toBe(true);
    }
  });
});
