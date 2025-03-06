const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)
const _ = require('lodash')

const Blog = require('../models/blog')
const User = require('../models/user')

const bcrypt = require('bcrypt')


//run just this test file with:
//npm test -- tests/list_api.test.js
describe('blog api tests', () => {
  const user01Id = '67c256b876f4a79b5e8dde5d'

  let token = ''
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('password01', 10)
    const user = new User({
      _id: user01Id,
      username: 'user01',
      name: 'User 01',
      passwordHash: passwordHash,
      __v: 0
    })
    await user.save()

    const creds =       {
      'username': 'user01',
      'name': 'User 01',
      'password': 'password01'
    }

    const response = await api
      .post('/api/login')
      .send(creds)
      .expect(200)
    token = response.body.token

    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })


  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are five blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 5)
  })

  test('the blogs have an "id"', async () => {
    const response = await api.get('/api/blogs')

    const idsExist = response.body.map(e => Object.prototype.hasOwnProperty.call(e,'id'))
    //https://eslint.org/docs/latest/rules/no-prototype-builtins

    assert(idsExist.every(value => value === true))
  })

  test('the blogs have no "_id"', async () => {
    const response = await api.get('/api/blogs')

    const idsExist = response.body.map(e => Object.prototype.hasOwnProperty.call(e,'_id'))
    assert(idsExist.every(value => value === false))
  })

  test('a valid blog can\'t be added without a valid token', async () => {
    const newBlog =   {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0
    }

    const errorMsg = await api
      .post('/api/blogs')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(errorMsg.body.error,'token invalid')

  })

  test('a valid blog can be added ', async () => {
    const newBlog =   {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    //1
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    //2
    const id = blogsAtEnd.map(n => n.id)
    assert(id.includes('5a422bc61b54a676234d17fc'))
    //3
    const returnedBlog =  (_.find(blogsAtEnd, { 'id':'5a422bc61b54a676234d17fc' }))
    assert.deepStrictEqual(helper.responseCompatibleView(newBlog,user01Id),helper.userToIdView(returnedBlog))

  })

  test('missing likes defaults to zero (this also tests a valid log can be added)', async () => {
    const newBlog =   {
      title: 'From the Desk of Donald J. Trump',
      author: 'Donald J. Trump',
      url: 'https://www.donaldjtrump.com/desk',
      //likes: 1,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const resultBlog = await api
      .get(`/api/blogs/byUrl/${encodeURIComponent(newBlog.url)}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(resultBlog.body.likes,0)

  })

  test('missing title returns 400', async () => {
    const newBlog =   {
      //title: 'From the Desk of Donald J. Trump',
      author: 'Donald J. Trump',
      url: 'https://www.donaldjtrump.com/desk',
      likes: 1,
      userId: user01Id,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(newBlog)
      .expect(400)
  })

  test('missing url returns 400', async () => {
    const newBlog =   {
      title: 'From the Desk of Donald J. Trump',
      author: 'Donald J. Trump',
      //url: 'https://www.donaldjtrump.com/desk',
      likes: 1,
      userId: user01Id,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(newBlog)
      .expect(400)
  })

  test('invalid url returns 400', async () => {
    const newBlog =   {
      title: 'From the Desk of Donald J. Trump',
      author: 'Donald J. Trump',
      url: 'https:://www.donaldjtrump.com/desk',
      likes: 1,
      userId: user01Id,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(newBlog)
      .expect(400)
  })

  test('test deletion cycle', async () => {
    const newBlog =   {
      title: 'From the Desk of Donald J. Trump',
      author: 'Donald J. Trump',
      url: 'https://www.donaldjtrump.com/desk',
      likes: 1,
      userId: user01Id,
    }

    //create new blog record
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(newBlog)
      .expect(201) //created
      .expect('Content-Type', /application\/json/)

    //get the blog using the known url
    const resultBlog = await api
      .get(`/api/blogs/byUrl/${encodeURIComponent(newBlog.url)}`)
      .expect(200) //ok
      .expect('Content-Type', /application\/json/)

    //console.log(resultBlog)

    //delete the blog with the received id
    await api
      .delete(`/api/blogs/${resultBlog.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(204)

    //check the blog cannot be found any more
    await api
      .get(`/api/blogs/byUrl/${encodeURIComponent(newBlog.url)}`)
      .expect(404)

    //further delete will not fail
    await api
      .delete(`/api/blogs/${resultBlog.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(204)
  })

  test('update the likes', async () => {
    const newBlog =   {
      title: 'From the Desk of Donald J. Trump',
      author: 'Donald J. Trump',
      url: 'https://www.donaldjtrump.com/desk',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(newBlog)
      .expect(201) //created
      .expect('Content-Type', /application\/json/)

    const result = await api
      .get(`/api/blogs/byUrl/${encodeURIComponent(newBlog.url)}`)
      .expect(200) //ok
      .expect('Content-Type', /application\/json/)

    const resultBlog = result.body
    //console.log('resultBlog :', resultBlog)
    resultBlog.likes++

    const finalBlog = await api
      .put(`/api/blogs/${resultBlog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(resultBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(helper.userToIdView(resultBlog),finalBlog.body)
  })



  after(async () => {
    await mongoose.connection.close()
  })
})