const mongoose = require('mongoose');

var Todo = mongoose.model('Todo',{
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	}, 
	
	completed: {
		type: Boolean,
		default: false
	},

	completedAt: {
		type: Number,
		default: null
	},

	_creator: {
		type: mongoose.Schema.Types.ObjectId, // holds userId to associate user with todo
		required: true
	}

});

module.exports = {Todo};

