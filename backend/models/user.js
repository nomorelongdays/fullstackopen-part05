const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    required: [true, '`username` is a required field'],
    minlength: [3, '`username` must be 3 or more characters long']
  },
  name: {
    type: String,
    required: [true, '`name` is a required field']
  },
  passwordHash: {
    type: String,
    required: true
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
    //returnedObject.id = returnedObject._id.toString()
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User