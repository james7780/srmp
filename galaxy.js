
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
			// shorten float numbers for network transmit
			if (typeof json[prop] == 'number' && prop != 'type' && prop != 'id') {
				json[prop] = json[prop].toFixed(3);			// limit to 3 decimal places (could probably reduce to 1)
			}
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
	this.type = Game.PLAYERTYPEID;
	this.id = id;
	this.name = name;
	this.x = x;
	this.y = y;
	this.fl = 100;					// "fuel". SR "energy max" = 9999
	this.shd = 100;					// "shield"
	this.dmg = "";					// "damage" ascii mask for damaged components (eg: C for computer, L for long-range scan, etc)

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
	this.type = Game.STARBASETYPEID;
	this.id = id;
	this.x = x;
	this.y = y;
	this.hp = health;	
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
	this.type = Game.FIGHTERTYPEID;
	this.id = id;
	this.x = x;
	this.y = y;
	this.hp = health;
	this.bvr = 0;					// behaviour
	this.bcnt = 0;				// behaviour-related counter
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
	this.type = Game.CRUISERTYPEID;
	this.id = id;
	this.x = x;
	this.y = y;
	this.hp = health;
	this.bvr = 0;					// behaviour
	this.bcnt = 0;				// behaviour-related counter
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
function ZylonBaseStar(id, x, y, health)
{
	//assert ((this instanceof ZylonBasestar), "Must use new operator!");
	if (!(this instanceof ZylonBaseStar)) { console.log("Must use new operator!"); };
	this.type = Game.BASESTARTYPEID;
	this.id = id;
	this.x = x;
	this.y = y;
	this.hp = health;
	this.bvr = 0;					// behaviour
	this.bcnt = 0;				// behaviour-related counter
}

