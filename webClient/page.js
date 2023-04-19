function draw(x, y) {
	var c = document.getElementById("card");
	var ctx = c.getContext("2d");
	
	ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(window.album_img, x, y);
	ctx.beginPath();

	ctx.stroke();
}

function init() {
    window.album_img = new Image();

	setupCanvas();
	requestAnimationFrame(tick);

    window.album_img.src = 'data:image/gif;base64,R0lGODlhCwALAIAAAAAA3pn/ZiH5BAEAAAEALAAAAAALAAsAAAIUhA+hkcuO4lmNVindo7qyrIXiGBYAOw==';

	draw()
	
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
