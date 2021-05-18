const { Schema, model } = require('mongoose')

// Definimos el schema
const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: String,
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note' // Referencia al modelo de Notas
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

// Creamos un modelo para el Schema creado
const User = model('User', userSchema)

module.exports = User
