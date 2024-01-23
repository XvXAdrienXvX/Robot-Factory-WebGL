class Plane {
  _planeWidth;
  _planeHeight;
  _planeLength;
  _color;
  _texCoords = [
    0, 0,
    1, 0,
    1, 1,
    0, 1
  ];
  _texCoordBuffer;
  _texture;
  _textureImage;
  _setTexture;
  _textureOptions = {
    textureImg: null,
    setTexture: false,
    coords: [],
    textureID: null
  }
  _textureCoords = [

  ];
  _texCoordLoc;
  _texture0;
  _texture1;

  constructor(planeWidth, planeHeight, planeLength, color, textureOptions) {
    this._planeWidth = planeWidth;
    this._planeHeight = planeHeight;
    this._planeLength = planeLength;
    this._color = color.length < 0 ? null : color;
    this._textureOptions = textureOptions;
    this._texCoordBuffer = gl.createBuffer();
    this._texture = gl.createTexture();
    this._texture0 = gl.createTexture();
    this._texture1 = gl.createTexture();
    this._textureCoords = [
      // Top Face
      [0, 0, this._planeWidth, 0, this._planeWidth, this._planeHeight, 0, this._planeHeight],

      // Bottom Face
      [0, 0, this._planeWidth, 0, this._planeWidth, this._planeHeight, 0, this._planeHeight],

      // Front Face
      [0, 0, this._planeLength, 0, this._planeLength, this._planeHeight, 0, this._planeHeight],

      // Back Face
      [0, 0, this._planeLength, 0, this._planeLength, this._planeHeight, 0, this._planeHeight],

      // Left Face
      [0, 0, this._planeWidth, 0, this._planeWidth, this._planeHeight, 0, this._planeHeight],

      // Right Face
      [0, 0, this._planeWidth, 0, this._planeWidth, this._planeHeight, 0, this._planeHeight]
    ];

    if (this._textureOptions.setTexture) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this._texCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(this._textureCoords)), gl.STATIC_DRAW);
      this._texCoordLoc = gl.getAttribLocation(shaderProgram, 'texCoord');
      gl.bindTexture(gl.TEXTURE_2D, this._texture0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[this._textureOptions.textureID]);
      gl.generateMipmap(gl.TEXTURE_2D);
  
      gl.bindTexture(gl.TEXTURE_2D, this._texture1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[1]);
      gl.generateMipmap(gl.TEXTURE_2D)
    }

  }

  rotateZ = (theta) => {
    instanceMatrix = mult(instanceMatrix, rotateZ(theta));
  }

  rotateX = (theta) => {
    instanceMatrix = mult(instanceMatrix, rotateX(theta));
  }

  scale = () => {
    instanceMatrix = mult(instanceMatrix, scale(this._planeWidth, this._planeHeight, this._planeLength));
  }

  translate = (tx, ty, tz) => {
    instanceMatrix = mult(modelViewMatrix, translate(tx, ty * this._planeHeight, tz));
  }

  render = () => {
    if (this._color) {
      var colorUniformLocation = gl.getUniformLocation(shaderProgram, 'u_color');
      gl.uniform4fv(colorUniformLocation, Utils.setColor(this._color));
    }

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * this._planeHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(this._planeWidth, this._planeHeight, this._planeLength));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._texture0);

    const vTextureIDLocation = gl.getAttribLocation(shaderProgram, 'aTextureID');
    gl.vertexAttrib1f(vTextureIDLocation, this._textureOptions.textureID);

    for (var i = 0; i < 6; i++) {
      const offset = i * 8 * 4;
      gl.vertexAttribPointer(this._texCoordLoc, 2, gl.FLOAT, false, 0, offset);
      gl.enableVertexAttribArray(this._texCoordLoc);

      gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }

  }
}
