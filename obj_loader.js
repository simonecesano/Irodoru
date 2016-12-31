// $(function(){
var clock = new THREE.Clock();
var delta = clock.getDelta(); // seconds.
var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
var container, stats;

var camera, scene, renderer, look_at, controls;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var height_factor = 0.7;

var r_width  = $('#renderer').width();
var r_height = window.innerHeight * height_factor;

var xyz = ["x", "y", "z"];
var colors = [];
console.log($("#color_template").html());
var color_template = Handlebars.compile($("#color_template").html());
console.log(color_template);

$('#scale').val(200)

init();
animate();

function init() {
    // container
    container = document.createElement( 'div' );
    $('#renderer').append( container );

    // camera
    camera = new THREE.PerspectiveCamera( 45, r_width / r_height, 1, 2000 );
    camera.position.z = 600;
    camera_pos = camera.position;

    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.0;
    controls.panSpeed = 1.0;
    
    // scene
    scene = new THREE.Scene();
    
    var ambient = new THREE.AmbientLight( 0x101030 );
    ambient.shadowDarkness = 0
    scene.add( ambient );
    
    var directionalLight = new THREE.DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, 1 );
    directionalLight.shadowDarkness = 0
    scene.add( directionalLight );
    
    // texture
    var material = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
    
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
	console.log( item, loaded, total );
    };
    
    // model
    var loader = new THREE.OBJLoader( manager );
    var file = './Superstar/Superstar.obj';

    loader.load( file , function ( object ) {
	var count = 0;
	object.traverse( function ( child ) {
	    // count++;
	    if ( child instanceof THREE.Mesh ) {
		child.material = material.clone();
		// console.log(child.uuid)
		var r = Math.random(); var g = Math.random(); var b = Math.random();
		var c = chroma(r * 256, g * 256, b * 256);
		colors.push({ uuid: child.uuid, hex: c.hex(), id: child.id });
		child.material.color.setRGB (r, g, b);
		count++;
	    }
	} );
	$('#count').html(count)
	$('#colors').html(color_template({ 'colors': colors }));
	$('.swatch').on('click', function(e){
	    var r = Math.random(); var g = Math.random(); var b = Math.random();
	    var c = chroma(r * 256, g * 256, b * 256);
	    // colors.push({ uuid: child.uuid, hex: c.hex(), id: child.id });
	    // child.material.color.setRGB (r, g, b);
	    console.log($(this).data('id'));
	    var c = chroma(r * 256, g * 256, b * 256);
	    $(this).css('background-color', c.hex());
	    scene.getObjectById($(this).data('id')).material.color.setRGB (r, g, b);
	})

        object.scale.x = 600;
        object.scale.y = 600;
        object.scale.z = 600;
        obj = object
	scene.add( obj );
	var geometry = new THREE.Geometry();
	var box = new THREE.Box3().setFromObject( obj );
	geometry.vertices.push(box.min, box.max);
	look_at = scene.position;
	// render();
	// console.log(renderer.domElement)
    } );
    
    var j = 0;
    if (j === 0) {
    	renderer = new THREE.WebGLRenderer();
    	renderer.setSize( r_width, r_height );
	console.log(renderer );
    	console.log(renderer.domElement );
    } else if (j === 1) {
	console.log('here');
	renderer = new THREE.SVGRenderer();
	renderer.shadowMapEnabled = false;
	renderer.shadowMapSoft = false;
	console.log( renderer );
	renderer.setSize( r_width, r_height );
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setQuality( 'low' );
	console.log(renderer.domElement );
    } else if (j === 2){
    	renderer = new THREE.CanvasRenderer();
	console.log( renderer );
    	renderer.setClearColor( 0xf0f0f0 );
    	renderer.setPixelRatio( window.devicePixelRatio );
    	renderer.setSize( r_width, r_height );
    }

    console.log('-----------------------------------');
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    r_width  = $('#renderer').width();
    r_height = window.innerHeight * height_factor;
    
    camera.aspect = r_width / r_height;
    camera.updateProjectionMatrix();
    
    renderer.setSize( r_width, r_height );
}

function animate_once(){
    requestAnimationFrame( animate );
    render();
    console.log(container)
}

function animate() {
    setTimeout( function() {
        requestAnimationFrame( animate );
    }, 1000 * 0.01 );
    render();
}

function render() {
    _.chain(xyz).each(function(e, i){
	obj.scale[e] = parseFloat($('#scale').val());
    })

    obj.rotation.y = 90 * Math.PI / 180;
    
    obj.translateX(parseFloat($('#translate_x').val()));
    obj.translateY(parseFloat($('#translate_y').val()));
    obj.translateZ(parseFloat($('#translate_z').val()));
    
    var box = new THREE.Box3().setFromObject( obj );

    // var screen = obj.screenPosition(camera, 'min');
    var look_at_now = {};
    
    _.chain(xyz).map(function(e, i){
	$('#min .' + e).html(Math.round(100 * box.min[e]) / 100);
	$('#max .' + e).html(Math.round(100 * box.max[e]) / 100);
	$('#getSize .' + e).html(Math.round(100 * box.getSize()[e]) / 100);
	// $('#screen .' + e).html(Math.round(100 * screen[e]) / 100);

	camera.position[e] = parseFloat($('#camera_' + e).val() || '0');
	$('#camera_pos .' + e).html(Math.round(100 * camera.position[e]) / 100);

	camera.position[e] = parseFloat($('#camera_' + e).val() || '0');
	
	look_at_now[e] = look_at[e] + parseFloat($('#look_at_' + e).val() || '0');
    })


    camera.lookAt( look_at_now );
    renderer.render( scene, camera );
    // console.log(colors);
}


// })
