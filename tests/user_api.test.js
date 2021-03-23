const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      passwordHash
    })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api   
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
        
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(userAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('a user with the same username can not be create', async () => {
    const userAtStart = await helper.usersInDb()

    const repeatedUser = {
      username: 'root',
      name: 'Superuser',
      password:'supersecrete'
    }

    const result = await api
      .post('/api/users')
      .send(repeatedUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const userAtEnd = await helper.usersInDb()
        
    expect(result.body.error).toContain('`username` to be unique')
    expect(userAtEnd).toHaveLength(userAtStart.length)
  })
})
afterAll(() => {
  mongoose.connection.close()
})
