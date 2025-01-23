const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()

const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  if (req.method==='POST' || req.method==='PUT') {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use((req, res, next) => {
  if (req.method === 'POST' || req.method ==='PUT') {
    morgan(':method :url :status :res[content-length] - :response-time ms :body')(req, res, next)
  } else {
    morgan(':method :url :status :res[content-length] - :response-time ms')(req, res, next)
  }
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response,next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response,next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end({ error: 'person not found' })
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request,response, next) => {
  const id = request.params.id
  const { number } = request.body
  if (!number) {
    return response.status(400).json({ error: 'number missing' })
  }

  Person.findByIdAndUpdate(
    id,
    { number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatePerson => {
      if (updatePerson) {
        response.json(updatePerson)
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response,next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      if (result){
        response.status(204).end()
      } else {
        response.status(404).json({ error: 'person not found' })
      }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(personsCount => {
      response.send(`
        <p>Phonebook has info for ${personsCount} people.</p>
        <p>${new Date()}</p>
    `)
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
