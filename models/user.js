//Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

//Schema
var userSchema = new mongoose.Schema({
	user: String,
	avatar: Number
});


//Return
module.exports = restful.model('User', userSchema);