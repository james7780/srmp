/*
	Star Raiders Multiplayer - Server
	Copyright James Higgs 2012

	- Manage game world
	- Manage player (client) connections to the game world
	- Recieve player input
	- Send world state to clients
*/

// example code (may not work)

var PORT = 8765;

var net = require('net');

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

};

var server = net.createServer(serverListener);

server.listen(PORT);