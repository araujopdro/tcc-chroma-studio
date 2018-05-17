// Dependencies
var express = require('express'),
	mongoose = require('mongoose'),
	app = express(),
	server = require('http').createServer(app),

    socket = require('socket.io'),
    
    body_parser = require('body-parser'),
    shortid = require('shortid');

app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json()); 
 
var options = {
   useMongoClient: true
};

var mongodbUri = 'mongodb://player_user:test@ds119014.mlab.com:19014/heroku_76qnqj48';
 
mongoose.connect(mongodbUri, options);
var db = mongoose.connection;             
 
db.on('error', console.error.bind(console, 'connection error:'));  
 
db.once('open', function() {
	console.log("db open s7");
  // Wait for the database connection to establish, then start the app.                         
});


//Schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	user: String,
	avatar: Number,
	points: Number
});
////

//Models
var UserModel = mongoose.model('UserModel', UserSchema);

////


// Routes
var port = process.env.PORT || 3000;
server.listen(port, function() {
	console.log("Port: " + port);
});

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}


app.post("/api/login", function(req, res) {
	console.log("POST STUFF");
	
	var authHeader = req.headers.authorization;

	if(authHeader){
		var new_user = new UserModel(req.body);

		new_user.save(function (err) {
			if (err) console.log ('Error on save!');
			console.log("save");
		});

		res.status(200).json(new_user);
	}else{
		console.log("Error");
		res.error(400).send({message: 'This is an error!'});
	};
});


app.get("/api/delete_users", function(req, res) {
	console.log("DELETE ALL USERS");

	UserModel.remove({}, function(err, users){
		res.status(200).json(users);
	});
});

app.get("/api/delete_users/:id", function(req, res) {
	console.log("DELETE USER: " + req.params.id);

	UserModel.remove({"_id": req.params.id}, function(err, users){
		res.status(200).json(users);
	});
});


app.get("/api/all_users", function(req, res) {
	console.log("GET ALL USERS");

	UserModel.find({}, function(err, users){
		res.status(200).json(users);
	});
});

app.get("/api/all_users/:id", function(req, res) {
	console.log("GET USER: " + req.params.id);
	UserModel.find({}, function(err, users){
		console.log(users.length);
		var _user;
		for (var i = 0; i < users.length; i++) {
		    if (users[i]._id == req.params.id){
		    	console.log(users[i]._id);
		    	console.log(users[i].user);
		    	console.log(req.params.id);
		    	_user = users[i];
		    }
		}
		if(_user == undefined){
			res.status(400).send({message: 'This is an error!'});
		}else{
			res.status(200).json(_user);
		}
	});
});


app.get("/api/users_by_score", function(req, res) {
	console.log("GET ALL USERS");

	UserModel.find({}, function(err, users){
		users.sort(sort_by('points', true, parseInt));
		res.status(200).json(users);
	});
});

//////IO STUFF/////////////
const io = socket(server);

var serverInfo = {
	"clients": []
};

var room = {
	"roomId": "", 
	"players": []
};

var client = {
	"clientId": ""
}

var rooms = [];
var rooms_status = [];

io.on('connection', function(socket){
	//////ON CONNECTION////////////
	client.clientId = shortid.generate();
	serverInfo.clients.push(client.clientId);

	console.log('client connected, broadcasting, id: ' + client.clientId);

	//Send info just for the current Socket
	socket.emit('user_id', client);
	//Broadcast Emit to Everyone Connected
	io.sockets.emit('server_info', serverInfo);
	
	//////////////////////////////

	socket.on('room_manage', function(_data){
		var data = _data;
		if(rooms.length > 0){
			for(var i = 0; i < rooms.length; i++){
				if(rooms[i].players.length == 1){
					rooms[i].players.push(data.playerSocketId);

					socket.broadcast.to(rooms[i].players[0]).emit('room_info', rooms);
					socket.broadcast.to(rooms[i].players[1]).emit('room_info', rooms);
				}
			}
		}else{
			var new_room = {};
			new_room.roomId = "room" + shortid.generate();
			new_room.players = [];
			new_room.players.push(data.playerSocketId);

			rooms.push(new_room);
			socket.emit('room_info', new_room);
		}
	});

	socket.on('reconnect', function(_data){
		var data = _data;
		client.clientId = data.playerSocketId;

		console.log("recon: "+data.playerSocketId);

		serverInfo.clients.push(client.clientId);

		socket.emit('user_id', client);
		
		io.sockets.emit('server_info', serverInfo);
	});

	//////ON DISCONNECTION////////////
	socket.on('disconnect', function(_data){
		var data = _data;

		for(var i = 0; i < serverInfo.clients.length; i++){
			if(serverInfo.clients[i] == data.playerSocketId){
				serverInfo.clients.splice(i, 1);
			}
		}
		io.sockets.emit('server_info', serverInfo);
	});
	//////ON DISCONNECTION////////////
})

function CreateRoom(){
	console.log("Create Room");

	var room_data = {};

	room_data.roomId = "ROOM-"+shortid.generate();
	room_data.clients = new Array();
	rooms.push(room_data);
}

var sort_by = function(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
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