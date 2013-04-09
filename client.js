//document.addEventListener('DOMContentLoaded', function() {

var renderer = null;
var playerId = null;

/// Set up the client, using the specified connection
function startClient(address) {

	// Override default address if user has entered one
	var enteredAddress = document.getElementById('serverURL').value;
	
	if (enteredAddress != "") {
		address = "net://" + enteredAddress;
	}
	
	document.getElementById('debugoutput').innerText = "Connecting to server " + address + "...";

	// Globals
	//socket = io.connect('http://localhost:8765');
	socket = io.connect(address);

	// Check after 4 seconds if connection failed
	setTimeout(function() {
		if (!socket.connected) {
			//alert("Could not connect!");
			document.getElementById('debugoutput').innerText = "Could not connect to server " + address + " !!!";
		}
	}, 4000);
 
	game = new Game();					// defined in galaxy.js
	playerId = null;
	totalSkew = 0;
	
	// test
	// Fetch game state from the server.
	socket.emit('join', {name: 'James'});

	
	renderer = new Renderer(game);
	//renderer.render();
/*
	var input = new Input(game);
	sound = new SoundManager();
	
	// Get the initial game state
	socket.on('start', function(data) {
	  //sound.toggleSoundtrack();
	  console.log('recv state', data);
	  // Load the game
	  game.load(data.state);
	  // Get the initial time to calibrate synchronization.
	  var startDelta = new Date().valueOf() - data.state.timeStamp;
	  // Setup the game progress loop
	  game.updateEvery(Game.UPDATE_INTERVAL, startDelta);
	
	  // Start the renderer.
	  renderer.render();
	  // Check if there's a name specified
	  if (window.location.hash) {
	    var name = window.location.hash.slice(1);
	    socket.emit('join', {name: name});
	    document.querySelector('#join').style.display = 'none';
	  }
	});
*/

	// Game state recieved from server
	socket.on('state', onState);

	// A new client has joined the game (could be me)
	socket.on('join', onJoin);

	// Someone has started the game
	socket.on('start', onStart);

	// A client leaves.
	socket.on('leave', onLeave);
/*
	// A client shoots.
	socket.on('shoot', function(data) {
	  console.log('recv shoot', data.timeStamp, (new Date()).valueOf());
	  // Ensure that this client is alive.
	  if (!game.blobExists(data.playerId)) {
	    return;
	  }
	  // Play shoot sound effect
	  sound.playBloop();
	  game.shoot(data.playerId, data.direction, data.timeStamp);
	});
	
	// Get a time sync from the server
	socket.on('time', function(data) {
	  // Compute how much we've skewed from the server since the last tick.
	  var updateDelta = data.lastUpdate - game.state.timeStamp ;
	  // Add to the cumulative skew offset.
	  totalSkew += updateDelta;
	  // If the skew offset is too large in either direction, get the real state
	  // from the server.
	  if (Math.abs(totalSkew) > Game.TARGET_LATENCY) {
	    // Fetch the new truth from the server.
	    socket.emit('state');
	    totalSkew = 0;
	  }
	  // Set the true timestamp anyway now.
	  //game.state.timeStamp = data.lastUpdate;
	
	  // Number of clients that aren't playing.
	  document.getElementById('observer-count').innerText =
	      Math.max(data.observerCount - game.getPlayerCount(), 0);
	  document.getElementById('player-count').innerText = game.getPlayerCount();
	  document.getElementById('average-lag').innerText = Math.abs(updateDelta);
	});
	
	// Server reports that somebody won!
	socket.on('victory', function(data) {
	  if (playerId) {
	    if (data.id == playerId) {
	      gameover('you win! play again?');
	    } else {
	      gameover(data.id + ' won and you lost! play again?');
	    }
	  } else {
	    gameover('game over. ' + data.id + ' won! play again?');
	  }
	});
	
	// Note: do not use this as the definitive game win condition because we may be
	// out of sync with the truth on the server!
	game.on('victory', function(data) {
	  // Somebody won!
	});
	game.on('dead', function(data) {
	  // Someone died :(
	});
	*/
	
	function gameover(msg) {
		smoke.confirm(msg, function(yes) {
			if (yes && playerId) {
				socket.emit('join', {name: playerId});
			} else {
				smoke.signal('watching mode');
				// Show the button
				document.querySelector('#join').style.display = 'inline';
				playerId = null;
			}
			// Get a fresh state
			socket.emit('state');
		});
	}

};

/// Client wants to join the game
function joinClient() {
	var playerName = document.getElementById('playerName').value;
	if (playerName.length != 0) {
		socket.emit('join', {name: playerName});
	}
};

/// Client says start the game
function startGame() {
	socket.emit('start', {name: 'James'});
};

/// Client wants to leave the game
function leaveClient() {
	socket.emit('leave', {name: playerId});
};

/// "State" message handler
function onState(data) {
		game.loadState(data.state);
		// Number of clients that aren't playing.
		document.getElementById('observer-count').innerText = game.getPlayerCount();
		document.getElementById('player-count').innerText = game.getPlayerCount();
		//document.getElementById('average-lag').innerText = Math.abs(updateDelta);  
	
		renderer.render();	
};

/// "Join" message handler
function onJoin(data) {
		console.log('recv join: ', data.name);
		//game.join(data.name);
		document.getElementById('debugoutput').innerText = "Player " + data.name + " joined the game";
		if (data.isme) {
			playerId = data.name;
			
			// Set the hash
			window.location.hash = '#' + data.name;
			//alert("join acknowledged");
		}

		renderer.render();
};

/// "Game started" message handler
function onStart(data) {
		console.log("Player " + data.name + " has started the game");
		document.getElementById('debugoutput').innerText = "Player " + data.name + " has started the game";
	
		// Set client "running" state here?
};

function onLeave(data) {
	  console.log('recv leave', data);
		document.getElementById('debugoutput').innerText = "Player " + data.name + " has left the game";
	  if (playerId == data.name) {
	    //gameover('you were absorbed. play again?');
	  }
	  //game.leave(data.name);
};
