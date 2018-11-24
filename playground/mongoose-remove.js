const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/users');


//Todo.remove({}) -removes documents but does not return documents, takes an object as parameter


// Todo.remove({}).then((result)=>{
// 	console.log(result);
// });

// finds(returns the deleted doc) and remove
// Todo.findOneAndRemove



Todo.findByIdAndRemove('5bf1d9c839fa7db19fb0e0d7').then((todo)=>{
	console.log(todo);
});