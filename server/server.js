const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo.js');
const {User} = require('./models/users.js');

var app= express();
const port = process.env.PORT || 3000;
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
			return res.status(400).send("id not found");
		}
		
		res.send({todo});
	});

})

module.exports = {app};

app.listen(port, ()=>{
	console.log(`Started in port ${port}`);
});