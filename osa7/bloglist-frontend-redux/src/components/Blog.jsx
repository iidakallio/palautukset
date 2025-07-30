import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateLikeBlog, deleteBlog } from '../reducers/blogReducer';
import '../index.css';
import blogService from '../services/blogs';
import PropTypes from 'prop-types';

const Blog = ({ blog, currentUser }) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const handleLike = async () => {
    dispatch(updateLikeBlog(blog));
  };
  const handleDelete = async () => {
    const ok = window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`);
    if (!ok) return;

    try {
      await dispatch(deleteBlog(blog.id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div className="blog">
      {visible ? (
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setVisible(false)}>hide</button>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {currentUser?.username === blog.user?.username && (
            <button onClick={handleDelete}>remove</button>
          )}
        </div>
      ) : (
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setVisible(true)}>view</button>
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default Blog;
