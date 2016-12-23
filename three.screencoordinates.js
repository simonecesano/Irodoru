THREE.Object3D.prototype.screenPosition = function (camera, type) {

    var obj = this; 
    var vector = new THREE.Vector3();

    var widthHalf  = 0.5 * renderer.context.canvas.width;
    var heightHalf = 0.5 * renderer.context.canvas.height;

    obj.updateMatrixWorld();
    if (min === 'min') {
    } else if (min === 'max') {
    } else {
	vector.setFromMatrixPosition(obj.matrixWorld);
    }
    vector.project(camera);

    vector.x =   ( vector.x * widthHalf  ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return { 
        x: vector.x,
        y: vector.y
    };

};
