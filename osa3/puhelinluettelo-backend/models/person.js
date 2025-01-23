const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB: ', result)
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phoneValidator = {
  validator: function (number) {
    const regex = /^\d{2,3}-\d+$/
    return regex.test(number) && number.length >= 8
  },
  message: (props) => `${props.value} is not a valid phone number! Format should be XX-XXXXX or XXX-XXXXX, and it must be at least 8 characters long.`,
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters long'],
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: phoneValidator,
  },
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)