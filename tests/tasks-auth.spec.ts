import { test, expect } from '@playwright/test';

test.describe('Tasks Page - With Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');
    
    // Wait for login page to load
    await page.waitForSelector('input[name="email"]');
    
    // Fill in login credentials
    await page.fill('input[name="email"]', 'Ryans@onpointbs.com');
    await page.fill('input[name="password"]', 'Samari1!');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait for verification code page
    await page.waitForSelector('text=Enter Verification Code', { timeout: 10000 });
    
    console.log('⚠️  Please check your email for verification code and complete 2FA manually');
    console.log('⚠️  The test will continue once you navigate to the dashboard');
    
    // Wait for navigation to dashboard or workspace
    try {
      await page.waitForURL('**/dashboard**', { timeout: 30000 });
      console.log('✅ Successfully authenticated and navigated to dashboard');
    } catch (error) {
      console.log('⚠️  Still waiting for 2FA completion...');
      // Wait a bit more for manual completion
      await page.waitForTimeout(5000);
    }
    
    // Navigate to tasks page
    await page.goto('/tasks');
    
    // Wait for tasks page to load
    await page.waitForSelector('text=Task Templates', { timeout: 15000 });
  });

  test('should display task templates page with proper structure', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Task Templates');
    
    // Check for create button
    await expect(page.locator('button:has-text("+ Add Task Template")')).toBeVisible();
    
    // Check for search input
    await expect(page.locator('input[placeholder="Search by title or instructions..."]')).toBeVisible();
    
    // Check for filters
    await expect(page.locator('text=Loan Types')).toBeVisible();
    await expect(page.locator('text=Priority')).toBeVisible();
    await expect(page.locator('text=Role')).toBeVisible();
    
    console.log('✅ All page elements are visible');
  });

  test('should create a new task template', async ({ page }) => {
    // Click create button
    await page.click('button:has-text("+ Add Task Template")');
    
    // Wait for modal
    await page.waitForSelector('text=Create Task Template');
    
    // Fill in task details
    await page.fill('input[name="title"]', 'Test Task Template');
    await page.selectOption('select[name="assigneeRole"]', 'ADVISOR');
    await page.fill('textarea[name="instructions"]', 'This is a test task template');
    await page.fill('input[name="dueInDays"]', '7');
    await page.selectOption('select[name="priority"]', 'high');
    
    // Select loan types (tagging system)
    await page.click('button:has-text("Residential")');
    await page.click('button:has-text("Commercial")');
    
    // Submit form
    await page.click('button:has-text("Create Task Template")');
    
    // Wait for modal to close
    await page.waitForSelector('text=Create Task Template', { state: 'hidden' });
    
    // Check if task was created
    await expect(page.locator('text=Test Task Template')).toBeVisible();
    
    console.log('✅ Task template created successfully');
  });

  test('should filter tasks by loan types', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForSelector('.task-card, [class*="task"], [class*="card"]', { timeout: 10000 });
    
    // Filter by Residential loan type
    await page.click('button:has-text("Residential")');
    
    // Check that filter is applied
    await expect(page.locator('button:has-text("Residential")')).toHaveClass(/bg-brand-orange/);
    
    // Clear filter
    await page.click('button:has-text("All Loan Types")');
    
    // Check that filter is cleared
    await expect(page.locator('button:has-text("All Loan Types")')).toHaveClass(/bg-brand-orange/);
    
    console.log('✅ Loan type filtering works correctly');
  });

  test('should search tasks', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForSelector('.task-card, [class*="task"], [class*="card"]', { timeout: 10000 });
    
    // Search for a specific task
    await page.fill('input[placeholder="Search by title or instructions..."]', 'Test');
    
    // Check that search results are displayed
    await expect(page.locator('text=Filtered results')).toBeVisible();
    
    console.log('✅ Task search works correctly');
  });
});
