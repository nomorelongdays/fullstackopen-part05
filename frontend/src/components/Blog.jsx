import { useState } from 'react'
const Blog = ({ blog, upLike, remove, user }) => {
  const [show, setShow] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const blogStyle = {
    paddingTop: 3,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const invisible = { display: 'none' }

  const likeIt = async (event) => {
    event.preventDefault()
    upLike(blog.id)
    setLikes(likes+1)
  }

  const removeIt = async (event) => {
    event.preventDefault()
    if (!window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) return
    remove(blog.id)
  }



  return (
    <>
      <div className='blog' style={{ ...blogStyle, display: show ? 'none' : '' }}>
        <a href={blog.url}>{blog.title} | {blog.author}</a> <button onClick={() => (setShow(true))}>view</button>
      </div>
      <div className='blog' style={{ ...blogStyle, display: !show ? 'none' : '' }} >
        <a href={blog.url}>{blog.title} | {blog.author}</a> <button onClick={() => (setShow(false))}>hide</button>
        <br />{blog.url}
        <form onSubmit={likeIt}>
          {likes} likes <button type="submit">like</button>
        </form>
        {((blog || {}).user || {}).name ?? 'unknown'}
        <form onSubmit={removeIt}>
          <button type="submit" style={ { display: (typeof user !== 'undefined') && blog.user && (blog.user.id === user.id) ? '' : 'none' } }>delete</button>
        </form>
      </div>
    </>

  )}
export default Blog