import { test, expect } from '@playwright/test';
import { addStudents, configureClassroom, addNotTogetherConstraint } from './test-helpers';

test.describe('Undo/Redo Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Kartomat', level: 1 })).toBeVisible();
  });

  test('should have undo and redo buttons visible', async ({ page }) => {
    // Verify buttons exist
    await expect(page.getByRole('button', { name: 'Angre' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Gjør om' })).toBeVisible();
  });

  test('should have disabled undo/redo buttons initially', async ({ page }) => {
    // Both buttons should be disabled initially
    await expect(page.getByRole('button', { name: 'Angre' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Gjør om' })).toBeDisabled();
  });

  test('should enable undo button after adding a student', async ({ page }) => {
    const studentSection = page.getByRole('region', { name: 'Elever' });
    
    // Initially disabled
    await expect(page.getByRole('button', { name: 'Angre' })).toBeDisabled();
    
    // Add a student
    await addStudents(page, ['Alice']);
    
    // Undo button should now be enabled
    await expect(page.getByRole('button', { name: 'Angre' })).toBeEnabled();
    await expect(studentSection.getByText('Alice')).toBeVisible();
  });

  test('should undo adding a student using button', async ({ page }) => {
    const studentSection = page.getByRole('region', { name: 'Elever' });
    
    // Add a student
    await addStudents(page, ['Alice']);
    await expect(studentSection.getByText('Alice')).toBeVisible();
    
    // Click undo
    await page.getByRole('button', { name: 'Angre' }).click();
    
    // Student should be removed
    await expect(studentSection.getByText('Alice')).not.toBeVisible();
    
    // Undo button should be disabled again
    await expect(page.getByRole('button', { name: 'Angre' })).toBeDisabled();
    
    // Redo button should be enabled
    await expect(page.getByRole('button', { name: 'Gjør om' })).toBeEnabled();
  });

  test('should redo adding a student using button', async ({ page }) => {
    const studentSection = page.getByRole('region', { name: 'Elever' });
    
    // Add a student
    await addStudents(page, ['Alice']);
    
    // Undo
    await page.getByRole('button', { name: 'Angre' }).click();
    await expect(studentSection.getByText('Alice')).not.toBeVisible();
    
    // Redo
    await page.getByRole('button', { name: 'Gjør om' }).click();
    
    // Student should be back
    await expect(studentSection.getByText('Alice')).toBeVisible();
    
    // Redo button should be disabled
    await expect(page.getByRole('button', { name: 'Gjør om' })).toBeDisabled();
    
    // Undo button should be enabled
    await expect(page.getByRole('button', { name: 'Angre' })).toBeEnabled();
  });

  test('should undo adding a student using Ctrl+Z', async ({ page }) => {
    const studentSection = page.getByRole('region', { name: 'Elever' });
    
    // Add a student
    await addStudents(page, ['Bob']);
    await expect(studentSection.getByText('Bob')).toBeVisible();
    
    // Press Ctrl+Z
    await page.keyboard.press('Control+z');
    
    // Student should be removed
    await expect(studentSection.getByText('Bob')).not.toBeVisible();
  });

  test('should redo adding a student using Ctrl+Y', async ({ page }) => {
    const studentSection = page.getByRole('region', { name: 'Elever' });
    
    // Add a student
    await addStudents(page, ['Charlie']);
    
    // Undo with keyboard
    await page.keyboard.press('Control+z');
    await expect(studentSection.getByText('Charlie')).not.toBeVisible();
    
    // Redo with Ctrl+Y
    await page.keyboard.press('Control+y');
    
    // Student should be back
    await expect(studentSection.getByText('Charlie')).toBeVisible();
  });

  test('should redo adding a student using Ctrl+Shift+Z', async ({ page }) => {
    const studentSection = page.getByRole('region', { name: 'Elever' });
    
    // Add a student
    await addStudents(page, ['David']);
    
    // Undo
    await page.keyboard.press('Control+z');
    await expect(studentSection.getByText('David')).not.toBeVisible();
    
    // Redo with Ctrl+Shift+Z
    await page.keyboard.press('Control+Shift+Z');
    
    // Student should be back
    await expect(studentSection.getByText('David')).toBeVisible();
  });

  test('should undo/redo multiple actions', async ({ page }) => {
    const studentSection = page.getByRole('region', { name: 'Elever' });
    
    // Add three students
    await addStudents(page, ['Alice', 'Bob', 'Charlie']);
    await expect(studentSection.getByText('Alice')).toBeVisible();
    await expect(studentSection.getByText('Bob')).toBeVisible();
    await expect(studentSection.getByText('Charlie')).toBeVisible();
    
    // Undo once - Charlie should be removed
    await page.getByRole('button', { name: 'Angre' }).click();
    await expect(studentSection.getByText('Charlie')).not.toBeVisible();
    await expect(studentSection.getByText('Bob')).toBeVisible();
    
    // Undo again - Bob should be removed
    await page.getByRole('button', { name: 'Angre' }).click();
    await expect(studentSection.getByText('Bob')).not.toBeVisible();
    await expect(studentSection.getByText('Alice')).toBeVisible();
    
    // Redo once - Bob should be back
    await page.getByRole('button', { name: 'Gjør om' }).click();
    await expect(studentSection.getByText('Bob')).toBeVisible();
    
    // Redo again - Charlie should be back
    await page.getByRole('button', { name: 'Gjør om' }).click();
    await expect(studentSection.getByText('Charlie')).toBeVisible();
  });

  test('should undo/redo classroom configuration changes', async ({ page }) => {
    // Initial values should be 4 rows and 6 cols
    const rowsInput = page.getByRole('spinbutton', { name: 'Rader:' });
    const colsInput = page.getByRole('spinbutton', { name: 'Kolonner:' });
    
    await expect(rowsInput).toHaveValue('4');
    await expect(colsInput).toHaveValue('6');
    
    // Change classroom size
    await configureClassroom(page, 5, 8);
    await expect(rowsInput).toHaveValue('5');
    await expect(colsInput).toHaveValue('8');
    
    // Undo - should revert to 4x6
    await page.keyboard.press('Control+z');
    // Need to undo twice since we changed two fields
    await page.keyboard.press('Control+z');
    await expect(rowsInput).toHaveValue('4');
    await expect(colsInput).toHaveValue('6');
    
    // Redo - should go back to 5x8
    await page.keyboard.press('Control+y');
    await page.keyboard.press('Control+y');
    await expect(rowsInput).toHaveValue('5');
    await expect(colsInput).toHaveValue('8');
  });

  test('should undo/redo constraint additions', async ({ page }) => {
    const constraintSection = page.getByRole('region', { name: 'Begrensninger' });
    
    // Add students first
    await addStudents(page, ['Alice', 'Bob']);
    
    // Add a constraint
    await addNotTogetherConstraint(page, 'Alice', 'Bob');
    
    // Verify constraint is visible
    await expect(constraintSection.getByText(/Alice.*Bob.*ikke.*sammen/i)).toBeVisible();
    
    // Undo the constraint
    await page.keyboard.press('Control+z');
    
    // Constraint should be removed
    await expect(constraintSection.getByText(/Alice.*Bob.*ikke.*sammen/i)).not.toBeVisible();
    
    // Redo the constraint
    await page.keyboard.press('Control+y');
    
    // Constraint should be back
    await expect(constraintSection.getByText(/Alice.*Bob.*ikke.*sammen/i)).toBeVisible();
  });

  test('should clear redo history when new action is performed after undo', async ({ page }) => {
    const studentSection = page.getByRole('region', { name: 'Elever' });
    
    // Add Alice
    await addStudents(page, ['Alice']);
    
    // Undo
    await page.keyboard.press('Control+z');
    await expect(studentSection.getByText('Alice')).not.toBeVisible();
    
    // Redo button should be enabled
    await expect(page.getByRole('button', { name: 'Gjør om' })).toBeEnabled();
    
    // Add a different student (Bob) - this should clear redo history
    await addStudents(page, ['Bob']);
    await expect(studentSection.getByText('Bob')).toBeVisible();
    
    // Redo button should now be disabled
    await expect(page.getByRole('button', { name: 'Gjør om' })).toBeDisabled();
  });
});
