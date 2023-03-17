function generateModelView(eye, up, at = [0, 0, 0]){
    var z = normalize3d([at[0]-eye[0], at[1]-eye[1], at[2]-eye[2]]);
    var x = normalize3d(cross3d(z, up));
    var y = normalize3d(cross3d(x, z));

    return [
        [x[0], y[0], -1*z[0], -1*eye[0]],
        [x[1], y[1], -1*z[1], -1*eye[1]],
        [x[2], y[2], -1*z[2], -1*eye[2]],
        [0, 0, 0, 1]
    ]
}