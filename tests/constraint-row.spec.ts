import { test, expect } from '@playwright/test';
import { addStudents, configureClassroom, addRowConstraint, solveSeating, getStudentPosition } from './test-helpers';

test.describe('Must Be In Row Constraint', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Kartomat', level: 1 })).toBeVisible();
  });

  test('should handle "Must Be In Row" constraint', async ({ page }) => {
    await configureClassroom(page, 3, 3);
    await addStudents(page, ['Alice', 'Bob', 'Charlie']);
    
    // Add constraint: Alice must be in row 1
    await addRowConstraint(page, 'Alice', 1);
    
    // Verify constraint is displayed
    await expect(page.getByText('Alice må sitte i rad 1')).toBeVisible();
    
    await solveSeating(page);
    
    // Verify Alice is in row 1
    const alicePos = await getStudentPosition(page, 'Alice');
    expect(alicePos).not.toBeNull();
    expect(alicePos?.row).toBe(1);
  });

  test('should handle multiple row constraints', async ({ page }) => {
    await configureClassroom(page, 4, 3);
    await addStudents(page, ['Alice', 'Bob', 'Charlie', 'David', 'Eve']);
    
    await addRowConstraint(page, 'Alice', 0);
    await addRowConstraint(page, 'Bob', 1);
    await addRowConstraint(page, 'Charlie', 2);
    
    await solveSeating(page);
    
    // Verify row constraints
    const alicePos = await getStudentPosition(page, 'Alice');
    const bobPos = await getStudentPosition(page, 'Bob');
    const charliePos = await getStudentPosition(page, 'Charlie');
    
    expect(alicePos?.row).toBe(0);
    expect(bobPos?.row).toBe(1);
    expect(charliePos?.row).toBe(2);
  });
});
