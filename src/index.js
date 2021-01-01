const express = require('express')

//**** To ensure that db connects bu just calling that file */
require('./db/mongoose')

const userRouter = require('../src/routers/user')
const taskRouter = require('../src/routers/task')
const app = express()

const port = process.env.PORT


/*
middleware
*/

app.use((req, res, next) => {
  console.log(req.method, req.path)
  next()
})

/*
express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object
 */
app.use(express.json())

app.use(userRouter)

app.use(taskRouter)

app.listen(port, () => {
  console.log('port is running on ' + port)
})