class RightLowerArm {
    _rightLowerArmWidth;
    _rightLowerArmHeight;
    _color;
    constructor(rightLowerArmWidth, rightLowerArmHeight, color){
       this._rightLowerArmWidth = rightLowerArmWidth;
       this._rightLowerArmHeight = rightLowerArmHeight;
       this._color = color;
    }

    render = () => {
        var colorUniformLocation = gl.getUniformLocation(shaderProgram, 'u_color');
        gl.uniform4fv(colorUniformLocation, Utils.setColor(this._color));

        instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * this._rightLowerArmHeight, 0.0) );
        instanceMatrix = mult(instanceMatrix, scale(this._rightLowerArmWidth, this._rightLowerArmHeight, this._rightLowerArmWidth) );
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
        for(var i =0; i<6; i++) {
            gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
        }
     }
}