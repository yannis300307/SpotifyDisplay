function authenticate() {
    var client_id = 'ca1baed0e6a34e9bab089c7555cb8fe0';
	var redirect_uri = 'http://192.168.1.20:8888/callback';

	var scope = 'user-read-private user-read-email';

	let options = new URLSearchParams(({
      "response_type": 'code',
      "client_id": client_id,
      "scope": scope,
      "redirect_uri": redirect_uri,
    }));

	document.location.href = 'https://accounts.spotify.com/authorize?' + options.toString();
}

function check_cookies_expired() {
    expires = getCookie("expired");
    if ((new Date()).getTime() > parseInt(expires)) {
        refresh_token();
    }
}

function refresh_token() {
    refresh_token = getCookie("refresh_token");
    if (refresh_token) {
        document.location.href = "http://192.168.1.20:8888/callback?refresh_token=" + refresh_token
    }
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}