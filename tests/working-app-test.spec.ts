import { test, expect } from '@playwright/test';

test.describe('Working Application Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');
    
    // Click demo account button
    await page.click('text=Try Demo Account (demo@loanflowpro.com)');
    
    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard');
    
    // Wait for page to fully load
    await page.waitForTimeout(2000);
  });

  test('should navigate through all main pages successfully', async ({ page }) => {
    console.log('🚀 Starting navigation test...');
    
    // Test Dashboard page
    console.log('📍 Testing Dashboard page...');
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    console.log('✅ Dashboard page loaded');
    
    // Navigate to Clients page
    console.log('📍 Navigating to Clients page...');
    await page.click('a:has-text("👥Clients")');
    await page.waitForURL('/clients');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('h1:has-text("Clients")')).toBeVisible();
    await expect(page.locator('button:has-text("Assign Loan Type")')).toBeVisible();
    await expect(page.locator('button:has-text("Add Client")')).toBeVisible();
    console.log('✅ Clients page loaded');
    
    // Navigate to Loan Types page
    console.log('📍 Navigating to Loan Types page...');
    await page.click('a:has-text("📋Loan Types")');
    await page.waitForURL('/loan-types');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('h1:has-text("Loan Types")')).toBeVisible();
    await expect(page.locator('button:has-text("Create Loan Type")')).toBeVisible();
    console.log('✅ Loan Types page loaded');
    
    // Navigate to Tasks page
    console.log('📍 Navigating to Tasks page...');
    await page.click('a:has-text("✅Tasks")');
    await page.waitForURL('/tasks');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('h1:has-text("Task Templates")')).toBeVisible();
    await expect(page.locator('button:has-text("Create Task Template")')).toBeVisible();
    console.log('✅ Tasks page loaded');
    
    // Navigate back to Dashboard
    console.log('📍 Navigating back to Dashboard...');
    await page.click('a:has-text("📊Dashboard")');
    await page.waitForURL('/dashboard');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    console.log('✅ Back to Dashboard');
    
    console.log('🎉 All navigation tests passed!');
  });

  test('should test client management functionality', async ({ page }) => {
    console.log('🚀 Starting client management test...');
    
    // Navigate to Clients page
    await page.click('text=👥 Clients');
    await page.waitForURL('/clients');
    await page.waitForTimeout(1000);
    
    // Test Assign Loan Type modal
    console.log('📍 Testing Assign Loan Type modal...');
    await page.click('button:has-text("Assign Loan Type")');
    
    // Wait for modal to open
    await expect(page.locator('text=Assign Loan Type to Client')).toBeVisible();
    
    // Check form elements
    await expect(page.locator('select[name="clientId"]')).toBeVisible();
    await expect(page.locator('select[name="loanTypeId"]')).toBeVisible();
    await expect(page.locator('input[name="customName"]')).toBeVisible();
    
    // Close modal
    await page.click('button:has-text("Cancel")');
    console.log('✅ Assign Loan Type modal works');
    
    // Test Add Client modal
    console.log('📍 Testing Add Client modal...');
    await page.click('button:has-text("Add Client")');
    
    // Wait for modal to open
    await expect(page.locator('text=Add New Client')).toBeVisible();
    
    // Check form elements
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    
    // Close modal
    await page.click('button:has-text("Cancel")');
    console.log('✅ Add Client modal works');
    
    console.log('🎉 Client management tests passed!');
  });

  test('should test loan type management functionality', async ({ page }) => {
    console.log('🚀 Starting loan type management test...');
    
    // Navigate to Loan Types page
    await page.click('a:has-text("📋Loan Types")');
    await page.waitForURL('/loan-types');
    await page.waitForTimeout(1000);
    
    // Test Create Loan Type modal
    console.log('📍 Testing Create Loan Type modal...');
    await page.click('button:has-text("Create Loan Type")');
    
    // Wait for modal to open
    await expect(page.locator('text=Create New Loan Type')).toBeVisible();
    
    // Check form elements
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="description"]')).toBeVisible();
    await expect(page.locator('select[name="category"]')).toBeVisible();
    await expect(page.locator('select[name="status"]')).toBeVisible();
    
    // Close modal
    await page.click('button:has-text("Cancel")');
    console.log('✅ Create Loan Type modal works');
    
    console.log('🎉 Loan type management tests passed!');
  });

  test('should test task management functionality', async ({ page }) => {
    console.log('🚀 Starting task management test...');
    
    // Navigate to Tasks page
    await page.click('a:has-text("✅Tasks")');
    await page.waitForURL('/tasks');
    await page.waitForTimeout(1000);
    
    // Test Create Task Template modal
    console.log('📍 Testing Create Task Template modal...');
    await page.click('button:has-text("Create Task Template")');
    
    // Wait for modal to open
    await expect(page.locator('text=Create New Task Template')).toBeVisible();
    
    // Check form elements
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
    await expect(page.locator('select[name="role"]')).toBeVisible();
    await expect(page.locator('select[name="priority"]')).toBeVisible();
    
    // Close modal
    await page.click('button:has-text("Cancel")');
    console.log('✅ Create Task Template modal works');
    
    console.log('🎉 Task management tests passed!');
  });

  test('should test delete loan type confirmation modal', async ({ page }) => {
    console.log('🚀 Starting delete confirmation modal test...');
    
    // Navigate to Clients page
    await page.click('text=👥 Clients');
    await page.waitForURL('/clients');
    await page.waitForTimeout(1000);
    
    // Look for delete buttons in loan type assignments
    const deleteButtons = page.locator('button[title="Remove loan type"]');
    const deleteButtonCount = await deleteButtons.count();
    
    console.log(`📍 Found ${deleteButtonCount} delete buttons`);
    
    if (deleteButtonCount > 0) {
      // Click the first delete button
      console.log('📍 Clicking first delete button...');
      await deleteButtons.first().click();
      
      // Wait for modal to open
      await page.waitForTimeout(1000);
      
      // Check if confirmation modal opens
      await expect(page.locator('text=⚠️ Remove Loan Type')).toBeVisible();
      await expect(page.locator('text=This action cannot be undone!')).toBeVisible();
      
      // Check for modal buttons
      await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
      await expect(page.locator('button:has-text("Remove Forever")')).toBeVisible();
      
      // Close modal
      await page.click('button:has-text("Cancel")');
      console.log('✅ Delete confirmation modal works correctly');
    } else {
      console.log('ℹ️  No assigned loan types found to test delete functionality');
    }
    
    console.log('🎉 Delete confirmation modal test completed!');
  });
});
