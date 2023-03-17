// calculates centroid of a set of points (vec4)
function centroid(arr){
    let ret = [0, 0, 0, 1]
    arr.forEach(e => {
        ret[0] += e[0] / arr.length
        ret[1] += e[1] / arr.length
        ret[2] += e[2] / arr.length
    })
    return ret
}

// converts 2d array to 1d array
function flatten2d(arr){
    let ret = []
    arr.forEach(li => {
        li.forEach(e => {
            ret.push(e)
        })
    })
    return ret
}

// multiplies two matrices
function matmul(a, b){
    if (a[0].length != b.length) 
        throw Error("Matrix sizes do not match");
    let n = a.length;
    let m = b[0].length;
    let p = b.length;
    let res = []
    for(let i=0; i<n; i++){
        res.push([]);
        for(let j=0; j<m; j++)res.push(0);
    }
    for(let i=0; i<n; i++){
        for(let j=0; j<m; j++){
            for(let k=0; k<p; k++){
                res[i][j] += (a[i][k] * b[k][j]);
            }
        }
    }
    return res;
}

// Provides requestAnimationFrame in a cross browser way.
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            window.setTimeout(callback, 1000/60);
            };
})();