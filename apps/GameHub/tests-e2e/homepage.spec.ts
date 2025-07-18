import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/GameSprout|TanStack Start/i); // Case-insensitive match
  });

  test('should display the main GameSprout heading', async ({ page }) => {
    const mainHeading = page.getByRole('heading', { name: /GameSprout/i, level: 1 });
    await expect(mainHeading).toBeVisible();
  });

  test('should have game cards in the main content', async ({ page }) => {
    // Check for game cards in the main content area
    const fishingGameCard = page.locator('main').getByRole('link', { name: /Fishing Game/i });
    await expect(fishingGameCard).toBeVisible();

    const kniffelGameCard = page.locator('main').getByRole('link', { name: /Kniffel/i });
    await expect(kniffelGameCard).toBeVisible();

    const rpslsGameCard = page.locator('main').getByRole('link', { name: /Rock Paper Scissors Lizard Spock/i });
    await expect(rpslsGameCard).toBeVisible();

    const reactionTestCard = page.locator('main').getByRole('link', { name: /Reaction Test/i });
    await expect(reactionTestCard).toBeVisible();
  });
}); 