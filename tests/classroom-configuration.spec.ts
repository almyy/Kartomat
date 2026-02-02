import { test, expect } from "@playwright/test";
import {
  addStudents,
  configureClassroom,
  solveSeating,
  verifyStudentInSeating,
  getStudentPosition,
} from "./test-helpers";

test.describe("Classroom Configuration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Kartomat", level: 1 }),
    ).toBeVisible();
  });

  test("should solve a simple 2x2 classroom with 3 students", async ({
    page,
  }) => {
    await configureClassroom(page, 2, 2);
    await addStudents(page, ["Alice", "Bob", "Charlie"]);

    await solveSeating(page);

    // Verify all students are placed
    await verifyStudentInSeating(page, "Alice");
    await verifyStudentInSeating(page, "Bob");
    await verifyStudentInSeating(page, "Charlie");
  });

  test("should solve a 3x3 classroom with 5 students", async ({ page }) => {
    await configureClassroom(page, 3, 3);
    await addStudents(page, ["Alice", "Bob", "Charlie", "David", "Eve"]);

    await solveSeating(page);

    // Verify all students are placed
    await verifyStudentInSeating(page, "Alice");
    await verifyStudentInSeating(page, "Bob");
    await verifyStudentInSeating(page, "Charlie");
    await verifyStudentInSeating(page, "David");
    await verifyStudentInSeating(page, "Eve");
  });

  test("should solve a 4x4 classroom with 10 students", async ({ page }) => {
    await configureClassroom(page, 4, 4);
    await addStudents(page, [
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
      "Grace",
      "Henry",
      "Ivy",
      "Jack",
    ]);

    await solveSeating(page);

    // Verify all students are placed
    for (const name of [
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
      "Grace",
      "Henry",
      "Ivy",
      "Jack",
    ]) {
      await verifyStudentInSeating(page, name);
    }
  });

  test("should solve a 3x4 rectangular classroom", async ({ page }) => {
    await configureClassroom(page, 3, 4);
    await addStudents(page, ["A", "B", "C", "D", "E", "F", "G", "H"]);

    await solveSeating(page);

    // Verify all students are placed
    for (const name of ["A", "B", "C", "D", "E", "F", "G", "H"]) {
      await verifyStudentInSeating(page, name);
    }
  });

  test("should handle single row classroom", async ({ page }) => {
    await configureClassroom(page, 1, 5);
    await addStudents(page, ["Alice", "Bob", "Charlie"]);

    await solveSeating(page);

    // Verify all students are in row 0
    for (const name of ["Alice", "Bob", "Charlie"]) {
      await verifyStudentInSeating(page, name);
      const pos = await getStudentPosition(page, name);
      expect(pos?.row).toBe(0);
    }
  });

  test("should handle single column classroom", async ({ page }) => {
    await configureClassroom(page, 5, 1);
    await addStudents(page, ["Alice", "Bob", "Charlie"]);

    await solveSeating(page);

    // Verify all students are in column 0
    for (const name of ["Alice", "Bob", "Charlie"]) {
      await verifyStudentInSeating(page, name);
      const pos = await getStudentPosition(page, name);
      expect(pos?.col).toBe(0);
    }
  });

  test("should handle 10x10 large classroom", async ({ page }) => {
    await configureClassroom(page, 10, 10);
    await addStudents(page, [
      "A1",
      "A2",
      "A3",
      "A4",
      "A5",
      "B1",
      "B2",
      "B3",
      "B4",
      "B5",
    ]);

    await solveSeating(page);

    // Verify all students are placed
    for (const name of [
      "A1",
      "A2",
      "A3",
      "A4",
      "A5",
      "B1",
      "B2",
      "B3",
      "B4",
      "B5",
    ]) {
      await verifyStudentInSeating(page, name);
    }
  });
});
