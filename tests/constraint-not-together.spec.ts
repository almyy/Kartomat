import { test, expect } from '@playwright/test';
import { addStudents, configureClassroom, addNotTogetherConstraint, solveSeating, verifyStudentInSeating, getStudentPosition, areAdjacent } from './test-helpers';

test.describe('Not Together Constraint', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Kartomat', level: 1 })).toBeVisible();
  });

  test('should handle "Not Together" constraint', async ({ page }) => {
    await configureClassroom(page, 2, 2);
    await addStudents(page, ['Alice', 'Bob', 'Charlie']);
    
    // Add constraint: Alice and Bob should not be together
    await addNotTogetherConstraint(page, 'Alice', 'Bob');
    
    // Verify constraint is displayed
    await expect(page.getByText('Alice og Bob skal IKKE sitte sammen')).toBeVisible();
    
    await solveSeating(page);
    
    // Verify solution exists
    await verifyStudentInSeating(page, 'Alice');
    await verifyStudentInSeating(page, 'Bob');
    
    // Verify Alice and Bob are not adjacent
    const alicePos = await getStudentPosition(page, 'Alice');
    const bobPos = await getStudentPosition(page, 'Bob');
    
    expect(alicePos).not.toBeNull();
    expect(bobPos).not.toBeNull();
    
    if (alicePos && bobPos) {
      expect(areAdjacent(alicePos, bobPos)).toBe(false);
    }
  });

  test('should handle multiple "Not Together" constraints', async ({ page }) => {
    await configureClassroom(page, 2, 3);
    await addStudents(page, ['Alice', 'Bob', 'Charlie', 'David']);
    
    // Add multiple constraints
    await addNotTogetherConstraint(page, 'Alice', 'Bob');
    await addNotTogetherConstraint(page, 'Charlie', 'David');
    
    await solveSeating(page);
    
    // Verify all students are placed
    await verifyStudentInSeating(page, 'Alice');
    await verifyStudentInSeating(page, 'Bob');
    await verifyStudentInSeating(page, 'Charlie');
    await verifyStudentInSeating(page, 'David');
    
    // Verify constraints are satisfied
    const alicePos = await getStudentPosition(page, 'Alice');
    const bobPos = await getStudentPosition(page, 'Bob');
    const charliePos = await getStudentPosition(page, 'Charlie');
    const davidPos = await getStudentPosition(page, 'David');
    
    if (alicePos && bobPos) {
      expect(areAdjacent(alicePos, bobPos)).toBe(false);
    }
    if (charliePos && davidPos) {
      expect(areAdjacent(charliePos, davidPos)).toBe(false);
    }
  });
});
