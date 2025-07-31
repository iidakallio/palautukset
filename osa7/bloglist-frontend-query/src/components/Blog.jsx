import { useState } from 'react';
import '../index.css';
import blogService from '../services/blogs';
import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../NotificationContext';

const Blog = ({ blog, currentUser }) => {
  const [, dispatch] = useNotification();
  const queryClient = useQueryClient();

  const [visible, setVisible] = useState(false);

  const updateBlogMutation = useMutation({
    mutationFn: (updatedBlog) => blogService.update(updatedBlog.id, updatedBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  const handleLike = async () => {
    console.log('like')
    const updatedBlog = {
      ...blog,
      likes: (blog.likes || 0) + 1,
      user: blog.user?.id || blog.user,
    };
    updateBlogMutation.mutate(updatedBlog);
  };

  const deleteBlogMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    }
  });

  const handleDelete = async () => {
    const ok = window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`);
    if (!ok) return;
    try {
      console.log('delete')
      await deleteBlogMutation.mutate(blog.id);

    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  }
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
