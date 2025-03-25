import { useState } from 'react'
const Blog = ({ blog, upLike }) => {
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

  return (
    <>
    <div className='blog' style={{...blogStyle, display: show ? 'none' : ''}}>
      <a href={blog.url}>{blog.title} | {blog.author}</a> <button onClick={() => (setShow(true))}>view</button>
    </div>  
    <div className='blog' style={{...blogStyle, display: !show ? 'none' : ''}} >
      <a href={blog.url}>{blog.title} | {blog.author}</a> <button onClick={() => (setShow(false))}>hide</button>
      <br />{blog.url}<br />{blog.likes} 
      <form onSubmit={likeIt}>
        {likes} likes <button type="submit">like</button>
      </form>
      <br />{blog.user.name}
  </div>  
</>  

)}
export default Blog