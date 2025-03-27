import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({createBlog}) => {
  const [newTitle, setNewTitle] = useState('') 
  const [newAuthor, setNewAuthor] = useState('') 
  const [newUrl, setNewUrl] = useState('') 
  //const [newLikes, setNewLikes] = useState(0) 

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0
    }
    await createBlog(blogObject)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  
  return (
    <form onSubmit={addBlog}>
      title: <input
        value={newTitle}
        name="title"
        onChange={event => setNewTitle(event.target.value)}
      /><br />
      author: <input
        value={newAuthor}
        name="author"
        onChange={event => setNewAuthor(event.target.value)}
      /><br />
      URL: <input
        value={newUrl}
        name="url"
        onChange={event => setNewUrl(event.target.value)}
      /><br />
      <button type="submit">save</button>
    </form>  
  )
}

BlogForm.PropTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm