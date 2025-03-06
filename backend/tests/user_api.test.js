const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')


const api = supertest(app)
const _ = require('lodash')

const User = require('../models/user')

const bcrypt = require('bcrypt')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const responseCompatibleView = (obj) => {
  // eslint-disable-next-line no-unused-vars
  const { _id,__v, password, blogs, ...rest } = obj

  return {
    ...rest,
    blogs : (typeof blogs === 'undefined') ? [] : blogs,
    id: _id,

  }
}



//run just this test file with:
//npm test -- tests/user_api.test.js
describe('user api tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'root', passwordHash })

    await user.save()
  })

  test('a valid user can be added ', async () => {
    const newUser =   {
      _id: '67c256b876f4a79b5e8dde5d',
      username: 'user01',
      name: 'User 01',
      password: 'password01',
      __v: 0
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // //1
    const usersAtEnd = await usersInDb()
    // assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)
    // //2
    // const id = usersAtEnd.map(n => n.id)
    // assert(id.includes('67c24d9ab539e4007c1c1f99'))
    //3
    const returnedUser =  (_.find(usersAtEnd, { 'id':'67c256b876f4a79b5e8dde5d' }))
    assert.deepStrictEqual(responseCompatibleView(newUser),returnedUser)

  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })


  test('a duplicate user is rejected', async () => {
    const usersAtStart = await usersInDb()

    const newUser =   {
      username: 'user01',
      name: 'User 01',
      password: 'password01',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    //console.log('response.body.error :', response.body.error)
    assert.strictEqual(response.body.error,'expected `username` to be unique')

    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)


  })

  test('missing username is rejected', async () => {
    const newUser =   {
      name: 'User 01',
      password: 'password01',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    //console.log('response.body.error :', response.body.error)
    assert.strictEqual(response.body.error,'User validation failed: username: `username` is a required field')
  })

  test('username under 3 chars is rejected', async () => {
    const newUser =   {
      username: 'us',
      name: 'User 01',
      password: 'password01',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    //console.log('response.body.error :', response.body.error)
    assert.strictEqual(response.body.error,'User validation failed: username: `username` must be 3 or more characters long')
  })

  test('missing name is rejected', async () => {
    const newUser =   {
      username: 'user01',
      password: 'password01',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    //console.log('response.body.error :', response.body.error)
    assert.strictEqual(response.body.error,'User validation failed: name: `name` is a required field')
  })

  test('missing password is rejected', async () => {
    const newUser =   {
      username: 'user01',
      name: 'User 01',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    //console.log('response.body.error :', response.body.error)
    assert.strictEqual(response.body.error,'`password` is a required field')
  })

  test('password under 3 chars is rejected', async () => {
    const newUser =   {
      username: 'user01',
      name: 'User 01',
      password: 'pa',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    //console.log('response.body.error :', response.body.error)
    assert.strictEqual(response.body.error,'`password` must be 3 or more characters long')
  })

  after(async () => {
    await mongoose.connection.close()
  })
})