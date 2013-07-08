// Three.js / WebGL renderer
//
// JH - For testing ThreeJS output

(function(exports) {
	
/**
 * ThreeJS-based 3D renderer
 */
var ThreeJSRenderer = function(game) {
  this.game = game;
  this.container = document.getElementById('threeJSContainer');
  //this.context = this.canvas.getContext('2d');
  this.scene = null;
  this.camera = null;
  this.renderer = null;
  this.init();
};

// defines (magic numbers)
ThreeJSRenderer.WIDTH = 400;
ThreeJSRenderer.HEIGHT = 300;
ThreeJSRenderer.VIEW_ANGLE = 45;
ThreeJSRenderer.ASPECT = ThreeJSRenderer.WIDTH / ThreeJSRenderer.HEIGHT;
ThreeJSRenderer.NEAR = 0.1;
ThreeJSRenderer.FAR = 10000;

/// Setup the 3D renderer
ThreeJSRenderer.prototype.init = function() {
	// get the DOM element to attach to
	//var container = document.getElementById('threeJSContainer');
	
	// create a WebGL renderer, camera
	// and a scene
	this.scene = new THREE.Scene();
	
	this.camera = new THREE.PerspectiveCamera(ThreeJSRenderer.VIEW_ANGLE, ThreeJSRenderer.ASPECT, ThreeJSRenderer.NEAR, ThreeJSRenderer.FAR);
	
	this.renderer = new THREE.WebGLRenderer();		// or THREE.CanvasRenderer() if no webgl
	
	// the camera starts at 0,0,0 so pull it back
	this.camera.position.z = 300;
	
	// start the renderer
	this.renderer.setSize(ThreeJSRenderer.WIDTH, ThreeJSRenderer.HEIGHT);
	
	// attach the render-supplied DOM element
	//container.appendChild(renderer.domElement);
	this.container.appendChild(this.renderer.domElement);
	
	// and the camera
	this.scene.add(this.camera);
	
	// create a point light
	var pointLight = new THREE.PointLight( 0xFFFFFF );
	
	// set its position
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;
	
	// add to the scene
	this.scene.add(pointLight);
}


/// Render current game scene
ThreeJSRenderer.prototype.render = function() {
	// create a new mesh with sphere geometry -
	// we will cover the sphereMaterial next!
		// create the sphere's material
	var sphereMaterial = new THREE.MeshLambertMaterial(
	{
	    color: 0xCC0000
	});
	
	for (var i = 0; i < 10; i++) {
		// set up the sphere vars
		var radius = 5, segments = 16, rings = 16;
	
		var sphere = new THREE.Mesh(
		   new THREE.SphereGeometry(radius, segments, rings),
		   sphereMaterial);
	
		sphere.position.set(Math.random() * ThreeJSRenderer.WIDTH - ThreeJSRenderer.WIDTH/2, Math.random() * ThreeJSRenderer.HEIGHT - ThreeJSRenderer.HEIGHT/2, 0);
		
		// add the sphere to the scene
		this.scene.add(sphere);
		}

	// draw!
	this.renderer.setClearColorHex(0x000000, 1.0);
	this.renderer.render(this.scene, this.camera);
}

exports.Renderer3D = ThreeJSRenderer;

})(window);