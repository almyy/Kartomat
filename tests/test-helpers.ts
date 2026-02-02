import { Page, expect } from '@playwright/test';

/**
 * Helper function to add students
 */
export async function addStudents(page: Page, studentNames: string[]) {
  for (const name of studentNames) {
    await page.getByRole('textbox', { name: 'Skriv inn elevnavn' }).fill(name);
    await page.getByRole('button', { name: 'Legg til', exact: true }).click({ force: true });
  }
}

/**
 * Helper function to configure classroom size
 */
export async function configureClassroom(page: Page, rows: number, cols: number) {
  // Find the rows input by its label
  await page.getByRole('textbox', { name: 'Rader:' }).fill(String(rows));

  // Find the cols input by its label
  await page.getByRole('textbox', { name: 'Kolonner:' }).fill(String(cols));
}

/**
 * Helper function to select an option in a Mantine Select component
 */
export async function selectMantineOption(page: Page, label: string, optionText: string | RegExp, exact?: boolean) {
  // Click on the select to open dropdown
  await page.getByRole('textbox', { name: label }).click();
  // Wait a bit for dropdown to appear
  await page.waitForTimeout(200);
  // Click on the option
  await page.getByRole('option', { name: optionText, exact }).click();
}

/**
 * Helper function to add a "Not Together" constraint
 */
export async function addNotTogetherConstraint(page: Page, student1: string, student2: string, exact?: boolean) {
  // Select constraint type
  await selectMantineOption(page, 'Begrensningstype', 'Ikke sammen');

  // Select first student
  await selectMantineOption(page, 'Velg elev 1', student1, exact);

  // Select second student
  await selectMantineOption(page, 'Velg elev 2', student2, exact);

  // Add constraint
  await page.getByRole('button', { name: 'Legg til begrensning' }).click();
}

/**
 * Helper function to add a "Must Be Together" constraint
 */
export async function addTogetherConstraint(page: Page, student1: string, student2: string, exact?: boolean) {
  // Select constraint type
  await selectMantineOption(page, 'Begrensningstype', 'Må være sammen');

  // Select first student
  await selectMantineOption(page, 'Velg elev 1', student1, exact);

  // Select second student
  await selectMantineOption(page, 'Velg elev 2', student2, exact);

  // Add constraint
  await page.getByRole('button', { name: 'Legg til begrensning' }).click();
}

/**
 * Helper function to add a "Must Be In Row" constraint
 */
export async function addRowConstraint(page: Page, student: string, row: number, exact?: boolean) {
  // Select constraint type
  await selectMantineOption(page, 'Begrensningstype', 'Må være i rad');

  // Select student
  await selectMantineOption(page, 'Velg elev', student, exact);

  // Enter row number - get the spinbutton in the Constraints section
  const constraintSection = page.getByRole('region', { name: 'Begrensninger' });
  await constraintSection.getByRole('textbox', { name: 'Radnummer' }).fill(String(row));

  // Add constraint
  await page.getByRole('button', { name: 'Legg til begrensning' }).click();
}

/**
 * Helper function to add an "Absolute Placement" constraint
 */
export async function addAbsoluteConstraint(page: Page, student: string, row: number, col: number) {
  // Select constraint type
  await selectMantineOption(page, 'Begrensningstype', 'Absolutt plassering');

  // Select student
  await selectMantineOption(page, 'Velg elev', student);

  // Enter row number
  await page.getByRole('textbox', { name: 'Radnummer' }).fill(String(row));

  // Enter col number
  await page.getByRole('textbox', { name: 'Kolonnenummer' }).fill(String(col));

  // Add constraint
  await page.getByRole('button', { name: 'Legg til begrensning' }).click();
}

/**
 * Helper function to add a "Far Apart" constraint
 */
export async function addFarApartConstraint(page: Page, student1: string, student2: string, minDistance: number) {
  // Select constraint type
  await selectMantineOption(page, 'Begrensningstype', 'Langt fra hverandre');

  // Select first student
  await selectMantineOption(page, 'Velg elev 1', student1);

  // Select second student
  await selectMantineOption(page, 'Velg elev 2', student2);

  // Enter minimum distance - get the spinbutton in the Constraints section
  const constraintSection = page.getByRole('region', { name: 'Begrensninger' });
  await constraintSection.getByRole('textbox', { name: 'Seter' }).fill(String(minDistance));

  // Add constraint
  await page.getByRole('button', { name: 'Legg til begrensning' }).click();
}

/**
 * Helper function to solve and wait for results
 */
export async function solveSeating(page: Page) {
  await page.getByRole('button', { name: 'Generer Klassekart' }).click();
  // Wait for either success or failure message
  await page.waitForSelector('.bg-indigo-600\\/30, .bg-red-500\\/20', { timeout: 10000 });
}

/**
 * Helper function to verify a student is in the seating chart
 */
export async function verifyStudentInSeating(page: Page, studentName: string) {
  // Look specifically in the seating display area, not the student list
  const seatingDisplay = page.getByRole('region', { name: 'Klassekart' });
  const studentSeat = seatingDisplay.locator('.flex-1.min-h-\\[50px\\]').filter({ hasText: new RegExp(`^${studentName}$`) });
  await expect(studentSeat).toBeVisible();
}

/**
 * Helper function to get position of a student in the seating chart
 */
export async function getStudentPosition(page: Page, studentName: string) {
  // Only look in the seating display area
  const seatingDisplay = page.getByRole('region', { name: 'Klassekart' });
  const seatingArrangement = seatingDisplay.locator('#seating-arrangement');
  const rows = await seatingArrangement.locator('> .flex.items-center').all();

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const seats = await rows[rowIndex].locator('.flex-1.min-h-\\[50px\\]').all();
    for (let colIndex = 0; colIndex < seats.length; colIndex++) {
      const text = await seats[colIndex].textContent();
      if (text?.trim() === studentName) {
        return { row: rowIndex, col: colIndex };
      }
    }
  }
  return null;
}

/**
 * Helper function to check if two positions are adjacent (same row, next to each other)
 */
export function areAdjacent(pos1: { row: number; col: number }, pos2: { row: number; col: number }): boolean {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  return rowDiff === 0 && colDiff === 1;
}

/**
 * Helper function to calculate Euclidean distance between two positions
 */
export function calculateDistance(pos1: { row: number; col: number }, pos2: { row: number; col: number }): number {
  const rowDiff = pos1.row - pos2.row;
  const colDiff = pos1.col - pos2.col;
  return Math.sqrt(rowDiff * rowDiff + colDiff * colDiff);
}
