function addListener() {
	// declare controls
	const modelControl = document.getElementById("model");
	const projectionControl = document.getElementById("projection");
	const addRadius = document.getElementById("addRadius");
	const reduceRadius = document.getElementById("reduceRadius");
	const cameraAxis = document.getElementById("cameraAxis");
	const cameraRotation = document.getElementById("cameraRotation");
	const shadingSelector = document.getElementById("shading");
	const lightColorSelector = document.getElementById("lightColor");
	const lightRadiusSelector = document.getElementById("lightRadius");
	const lightRotationSelector = document.getElementById("lightRotation");
	const translationX = document.getElementById("translationX");
	const translationY = document.getElementById("translationY");
	const translationZ = document.getElementById("translationZ");
	const rotationX = document.getElementById("rotationX");
	const rotationY = document.getElementById("rotationY");
	const rotationZ = document.getElementById("rotationZ");
	const scaleSelector = document.getElementById("scale");
	const loadButton = document.getElementById("load");

	translationX.oninput = () => {translation[0] = translationX.value};
	translationY.oninput = () => {translation[1] = translationY.value};
	translationZ.oninput = () => {translation[2] = translationZ.value};
	rotationX.oninput = () => {rotation[0] = rotationX.value / 180 * Math.PI};
	rotationY.oninput = () => {rotation[1] = rotationY.value / 180 * Math.PI};
	rotationZ.oninput = () => {rotation[2] = rotationZ.value / 180 * Math.PI};
	scaleSelector.oninput = () => {scale = scaleSelector.value};

	modelControl.addEventListener("change", () => {
		if (modelControl.value == "ring"){
			models.pop()
			models.push(prism)
		} else if (modelControl.value == "cube"){
			models.pop()
			models.push(cube)
		}
	})

	projectionControl.addEventListener("change", function() {
		if(projectionControl.value === "orthographic")projection = generateOrtho();
		if(projectionControl.value === "oblique")projection = generateOblique();
		if(projectionControl.value === "perspective")projection = generatePerspective();
	});

	function changeRadius(delta){
		radius += delta;
	}

	function setCameraSlider(){
		if (cameraAxis.value == "Y"){
			cameraRotation.value = yAxis;
			cameraRotation.min = 0;
			cameraRotation.max = 360;
		} else{
			cameraRotation.value = xAxis;
			cameraRotation.min = -90;
			cameraRotation.max = 90;
		}
	}

	function updateCameraRotation(){
		if (cameraAxis.value == "Y"){
			yAxis = cameraRotation.value;
		} else{
			xAxis = cameraRotation.value;
		}
	}

	shadingSelector.onchange = () => {useShading = (shadingSelector.value === "Y")}
	lightColorSelector.oninput = () => {
		let color = lightColorSelector.value
		let red = parseInt(color.slice(1, 3), 16)
		let green = parseInt(color.slice(3, 5), 16)
		let blue = parseInt(color.slice(5, 7), 16)
		lightColor = [red/255.0, green/255.0, blue/255.0]
	}
	lightRadiusSelector.oninput = () => {lightRadius = parseFloat(lightRadiusSelector.value)}
	lightRotationSelector.oninput = () => {lightRotation = parseFloat(lightRotationSelector.value)}

	addRadius.onclick = () => changeRadius(0.05);
	reduceRadius.onclick = () => changeRadius(-0.05);
	cameraAxis.onchange = () => setCameraSlider();
	cameraRotation.oninput = () => updateCameraRotation();

	function load(){
		var input = document.createElement('input');
		input.type = 'file';
		document.body.appendChild(input)
		input.onchange = e => { 
			// getting a hold of the file reference
			var file = e.target.files[0]; 

			// setting up the reader
			var reader = new FileReader();
			reader.readAsText(file,'UTF-8');

			// here we tell the reader what to do when it's done reading...
			reader.onload = readerEvent => {
				var content = readerEvent.target.result; // this is the content!
				try{
					data = JSON.parse(content)
					models.pop()
					let model = data
					model["normals"] = getNormal(model);
					model["centroid"] = getCentroid(model);
					models.push(model);
				}catch{
					// no need
				}
			}
		}
		input.click();
		document.body.removeChild(input)
	}
	loadButton.onclick = () => {load()}
}