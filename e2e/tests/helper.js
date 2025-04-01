const loginWith = async (page, username, password)  => {
    await page.getByRole('button', { text: 'log in' }).click({ force: true })
    await page.locator('form[name="login form"]')
    await page.locator('input[name="username"]').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()    
}

// const createNote = async (page, content) => {
//   await page.getByRole('button', { name: 'new note' }).click()
//   await page.getByRole('textbox').fill(content)
//   await page.getByRole('button', { name: 'save' }).click()
// }

export { loginWith }