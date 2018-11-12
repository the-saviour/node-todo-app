//const MongoClient = require('mongodb').MongoClient;

// destructuring object

const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=>{
	if (err) {
		return console.log("Unable to connect to MongoDB server");
	}

	console.log("Connected to MongoDB server");
/*
	// Update files
	//  findOneAndUpdate(filterObject, updateObject, optionsobject, callback). Must use update operators like $set
	db.collection('Todos').findOneAndUpdate({
		_id: new ObjectID("5be9e894e9afb2ba41fd3440")
	}, {
		$set: {
			completed: false
		}
	}, {
		returnOriginal: false
	}).then((res)=>{
		console.log(res);
	});
	*/

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID ("5be5a501d4920c0d4005e95e")
	}, {
		$set: {
			name: "Nishant"
		},

		$inc: {
			age: 1
		}
	}, {
		returnOriginal: false
	}).then((res)=>{
		console.log(res);
	});

	// db.close();	




})