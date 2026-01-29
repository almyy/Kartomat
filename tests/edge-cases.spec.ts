import { test, expect } from '@playwright/test';
import { addStudents, configureClassroom, solveSeating, verifyStudentInSeating } from './test-helpers';

test.describe('Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Kartomat', level: 1 })).toBeVisible();
  });

  test('should handle not enough seats', async ({ page }) => {
    await configureClassroom(page, 2, 2);
    await addStudents(page, ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank']);

    await solveSeating(page);

    // Should show error message
    const errorMessage = page.locator('.bg-red-500\\/20');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Not enough available seats for all students');
  });

  test('should handle a full classroom (all seats filled)', async ({ page }) => {
    await configureClassroom(page, 2, 2);
    await addStudents(page, ['Alice', 'Bob', 'Charlie', 'David']);

    await solveSeating(page);

    // Verify all 4 students are placed in a 2x2 grid
    for (const name of ['Alice', 'Bob', 'Charlie', 'David']) {
      await verifyStudentInSeating(page, name);
    }

    // Count filled seats only in the seating display area
    const seatingDisplay = page.getByRole('region', { name: 'Klassekart' });
    const filledSeats = await seatingDisplay.locator('.flex-1.min-h-\\[50px\\]').filter({ hasText: /.+/ }).count();
    expect(filledSeats).toBe(4);
  });

  test('should remove constraints when clicking remove button', async ({ page }) => {
    await configureClassroom(page, 3, 3);
    await addStudents(page, ['Alice', 'Bob', 'Charlie']);

    // We need to manually add a constraint via UI since we're testing the remove button
    await page.getByLabel('Begrensningstype').selectOption('not_together');
    await page.locator('#pair-student1').selectOption('Alice');
    await page.locator('#pair-student2').selectOption('Bob');
    await page.getByRole('button', { name: 'Legg til begrensning' }).click();
    // Verify constraint is displayed (Norwegian text)
    await expect(page.getByText('Alice og Bob skal IKKE sitte sammen')).toBeVisible();
    // Remove the constraint
    await page.getByRole('button', { name: 'Fjern begrensning' }).click({force: true});
    // Verify constraint is removed
    await expect(page.getByText('Alice og Bob skal IKKE sitte sammen')).not.toBeVisible();
  });

  test('should handle exact fit scenario', async ({ page }) => {
    await configureClassroom(page, 3, 3);
    await addStudents(page, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);

    await solveSeating(page);

    // All 9 seats should be filled - only count in seating display
    const seatingDisplay = page.getByRole('region', { name: 'Klassekart' });
    const filledSeats = await seatingDisplay.locator('.flex-1.min-h-\\[50px\\]').filter({ hasText: /.+/ }).count();
    expect(filledSeats).toBe(9);
  });

  test('should handle single student', async ({ page }) => {
    await configureClassroom(page, 2, 2);
    await addStudents(page, ['Alice']);

    await solveSeating(page);

    await verifyStudentInSeating(page, 'Alice');
  });

  test('should handle empty classroom with students but no solve', async ({ page }) => {
    await configureClassroom(page, 3, 3);
    await addStudents(page, ['Alice', 'Bob']);

    // Don't solve, just verify UI state
    await expect(page.getByRole('button', { name: 'Generer Klassekart' })).toBeEnabled();

    // Seating display should show placeholder (Norwegian text)
    await expect(page.getByText('Legg til elever og begrensninger')).toBeVisible();
  });
});
