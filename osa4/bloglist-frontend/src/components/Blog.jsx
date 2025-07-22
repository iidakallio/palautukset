import { useState } from 'react';
import '../index.css';
import blogService from '../services/blogs';
import PropTypes from 'prop-types';

const Blog = ({ blog, updateBlogList, currentUser }) => {
  const [visible, setVisible] = useState(false);

  const handleLike = async () => {
    const currentLikes = Number(blog.likes) || 0;
    const updatedBlogData = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: currentLikes + 1,
    };
    console.log('Sending update for blog id:', blog.id);
    console.log('Update data:', updatedBlogData);

    if (!blog.id) {
      console.error('Cannot update blog without an ID');
      return;
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlogData);
      updateBlogList(blog.id, returnedBlog);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };
  const handleDelete = async () => {
    const ok = window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`);
    if (!ok) return;

    try {
      await blogService.remove(blog.id);
      updateBlogList(blog.id, null);
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
  updateBlogList: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default Blog;
