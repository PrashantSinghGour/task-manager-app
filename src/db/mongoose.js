const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING, {
  useNewUrlParser: true,
  useCreateIndex: true,      // when working with mongoose to mongodb it will make sure we can quickly access data
  useUnifiedTopology: true,
  useFindAndModify: false
})


// **** define model */

// const User = mongoose.model('User', {
//   name: {
//     type: String,
//     trim: true,
//     required: true
//   },
//   email:{
//     type: String,
//     trim: true,
//     lowercase: true,
//     required: true,
//     validate(email) {
//         if(!validator.isEmail(email)) {
//           throw new Error('Enter a valid email address')
//         }
//     }
//   },
//   age: {
//     type: Number,
//     default: 0,
//     validate(age) {
//       if(age < 0) {
//         throw new Error('Age must be a positive number');
//       }
//     }
//   },
//   password: {
//     type: String,
//     trim: true,
//     required: true,
//     minlength: 7,
//     validate(password) {
//       if(password.toLowerCase().includes('password')) {
//         throw new Error('Please select some different password!')
//       } 
//     }
//   }


// })

//**** adding data */ 

// const me = new User({
//   name: 'Anita  Singh',
//   email: 'aniTaSingh@gmail.com',
//   age: 0,
//   password: 'ddsjfsddff'

// })

// //**** saving  */

// me.save().then((res)=> {
//   console.log(res)
// }).catch((error) => {
//   console.log(error)
// })


//**** Task */

// const Tasks = mongoose.model('Tasks', {
//   description: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   completed: {
//     type: Boolean,
//     default: false
//   }
// })


// const newTask = new Tasks({
//   description: '  book movie tickets         ',
// })


// newTask.save().then((res) => {
//   console.log(res)
// }).catch((error) => {
//   console.log(error)
// })

