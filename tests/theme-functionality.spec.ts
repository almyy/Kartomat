import { test, expect } from '@playwright/test'

test.describe('Theme Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('should have theme toggle button', async ({ page }) => {
    const themeButton = page.getByRole('button', { name: /toggle theme/i })
    await expect(themeButton).toBeVisible()
  })

  test('should cycle through theme modes', async ({ page }) => {
    const themeButton = page.getByRole('button', { name: /toggle theme/i })
    
    // Initial state should be "System"
    await expect(themeButton).toContainText('System')
    
    // Click to switch to Light
    await themeButton.click()
    await expect(themeButton).toContainText('Light')
    
    // Click to switch to Dark
    await themeButton.click()
    await expect(themeButton).toContainText('Dark')
    
    // Click to switch back to System
    await themeButton.click()
    await expect(themeButton).toContainText('System')
  })

  test('should apply theme classes to document', async ({ page }) => {
    const themeButton = page.getByRole('button', { name: /toggle theme/i })
    
    // Switch to Light theme
    await themeButton.click()
    const htmlElementLight = page.locator('html')
    await expect(htmlElementLight).toHaveClass(/light/)
    
    // Switch to Dark theme
    await themeButton.click()
    const htmlElementDark = page.locator('html')
    await expect(htmlElementDark).toHaveClass(/dark/)
  })

  test('should persist theme preference in localStorage', async ({ page }) => {
    const themeButton = page.getByRole('button', { name: /toggle theme/i })
    
    // Switch to Dark theme
    await themeButton.click() // Light
    await themeButton.click() // Dark
    
    // Check localStorage
    const storedTheme = await page.evaluate(() => {
      const storage = localStorage.getItem('kartomat-storage')
      return storage ? JSON.parse(storage).state.theme : null
    })
    
    expect(storedTheme).toBe('dark')
    
    // Reload page and verify theme persists
    await page.reload()
    await expect(themeButton).toContainText('Dark')
    const htmlElement = page.locator('html')
    await expect(htmlElement).toHaveClass(/dark/)
  })
})
