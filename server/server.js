const express = require('express');
const bodyParser = require('body-parser');


const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo.js');
const {User} = require('./models/users.js');

var app= express();

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

module.exports = {app};

app.listen(3000, ()=>{
	console.log("Started in port 3000");
});