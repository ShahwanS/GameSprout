// import { test, expect } from '@playwright/test';

// const gameChoices = ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock'] as const;

// test.describe('Rock Paper Scissors Lizard Spock Game', () => {
//   test.beforeEach(async ({ page }) => {
//     await page.goto('/rock-paper-scissors-lizard-spock');
//   });

//   test('should load the game page with initial elements and rules', async ({ page }) => {
//     await expect(page.getByRole('heading', { name: /Rock Paper Scissors Lizard Spock/i, level: 1 })).toBeVisible();
//     await expect(page.getByText(/Scissors cuts paper, paper covers rock/i)).toBeVisible();
//     await expect(page.getByRole('heading', { name: /Choose your weapon/i })).toBeVisible();
//     for (const choice of gameChoices) {
//       await expect(page.getByRole('button', { name: choice, exact: true })).toBeVisible();
//     }
//   });


//   // test('should allow user to make a choice and see a result', async ({ page }) => {
//   //   const userChoice = 'Rock';
//   //   await expect(async () => {
//   //     await page.waitForLoadState('networkidle');
      
//   //     await expect(page.getByRole('heading', { name: /Rock Paper Scissors Lizard Spock/i, level: 1 })).toBeVisible();
      
//   //     const gameOverHeading = page.getByRole('heading', { name: /Game Over!/i });
//   //     if (await gameOverHeading.isVisible()) {
//   //       await page.getByRole('button', { name: /Play Again/i }).click();
//   //       await page.waitForTimeout(500);
//   //     }
      
//   //     const rockButton = page.getByRole('button', { name: userChoice, exact: true });
//   //     await expect(rockButton).toBeVisible();
//   //     await rockButton.click();
      
//   //     await expect(page.getByRole('heading', { name: /Game Over!/i })).toBeVisible();
//   //     await expect(page.getByText(`You chose ${userChoice}`)).toBeVisible();
//   //     await expect(page.getByText(/AI chose (Rock|Paper|Scissors|Lizard|Spock)/)).toBeVisible();
//   //     await expect(page.getByText(/(crushes|covers|cuts|decapitates|eats|poisons|smashes|disproves|vaporizes|Draw|You Lose)/i)).toBeVisible();
//   //     await expect(page.getByRole('button', { name: /Play Again/i })).toBeVisible();
//   //   }).toPass()
//   // });

//   test('should allow restarting the game after a round', async ({ page }) => {
//     await expect(async () => {
//     await page.waitForLoadState('networkidle');
    
//     await expect(page.getByRole('heading', { name: /Rock Paper Scissors Lizard Spock/i, level: 1 })).toBeVisible();
    
//     await page.waitForTimeout(2000);
    
//     const paperButton = page.getByRole('button', { name: 'Paper', exact: true });
//     await expect(paperButton).toBeVisible();
//     await paperButton.click();
    
//     await expect(page.getByRole('heading', { name: /Game Over!/i })).toBeVisible();
    
//     const playAgainButton = page.getByRole('button', { name: /Play Again/i });
//     await expect(playAgainButton).toBeVisible();
//     await playAgainButton.click();
    
//     await expect(page.getByRole('heading', { name: /Rock Paper Scissors Lizard Spock/i, level: 1 })).toBeVisible();
//     for (const choice of gameChoices) {
//       await expect(page.getByRole('button', { name: choice, exact: true })).toBeVisible();
//     }
//     await expect(page.getByRole('heading', { name: /Game Over!/i })).not.toBeVisible();
//     }).toPass()
//   });
// }); 