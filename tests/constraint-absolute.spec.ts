import { test, expect } from '@playwright/test';
import {
  addStudents,
  configureClassroom,
  addAbsoluteConstraint,
  solveSeating,
  getStudentPosition,
  selectMantineOption
} from './test-helpers';

test.describe('Absolute Placement Constraint', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Kartomat', level: 1 })).toBeVisible();
  });

  test('should handle "Absolute Placement" constraint', async ({ page }) => {
    await configureClassroom(page, 3, 3);
    await addStudents(page, ['Alice', 'Bob', 'Charlie']);
    
    // Add constraint: Alice must be at row 1, col 2
    await addAbsoluteConstraint(page, 'Alice', 1, 2);
    
    // Verify constraint is displayed
    await expect(page.getByText('Alice må sitte på rad 1, kolonne 2')).toBeVisible();
    
    await solveSeating(page);
    
    // Verify Alice is at the exact position
    const alicePos = await getStudentPosition(page, 'Alice');
    expect(alicePos).not.toBeNull();
    expect(alicePos?.row).toBe(1);
    expect(alicePos?.col).toBe(2);
  });

  test('should handle multiple absolute constraints', async ({ page }) => {
    await configureClassroom(page, 4, 3);
    await addStudents(page, ['Alice', 'Bob', 'Charlie', 'David', 'Eve']);
    
    await addAbsoluteConstraint(page, 'Alice', 0, 0);
    await addAbsoluteConstraint(page, 'Bob', 1, 1);
    await addAbsoluteConstraint(page, 'Charlie', 2, 2);
    
    await solveSeating(page);
    
    // Verify absolute constraints
    const alicePos = await getStudentPosition(page, 'Alice');
    const bobPos = await getStudentPosition(page, 'Bob');
    const charliePos = await getStudentPosition(page, 'Charlie');
    
    expect(alicePos?.row).toBe(0);
    expect(alicePos?.col).toBe(0);
    expect(bobPos?.row).toBe(1);
    expect(bobPos?.col).toBe(1);
    expect(charliePos?.row).toBe(2);
    expect(charliePos?.col).toBe(2);
  });

  test('should prioritize absolute constraint over row constraint', async ({ page }) => {
    await configureClassroom(page, 3, 3);
    await addStudents(page, ['Alice', 'Bob']);
    
    // Add absolute constraint for Alice at row 1, col 1
    await addAbsoluteConstraint(page, 'Alice', 1, 1);
    
    // Add conflicting row constraint for Alice (row 0)
    await selectMantineOption(page, 'Begrensningstype', /Må være i rad|must be in row/i);
    await selectMantineOption(page, 'Velg elev', 'Alice');

    const rowConstraintInput = page.getByPlaceholder('Radnummer');
    await rowConstraintInput.fill('0');
    await page.getByRole('button', { name: 'Legg til begrensning' }).click();
    
    await solveSeating(page);
    
    // Verify that solving failed due to conflicting constraints
    await expect(page.locator('.bg-red-500\\/20')).toBeVisible();
  });

  test('should fail when absolute constraints conflict', async ({ page }) => {
    await configureClassroom(page, 2, 2);
    await addStudents(page, ['Alice', 'Bob']);
    
    // Add conflicting absolute constraints (both at same position)
    await addAbsoluteConstraint(page, 'Alice', 0, 0);
    await addAbsoluteConstraint(page, 'Bob', 0, 0);
    
    await solveSeating(page);
    
    // Verify that solving failed
    await expect(page.locator('.bg-red-500\\/20')).toBeVisible();
  });

  test('should work with absolute and together constraints', async ({ page }) => {
    await configureClassroom(page, 3, 3);
    await addStudents(page, ['Alice', 'Bob', 'Charlie']);
    
    // Add absolute constraint for Alice at row 1, col 1
    await addAbsoluteConstraint(page, 'Alice', 1, 1);
    
    // Add together constraint for Alice and Bob
    await selectMantineOption(page, 'Begrensningstype', /Må være sammen|Must be together/i);
    await selectMantineOption(page, 'Velg elev 1', 'Alice');
    await selectMantineOption(page, 'Velg elev 2', 'Bob');

    await page.getByRole('button', { name: 'Legg til begrensning' }).click();
    
    await solveSeating(page);
    
    // Verify Alice is at exact position
    const alicePos = await getStudentPosition(page, 'Alice');
    expect(alicePos?.row).toBe(1);
    expect(alicePos?.col).toBe(1);
    
    // Verify Bob is adjacent to Alice
    const bobPos = await getStudentPosition(page, 'Bob');
    expect(bobPos).not.toBeNull();
    
    if (alicePos && bobPos) {
      const rowDiff = Math.abs(alicePos.row - bobPos.row);
      const colDiff = Math.abs(alicePos.col - bobPos.col);
      const isAdjacent = (rowDiff === 0 && colDiff === 1) || (rowDiff === 1 && colDiff === 0);
      expect(isAdjacent).toBe(true);
    }
  });

  test('should handle absolute constraint at corner positions', async ({ page }) => {
    await configureClassroom(page, 3, 3);
    await addStudents(page, ['Alice', 'Bob', 'Charlie', 'David']);
    
    // Test all corners
    await addAbsoluteConstraint(page, 'Alice', 0, 0); // Top-left
    await addAbsoluteConstraint(page, 'Bob', 0, 2);   // Top-right
    await addAbsoluteConstraint(page, 'Charlie', 2, 0); // Bottom-left
    await addAbsoluteConstraint(page, 'David', 2, 2);   // Bottom-right
    
    await solveSeating(page);
    
    const alicePos = await getStudentPosition(page, 'Alice');
    const bobPos = await getStudentPosition(page, 'Bob');
    const charliePos = await getStudentPosition(page, 'Charlie');
    const davidPos = await getStudentPosition(page, 'David');
    
    expect(alicePos?.row).toBe(0);
    expect(alicePos?.col).toBe(0);
    expect(bobPos?.row).toBe(0);
    expect(bobPos?.col).toBe(2);
    expect(charliePos?.row).toBe(2);
    expect(charliePos?.col).toBe(0);
    expect(davidPos?.row).toBe(2);
    expect(davidPos?.col).toBe(2);
  });
});
