class Scene {
    sceneId = 0;
    floorId = 1;
    wallId = 2;
    rearwallId = 3;
    robotId = 4;
    conveyorBeltId = 5;
    robotNPC_1_Id = 6;
    robotNPC_2_Id = 7;
    robotNPC_3_Id = 8;
    prop_1_Id = 9;
    prop_2_Id = 10;
    prop_3_Id = 11;
    prop_4_Id = 12;

    scene = [];
    stack = [];
    prop_1_Position = {
        x: -2.0,
        y: 2.5,
        z: 0.0
    };
    prop_2_Position = {
        x: 0.0,
        y: 1.5,
        z: 0.0
    };
    prop_3_Position = {
        x: -1.0,
        y: 3.5,
        z: 0.0
    };
    prop_4_Position = {
        x: -1.0,
        y: 4.5,
        z: 0.0
    };
    floor;
    sideWall;
    rearWall;
    conveyorBelt;
    floorTextureOptions = {
        textureImg: planeTexture,
        setTexture: true,
        coords: [
            0, 0,
            25, 0,
            25, 25,
            0, 25
        ],
        textureID: 0.0
    }
    defaultTextureOptions = {
        textureImg: null,
        setTexture: false,
        coords: [],
        textureID: 1.0
    }

    constructor() {
        for (let i = 0; i < sceneNodes; i++) {
            this.scene[i] = new SceneNode(null, null, null, null);
        }

        this.floor = objectFactory.createPlane(25, 0.5, 25, "Whitesmoke", this.floorTextureOptions)
        this.sideWall = objectFactory.createPlane(25, 0.5, 25, "Lavender_grey", this.defaultTextureOptions)
        this.rearWall = objectFactory.createPlane(25, 0.5, 25, "light_grey", this.defaultTextureOptions)
        this.conveyorBelt = objectFactory.createPlane(2.0, 5.0, 15, "light_grey", this.defaultTextureOptions)
    }

