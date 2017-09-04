// Dependencies
var express = require('express'),
	mongoose = require('mongoose'),
	app = express(),
	server = require('http').createServer(app),

    socket = require('socket.io'),
    
    body_parser = require('body-parser'),
    shortid = require('shortid');

mongoose.Promise = global.Promise;
var mongodbURI = "mongodb://araujopdro:Puertoric0@ds149743.mlab.com:49743/tcc-chroma-studio"
mongoose.connect(mongodbURI);

app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

// Routes
app.use('/api', require('./routes/api'));

var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log("App is running on port " + port);
});

app.use(express.static('public'));

const io = socket(server);

var playerCount = 0;

io.on('connection', function(socket){
	var thisClientId = shortid.generate();

	console.log('client connected, broadcasting, id: ' + thisClientId);

	socket.broadcast.emit('join');
	playerCount++;

	for(i = 0; i < playerCount; i++){
		socket.emit('join');
		console.log('send join info to new player');
	}

	socket.on('place_trap', function(_data){
		console.log('place trap', JSON.stringify (_data));
		socket.broadcast.emit('place_trap', _data);
	});

	socket.on('disconnect', function(){
		console.log('client disconnected: '  + thisClientId);
		playerCount--;
	});

})

// io.on('connection', (socket) => {
//   	console.log('Client connected ' + socket.id);
//   	socket.on('disconnect', () => console.log('Client disconnected '+socket.id));

//   	socket.on('get_id', function(data){
// 		console.log(data);
// 		io.sockets.emit('get_id', data);
// 	});
// });

/*io.on('connection', function(socket){
	console.log('Connect socket', socket.id);

	// socket.on('pudim', function(data){
	// 	console.log('pudim stuff');
	// 	console.log(data);
	// 	io.sockets.emit('pudim', data);
	// });
});*/

/*var io = require('socket.io')(process.env.PORT || 3000);
var shortid = require('shortid')

console.log('server started');

var playerCount = 0;

io.on('connection', function(socket){
	var thisClientId = shortid.generate();

	console.log('client connected, broadcasting, id: ' + thisClientId);

	socket.broadcast.emit('join');
	playerCount++;

	for(i = 0; i < playerCount; i++){
		socket.emit('join');
		console.log('send join info to new player');
	}

	socket.on('place_trap', function(){
		console.log('place trap');
		socket.broadcast.emit('place_trap');
	});

	socket.on('disconnect', function(){
		console.log('client disconnected');
		playerCount--;
	});

})*/