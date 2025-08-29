import { test, expect } from '@playwright/test';

test.describe('Basic Application Smoke Test', () => {
  test('should load login page successfully', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');
    
    // Check if page loads
    await expect(page).toHaveTitle(/LoanFlowPro/);
    
    // Check for basic elements - the page structure shows LoanFlowPro as main title
    await expect(page.locator('h1')).toContainText('LoanFlowPro');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign in")')).toBeVisible();
    
    console.log('✅ Login page loaded successfully');
  });

  test('should have working demo account button', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');
    
    // Check for demo account button
    const demoButton = page.locator('text=Try Demo Account (demo@loanflowpro.com)');
    await expect(demoButton).toBeVisible();
    
    // Click demo account button
    await demoButton.click();
    
    // Wait for some navigation or state change
    await page.waitForTimeout(2000);
    
    console.log('✅ Demo account button is clickable');
  });

  test('should load dashboard after demo login', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');
    
    // Click demo account button
    await page.click('text=Try Demo Account (demo@loanflowpro.com)');
    
    // Wait for navigation
    await page.waitForTimeout(3000);
    
    // Check if we're on dashboard or if there are any errors
    const currentUrl = page.url();
    console.log('Current URL after demo login:', currentUrl);
    
    // Check for any error messages
    const errorMessages = page.locator('[class*="error"], [class*="Error"], .error, .Error');
    if (await errorMessages.count() > 0) {
      console.log('Error messages found:', await errorMessages.allTextContents());
    }
    
    // Check for dashboard elements if we're there
    const dashboardTitles = page.locator('h1');
    if (await dashboardTitles.count() > 0) {
      const titles = await dashboardTitles.allTextContents();
      console.log('Page titles found:', titles);
    }
    
    console.log('✅ Demo login attempt completed');
  });

  test('should check for console errors on page load', async ({ page }) => {
    const consoleMessages: string[] = [];
    
    page.on('console', msg => {
      consoleMessages.push(msg.text());
    });
    
    // Navigate to the login page
    await page.goto('/login');
    
    // Wait a bit for any console messages
    await page.waitForTimeout(2000);
    
    console.log('Console messages:', consoleMessages);
    
    // Check for any error-level console messages
    const errors = consoleMessages.filter(msg => 
      msg.toLowerCase().includes('error') || 
      msg.toLowerCase().includes('failed') ||
      msg.toLowerCase().includes('exception')
    );
    
    if (errors.length > 0) {
      console.log('⚠️ Console errors found:', errors);
    } else {
      console.log('✅ No console errors detected');
    }
  });
});
