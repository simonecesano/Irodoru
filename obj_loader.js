var clock = new THREE.Clock();
var delta = clock.getDelta(); // seconds.
var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
var container, stats;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2.5;
var windowHalfY = window.innerHeight / 2.5;
var height_factor = 0.7;

var camera_position = {};
var directionalLight = new THREE.DirectionalLight( 0xffeedd );

var xyz = ["x", "y", "z"]

init();
animate();


function init() {
    container = document.createElement( 'div' );
    $('#renderer').append( container );
    console.log([$('#renderer').width(), $('#renderer').height() ])

    var aspect = $('#renderer').width() / (window.innerHeight * height_factor);
    if (1) {
	camera = new THREE.PerspectiveCamera( 45, aspect, 1, 200 );
    } else {
	var d = 20;
	camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
    }
    // scene
    scene = new THREE.Scene();
    var ambient = new THREE.AmbientLight( 0x101030 );
    scene.add( ambient );
    
    directionalLight.position.set( 0, 0, 100 );
    scene.add( directionalLight );
    
    // texture
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
	console.log( 'on progress total' );
	console.log( item, loaded, total );
    };
    
    // model
    var loader = new THREE.OBJLoader( manager );
    var count = 0;
    loader.load( './Superstar/Superstar.obj', function ( object ) {
	object.traverse( function ( child ) {
	    if ( child instanceof THREE.Mesh ) {
		$('#uuid').html(child.uuid);
		$('#count').html(++count);
	    }
	} );
	
	object.scale.x = 200;
	object.scale.y = 200;
	object.scale.z = 200;

        obj = object
	scene.add( obj );

	var box = new THREE.Box3().setFromObject( object );
	
	$('#min').html(_.chain(xyz).map(function(e, i){ return Math.round(100 * box.min[e]) / 100 } ).value().join(" | ") );
	$('#max').html(_.chain(xyz).map(function(e, i){ return Math.round(100 * box.max[e]) / 100 } ).value().join(" | ") );
	$('#getsize').html(_.chain(xyz).map(function(e, i){ return Math.round(100 * box.getSize()[e]) / 100 } ).value().join(" | ") );

	_.each(xyz, function(e, i){
	    camera.position[e] = box.min[e] + box.getSize()[e] / 2 + parseFloat($('#camera_' + e).val());
	})
    } );
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( $('#renderer').width(), window.innerHeight * height_factor );
    container.appendChild( renderer.domElement );
    
    window.addEventListener( 'resize', onWindowResize, false );
    
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize( $('#renderer').width(), window.innerHeight * height_factor );
}

function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    var scale = $('#scale').val();
    var box = new THREE.Box3().setFromObject( obj );

    obj.translateX(parseFloat($('#translate_x').val()));
    obj.translateY(parseFloat($('#translate_y').val()));
    obj.translateZ(parseFloat($('#translate_z').val()));

    _.each(xyz, function(e, i){
	obj.scale[e]       = scale || 100;
	obj.rotation[e]    = parseFloat($('#rotation_' + e).val()) * Math.PI / 180;
	// camera.position[e] = box.min[e] + box.getSize()[e] / 2 + parseFloat($('#camera_' + e).val());
    })
    
    
    // camera.lookAt(obj.position)

    directionalLight.position.set(parseFloat($('#light_x').val()), parseFloat($('#light_y').val()), parseFloat($('#light_z').val()))
    
    camera.lookAt(scene.position)
    renderer.render( scene, camera );
}


$(function(){
    $('input').change(function(){
	$('#min').html(_.chain(xyz).map(function(e, i){ return Math.round(100 * box.min[e]) / 100 } ).value().join(" | ") );
	$('#max').html(_.chain(xyz).map(function(e, i){ return Math.round(100 * box.max[e]) / 100 } ).value().join(" | ") );
	$('#getsize').html(_.chain(xyz).map(function(e, i){ return Math.round(100 * box.getSize()[e]) / 100 } ).value().join(" | ") );
    })
})
