import { test, expect } from '@playwright/test';

test.describe('Debug Dashboard Test', () => {
  test('should debug what is visible after demo login', async ({ page }) => {
    console.log('🚀 Starting debug test...');
    
    // Navigate to the login page
    await page.goto('/login');
    console.log('✅ Navigated to login page');
    
    // Click demo account button
    await page.click('text=Try Demo Account (demo@loanflowpro.com)');
    console.log('✅ Clicked demo account button');
    
    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard');
    console.log('✅ Navigated to dashboard');
    
    // Wait for page to fully load
    await page.waitForTimeout(3000);
    
    // Take a screenshot to see what's visible
    await page.screenshot({ path: 'debug-dashboard.png', fullPage: true });
    console.log('📸 Screenshot saved as debug-dashboard.png');
    
    // Check what elements are actually visible
    console.log('🔍 Checking visible elements...');
    
    // Check for any h1 elements
    const h1Elements = page.locator('h1');
    const h1Count = await h1Elements.count();
    console.log(`📍 Found ${h1Count} h1 elements`);
    
    if (h1Count > 0) {
      const h1Texts = await h1Elements.allTextContents();
      console.log('📍 H1 texts:', h1Texts);
    }
    
    // Check for any navigation elements
    const navElements = page.locator('nav, [role="navigation"], .sidebar, .nav');
    const navCount = await navElements.count();
    console.log(`📍 Found ${navCount} navigation elements`);
    
    // Check for any buttons
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    console.log(`📍 Found ${buttonCount} buttons`);
    
    if (buttonCount > 0) {
      const buttonTexts = await buttons.allTextContents();
      console.log('📍 Button texts:', buttonTexts.slice(0, 10)); // First 10 buttons
    }
    
    // Check for any links
    const links = page.locator('a');
    const linkCount = await links.count();
    console.log(`📍 Found ${linkCount} links`);
    
    if (linkCount > 0) {
      const linkTexts = await links.allTextContents();
      console.log('📍 Link texts:', linkTexts.slice(0, 10)); // First 10 links
    }
    
    // Check for any text containing navigation keywords
    const navigationTexts = page.locator('text=/Dashboard|Clients|Loan Types|Tasks|Analytics|Settings/');
    const navTextCount = await navigationTexts.count();
    console.log(`📍 Found ${navTextCount} navigation-related text elements`);
    
    if (navTextCount > 0) {
      const navTextContents = await navigationTexts.allTextContents();
      console.log('📍 Navigation text contents:', navTextContents);
    }
    
    // Check for any icons
    const icons = page.locator('text=/👥|📋|✅|📊|📈|⚙️/');
    const iconCount = await icons.count();
    console.log(`📍 Found ${iconCount} icon elements`);
    
    if (iconCount > 0) {
      const iconContents = await icons.allTextContents();
      console.log('📍 Icon contents:', iconContents);
    }
    
    // Check page HTML structure
    const pageContent = await page.content();
    console.log('📍 Page has content length:', pageContent.length);
    
    // Look for specific patterns in the HTML
    if (pageContent.includes('Clients')) {
      console.log('✅ Found "Clients" in page content');
    }
    if (pageContent.includes('Loan Types')) {
      console.log('✅ Found "Loan Types" in page content');
    }
    if (pageContent.includes('Tasks')) {
      console.log('✅ Found "Tasks" in page content');
    }
    
    console.log('🎉 Debug test completed!');
  });
});

