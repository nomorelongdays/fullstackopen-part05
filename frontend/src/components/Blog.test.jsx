import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

// 5.13: Blog List Tests, step 1
// Make a test, which checks that the component displaying a blog renders the blog's title and author, but does not render its URL or number of likes by default.
// Add CSS classes to the component to help the testing as necessary.


test('The component displaying a blog renders the blog\'s title and author, but does not render its URL or number of likes by default.', () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author\'s name',
    url: 'http://nowhere.com',
    like: 5,
  }

  const { container } = render(<Blog blog={blog} />)

  

  const div = container.querySelector('.summary')

  screen.debug(div)

  expect(div).toHaveTextContent(
    'Test Title', { exact: false }
  )
  expect(div).toHaveTextContent(
    'Test Author\'s name', { exact: false }
  )
  expect(div).not.toHaveTextContent(
    'http://nowhere.com', { exact: false }
  )
  expect(div).not.toHaveTextContent(
    '5 likes', { exact: false }
  )

})

//5.14: Blog List Tests, step 2
//Make a test, which checks that the blog's URL and number of likes are shown when the button controlling the shown details has been clicked.
 
test('the blog\'s URL and number of likes are shown when the button controlling the shown details has been clicked.', async () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author\'s name',
    url: 'http://nowhere.com',
    likes: 5,
  }

  const { container } = render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const div = container.querySelector('.detail')

  expect(div).toHaveTextContent(
    'Test Title', { exact: false }
  )

  expect(div).toHaveTextContent(
    'Test Author\'s name', { exact: false }
  )

  expect(div).toHaveTextContent(
    'http://nowhere.com', { exact: false }
  )
 
  const form = container.querySelector('.likes')
  expect(form).toHaveTextContent(
    '5 likes', { exact: false }
  )

})

//5.15: Blog List Tests, step 3
//Make a test, which ensures that if the like button is clicked twice, the event handler the component received as props is called twice.

test('if the like button is clicked twice, the event handler the component received as props is called twice.', async () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author\'s name',
    url: 'http://nowhere.com',
    likes: 5,
  }

  const mockHandler = vi.fn()

  const { container } = render(<Blog blog={blog} upLike={mockHandler} />)

  const user = userEvent.setup()

  const buttonView = screen.getByText('view')
  await user.click(buttonView)

  const div = container.querySelector('.detail')
  //const form = container.querySelector('.likes')

  const buttonLike = screen.getByText('like')
  await user.click(buttonLike)
  await user.click(buttonLike)

  expect(mockHandler.mock.calls).toHaveLength(2)
})