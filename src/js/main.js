"use strict";
// constants
const canvas = document.getElementById("gl-canvas");
const gl = canvas.getContext("webgl2");

/* program states */
var models = [] // models has model objects that has array of vec4 points and colors
var program = "" // shader program in use
// transform vars
var transform = [ 
	[1.0, 0.0, 0.0, 0.0],
	[0.0, 1.0, 0.0, 0.0],
	[0.0, 0.0, 1.0, 0.0],
	[0.0, 0.0, 0.0, 1.0]
]
// camera vars
var radius = 0.05;
var up = [0, 1, 0];
var yAxis = 0;
var xAxis = 0;

// projection
var projection = [
	[1, 0, 0, 0],
	[0, 1, 0, 0],
	[0, 0, 1, 0],
	[0, 0, 0, 1]
]


function main() {
	if (!gl) {
		/* gl is not defined */
		alert("Keliatannya browsermu tidak mendukung WebGL. :(");
		
	} else {
		// Create shader
		const vertCode = 
		`   #version 300 es
			precision mediump float;
			in vec4 vPosition;
			in vec4 vColor;
			
			uniform mat4 transformationMatrix;
			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			out vec4 fPosition;
			out vec4 fColor;

			void main()
			{
				gl_Position = modelViewMatrix * vPosition;
				fColor = vColor;
			}
		`;

		const vertShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertShader, vertCode);
		gl.compileShader(vertShader);
		var compilationLog = gl.getShaderInfoLog(vertShader);
		console.log('Shader compiler log: ' + compilationLog);
		
		const fragCode = 
		`   #version 300 es
			precision mediump float;
			out vec4 FragColor;
			
			in vec4 fColor; // the input variable from the vertex shader (same name and same type)  
			
			void main()
			{
				FragColor = fColor;
			} 
		`;

		const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragShader, fragCode);
		gl.compileShader(fragShader);
		compilationLog = gl.getShaderInfoLog(fragShader);
		console.log('Shader compiler log: ' + compilationLog);
		
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
			models.push(prism)

			render();

			addListener();
		}
	}
}

function renderModel(shaderProgram, positionArray, colorArray, transformationMatrix){
	// Constants
	const mode = gl.TRIANGLES;
	const vertexCount = positionArray.length

	let rotatedEye = rotateEye(radius, xAxis, yAxis);

	// Flatten matrices
	positionArray = flatten2d(positionArray);
	colorArray = flatten2d(colorArray);
	transformationMatrix = flatten2d(transformationMatrix);
	let modelViewMatrix = flatten2d(generateModelView(rotatedEye, up))
	let projectionMatrix = flatten2d(projection)

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
	var modelViewMatrixLoc = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, new Float32Array(modelViewMatrix));
	var projectionMatrixLoc = gl.getUniformLocation(shaderProgram, "projectionMatrix");
	gl.uniformMatrix4fv(projectionMatrixLoc, false, new Float32Array(projectionMatrix));

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
	window.requestAnimationFrame(render)
}

main();
addListener();
