function authenticate() {
	var client_id = 'CLIENT_ID';
	var redirect_uri = 'http://localhost:8888/callback';
	
	var scope = 'user-read-private user-read-email';

	document.location.href = 'https://accounts.spotify.com/authorize?' +
    JSON.encodeURI({
      "response_type": 'code',
      "client_id": client_id,
      "scope": scope,
      "redirect_uri": redirect_uri,
    });
}