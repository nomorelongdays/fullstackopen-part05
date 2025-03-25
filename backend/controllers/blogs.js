const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
//const User = require('../models/user')
const jwt = require('jsonwebtoken')

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { blogs :0 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user')
  //const blogs = await Blog.find({}).populate('user', { blogs :0 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

//added for 4.11
blogsRouter.get('/byUrl/:url', async (request, response) => {
  const blog = await Blog.findOne({ 'url': request.params.url }).populate('user', { blogs :0 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

//Promises:
// blogsRouter.post('/', (request, response) => {
//     const blog = new Blog(request.body)

//     blog
//       .save()
//       .then(result => {
//         response.status(201).json(result)
//       })
//       .catch(error => next(error))
// })

//Async/await:
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const user = request.user

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = new Blog({
    ...body,
    user: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const user = request.user
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    // console.log('blog.user :', blog.user)
    // console.log('user :', user)
    // console.log('blog.user.toString() :', blog.user.toString())
    // console.log('user.toString() :', user.toString())
    if ((typeof blog.user !== 'undefined') && (blog.user.toString() !== user._id.toString())) {
      return response.status(403).json({ error: `user [${user.name}] not authorized to delete this blog` })
    } else {
      await Blog.findByIdAndDelete(request.params.id)
      return response.status(204).end()
    }
  }
  return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const user = request.user

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const existingBlog = await Blog.findById(request.params.id)

  if (existingBlog) {
    // console.log('blog.user :', blog.user)
    // console.log('user :', user)
    // console.log('blog.user.toString() :', blog.user.toString())
    // console.log('user.toString() :', user.toString())
    if (existingBlog.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: `user [${user.name}] not authorized to update this blog` })
    } else {
      const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
      }
      const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      response.json(updatedBlog)
    }
  } else
    return response.status(204).end()
})

blogsRouter.put('/like/:id', async (request, response) => {
  //increment the likes count
  //const user = request.user

  const blog = await Blog.findById(request.params.id)
  if (!blog) response.status(404).end()

  const upLiked = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes+1,
    user: blog.user,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, upLiked, { new: true })
  response.json(updatedBlog)
})



module.exports = blogsRouter