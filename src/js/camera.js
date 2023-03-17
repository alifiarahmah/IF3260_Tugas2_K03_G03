function generateModelView(eye, up, at = [0, 0, 0]){
    var z = normalize3d([at[0]-eye[0], at[1]-eye[1], at[2]-eye[2]]);
    var x = normalize3d(cross3d(z, up));
    var y = normalize3d(cross3d(x, z));

    return [
        [x[0], x[1], x[2], 0],
        [y[0], y[1], y[2], 0],
        [-1*z[0], -1*z[1], -1*z[2], 0],
        [-1*eye[0], -1*eye[1], -1*eye[2], 1]
    ]
}

function rotateEye(radius, xAxis, yAxis){
    return[
        radius * Math.sin(yAxis / 180 * Math.PI),
        radius * Math.sin(xAxis / 180 * Math.PI),
        radius * Math.cos(yAxis / 180 * Math.PI)
    ]
}