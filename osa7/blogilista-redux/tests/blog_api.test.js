const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Blog = require('../models/blog');

const api = supertest(app);

let token;
let user;

const initialBlogs = [
  {
    title: 'My first blog',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5,
  },
  {
    title: 'My blog',
    author: 'AA',
    url: 'https://AAAAAA.com',
    likes: 13,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  // Create test user
  const passwordHash = await bcrypt.hash('secretcode', 10);
  const testUser = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash,
  });
  user = await testUser.save();

  // Create token
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 });

  // Create blogs owned by test user
  const blogObjects = initialBlogs.map((blog) => ({
    ...blog,
    user: user._id,
  }));
  await Blog.insertMany(blogObjects);
});

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test('blogs are returned with id instead of _id', async () => {
  const response = await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  response.body.forEach((blog) => {
    assert.ok(blog.id);
    assert.strictEqual(blog._id, undefined);
  });
});

test('a valid blog can be added with a valid token', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'https://NewBlogAdded.com',
    likes: 2,
  };

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await Blog.find({});
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1);

  const titles = blogsAtEnd.map((blog) => blog.title);
  assert(titles.includes('New Blog'));
});

test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'New Blog without likes',
    author: 'No Likes',
    url: 'https://BlogNoLikes.com',
  };

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test('if title is missing, status 400 is returned', async () => {
  const newBlog = {
    author: 'No Title',
    url: 'https://NoTitle.com',
    likes: 3,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400);

  const blogsAtEnd = await Blog.find({});
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
});

test('if url is missing, status 400 is returned', async () => {
  const newBlog = {
    title: 'Blog with No Url',
    author: 'No Url',
    likes: 4,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400);

  const blogsAtEnd = await Blog.find({});
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
});

test('a blog can be deleted by its creator', async () => {
  const blogsAtStart = await Blog.find({});
  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204);

  const blogsAtEnd = await Blog.find({});
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1);

  const titles = blogsAtEnd.map((blog) => blog.title);
  assert(!titles.includes(blogToDelete.title));
});

test('adding a blog fails with status 401 if token is missing', async () => {
  const newBlog = {
    title: 'Unauthorized Blog',
    author: 'Anonymous',
    url: 'https://unauthorized.com',
    likes: 2,
  };

  const response = await api.post('/api/blogs').send(newBlog).expect(401);

  assert(response.body.error.includes('Token missing'));

  const blogsAtEnd = await Blog.find({});
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
});

after(async () => {
  await mongoose.connection.close();
});
