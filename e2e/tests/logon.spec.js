const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form *button* is shown', async ({ page }) => {
    await expect(page.getByRole('button', { text: 'log in' })).toBeVisible()
  })

  test('Login form is shown when button clicked', async ({ page }) => {
    await page.getByRole('button', { text: 'log in' }).click({ force: true })
    await expect(page.locator('form[name="login form"]')).toBeVisible()
  })



})