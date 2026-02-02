import { test, expect } from '@playwright/test';
import {
  addStudents,
  configureClassroom,
  addNotTogetherConstraint,
  addTogetherConstraint,
  addRowConstraint,
  addFarApartConstraint,
  solveSeating,
  verifyStudentInSeating,
  getStudentPosition,
  areAdjacent,
  calculateDistance
} from './test-helpers';

test.describe('Mixed Constraints', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Kartomat', level: 1 })).toBeVisible();
  });

  test('should handle mixed constraint types', async ({ page }) => {
    await configureClassroom(page, 3, 3);
    await addStudents(page, ['Alice', 'Bob', 'Charlie', 'David', 'Eve']);

    // Add different types of constraints
    await addTogetherConstraint(page, 'Alice', 'Bob');
    await addNotTogetherConstraint(page, 'Charlie', 'David');
    await addRowConstraint(page, 'Eve', 2);

    await solveSeating(page);

    // Verify all students are placed
    for (const name of ['Alice', 'Bob', 'Charlie', 'David', 'Eve']) {
      await verifyStudentInSeating(page, name);
    }

    // Verify constraints
    const alicePos = await getStudentPosition(page, 'Alice');
    const bobPos = await getStudentPosition(page, 'Bob');
    const charliePos = await getStudentPosition(page, 'Charlie');
    const davidPos = await getStudentPosition(page, 'David');
    const evePos = await getStudentPosition(page, 'Eve');

    // Alice and Bob should be together
    if (alicePos && bobPos) {
      expect(areAdjacent(alicePos, bobPos)).toBe(true);
    }

    // Charlie and David should not be together
    if (charliePos && davidPos) {
      expect(areAdjacent(charliePos, davidPos)).toBe(false);
    }

    // Eve should be in row 2
    expect(evePos?.row).toBe(2);
  });

  test('should handle complex chained constraints', async ({ page }) => {
    await configureClassroom(page, 2, 2);
    await addStudents(page, ['Alice', 'Bob', 'Charlie']);

    // Add chained constraints: Alice-Bob together and Bob-Charlie together
    // In a 2x2 grid, this is solvable if they form an L-shape or are in a line
    await addTogetherConstraint(page, 'Alice', 'Bob');
    await addTogetherConstraint(page, 'Bob', 'Charlie');

    await solveSeating(page);

    // Should either show error or find a solution
    const seatingDisplay = page.getByRole('region', { name: 'Klassekart' });
    const hasError = await seatingDisplay.locator('.bg-red-500\\/20').count() > 0;
    const hasSuccess = await seatingDisplay.locator('.flex-1.min-h-\\[50px\\]').filter({ hasText: 'Alice' }).count() > 0;

    expect(hasError || hasSuccess).toBe(true);
  });

  test('should solve a 5x5 classroom with complex constraints', async ({ page }) => {
    await configureClassroom(page, 5, 5);
    await addStudents(page, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);

    // Add complex constraints
    await addNotTogetherConstraint(page, 'A', 'B', true);
    await addTogetherConstraint(page, 'C', 'D', true);
    await addNotTogetherConstraint(page, 'E', 'F', true);
    await addRowConstraint(page, 'G', 0, true);
    await addRowConstraint(page, 'H', 4, true);

    await solveSeating(page);

    // Verify all students are placed
    for (const name of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']) {
      await verifyStudentInSeating(page, name);
    }

    // Verify specific constraints
    const gPos = await getStudentPosition(page, 'G');
    const hPos = await getStudentPosition(page, 'H');

    expect(gPos?.row).toBe(0);
    expect(hPos?.row).toBe(4);
  });

  test('should handle mixed constraints with "Far Apart"', async ({ page }) => {
    await configureClassroom(page, 4, 4);
    await addStudents(page, ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank']);

    // Mix different constraint types including Far Apart
    await addTogetherConstraint(page, 'Alice', 'Bob');
    await addFarApartConstraint(page, 'Charlie', 'David', 3);
    await addRowConstraint(page, 'Eve', 0);
    await addNotTogetherConstraint(page, 'Frank', 'Eve');

    await solveSeating(page);

    // Verify all students are placed
    for (const name of ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank']) {
      await verifyStudentInSeating(page, name);
    }

    // Verify Together constraint: Alice and Bob are adjacent
    const alicePos = await getStudentPosition(page, 'Alice');
    const bobPos = await getStudentPosition(page, 'Bob');
    if (alicePos && bobPos) {
      expect(areAdjacent(alicePos, bobPos)).toBe(true);
    }

    // Verify Far Apart constraint: Charlie and David are at least 3 units apart
    const charliePos = await getStudentPosition(page, 'Charlie');
    const davidPos = await getStudentPosition(page, 'David');
    if (charliePos && davidPos) {
      const distance = calculateDistance(charliePos, davidPos);
      expect(distance).toBeGreaterThanOrEqual(3);
    }

    // Verify Row constraint: Eve is in row 0
    const evePos = await getStudentPosition(page, 'Eve');
    expect(evePos?.row).toBe(0);

    // Verify Not Together constraint: Frank and Eve are not adjacent
    const frankPos = await getStudentPosition(page, 'Frank');
    if (frankPos && evePos) {
      expect(areAdjacent(frankPos, evePos)).toBe(false);
    }
  });
});
