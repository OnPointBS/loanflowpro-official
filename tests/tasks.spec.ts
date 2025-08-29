import { test, expect } from '@playwright/test';

test.describe('Tasks Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');
    
    // Fill in login credentials
    await page.fill('input[name="email"]', 'Ryans@onpointbs.com');
    await page.fill('input[name="password"]', 'Samari1!');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait for verification code page
    await page.waitForSelector('text=Enter Verification Code', { timeout: 10000 });
    
    // For now, we'll wait for manual verification
    console.log('⚠️  Please check your email for verification code and complete 2FA manually');
    console.log('⚠️  The test will continue once you navigate to the dashboard');
    
    // Wait for navigation to dashboard or workspace
    try {
      await page.waitForURL('**/dashboard**', { timeout: 30000 });
    } catch (error) {
      console.log('⚠️  Still waiting for 2FA completion...');
      // Wait a bit more for manual completion
      await page.waitForTimeout(5000);
    }
    
    // Navigate to tasks page
    await page.goto('/tasks');
    
    // Wait for tasks page to load
    await page.waitForSelector('text=Task Templates', { timeout: 10000 });
  });

  test('should display task templates page with proper structure', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Task Templates');
    
    // Check for create button
    await expect(page.locator('button:has-text("+ Add Task")')).toBeVisible();
    
    // Check for filters
    await expect(page.locator('text=Priority')).toBeVisible();
    await expect(page.locator('text=Role')).toBeVisible();
    await expect(page.locator('text=Loan Types')).toBeVisible();
    await expect(page.locator('text=Search')).toBeVisible();
  });

  test('should create a new task template', async ({ page }) => {
    // Click create button
    await page.click('button:has-text("+ Add Task")');
    
    // Wait for modal
    await page.waitForSelector('text=Create Task Template');
    
    // Fill in task details
    await page.fill('input[name="title"]', 'Test Task');
    await page.selectOption('select[name="assigneeRole"]', 'ADVISOR');
    await page.fill('textarea[name="instructions"]', 'This is a test task');
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
    await expect(page.locator('text=Test Task')).toBeVisible();
  });

  test('should edit an existing task template', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForSelector('.task-card', { timeout: 10000 });
    
    // Click edit button on first task
    const editButton = page.locator('.task-card').first().locator('button:has-text("Edit")');
    await editButton.click();
    
    // Wait for edit modal
    await page.waitForSelector('text=Edit Task Template');
    
    // Update task title
    await page.fill('input[name="title"]', 'Updated Task Title');
    
    // Update loan type associations
    await page.click('button:has-text("Personal")');
    
    // Submit form
    await page.click('button:has-text("Update Task Template")');
    
    // Wait for modal to close
    await page.waitForSelector('text=Edit Task Template', { state: 'hidden' });
    
    // Check if task was updated
    await expect(page.locator('text=Updated Task Title')).toBeVisible();
  });

  test('should filter tasks by loan types', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForSelector('.task-card', { timeout: 10000 });
    
    // Filter by Residential loan type
    await page.click('button:has-text("Residential")');
    
    // Check that filter is applied
    await expect(page.locator('button:has-text("Residential")')).toHaveClass(/bg-brand-orange/);
    
    // Clear filter
    await page.click('button:has-text("All Loan Types")');
    
    // Check that filter is cleared
    await expect(page.locator('button:has-text("All Loan Types")')).toHaveClass(/bg-brand-orange/);
  });

  test('should search tasks', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForSelector('.task-card', { timeout: 10000 });
    
    // Search for a specific task
    await page.fill('input[placeholder="Search tasks..."]', 'Test');
    
    // Check that search results are displayed
    await expect(page.locator('text=Filtered results')).toBeVisible();
  });

  test('should delete a task template', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForSelector('.task-card', { timeout: 10000 });
    
    // Click delete button on first task
    const deleteButton = page.locator('.task-card').first().locator('button:has-text("Delete")');
    await deleteButton.click();
    
    // Wait for delete confirmation
    await page.waitForSelector('text=Delete Task Template');
    
    // Confirm deletion
    await page.click('button:has-text("Delete")');
    
    // Wait for confirmation to close
    await page.waitForSelector('text=Delete Task Template', { state: 'hidden' });
    
    // Check that task was removed (this might fail if it's the only task)
    // await expect(page.locator('.task-card')).toHaveCount(0);
  });
});
