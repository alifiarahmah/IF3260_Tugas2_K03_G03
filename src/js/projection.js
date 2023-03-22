function generateOrtho(){
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, -1/32000, 0],
        [0, 0, 0, 1]
    ]
}

function generateOblique(){
    let c = -1/Math.tan(75/180*Math.PI);
    let d = -1/Math.tan(80/180*Math.PI);
    console.log(c);
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [c, d, -1/32000, 0],
        [0, 0, 0, 1]
    ]
    
}