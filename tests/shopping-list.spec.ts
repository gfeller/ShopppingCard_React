import { test, expect } from '@playwright/test';

test.describe('shopping-list', () => {

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('http://localhost:5173');
  });

  test('add / remove new list', async ({ page }) => {
    await page.locator('.addNewList').click();
    await page.locator('input').fill('Test list');
    await page.locator('[data-testid="createNewList"]').click();
    const testList = page.locator('text=Test list').first();
    await expect(testList).toBeVisible();
    await testList.click();
    await page.locator('[aria-label="edit"]').first().click();
    await page.locator('text=Liste löschen').click();
    await page.locator('text=Löschen bestätigen').click();
  });
});