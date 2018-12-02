const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
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

UserSchema.methods.toJSON = function(){	//determines what gets sent back when a mongoose model is converted to json value
	var user = this;
	var userObject = user.toObject(); // converts mongoose variable to regular objects with attributes in documents only 

	return _.pick(userObject, ['_id', 'email']);
};

UserSchema.statics.findByToken = function (token){
	var User = this;
	var decoded;

	try {
		decoded = jwt.verify(token, 'abc123'); //jwt.verify() sends error if secret doesn't match/if data doesn't match 
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

var User = mongoose.model('User',UserSchema);

module.exports = {User};







