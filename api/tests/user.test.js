const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const { server } = require('../index')
const User = require('../models/User')
const { api, getUsers } = require('./helpers')

describe('CREATE USERS', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pwd', 10)
    const user = new User({ username: 'luistest', name: 'Test', password: passwordHash })

    await user.save()
  })

  test('works as expected creating a fresh username', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'luislujantest',
      name: 'Luis Test',
      password: 'test'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails if username is already exists', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'luistest',
      name: 'Luis Test',
      password: 'test'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(409)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Duplicated unique value')

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
