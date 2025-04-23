import { useState, useEffect } from 'react'
import './index.css'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null) 
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState('')

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs =>
        //setBlogs( blogs )
        setBlogs(blogs.filter(blog => blog.user.username === user.username))
      )
    }
      
  }, [user, blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setErrorMessage('Login successful')
      setErrorType('success')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      setUsername('')
      setPassword('')
      setErrorMessage('wrong username or password')
      setErrorType('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
   
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
      setErrorMessage('logged out successfully')
      setErrorType('success')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch{
      setErrorMessage('error in logout')
      setErrorType('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const handleCreate = async (BlogObject) => {
    

    try {
      const createdBlog = await blogService.create(BlogObject)
      const updatedBlog = { ...createdBlog, user: { username: user.username, name: user.name } }
      setBlogs(blogs.concat(updatedBlog))
      setErrorMessage('a new blog was added')
      setErrorType('success')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      
    } catch {
      setErrorMessage('error in creating blog')
      setErrorType('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateBlogList = (id, updatedBlog) => {
    setBlogs(blogs.map(blog => blog.id === id ? { ...updatedBlog, user: blog.user } : blog))
  }

  if (user === null) {
    return (
      <div>
      
        <h2>Log in to application</h2>
        <Notification message={errorMessage} type={errorType}/>
        <form onSubmit={handleLogin}>
          <div>
            username
              <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={errorMessage} type={errorType} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel='create new blog'>
        <BlogForm createBlog={handleCreate} />
      </Togglable>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
        <Blog key={blog.id} blog={blog} updateBlogList={updateBlogList} />
      )}

    </div>
    
  )
}

export default App