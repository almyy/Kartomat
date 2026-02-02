import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Kartomat', level: 1 })).toBeVisible();
  });

  test('should display theme selector with correct options', async ({ page }) => {
    // Check that theme selector is visible
    const themeSelector = page.getByLabel(/tema|theme/i);
    await expect(themeSelector).toBeVisible();

    // Check options exist
    const options = await themeSelector.locator('option').allTextContents();
    expect(options).toContain('Lyst'); // Light in Norwegian
    expect(options).toContain('Mørkt'); // Dark in Norwegian
  });

  test('should switch from dark to light theme', async ({ page }) => {
    // Default theme should be dark
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);

    // Switch to light theme
    await page.getByLabel(/tema|theme/i).selectOption('light');

    // Verify the dark class is removed
    await expect(html).not.toHaveClass(/dark/);
    
    // Verify theme selector shows light is selected
    await expect(page.getByLabel(/tema|theme/i)).toHaveValue('light');
  });

  test('should switch from light to dark theme', async ({ page }) => {
    const html = page.locator('html');
    
    // First switch to light
    await page.getByLabel(/tema|theme/i).selectOption('light');
    await expect(html).not.toHaveClass(/dark/);

    // Then switch back to dark
    await page.getByLabel(/tema|theme/i).selectOption('dark');
    await expect(html).toHaveClass(/dark/);
    
    // Verify theme selector shows dark is selected
    await expect(page.getByLabel(/tema|theme/i)).toHaveValue('dark');
  });

  test('should persist theme selection after page reload', async ({ page }) => {
    const html = page.locator('html');
    
    // Switch to light theme
    await page.getByLabel(/tema|theme/i).selectOption('light');
    await expect(html).not.toHaveClass(/dark/);

    // Reload the page
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Kartomat', level: 1 })).toBeVisible();

    // Theme should still be light after reload
    await expect(html).not.toHaveClass(/dark/);
    await expect(page.getByLabel(/tema|theme/i)).toHaveValue('light');
  });

  test('should display theme selector in English when language is switched', async ({ page }) => {
    // Switch to English
    await page.getByLabel(/språk|language/i).selectOption('en');

    // Check that theme selector label is in English
    const themeLabel = page.getByText('Theme:');
    await expect(themeLabel).toBeVisible();

    // Check options are in English
    const themeSelector = page.getByLabel('Theme:');
    const options = await themeSelector.locator('option').allTextContents();
    expect(options).toContain('Light');
    expect(options).toContain('Dark');
  });
});
