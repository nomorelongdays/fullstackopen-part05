const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form *button* is shown', async ({ page }) => {
    await expect(page.getByRole('button', { text: 'log in' })).toBeVisible()
  })

  test('Login form is shown when button clicked', async ({ page }) => {
    await page.getByRole('button', { text: 'log in' }).click({ force: true })
    await expect(page.locator('form[name="login form"]')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('button', { text: 'log in' }).click({ force: true })
      await expect(page.locator('form[name="login form"]')).toBeVisible()
      await page.locator('input[name="username"]').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()    
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button', { text: 'log in' }).click({ force: true })
      await expect(page.locator('form[name="login form"]')).toBeVisible()
      await page.locator('input[name="username"]').fill('mluukkai')
      await page.getByTestId('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

})