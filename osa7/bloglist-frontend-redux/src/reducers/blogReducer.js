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
  },
});

export const { setBlogs, addBlog } = blogSlice.actions;

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

export default blogSlice.reducer;
