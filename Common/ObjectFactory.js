class ObjectFactory {
   constructor() {
     
   }

   createCube= () => {
     let cube = new Quad();
     cube.SetVertexPosition( -0.5, -0.5,  0.5);
     cube.SetVertexPosition( -0.5,  0.5,  0.5);
     cube.SetVertexPosition(  0.5,  0.5,  0.5);
     cube.SetVertexPosition( 0.5, -0.5,  0.5);
     cube.SetVertexPosition( -0.5, -0.5, -0.5);
     cube.SetVertexPosition(  -0.5,  0.5, -0.5);
     cube.SetVertexPosition(  0.5,  0.5, -0.5);
     cube.SetVertexPosition( 0.5, -0.5, -0.5);

     cube.DrawFace( 1, 0, 3, 2 );
     cube.DrawFace( 2, 3, 7, 6 );
     cube.DrawFace( 3, 0, 4, 7 );
     cube.DrawFace( 6, 5, 1, 2 );
     cube.DrawFace( 4, 5, 6, 7 );
     cube.DrawFace( 5, 4, 0, 1 );

     cube.createVertexBuffer();
   }


  createPlane = (planeWidth, planeHeight, planeLength, color, options) => {
    let plane = new Plane(planeWidth, planeHeight, planeLength, color, options);
    return plane
  } 

  createHead = (headWidth, headHeight, color) => {
     return new Head(headWidth, headHeight, color).render()
  } 

  createTorso = (torsoWidth, torsoHeight, color) => {
    return new Torso(torsoWidth, torsoHeight, color).render()
  } 

  createLeftUpperArm = (leftUpperArmWidth, leftUpperArmHeight, color) => {
    return new LeftUpperArm(leftUpperArmWidth, leftUpperArmHeight, color).render()
  }

  createLeftLowerArm = (leftLowerArmWidth, leftLowerArmHeight, color) => {
    return new LeftLowerArm(leftLowerArmWidth, leftLowerArmHeight, color).render()
  }

  createRightUpperArm = (rightUpperArmWidth, rightUpperArmHeight, color) => {
    return new RightUpperArm(rightUpperArmWidth, rightUpperArmHeight, color).render()
  }

  createRightLowerArm = (rightLowerArmWidth, rightLowerArmHeight, color) => {
    return new RightLowerArm(rightLowerArmWidth, rightLowerArmHeight, color).render()
  }

  createBase = (baseWidth, baseHeight, color) => {
    return new Base(baseWidth, baseHeight, color).render()
  }

}