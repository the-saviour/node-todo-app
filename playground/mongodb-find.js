//const MongoClient = require('mongodb').MongoClient;

// destructuring object

const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=>{
	if (err) {
		return console.log("Unable to connect to MongoDB server");
	}

	console.log("Connected to MongoDB server");
// // collection.find() is used to query
// // ObjectID is not a string but an object so we use new to create an ObjectID object
// 	db.collection('Todos').find({_id: new ObjectID("5be59dd8621ed319a04bd563")}).toArray().then((docs)=>{
// 		console.log('Todos');
// 		console.log(JSON.stringify(docs, undefined, 2));
// 	}, (err) => {
// 		console.log('Unable to fetch todos', err);
// 	});


	// db.collection('Todos').find().count().then((count)=>{
	// 	console.log(`Todos count: ${count}`);
		
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// });

	db.collection('Users').find({age:25}).toArray().then((docs)=>{
		docs.forEach((record)=>{console.log(record.name)});
	})


	// db.close();	




})