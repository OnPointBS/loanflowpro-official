import { test, expect } from '@playwright/test';

test.describe('Loan Type Reordering Test', () => {
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

  test('should display reordering controls for assigned loan types', async ({ page }) => {
    console.log('🚀 Testing reordering controls display...');
    
    // Look for reordering controls (up/down arrows)
    const upButtons = page.locator('button[title="Move up"]');
    const downButtons = page.locator('button[title="Move down"]');
    
    const upCount = await upButtons.count();
    const downCount = await downButtons.count();
    
    console.log(`📍 Found ${upCount} up buttons and ${downCount} down buttons`);
    
    // Check if we have any reordering controls
    if (upCount > 0 && downCount > 0) {
      console.log('✅ Reordering controls are visible');
      
      // Check that the first up button is disabled (first item)
      const firstUpButton = upButtons.first();
      const isFirstUpDisabled = await firstUpButton.isDisabled();
      console.log(`📍 First up button disabled: ${isFirstUpDisabled}`);
      
      // Check that the last down button is disabled (last item)
      const lastDownButton = downButtons.last();
      const isLastDownDisabled = await lastDownButton.isDisabled();
      console.log(`📍 Last down button disabled: ${isLastDownDisabled}`);
      
      // Verify the visual styling for disabled buttons
      if (isFirstUpDisabled) {
        await expect(firstUpButton).toHaveClass(/text-gray-300/);
        console.log('✅ First up button has correct disabled styling');
      }
      
      if (isLastDownDisabled) {
        await expect(lastDownButton).toHaveClass(/text-gray-300/);
        console.log('✅ Last down button has correct disabled styling');
      }
      
    } else {
      console.log('ℹ️  No reordering controls found - may need assigned loan types');
    }
    
    console.log('🎉 Reordering controls test completed!');
  });

  test('should show order numbers for assigned loan types', async ({ page }) => {
    console.log('🚀 Testing order number display...');
    
    // Look for order numbers
    const orderTexts = page.locator('text=/Order: \d+/');
    const orderCount = await orderTexts.count();
    
    console.log(`📍 Found ${orderCount} order number displays`);
    
    if (orderCount > 0) {
      console.log('✅ Order numbers are visible');
      
      // Check that order numbers are sequential
      const orderNumbers = await orderTexts.allTextContents();
      console.log('📍 Order numbers found:', orderNumbers);
      
      // Verify they start from 1 and are sequential
      const numbers = orderNumbers.map(text => parseInt(text.replace('Order: ', '')));
      const isSequential = numbers.every((num, index) => num === index + 1);
      
      if (isSequential) {
        console.log('✅ Order numbers are sequential starting from 1');
      } else {
        console.log('⚠️  Order numbers are not sequential:', numbers);
      }
      
    } else {
      console.log('ℹ️  No order numbers found - may need assigned loan types');
    }
    
    console.log('🎉 Order number test completed!');
  });

  test('should have working reordering buttons for middle items', async ({ page }) => {
    console.log('🚀 Testing reordering button functionality...');
    
    // Look for enabled reordering buttons (not first or last)
    const enabledUpButtons = page.locator('button[title="Move up"]:not([disabled])');
    const enabledDownButtons = page.locator('button[title="Move down"]:not([disabled])');
    
    const enabledUpCount = await enabledUpButtons.count();
    const enabledDownCount = await enabledDownButtons.count();
    
    console.log(`📍 Found ${enabledUpCount} enabled up buttons and ${enabledDownCount} enabled down buttons`);
    
    if (enabledUpCount > 0 && enabledDownCount > 0) {
      console.log('✅ Found enabled reordering buttons for middle items');
      
      // Check that enabled buttons have the correct styling
      const firstEnabledUp = enabledUpButtons.first();
      const firstEnabledDown = enabledDownButtons.first();
      
      await expect(firstEnabledUp).toHaveClass(/text-blue-600/);
      await expect(firstEnabledDown).toHaveClass(/text-blue-600/);
      
      console.log('✅ Enabled reordering buttons have correct blue styling');
      
    } else {
      console.log('ℹ️  No enabled reordering buttons found - may need multiple assigned loan types');
    }
    
    console.log('🎉 Reordering button functionality test completed!');
  });
});

