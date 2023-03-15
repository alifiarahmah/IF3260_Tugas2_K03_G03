"use strict";
// constants
const canvas = document.getElementById("gl-canvas");
const gl = canvas.getContext("webgl");

// program states
var models = [] // models has model objects that has array of vec4 points and colors
var program = "" // shader program in use
var transform = [ 
	[1.0, 0.0, 0.0, 0.0],
	[0.0, 1.0, 0.0, 0.0],
	[0.0, 0.0, 1.0, 0.0],
	[0.0, 0.0, 0.0, 1.0]
]
// TODO: add modelview matrix


function main() {
	if (!gl) {
		/* gl is not defined */
		alert("Keliatannya browsermu tidak mendukung WebGL. :(");
		
	} else {
		// Create shader
		const vertCode = `
			attribute vec4 vPosition;
			attribute vec4 vColor;
			varying vec4 fColor;
			uniform mat4 transformationMatrix;
			void main()
			{
				gl_Position = vPosition * transformationMatrix;
				fColor = vColor;
			}
		`;

		const vertShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertShader, vertCode);
		gl.compileShader(vertShader);
		
		const fragCode = `
			precision mediump float;
			varying vec4 fColor;
			void main()
			{
				gl_FragColor = fColor;
			}
		`;

		const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragShader, fragCode);
		gl.compileShader(fragShader);
		
		// Create program
		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertShader);
		gl.attachShader(shaderProgram, fragShader);
		gl.linkProgram(shaderProgram);
		
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			console.log(gl.getProgramInfoLog(shaderProgram));

		} else {
			gl.useProgram(shaderProgram);
			program = shaderProgram;
			
			// get model
			models.push(base)

			render();
		}
	}
}

function renderModel(shaderProgram, positionArray, colorArray, transformationMatrix){
	// Constants
	const mode = gl.TRIANGLES;
	const vertexCount = positionArray.length
	console.log("rendering")

	// Flatten matrices
	positionArray = flatten2d(positionArray);
	colorArray = flatten2d(colorArray);
	transformationMatrix = flatten2d(transformationMatrix);

	// WebGL Rendering
	gl.clearColor(1, 1, 1, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.viewport(0, 0, canvas.width, canvas.height);

	// Combine
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	const vertexCoord = gl.getAttribLocation(shaderProgram, "vPosition");
	gl.vertexAttribPointer(vertexCoord, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vertexCoord);

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	const colorCoord = gl.getAttribLocation(shaderProgram, "vColor");
	gl.vertexAttribPointer(colorCoord, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(colorCoord);

	var translationMatrixLoc = gl.getUniformLocation(shaderProgram, "transformationMatrix");
	gl.uniformMatrix4fv(translationMatrixLoc, false, new Float32Array(transformationMatrix));

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array(positionArray),
				gl.STATIC_DRAW
			);
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array(colorArray),
				gl.STATIC_DRAW
			);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			gl.drawArrays(mode, 0, vertexCount);
}

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT);
	models.forEach(model => {
		renderModel(program, model["points"], model["colors"], transform)
	})
	window.requestAnimFrame(render)
}

main();
