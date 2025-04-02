const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

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
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'WRONG')
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      // await page.getByRole('button', { text: 'new blog' }).click({ force: true })
      // await expect(page.locator('form[name="addBlog"')).toBeVisible()
    
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('title 1')
      await page.getByTestId('author').fill('author 1')
      await page.getByTestId('url').fill('https://url1.com')
      await page.getByRole('button', { name: 'save' }).click()
      //await expect(page.getByText('title 1', {exact: false})).toBeVisible()
      await expect(page.getByRole('link', { name: /title 1/i })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('title 2')
      await page.getByTestId('author').fill('author 2')
      await page.getByTestId('url').fill('https://url2.com')
      await page.getByRole('button', { name: 'save' }).click()
      await page.getByRole('button', { name: 'view' }).last().click()
      await expect(page.locator('form[class="likes"]')).toBeVisible()
      await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText(/2 likes/i)).toBeVisible()
    })

  })
})
