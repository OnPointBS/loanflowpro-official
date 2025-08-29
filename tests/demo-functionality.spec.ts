import { test, expect } from '@playwright/test';

test.describe('Demo Account Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');
    
    // Click the demo account button
    await page.click('text=Try Demo Account (demo@loanflowpro.com)');
    
    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard');
  });

  test('should navigate to clients page and display client cards', async ({ page }) => {
    // Navigate to clients page
    await page.click('text=👥 Clients');
    await page.waitForURL('/clients');
    
    // Check page structure
    await expect(page.locator('h1')).toContainText('Clients');
    await expect(page.locator('text=Manage your client relationships and loan type assignments')).toBeVisible();
    
    // Check for action buttons
    await expect(page.locator('button:has-text("Assign Loan Type")')).toBeVisible();
    await expect(page.locator('button:has-text("Add Client")')).toBeVisible();
    
    // Check for search and filters
    await expect(page.locator('input[placeholder*="Search clients"]')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
    
    // Check for client cards (should have at least one)
    const clientCards = page.locator('[class*="bg-gradient-to-br"]');
    await expect(clientCards.first()).toBeVisible();
    
    console.log('✅ Clients page loaded successfully with proper structure');
  });

  test('should navigate to loan types page and display loan type cards', async ({ page }) => {
    // Navigate to loan types page
    await page.click('text=📋 Loan Types');
    await page.waitForURL('/loan-types');
    
    // Check page structure
    await expect(page.locator('h1')).toContainText('Loan Types');
    
    // Check for action buttons
    await expect(page.locator('button:has-text("Create Loan Type")')).toBeVisible();
    
    // Check for search and filters
    await expect(page.locator('input[placeholder*="Search loan types"]')).toBeVisible();
    
    // Check for loan type cards (should have at least one)
    const loanTypeCards = page.locator('[class*="bg-gradient-to-br"]');
    await expect(loanTypeCards.first()).toBeVisible();
    
    console.log('✅ Loan Types page loaded successfully with proper structure');
  });

  test('should navigate to tasks page and display task cards', async ({ page }) => {
    // Navigate to tasks page
    await page.click('text=✅ Tasks');
    await page.waitForURL('/tasks');
    
    // Check page structure
    await expect(page.locator('h1')).toContainText('Task Templates');
    
    // Check for action buttons
    await expect(page.locator('button:has-text("Create Task Template")')).toBeVisible();
    
    // Check for search and filters
    await expect(page.locator('input[placeholder*="Search tasks"]')).toBeVisible();
    
    // Check for task cards (should have at least one)
    const taskCards = page.locator('[class*="bg-gradient-to-br"]');
    await expect(taskCards.first()).toBeVisible();
    
    console.log('✅ Tasks page loaded successfully with proper structure');
  });

  test('should test client loan type assignment functionality', async ({ page }) => {
    // Navigate to clients page
    await page.click('text=👥 Clients');
    await page.waitForURL('/clients');
    
    // Click Assign Loan Type button
    await page.click('button:has-text("Assign Loan Type")');
    
    // Check if modal opens
    await expect(page.locator('text=Assign Loan Type to Client')).toBeVisible();
    
    // Check for form elements
    await expect(page.locator('select[name="clientId"]')).toBeVisible();
    await expect(page.locator('select[name="loanTypeId"]')).toBeVisible();
    await expect(page.locator('input[name="customName"]')).toBeVisible();
    
    // Close modal
    await page.click('button:has-text("Cancel")');
    
    console.log('✅ Loan type assignment modal opens and displays correctly');
  });

  test('should test delete loan type confirmation modal', async ({ page }) => {
    // Navigate to clients page
    await page.click('text=👥 Clients');
    await page.waitForURL('/clients');
    
    // Find a client with assigned loan types
    const clientCards = page.locator('[class*="bg-gradient-to-br"]');
    await expect(clientCards.first()).toBeVisible();
    
    // Look for a trash icon (delete button) in loan type assignments
    const deleteButtons = page.locator('button[title="Remove loan type"]');
    
    if (await deleteButtons.count() > 0) {
      // Click the first delete button
      await deleteButtons.first().click();
      
      // Check if confirmation modal opens
      await expect(page.locator('text=⚠️ Remove Loan Type')).toBeVisible();
      await expect(page.locator('text=This action cannot be undone!')).toBeVisible();
      
      // Check for modal buttons
      await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
      await expect(page.locator('button:has-text("Remove Forever")')).toBeVisible();
      
      // Close modal
      await page.click('button:has-text("Cancel")');
      
      console.log('✅ Delete loan type confirmation modal works correctly');
    } else {
      console.log('ℹ️  No assigned loan types found to test delete functionality');
    }
  });
});

