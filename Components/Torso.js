class Torso {
    _torsoWidth;
    _torsoHeight;
    _color;
    constructor(torsoWidth, torsoHeight, color){
       this._torsoWidth = torsoWidth;
       this._torsoHeight = torsoHeight;
       this._color = color;
    }

    render = () => {
        var colorUniformLocation = gl.getUniformLocation(shaderProgram, 'u_color');
        gl.uniform4fv(colorUniformLocation, Utils.setColor(this._color));
    
        instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*this._torsoHeight, 0.0) );
        instanceMatrix = mult(instanceMatrix, scale(this._torsoWidth, this._torsoHeight,  this._torsoWidth));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
        for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}