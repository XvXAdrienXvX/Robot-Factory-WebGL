class Quad {
    verticesPosition = [];
    indexArray = [];
    defaultColor;
    constructor() {
    }

     SetVertexPosition = (xPosition, yPositon, zPosition) => {
        this.verticesPosition.push(vec4(xPosition, yPositon,  zPosition, 1.0 ));
     }

     DrawFace = (firstVertex, secondVertex, thirdVertex, forthVertex) => {
        this.indexArray.push(this.verticesPosition[firstVertex]);
        this.indexArray.push(this.verticesPosition[secondVertex]);
        this.indexArray.push(this.verticesPosition[thirdVertex]);
        this.indexArray.push(this.verticesPosition[forthVertex]);
     }

    createVertexBuffer = () => {
      vBuffer = gl.createBuffer();
      gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
      gl.bufferData(gl.ARRAY_BUFFER, flatten(this.indexArray), gl.STATIC_DRAW);
    }
}