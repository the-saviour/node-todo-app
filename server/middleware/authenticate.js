var {User} = require('./../models/users.js') 


var authenticate = (req, res, next) => {   //express middleware to verify token
	var token = req.header('x-auth');

	User.findByToken(token).then((user) => {
		if(!user){
			return Promise.reject(); //can rewrite res.status(401).send()  
		}

		req.user = user;
		req.token = token;
		next();
	}).catch((e)=>{
		res.status(401).send();
	});
	
};

module.exports = {authenticate};