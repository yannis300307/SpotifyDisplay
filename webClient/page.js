import { getCookie } from './utils.js';
import { update_music_infos } from './requester.js';

function draw() {
	var c = document.getElementById("card");
	var ctx = c.getContext("2d");
	
	ctx.clearRect(0, 0, c.width, c.height);

	ctx.beginPath();

	if (window.music_info) {
	    ctx.font = String(window.config.track_title.size*50) + "px Comic sans MS";
	    window.track_title_rendered_metrics = ctx.measureText(window.music_info.item.name);

        ctx.fillText(window.music_info.item.name, window.config.track_title.x, window.config.track_title.y);
        window.album_img.src = window.music_info.item.album.images[0].url;
        ctx.drawImage(window.album_img, window.config.album_img.x, window.config.album_img.y,
            window.music_info.item.album.images[0].width*window.config.album_img.size,
            window.music_info.item.album.images[0].height*window.config.album_img.size);
    }

	ctx.stroke();
}

function mouse_colliding_object() {
    if (window.track_title_rendered_metrics) {
        var text_width = window.track_title_rendered_metrics.width;
    } else {
        var text_width = 0;
    }
    var text_height = window.config.track_title.size*50;
    console.log(window.config.track_title.y < window.mouse_y, window.config.track_title.y < window.mouse_y);

    if (window.config.album_img.x < window.mouse_x &&
            window.config.album_img.x + window.music_info.item.album.images[0].width*window.config.album_img.size > window.mouse_x &&
            window.config.album_img.y < window.mouse_y &&
            window.config.album_img.y + window.music_info.item.album.images[0].height*window.config.album_img.size > window.mouse_y) {
        window.selected_object = "album";
        window.relative_mouse_x = window.mouse_x - window.config.album_img.x;
        window.relative_mouse_y = window.mouse_y - window.config.album_img.y;
    } else if (window.config.track_title.x < window.mouse_x &&
            window.config.track_title.x + text_width > window.mouse_x &&
            window.config.track_title.y-text_height < window.mouse_y &&
            window.config.track_title.y > window.mouse_y) {
        window.selected_object = "track_title";
        window.relative_mouse_x = window.mouse_x - window.config.track_title.x;
        window.relative_mouse_y = window.mouse_y - window.config.track_title.y;
    } else {
        window.selected_object = "";
    }
    console.log(window.selected_object);
}

function init() {
    load_config();
    window.album_img = new Image();

	setupCanvas();
	setInterval(update_music_infos, 2000);
	setInterval(draw, 40);

    window.album_img.src = '';

    document.getElementById("card").addEventListener("mousedown", function() {
        mouse_colliding_object();
        window.mouse_down = true;
    });

    document.getElementById("card").addEventListener("mouseup", function() {
        window.mouse_down = false;
        window.selected_object = "";
        window.save_config()
    })

	
	document.addEventListener("mousemove", function(event) {
        var c = document.getElementById("card");

        var pos = c.getBoundingClientRect();
        window.mouse_x = event.clientX - pos.x;
        window.mouse_y = event.clientY - pos.y;
        if (window.mouse_down) {
            if (window.selected_object == "album") {
                window.config.album_img.x = window.mouse_x - window.relative_mouse_x;
                window.config.album_img.y = window.mouse_y - window.relative_mouse_y;
            } else if (window.selected_object == "track_title") {
                window.config.track_title.x = window.mouse_x - window.relative_mouse_x;
                window.config.track_title.y = window.mouse_y - window.relative_mouse_y;
            }
		}
	});
}

window.init = init;

function set_default_config() {
    window.config = {
        album_img : {
            x : 0,
            y : 100,
            size : 1.0
        },
        track_title : {
            x : 0,
            y : 100,
            size : 1.0
        },
    }
}


function load_config() {
    var config_cookie = getCookie("config");
    console.log(config_cookie);
    if (config_cookie) {
        window.config = JSON.parse(config_cookie);
    } else {
        set_default_config();
        save_config();
    }
}

function save_config() {
    var config_cookie = encodeURIComponent(JSON.stringify(config));
    var expiration_date = new Date();
    expiration_date.setFullYear(expiration_date.getFullYear() + 1);
    var cookie_string = "config=" + config_cookie + "; path=/; expires=" + expiration_date.toUTCString();
    document.cookie = cookie_string;
}

window.save_config = save_config
window.load_config = load_config


function setupCanvas() {
    var canvs = document.getElementById("card");
    canvs.width = window.innerWidth;
    canvs.height = window.innerHeight;
}
