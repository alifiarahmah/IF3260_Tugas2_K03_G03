function getCentroid(model){
    let pts = model["points"];
    let x = 0;
    let y = 0;
    let z = 0;
    for(let i=0; i<pts.length; i++){
        x += pts[0]/pts.length;
        y += pts[1]/pts.length;
        z += pts[2]/pts.length;
    }
    return [x, y, z];
}