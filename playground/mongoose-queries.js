const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/users');
/*var id = "5bee86c240b7922c1d0b1924";

if(!ObjectId.isValid(id)){				
	console.log("ID not valid");		//This can be done in catch block
}

// Todo.find({
// 	_id : id // In mongoose we don't need to create ObjectID, mongoose will do that
// }).then((todos)=>{
// 	console.log('Todos', todos);
// });

// Todo.findOne({
// 	_id : id
// }).then((todo)=>{
// 	console.log('Todo', todo);
// });

Todo.findById(id).then((todo)=>{
	if (!todo) {
		return console.log("id not found");
	}
	console.log('TodoById', todo);
}).catch((e)=>console.log(e));
*/


var id = '5beabcead8310d8435de6f70';

if(!ObjectId.isValid(id)){				
	console.log("ID not valid");		//This can be done in catch block
}

User.findById(id).then((user)=>{
	if(!user) {
		return console.log("Id not found");
	}
	console.log(JSON.stringify(user, undefined, 2));
},).catch((e)=>console.log(e));