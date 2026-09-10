import { test, expect } from '@playwright/test';

test.describe('Login flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('renders the login form', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign in');
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.route('**/auth/login', async (route) => {
      if (route.request().method() !== 'POST') return route.continue();
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Unauthorized' }),
      });
    });

    await page.locator('input[type="email"]').fill('wrong@test.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('redirects to /favorites on successful login', async ({ page }) => {
    await page.route('**/auth/login', async (route) => {
      if (route.request().method() !== 'POST') return route.continue();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'ok',
          user_id: '1',
          access_token: 'tok',
          username: 'nick',
        }),
      });
    });

    await page.locator('input[type="email"]').fill('user@test.com');
    await page.locator('input[type="password"]').fill('correctpassword');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/favorites/);
  });
});