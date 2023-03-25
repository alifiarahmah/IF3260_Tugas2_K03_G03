"use strict";
// constants
const canvas = document.getElementById("gl-canvas");
const gl = canvas.getContext("webgl2");

/* program states */
var models = []; // models has model objects that has array of vec4 points and colors
var program = ""; // shader program in use

// transformation vars
var rotation = [0, 0, 0];
var translation = [0, 0, 0];
var scale = 1;

// camera vars
var radius = 0.5;
var up = [0, 1, 0];
var yAxis = 0;
var xAxis = 0;

// projection
var projection = generateOrtho();

// light vars
var useShading = true;
var lightRadius = 5;
var lightRotation = 45;
var lightColor = [1, 1, 1];


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
			in vec4 vNormal;

			uniform mat4 transformationMatrix;
			uniform mat4 viewMatrix;
			uniform mat4 projectionMatrix;

			out vec3 fPosition;
			out vec4 fColor;
			out vec3 normal;

			void main()
			{
				normal = mat3(transpose(inverse(transformationMatrix))) * vNormal.xyz;
				vec4 pos = transformationMatrix * vPosition;
				fPosition = pos.xyz;
				fColor = vColor;
				gl_Position = projectionMatrix * viewMatrix * transformationMatrix * vPosition;
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

			uniform bool useShader;
			uniform vec3 lightPos;
			uniform vec3 lightCol;
			uniform vec3 eye;

			in vec3 fPosition;
			in vec4 fColor;
			in vec3 normal;
			void main()
			{
				// constants
				float shininess = 80.0;
				float ambience = 0.15;
				float specular = 0.8;
				float a = 0.2;
				float b = 0.5;
				float c = 1.0;
				if (!useShader){
					FragColor = fColor;
				}else{
					// diffuse light
					vec3 norm = normalize(normal);
					vec3 lightDir = normalize(lightPos - fPosition);
					float diffuse = clamp(dot(norm, lightDir), 0.0, 1.0);

					//specular light
					vec3 viewDir = normalize(eye - fPosition);
					vec3 reflectDir = reflect(-1.0 * lightDir, norm);
					float spec = pow(clamp(dot(viewDir, reflectDir), 0.0, 1.0), shininess) * specular;
					spec = 0.0;

					if(diffuse == 0.0)spec = 0.0;

					//intensity effect
					float dist = sqrt(abs(dot(fPosition, lightPos)));
					float iEffect = 1.0/(c + dist * b + dist * dist * a);
					diffuse *= iEffect;
					spec *= iEffect;

					vec3 effect = (ambience + diffuse + spec) * lightCol;
					vec3 result = effect * fColor.xyz;
					FragColor = vec4(result, 1.0);
				}

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
			prism["normals"] = getNormal(prism)
			prism["centroid"] = getCentroid(prism)
			models.push(prism)
			cube["normals"] = getNormal(cube)
			cube["centroid"] = getCentroid(cube)
			diamond["normals"] = getNormal(diamond)
			diamond["centroid"] = getCentroid(diamond)
			

			render();

			addListener();
		}
	}
}

function renderModel(shaderProgram, model){
	// Constants
	const mode = gl.TRIANGLES;
	let positionArray = model["points"];
	let colorArray = model["colors"];
	let normalArray = model["normals"];
	const centroid = model["centroid"];
	const vertexCount = positionArray.length
	let transformationMatrix = getTransformationMatrix(
		rotation,
		translation,
		scale,
		centroid
	)

	let rotatedEye = rotateEye(radius, xAxis, yAxis);
	let lightPos = rotateEye(lightRadius, 0, lightRotation);
	lightPos[1] = 1;

	// Flatten matrices
	positionArray = flatten2d(positionArray);
	colorArray = flatten2d(colorArray);
	normalArray = flatten2d(normalArray);
	transformationMatrix = flatten2d(transformationMatrix);
	let viewMatrix = flatten2d(generateView(rotatedEye, up))
	let projectionMatrix = flatten2d(projection)

	// WebGL Rendering
	gl.clearColor(0, 0, 0, 1.0);
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

	const normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	const normalCoord = gl.getAttribLocation(shaderProgram, "vNormal");
	gl.vertexAttribPointer(normalCoord, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(normalCoord);

	var translationMatrixLoc = gl.getUniformLocation(shaderProgram, "transformationMatrix");
	gl.uniformMatrix4fv(translationMatrixLoc, false, new Float32Array(transformationMatrix));
	var viewMatrixLoc = gl.getUniformLocation(shaderProgram, "viewMatrix");
	gl.uniformMatrix4fv(viewMatrixLoc, false, new Float32Array(viewMatrix));
	var projectionMatrixLoc = gl.getUniformLocation(shaderProgram, "projectionMatrix");
	gl.uniformMatrix4fv(projectionMatrixLoc, false, new Float32Array(projectionMatrix));
	var useShaderMatrixLoc = gl.getUniformLocation(shaderProgram, "useShader");
	gl.uniform1i(useShaderMatrixLoc, useShading);
	var lightColorLoc = gl.getUniformLocation(shaderProgram, "lightCol");
	gl.uniform3fv(lightColorLoc, new Float32Array(lightColor));
	var lightPosLoc = gl.getUniformLocation(shaderProgram, "lightPos");
	gl.uniform3fv(lightPosLoc, new Float32Array(lightPos));
	var eyeLoc = gl.getUniformLocation(shaderProgram, "eye");
	gl.uniform3fv(eyeLoc, new Float32Array(rotatedEye));

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
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array(normalArray),
		gl.STATIC_DRAW
	);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	gl.drawArrays(mode, 0, vertexCount);
}

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT);
	models.forEach(model => {
		renderModel(program, model)
	})
	window.requestAnimationFrame(render)
}

main();
addListener();
