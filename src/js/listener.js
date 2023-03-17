function addListener() {
	// declare controls
	const modelControl = document.getElementById("model");
	const projectionControl = document.getElementById("projection");
	const addRadius = document.getElementById("addRadius");
	const reduceRadius = document.getElementById("reduceRadius");
	const cameraAxis = document.getElementById("cameraAxis");
	const cameraRotation = document.getElementById("cameraRotation");
	const shadingSelector = document.getElementById("shading");

	projectionControl.addEventListener("change", function() {
		console.log("projection changed");
		model = modelControl.value;
	});

	function changeRadius(delta){
		let curRadius = radius;
		if (curRadius + delta <= 0.0001 || curRadius + delta >=0.999)return;
		radius += delta;
	}
	
	function setCameraSlider(){
		if (cameraAxis.value == "Y"){
			cameraRotation.value = yAxis;
		} else{
			cameraRotation.value = xAxis;
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
	
	addRadius.onclick = () => changeRadius(0.05);
	reduceRadius.onclick = () => changeRadius(-0.05);
	cameraAxis.onchange = () => setCameraSlider();
	cameraRotation.oninput = () => updateCameraRotation();
}