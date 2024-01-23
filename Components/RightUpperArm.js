class RightUpperArm {
    _rightUpperArmWidth;
    _rightUpperArmHeight;
    _color;
    constructor(rightUpperArmWidth, rightUpperArmHeight, color){
       this._rightUpperArmWidth = rightUpperArmWidth;
       this._rightUpperArmHeight = rightUpperArmHeight;
       this._color = color;
    }

    render = () => {
        var colorUniformLocation = gl.getUniformLocation(shaderProgram, 'u_color');
        gl.uniform4fv(colorUniformLocation, Utils.setColor(this._color));

        instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * this._rightUpperArmHeight, 0.0) );
        instanceMatrix = mult(instanceMatrix, scale(this._rightUpperArmWidth, this._rightUpperArmHeight, this._rightUpperArmWidth) );
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
        for(var i =0; i<6; i++) {
            gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
        }
     }
}