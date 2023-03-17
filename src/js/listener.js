function addListener() {
	// declare controls
	const modelControl = document.getElementById("model");
	const projectionControl = document.getElementById("projection");

	projectionControl.addEventListener("change", function() {
		console.log("projection changed");
		model = modelControl.value;
	});
}