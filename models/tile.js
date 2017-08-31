//Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

//Schema
var tileSchema = new mongoose.Schema({
	color: String,
	sizeX: Number,
	sizeY: Number
});


//Return
module.exports = restful.model('Tiles', tileSchema);