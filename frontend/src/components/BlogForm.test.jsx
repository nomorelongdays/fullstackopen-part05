import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'


//5.16: Blog List Tests, step 4
//Make a test for the new blog form. The test should check, that the form calls the event handler it received as props with the right details when a new blog is created.

test('<BlogForm /> calls provided event handler with correct detail', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const inputTitle = container.querySelector(`input[name="title"]`)
  const inputAuthor = container.querySelector(`input[name="author"]`)
  const inputUrl = container.querySelector(`input[name="url"]`)



  await user.type(inputTitle, 'Test Title')
  await user.type(inputAuthor, 'Test Author')
  await user.type(inputUrl, 'Test URL')

  const sendButton = screen.getByText('save')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Test Title')
  expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
  expect(createBlog.mock.calls[0][0].url).toBe('Test URL')
})