const expect = require ('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// Adding testing lifecycle
beforeEach((done)=>{
	Todo.remove({}).then(()=>done()); //makes sure database is empty before every test
})

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
			.end((err,res)=>{ //checks what got stored in mongodb collection
				if(err) { 
					return done(err); //prints error in screen if any expect failes
									 // eg: status != 200 or res.body.text != text  
				}

				Todo.find().then((todos)=>{
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
					expect(todos.length).toBe(0);
					done();
				
				}).catch((e)=>done(e));
			});
	});
});

