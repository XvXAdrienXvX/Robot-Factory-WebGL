const vertexSource = `
attribute   vec3 aNormal;
varying  vec4 vColor;

attribute vec4 positionVertex;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

uniform vec4 uAmbientProduct, uDiffuseProduct, uSpecularProduct;
uniform vec4 uLightPosition;
uniform float uShininess;

attribute vec2 texCoord;
varying vec2 vTexCoord;
varying float vTextureID;
attribute float aTextureID;
void main()
{
    vec3 pos = (modelViewMatrix * positionVertex).xyz;

    vec3 light = uLightPosition.xyz;
    vec3 lightVector = normalize(light - pos);


    vec3 eyeVector = normalize(-pos);
    vec3 halfwayVector = normalize(lightVector + eyeVector);

    vec4 normal = vec4(aNormal,0);

    vec3 normalizedVector = normalize((modelViewMatrix*normal).xyz);
    
    vec4 ambient = uAmbientProduct;

    float diffuseCoefficient = max(dot(lightVector, normalizedVector), 0.0);
    vec4  diffuse = diffuseCoefficient*uDiffuseProduct;

    float specularCoefficient = pow( max(dot(normalizedVector, halfwayVector), 0.0), uShininess );
    vec4  specular = specularCoefficient * uSpecularProduct;

    if( dot(lightVector, normalizedVector) < 0.0 ) {
	  specular = vec4(0.0, 0.0, 0.0, 1.0);
    }

    vColor = ambient + diffuse +specular;
    vColor.a = 1.0;
    vTexCoord = texCoord;
    vTextureID = aTextureID;
    gl_Position = projectionMatrix * viewMatrix * modelViewMatrix * positionVertex;

}
`;

const fragmentSource = `
precision mediump float;
uniform vec4 u_color;
uniform vec4 u_ambientLightColor;
varying vec4 vColor;
uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;
varying vec2 vTexCoord;
varying float vTextureID;

void main() {
    vec4 finalColor;

    if (vTextureID == 0.0) { // Texture for the floor
        vec4 texColor = texture2D(u_texture_0, vTexCoord);
        finalColor = mix(vColor, texColor, 0.8);
        gl_FragColor = u_color * finalColor;
    } else if (vTextureID == 1.0){ 
        vec4 texColor = texture2D(u_texture_1, vTexCoord);
        finalColor = mix(vColor, texColor, 0.5);
        gl_FragColor = u_color * finalColor;
    }
    else {
        gl_FragColor = u_color * vColor;
    }


}
`;

var canvas;
var gl;
var shaderProgram;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;
var vBuffer;
var numNodes = 7;
var objectFactory = new ObjectFactory();
const robot = new Robot();
const robotNPC_1 = new Robot();
const robotNPC_2 = new Robot();
const robotNPC_3 = new Robot();
const robotNPC_4 = new Robot();

const cameraTarget = vec3(0, 0, 0);
const cameraUp = vec3(0, 1.0, 0);
let radius = 10.0;
let theta = 0.5;
let phi = 1.0;
var viewMatrix;
var ambientLightIntensity;

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
var lightAmbient = 4.5;
var lightDiffuse = vec4(1.0, 1.0, 0.0, 1.0);
var lightSpecular = vec4(1.0, 0.0, 0.0, 1.0);

var materialAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 100.0;
var sceneNodes = 13;
var scene;
var planeTexture;
var conveyorBeltTexture;
var textures = [];
var images = [];
var robot_NPC_3_X = robotNPC_3.robotPosition.x;
onload = () => {
    initProgram();

    let shader = new InitShader(gl, vertexSource, fragmentSource);
    shaderProgram = shader.createShaderProgram();
    planeTexture = document.getElementById("texImage")
    conveyorBeltTexture = document.getElementById("beltImage")
    images.push(planeTexture)
    images.push(conveyorBeltTexture)
    configureTexture();
    scene = new Scene();
    const radiusSlider = document.getElementById('radius');
    const thetaSlider = document.getElementById('theta');
    const phiSlider = document.getElementById('phi');

    const ambientIntensitySlider = document.getElementById("ambientIntensitySlider");
    ambientIntensitySlider.addEventListener("input", function () {
        lightAmbient = parseFloat(this.value);
        updateAmbientLight();
    });
    radiusSlider.addEventListener('input', function () {
        radius = parseFloat(this.value);
        updateCamera();
    });

    thetaSlider.addEventListener('input', function () {
        theta = parseFloat(this.value);
        updateCamera();
    });

    phiSlider.addEventListener('input', function () {
        phi = parseFloat(this.value);
        updateCamera();
    });

    updateCamera();
    updateAmbientLight();
    let fovy = 100.0;
    let aspect = canvas.width / canvas.height;
    let near = 0.3;
    let far = 100.0;

    projectionMatrix = perspective(fovy, aspect, near, far);

    modelViewMatrix = mat4();

    let diffuseProduct = mult(lightDiffuse, materialDiffuse);
    let specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(shaderProgram, "uDiffuseProduct"), diffuseProduct);
    gl.uniform4fv(gl.getUniformLocation(shaderProgram, "uSpecularProduct"), specularProduct);
    gl.uniform4fv(gl.getUniformLocation(shaderProgram, "uLightPosition"), lightPosition);

    gl.uniform1f(gl.getUniformLocation(shaderProgram, "uShininess"), materialShininess);

    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "modelViewMatrix"), false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "projectionMatrix"), false, flatten(projectionMatrix));

    modelViewMatrixLoc = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
    objectFactory.createCube();

    let normalLoc = gl.getAttribLocation(shaderProgram, "aNormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    let positionLoc = gl.getAttribLocation(shaderProgram, "positionVertex");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    addEventListeners();
    handleKeyDown();
    robot.robotPosition = {
        x: 0.0,
        y: -5.5,
        z: 0.0
    }
    robotNPC_3.robotPosition = {
        x: -3.5,
        y: -5.5,
        z: -2.0
    };
    for (i = 0; i < sceneNodes; i++) {
        scene.createNodes(i);
    }
    for (i = 0; i < numNodes; i++) {
        robot.createNodes(i);
    }

    for (i = 0; i < numNodes; i++) {
        robotNPC_1.createNodes(i);
    }
    for (i = 0; i < numNodes; i++) {
        robotNPC_2.createNodes(i);
    }
    for (i = 0; i < numNodes; i++) {
        robotNPC_3.createNodes(i);
    }
    for (i = 0; i < numNodes; i++) {
        robotNPC_4.createNodes(i);
    }
    setNPCRotation(robotNPC_1);
    animateTorso(robotNPC_1);

    setNPCRotation(robotNPC_2);
    animateTorso(robotNPC_2);

    setNPCRotation(robotNPC_3);

    moveRobotNPC(() => {
        animateTorso(robotNPC_3);
    });
    animateConveyorBelt();


    scene.render();

}
const initProgram = () => {
    console.log("Initializing Program...")
    let options = {
        alpha: false,
        depth: false,
        preserveDrawingBuffer: true
    };
    canvas = document.getElementById("webglcanvas");
    if (canvas) {
        gl = canvas.getContext("webgl2", options);
    }

    if (!gl) {
        gl = canvas.getContext("experimental-webgl");
    }

    drawCanvas();
}

const drawCanvas = () => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.DEPTH_BUFFER_BIT);
}


