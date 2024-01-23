class Robot {
    torsoHeight = 2.0;
    torsoWidth = 1.0;
    upperArmHeight = 1.0;
    lowerArmHeight = 0.5;
    upperArmWidth  = 0.6;
    lowerArmWidth  = 0.4;
    headHeight = 0.5;
    headWidth = 0.5;
    baseWidth = 1.8;
    baseHeight = 0.5;
    baseId = 0
    torsoId = 1;
    headId  = 2;
    head1Id = 2;
    head2Id = 10;
    leftUpperArmId = 3;
    leftLowerArmId = 4;
    rightUpperArmId = 5;
    rightLowerArmId = 6;
    stack = [];
    figure = [];
    
    theta = [0, 0, 0, 0, 0, 0, 0, 0, 180, 0, 0];
    robotPosition = {
        x: 0.0,
        y: 0.0, 
        z: 0.0  
    };
    isWKeyPressed = false;
    movementSpeed = 0.1; 
    constructor(){
        for(let i=0; i<numNodes; i++) {
            this.figure[i] = new ModelNode(null, null, null, null);
         }

    }

    createNodes = (Id) => {

        let transformationMatrix = mat4();
    
        switch(Id) {
    
        case this.baseId:
        transformationMatrix = translate(0.0, -(1.5*this.baseHeight), 0.0);
        transformationMatrix = mult(transformationMatrix,rotate(this.theta[this.baseId], vec3(0, 1, 0) ));
        this.figure[this.baseId] = new ModelNode( transformationMatrix, ()=> objectFactory.createBase(this.baseWidth, this.baseHeight, "Red"), null, this.torsoId );
        break;    
        
        case this.torsoId:
        transformationMatrix = translate(0.0, 0.3*this.torsoHeight, 0.0);
        transformationMatrix = mult(transformationMatrix, rotate(this.theta[this.torsoId], vec3(0, 1, 0) ));
        this.figure[this.torsoId] = new ModelNode( transformationMatrix, ()=> objectFactory.createTorso(this.torsoWidth, this.torsoHeight, "grey"), null, this.headId );
        break;
    
        case this.headId:
        case this.head1Id:
        case this.head2Id:
    
    
        transformationMatrix = translate(0.0, this.torsoHeight+0.5*this.headHeight, 0.0);
        transformationMatrix = mult(transformationMatrix, rotate(this.theta[this.head1Id], vec3(1, 0, 0)))
        transformationMatrix = mult(transformationMatrix, rotate(this.theta[this.head2Id], vec3(0, 1, 0)));
        transformationMatrix = mult(transformationMatrix, translate(0.0, -0.5*this.headHeight, 0.0));
        this.figure[this.headId] = new ModelNode( transformationMatrix, ()=> objectFactory.createHead(this.headWidth, this.headHeight, "Red"), this.leftUpperArmId, null);
        break;
    
    
        case this.leftUpperArmId:
    
        transformationMatrix = translate(-(this.torsoWidth+this.upperArmWidth)*0.6, 0.8*this.torsoHeight, 0.0);
        transformationMatrix = mult(transformationMatrix, rotate(this.theta[this.leftUpperArmId], vec3(1, 0, 0)));
        this.figure[this.leftUpperArmId] = new ModelNode( transformationMatrix, ()=> objectFactory.createLeftUpperArm(this.upperArmWidth, this.upperArmHeight, "Blue"), this.rightUpperArmId, this.leftLowerArmId );
        break;
    
        case this.rightUpperArmId:
    
        transformationMatrix = translate((this.torsoWidth+this.upperArmWidth)*0.6, 0.8*this.torsoHeight, 0.0);
        transformationMatrix = mult(transformationMatrix, rotate(this.theta[this.rightUpperArmId], vec3(1, 0, 0)));
        this.figure[this.rightUpperArmId] = new ModelNode( transformationMatrix,()=>  objectFactory.createRightUpperArm(this.upperArmWidth, this.upperArmHeight, "Blue"), null, this.rightLowerArmId );
        break;
    
        case this.leftLowerArmId:
    
        transformationMatrix = translate(0.0, this.upperArmHeight, 0.0);
        transformationMatrix = mult(transformationMatrix, rotate(this.theta[this.leftLowerArmId], vec3(1, 0, 0)));
        this.figure[this.leftLowerArmId] = new ModelNode( transformationMatrix,()=>  objectFactory.createLeftLowerArm(this.lowerArmWidth, this.lowerArmHeight, "Red"), null, null );
        break;
    
        case this.rightLowerArmId:
    
        transformationMatrix = translate(0.0, this.upperArmHeight, 0.0);
        transformationMatrix = mult(transformationMatrix, rotate(this.theta[this.rightLowerArmId], vec3(1, 0, 0)));
        this.figure[this.rightLowerArmId] = new ModelNode( transformationMatrix, ()=> objectFactory.createRightLowerArm(this.lowerArmWidth, this.lowerArmHeight, "Red"), null, null );
        break;
    
        }
    
    }

    traverse = (Id) => {
        if(Id == null) {
            return;
        }
        this.stack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, this.figure[Id].transform);
        this.figure[Id].render();
        if(this.figure[Id].child != null) {
            this.traverse(this.figure[Id].child);
        }
        modelViewMatrix = this.stack.pop();
        if(this.figure[Id].sibling != null) {
            this.traverse(this.figure[Id].sibling);
        }
     }


    render = () => {
        this.traverse(this.baseId);
        requestAnimationFrame(this.render);
    }
}