import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from './reducers/notificationReducer';
import { initializeBlogs, createBlog } from './reducers/blogReducer';
import './index.css';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      dispatch(initializeBlogs());
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      dispatch(initializeBlogs());
      setUsername('');
      setPassword('');

      dispatch(setNotification('logged in successfully', 5));
    } catch (exception) {
      setUsername('');
      setPassword('');
      dispatch(setNotification('wrong username or password', 5));
    }
  };

  const handleLogout = async () => {
    try {
      window.localStorage.removeItem('loggedBlogappUser');
      setUser(null);
      dispatch(setNotification('logged out successfully', 5));
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(setNotification('error in logging out', 5));
    }
  };
  const handleCreate = async (BlogObject) => {
    try {
      await dispatch(createBlog(BlogObject));
      dispatch(setNotification(`a new blog ${BlogObject.title} added`, 5));
    } catch {
      dispatch(setNotification('error in creating blog', 5));
    }
  };

  // const updateBlogList = (id, updatedBlog) => {
  //   if (updatedBlog) {
  //     setBlogs(
  //       blogs.map((blog) =>
  //         blog.id === id ? { ...updatedBlog, user: blog.user } : blog
  //       )
  //     );
  //   } else {
  //     setBlogs(blogs.filter((blog) => blog.id !== id));
  //   }
  // };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              aria-label="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              aria-label="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog">
        <BlogForm createBlog={handleCreate} />
      </Togglable>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            //updateBlogList={updateBlogList}
            currentUser={user}
          />
        ))}
    </div>
  );
};

export default App;