animateLeftUpperArm = (npc) => {
    const amplitude = 40;
    const frequency = 2.0;

    const animate = (timestamp) => {
        const angle = amplitude * Math.sin(frequency * timestamp * 0.001); // using 0.001 to convert to seconds
        const leftUpperArm_NPC_1_Id = npc.leftUpperArmId;
        const degreeOfFreedom = npc.theta;
        degreeOfFreedom[leftUpperArm_NPC_1_Id] = angle;
        npc.createNodes(leftUpperArm_NPC_1_Id);

        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
}

animateRightUpperArm = (npc) => {
    const amplitude = 40;
    const frequency = 2.0;

    const animate = (timestamp) => {
        const angle = amplitude * Math.sin(frequency * timestamp * 0.001);
        const rightUpperArm_NPC_1_Id = npc.rightUpperArmId;
        const degreeOfFreedom = npc.theta;
        degreeOfFreedom[rightUpperArm_NPC_1_Id] = angle;
        npc.createNodes(rightUpperArm_NPC_1_Id);

        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
}

animateTorso = (npc) => {
    const amplitude = 90; // Rotate by 90 degrees
    const frequency = 1.0; // Adjust the speed of rotation

    let reverse = false; // control forward and backward rotation

    const animate = (timestamp) => {
        const angle = reverse
            ? amplitude * (1 - Math.cos(frequency * timestamp * 0.001)) // Backward rotation
            : amplitude * Math.cos(frequency * timestamp * 0.001); // Forward rotation

        const torsoId = npc.torsoId;
        const degreeOfFreedom = npc.theta;
        degreeOfFreedom[torsoId] = angle;
        npc.createNodes(torsoId);

        if (angle >= amplitude) {
            reverse = !reverse; // Reverse rotation direction when reaching the target angle
        }

        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
}

const setNPCRotation = (npc) => {
    let degreeOfFreedom = npc.theta;
    let torso_NPC_1_Id = npc.torsoId;
    let leftUpperArm_NPC_1_Id = npc.leftUpperArmId;
    let rightUpperArm_NPC_1_Id = npc.rightUpperArmId;
    degreeOfFreedom[torso_NPC_1_Id] = -90
    npc.createNodes(torso_NPC_1_Id);

    degreeOfFreedom[leftUpperArm_NPC_1_Id] = -90
    npc.createNodes(leftUpperArm_NPC_1_Id);

    degreeOfFreedom[rightUpperArm_NPC_1_Id] = -90
    npc.createNodes(rightUpperArm_NPC_1_Id);
}

updateCamera = () => {
    const eye = vec3(
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
    );

    const viewMatrix = lookAt(eye, cameraTarget, cameraUp);

    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "viewMatrix"), false, flatten(viewMatrix));
}

updateAmbientLight = () => {
    var ambientProduct = mult(lightAmbient, materialAmbient);
    gl.uniform4fv(gl.getUniformLocation(shaderProgram, "uAmbientProduct"), ambientProduct);
}

const addEventListeners = () => {
    let degreeOfFreedom = robot.theta;
    let _torsoId = robot.torsoId;
    let _head1Id = robot.head1Id;
    let _head2Id = robot.head2Id;
    let _baseId = robot.baseId;
    let _leftUpperArmId = robot.leftUpperArmId;
    let _leftLowerArmId = robot.leftLowerArmId;
    let _rightUpperArmId = robot.rightUpperArmId;
    let _rightLowerArmId = robot.rightLowerArmId;

    document.getElementById("slider0").onchange = function (event) {
        degreeOfFreedom[_torsoId] = event.target.value;
        robot.createNodes(_torsoId);
    };
    document.getElementById("slider1").onchange = function (event) {
        degreeOfFreedom[_head1Id] = event.target.value;
        robot.createNodes(_head1Id);
    };

    document.getElementById("slider2").onchange = function (event) {
        degreeOfFreedom[_leftUpperArmId] = event.target.value;
        robot.createNodes(_leftUpperArmId);
    };
    document.getElementById("slider3").onchange = function (event) {
        degreeOfFreedom[_leftLowerArmId] = event.target.value;
        robot.createNodes(_leftLowerArmId);
    };

    document.getElementById("slider4").onchange = function (event) {
        degreeOfFreedom[_rightUpperArmId] = event.target.value;
        robot.createNodes(_rightUpperArmId);
    };
    document.getElementById("slider5").onchange = function (event) {
        degreeOfFreedom[_rightLowerArmId] = event.target.value;
        robot.createNodes(_rightLowerArmId);
    };
    document.getElementById("slider6").onchange = function (event) {
        degreeOfFreedom[_baseId] = event.target.value;
        robot.createNodes(_baseId);
    };
    document.getElementById("slider10").onchange = function (event) {
        degreeOfFreedom[_head2Id] = event.target.value;
        robot.createNodes(_head2Id);
    };

}

const handleKeyDown = () => {
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'w':
                // Move forward (positive Z direction)
                updateRobotPosition(0, 0.1);
                break;
            case 's':
                // Move backward (negative Z direction)
                updateRobotPosition(0, -0.1);
                break;
            case 'a':
                // Move left (negative X direction)
                updateRobotPosition(-0.1, 0);
                break;
            case 'd':
                // Move right (positive X direction)
                updateRobotPosition(0.1, 0);
                break;
        }
    });

}

