const bcrypt = require('bcrypt') 
const express = require('express')
const User = require('../models/user')

const usersRouter = express.Router()

usersRouter.get('/', (request, response) => {
    User.find({})
      .populate('blogs', { title: 1, url: 1, author: 1 }) 
      .then(users => {
        response.json(users)
      })
      .catch(error => next(error))
  })

usersRouter.post('/', async (request, response, next) => {
   try{ 
    const { username, name, password } = request.body
 
   if (!username || username.length < 3) {
    return response.status(400).json({ error: 'Username must be at least 3 characters long' })
  }
   if (!password || password.length < 3) {
    return response.status(400).json({ error: 'Password must be at least 3 characters long' })
  }
   const existingUser = await User.findOne({ username })
   if (existingUser) {
      return response.status(400).json({ error: 'Username must be unique' })
    }


    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)}
  catch (error) {
    next(error) 
  }
})

module.exports = usersRouter