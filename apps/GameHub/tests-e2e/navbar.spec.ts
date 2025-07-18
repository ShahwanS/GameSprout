// import { test, expect } from '@playwright/test';

// test.describe('Navbar', () => {
//   test.beforeEach(async ({ page }) => {
//     await page.goto('/');
//   });

//   test('should display GameSprout logo and brand', async ({ page }) => {
//     await expect(page.getByRole('link', { name: /GameSprout/i })).toBeVisible();
//     await expect(page.getByText('GameSprout')).toBeVisible();
//     await expect(page.getByText('Beta')).toBeVisible();
//   });

//   test('should display all navigation links', async ({ page }) => {
//     const navigationLinks = [
//       { name: 'Home', href: '/' },
//       { name: 'RPSLS', href: '/rock-paper-scissors-lizard-spock' },
//       { name: 'Reaction Test', href: '/reaction-test' },
//       { name: 'Fishing', href: '/games/fishing' },
//       { name: 'Kniffel', href: '/games/kniffel' },
//       { name: 'Nim', href: '/games/nim' },
//     ];

//     for (const link of navigationLinks) {
//       const linkElement = page.getByRole('link', { name: new RegExp(link.name, 'i') });
//       await expect(linkElement).toBeVisible();
//       await expect(linkElement).toHaveAttribute('href', link.href);
//     }
//   });

//   test('should show mobile menu button on smaller screens', async ({ page }) => {
//     // Set viewport to mobile size
//     await page.setViewportSize({ width: 375, height: 667 });
    
//     const mobileMenuButton = page.getByRole('button', { name: /Toggle menu/i });
//     await expect(mobileMenuButton).toBeVisible();
//   });

//   test('should toggle mobile menu when button is clicked', async ({ page }) => {
//     await page.setViewportSize({ width: 375, height: 667 });
    
//     const mobileMenuButton = page.getByRole('button', { name: /Toggle menu/i });
    
//     // Menu should be hidden initially
//     await expect(page.locator('[data-testid="mobile-menu"]')).not.toBeVisible();
    
//     // Click to open menu
//     await mobileMenuButton.click();
//     await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
//     // Click to close menu
//     await mobileMenuButton.click();
//     await expect(page.locator('[data-testid="mobile-menu"]')).not.toBeVisible();
//   });

//   test('should show online badge for online games in mobile menu', async ({ page }) => {
//     await page.setViewportSize({ width: 375, height: 667 });
    
//     const mobileMenuButton = page.getByRole('button', { name: /Toggle menu/i });
//     await mobileMenuButton.click();
    
//     // Check for online badges on multiplayer games
//     const onlineGames = ['Fishing', 'Kniffel', 'Nim'];
//     for (const game of onlineGames) {
//       const gameLink = page.getByRole('link', { name: new RegExp(game, 'i') });
//       const onlineBadge = gameLink.locator('xpath=..').getByText('Online');
//       await expect(onlineBadge).toBeVisible();
//     }
//   });

//   test('should have proper accessibility attributes', async ({ page }) => {
//     const mobileMenuButton = page.getByRole('button', { name: /Toggle menu/i });
//     await expect(mobileMenuButton).toHaveAttribute('aria-label', 'Toggle menu');
    
//     const logoLink = page.getByRole('link', { name: /GameSprout/i });
//     await expect(logoLink).toBeVisible();
//   });

//   test('should navigate to different pages when links are clicked', async ({ page }) => {
//     // Test navigation to RPSLS
//     await page.getByRole('link', { name: /RPSLS/i }).click();
//     await expect(page).toHaveURL('/rock-paper-scissors-lizard-spock');
    
//     // Test navigation to Reaction Test
//     await page.getByRole('link', { name: /Reaction Test/i }).click();
//     await expect(page).toHaveURL('/reaction-test');
    
//     // Test navigation back to home
//     await page.getByRole('link', { name: /Home/i }).click();
//     await expect(page).toHaveURL('/');
//   });

//   test('should maintain navigation state across page loads', async ({ page }) => {
//     // Navigate to a game page
//     await page.getByRole('link', { name: /RPSLS/i }).click();
//     await expect(page).toHaveURL('/rock-paper-scissors-lizard-spock');
    
//     // Refresh the page
//     await page.reload();
    
//     // Navigation should still be visible
//     await expect(page.getByRole('link', { name: /Home/i })).toBeVisible();
//     await expect(page.getByRole('link', { name: /GameSprout/i })).toBeVisible();
//   });

//   test('should be responsive on different screen sizes', async ({ page }) => {
//     // Test desktop view
//     await page.setViewportSize({ width: 1920, height: 1080 });
//     await expect(page.getByRole('navigation')).toBeVisible();
    
//     // Test tablet view
//     await page.setViewportSize({ width: 768, height: 1024 });
//     await expect(page.getByRole('navigation')).toBeVisible();
    
//     // Test mobile view
//     await page.setViewportSize({ width: 375, height: 667 });
//     await expect(page.getByRole('navigation')).toBeVisible();
//   });

//   test('should have proper styling and layout', async ({ page }) => {
//     const navbar = page.getByRole('navigation');
    
//     // Check for proper positioning
//     await expect(navbar).toHaveCSS('position', 'fixed');
//     await expect(navbar).toHaveCSS('top', '0px');
//     await expect(navbar).toHaveCSS('width', '100%');
//   });

//   test('should handle keyboard navigation', async ({ page }) => {
//     // Focus on the first navigation link
//     await page.keyboard.press('Tab');
    
//     // Should be able to navigate with arrow keys
//     await page.keyboard.press('ArrowRight');
    
//     // Should be able to activate with Enter
//     await page.keyboard.press('Enter');
    
//     // Should navigate to the selected page
//     await expect(page).not.toHaveURL('/');
//   });
// }); 