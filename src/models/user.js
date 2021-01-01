const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Tasks = require('../models/task')

//*** Define Schema */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: true,
    validate(email) {
      if (!validator.isEmail(email)) {
        throw new Error('Enter a valid email address')
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(age) {
      if (age < 0) {
        throw new Error('Age must be a positive number');
      }
    }
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: 7,
    validate(password) {
      if (password.toLowerCase().includes('password')) {
        throw new Error('Please select some different password!')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
})

// Realtion between models
userSchema.virtual('tasks', {
  ref: 'Tasks',
  localField: '_id',
  foreignField: 'owner'
})


//Instance method
// ** works with instances
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
  return token;
}

//Model method
// ** works with models

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to loggin !')
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to loggin !')
  }

  return user
}

//*** Middlewares */

//pre is used to do thing before table updated
userSchema.pre('save', async function (next) {

  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  // need to specify, to inform that we are done with our work
  next()

})

// Remove user tasks after user is removed
userSchema.pre('remove', async function (next) {
  const user = this

  await Tasks.deleteMany({ owner: user._id })

  next()
})

// **** define model */

const User = mongoose.model('User', userSchema)


module.exports = User