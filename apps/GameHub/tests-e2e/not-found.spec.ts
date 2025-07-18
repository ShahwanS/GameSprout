// import { test, expect } from '@playwright/test';

// test.describe('Not Found Page', () => {
//   test('should display 404 page for invalid routes', async ({ page }) => {
//     await page.goto('/invalid-route');
    
//     await expect(page.getByText('The page you are looking for does not exist.')).toBeVisible();
//     await expect(page.getByRole('button', { name: /Go back/i })).toBeVisible();
//     await expect(page.getByRole('link', { name: /Start Over/i })).toBeVisible();
//   });

//   test('should display custom error message when provided', async ({ page }) => {
//     // Navigate to a route that might show custom error
//     await page.goto('/games/invalid-game');
    
//     // Should show some form of error message
//     await expect(page.getByText(/not found|does not exist|error/i)).toBeVisible();
//   });

//   test('should have Go back button functionality', async ({ page }) => {
//     // First navigate to a valid page
//     await page.goto('/');
//     await expect(page.getByText('GameSprout')).toBeVisible();
    
//     // Then navigate to invalid route
//     await page.goto('/invalid-route');
//     await expect(page.getByText('The page you are looking for does not exist.')).toBeVisible();
    
//     // Click Go back button
//     await page.getByRole('button', { name: /Go back/i }).click();
    
//     // Should go back to previous page
//     await expect(page.getByText('GameSprout')).toBeVisible();
//   });

//   test('should have Start Over link functionality', async ({ page }) => {
//     await page.goto('/invalid-route');
    
//     // Click Start Over link
//     await page.getByRole('link', { name: /Start Over/i }).click();
    
//     // Should navigate to home page
//     await expect(page).toHaveURL('/');
//     await expect(page.getByText('GameSprout')).toBeVisible();
//   });

//   test('should have proper styling and layout', async ({ page }) => {
//     await page.goto('/invalid-route');
    
//     const errorContainer = page.locator('.space-y-2');
//     await expect(errorContainer).toBeVisible();
    
//     // Check button styling
//     const goBackButton = page.getByRole('button', { name: /Go back/i });
//     await expect(goBackButton).toHaveClass(/bg-emerald-500/);
    
//     const startOverLink = page.getByRole('link', { name: /Start Over/i });
//     await expect(startOverLink).toHaveClass(/bg-cyan-600/);
//   });

//   test('should be responsive on different screen sizes', async ({ page }) => {
//     await page.goto('/invalid-route');
    
//     // Test mobile view
//     await page.setViewportSize({ width: 375, height: 667 });
//     await expect(page.getByText('The page you are looking for does not exist.')).toBeVisible();
    
//     // Test tablet view
//     await page.setViewportSize({ width: 768, height: 1024 });
//     await expect(page.getByText('The page you are looking for does not exist.')).toBeVisible();
    
//     // Test desktop view
//     await page.setViewportSize({ width: 1920, height: 1080 });
//     await expect(page.getByText('The page you are looking for does not exist.')).toBeVisible();
//   });

//   test('should handle keyboard navigation', async ({ page }) => {
//     await page.goto('/invalid-route');
    
//     // Navigate to Go back button
//     await page.keyboard.press('Tab');
//     await expect(page.locator(':focus')).toHaveText('Go back');
    
//     // Navigate to Start Over link
//     await page.keyboard.press('Tab');
//     await expect(page.locator(':focus')).toHaveText('Start Over');
    
//     // Activate Start Over link
//     await page.keyboard.press('Enter');
//     await expect(page).toHaveURL('/');
//   });

//   test('should have proper accessibility attributes', async ({ page }) => {
//     await page.goto('/invalid-route');
    
//     // Check for proper button and link roles
//     await expect(page.getByRole('button', { name: /Go back/i })).toBeVisible();
//     await expect(page.getByRole('link', { name: /Start Over/i })).toBeVisible();
    
//     // Check for proper text content
//     await expect(page.getByText('The page you are looking for does not exist.')).toBeVisible();
//   });

//   test('should handle various invalid routes', async ({ page }) => {
//     const invalidRoutes = [
//       '/invalid-route',
//       '/games/invalid-game',
//       '/api/invalid-endpoint',
//       '/random/path/that/does/not/exist',
//       '/games/fishing/invalid-room',
//     ];

//     for (const route of invalidRoutes) {
//       await page.goto(route);
//       await expect(page.getByText(/not found|does not exist|error/i)).toBeVisible();
//     }
//   });

//   test('should maintain navigation state after error', async ({ page }) => {
//     // Navigate to a valid page first
//     await page.goto('/');
//     await expect(page.getByText('GameSprout')).toBeVisible();
    
//     // Navigate to invalid route
//     await page.goto('/invalid-route');
//     await expect(page.getByText('The page you are looking for does not exist.')).toBeVisible();
    
//     // Navigate back to valid page
//     await page.getByRole('link', { name: /Start Over/i }).click();
//     await expect(page.getByText('GameSprout')).toBeVisible();
    
//     // Should be able to navigate normally after error
//     await page.getByRole('link', { name: /RPSLS/i }).click();
//     await expect(page).toHaveURL('/rock-paper-scissors-lizard-spock');
//   });

//   test('should handle browser back/forward buttons', async ({ page }) => {
//     // Navigate to home
//     await page.goto('/');
//     await expect(page.getByText('GameSprout')).toBeVisible();
    
//     // Navigate to invalid route
//     await page.goto('/invalid-route');
//     await expect(page.getByText('The page you are looking for does not exist.')).toBeVisible();
    
//     // Use browser back button
//     await page.goBack();
//     await expect(page.getByText('GameSprout')).toBeVisible();
    
//     // Use browser forward button
//     await page.goForward();
//     await expect(page.getByText('The page you are looking for does not exist.')).toBeVisible();
//   });

//   test('should handle direct URL access to invalid routes', async ({ page }) => {
//     // Test direct access to invalid route
//     await page.goto('/invalid-route', { waitUntil: 'networkidle' });
//     await expect(page.getByText('The page you are looking for does not exist.')).toBeVisible();
    
//     // Should not show loading states or errors
//     await expect(page.locator('.loading')).not.toBeVisible();
//   });

//   test('should have consistent error messaging', async ({ page }) => {
//     const routes = ['/invalid1', '/invalid2', '/invalid3'];
    
//     for (const route of routes) {
//       await page.goto(route);
//       const errorText = await page.getByText(/not found|does not exist|error/i).textContent();
//       expect(errorText).toBeTruthy();
//     }
//   });
// }); 