import { test, expect } from '@playwright/test';

test.describe('Protected route', () => {
  test('redirects unauthenticated user from /favorites to /login', async ({ page }) => {
    await page.goto('/favorites');
    await expect(page).toHaveURL(/\/login/);
  });
});