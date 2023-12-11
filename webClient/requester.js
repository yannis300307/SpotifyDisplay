import { getCookie } from './utils.js';

function authenticate() {
    var client_id = 'ca1baed0e6a34e9bab089c7555cb8fe0';
	var redirect_uri = '%%WEB_SERVER_ADDRESS%%/callback';

	var scope = 'user-read-private user-read-currently-playing user-read-playback-state';

	let options = new URLSearchParams(({
      "response_type": 'code',
      "client_id": client_id,
      "scope": scope,
      "redirect_uri": redirect_uri,
    }));

	document.location.href = 'https://accounts.spotify.com/authorize?' + options.toString();
}

window.authenticate = authenticate;

function check_cookies_expired() {
    var expires = getCookie("expires");
    if ((new Date()).getTime() > parseInt(expires)) {
        //refresh_token();
    }
}

function refresh_token() {
    refresh_token = getCookie("refresh_token");
    if (refresh_token) {
        document.location.href = "%%WEB_SERVER_ADDRESS%%/callback?refresh_token=" + refresh_token
    }
}

export function update_music_infos() {
    check_cookies_expired();
    var access_token = getCookie("access_token");
    if (access_token) {
        var data = fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: {
                "Authorization": "Bearer " + access_token
            },
            method: "GET",
        });
        data.then(response => response.json()).then(data => {
            window.music_info = data;
        });
    }
}

window.update_music_infos = update_music_infos;
