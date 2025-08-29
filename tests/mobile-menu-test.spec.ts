import { test, expect } from '@playwright/test';

test.describe('Mobile Menu Test', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to the dashboard
    await page.goto('http://localhost:5174/dashboard');
    
    // Wait for the page to load
    await page.waitForSelector('h1', { timeout: 15000 });
  });

  test('should display mobile menu button on mobile', async ({ page }) => {
    // Check if mobile menu button is visible
    const mobileMenuButton = page.locator('button[aria-label="Toggle mobile menu"]');
    await expect(mobileMenuButton).toBeVisible();
    
    console.log('✅ Mobile menu button is visible');
  });

  test('should open mobile menu when button is clicked', async ({ page }) => {
    // Click mobile menu button
    const mobileMenuButton = page.locator('button[aria-label="Toggle mobile menu"]');
    await mobileMenuButton.click();
    
    // Wait for mobile menu to appear
    await page.waitForSelector('.mobile-sidebar', { timeout: 5000 });
    
    // Check if mobile menu is visible
    await expect(page.locator('.mobile-sidebar')).toBeVisible();
    
    // Check if menu items are visible
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Clients')).toBeVisible();
    await expect(page.locator('text=Loan Types')).toBeVisible();
    
    console.log('✅ Mobile menu opened successfully');
  });

  test('should close mobile menu when backdrop is clicked', async ({ page }) => {
    // Open mobile menu
    const mobileMenuButton = page.locator('button[aria-label="Toggle mobile menu"]');
    await mobileMenuButton.click();
    
    // Wait for mobile menu to appear
    await page.waitForSelector('.mobile-sidebar', { timeout: 5000 });
    
    // Click on backdrop to close
    await page.click('.mobile-menu-backdrop');
    
    // Check if mobile menu is hidden
    await expect(page.locator('.mobile-sidebar')).not.toBeVisible();
    
    console.log('✅ Mobile menu closed when backdrop clicked');
  });

  test('should close mobile menu when close button is clicked', async ({ page }) => {
    // Open mobile menu
    const mobileMenuButton = page.locator('button[aria-label="Toggle mobile menu"]');
    await mobileMenuButton.click();
    
    // Wait for mobile menu to appear
    await page.waitForSelector('.mobile-sidebar', { timeout: 5000 });
    
    // Click close button
    await page.click('button:has-text("✕")');
    
    // Check if mobile menu is hidden
    await expect(page.locator('.mobile-sidebar')).not.toBeVisible();
    
    console.log('✅ Mobile menu closed when close button clicked');
  });

  test('should navigate to different pages from mobile menu', async ({ page }) => {
    // Open mobile menu
    const mobileMenuButton = page.locator('button[aria-label="Toggle mobile menu"]');
    await mobileMenuButton.click();
    
    // Wait for mobile menu to appear
    await page.waitForSelector('.mobile-sidebar', { timeout: 5000 });
    
    // Click on Clients link
    await page.click('text=Clients');
    
    // Wait for navigation
    await page.waitForURL('**/clients');
    
    // Check if we're on the clients page
    await expect(page.locator('h1:has-text("Clients")')).toBeVisible();
    
    console.log('✅ Navigation from mobile menu works');
  });

  test('should have proper mobile styling', async ({ page }) => {
    // Open mobile menu
    const mobileMenuButton = page.locator('button[aria-label="Toggle mobile menu"]');
    await mobileMenuButton.click();
    
    // Wait for mobile menu to appear
    await page.waitForSelector('.mobile-sidebar', { timeout: 5000 });
    
    // Check mobile menu styling
    const mobileSidebar = page.locator('.mobile-sidebar');
    
    // Verify it has the correct classes
    await expect(mobileSidebar).toHaveClass(/mobile-sidebar/);
    await expect(mobileSidebar).toHaveClass(/open/);
    
    console.log('✅ Mobile menu has proper styling');
  });
});
