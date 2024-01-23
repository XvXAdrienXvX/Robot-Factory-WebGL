class LeftUpperArm {
    _leftUpperArmWidth;
    _leftUpperArmHeight;
    _color;
    constructor(leftUpperArmWidth, leftUpperArmHeight, color){
       this._leftUpperArmWidth = leftUpperArmWidth;
       this._leftUpperArmHeight = leftUpperArmHeight;
       this._color = color;
    }

    render = () => {
        var colorUniformLocation = gl.getUniformLocation(shaderProgram, 'u_color');
        gl.uniform4fv(colorUniformLocation, Utils.setColor(this._color));

        instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * this._leftUpperArmHeight, 0.0) );
        instanceMatrix = mult(instanceMatrix, scale(this._leftUpperArmWidth, this._leftUpperArmHeight, this._leftUpperArmWidth) );
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
        for(var i =0; i<6; i++) {
            gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
        }
     }
}