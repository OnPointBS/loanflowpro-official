import { test, expect } from '@playwright/test';

test.describe('Simple Navigation Test', () => {
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

  test('should navigate to clients page successfully', async ({ page }) => {
    console.log('🚀 Starting simple navigation test...');
    
    // Test Dashboard page
    console.log('📍 Testing Dashboard page...');
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    console.log('✅ Dashboard page loaded');
    
    // Navigate to Clients page
    console.log('📍 Navigating to Clients page...');
    await page.click('a:has-text("👥Clients")');
    await page.waitForURL('/clients');
    await page.waitForTimeout(2000);
    
    // Check if we're on the clients page
    await expect(page.locator('h1:has-text("Clients")')).toBeVisible();
    console.log('✅ Successfully navigated to Clients page');
    
    // Take a screenshot to see what's there
    await page.screenshot({ path: 'clients-page-test.png', fullPage: true });
    console.log('📸 Screenshot saved as clients-page-test.png');
    
    // Check what buttons are actually visible
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    console.log(`📍 Found ${buttonCount} buttons on clients page`);
    
    if (buttonCount > 0) {
      const buttonTexts = await buttons.allTextContents();
      console.log('📍 Button texts:', buttonTexts);
    }
    
    console.log('🎉 Simple navigation test completed!');
  });
});

