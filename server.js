/*
	Star Raiders Multiplayer - Server
	Copyright James Higgs 2012

	- Manage game world
	- Manage player (client) connections to the game world
			- Send "START" and "GAME OVER" messages
	- Recieve player input
	- Send world state to clients
			- Full world state
			- Sector state only
			

*/


// example code (may not work)

var PORT = 8765;

var net = require('net');
var galaxyjs = require('./galaxy.js');				// the game world

var sockets = [];

// Handle data recieved on a socket
function socketData(data) {
	console.log(data.toString());
};

// Handles new connections
function serverListener(socket) { //'connection' listener
  console.log('server connected on port' + socket.address().port);

  sockets.push(socket);

  socket.on('end', function() {
    console.log('server disconnected');
  });
  socket.write('hello\r\n');
  //socket.pipe(c);

  socket.on('data', socketData);
  
  socket.on('state', function() {
    console.log('state request from ' + socket.address().port);		// externaladdress?
    socket.emit('state', "abc");
    });

	// Test we can get game world started
	var Game = galaxyjs.Game;
	var game = new Game();
	game.initialise(1);
};

var server = net.createServer(serverListener);

server.listen(PORT);
