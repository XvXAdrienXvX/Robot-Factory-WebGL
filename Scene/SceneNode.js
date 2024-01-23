class SceneNode {
    transform;
    render;
    sibling;
    child;

    constructor(transform, render, sibling, child){
       this.transform = transform;
       this.render = render;
       this.sibling = sibling;
       this.child = child;
    }
}