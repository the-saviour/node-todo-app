const _ = require('lodash');
const expect = require ('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/users');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');
/*	refactored and moved to seed.js 
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

*/



/*	moved to seed.js
// Adding testing lifecycle
beforeEach((done)=>{
	Todo.remove({}).then(()=>{
		return Todo.insertMany(todos);
	}).then(()=>done()); //makes sure database is empty before every test
});
*/
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', ()=>{
	it('should create a new todo', (done)=>{
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({text})
			.expect(200)
			.expect((res)=>{				//This is custom expect
				expect(res.body.text).toBe(text);  //check if response is correct
			})
			// Any further asynchronous operations in test like checking database should be done inside end 
			.end((err,res)=>{ //checks what got stored in mongodb collection
				if(err) { 
					return done(err); //prints error in screen if any expect failes
									 // eg: status != 200 or res.body.text != text  
				}

				Todo.find({text}).then((todos)=>{
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();

				}).catch((e)=>done(e));
			});
	});

	// new test case

	it('should not create todo with invalid body data',(done)=>{
		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({})
			.expect(400)
			.end((err,res)=>{
				if(err) {
					return done(err);
				}

				Todo.find().then((todos)=>{
					expect(todos.length).toBe(2);
					done();
				
				}).catch((e)=>done(e));
			});
	});
});

describe('GET /todos', ()=>{
	it('should get all todos', (done)=> {
		request(app)
			.get('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res)=>{
				expect(res.body.todos.length).toBe(1); //
			})
			.end(done);
	});
});


