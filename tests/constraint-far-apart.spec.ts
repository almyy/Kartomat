import { test, expect } from '@playwright/test';
import { addStudents, configureClassroom, addFarApartConstraint, solveSeating, verifyStudentInSeating, getStudentPosition, areAdjacent, calculateDistance } from './test-helpers';

test.describe('Far Apart Constraint', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Kartomat', level: 1 })).toBeVisible();
  });

  test('should handle "Far Apart" constraint', async ({ page }) => {
    await configureClassroom(page, 3, 4);
    await addStudents(page, ['Alice', 'Bob', 'Charlie', 'David']);
    
    // Add constraint: Alice and Bob must be at least 3 units apart
    await addFarApartConstraint(page, 'Alice', 'Bob', 3);
    
    // Verify constraint is displayed
    await expect(page.getByText('Alice og Bob må sitte minst 3 enheter fra hverandre')).toBeVisible();
    
    await solveSeating(page);
    
    // Verify solution exists
    await verifyStudentInSeating(page, 'Alice');
    await verifyStudentInSeating(page, 'Bob');
    
    // Verify Alice and Bob are at least 3 units apart
    const alicePos = await getStudentPosition(page, 'Alice');
    const bobPos = await getStudentPosition(page, 'Bob');
    
    expect(alicePos).not.toBeNull();
    expect(bobPos).not.toBeNull();
    
    if (alicePos && bobPos) {
      const distance = calculateDistance(alicePos, bobPos);
      expect(distance).toBeGreaterThanOrEqual(3);
    }
  });

  test('should handle multiple "Far Apart" constraints', async ({ page }) => {
    await configureClassroom(page, 4, 4);
    await addStudents(page, ['Alice', 'Bob', 'Charlie', 'David', 'Eve']);
    
    // Add multiple far apart constraints
    await addFarApartConstraint(page, 'Alice', 'Bob', 3);
    await addFarApartConstraint(page, 'Charlie', 'David', 2);
    
    await solveSeating(page);
    
    // Verify all students are placed
    for (const name of ['Alice', 'Bob', 'Charlie', 'David', 'Eve']) {
      await verifyStudentInSeating(page, name);
    }
    
    // Verify first constraint: Alice and Bob are at least 3 units apart
    const alicePos = await getStudentPosition(page, 'Alice');
    const bobPos = await getStudentPosition(page, 'Bob');
    
    if (alicePos && bobPos) {
      const distance = calculateDistance(alicePos, bobPos);
      expect(distance).toBeGreaterThanOrEqual(3);
    }
    
    // Verify second constraint: Charlie and David are at least 2 units apart
    const charliePos = await getStudentPosition(page, 'Charlie');
    const davidPos = await getStudentPosition(page, 'David');
    
    if (charliePos && davidPos) {
      const distance = calculateDistance(charliePos, davidPos);
      expect(distance).toBeGreaterThanOrEqual(2);
    }
  });

  test('should handle "Far Apart" with small distance', async ({ page }) => {
    await configureClassroom(page, 3, 3);
    await addStudents(page, ['Alice', 'Bob', 'Charlie']);
    
    // Add constraint: Alice and Bob must be at least 1.5 units apart (slightly more than adjacent)
    await addFarApartConstraint(page, 'Alice', 'Bob', 1.5);
    
    await solveSeating(page);
    
    await verifyStudentInSeating(page, 'Alice');
    await verifyStudentInSeating(page, 'Bob');
    
    const alicePos = await getStudentPosition(page, 'Alice');
    const bobPos = await getStudentPosition(page, 'Bob');
    
    if (alicePos && bobPos) {
      const distance = calculateDistance(alicePos, bobPos);
      expect(distance).toBeGreaterThanOrEqual(1.5);
      // They should not be adjacent (distance 1)
      expect(areAdjacent(alicePos, bobPos)).toBe(false);
    }
  });

  test('should handle "Far Apart" with maximum distance', async ({ page }) => {
    await configureClassroom(page, 3, 5);
    await addStudents(page, ['Alice', 'Bob', 'Charlie']);
    
    // Add constraint requiring maximum possible distance in a 3x5 grid
    // Max distance is from (0,0) to (2,4) = sqrt(4 + 16) = sqrt(20) ≈ 4.47
    await addFarApartConstraint(page, 'Alice', 'Bob', 4);
    
    await solveSeating(page);
    
    await verifyStudentInSeating(page, 'Alice');
    await verifyStudentInSeating(page, 'Bob');
    
    const alicePos = await getStudentPosition(page, 'Alice');
    const bobPos = await getStudentPosition(page, 'Bob');
    
    if (alicePos && bobPos) {
      const distance = calculateDistance(alicePos, bobPos);
      expect(distance).toBeGreaterThanOrEqual(4);
    }
  });
});
