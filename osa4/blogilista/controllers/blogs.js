const express = require('express')
const { request, response } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = express.Router()

blogsRouter.get('/', (request, response,next) => {
  Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => next(error))
    
})

blogsRouter.post('/', async (request, response, next) => {
    try{if (!request.body.title || !request.body.url) {
        return response.status(400).json({ error: 'title and url are required' });
      }

      const user = await User.findOne()
  
      const blog = new Blog({
        ...request.body,
        likes: request.body.likes || 0,
        user: user._id, 
      })

      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save() 
      response.status(201).json(savedBlog)
    } catch (error) {
      next(error)  
    }
    
})

blogsRouter.delete('/', async(request, response, next) => {
    try{console.log(request.params)
        const id = request.params
        console.log(id)
    const deletedBlog = await Blog.findByIdAndDelete(id)
    if (!deletedBlog) {
        return response.status(404).json({ error: 'blog not found'})
    } else {
        response.status(204).end()
    }} catch (error) {
        next(error)
      }
    
})

module.exports = blogsRouter