function generateModelView(eye, up, at = [0, 0, 0]){
    var z = normalize3d([eye[0]-at[0], eye[1]-at[1], eye[2]-at[2]]);
    var x = normalize3d(cross3d(up, z));
    var y = normalize3d(cross3d(z, x));

    return [
        [x[0], y[0], z[0], -eye[0]],
        [x[1], y[1], z[1], -eye[1]],
        [x[2], y[2], z[2], -eye[2]],
        [0, 0, 0, 1]
    ]
}

function rotateEye(radius, xAxis, yAxis){
    return[
        radius * Math.sin(yAxis / 180 * Math.PI),
        radius * Math.sin(xAxis / 180 * Math.PI),
        radius * Math.cos(yAxis / 180 * Math.PI)
    ]
}