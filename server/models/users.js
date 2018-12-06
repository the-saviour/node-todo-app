const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs'); 

var UserSchema = new mongoose.Schema({  // schema allows us to add methods
	// define attributes
	email:{
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique : true,
		//  validating email
		validate: {
			validator: validator.isEmail, //validator.isEmail is a function
			message: '{VALUE} is not valid email'
		}
	},

	password : {
		type: String,
		required: true,
		minlength:6
	},

	tokens: [{
		access: {
			type: String,
			required: true
		},

		token: {
			type: String,
			required: true
		}
	}]	

});

UserSchema.methods.generateAuthToken = function () {
	var user = this;	//the user that calls the function
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(),access}, 'abc123').toString();

	user.tokens = user.tokens.concat([{access,token}]);

	return user.save().then(()=>{ 	//returns a value on which promise can be applied in user-controller.js 
		return token;
	});
};

UserSchema.methods.removeToken = function(token){		//from tokens array delete any object that has token property equal to one passed in function   
	var user = this;
	return user.update({
		$pull: { //$pull is mongodb operator that removes item from array that matches certain criteria
			tokens: {token
				// token: token
			}
		}
	})
};

UserSchema.methods.toJSON = function(){	//determines what gets sent back when a mongoose model is converted to json value
	var user = this;
	var userObject = user.toObject(); // converts mongoose variable to regular objects with attributes in documents only 

	return _.pick(userObject, ['_id', 'email']);
};

UserSchema.statics.findByToken = function (token){
	var User = this;
	var decoded;
	//verifying token
	try {
		decoded = jwt.verify(token, 'abc123'); //jwt.verify() sends error if secret/data doesn't match and data if secret and data match
	} catch (e) {
		// return new Promise((resolve,reject){
		// 	reject(); //A promise that will always be rejected
		// });
		return Promise.reject(); // Same as 3 lines of codes above
	}

	return User.findOne({
		'_id':decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
}

UserSchema.statics.findByCredentials = function(email, password){
	var User = this;

	return User.findOne({email}).then((user)=>{
		if(!user){
			return Promise.reject(); 
		}

		return new Promise((resolve, reject)=>{
			bcrypt.compare(password, user.password, (err,res)=>{
				if(res) {
					resolve(user);
				} else {
					reject();
				}
			});
		});
	});
};


UserSchema.pre('save', function(next){  //mongoose middleware aka pre/post hook
	var user = this;
	if(user.isModified('password')) {
		bcrypt.genSalt(10,(err,salt)=>{
			bcrypt.hash(user.password, salt, (err,hash)=>{
				user.password = hash;
				next();
			});
		});

		
	} else {
		next();
	}

});


var User = mongoose.model('User',UserSchema);

module.exports = {User};







