import { test, expect } from '@playwright/test';

test.describe('Clients Page Fix Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the clients page
    await page.goto('http://localhost:5174/clients');
    
    // Wait for authentication to complete and page to load
    await page.waitForSelector('h1:has-text("Clients")', { timeout: 15000 });
    
    // Additional wait to ensure everything is loaded
    await page.waitForTimeout(1000);
  });

  test('should display clients page correctly', async ({ page }) => {
    // Check if the page loads
    await expect(page.locator('h1:has-text("Clients")')).toBeVisible();
    await expect(page.locator('button:has-text("Add Client")')).toBeVisible();
    await expect(page.locator('button:has-text("Assign Loan Type")')).toBeVisible();
    
    console.log('✅ Clients page loaded successfully');
  });

  test('should open Add Client modal', async ({ page }) => {
    // Click Add Client button
    await page.click('button:has-text("Add Client")');
    
    // Wait for modal to appear
    await page.waitForSelector('div[role="dialog"]', { timeout: 5000 });
    
    // Check modal content
    await expect(page.locator('h2:has-text("Add New Client")')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    
    console.log('✅ Add Client modal opened successfully');
    
    // Close modal
    await page.click('button:has-text("Cancel")');
  });

  test('should open Assign Loan Type modal', async ({ page }) => {
    // Click Assign Loan Type button
    await page.click('button:has-text("Assign Loan Type")');
    
    // Wait for modal to appear
    await page.waitForSelector('div[role="dialog"]', { timeout: 5000 });
    
    // Check modal content
    await expect(page.locator('h2:has-text("Assign Loan Type to Client")')).toBeVisible();
    await expect(page.locator('select[name="loanTypeId"]')).toBeVisible();
    
    console.log('✅ Assign Loan Type modal opened successfully');
    
    // Close modal
    await page.click('button:has-text("Cancel")');
  });

  test('should test client action buttons', async ({ page }) => {
    // Wait for clients to load
    await page.waitForSelector('.client-card', { timeout: 10000 });
    
    // Count action buttons
    const assignButtons = page.locator('button:has-text("Assign")');
    const editButtons = page.locator('button:has-text("Edit")');
    const viewButtons = page.locator('button:has-text("View")');
    const deleteButtons = page.locator('button:has-text("Delete")');
    
    const assignCount = await assignButtons.count();
    const editCount = await editButtons.count();
    const viewCount = await viewButtons.count();
    const deleteCount = await deleteButtons.count();
    
    console.log(`📍 Found ${assignCount} Assign buttons, ${editCount} Edit buttons, ${viewCount} View buttons, ${deleteCount} Delete buttons`);
    
    expect(assignCount).toBeGreaterThan(0);
    expect(editCount).toBeGreaterThan(0);
    expect(viewCount).toBeGreaterThan(0);
    expect(deleteCount).toBeGreaterThan(0);
    
    console.log('✅ All client action buttons are present');
  });

  test('should open client detail modal when clicking View', async ({ page }) => {
    // Wait for clients to load
    await page.waitForSelector('.client-card', { timeout: 10000 });
    
    // Click the first View button
    const firstViewButton = page.locator('button:has-text("View")').first();
    await firstViewButton.click();
    
    // Wait for modal to appear
    await page.waitForSelector('div[role="dialog"]', { timeout: 5000 });
    
    // Check if modal shows client details
    await expect(page.locator('h2:has-text("📋 Client Details:")')).toBeVisible();
    
    console.log('✅ Client detail modal opened successfully');
    
    // Close modal
    await page.click('button:has-text("✕")');
  });

  test('should test loan type functionality', async ({ page }) => {
    // Wait for clients to load
    await page.waitForSelector('.client-card', { timeout: 10000 });
    
    // Look for loan type cards
    const loanTypeCards = page.locator('.bg-white\\/60.backdrop-blur-sm.rounded-xl.p-3.border.border-white\\/20');
    const loanTypeCount = await loanTypeCards.count();
    
    if (loanTypeCount > 0) {
      console.log(`📍 Found ${loanTypeCount} loan type cards`);
      
      // Click on the first loan type card
      await loanTypeCards.first().click();
      
      // Wait for modal to appear
      await page.waitForSelector('div[role="dialog"]', { timeout: 5000 });
      
      // Check modal content
      await expect(page.locator('h2:has-text("✏️ Edit Loan Type Assignment")')).toBeVisible();
      
      console.log('✅ Loan type edit modal opened successfully');
      
      // Close modal
      await page.click('button:has-text("Cancel")');
    } else {
      console.log('📍 No loan types found, skipping loan type test');
    }
  });

  test('should test task management in loan type modal', async ({ page }) => {
    // Wait for clients to load
    await page.waitForSelector('.client-card', { timeout: 10000 });
    
    // Look for loan type cards
    const loanTypeCards = page.locator('.bg-white\\/60.backdrop-blur-sm.rounded-xl.p-3.border.border-white\\/20');
    const loanTypeCount = await loanTypeCards.count();
    
    if (loanTypeCount > 0) {
      // Click on the first loan type card
      await loanTypeCards.first().click();
      
      // Wait for modal to appear
      await page.waitForSelector('div[role="dialog"]', { timeout: 5000 });
      
      // Check for task management section
      await expect(page.locator('h3:has-text("Associated Tasks")')).toBeVisible();
      await expect(page.locator('button:has-text("+ Add Task")')).toBeVisible();
      
      console.log('✅ Task management section found in loan type modal');
      
      // Test Add Task button
      await page.click('button:has-text("+ Add Task")');
      
      // Check if add task functionality works
      // This will help identify what needs to be implemented
      
      // Close modal
      await page.click('button:has-text("Cancel")');
    } else {
      console.log('📍 No loan types found, skipping task management test');
    }
  });

  test('should test mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for clients to load
    await page.waitForSelector('.client-card', { timeout: 10000 });
    
    // Check if page is mobile-friendly
    await expect(page.locator('h1:has-text("Clients")')).toBeVisible();
    
    // Test Add Client button on mobile
    await page.click('button:has-text("Add Client")');
    await page.waitForSelector('div[role="dialog"]', { timeout: 5000 });
    
    // Check if modal is mobile-friendly
    await expect(page.locator('input[name="name"]')).toBeVisible();
    
    // Close modal
    await page.click('button:has-text("Cancel")');
    
    console.log('✅ Mobile responsiveness test passed');
  });
});