// Create a new state for this zylon basestar in the future
ZylonBaseStar.prototype.computeState = function(delta) {
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
Game.NUM_SECTORS_X = 16;
Game.NUM_SECTORS_Y = 8;
Game.UPDATE_INTERVAL = 100;				// ten times a second
Game.MAX_DELTA = 10000;
Game.TARGET_LATENCY = 1000; // Maximum latency skew.
//Game.RESTART_DELAY = 1000;

// object type id's
Game.PLAYERTYPEID = 1;
Game.STARBASETYPEID = 2;
Game.BASESTARTYPEID = 3;
Game.FIGHTERTYPEID = 4;
Game.CRUISERTYPEID = 5;
Game.ASTEROIDTYPEID = 6;
Game.PHOTONTYPEID = 7;

/// Initialise the game world
/// @param {difficulty} Difficulty level (? to ?)
Game.prototype.initialise = function(difficulty) {
	this.tickCount = 0;
	
	// When we start the game, we should randomly generate the game objects, but
	// the players should not be removed.

	// TODO : game world should be generated according to difficulty level	
	var id = 1;
	var newObjects = {};

	// add existing players (id's between 1 and 20)
	for (id in this.objects) {
		var obj = this.objects[id];
		if (obj.type == "player") {
			newObjects[obj.id] = new Player(obj.id, obj.name, obj.x, obj.y);
		}
	}
		
	this.objects = newObjects;
	
	// now add other objects
	// other objects start at id 20
	this.lastId = 19;
	var sx = Game.NUM_SECTORS_X;
	var sy = Game.NUM_SECTORS_Y;
	this.addObjectToSector(Game.STARBASETYPEID, Math.random() * sx, Math.random() * sy, 100);
	this.addObjectToSector(Game.STARBASETYPEID, Math.random() * sx, Math.random() * sy, 100);
	this.addObjectToSector(Game.BASESTARTYPEID, Math.random() * sx, Math.random() * sy, 100);
	this.addObjectToSector(Game.BASESTARTYPEID, Math.random() * sx, Math.random() * sy, 100);
	this.addObjectToSector(Game.FIGHTERTYPEID, Math.random() * sx, Math.random() * sy, 100);
	this.addObjectToSector(Game.FIGHTERTYPEID, Math.random() * sx, Math.random() * sy, 100);
	this.addObjectToSector(Game.CRUISERTYPEID, Math.random() * sx, Math.random() * sy, 100);
	this.addObjectToSector(Game.CRUISERTYPEID, Math.random() * sx, Math.random() * sy, 100);
};

/// Set the game rolling
Game.prototype.start = function() {
	this.tickCount = 1;
	
	// Note: callback timer is handled by server.js
};

/// Add a player to the game
Game.prototype.addPlayer = function(name) {
	// Find an empty "player slot"
	for (var id = 1; id < 20; id++) {
		var playerObj = this.objects[id];
		if (playerObj == null) {
			this.objects[id] = new Player(id, name, Math.random() * Game.GALAXY_RADIUS, Math.random() * Game.GALAXY_RADIUS);
			console.log("added player " + name + " at " + this.objects[id].x + "," + this.objects[id].y);
			break;
		}
	}
};

/// Add a game object to a sector
Game.prototype.addObjectToSector = function(type, sectorX, sectorY, health) {
	var newObject;
	// place the new object in the centre of the specified sector
	// FUTURE: add slight randomisation of coords?
	var sectorSize = Game.GALAXY_RADIUS / Game.NUM_SECTORS_X;
	sectorX = Math.floor(sectorX);
	sectorY = Math.floor(sectorY);
	var cx = (sectorX + 0.5) * sectorSize;
	var cy = (sectorY + 0.5) * sectorSize;
 
	var id = this.lastId + 1;
 
	if (type == Game.STARBASETYPEID)
		newObject = new StarBase(id, cx, cy, health);
	else if (type == Game.BASESTARTYPEID)
		newObject = new ZylonBaseStar(id, cx, cy, health);
	else if (type == Game.FIGHTERTYPEID)
		newObject = new ZylonFighter(id, cx, cy, health);
	else if (type == Game.CRUISERTYPEID)
		newObject = new ZylonCruiser(id, cx, cy, health);
	//else if (type == Game.ASTEROIDTYPEID)
	//	this.objects[id] = new Asteroid(id, cx, cy, health);

	if (newObject != null)
		{
		this.objects[id] = newObject;
		this.lastId = id;
		}

	return newObject
};

/// Get the starbase which is closest to the specified coords
Game.prototype.getNearestStarbase = function(x, y)
{
	var minDist = Game.GALAXY_RADIUS;
	var closestStarbase;
	for (var objId in this.objects) {
		var obj = this.objects[objId];
		if (obj.type == Game.STARBASETYPEID) {
			var d = Math.sqrt(Math.pow((x - obj.x), 2) + Math.pow((y - obj.y), 2)); 
			if (d < minDist) {
				minDist = d;
				closestStarbase = obj;
			}
		}
	}
	
	return closestStarbase;
};

/**
 * Step the game world forward by 1 tick (UPDATE_INTERVAL milliseconds)
 */
Game.prototype.updateState = function(delta) {

	//var newState = {
	//	objects: {},
	//	timeStamp: this.state.timeStamp + delta
	//};
	//var newObjects = newState.objects;
	//var objects = this.objects;
	// Generate a new state based on the old one
	
	// Update the game state
	
	for (var objId in this.objects) {
		var obj = this.objects[objId];
		if (obj.type == Game.BASESTARTYPEID) {
			// Find nearest starbase and move towards it
			var closestStarbase = this.getNearestStarbase(obj.x, obj.y);
			if (closestStarbase) {
				// need vector class!
				var d = Math.sqrt(Math.pow((closestStarbase.x - obj.x), 2) + Math.pow((closestStarbase.y - obj.y), 2));
				obj.x += ((closestStarbase.x - obj.x) / d) * 100;
				obj.y += ((closestStarbase.x - obj.y) / d) * 100;
			}
		}
		else if (obj.type == Game.FIGHTERTYPEID) {
			// Move around randomly
			obj.x += 10;
			obj.y += 10;
		}
		else if (obj.type == Game.CRUISERTYPEID) {
			// Move around randomly
			obj.x += 10;
			obj.y += 10;
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
	//return newState;
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
		//console.log(obj.type);
 
		// Depending on type, instantiate.
		if (obj.type == Game.PLAYERTYPEID) {
			this.objects[obj.id] = new Player(obj.id, obj.name, obj.x, obj.y);
		}
		else if (obj.type == Game.STARBASETYPEID) {
			this.objects[obj.id] = new StarBase(obj.id, obj.x, obj.y, obj.health);
		}
		else if (obj.type == Game.BASESTARTYPEID) {
			this.objects[obj.id] = new ZylonBaseStar(obj.id, obj.x, obj.y, obj.health);
		}
		else if (obj.type == Game.FIGHTERTYPEID) {
			this.objects[obj.id] = new ZylonFighter(obj.id, obj.x, obj.y, obj.health);
		}
		else if (obj.type == Game.CRUISERTYPEID) {
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
exports.ZylonBaseStar = ZylonBaseStar;

})(typeof global === "undefined" ? window : exports);
