if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express();

morgan.token('body', req => (
  Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : '')
)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(express.static('client/dist'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/health', (req, res) => res.sendStatus(200));

app.get('/info', (req, res) => {
  return Person.find({}).then(persons => {
    return res.send(`Phonebook has info for ${persons.length} people<br/><br/>${new Date()}`)
  })
})

app.get('/api/persons', (req, res) => {
  return Person.find({}).then(persons => {
    return res.json(persons)
  })
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  const person = new Person({ name, number })
  return person.save().then(savedPerson => {
    return res.json(savedPerson)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  return Person.findById(id).then(person => {
    if (!person) return res.status(404).end()
    return res.json(person)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  const { name, number } = req.body

  return Person.findByIdAndUpdate(id, { name, number }, {
    new: true, runValidators: true, context: 'query'
  }).then(person => {
    return res.json(person)
  }).catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  return Person.findByIdAndDelete(id).then(() => {
    return res.status(204).end()
  }).catch(error => next(error))
})

app.use(errorHandler);

module.exports = app;