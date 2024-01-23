class Head {
    _headWidth;
    _headHeight;
    _color;
    constructor(headWidth, headHeight, color){
       this._headWidth = headWidth;
       this._headHeight = headHeight;
       this._color = color;
    }

    render = () => {
        var colorUniformLocation = gl.getUniformLocation(shaderProgram, 'u_color');
        gl.uniform4fv(colorUniformLocation, Utils.setColor(this._color));

        instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * this._headHeight, 0.0 ));
        instanceMatrix = mult(instanceMatrix, scale(this._headWidth, this._headHeight, this._headWidth) );
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
        for(let i =0; i<6; i++) {
            gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
        }
    }
}