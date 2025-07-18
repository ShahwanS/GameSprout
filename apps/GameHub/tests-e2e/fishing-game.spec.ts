// import { test, expect } from '@playwright/test';

// test.describe('Fishing Game', () => {
//   test.beforeEach(async ({ page }) => {
//     await page.goto('/games/fishing');
//   });

//   test('should display fishing game interface', async ({ page }) => {
//     await expect(page.getByText('Fishing Game')).toBeVisible();
//     await expect(page.getByText('Create Room')).toBeVisible();
//     await expect(page.getByText('Join Room')).toBeVisible();
//   });

//   test('should handle room creation flow', async ({ page }) => {
//     // Fill in player name
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
    
//     // Click create room
//     await page.getByRole('button', { name: /Create New Room/i }).click();
    
//     // Should show room code and waiting message
//     await expect(page.getByText(/Room Code:/i)).toBeVisible();
//     await expect(page.getByText(/Waiting for players/i)).toBeVisible();
//   });

//   test('should handle room joining flow', async ({ page }) => {
//     // Fill in room code and player name
//     await page.getByLabel(/Room Code/i).fill('ABC123');
//     await page.getByLabel(/Your Name/i).fill('TestPlayer2');
    
//     // Join room
//     await page.getByRole('button', { name: /Join Room/i }).click();
//   });

//   test('should display lobby with player information', async ({ page }) => {
//     // Create a room
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create New Room/i }).click();
    
//     // Should show player information
//     await expect(page.getByText('TestPlayer')).toBeVisible();
//     await expect(page.getByText(/Host/i)).toBeVisible();
//   });

//   test('should allow host to start game', async ({ page }) => {
//     // Create a room
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create New Room/i }).click();
    
//     // Should show start game button for host
//     await expect(page.getByRole('button', { name: /Start Game/i })).toBeVisible();
    
//     // Start the game
//     await page.getByRole('button', { name: /Start Game/i }).click();
    
//     // Should transition to game interface
//     await expect(page.getByText(/Current Player/i)).toBeVisible();
//   });

//   test('should display game interface elements', async ({ page }) => {
//     // Start a game
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create New Room/i }).click();
//     await page.getByRole('button', { name: /Start Game/i }).click();
    
//     // Check for game interface elements
//     await expect(page.getByText(/Current Player/i)).toBeVisible();
//     await expect(page.getByText(/Your Hand/i)).toBeVisible();
//     await expect(page.getByText(/Other Players/i)).toBeVisible();
//     await expect(page.getByText(/Deck/i)).toBeVisible();
//   });

//   test('should show turn indicator when it is player turn', async ({ page }) => {
//     // Start a game
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create New Room/i }).click();
//     await page.getByRole('button', { name: /Start Game/i }).click();
    
//     // Should show turn indicator
//     await expect(page.getByText(/It's your turn/i)).toBeVisible();
//   });

//   test('should display player hands', async ({ page }) => {
//     // Start a game
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create New Room/i }).click();
//     await page.getByRole('button', { name: /Start Game/i }).click();
    
//     // Should show player hands
//     await expect(page.getByText(/Your Hand/i)).toBeVisible();
//     await expect(page.getByText(/Other Players/i)).toBeVisible();
//   });

//   test('should display deck information', async ({ page }) => {
//     // Start a game
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create New Room/i }).click();
//     await page.getByRole('button', { name: /Start Game/i }).click();
    
//     // Should show deck
//     await expect(page.getByText(/Deck/i)).toBeVisible();
//     await expect(page.getByText(/cards remaining/i)).toBeVisible();
//   });

//   test('should handle card selection', async ({ page }) => {
//     // Start a game
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create New Room/i }).click();
//     await page.getByRole('button', { name: /Start Game/i }).click();
    
//     // Try to select a card if available
//     const cards = page.locator('[data-testid^="card-"]');
//     if (await cards.count() > 0) {
//       await cards.first().click();
//       // Should show some response to card selection
//       await expect(page.locator('[data-testid="selected-card"]')).toBeVisible();
//     }
//   });

//   test('should handle asking for cards', async ({ page }) => {
//     // Start a game
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create New Room/i }).click();
//     await page.getByRole('button', { name: /Start Game/i }).click();
    
