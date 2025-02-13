const jwt = require('jsonwebtoken')
const express = require('express')
const { request, response } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = express.Router()

// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.startsWith('Bearer ')) {
//       return authorization.replace('Bearer ', '')
//     }
//     return null
//   }

blogsRouter.get('/', (request, response, next) => {
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

      const user = request.user

      if (!user) {
        return response.status(401).json({ error: 'User authentication failed'})
      }
  
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

blogsRouter.delete('/:id', async(request, response, next) => {
    try {


      const user = request.user

      if (!user) {
        return response.status(401).json({ error: 'User authentication failed'})
      }
  
      console.log('Received Token:', request.token)
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }

        const blog = await Blog.findById(request.params.id)
        if (!blog) {
            return response.status(404).json({ error: 'blog not found' })
        }

        if (blog.user.toString() !== user.id.toString()) {
            return response.status(401).json({ error: 'only the creator can delete this blog' })
        }

        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  })


module.exports = blogsRouter