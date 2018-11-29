const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo.js');
const {User} = require('./models/users.js');


var handleUserPost = (req,res)=>{
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);
	
	user.save().then(()=>{
		return user.generateAuthToken();
	}).then((token)=>{
		// var {email, password} = user; 
		res.header('x-auth', token).send(user);	//send token back as http response header(key, value); x-auth means custom header
		
	}).catch((e)=>{
		res.status(400).send(e);
	})
};



module.exports ={
	handleUserPost
}