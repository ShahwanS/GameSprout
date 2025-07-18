// import { test, expect } from '@playwright/test';

// test.describe('Application Navigation', () => {
//   test('should navigate from homepage to Rock Paper Scissors Lizard Spock game', async ({ page }) => {
//     await page.goto('/');
    
//     await page.waitForLoadState('networkidle');
    
//     await page.locator('nav').getByRole('link', { name: /RPSLS/i }).click();
    
//     await expect(page).toHaveURL(/.*\/rock-paper-scissors-lizard-spock/);
    
//     await expect(page.getByRole('heading', { name: /Rock Paper Scissors Lizard Spock/i })).toBeVisible();
//   });

//   test('should navigate from homepage to Reaction Test game', async ({ page }) => {
//     await page.goto('/');
    
//     await page.waitForLoadState('networkidle');
    
//     await page.locator('nav').getByRole('link', { name: /Reaction Test/i }).click();
    
//     await expect(page).toHaveURL(/.*\/reaction-test/);
    
//     // Verify thepage content is loaded
//     await expect(page.getByRole('heading', { name: /Reaction Test/i })).toBeVisible();
//   });

//   test('should navigate back to homepage from game pages', async ({ page }) => {
//     await page.goto('/rock-paper-scissors-lizard-spock');
//     await page.waitForLoadState('networkidle');
    
//     await page.getByRole('link', { name: /GameSprout/i }).click();
    
//     await expect(page).toHaveURL('/');
    
//     await expect(page.getByRole('heading', { name: /GameSprout/i })).toBeVisible();
//   });

//   test('should show mobile menu on mobile devices', async ({ page }) => {
//     await page.setViewportSize({ width: 375, height: 667 });
    
//     await page.goto('/');
//     await page.waitForLoadState('networkidle');
    
//     // Click the mobile menu button
//     await page.getByRole('button', { name: /Toggle menu/i }).click();
    
//     await expect(page.locator('nav').getByRole('link', { name: /Home/i })).toBeVisible();
//     await expect(page.locator('nav').getByRole('link', { name: /RPSLS/i })).toBeVisible();
//     await expect(page.locator('nav').getByRole('link', { name: /Reaction Test/i })).toBeVisible();
//   });

//   test('should navigate to online games', async ({ page }) => {
//     await page.goto('/');
//     await page.waitForLoadState('networkidle');
    
//     await page.locator('nav').getByRole('link', { name: /Fishing/i }).click();
    
//     await expect(page).toHaveURL(/.*\/games\/fishing/);
    
//     await expect(page.getByText(/Create Room/i)).toBeVisible();
//   });
// }); 