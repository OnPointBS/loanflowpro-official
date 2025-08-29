import { test, expect } from '@playwright/test';

test.describe('Working Clients Page Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');
    
    // Click demo account button
    await page.click('text=Try Demo Account (demo@loanflowpro.com)');
    
    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard');
    
    // Wait for page to fully load
    await page.waitForTimeout(2000);
    
    // Navigate to Clients page
    await page.click('a:has-text("👥Clients")');
    await page.waitForURL('/clients');
    await page.waitForTimeout(2000);
  });

  test('should test Assign Loan Type modal', async ({ page }) => {
    console.log('🚀 Testing Assign Loan Type modal...');
    
    // Click Assign Loan Type button
    await page.click('button:has-text("Assign Loan Type")');
    
    // Wait for modal to open
    await expect(page.locator('text=Assign Loan Type to Client')).toBeVisible();
    console.log('✅ Modal opened successfully');
    
    // Check for form elements
    await expect(page.locator('select[name="clientId"]')).toBeVisible();
    await expect(page.locator('select[name="loanTypeId"]')).toBeVisible();
    await expect(page.locator('input[name="customName"]')).toBeVisible();
    console.log('✅ All form elements are visible');
    
    // Close modal
    await page.click('button:has-text("Cancel")');
    console.log('✅ Modal closed successfully');
    
    console.log('🎉 Assign Loan Type modal test passed!');
  });

  test('should test Add Client modal', async ({ page }) => {
    console.log('🚀 Testing Add Client modal...');
    
    // Click Add Client button
    await page.click('button:has-text("Add Client")');
    
    // Wait for modal to open
    await expect(page.locator('text=Add New Client')).toBeVisible();
    console.log('✅ Modal opened successfully');
    
    // Check for form elements
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    console.log('✅ All form elements are visible');
    
    // Close modal
    await page.click('button:has-text("Cancel")');
    console.log('✅ Modal closed successfully');
    
    console.log('🎉 Add Client modal test passed!');
  });

  test('should test client action buttons', async ({ page }) => {
    console.log('🚀 Testing client action buttons...');
    
    // Look for client action buttons (Assign, Edit, View, Delete)
    const assignButtons = page.locator('button:has-text("Assign")');
    const editButtons = page.locator('button:has-text("Edit")');
    const viewButtons = page.locator('button:has-text("View")');
    const deleteButtons = page.locator('button:has-text("Delete")');
    
    const assignCount = await assignButtons.count();
    const editCount = await editButtons.count();
    const viewCount = await viewButtons.count();
    const deleteCount = await deleteButtons.count();
    
    console.log(`📍 Found ${assignCount} Assign buttons, ${editCount} Edit buttons, ${viewCount} View buttons, ${deleteCount} Delete buttons`);
    
    // Test that we have at least one set of action buttons
    expect(assignCount).toBeGreaterThan(0);
    expect(editCount).toBeGreaterThan(0);
    expect(viewCount).toBeGreaterThan(0);
    expect(deleteCount).toBeGreaterThan(0);
    
    console.log('✅ All client action buttons are present');
    
    console.log('🎉 Client action buttons test passed!');
  });

  test('should test delete loan type confirmation modal', async ({ page }) => {
    console.log('🚀 Testing delete loan type confirmation modal...');
    
    // Look for delete buttons in loan type assignments
    const deleteButtons = page.locator('button[title="Remove loan type"]');
    const deleteButtonCount = await deleteButtons.count();
    
    console.log(`📍 Found ${deleteButtonCount} delete loan type buttons`);
    
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
      
      console.log('✅ Delete confirmation modal opened successfully');
      
      // Close modal
      await page.click('button:has-text("Cancel")');
      console.log('✅ Modal closed successfully');
      
      console.log('✅ Delete confirmation modal works correctly');
    } else {
      console.log('ℹ️  No assigned loan types found to test delete functionality');
    }
    
    console.log('🎉 Delete confirmation modal test completed!');
  });
});

