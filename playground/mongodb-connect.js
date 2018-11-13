const MongoClient = require('mongodb').MongoClient;

// In mongodb we don't need to create database to use it

//  connects to Todo database hosted in localhost: 27017
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=>{
	if (err) {
		return console.log("Unable to connect to MongoDB server");
	}

	console.log("Connected to MongoDB server");
// No need to create a collection to use item(index: unsigned long)
	// db.collection('Todos').insertOne({
	// 	text: 'Something to do',
	// 	completed: false
	// }, (err, result) => {
	// 	if(err){
	// 		return console.log('Unable to insert todo', err);
	// 	}

	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// })


	db.collection('Users').insertOne({
		name: "Nishant Mahat",
		age: 25,
		location: "Kathmandu, Nepal"
	}, (err, result)=>{
		if(err){
			return console.log("Unable of insert User", err);
		}

		console.log(JSON.stringify(result.ops, undefined, 2));
	})

	db.close();
})