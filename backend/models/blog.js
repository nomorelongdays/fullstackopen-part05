const mongoose = require('mongoose')
const isUrlHttp = require('is-url-http')


const blogSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is a required field'] },
  author: String,
  url: {
    type: String,
    required: [true, 'URL is a required field'],
    validate: (value) => {if(!isUrlHttp(value)) throw new Error('Not a valid URL')}
  },
  likes: { type:Number, default:0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    //returnedObject.user = returnedObject.user.toString()
  }
})

module.exports = mongoose.model('Blog', blogSchema)