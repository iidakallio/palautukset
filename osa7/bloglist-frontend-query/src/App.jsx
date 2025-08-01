import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './index.css';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import { useNotification } from './NotificationContext'
import { useUser } from './UserContext';

const App = () => {
  const [, dispatch] = useNotification()
  const queryClient = useQueryClient();

  const { user, dispatch: userDispatch } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: 'SET_USER', payload: user });
      blogService.setToken(user.token);
    }
  }, [ userDispatch ]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      userDispatch({ type: 'SET_USER', payload: user });
      setUsername('');
      setPassword('');

      dispatch({
        type: 'SET',
        payload: {
          message: 'Login successful',
          type: 'success'}
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR' });
      }, 5000);
    } catch (exception) {
      setUsername('');
      setPassword('');
      dispatch({
        type: 'SET',
        payload: {
          message: 'Wrong username or password',
          type: 'error'
        },
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR' });
      }, 5000);
      console.error('Login failed:', exception);
    }
  };

  const handleLogout = async () => {
    try {
      window.localStorage.removeItem('loggedBlogappUser');
      userDispatch({ type: 'CLEAR_USER' });
      dispatch({
        type: 'SET',
        payload: {message: 'Logged out successfully', type: 'success'}
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR' });
      }, 5000);
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({
        type: 'SET',
        payload: {message: 'Error logging out', type: 'error'}
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR' });
      }, 5000);
    }
  };

  const handleCreate = async (blogObject) => {
    createBlogMutation.mutate(blogObject);
  };

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      dispatch({
        type: 'SET',
        payload: {message: 'Blog created successfully', type: 'success'}
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR' });
      }, 5000);
    },
    onError: (error) => {
      dispatch({
        type: 'SET',
        payload: {message: `Error creating blog: ${error.message}`, type: 'error'}
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR' });
      }, 5000);
    }
  });

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  });

  if (result.isLoading) {
    return <div>Loading...</div>;
  }

  if (result.isError) {
    return <div>Error fetching blogs</div>;
  }
  const blogs = result.data;


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
            currentUser={user}
          />
        ))}
    </div>
  );
};

export default App;
