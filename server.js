
// Dependencies
var express = require('express'),
	mongoose = require('mongoose'),
	app = express(),
	server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    body_parser = require('body-parser');


var mongodbURI = "mongodb://araujopdro:Puertoric0@ds149743.mlab.com:49743/tcc-chroma-studio"
mongoose.connect('localhost/tcc_server');

app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());


// Routes
app.use('/api', require('./routes/api'));

var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log("App is running on port " + port);
});

console.log('Pudim de Leite 2');

io.sockets.on('connection', function(socket){
	console.log('Connect socket', socket.id);


	// socket.on('pudim', function(data){
	// 	console.log('pudim stuff');
	// 	console.log(data);
	// 	io.sockets.emit('pudim', data);
	// });
});