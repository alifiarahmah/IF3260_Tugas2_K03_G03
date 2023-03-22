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

function generatePerspective(radius){
    var fov = 80
    var nearClip = 0.05;
    var farClip = 5;

    var aspect = 1;
    var factor = Math.tan(Math.PI * 0.5 - 0.5 * fov / 180 * Math.PI);
    var rangeInverse = 1.0 / (nearClip - farClip);
    return [
        [factor * aspect, 0, 0, 0],
        [0, factor, 0, 0],
        [0, 0, (nearClip + farClip) * rangeInverse, -1],
        [0, 0, nearClip * farClip * rangeInverse , 1]
    ]
}