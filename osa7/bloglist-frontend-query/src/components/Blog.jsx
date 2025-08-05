import { useState, useEffect } from 'react';
import '../index.css';
import blogService from '../services/blogs';
import PropTypes from 'prop-types';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useNotification } from '../NotificationContext';
import { useParams, useNavigate } from 'react-router-dom';

const Blog = ({ currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [, dispatch] = useNotification();

  useEffect(() => {
    if (currentUser?.token) {
      blogService.setToken(currentUser.token);
    }
  }, [currentUser]);

  const updateBlogMutation = useMutation({
    mutationFn: (updatedBlog) => blogService.update(updatedBlog.id, updatedBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      navigate('/');
    }
  });

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getById(id),
  });

  if (isLoading) return <div>Loading blog...</div>;
  if (error || !blog) return <div>Blog not found</div>;


  const handleLike = async () => {
    console.log('like')
    const updatedBlog = {
      ...blog,
      likes: (blog.likes || 0) + 1,
      user: blog.user?.id || blog.user,
    };
    updateBlogMutation.mutate(updatedBlog);
  };

  const handleDelete = () => {
    const ok = window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`);
    if (!ok) return;
    try {
      console.log('delete')
      deleteBlogMutation.mutate(blog.id);

    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  }

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author}
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
      <div>
        {blog.title} {blog.author}
      </div>
    </div>
  );
};
Blog.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

export default Blog;
