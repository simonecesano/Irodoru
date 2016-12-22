var clock = new THREE.Clock();
var delta = clock.getDelta(); // seconds.
var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
var container, stats;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var height_factor = 0.7;

var r_width  = $('#renderer').width();
var r_height = window.innerHeight * height_factor;

var xyz = ["x", "y", "z"];

init();
animate();


function init() {
    // container
    container = document.createElement( 'div' );
    $('#renderer').append( container );

    // camera
    camera = new THREE.PerspectiveCamera( 45, r_width / r_height, 1, 2000 );
    camera.position.z = 600;
    
    // scene
    scene = new THREE.Scene();
    
    var ambient = new THREE.AmbientLight( 0x101030 );
    scene.add( ambient );
    
    var directionalLight = new THREE.DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, 1 );
    scene.add( directionalLight );
    
    // texture
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
	console.log( item, loaded, total );
    };
    
    // model
    var loader = new THREE.OBJLoader( manager );
    loader.load( './Superstar/Superstar.obj', function ( object ) {
	object.traverse( function ( child ) {
	    if ( child instanceof THREE.Mesh ) {
		//child.material.map = texture;
	    }
	} );
	
	object.rotation.y = 90 * Math.PI / 180;

        object.scale.x = 600;
        object.scale.y = 600;
        object.scale.z = 600;
        obj = object
	scene.add( obj );
	
    } );
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( r_width, r_height );
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

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    camera.lookAt( scene.position );
    renderer.render( scene, camera );

    obj.translateX(parseFloat($('#translate_x').val()));
    obj.translateY(parseFloat($('#translate_y').val()));
    obj.translateZ(parseFloat($('#translate_z').val()));
    
    var box = new THREE.Box3().setFromObject( obj );

    $('#min').html(_.chain(xyz).map(function(e, i){ return Math.round(100 * box.min[e]) / 100 } ).value().join(" | ") );
    $('#max').html(_.chain(xyz).map(function(e, i){ return Math.round(100 * box.max[e]) / 100 } ).value().join(" | ") );
    $('#getsize').html(_.chain(xyz).map(function(e, i){ return Math.round(100 * box.getSize()[e]) / 100 } ).value().join(" | ") );
    
    $('#getsize').html(_.chain(xyz).map(function(e, i){ return Math.round(100 * box.getSize()[e]) / 100 } ).value().join(" | ") );
}


$(function(){
    $('input').change(function(){


	var box = new THREE.Box3().setFromObject( obj );


	
    })
})
