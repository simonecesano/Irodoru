renderer.domElement.addEventListener('mousedown', function(event) {
    // console.log({ pageX: event.pageX,
    // 		  pageY: event.pageY,
    // 		  devicePixelRatio: devicePixelRatio,
    // 		  offsetLeft: this.offsetLeft,
    // 		  offsetTop: this.offsetTop
    // 		})
    var vector = new THREE.Vector3(
          (event.pageX - this.offsetLeft) / this.width * 2 - 1,
        - (event.pageY - this.offsetTop)  / this.height * 2 + 1,
        0
    );
    // console.log(vector)
    vector.unproject(camera);
    // console.log(vector)
    var raycaster = new THREE.Raycaster(
        // camera.position,
        vector.sub(camera.position).normalize()
    );

    var intersects = raycaster.intersectObjects(obj.children);
    if (intersects.length) {
        // console.log(intersects.length);
	// console.log(intersects[0].object.id);
	var r = Math.random(); var g = Math.random(); var b = Math.random();
	var c = chroma(r * 256, g * 256, b * 256);
	intersects[0].object.material.color.setRGB (r, g, b);
    } else {
	console.log('nothing here'); console.log(vector);
    }
}, false);
