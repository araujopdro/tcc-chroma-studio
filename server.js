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

var serverInfo = {
	"clientId": "sid",
	"nOfClients": 0
};

var rooms = [];

io.on('connection', function(socket){
	//////ON CONNECTION////////////
	serverInfo.clientId = shortid.generate();
	serverInfo.nOfClients++;

	console.log('client connected, broadcasting, id: ' + serverInfo.clientId);

	for(i = 0; i < serverInfo.nOfClients; i++){
		//Send info just for the current Socket
		socket.emit('server_info', serverInfo);
		console.log('send join info to new player');
	}
	
	//Broadcast Emit to Everyone Connected
	socket.broadcast.emit('server_info', serverInfo);
	//////////////////////////////

	socket.on('create_room', function(_data){
		CreateRoom(_data);
	});

	socket.on('join_room', function(_data){
		console.log("Join Room");
		var room_data;
		var foundRoom = false;
		for(var i = 0; i < rooms.length; i++){
			if(rooms[i].clients.length < 2 && !foundRoom){
				room_data = rooms[0];
				foundRoom = true;
			}
		}
		
		if(!foundRoom){
			console.log("Couldnt Find Room");
			CreateRoom(_data);
		}

		room_data = rooms[rooms.length - 1];

		room_data.clients.push(_data.clientId);

		socket.join(room_data.roomId);
		io.to(room_data.roomId).emit('joinned_room', room_data);
	});

	socket.on('place_trap', function(_data){
		console.log('place trap', JSON.stringify (_data));
		io.to(_data.roomId).emit('place_trap', _data);
	});

	//////ON DISCONNECTION////////////
	socket.on('disconnect', function(){
		console.log('client disconnected: '  + serverInfo.clientId);
		serverInfo.nOfClients--;

		socket.broadcast.emit('server_info', serverInfo);
	});
	//////ON DISCONNECTION////////////
})

function CreateRoom(_data){
	console.log("Create Room");

	var room_data = {};

	room_data.roomId = "ROOM-"+shortid.generate();
	room_data.host = _data.clientId;
	room_data.clients = new Array();
	rooms.push(room_data);
}


// io.on('connection', (socket) => {
//   	console.log('Client connected ' + socket.id);
//   	socket.on('disconnect', () => console.log('Client disconnected '+socket.id));

//   	socket.on('get_id', function(data){
// 		console.log(data);
// 		io.sockets.emit('get_id', data);
// 	}); 		Márcia .. parcela dese 600 + 3 x 366,09
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