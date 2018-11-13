const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// connect to TodoApp database
mongoose.connect('mongodb://localhost:27017/TodoApp');

// model of the database collection without validation
/*var Todo = mongoose.model('Todo', {
	text: {
		type: String
	},

	completed: {
		type: Boolean
	},
	completedAt:{
		type: Number
	}
});
*/
//  ---- creating new doucument/schema ----
// var newTodo = new Todo({
// 	text: 'Cook dinner'
// });

// newTodo.save().then((result)=>{
// 	console.log("saved todo",result );
// }, (err)=>{
// 	console.log("Unable to save todo", error);
// });

// newTodo = new Todo({
// 	text: 'Do HW',
// 	completed: false
// });

// newTodo.save().then((result)=>{
// 	console.log("saved todo", result);
// }, (err)=>{
// 	console.log("Unable to save todo",err);
// });


// ---- Create and insert with validators ----

/*var Todo =mongoose.model('Todo',{
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true

	}, 

	completed: {
		type: Boolean,
		default: false
	},

	completedAt: {
		type: Number,
		dafault: null
	}
}) ;
*/

//  Creating user collection schema with validators
var User = mongoose.model('User',{	
	email:{
		type: String,
		required: true,
		trim: true,
		minlength:1
	}
});

var user = new User({
	email: "nishant@nishant.com"
});

user.save().then((doc)=>{
	console.log('User saved', doc);
}, (error) =>{
	console.log('unable to save user', error);
});

