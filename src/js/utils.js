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

// normalizes a vector (3d)
function normalize3d(v){
    let sum = 0;
    v.forEach(e => sum += e*e);
    sum = Math.sqrt(sum);
    if (sum < 0.00001) return [0, 0, 0]
    for(let i=0; i<v.length; i++)v[i]/=sum;
    return v;
}

// vector 3d cross product
function cross3d(a, b){
    return [
        a[1]*b[2] - a[2]*b[1],
        a[2]*b[0] - a[0]*b[2],
        a[0]*b[1] - a[1]*b[0]
    ];
}

// calculate normals of model
function getNormal(model){
    let pts = model["points"];
    normals = []
    if (pts.length % 3 != 0) throw Error("model point count wrong");
    for(let i=0; i<pts.length; i+=3){
        let a = pts[i];
        let b = pts[i+1];
        let c = pts[i+2];
        let norm = cross3d(
            [b[0]-a[0], b[1]-a[1], b[2]-a[2]], 
            [c[0]-a[0], c[1]-a[1], c[2]-a[2]]
        )
        norm = normalize3d(norm)
        norm.push(0)
        normals.push(norm)
        normals.push(norm)
        normals.push(norm)
    }
    return normals;
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