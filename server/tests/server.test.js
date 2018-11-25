const expect = require ('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

//dummy todos to test GET request
const todos = [{
	_id: new ObjectId(),
	text: 'First test todo'
}, {
	_id: new ObjectId(),
	text: 'Second test todo'
}];






// Adding testing lifecycle
beforeEach((done)=>{
	Todo.remove({}).then(()=>{
		return Todo.insertMany(todos);
	}).then(()=>done()); //makes sure database is empty before every test
});

describe('POST /todos', ()=>{
	it('should create a new todo', (done)=>{
		var text = 'Test todo text';

		request(app)
			.post('/todos')
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

	// new taste case

	it('should not create todo with invalid body data',(done)=>{
		request(app)
			.post('/todos')
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
			.expect(200)
			.expect((res)=>{
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});
});


describe('GET /todos/:id', ()=>{
	it('should delete a todo', (done)=>{
		var hexId = todos[0]._id.toHexString();

		request(app)
			.get(`/todos/${hexId}`)
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done); 
	});

	it('should return 404 if todo not found',(done)=>{
		var id = new ObjectId();
		request(app)
			.get(`/todos/${id.toHexString()}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 if Object id is invalid', (done)=>{
		request(app)
			.get('/todos/123')
			.expect(404)
			.end(done);
	});

});

describe('DELETE /todos/:id', ()=>{
	it('should remove a todo', (done)=>{
		var hexId = todos[1]._id.toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(todos[1].text);
			})
			.end((err, res) => { //querying the db to check if item got deleted 
				if(err) {
					return done(err); // if an error no need to query the db
				}

				var hexId2 = todos[0]._id.toHexString();
				// Todo.find().then((todos) =>{
				// 	expect(todos.length).toBe(1);
				// 	done();
				// }).catch((e)=>done(e));

				Todo.findById(hexId).then((todo)=>{
					expect(todo).toNotExist();
					done();
				}).catch((e)=>done(e));
			});
	});

    it('should return 404 if todo not found',(done)=>{
    	var hexId = new ObjectId().toHexString();
    	request(app)
    		.delete(`/todos/${hexId}`)
    		.expect(404)
    		.end(done);
    });

    it('should return 404 if object id is invalid', (done)=>{
    	request(app)
    		.delete('/todos/123')
    		.expect(404)
    		.end(done);
    });

});