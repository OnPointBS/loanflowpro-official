import { test, expect } from '@playwright/test';

test.describe('Loan Types Page - Simple Test', () => {
  test('should display loan types page structure', async ({ page }) => {
    // Navigate directly to loan types page (assuming we're already authenticated)
    await page.goto('/loan-types');
    
    // Wait for the page to load
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Check that the premium header is displayed
    await expect(page.locator('h1')).toContainText('Loan Types');
    
    // Check for premium design elements
    await expect(page.locator('.bg-gradient-to-br')).toBeVisible();
    await expect(page.locator('.backdrop-blur-sm')).toBeVisible();
    
    // Check for the add loan type button
    await expect(page.locator('button:has-text("+ Add Loan Type")')).toBeVisible();
  });

  test('should show loan types with basic structure', async ({ page }) => {
    // Navigate directly to loan types page
    await page.goto('/loan-types');
    
    // Wait for the page to load
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Check that loan types section is visible
    await expect(page.locator('.space-y-6')).toBeVisible();
    
    // Check for filters
    await expect(page.locator('select[value="all"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Search loan types..."]')).toBeVisible();
  });

  test('should display premium design elements', async ({ page }) => {
    // Navigate directly to loan types page
    await page.goto('/loan-types');
    
    // Wait for the page to load
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Check for premium design elements
    await expect(page.locator('.bg-gradient-to-br')).toBeVisible();
    await expect(page.locator('.backdrop-blur-sm')).toBeVisible();
    await expect(page.locator('.shadow-2xl')).toBeVisible();
    
    // Check for the premium header
    await expect(page.locator('h1.text-4xl')).toBeVisible();
  });

  test('should have working search and filter functionality', async ({ page }) => {
    // Navigate directly to loan types page
    await page.goto('/loan-types');
    
    // Wait for the page to load
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Test search functionality
    const searchInput = page.locator('input[placeholder="Search loan types..."]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Test Search');
    await expect(searchInput).toHaveValue('Test Search');
    
    // Test category filter
    const categorySelect = page.locator('select[value="all"]');
    await expect(categorySelect).toBeVisible();
    await categorySelect.selectOption('Residential');
    await expect(categorySelect).toHaveValue('Residential');
  });

  test('should show add loan type modal', async ({ page }) => {
    // Navigate directly to loan types page
    await page.goto('/loan-types');
    
    // Wait for the page to load
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Click add loan type button
    await page.click('button:has-text("+ Add Loan Type")');
    
    // Wait for modal to appear
    await page.waitForSelector('h2:has-text("Create Loan Type")', { timeout: 5000 });
    
    // Check modal content
    await expect(page.locator('input[placeholder="Loan type name"]')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
    
    // Close modal
    await page.click('button:has-text("Cancel")');
    
    // Check modal is closed
    await expect(page.locator('h2:has-text("Create Loan Type")')).not.toBeVisible();
  });
});
