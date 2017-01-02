var idw = new Iredaware(scene);

renderer.domElement.addEventListener('mousedown', function(event) {
    console.log(event);

    
    var vector = new THREE.Vector3(
          (event.pageX - this.offsetLeft) / this.width * 2 - 1,
        - (event.pageY - this.offsetTop)  / this.height * 2 + 1,
        0
    );
    vector.unproject(camera);
    var raycaster = new THREE.Raycaster(
        camera.position,
        vector.sub(camera.position).normalize()
    );

    var intersects = raycaster.intersectObjects(obj.children);
    if (intersects.length) {
	var r = Math.random(); var g = Math.random(); var b = Math.random();
	var c = chroma(r * 256, g * 256, b * 256);
	intersects[0].object.material.color.setRGB (r, g, b);
	console.log(intersects[0].object.id)
	idw.toggleSelect(intersects[0].object.id, event.shiftKey);
	console.log(idw);
    } else {
	console.log('nothing here'); console.log(vector);
    }
}, false);

function objectAtClick(event) {
}
