function createSTMatrix(left, right, top, bottom, near, far) {
    return [
        [2/(right-left), 0, 0, 0],
        [0, 2/(top-bottom), 0, 0],
        [0, 0, -2/(far-near), 0],
        [-(left+right)/(right-left), -(top+bottom)/(top-bottom), -(far+near)/(far-near), 1]
    ]
}

function createOrthoMatrix() {
    var m = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ];
    var st = createSTMatrix(-1, 1, 1, -1, 0.05, 10);
    return matmul(m, st);
}

var createObliqueMatrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0.3, 0.3, 0, 0],
    [0, 0, 0, 1],
]

