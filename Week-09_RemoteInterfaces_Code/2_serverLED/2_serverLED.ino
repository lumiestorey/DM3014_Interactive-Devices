/*
  DM3014 Interactive Devices, Ashley Hi 2026
  Week 9 - Remote Interfaces
  ESP32-C3 Server LED Control
  Turn on/off built-in LED over web server.
  No additional components.
*/

// ====== Reference Libraries ======
#include <WiFi.h>

// ====== Network Credentials ======
const char* ssid     = "ESP32-Access-Emi"; // *** edit AP name here
const char* password = "jessie331";         // *** edit password here

// ====== Network Settings ======
WiFiServer server(80);
String header;           // variable stores HTTP request
String LED_state = "ON"; // variable stores current LED state (on/off)

// ====== Assign LED Pin ======
#define OUTPUT_LED 2

void setup() {
  // ====== Setup Serial Monitor ======
  Serial.begin(115200);

  // ====== Setup LED ======
  pinMode(OUTPUT_LED, OUTPUT); 
  digitalWrite(OUTPUT_LED, LOW); // turn LED on

  // ====== Setup ESP as Access Point ======
  Serial.print("Setting AP (Access Point)…");
  WiFi.softAP(ssid, password);
  IPAddress IP = WiFi.softAPIP();
  Serial.print("IP Address: ");
  Serial.println(IP);
  server.begin();
}

void loop(){
  WiFiClient client = server.available(); // listen for incoming clients
  if (client) {                           // if a new client connects
    Serial.println("New Client");   
    String currentLine = "";
    unsigned long startTime = millis();   // note when client connected (for timeout)
    while (client.connected() && millis() - startTime < 2000) { // set a 2s timeout
      if (client.available()) {           // if there's bytes to read from the client
        char c = client.read();           // read a byte
        Serial.write(c);
        header += c;
        if (c == '\n') {
          if (currentLine.length() == 0) {
            // ====== Setup Webpage ======
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();
            
            // ====== Turn LED On/Off ======
            if (header.indexOf("GET /8/on") >= 0) {
              Serial.println("LED on");
              LED_state = "ON";
              digitalWrite(OUTPUT_LED, LOW);
            } else if (header.indexOf("GET /8/off") >= 0) {
              Serial.println("LED off");
              LED_state = "OFF";
              digitalWrite(OUTPUT_LED, HIGH);
            } 
            
            // ====== Display HTML Webpage ======
            client.println("<!DOCTYPE html><html>");
            client.println("<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
            client.println("<link rel=\"icon\" href=\"data:,\">");
            
            // ====== CSS for On/Off Buttons ====== 
            // *** edit background-color, font-size attributes, etc to fit your preferences here
            client.println("<style>html { font-family: Helvetica; display: inline-block; margin: 0px auto; text-align: center;}");
            client.println(".button { background-color: #4CAF50; border: none; color: white; padding: 16px 40px;");
            client.println("text-decoration: none; font-size: 30px; margin: 2px; cursor: pointer;}");
            client.println(".button2 {background-color: #555555;}</style></head>");
            
            // ====== Webpage Title ======
            // *** edit text here
            client.println("<body><h1>ESP32 Web Server</h1>");
            
            // ====== Display Current State of Button ======
            client.println("<p>LED State - " + LED_state + "</p>");
            if (LED_state=="OFF") {
              client.println("<p><a href=\"/8/on\"><button class=\"button\">ON</button></a></p>");
            } else {
              client.println("<p><a href=\"/8/off\"><button class=\"button button2\">OFF</button></a></p>");
            } 

            client.println("</body></html>"); // close the page
            client.println(); // HTTP response ends with another blank line
            break;            // break out of the while loop
          } else {
            currentLine = "";
          }
        } else if (c != '\r') {
          currentLine += c;
        }
      }
    }
    header = "";   // clear the header variable
    client.stop(); // close the connection
    Serial.println("Client disconnected.");
    Serial.println("");
  }
}