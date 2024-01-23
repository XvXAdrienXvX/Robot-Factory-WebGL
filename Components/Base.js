class Base {
    _baseWidth;
    _baseHeight;
    _color;
    constructor(baseWidth, baseHeight, color){
       this._baseWidth = baseWidth;
       this._baseHeight = baseHeight;
       this._color = color;
    }

    render = () => {
        var colorUniformLocation = gl.getUniformLocation(shaderProgram, 'u_color');
        gl.uniform4fv(colorUniformLocation, Utils.setColor(this._color));
    
        instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*this._baseHeight, 0.0) );
        instanceMatrix = mult(instanceMatrix, scale(this._baseWidth, this._baseHeight,  this._baseWidth));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
        for(var i =0; i<6; i++) {
         gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
        }
     }
}