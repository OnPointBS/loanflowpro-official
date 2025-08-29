import { test, expect } from '@playwright/test';

test.describe('Tasks Page - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to tasks page (assuming we're already authenticated)
    await page.goto('/tasks');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display task templates page structure', async ({ page }) => {
    // Check if page loads
    await expect(page.locator('body')).toBeVisible();
    
    // Wait a bit for any async operations
    await page.waitForTimeout(3000);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/tasks-page-structure.png' });
    
    // Check what's actually on the page
    const pageContent = await page.textContent('body');
    console.log('Page content preview:', pageContent?.substring(0, 500));
    
    // Check for any error messages
    const errorElements = await page.locator('text=Error, text=error, text=Failed, text=failed').count();
    console.log('Error elements found:', errorElements);
    
    // Check for loading states
    const loadingElements = await page.locator('text=Loading, text=loading, .loading, .spinner').count();
    console.log('Loading elements found:', loadingElements);
    
    // Check for common elements that should be present
    const hasCreateButton = await page.locator('button:has-text("+ Add Task Template")').isVisible();
    const hasSearchInput = await page.locator('input[placeholder="Search by title or instructions..."]').isVisible();
    const hasPageTitle = await page.locator('h1:has-text("Task Templates")').isVisible();
    
    console.log('Page elements found:', { hasCreateButton, hasSearchInput, hasPageTitle });
    
    // Check for filters
    const hasLoanTypeFilter = await page.locator('text=Loan Types').isVisible();
    const hasPriorityFilter = await page.locator('text=Priority').isVisible();
    const hasRoleFilter = await page.locator('text=Role').isVisible();
    
    console.log('Filter elements found:', { hasLoanTypeFilter, hasPriorityFilter, hasRoleFilter });
    
    // Check if there are any task cards
    const taskCards = await page.locator('.task-card, [class*="task"], [class*="card"]').count();
    console.log('Task cards found:', taskCards);
  });

  test('should handle page navigation', async ({ page }) => {
    // Try to navigate to different sections
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/tasks');
    await page.waitForLoadState('networkidle');
    
    // Check if we can access the page
    await expect(page.locator('body')).toBeVisible();
  });

  test('should check for console errors', async ({ page }) => {
    const consoleMessages: string[] = [];
    
    page.on('console', msg => {
      consoleMessages.push(msg.text());
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });
    
    await page.goto('/tasks');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit for any async operations
    await page.waitForTimeout(2000);
    
    console.log('Console messages:', consoleMessages);
    
    // Check for any critical errors
    const errors = consoleMessages.filter(msg => msg.includes('Error') || msg.includes('error'));
    if (errors.length > 0) {
      console.log('Found console errors:', errors);
    }
  });
});
