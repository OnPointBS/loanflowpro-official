import { test, expect } from '@playwright/test';

test.describe('Tasks Page - Debug Test', () => {
  test('should load tasks page without errors', async ({ page }) => {
    // Navigate to tasks page
    await page.goto('/tasks');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/tasks-debug.png' });
    
    // Check what's actually on the page
    const pageContent = await page.textContent('body');
    console.log('Page content preview:', pageContent?.substring(0, 1000));
    
    // Check for any error messages
    const errorElements = await page.locator('text=Error, text=error, text=Failed, text=failed, text=Loading workspace, text=Loading task templates').count();
    console.log('Error/Loading elements found:', errorElements);
    
    // Check if we're on the login page (authentication issue)
    const isLoginPage = await page.locator('text=Sign in to your account, text=Email address, text=Password').count() > 0;
    console.log('Is login page:', isLoginPage);
    
    // Check if we're on the tasks page
    const isTasksPage = await page.locator('text=Task Templates, text=+ Add Task Template').count() > 0;
    console.log('Is tasks page:', isTasksPage);
    
    // Check for empty state
    const isEmptyState = await page.locator('text=No Task Templates Yet, text=Create your first task template').count() > 0;
    console.log('Is empty state:', isEmptyState);
    
    // Check console for errors
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      consoleMessages.push(msg.text());
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });
    
    // Wait a bit more for any async operations
    await page.waitForTimeout(3000);
    
    console.log('Console messages:', consoleMessages);
    
    // Basic assertion - page should load without crashing
    await expect(page.locator('body')).toBeVisible();
  });
});
