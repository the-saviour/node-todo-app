require('./config/config.js');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo.js');
const {User} = require('./models/users.js');
const userController = require('./user-controller.js');
const {authenticate} = require('./middleware/authenticate.js');

var app= express();
const port = process.env.PORT;

app.use(bodyParser.json());
//Handling post request. In this case we use postman to make post request
app.post('/todos', (req,res)=>{
	var todo =new Todo({
		text: req.body.text

	});

	todo.save().then((doc)=>{
		res.send(doc);
	}, (err)=>{
		res.status(400).send(err);
	});
});

app.get('/todos', (req,res)=>{
	Todo.find().then((todos)=>{
		res.send({todos});     //can send todos array directly but chose to send todos object
	}, (err)=>{
		res.status(400).send(err);	
	});
});

app.get('/todos/:id', (req,res)=>{
	var {id} = req.params;	//req.params is used to access data sent from url (url parameters)
	if(!ObjectId.isValid(id)){
		return res.status(404).send();
	}
	
	Todo.findById(id).then((todo)=>{
		if(!todo){
			return res.status(404).send("id not found");
		}
		
		res.send({todo});
	}).catch((e)=>{
		res.status(400).send();
	});

});

app.delete('/todos/:id', (req,res)=>{
	var {id} = req.params;
	if(!ObjectId.isValid(id)){
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(id).then((todo)=>{
		if(!todo){
			return res.status(404).send();
		}

		res.send({todo});
	}).catch((e)=>{
		return res.status(400).send();
	});

});

app.patch('/todos/:id', (req,res)=> {
	var {id} = req.params;
	var body = _.pick(req.body, ['text', 'completed']); // pick takes an object (req.body in this case) then it takes an array of properties we want to pick

	if(!ObjectId.isValid(id)){
		return res.status(404).send("invalid object id");
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id, {$set: body}, {new : true}).then((todo) => {		 // new set to true retruns new object
		if(!todo) {
			return res.status(404).send("no findy");
		}

		res.send({todo});
	}).catch((e)=>{
		res.status(400).send();
	}); 
});	


app.post('/users', userController.handleUserPost);

app.post('/users/login', (req,res)=>{
	var body = _.pick(req.body, ['email', 'password']);
	User.findByCredentials(body.email, body.password).then((user)=>{
		user.generateAuthToken().then((token)=>{
			res.header('x-auth', token).send(user);
		});	
		// res.send(user); //no need to check if user exists because we do it in users model
	}).catch((e)=>{
		res.status(400).send();
	});
});


app.get('/users/me',authenticate, (req,res)=>{			//requires valid x-auth token
	res.send(req.user);
});		

app.delete('/users/me/token',authenticate, (req,res)=>{   
	req.user.removeToken(req.token).then(()=>{
		res.status(200).send(); //don't need any data back so send(empty)
	}, () => {
		res.status(400).send();
	});
});


module.exports = {app};

app.listen(port, ()=>{
	console.log(`Started in port ${port}`);
});