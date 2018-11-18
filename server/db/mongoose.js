
// connecting to TodoApp database
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds211694.mlab.com:11694/todo-app' || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};