
// connecting to TodoApp database
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

if (process.env.PORT != 3000){

	mongoose.connect('mongodb://admin:admin1@ds211694.mlab.com:11694/todo-app');
}
else {
	mongoose.connect(process.env.MONGODB_URI);
}
module.exports = {mongoose};