// CRUD Operations

// const mongodb = require('mongodb');

// To initialise the connection
// const MongoClient = mongodb.MongoClient;

// Or we can replace above code as

const { MongoClient, ObjectID } = require('mongodb');



const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

// By default url parser is depricated need to use it so the url will parse correctly
MongoClient.connect(
  connectionUrl,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log('Unable to connect database!');
    }

    console.log('connected correctly!');

    // getting reference to db using currently
    const db = client.db(databaseName);

    // ******reason for using binary id's to reduce the side by half
    // const id = new ObjectID();
    // console.log(id.id.length)
    // console.log(id.toHexString().length)
    // console.log(id.getTimestamp())
    // ******

    ////////********** for Create operation */
    // For single insertion of document
    // db.collection('Users').insertOne({
    //   _id: id, //optional 
    //   name: 'Vikrant',
    //   age: 25
    // }, (error, result) => {
    //   if(error) {
    //     console.log('Unable to insert user!');
    //   }

    //   console.log(result.ops);
    // });

    // For multiple Document insertion
    // db.collection('Users').insertMany([
    //   {
    //   name:'Anita',
    //   age: 46
    // },
    // {
    //   name:'Rankendra',
    //   age: 50
    // }], (error, result) => {
    //   if(error) {
    //     return console.log('Unable to insert Data in Users!')
    //   }

    //   console.log(result.ops,)
    // })

    // Task

    // db.collection('tasks').insertMany([
    //   {
    //     description: 'Bring Bike from service center',
    //     completed: false,
    //   },
    //   {
    //     description: 'Send Money to Mom',
    //     completed: true,
    //   },
    //   {
    //     description: 'take haircut',
    //     completed: false,
    //   },
    // ], (error, result) => {
    //   if (error) {
    //     console.log('Unable to add data in tasks!');
    //   }

    //   console.log(result.ops);
    // });


    ///****** for Read operation */

    //**** findOne
    // fetch by name or age
    // db.collection('Users').findOne({name:'Anita'}, (error, user) => {

    //   if(error) {
    //     return console.log('Unable to fetch');
    //   }
    //   console.log(user);
    // })

    // fetch by id
    // db.collection('Users').findOne({ _id: new ObjectID("5fa80c0ec478821a6ab84aaf") }, (error, user) => {

    //   if (error) {
    //     return console.log('Unable to fetch');
    //   }
    //   console.log(user);
    // })

    //**** find */

    // db.collection('Users').find({age: {$lt:50} }).toArray((error, users) => {
    //   if(error) {
    //     return console.log('unable to fetch data')
    //   }

    //   console.log(users)
    // })


    // Quiz:

    // find last document in task collection

    // db.collection('tasks').find().toArray((error, task) => {
    //   if(error) {
    //     return console.log('Unable to fetch data!')
    //   }

    //   const length = task.length;
    //     console.log('last taks is - ',task[length -1])
    // })

    // find tasks those are not completed yet

    // db.collection('tasks').find({completed: false}).toArray((error, task) => {
    //   if(error) {
    //     return console.error('Unable to fetch!')
    //   }
    //   console.log(task)
    // })


    //**** Update Operation */


    //**** updateOne */
    // db.collection('Users').updateOne({
    //   _id: new ObjectID("5fa808062188761593b401e1")
    // }, {
    //   $set:{
    //     name: 'Vikrant Singh'
    //   }
    // }).then((response) => {
    //   console.log(response)
    // }).catch((error) => {
    //   console.log(error)
    // })

    //**** updateMany */


    // db.collection('tasks').updateMany({
    //   completed:{ $ne: true
    // }
    // },{
    //   $set: {
    //     completed: true
    //   }
    // }).then((res) => {
    //   console.log(res)
    // }).catch((error) => {
    //   console.log(error)
    // })

    //**** Delete operation */

    //**** deleteMany */
    // db.collection('Users').deleteMany({
    //   age: 27
    // }).then((res) => {
    //     console.log(res)
    // }).catch((error) => {
    //     console.log(error)
    // })


    //**** deleteOne */
      // db.collection('tasks').deleteOne({
      //   description: 'take haircut'
      // }).then((res) => {
      //     console.log(res)
      // }).catch((error) => {
      //     console.log(error)
      // })
  }
);
