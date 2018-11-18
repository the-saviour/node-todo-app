
// connecting to TodoApp database
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds037987.mlab.com:37987/todo-app' || 'mingod://localhost:27017/TodoApp');

module.exports = {mongoose};