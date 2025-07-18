// import { test, expect } from '@playwright/test';

// test.describe('Game Layout', () => {
//   test.beforeEach(async ({ page }) => {
//     await page.goto('/games/fishing');
//   });

//   test('should display game layout with proper structure', async ({ page }) => {
//     // Check for game layout elements
//     await expect(page.locator('[data-testid="game-layout"]')).toBeVisible();
//     await expect(page.getByText('Fishing Game')).toBeVisible();
//   });

//   test('should show room creation/joining interface', async ({ page }) => {
//     // Should show create or join room interface
//     await expect(page.getByText('Create or Join Room')).toBeVisible();
//     await expect(page.getByRole('button', { name: /Create Room/i })).toBeVisible();
//     await expect(page.getByRole('button', { name: /Join Room/i })).toBeVisible();
//   });

//   test('should handle room creation flow', async ({ page }) => {
//     // Click create room button
//     await page.getByRole('button', { name: /Create Room/i }).click();
    
//     // Should show player name input
//     await expect(page.getByLabel(/Your Name/i)).toBeVisible();
    
//     // Fill in player name
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
    
//     // Click create room
//     await page.getByRole('button', { name: /Create Room/i }).click();
    
//     // Should show room code and waiting message
//     await expect(page.getByText(/Room Code:/i)).toBeVisible();
//     await expect(page.getByText(/Waiting for players/i)).toBeVisible();
//   });

//   test('should handle room joining flow', async ({ page }) => {
//     // Click join room button
//     await page.getByRole('button', { name: /Join Room/i }).click();
    
//     // Should show room code input
//     await expect(page.getByLabel(/Room Code/i)).toBeVisible();
//     await expect(page.getByLabel(/Your Name/i)).toBeVisible();
    
//     // Fill in room code and player name
//     await page.getByLabel(/Room Code/i).fill('ABC123');
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
    
//     // Click join room
//     await page.getByRole('button', { name: /Join Room/i }).click();
//   });

//   test('should display player information in lobby', async ({ page }) => {
//     // Create a room first
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create Room/i }).click();
    
//     // Should show player information
//     await expect(page.getByText('TestPlayer')).toBeVisible();
//     await expect(page.getByText(/Host/i)).toBeVisible();
//   });

//   test('should show start game button for host', async ({ page }) => {
//     // Create a room first
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create Room/i }).click();
    
//     // Should show start game button for host
//     await expect(page.getByRole('button', { name: /Start Game/i })).toBeVisible();
//   });

//   test('should handle game start', async ({ page }) => {
//     // Create a room and start game
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByRole('button', { name: /Start Game/i }).click();
    
//     // Should transition to game interface
//     await expect(page.getByText(/Current Player/i)).toBeVisible();
//   });

//   test('should display game interface elements', async ({ page }) => {
//     // Start a game
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByRole('button', { name: /Start Game/i }).click();
    
//     // Check for game interface elements
//     await expect(page.getByText(/Current Player/i)).toBeVisible();
//     await expect(page.getByText(/Your Hand/i)).toBeVisible();
//     await expect(page.getByText(/Other Players/i)).toBeVisible();
//   });

//   test('should handle responsive design', async ({ page }) => {
//     // Test mobile view
//     await page.setViewportSize({ width: 375, height: 667 });
//     await expect(page.locator('[data-testid="game-layout"]')).toBeVisible();
    
//     // Test tablet view
//     await page.setViewportSize({ width: 768, height: 1024 });
//     await expect(page.locator('[data-testid="game-layout"]')).toBeVisible();
    
//     // Test desktop view
//     await page.setViewportSize({ width: 1920, height: 1080 });
//     await expect(page.locator('[data-testid="game-layout"]')).toBeVisible();
//   });

//   test('should handle error states', async ({ page }) => {
//     // Try to join with invalid room code
//     await page.getByRole('button', { name: /Join Room/i }).click();
//     await page.getByLabel(/Room Code/i).fill('INVALID');
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Join Room/i }).click();
    
//     // Should show error message
//     await expect(page.getByText(/Room not found/i)).toBeVisible();
//   });

//   test('should handle network errors gracefully', async ({ page }) => {
//     // Simulate network error by going offline
//     await page.context().setOffline(true);
    
//     // Try to create a room
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create Room/i }).click();
    
//     // Should handle the error gracefully
//     await expect(page.getByText(/Error/i)).toBeVisible();
    
//     // Go back online
//     await page.context().setOffline(false);
//   });

//   test('should maintain game state across page reloads', async ({ page }) => {
//     // Create a room
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create Room/i }).click();
    
//     // Get room code
//     const roomCode = await page.locator('[data-testid="room-code"]').textContent();
    
//     // Reload the page
//     await page.reload();
    
//     // Should still be in the same room
//     await expect(page.getByText(roomCode!)).toBeVisible();
//   });

//   test('should handle player disconnection', async ({ page }) => {
//     // Create a room
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create Room/i }).click();
    
//     // Simulate disconnection
//     await page.context().setOffline(true);
    
//     // Should show disconnection message
//     await expect(page.getByText(/Connection lost/i)).toBeVisible();
    
//     // Go back online
//     await page.context().setOffline(false);
    
//     // Should reconnect automatically
//     await expect(page.getByText(/Reconnected/i)).toBeVisible();
//   });

//   test('should have proper accessibility features', async ({ page }) => {
//     // Check for proper ARIA labels
//     await expect(page.getByRole('button', { name: /Create Room/i })).toBeVisible();
//     await expect(page.getByRole('button', { name: /Join Room/i })).toBeVisible();
    
//     // Check for proper heading structure
//     await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
//   });

//   test('should handle keyboard navigation', async ({ page }) => {
//     // Navigate through form elements with keyboard
//     await page.keyboard.press('Tab');
//     await expect(page.locator(':focus')).toHaveAttribute('name', 'playerName');
    
//     await page.keyboard.press('Tab');
//     await expect(page.locator(':focus')).toHaveText('Create Room');
    
//     await page.keyboard.press('Enter');
//     await expect(page.getByLabel(/Your Name/i)).toBeVisible();
//   });
// }); 