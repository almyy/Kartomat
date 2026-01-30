import { test, expect } from '@playwright/test';
import { addStudents } from './test-helpers';

test.describe('Student Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Kartomat', level: 1 })).toBeVisible();
  });

  test('should add and remove students', async ({ page }) => {
    // Add students
    await addStudents(page, ['Alice', 'Bob', 'Charlie']);

    // Verify students are displayed in the student list area (not constraints or seating)
    const studentSection = page.getByRole('region', { name: 'Elever' });
    await expect(studentSection.getByText('Alice')).toBeVisible();
    await expect(studentSection.getByText('Bob')).toBeVisible();
    await expect(studentSection.getByText('Charlie')).toBeVisible();

    // Remove a student
    await page.getByRole('button', { name: 'Fjern Alice' }).click();
    await expect(studentSection.getByText('Alice')).not.toBeVisible();
  });
});
