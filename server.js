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

//var net = require('net');
var io = require('socket.io').listen(8765);					// have to have "npm install socket.io" first

var galaxyjs = require('./galaxy.js');				// the game world

var sockets = [];

// Handle data recieved on a socket
function socketData(data) {
	console.log(data.toString());
};

// Handles new connections
function serverListener(socket) { //'connection' listener
	//console.log('server connected on port' + socket.options.port);

	console.log('server connected: ' + socket.id);

 	//sockets.push(socket);

	socket.emit('hello\r\n');
	//socket.pipe(c);

	socket.on('start', function(data) {
		console.log('start request from ' + data.name + ' (' + socket.id + ')');
		game.initialise(1);
		
		// Broadcast start message
		socket.broadcast.emit('start', data);

		// Broadcast game state to clients
		socket.emit('state', {state: game.getState()});
	});

	socket.on('end', function() {
		console.log('server disconnected');
	});

	socket.on('data', socketData);

	socket.on('state', function() {
		console.log('state request from ' + socket.id);		// externaladdress?
		// Push game state to client
		socket.emit('state', {state: game.getState()});
	});

	socket.on('join', function(data) {
		console.log('join request from ' + data.name);		//socket.id);		// externaladdress?

		if (game.getPlayerCount() < 8)
			{
			// add player to the game
			game.addPlayer(data.name);

			// Broadcast that client has joined
			socket.broadcast.emit('join', data);
			// And tell client that is has joined
			data.isme = true;
			socket.emit('join', data);

			// Push game state to client
			socket.emit('state', {state: game.getState()});
			}
	});

	// Test we can get game world started
	var Game = galaxyjs.Game;
	var game = new Game();
	game.initialise(1);
};

//var server = net.createServer(serverListener);
//server.listen(PORT);

io.sockets.on('connection', serverListener);

