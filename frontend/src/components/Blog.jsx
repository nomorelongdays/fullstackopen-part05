import { useState } from 'react'
const Blog = ({ blog }) => {
  const [show, setShow] = useState(false)
  const blogStyle = {
    paddingTop: 3,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const invisible = { display: 'none' }
  return (
    <>
    <div className='blog' style={{...blogStyle, display: show ? 'none' : ''}}>
      <a href={blog.url}>{blog.title} | {blog.author}</a> <button onClick={() => (setShow(true))}>view</button>
    </div>  
    <div className='blog' style={{...blogStyle, display: !show ? 'none' : ''}} >
    {blog.title}<br />{blog.author}<br />{blog.url}<br />{blog.likes} likes <button onClick={() => (setShow(false))}>hide</button>
  </div>  
</>  

)}
export default Blog