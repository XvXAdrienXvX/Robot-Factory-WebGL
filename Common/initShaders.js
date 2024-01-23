class InitShader {
    vertexShader;
    fragmentShader;
    gl;
    vertexSource;
    fragmentSource;
    shaderProgram;

    constructor(gl,vertexSource, fragmentSource){
      this.gl = gl;
      this.vertexSource = vertexSource;
      this.fragmentSource = fragmentSource;
      this.#createVertexShader();
      this.#createFragmentShader();
      this.shaderProgram = this.gl.createProgram();
    }

    #createVertexShader = () => {
        let vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        if (vertexShader) {       
            this._vertexShader = vertexShader;
        } 

        return this._vertexShader;
    }

    #createFragmentShader = () => {
        let fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        if (fragmentShader) {
            this._fragmentShader = fragmentShader;
        } 

        return this._fragmentShader;
    }
    
    createShaderProgram = () => {
        this.gl.shaderSource( this._vertexShader, this.vertexSource );
        this.gl.compileShader( this._vertexShader);

        if (!this.gl.getShaderParameter(this._vertexShader, this.gl.COMPILE_STATUS)){
            console.error("Error in vertex shader:  " + this.gl.getShaderInfoLog(this._vertexShader));
        }
    
        this.gl.shaderSource( this._fragmentShader, this.fragmentSource );
        this.gl.compileShader( this._fragmentShader );
        if (!this.gl.getShaderParameter(this._fragmentShader, this.gl.COMPILE_STATUS) ) {
            console.error("Error in fragment shader:  " + this.gl.getShaderInfoLog(this.fragmentSource));
        }    

        this.gl.attachShader( this.shaderProgram , this._vertexShader );
        this.gl.attachShader( this.shaderProgram , this._fragmentShader );
        this.gl.linkProgram( this.shaderProgram  );

        if (!this.gl.getProgramParameter(this.shaderProgram , this.gl.LINK_STATUS) ) {
            console.error("Link error in program:  " + this.gl.getProgramInfoLog(this.shaderProgram ));
        }

        this.gl.useProgram(this.shaderProgram );

        return this.shaderProgram;
    }
}