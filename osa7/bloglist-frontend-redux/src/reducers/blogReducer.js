import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      state.push(action.payload);
    },
    likeBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      );
    },
    removeBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
  },
});

export const { setBlogs, addBlog, likeBlog, removeBlog } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    console.log('Initializing blogs');
    const blogs = await blogService.getAll();
    console.log('Dispatching setBlogs with:', blogs);
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    console.log('Creating blog:', blog);
    const newBlog = await blogService.create(blog);
    dispatch(addBlog(newBlog));
    console.log('Blog created:', newBlog);
  };
};

export const updateLikeBlog = (blog) => {
  return async (dispatch) => {
    console.log('Liking blog with id:', blog.id);
    const updatedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    });
    dispatch(likeBlog(updatedBlog));
    console.log('Blog liked:', updatedBlog);
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    console.log('Deleting blog with id:', id);
    await blogService.remove(id);
    dispatch(removeBlog(id));
    console.log('Blog deleted with id:', id);
  };
};

export default blogSlice.reducer;
