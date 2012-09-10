/*
	Star Raiders Multiplayer - Game world data
	Copyright James Higgs 2012

	- Game world data, rules and functions
*/

// namespace?


// objects
function player(name, x, y)
{
	assert ((this instanceof player), "Must use new operator!");
	this.name = name;
	this.x = x;
	this.y = y;
	this.fuel = 100;		// SR "energy max" = 9999
	this.shield = 100;
	this.damage = "";		// ascii mask for damaged components (eg: C for computer, L for long-range scan, etc)

	// Test
	player.prototype.updatePlayer = function () {
		alert("updatPlayer, player name = ", this.name);
	}
}

function starBase(x, y, health)
{
	this.x = x;
	this.y = y;
	this.health = health;
}