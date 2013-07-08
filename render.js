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
	//this.context.fillStyle = 'black';
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

	// draw grid (keep square sector aspect ratio)
	var sx = this.canvas.width;
	var sy = (sx * Game.NUM_SECTORS_Y) / Game.NUM_SECTORS_X;

	this.drawRect(0, 0, sx, sy, 'grey', 1);
	var dx = (sx - 1) / Game.NUM_SECTORS_X;
	for (var i = 1; i < Game.NUM_SECTORS_X; i++) {
		this.drawLine(dx * i, 0, dx * i, sy, 'grey', 1);
	}
	var dy = sy / Game.NUM_SECTORS_Y;
	for (var i = 1; i < Game.NUM_SECTORS_Y; i++) {
		this.drawLine(0, dy * i, sx, dy * i, 'grey', 1);
	}
	
	var scale = sx / Game.GALAXY_RADIUS;
	for (var id in game.objects) {
		var obj = game.objects[id];
		if (obj.type == Game.PLAYERTYPEID) {
			var x = obj.x * scale;
			var y = obj.y * scale;
			var name = obj.name;
			//this.context.rect(x, y, 2, 2);
			this.drawRect(x, y, 2, 2, 'blue', 1);
			this.context.font = '8pt Calibri';
			this.context.textBaseline = "top";
			this.context.lineWidth = 1;
			this.context.fillStyle = 'blue';
			this.context.fillText(name, x, y);
		}
		else if (obj.type == Game.STARBASETYPEID) {
			var x = obj.x * scale;
			var y = obj.y * scale;
			var name = obj.name;
			//this.context.rect(x, y, 2, 2);
			this.drawRect(x, y, 3, 3, 'blue', 2);
			this.context.font = '8pt Calibri';
			this.context.textBaseline = "top";
			this.context.lineWidth = 1;
			this.context.fillStyle = 'green';
			this.context.fillText('starbase', x, y);
		}
		else if (obj.type == Game.BASESTARTYPEID) {
			var x = obj.x * scale;
			var y = obj.y * scale;
			//var name = obj.name;
			this.drawRect(x, y, 3, 3, 'red', 1);
			this.context.font = '8pt Calibri';
			this.context.textBaseline = "top";
			this.context.lineWidth = 1;
			this.context.fillStyle = 'red';
			this.context.fillText('basestar', x, y);
		}
		else if (obj.type == Game.FIGHTERTYPEID) {
			var x = obj.x * scale;
			var y = obj.y * scale;
			//var name = obj.name;
			this.drawRect(x, y, 2, 1, 'orange', 1);
			this.context.font = '8pt Calibri';
			this.context.textBaseline = "top";
			this.context.lineWidth = 1;
			this.context.fillStyle = 'orange';
			this.context.fillText('fighter', x, y);
		}
		else if (obj.type == Game.CRUISERTYPEID) {
			var x = obj.x * scale;
			var y = obj.y * scale;
			//var name = obj.name;
			this.drawRect(x, y, 3, 1, 'yellow', 2);
			this.context.font = '8pt Calibri';
			this.context.textBaseline = "top";
			this.context.lineWidth = 1;
			this.context.fillStyle = 'yellow';
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

/* REF CODE
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
*/

CanvasRenderer.prototype.drawLine = function(x1, y1, x2, y2, colour, linewidth) {
 	var ctx = this.context;
	ctx.beginPath();
	ctx.lineWidth = linewidth;
	ctx.strokeStyle = colour;
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
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
