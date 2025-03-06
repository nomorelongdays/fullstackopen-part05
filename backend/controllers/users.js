const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { user : 0, likes :0 })
  response.json(users)
})



usersRouter.post('/', async (request, response) => {
  const { password, ...userAttribs } = request.body

  if (typeof password === 'undefined')return response.status(400).json({ error: '`password` is a required field' })
  if (password.length < 3) return response.status(400).json({ error: '`password` must be 3 or more characters long' })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    ...userAttribs,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter