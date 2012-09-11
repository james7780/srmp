
/*
	Star Raiders Multiplayer - Game world data
	Copyright James Higgs 2012

	- Game world data, rules and functions
*/

// namespace?
(function(exports) {

// objects (FUTURE: inherit all game objects from base class)
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
		alert("updatPlayer, player name = ", this.name);
	}
}

function StarBase(id, x, y, health)
{
	//assert ((this instanceof StarBase), "Must use new operator!");
	if (!(this instanceof StarBase)) { console.log("Must use new operator!"); };
	this.id = id;
	this.x = x;
	this.y = y;
	this.health = health;
}

function ZylonShip(id, x, y, health)
{
	//assert ((this instanceof ZylonShip), "Must use new operator!");
	if (!(this instanceof ZylonShip)) { console.log("Must use new operator!"); };
	this.id = id;
	this.x = x;
	this.y = y;
	this.health = health;
	this.behaviour = 0;
	this.counter = 0;			// behaviour-related counter
}

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
	this.objects[id] = new ZylonShip(id, 11, 11, 100);
	id += 1;
	this.objects[id] = new ZylonShip(id, 21, 21, 100);
	id += 1;
	
	
};


/**
 * Step the game world forward by 1 tick (UPDATE_INTERVAL milliseconds)
 */
Game.prototype.updateState = function(delta) {
	/*
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

exports.Game = Game;
exports.Player = Player;
exports.ZylonShip = ZylonShip;

})(typeof global === "undefined" ? window : exports);
