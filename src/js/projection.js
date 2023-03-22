function createSTMatrix(left, right, top, bottom, near, far) {
    return [
        [2/(right-left), 0, 0, -(left+right)/(right-left)],
        [0, 2/(top-bottom), 0, -(top+bottom)/(top-bottom)],
        [0, 0, -2/(far-near), -(far+near)/(far-near)],
        [0, 0, 0, 1]
    ]
}

function createOrthoMatrix() {
    var m = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 1],
    ];
    var st = createSTMatrix(-1, 1, 1, -1, 1, 100);
    return flatten2d(matmul(m, st));
}

var createObliqueMatrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0.3, 0.3, 0, 0],
    [0, 0, 0, 1],
]

