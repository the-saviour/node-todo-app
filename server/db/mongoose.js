
// connecting to TodoApp database
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

if (process.env.PORT){

	mongoose.connect('mongodb://admin:admin1@ds211694.mlab.com:11694/todo-app');
}
else {
	mongoose.connect('mongodb://localhost:27017/TodoApp');
}
module.exports = {mongoose};