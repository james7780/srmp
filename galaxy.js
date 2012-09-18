
/*
	Star Raiders Multiplayer - Game world data
	Copyright James Higgs 2012

	- Game world data, rules and functions
*/

// namespace?
(function(exports) {

// objects (FUTURE: inherit all game objects from base class)
/**
 * Player object
 */
function Player(id, name, x, y)
{
	//assert ((this instanceof Player), "Must use new operator!");
	if (!(this instanceof Player)) { console.log("Must use new operator!"); };
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
  this.state = {};
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
Game.UPDATE_INTERVAL = 100;				// ten times a second
Game.MAX_DELTA = 10000;
Game.TARGET_LATENCY = 1000; // Maximum latency skew.
//Game.RESTART_DELAY = 1000;

/// Initialise the game world
/// @param {difficulty} Difficulty level (? to ?)

Game.prototype.initialise = function(difficulty) {
	var id = 1;
	this.objects[id] = new Player(id, "player1", 0, 0);
	id += 1;
	this.objects[id] = new StarBase(id, 10, 10, 100);
	id += 1;
	this.objects[id] = new StarBase(id, 20, 20, 100);
	id += 1;
	this.objects[id] = new StarBase(id, 10, 20, 100);
	id += 1;
	this.objects[id] = new StarBase(id, 10, 10, 100);
	id += 1;
	this.objects[id] = new ZylonFighter(id, 11, 11, 100);
	id += 1;
	this.objects[id] = new ZylonFighter(id, 21, 21, 100);
	id += 1;

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
    timeStamp: this.state.timeStamp
  };
  for (var id in this.state.objects) {
    var obj = this.state.objects[id];
    // Serialize to JSON!
    serialized.objects[id] = obj.toJSON();
  }

  return serialized;
};

/**
 * Load the game state.
 * @param {object} gameState JSON of the game state
 */
Game.prototype.loadState = function(stateIn) {
  //console.log(savedState.objects);
  var objects = stateIn.objects;
  this.state = {
    objects: {},
    timeStamp: stateIn.timeStamp.valueOf()
  }
  for (var id in objects) {
    var obj = objects[id];
/*    
    // Depending on type, instantiate.
    if (obj.type == 'blob') {
      this.state.objects[obj.id] = new Blob(obj);
    } else if (obj.type == 'player') {
      this.state.objects[obj.id] = new Player(obj);
    }
*/
    // Increment this.lastId
    if (obj.id > this.lastId) {
      this.lastId = obj.id;
    }
  }
};

exports.Game = Game;
exports.Player = Player;
exports.ZylonFighter = ZylonFighter;
exports.ZylonCruiser = ZylonCruiser;
exports.ZylonBasestar = ZylonBasestar;

})(typeof global === "undefined" ? window : exports);
