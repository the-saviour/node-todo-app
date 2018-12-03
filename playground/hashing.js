const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc';

bcrypt.genSalt(10, (err, salt)=>{
	bcrypt.hash(password, salt, (err, hash)=>{ 
		console.log(hash);
	});
});

var hashedPassword = '$2a$10$cMis8dmuXC9VTlxGRFqxB.KYX0VylTBU/4KoF606mH4/kXXesnjtm';
bcrypt.compare(password, hashedPassword, (err,res)=>{
	console.log(res);
});

// var data = {
// 	id: 10
// };



// var token = jwt.sign(data, '123abc');
// console.log(token);

// console.log(jwt.verify(token, '123abc'));

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);



// var data = {
// 	id: 4
// };

// creating token
// var token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data)+'somesecretforsalting').toString() //data is object, hash takes string
// 	//Salting the hash: Adding a some string to hash that changes its value. Provides security 
// }

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(data)+'somethingsecretforsalting').toString();
// 
// var resultHash = SHA256(JSON.stringify(token.data)+'somesecretforsalting').toString();

// verifying token
// if(resultHash === token.hash){
// 	console.log('Data was not changed');
// } else {
// 	console.log('Data was changed. Do not trust');
// }

