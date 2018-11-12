//const MongoClient = require('mongodb').MongoClient;

// destructuring object

const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=>{
	if (err) {
		return console.log("Unable to connect to MongoDB server");
	}

	console.log("Connected to MongoDB server");


	// deleteMany
/*	db.collection('Todos').deleteMany({text: 'Eat Lunch'}).then((result)=>{
		console.log(result);
	});
*/	

	// deleteOne

	/*db.collection('Todos').deleteOne({text: 'Eat Lunch'}).then((res)=>{
	console.log(res);
	});
*/
	// findOneAndDelete

	/*db.collection('Todos').findOneAndDelete({completed: false}).then((res)=>{
		console.log(res);
	});*/

	db.collection('Users').deleteMany({name:"Mike"});

	// deleting using ObjectID
	db.collection('Users').findOneAndDelete({_id:new ObjectID("5be89a53fa4a803c9f37cae2")}).then(result=>{
		console.log(result);
	});

	// db.close();	




})