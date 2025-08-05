import React from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../NotificationContext'
import { useUser } from '../UserContext';
import { useQueryClient } from '@tanstack/react-query';



const Menu = ({ username }) => {
  const [, dispatch] = useNotification()
  const queryClient = useQueryClient();


  const { user, dispatch: userDispatch } = useUser();

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

  const padding = {
    paddingRight: 5
  };
  return (
    <div style={{background: '#ddd', padding: 5, marginBottom: 10 }}>
      <Link to="/" style={padding}>blogs</Link>
      <Link to="/users" style={padding}>users</Link>
      <span>{username} logged in</span>
      <button onClick={handleLogout} style={{ marginLeft: '10px' }}>logout</button>
    </div>
  );
};

export default Menu;