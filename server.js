
// Dependencies
var express = require('express');
var mongoose = require('mongoose');
var socket = require('socket.io');

var body_parser = require('body-parser');

// MongoDB
mongoose.connect('localhost/tcc_server');

// Express
var app = express();
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());



// Routes
app.use('/api', require('./routes/api'));


// Start Server 
var port = process.env.PORT || 3000

//var server = app.listen(3000);
server.listen(port, function() {
    console.log("App is running on port " + port);
});

console.log('Pudim de Leite 2');


// Socket Setup
var io = socket(server);

io.on('connection', function(socket){
	console.log('Connect socket', socket.id);


	socket.on('pudim', function(data){
		console.log('pudim stuff');
		console.log(data);
		io.sockets.emit('pudim', data);
	});
});