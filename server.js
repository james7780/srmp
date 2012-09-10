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

function serverListener(socket) { //'connection' listener
  console.log('server connected on port' + socket.address().port);
  socket.on('end', function() {
    console.log('server disconnected');
  });
  socket.write('hello\r\n');
  //socket.pipe(c);
};

var server = net.createServer(serverListener);

server.listen(PORT);