//     // Try to ask for cards if it's player's turn
//     if (await page.getByText(/It's your turn/i).isVisible()) {
//       // Click on another player to ask for cards
//       const otherPlayers = page.locator('[data-testid^="player-"]');
//       if (await otherPlayers.count() > 0) {
//         await otherPlayers.first().click();
//         // Should show card selection interface
//         await expect(page.getByText(/Ask for cards/i)).toBeVisible();
//       }
//     }
//   });

//   test('should display game activity', async ({ page }) => {
//     // Start a game
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create New Room/i }).click();
//     await page.getByRole('button', { name: /Start Game/i }).click();
    
//     // Should show game activity area
//     await expect(page.locator('[data-testid="game-activity"]')).toBeVisible();
//   });

//   test('should handle game over state', async ({ page }) => {
//     // Start a game
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create New Room/i }).click();
//     await page.getByRole('button', { name: /Start Game/i }).click();
    
//     // Simulate game over (this would require specific game logic)
//     // For now, just check that the game interface is stable
//     await expect(page.getByText(/Current Player/i)).toBeVisible();
//   });

//   test('should handle new game functionality', async ({ page }) => {
//     // Start a game
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create New Room/i }).click();
//     await page.getByRole('button', { name: /Start Game/i }).click();
    
//     // Look for new game button
//     const newGameButton = page.getByRole('button', { name: /New Game/i });
//     if (await newGameButton.isVisible()) {
//       await newGameButton.click();
//       // Should return to lobby or restart game
//       await expect(page.getByText(/Waiting for players/i)).toBeVisible();
//     }
//   });

//   test('should be responsive on different screen sizes', async ({ page }) => {
//     // Start a game
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByRole('button', { name: /Start Game/i }).click();
    
//     // Test mobile view
//     await page.setViewportSize({ width: 375, height: 667 });
//     await expect(page.getByText(/Current Player/i)).toBeVisible();
    
//     // Test tablet view
//     await page.setViewportSize({ width: 768, height: 1024 });
//     await expect(page.getByText(/Current Player/i)).toBeVisible();
    
//     // Test desktop view
//     await page.setViewportSize({ width: 1920, height: 1080 });
//     await expect(page.getByText(/Current Player/i)).toBeVisible();
//   });

//   test('should handle error states gracefully', async ({ page }) => {
//     // Try to join with invalid room code
//     await page.getByRole('button', { name: /Join Room/i }).click();
//     await page.getByLabel(/Room Code/i).fill('INVALID');
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Join Room/i }).click();
    
//     // Should show error message
//     await expect(page.getByText(/Room not found|Invalid room/i)).toBeVisible();
//   });

//   test('should handle network errors', async ({ page }) => {
//     // Start a game
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByRole('button', { name: /Start Game/i }).click();
    
//     // Simulate network error
//     await page.context().setOffline(true);
    
//     // Should handle the error gracefully
//     await expect(page.getByText(/Connection lost|Network error/i)).toBeVisible();
    
//     // Go back online
//     await page.context().setOffline(false);
    
//     // Should reconnect
//     await expect(page.getByText(/Reconnected|Connection restored/i)).toBeVisible();
//   });

//   test('should have proper accessibility features', async ({ page }) => {
//     // Start a game
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByRole('button', { name: /Start Game/i }).click();
    
//     // Check for proper ARIA labels
//     await expect(page.getByRole('button', { name: /Start Game/i })).toBeVisible();
//     await expect(page.getByRole('button', { name: /New Game/i })).toBeVisible();
    
//     // Check for proper heading structure
//     await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
//   });

//   test('should handle keyboard navigation', async ({ page }) => {
//     // Start a game
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByRole('button', { name: /Start Game/i }).click();
    
//     // Navigate through game elements with keyboard
//     await page.keyboard.press('Tab');
//     await expect(page.locator(':focus')).toBeVisible();
    
//     // Should be able to navigate through game interface
//     await page.keyboard.press('Tab');
//     await expect(page.locator(':focus')).toBeVisible();
//   });

//   test('should maintain game state across page reloads', async ({ page }) => {
//     // Start a game
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByLabel(/Your Name/i).fill('TestPlayer');
//     await page.getByRole('button', { name: /Create Room/i }).click();
//     await page.getByRole('button', { name: /Start Game/i }).click();
    
//     // Get room code
//     const roomCode = await page.locator('[data-testid="room-code"]').textContent();
    
//     // Reload the page
//     await page.reload();
    
//     // Should still be in the same room
//     await expect(page.getByText(roomCode!)).toBeVisible();
//   });
// }); 