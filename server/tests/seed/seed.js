const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/users');


const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const users = [{
	//first user with token to run test requiring authentication
	_id: userOneId,
	email: 'nishant@server.com',
	password: 'userOnePass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId.toHexString(),access : 'auth'}, 'abc123').toString()
	}]
	},
	{
	// second user without token
	_id: userTwoId,
	email: 'mahat@server.com',
	password: 'userTwoPass'
	}];

const populateUsers = (done) => {  //insertMany won't work because it is not comaptible with pre/post hooks
	User.remove({}).then(()=>{
		var userOne = new User(users[0]).save(); //returns a promise
		var userTwo = new User(users[1]).save();

		Promise.all([userOne, userTwo]) //wait for all promises. Won't fire until all promises are fulfilled
		}).then(()=>done());
};		



//dummy todos to test GET request
const todos = [{
	_id: new ObjectId(),
	text: 'First test todo'
}, {
	_id: new ObjectId(),
	text: 'Second test todo',
	completed: true,
	completedAt: 123
}];


const populateTodos = (done)=>{
	Todo.remove({}).then(()=>{
		return Todo.insertMany(todos);
	}).then(()=>done()); //makes sure database is empty before every test
};

module.exports = {todos, populateTodos, users, populateUsers};

