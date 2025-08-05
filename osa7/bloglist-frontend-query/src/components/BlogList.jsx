import Blog from './Blog';
import { useQuery } from '@tanstack/react-query';
import blogService from '../services/blogs';
import { Link } from 'react-router-dom';

const BlogList = ({ currentUser }) => {
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading blogs</div>;
  }

  return (
    <div>
      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <div key={blog.id} className="blog">
            <Link to={`/blogs/${blog.id}`}>
              <div>{blog.title} {blog.author}</div>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default BlogList;