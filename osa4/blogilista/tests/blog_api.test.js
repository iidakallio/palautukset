const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
    {
      title: "My first blog",
      author: "John Doe",
      url: "https://example.com",
      likes: 5,
    },
    {
      title: "My blog",
      author: "AA",
      url: "https://AAAAAA.com",
      likes: 13,
    },
  ]


beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.length, initialBlogs.length)
  })
  
test('blogs are returned with id instead of _id', async () => {
    const response = await api
    .get('/api/blogs').expect(200)
    .expect('Content-Type', /application\/json/)
   
    response.body.forEach((blog) => {
      assert.ok(blog.id) 
      assert.strictEqual(blog._id, undefined) 
    })
})

test('a valid blog can be added', async() => {
    const newBlog = {
        title: "New Blog",
        author: "New Author",
        url: "https://NewBlogAdded.com",
        likes: "2",
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    const titles = response.body.map((blog) => blog.title)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    assert(titles.includes('New Blog'))
})

test('if likes property is missing, it defaults to 0', async() => {
    const newBlog = {
        title: "New Blog without likes",
        author: "No Likes",
        url: "https://BlogNoLikes.com",
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const addedBlog = response.body
    
    assert.strictEqual(addedBlog.likes, 0)
})

test('if title is missing, status 400 is returned', async() => {
    const newBlog = {
        author: "No Title",
        url: "https://NoTitle.com",
        likes: 3,
      }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogs = await api.get('/api/blogs')
    assert.strictEqual(blogs.body.length, initialBlogs.length)
})

test('if url is missing, status 400 is returned', async() => {
    const newBlog = {
        title: "Blog with No Url",
        author: "No Url",
        likes: 4,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    const blogs = await api.get("/api/blogs")
    assert.strictEqual(blogs.body.length, initialBlogs.length)
})

test('a blog can be deleted', async () => {
    const blogToDelete = initialBlogs[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete._id}`)
      .expect(204)
  
    const blogs = await api.get("/api/blogs")

    assert.strictEqual(blogs.length, initialBlogs.length - 1)
  
    const titles = blogs.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

after(async () => {
    await mongoose.connection.close()
})