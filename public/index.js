//Make Connectionvar socket
//var socket = io.connect("http://localhost:3000")

var socket = io();
var el = document.getElementById('server-time');

socket.on('time', function(timeString) {
  el.innerHTML = 'Server time: ' + timeString;
});