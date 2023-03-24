function getTransformationMatrix(rotation, translation, scale, centroid){
    let res = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    res = matmul(translateMatrix(centroid), res);
    res = matmul(translateMatrix(translation), res);
    res = matmul(rotationX(rotation[0]), res);
    res = matmul(rotationY(rotation[1]), res);
    res = matmul(rotationZ(rotation[2]), res);
    res = matmul(scaleMatrix(scale), res);
    res = matmul(translateMatrix([
        -1*centroid[0],
        -1*centroid[1],
        -1*centroid[2]
    ]), res);
    return res;
}

function translateMatrix(translation){
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [translation[0], translation[1], translation[2], 1]
    ]
}

function rotationX(theta){
    let c = Math.cos(theta);
    let s = Math.sin(theta);
    return[
        [1, 0, 0, 0],
        [0, c, s, 0],
        [0, -s, c, 0],
        [0, 0, 0, 1]
    ];
}

function rotationY(theta){
    let c = Math.cos(theta);
    let s = Math.sin(theta);
    return[
        [c, 0, -s, 0],
        [0, 1, 0, 0],
        [s, 0, c, 0],
        [0, 0, 0, 1]
    ];
}

function rotationZ(theta){
    let c = Math.cos(theta);
    let s = Math.sin(theta);
    return[
        [c, s, 0, 0],
        [-s, c, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}

function scaleMatrix(s){
    return[
        [s, 0, 0, 0],
        [0, s, 0, 0],
        [0, 0, s, 0],
        [0, 0, 0, 1]
    ];
}

function getCentroid(model){
    let pts = model["points"];
    let x = 0;
    let y = 0;
    let z = 0;
    for(let i=0; i<pts.length; i++){
        x += pts[i][0];
        y += pts[i][1];
        z += pts[i][2];
    }
    x/=pts.length;
    y/=pts.length;
    z/=pts.length;
    return [x, y, z];
}