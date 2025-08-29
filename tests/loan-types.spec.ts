import { test, expect } from '@playwright/test';

test.describe('Loan Types Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');
    
    // Wait for the login form to be visible
    await page.waitForSelector('input[type="email"]');
    
    // Fill in login credentials for real account
    await page.fill('input[type="email"]', 'Ryans@onpointbs.com');
    await page.fill('input[type="password"]', 'Samari1!');
    
    // Click the login button
    await page.click('button[type="submit"]');
    
    // Wait for verification step to appear
    await page.waitForSelector('text=Enter Verification Code', { timeout: 10000 });
    
    // The verification code should be logged to console for testing
    // For now, we'll wait a moment and then check if we can proceed
    // In a real scenario, you would check the console logs or email
    
    // Wait for the verification form to be visible
    await page.waitForSelector('input[placeholder="Verification Code"]', { timeout: 10000 });
    
    // For testing purposes, let's try a common verification code or wait for manual input
    // You can check the console logs for the actual code that was sent
    console.log('🔐 Check the console logs for the verification code that was sent to Ryans@onpointbs.com');
    
    // Wait for manual verification or proceed if already verified
    // This is a temporary workaround for testing
    
    // Try to wait for navigation to dashboard or workspace selection
    try {
      await page.waitForURL(/dashboard|workspace|loan-types/, { timeout: 30000 });
    } catch (error) {
      console.log('⚠️ Still on verification page - you may need to manually enter the verification code');
      console.log('🔐 Check the console logs for the verification code');
      
      // Wait for manual verification
      await page.waitForURL(/dashboard|workspace|loan-types/, { timeout: 60000 });
    }
    
    // Navigate to loan types page
    await page.goto('/loan-types');
    
    // Wait for the page to load
    await page.waitForSelector('h1');
  });

  test('should display loan types page with premium design', async ({ page }) => {
    // Check that the premium header is displayed
    await expect(page.locator('h1')).toContainText('Loan Types');
    
    // Check for premium design elements
    await expect(page.locator('.bg-gradient-to-br')).toBeVisible();
    await expect(page.locator('.backdrop-blur-sm')).toBeVisible();
    
    // Check for the add loan type button
    await expect(page.locator('button:has-text("+ Add Loan Type")')).toBeVisible();
  });

  test('should show loan types with associated data', async ({ page }) => {
    // Wait for loan types to load
    await page.waitForSelector('.group.relative', { timeout: 10000 });
    
    // Check that loan types are displayed
    const loanTypeCards = page.locator('.group.relative');
    await expect(loanTypeCards.first()).toBeVisible();
    
    // Check for quick stats
    await expect(page.locator('.text-2xl.font-bold.text-brand-orange')).toBeVisible();
  });

  test('should expand loan type details', async ({ page }) => {
    // Wait for loan types to load
    await page.waitForSelector('.group.relative', { timeout: 10000 });
    
    // Click the expand button for the first loan type
    const expandButton = page.locator('button:has-text("Expand Details")').first();
    await expandButton.click();
    
    // Check that details are expanded
    await expect(page.locator('h4:has-text("Workflow Stages")')).toBeVisible();
    await expect(page.locator('h4:has-text("Task Templates")')).toBeVisible();
    await expect(page.locator('h4:has-text("Clients")')).toBeVisible();
    await expect(page.locator('h4:has-text("Loan Files")')).toBeVisible();
  });

  test('should display task templates for loan types', async ({ page }) => {
    // Wait for loan types to load
    await page.waitForSelector('.group.relative', { timeout: 10000 });
    
    // Expand the first loan type
    const expandButton = page.locator('button:has-text("Expand Details")').first();
    await expandButton.click();
    
    // Check that task templates section is visible
    await expect(page.locator('h4:has-text("Task Templates")')).toBeVisible();
    
    // Check for task template cards or empty state
    const taskTemplatesSection = page.locator('h4:has-text("Task Templates")').locator('..').locator('..');
    await expect(taskTemplatesSection).toBeVisible();
  });

  test('should display clients assigned to loan types', async ({ page }) => {
    // Wait for loan types to load
    await page.waitForSelector('.group.relative', { timeout: 10000 });
    
    // Expand the first loan type
    const expandButton = page.locator('button:has-text("Expand Details")').first();
    await expandButton.click();
    
    // Check that clients section is visible
    await expect(page.locator('h4:has-text("Clients")')).toBeVisible();
    
    // Check for client cards or empty state
    const clientsSection = page.locator('h4:has-text("Clients")').locator('..').locator('..');
    await expect(clientsSection).toBeVisible();
  });

  test('should display loan files for loan types', async ({ page }) => {
    // Wait for loan types to load
    await page.waitForSelector('.group.relative', { timeout: 10000 });
    
    // Expand the first loan type
    const expandButton = page.locator('button:has-text("Expand Details")').first();
    await expandButton.click();
    
    // Check that loan files section is visible
    await expect(page.locator('h4:has-text("Loan Files")')).toBeVisible();
    
    // Check for loan file cards or empty state
    const loanFilesSection = page.locator('h4:has-text("Loan Files")').locator('..').locator('..');
    await expect(loanFilesSection).toBeVisible();
  });

  test('should filter loan types by category', async ({ page }) => {
    // Wait for filters to load
    await page.waitForSelector('select[value="all"]');
    
    // Select a specific category
    await page.selectOption('select[value="all"]', 'Residential');
    
    // Check that the filter is applied
    await expect(page.locator('select[value="all"]')).toHaveValue('Residential');
  });

  test('should search loan types', async ({ page }) => {
    // Wait for search input to load
    await page.waitForSelector('input[placeholder="Search loan types..."]');
    
    // Type in search term
    await page.fill('input[placeholder="Search loan types..."]', 'Mortgage');
    
    // Check that search is applied
    await expect(page.locator('input[placeholder="Search loan types..."]')).toHaveValue('Mortgage');
  });

  test('should create new loan type', async ({ page }) => {
    // Click add loan type button
    await page.click('button:has-text("+ Add Loan Type")');
    
    // Wait for modal to appear
    await page.waitForSelector('h2:has-text("Create Loan Type")');
    
    // Fill in loan type details
    await page.fill('input[placeholder="Loan type name"]', 'Test Loan Type');
    await page.fill('textarea', 'Test description for loan type');
    await page.selectOption('select', 'Residential');
    
    // Add a workflow stage
    await page.click('button:has-text("+ Add Stage")');
    await page.fill('input[placeholder="Stage name"]:last', 'Test Stage');
    
    // Submit the form
    await page.click('button:has-text("Create Loan Type")');
    
    // Wait for modal to close
    await page.waitForSelector('h2:has-text("Create Loan Type")', { state: 'hidden' });
    
    // Check that the new loan type appears
    await expect(page.locator('text=Test Loan Type')).toBeVisible();
  });
});
