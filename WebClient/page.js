function draw(x, y) {
	var c = document.getElementById("card");
	var ctx = c.getContext("2d");
	
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.beginPath();
	
	ctx.rect(x, y, 150, 100, 100);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.stroke();
}

function init() {
	setupCanvas();
	draw();
	requestAnimationFrame(tick);
	
	document.addEventListener("mousemove", function(event) {
		
		var pos = document.getElementById("card").getBoundingClientRect();
		var x = event.clientX - pos.x - 150*0.5;
		var y = event.clientY - pos.y - 100*0.5;

		draw(x, y);
	});
}

function tick() {
	requestAnimationFrame(tick);
}

function setupCanvas() {
    var canvs = document.getElementById("card");
    canvs.width = window.innerWidth;
    canvs.height = window.innerHeight;
}
