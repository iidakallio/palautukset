const jwt = require('jsonwebtoken')
const express = require('express')
// const { request, response } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')
const blogsRouter = express.Router()

// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.startsWith('Bearer ')) {
//       return authorization.replace('Bearer ', '')
//     }
//     return null
//   }

// Public route - GET all blogs
blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
        response.json(blogs)
    } catch (error) {
        console.error('Error fetching blogs:', error)
        next(error)
    }
})

// Public route - GET single blog
blogsRouter.get('/:id', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
        if (blog) {
            response.json(blog)
        } else {
            response.status(404).end()
        }
    } catch (error) {
        console.error(`Error fetching blog with id ${request.params.id}:`, error)
        next(error)
    }
})

// Protected route - POST new blog
blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
    try {
        const { title, author, url, likes } = request.body
        const user = request.user

        if (!title || !url) {
            return response.status(400).json({ error: 'title and url are required' })
        }

        const blog = new Blog({
            title,
            author,
            url,
            likes: likes || 0,
            user: user._id
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })

        response.status(201).json(populatedBlog)
    } catch (error) {
        console.error('Error creating blog:', error)
        next(error)
    }
})

// Protected route - DELETE blog
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    try {
        const user = request.user
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
        console.error('Error deleting blog:', error)
        next(error)
    }
})

// Public route? - PUT update blog (Reverted: No auth middleware here unless you had it before)
blogsRouter.put('/:id', async (request, response, next) => {
    const { id } = request.params
    const { title, author, url, likes } = request.body

    const updateData = {
        title,
        author,
        url,
        likes
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true, context: 'query' })
                                     .populate('user', { username: 1, name: 1 })

        if (updatedBlog) {
             response.json(updatedBlog)
        } else {
             response.status(404).json({ error: 'Blog not found for update' })
        }
    } catch (error) {
        console.error(`Error updating blog with id ${id}:`, error)
        next(error)
    }
})

module.exports = blogsRouter