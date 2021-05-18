const bcrypt = require('bcrypt')

const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (require, response, next) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    date: 1
  })
  response.json(users)
})

usersRouter.post('/', async (require, response, next) => {
  const { username, name, password } = require.body

  try {
    const passwordHash = await bcrypt.hash(password, 10)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (err) {
    next(err)
  }
})

module.exports = usersRouter
