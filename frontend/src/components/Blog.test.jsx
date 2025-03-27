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