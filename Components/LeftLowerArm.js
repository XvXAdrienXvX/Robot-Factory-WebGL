class LeftLowerArm {
    _leftLowerArmWidth;
    _leftLowerArmHeight;
    _color;
    constructor(leftLowerArmWidth, leftLowerArmHeight, color){
       this._leftLowerArmWidth = leftLowerArmWidth;
       this._leftLowerArmHeight = leftLowerArmHeight;
       this._color = color;
    }

    render = () => {
        var colorUniformLocation = gl.getUniformLocation(shaderProgram, 'u_color');
        gl.uniform4fv(colorUniformLocation, Utils.setColor(this._color));

        instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * this._leftLowerArmHeight, 0.0) );
        instanceMatrix = mult(instanceMatrix, scale(this._leftLowerArmWidth, this._leftLowerArmHeight, this._leftLowerArmWidth) );
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
        for(var i =0; i<6; i++) {
            gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
        }
     }
}