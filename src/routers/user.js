const express = require('express')
const User = require('../models/user')

const sharp = require('sharp')

const auth = require('../middleware/auth')

const router = express.Router()

const Users = require('../models/user')

const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')

// For file upload
const multer = require('multer')


//**** Creating Users */
router.post('/users', async (req, res) => {
  const user = new Users(req.body)

  //*** with async - await */
  try {
    const token = await user.generateAuthToken();
    user.tokens = user.tokens.concat({ token })
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    res.status(201).send({ result: user, token })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }



  // user.save().then((result) => {
  //   res.status(201).send(result)
  // }).catch((e) => {
  //   res.status(400).send(e)
  // })
})

//*** Login user */
router.post('/users/login', async (req, res) => {

  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    user.tokens = user.tokens.concat({ token })
    await user.save()
    res.send({ user: user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

//*** Logout user from current session */ 
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {

      return token.token !== req.token;
    })

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
})

//*** Logout from all session */
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();

  } catch (e) {
    res.send(500).send();
  }
})

//**** Reading Users */ 

// Not required as it does not serve the purpose
router.get('/users', auth, async (req, res) => {

  //*** with async - await */
  try {
    const users = await Users.find({})
    res.send(users)
  } catch (e) {
    res.status(500).send()
  }



  // Users.find({}).then((users) => {
  //   res.send(users)
  // }).catch(() => {
  //   res.status(500).send()
  // })
})


router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

//**** Reading User by id */
router.get('/users/:id', auth, async (req, res) => {
  const _id = req.params.id

  //*** with async - await */
  try {
    const user = await Users.findById(_id)

    if (!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch (e) {
    return res.status(400).send(e)
  }

  // Users.findById(_id).then((user) => {
  //   if (!user) {
  //     return res.status(404).send()
  //   }

  //   res.send(user)
  // }).catch(() => {
  //   return res.status(500).send()
  // })
})



//*** Update user by id */
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'age', 'email', 'password']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update opertion!' })
  }

  try {
    // it bypass mongoose
    // const user = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })    // new: true returns new updated user

    // const user = await User.findById(req.user._id)
    // console.log('Output - ~ file: user.js ~ line 145 ~ user', user);

    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    //*** user already exist */
    // if (!user) {
    //   return res.status(404).send()
    // }
    res.send(req.user)
  } catch (e) {

    return res.status(400).send(e)
  }
})


//*** Delete user by id */

router.delete('/users/me', auth, async (req, res) => {

  try {

    //*** Same as below */
    // const user = await Users.findByIdAndDelete(req.user._id)

    // if (!user) {
    //   return res.status(400).send()
    // }

    await req.user.remove()
    sendCancellationEmail(req.user.email, req.user.name)
    res.status(200).send()
  } catch (e) {

    console.log(e)
    res.status(500).send()
  }

})


// dest for directory name
const upload = multer({
  // dest: 'avatars',  //so that we can get access to file in route handler
  limits: {
    fileSize: 1000000,  // in bytes (1MB),
  },
  fileFilter(req, file, cb) {

    if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
      return cb(new Error('Please uplaod png, jpeg, jpg'))
    }
    cb(undefined, true)
  }
})

//*** Upload Avatar */
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  // req.user.avatar = req.file.buffer
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

//*** Delete Avatar */
router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.status(200).send()
})

//*** Fetch Avatar */
router.get('/users/:id/avatar', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user || !user.avatar) {
      throw new Error()
    }

    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (e) {
    res.status(404).send()
  }
})

module.exports = router