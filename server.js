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

var socketList = [];

var intervalId;

var game;

// Handle data recieved on a socket
function socketData(data) {
	console.log(data.toString());
};

// Update game tick
function updateGame(game) {
	console.log('game tick: ' + game.tickCount);
	game.updateState(1000);
	// Push game state to clients
	var socket = socketList[0];
	if (socket) {
		socket.broadcast.emit('state', {state: game.getState()});
		socket.emit('state', {state: game.getState()});
	}
};

// Handles new connections
function serverListener(socket) { //'connection' listener
	//console.log('server connected on port' + socket.options.port);
	console.log('client connected: ' + socket.id);

 	socketList.push(socket);

	socket.emit('hello\r\n');
	//socket.pipe(c);

	socket.on('start', function(data) {
		console.log('start request from ' + data.name + ' (' + socket.id + ')');
		// Can only start game if it's not yet started (doh!)
		if (0 == game.tickCount) {
			game.initialise(1);
			game.start();
/*
			intervalId = setInterval(function() {
																	console.log('tick: ' + game.tickCount);
																	game.updateState(1000);
																	// Push game state to clients
																	socket.broadcast.emit('state', {state: game.getState()});
																	socket.emit('state', {state: game.getState()});
																}, 1000);				// game tick callback
*/
			intervalId = setInterval(updateGame, 500, game);
						
			// Broadcast start message
			socket.broadcast.emit('start', data);
			socket.emit('start', data);
	
			// Broadcast game state to clients
			socket.emit('state', {state: game.getState()});
		}
	});

	socket.on('end', function() {
		console.log('server disconnected');
		clearInterval(intervalId);
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

	/// Handle "leave" request from a client
	socket.on('leave', function(data) {
		console.log('leave request from ' + data.name);		//socket.id);		// externaladdress?

		// add player to the game
		game.removePlayer(data.name);

		// Broadcast that client has left
		socket.broadcast.emit('leave', data);
		// And tell client that is has left
		data.isme = true;
		socket.emit('leave', data);
		
		// Push game state to client (will be minus the left player)
		socket.emit('state', {state: game.getState()});
	});
	
	// Create the game world if it is not already created
	//var Game = galaxyjs.Game;
	if (game == null) {
		game = new galaxyjs.Game();
		game.initialise(1);
	}
};

//var server = net.createServer(serverListener);
//server.listen(PORT);

io.sockets.on('connection', serverListener);

