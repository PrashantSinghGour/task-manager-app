const express = require('express')

const router = express.Router()


const Tasks = require('../models/task')
const auth = require('../middleware/auth')

//**** Creating Tasks */
router.post('/tasks', auth, async (req, res) => {
  // const task = new Tasks(req.body)

  const task = new Tasks({
    ...req.body,
    owner: req.user._id
  })

  //*** with async - await */
  try {
    const response = await task.save()
    res.status(201).send(response)
  } catch (e) {
    res.status(400).send(e)
  }

  // task.save().then((response) => {
  //   res.status(201).send(response)
  // }).catch((e) => {
  //   res.status(400).send(e)
  // })
})

//**** Reading Tasks */
// GET /tasks?completed=true
// GET /tasks?limit=2&skip=2
// GET /tasks?sortBy=completed:asc
router.get('/tasks', auth, async (req, res) => {

  const match = {}

  const sort = {}

  // req.query.completed is going to be string
  if (req.query.completed) {
    match.completed = (req.query.completed === 'true')
  }

  if (req.query.sortBy) {
    const part = req.query.sortBy.split(':')
    sort[part[0]] = part[1] === 'desc' ? -1 : 1;
  }

  try {
    // const tasks = await Tasks.find({ owner: req.user._id })
    await req.user.populate({
      path: 'tasks',
      match: match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.send(req.user.tasks)
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }


  // Tasks.find({}).then((tasks) => {
  //   res.send(tasks)
  // }).catch(() => {
  //   res.status(500).send()
  // })
})

//**** Reading Task by id */
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    //task = await Tasks.findById(_id)
    const task = await Tasks.findOne({ _id, owner: req.user._id })
    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(500).send()
  }


  // Tasks.findById(_id).then((task) => {
  //   if (!task) {

  //     return res.status(404).send()
  //   }

  //   res.send(task)
  // }).catch(() => {
  //   res.status(500).send()
  // })
})


//*** Update task by id */
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    res.status(400).send({ error: 'Invalid update operation!' })
  }

  try {
    // it bypass mongoose findByIdAndUpdate
    //const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    // const task = await Tasks.findById(req.params.id)

    const task = await Tasks.findOne({ _id: req.params.id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    updates.forEach((update) => task[update] = req.body[update]);
    await task.save();

    res.status(200).send(task)
  } catch (e) {
    console.log(e)
    res.status(400).send()
  }

})



//*** Delete task by id */
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    // const task = await Tasks.findByIdAndDelete(req.params.id)
    const task = await Tasks.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

    if (!task) {
      return res.status(400).send()
    }

    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})


module.exports = router