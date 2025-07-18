// import { test, expect } from '@playwright/test';

// test.describe('Homepage', () => {
//   test.beforeEach(async ({ page }) => {
//     await page.goto('/');
//   });

//   test('should have the correct title', async ({ page }) => {
//     await expect(page).toHaveTitle(/GameSprout|TanStack Start/i); // Case-insensitive match
//   });

//   test('should display the main GameSprout heading', async ({ page }) => {
//     const mainHeading = page.getByRole('heading', { name: /GameSprout/i, level: 1 });
//     await expect(mainHeading).toBeVisible();
//   });

//   test('should have game cards in the main content', async ({ page }) => {
//     // Check for game cards in the content area
//     const fishingGameCard = page.getByRole('link', { name: /Fishing Game/i }).first();
//     await expect(fishingGameCard).toBeVisible();

//     const kniffelGameCard = page.getByRole('link', { name: /Kniffel/i }).first();
//     await expect(kniffelGameCard).toBeVisible();

//     const rpslsGameCard = page.getByRole('link', { name: /Rock Paper Scissors Lizard Spock/i }).first();
//     await expect(rpslsGameCard).toBeVisible();

//     const reactionTestCard = page.getByRole('link', { name: /Reaction Test/i }).first();
//     await expect(reactionTestCard).toBeVisible();
//   });
// }); 