    createNodes = (Id) => {

        let transformationMatrix = mat4();

        switch (Id) {

            case this.sceneId:
                transformationMatrix = mult(transformationMatrix, translate(0.0, 0.0, 0.0));
                this.scene[this.sceneId] = new SceneNode(transformationMatrix, null, this.floorId, null);
                break;

            case this.floorId:
                transformationMatrix = mult(transformationMatrix, translate(0.0, -5.5, 0.0));
                this.scene[this.floorId] = new SceneNode(transformationMatrix, () => this.floor.render(), this.wallId, null);
                break;

            case this.wallId:
                transformationMatrix = mult(transformationMatrix, translate(-13.0, 7.0, 0.0));
                transformationMatrix = mult(transformationMatrix, rotateZ(-90));
                this.scene[this.wallId] = new SceneNode(transformationMatrix, () => this.sideWall.render(), this.rearwallId, null);
                break;

            case this.rearwallId:
                transformationMatrix = mult(transformationMatrix, translate(0.0, 7.0, -12.5));
                transformationMatrix = mult(transformationMatrix, rotateX(90));
                this.scene[this.rearwallId] = new SceneNode(transformationMatrix, () => this.rearWall.render(), this.robotId, null);
                break;

            case this.robotId:
                transformationMatrix = translate(robot.robotPosition.x, robot.robotPosition.y, robot.robotPosition.z);
                this.scene[this.robotId] = new SceneNode(transformationMatrix, () => robot.render(), this.conveyorBeltId, null);
                break;

            case this.conveyorBeltId:
                transformationMatrix = mult(transformationMatrix, translate(-10.0, -5.5, 0.0));
                transformationMatrix = mult(transformationMatrix, rotateZ(-90));
                this.scene[this.conveyorBeltId] = new SceneNode(transformationMatrix, () => this.conveyorBelt.render(), this.robotNPC_1_Id, this.prop_1_Id);
                break;

            case this.prop_1_Id:
                transformationMatrix = mult(transformationMatrix, translate(this.prop_1_Position.x, this.prop_1_Position.y, this.prop_1_Position.z));
                transformationMatrix = mult(transformationMatrix, rotateY(90));
                transformationMatrix = mult(transformationMatrix, rotateZ(90));
                this.scene[this.prop_1_Id] = new SceneNode(transformationMatrix, () => objectFactory.createTorso(robotNPC_4.torsoWidth, robotNPC_4.torsoHeight, "grey"), this.prop_2_Id, null);
                break;

            case this.prop_2_Id:
                transformationMatrix = mult(transformationMatrix, translate(this.prop_2_Position.x, this.prop_2_Position.y, this.prop_2_Position.z));
                transformationMatrix = mult(transformationMatrix, rotateY(90));
                transformationMatrix = mult(transformationMatrix, rotateZ(90));
                this.scene[this.prop_2_Id] = new SceneNode(transformationMatrix, () => objectFactory.createHead(robotNPC_4.headWidth, robotNPC_4.headHeight, "Red"), this.prop_3_Id, null);
                break;

            case this.prop_3_Id:
                transformationMatrix = mult(transformationMatrix, translate(this.prop_3_Position.x, this.prop_3_Position.y, this.prop_3_Position.z));
                transformationMatrix = mult(transformationMatrix, rotateY(90));
                transformationMatrix = mult(transformationMatrix, rotateZ(90));
                this.scene[this.prop_3_Id] = new SceneNode(transformationMatrix, () => objectFactory.createRightUpperArm(robotNPC_4.upperArmWidth, robotNPC_4.upperArmHeight, "Blue"), this.prop_4_Id, null);
                break;

            case this.prop_4_Id:
                transformationMatrix = mult(transformationMatrix, translate(this.prop_4_Position.x, this.prop_4_Position.y, this.prop_4_Position.z));
                transformationMatrix = mult(transformationMatrix, rotateZ(90));
                this.scene[this.prop_4_Id] = new SceneNode(transformationMatrix, () => objectFactory.createBase(robotNPC_4.baseWidth, robotNPC_4.baseHeight, "Red"), null, null);
                break;

            case this.robotNPC_1_Id:
                robotNPC_1.robotPosition = {
                    x: -3.5,
                    y: -5.5,
                    z: 5.0
                };
                transformationMatrix = translate(robotNPC_1.robotPosition.x, robotNPC_1.robotPosition.y, robotNPC_1.robotPosition.z);
                this.scene[this.robotNPC_1_Id] = new SceneNode(transformationMatrix, () => robotNPC_1.render(), this.robotNPC_2_Id, null);
                break;

            case this.robotNPC_2_Id:
                robotNPC_2.robotPosition = {
                    x: -3.5,
                    y: -5.5,
                    z: 2.0
                };
                transformationMatrix = translate(robotNPC_2.robotPosition.x, robotNPC_2.robotPosition.y, robotNPC_2.robotPosition.z);
                this.scene[this.robotNPC_2_Id] = new SceneNode(transformationMatrix, () => robotNPC_2.render(), this.robotNPC_3_Id, null);
                break;

            case this.robotNPC_3_Id:
                
                transformationMatrix = translate(robotNPC_3.robotPosition.x, robotNPC_3.robotPosition.y, robotNPC_3.robotPosition.z);
                this.scene[this.robotNPC_3_Id] = new SceneNode(transformationMatrix, () => robotNPC_3.render(), null, null);
                break;

        }

    }

    traverse = (Id) => {
        if (Id == null) {
            return;
        }
        this.stack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, this.scene[Id].transform);
        this.scene[Id].render();
        if (this.scene[Id].child != null) {
            this.traverse(this.scene[Id].child);
        }
        modelViewMatrix = this.stack.pop();
        if (this.scene[Id].sibling != null) {
            this.traverse(this.scene[Id].sibling);
        }
    }

    render = () => {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.traverse(this.floorId);
        requestAnimationFrame(this.render);
    }


}