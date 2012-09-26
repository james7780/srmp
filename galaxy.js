
/*
	Star Raiders Multiplayer - Game world data
	Copyright James Higgs 2012

	- Game world data, rules and functions
*/

// namespace?
(function(exports) {

/// Get JSON of object
function toJSON(object) {
	var json = {};
	for (var prop in object) {
		if (object.hasOwnProperty(prop)) {
			//console.log("adding property " + prop);
			json[prop] = object[prop];
		}
	}
	return json;
};

// objects (FUTURE: inherit all game objects from base class)
/**
 * Player object
 */
function Player(id, name, x, y)
{
	//assert ((this instanceof Player), "Must use new operator!");
	if (!(this instanceof Player)) { console.log("Must use new operator!"); };
	this.type = "player";
	this.id = id;
	this.name = name;
	this.x = x;
	this.y = y;
	this.fuel = 100;		// SR "energy max" = 9999
	this.shield = 100;
	this.damage = "";		// ascii mask for damaged components (eg: C for computer, L for long-range scan, etc)

	// Test
	Player.prototype.updatePlayer = function () {
		alert("updatePlayer, player name = ", this.name);
	}
}

// Create a new state for this player in the future
Player.prototype.computeState = function(delta) {
	// TODO: dampen vx and vy slightly?
	var newPlayer = new this.constructor(this.toJSON());
	newPlayer.x += 1;	//this.vx * delta/10;
	newPlayer.y += 1;		//this.vy * delta/10;
	return newPlayer;
};

/**
 * Starbase object
 */
function StarBase(id, x, y, health)
{
	//assert ((this instanceof StarBase), "Must use new operator!");
	if (!(this instanceof StarBase)) { console.log("Must use new operator!"); };
	this.type = "starbase";
	this.id = id;
	this.x = x;
	this.y = y;
	this.health = health;
}

// Create a new state for this starbase in the future
StarBase.prototype.computeState = function(delta) {
	// TODO: dampen vx and vy slightly?
	var newStarbase = new this.constructor(this.toJSON());
	newStarbase.x += 1;	//this.vx * delta/10;
	newStarbase.y += 1;		//this.vy * delta/10;
	return newStarbase;
};

/**
 * Zylon fighter object
 */
function ZylonFighter(id, x, y, health)
{
	//assert ((this instanceof ZylonFighter), "Must use new operator!");
	if (!(this instanceof ZylonFighter)) { console.log("Must use new operator!"); };
	this.type = "fighter";
	this.id = id;
	this.x = x;
	this.y = y;
	this.health = health;
	this.behaviour = 0;
	this.counter = 0;			// behaviour-related counter
}

// Create a new state for this zylon fighter in the future
ZylonFighter.prototype.computeState = function(delta) {
	// TODO: dampen vx and vy slightly?
	var newFighter = new this.constructor(this.toJSON());
	newFighter.x += 1;	//this.vx * delta/10;
	newFighter.y += 1;		//this.vy * delta/10;
	return newFighter;
};

/**
 * Zylon cruiser object
 */
function ZylonCruiser(id, x, y, health)
{
	//assert ((this instanceof ZylonCruiser), "Must use new operator!");
	if (!(this instanceof ZylonCruiser)) { console.log("Must use new operator!"); };
	this.type = "cruiser";
	this.id = id;
	this.x = x;
	this.y = y;
	this.health = health;
	this.behaviour = 0;
	this.counter = 0;			// behaviour-related counter
}

// Create a new state for this zylon cruiser in the future
ZylonCruiser.prototype.computeState = function(delta) {
	// TODO: dampen vx and vy slightly?
	var newCruiser = new this.constructor(this.toJSON());
	newCruiser.x += 1;	//this.vx * delta/10;
	newCruiser.y += 1;		//this.vy * delta/10;
	return newCruiser;
};

/**
 * Zylon Basestar object
 */
function ZylonBasestar(id, x, y, health)
{
	//assert ((this instanceof ZylonBasestar), "Must use new operator!");
	if (!(this instanceof ZylonBasestar)) { console.log("Must use new operator!"); };
	this.type = "basestar";
	this.id = id;
	this.x = x;
	this.y = y;
	this.health = health;
	this.behaviour = 0;
	this.counter = 0;			// behaviour-related counter
}

// Create a new state for this zylon basestar in the future
ZylonBasestar.prototype.computeState = function(delta) {
	// TODO: dampen vx and vy slightly?
	var newBasestar = new this.constructor(this.toJSON());
	newBasestar.x += 1;	//this.vx * delta/10;
	newBasestar.y += 1;		//this.vy * delta/10;
	return newBasestar;
};


/**
 * The game instance (singleton) that's shared across all clients and the server
 */
var Game = function() {
	this.objects = {};
	this.oldState = {};

	// Last used ID
	this.lastId = 0;
	this.callbacks = {};

	// Counter for the number of updates/ticks
	this.tickCount = 0;
	// Timer for the update loop.
	this.timer = null;
};

// defines (magic numbers)
// Radius of galaxy = 100000 "centrons" (metres)
Game.GALAXY_RADIUS = 100000;
Game.SECTOR_SIZE = 10000;
Game.UPDATE_INTERVAL = 100;				// ten times a second
Game.MAX_DELTA = 10000;
Game.TARGET_LATENCY = 1000; // Maximum latency skew.
//Game.RESTART_DELAY = 1000;

/// Initialise the game world
/// @param {difficulty} Difficulty level (? to ?)

Game.prototype.initialise = function(difficulty) {
	this.tickCount = 111;
	
	// When we start the game, we should randomly generate the game objects, but
	// the players should not be removed.
	var sx = Game.GALAXY_RADIUS;
	
	var id = 1;
	this.objects[id] = new Player(id, "player1", 0, 0);
	id += 1;
	this.objects[id] = new StarBase(id, Math.random() * sx, Math.random() * sx, 100);
	id += 1;
	this.objects[id] = new StarBase(id, Math.random() * sx, Math.random() * sx, 100);
	id += 1;
	this.objects[id] = new StarBase(id, Math.random() * sx, Math.random() * sx, 100);
	id += 1;
	this.objects[id] = new StarBase(id, Math.random() * sx, Math.random() * sx, 100);
	id += 1;
	this.objects[id] = new ZylonBasestar(id, Math.random() * sx, Math.random() * sx, 100);
	id += 1;
	this.objects[id] = new ZylonBasestar(id, Math.random() * sx, Math.random() * sx, 100);
	id += 1;
	this.objects[id] = new ZylonFighter(id, Math.random() * sx, Math.random() * sx, 100);
	id += 1;
	this.objects[id] = new ZylonFighter(id, Math.random() * sx, Math.random() * sx, 100);
	id += 1;
	this.objects[id] = new ZylonCruiser(id, Math.random() * sx, Math.random() * sx, 100);
	id += 1;
	this.objects[id] = new ZylonCruiser(id, Math.random() * sx, Math.random() * sx, 100);
	id += 1;

	this.lastId = id - 1;
};

/// Add a player to the game
Game.prototype.addPlayer = function(name) {
	var id = this.lastId + 1;
	this.objects[id] = new Player(id, name, Math.random() * Game.GALAXY_RADIUS, Math.random() * Game.GALAXY_RADIUS);
	this.lastId = id;
	console.log("added player " + name + " at " + this.objects[id].x + "," + this.objects[id].y);
};

/**
 * Step the game world forward by 1 tick (UPDATE_INTERVAL milliseconds)
 */
Game.prototype.updateState = function(delta) {

	var newState = {
		objects: {},
		timeStamp: this.state.timeStamp + delta
	};
	var newObjects = newState.objects;
	var objects = this.state.objects;
	// Generate a new state based on the old one
	for (var objId in objects) {
		var obj = objects[objId];
		if (!obj.dead) {
			newObjects[obj.id] = obj.computeState(delta);
		}
	}
/*
	// Largest object.
	var largest = null;
	// Total area.
	var total = 0;

	// Go through the new state and check for collisions etc, make
	// adjustments accordingly.
	for (var i in newObjects) {
		var o = newObjects[i];
		for (var j in newObjects) {
			var p = newObjects[j];
      // Check collisions
      if (o !== p && o.intersects(p)) {
        // Transfer masses around
        this.transferAreas_(o, p, delta);
      }
    }
    // At this point, o is not collided with any objects.
    // But it may be out of bounds. Have it go back in-bound and
    // bounce off.
    if (!this.inBounds_(o)) {
      // Do some math, bounce and reposition.
      this.repositionInBounds_(o);
    }

    // Get the largest blob in the world.
    if (!largest) {
      largest = o;
    }
    if (o.r > largest.r) {
      largest = o;
    }
    total += o.r;
  }
  // Victory conditions!
  if (largest.r > total/2) {
    console.log('game over!');
    this.callback_('victory', {id: largest.id});
  }
  */
	return newState;
};

/**
 * Save the game state.
 * @return {object} JSON of the game state
 */
Game.prototype.getState = function() {
	var serialized = {
		objects: {},
		timeStamp: this.tickCount					//state.timeStamp
	};
	//for (var id in this.state.objects) {
	for (var id in this.objects) {
		//var obj = this.state.objects[id];
		var obj = this.objects[id];
		// Serialize to JSON!
		serialized.objects[id] = toJSON(obj);		//obj.toJSON();
	}

	return serialized;
};

/**
 * Load the game state.
 * @param {object} gameState JSON of the game state
 */
Game.prototype.loadState = function(serialized) {
	//console.log(savedState.objects);
	var objectsIn = serialized.objects;
	this.tickCount = serialized.timeStamp;
//  this.state = {
//    objects: {},
//    timeStamp: stateIn.timeStamp.valueOf()
//  }

	// clear out existing objects
	this.objects = {};

	for (var id in objectsIn) {
		var obj = objectsIn[id];
		console.log(obj.type);
/*    
		// Depending on type, instantiate.
		if (obj.type == 'blob') {
			this.state.objects[obj.id] = new Blob(obj);
		} else if (obj.type == 'player') {
			this.state.objects[obj.id] = new Player(obj);
		}
*/
		if (obj.type == "player") {
			this.objects[obj.id] = new Player(obj.id, obj.name, obj.x, obj.y);
		}
		else if (obj.type == "starbase") {
			this.objects[obj.id] = new StarBase(obj.id, obj.x, obj.y, obj.health);
		}
		else if (obj.type == "basestar") {
			this.objects[obj.id] = new ZylonBasestar(obj.id, obj.x, obj.y, obj.health);
		}
		else if (obj.type == "fighter") {
			this.objects[obj.id] = new ZylonFighter(obj.id, obj.x, obj.y, obj.health);
		}
		else if (obj.type == "cruiser") {
			this.objects[obj.id] = new ZylonCruiser(obj.id, obj.x, obj.y, obj.health);
		}

		// Increment this.lastId
		if (obj.id > this.lastId) {
			this.lastId = obj.id;
		}
	}	// next object
};

/**
 * How many players are currently playing?
 */
Game.prototype.getPlayerCount = function() {
	this.playerCount = 0;
	for (var id in this.objects) {
		var obj = this.objects[id];
		if (obj instanceof Player) {
			this.playerCount += 1;
		}
	}

	return this.playerCount;
};

exports.Game = Game;
exports.Player = Player;
exports.ZylonFighter = ZylonFighter;
exports.ZylonCruiser = ZylonCruiser;
exports.ZylonBasestar = ZylonBasestar;

})(typeof global === "undefined" ? window : exports);
