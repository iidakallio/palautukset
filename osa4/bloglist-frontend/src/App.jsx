import { useState, useEffect } from 'react'
import './index.css'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null) 
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

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
  const handleCreate = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }

    try {
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      const createBlog = await blogService.create(newBlog)
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
//
//
  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={errorMessage} type={errorType} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel='new note'>
        <h2>Create New</h2>
        <form onSubmit={handleCreate}>
          <div>
            title 
            <input
              type="text"
              value={newTitle}
              onChange={({target}) => setNewTitle(target.value)}
            />
            </div>
            <div>
            author
            <input
              type="text"
              value={newAuthor}
              onChange={({ target }) => setNewAuthor(target.value)}
            />
          </div>
          <div>
            url
            <input
              type="text"
              value={newUrl}
              onChange={({ target }) => setNewUrl(target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
    
  )
}

export default App