describe('GET /todos/:id', ()=>{
	it('should return a todo doc', (done)=>{
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done); 
	});

	it('should not return todo created by another user', (done)=>{
		request(app)
			.get(`/todos/${todos[1]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done); 
	})

	it('should return 404 if todo not found',(done)=>{
		var id = new ObjectId();
		request(app)
			.get(`/todos/${id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('should return 404 if Object id is invalid', (done)=>{
		request(app)
			.get('/todos/123')
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

});

describe('DELETE /todos/:id', ()=>{
	it('should remove a todo', (done)=>{
		var hexId = todos[1]._id.toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(todos[1].text);
			})
			.end((err, res) => { //querying the db to check if item got deleted 
				if(err) {
					return done(err); // if an error no need to query the db
				}

				Todo.findById(hexId).then((todo)=>{
					expect(todo).toNotExist();
					done();
				}).catch((e)=>done(e));
			});
	});

		it('should not remove a todo by unauthorized user', (done)=>{
			request(app)
				.delete(`/todos/${todos[0]._id.toHexString()}`)
				.set('x-auth', users[1].tokens[0].token)
				.expect(404)
				.end((err,res)=>{
					if(err){
						return done(err);
					}

					Todo.findById(todos[0]._id.toHexString()).then((todo)=>{
						expect(todo).toExist();
						done();
					}).catch((e)=>done());
				});
			
		});

    it('should return 404 if todo not found',(done)=>{
    	var hexId = new ObjectId().toHexString();
    	request(app)
    		.delete(`/todos/${hexId}`)
    		.set('x-auth', users[0].tokens[0].token)
    		.expect(404)
    		.end(done);
    });

    it('should return 404 if object id is invalid', (done)=>{
    	request(app)
    		.delete('/todos/123')
    		.set('x-auth', users[0].tokens[0].token)
    		.expect(404)
    		.end(done);
    });

});

describe('PATCH /todos/:id', ()=>{

	it('should update a todo', (done)=>{
		var hexId = todos[0]._id.toHexString();
		var completed = true;
		var text = 'Something from test'; 
		request(app)
			.patch(`/todos/${hexId}`)
			.set('x-auth', users[0].tokens[0].token)
			.send({text, completed})
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end((err,res)=>{
				if(err){
					return done(err);
				}

				Todo.findById(hexId).then((todo)=>{
					expect(todo.text).toBe(text);
					expect(todo.completed).toBe(completed);
					expect(todo.completedAt).toBeA('number');
					done();
				}).catch((e)=>done(e));


			});
	});

	it('should clear completedAt when todo is not completed',(done)=>{
		var hexId = todos[1]._id.toHexString();
		request(app)
			.patch(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.send({completed: false})
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist();
			})
			.end((err,res)=>{
				if(err) {
					return done(err);
				}

				Todo.findById(hexId).then((todo)=>{
					expect(todo.completed).toBe(false);
					expect(todo.completedAt).toNotExist(); //toBe(null);
					done();
				}).catch((e)=>done(e));

			});
	});

	it('should not update from unauthorized user', (done)=>{
		var hexId = todos[0]._id.toHexString();
		var completed = true;
		var text = 'Something from test'; 
		request(app)
			.patch(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.send({text, completed})
			.expect(404)
			.end((err,res)=>{
				if(err){
					return done(err);
				}

				Todo.findById(hexId).then((todo)=>{
					expect(todo.completed).toBe(false);
					expect(todo.completedAt).toNotExist();
					done();
				}).catch((e)=>done(e));
			});
	});

	it('should return 404 if todo not found',(done)=>{
		var hexId = new ObjectId().toHexString();
		request(app)
			.patch(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end((done));
	});

	it('should return 404 if ObjectId is invalid',(done)=>{
		request(app)
			.patch('/todos/123')
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(done);

	});

});


describe('GET /users/me', ()=>{
	it('should return user if authenticated', (done) =>{
		request(app)
			.get('/users/me')
			.set('x-auth',users[0].tokens[0].token)
			.expect(200)
			.expect((res)=>{
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it('should return 401 if not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res)=>{
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('POST /users', ()=>{
	it('should create a user', (done)=>{
		var email = 'example@example.com';
		var password = '123mnb';
		
		request(app)
			.post('/users')
			.send({email,password})
			.expect(200)
			.expect((res)=>{
				expect(res.headers['x-auth']).toExist();
				expect(res.body._id).toExist();
				expect(res.body.email).toEqual(email);
			}).end((err,res)=>{
				if(err)  {
					return done(err);
				}

				User.findOne({email}).then((user)=>{
					expect(user).toExist();
					expect(user.password).toNotBe(password);
					done();
				}).catch((e)=>done());
			});
	});

	it('should return validation errors if request invalid', (done)=>{
		var email = 'example@example.com';
		var password = '123'
		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end((err, res)=>{
				if(err) {
					return done();
				}

				User.findOne({email}).then((user)=>{
					expect(user).toNotExist();
					done();
				})
			})
	});

	it ('should not create user if email in use', (done)=>{
		var email = 'nishant@server.com';
		var password = 123456;

		request(app)
			.post('/users')
			.send({email,password})
			.expect(400)
			.end(done);

	});


});

describe('POST /users/login', ()=>{
	it('should login user and return auth token', (done)=>{
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect((res)=>{
				expect(res.headers['x-auth']).toExist();
			})
			.end((err, res) => {
				if(err) {
					return done(err);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens[1]).toInclude({
						access: 'auth',
						token: res.headers['x-auth']
					});
					done();
				}).catch((e)=>done(e));
			});
	});

	it('should reject invalid login', (done)=>{
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: 245245
			})
			.expect(400)
			.expect((res)=>{
				expect(res.headers['x-auth']).toNotExist();
			})
			.end((err, res)=>{
				if(err){
					return done(err);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens.length).toBe(1);
				done();
			}).catch((e)=>done(e));
			});
	});
}); 

describe('DELETE /users/me/token', ()=>{
	it('should remove auth token on logut', (done) => {
		request(app)
		.delete('/users/me/token')
		.set('x-auth',users[0].tokens[0].token)
		.expect(200)
		.end((err, res)=>{
			if(err){
				return done(err);
			}

			User.findById(users[0]._id).then((user)=>{
				expect(user.tokens.length).toBe(0);
				done();
			}).catch((e)=>done(e));
		});
	});
});







