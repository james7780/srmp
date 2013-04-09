// Three.js / WebGL renderer
//
// JH - For testing ThreeJS output

function testThreeJSRenderer(container) {
	// set the scene size
	var WIDTH = 400,
	    HEIGHT = 300;
	
	// set some camera attributes
	var VIEW_ANGLE = 45,
	    ASPECT = WIDTH / HEIGHT,
	    NEAR = 0.1,
	    FAR = 10000;
	
	// get the DOM element to attach to
	//var container = document.getElementById('threeJSContainer');
	
	// create a WebGL renderer, camera
	// and a scene
	var scene = new THREE.Scene();
	
	var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	
	var renderer = new THREE.WebGLRenderer();		// or THREE.CanvasRenderer() if no webgl
	
	// the camera starts at 0,0,0 so pull it back
	camera.position.z = 300;
	
	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);
	
	// attach the render-supplied DOM element
	container.appendChild(renderer.domElement);
	
	// create the sphere's material
	var sphereMaterial = new THREE.MeshLambertMaterial(
	{
	    color: 0xCC0000
	});
	
	// create a new mesh with sphere geometry -
	// we will cover the sphereMaterial next!
	for (var i = 0; i < 10; i++) {
		// set up the sphere vars
		var radius = 5, segments = 16, rings = 16;
	
		var sphere = new THREE.Mesh(
		   new THREE.SphereGeometry(radius, segments, rings),
		   sphereMaterial);
	
		sphere.position.set(Math.random() * WIDTH - WIDTH/2, Math.random() * HEIGHT - HEIGHT/2, 0);
		
		// add the sphere to the scene
		scene.add(sphere);
		}
	
	// and the camera
	scene.add(camera);
	
	// create a point light
	var pointLight = new THREE.PointLight( 0xFFFFFF );
	
	// set its position
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;
	
	// add to the scene
	scene.add(pointLight);
	
	// draw!
	renderer.render(scene, camera);
}

