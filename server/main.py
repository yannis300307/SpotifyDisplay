import base64
import json
import urllib.parse
from http.server import BaseHTTPRequestHandler, HTTPServer
import time
from urllib import request


hostName = "192.168.1.20"
serverPort = 8888

client_id = "ca1baed0e6a34e9bab089c7555cb8fe0"
client_secret = "c8a4a25eaf5b468b88f93e372b63cb86"

with open("../webClient/index.html", "r") as f:
    webClient_html = f.read()
    f.close()

with open("../webClient/style.css", "r") as f:
    webClient_style = f.read()
    f.close()

with open("../webClient/page.js", "r") as f:
    webClient_page_js = f.read()
    f.close()

with open("../webClient/requester.js", "r") as f:
    webClient_requester_js = f.read()
    f.close()

with open("../webClient/auth_redirect.html", "r") as f:
    webClient_redirect_html = f.read()
    f.close()

def request_access_token(user_auth):
    url = "https://accounts.spotify.com/api/token?"

    token_req = request.Request(url, method="POST")
    data = urllib.parse.urlencode({"grant_type": "authorization_code",
                                   "code": user_auth,
                                   "redirect_uri": "http://192.168.1.20:8888/callback"}).encode()
    token_req.add_header("Content-Type", "application/x-www-form-urlencoded")
    token_req.add_header("Authorization", "Basic " + base64.b64encode((client_id + ":" + client_secret)
                                                                      .encode("ascii")).decode("ascii"))
    resp = request.urlopen(token_req, data).read().decode()
    return json.loads(resp)

def request_refreshed_token(refresh_token):
    refresh_req = request.Request("https://accounts.spotify.com/api/token", method="POST")
    data = urllib.parse.urlencode({"grant_type": "refresh_token",
                                   "refresh_token": refresh_token}).encode()
    refresh_req.add_header("Content-Type", "application/x-www-form-urlencoded")
    refresh_req.add_header("Authorization", "Basic " + base64.b64encode((client_id + ":" + client_secret)
                                                                        .encode("ascii")).decode("ascii"))
    return json.loads(request.urlopen(refresh_req, data).read().decode())


class Server(BaseHTTPRequestHandler):
    def do_GET(self):
        url = self.path.split("/")
        if url[1].split("?")[0] == "callback":
            if url[1][8:].startswith("?code="):
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                user_auth = url[1][14:]

                tokens = request_access_token(user_auth)

                self.wfile.write(bytes(webClient_redirect_html
                                       .replace("%%ACCESS_TOKEN%%", tokens["access_token"])
                                       .replace("%%REFRESH_TOKEN%%", tokens["refresh_token"])
                                       .replace("%%EXPIRES%%", str(tokens["expires_in"])),
                                       "utf-8"))

            elif url[1][8:].startswith("?refresh_token="):
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                refresh_token = url[1][23:]

                tokens = request_refreshed_token(refresh_token)

                self.wfile.write(bytes(webClient_redirect_html
                                       .replace("%%ACCESS_TOKEN%%", tokens["access_token"])
                                       .replace("%%REFRESH_TOKEN%%", tokens["refresh_token"])
                                       .replace("%%EXPIRES%%", str(tokens["expires_in"])),
                                       "utf-8"))

        elif url[1] == "main":
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(bytes(webClient_html, "utf-8"))
        elif url[1] == "style.css":
            self.send_response(200)
            self.send_header("Content-type", "text/css")
            self.end_headers()
            self.wfile.write(bytes(webClient_style, "utf-8"))
        elif url[1] == "page.js":
            self.send_response(200)
            self.send_header("Content-type", "text/css")
            self.end_headers()
            self.wfile.write(bytes(webClient_page_js, "utf-8"))
        elif url[1] == "requester.js":
            self.send_response(200)
            self.send_header("Content-type", "text/javascript")
            self.end_headers()
            self.wfile.write(bytes(webClient_requester_js, "utf-8"))
        elif url[1] == "auth_redirect.html":
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(bytes(webClient_redirect_html, "utf-8"))
        else:
            self.send_response(404)
            self.end_headers()




if __name__ == "__main__":
    webServer = HTTPServer((hostName, serverPort), Server)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")