const updateRobotPosition = (dx, dz) => {
    let xPosition = robot.robotPosition.x;
    let zPosition = robot.robotPosition.z;
    let _robotId = scene.robotId;
    let baseWidth = robot.baseWidth;
    const newX = xPosition + dx;
    const newZ = zPosition + dz;

    const planeWidth = 25;
    const planeLength = 25;

    const robotWidth = baseWidth;
    const robotLength = baseWidth;

    if (
        newX + robotWidth / 2 <= planeWidth / 2 &&
        newX - robotWidth / 2 >= -planeWidth / 2 &&
        newZ + robotLength / 2 <= planeLength / 2 &&
        newZ - robotLength / 2 >= -planeLength / 2
    ) {
        robot.robotPosition.x = newX;
        robot.robotPosition.z = newZ;
        scene.createNodes(_robotId);
    }
}

animateConveyorBelt = () => {
    const maxDistance = 4.0; // Length of the conveyor belt
    const speed = 0.3; // Speed

    let positionZ = 0.0;
    let direction = 1;

    const animate = () => {
        positionZ += direction * speed;
        scene.prop_1_Position.z = positionZ;
        scene.prop_2_Position.z = positionZ;
        scene.prop_3_Position.z = positionZ;
        scene.prop_4_Position.z = positionZ;

        if (positionZ >= maxDistance || positionZ <= 0) {
            direction *= -1; // reverse direction
        }

        const prop_1_Id = scene.prop_1_Id;
        const prop_2_Id = scene.prop_2_Id;
        const prop_3_Id = scene.prop_3_Id;
        const prop_4_Id = scene.prop_4_Id;
        const transformationMatrix = translate(scene.prop_1_Position.x, scene.prop_1_Position.y, scene.prop_1_Position.z);
        scene.scene[prop_1_Id].transform = transformationMatrix;

        scene.createNodes(prop_1_Id);

        const transformationMatrix_prop_2 = translate(scene.prop_2_Position.x, scene.prop_2_Position.y, scene.prop_2_Position.z);
        scene.scene[prop_2_Id].transform = transformationMatrix_prop_2;

        scene.createNodes(prop_2_Id);

        const transformationMatrix_prop_3 = translate(scene.prop_3_Position.x, scene.prop_3_Position.y, scene.prop_3_Position.z);
        scene.scene[prop_3_Id].transform = transformationMatrix_prop_3;

        scene.createNodes(prop_3_Id);

        const transformationMatrix_prop_4 = translate(scene.prop_4_Position.x, scene.prop_4_Position.y, scene.prop_4_Position.z);
        scene.scene[prop_4_Id].transform = transformationMatrix_prop_4;

        scene.createNodes(prop_4_Id);

        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
}

configureTexture = () => {
    for (let i = 0; i < 2; i++) {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);

        textures.push(texture);
    }
}

const moveRobotNPC = (nextAnimation) => {
    let maxDistance = robotNPC_3.robotPosition.x + 5; 
    let speed = 1.0;

    let reverse = false;
    let currentX = robotNPC_3.robotPosition.x;
    let planeWidth = scene.floor._planeWidth;

    let animate = (timestamp) => {
        const distanceTravelled = reverse
            ? (maxDistance - robotNPC_3.robotPosition.x) * (1 - Math.cos(speed * timestamp * 0.001)) // left
            : maxDistance * Math.cos(speed * timestamp * 0.001); // right

        let newX = currentX + distanceTravelled;

        if (newX + robotNPC_3.baseWidth / 2 <= planeWidth / 2) {
            robotNPC_3.robotPosition.x = newX;
            nextAnimation();
        } 
        else 
        {
            reverse = !reverse;
        }

        scene.createNodes(scene.robotNPC_3_Id);

        if (distanceTravelled >= maxDistance ) {
            reverse = !reverse;
        }

        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
};
