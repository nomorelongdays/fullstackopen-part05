import { useState, useEffect } from 'react'
import loginService from './services/login'
import Blog from './components/Blog'
import blogService from './services/blogs'
import ErrorNotification from './components/ErrorNotification'
import AdviceNotification from './components/AdviceNotification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [adviceMessage, setAdviceMessage] = useState(null)

  const [loginVisible, setLoginVisible] = useState(false)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)   

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // const getExpiry = (token) => {
  //   const payload = token.split('.')[1];
  //   const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/')); // Base64Url to Base64
  //   const claims = JSON.parse(decodedPayload);
  //   return claims.exp; // Unix timestamp in seconds
  // }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })
      // console.log('user :', user);
      // console.log('getExpiry(user.token) :', getExpiry(user.token));
      // const expiryDate = new Date(getExpiry(user.token) * 1000);
      // console.log("Expiry time:", expiryDate);
      // console.log('setting')
      window.localStorage.setItem(
        'loggedAppUser', JSON.stringify(user)
      ) 
      console.log(window.localStorage.getItem('loggedAppUser',))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  
  // const loginForm = () => {
  //   const hideWhenVisible = { display: loginVisible ? 'none' : '' }
  //   const showWhenVisible = { display: loginVisible ? '' : 'none' }

  //   return (
  //     <div>
  //       <div style={hideWhenVisible}>
  //         <button onClick={() => setLoginVisible(true)}>log in</button>
  //       </div>
  //       <div style={showWhenVisible}>
  //         <LoginForm
  //           username={username}
  //           password={password}
  //           handleUsernameChange={({ target }) => setUsername(target.value)}
  //           handlePasswordChange={({ target }) => setPassword(target.value)}
  //           handleSubmit={handleLogin}
  //         />
  //         <button onClick={() => setLoginVisible(false)}>cancel</button>
  //       </div>
  //     </div>
  //   )
  // }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <Togglable buttonLabel="log in">
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    )
  }

  




  const logoutUser = async () => {
    window.localStorage.removeItem('loggedAppUser')
    setUser(null) 
  }

  const handleTitleChange = (event) => {
    console.log(event.target.value)
    setNewTitle(event.target.value)
  }
  const handleAuthorChange = (event) => {
    console.log(event.target.value)
    setNewAuthor(event.target.value)
  }
  const handleUrlChange = (event) => {
    console.log(event.target.value)
    setNewUrl(event.target.value)
  }


  const addBlog = async (blogObject) => {
  //setNotes(notes.concat(noteObject))
    //setNewNote('')
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setAdviceMessage(`${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
        setAdviceMessage(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setErrorMessage(exception.message)
      //console.log('exception.response.data :', exception.response.data);
      setErrorMessage((exception.response.data?.error) ? exception.response.data.error : exception.message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }



  const notification = () => (
    <div>
      <ErrorNotification message={errorMessage}/>
      <AdviceNotification message={adviceMessage}/>
    </div>
  )


  if (user === null) {
    return (
      <div>
        {notification()}
        {loginForm()}
        <h3>blogs</h3>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }

  return (
    <div>
        {notification()}
      {user.name} logged in. <button onClick={logoutUser}>logout</button>
      <h3>blogs</h3>
        <Togglable buttonLabel="new blog">
          <BlogForm createBlog={addBlog} />
        </Togglable>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} upLike={blogService.upLike} />
        )}
    </div>
  )
}

export default App