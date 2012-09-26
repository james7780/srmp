(function(exports) {
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

/**
 * Canvas-based renderer
 */
var CanvasRenderer = function(game) {
  this.game = game;
  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');
};

CanvasRenderer.prototype.render = function() {
	var sx = this.canvas.width;
	var sy = this.canvas.height;
	
 	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	for (var id in game.objects) {
		var obj = game.objects[id];
		if (obj.type == "player") {
			var x = obj.x * sx / Game.GALAXY_RADIUS;
			var y = obj.y * sy / Game.GALAXY_RADIUS;;
			var name = obj.name;
			//this.context.rect(x, y, 2, 2);
			this.drawRect(x, y, 2, 2, 'blue', 1);
			this.context.font = '8pt Calibri';
			this.context.textBaseline = "top";
			this.context.lineWidth = 1;
			this.context.fillStyle = 'blue';
			this.context.fillText(name, x, y);
		}
		else if (obj.type == "starbase") {
			var x = obj.x * sx / Game.GALAXY_RADIUS;
			var y = obj.y * sy / Game.GALAXY_RADIUS;;
			var name = obj.name;
			//this.context.rect(x, y, 2, 2);
			this.drawRect(x, y, 3, 3, 'blue', 2);
			this.context.font = '8pt Calibri';
			this.context.textBaseline = "top";
			this.context.lineWidth = 1;
			this.context.fillStyle = 'green';
			this.context.fillText('starbase', x, y);
		}
		else if (obj.type == "basestar") {
			var x = obj.x * sx / Game.GALAXY_RADIUS;
			var y = obj.y * sy / Game.GALAXY_RADIUS;;
			//var name = obj.name;
			this.drawRect(x, y, 3, 3, 'red', 1);
			this.context.font = '8pt Calibri';
			this.context.textBaseline = "top";
			this.context.lineWidth = 1;
			this.context.fillStyle = 'red';
			this.context.fillText('basestar', x, y);
		}
		else if (obj.type == "fighter") {
			var x = obj.x * sx / Game.GALAXY_RADIUS;
			var y = obj.y * sy / Game.GALAXY_RADIUS;;
			//var name = obj.name;
			this.drawRect(x, y, 2, 1, 'red', 1);
			this.context.font = '8pt Calibri';
			this.context.textBaseline = "top";
			this.context.lineWidth = 1;
			this.context.fillStyle = 'red';
			this.context.fillText('fighter', x, y);
		}
		else if (obj.type == "cruiser") {
			var x = obj.x * sx / Game.GALAXY_RADIUS;
			var y = obj.y * sy / Game.GALAXY_RADIUS;;
			//var name = obj.name;
			this.drawRect(x, y, 3, 1, 'red', 2);
			this.context.font = '8pt Calibri';
			this.context.textBaseline = "top";
			this.context.lineWidth = 1;
			this.context.fillStyle = 'red';
			this.context.fillText('cruiser', x, y);
		}
	}	// next object
	
	
	

/*
  var objects = this.game.state.objects;
  // Render the game state
  for (var i in objects) {
    var o = objects[i];
    if (o.dead) {
      // TODO: render animation.
      if (o.type == 'player') {
        console.log('player', o.id, 'died');
      }
    }
    if (o.r > 0) {
      this.renderObject_(o);
    }
  }

	// what does this do? set up a callback to render itself using a timer???
  var ctx = this;
  requestAnimFrame(function() {
    ctx.render.call(ctx);
  });
*/

};

CanvasRenderer.prototype.renderObject_ = function(obj) {
  var ctx = this.context;
  ctx.fillStyle = (obj.type == "player" ? 'green' : 'red');
  ctx.beginPath();
  ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI, true);
  ctx.closePath();
  ctx.fill();
  if (obj.type == 'player') {
    ctx.font = "8pt monospace";
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(obj.id, obj.x, obj.y);
  }

};

CanvasRenderer.prototype.drawRect = function(x, y, w, h, colour, linewidth) {
 	var ctx = this.context;
	ctx.beginPath();
	ctx.lineWidth = linewidth;
	ctx.strokeStyle = colour;
	ctx.rect(x, y, w, h);
	ctx.stroke();
};


exports.Renderer = CanvasRenderer;

})(window);
